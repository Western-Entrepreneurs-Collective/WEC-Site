/**
 * A stand-in for Google Forms, for testing only. Never deployed, never used by
 * the site: it exists so the whole submit path can be proved end to end without
 * a real Form, a real account, or a real row landing in a real Sheet.
 *
 * It serves the two things the real thing serves:
 *   GET  /forms/d/e/<id>/viewform      the public page, carrying FB_PUBLIC_LOAD_DATA_
 *   POST /forms/d/e/<id>/formResponse  the submit endpoint
 *
 * and it can be told to behave badly on purpose:
 *   mode "ok"       200, and the answers are recorded in server.received
 *   mode "refuse"   400, the way Google refuses an answer it does not like,
 *                   with no reason attached
 *   mode "signin"   302 to a login page, the way a Form that requires a Google
 *                   account answers. Followed, that redirect looks like success.
 *   mode "closed"   the page says it is no longer accepting responses
 */
"use strict";

var http = require("http");

var FORM_ID = "1FAIpQLFAKEFAKEFAKEFAKEFAKEFAKEFAKEFAKEFAKE";

// entry ids, chosen to look like Google's.
var ENTRY = {
  name: "entry.1000001", westernEmail: "entry.1000002", personalEmail: "entry.1000003",
  phone: "entry.1000004", year: "entry.1000005", program: "entry.1000006",
  linkedin: "entry.1000007", portfolio: "entry.1000008", resume: "entry.1000009",
  intro: "entry.1000010", g1: "entry.1000011", g2: "entry.1000012",
  role: "entry.1000013", r1: "entry.1000014", r2: "entry.1000015",
  r3: "entry.1000016", r4: "entry.1000017", rlink: "entry.1000018"
};

// Google's own shape: data[1][1] is the list of questions, each question is
// [ , title, , , [ [entryId, choices, required] ] ].
function loadData(questions) {
  var items = questions.map(function (q) {
    return [null, q.title, null, null, [[Number(q.entry.replace("entry.", "")), q.choices ? q.choices.map(function (c) { return [c]; }) : null, q.required ? 1 : 0]]];
  });
  return JSON.stringify([null, [null, items]]);
}

function start(options) {
  var opts = options || {};
  var questionList = opts.questions || questions();
  var server = http.createServer(function (req, res) {
    var url = new URL(req.url, "http://" + req.headers.host);
    if (req.method === "GET" && url.pathname === "/forms/d/e/" + FORM_ID + "/viewform") {
      server.views++;
      if (server.mode === "signin") {
        res.statusCode = 302;
        res.setHeader("Location", "https://accounts.google.com/signin");
        return res.end();
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.end("<!doctype html><html><body>"
        + (server.mode === "closed" ? "<p>This form is no longer accepting responses.</p>" : "")
        + "<script>var FB_PUBLIC_LOAD_DATA_ = " + loadData(questionList) + ";</script>"
        + "</body></html>");
    }
    if (req.method === "POST" && url.pathname === "/forms/d/e/" + FORM_ID + "/formResponse") {
      var chunks = [];
      req.on("data", function (c) { chunks.push(c); });
      req.on("end", function () {
        if (server.mode === "signin") {
          res.statusCode = 302;
          res.setHeader("Location", "https://accounts.google.com/signin");
          return res.end();
        }
        if (server.mode === "refuse") { res.statusCode = 400; return res.end("bad"); }
        var body = Buffer.concat(chunks).toString("utf8");
        var got = {};
        new URLSearchParams(body).forEach(function (value, key) { got[key] = value; });
        server.received.push(got);
        if (server.log) console.log("[google stand-in] took an application: " + Object.keys(got).join(", "));
        res.statusCode = 200;
        return res.end("ok");
      });
      return;
    }
    res.statusCode = 404;
    res.end("no");
  });
  server.mode = "ok";
  server.received = [];
  server.views = 0;   // how many times the public Form page was fetched
  return server;
}

var WEC = require("../exec-applications-schema.js");

/** The question list a correctly built Form would have, straight off the schema. */
function questions() {
  var list = [];
  WEC.ABOUT.concat(WEC.GENERAL).forEach(function (f) {
    list.push({
      title: f.label, entry: ENTRY[f.id], required: f.req,
      choices: f.kind === "select" ? f.choices.slice() : null
    });
  });
  list.push({ title: WEC.ROLE_FIELD.label, entry: ENTRY.role, required: true, choices: WEC.ROLE_FIELD.choices.slice() });
  WEC.ROLE_SLOTS.forEach(function (slot, i) {
    list.push({ title: "Role question " + (i + 1), entry: ENTRY[slot.id], required: false, choices: null });
  });
  return list;
}

/** The pre-filled link the club would paste into the setting, pointed at this stand-in. */
function prefilledUrl(origin) {
  var url = new URL(origin + "/forms/d/e/" + FORM_ID + "/viewform");
  url.searchParams.set("usp", "pp_url");
  WEC.FIELDS.forEach(function (f) {
    if (f.ph) url.searchParams.set(ENTRY[f.id], f.ph);
  });
  url.searchParams.set(ENTRY.year, WEC.YEARS[0]);
  url.searchParams.set(ENTRY.role, WEC.ROLE_FIELD.choices[0]);
  return url.toString();
}

module.exports = { start: start, FORM_ID: FORM_ID, ENTRY: ENTRY, questions: questions, prefilledUrl: prefilledUrl };
