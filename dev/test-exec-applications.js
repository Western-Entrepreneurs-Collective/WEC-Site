/**
 * End to end tests for the exec applications path: the real
 * api/exec-applications.js, the real schema,
 * and a stand-in for Google (dev/fake-google.js) so the whole thing can be
 * proved without a Google account and without a row landing in a real Sheet.
 *
 *   node dev/test-exec-applications.js
 *
 * What is actually proved here, one test each:
 *   1  a full valid application reaches Google with every answer in the right
 *      entry, the role by name, and each role answer carrying its question
 *   2  only the chosen role's answers are sent, for two different roles
 *   3  Google refusing (a bare 400, the way it really refuses) is reported as a
 *      failure and nothing is recorded
 *   4  a sign-in redirect counts as a failure, NOT as a success
 *   5  the honeypot answers ok and sends nothing at all
 *   6  junk gets 400
 *   7  a broken application gets 400 with a plain sentence per field
 *   8  with no setting, nothing is accepted and the page is told applications
 *      are not open
 *   9  the setup check reads the Form and says in plain words what is wrong
 *  10  every required field, emptied on its own, is refused server side
 *  11  every email, phone, link and year rule is checked server side
 *  12  every paragraph is required and its word limit holds both ways
 *  13  one role's answers never carry into another role's submission
 *  14  the page source opens only on connected AND ready
 *  15  the public GET answers only { connected, ready }, and is cached
 *  16  the detailed check needs the key, and is refused in production without one
 *  17  the sixth POST from one address in ten minutes gets 429
 *  18  the honeypot logs one line with no answers, and sends nothing
 *  19  an over-long answer is refused with 400, never truncated
 *  20  an http:// Google Form link is refused
 *  21  the test host is ignored in production
 */
"use strict";

var http = require("http");
var assert = require("assert");
var fake = require("./fake-google.js");
var fs = require("fs");
var path = require("path");
var WEC = require("../exec-applications-schema.js");

var handler = require("../api/exec-applications.js");

var passed = 0, failed = 0;
async function test(name, fn) {
  // Every test starts with no cached Form check and no rate-limit counts.
  handler._reset();
  try { await fn(); passed++; console.log("  pass  " + name); }
  catch (e) { failed++; console.log("  FAIL  " + name + "\n        " + (e && e.message)); }
}

function words(n) { return new Array(n).fill("word").join(" "); }

function application(roleKey) {
  var role = WEC.roleByKey(roleKey);
  var v = {
    name: "Amara Osei", westernEmail: "aosei@uwo.ca", personalEmail: "amara@gmail.com",
    phone: "519 555 0134", year: "3rd Year", program: "Ivey HBA",
    linkedin: "https://linkedin.com/in/amaraosei", portfolio: "https://amara.build",
    resume: "https://drive.google.com/file/d/abc/view",
    intro: "I build things. " + words(20),
    g1: "My pitch. " + words(30), g2: "What I am proud of. " + words(30),
    roleKey: roleKey
  };
  role.qs.forEach(function (q, i) { v[q.id] = "Answer " + (i + 1) + ". " + words(15); });
  if (role.link) v[role.link.id] = "https://youtube.com/@amara";
  return v;
}

