const COPY = window.WEC_COPY;
function Sl({ w = 15, h = 3, style }) {
  return /* @__PURE__ */ React.createElement("span", { className: "sl", style: { width: w, height: h, ...style } });
}
function Mark({ tone, height, variant }) {
  const L = window.WEC_LOGOS && window.WEC_LOGOS[variant || "horizontal"];
  if (!L) return /* @__PURE__ */ React.createElement("img", { src: "../../assets/wec-lockup-horizontal" + (tone === "light" ? "-white" : "") + ".svg", alt: "Western Entrepreneurs Collective", style: { height, display: "block" } });
  const vb = L.viewBox.split(" ").map(Number);
  return /* @__PURE__ */ React.createElement("svg", { viewBox: L.viewBox, role: "img", "aria-label": "Western Entrepreneurs Collective", style: { height, width: height * vb[2] / vb[3], display: "block" } }, /* @__PURE__ */ React.createElement("path", { d: L.ink, fillRule: "evenodd", fill: tone === "light" ? "var(--bg)" : "var(--p)" }), L.slash ? /* @__PURE__ */ React.createElement("path", { d: L.slash, fillRule: "evenodd", fill: tone === "light" ? "var(--g-lt)" : "var(--g)" }) : null);
}
const NAV = [["/", "Home"], ["/program", "Program"], ["/join", "Join"]];
function Header({ route, go }) {
  const [solid, setSolid] = React.useState(route !== "/");
  React.useEffect(() => {
    if (route !== "/") {
      setSolid(true);
      return;
    }
    const f = () => {
      const hero = document.querySelector(".hero");
      setSolid(window.scrollY > (hero ? hero.offsetHeight - 80 : 500));
    };
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, [route]);
  return /* @__PURE__ */ React.createElement("header", { className: "hd" + (solid ? " solid" : "") }, /* @__PURE__ */ React.createElement("div", { className: "wrap hd-in" }, /* @__PURE__ */ React.createElement("a", { href: "#/", onClick: (e) => {
    e.preventDefault();
    go("/");
  }, "aria-label": "Home" }, /* @__PURE__ */ React.createElement(Mark, { tone: solid ? "dark" : "light", height: 22 })), /* @__PURE__ */ React.createElement("nav", { className: "hd-nav" }, NAV.slice(1).map(([p, l]) => /* @__PURE__ */ React.createElement("a", { key: p, href: "#" + p, onClick: (e) => {
    e.preventDefault();
    go(p);
  }, className: "hd-link" + (route === p ? " on" : "") }, l)), /* @__PURE__ */ React.createElement("a", { href: "#/join", onClick: (e) => {
    e.preventDefault();
    go("/join");
  }, className: "btn btn-sm cta-sm " + (solid ? "btn-dark" : "btn-out") }, /* @__PURE__ */ React.createElement(Sl, { w: 12, h: 3 }), "Join"))));
}
function Footer({ go }) {
  return /* @__PURE__ */ React.createElement("footer", { className: "ft" }, /* @__PURE__ */ React.createElement("div", { className: "wrap ft-in" }, /* @__PURE__ */ React.createElement("div", { className: "ft-links" }, NAV.map(([p, l]) => /* @__PURE__ */ React.createElement("a", { key: p, href: "#" + p, onClick: (e) => {
    e.preventDefault();
    go(p);
  }, className: "ft-nav" }, l))), /* @__PURE__ */ React.createElement("div", { className: "ft-links" }, /* @__PURE__ */ React.createElement("a", { href: "#", className: "ig" }, COPY.instagram), /* @__PURE__ */ React.createElement("a", { href: "#", className: "em" }, COPY.email)), /* @__PURE__ */ React.createElement("small", null, COPY.legal)));
}
function StickyCTA({ go, hide }) {
  const [stick, setStick] = React.useState(false);
  React.useEffect(() => {
    if (hide) {
      setStick(false);
      return;
    }
    const f = () => setStick(window.scrollY > 300 && window.scrollY < document.body.scrollHeight - window.innerHeight - 200);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, [hide]);
  if (hide) return null;
  return /* @__PURE__ */ React.createElement("div", { className: "stick" + (stick ? " in" : "") }, /* @__PURE__ */ React.createElement("a", { href: "#/join", onClick: (e) => {
    e.preventDefault();
    go("/join");
  }, className: "btn btn-dark btn-block" }, /* @__PURE__ */ React.createElement(Sl, { w: 13 }), COPY.cta));
}
function PageHead({ eyebrow, title, lede }) {
  return /* @__PURE__ */ React.createElement("section", { className: "phead" }, /* @__PURE__ */ React.createElement("div", { className: "wrap" }, /* @__PURE__ */ React.createElement("div", { className: "eyebrow mono on-p" }, /* @__PURE__ */ React.createElement(Sl, null), eyebrow), /* @__PURE__ */ React.createElement("h1", { className: "phead-t" }, title), lede ? /* @__PURE__ */ React.createElement("p", { className: "phead-l" }, lede) : null), /* @__PURE__ */ React.createElement("div", { className: "hero-cut" }));
}
Object.assign(window, { Sl, Mark, Header, Footer, StickyCTA, PageHead, COPY });
function Hero({ go }) {
  const [fill, setFill] = React.useState(0);
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const t = setTimeout(() => {
      setFill(COPY.places.taken / COPY.places.total);
      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const k = Math.min(1, (ts - start) / 900);
        setN(Math.round(k * COPY.places.taken));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, 700);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, []);
  let i = 0;
  return /* @__PURE__ */ React.createElement("section", { className: "hero", id: "top" }, /* @__PURE__ */ React.createElement("div", { className: "wrap" }, /* @__PURE__ */ React.createElement("div", { className: "eyebrow mono" }, /* @__PURE__ */ React.createElement(Sl, null), "Western University / Founding cohort 2026"), /* @__PURE__ */ React.createElement("h1", { className: "h1" }, COPY.lead.split(" ").map((w) => /* @__PURE__ */ React.createElement(React.Fragment, { key: w + i++ }, /* @__PURE__ */ React.createElement("span", { className: "w", style: { animationDelay: 0.05 + i * 0.038 + "s" } }, w), " "))), /* @__PURE__ */ React.createElement("p", { className: "h2" }, COPY.sub, " ", /* @__PURE__ */ React.createElement("span", { className: "hl" }, COPY.subHl)), /* @__PURE__ */ React.createElement("div", { className: "meter" }, /* @__PURE__ */ React.createElement("div", { className: "meter-track" }, /* @__PURE__ */ React.createElement("div", { className: "meter-fill", style: { transform: "scaleX(" + fill + ")" } })), /* @__PURE__ */ React.createElement("div", { className: "meter-row mono" }, /* @__PURE__ */ React.createElement("span", null, n, " of ", COPY.places.total, " places taken"), /* @__PURE__ */ React.createElement("span", null, COPY.places.total - COPY.places.taken, " left"))), /* @__PURE__ */ React.createElement("div", { className: "hero-actions" }, /* @__PURE__ */ React.createElement("a", { href: "#/join", onClick: (e) => {
    e.preventDefault();
    go("/join");
  }, className: "btn btn-light" }, /* @__PURE__ */ React.createElement(Sl, { w: 13 }), COPY.cta), /* @__PURE__ */ React.createElement("a", { href: "#term", className: "btn btn-out" }, "See the term")), /* @__PURE__ */ React.createElement("p", { className: "note note-lt hero-note" }, COPY.note)));
}
function Marquee() {
  const items = COPY.marquee.concat(COPY.marquee);
  const run = (k) => /* @__PURE__ */ React.createElement("div", { className: "mq-in", key: k, "aria-hidden": k > 0 }, items.map((m, idx) => /* @__PURE__ */ React.createElement(React.Fragment, { key: m + idx }, /* @__PURE__ */ React.createElement("span", null, m), /* @__PURE__ */ React.createElement(Sl, { w: 16, h: 4 }))));
  return /* @__PURE__ */ React.createElement("div", { className: "mq" }, run(0), run(1));
}
function Principles() {
  const [open, setOpen] = React.useState(0);
  return /* @__PURE__ */ React.createElement("section", { className: "sec rv", id: "program", style: { paddingBottom: 40 } }, /* @__PURE__ */ React.createElement("div", { className: "wrap" }, /* @__PURE__ */ React.createElement("div", { className: "sec-hd mono" }, /* @__PURE__ */ React.createElement(Sl, null), "What you actually do"), /* @__PURE__ */ React.createElement("div", { className: "pr" }, COPY.principles.map((p, i) => /* @__PURE__ */ React.createElement("button", { key: p.t, className: "pr-row" + (open === i ? " on" : ""), onClick: () => setOpen(open === i ? -1 : i), "aria-expanded": open === i }, /* @__PURE__ */ React.createElement("span", { className: "pr-top" }, /* @__PURE__ */ React.createElement("span", { className: "pr-n" }, "0", i + 1), /* @__PURE__ */ React.createElement("span", { className: "pr-t" }, p.t)), /* @__PURE__ */ React.createElement("span", { className: "pr-body" }, /* @__PURE__ */ React.createElement("span", { className: "pr-body-in" }, /* @__PURE__ */ React.createElement("p", null, p.p), /* @__PURE__ */ React.createElement("span", { className: "pr-list" }, p.l.map((l) => /* @__PURE__ */ React.createElement("span", { key: l }, /* @__PURE__ */ React.createElement(Sl, { w: 11, h: 2 }), l))))))))));
}
function Scrubber() {
  const [i, setI] = React.useState(0);
  const ref = React.useRef(null);
  const drag = React.useRef(false);
  const n = COPY.term.length;
  const pick = (x) => {
    const r = ref.current.getBoundingClientRect();
    setI(Math.round(Math.min(1, Math.max(0, (x - r.left) / r.width)) * (n - 1)));
  };
  React.useEffect(() => {
    const move = (e) => {
      if (drag.current) pick(e.clientX);
    };
    const up = () => {
      drag.current = false;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);
  const t = COPY.term[i];
  const pct = i / (n - 1) * 100;
  return /* @__PURE__ */ React.createElement("section", { className: "scrub rv", id: "term" }, /* @__PURE__ */ React.createElement("div", { className: "wrap sec", style: { paddingTop: 48, paddingBottom: 48 } }, /* @__PURE__ */ React.createElement("div", { className: "sc-head" }, /* @__PURE__ */ React.createElement("div", { className: "sec-hd mono" }, /* @__PURE__ */ React.createElement(Sl, null), "Drag the term"), /* @__PURE__ */ React.createElement("span", { className: "mono sc-range" }, "October to March")), /* @__PURE__ */ React.createElement("div", { className: "sc-stage" }, /* @__PURE__ */ React.createElement("div", { className: "sc-month" }, t[0]), /* @__PURE__ */ React.createElement("div", { className: "sc-copy" }, /* @__PURE__ */ React.createElement("h3", null, t[1]), /* @__PURE__ */ React.createElement("p", null, t[2]))), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "sc-track",
      ref,
      onPointerDown: (e) => {
        drag.current = true;
        pick(e.clientX);
      },
      onKeyDown: (e) => {
        if (e.key === "ArrowRight") setI(Math.min(n - 1, i + 1));
        if (e.key === "ArrowLeft") setI(Math.max(0, i - 1));
      },
      tabIndex: 0,
      role: "slider",
      "aria-valuemin": 1,
      "aria-valuemax": n,
      "aria-valuenow": i + 1,
      "aria-label": "Term month"
    },
    /* @__PURE__ */ React.createElement("div", { className: "sc-rail" }),
    /* @__PURE__ */ React.createElement("div", { className: "sc-prog", style: { width: pct + "%" } }),
    COPY.term.map((m, k) => /* @__PURE__ */ React.createElement("div", { key: m[0], className: "sc-tick" + (k <= i ? " past" : ""), style: { left: k / (n - 1) * 100 + "%" } })),
    /* @__PURE__ */ React.createElement("div", { className: "sc-knob", style: { left: pct + "%" } })
  ), /* @__PURE__ */ React.createElement("div", { className: "sc-labs" }, COPY.term.map((m, k) => /* @__PURE__ */ React.createElement("button", { key: m[0], className: k === i ? "on" : "", onClick: () => setI(k) }, m[0])))));
}
function Close({ go }) {
  return /* @__PURE__ */ React.createElement("section", { className: "close rv", id: "join" }, /* @__PURE__ */ React.createElement("div", { className: "wrap" }, /* @__PURE__ */ React.createElement(Sl, { w: 64, h: 12, style: { display: "block" } }), /* @__PURE__ */ React.createElement("h2", { className: "close-t" }, "Seventy five places. Sixty three gone."), /* @__PURE__ */ React.createElement("div", { className: "hero-actions" }, /* @__PURE__ */ React.createElement("a", { href: "#/join", onClick: (e) => {
    e.preventDefault();
    go("/join");
  }, className: "btn btn-light" }, /* @__PURE__ */ React.createElement(Sl, { w: 13 }), COPY.cta)), /* @__PURE__ */ React.createElement("p", { className: "note note-lt" }, COPY.note)));
}
function HomePage({ go }) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Hero, { go }), /* @__PURE__ */ React.createElement("div", { className: "hero-cut" }), /* @__PURE__ */ React.createElement(Marquee, null), /* @__PURE__ */ React.createElement(Principles, null), /* @__PURE__ */ React.createElement(Scrubber, null), /* @__PURE__ */ React.createElement(Close, { go }));
}
Object.assign(window, { HomePage });
function ProgramPage({ go }) {
  const [faq, setFaq] = React.useState(-1);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    PageHead,
    {
      eyebrow: "The program",
      title: "Bi-weekly Sundays, October to March",
      lede: "Sessions are working sessions. You bring what you built since the last one, and you leave with something to do before the next."
    }
  ), /* @__PURE__ */ React.createElement("section", { className: "sec rv" }, /* @__PURE__ */ React.createElement("div", { className: "wrap" }, /* @__PURE__ */ React.createElement("div", { className: "sec-hd mono" }, /* @__PURE__ */ React.createElement(Sl, null), "Four workshops"), /* @__PURE__ */ React.createElement("div", { className: "wk" }, COPY.workshops.map((w, i) => /* @__PURE__ */ React.createElement("div", { className: "wk-row", key: w[0] }, /* @__PURE__ */ React.createElement("span", { className: "wk-n mono" }, "0", i + 1), /* @__PURE__ */ React.createElement("span", { className: "wk-t" }, w[0]), /* @__PURE__ */ React.createElement("span", { className: "wk-m mono" }, w[1]), /* @__PURE__ */ React.createElement("p", { className: "wk-p" }, w[2])))))), /* @__PURE__ */ React.createElement("section", { className: "scrub rv" }, /* @__PURE__ */ React.createElement("div", { className: "wrap sec", style: { paddingTop: 48, paddingBottom: 48 } }, /* @__PURE__ */ React.createElement("div", { className: "sec-hd mono" }, /* @__PURE__ */ React.createElement(Sl, null), "The term in order"), /* @__PURE__ */ React.createElement("div", { className: "tl" }, COPY.term.map((t, i) => /* @__PURE__ */ React.createElement("div", { className: "tl-cell", key: t[0] }, /* @__PURE__ */ React.createElement("span", { className: "tl-m mono" }, t[0]), /* @__PURE__ */ React.createElement("h3", { className: "tl-t" }, t[1]), /* @__PURE__ */ React.createElement("p", { className: "tl-p" }, t[2])))))), /* @__PURE__ */ React.createElement("section", { className: "sec rv" }, /* @__PURE__ */ React.createElement("div", { className: "wrap" }, /* @__PURE__ */ React.createElement("div", { className: "two" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sec-hd mono" }, /* @__PURE__ */ React.createElement(Sl, null), "Who gets in"), /* @__PURE__ */ React.createElement("h2", { className: "h2d" }, "Evidence over intention."), /* @__PURE__ */ React.createElement("p", { className: "lede" }, "A live link beats a plan. A signed contract beats a deck. A working prototype beats a pitch. You do not need a company, and you do not need it to work yet.")), /* @__PURE__ */ React.createElement("div", { className: "crit" }, ["A product with users, however few.", "A contract you signed and delivered.", "A prototype you built with your own hands.", "A business that made money last term."].map((t) => /* @__PURE__ */ React.createElement("div", { className: "crit-row", key: t }, /* @__PURE__ */ React.createElement(Sl, { w: 13, h: 3, style: { marginTop: 9 } }), /* @__PURE__ */ React.createElement("span", null, t))), /* @__PURE__ */ React.createElement("p", { className: "note" }, "If you are still deciding what to build, apply next term. We would rather you spend this one building."))))), /* @__PURE__ */ React.createElement("section", { className: "sec rv", style: { paddingTop: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "wrap" }, /* @__PURE__ */ React.createElement("div", { className: "sec-hd mono" }, /* @__PURE__ */ React.createElement(Sl, null), "Questions we actually get"), /* @__PURE__ */ React.createElement("div", { className: "pr" }, COPY.faq.map((f, i) => /* @__PURE__ */ React.createElement("button", { key: f[0], className: "pr-row" + (faq === i ? " on" : ""), onClick: () => setFaq(faq === i ? -1 : i), "aria-expanded": faq === i }, /* @__PURE__ */ React.createElement("span", { className: "pr-top" }, /* @__PURE__ */ React.createElement("span", { className: "pr-n" }, ("0" + (i + 1)).slice(-2)), /* @__PURE__ */ React.createElement("span", { className: "pr-t pr-t-sm" }, f[0])), /* @__PURE__ */ React.createElement("span", { className: "pr-body" }, /* @__PURE__ */ React.createElement("span", { className: "pr-body-in" }, /* @__PURE__ */ React.createElement("p", null, f[1])))))))), /* @__PURE__ */ React.createElement("section", { className: "close rv" }, /* @__PURE__ */ React.createElement("div", { className: "wrap" }, /* @__PURE__ */ React.createElement(Sl, { w: 64, h: 12, style: { display: "block" } }), /* @__PURE__ */ React.createElement("h2", { className: "close-t" }, "Four questions. Fifteen minutes."), /* @__PURE__ */ React.createElement("div", { className: "hero-actions" }, /* @__PURE__ */ React.createElement("a", { href: "#/join", onClick: (e) => {
    e.preventDefault();
    go("/join");
  }, className: "btn btn-light" }, /* @__PURE__ */ React.createElement(Sl, { w: 13 }), COPY.cta)), /* @__PURE__ */ React.createElement("p", { className: "note note-lt" }, COPY.note))));
}
Object.assign(window, { ProgramPage });
const BLANK = { name: "", email: "", year: "Year 1", building: "", evidence: "", link: "", hard: "" };
function Field({ label, hint, error, children, req }) {
  return /* @__PURE__ */ React.createElement("label", { className: "fld" }, /* @__PURE__ */ React.createElement("span", { className: "fld-l mono" }, label, req ? /* @__PURE__ */ React.createElement("span", { className: "req" }, " *") : null), children, error ? /* @__PURE__ */ React.createElement("span", { className: "fld-e mono" }, error) : /* @__PURE__ */ React.createElement("span", { className: "fld-h" }, hint));
}
function JoinPage({ go }) {
  const [step, setStep] = React.useState(0);
  const [v, setV] = React.useState(BLANK);
  const [err, setErr] = React.useState({});
  const [done, setDone] = React.useState(false);
  const set = (k) => (e) => setV(Object.assign({}, v, { [k]: e.target.value }));
  const steps = ["You", "The build", "Review"];
  const validate = (s) => {
    const e = {};
    if (s === 0) {
      if (!v.name.trim()) e.name = "Enter your name.";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) e.email = "Enter a Western email address.";
    }
    if (s === 1) {
      if (!v.building.trim()) e.building = "One sentence is enough.";
      if (!v.evidence.trim()) e.evidence = "Name one thing you shipped.";
      if (!v.link.trim()) e.link = "A link to anything that exists.";
    }
    setErr(e);
    return Object.keys(e).length === 0;
  };
  const next = () => {
    if (validate(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };
  const filled = [v.name, v.email, v.building, v.evidence, v.link].filter((x) => x.trim()).length;
  const pct = Math.round(filled / 5 * 100);
  if (done) {
    return /* @__PURE__ */ React.createElement("section", { className: "done" }, /* @__PURE__ */ React.createElement("div", { className: "wrap done-in" }, /* @__PURE__ */ React.createElement(Sl, { w: 64, h: 12, style: { display: "block" } }), /* @__PURE__ */ React.createElement("h1", { className: "done-t" }, "You are in the pile."), /* @__PURE__ */ React.createElement("p", { className: "done-p" }, "We read applications in the order they arrive and reply to everyone. Expect an answer within a week at ", /* @__PURE__ */ React.createElement("strong", null, v.email || COPY.email), "."), /* @__PURE__ */ React.createElement("div", { className: "done-rows" }, [["Submitted", "Just now"], ["Decisions", "Rolling, within a week"], ["First session", "Inaugural dinner, October"], ["Places left", COPY.places.total - COPY.places.taken - 1 + " of " + COPY.places.total]].map(([k, t]) => /* @__PURE__ */ React.createElement("div", { className: "done-row", key: k }, /* @__PURE__ */ React.createElement("span", null, k), /* @__PURE__ */ React.createElement("span", { className: "mono" }, t)))), /* @__PURE__ */ React.createElement("div", { className: "hero-actions" }, /* @__PURE__ */ React.createElement("a", { href: "#/program", onClick: (e) => {
      e.preventDefault();
      go("/program");
    }, className: "btn btn-light" }, /* @__PURE__ */ React.createElement(Sl, { w: 13 }), "Read what happens next"))));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(PageHead, { eyebrow: "Apply", title: "Four questions", lede: COPY.note }), /* @__PURE__ */ React.createElement("section", { className: "join" }, /* @__PURE__ */ React.createElement("div", { className: "wrap join-in" }, /* @__PURE__ */ React.createElement("div", { className: "jsteps" }, steps.map((s, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: s,
      className: "jstep" + (i === step ? " on" : "") + (i < step ? " past" : ""),
      onClick: () => {
        if (i < step) setStep(i);
      },
      disabled: i > step
    },
    /* @__PURE__ */ React.createElement("span", { className: "jstep-n mono" }, "0", i + 1),
    /* @__PURE__ */ React.createElement("span", { className: "jstep-t" }, s)
  ))), /* @__PURE__ */ React.createElement("div", { className: "jprog" }, /* @__PURE__ */ React.createElement("div", { className: "jprog-fill", style: { width: pct + "%" } })), /* @__PURE__ */ React.createElement("div", { className: "jprog-lab mono" }, pct, "% complete"), step === 0 ? /* @__PURE__ */ React.createElement("div", { className: "jgrid" }, /* @__PURE__ */ React.createElement(Field, { label: "Full name", req: true, error: err.name, hint: "As it appears on your student record." }, /* @__PURE__ */ React.createElement("input", { className: "inp" + (err.name ? " bad" : ""), value: v.name, onChange: set("name"), placeholder: "Amara Osei" })), /* @__PURE__ */ React.createElement(Field, { label: "Western email", req: true, error: err.email, hint: "Used to verify enrolment. Nothing else." }, /* @__PURE__ */ React.createElement("input", { className: "inp" + (err.email ? " bad" : ""), value: v.email, onChange: set("email"), placeholder: "aosei@uwo.ca" })), /* @__PURE__ */ React.createElement(Field, { label: "Year", hint: "First years are welcome if you are building." }, /* @__PURE__ */ React.createElement("select", { className: "inp", value: v.year, onChange: set("year") }, ["Year 1", "Year 2", "Year 3", "Year 4", "Graduate"].map((y) => /* @__PURE__ */ React.createElement("option", { key: y }, y))))) : step === 1 ? /* @__PURE__ */ React.createElement("div", { className: "jcol" }, /* @__PURE__ */ React.createElement(Field, { label: COPY.questions[0].label, req: true, error: err.building, hint: COPY.questions[0].hint }, /* @__PURE__ */ React.createElement("input", { className: "inp" + (err.building ? " bad" : ""), value: v.building, onChange: set("building"), placeholder: COPY.questions[0].ph })), /* @__PURE__ */ React.createElement(Field, { label: COPY.questions[1].label, req: true, error: err.evidence, hint: COPY.questions[1].hint }, /* @__PURE__ */ React.createElement("textarea", { rows: 4, className: "inp ta" + (err.evidence ? " bad" : ""), value: v.evidence, onChange: set("evidence"), placeholder: COPY.questions[1].ph })), /* @__PURE__ */ React.createElement(Field, { label: COPY.questions[2].label, req: true, error: err.link, hint: COPY.questions[2].hint }, /* @__PURE__ */ React.createElement("input", { className: "inp" + (err.link ? " bad" : ""), value: v.link, onChange: set("link"), placeholder: COPY.questions[2].ph })), /* @__PURE__ */ React.createElement(Field, { label: COPY.questions[3].label, hint: COPY.questions[3].hint }, /* @__PURE__ */ React.createElement("textarea", { rows: 3, className: "inp ta", value: v.hard, onChange: set("hard") }))) : /* @__PURE__ */ React.createElement("div", { className: "jrev" }, [["Name", v.name], ["Email", v.email], ["Year", v.year], ["Building", v.building], ["Shipped", v.evidence], ["Link", v.link], ["Hardest part", v.hard || "Not answered"]].map(([k, val]) => /* @__PURE__ */ React.createElement("div", { className: "jrev-row", key: k }, /* @__PURE__ */ React.createElement("span", { className: "jrev-k mono" }, k), /* @__PURE__ */ React.createElement("span", { className: "jrev-v" }, val))), /* @__PURE__ */ React.createElement("div", { className: "jnote" }, /* @__PURE__ */ React.createElement(Sl, { w: 13, h: 3, style: { marginTop: 7 } }), /* @__PURE__ */ React.createElement("p", null, "Nothing here is shared outside the reading group. If you are not taken this term you can apply again in January."))), /* @__PURE__ */ React.createElement("div", { className: "jactions" }, step < 2 ? /* @__PURE__ */ React.createElement("button", { className: "btn btn-dark", onClick: next }, /* @__PURE__ */ React.createElement(Sl, { w: 13 }), "Continue") : /* @__PURE__ */ React.createElement("button", { className: "btn btn-dark", onClick: () => {
    setDone(true);
    window.scrollTo(0, 0);
  } }, /* @__PURE__ */ React.createElement(Sl, { w: 13 }), "Submit application"), step > 0 ? /* @__PURE__ */ React.createElement("button", { className: "btn btn-ghost", onClick: () => setStep(step - 1) }, "Back") : null, /* @__PURE__ */ React.createElement("span", { className: "mono jhint" }, "Step ", step + 1, " of 3")))));
}
Object.assign(window, { JoinPage });
function routeFromHash() {
  const h = (location.hash || "").replace(/^#/, "");
  return ["/", "/program", "/join"].indexOf(h) > -1 ? h : "/";
}
function App() {
  const [route, setRoute] = React.useState(routeFromHash());
  React.useEffect(() => {
    const f = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  const go = (p) => {
    if (location.hash !== "#" + p) {
      location.hash = p;
    }
    setRoute(p);
    window.scrollTo(0, 0);
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Header, { route, go }), route === "/program" ? /* @__PURE__ */ React.createElement(ProgramPage, { go }) : route === "/join" ? /* @__PURE__ */ React.createElement(JoinPage, { go }) : /* @__PURE__ */ React.createElement(HomePage, { go }), /* @__PURE__ */ React.createElement(Footer, { go }), /* @__PURE__ */ React.createElement(StickyCTA, { go, hide: route === "/join" }));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
