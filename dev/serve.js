/**
 * The local site, for development only. Vercel is not installed and does not
 * need to be: this serves the static files exactly as Vercel does and runs
 * api/exec-applications.js for /api/exec-applications, so the exec applications
 * page can be driven in a real browser at a real URL.
 *
 *   node dev/serve.js               with a stand-in for Google, so the whole
 *                                   path works offline and nothing real is sent
 *   WEC_APPLY_GOOGLE_FORM_URL=... node dev/serve.js
 *                                   against the club's real Google Form
 *
 * Then open http://127.0.0.1:8787/exec-applications/
 *
 * Bound to 127.0.0.1 on purpose. A dev server on 0.0.0.0 answers everyone on
 * the cafe wifi.
 */
"use strict";

var http = require("http");
var fs = require("fs");
var path = require("path");
var fake = require("./fake-google.js");

var ROOT = path.join(__dirname, "..");
var PORT = Number(process.env.PORT || 8787);
var FAKE_PORT = Number(process.env.FAKE_PORT || 8788);

// The two exec applications paths, for this server. On Vercel they are the
// folder name and the api file name; see "Choosing the final URL" in
// docs/APPLICATIONS-FORM.md.
var PAGE_PATH = "/exec-applications/";
var API_PATH = "/api/exec-applications";
var API_FILE = "../api/exec-applications.js";

var TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon"
};

function notFound(res, what) {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain");
  res.end("404 " + what);
}

function serveStatic(req, res, pathname) {
  var rel;
  // A malformed escape like %E0%A4%A is a bad request, not a crash.
  try { rel = decodeURIComponent(pathname.replace(/^\/+/, "")); }
  catch (e) { res.statusCode = 400; return res.end("bad path"); }
  if (!rel || rel.endsWith("/")) rel += "index.html";
  var file = path.join(ROOT, rel);
  // No climbing out of the repo. ROOT + separator, so a sibling folder whose
  // name merely starts with the repo's name does not pass.
  if (!file.startsWith(ROOT + path.sep)) { res.statusCode = 403; return res.end("no"); }
  fs.stat(file, function (err, stat) {
    if (!err && stat.isDirectory()) file = path.join(file, "index.html");
    fs.readFile(file, function (err2, data) {
      if (err2) return notFound(res, rel);
      res.statusCode = 200;
      res.setHeader("Content-Type", TYPES[path.extname(file)] || "application/octet-stream");
      res.setHeader("Cache-Control", "no-store");
      res.end(data);
    });
  });
}

function main() {
  var started = [];
  function run() {
    var handler = require(API_FILE);
    var site = http.createServer(function (req, res) {
      var url = new URL(req.url, "http://" + req.headers.host);
      if (url.pathname === API_PATH) return handler(req, res);
      // Anything else under /api/ is not a function here, same as Vercel.
      if (url.pathname.indexOf("/api/") === 0) return notFound(res, url.pathname);
      serveStatic(req, res, url.pathname);
    });
    site.listen(PORT, "127.0.0.1", function () {
      console.log("site         http://127.0.0.1:" + PORT + PAGE_PATH);
      console.log("setup check  http://127.0.0.1:" + PORT + API_PATH + "?detail=1");
      started.forEach(function (line) { console.log(line); });
    });
  }

  if (process.env.WEC_APPLY_GOOGLE_FORM_URL) return run();

  var google = fake.start({});
  google.log = true;
  // FAKE_MODE=refuse | signin | closed makes the stand-in misbehave on purpose,
  // so the page's own failure handling can be driven in a real browser.
  google.mode = process.env.FAKE_MODE || "ok";
  google.listen(FAKE_PORT, "127.0.0.1", function () {
    var origin = "http://127.0.0.1:" + FAKE_PORT;
    process.env.WEC_APPLY_GOOGLE_FORM_URL = fake.prefilledUrl(origin);
    process.env.WEC_GOOGLE_FORM_TEST_HOST = "127.0.0.1:" + FAKE_PORT;
    started.push("google       stand-in on " + origin + "  (mode: " + google.mode + "; nothing leaves this machine)");
    run();
  });
}

main();
