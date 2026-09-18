/**
 * WEC Executive Applications 2026-27: every question, its limit, and the link
 * to the club's Google Form. ONE file, read by BOTH sides:
 *
 *   - the browser (exec-applications/exec-applications.js) loads it as a plain
 *     script and reads window.WEC_EXEC_APPLICATIONS, to draw the pages and check
 *     answers as they are typed;
 *   - the server (api/exec-applications.js) requires it, to check the answers
 *     AGAIN and do
 *     the actual sending.
 *
 * No build step, no bundler, no imports. That is the whole convention of this
 * site and this file keeps it.
 *
 * ONE SETTING CONNECTS IT
 *
 *   WEC_APPLY_GOOGLE_FORM_URL  =  the Google Form's PRE-FILLED LINK.
 *
 * In the Form: the ⋮ menu -> "Get pre-filled link", type the placeholder word
 * below into each question, pick "1st Year" for year and "VP Content" for the
 * position, press "Get link", copy it. That link carries the Form's id and the
 * hidden entry number of every question, so nobody has to dig through page
 * source. Full steps are in docs/APPLICATIONS-FORM.md.
 *
 * It is SERVER SIDE ONLY. The browser never sees the Form's address and never
 * posts to Google itself: see api/exec-applications.js for why that matters.
 */
