/**
 * POST /api/exec-applications : takes an executive application and submits it
 *     to the club's Google Form, which writes it into the Form's linked Sheet.
 * GET  /api/exec-applications : answers { connected, ready } and nothing else.
 *     The exec applications page calls it on load and opens only when both are
 *     true. The answer is cached for five minutes per function instance, so a
 *     page view is not a Google fetch.
 * GET  /api/exec-applications?detail=1&key=<WEC_SETUP_CHECK_KEY>
 *     the setup check for whoever runs the Form: the same answer plus a
 *     plain-words list of problems, read fresh from Google. It needs the key.
 *     With WEC_SETUP_CHECK_KEY unset it works without one everywhere EXCEPT
 *     production (VERCEL_ENV=production), where it is then refused.
 *
 * THE PATH IS A PLACEHOLDER. On Vercel this file's name IS the URL. To move it,
 * see "Choosing the final URL" in docs/APPLICATIONS-FORM.md.
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

var crypto = require("crypto");
var WEC = require("../exec-applications-schema.js");

var LOG = "[exec-applications]";
var CHECK_TTL_MS = 5 * 60 * 1000;        // the public Form check is reused for 5 minutes
var RATE_LIMIT = 5;                      // submissions allowed per IP ...
var RATE_WINDOW_MS = 10 * 60 * 1000;     // ... per 10 minutes
var HONEYPOT = "wec_hp";                 // the hidden field's name, shared with the page

function isProduction() { return process.env.VERCEL_ENV === "production"; }

// Only Google, over https, may receive an application. WEC_GOOGLE_FORM_TEST_HOST
// is server only and exists so the whole path can be tested against a local
// stand-in for Google (plain http, on this machine). It is IGNORED in
// production, so a stray value there can never send applications anywhere else.
function allowedHost(action) {
  var url = new URL(action);
  if (url.protocol === "https:" && url.host === "docs.google.com") return true;
  var testHost = process.env.WEC_GOOGLE_FORM_TEST_HOST;
  return !isProduction() && !!testHost && url.host === testHost;
}

function connectedForm() {
  var form = WEC.parseForm(process.env.WEC_APPLY_GOOGLE_FORM_URL);
  if (!form.ok) return { form: null, reason: "WEC_APPLY_GOOGLE_FORM_URL: " + form.reason };
  if (!allowedHost(form.action)) return { form: null, reason: "WEC_APPLY_GOOGLE_FORM_URL is not an https://docs.google.com link" };
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

// ─── The cached public check ─────────────────────────────────────────────────
// Module scope, so it lives as long as the function instance does. Keyed on the
// setting, so changing the Form link is never answered from the old Form.
var cache = null;   // { key, at, result }

async function cachedCheck(form) {
  var key = process.env.WEC_APPLY_GOOGLE_FORM_URL;
  if (cache && cache.key === key && Date.now() - cache.at < CHECK_TTL_MS) return cache.result;
  var result = await checkForm(form);
  cache = { key: key, at: Date.now(), result: result };
  return result;
}

// ─── Who may see the detailed check ──────────────────────────────────────────
function sameSecret(a, b) {
  var x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function detailAllowed(url) {
  var secret = process.env.WEC_SETUP_CHECK_KEY;
  if (secret) return sameSecret(url.searchParams.get("key") || "", secret);
  return !isProduction();
}

// ─── The rate limit ──────────────────────────────────────────────────────────
// In memory, per function instance: a cold start or a second instance starts
// from zero. It stops one person or one script hammering the Form, not a
// determined attack; the docs recommend a Vercel Firewall rule on top.
var hits = new Map();   // ip -> [timestamps]

function clientIp(req) {
  var fwd = req.headers["x-forwarded-for"];
  var first = String(Array.isArray(fwd) ? fwd[0] : fwd || "").split(",")[0].trim();
  return first || (req.socket && req.socket.remoteAddress) || "unknown";
}

function overLimit(ip) {
  var now = Date.now();
  var recent = (hits.get(ip) || []).filter(function (t) { return now - t < RATE_WINDOW_MS; });
  if (recent.length >= RATE_LIMIT) { hits.set(ip, recent); return true; }
  recent.push(now);
  hits.set(ip, recent);
  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) {
    hits.forEach(function (list, k) {
      if (!list.length || now - list[list.length - 1] >= RATE_WINDOW_MS) hits.delete(k);
    });
  }
  return false;
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

async function handler(req, res) {
  if (req.method === "GET") {
    var url = new URL(req.url || "/", "http://localhost");
    var setup = connectedForm();
    if (url.searchParams.get("detail") === "1") {
      if (!detailAllowed(url)) return send(res, 403, { error: "forbidden", message: "The detailed setup check needs the right key." });
      if (!setup.form) return send(res, 200, { connected: false, ready: false, problems: [setup.reason] });
      // Fresh, not cached: this is what somebody runs while fixing the Form.
      var fresh = await checkForm(setup.form);
      cache = { key: process.env.WEC_APPLY_GOOGLE_FORM_URL, at: Date.now(), result: fresh };
      return send(res, 200, { connected: true, ready: fresh.ok, problems: fresh.problems });
    }
    // The public answer: two booleans. No question titles, no problems list.
    if (!setup.form) return send(res, 200, { connected: false, ready: false });
    var check = await cachedCheck(setup.form);
    return send(res, 200, { connected: true, ready: check.ok });
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return send(res, 405, { error: "method_not_allowed" });
  }

  if (overLimit(clientIp(req))) {
    res.setHeader("Retry-After", String(Math.ceil(RATE_WINDOW_MS / 1000)));
    return send(res, 429, { error: "rate_limited" });
  }

  var connected = connectedForm();
  if (!connected.form) {
    console.error(LOG + " Google Form not connected:", connected.reason);
    return send(res, 503, { error: "not_connected" });
  }

  var body = await readJson(req);
  if (!body || typeof body !== "object") return send(res, 400, { error: "bad_request" });

  // A hidden field no person ever sees. Bots fill every box in a form, so a
  // filled one means a bot: say ok and send nothing at all. One line in the log
  // so a real person caught by it can be spotted, and never their answers.
  if (body[HONEYPOT]) {
    console.warn(LOG + " honeypot filled in; told ok, nothing sent to Google.");
    return send(res, 200, { ok: true });
  }

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
      // The status only, never the applicant's answers. No second fetch to find
      // out why: that could double the wait past the timeout. The cached check
      // is dropped so the next page load reads the Form fresh, and the detailed
      // check says in plain words what is wrong.
      cache = null;
      console.error(LOG + " Google Form refused an application (status " + response.status + ").",
        "Run the detailed setup check: /api/exec-applications?detail=1&key=...");
      return send(res, 502, { error: "refused" });
    }
    return send(res, 200, { ok: true });
  } catch (error) {
    console.error(LOG + " Google Form unreachable:", error && error.name);
    return send(res, 502, { error: "unreachable" });
  }
}

// For the tests only: forget the cached check and every rate-limit count.
handler._reset = function () { cache = null; hits = new Map(); };

module.exports = handler;
