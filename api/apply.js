/**
 * POST /api/apply : takes an executive application and submits it to the club's
 *                   Google Form, which writes it into the Form's linked Sheet.
 * GET  /api/apply : a setup check. Says in plain words whether the Form is
 *                   connected and what, if anything, will make Google refuse an
 *                   application. The apply page calls it on load to decide
 *                   whether to open at all.
 *
 * WHY THE SERVER SENDS IT, NOT THE BROWSER
 *
 * A browser posting straight to Google gets an opaque response back, so the page
 * could never know whether the application was recorded. It would have to say
 * "you're in" on faith. That exact bug shipped on this site once already: the
 * old join form ran setDone(true) and told people they had applied while
 * nothing was sent anywhere. Sent from here, Google's reply is readable, and the
 * applicant is only told they are in after Google accepted it.
 *
 * NO DATABASE, NO ADMIN, NO LOGIN. The Sheet behind the Form is the only store.
 * Answers are never written to disk here and never written to the log.
 *
 * A Vercel Node function. No dependencies, no build step: global fetch and
 * URLSearchParams only, same as the rest of this repo's no-bundler convention.
 */
"use strict";

var WEC = require("../apply-schema.js");

// Only Google may receive an application. WEC_GOOGLE_FORM_TEST_HOST is server
// only and exists so the whole path can be tested against a local stand-in for
// Google. It is never read in the browser and never sent to one.
function allowedHost(action) {
  var host = new URL(action).host;
  return host === "docs.google.com" ||
    (!!process.env.WEC_GOOGLE_FORM_TEST_HOST && host === process.env.WEC_GOOGLE_FORM_TEST_HOST);
}

function connectedForm() {
  var form = WEC.parseForm(process.env.WEC_APPLY_GOOGLE_FORM_URL);
  if (!form.ok) return { form: null, reason: "WEC_APPLY_GOOGLE_FORM_URL: " + form.reason };
  if (!allowedHost(form.action)) return { form: null, reason: "WEC_APPLY_GOOGLE_FORM_URL is not a docs.google.com link" };
  return { form: form, reason: "" };
}

// ─── Reading the Form the way a visitor sees it ──────────────────────────────
// Google's refusal is a bare 400 with no reason attached. The public Form page
// embeds FB_PUBLIC_LOAD_DATA_, a JSON array holding every question's title,
// type, entry id and options. Its layout is Google's and is not documented, so
// every read below is defensive: if it cannot be read, the check says "could not
// read" rather than inventing a problem.
function readQuestions(html) {
  var match = html.match(/FB_PUBLIC_LOAD_DATA_ = ([\s\S]*?);\s*<\/script>/);
  if (!match) return null;
  try {
    var data = JSON.parse(match[1]);
    var items = (data && data[1] && data[1][1]) || [];
    var questions = [];
    items.forEach(function (item) {
      var title = item && typeof item[1] === "string" ? item[1].trim() : "(untitled)";
      ((item && item[4]) || []).forEach(function (sub) {
        var choices = Array.isArray(sub && sub[1]) ? sub[1].map(function (c) { return String((c && c[0]) || ""); }) : [];
        questions.push({ title: title, entry: "entry." + (sub && sub[0]), choices: choices, required: Boolean(sub && sub[2]) });
      });
    });
    return questions;
  } catch (e) {
    return null;
  }
}

function labelFor(id) {
  for (var i = 0; i < WEC.FIELDS.length; i++) {
    if (WEC.FIELDS[i].id === id) return WEC.FIELDS[i].label || id;
  }
  return id;
}

