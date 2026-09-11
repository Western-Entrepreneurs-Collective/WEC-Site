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
function PageCohort({ mobile }) {
  const C = window.WEC_COPY;
  const gut = mobile ? 22 : 56;
  const Slash = ({ w = 15, h = 3 }) => /* @__PURE__ */ React.createElement("span", { style: { display: "inline-block", width: w, height: h, background: "#014939", transform: "skewX(-22deg)", flex: "none" } });
  const Btn = ({ full }) => /* @__PURE__ */ React.createElement("a", { href: "#", style: { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, height: 48, padding: "0 26px", background: "#4F2781", color: "#FEFEFE", font: "600 15px/1 var(--font-sans)", width: full ? "100%" : "auto" } }, /* @__PURE__ */ React.createElement(Slash, { w: 13 }), " ", C.cta);
  return /* @__PURE__ */ React.createElement("div", { style: { background: "#FEFEFE", color: "#141018" } }, /* @__PURE__ */ React.createElement("header", { style: { borderBottom: "1px solid #E2E0E6" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1080, margin: "0 auto", padding: "0 " + gut + "px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("img", { src: "../../assets/wec-lockup-horizontal.svg", alt: "Western Entrepreneurs Collective", style: { height: 24 } }), mobile ? null : /* @__PURE__ */ React.createElement("nav", { style: { display: "flex", alignItems: "center", gap: 28 } }, ["The program", "The term", "Join"].map((t, i) => /* @__PURE__ */ React.createElement("a", { key: t, href: "#", style: { font: "500 14px/1 var(--font-sans)", color: i === 2 ? "#141018" : "#6B6474", paddingBottom: 3, borderBottom: i === 2 ? "3px solid #014939" : "3px solid transparent" } }, t))))), /* @__PURE__ */ React.createElement("section", { style: { maxWidth: 1080, margin: "0 auto", padding: (mobile ? 40 : 88) + "px " + gut + "px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 20 } }, /* @__PURE__ */ React.createElement(Slash, null), /* @__PURE__ */ React.createElement("span", { style: { font: "600 12px/1 var(--font-mono)", letterSpacing: "0.14em", textTransform: "uppercase", color: "#6B6474" } }, "Fall 2026 cohort, London Ontario")), /* @__PURE__ */ React.createElement("h1", { style: { font: "700 " + (mobile ? "28px" : "46px") + "/1.16 var(--font-sans)", letterSpacing: "-0.026em", maxWidth: 880 } }, C.positioning), /* @__PURE__ */ React.createElement("div", { style: { marginTop: mobile ? 28 : 36, display: "flex", alignItems: mobile ? "stretch" : "center", gap: 18, flexDirection: mobile ? "column" : "row" } }, /* @__PURE__ */ React.createElement(Btn, { full: mobile }), /* @__PURE__ */ React.createElement("span", { style: { font: "400 13px/1.6 var(--font-sans)", color: "#6B6474", maxWidth: 320 } }, C.ctaNote))), /* @__PURE__ */ React.createElement("section", { style: { borderTop: "2px solid #141018" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1080, margin: "0 auto", padding: "0 " + gut + "px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3,1fr)" } }, C.blocks.map((b, i) => /* @__PURE__ */ React.createElement("div", { key: b.title, style: { padding: mobile ? "28px 0" : "36px 28px 40px", borderLeft: !mobile && i ? "1px solid #E2E0E6" : 0, borderTop: mobile && i ? "1px solid #E2E0E6" : 0, paddingLeft: !mobile && !i ? 0 : void 0 } }, /* @__PURE__ */ React.createElement("span", { style: { font: "500 12px/1 var(--font-mono)", letterSpacing: "0.14em", color: "#8E8897" } }, "0", i + 1), /* @__PURE__ */ React.createElement("h2", { style: { font: "600 20px/1.25 var(--font-sans)", letterSpacing: "-0.018em", marginTop: 12 } }, b.title), /* @__PURE__ */ React.createElement("p", { style: { font: "400 15px/1.6 var(--font-sans)", color: "#3B3541", marginTop: 10 } }, b.body), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginTop: 16 } }, b.list.map((l) => /* @__PURE__ */ React.createElement("span", { key: l, style: { display: "flex", gap: 10, alignItems: "baseline", font: "400 14px/1.5 var(--font-sans)" } }, /* @__PURE__ */ React.createElement(Slash, { w: 11, h: 2 }), " ", l)))))))), /* @__PURE__ */ React.createElement("section", { style: { background: "#F7F6F8", borderTop: "1px solid #E2E0E6" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1080, margin: "0 auto", padding: (mobile ? 36 : 64) + "px " + gut + "px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 20, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("h2", { style: { font: "700 " + (mobile ? "22px" : "28px") + "/1.2 var(--font-sans)", letterSpacing: "-0.02em" } }, "The term"), /* @__PURE__ */ React.createElement("span", { style: { font: "500 13px/1.4 var(--font-mono)", color: "#6B6474" } }, "October to March, bi-weekly Sundays")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3,1fr)", marginTop: 24, border: "1px solid #E2E0E6", background: "#FEFEFE" } }, C.terms.map((t, i) => /* @__PURE__ */ React.createElement("div", { key: t[0], style: { padding: "20px 22px", borderTop: i >= (mobile ? 1 : 3) ? "1px solid #E2E0E6" : 0, borderLeft: !mobile && i % 3 ? "1px solid #E2E0E6" : 0 } }, /* @__PURE__ */ React.createElement("span", { style: { font: "600 12px/1 var(--font-mono)", letterSpacing: "0.14em", textTransform: "uppercase", color: "#4F2781" } }, t[0]), /* @__PURE__ */ React.createElement("p", { style: { font: "400 15px/1.5 var(--font-sans)", color: "#3B3541", marginTop: 10 } }, t[1])))))), /* @__PURE__ */ React.createElement("section", { style: { maxWidth: 1080, margin: "0 auto", padding: (mobile ? 40 : 72) + "px " + gut + "px", textAlign: mobile ? "left" : "center" } }, /* @__PURE__ */ React.createElement("h2", { style: { font: "700 " + (mobile ? "24px" : "32px") + "/1.2 var(--font-sans)", letterSpacing: "-0.022em" } }, "Applications are open for the founding cohort."), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 24, display: "flex", justifyContent: mobile ? "stretch" : "center" } }, /* @__PURE__ */ React.createElement(Btn, { full: mobile })), /* @__PURE__ */ React.createElement("p", { style: { font: "400 13px/1.6 var(--font-sans)", color: "#6B6474", marginTop: 12 } }, C.ctaNote)), /* @__PURE__ */ React.createElement("footer", { style: { borderTop: "1px solid #E2E0E6" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1080, margin: "0 auto", padding: "24px " + gut + "px", display: "flex", gap: 16, justifyContent: "space-between", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 20 } }, /* @__PURE__ */ React.createElement("a", { href: "#", style: { font: "500 13px/1.5 var(--font-mono)", color: "#141018", borderBottom: "2px solid #014939" } }, C.instagram), /* @__PURE__ */ React.createElement("a", { href: "#", style: { font: "500 13px/1.5 var(--font-mono)", color: "#6B6474", borderBottom: 0 } }, C.email)), /* @__PURE__ */ React.createElement("span", { style: { font: "400 12px/1.5 var(--font-mono)", color: "#8E8897" } }, C.legal))));
}
Object.assign(window, { PageCohort });
(function() {
  var root = ReactDOM.createRoot(document.getElementById("root"));
  var mq = window.matchMedia("(max-width: 760px)");
  var draw = function() {
    root.render(React.createElement(window.PageCohort, { mobile: mq.matches }));
  };
  mq.addEventListener ? mq.addEventListener("change", draw) : mq.addListener(draw);
  draw();
})();