(function (root) {
  "use strict";

  // ─── Positions ─────────────────────────────────────────────────────────────
  // key    : what is stored and sent, and what the flow routes on.
  // title  : the exact wording the applicant and the Google Form both use.
  // group  : the two headings the role cards are listed under.
  // sub    : the line under the title on the role questions page.
  // desc   : the one line on the card.
  // qs     : ONLY this role's questions. The flow shows nothing else. There is
  //          no hidden set of other roles' questions anywhere in the page.
  var ROLES = [
    {
      key: "vp-content", title: "VP Content", group: "Vice Presidents",
      sub: "You'll own what WEC creates and how the world sees us.",
      desc: "What WEC makes and posts. Series, campaigns, the feed.",
      qs: [
        { id: "r1", label: "Why do you want to lead Content for WEC?", max: 250 },
        { id: "r2", label: "If you were given complete creative freedom, what would you change or add to WEC's content strategy this year?", max: 250 },
        { id: "r3", label: "Pitch a content series or campaign that could make students want to follow WEC, attend our events, or join the community.", max: 200 },
        { id: "r4", label: "What is something you have created that you are genuinely proud of? What made it successful?", max: 150 }
      ]
    },
    {
      key: "vp-communications", title: "VP Communications", group: "Vice Presidents",
      sub: "You'll own how WEC talks to Western, and whether anyone acts on it.",
      desc: "Announcements, membership growth, turning interest into attendance.",
      qs: [
        { id: "r1", label: "Why do you want to lead Communications for WEC?", max: 250 },
        { id: "r2", label: "How would you use communication to increase WEC membership and turn interested students into active members?", max: 250 },
        { id: "r3", label: "Write an announcement that would make a busy Western student genuinely want to attend a WEC event.", max: 150 },
        { id: "r4", label: "Tell us about a time you successfully communicated an idea, message, or opportunity and got people to act on it.", max: 150 }
      ]
    },
    {
      key: "vp-community", title: "VP Community", group: "Vice Presidents",
      sub: "You'll own whether this feels like a founder community or another club.",
      desc: "Members knowing each other. Belonging, retention, the room.",
      qs: [
        { id: "r1", label: "Why do you want to lead Community for WEC?", max: 250 },
        { id: "r2", label: "How would you make WEC feel like a real founder community rather than another student club?", max: 250 },
        { id: "r3", label: "Design one initiative that would help WEC members build meaningful relationships with each other.", max: 200 },
        { id: "r4", label: "Imagine engagement is strong in September but drops significantly halfway through the year. What would you do?", max: 200 }
      ]
    },
    {
      key: "director-admin", title: "Director of Admin", group: "Directors & Coordinators",
      sub: "You'll make sure nothing agreed in a meeting quietly disappears.",
      desc: "Systems, follow-through, the record of who is doing what.",
      qs: [
        { id: "r1", label: "Why are you interested in the Director of Admin role?", max: 150 },
        { id: "r2", label: "Imagine an exec meeting ends with 15 action items across different people. What system would you create to make sure nothing gets forgotten?", max: 200 },
        { id: "r3", label: "Tell us about a time you had to keep yourself or a team organized while managing multiple responsibilities.", max: 150 }
      ]
    },
    {
      key: "event-experience", title: "Event Experience Coordinator", group: "Directors & Coordinators",
      sub: "You'll own what an evening actually feels like from the door onward.",
      desc: "The experience, not the agenda. Arrival to leaving.",
      qs: [
        { id: "r1", label: "Why are you interested in Event Experience?", max: 150 },
        { id: "r2", label: "Design a WEC event that you would genuinely want to attend. What would the experience look and feel like from arrival to leaving?", max: 250 },
        { id: "r3", label: "What separates a memorable event from an event that simply delivers information?", max: 150 }
      ]
    },
    {
      key: "director-logistics", title: "Director of Logistics", group: "Directors & Coordinators",
      sub: "You'll be the reason an event runs when three things go wrong at once.",
      desc: "Rooms, food, gear, timing, and the fix under pressure.",
      qs: [
        { id: "r1", label: "Why are you interested in Logistics?", max: 150 },
        { id: "r2", label: "Imagine you arrive 30 minutes before a major event. The room setup is wrong, food hasn't arrived, and the speaker's presentation won't connect to the projector. What do you do first, and why?", max: 200 },
        { id: "r3", label: "Tell us about a time you had to solve a problem under pressure.", max: 150 }
      ]
    },
    {
      key: "director-finops", title: "Director of Financial Operations", group: "Directors & Coordinators",
      sub: "You'll know where the money went before anyone has to ask.",
      desc: "Budgets, spend, receipts, and saying no early enough to matter.",
      qs: [
        { id: "r1", label: "Why are you interested in Financial Operations?", max: 150 },
        { id: "r2", label: "WEC has a $5,000 event budget. Three weeks into planning, $4,000 has already been committed. What would you do?", max: 200 },
        { id: "r3", label: "Tell us about a time you worked with numbers, budgets, spreadsheets, or financial information.", max: 150 }
      ]
    },
    {
      key: "speaker-acquisition", title: "Speaker Acquisition Coordinator", group: "Directors & Coordinators",
      sub: "You'll get founders worth hearing into a room at Western.",
      desc: "Cold outreach to people who owe you nothing, and a yes.",
      qs: [
        { id: "r1", label: "Why are you interested in Speaker Acquisition?", max: 150 },
        { id: "r2", label: "Choose a founder or entrepreneur you would want to bring to WEC. Who are they, why would students care, and how would you convince them to say yes?", max: 200 },
        { id: "r3", label: "Write the first outreach message you would send to a founder you've never spoken to.", max: 150 }
      ]
    },
    {
      key: "outreach", title: "Outreach Coordinator", group: "Directors & Coordinators",
      sub: "You'll reach the students who have never heard of us.",
      desc: "First message, follow-up, and a process that survives 100 of them.",
      qs: [
        { id: "r1", label: "Why are you interested in Outreach?", max: 150 },
        { id: "r2", label: "You have 100 potential students to contact. Walk us through your process from first message to follow-up.", max: 200 },
        { id: "r3", label: "Write a short message to a Western student who has never heard of WEC that would make them curious enough to learn more.", max: 100 }
      ]
    },
    {
      key: "director-video", title: "Director of Video", group: "Directors & Coordinators",
      sub: "You'll make the thing people stop scrolling for.",
      desc: "Short video. Shooting, cutting, and knowing what earns a watch.",
      qs: [
        { id: "r1", label: "Why are you interested in Video?", max: 150 },
        { id: "r2", label: "WEC gives you 60 seconds to make a video that shows Western students why they should join WEC. What would you create?", max: 200 },
        { id: "r3", label: "What makes a social media video worth watching instead of scrolling past?", max: 150 }
      ],
      // The only role with a fifth answer. It is optional, and it is a link, not
      // a file, for the same reason the resume is: see RESUME below.
      link: { id: "rlink", label: "A link to your work", hint: "Optional. A reel, a YouTube channel, a Drive folder, anything that plays." }
    },
    {
      key: "email-newsletter", title: "Email & Newsletter Coordinator", group: "Directors & Coordinators",
      sub: "You'll write the email people actually open.",
      desc: "The newsletter, the subject line, and a reason to open it.",
      qs: [
        { id: "r1", label: "Why are you interested in Email & Newsletter?", max: 150 },
        { id: "r2", label: "Imagine WEC hasn't sent an email in over a month. What would you put in the next newsletter?", max: 200 },
        { id: "r3", label: "Write a subject line that would make a busy Western student open a WEC email.", max: 50 }
      ]
    },
    {
      key: "director-engagement", title: "Director of Engagement", group: "Directors & Coordinators",
      sub: "You'll turn a member list into people who keep showing up.",
      desc: "The gap between 300 signed up and 30 in the room.",
      qs: [
        { id: "r1", label: "Why are you interested in Engagement?", max: 150 },
        { id: "r2", label: "WEC has 300 members, but only 30 consistently show up. What would you do?", max: 250 },
        { id: "r3", label: "Design one initiative that would help members build genuine relationships with each other.", max: 150 }
      ]
    }
  ];

  var GROUPS = ["Vice Presidents", "Directors & Coordinators"];

  // ─── The questions everyone answers ────────────────────────────────────────
  // ph: the word typed into that question when making the pre-filled link. It is
  //     how the entry.NNN number is found again without reading Google's HTML.
  var YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate", "Other"];

  var ABOUT = [
    { id: "name", label: "Full name", ph: "NAME", req: true, kind: "text", placeholder: "Amara Osei" },
    { id: "westernEmail", label: "Western email", ph: "WESTERNEMAIL", req: true, kind: "email", rule: "western", placeholder: "you@uwo.ca", hint: "We reply here first." },
    { id: "personalEmail", label: "Personal email", ph: "PERSONALEMAIL", req: true, kind: "email", rule: "any", placeholder: "you@gmail.com", hint: "In case your Western mail is full or you graduate." },
    { id: "phone", label: "Phone number", ph: "PHONE", req: false, kind: "phone", placeholder: "519 555 0134", hint: "Optional. Only used if we are trying to reach you about an interview." },
    { id: "year", label: "Year of study", ph: null, req: true, kind: "select", choices: YEARS },
    { id: "program", label: "Program / faculty", ph: "PROGRAM", req: true, kind: "text", placeholder: "Ivey HBA, Computer Science, Health Sci" },
    { id: "linkedin", label: "LinkedIn", ph: "LINKEDIN", req: false, kind: "url", placeholder: "https://linkedin.com/in/", hint: "Optional." },
    { id: "portfolio", label: "Portfolio or website", ph: "PORTFOLIO", req: false, kind: "url", placeholder: "https://", hint: "Optional." },
    // RESUME IS A LINK, NOT AN UPLOAD, AND THAT IS A DECISION, NOT AN OVERSIGHT.
    // TODO(club): a real file upload needs a Google Drive service account the
    // club does not have yet, and Google Forms' own file-upload question forces
    // every applicant to sign in to a Google account before it will accept the
    // form at all. Both were judged worse than asking for a link. When the club
    // has Drive credentials, this field becomes an upload and the Form question
    // becomes a file question, and nothing else on this page has to change.
    {
      id: "resume", label: "Resume link", ph: "RESUME", req: true, kind: "url",
      placeholder: "https://drive.google.com/...",
      hint: "Required. Paste a link to your resume: a Google Drive or Dropbox file set to \"anyone with the link\", a LinkedIn profile, or your own site. We do not take file uploads."
    },
    {
      id: "intro", label: "Short introduction", ph: "INTRO", req: true, kind: "long", max: 150,
      hint: "Give us a quick introduction. Who are you, and what are you currently building, exploring, or interested in?"
    }
  ];

  var GENERAL = [
    { id: "g1", ph: "GENERAL1", req: true, kind: "long", max: 250, label: "Pitch yourself as if you were a startup. What makes you different, what problem do you solve, and why should WEC want you on the team?" },
    { id: "g2", ph: "GENERAL2", req: true, kind: "long", max: 250, label: "What are you most proud of?" }
  ];

  // The role answers all go into the SAME five Form questions, whichever role is
  // chosen. Twelve roles times four questions would be forty-odd questions in
  // one Form, and a Sheet with forty mostly-empty columns. The role column says
  // which role, and each answer is sent with its own question text above it so a
  // reader of the Sheet never has to cross-reference anything.
  var ROLE_SLOTS = [
    { id: "r1", ph: "ROLE1" }, { id: "r2", ph: "ROLE2" },
    { id: "r3", ph: "ROLE3" }, { id: "r4", ph: "ROLE4" },
    { id: "rlink", ph: "ROLELINK" }
  ];

  var ROLE_FIELD = { id: "role", ph: null, label: "Position applied for", choices: ROLES.map(function (r) { return r.title; }) };

  // Every field the site can send, in the order it appears in the Sheet.
  var FIELDS = ABOUT.concat(GENERAL).concat([ROLE_FIELD]).concat(ROLE_SLOTS);

  // Required in the Form's eyes. The role questions are required of the
  // applicant but share slots, so they are checked by the flow, not by entry id.
  var REQUIRED = ["name", "westernEmail", "personalEmail", "year", "program", "resume", "intro", "g1", "g2", "role", "r1", "r2", "r3"];

  // Long enough for the longest answer plus its question text, short enough that
  // nobody can post a novel. 250 words is about 1,700 characters. An answer over
  // it is REFUSED with a sentence saying so, never cut short: a silently
  // truncated answer is an applicant's words changed without them knowing.
  var MAX_CHARS = 8000;

  function tooLong(text) {
    var n = String(text || "").length;
    return n > MAX_CHARS
      ? "That is " + n.toLocaleString("en-US") + " characters. The most one answer can hold is " + MAX_CHARS.toLocaleString("en-US") + "."
      : null;
  }

  function roleByKey(key) {
    for (var i = 0; i < ROLES.length; i++) if (ROLES[i].key === key) return ROLES[i];
    return null;
  }
  function roleByTitle(title) {
    for (var i = 0; i < ROLES.length; i++) if (ROLES[i].title === title) return ROLES[i];
    return null;
  }

  function blank() {
    var v = {};
    FIELDS.forEach(function (f) { v[f.id] = ""; });
    v.roleKey = "";
    return v;
  }

  // ─── Words ─────────────────────────────────────────────────────────────────
  function words(text) {
    var t = String(text || "").trim();
    return t ? t.split(/\s+/).length : 0;
  }

  // ─── Email ─────────────────────────────────────────────────────────────────
  // uwo.ca and every *.uwo.ca (huron, kings, brescia), plus ivey.ca. Lifted from
  // the sign up form on the other WEC site, where it was checked against real
  // Western addresses.
  var WESTERN_DOMAIN = /(^|\.)(uwo\.ca|ivey\.ca)$/;
  var TYPOS = [
    [/^(uwo\.com|uwo\.co|uwo\.c|uwo\.cs|uow\.ca|uwo\.xa|uwo\.ca\.)$/, "uwo.ca"],
    [/^(gmial|gmai|gamil|gnail)\.com$/, "gmail.com"]
  ];

  function emailProblem(raw, rule) {
    var email = String(raw || "").trim().toLowerCase();
    if (!email) return rule === "western" ? "Please enter your Western email." : "Please enter an email address.";
    if (/\s/.test(email)) return "Your email has a space in it. Please remove it.";
    var at = email.split("@");
    if (at.length !== 2 || !at[0]) return "That doesn't look like an email. It needs one @, like you@uwo.ca.";
    var domain = at[1];
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(domain)) return "The part after the @ looks incomplete. It should look like uwo.ca.";
    for (var i = 0; i < TYPOS.length; i++) if (TYPOS[i][0].test(domain)) return "Did you mean @" + TYPOS[i][1] + "? Please check the spelling.";
    if (rule === "western" && !WESTERN_DOMAIN.test(domain)) {
      return "Please use your Western email, like you@uwo.ca. Ivey, Huron, King's and Brescia emails work too.";
    }
    return null;
  }

  function linkProblem(raw, required) {
    var value = String(raw || "").trim();
    if (!value) return required ? "Please paste a link." : null;
    if (tooLong(value)) return tooLong(value);
    if (!/^https?:\/\//i.test(value)) return "Please start the link with https:// so it opens.";
    if (!/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(value)) return "That doesn't look like a complete link.";
    return null;
  }

  // ─── Phone ─────────────────────────────────────────────────────────────────
  // Optional, so an empty box is fine. Typed, it has to be a number somebody
  // could actually dial: a leading + is allowed, and so are the spaces, dashes,
  // dots and brackets people really type, but nothing else. Ten to fifteen
  // digits covers a North American number and an international one, and rules
  // out a birth year typed into the wrong box.
  function phoneProblem(raw, required) {
    var value = String(raw || "").trim();
    if (!value) return required ? "Please enter a phone number." : null;
    if (/[^0-9+()\-.\s]/.test(value)) return "A phone number can only have digits, spaces, brackets, dashes and a leading +.";
    if (/\+/.test(value.slice(1))) return "The + belongs at the very start, like +1 519 555 0134.";
    var digits = value.replace(/\D/g, "");
    if (digits.length < 10) return "That is too short for a phone number. Please include the area code.";
    if (digits.length > 15) return "That is too long for a phone number. Please check it.";
    return null;
  }

  // ─── Checking a step ───────────────────────────────────────────────────────
  // Returns { fieldId: "plain sentence" }. Empty means the step is fine.
  // The SAME function runs in the browser as you type and on the server before
  // anything is sent, so the two can never disagree.
  function checkField(field, value) {
    var text = String(value || "").trim();
    if (tooLong(text)) return tooLong(text);
    if (field.kind === "email") return emailProblem(text, field.rule);
    if (field.kind === "phone") return phoneProblem(text, field.req);
    if (field.kind === "url") return linkProblem(text, field.req);
    if (field.kind === "select") {
      if (!text) return "Please pick one.";
      if (field.choices.indexOf(text) < 0) return "Please pick one of the options.";
      return null;
    }
    if (!text && field.req) return "This one is required.";
    if (field.max) {
      var n = words(text);
      if (n > field.max) return "That is " + n + " words. The limit is " + field.max + ".";
    }
    return null;
  }

  function checkAbout(v) {
    var errors = {};
    ABOUT.forEach(function (f) {
      if (!f.req && !String(v[f.id] || "").trim()) return;
      var problem = checkField(f, v[f.id]);
      if (problem) errors[f.id] = problem;
    });
    return errors;
  }

  function checkGeneral(v) {
    var errors = {};
    GENERAL.forEach(function (f) {
      var problem = checkField(f, v[f.id]);
      if (problem) errors[f.id] = problem;
    });
    return errors;
  }

  function checkRoleChoice(v) {
    return roleByKey(v.roleKey) ? {} : { role: "Please choose the one position you are applying for." };
  }

  function checkRoleAnswers(v) {
    var role = roleByKey(v.roleKey);
    var errors = {};
    if (!role) return { role: "Please choose a position first." };
    role.qs.forEach(function (q) {
      var problem = checkField({ id: q.id, req: true, kind: "long", max: q.max }, v[q.id]);
      if (problem) errors[q.id] = problem;
    });
    if (role.link) {
      var problem = linkProblem(v[role.link.id], false);
      if (problem) errors[role.link.id] = problem;
    }
    return errors;
  }

  function checkEverything(v) {
    var errors = {};
    [checkAbout(v), checkGeneral(v), checkRoleChoice(v), checkRoleAnswers(v)].forEach(function (part) {
      for (var k in part) if (Object.prototype.hasOwnProperty.call(part, k)) errors[k] = part[k];
    });
    return errors;
  }

  // ─── The Form ──────────────────────────────────────────────────────────────
  // Turns the pre-filled link into { action, entries } or a plain reason why not.
  function parseForm(value) {
    var raw = String(value || "").trim();
    if (!raw) return { ok: false, reason: "not set" };
    var url;
    try { url = new URL(raw); } catch (e) { return { ok: false, reason: "not a link" }; }
    if (!/\/forms\/d\/e\/[^/]+\/viewform$/.test(url.pathname)) {
      return { ok: false, reason: "not a Google Form pre-filled link (it should contain /forms/d/e/.../viewform)" };
    }
    var entries = {};
    url.searchParams.forEach(function (answer, key) {
      if (!/^entry\.\d+$/.test(key)) return;
      var text = String(answer).trim();
      if (YEARS.indexOf(text) > -1) { entries.year = key; return; }
      if (roleByTitle(text)) { entries.role = key; return; }
      FIELDS.forEach(function (f) {
        if (f.ph && text.toUpperCase() === f.ph) entries[f.id] = key;
      });
    });
    var missing = REQUIRED.filter(function (id) { return !entries[id]; });
    if (missing.length) return { ok: false, reason: "the pre-filled link is missing: " + missing.join(", ") };
    var viewUrl = url.origin + url.pathname;
    return { ok: true, viewUrl: viewUrl, action: viewUrl.replace(/viewform$/, "formResponse"), entries: entries };
  }

  // ─── What actually gets sent ───────────────────────────────────────────────
  // The role answers carry their own question text, so the Sheet reads as a
  // document rather than as "Role Q2" with no idea what Q2 was for that role.
  function answersToSend(v) {
    var role = roleByKey(v.roleKey);
    var out = {};
    ABOUT.concat(GENERAL).forEach(function (f) {
      var text = String(v[f.id] || "").trim();
      if (text) out[f.id] = text;
    });
    if (role) {
      out.role = role.title;
      role.qs.forEach(function (q) {
        var text = String(v[q.id] || "").trim();
        if (text) out[q.id] = q.label + "\n\n" + text;
      });
      if (role.link) {
        var link = String(v[role.link.id] || "").trim();
        if (link) out[role.link.id] = link;
      }
    }
    return out;
  }

  // Untrusted JSON in, trimmed answers out, or null if it is not an application
  // at all. Nothing is truncated here: checkField refuses an over-long answer
  // with its own sentence, so the applicant is told instead of silently cut.
  function cleanSubmission(body) {
    if (!body || typeof body !== "object") return null;
    var v = blank();
    var keys = Object.keys(v);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (body[k] === undefined) continue;
      if (typeof body[k] !== "string") return null;
      v[k] = body[k].trim();
    }
    if (typeof body.roleKey !== "string" || !roleByKey(body.roleKey)) return null;
    return v;
  }

  var API = {
    ROLES: ROLES, GROUPS: GROUPS, YEARS: YEARS, ABOUT: ABOUT, GENERAL: GENERAL,
    ROLE_SLOTS: ROLE_SLOTS, ROLE_FIELD: ROLE_FIELD, FIELDS: FIELDS, REQUIRED: REQUIRED,
    MAX_CHARS: MAX_CHARS,
    roleByKey: roleByKey, roleByTitle: roleByTitle, blank: blank, words: words,
    emailProblem: emailProblem, linkProblem: linkProblem, phoneProblem: phoneProblem,
    checkField: checkField,
    checkAbout: checkAbout, checkGeneral: checkGeneral, checkRoleChoice: checkRoleChoice,
    checkRoleAnswers: checkRoleAnswers, checkEverything: checkEverything,
    parseForm: parseForm, answersToSend: answersToSend, cleanSubmission: cleanSubmission
  };

  if (typeof module !== "undefined" && module.exports) module.exports = API;
  if (root) root.WEC_EXEC_APPLICATIONS = API;
})(typeof window !== "undefined" ? window : null);