async function checkForm(form) {
  var response;
  try {
    response = await fetch(form.viewUrl, { redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(10000) });
  } catch (e) {
    return { ok: false, problems: ["Could not reach the Google Form. Check the internet connection, then try again."] };
  }
  if (response.status >= 300 && response.status < 400) {
    return { ok: false, problems: ["The Form asks people to sign in to Google. In the Form's Settings, turn off \"Restrict to users\" and any sign-in requirement."] };
  }
  if (response.status !== 200) {
    return { ok: false, problems: ["Google answered " + response.status + " for the Form. It may be deleted, or the link is wrong."] };
  }
  var html = await response.text();
  if (/no longer accepting responses/i.test(html)) {
    return { ok: false, problems: ["The Form is closed. In the Form's Responses tab, turn on \"Accepting responses\"."] };
  }
  var questions = readQuestions(html);
  if (!questions) return { ok: false, problems: ["Could not read the Form's questions, so nothing could be checked. It may still work."] };

  var problems = [];
  var byEntry = {};
  questions.forEach(function (q) { byEntry[q.entry] = q; });

  Object.keys(form.entries).forEach(function (id) {
    var q = byEntry[form.entries[id]];
    if (!q) {
      problems.push("The \"" + labelFor(id) + "\" question was deleted or replaced in the Form. Make a new pre-filled link and update the setting.");
      return;
    }
    // A multiple-choice question only accepts its own options. The first real
    // test of the other WEC form failed exactly here: the year question still
    // had Google's default "Option 1" to "Option 4", so "Year 1" was not an
    // allowed answer and Google answered 400 with no explanation.
    var wanted = id === "year" ? WEC.YEARS : id === "role" ? WEC.ROLE_FIELD.choices : null;
    if (wanted && q.choices.length) {
      var missing = wanted.filter(function (c) { return q.choices.indexOf(c) < 0; });
      var extra = q.choices.filter(function (c) { return c && wanted.indexOf(c) < 0; });
      if (missing.length) {
        problems.push("The \"" + q.title + "\" question's options must be exactly: " + wanted.join(", ") + ". "
          + "Missing: " + missing.join(", ") + "." + (extra.length ? " Rename or remove: " + extra.join(", ") + "." : ""));
      }
    }
  });

  var linked = Object.keys(form.entries).map(function (id) { return form.entries[id]; });
  questions.forEach(function (q) {
    if (q.required && linked.indexOf(q.entry) < 0) {
      problems.push("\"" + q.title + "\" is required in the Form but the site does not fill it in. Make it optional, or delete it.");
    }
  });
  WEC.REQUIRED.forEach(function (id) {
    if (!form.entries[id]) problems.push("The site has no question to put \"" + labelFor(id) + "\" in.");
  });
  return { ok: problems.length === 0, problems: problems };
}

// ─── Plumbing ────────────────────────────────────────────────────────────────
function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === "string") { try { return JSON.parse(req.body); } catch (e) { return null; } }
    return req.body;
  }
  var chunks = [];
  var size = 0;
  for await (var chunk of req) {
    size += chunk.length;
    if (size > 200000) return null;
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch (e) { return null; }
}

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    var setup = connectedForm();
    if (!setup.form) return send(res, 200, { connected: false, problems: [setup.reason] });
    var check = await checkForm(setup.form);
    return send(res, 200, { connected: true, ready: check.ok, problems: check.problems });
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return send(res, 405, { error: "method_not_allowed" });
  }

  var connected = connectedForm();
  if (!connected.form) {
    console.error("[apply] Google Form not connected:", connected.reason);
    return send(res, 503, { error: "not_connected" });
  }

  var body = await readJson(req);
  if (!body || typeof body !== "object") return send(res, 400, { error: "bad_request" });

  // A hidden field no person ever sees. Bots fill every box in a form, so a
  // filled one means a bot: say ok and send nothing at all.
  if (body.website) return send(res, 200, { ok: true });

  var answers = WEC.cleanSubmission(body);
  if (!answers) return send(res, 400, { error: "bad_request" });
  var errors = WEC.checkEverything(answers);
  if (Object.keys(errors).length) return send(res, 400, { error: "invalid", errors: errors });

  var toSend = WEC.answersToSend(answers);
  var params = new URLSearchParams();
  Object.keys(toSend).forEach(function (id) {
    var entry = connected.form.entries[id];
    if (entry && toSend[id]) params.append(entry, toSend[id]);
  });
  params.append("pageHistory", "0");

  try {
    // redirect "manual": a Form that requires sign-in answers with a redirect to
    // Google's login page. Followed, that redirect looks like a success and the
    // applicant is told they are in while nothing was recorded.
    var response = await fetch(connected.form.action, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(10000)
    });
    if (response.status !== 200) {
      var why = await checkForm(connected.form).catch(function () { return { ok: false, problems: ["could not check the Form"] }; });
      // The status and the likely cause, never the applicant's answers.
      console.error("[apply] Google Form refused an application (status " + response.status + ").",
        why.problems.length ? "Likely why: " + why.problems.join(" | ") : "The Form itself looks fine.",
        "Full check: open /api/apply");
      return send(res, 502, { error: "refused" });
    }
    return send(res, 200, { ok: true });
  } catch (error) {
    console.error("[apply] Google Form unreachable:", error && error.name);
    return send(res, 502, { error: "unreachable" });
  }
};
