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
function PageEditorial({ mobile }) {
  const C = window.WEC_COPY;
  const serif = '"Newsreader", Georgia, serif';
  const gut = mobile ? 22 : 40;
  const measure = mobile ? "100%" : 680;
  const Slash = ({ w = 15, h = 3 }) => /* @__PURE__ */ React.createElement("span", { style: { display: "inline-block", width: w, height: h, background: "#014939", transform: "skewX(-22deg)", flex: "none" } });
  const Btn = ({ full }) => /* @__PURE__ */ React.createElement("a", { href: "#", style: { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, height: 50, padding: "0 26px", background: "#4F2781", color: "#FEFEFE", font: "600 15px/1 var(--font-sans)", width: full ? "100%" : "auto" } }, /* @__PURE__ */ React.createElement(Slash, { w: 13 }), " ", C.cta);
  return /* @__PURE__ */ React.createElement("div", { style: { background: "#FEFEFE", color: "#141018" } }, /* @__PURE__ */ React.createElement("header", { style: { borderBottom: "3px double #141018" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 900, margin: "0 auto", padding: (mobile ? "22px" : "30px") + " " + gut + "px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" } }, /* @__PURE__ */ React.createElement("img", { src: "../../assets/wec-lockup-horizontal.svg", alt: "Western Entrepreneurs Collective", style: { height: mobile ? 26 : 32 } }), mobile ? null : /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", right: gut, font: "500 12px/1 var(--font-mono)", letterSpacing: "0.14em", textTransform: "uppercase", color: "#8E8897" } }, "No. 01 / Fall 2026"))), /* @__PURE__ */ React.createElement("article", { style: { maxWidth: measure, margin: "0 auto", padding: (mobile ? 36 : 64) + "px " + gut + "px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, justifyContent: mobile ? "flex-start" : "center" } }, /* @__PURE__ */ React.createElement(Slash, null), /* @__PURE__ */ React.createElement("span", { style: { font: "500 12px/1 var(--font-mono)", letterSpacing: "0.14em", textTransform: "uppercase", color: "#6B6474" } }, "The founding proposition")), /* @__PURE__ */ React.createElement("h1", { style: { font: "400 " + (mobile ? "30px" : "44px") + "/1.22 " + serif, letterSpacing: "-0.012em", marginTop: 22, textAlign: mobile ? "left" : "center" } }, C.positioning), /* @__PURE__ */ React.createElement("div", { style: { height: 1, background: "#E2E0E6", margin: (mobile ? 32 : 44) + "px 0" } }), /* @__PURE__ */ React.createElement("p", { style: { font: "400 " + (mobile ? "18px" : "19px") + "/1.7 " + serif, color: "#141018" } }, /* @__PURE__ */ React.createElement("span", { style: { float: "left", font: "400 " + (mobile ? "58px" : "70px") + "/0.78 " + serif, color: "#4F2781", marginRight: 12, marginTop: 6 } }, "W"), "estern Entrepreneurs Collective runs as a program, not as a meeting you can drop into. Sixty to seventy five people a term, every place decided by application, bi-weekly Sunday build sessions from October through March. The point is not to talk about starting something. The point is that by March you have."), /* @__PURE__ */ React.createElement("div", { style: { margin: (mobile ? 34 : 48) + "px 0", paddingLeft: mobile ? 18 : 26, borderLeft: "4px solid #014939" } }, /* @__PURE__ */ React.createElement("p", { style: { font: "400 " + (mobile ? "22px" : "27px") + "/1.35 " + serif, letterSpacing: "-0.012em" } }, "Everyone in front of the room has run the thing they are talking about.")), C.blocks.map((b, i) => /* @__PURE__ */ React.createElement("section", { key: b.title, style: { marginTop: mobile ? 34 : 44 } }, /* @__PURE__ */ React.createElement("span", { style: { font: "500 12px/1 var(--font-mono)", letterSpacing: "0.14em", textTransform: "uppercase", color: "#8E8897" } }, "Section 0", i + 1), /* @__PURE__ */ React.createElement("h2", { style: { font: "600 " + (mobile ? "23px" : "27px") + "/1.25 " + serif, letterSpacing: "-0.012em", marginTop: 10 } }, b.title), /* @__PURE__ */ React.createElement("p", { style: { font: "400 " + (mobile ? "17px" : "18px") + "/1.7 " + serif, color: "#3B3541", marginTop: 12 } }, b.body), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 9, marginTop: 16 } }, b.list.map((l) => /* @__PURE__ */ React.createElement("span", { key: l, style: { display: "flex", gap: 11, alignItems: "baseline", font: "400 16px/1.5 " + serif } }, /* @__PURE__ */ React.createElement(Slash, { w: 11, h: 2 }), " ", l))))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: mobile ? 44 : 64, paddingTop: mobile ? 30 : 40, borderTop: "3px double #141018", textAlign: mobile ? "left" : "center" } }, /* @__PURE__ */ React.createElement("h2", { style: { font: "400 " + (mobile ? "25px" : "31px") + "/1.25 " + serif, letterSpacing: "-0.012em" } }, "The founding cohort opens in October."), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 22, display: "flex", justifyContent: mobile ? "stretch" : "center" } }, /* @__PURE__ */ React.createElement(Btn, { full: mobile })), /* @__PURE__ */ React.createElement("p", { style: { font: "400 14px/1.65 " + serif, color: "#6B6474", marginTop: 12 } }, C.ctaNote))), /* @__PURE__ */ React.createElement("footer", { style: { marginTop: mobile ? 44 : 64, borderTop: "1px solid #E2E0E6" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 900, margin: "0 auto", padding: "22px " + gut + "px", display: "flex", gap: 16, justifyContent: "space-between", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 20 } }, /* @__PURE__ */ React.createElement("a", { href: "#", style: { font: "500 13px/1.5 var(--font-mono)", color: "#141018", borderBottom: "2px solid #014939" } }, C.instagram), /* @__PURE__ */ React.createElement("a", { href: "#", style: { font: "500 13px/1.5 var(--font-mono)", color: "#6B6474", borderBottom: 0 } }, C.email)), /* @__PURE__ */ React.createElement("span", { style: { font: "400 12px/1.5 var(--font-mono)", color: "#8E8897" } }, C.legal))));
}
Object.assign(window, { PageEditorial });
(function() {
  var root = ReactDOM.createRoot(document.getElementById("root"));
  var mq = window.matchMedia("(max-width: 760px)");
  var draw = function() {
    root.render(React.createElement(window.PageEditorial, { mobile: mq.matches }));
  };
  mq.addEventListener ? mq.addEventListener("change", draw) : mq.addListener(draw);
  draw();
})();
