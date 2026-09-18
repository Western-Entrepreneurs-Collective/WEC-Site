/**
 * WEC Executive Applications 2026-27, the applicant's side.
 *
 * Plain React through createElement, straight off vendor/react, no JSX, no
 * build step, no bundler, no dependencies: the same rule as the rest of this
 * repo. The one difference from app.js is that app.js was written in JSX and
 * compiled, so it is full of React.createElement and /* @__PURE__ *\/ markers.
 * This file was written by hand, so it aliases createElement to h. Same API,
 * same output, readable diff.
 *
 * WHAT THIS PAGE IS NOT
 *
 * No admin, no dashboard, no database, no login. Nothing is kept in
 * localStorage. Answers live in React state for as long as the tab is open and
 * go to exactly one place: the club's Google Form, through /api/apply, which
 * writes them into the Form's Sheet. The Sheet is the only store.
 *
 * THE ROUTING IS REAL ROUTING
 *
 * Step 5 renders the chosen role's questions and nothing else. There is no
 * hidden markup for the other eleven roles and no CSS doing the hiding: look at
 * roleQuestions() below, it reads one role's list.
 */
(function () {
  "use strict";

  var W = window.WEC_APPLY;
  var h = React.createElement;

  // ─── Bits lifted from the main site so this page looks native ──────────────
  function Sl(props) {
    var p = props || {};
    return h("span", { className: "sl", style: Object.assign({ width: p.w || 15, height: p.h || 3 }, p.style || {}) });
  }

  function Mark(props) {
    var L = window.WEC_LOGOS && window.WEC_LOGOS[props.variant || "horizontal"];
    if (!L) {
      return h("img", {
        src: "../assets/wec-lockup-horizontal" + (props.tone === "light" ? "-white" : "") + ".svg",
        alt: "Western Entrepreneurs Collective", style: { height: props.height, display: "block" }
      });
    }
    var vb = L.viewBox.split(" ").map(Number);
    return h("svg", {
      viewBox: L.viewBox, role: "img", "aria-label": "Western Entrepreneurs Collective",
      style: { height: props.height, width: props.height * vb[2] / vb[3], display: "block" }
    },
      h("path", { d: L.ink, fillRule: "evenodd", fill: props.tone === "light" ? "var(--bg)" : "var(--p)" }),
      L.slash ? h("path", { d: L.slash, fillRule: "evenodd", fill: props.tone === "light" ? "var(--g-lt)" : "var(--g)" }) : null);
  }

  // ─── The stages ────────────────────────────────────────────────────────────
  // THERE IS NO LANDING PAGE. The page opens on stage 1, About you. The club
  // will design the applicant-facing landing page itself; until then somebody
  // who opens /apply/ is already filling the form in, and the only thing above
  // it is one line saying what they are filling in.
  var ABOUT = 1, GENERAL = 2, POSITION = 3, ROLEQ = 4, REVIEW = 5;
  var STAGES = [
    { at: ABOUT, t: "About you" },
    { at: GENERAL, t: "General" },
    { at: POSITION, t: "Position" },
    { at: ROLEQ, t: "Role questions" },
    { at: REVIEW, t: "Review" }
  ];

  function Steps(props) {
    var role = W.roleByKey(props.roleKey);
    return h("div", { className: "ap-steps", role: "list" }, STAGES.map(function (s, i) {
      var state = props.step === s.at ? " on" : props.step > s.at ? " past" : "";
      return h("button", {
        key: s.t, role: "listitem", className: "ap-step" + state,
        // Going backwards through the strip is allowed and keeps every answer.
        // Jumping forwards is not, because the later stages depend on the
        // earlier ones being valid.
        disabled: props.step <= s.at,
        onClick: function () { if (props.step > s.at) props.go(s.at); },
        "aria-current": props.step === s.at ? "step" : null
      },
        h("span", { className: "ap-step-t" }, s.t),
        s.at === ROLEQ && role ? h("span", { className: "ap-step-r" }, role.title) : null);
    }));
  }

  // ─── Inputs ────────────────────────────────────────────────────────────────
  function errorId(id) { return "e-" + id; }

  function Field(props) {
    return h("label", { className: "fld", htmlFor: props.id },
      h("span", { className: "fld-l mono" }, props.label, props.req ? h("span", { className: "req" }, " *") : null),
      props.children,
      props.error
        ? h("span", { className: "fld-e mono", id: errorId(props.id), role: "alert" }, props.error)
        : props.hint ? h("span", { className: "fld-h" }, props.hint) : null);
  }

  function inputProps(props) {
    return {
      id: props.id, name: props.id, value: props.value, onChange: props.onChange,
      className: "inp" + (props.error ? " bad" : "") + (props.long ? " ta" : ""),
      "aria-invalid": props.error ? "true" : null,
      "aria-describedby": props.error ? errorId(props.id) : null
    };
  }

  function TextInput(props) {
    return h("input", Object.assign(inputProps(props), {
      type: props.type || "text", placeholder: props.placeholder || "",
      autoComplete: props.autoComplete || "off", inputMode: props.inputMode || null
    }));
  }

  // A long answer with a live word counter. The counter counts as you type and
  // turns red past the limit; the Continue button refuses to move on while it is
  // red, so nobody writes 400 words and finds out at the end.
  function LongAnswer(props) {
    var n = W.words(props.value);
    var over = n > props.max;
    return h("div", { className: "ap-q" },
      h("label", { className: "ap-q-l", htmlFor: props.id }, props.label, props.req === false ? null : h("span", { className: "req" }, " *")),
      props.hint ? h("span", { className: "ap-q-h" }, props.hint) : null,
      h("textarea", Object.assign(inputProps({ id: props.id, value: props.value, onChange: props.onChange, error: props.error, long: true }), {
        rows: props.rows || 7, placeholder: props.placeholder || ""
      })),
      h("div", { className: "ap-count" },
        props.error
          ? h("span", { className: "fld-e mono", id: errorId(props.id), role: "alert" }, props.error)
          : h("span", { className: "ap-q-h" }, ""),
        h("span", { className: "ap-words" + (over ? " over" : "") }, n + " / " + props.max + " words")));
  }

  // ─── The page ──────────────────────────────────────────────────────────────
  function ApplyPage() {
    var s = React.useState(ABOUT); var step = s[0], setStep = s[1];
    var a = React.useState(W.blank()); var v = a[0], setV = a[1];
    var e = React.useState({}); var err = e[0], setErr = e[1];
    var c = React.useState(false); var confirmed = c[0], setConfirmed = c[1];
    var t = React.useState("idle"); var status = t[0], setStatus = t[1];
    // The honeypot. No person ever sees it; a bot fills every box it finds.
    var hp = React.useState(""); var website = hp[0], setWebsite = hp[1];
    // Set when an Edit button on the review page sent them back, so Continue can
    // take them straight back to the review instead of walking every stage again.
    var ed = React.useState(false); var editing = ed[0], setEditing = ed[1];
    // null while we are still asking the server whether the Form is connected.
    var f = React.useState(null); var open = f[0], setOpen = f[1];

    React.useEffect(function () {
      var alive = true;
      fetch("/api/apply", { headers: { Accept: "application/json" } })
        .then(function (r) { return r.json(); })
        .then(function (d) { if (alive) setOpen(Boolean(d && d.connected)); })
        // No answer from the API at all (a plain static host, an outage) is not
        // a reason to pretend applications are open.
        .catch(function () { if (alive) setOpen(false); });
      return function () { alive = false; };
    }, []);

    var role = W.roleByKey(v.roleKey);

    function set(id) {
      return function (ev) {
        var next = Object.assign({}, v); next[id] = ev.target.value;
        setV(next);
        // Editing a field clears ITS error. Leaving it on screen after the fix
        // reads as "my correction did not work".
        if (err[id]) { var ne = Object.assign({}, err); delete ne[id]; setErr(ne); }
      };
    }

    function jumpToFirstProblem() {
      window.requestAnimationFrame(function () {
        var first = document.querySelector('[aria-invalid="true"]');
        if (!first) return;
        first.scrollIntoView({ block: "center", behavior: "smooth" });
        first.focus({ preventScroll: true });
      });
    }

    function checkStep(at) {
      if (at === ABOUT) return W.checkAbout(v);
      if (at === GENERAL) return W.checkGeneral(v);
      if (at === POSITION) return W.checkRoleChoice(v);
      if (at === ROLEQ) return W.checkRoleAnswers(v);
      return W.checkEverything(v);
    }

    function go(at) { setStep(at); window.scrollTo(0, 0); }

    function next() {
      var problems = checkStep(step);
      setErr(problems);
      if (Object.keys(problems).length) { jumpToFirstProblem(); return; }
      // Came here from an Edit button: go straight back to the review. Changing
      // the position is the one case that cannot come back this way, and it
      // does not: that stage has no Continue, and picking a different card
      // sends them through the new role's questions first.
      if (editing) {
        setEditing(false);
        go(REVIEW);
        return;
      }
      go(step + 1);
    }

    function back() { setErr({}); go(step - 1); }

    function submit() {
      if (status === "sending") return;
      var problems = W.checkEverything(v);
      setErr(problems);
      if (Object.keys(problems).length) { setStatus("idle"); jumpToFirstProblem(); return; }
      if (!confirmed) { setStatus("unconfirmed"); return; }
      setStatus("sending");
      var body = Object.assign({}, v, { website: website });
      fetch("/api/apply", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; });
      }).then(function (out) {
        // "You're in" is only ever said after the server said Google took it.
        if (out.ok && out.d && out.d.ok) { setStatus("sent"); window.scrollTo(0, 0); return; }
        if (out.d && out.d.error === "invalid" && out.d.errors) {
          setErr(out.d.errors); setStatus("idle"); jumpToFirstProblem(); return;
        }
        setStatus(out.d && out.d.error === "not_connected" ? "closed" : "failed");
      }).catch(function () { setStatus("failed"); });
    }

    // ── success ──
    if (status === "sent") {
      return h("section", { className: "done" }, h("div", { className: "wrap done-in" },
        h(Sl, { w: 64, h: 12, style: { display: "block" } }),
        h("h1", { className: "done-t" }, "You're in. 🚀"),
        h("p", { className: "done-p" },
          "Thanks for applying to the WEC Executive Team 2026-27. ",
          h("strong", null, "By founders, for founders."),
          " Applications are now under review. We'll be in touch."),
        h("div", { className: "done-rows" }, [
          ["Position", role ? role.title : ""],
          ["Applied as", v.name],
          ["We'll reply to", v.westernEmail]
        ].map(function (row) {
          return h("div", { className: "done-row", key: row[0] },
            h("span", null, row[0]), h("span", { className: "mono" }, row[1]));
        })),
        h("div", { className: "hero-actions" },
          h("a", { href: "../", className: "btn btn-light" }, h(Sl, { w: 13 }), "Back to the site"))));
    }

    // ── the flow ──
    // The header is the whole of what used to be the landing page: the mark,
    // which name of thing this is, and the stage they are on. No hero, no
    // pitch, no Start button.
    var pct = Math.round((step - 1) / (REVIEW - 1) * 100);
    // NOT OPEN YET. With no Form connected there is nowhere for an application
    // to go, so the whole form is put inside a disabled fieldset: every input,
    // select, textarea, role card and button inside it stops responding, and
    // the browser will not let a disabled control be typed in or pressed. The
    // stages still render, so somebody can read what is being asked, but
    // nothing can be filled in and nothing can be submitted.
    var usable = open === true;
    return h(React.Fragment, null,
      h("section", { className: "phead" }, h("div", { className: "wrap" },
        h("a", { href: "../", "aria-label": "Western Entrepreneurs Collective, home", className: "ap-mark" },
          h(Mark, { tone: "light", height: 22 })),
        h("div", { className: "eyebrow mono on-p" }, h(Sl, null), "WEC Executive Applications 2026-27"),
        h("h1", { className: "phead-t" }, titleFor(step, role)),
        h("p", { className: "phead-l" }, subtitleFor(step, role))),
        h("div", { className: "hero-cut" })),
      h("section", { className: "join" }, h("div", { className: "wrap join-in" },
        h(Honeypot, { value: website, onChange: function (ev) { setWebsite(ev.target.value); } }),

        open === false ? h("div", { className: "ap-note bad", role: "status" }, h(Sl, { w: 13, h: 3, style: { marginTop: 7 } }),
          h("p", null, h("strong", null, "Applications are not open yet."),
            " This page is live but it is not connected to anything that can receive an application, so nothing typed here would reach us. The questions below are shown so you know what to expect, and they cannot be filled in yet. Check back shortly, or email ",
            h("strong", null, "hello@wecollective.ca"), ".")) : null,
        open === null ? h("div", { className: "ap-note", role: "status" }, h(Sl, { w: 13, h: 3, style: { marginTop: 7 } }),
          h("p", null, "Checking whether applications are open...")) : null,

        h(Steps, { step: step, roleKey: v.roleKey, go: go }),
        h("div", { className: "jprog" }, h("div", { className: "jprog-fill", style: { width: pct + "%" } })),
        h("div", { className: "jprog-lab mono" }, "Stage " + step + " of " + REVIEW),

        h("fieldset", { className: "ap-fs", disabled: !usable },
          step === ABOUT ? aboutStep() :
            step === GENERAL ? generalStep() :
              step === POSITION ? positionStep() :
                step === ROLEQ ? roleQuestions() : reviewStep(),

          h("div", { className: "jactions" },
            // The position stage has no Continue: picking a card IS the
            // continue. Every other stage keeps one.
            step === POSITION ? null
              : step < REVIEW
                ? h("button", { className: "btn btn-dark", onClick: next }, h(Sl, { w: 13 }),
                  editing ? "Back to review" : step === ROLEQ ? "Review application" : "Continue")
                : h("button", { className: "btn btn-dark", onClick: submit, disabled: status === "sending" },
                  h(Sl, { w: 13 }), status === "sending" ? "Sending..." : "Submit application"),
            // Stage 1 is the first thing on the page, so there is nothing to go
            // back to. The mark at the top is the way back to the site.
            step > ABOUT ? h("button", { className: "btn btn-ghost", onClick: back }, "Back") : null,
            h("span", { className: "mono jhint" }, Object.keys(err).length
              ? Object.keys(err).length + (Object.keys(err).length === 1 ? " answer needs fixing" : " answers need fixing")
              : step === POSITION ? "Pick a position to carry on"
                : "Nothing is sent until you submit"))),

        step === ABOUT ? h("div", { className: "ap-note" }, h(Sl, { w: 13, h: 3, style: { marginTop: 7 } }),
          h("p", null, "Your answers are not saved as you go. Finish in one sitting, and keep this tab open. Nothing is stored anywhere until you press Submit on the last page.")) : null)));

    // ── stage 1 ──
    function aboutStep() {
      return h("div", null,
        h("div", { className: "jgrid" }, W.ABOUT.filter(function (fl) { return fl.kind !== "long"; }).map(function (fl) {
          var common = { id: fl.id, value: v[fl.id], onChange: set(fl.id), error: err[fl.id], placeholder: fl.placeholder };
          return h(Field, { key: fl.id, id: fl.id, label: fl.label, req: fl.req, error: err[fl.id], hint: fl.hint },
            fl.kind === "select"
              ? h("select", Object.assign(inputProps(common), {}),
                h("option", { value: "" }, "Choose one"),
                fl.choices.map(function (o) { return h("option", { key: o, value: o }, o); }))
              : h(TextInput, Object.assign({}, common, {
                type: fl.kind === "email" ? "email" : fl.kind === "url" ? "url" : "text",
                autoComplete: fl.id === "name" ? "name" : fl.kind === "email" ? "email" : fl.id === "phone" ? "tel" : "off",
                inputMode: fl.id === "phone" ? "tel" : null
              })));
        })),
        h("div", { className: "jcol" }, W.ABOUT.filter(function (fl) { return fl.kind === "long"; }).map(function (fl) {
          return h(LongAnswer, {
            key: fl.id, id: fl.id, label: fl.label, hint: fl.hint, max: fl.max,
            value: v[fl.id], onChange: set(fl.id), error: err[fl.id], rows: 6
          });
        })));
    }

    // ── stage 2 ──
    function generalStep() {
      return h("div", { className: "jcol" }, W.GENERAL.map(function (q) {
        return h(LongAnswer, {
          key: q.id, id: q.id, label: q.label, max: q.max,
          value: v[q.id], onChange: set(q.id), error: err[q.id], rows: 9
        });
      }));
    }

    // ── stage 3 ──
    // Picking a card goes straight to that role's questions. There is no
    // Continue button here, because a card is a choice and a choice is the only
    // thing this stage asks for.
    function pickRole(r) {
      var already = v.roleKey === r.key;
      if (!already && anyRoleAnswerTyped()) {
        // Only ever asked when there is something real to lose. Changing role
        // MUST clear the old role's answers: r2 of one role is a different
        // question from r2 of another, and carrying the text across would
        // silently put an answer to a question the applicant never read into
        // the club's Sheet.
        var was = W.roleByKey(v.roleKey);
        var ok = window.confirm("You have already written answers for " + (was ? was.title : "the other position")
          + ". Switching to " + r.title + " will delete them, because the questions are different. Switch anyway?");
        if (!ok) return;
      }
      var nv = Object.assign({}, v, { roleKey: r.key });
      if (!already) W.ROLE_SLOTS.forEach(function (slot) { nv[slot.id] = ""; });
      setV(nv);
      var ne = Object.assign({}, err);
      delete ne.role;
      // The old role's error messages belong to questions that are gone.
      if (!already) W.ROLE_SLOTS.forEach(function (slot) { delete ne[slot.id]; });
      setErr(ne);
      // Came from an Edit button on the review page and did not actually change
      // anything: there is nothing to answer again, so go back to the review.
      if (already && editing) { setEditing(false); return go(REVIEW); }
      go(ROLEQ);
    }

    function anyRoleAnswerTyped() {
      var typed = false;
      W.ROLE_SLOTS.forEach(function (slot) { if (String(v[slot.id] || "").trim()) typed = true; });
      return typed;
    }

    function positionStep() {
      return h("div", null,
        err.role ? h("div", { className: "ap-err-top", role: "alert" }, err.role) : null,
        W.GROUPS.map(function (g) {
          return h("div", { className: "ap-group", key: g },
            h("div", { className: "ap-open-h mono" }, h(Sl, null), g),
            h("div", { className: "ap-cards" }, W.ROLES.filter(function (r) { return r.group === g; }).map(function (r) {
              var on = v.roleKey === r.key;
              return h("button", {
                key: r.key, className: "ap-card" + (on ? " on" : ""), "aria-pressed": on ? "true" : "false",
                onClick: function () { pickRole(r); }
              },
                on ? h("span", { className: "ap-card-n" }, "Selected") : null,
                h("span", { className: "ap-card-t" }, r.title),
                h("span", { className: "ap-card-d" }, r.desc));
            })));
        }));
    }

    // ── stage 4: ONE role's questions, read from that role ──
    function roleQuestions() {
      if (!role) return h("div", { className: "ap-err-top" }, "Pick a position first.");
      return h("div", { className: "jcol" },
        role.qs.map(function (q, i) {
          return h(LongAnswer, {
            key: q.id, id: q.id, label: (i + 1) + ". " + q.label, max: q.max,
            value: v[q.id], onChange: set(q.id), error: err[q.id], rows: q.max > 200 ? 9 : 7
          });
        }),
        role.link ? h(Field, { id: role.link.id, label: role.link.label, error: err[role.link.id], hint: role.link.hint },
          h(TextInput, { id: role.link.id, value: v[role.link.id], onChange: set(role.link.id), error: err[role.link.id], placeholder: "https://", type: "url" })) : null);
    }

    // ── stage 5 ──
    function reviewStep() {
      return h("div", null,
        section("About you", ABOUT, W.ABOUT.map(function (fl) {
          return [fl.label, v[fl.id] || "Not answered"];
        })),
        section("General questions", GENERAL, W.GENERAL.map(function (q) {
          return [q.label, v[q.id] || "Not answered"];
        })),
        section("Position", POSITION, [["Applying for", role ? role.title : "Not chosen"]]),
        section("Role questions", ROLEQ, role
          ? role.qs.map(function (q) { return [q.label, v[q.id] || "Not answered"]; })
            .concat(role.link ? [[role.link.label, v[role.link.id] || "Not answered"]] : [])
          : [["Role questions", "Pick a position first"]]),

        h("label", { className: "ap-confirm" },
          h("input", {
            type: "checkbox", checked: confirmed,
            onChange: function (ev) { setConfirmed(ev.target.checked); if (status === "unconfirmed") setStatus("idle"); }
          }),
          h("span", null, "I confirm that the information in this application is accurate.")),

        status === "unconfirmed" ? h("div", { className: "ap-err-top", role: "alert" }, "Please tick the box above to confirm your application is accurate.") : null,
        status === "failed" ? h("div", { className: "ap-note bad" }, h(Sl, { w: 13, h: 3, style: { marginTop: 7 } }),
          h("p", null, h("strong", null, "That didn't go through."),
            " Nothing was submitted and every answer above is still here. Press Submit again in a moment. If it keeps failing, email your answers to ",
            h("strong", null, "hello@wecollective.ca"), " and we will take it from there.")) : null,
        status === "closed" ? h("div", { className: "ap-note bad" }, h(Sl, { w: 13, h: 3, style: { marginTop: 7 } }),
          h("p", null, h("strong", null, "Applications are not open yet."),
            " Nothing was submitted. Your answers are still here, so keep this tab open, or copy them somewhere safe.")) : null,
        Object.keys(err).length ? h("div", { className: "ap-err-top", role: "alert" },
          "Some answers still need fixing. Use the Edit buttons above to go back to them. Nothing has been sent.") : null);
    }

    function section(title, at, rows) {
      return h("div", null,
        h("div", { className: "ap-sec-h" },
          h("span", { className: "ap-sec-t" }, title),
          // Edit goes back to that stage with every answer intact: it only moves
          // the step number, it never touches the answers.
          h("button", { className: "ap-edit", onClick: function () { setEditing(true); setErr({}); go(at); } }, "Edit")),
        h("div", { className: "jrev" }, rows.map(function (row, i) {
          return h("div", { className: "jrev-row", key: title + i },
            h("span", { className: "jrev-k mono" }, row[0]),
            h("span", { className: "jrev-v ap-rev-v" }, row[1]));
        })));
    }
  }

  function titleFor(step, role) {
    if (step === 1) return "Let's get to know you.";
    if (step === 2) return "Before we talk roles...";
    if (step === 3) return "Where do you want to build?";
    if (step === 4) return role ? role.title : "Role questions";
    return "Review your application.";
  }

  function subtitleFor(step, role) {
    if (step === 1) return "Before we get into the role, tell us a little about yourself.";
    if (step === 2) return "We want to understand the person behind the application.";
    if (step === 3) return "Choose the role where you think you can create the most impact.";
    if (step === 4) return role ? role.sub : "";
    return "Check everything below, then submit. You can still edit any section.";
  }

  // The honeypot lives outside the visible form, off screen rather than
  // display:none, because some bots skip fields that are display:none.
  function Honeypot(props) {
    return h("div", { style: { position: "absolute", left: "-9999px", top: 0, width: 1, height: 1, overflow: "hidden" }, "aria-hidden": "true" },
      h("label", null, "Website",
        h("input", { type: "text", name: "website", tabIndex: -1, autoComplete: "off", value: props.value, onChange: props.onChange })));
  }

  ReactDOM.createRoot(document.getElementById("root")).render(h(ApplyPage, null));
})();
