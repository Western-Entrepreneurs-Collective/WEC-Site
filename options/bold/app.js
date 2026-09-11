window.WEC_COPY = {
  positioning: "This isn't a club for people interested in business, consulting, or venture capital: it's a founder-led program for individuals serious about building something meaningful.",
  blocks: [
    {
      title: "Build, do not just listen",
      body: "Bi-weekly Sunday build sessions. Workshops run by founders who have done it: Creating something people want, What you actually need to start, Brand, and Pitching.",
      list: ["Creating something people want", "What you actually need to start", "Brand", "Pitching"]
    },
    {
      title: "Real founders, real time",
      body: "Speaker sessions, one to one mentoring and small group check-ins. Everyone in front of the room has run the thing they are talking about.",
      list: ["Founder speaker sessions", "One to one mentoring", "Small group check-ins"]
    },
    {
      title: "Then prove it",
      body: "Pitch competitions in November and March, and demo nights where you show what actually moved. An inaugural dinner in October opens the term.",
      list: ["Inaugural dinner, October", "Pitch competition, November", "Pitch competition, March"]
    }
  ],
  cta: "Join as a founding member",
  ctaNote: "Thirty seconds, four questions. It costs nothing today and commits you to nothing.",
  terms: [
    ["October", "Inaugural dinner. First build session."],
    ["November", "Workshops. Pitch competition."],
    ["December", "Demo night. Term close."],
    ["January", "Cohort two opens. Build sessions resume."],
    ["February", "Mentoring block. Workshops."],
    ["March", "Pitch competition. Demo night."]
  ],
  stats: [["60-75", "Members a term"], ["4", "Founder workshops"], ["2", "Pitch competitions"], ["Sept 2026", "Launched"]],
  instagram: "@wec.uwo",
  email: "hello@wecollective.ca",
  legal: "Western Entrepreneurs Collective. Student run, London, Ontario. Not a ratified student organisation."
};
function PageBold({ mobile }) {
  const C = window.WEC_COPY;
  const gut = mobile ? 22 : 56;
  const Slash = ({ w = 15, h = 3, c = "#014939" }) => /* @__PURE__ */ React.createElement("span", { style: { display: "inline-block", width: w, height: h, background: c, transform: "skewX(-22deg)", flex: "none" } });
  const Btn = ({ invert, full }) => /* @__PURE__ */ React.createElement("a", { href: "#", style: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: mobile ? 52 : 54,
    padding: "0 28px",
    width: full ? "100%" : "auto",
    background: invert ? "#FEFEFE" : "#4F2781",
    color: invert ? "#4F2781" : "#FEFEFE",
    font: "600 16px/1 var(--font-sans)"
  } }, /* @__PURE__ */ React.createElement(Slash, { w: 13 }), " ", C.cta);
  return /* @__PURE__ */ React.createElement("div", { style: { background: "#FEFEFE", color: "#141018" } }, /* @__PURE__ */ React.createElement("section", { style: { background: "#4F2781", color: "#FEFEFE" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1120, margin: "0 auto", padding: (mobile ? "40px" : "64px") + " " + gut + "px " + (mobile ? "48px" : "72px") } }, /* @__PURE__ */ React.createElement("img", { src: "../../assets/wec-lockup-horizontal-white.svg", alt: "Western Entrepreneurs Collective", style: { height: mobile ? 30 : 44, display: "block" } }), /* @__PURE__ */ React.createElement("h1", { style: { font: "700 " + (mobile ? "32px" : "62px") + "/1.08 var(--font-sans)", letterSpacing: "-0.03em", marginTop: mobile ? 44 : 80, maxWidth: 1e3 } }, C.positioning), /* @__PURE__ */ React.createElement("div", { style: { marginTop: mobile ? 32 : 44, display: "flex", gap: 18, alignItems: mobile ? "stretch" : "center", flexDirection: mobile ? "column" : "row" } }, /* @__PURE__ */ React.createElement(Btn, { invert: true, full: mobile }), /* @__PURE__ */ React.createElement("span", { style: { font: "400 14px/1.6 var(--font-sans)", color: "#C9B9DE", maxWidth: 320 } }, C.ctaNote))), /* @__PURE__ */ React.createElement("div", { style: { borderTop: "1px solid rgba(254,254,254,.28)" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1120, margin: "0 auto", padding: (mobile ? 28 : 36) + "px " + gut + "px", display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4,1fr)", gap: mobile ? 24 : 32 } }, C.stats.map(([v, l]) => /* @__PURE__ */ React.createElement("div", { key: l }, /* @__PURE__ */ React.createElement("div", { style: { font: "700 " + (mobile ? "28px" : "40px") + "/0.95 var(--font-sans)", letterSpacing: "-0.028em" } }, v), /* @__PURE__ */ React.createElement("div", { style: { font: "600 11px/1.3 var(--font-mono)", letterSpacing: "0.14em", textTransform: "uppercase", color: "#C9B9DE", marginTop: 8 } }, l)))))), /* @__PURE__ */ React.createElement("section", { style: { maxWidth: 1120, margin: "0 auto", padding: (mobile ? 44 : 88) + "px " + gut + "px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3,1fr)", gap: 0 } }, C.blocks.map((b, i) => /* @__PURE__ */ React.createElement("div", { key: b.title, style: { border: "1px solid #E2E0E6", padding: mobile ? "26px 22px" : "32px 28px", marginLeft: !mobile && i ? -1 : 0, marginTop: mobile && i ? -1 : 0 } }, /* @__PURE__ */ React.createElement(Slash, { w: 28, h: 7 }), /* @__PURE__ */ React.createElement("h2", { style: { font: "700 " + (mobile ? "21px" : "24px") + "/1.2 var(--font-sans)", letterSpacing: "-0.022em", marginTop: 18 } }, b.title), /* @__PURE__ */ React.createElement("p", { style: { font: "400 15px/1.6 var(--font-sans)", color: "#3B3541", marginTop: 12 } }, b.body))))), /* @__PURE__ */ React.createElement("section", { style: { maxWidth: 1120, margin: "0 auto", padding: (mobile ? 44 : 80) + "px " + gut + "px" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#2A1445", color: "#FEFEFE", padding: mobile ? "36px 24px" : "56px 48px", textAlign: mobile ? "left" : "center" } }, /* @__PURE__ */ React.createElement("h2", { style: { font: "700 " + (mobile ? "26px" : "38px") + "/1.15 var(--font-sans)", letterSpacing: "-0.026em" } }, "Sixty to seventy five places. Founding cohort."), /* @__PURE__ */ React.createElement("p", { style: { font: "400 16px/1.6 var(--font-sans)", color: "#C9B9DE", marginTop: 14, maxWidth: 520, marginLeft: mobile ? 0 : "auto", marginRight: mobile ? 0 : "auto" } }, C.ctaNote), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 28, display: "flex", justifyContent: mobile ? "stretch" : "center" } }, /* @__PURE__ */ React.createElement(Btn, { invert: true, full: mobile })))), /* @__PURE__ */ React.createElement("footer", { style: { borderTop: "1px solid #E2E0E6" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1120, margin: "0 auto", padding: "24px " + gut + "px", display: "flex", gap: 16, justifyContent: "space-between", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 20 } }, /* @__PURE__ */ React.createElement("a", { href: "#", style: { font: "500 13px/1.5 var(--font-mono)", color: "#141018", borderBottom: "2px solid #014939" } }, C.instagram), /* @__PURE__ */ React.createElement("a", { href: "#", style: { font: "500 13px/1.5 var(--font-mono)", color: "#6B6474", borderBottom: 0 } }, C.email)), /* @__PURE__ */ React.createElement("span", { style: { font: "400 12px/1.5 var(--font-mono)", color: "#8E8897" } }, C.legal))));
}
Object.assign(window, { PageBold });
(function() {
  var root = ReactDOM.createRoot(document.getElementById("root"));
  var mq = window.matchMedia("(max-width: 760px)");
  var draw = function() {
    root.render(React.createElement(window.PageBold, { mobile: mq.matches }));
  };
  mq.addEventListener ? mq.addEventListener("change", draw) : mq.addListener(draw);
  draw();
})();
