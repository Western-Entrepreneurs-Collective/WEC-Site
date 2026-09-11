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
function PageRestraint({ mobile }) {
  const C = window.WEC_COPY;
  const pad = mobile ? "28px 22px" : "72px 40px";
  const measure = mobile ? "100%" : 620;
  const h1 = mobile ? "27px" : "38px";
  const Slash = ({ w = 15, h = 3 }) => /* @__PURE__ */ React.createElement("span", { style: { display: "inline-block", width: w, height: h, background: "#014939", transform: "skewX(-22deg)", flex: "none" } });
  const CTA = ({ top }) => /* @__PURE__ */ React.createElement("div", { style: { marginTop: top } }, /* @__PURE__ */ React.createElement("a", { href: "#", style: { display: "inline-flex", alignItems: "center", gap: 10, height: mobile ? 48 : 46, padding: mobile ? "0 22px" : "0 24px", background: "#4F2781", color: "#FEFEFE", font: "600 " + (mobile ? "16px" : "15px") + "/1 var(--font-sans)", border: 0, width: mobile ? "100%" : "auto", justifyContent: mobile ? "center" : "flex-start" } }, /* @__PURE__ */ React.createElement(Slash, { w: 13 }), " ", C.cta), /* @__PURE__ */ React.createElement("p", { style: { font: "400 13px/1.6 var(--font-sans)", color: "#6B6474", marginTop: 12, maxWidth: 380 } }, C.ctaNote));
  return /* @__PURE__ */ React.createElement("div", { style: { background: "#FEFEFE", color: "#141018", minHeight: "100%" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: measure, margin: "0 auto", padding: pad } }, /* @__PURE__ */ React.createElement("img", { src: "../../assets/wec-lockup-horizontal.svg", alt: "Western Entrepreneurs Collective", style: { height: mobile ? 28 : 34, display: "block" } }), /* @__PURE__ */ React.createElement("h1", { style: { font: "400 " + h1 + "/1.32 var(--font-sans)", letterSpacing: "-0.02em", marginTop: mobile ? 40 : 64, textWrap: "pretty" } }, C.positioning), /* @__PURE__ */ React.createElement(CTA, { top: mobile ? 32 : 40 }), /* @__PURE__ */ React.createElement("div", { style: { height: 4, background: "#014939", transform: "skewX(-22deg)", width: 64, margin: (mobile ? 56 : 88) + "px 0 0" } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: mobile ? 36 : 44, marginTop: mobile ? 36 : 44 } }, C.blocks.map((b, i) => /* @__PURE__ */ React.createElement("div", { key: b.title }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { font: "500 12px/1 var(--font-mono)", letterSpacing: "0.14em", color: "#8E8897" } }, "0", i + 1), /* @__PURE__ */ React.createElement("h2", { style: { font: "600 " + (mobile ? "19px" : "21px") + "/1.3 var(--font-sans)", letterSpacing: "-0.018em" } }, b.title)), /* @__PURE__ */ React.createElement("p", { style: { font: "400 " + (mobile ? "16px" : "17px") + "/1.6 var(--font-sans)", color: "#3B3541", marginTop: 10 } }, b.body)))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: mobile ? 52 : 80, paddingTop: mobile ? 32 : 40, borderTop: "1px solid #E2E0E6" } }, /* @__PURE__ */ React.createElement(CTA, { top: 0 })), /* @__PURE__ */ React.createElement("div", { style: { marginTop: mobile ? 48 : 72, paddingTop: 20, borderTop: "1px solid #E2E0E6", display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 20 } }, /* @__PURE__ */ React.createElement("a", { href: "#", style: { font: "500 13px/1.5 var(--font-mono)", color: "#141018", borderBottom: "2px solid #014939" } }, C.instagram), /* @__PURE__ */ React.createElement("a", { href: "#", style: { font: "500 13px/1.5 var(--font-mono)", color: "#6B6474", borderBottom: 0 } }, C.email)), /* @__PURE__ */ React.createElement("span", { style: { font: "400 12px/1.5 var(--font-mono)", color: "#8E8897" } }, "2026")), /* @__PURE__ */ React.createElement("p", { style: { font: "400 12px/1.6 var(--font-mono)", color: "#8E8897", marginTop: 14 } }, C.legal)));
}
Object.assign(window, { PageRestraint });
(function() {
  var root = ReactDOM.createRoot(document.getElementById("root"));
  var mq = window.matchMedia("(max-width: 760px)");
  var draw = function() {
    root.render(React.createElement(window.PageRestraint, { mobile: mq.matches }));
  };
  mq.addEventListener ? mq.addEventListener("change", draw) : mq.addListener(draw);
  draw();
})();