async function main() {
  var google = fake.start({});
  await new Promise(function (r) { google.listen(0, "127.0.0.1", r); });
  var gPort = google.address().port;
  var gOrigin = "http://127.0.0.1:" + gPort;

  var site = http.createServer(handler);
  await new Promise(function (r) { site.listen(0, "127.0.0.1", r); });
  var base = "http://127.0.0.1:" + site.address().port;

  var PREFILLED = fake.prefilledUrl(gOrigin);

  function connect(url) {
    process.env.WEC_APPLY_GOOGLE_FORM_URL = url === undefined ? PREFILLED : url;
    if (url === "") delete process.env.WEC_APPLY_GOOGLE_FORM_URL;
    process.env.WEC_GOOGLE_FORM_TEST_HOST = "127.0.0.1:" + gPort;
  }

  // Each post comes from its own address unless one is given, so the tests that
  // post dozens of applications are not stopped by the rate limit. Test 17
  // gives one address on purpose.
  var nextIp = 1;
  function post(body, ip) {
    var from = ip || "10.0." + Math.floor(nextIp / 250) + "." + (nextIp++ % 250 + 1);
    return fetch(base, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Forwarded-For": from + ", 203.0.113.9" },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json().then(function (d) { return { status: r.status, body: d }; }); });
  }
  function get(query) {
    return fetch(base + "/api/exec-applications" + (query || ""))
      .then(function (r) { return r.json().then(function (d) { return { status: r.status, body: d }; }); });
  }
  function detail() { return get("?detail=1"); }

  // Captures console lines while fn runs, so a test can prove what was logged.
  async function capture(fn) {
    var lines = [];
    var saved = { warn: console.warn, error: console.error, log: console.log };
    ["warn", "error", "log"].forEach(function (k) {
      console[k] = function () { lines.push(Array.prototype.join.call(arguments, " ")); };
    });
    try { await fn(); } finally { Object.assign(console, saved); }
    return lines;
  }

  console.log("\nexec applications path, against a stand-in for Google on " + gOrigin + "\n");

  await test("1  a full application reaches Google with every answer in the right entry", async function () {
    connect(); google.mode = "ok"; google.received = [];
    var v = application("vp-content");
    var out = await post(v);
    assert.deepStrictEqual(out.body, { ok: true }, "the server should report ok");
    assert.strictEqual(google.received.length, 1, "Google should have received exactly one application");
    var got = google.received[0];
    var E = fake.ENTRY;
    assert.strictEqual(got[E.name], "Amara Osei");
    assert.strictEqual(got[E.westernEmail], "aosei@uwo.ca");
    assert.strictEqual(got[E.personalEmail], "amara@gmail.com");
    assert.strictEqual(got[E.phone], "519 555 0134");
    assert.strictEqual(got[E.year], "3rd Year");
    assert.strictEqual(got[E.program], "Ivey HBA");
    assert.strictEqual(got[E.linkedin], "https://linkedin.com/in/amaraosei");
    assert.strictEqual(got[E.portfolio], "https://amara.build");
    assert.strictEqual(got[E.resume], "https://drive.google.com/file/d/abc/view");
    assert.strictEqual(got[E.intro], v.intro);
    assert.strictEqual(got[E.g1], v.g1);
    assert.strictEqual(got[E.g2], v.g2);
    // The role goes in by its exact title, which is what the Form's options say.
    assert.strictEqual(got[E.role], "VP Content");
    // Every role answer carries its own question, so the Sheet reads on its own.
    var role = WEC.roleByKey("vp-content");
    role.qs.forEach(function (q) {
      assert.strictEqual(got[E[q.id]], q.label + "\n\n" + v[q.id], q.id + " should carry its question text");
    });
    assert.strictEqual(got.pageHistory, "0");
  });

  await test("2  only the chosen role's questions are sent, for two different roles", async function () {
    connect(); google.mode = "ok"; google.received = [];
    // VP Content has four questions, Outreach has three and no link.
    await post(application("vp-content"));
    await post(application("outreach"));
    var E = fake.ENTRY;
    var vp = google.received[0], outreach = google.received[1];
    assert.ok(vp[E.r4], "VP Content should send a fourth answer");
    assert.strictEqual(outreach[E.r4], undefined, "Outreach has no fourth question, so nothing may be sent for it");
    assert.strictEqual(outreach[E.rlink], undefined, "Outreach has no link question");
    assert.ok(outreach[E.r2].indexOf("100 potential students") > -1, "Outreach's own question text should be there");
    assert.strictEqual(vp[E.r2].indexOf("100 potential students"), -1, "no other role's question may leak in");
    // An answer to a question this role does not have is dropped, not smuggled.
    google.received = [];
    var sneaky = application("outreach");
    sneaky.r4 = "an answer to a question this role never showed";
    await post(sneaky);
    assert.strictEqual(google.received[0][E.r4], undefined, "an answer for a question the role does not have must be dropped");
  });

  await test("3  Google refusing keeps it a failure, and nothing is recorded", async function () {
    connect(); google.mode = "refuse"; google.received = [];
    var out = await post(application("director-logistics"));
    assert.strictEqual(out.status, 502);
    assert.strictEqual(out.body.error, "refused");
    assert.strictEqual(google.received.length, 0);
  });

  await test("4  a sign-in redirect counts as a failure, not a success", async function () {
    connect(); google.mode = "signin"; google.received = [];
    var out = await post(application("director-video"));
    assert.strictEqual(out.status, 502, "a 302 to Google's login page must not be read as success");
    assert.strictEqual(out.body.error, "refused");
    assert.strictEqual(google.received.length, 0);
  });

  await test("5  the honeypot answers ok and sends nothing", async function () {
    connect(); google.mode = "ok"; google.received = [];
    var v = application("vp-community");
    v.wec_hp = "http://spam.example";
    var out = await post(v);
    assert.deepStrictEqual(out.body, { ok: true }, "a bot is told it worked");
    assert.strictEqual(google.received.length, 0, "and nothing at all is sent");
  });

  await test("6  junk gets 400", async function () {
    connect(); google.mode = "ok"; google.received = [];
    var raw = await fetch(base, { method: "POST", headers: { "Content-Type": "application/json" }, body: "not json at all" });
    assert.strictEqual(raw.status, 400);
    assert.strictEqual((await post({ hello: "world" })).status, 400, "an object that is not an application");
    assert.strictEqual((await post({ roleKey: "president-of-mars", name: "x" })).status, 400, "a role that does not exist");
    assert.strictEqual((await post({ roleKey: "outreach", name: 12 })).status, 400, "a field that is not text");
    assert.strictEqual(google.received.length, 0);
  });

  await test("7  a broken application gets 400 and a plain sentence per field", async function () {
    connect(); google.mode = "ok"; google.received = [];
    var v = application("email-newsletter");
    v.westernEmail = "amara@gmail.com";      // not a Western address
    v.resume = "";                            // required
    v.r3 = words(80);                         // the subject line is 50 words
    var out = await post(v);
    assert.strictEqual(out.status, 400);
    assert.strictEqual(out.body.error, "invalid");
    assert.ok(/Western email/.test(out.body.errors.westernEmail), "should say to use a Western address");
    assert.ok(out.body.errors.resume, "should say the resume link is required");
    assert.ok(/limit is 50/.test(out.body.errors.r3), "should say the word limit");
    assert.strictEqual(google.received.length, 0, "nothing goes to Google until it is valid");
  });

  await test("8  with no setting, nothing is accepted and the page is told it is not open", async function () {
    connect(""); google.received = [];
    var out = await post(application("vp-content"));
    assert.strictEqual(out.status, 503);
    assert.strictEqual(out.body.error, "not_connected");
    var setup = await get();
    assert.deepStrictEqual(setup.body, { connected: false, ready: false });
    var why = await detail();
    assert.ok(/not set/.test(why.body.problems[0]));
    assert.strictEqual(google.received.length, 0);
  });

  await test("9  the setup check says in plain words what is wrong with the Form", async function () {
    connect(); google.mode = "ok";
    var good = await detail();
    assert.strictEqual(good.body.connected, true);
    assert.deepStrictEqual(good.body.problems, [], "a correctly built Form has no problems: " + JSON.stringify(good.body.problems));
    assert.strictEqual(good.body.ready, true);

    // The real failure this check was written for: the year question still has
    // Google's default options, so Google refuses "3rd Year" with a bare 400.
    var broken = fake.questions().map(function (q) {
      return q.entry === fake.ENTRY.year ? Object.assign({}, q, { choices: ["Option 1", "Option 2"] }) : q;
    });
    broken.push({ title: "Do you agree to the terms?", entry: "entry.9999999", required: true, choices: null });
    var brokenServer = fake.start({ questions: broken });
    await new Promise(function (r) { brokenServer.listen(0, "127.0.0.1", r); });
    var bPort = brokenServer.address().port;
    process.env.WEC_APPLY_GOOGLE_FORM_URL = fake.prefilledUrl("http://127.0.0.1:" + bPort);
    process.env.WEC_GOOGLE_FORM_TEST_HOST = "127.0.0.1:" + bPort;
    var out = await detail();
    assert.strictEqual(out.body.ready, false);
    assert.ok(out.body.problems.some(function (p) { return /options must be exactly/.test(p) && /1st Year/.test(p); }),
      "should name the year options: " + JSON.stringify(out.body.problems));
    assert.ok(out.body.problems.some(function (p) { return /Do you agree to the terms\?/.test(p) && /required in the Form/.test(p); }),
      "should name the extra required question: " + JSON.stringify(out.body.problems));
    brokenServer.close();

    // And a Form that requires a Google account.
    connect(); google.mode = "signin";
    var signin = await detail();
    assert.ok(signin.body.problems.some(function (p) { return /sign in to Google/.test(p); }));
    google.mode = "ok";
  });

  // ── The server side of the validation. The browser checks the same rules out
  // of the same file, but the browser is never the only guard: every one of
  // these posts goes straight at api/exec-applications.js, with no page involved at all.

  await test("10  every required field, emptied on its own, is refused with its own sentence", async function () {
    connect(); google.mode = "ok"; google.received = [];
    // Each of these is emptied by itself in an otherwise perfect application,
    // so a pass here cannot come from some other field failing.
    var required = ["name", "westernEmail", "personalEmail", "year", "program", "resume", "intro", "g1", "g2"];
    for (var i = 0; i < required.length; i++) {
      var id = required[i];
      var v = application("director-admin");
      v[id] = "";
      var out = await post(v);
      assert.strictEqual(out.status, 400, id + " empty should be refused");
      assert.strictEqual(out.body.error, "invalid", id + " should be an invalid application, not junk");
      assert.ok(out.body.errors[id], "there should be a message for " + id + ": " + JSON.stringify(out.body.errors));
      assert.ok(/[a-z]/.test(out.body.errors[id]) && /\.$/.test(out.body.errors[id].trim()),
        id + "'s message should be a plain sentence: " + out.body.errors[id]);
    }
    // And a missing role choice, which is not one of the fields above.
    var noRole = application("director-admin");
    noRole.roleKey = "";
    assert.strictEqual((await post(noRole)).status, 400, "no position chosen must be refused");
    assert.strictEqual(google.received.length, 0, "nothing reaches Google while anything is missing");
  });

  await test("11  every rule is checked on the server: emails, phone, links, the year list", async function () {
    connect(); google.mode = "ok"; google.received = [];
    var cases = [
      ["westernEmail", "amara@gmail.com", /Western email/],
      ["westernEmail", "amara@uwo.com", /Did you mean @uwo\.ca/],
      ["westernEmail", "amara at uwo.ca", /space in it|needs one @/],
      ["westernEmail", "amara@uwo", /looks incomplete/],
      ["personalEmail", "not-an-email", /needs one @/],
      ["personalEmail", "amara@gmial.com", /Did you mean @gmail\.com/],
      ["phone", "call me maybe", /digits, spaces/],
      ["phone", "5195", /too short/],
      ["phone", "5195550134555550134", /too long/],
      ["phone", "519 555+0134", /\+ belongs at the very start/],
      ["resume", "drive.google.com/file/d/abc", /start the link with https/],
      ["resume", "https://drive", /complete link/],
      ["linkedin", "linkedin.com/in/amara", /start the link with https/],
      ["portfolio", "ftp://amara.build", /start the link with https/],
      ["year", "Fifth Year", /pick one of the options/]
    ];
    for (var i = 0; i < cases.length; i++) {
      var id = cases[i][0], value = cases[i][1], wanted = cases[i][2];
      var v = application("outreach");
      v[id] = value;
      var out = await post(v);
      assert.strictEqual(out.status, 400, id + " = " + JSON.stringify(value) + " should be refused");
      assert.ok(wanted.test(out.body.errors[id] || ""),
        id + " = " + JSON.stringify(value) + " should say " + wanted + ", said: " + JSON.stringify(out.body.errors[id]));
    }
    // The optional fields, left empty, are fine. Optional does not mean
    // unchecked; it means unchecked only when it is empty.
    var fine = application("outreach");
    fine.phone = ""; fine.linkedin = ""; fine.portfolio = "";
    assert.deepStrictEqual((await post(fine)).body, { ok: true }, "empty optional fields are not an error");
    assert.strictEqual(google.received.length, 1, "and that one application does reach Google");
  });

  await test("12  every paragraph answer is required and its word limit is enforced both ways", async function () {
    connect(); google.mode = "ok"; google.received = [];
    // Walked from the schema, so a question added later is covered without
    // anybody remembering to add a test for it.
    var roleKey = "vp-content";
    var role = WEC.roleByKey(roleKey);
    var paragraphs = WEC.ABOUT.filter(function (f) { return f.kind === "long"; })
      .concat(WEC.GENERAL)
      .concat(role.qs.map(function (q) { return { id: q.id, max: q.max }; }));
    assert.ok(paragraphs.length >= 7, "there should be paragraphs from all three stages, got " + paragraphs.length);
    for (var i = 0; i < paragraphs.length; i++) {
      var p = paragraphs[i];
      var empty = application(roleKey);
      empty[p.id] = "   ";
      var out1 = await post(empty);
      assert.strictEqual(out1.status, 400, p.id + " empty should be refused");
      assert.ok(out1.body.errors[p.id], p.id + " empty should have a message");

      var over = application(roleKey);
      over[p.id] = words(p.max + 1);
      var out2 = await post(over);
      assert.strictEqual(out2.status, 400, p.id + " one word over its limit should be refused");
      assert.ok(new RegExp("limit is " + p.max).test(out2.body.errors[p.id] || ""),
        p.id + " should name its own limit of " + p.max + ", said: " + JSON.stringify(out2.body.errors[p.id]));

      // Exactly on the limit is allowed: the limit is a limit, not a fence.
      var edge = application(roleKey);
      edge[p.id] = words(p.max);
      assert.deepStrictEqual((await post(edge)).body, { ok: true }, p.id + " exactly at " + p.max + " words should be accepted");
    }
    assert.strictEqual(google.received.length, paragraphs.length, "only the valid ones reached Google");
  });

  await test("13  one role's answers never carry into another role's submission", async function () {
    connect(); google.mode = "ok"; google.received = [];
    var E = fake.ENTRY;
    // Somebody filled in VP Content, went back, and chose Director of Admin.
    // The page clears the old answers; this proves the server does not send
    // them even if a browser or a script kept them.
    var vp = application("vp-content");
    var swapped = application("director-admin");
    swapped.r4 = vp.r4;                    // Director of Admin has no fourth question
    swapped.rlink = "https://old.example"; // and no link question either
    var out = await post(swapped);
    assert.deepStrictEqual(out.body, { ok: true });
    var got = google.received[0];
    assert.strictEqual(got[E.r4], undefined, "a leftover fourth answer must not be sent");
    assert.strictEqual(got[E.rlink], undefined, "a leftover link must not be sent");
    assert.strictEqual(got[E.role], "Director of Admin");
    assert.ok(got[E.r2].indexOf("15 action items") > -1, "the answers sent are Director of Admin's own questions");

    // And the other direction: keeping the old role's ANSWER TEXT but choosing
    // the new role means the text is submitted under the NEW question, which is
    // exactly why the page clears it. The server can only guarantee the
    // question text matches the role that was chosen, and it does.
    google.received = [];
    var mismatched = application("director-admin");
    mismatched.r2 = "This was written for the VP Content question about creative freedom.";
    await post(mismatched);
    var line = google.received[0][E.r2];
    assert.ok(line.indexOf("15 action items") === 0 || line.indexOf("Imagine an exec meeting") > -1,
      "the question text above the answer is always the chosen role's: " + line.slice(0, 60));

    // A role that does not exist is still refused, even with perfect answers.
    google.received = [];
    var fake2 = application("vp-content");
    fake2.roleKey = "vp-vibes";
    assert.strictEqual((await post(fake2)).status, 400);
    assert.strictEqual(google.received.length, 0);
  });

  // ── The review fixes ─────────────────────────────────────────────────────

  await test("14  the page opens only on connected AND ready; connected but not ready stays closed", async function () {
    // The page is browser code, so this reads its source for the one decision
    // and runs that decision against the three answers the server can give.
    var src = fs.readFileSync(path.join(__dirname, "..", "exec-applications", "exec-applications.js"), "utf8");
    var m = src.match(/setOpen\((Boolean\(d && [^;]*\))\);/);
    assert.ok(m, "the page should decide open from the API answer");
    var decide = new Function("d", "return " + m[1] + ";");
    assert.strictEqual(decide({ connected: true, ready: true }), true);
    assert.strictEqual(decide({ connected: true, ready: false }), false, "connected but not ready must stay closed");
    assert.strictEqual(decide({ connected: false, ready: false }), false);
    assert.strictEqual(decide({ connected: true }), false, "a missing ready is not ready");
    // And the server does say connected-but-not-ready for a Form Google would refuse.
    connect(); google.mode = "closed";
    var out = await get();
    assert.deepStrictEqual(out.body, { connected: true, ready: false });
    google.mode = "ok";
  });

  await test("15  the public GET answers only { connected, ready }, and reuses its check", async function () {
    connect(); google.mode = "ok";
    var before = google.views;
    var out = await get();
    assert.strictEqual(out.status, 200);
    assert.deepStrictEqual(Object.keys(out.body).sort(), ["connected", "ready"], "no problems list, no question titles");
    assert.deepStrictEqual(out.body, { connected: true, ready: true });
    await get(); await get();
    assert.strictEqual(google.views - before, 1, "three page views, one Google fetch: " + (google.views - before));
    // A broken Form shows no detail publicly either.
    handler._reset(); google.mode = "signin";
    var closed = await get();
    assert.deepStrictEqual(closed.body, { connected: true, ready: false });
    google.mode = "ok";
  });

  await test("16  the detailed check needs the key, and production without a key refuses it", async function () {
    connect(); google.mode = "ok";
    var savedEnv = process.env.VERCEL_ENV;
    try {
      process.env.WEC_SETUP_CHECK_KEY = "s3cret-check-key";
      assert.strictEqual((await detail()).status, 403, "no key given");
      assert.strictEqual((await get("?detail=1&key=wrong")).status, 403, "wrong key");
      assert.strictEqual((await get("?detail=1&key=s3cret-check-ke")).status, 403, "a prefix of the key");
      var ok = await get("?detail=1&key=s3cret-check-key");
      assert.strictEqual(ok.status, 200);
      assert.deepStrictEqual(ok.body.problems, [], "the right key gets the problems list");
      delete process.env.WEC_SETUP_CHECK_KEY;
      process.env.VERCEL_ENV = "production";
      var prod = await detail();
      assert.strictEqual(prod.status, 403, "production with no key set: no detail for anybody");
      assert.strictEqual(prod.body.problems, undefined);
      process.env.VERCEL_ENV = "preview";
      assert.strictEqual((await detail()).status, 200, "a preview deployment with no key set may show it");
    } finally {
      delete process.env.WEC_SETUP_CHECK_KEY;
      if (savedEnv === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = savedEnv;
    }
  });

  await test("17  the sixth POST from one address in ten minutes gets 429, and nothing is sent for it", async function () {
    connect(); google.mode = "ok"; google.received = [];
    var ip = "198.51.100.7";
    for (var i = 1; i <= 5; i++) {
      var out = await post(application("outreach"), ip);
      assert.deepStrictEqual(out.body, { ok: true }, "post " + i + " should go through");
    }
    var sixth = await post(application("outreach"), ip);
    assert.strictEqual(sixth.status, 429);
    assert.strictEqual(sixth.body.error, "rate_limited");
    assert.strictEqual(google.received.length, 5, "the sixth never reached Google");
    // Another address is not affected.
    assert.deepStrictEqual((await post(application("outreach"), "198.51.100.8")).body, { ok: true });
    // The page has a plain message for it.
    var src = fs.readFileSync(path.join(__dirname, "..", "exec-applications", "exec-applications.js"), "utf8");
    assert.ok(/rate_limited/.test(src) && /Too many tries/.test(src), "the page should say something plain on 429");
  });

  await test("18  the honeypot logs one line with no answers in it, and sends nothing", async function () {
    connect(); google.mode = "ok"; google.received = [];
    var v = application("vp-community");
    v.wec_hp = "filled by a bot";
    var out;
    var lines = await capture(async function () { out = await post(v); });
    assert.deepStrictEqual(out.body, { ok: true });
    assert.strictEqual(google.received.length, 0);
    assert.strictEqual(lines.length, 1, "exactly one log line: " + JSON.stringify(lines));
    assert.ok(/\[exec-applications\] honeypot/.test(lines[0]), lines[0]);
    ["Amara", "aosei@uwo.ca", "filled by a bot", "I build things"].forEach(function (secret) {
      assert.strictEqual(lines[0].indexOf(secret), -1, "the log line must not carry " + secret);
    });
    // The old name is not the trap any more: a browser autofilling "website"
    // must not get a real applicant dropped.
    var real = application("vp-community");
    real.website = "https://amara.build";
    assert.deepStrictEqual((await post(real)).body, { ok: true });
    assert.strictEqual(google.received.length, 1, "an application carrying a website field still goes through");
  });

  await test("19  an answer over 8,000 characters gets 400 with a sentence, never cut short", async function () {
    connect(); google.mode = "ok"; google.received = [];
    var v = application("vp-content");
    v.program = "x".repeat(WEC.MAX_CHARS + 1);
    var out = await post(v);
    assert.strictEqual(out.status, 400);
    assert.strictEqual(out.body.error, "invalid");
    assert.ok(/8,001 characters/.test(out.body.errors.program) && /8,000/.test(out.body.errors.program), out.body.errors.program);
    // A long answer under its word limit but over the characters: one giant "word".
    var w = application("vp-content");
    w.g1 = "a".repeat(9000);
    var out2 = await post(w);
    assert.strictEqual(out2.status, 400);
    assert.ok(/characters/.test(out2.body.errors.g1));
    // Exactly at the limit is fine.
    var edge = application("vp-content");
    edge.program = "x".repeat(WEC.MAX_CHARS);
    assert.deepStrictEqual((await post(edge)).body, { ok: true });
    assert.strictEqual(google.received[0][fake.ENTRY.program].length, WEC.MAX_CHARS, "sent whole, not truncated");
    assert.strictEqual(google.received.length, 1);
  });

  await test("20  a Google Form link over plain http is refused", async function () {
    var httpsLink = fake.prefilledUrl("https://docs.google.com");
    connect(httpsLink.replace("https://", "http://"));
    // No test host for this one: only the real Google rule applies.
    delete process.env.WEC_GOOGLE_FORM_TEST_HOST;
    google.received = [];
    assert.deepStrictEqual((await get()).body, { connected: false, ready: false });
    assert.ok(/https:\/\/docs\.google\.com/.test((await detail()).body.problems[0]));
    var out = await post(application("outreach"));
    assert.strictEqual(out.status, 503);
    assert.strictEqual(google.received.length, 0);
  });

  await test("21  WEC_GOOGLE_FORM_TEST_HOST is ignored in production", async function () {
    connect(); google.mode = "ok"; google.received = [];
    var savedEnv = process.env.VERCEL_ENV;
    try {
      process.env.VERCEL_ENV = "production";
      var out = await post(application("outreach"));
      assert.strictEqual(out.status, 503, "in production the stand-in host must not be accepted");
      assert.strictEqual(google.received.length, 0, "nothing reached the test host");
      assert.deepStrictEqual((await get()).body, { connected: false, ready: false });
      delete process.env.VERCEL_ENV;
      handler._reset();
      assert.deepStrictEqual((await post(application("outreach"))).body, { ok: true }, "outside production it is used");
    } finally {
      if (savedEnv === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = savedEnv;
    }
  });

  console.log("\n" + passed + " passed, " + failed + " failed\n");
  // Close, then let node exit on its own. process.exit() here trips a libuv
  // assertion on Windows while the sockets are still closing.
  site.close(); google.close();
  process.exitCode = failed ? 1 : 0;
}

main();
