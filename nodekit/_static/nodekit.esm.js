var hr = Object.defineProperty;
var dr = (n, e, t) => e in n ? hr(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var X = (n, e, t) => dr(n, typeof e != "symbol" ? e + "" : e, t);
class pr {
  constructor(e, t, i, s, r, c, a, h) {
    this.tArmed = null, this.region = {
      x: e,
      y: t,
      w: i,
      h: s,
      mask: r
    };
    const u = (p) => {
      if (!this.tArmed)
        return;
      const O = h.getBoardLocationFromMouseEvent(p);
      if (!this.checkPointInRegion(O.x, O.y))
        return;
      const H = {
        action_type: "ClickAction",
        x: O.x,
        y: O.y
      };
      c(
        H,
        performance.now()
      );
    };
    a.addEventListener(
      "mousedown",
      u,
      {
        capture: !0
        // Capture phase to get the event before it might be stopped by children.
      }
    );
  }
  checkPointInRegion(e, t) {
    const i = this.region;
    switch (i.mask) {
      case "rectangle":
        const s = i.x - i.w / 2, r = i.x + i.w / 2, c = i.y + i.h / 2, a = i.y - i.h / 2;
        return e >= s && e <= r && t >= a && t <= c;
      case "ellipse":
        const h = i.w / 2, u = i.h / 2, p = e - i.x, O = t - i.y;
        return p * p / (h * h) + O * O / (u * u) <= 1;
      default:
        throw new Error(`Unknown mask: ${i.mask}`);
    }
  }
  arm() {
    this.tArmed = performance.now();
  }
  destroy() {
    this.tArmed = null;
  }
}
class fr {
  constructor(e) {
    this.onSensorFired = e;
  }
  arm() {
    const e = {
      action_type: "TimeoutAction"
    };
    this.onSensorFired(e, performance.now());
  }
  destroy() {
  }
}
class gr {
  constructor(e, t) {
    this.tArmed = null, this.onKeyPress = (i) => {
      if (!this.tArmed)
        return;
      i.preventDefault();
      let s = i.key;
      if (!this.keys.includes(s))
        return;
      const r = {
        action_type: "KeyAction",
        key: s
      };
      this.onSensorFired(r, performance.now());
    }, this.onSensorFired = e, this.keys = [t], document.addEventListener("keydown", this.onKeyPress);
  }
  arm() {
    this.tArmed = performance.now();
  }
  destroy() {
    this.tArmed = null, document.removeEventListener("keydown", this.onKeyPress);
  }
}
class $i {
  constructor(e, t) {
    this.card = e, this.boardCoords = t, this.root = document.createElement("div"), this.root.classList.add("card");
    const { leftPx: i, topPx: s } = t.getBoardLocationPx(
      this.card.x,
      this.card.y,
      this.card.w,
      this.card.h
    ), { widthPx: r, heightPx: c } = t.getBoardRectanglePx(
      this.card.w,
      this.card.h
    );
    this.root.style.left = `${i}px`, this.root.style.top = `${s}px`, this.root.style.width = `${r}px`, this.root.style.height = `${c}px`, this.setVisibility(!1), this.setInteractivity(!1);
  }
  async prepare(e) {
  }
  setVisibility(e) {
    e ? this.root.classList.remove("card--hidden") : this.root.classList.add("card--hidden");
  }
  setInteractivity(e) {
    e ? this.root.classList.remove("card--noninteractive") : this.root.classList.add("card--noninteractive");
  }
  onStart() {
  }
  onStop() {
  }
  onDestroy() {
  }
}
class mr extends $i {
  async prepare(e) {
    this.imageContainer = document.createElement("div"), this.imageContainer.classList.add("image-card"), this.root.appendChild(this.imageContainer), this.image = await e.getImage(
      this.card.image
    ), this.image.classList.add("image-card__content"), this.image.draggable = !1, this.imageContainer.appendChild(this.image);
  }
}
function Fi() {
  return {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null
  };
}
var vt = Fi();
function Us(n) {
  vt = n;
}
var wn = { exec: () => null };
function $(n, e = "") {
  let t = typeof n == "string" ? n : n.source;
  const i = {
    replace: (s, r) => {
      let c = typeof r == "string" ? r : r.source;
      return c = c.replace(pe.caret, "$1"), t = t.replace(s, c), i;
    },
    getRegex: () => new RegExp(t, e)
  };
  return i;
}
var pe = {
  codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
  outputLinkReplace: /\\([\[\]])/g,
  indentCodeCompensation: /^(\s+)(?:```)/,
  beginningSpace: /^\s+/,
  endingHash: /#$/,
  startingSpaceChar: /^ /,
  endingSpaceChar: / $/,
  nonSpaceChar: /[^ ]/,
  newLineCharGlobal: /\n/g,
  tabCharGlobal: /\t/g,
  multipleSpaceGlobal: /\s+/g,
  blankLine: /^[ \t]*$/,
  doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
  blockquoteStart: /^ {0,3}>/,
  blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
  blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
  listReplaceTabs: /^\t+/,
  listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
  listIsTask: /^\[[ xX]\] /,
  listReplaceTask: /^\[[ xX]\] +/,
  anyLine: /\n.*\n/,
  hrefBrackets: /^<(.*)>$/,
  tableDelimiter: /[:|]/,
  tableAlignChars: /^\||\| *$/g,
  tableRowBlankLine: /\n[ \t]*$/,
  tableAlignRight: /^ *-+: *$/,
  tableAlignCenter: /^ *:-+: *$/,
  tableAlignLeft: /^ *:-+ *$/,
  startATag: /^<a /i,
  endATag: /^<\/a>/i,
  startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
  endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
  startAngleBracket: /^</,
  endAngleBracket: />$/,
  pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
  unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
  escapeTest: /[&<>"']/,
  escapeReplace: /[&<>"']/g,
  escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
  escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
  unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
  caret: /(^|[^\[])\^/g,
  percentDecode: /%25/g,
  findPipe: /\|/g,
  splitPipe: / \|/,
  slashPipe: /\\\|/g,
  carriageReturn: /\r\n|\r/g,
  spaceLine: /^ +$/gm,
  notSpaceStart: /^\S*/,
  endingNewline: /\n$/,
  listItemRegex: (n) => new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`),
  nextBulletRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
  hrRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
  fencesBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}(?:\`\`\`|~~~)`),
  headingBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}#`),
  htmlBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}<(?:[a-z].*>|!--)`, "i")
}, wr = /^(?:[ \t]*(?:\n|$))+/, br = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, xr = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, xn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, yr = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Vi = /(?:[*+-]|\d{1,9}[.)])/, zs = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Hs = $(zs).replace(/bull/g, Vi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), kr = $(zs).replace(/bull/g, Vi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), ji = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Er = /^[^\n]+/, Gi = /(?!\s*\])(?:\\.|[^\[\]\\])+/, vr = $(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Gi).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), _r = $(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Vi).getRegex(), ei = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Wi = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Sr = $(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", Wi).replace("tag", ei).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), $s = $(ji).replace("hr", xn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ei).getRegex(), Tr = $(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", $s).getRegex(), qi = {
  blockquote: Tr,
  code: br,
  def: vr,
  fences: xr,
  heading: yr,
  hr: xn,
  html: Sr,
  lheading: Hs,
  list: _r,
  newline: wr,
  paragraph: $s,
  table: wn,
  text: Er
}, rs = $(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", xn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ei).getRegex(), Ar = {
  ...qi,
  lheading: kr,
  table: rs,
  paragraph: $(ji).replace("hr", xn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", rs).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ei).getRegex()
}, Rr = {
  ...qi,
  html: $(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", Wi).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: wn,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: $(ji).replace("hr", xn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Hs).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, Cr = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Or = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Fs = /^( {2,}|\\)\n(?!\s*$)/, Mr = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, ti = /[\p{P}\p{S}]/u, Xi = /[\s\p{P}\p{S}]/u, Vs = /[^\s\p{P}\p{S}]/u, Lr = $(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Xi).getRegex(), js = /(?!~)[\p{P}\p{S}]/u, Ir = /(?!~)[\s\p{P}\p{S}]/u, Dr = /(?:[^\s\p{P}\p{S}]|~)/u, Pr = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, Gs = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Nr = $(Gs, "u").replace(/punct/g, ti).getRegex(), Br = $(Gs, "u").replace(/punct/g, js).getRegex(), Ws = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Ur = $(Ws, "gu").replace(/notPunctSpace/g, Vs).replace(/punctSpace/g, Xi).replace(/punct/g, ti).getRegex(), zr = $(Ws, "gu").replace(/notPunctSpace/g, Dr).replace(/punctSpace/g, Ir).replace(/punct/g, js).getRegex(), Hr = $(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, Vs).replace(/punctSpace/g, Xi).replace(/punct/g, ti).getRegex(), $r = $(/\\(punct)/, "gu").replace(/punct/g, ti).getRegex(), Fr = $(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Vr = $(Wi).replace("(?:-->|$)", "-->").getRegex(), jr = $(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", Vr).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Xn = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, Gr = $(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", Xn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), qs = $(/^!?\[(label)\]\[(ref)\]/).replace("label", Xn).replace("ref", Gi).getRegex(), Xs = $(/^!?\[(ref)\](?:\[\])?/).replace("ref", Gi).getRegex(), Wr = $("reflink|nolink(?!\\()", "g").replace("reflink", qs).replace("nolink", Xs).getRegex(), Yi = {
  _backpedal: wn,
  // only used for GFM url
  anyPunctuation: $r,
  autolink: Fr,
  blockSkip: Pr,
  br: Fs,
  code: Or,
  del: wn,
  emStrongLDelim: Nr,
  emStrongRDelimAst: Ur,
  emStrongRDelimUnd: Hr,
  escape: Cr,
  link: Gr,
  nolink: Xs,
  punctuation: Lr,
  reflink: qs,
  reflinkSearch: Wr,
  tag: jr,
  text: Mr,
  url: wn
}, qr = {
  ...Yi,
  link: $(/^!?\[(label)\]\((.*?)\)/).replace("label", Xn).getRegex(),
  reflink: $(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Xn).getRegex()
}, Li = {
  ...Yi,
  emStrongRDelimAst: zr,
  emStrongLDelim: Br,
  url: $(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, Xr = {
  ...Li,
  br: $(Fs).replace("{2,}", "*").getRegex(),
  text: $(Li.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Un = {
  normal: qi,
  gfm: Ar,
  pedantic: Rr
}, en = {
  normal: Yi,
  gfm: Li,
  breaks: Xr,
  pedantic: qr
}, Yr = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, os = (n) => Yr[n];
function ze(n, e) {
  if (e) {
    if (pe.escapeTest.test(n))
      return n.replace(pe.escapeReplace, os);
  } else if (pe.escapeTestNoEncode.test(n))
    return n.replace(pe.escapeReplaceNoEncode, os);
  return n;
}
function as(n) {
  try {
    n = encodeURI(n).replace(pe.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function ls(n, e) {
  var r;
  const t = n.replace(pe.findPipe, (c, a, h) => {
    let u = !1, p = a;
    for (; --p >= 0 && h[p] === "\\"; ) u = !u;
    return u ? "|" : " |";
  }), i = t.split(pe.splitPipe);
  let s = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !((r = i.at(-1)) != null && r.trim()) && i.pop(), e)
    if (i.length > e)
      i.splice(e);
    else
      for (; i.length < e; ) i.push("");
  for (; s < i.length; s++)
    i[s] = i[s].trim().replace(pe.slashPipe, "|");
  return i;
}
function tn(n, e, t) {
  const i = n.length;
  if (i === 0)
    return "";
  let s = 0;
  for (; s < i && n.charAt(i - s - 1) === e; )
    s++;
  return n.slice(0, i - s);
}
function Zr(n, e) {
  if (n.indexOf(e[1]) === -1)
    return -1;
  let t = 0;
  for (let i = 0; i < n.length; i++)
    if (n[i] === "\\")
      i++;
    else if (n[i] === e[0])
      t++;
    else if (n[i] === e[1] && (t--, t < 0))
      return i;
  return t > 0 ? -2 : -1;
}
function cs(n, e, t, i, s) {
  const r = e.href, c = e.title || null, a = n[1].replace(s.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  const h = {
    type: n[0].charAt(0) === "!" ? "image" : "link",
    raw: t,
    href: r,
    title: c,
    text: a,
    tokens: i.inlineTokens(a)
  };
  return i.state.inLink = !1, h;
}
function Kr(n, e, t) {
  const i = n.match(t.other.indentCodeCompensation);
  if (i === null)
    return e;
  const s = i[1];
  return e.split(`
`).map((r) => {
    const c = r.match(t.other.beginningSpace);
    if (c === null)
      return r;
    const [a] = c;
    return a.length >= s.length ? r.slice(s.length) : r;
  }).join(`
`);
}
var Yn = class {
  // set by the lexer
  constructor(n) {
    X(this, "options");
    X(this, "rules");
    // set by the lexer
    X(this, "lexer");
    this.options = n || vt;
  }
  space(n) {
    const e = this.rules.block.newline.exec(n);
    if (e && e[0].length > 0)
      return {
        type: "space",
        raw: e[0]
      };
  }
  code(n) {
    const e = this.rules.block.code.exec(n);
    if (e) {
      const t = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return {
        type: "code",
        raw: e[0],
        codeBlockStyle: "indented",
        text: this.options.pedantic ? t : tn(t, `
`)
      };
    }
  }
  fences(n) {
    const e = this.rules.block.fences.exec(n);
    if (e) {
      const t = e[0], i = Kr(t, e[3] || "", this.rules);
      return {
        type: "code",
        raw: t,
        lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2],
        text: i
      };
    }
  }
  heading(n) {
    const e = this.rules.block.heading.exec(n);
    if (e) {
      let t = e[2].trim();
      if (this.rules.other.endingHash.test(t)) {
        const i = tn(t, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (t = i.trim());
      }
      return {
        type: "heading",
        raw: e[0],
        depth: e[1].length,
        text: t,
        tokens: this.lexer.inline(t)
      };
    }
  }
  hr(n) {
    const e = this.rules.block.hr.exec(n);
    if (e)
      return {
        type: "hr",
        raw: tn(e[0], `
`)
      };
  }
  blockquote(n) {
    const e = this.rules.block.blockquote.exec(n);
    if (e) {
      let t = tn(e[0], `
`).split(`
`), i = "", s = "";
      const r = [];
      for (; t.length > 0; ) {
        let c = !1;
        const a = [];
        let h;
        for (h = 0; h < t.length; h++)
          if (this.rules.other.blockquoteStart.test(t[h]))
            a.push(t[h]), c = !0;
          else if (!c)
            a.push(t[h]);
          else
            break;
        t = t.slice(h);
        const u = a.join(`
`), p = u.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${u}` : u, s = s ? `${s}
${p}` : p;
        const O = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(p, r, !0), this.lexer.state.top = O, t.length === 0)
          break;
        const E = r.at(-1);
        if ((E == null ? void 0 : E.type) === "code")
          break;
        if ((E == null ? void 0 : E.type) === "blockquote") {
          const H = E, P = H.raw + `
` + t.join(`
`), M = this.blockquote(P);
          r[r.length - 1] = M, i = i.substring(0, i.length - H.raw.length) + M.raw, s = s.substring(0, s.length - H.text.length) + M.text;
          break;
        } else if ((E == null ? void 0 : E.type) === "list") {
          const H = E, P = H.raw + `
` + t.join(`
`), M = this.list(P);
          r[r.length - 1] = M, i = i.substring(0, i.length - E.raw.length) + M.raw, s = s.substring(0, s.length - H.raw.length) + M.raw, t = P.substring(r.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return {
        type: "blockquote",
        raw: i,
        tokens: r,
        text: s
      };
    }
  }
  list(n) {
    let e = this.rules.block.list.exec(n);
    if (e) {
      let t = e[1].trim();
      const i = t.length > 1, s = {
        type: "list",
        raw: "",
        ordered: i,
        start: i ? +t.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      t = i ? `\\d{1,9}\\${t.slice(-1)}` : `\\${t}`, this.options.pedantic && (t = i ? t : "[*+-]");
      const r = this.rules.other.listItemRegex(t);
      let c = !1;
      for (; n; ) {
        let h = !1, u = "", p = "";
        if (!(e = r.exec(n)) || this.rules.block.hr.test(n))
          break;
        u = e[0], n = n.substring(u.length);
        let O = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (ke) => " ".repeat(3 * ke.length)), E = n.split(`
`, 1)[0], H = !O.trim(), P = 0;
        if (this.options.pedantic ? (P = 2, p = O.trimStart()) : H ? P = e[1].length + 1 : (P = e[2].search(this.rules.other.nonSpaceChar), P = P > 4 ? 1 : P, p = O.slice(P), P += e[1].length), H && this.rules.other.blankLine.test(E) && (u += E + `
`, n = n.substring(E.length + 1), h = !0), !h) {
          const ke = this.rules.other.nextBulletRegex(P), se = this.rules.other.hrRegex(P), me = this.rules.other.fencesBeginRegex(P), J = this.rules.other.headingBeginRegex(P), we = this.rules.other.htmlBeginRegex(P);
          for (; n; ) {
            const Ve = n.split(`
`, 1)[0];
            let Pe;
            if (E = Ve, this.options.pedantic ? (E = E.replace(this.rules.other.listReplaceNesting, "  "), Pe = E) : Pe = E.replace(this.rules.other.tabCharGlobal, "    "), me.test(E) || J.test(E) || we.test(E) || ke.test(E) || se.test(E))
              break;
            if (Pe.search(this.rules.other.nonSpaceChar) >= P || !E.trim())
              p += `
` + Pe.slice(P);
            else {
              if (H || O.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || me.test(O) || J.test(O) || se.test(O))
                break;
              p += `
` + E;
            }
            !H && !E.trim() && (H = !0), u += Ve + `
`, n = n.substring(Ve.length + 1), O = Pe.slice(P);
          }
        }
        s.loose || (c ? s.loose = !0 : this.rules.other.doubleBlankLine.test(u) && (c = !0));
        let M = null, Te;
        this.options.gfm && (M = this.rules.other.listIsTask.exec(p), M && (Te = M[0] !== "[ ] ", p = p.replace(this.rules.other.listReplaceTask, ""))), s.items.push({
          type: "list_item",
          raw: u,
          task: !!M,
          checked: Te,
          loose: !1,
          text: p,
          tokens: []
        }), s.raw += u;
      }
      const a = s.items.at(-1);
      if (a)
        a.raw = a.raw.trimEnd(), a.text = a.text.trimEnd();
      else
        return;
      s.raw = s.raw.trimEnd();
      for (let h = 0; h < s.items.length; h++)
        if (this.lexer.state.top = !1, s.items[h].tokens = this.lexer.blockTokens(s.items[h].text, []), !s.loose) {
          const u = s.items[h].tokens.filter((O) => O.type === "space"), p = u.length > 0 && u.some((O) => this.rules.other.anyLine.test(O.raw));
          s.loose = p;
        }
      if (s.loose)
        for (let h = 0; h < s.items.length; h++)
          s.items[h].loose = !0;
      return s;
    }
  }
  html(n) {
    const e = this.rules.block.html.exec(n);
    if (e)
      return {
        type: "html",
        block: !0,
        raw: e[0],
        pre: e[1] === "pre" || e[1] === "script" || e[1] === "style",
        text: e[0]
      };
  }
  def(n) {
    const e = this.rules.block.def.exec(n);
    if (e) {
      const t = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), i = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", s = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return {
        type: "def",
        tag: t,
        raw: e[0],
        href: i,
        title: s
      };
    }
  }
  table(n) {
    var c;
    const e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2]))
      return;
    const t = ls(e[1]), i = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = (c = e[3]) != null && c.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], r = {
      type: "table",
      raw: e[0],
      header: [],
      align: [],
      rows: []
    };
    if (t.length === i.length) {
      for (const a of i)
        this.rules.other.tableAlignRight.test(a) ? r.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? r.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? r.align.push("left") : r.align.push(null);
      for (let a = 0; a < t.length; a++)
        r.header.push({
          text: t[a],
          tokens: this.lexer.inline(t[a]),
          header: !0,
          align: r.align[a]
        });
      for (const a of s)
        r.rows.push(ls(a, r.header.length).map((h, u) => ({
          text: h,
          tokens: this.lexer.inline(h),
          header: !1,
          align: r.align[u]
        })));
      return r;
    }
  }
  lheading(n) {
    const e = this.rules.block.lheading.exec(n);
    if (e)
      return {
        type: "heading",
        raw: e[0],
        depth: e[2].charAt(0) === "=" ? 1 : 2,
        text: e[1],
        tokens: this.lexer.inline(e[1])
      };
  }
  paragraph(n) {
    const e = this.rules.block.paragraph.exec(n);
    if (e) {
      const t = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return {
        type: "paragraph",
        raw: e[0],
        text: t,
        tokens: this.lexer.inline(t)
      };
    }
  }
  text(n) {
    const e = this.rules.block.text.exec(n);
    if (e)
      return {
        type: "text",
        raw: e[0],
        text: e[0],
        tokens: this.lexer.inline(e[0])
      };
  }
  escape(n) {
    const e = this.rules.inline.escape.exec(n);
    if (e)
      return {
        type: "escape",
        raw: e[0],
        text: e[1]
      };
  }
  tag(n) {
    const e = this.rules.inline.tag.exec(n);
    if (e)
      return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), {
        type: "html",
        raw: e[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: !1,
        text: e[0]
      };
  }
  link(n) {
    const e = this.rules.inline.link.exec(n);
    if (e) {
      const t = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(t)) {
        if (!this.rules.other.endAngleBracket.test(t))
          return;
        const r = tn(t.slice(0, -1), "\\");
        if ((t.length - r.length) % 2 === 0)
          return;
      } else {
        const r = Zr(e[2], "()");
        if (r === -2)
          return;
        if (r > -1) {
          const a = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + r;
          e[2] = e[2].substring(0, r), e[0] = e[0].substring(0, a).trim(), e[3] = "";
        }
      }
      let i = e[2], s = "";
      if (this.options.pedantic) {
        const r = this.rules.other.pedanticHrefTitle.exec(i);
        r && (i = r[1], s = r[3]);
      } else
        s = e[3] ? e[3].slice(1, -1) : "";
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(t) ? i = i.slice(1) : i = i.slice(1, -1)), cs(e, {
        href: i && i.replace(this.rules.inline.anyPunctuation, "$1"),
        title: s && s.replace(this.rules.inline.anyPunctuation, "$1")
      }, e[0], this.lexer, this.rules);
    }
  }
  reflink(n, e) {
    let t;
    if ((t = this.rules.inline.reflink.exec(n)) || (t = this.rules.inline.nolink.exec(n))) {
      const i = (t[2] || t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), s = e[i.toLowerCase()];
      if (!s) {
        const r = t[0].charAt(0);
        return {
          type: "text",
          raw: r,
          text: r
        };
      }
      return cs(t, s, t[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, t = "") {
    let i = this.rules.inline.emStrongLDelim.exec(n);
    if (!i || i[3] && t.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(i[1] || i[2] || "") || !t || this.rules.inline.punctuation.exec(t)) {
      const r = [...i[0]].length - 1;
      let c, a, h = r, u = 0;
      const p = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (p.lastIndex = 0, e = e.slice(-1 * n.length + r); (i = p.exec(e)) != null; ) {
        if (c = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !c) continue;
        if (a = [...c].length, i[3] || i[4]) {
          h += a;
          continue;
        } else if ((i[5] || i[6]) && r % 3 && !((r + a) % 3)) {
          u += a;
          continue;
        }
        if (h -= a, h > 0) continue;
        a = Math.min(a, a + h + u);
        const O = [...i[0]][0].length, E = n.slice(0, r + i.index + O + a);
        if (Math.min(r, a) % 2) {
          const P = E.slice(1, -1);
          return {
            type: "em",
            raw: E,
            text: P,
            tokens: this.lexer.inlineTokens(P)
          };
        }
        const H = E.slice(2, -2);
        return {
          type: "strong",
          raw: E,
          text: H,
          tokens: this.lexer.inlineTokens(H)
        };
      }
    }
  }
  codespan(n) {
    const e = this.rules.inline.code.exec(n);
    if (e) {
      let t = e[2].replace(this.rules.other.newLineCharGlobal, " ");
      const i = this.rules.other.nonSpaceChar.test(t), s = this.rules.other.startingSpaceChar.test(t) && this.rules.other.endingSpaceChar.test(t);
      return i && s && (t = t.substring(1, t.length - 1)), {
        type: "codespan",
        raw: e[0],
        text: t
      };
    }
  }
  br(n) {
    const e = this.rules.inline.br.exec(n);
    if (e)
      return {
        type: "br",
        raw: e[0]
      };
  }
  del(n) {
    const e = this.rules.inline.del.exec(n);
    if (e)
      return {
        type: "del",
        raw: e[0],
        text: e[2],
        tokens: this.lexer.inlineTokens(e[2])
      };
  }
  autolink(n) {
    const e = this.rules.inline.autolink.exec(n);
    if (e) {
      let t, i;
      return e[2] === "@" ? (t = e[1], i = "mailto:" + t) : (t = e[1], i = t), {
        type: "link",
        raw: e[0],
        text: t,
        href: i,
        tokens: [
          {
            type: "text",
            raw: t,
            text: t
          }
        ]
      };
    }
  }
  url(n) {
    var t;
    let e;
    if (e = this.rules.inline.url.exec(n)) {
      let i, s;
      if (e[2] === "@")
        i = e[0], s = "mailto:" + i;
      else {
        let r;
        do
          r = e[0], e[0] = ((t = this.rules.inline._backpedal.exec(e[0])) == null ? void 0 : t[0]) ?? "";
        while (r !== e[0]);
        i = e[0], e[1] === "www." ? s = "http://" + e[0] : s = e[0];
      }
      return {
        type: "link",
        raw: e[0],
        text: i,
        href: s,
        tokens: [
          {
            type: "text",
            raw: i,
            text: i
          }
        ]
      };
    }
  }
  inlineText(n) {
    const e = this.rules.inline.text.exec(n);
    if (e) {
      const t = this.lexer.state.inRawBlock;
      return {
        type: "text",
        raw: e[0],
        text: e[0],
        escaped: t
      };
    }
  }
}, Ze = class Ii {
  constructor(e) {
    X(this, "tokens");
    X(this, "options");
    X(this, "state");
    X(this, "tokenizer");
    X(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || vt, this.options.tokenizer = this.options.tokenizer || new Yn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const t = {
      other: pe,
      block: Un.normal,
      inline: en.normal
    };
    this.options.pedantic ? (t.block = Un.pedantic, t.inline = en.pedantic) : this.options.gfm && (t.block = Un.gfm, this.options.breaks ? t.inline = en.breaks : t.inline = en.gfm), this.tokenizer.rules = t;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: Un,
      inline: en
    };
  }
  /**
   * Static Lex Method
   */
  static lex(e, t) {
    return new Ii(t).lex(e);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(e, t) {
    return new Ii(t).inlineTokens(e);
  }
  /**
   * Preprocessing
   */
  lex(e) {
    e = e.replace(pe.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      const i = this.inlineQueue[t];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], i = !1) {
    var s, r, c;
    for (this.options.pedantic && (e = e.replace(pe.tabCharGlobal, "    ").replace(pe.spaceLine, "")); e; ) {
      let a;
      if ((r = (s = this.options.extensions) == null ? void 0 : s.block) != null && r.some((u) => (a = u.call({ lexer: this }, e, t)) ? (e = e.substring(a.raw.length), t.push(a), !0) : !1))
        continue;
      if (a = this.tokenizer.space(e)) {
        e = e.substring(a.raw.length);
        const u = t.at(-1);
        a.raw.length === 1 && u !== void 0 ? u.raw += `
` : t.push(a);
        continue;
      }
      if (a = this.tokenizer.code(e)) {
        e = e.substring(a.raw.length);
        const u = t.at(-1);
        (u == null ? void 0 : u.type) === "paragraph" || (u == null ? void 0 : u.type) === "text" ? (u.raw += `
` + a.raw, u.text += `
` + a.text, this.inlineQueue.at(-1).src = u.text) : t.push(a);
        continue;
      }
      if (a = this.tokenizer.fences(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.heading(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.hr(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.blockquote(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.list(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.html(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.def(e)) {
        e = e.substring(a.raw.length);
        const u = t.at(-1);
        (u == null ? void 0 : u.type) === "paragraph" || (u == null ? void 0 : u.type) === "text" ? (u.raw += `
` + a.raw, u.text += `
` + a.raw, this.inlineQueue.at(-1).src = u.text) : this.tokens.links[a.tag] || (this.tokens.links[a.tag] = {
          href: a.href,
          title: a.title
        });
        continue;
      }
      if (a = this.tokenizer.table(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.lheading(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      let h = e;
      if ((c = this.options.extensions) != null && c.startBlock) {
        let u = 1 / 0;
        const p = e.slice(1);
        let O;
        this.options.extensions.startBlock.forEach((E) => {
          O = E.call({ lexer: this }, p), typeof O == "number" && O >= 0 && (u = Math.min(u, O));
        }), u < 1 / 0 && u >= 0 && (h = e.substring(0, u + 1));
      }
      if (this.state.top && (a = this.tokenizer.paragraph(h))) {
        const u = t.at(-1);
        i && (u == null ? void 0 : u.type) === "paragraph" ? (u.raw += `
` + a.raw, u.text += `
` + a.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = u.text) : t.push(a), i = h.length !== e.length, e = e.substring(a.raw.length);
        continue;
      }
      if (a = this.tokenizer.text(e)) {
        e = e.substring(a.raw.length);
        const u = t.at(-1);
        (u == null ? void 0 : u.type) === "text" ? (u.raw += `
` + a.raw, u.text += `
` + a.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = u.text) : t.push(a);
        continue;
      }
      if (e) {
        const u = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(u);
          break;
        } else
          throw new Error(u);
      }
    }
    return this.state.top = !0, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(e, t = []) {
    var a, h, u;
    let i = e, s = null;
    if (this.tokens.links) {
      const p = Object.keys(this.tokens.links);
      if (p.length > 0)
        for (; (s = this.tokenizer.rules.inline.reflinkSearch.exec(i)) != null; )
          p.includes(s[0].slice(s[0].lastIndexOf("[") + 1, -1)) && (i = i.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (s = this.tokenizer.rules.inline.anyPunctuation.exec(i)) != null; )
      i = i.slice(0, s.index) + "++" + i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (s = this.tokenizer.rules.inline.blockSkip.exec(i)) != null; )
      i = i.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    let r = !1, c = "";
    for (; e; ) {
      r || (c = ""), r = !1;
      let p;
      if ((h = (a = this.options.extensions) == null ? void 0 : a.inline) != null && h.some((E) => (p = E.call({ lexer: this }, e, t)) ? (e = e.substring(p.raw.length), t.push(p), !0) : !1))
        continue;
      if (p = this.tokenizer.escape(e)) {
        e = e.substring(p.raw.length), t.push(p);
        continue;
      }
      if (p = this.tokenizer.tag(e)) {
        e = e.substring(p.raw.length), t.push(p);
        continue;
      }
      if (p = this.tokenizer.link(e)) {
        e = e.substring(p.raw.length), t.push(p);
        continue;
      }
      if (p = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(p.raw.length);
        const E = t.at(-1);
        p.type === "text" && (E == null ? void 0 : E.type) === "text" ? (E.raw += p.raw, E.text += p.text) : t.push(p);
        continue;
      }
      if (p = this.tokenizer.emStrong(e, i, c)) {
        e = e.substring(p.raw.length), t.push(p);
        continue;
      }
      if (p = this.tokenizer.codespan(e)) {
        e = e.substring(p.raw.length), t.push(p);
        continue;
      }
      if (p = this.tokenizer.br(e)) {
        e = e.substring(p.raw.length), t.push(p);
        continue;
      }
      if (p = this.tokenizer.del(e)) {
        e = e.substring(p.raw.length), t.push(p);
        continue;
      }
      if (p = this.tokenizer.autolink(e)) {
        e = e.substring(p.raw.length), t.push(p);
        continue;
      }
      if (!this.state.inLink && (p = this.tokenizer.url(e))) {
        e = e.substring(p.raw.length), t.push(p);
        continue;
      }
      let O = e;
      if ((u = this.options.extensions) != null && u.startInline) {
        let E = 1 / 0;
        const H = e.slice(1);
        let P;
        this.options.extensions.startInline.forEach((M) => {
          P = M.call({ lexer: this }, H), typeof P == "number" && P >= 0 && (E = Math.min(E, P));
        }), E < 1 / 0 && E >= 0 && (O = e.substring(0, E + 1));
      }
      if (p = this.tokenizer.inlineText(O)) {
        e = e.substring(p.raw.length), p.raw.slice(-1) !== "_" && (c = p.raw.slice(-1)), r = !0;
        const E = t.at(-1);
        (E == null ? void 0 : E.type) === "text" ? (E.raw += p.raw, E.text += p.text) : t.push(p);
        continue;
      }
      if (e) {
        const E = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(E);
          break;
        } else
          throw new Error(E);
      }
    }
    return t;
  }
}, Zn = class {
  // set by the parser
  constructor(n) {
    X(this, "options");
    X(this, "parser");
    this.options = n || vt;
  }
  space(n) {
    return "";
  }
  code({ text: n, lang: e, escaped: t }) {
    var r;
    const i = (r = (e || "").match(pe.notSpaceStart)) == null ? void 0 : r[0], s = n.replace(pe.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + ze(i) + '">' + (t ? s : ze(s, !0)) + `</code></pre>
` : "<pre><code>" + (t ? s : ze(s, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: n }) {
    return `<blockquote>
${this.parser.parse(n)}</blockquote>
`;
  }
  html({ text: n }) {
    return n;
  }
  heading({ tokens: n, depth: e }) {
    return `<h${e}>${this.parser.parseInline(n)}</h${e}>
`;
  }
  hr(n) {
    return `<hr>
`;
  }
  list(n) {
    const e = n.ordered, t = n.start;
    let i = "";
    for (let c = 0; c < n.items.length; c++) {
      const a = n.items[c];
      i += this.listitem(a);
    }
    const s = e ? "ol" : "ul", r = e && t !== 1 ? ' start="' + t + '"' : "";
    return "<" + s + r + `>
` + i + "</" + s + `>
`;
  }
  listitem(n) {
    var t;
    let e = "";
    if (n.task) {
      const i = this.checkbox({ checked: !!n.checked });
      n.loose ? ((t = n.tokens[0]) == null ? void 0 : t.type) === "paragraph" ? (n.tokens[0].text = i + " " + n.tokens[0].text, n.tokens[0].tokens && n.tokens[0].tokens.length > 0 && n.tokens[0].tokens[0].type === "text" && (n.tokens[0].tokens[0].text = i + " " + ze(n.tokens[0].tokens[0].text), n.tokens[0].tokens[0].escaped = !0)) : n.tokens.unshift({
        type: "text",
        raw: i + " ",
        text: i + " ",
        escaped: !0
      }) : e += i + " ";
    }
    return e += this.parser.parse(n.tokens, !!n.loose), `<li>${e}</li>
`;
  }
  checkbox({ checked: n }) {
    return "<input " + (n ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: n }) {
    return `<p>${this.parser.parseInline(n)}</p>
`;
  }
  table(n) {
    let e = "", t = "";
    for (let s = 0; s < n.header.length; s++)
      t += this.tablecell(n.header[s]);
    e += this.tablerow({ text: t });
    let i = "";
    for (let s = 0; s < n.rows.length; s++) {
      const r = n.rows[s];
      t = "";
      for (let c = 0; c < r.length; c++)
        t += this.tablecell(r[c]);
      i += this.tablerow({ text: t });
    }
    return i && (i = `<tbody>${i}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + i + `</table>
`;
  }
  tablerow({ text: n }) {
    return `<tr>
${n}</tr>
`;
  }
  tablecell(n) {
    const e = this.parser.parseInline(n.tokens), t = n.header ? "th" : "td";
    return (n.align ? `<${t} align="${n.align}">` : `<${t}>`) + e + `</${t}>
`;
  }
  /**
   * span level renderer
   */
  strong({ tokens: n }) {
    return `<strong>${this.parser.parseInline(n)}</strong>`;
  }
  em({ tokens: n }) {
    return `<em>${this.parser.parseInline(n)}</em>`;
  }
  codespan({ text: n }) {
    return `<code>${ze(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: e, tokens: t }) {
    const i = this.parser.parseInline(t), s = as(n);
    if (s === null)
      return i;
    n = s;
    let r = '<a href="' + n + '"';
    return e && (r += ' title="' + ze(e) + '"'), r += ">" + i + "</a>", r;
  }
  image({ href: n, title: e, text: t, tokens: i }) {
    i && (t = this.parser.parseInline(i, this.parser.textRenderer));
    const s = as(n);
    if (s === null)
      return ze(t);
    n = s;
    let r = `<img src="${n}" alt="${t}"`;
    return e && (r += ` title="${ze(e)}"`), r += ">", r;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : ze(n.text);
  }
}, Zi = class {
  // no need for block level renderers
  strong({ text: n }) {
    return n;
  }
  em({ text: n }) {
    return n;
  }
  codespan({ text: n }) {
    return n;
  }
  del({ text: n }) {
    return n;
  }
  html({ text: n }) {
    return n;
  }
  text({ text: n }) {
    return n;
  }
  link({ text: n }) {
    return "" + n;
  }
  image({ text: n }) {
    return "" + n;
  }
  br() {
    return "";
  }
}, Ke = class Di {
  constructor(e) {
    X(this, "options");
    X(this, "renderer");
    X(this, "textRenderer");
    this.options = e || vt, this.options.renderer = this.options.renderer || new Zn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Zi();
  }
  /**
   * Static Parse Method
   */
  static parse(e, t) {
    return new Di(t).parse(e);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(e, t) {
    return new Di(t).parseInline(e);
  }
  /**
   * Parse Loop
   */
  parse(e, t = !0) {
    var s, r;
    let i = "";
    for (let c = 0; c < e.length; c++) {
      const a = e[c];
      if ((r = (s = this.options.extensions) == null ? void 0 : s.renderers) != null && r[a.type]) {
        const u = a, p = this.options.extensions.renderers[u.type].call({ parser: this }, u);
        if (p !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(u.type)) {
          i += p || "";
          continue;
        }
      }
      const h = a;
      switch (h.type) {
        case "space": {
          i += this.renderer.space(h);
          continue;
        }
        case "hr": {
          i += this.renderer.hr(h);
          continue;
        }
        case "heading": {
          i += this.renderer.heading(h);
          continue;
        }
        case "code": {
          i += this.renderer.code(h);
          continue;
        }
        case "table": {
          i += this.renderer.table(h);
          continue;
        }
        case "blockquote": {
          i += this.renderer.blockquote(h);
          continue;
        }
        case "list": {
          i += this.renderer.list(h);
          continue;
        }
        case "html": {
          i += this.renderer.html(h);
          continue;
        }
        case "paragraph": {
          i += this.renderer.paragraph(h);
          continue;
        }
        case "text": {
          let u = h, p = this.renderer.text(u);
          for (; c + 1 < e.length && e[c + 1].type === "text"; )
            u = e[++c], p += `
` + this.renderer.text(u);
          t ? i += this.renderer.paragraph({
            type: "paragraph",
            raw: p,
            text: p,
            tokens: [{ type: "text", raw: p, text: p, escaped: !0 }]
          }) : i += p;
          continue;
        }
        default: {
          const u = 'Token with "' + h.type + '" type was not found.';
          if (this.options.silent)
            return console.error(u), "";
          throw new Error(u);
        }
      }
    }
    return i;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(e, t = this.renderer) {
    var s, r;
    let i = "";
    for (let c = 0; c < e.length; c++) {
      const a = e[c];
      if ((r = (s = this.options.extensions) == null ? void 0 : s.renderers) != null && r[a.type]) {
        const u = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (u !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(a.type)) {
          i += u || "";
          continue;
        }
      }
      const h = a;
      switch (h.type) {
        case "escape": {
          i += t.text(h);
          break;
        }
        case "html": {
          i += t.html(h);
          break;
        }
        case "link": {
          i += t.link(h);
          break;
        }
        case "image": {
          i += t.image(h);
          break;
        }
        case "strong": {
          i += t.strong(h);
          break;
        }
        case "em": {
          i += t.em(h);
          break;
        }
        case "codespan": {
          i += t.codespan(h);
          break;
        }
        case "br": {
          i += t.br(h);
          break;
        }
        case "del": {
          i += t.del(h);
          break;
        }
        case "text": {
          i += t.text(h);
          break;
        }
        default: {
          const u = 'Token with "' + h.type + '" type was not found.';
          if (this.options.silent)
            return console.error(u), "";
          throw new Error(u);
        }
      }
    }
    return i;
  }
}, Mi, Gn = (Mi = class {
  constructor(n) {
    X(this, "options");
    X(this, "block");
    this.options = n || vt;
  }
  /**
   * Process markdown before marked
   */
  preprocess(n) {
    return n;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(n) {
    return n;
  }
  /**
   * Process all tokens before walk tokens
   */
  processAllTokens(n) {
    return n;
  }
  /**
   * Provide function to tokenize markdown
   */
  provideLexer() {
    return this.block ? Ze.lex : Ze.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? Ke.parse : Ke.parseInline;
  }
}, X(Mi, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
])), Mi), Qr = class {
  constructor(...n) {
    X(this, "defaults", Fi());
    X(this, "options", this.setOptions);
    X(this, "parse", this.parseMarkdown(!0));
    X(this, "parseInline", this.parseMarkdown(!1));
    X(this, "Parser", Ke);
    X(this, "Renderer", Zn);
    X(this, "TextRenderer", Zi);
    X(this, "Lexer", Ze);
    X(this, "Tokenizer", Yn);
    X(this, "Hooks", Gn);
    this.use(...n);
  }
  /**
   * Run callback for every token
   */
  walkTokens(n, e) {
    var i, s;
    let t = [];
    for (const r of n)
      switch (t = t.concat(e.call(this, r)), r.type) {
        case "table": {
          const c = r;
          for (const a of c.header)
            t = t.concat(this.walkTokens(a.tokens, e));
          for (const a of c.rows)
            for (const h of a)
              t = t.concat(this.walkTokens(h.tokens, e));
          break;
        }
        case "list": {
          const c = r;
          t = t.concat(this.walkTokens(c.items, e));
          break;
        }
        default: {
          const c = r;
          (s = (i = this.defaults.extensions) == null ? void 0 : i.childTokens) != null && s[c.type] ? this.defaults.extensions.childTokens[c.type].forEach((a) => {
            const h = c[a].flat(1 / 0);
            t = t.concat(this.walkTokens(h, e));
          }) : c.tokens && (t = t.concat(this.walkTokens(c.tokens, e)));
        }
      }
    return t;
  }
  use(...n) {
    const e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return n.forEach((t) => {
      const i = { ...t };
      if (i.async = this.defaults.async || i.async || !1, t.extensions && (t.extensions.forEach((s) => {
        if (!s.name)
          throw new Error("extension name required");
        if ("renderer" in s) {
          const r = e.renderers[s.name];
          r ? e.renderers[s.name] = function(...c) {
            let a = s.renderer.apply(this, c);
            return a === !1 && (a = r.apply(this, c)), a;
          } : e.renderers[s.name] = s.renderer;
        }
        if ("tokenizer" in s) {
          if (!s.level || s.level !== "block" && s.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          const r = e[s.level];
          r ? r.unshift(s.tokenizer) : e[s.level] = [s.tokenizer], s.start && (s.level === "block" ? e.startBlock ? e.startBlock.push(s.start) : e.startBlock = [s.start] : s.level === "inline" && (e.startInline ? e.startInline.push(s.start) : e.startInline = [s.start]));
        }
        "childTokens" in s && s.childTokens && (e.childTokens[s.name] = s.childTokens);
      }), i.extensions = e), t.renderer) {
        const s = this.defaults.renderer || new Zn(this.defaults);
        for (const r in t.renderer) {
          if (!(r in s))
            throw new Error(`renderer '${r}' does not exist`);
          if (["options", "parser"].includes(r))
            continue;
          const c = r, a = t.renderer[c], h = s[c];
          s[c] = (...u) => {
            let p = a.apply(s, u);
            return p === !1 && (p = h.apply(s, u)), p || "";
          };
        }
        i.renderer = s;
      }
      if (t.tokenizer) {
        const s = this.defaults.tokenizer || new Yn(this.defaults);
        for (const r in t.tokenizer) {
          if (!(r in s))
            throw new Error(`tokenizer '${r}' does not exist`);
          if (["options", "rules", "lexer"].includes(r))
            continue;
          const c = r, a = t.tokenizer[c], h = s[c];
          s[c] = (...u) => {
            let p = a.apply(s, u);
            return p === !1 && (p = h.apply(s, u)), p;
          };
        }
        i.tokenizer = s;
      }
      if (t.hooks) {
        const s = this.defaults.hooks || new Gn();
        for (const r in t.hooks) {
          if (!(r in s))
            throw new Error(`hook '${r}' does not exist`);
          if (["options", "block"].includes(r))
            continue;
          const c = r, a = t.hooks[c], h = s[c];
          Gn.passThroughHooks.has(r) ? s[c] = (u) => {
            if (this.defaults.async)
              return Promise.resolve(a.call(s, u)).then((O) => h.call(s, O));
            const p = a.call(s, u);
            return h.call(s, p);
          } : s[c] = (...u) => {
            let p = a.apply(s, u);
            return p === !1 && (p = h.apply(s, u)), p;
          };
        }
        i.hooks = s;
      }
      if (t.walkTokens) {
        const s = this.defaults.walkTokens, r = t.walkTokens;
        i.walkTokens = function(c) {
          let a = [];
          return a.push(r.call(this, c)), s && (a = a.concat(s.call(this, c))), a;
        };
      }
      this.defaults = { ...this.defaults, ...i };
    }), this;
  }
  setOptions(n) {
    return this.defaults = { ...this.defaults, ...n }, this;
  }
  lexer(n, e) {
    return Ze.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return Ke.parse(n, e ?? this.defaults);
  }
  parseMarkdown(n) {
    return (t, i) => {
      const s = { ...i }, r = { ...this.defaults, ...s }, c = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && s.async === !1)
        return c(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null)
        return c(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string")
        return c(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      r.hooks && (r.hooks.options = r, r.hooks.block = n);
      const a = r.hooks ? r.hooks.provideLexer() : n ? Ze.lex : Ze.lexInline, h = r.hooks ? r.hooks.provideParser() : n ? Ke.parse : Ke.parseInline;
      if (r.async)
        return Promise.resolve(r.hooks ? r.hooks.preprocess(t) : t).then((u) => a(u, r)).then((u) => r.hooks ? r.hooks.processAllTokens(u) : u).then((u) => r.walkTokens ? Promise.all(this.walkTokens(u, r.walkTokens)).then(() => u) : u).then((u) => h(u, r)).then((u) => r.hooks ? r.hooks.postprocess(u) : u).catch(c);
      try {
        r.hooks && (t = r.hooks.preprocess(t));
        let u = a(t, r);
        r.hooks && (u = r.hooks.processAllTokens(u)), r.walkTokens && this.walkTokens(u, r.walkTokens);
        let p = h(u, r);
        return r.hooks && (p = r.hooks.postprocess(p)), p;
      } catch (u) {
        return c(u);
      }
    };
  }
  onError(n, e) {
    return (t) => {
      if (t.message += `
Please report this to https://github.com/markedjs/marked.`, n) {
        const i = "<p>An error occurred:</p><pre>" + ze(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(i) : i;
      }
      if (e)
        return Promise.reject(t);
      throw t;
    };
  }
}, Et = new Qr();
function j(n, e) {
  return Et.parse(n, e);
}
j.options = j.setOptions = function(n) {
  return Et.setOptions(n), j.defaults = Et.defaults, Us(j.defaults), j;
};
j.getDefaults = Fi;
j.defaults = vt;
j.use = function(...n) {
  return Et.use(...n), j.defaults = Et.defaults, Us(j.defaults), j;
};
j.walkTokens = function(n, e) {
  return Et.walkTokens(n, e);
};
j.parseInline = Et.parseInline;
j.Parser = Ke;
j.parser = Ke.parse;
j.Renderer = Zn;
j.TextRenderer = Zi;
j.Lexer = Ze;
j.lexer = Ze.lex;
j.Tokenizer = Yn;
j.Hooks = Gn;
j.parse = j;
j.options;
j.setOptions;
j.use;
j.walkTokens;
j.parseInline;
Ke.parse;
Ze.lex;
/*! @license DOMPurify 3.2.6 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.6/LICENSE */
const {
  entries: Ys,
  setPrototypeOf: us,
  isFrozen: Jr,
  getPrototypeOf: eo,
  getOwnPropertyDescriptor: to
} = Object;
let {
  freeze: fe,
  seal: Ce,
  create: Zs
} = Object, {
  apply: Pi,
  construct: Ni
} = typeof Reflect < "u" && Reflect;
fe || (fe = function(e) {
  return e;
});
Ce || (Ce = function(e) {
  return e;
});
Pi || (Pi = function(e, t, i) {
  return e.apply(t, i);
});
Ni || (Ni = function(e, t) {
  return new e(...t);
});
const zn = ge(Array.prototype.forEach), no = ge(Array.prototype.lastIndexOf), hs = ge(Array.prototype.pop), nn = ge(Array.prototype.push), io = ge(Array.prototype.splice), Wn = ge(String.prototype.toLowerCase), fi = ge(String.prototype.toString), ds = ge(String.prototype.match), sn = ge(String.prototype.replace), so = ge(String.prototype.indexOf), ro = ge(String.prototype.trim), Ie = ge(Object.prototype.hasOwnProperty), de = ge(RegExp.prototype.test), rn = oo(TypeError);
function ge(n) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++)
      i[s - 1] = arguments[s];
    return Pi(n, e, i);
  };
}
function oo(n) {
  return function() {
    for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++)
      t[i] = arguments[i];
    return Ni(n, t);
  };
}
function z(n, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Wn;
  us && us(n, null);
  let i = e.length;
  for (; i--; ) {
    let s = e[i];
    if (typeof s == "string") {
      const r = t(s);
      r !== s && (Jr(e) || (e[i] = r), s = r);
    }
    n[s] = !0;
  }
  return n;
}
function ao(n) {
  for (let e = 0; e < n.length; e++)
    Ie(n, e) || (n[e] = null);
  return n;
}
function Xe(n) {
  const e = Zs(null);
  for (const [t, i] of Ys(n))
    Ie(n, t) && (Array.isArray(i) ? e[t] = ao(i) : i && typeof i == "object" && i.constructor === Object ? e[t] = Xe(i) : e[t] = i);
  return e;
}
function on(n, e) {
  for (; n !== null; ) {
    const i = to(n, e);
    if (i) {
      if (i.get)
        return ge(i.get);
      if (typeof i.value == "function")
        return ge(i.value);
    }
    n = eo(n);
  }
  function t() {
    return null;
  }
  return t;
}
const ps = fe(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), gi = fe(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), mi = fe(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), lo = fe(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), wi = fe(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), co = fe(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), fs = fe(["#text"]), gs = fe(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), bi = fe(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), ms = fe(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Hn = fe(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), uo = Ce(/\{\{[\w\W]*|[\w\W]*\}\}/gm), ho = Ce(/<%[\w\W]*|[\w\W]*%>/gm), po = Ce(/\$\{[\w\W]*/gm), fo = Ce(/^data-[\-\w.\u00B7-\uFFFF]+$/), go = Ce(/^aria-[\-\w]+$/), Ks = Ce(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), mo = Ce(/^(?:\w+script|data):/i), wo = Ce(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), Qs = Ce(/^html$/i), bo = Ce(/^[a-z][.\w]*(-[.\w]+)+$/i);
var ws = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: go,
  ATTR_WHITESPACE: wo,
  CUSTOM_ELEMENT: bo,
  DATA_ATTR: fo,
  DOCTYPE_NAME: Qs,
  ERB_EXPR: ho,
  IS_ALLOWED_URI: Ks,
  IS_SCRIPT_OR_DATA: mo,
  MUSTACHE_EXPR: uo,
  TMPLIT_EXPR: po
});
const an = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, xo = function() {
  return typeof window > "u" ? null : window;
}, yo = function(e, t) {
  if (typeof e != "object" || typeof e.createPolicy != "function")
    return null;
  let i = null;
  const s = "data-tt-policy-suffix";
  t && t.hasAttribute(s) && (i = t.getAttribute(s));
  const r = "dompurify" + (i ? "#" + i : "");
  try {
    return e.createPolicy(r, {
      createHTML(c) {
        return c;
      },
      createScriptURL(c) {
        return c;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + r + " could not be created."), null;
  }
}, bs = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function Js() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : xo();
  const e = (A) => Js(A);
  if (e.version = "3.2.6", e.removed = [], !n || !n.document || n.document.nodeType !== an.document || !n.Element)
    return e.isSupported = !1, e;
  let {
    document: t
  } = n;
  const i = t, s = i.currentScript, {
    DocumentFragment: r,
    HTMLTemplateElement: c,
    Node: a,
    Element: h,
    NodeFilter: u,
    NamedNodeMap: p = n.NamedNodeMap || n.MozNamedAttrMap,
    HTMLFormElement: O,
    DOMParser: E,
    trustedTypes: H
  } = n, P = h.prototype, M = on(P, "cloneNode"), Te = on(P, "remove"), ke = on(P, "nextSibling"), se = on(P, "childNodes"), me = on(P, "parentNode");
  if (typeof c == "function") {
    const A = t.createElement("template");
    A.content && A.content.ownerDocument && (t = A.content.ownerDocument);
  }
  let J, we = "";
  const {
    implementation: Ve,
    createNodeIterator: Pe,
    createDocumentFragment: Ht,
    getElementsByTagName: yn
  } = t, {
    importNode: kn
  } = i;
  let le = bs();
  e.isSupported = typeof Ys == "function" && typeof me == "function" && Ve && Ve.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: $t,
    ERB_EXPR: Ft,
    TMPLIT_EXPR: je,
    DATA_ATTR: ri,
    ARIA_ATTR: oi,
    IS_SCRIPT_OR_DATA: ai,
    ATTR_WHITESPACE: dt,
    CUSTOM_ELEMENT: li
  } = ws;
  let {
    IS_ALLOWED_URI: En
  } = ws, ne = null;
  const vn = z({}, [...ps, ...gi, ...mi, ...wi, ...fs]);
  let re = null;
  const _n = z({}, [...gs, ...bi, ...ms, ...Hn]);
  let ee = Object.seal(Zs(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), pt = null, Vt = null, Sn = !0, Tn = !0, ft = !1, An = !0, tt = !1, _t = !0, Ge = !1, jt = !1, Gt = !1, nt = !1, St = !1, Tt = !1, Wt = !0, Rn = !1;
  const ci = "user-content-";
  let At = !0, Ee = !1, We = {}, ve = null;
  const gt = z({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let qt = null;
  const Cn = z({}, ["audio", "video", "img", "source", "image", "track"]);
  let Xt = null;
  const On = z({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Rt = "http://www.w3.org/1998/Math/MathML", Ct = "http://www.w3.org/2000/svg", Ae = "http://www.w3.org/1999/xhtml";
  let it = Ae, Yt = !1, Zt = null;
  const Kt = z({}, [Rt, Ct, Ae], fi);
  let mt = z({}, ["mi", "mo", "mn", "ms", "mtext"]), wt = z({}, ["annotation-xml"]);
  const ui = z({}, ["title", "style", "font", "a", "script"]);
  let st = null;
  const rt = ["application/xhtml+xml", "text/html"], o = "text/html";
  let d = null, k = null;
  const I = t.createElement("form"), Q = function(l) {
    return l instanceof RegExp || l instanceof Function;
  }, K = function() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(k && k === l)) {
      if ((!l || typeof l != "object") && (l = {}), l = Xe(l), st = // eslint-disable-next-line unicorn/prefer-includes
      rt.indexOf(l.PARSER_MEDIA_TYPE) === -1 ? o : l.PARSER_MEDIA_TYPE, d = st === "application/xhtml+xml" ? fi : Wn, ne = Ie(l, "ALLOWED_TAGS") ? z({}, l.ALLOWED_TAGS, d) : vn, re = Ie(l, "ALLOWED_ATTR") ? z({}, l.ALLOWED_ATTR, d) : _n, Zt = Ie(l, "ALLOWED_NAMESPACES") ? z({}, l.ALLOWED_NAMESPACES, fi) : Kt, Xt = Ie(l, "ADD_URI_SAFE_ATTR") ? z(Xe(On), l.ADD_URI_SAFE_ATTR, d) : On, qt = Ie(l, "ADD_DATA_URI_TAGS") ? z(Xe(Cn), l.ADD_DATA_URI_TAGS, d) : Cn, ve = Ie(l, "FORBID_CONTENTS") ? z({}, l.FORBID_CONTENTS, d) : gt, pt = Ie(l, "FORBID_TAGS") ? z({}, l.FORBID_TAGS, d) : Xe({}), Vt = Ie(l, "FORBID_ATTR") ? z({}, l.FORBID_ATTR, d) : Xe({}), We = Ie(l, "USE_PROFILES") ? l.USE_PROFILES : !1, Sn = l.ALLOW_ARIA_ATTR !== !1, Tn = l.ALLOW_DATA_ATTR !== !1, ft = l.ALLOW_UNKNOWN_PROTOCOLS || !1, An = l.ALLOW_SELF_CLOSE_IN_ATTR !== !1, tt = l.SAFE_FOR_TEMPLATES || !1, _t = l.SAFE_FOR_XML !== !1, Ge = l.WHOLE_DOCUMENT || !1, nt = l.RETURN_DOM || !1, St = l.RETURN_DOM_FRAGMENT || !1, Tt = l.RETURN_TRUSTED_TYPE || !1, Gt = l.FORCE_BODY || !1, Wt = l.SANITIZE_DOM !== !1, Rn = l.SANITIZE_NAMED_PROPS || !1, At = l.KEEP_CONTENT !== !1, Ee = l.IN_PLACE || !1, En = l.ALLOWED_URI_REGEXP || Ks, it = l.NAMESPACE || Ae, mt = l.MATHML_TEXT_INTEGRATION_POINTS || mt, wt = l.HTML_INTEGRATION_POINTS || wt, ee = l.CUSTOM_ELEMENT_HANDLING || {}, l.CUSTOM_ELEMENT_HANDLING && Q(l.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (ee.tagNameCheck = l.CUSTOM_ELEMENT_HANDLING.tagNameCheck), l.CUSTOM_ELEMENT_HANDLING && Q(l.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (ee.attributeNameCheck = l.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), l.CUSTOM_ELEMENT_HANDLING && typeof l.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (ee.allowCustomizedBuiltInElements = l.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), tt && (Tn = !1), St && (nt = !0), We && (ne = z({}, fs), re = [], We.html === !0 && (z(ne, ps), z(re, gs)), We.svg === !0 && (z(ne, gi), z(re, bi), z(re, Hn)), We.svgFilters === !0 && (z(ne, mi), z(re, bi), z(re, Hn)), We.mathMl === !0 && (z(ne, wi), z(re, ms), z(re, Hn))), l.ADD_TAGS && (ne === vn && (ne = Xe(ne)), z(ne, l.ADD_TAGS, d)), l.ADD_ATTR && (re === _n && (re = Xe(re)), z(re, l.ADD_ATTR, d)), l.ADD_URI_SAFE_ATTR && z(Xt, l.ADD_URI_SAFE_ATTR, d), l.FORBID_CONTENTS && (ve === gt && (ve = Xe(ve)), z(ve, l.FORBID_CONTENTS, d)), At && (ne["#text"] = !0), Ge && z(ne, ["html", "head", "body"]), ne.table && (z(ne, ["tbody"]), delete pt.tbody), l.TRUSTED_TYPES_POLICY) {
        if (typeof l.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw rn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof l.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw rn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        J = l.TRUSTED_TYPES_POLICY, we = J.createHTML("");
      } else
        J === void 0 && (J = yo(H, s)), J !== null && typeof we == "string" && (we = J.createHTML(""));
      fe && fe(l), k = l;
    }
  }, T = z({}, [...gi, ...mi, ...lo]), S = z({}, [...wi, ...co]), L = function(l) {
    let y = me(l);
    (!y || !y.tagName) && (y = {
      namespaceURI: it,
      tagName: "template"
    });
    const _ = Wn(l.tagName), q = Wn(y.tagName);
    return Zt[l.namespaceURI] ? l.namespaceURI === Ct ? y.namespaceURI === Ae ? _ === "svg" : y.namespaceURI === Rt ? _ === "svg" && (q === "annotation-xml" || mt[q]) : !!T[_] : l.namespaceURI === Rt ? y.namespaceURI === Ae ? _ === "math" : y.namespaceURI === Ct ? _ === "math" && wt[q] : !!S[_] : l.namespaceURI === Ae ? y.namespaceURI === Ct && !wt[q] || y.namespaceURI === Rt && !mt[q] ? !1 : !S[_] && (ui[_] || !T[_]) : !!(st === "application/xhtml+xml" && Zt[l.namespaceURI]) : !1;
  }, F = function(l) {
    nn(e.removed, {
      element: l
    });
    try {
      me(l).removeChild(l);
    } catch {
      Te(l);
    }
  }, W = function(l, y) {
    try {
      nn(e.removed, {
        attribute: y.getAttributeNode(l),
        from: y
      });
    } catch {
      nn(e.removed, {
        attribute: null,
        from: y
      });
    }
    if (y.removeAttribute(l), l === "is")
      if (nt || St)
        try {
          F(y);
        } catch {
        }
      else
        try {
          y.setAttribute(l, "");
        } catch {
        }
  }, ot = function(l) {
    let y = null, _ = null;
    if (Gt)
      l = "<remove></remove>" + l;
    else {
      const te = ds(l, /^[\r\n\t ]+/);
      _ = te && te[0];
    }
    st === "application/xhtml+xml" && it === Ae && (l = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + l + "</body></html>");
    const q = J ? J.createHTML(l) : l;
    if (it === Ae)
      try {
        y = new E().parseFromString(q, st);
      } catch {
      }
    if (!y || !y.documentElement) {
      y = Ve.createDocument(it, "template", null);
      try {
        y.documentElement.innerHTML = Yt ? we : q;
      } catch {
      }
    }
    const oe = y.body || y.documentElement;
    return l && _ && oe.insertBefore(t.createTextNode(_), oe.childNodes[0] || null), it === Ae ? yn.call(y, Ge ? "html" : "body")[0] : Ge ? y.documentElement : oe;
  }, Ot = function(l) {
    return Pe.call(
      l.ownerDocument || l,
      l,
      // eslint-disable-next-line no-bitwise
      u.SHOW_ELEMENT | u.SHOW_COMMENT | u.SHOW_TEXT | u.SHOW_PROCESSING_INSTRUCTION | u.SHOW_CDATA_SECTION,
      null
    );
  }, bt = function(l) {
    return l instanceof O && (typeof l.nodeName != "string" || typeof l.textContent != "string" || typeof l.removeChild != "function" || !(l.attributes instanceof p) || typeof l.removeAttribute != "function" || typeof l.setAttribute != "function" || typeof l.namespaceURI != "string" || typeof l.insertBefore != "function" || typeof l.hasChildNodes != "function");
  }, Mn = function(l) {
    return typeof a == "function" && l instanceof a;
  };
  function _e(A, l, y) {
    zn(A, (_) => {
      _.call(e, l, y, k);
    });
  }
  const Ln = function(l) {
    let y = null;
    if (_e(le.beforeSanitizeElements, l, null), bt(l))
      return F(l), !0;
    const _ = d(l.nodeName);
    if (_e(le.uponSanitizeElement, l, {
      tagName: _,
      allowedTags: ne
    }), _t && l.hasChildNodes() && !Mn(l.firstElementChild) && de(/<[/\w!]/g, l.innerHTML) && de(/<[/\w!]/g, l.textContent) || l.nodeType === an.progressingInstruction || _t && l.nodeType === an.comment && de(/<[/\w]/g, l.data))
      return F(l), !0;
    if (!ne[_] || pt[_]) {
      if (!pt[_] && Dn(_) && (ee.tagNameCheck instanceof RegExp && de(ee.tagNameCheck, _) || ee.tagNameCheck instanceof Function && ee.tagNameCheck(_)))
        return !1;
      if (At && !ve[_]) {
        const q = me(l) || l.parentNode, oe = se(l) || l.childNodes;
        if (oe && q) {
          const te = oe.length;
          for (let ue = te - 1; ue >= 0; --ue) {
            const Me = M(oe[ue], !0);
            Me.__removalCount = (l.__removalCount || 0) + 1, q.insertBefore(Me, ke(l));
          }
        }
      }
      return F(l), !0;
    }
    return l instanceof h && !L(l) || (_ === "noscript" || _ === "noembed" || _ === "noframes") && de(/<\/no(script|embed|frames)/i, l.innerHTML) ? (F(l), !0) : (tt && l.nodeType === an.text && (y = l.textContent, zn([$t, Ft, je], (q) => {
      y = sn(y, q, " ");
    }), l.textContent !== y && (nn(e.removed, {
      element: l.cloneNode()
    }), l.textContent = y)), _e(le.afterSanitizeElements, l, null), !1);
  }, In = function(l, y, _) {
    if (Wt && (y === "id" || y === "name") && (_ in t || _ in I))
      return !1;
    if (!(Tn && !Vt[y] && de(ri, y))) {
      if (!(Sn && de(oi, y))) {
        if (!re[y] || Vt[y]) {
          if (
            // First condition does a very basic check if a) it's basically a valid custom element tagname AND
            // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
            !(Dn(l) && (ee.tagNameCheck instanceof RegExp && de(ee.tagNameCheck, l) || ee.tagNameCheck instanceof Function && ee.tagNameCheck(l)) && (ee.attributeNameCheck instanceof RegExp && de(ee.attributeNameCheck, y) || ee.attributeNameCheck instanceof Function && ee.attributeNameCheck(y)) || // Alternative, second condition checks if it's an `is`-attribute, AND
            // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            y === "is" && ee.allowCustomizedBuiltInElements && (ee.tagNameCheck instanceof RegExp && de(ee.tagNameCheck, _) || ee.tagNameCheck instanceof Function && ee.tagNameCheck(_)))
          ) return !1;
        } else if (!Xt[y]) {
          if (!de(En, sn(_, dt, ""))) {
            if (!((y === "src" || y === "xlink:href" || y === "href") && l !== "script" && so(_, "data:") === 0 && qt[l])) {
              if (!(ft && !de(ai, sn(_, dt, "")))) {
                if (_)
                  return !1;
              }
            }
          }
        }
      }
    }
    return !0;
  }, Dn = function(l) {
    return l !== "annotation-xml" && ds(l, li);
  }, Qt = function(l) {
    _e(le.beforeSanitizeAttributes, l, null);
    const {
      attributes: y
    } = l;
    if (!y || bt(l))
      return;
    const _ = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: re,
      forceKeepAttr: void 0
    };
    let q = y.length;
    for (; q--; ) {
      const oe = y[q], {
        name: te,
        namespaceURI: ue,
        value: Me
      } = oe, Ne = d(te), Jt = Me;
      let w = te === "value" ? Jt : ro(Jt);
      if (_.attrName = Ne, _.attrValue = w, _.keepAttr = !0, _.forceKeepAttr = void 0, _e(le.uponSanitizeAttribute, l, _), w = _.attrValue, Rn && (Ne === "id" || Ne === "name") && (W(te, l), w = ci + w), _t && de(/((--!?|])>)|<\/(style|title)/i, w)) {
        W(te, l);
        continue;
      }
      if (_.forceKeepAttr)
        continue;
      if (!_.keepAttr) {
        W(te, l);
        continue;
      }
      if (!An && de(/\/>/i, w)) {
        W(te, l);
        continue;
      }
      tt && zn([$t, Ft, je], (U) => {
        w = sn(w, U, " ");
      });
      const R = d(l.nodeName);
      if (!In(R, Ne, w)) {
        W(te, l);
        continue;
      }
      if (J && typeof H == "object" && typeof H.getAttributeType == "function" && !ue)
        switch (H.getAttributeType(R, Ne)) {
          case "TrustedHTML": {
            w = J.createHTML(w);
            break;
          }
          case "TrustedScriptURL": {
            w = J.createScriptURL(w);
            break;
          }
        }
      if (w !== Jt)
        try {
          ue ? l.setAttributeNS(ue, te, w) : l.setAttribute(te, w), bt(l) ? F(l) : hs(e.removed);
        } catch {
          W(te, l);
        }
    }
    _e(le.afterSanitizeAttributes, l, null);
  }, Mt = function A(l) {
    let y = null;
    const _ = Ot(l);
    for (_e(le.beforeSanitizeShadowDOM, l, null); y = _.nextNode(); )
      _e(le.uponSanitizeShadowNode, y, null), Ln(y), Qt(y), y.content instanceof r && A(y.content);
    _e(le.afterSanitizeShadowDOM, l, null);
  };
  return e.sanitize = function(A) {
    let l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, y = null, _ = null, q = null, oe = null;
    if (Yt = !A, Yt && (A = "<!-->"), typeof A != "string" && !Mn(A))
      if (typeof A.toString == "function") {
        if (A = A.toString(), typeof A != "string")
          throw rn("dirty is not a string, aborting");
      } else
        throw rn("toString is not a function");
    if (!e.isSupported)
      return A;
    if (jt || K(l), e.removed = [], typeof A == "string" && (Ee = !1), Ee) {
      if (A.nodeName) {
        const Me = d(A.nodeName);
        if (!ne[Me] || pt[Me])
          throw rn("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (A instanceof a)
      y = ot("<!---->"), _ = y.ownerDocument.importNode(A, !0), _.nodeType === an.element && _.nodeName === "BODY" || _.nodeName === "HTML" ? y = _ : y.appendChild(_);
    else {
      if (!nt && !tt && !Ge && // eslint-disable-next-line unicorn/prefer-includes
      A.indexOf("<") === -1)
        return J && Tt ? J.createHTML(A) : A;
      if (y = ot(A), !y)
        return nt ? null : Tt ? we : "";
    }
    y && Gt && F(y.firstChild);
    const te = Ot(Ee ? A : y);
    for (; q = te.nextNode(); )
      Ln(q), Qt(q), q.content instanceof r && Mt(q.content);
    if (Ee)
      return A;
    if (nt) {
      if (St)
        for (oe = Ht.call(y.ownerDocument); y.firstChild; )
          oe.appendChild(y.firstChild);
      else
        oe = y;
      return (re.shadowroot || re.shadowrootmode) && (oe = kn.call(i, oe, !0)), oe;
    }
    let ue = Ge ? y.outerHTML : y.innerHTML;
    return Ge && ne["!doctype"] && y.ownerDocument && y.ownerDocument.doctype && y.ownerDocument.doctype.name && de(Qs, y.ownerDocument.doctype.name) && (ue = "<!DOCTYPE " + y.ownerDocument.doctype.name + `>
` + ue), tt && zn([$t, Ft, je], (Me) => {
      ue = sn(ue, Me, " ");
    }), J && Tt ? J.createHTML(ue) : ue;
  }, e.setConfig = function() {
    let A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    K(A), jt = !0;
  }, e.clearConfig = function() {
    k = null, jt = !1;
  }, e.isValidAttribute = function(A, l, y) {
    k || K({});
    const _ = d(A), q = d(l);
    return In(_, q, y);
  }, e.addHook = function(A, l) {
    typeof l == "function" && nn(le[A], l);
  }, e.removeHook = function(A, l) {
    if (l !== void 0) {
      const y = no(le[A], l);
      return y === -1 ? void 0 : io(le[A], y, 1)[0];
    }
    return hs(le[A]);
  }, e.removeHooks = function(A) {
    le[A] = [];
  }, e.removeAllHooks = function() {
    le = bs();
  }, e;
}
var xs = Js();
function ko(n, e) {
  const t = document.createElement("div");
  switch (t.classList.add("text-content"), t.style.color = n.textColor, t.style.textAlign = n.justificationHorizontal, n.justificationVertical) {
    case "top":
      t.style.justifyContent = "flex-start";
      break;
    case "center":
      t.style.justifyContent = "center";
      break;
    case "bottom":
      t.style.justifyContent = "flex-end";
      break;
    default:
      throw new Error(`Unknown vertical justification: ${n.justificationVertical}`);
  }
  t.style.fontSize = e(n.fontSize);
  let i = j.parse(n.text);
  return i instanceof Promise ? i.then((s) => {
    t.innerHTML = xs.sanitize(s);
  }) : t.innerHTML = xs.sanitize(i), t;
}
class Eo extends $i {
  async prepare() {
    this.textContainer = document.createElement("div"), this.textContainer.classList.add("text-card"), this.root.appendChild(this.textContainer), this.textContainer.style.backgroundColor = this.card.background_color;
    const e = {
      text: this.card.text,
      textColor: this.card.text_color,
      fontSize: this.card.font_size,
      justificationHorizontal: this.card.justification_horizontal,
      justificationVertical: this.card.justification_vertical
    }, t = ko(
      e,
      (i) => this.boardCoords.getSizePx(i) + "px"
    );
    this.textContainer.appendChild(t);
  }
}
class vo extends $i {
  async prepare(e) {
    this.videoContainer = document.createElement("div"), this.videoContainer.classList.add("video-card"), this.root.appendChild(this.videoContainer), this.video = await e.getVideo(
      this.card.video
    ), this.video.classList.add("video-card__content"), this.videoContainer.appendChild(this.video), this.video.muted = this.card.muted, this.video.loop = this.card.loop, this.video.draggable = !0;
  }
  onStart() {
    if (!this.video)
      throw new Error("Video not initialized. Did you forget to call load()?");
    let e = new Promise((s, r) => {
      setTimeout(() => {
        r(new Error("Video failed to play within 2 frames!"));
      }, 33);
    }), t = new Promise((s, r) => {
      if (!this.video)
        throw new Error("Video not initialized. Did you forget to call load()?");
      this.video.onplaying = () => {
        s(null);
      };
    });
    this.video.play(), Promise.race([t, e]).catch((s) => {
      console.error(s);
    });
  }
  onStop() {
    this.video && (this.video.pause(), this.video.currentTime = 0);
  }
  onDestroy() {
    this.video && (this.video.removeAttribute("src"), this.video.load());
  }
}
class _o {
  constructor(e, t, i, s) {
    this.boardWidthPx = e, this.boardHeightPx = t, this.boardLeftPx = i, this.boardTopPx = s;
  }
  getUnitPx() {
    return Math.min(this.boardWidthPx, this.boardHeightPx);
  }
  getBoardLocationPx(e, t, i, s) {
    const r = this.getUnitPx(), c = this.boardWidthPx / r, a = this.boardHeightPx / r, h = r * (e - i / 2 + c / 2), u = r * (-t - s / 2 + a / 2);
    return {
      leftPx: h,
      topPx: u
    };
  }
  getBoardRectanglePx(e, t) {
    return {
      widthPx: this.getSizePx(e),
      heightPx: this.getSizePx(t)
    };
  }
  getSizePx(e) {
    return this.getUnitPx() * e;
  }
  getBoardLocationFromMouseEvent(e) {
    let t = (e.clientX - this.boardLeftPx) / this.boardWidthPx - 0.5, i = -((e.clientY - this.boardTopPx) / this.boardHeightPx - 0.5);
    return t = parseFloat(t.toFixed(10)), i = parseFloat(i.toFixed(10)), console.log(e.clientX, e.clientY, t, i), {
      x: t,
      y: i
    };
  }
}
class So {
  // Map of sensor ID to SensorBinding
  constructor(e, t) {
    this.cardViews = /* @__PURE__ */ new Map(), this.sensorBindings = /* @__PURE__ */ new Map(), this.root = document.createElement("div"), this.root.className = "board-view", this.root.id = `${e}`, this.root.style.width = t.board_width_px + "px", this.root.style.height = t.board_height_px + "px", this.root.style.backgroundColor = t.background_color, this.setBoardState(!1, !1);
  }
  getCoordinateSystem() {
    const { width: e, height: t, left: i, top: s } = this.root.getBoundingClientRect();
    return new _o(e, t, i, s);
  }
  reset() {
    for (; this.root.firstChild; )
      this.root.removeChild(this.root.firstChild);
  }
  setBoardState(e, t) {
    e ? this.root.style.opacity = "1" : this.root.style.opacity = "0", t ? (this.root.removeAttribute("disabled"), this.root.style.pointerEvents = "", this.root.style.userSelect = "", this.root.style.opacity = "") : (this.root.setAttribute("disabled", "true"), this.root.style.pointerEvents = "none", this.root.style.userSelect = "none");
  }
  // Cards
  getCardView(e) {
    const t = this.cardViews.get(e);
    if (!t)
      throw new Error(`CardView with ID ${e} not found.`);
    return t;
  }
  async prepareCard(e, t) {
    const i = this.getCoordinateSystem();
    let s = null;
    switch (e.card_type) {
      case "ImageCard":
        s = new mr(
          e,
          i
        );
        break;
      case "VideoCard":
        s = new vo(
          e,
          i
        );
        break;
      case "TextCard":
        s = new Eo(
          e,
          i
        );
        break;
      default:
        throw new Error(`Unsupported Card type: ${e}`);
    }
    await s.prepare(t), this.root.appendChild(s.root);
    const r = crypto.randomUUID();
    return this.cardViews.set(r, s), r;
  }
  startCard(e) {
    const t = this.getCardView(e);
    t.setVisibility(!0), t.onStart();
  }
  stopCard(e) {
    const t = this.getCardView(e);
    t.setVisibility(!1), t.onStop();
  }
  destroyCard(e) {
    const t = this.getCardView(e);
    t.onDestroy(), this.root.removeChild(t.root), this.cardViews.delete(e);
  }
  // Sensors
  getSensorBinding(e) {
    const t = this.sensorBindings.get(e);
    if (!t)
      throw new Error(`SensorBinding with ID ${e} not found.`);
    return t;
  }
  prepareSensor(e, t) {
    let i = null;
    if (e.sensor_type === "TimeoutSensor")
      i = new fr(
        t
      );
    else if (e.sensor_type === "KeySensor")
      i = new gr(
        t,
        e.key
      );
    else if (e.sensor_type == "ClickSensor")
      i = new pr(
        e.x,
        e.y,
        e.w,
        e.h,
        e.mask,
        t,
        this.root,
        this.getCoordinateSystem()
      );
    else
      throw new Error(`Unknown Sensor provided: ${e}`);
    const s = crypto.randomUUID();
    return this.sensorBindings.set(s, i), s;
  }
  startSensor(e) {
    this.getSensorBinding(e).arm();
  }
  destroySensor(e) {
    this.getSensorBinding(e).destroy(), this.sensorBindings.delete(e);
  }
}
class ys {
  constructor() {
    this.events = [], this.rafId = null, this.t0 = 0, this.state = "OPEN", this.onStopQueue = [], this.loop = (e) => {
      if (this.state !== "RUNNING")
        return;
      const t = e - this.t0;
      for (; this.events.length > 0 && this.events[0].triggerTimeMsec <= t; )
        this.events.shift().triggerFunc();
      this.events.length > 0 && (this.rafId = requestAnimationFrame(this.loop));
    };
  }
  scheduleEvent(e) {
    if (this.state !== "OPEN")
      throw new Error(`Cannot schedule event; scheduler state is ${this.state}`);
    const t = {
      triggerTimeMsec: e.triggerTimeMsec,
      triggerFunc: e.triggerFunc
    }, i = this.events.findIndex((s) => s.triggerTimeMsec > t.triggerTimeMsec);
    i === -1 ? this.events.push(t) : this.events.splice(i, 0, t);
  }
  scheduleOnStop(e) {
    if (this.state !== "OPEN")
      throw new Error(`Cannot schedule onStop callback; scheduler state is ${this.state}`);
    this.onStopQueue.push(e);
  }
  start() {
    this.state === "OPEN" && (this.state = "RUNNING", this.t0 = performance.now(), this.loop(this.t0));
  }
  stop() {
    if (this.state === "RUNNING")
      for (this.state = "CLOSED", this.rafId !== null && (cancelAnimationFrame(this.rafId), this.rafId = null); this.onStopQueue.length > 0; )
        this.onStopQueue.shift()();
  }
}
class To {
  constructor(e) {
    this.boardView = e;
  }
  start() {
    this.boardView.root.style.cursor = "none";
  }
  stop() {
    this.boardView.root.style.cursor = "";
  }
}
class ks {
  constructor() {
    this.alreadyCalled = !1, this.promise = new Promise(
      (e) => {
        this.resolveFunc = e;
      }
    );
  }
  resolve(e) {
    if (this.alreadyCalled) {
      console.warn("Warning: DeferredValue.resolve called multiple times; ignoring subsequent calls.", e);
      return;
    }
    this.alreadyCalled = !0, this.resolveFunc(e);
  }
}
class Ao {
  constructor(e, t) {
    this.prepared = !1, this.started = !1, this.deferredSensorFiring = new ks(), this.deferredOutcomeDone = new ks(), this.boardView = t, this.node = e, this.scheduler = new ys(), this.outcomeSchedulers = {};
  }
  async prepare(e) {
    for (const t of this.node.cards) {
      const i = await this.boardView.prepareCard(
        t,
        e
      );
      this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: t.start_msec,
          triggerFunc: () => {
            this.boardView.startCard(i);
          }
        }
      ), t.end_msec !== null && this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: t.end_msec,
          triggerFunc: () => {
            this.boardView.stopCard(i);
          }
        }
      ), this.scheduler.scheduleOnStop(
        () => {
          this.boardView.destroyCard(i);
        }
      );
    }
    for (let t = 0; t < this.node.sensors.length; t++) {
      const i = this.node.sensors[t], s = this.boardView.prepareSensor(
        i,
        (h, u) => this.deferredSensorFiring.resolve({
          sensorIndex: t,
          domTimestampAction: u,
          action: h
        })
      );
      if (this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: i.start_msec,
          triggerFunc: () => {
            this.boardView.startSensor(s);
          }
        }
      ), this.scheduler.scheduleOnStop(
        () => {
          this.boardView.destroySensor(s);
        }
      ), !i.outcome)
        continue;
      console.log(i);
      const r = i.outcome, c = new ys();
      let a = 0;
      for (const h of r.cards) {
        const u = await this.boardView.prepareCard(
          h,
          e
        );
        if (c.scheduleEvent(
          {
            triggerTimeMsec: h.start_msec,
            triggerFunc: () => {
              this.boardView.startCard(u);
            }
          }
        ), h.end_msec !== null)
          c.scheduleEvent(
            {
              triggerTimeMsec: h.end_msec,
              triggerFunc: () => {
                this.boardView.stopCard(u);
              }
            }
          ), h.end_msec > a && (a = h.end_msec);
        else
          throw new Error(`Consequence Cards must have an end time: ${h} `);
      }
      c.scheduleEvent(
        {
          triggerTimeMsec: a,
          triggerFunc: () => {
            this.deferredOutcomeDone.resolve();
          }
        }
      ), this.outcomeSchedulers[t] = c;
    }
    for (const t of this.node.effects) {
      const i = new To(this.boardView);
      this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: t.start_msec,
          triggerFunc: () => {
            i.start();
          }
        }
      ), t.end_msec !== null && this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: t.end_msec,
          triggerFunc: () => {
            i.stop();
          }
        }
      ), this.scheduler.scheduleOnStop(
        () => {
          i.stop();
        }
      );
    }
    this.prepared = !0;
  }
  async run() {
    if (!this.prepared)
      throw new Error("NodePlay not prepared");
    if (this.started)
      throw new Error("NodePlay already started");
    this.started = !0;
    const e = performance.now();
    this.scheduler.start();
    const t = await this.deferredSensorFiring.promise;
    this.scheduler.stop();
    const i = t.sensorIndex;
    if (i in this.outcomeSchedulers) {
      const s = this.outcomeSchedulers[i];
      s.start(), await this.deferredOutcomeDone.promise, s.stop();
    }
    return {
      sensorIndex: t.sensorIndex,
      action: t.action,
      domTimestampStart: e,
      domTimestampAction: t.domTimestampAction,
      domTimestampEnd: performance.now()
    };
  }
}
class Oe {
  constructor() {
    this._listenerRegistry = [];
  }
  mount(e) {
    e.appendChild(this.root);
  }
  disable(e = "dimmed") {
    switch (this.root.setAttribute("disabled", "true"), this.root.style.pointerEvents = "none", this.root.style.userSelect = "none", e) {
      case "invisible":
        this.root.style.opacity = "0";
        break;
      case "dimmed":
        this.root.style.opacity = "0.3";
        break;
      case "visible":
        this.root.style.opacity = "1";
        break;
    }
  }
  enable() {
    this.root.removeAttribute("disabled"), this.root.style.pointerEvents = "", this.root.style.userSelect = "", this.root.style.opacity = "";
  }
  destroy() {
    for (const e of this._findChildrenComponents())
      e.destroy();
    this.root.remove(), this.removeAllEventListeners();
  }
  _registerEventListener(e, t, i, s) {
    e.addEventListener(t, i, s), this._listenerRegistry.push({ type: t, handler: i, options: s });
  }
  _findChildrenComponents() {
    const e = [];
    for (const t of Object.keys(this)) {
      const i = this[t];
      i instanceof Oe ? e.push(i) : Array.isArray(i) && i.every((s) => s instanceof Oe) && e.push(...i);
    }
    return e;
  }
  removeAllEventListeners() {
    for (const { type: e, handler: t, options: i } of this._listenerRegistry)
      this.root.removeEventListener(e, t, i);
    this._listenerRegistry = [];
    for (const e of this._findChildrenComponents())
      e.removeAllEventListeners();
  }
}
class Ro extends Oe {
  constructor() {
    super(), this.root = document.createElement("div"), this.root.className = "status-dot";
  }
  setState(e) {
    const t = this.root;
    t.classList.remove(
      "status-dot--positive",
      "status-dot--negative",
      "status-dot--neutral"
    );
    const s = (/* @__PURE__ */ new Set(["positive", "negative", "neutral"])).has(e) ? e : "negative";
    t.classList.add(`status-dot--${s}`);
  }
}
class Co extends Oe {
  constructor(e) {
    switch (super(), this.root = document.createElement("div"), this.root.className = "progress-bar", this.progressBarDiv = document.createElement("div"), this.progressBarDiv.className = "progress-bar__inner", this.root.appendChild(this.progressBarDiv), e) {
      case "cognition":
        this.progressBarDiv.classList.add("progress-bar__inner--cognition");
        break;
      case "system":
        this.progressBarDiv.classList.add("progress-bar__inner--system");
        break;
      default:
        throw new Error(`Unknown progress bar type: ${e}`);
    }
  }
  setProgress(e) {
    const t = Math.round(Math.min(Math.max(e, 0), 100));
    this.progressBarDiv.style.width = `${t}%`;
  }
}
class ni extends Oe {
  constructor(e) {
    super(), this.root = document.createElement("div"), this.root.classList.add("overlay"), this.root.id = e;
  }
  setVisibility(e) {
    e ? this.root.classList.add("overlay--visible-state") : this.root.classList.remove("overlay--visible-state");
  }
}
class Oo extends Oe {
  constructor() {
    super(), this.spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"], this.spinnerInterval = null, this.frameIndex = 0, this.root = document.createElement("span"), this.root.style.paddingRight = "0.5rem", this.root.textContent = this.spinnerFrames[this.frameIndex];
  }
  startSpinning() {
    this.frameIndex = 0, this.spinnerInterval = window.setInterval(() => {
      this.root.textContent = this.spinnerFrames[this.frameIndex++ % this.spinnerFrames.length];
    }, 100);
  }
  stopSpinning() {
    this.spinnerInterval !== null && (clearInterval(this.spinnerInterval), this.spinnerInterval = null);
  }
}
class Mo extends ni {
  constructor() {
    super("session-connecting-overlay"), this.displayTimeout = null;
    const e = document.createElement("div");
    e.classList.add("connecting-message-box"), this.root.appendChild(e), this.spinner = new Oo(), this.spinner.mount(e);
    const t = document.createElement("div");
    t.classList.add("connecting-message-box__text"), t.textContent = "Connecting...", e.appendChild(t);
  }
  show(e) {
    this.displayTimeout = window.setTimeout(
      () => {
        this.spinner.startSpinning(), super.setVisibility(!0);
      },
      e
    );
  }
  hide() {
    this.displayTimeout !== null && (clearTimeout(this.displayTimeout), this.displayTimeout = null), this.spinner.stopSpinning(), super.setVisibility(!1);
  }
}
function Lo(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var xi, Es;
function Io() {
  if (Es) return xi;
  Es = 1;
  function n(o) {
    return o instanceof Map ? o.clear = o.delete = o.set = function() {
      throw new Error("map is read-only");
    } : o instanceof Set && (o.add = o.clear = o.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(o), Object.getOwnPropertyNames(o).forEach((d) => {
      const k = o[d], I = typeof k;
      (I === "object" || I === "function") && !Object.isFrozen(k) && n(k);
    }), o;
  }
  class e {
    /**
     * @param {CompiledMode} mode
     */
    constructor(d) {
      d.data === void 0 && (d.data = {}), this.data = d.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function t(o) {
    return o.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function i(o, ...d) {
    const k = /* @__PURE__ */ Object.create(null);
    for (const I in o)
      k[I] = o[I];
    return d.forEach(function(I) {
      for (const Q in I)
        k[Q] = I[Q];
    }), /** @type {T} */
    k;
  }
  const s = "</span>", r = (o) => !!o.scope, c = (o, { prefix: d }) => {
    if (o.startsWith("language:"))
      return o.replace("language:", "language-");
    if (o.includes(".")) {
      const k = o.split(".");
      return [
        `${d}${k.shift()}`,
        ...k.map((I, Q) => `${I}${"_".repeat(Q + 1)}`)
      ].join(" ");
    }
    return `${d}${o}`;
  };
  class a {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(d, k) {
      this.buffer = "", this.classPrefix = k.classPrefix, d.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(d) {
      this.buffer += t(d);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(d) {
      if (!r(d)) return;
      const k = c(
        d.scope,
        { prefix: this.classPrefix }
      );
      this.span(k);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(d) {
      r(d) && (this.buffer += s);
    }
    /**
     * returns the accumulated buffer
    */
    value() {
      return this.buffer;
    }
    // helpers
    /**
     * Builds a span element
     *
     * @param {string} className */
    span(d) {
      this.buffer += `<span class="${d}">`;
    }
  }
  const h = (o = {}) => {
    const d = { children: [] };
    return Object.assign(d, o), d;
  };
  class u {
    constructor() {
      this.rootNode = h(), this.stack = [this.rootNode];
    }
    get top() {
      return this.stack[this.stack.length - 1];
    }
    get root() {
      return this.rootNode;
    }
    /** @param {Node} node */
    add(d) {
      this.top.children.push(d);
    }
    /** @param {string} scope */
    openNode(d) {
      const k = h({ scope: d });
      this.add(k), this.stack.push(k);
    }
    closeNode() {
      if (this.stack.length > 1)
        return this.stack.pop();
    }
    closeAllNodes() {
      for (; this.closeNode(); ) ;
    }
    toJSON() {
      return JSON.stringify(this.rootNode, null, 4);
    }
    /**
     * @typedef { import("./html_renderer").Renderer } Renderer
     * @param {Renderer} builder
     */
    walk(d) {
      return this.constructor._walk(d, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(d, k) {
      return typeof k == "string" ? d.addText(k) : k.children && (d.openNode(k), k.children.forEach((I) => this._walk(d, I)), d.closeNode(k)), d;
    }
    /**
     * @param {Node} node
     */
    static _collapse(d) {
      typeof d != "string" && d.children && (d.children.every((k) => typeof k == "string") ? d.children = [d.children.join("")] : d.children.forEach((k) => {
        u._collapse(k);
      }));
    }
  }
  class p extends u {
    /**
     * @param {*} options
     */
    constructor(d) {
      super(), this.options = d;
    }
    /**
     * @param {string} text
     */
    addText(d) {
      d !== "" && this.add(d);
    }
    /** @param {string} scope */
    startScope(d) {
      this.openNode(d);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(d, k) {
      const I = d.root;
      k && (I.scope = `language:${k}`), this.add(I);
    }
    toHTML() {
      return new a(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function O(o) {
    return o ? typeof o == "string" ? o : o.source : null;
  }
  function E(o) {
    return M("(?=", o, ")");
  }
  function H(o) {
    return M("(?:", o, ")*");
  }
  function P(o) {
    return M("(?:", o, ")?");
  }
  function M(...o) {
    return o.map((k) => O(k)).join("");
  }
  function Te(o) {
    const d = o[o.length - 1];
    return typeof d == "object" && d.constructor === Object ? (o.splice(o.length - 1, 1), d) : {};
  }
  function ke(...o) {
    return "(" + (Te(o).capture ? "" : "?:") + o.map((I) => O(I)).join("|") + ")";
  }
  function se(o) {
    return new RegExp(o.toString() + "|").exec("").length - 1;
  }
  function me(o, d) {
    const k = o && o.exec(d);
    return k && k.index === 0;
  }
  const J = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function we(o, { joinWith: d }) {
    let k = 0;
    return o.map((I) => {
      k += 1;
      const Q = k;
      let K = O(I), T = "";
      for (; K.length > 0; ) {
        const S = J.exec(K);
        if (!S) {
          T += K;
          break;
        }
        T += K.substring(0, S.index), K = K.substring(S.index + S[0].length), S[0][0] === "\\" && S[1] ? T += "\\" + String(Number(S[1]) + Q) : (T += S[0], S[0] === "(" && k++);
      }
      return T;
    }).map((I) => `(${I})`).join(d);
  }
  const Ve = /\b\B/, Pe = "[a-zA-Z]\\w*", Ht = "[a-zA-Z_]\\w*", yn = "\\b\\d+(\\.\\d+)?", kn = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", le = "\\b(0b[01]+)", $t = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", Ft = (o = {}) => {
    const d = /^#![ ]*\//;
    return o.binary && (o.begin = M(
      d,
      /.*\b/,
      o.binary,
      /\b.*/
    )), i({
      scope: "meta",
      begin: d,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (k, I) => {
        k.index !== 0 && I.ignoreMatch();
      }
    }, o);
  }, je = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, ri = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [je]
  }, oi = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [je]
  }, ai = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, dt = function(o, d, k = {}) {
    const I = i(
      {
        scope: "comment",
        begin: o,
        end: d,
        contains: []
      },
      k
    );
    I.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const Q = ke(
      // list of common 1 and 2 letter words in English
      "I",
      "a",
      "is",
      "so",
      "us",
      "to",
      "at",
      "if",
      "in",
      "it",
      "on",
      // note: this is not an exhaustive list of contractions, just popular ones
      /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
      // contractions - can't we'd they're let's, etc
      /[A-Za-z]+[-][a-z]+/,
      // `no-way`, etc.
      /[A-Za-z][a-z]{2,}/
      // allow capitalized words at beginning of sentences
    );
    return I.contains.push(
      {
        // TODO: how to include ", (, ) without breaking grammars that use these for
        // comment delimiters?
        // begin: /[ ]+([()"]?([A-Za-z'-]{3,}|is|a|I|so|us|[tT][oO]|at|if|in|it|on)[.]?[()":]?([.][ ]|[ ]|\))){3}/
        // ---
        // this tries to find sequences of 3 english words in a row (without any
        // "programming" type syntax) this gives us a strong signal that we've
        // TRULY found a comment - vs perhaps scanning with the wrong language.
        // It's possible to find something that LOOKS like the start of the
        // comment - but then if there is no readable text - good chance it is a
        // false match and not a comment.
        //
        // for a visual example please see:
        // https://github.com/highlightjs/highlight.js/issues/2827
        begin: M(
          /[ ]+/,
          // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
          "(",
          Q,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), I;
  }, li = dt("//", "$"), En = dt("/\\*", "\\*/"), ne = dt("#", "$"), vn = {
    scope: "number",
    begin: yn,
    relevance: 0
  }, re = {
    scope: "number",
    begin: kn,
    relevance: 0
  }, _n = {
    scope: "number",
    begin: le,
    relevance: 0
  }, ee = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      je,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [je]
      }
    ]
  }, pt = {
    scope: "title",
    begin: Pe,
    relevance: 0
  }, Vt = {
    scope: "title",
    begin: Ht,
    relevance: 0
  }, Sn = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + Ht,
    relevance: 0
  };
  var ft = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: ri,
    BACKSLASH_ESCAPE: je,
    BINARY_NUMBER_MODE: _n,
    BINARY_NUMBER_RE: le,
    COMMENT: dt,
    C_BLOCK_COMMENT_MODE: En,
    C_LINE_COMMENT_MODE: li,
    C_NUMBER_MODE: re,
    C_NUMBER_RE: kn,
    END_SAME_AS_BEGIN: function(o) {
      return Object.assign(
        o,
        {
          /** @type {ModeCallback} */
          "on:begin": (d, k) => {
            k.data._beginMatch = d[1];
          },
          /** @type {ModeCallback} */
          "on:end": (d, k) => {
            k.data._beginMatch !== d[1] && k.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: ne,
    IDENT_RE: Pe,
    MATCH_NOTHING_RE: Ve,
    METHOD_GUARD: Sn,
    NUMBER_MODE: vn,
    NUMBER_RE: yn,
    PHRASAL_WORDS_MODE: ai,
    QUOTE_STRING_MODE: oi,
    REGEXP_MODE: ee,
    RE_STARTERS_RE: $t,
    SHEBANG: Ft,
    TITLE_MODE: pt,
    UNDERSCORE_IDENT_RE: Ht,
    UNDERSCORE_TITLE_MODE: Vt
  });
  function An(o, d) {
    o.input[o.index - 1] === "." && d.ignoreMatch();
  }
  function tt(o, d) {
    o.className !== void 0 && (o.scope = o.className, delete o.className);
  }
  function _t(o, d) {
    d && o.beginKeywords && (o.begin = "\\b(" + o.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", o.__beforeBegin = An, o.keywords = o.keywords || o.beginKeywords, delete o.beginKeywords, o.relevance === void 0 && (o.relevance = 0));
  }
  function Ge(o, d) {
    Array.isArray(o.illegal) && (o.illegal = ke(...o.illegal));
  }
  function jt(o, d) {
    if (o.match) {
      if (o.begin || o.end) throw new Error("begin & end are not supported with match");
      o.begin = o.match, delete o.match;
    }
  }
  function Gt(o, d) {
    o.relevance === void 0 && (o.relevance = 1);
  }
  const nt = (o, d) => {
    if (!o.beforeMatch) return;
    if (o.starts) throw new Error("beforeMatch cannot be used with starts");
    const k = Object.assign({}, o);
    Object.keys(o).forEach((I) => {
      delete o[I];
    }), o.keywords = k.keywords, o.begin = M(k.beforeMatch, E(k.begin)), o.starts = {
      relevance: 0,
      contains: [
        Object.assign(k, { endsParent: !0 })
      ]
    }, o.relevance = 0, delete k.beforeMatch;
  }, St = [
    "of",
    "and",
    "for",
    "in",
    "not",
    "or",
    "if",
    "then",
    "parent",
    // common variable name
    "list",
    // common variable name
    "value"
    // common variable name
  ], Tt = "keyword";
  function Wt(o, d, k = Tt) {
    const I = /* @__PURE__ */ Object.create(null);
    return typeof o == "string" ? Q(k, o.split(" ")) : Array.isArray(o) ? Q(k, o) : Object.keys(o).forEach(function(K) {
      Object.assign(
        I,
        Wt(o[K], d, K)
      );
    }), I;
    function Q(K, T) {
      d && (T = T.map((S) => S.toLowerCase())), T.forEach(function(S) {
        const L = S.split("|");
        I[L[0]] = [K, Rn(L[0], L[1])];
      });
    }
  }
  function Rn(o, d) {
    return d ? Number(d) : ci(o) ? 0 : 1;
  }
  function ci(o) {
    return St.includes(o.toLowerCase());
  }
  const At = {}, Ee = (o) => {
    console.error(o);
  }, We = (o, ...d) => {
    console.log(`WARN: ${o}`, ...d);
  }, ve = (o, d) => {
    At[`${o}/${d}`] || (console.log(`Deprecated as of ${o}. ${d}`), At[`${o}/${d}`] = !0);
  }, gt = new Error();
  function qt(o, d, { key: k }) {
    let I = 0;
    const Q = o[k], K = {}, T = {};
    for (let S = 1; S <= d.length; S++)
      T[S + I] = Q[S], K[S + I] = !0, I += se(d[S - 1]);
    o[k] = T, o[k]._emit = K, o[k]._multi = !0;
  }
  function Cn(o) {
    if (Array.isArray(o.begin)) {
      if (o.skip || o.excludeBegin || o.returnBegin)
        throw Ee("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), gt;
      if (typeof o.beginScope != "object" || o.beginScope === null)
        throw Ee("beginScope must be object"), gt;
      qt(o, o.begin, { key: "beginScope" }), o.begin = we(o.begin, { joinWith: "" });
    }
  }
  function Xt(o) {
    if (Array.isArray(o.end)) {
      if (o.skip || o.excludeEnd || o.returnEnd)
        throw Ee("skip, excludeEnd, returnEnd not compatible with endScope: {}"), gt;
      if (typeof o.endScope != "object" || o.endScope === null)
        throw Ee("endScope must be object"), gt;
      qt(o, o.end, { key: "endScope" }), o.end = we(o.end, { joinWith: "" });
    }
  }
  function On(o) {
    o.scope && typeof o.scope == "object" && o.scope !== null && (o.beginScope = o.scope, delete o.scope);
  }
  function Rt(o) {
    On(o), typeof o.beginScope == "string" && (o.beginScope = { _wrap: o.beginScope }), typeof o.endScope == "string" && (o.endScope = { _wrap: o.endScope }), Cn(o), Xt(o);
  }
  function Ct(o) {
    function d(T, S) {
      return new RegExp(
        O(T),
        "m" + (o.case_insensitive ? "i" : "") + (o.unicodeRegex ? "u" : "") + (S ? "g" : "")
      );
    }
    class k {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(S, L) {
        L.position = this.position++, this.matchIndexes[this.matchAt] = L, this.regexes.push([L, S]), this.matchAt += se(S) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const S = this.regexes.map((L) => L[1]);
        this.matcherRe = d(we(S, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(S) {
        this.matcherRe.lastIndex = this.lastIndex;
        const L = this.matcherRe.exec(S);
        if (!L)
          return null;
        const F = L.findIndex((ot, Ot) => Ot > 0 && ot !== void 0), W = this.matchIndexes[F];
        return L.splice(0, F), Object.assign(L, W);
      }
    }
    class I {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(S) {
        if (this.multiRegexes[S]) return this.multiRegexes[S];
        const L = new k();
        return this.rules.slice(S).forEach(([F, W]) => L.addRule(F, W)), L.compile(), this.multiRegexes[S] = L, L;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(S, L) {
        this.rules.push([S, L]), L.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(S) {
        const L = this.getMatcher(this.regexIndex);
        L.lastIndex = this.lastIndex;
        let F = L.exec(S);
        if (this.resumingScanAtSamePosition() && !(F && F.index === this.lastIndex)) {
          const W = this.getMatcher(0);
          W.lastIndex = this.lastIndex + 1, F = W.exec(S);
        }
        return F && (this.regexIndex += F.position + 1, this.regexIndex === this.count && this.considerAll()), F;
      }
    }
    function Q(T) {
      const S = new I();
      return T.contains.forEach((L) => S.addRule(L.begin, { rule: L, type: "begin" })), T.terminatorEnd && S.addRule(T.terminatorEnd, { type: "end" }), T.illegal && S.addRule(T.illegal, { type: "illegal" }), S;
    }
    function K(T, S) {
      const L = (
        /** @type CompiledMode */
        T
      );
      if (T.isCompiled) return L;
      [
        tt,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        jt,
        Rt,
        nt
      ].forEach((W) => W(T, S)), o.compilerExtensions.forEach((W) => W(T, S)), T.__beforeBegin = null, [
        _t,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        Ge,
        // default to 1 relevance if not specified
        Gt
      ].forEach((W) => W(T, S)), T.isCompiled = !0;
      let F = null;
      return typeof T.keywords == "object" && T.keywords.$pattern && (T.keywords = Object.assign({}, T.keywords), F = T.keywords.$pattern, delete T.keywords.$pattern), F = F || /\w+/, T.keywords && (T.keywords = Wt(T.keywords, o.case_insensitive)), L.keywordPatternRe = d(F, !0), S && (T.begin || (T.begin = /\B|\b/), L.beginRe = d(L.begin), !T.end && !T.endsWithParent && (T.end = /\B|\b/), T.end && (L.endRe = d(L.end)), L.terminatorEnd = O(L.end) || "", T.endsWithParent && S.terminatorEnd && (L.terminatorEnd += (T.end ? "|" : "") + S.terminatorEnd)), T.illegal && (L.illegalRe = d(
        /** @type {RegExp | string} */
        T.illegal
      )), T.contains || (T.contains = []), T.contains = [].concat(...T.contains.map(function(W) {
        return it(W === "self" ? T : W);
      })), T.contains.forEach(function(W) {
        K(
          /** @type Mode */
          W,
          L
        );
      }), T.starts && K(T.starts, S), L.matcher = Q(L), L;
    }
    if (o.compilerExtensions || (o.compilerExtensions = []), o.contains && o.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return o.classNameAliases = i(o.classNameAliases || {}), K(
      /** @type Mode */
      o
    );
  }
  function Ae(o) {
    return o ? o.endsWithParent || Ae(o.starts) : !1;
  }
  function it(o) {
    return o.variants && !o.cachedVariants && (o.cachedVariants = o.variants.map(function(d) {
      return i(o, { variants: null }, d);
    })), o.cachedVariants ? o.cachedVariants : Ae(o) ? i(o, { starts: o.starts ? i(o.starts) : null }) : Object.isFrozen(o) ? i(o) : o;
  }
  var Yt = "11.11.1";
  class Zt extends Error {
    constructor(d, k) {
      super(d), this.name = "HTMLInjectionError", this.html = k;
    }
  }
  const Kt = t, mt = i, wt = Symbol("nomatch"), ui = 7, st = function(o) {
    const d = /* @__PURE__ */ Object.create(null), k = /* @__PURE__ */ Object.create(null), I = [];
    let Q = !0;
    const K = "Could not find the language '{}', did you forget to load/include a language module?", T = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let S = {
      ignoreUnescapedHTML: !1,
      throwUnescapedHTML: !1,
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      cssSelector: "pre code",
      languages: null,
      // beta configuration options, subject to change, welcome to discuss
      // https://github.com/highlightjs/highlight.js/issues/1086
      __emitter: p
    };
    function L(w) {
      return S.noHighlightRe.test(w);
    }
    function F(w) {
      let R = w.className + " ";
      R += w.parentNode ? w.parentNode.className : "";
      const U = S.languageDetectRe.exec(R);
      if (U) {
        const Y = _(U[1]);
        return Y || (We(K.replace("{}", U[1])), We("Falling back to no-highlight mode for this block.", w)), Y ? U[1] : "no-highlight";
      }
      return R.split(/\s+/).find((Y) => L(Y) || _(Y));
    }
    function W(w, R, U) {
      let Y = "", ae = "";
      typeof R == "object" ? (Y = w, U = R.ignoreIllegals, ae = R.language) : (ve("10.7.0", "highlight(lang, code, ...args) has been deprecated."), ve("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), ae = w, Y = R), U === void 0 && (U = !0);
      const Le = {
        code: Y,
        language: ae
      };
      Ne("before:highlight", Le);
      const at = Le.result ? Le.result : ot(Le.language, Le.code, U);
      return at.code = Le.code, Ne("after:highlight", at), at;
    }
    function ot(w, R, U, Y) {
      const ae = /* @__PURE__ */ Object.create(null);
      function Le(v, C) {
        return v.keywords[C];
      }
      function at() {
        if (!N.keywords) {
          ce.addText(Z);
          return;
        }
        let v = 0;
        N.keywordPatternRe.lastIndex = 0;
        let C = N.keywordPatternRe.exec(Z), B = "";
        for (; C; ) {
          B += Z.substring(v, C.index);
          const V = Ue.case_insensitive ? C[0].toLowerCase() : C[0], he = Le(N, V);
          if (he) {
            const [qe, cr] = he;
            if (ce.addText(B), B = "", ae[V] = (ae[V] || 0) + 1, ae[V] <= ui && (Bn += cr), qe.startsWith("_"))
              B += C[0];
            else {
              const ur = Ue.classNameAliases[qe] || qe;
              Be(C[0], ur);
            }
          } else
            B += C[0];
          v = N.keywordPatternRe.lastIndex, C = N.keywordPatternRe.exec(Z);
        }
        B += Z.substring(v), ce.addText(B);
      }
      function Pn() {
        if (Z === "") return;
        let v = null;
        if (typeof N.subLanguage == "string") {
          if (!d[N.subLanguage]) {
            ce.addText(Z);
            return;
          }
          v = ot(N.subLanguage, Z, !0, ss[N.subLanguage]), ss[N.subLanguage] = /** @type {CompiledMode} */
          v._top;
        } else
          v = bt(Z, N.subLanguage.length ? N.subLanguage : null);
        N.relevance > 0 && (Bn += v.relevance), ce.__addSublanguage(v._emitter, v.language);
      }
      function Se() {
        N.subLanguage != null ? Pn() : at(), Z = "";
      }
      function Be(v, C) {
        v !== "" && (ce.startScope(C), ce.addText(v), ce.endScope());
      }
      function es(v, C) {
        let B = 1;
        const V = C.length - 1;
        for (; B <= V; ) {
          if (!v._emit[B]) {
            B++;
            continue;
          }
          const he = Ue.classNameAliases[v[B]] || v[B], qe = C[B];
          he ? Be(qe, he) : (Z = qe, at(), Z = ""), B++;
        }
      }
      function ts(v, C) {
        return v.scope && typeof v.scope == "string" && ce.openNode(Ue.classNameAliases[v.scope] || v.scope), v.beginScope && (v.beginScope._wrap ? (Be(Z, Ue.classNameAliases[v.beginScope._wrap] || v.beginScope._wrap), Z = "") : v.beginScope._multi && (es(v.beginScope, C), Z = "")), N = Object.create(v, { parent: { value: N } }), N;
      }
      function ns(v, C, B) {
        let V = me(v.endRe, B);
        if (V) {
          if (v["on:end"]) {
            const he = new e(v);
            v["on:end"](C, he), he.isMatchIgnored && (V = !1);
          }
          if (V) {
            for (; v.endsParent && v.parent; )
              v = v.parent;
            return v;
          }
        }
        if (v.endsWithParent)
          return ns(v.parent, C, B);
      }
      function sr(v) {
        return N.matcher.regexIndex === 0 ? (Z += v[0], 1) : (pi = !0, 0);
      }
      function rr(v) {
        const C = v[0], B = v.rule, V = new e(B), he = [B.__beforeBegin, B["on:begin"]];
        for (const qe of he)
          if (qe && (qe(v, V), V.isMatchIgnored))
            return sr(C);
        return B.skip ? Z += C : (B.excludeBegin && (Z += C), Se(), !B.returnBegin && !B.excludeBegin && (Z = C)), ts(B, v), B.returnBegin ? 0 : C.length;
      }
      function or(v) {
        const C = v[0], B = R.substring(v.index), V = ns(N, v, B);
        if (!V)
          return wt;
        const he = N;
        N.endScope && N.endScope._wrap ? (Se(), Be(C, N.endScope._wrap)) : N.endScope && N.endScope._multi ? (Se(), es(N.endScope, v)) : he.skip ? Z += C : (he.returnEnd || he.excludeEnd || (Z += C), Se(), he.excludeEnd && (Z = C));
        do
          N.scope && ce.closeNode(), !N.skip && !N.subLanguage && (Bn += N.relevance), N = N.parent;
        while (N !== V.parent);
        return V.starts && ts(V.starts, v), he.returnEnd ? 0 : C.length;
      }
      function ar() {
        const v = [];
        for (let C = N; C !== Ue; C = C.parent)
          C.scope && v.unshift(C.scope);
        v.forEach((C) => ce.openNode(C));
      }
      let Nn = {};
      function is(v, C) {
        const B = C && C[0];
        if (Z += v, B == null)
          return Se(), 0;
        if (Nn.type === "begin" && C.type === "end" && Nn.index === C.index && B === "") {
          if (Z += R.slice(C.index, C.index + 1), !Q) {
            const V = new Error(`0 width match regex (${w})`);
            throw V.languageName = w, V.badRule = Nn.rule, V;
          }
          return 1;
        }
        if (Nn = C, C.type === "begin")
          return rr(C);
        if (C.type === "illegal" && !U) {
          const V = new Error('Illegal lexeme "' + B + '" for mode "' + (N.scope || "<unnamed>") + '"');
          throw V.mode = N, V;
        } else if (C.type === "end") {
          const V = or(C);
          if (V !== wt)
            return V;
        }
        if (C.type === "illegal" && B === "")
          return Z += `
`, 1;
        if (di > 1e5 && di > C.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return Z += B, B.length;
      }
      const Ue = _(w);
      if (!Ue)
        throw Ee(K.replace("{}", w)), new Error('Unknown language: "' + w + '"');
      const lr = Ct(Ue);
      let hi = "", N = Y || lr;
      const ss = {}, ce = new S.__emitter(S);
      ar();
      let Z = "", Bn = 0, xt = 0, di = 0, pi = !1;
      try {
        if (Ue.__emitTokens)
          Ue.__emitTokens(R, ce);
        else {
          for (N.matcher.considerAll(); ; ) {
            di++, pi ? pi = !1 : N.matcher.considerAll(), N.matcher.lastIndex = xt;
            const v = N.matcher.exec(R);
            if (!v) break;
            const C = R.substring(xt, v.index), B = is(C, v);
            xt = v.index + B;
          }
          is(R.substring(xt));
        }
        return ce.finalize(), hi = ce.toHTML(), {
          language: w,
          value: hi,
          relevance: Bn,
          illegal: !1,
          _emitter: ce,
          _top: N
        };
      } catch (v) {
        if (v.message && v.message.includes("Illegal"))
          return {
            language: w,
            value: Kt(R),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: v.message,
              index: xt,
              context: R.slice(xt - 100, xt + 100),
              mode: v.mode,
              resultSoFar: hi
            },
            _emitter: ce
          };
        if (Q)
          return {
            language: w,
            value: Kt(R),
            illegal: !1,
            relevance: 0,
            errorRaised: v,
            _emitter: ce,
            _top: N
          };
        throw v;
      }
    }
    function Ot(w) {
      const R = {
        value: Kt(w),
        illegal: !1,
        relevance: 0,
        _top: T,
        _emitter: new S.__emitter(S)
      };
      return R._emitter.addText(w), R;
    }
    function bt(w, R) {
      R = R || S.languages || Object.keys(d);
      const U = Ot(w), Y = R.filter(_).filter(oe).map(
        (Se) => ot(Se, w, !1)
      );
      Y.unshift(U);
      const ae = Y.sort((Se, Be) => {
        if (Se.relevance !== Be.relevance) return Be.relevance - Se.relevance;
        if (Se.language && Be.language) {
          if (_(Se.language).supersetOf === Be.language)
            return 1;
          if (_(Be.language).supersetOf === Se.language)
            return -1;
        }
        return 0;
      }), [Le, at] = ae, Pn = Le;
      return Pn.secondBest = at, Pn;
    }
    function Mn(w, R, U) {
      const Y = R && k[R] || U;
      w.classList.add("hljs"), w.classList.add(`language-${Y}`);
    }
    function _e(w) {
      let R = null;
      const U = F(w);
      if (L(U)) return;
      if (Ne(
        "before:highlightElement",
        { el: w, language: U }
      ), w.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", w);
        return;
      }
      if (w.children.length > 0 && (S.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(w)), S.throwUnescapedHTML))
        throw new Zt(
          "One of your code blocks includes unescaped HTML.",
          w.innerHTML
        );
      R = w;
      const Y = R.textContent, ae = U ? W(Y, { language: U, ignoreIllegals: !0 }) : bt(Y);
      w.innerHTML = ae.value, w.dataset.highlighted = "yes", Mn(w, U, ae.language), w.result = {
        language: ae.language,
        // TODO: remove with version 11.0
        re: ae.relevance,
        relevance: ae.relevance
      }, ae.secondBest && (w.secondBest = {
        language: ae.secondBest.language,
        relevance: ae.secondBest.relevance
      }), Ne("after:highlightElement", { el: w, result: ae, text: Y });
    }
    function Ln(w) {
      S = mt(S, w);
    }
    const In = () => {
      Mt(), ve("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Dn() {
      Mt(), ve("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let Qt = !1;
    function Mt() {
      function w() {
        Mt();
      }
      if (document.readyState === "loading") {
        Qt || window.addEventListener("DOMContentLoaded", w, !1), Qt = !0;
        return;
      }
      document.querySelectorAll(S.cssSelector).forEach(_e);
    }
    function A(w, R) {
      let U = null;
      try {
        U = R(o);
      } catch (Y) {
        if (Ee("Language definition for '{}' could not be registered.".replace("{}", w)), Q)
          Ee(Y);
        else
          throw Y;
        U = T;
      }
      U.name || (U.name = w), d[w] = U, U.rawDefinition = R.bind(null, o), U.aliases && q(U.aliases, { languageName: w });
    }
    function l(w) {
      delete d[w];
      for (const R of Object.keys(k))
        k[R] === w && delete k[R];
    }
    function y() {
      return Object.keys(d);
    }
    function _(w) {
      return w = (w || "").toLowerCase(), d[w] || d[k[w]];
    }
    function q(w, { languageName: R }) {
      typeof w == "string" && (w = [w]), w.forEach((U) => {
        k[U.toLowerCase()] = R;
      });
    }
    function oe(w) {
      const R = _(w);
      return R && !R.disableAutodetect;
    }
    function te(w) {
      w["before:highlightBlock"] && !w["before:highlightElement"] && (w["before:highlightElement"] = (R) => {
        w["before:highlightBlock"](
          Object.assign({ block: R.el }, R)
        );
      }), w["after:highlightBlock"] && !w["after:highlightElement"] && (w["after:highlightElement"] = (R) => {
        w["after:highlightBlock"](
          Object.assign({ block: R.el }, R)
        );
      });
    }
    function ue(w) {
      te(w), I.push(w);
    }
    function Me(w) {
      const R = I.indexOf(w);
      R !== -1 && I.splice(R, 1);
    }
    function Ne(w, R) {
      const U = w;
      I.forEach(function(Y) {
        Y[U] && Y[U](R);
      });
    }
    function Jt(w) {
      return ve("10.7.0", "highlightBlock will be removed entirely in v12.0"), ve("10.7.0", "Please use highlightElement now."), _e(w);
    }
    Object.assign(o, {
      highlight: W,
      highlightAuto: bt,
      highlightAll: Mt,
      highlightElement: _e,
      // TODO: Remove with v12 API
      highlightBlock: Jt,
      configure: Ln,
      initHighlighting: In,
      initHighlightingOnLoad: Dn,
      registerLanguage: A,
      unregisterLanguage: l,
      listLanguages: y,
      getLanguage: _,
      registerAliases: q,
      autoDetection: oe,
      inherit: mt,
      addPlugin: ue,
      removePlugin: Me
    }), o.debugMode = function() {
      Q = !1;
    }, o.safeMode = function() {
      Q = !0;
    }, o.versionString = Yt, o.regex = {
      concat: M,
      lookahead: E,
      either: ke,
      optional: P,
      anyNumberOfTimes: H
    };
    for (const w in ft)
      typeof ft[w] == "object" && n(ft[w]);
    return Object.assign(o, ft), o;
  }, rt = st({});
  return rt.newInstance = () => st({}), xi = rt, rt.HighlightJS = rt, rt.default = rt, xi;
}
var Do = /* @__PURE__ */ Io();
const er = /* @__PURE__ */ Lo(Do);
function Po(n) {
  const e = {
    className: "attr",
    begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
    relevance: 1.01
  }, t = {
    match: /[{}[\],:]/,
    className: "punctuation",
    relevance: 0
  }, i = [
    "true",
    "false",
    "null"
  ], s = {
    scope: "literal",
    beginKeywords: i.join(" ")
  };
  return {
    name: "JSON",
    aliases: ["jsonc"],
    keywords: {
      literal: i
    },
    contains: [
      e,
      t,
      n.QUOTE_STRING_MODE,
      s,
      n.C_NUMBER_MODE,
      n.C_LINE_COMMENT_MODE,
      n.C_BLOCK_COMMENT_MODE
    ],
    illegal: "\\S"
  };
}
er.registerLanguage("json", Po);
class No extends Oe {
  constructor() {
    super(), this.root = document.createElement("div"), this.root.classList.add("json-viewer"), this.jsonViewerContent = document.createElement("div"), this.jsonViewerContent.classList.add("json-viewer__content"), this.root.appendChild(this.jsonViewerContent);
  }
  displayAsJson(e) {
    this.clear();
    const t = document.createElement("pre");
    t.classList.add("json-viewer__pre"), t.textContent = JSON.stringify(e, null, 2), er.highlightElement(t), t.style.backgroundColor = "transparent", this.jsonViewerContent.appendChild(t);
  }
  clear() {
  }
}
class Bo extends ni {
  constructor() {
    super("console-message-overlay");
    const e = document.createElement("div");
    e.classList.add("console-title-box"), this.root.appendChild(e), this.titleTextDiv = document.createElement("div"), this.titleTextDiv.classList.add("console-title-box__text"), e.appendChild(this.titleTextDiv), this.jsonViewer = new No(), this.jsonViewer.mount(this.root);
    const t = new Uo();
    t.setCopyTarget(this.jsonViewer.root), t.mount(e);
  }
  displayMessage(e, t) {
    this.titleTextDiv.innerHTML = e, this.jsonViewer.displayAsJson(t), super.setVisibility(!0);
  }
  hide() {
    this.titleTextDiv.innerHTML = "", this.jsonViewer.clear(), super.setVisibility(!1);
  }
}
class Uo extends Oe {
  constructor() {
    super();
    const e = document.createElement("button");
    e.classList.add("copy-button"), e.classList.add("copy-button"), e.textContent = "Copy", this.root = e;
  }
  setCopyTarget(e) {
    this.root.onclick = () => {
      const t = e.textContent || "";
      navigator.clipboard.writeText(t);
    };
  }
}
class zo extends ni {
  constructor() {
    super("session-finished-overlay"), this.submitButton = new Ho(), this.submitButton.mount(this.root), this.messageBox = document.createElement("div"), this.messageBox.classList.add("debrief-message-box"), this.root.appendChild(this.messageBox), this.messageSpan = document.createElement("span"), this.messageSpan.classList.add("debrief-message-box__text"), this.messageBox.appendChild(this.messageSpan);
  }
  show(e, t) {
    e.length == 0 ? this.messageBox.style.visibility = "hidden" : this.messageBox.style.visibility = "visible", this.messageSpan.textContent = e, this.submitButton.attachClickListener(t), this.setVisibility(!0);
  }
  hide() {
    this.messageSpan.textContent = "", super.setVisibility(!1), this.submitButton.removeAllEventListeners();
  }
}
class Ho extends Oe {
  constructor() {
    super();
    const e = document.createElement("button");
    e.classList.add("submit-button"), e.textContent = "Press to Submit", this.root = e;
  }
  attachClickListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class $o extends ni {
  constructor() {
    super("session-started-overlay"), this.startButton = new Fo(), this.startButton.mount(this.root);
  }
  show(e) {
    this.startButton.attachClickListener(e), this.setVisibility(!0);
  }
  hide() {
    super.setVisibility(!1), this.startButton.removeAllEventListeners();
  }
}
class Fo extends Oe {
  constructor() {
    super();
    const e = document.createElement("button");
    e.classList.add("start-button"), e.textContent = "Press to Start", this.root = e;
  }
  attachClickListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class Vo extends Oe {
  constructor() {
    super(), this.root = document.createElement("div"), this.root.className = "shell-ui", this.progressBar = new Co("cognition"), this.progressBar.mount(this.root), this.statusDot = new Ro(), this.statusDot.mount(this.root), this.sessionConnectingOverlay = new Mo(), this.sessionConnectingOverlay.mount(this.root), this.overlayConsoleMessage = new Bo(), this.overlayConsoleMessage.mount(this.root), this.sessionFinishedOverlay = new zo(), this.sessionFinishedOverlay.mount(this.root), this.sessionStartedOverlay = new $o(), this.sessionStartedOverlay.mount(this.root);
  }
  setProgressBar(e) {
    this.progressBar.setProgress(e);
  }
  setStatusDot(e) {
    this.statusDot.setState(e);
  }
  showSessionConnectingOverlay(e = 500) {
    this.sessionConnectingOverlay.show(e);
  }
  hideSessionConnectingOverlay() {
    this.sessionConnectingOverlay.hide();
  }
  showConsoleMessageOverlay(e, t) {
    this.overlayConsoleMessage.displayMessage(e, t);
  }
  hideConsoleMessageOverlay() {
    this.overlayConsoleMessage.hide();
  }
  async playStartScreen() {
    await new Promise((t, i) => {
      this.sessionStartedOverlay.show(
        () => {
          this.sessionStartedOverlay.hide(), t();
        }
      );
    });
  }
  async playEndScreen(e = "", t = 1e4) {
    let i = new Promise((r, c) => {
      this.sessionFinishedOverlay.show(
        e,
        () => {
          this.sessionFinishedOverlay.hide(), r();
        }
      );
    });
    await i;
    let s = new Promise((r, c) => {
      setTimeout(() => {
        this.sessionFinishedOverlay.hide(), r();
      }, t);
    });
    await Promise.race([i, s]);
  }
}
class jo {
  constructor(e) {
    this.boardViews = /* @__PURE__ */ new Map(), this.activeBoardId = null, this.root = document.createElement("div"), this.root.className = "board-views-ui", this.assetManager = e;
  }
  createBoardView(e, t) {
    if (this.boardViews.has(e))
      return this.getBoardView(e);
    const i = new So(e, t);
    return this.boardViews.set(e, i), this.root.appendChild(i.root), i;
  }
  getBoardView(e) {
    const t = this.boardViews.get(e);
    if (!t)
      throw new Error(`Could not getBoardView for Board ID: ${e}`);
    return t;
  }
  setActiveBoard(e) {
    if (this.activeBoardId) {
      if (this.activeBoardId === e)
        return;
      this.getBoardView(this.activeBoardId).setBoardState(!1, !1);
    }
    this.getBoardView(e).setBoardState(!0, !0), this.activeBoardId = e;
  }
  destroyBoardView(e) {
    const t = this.boardViews.get(e);
    t && (t.reset(), this.root.removeChild(t.root), this.boardViews.delete(e), this.activeBoardId === e && (this.activeBoardId = null));
  }
}
class Go {
  constructor() {
    this.urlLookup = {};
  }
  getKey(e, t) {
    return `${e}|${t}`;
  }
  registerAsset(e) {
    let t = e.identifier.sha256, i = e.identifier.mime_type, s = this.getKey(t, i);
    this.urlLookup[s] = e;
  }
  lookupAssetUrl(e) {
    let t = this.getKey(e.sha256, e.mime_type), i = this.urlLookup[t];
    if (!i)
      throw new Error(`Asset not found: ${e.sha256} (${e.mime_type})`);
    return i;
  }
  async getImage(e) {
    let t = this.lookupAssetUrl(e), i = new Image();
    return i.src = t.url, new Promise(
      (s, r) => {
        i.onload = () => s(i), i.onerror = (c) => r(c);
      }
    );
  }
  async getVideo(e) {
    let t = this.lookupAssetUrl(e), i = document.createElement("video");
    i.controls = !1;
    let s = new Promise((r, c) => {
      i.oncanplaythrough = () => {
        r(i);
      }, i.onerror = (a) => c(a);
    });
    return i.src = t.url, i.load(), s;
  }
}
function Wo() {
  const n = document.createElement("div");
  document.body.appendChild(n);
  const e = document.createElement("div");
  e.classList.add("node-engine-container"), n.appendChild(e);
  const t = document.createElement("div");
  t.classList.add("node-engine-content"), e.appendChild(t);
  const i = new Go(), s = new jo(
    i
  );
  t.appendChild(s.root);
  const r = new Vo();
  return r.mount(t), {
    boardViewsUI: s,
    shellUI: r,
    assetManager: i
  };
}
class qo {
  constructor() {
    this.bufferedNodePlays = /* @__PURE__ */ new Map();
    const { shellUI: e, boardViewsUI: t } = Wo();
    this.shellUI = e, this.boardViewsUI = t;
  }
  async prepare(e) {
    const t = crypto.randomUUID(), i = this.boardViewsUI.createBoardView(t, e.board), s = new Ao(
      e,
      i
    );
    return await s.prepare(this.boardViewsUI.assetManager), this.bufferedNodePlays.set(t, s), t;
  }
  async play(e) {
    const t = this.bufferedNodePlays.get(e);
    if (!t) {
      const s = new Error(`NodePlay ${e} does not exist. `);
      throw this.showErrorMessageOverlay(s), s;
    }
    this.boardViewsUI.setActiveBoard(e);
    const i = await t.run();
    return this.boardViewsUI.destroyBoardView(e), this.bufferedNodePlays.delete(e), i;
  }
  setProgressBar(e) {
    this.shellUI.setProgressBar(e);
  }
  // Overlays:
  showConnectingOverlay(e = 500) {
    this.shellUI.showSessionConnectingOverlay(e);
  }
  hideConnectingOverlay() {
    this.shellUI.hideSessionConnectingOverlay();
  }
  showConsoleMessageOverlay(e, t) {
    this.shellUI.showConsoleMessageOverlay(e, t);
  }
  hideConsoleMessageOverlay() {
    this.shellUI.hideConsoleMessageOverlay();
  }
  async playStartScreen() {
    await this.shellUI.playStartScreen();
  }
  async playEndScreen(e = "", t = 1e4) {
    await this.shellUI.playEndScreen(e, t);
  }
  showErrorMessageOverlay(e) {
    console.error("An error occurred:", e), this.shellUI.showConsoleMessageOverlay(
      "The following error occurred:",
      {
        name: e.name,
        message: e.message,
        stack: e.stack
      }
    );
  }
}
class Xo {
  constructor() {
    this.startTime = null;
  }
  start() {
    this.startTime = performance.now();
  }
  now() {
    return this.convertDomTimestampToClockTime(performance.now());
  }
  /**
   * Convert a DOMHighResTimeStamp from performance.now() to TimeElapsedMsec since the clock was started.
   * @throws Error if the clock has not been started.
   * @param t
   */
  convertDomTimestampToClockTime(e) {
    if (this.startTime === null)
      throw new Error("Clock has not been started. Call start() before calling convertToTimeElapsedMsec().");
    let t = e - this.startTime;
    return t = Math.round(t), t;
  }
}
function Yo() {
  return {
    userAgent: navigator.userAgent,
    viewportWidthPx: window.innerWidth,
    viewportHeightPx: window.innerHeight,
    displayWidthPx: screen.width,
    displayHeightPx: screen.height
  };
}
var Zo = "2.0.4", Bi = 500, vs = "user-agent", Nt = "", _s = "?", Kn = "function", ut = "undefined", Bt = "object", Ui = "string", be = "browser", Ye = "cpu", Fe = "device", De = "engine", Re = "os", Dt = "result", b = "name", f = "type", m = "vendor", x = "version", xe = "architecture", bn = "major", g = "model", gn = "console", D = "mobile", G = "tablet", ie = "smarttv", He = "wearable", $n = "xr", mn = "embedded", ln = "inapp", Ki = "brands", kt = "formFactors", Qi = "fullVersionList", Pt = "platform", Ji = "platformVersion", ii = "bitness", ht = "sec-ch-ua", Ko = ht + "-full-version-list", Qo = ht + "-arch", Jo = ht + "-" + ii, ea = ht + "-form-factors", ta = ht + "-" + D, na = ht + "-" + g, tr = ht + "-" + Pt, ia = tr + "-version", nr = [Ki, Qi, D, g, Pt, Ji, xe, kt, ii], Fn = "Amazon", Lt = "Apple", Ss = "ASUS", Ts = "BlackBerry", yt = "Google", As = "Huawei", yi = "Lenovo", Rs = "Honor", Vn = "LG", ki = "Microsoft", Ei = "Motorola", vi = "Nvidia", Cs = "OnePlus", _i = "OPPO", cn = "Samsung", Os = "Sharp", un = "Sony", Si = "Xiaomi", Ti = "Zebra", Ms = "Chrome", Ls = "Chromium", lt = "Chromecast", qn = "Edge", hn = "Firefox", dn = "Opera", Ai = "Facebook", Is = "Sogou", It = "Mobile ", pn = " Browser", zi = "Windows", sa = typeof window !== ut, ye = sa && window.navigator ? window.navigator : void 0, ct = ye && ye.userAgentData ? ye.userAgentData : void 0, ra = function(n, e) {
  var t = {}, i = e;
  if (!Qn(e)) {
    i = {};
    for (var s in e)
      for (var r in e[s])
        i[r] = e[s][r].concat(i[r] ? i[r] : []);
  }
  for (var c in n)
    t[c] = i[c] && i[c].length % 2 === 0 ? i[c].concat(n[c]) : n[c];
  return t;
}, si = function(n) {
  for (var e = {}, t = 0; t < n.length; t++)
    e[n[t].toUpperCase()] = n[t];
  return e;
}, Hi = function(n, e) {
  if (typeof n === Bt && n.length > 0) {
    for (var t in n)
      if (Qe(e) == Qe(n[t])) return !0;
    return !1;
  }
  return zt(n) ? Qe(e) == Qe(n) : !1;
}, Qn = function(n, e) {
  for (var t in n)
    return /^(browser|cpu|device|engine|os)$/.test(t) || (e ? Qn(n[t]) : !1);
}, zt = function(n) {
  return typeof n === Ui;
}, Ri = function(n) {
  if (n) {
    for (var e = [], t = Ut(/\\?\"/g, n).split(","), i = 0; i < t.length; i++)
      if (t[i].indexOf(";") > -1) {
        var s = Jn(t[i]).split(";v=");
        e[i] = { brand: s[0], version: s[1] };
      } else
        e[i] = Jn(t[i]);
    return e;
  }
}, Qe = function(n) {
  return zt(n) ? n.toLowerCase() : n;
}, Ci = function(n) {
  return zt(n) ? Ut(/[^\d\.]/g, n).split(".")[0] : void 0;
}, Je = function(n) {
  for (var e in n) {
    var t = n[e];
    typeof t == Bt && t.length == 2 ? this[t[0]] = t[1] : this[t] = void 0;
  }
  return this;
}, Ut = function(n, e) {
  return zt(e) ? e.replace(n, Nt) : e;
}, fn = function(n) {
  return Ut(/\\?\"/g, n);
}, Jn = function(n, e) {
  if (zt(n))
    return n = Ut(/^\s\s*/, n), typeof e === ut ? n : n.substring(0, Bi);
}, Oi = function(n, e) {
  if (!(!n || !e))
    for (var t = 0, i, s, r, c, a, h; t < e.length && !a; ) {
      var u = e[t], p = e[t + 1];
      for (i = s = 0; i < u.length && !a && u[i]; )
        if (a = u[i++].exec(n), a)
          for (r = 0; r < p.length; r++)
            h = a[++s], c = p[r], typeof c === Bt && c.length > 0 ? c.length === 2 ? typeof c[1] == Kn ? this[c[0]] = c[1].call(this, h) : this[c[0]] = c[1] : c.length >= 3 && (typeof c[1] === Kn && !(c[1].exec && c[1].test) ? c.length > 3 ? this[c[0]] = h ? c[1].apply(this, c.slice(2)) : void 0 : this[c[0]] = h ? c[1].call(this, h, c[2]) : void 0 : c.length == 3 ? this[c[0]] = h ? h.replace(c[1], c[2]) : void 0 : c.length == 4 ? this[c[0]] = h ? c[3].call(this, h.replace(c[1], c[2])) : void 0 : c.length > 4 && (this[c[0]] = h ? c[3].apply(this, [h.replace(c[1], c[2])].concat(c.slice(4))) : void 0)) : this[c] = h || void 0;
      t += 2;
    }
}, $e = function(n, e) {
  for (var t in e)
    if (typeof e[t] === Bt && e[t].length > 0) {
      for (var i = 0; i < e[t].length; i++)
        if (Hi(e[t][i], n))
          return t === _s ? void 0 : t;
    } else if (Hi(e[t], n))
      return t === _s ? void 0 : t;
  return e.hasOwnProperty("*") ? e["*"] : n;
}, Ds = {
  ME: "4.90",
  "NT 3.51": "3.51",
  "NT 4.0": "4.0",
  2e3: ["5.0", "5.01"],
  XP: ["5.1", "5.2"],
  Vista: "6.0",
  7: "6.1",
  8: "6.2",
  "8.1": "6.3",
  10: ["6.4", "10.0"],
  NT: ""
}, Ps = {
  embedded: "Automotive",
  mobile: "Mobile",
  tablet: ["Tablet", "EInk"],
  smarttv: "TV",
  wearable: "Watch",
  xr: ["VR", "XR"],
  "?": ["Desktop", "Unknown"],
  "*": void 0
}, oa = {
  Chrome: "Google Chrome",
  Edge: "Microsoft Edge",
  "Edge WebView2": "Microsoft Edge WebView2",
  "Chrome WebView": "Android WebView",
  "Chrome Headless": "HeadlessChrome",
  "Huawei Browser": "HuaweiBrowser",
  "MIUI Browser": "Miui Browser",
  "Opera Mobi": "OperaMobile",
  Yandex: "YaBrowser"
}, Ns = {
  browser: [
    [
      // Most common regardless engine
      /\b(?:crmo|crios)\/([\w\.]+)/i
      // Chrome for Android/iOS
    ],
    [x, [b, It + "Chrome"]],
    [
      /webview.+edge\/([\w\.]+)/i
      // Microsoft Edge
    ],
    [x, [b, qn + " WebView"]],
    [
      /edg(?:e|ios|a)?\/([\w\.]+)/i
    ],
    [x, [b, "Edge"]],
    [
      // Presto based
      /(opera mini)\/([-\w\.]+)/i,
      // Opera Mini
      /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
      // Opera Mobi/Tablet
      /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i
      // Opera
    ],
    [b, x],
    [
      /opios[\/ ]+([\w\.]+)/i
      // Opera mini on iphone >= 8.0
    ],
    [x, [b, dn + " Mini"]],
    [
      /\bop(?:rg)?x\/([\w\.]+)/i
      // Opera GX
    ],
    [x, [b, dn + " GX"]],
    [
      /\bopr\/([\w\.]+)/i
      // Opera Webkit
    ],
    [x, [b, dn]],
    [
      // Mixed
      /\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i
      // Baidu
    ],
    [x, [b, "Baidu"]],
    [
      /\b(?:mxbrowser|mxios|myie2)\/?([-\w\.]*)\b/i
      // Maxthon
    ],
    [x, [b, "Maxthon"]],
    [
      /(kindle)\/([\w\.]+)/i,
      // Kindle
      /(lunascape|maxthon|netfront|jasmine|blazer|sleipnir)[\/ ]?([\w\.]*)/i,
      // Lunascape/Maxthon/Netfront/Jasmine/Blazer/Sleipnir
      // Trident based
      /(avant|iemobile|slim(?:browser|boat|jet))[\/ ]?([\d\.]*)/i,
      // Avant/IEMobile/SlimBrowser/SlimBoat/Slimjet
      /(?:ms|\()(ie) ([\w\.]+)/i,
      // Internet Explorer
      // Blink/Webkit/KHTML based                                         // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon/LG Browser/Otter/qutebrowser/Dooble
      /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|duckduckgo|klar|helio|(?=comodo_)?dragon|otter|dooble|(?:lg |qute)browser)\/([-\w\.]+)/i,
      // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ//Vivaldi/DuckDuckGo/Klar/Helio/Dragon
      /(heytap|ovi|115|surf)browser\/([\d\.]+)/i,
      // HeyTap/Ovi/115/Surf
      /(ecosia|weibo)(?:__| \w+@)([\d\.]+)/i
      // Ecosia/Weibo
    ],
    [b, x],
    [
      /quark(?:pc)?\/([-\w\.]+)/i
      // Quark
    ],
    [x, [b, "Quark"]],
    [
      /\bddg\/([\w\.]+)/i
      // DuckDuckGo
    ],
    [x, [b, "DuckDuckGo"]],
    [
      /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i
      // UCBrowser
    ],
    [x, [b, "UCBrowser"]],
    [
      /microm.+\bqbcore\/([\w\.]+)/i,
      // WeChat Desktop for Windows Built-in Browser
      /\bqbcore\/([\w\.]+).+microm/i,
      /micromessenger\/([\w\.]+)/i
      // WeChat
    ],
    [x, [b, "WeChat"]],
    [
      /konqueror\/([\w\.]+)/i
      // Konqueror
    ],
    [x, [b, "Konqueror"]],
    [
      /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i
      // IE11
    ],
    [x, [b, "IE"]],
    [
      /ya(?:search)?browser\/([\w\.]+)/i
      // Yandex
    ],
    [x, [b, "Yandex"]],
    [
      /slbrowser\/([\w\.]+)/i
      // Smart Lenovo Browser
    ],
    [x, [b, "Smart " + yi + pn]],
    [
      /(avast|avg)\/([\w\.]+)/i
      // Avast/AVG Secure Browser
    ],
    [[b, /(.+)/, "$1 Secure" + pn], x],
    [
      /\bfocus\/([\w\.]+)/i
      // Firefox Focus
    ],
    [x, [b, hn + " Focus"]],
    [
      /\bopt\/([\w\.]+)/i
      // Opera Touch
    ],
    [x, [b, dn + " Touch"]],
    [
      /coc_coc\w+\/([\w\.]+)/i
      // Coc Coc Browser
    ],
    [x, [b, "Coc Coc"]],
    [
      /dolfin\/([\w\.]+)/i
      // Dolphin
    ],
    [x, [b, "Dolphin"]],
    [
      /coast\/([\w\.]+)/i
      // Opera Coast
    ],
    [x, [b, dn + " Coast"]],
    [
      /miuibrowser\/([\w\.]+)/i
      // MIUI Browser
    ],
    [x, [b, "MIUI" + pn]],
    [
      /fxios\/([\w\.-]+)/i
      // Firefox for iOS
    ],
    [x, [b, It + hn]],
    [
      /\bqihoobrowser\/?([\w\.]*)/i
      // 360
    ],
    [x, [b, "360"]],
    [
      /\b(qq)\/([\w\.]+)/i
      // QQ
    ],
    [[b, /(.+)/, "$1Browser"], x],
    [
      /(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i
    ],
    [[b, /(.+)/, "$1" + pn], x],
    [
      // Oculus/Sailfish/HuaweiBrowser/VivoBrowser/PicoBrowser
      /samsungbrowser\/([\w\.]+)/i
      // Samsung Internet
    ],
    [x, [b, cn + " Internet"]],
    [
      /metasr[\/ ]?([\d\.]+)/i
      // Sogou Explorer
    ],
    [x, [b, Is + " Explorer"]],
    [
      /(sogou)mo\w+\/([\d\.]+)/i
      // Sogou Mobile
    ],
    [[b, Is + " Mobile"], x],
    [
      /(electron)\/([\w\.]+) safari/i,
      // Electron-based App
      /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
      // Tesla
      /m?(qqbrowser|2345(?=browser|chrome|explorer))\w*[\/ ]?v?([\w\.]+)/i
      // QQ/2345
    ],
    [b, x],
    [
      /(lbbrowser|rekonq)/i
      // LieBao Browser/Rekonq
    ],
    [b],
    [
      /ome\/([\w\.]+) \w* ?(iron) saf/i,
      // Iron
      /ome\/([\w\.]+).+qihu (360)[es]e/i
      // 360
    ],
    [x, b],
    [
      // WebView
      /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i
      // Facebook App for iOS & Android
    ],
    [[b, Ai], x, [f, ln]],
    [
      /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,
      // Kakao App
      /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,
      // Naver InApp
      /(daum)apps[\/ ]([\w\.]+)/i,
      // Daum App
      /safari (line)\/([\w\.]+)/i,
      // Line App for iOS
      /\b(line)\/([\w\.]+)\/iab/i,
      // Line App for Android
      /(alipay)client\/([\w\.]+)/i,
      // Alipay
      /(twitter)(?:and| f.+e\/([\w\.]+))/i,
      // Twitter
      /(instagram|snapchat|klarna)[\/ ]([-\w\.]+)/i
      // Instagram/Snapchat/Klarna
    ],
    [b, x, [f, ln]],
    [
      /\bgsa\/([\w\.]+) .*safari\//i
      // Google Search Appliance on iOS
    ],
    [x, [b, "GSA"], [f, ln]],
    [
      /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i
      // TikTok
    ],
    [x, [b, "TikTok"], [f, ln]],
    [
      /\[(linkedin)app\]/i
      // LinkedIn App for iOS & Android
    ],
    [b, [f, ln]],
    [
      /(chromium)[\/ ]([-\w\.]+)/i
      // Chromium
    ],
    [b, x],
    [
      /headlesschrome(?:\/([\w\.]+)| )/i
      // Chrome Headless
    ],
    [x, [b, Ms + " Headless"]],
    [
      /wv\).+chrome\/([\w\.]+).+edgw\//i
      // Edge WebView2
    ],
    [x, [b, qn + " WebView2"]],
    [
      / wv\).+(chrome)\/([\w\.]+)/i
      // Chrome WebView
    ],
    [[b, Ms + " WebView"], x],
    [
      /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
      // Android Browser
    ],
    [x, [b, "Android" + pn]],
    [
      /chrome\/([\w\.]+) mobile/i
      // Chrome Mobile
    ],
    [x, [b, It + "Chrome"]],
    [
      /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
      // Chrome/OmniWeb/Arora/Tizen/Nokia
    ],
    [b, x],
    [
      /version\/([\w\.\,]+) .*mobile(?:\/\w+ | ?)safari/i
      // Safari Mobile
    ],
    [x, [b, It + "Safari"]],
    [
      /iphone .*mobile(?:\/\w+ | ?)safari/i
    ],
    [[b, It + "Safari"]],
    [
      /version\/([\w\.\,]+) .*(safari)/i
      // Safari
    ],
    [x, b],
    [
      /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i
      // Safari < 3.0
    ],
    [b, [x, "1"]],
    [
      /(webkit|khtml)\/([\w\.]+)/i
    ],
    [b, x],
    [
      // Gecko based
      /(?:mobile|tablet);.*(firefox)\/([\w\.-]+)/i
      // Firefox Mobile
    ],
    [[b, It + hn], x],
    [
      /(navigator|netscape\d?)\/([-\w\.]+)/i
      // Netscape
    ],
    [[b, "Netscape"], x],
    [
      /(wolvic|librewolf)\/([\w\.]+)/i
      // Wolvic/LibreWolf
    ],
    [b, x],
    [
      /mobile vr; rv:([\w\.]+)\).+firefox/i
      // Firefox Reality
    ],
    [x, [b, hn + " Reality"]],
    [
      /ekiohf.+(flow)\/([\w\.]+)/i,
      // Flow
      /(swiftfox)/i,
      // Swiftfox
      /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror)[\/ ]?([\w\.\+]+)/i,
      // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
      /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
      // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
      /(firefox)\/([\w\.]+)/i,
      // Other Firefox-based
      /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,
      // Mozilla
      // Other
      /(amaya|dillo|doris|icab|ladybird|lynx|mosaic|netsurf|obigo|polaris|w3m|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
      // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Obigo/Mosaic/Go/ICE/UP.Browser/Ladybird
      /\b(links) \(([\w\.]+)/i
      // Links
    ],
    [b, [x, /_/g, "."]],
    [
      /(cobalt)\/([\w\.]+)/i
      // Cobalt
    ],
    [b, [x, /[^\d\.]+./, Nt]]
  ],
  cpu: [
    [
      /\b((amd|x|x86[-_]?|wow|win)64)\b/i
      // AMD64 (x64)
    ],
    [[xe, "amd64"]],
    [
      /(ia32(?=;))/i,
      // IA32 (quicktime)
      /\b((i[346]|x)86)(pc)?\b/i
      // IA32 (x86)
    ],
    [[xe, "ia32"]],
    [
      /\b(aarch64|arm(v?[89]e?l?|_?64))\b/i
      // ARM64
    ],
    [[xe, "arm64"]],
    [
      /\b(arm(v[67])?ht?n?[fl]p?)\b/i
      // ARMHF
    ],
    [[xe, "armhf"]],
    [
      // PocketPC mistakenly identified as PowerPC
      /( (ce|mobile); ppc;|\/[\w\.]+arm\b)/i
    ],
    [[xe, "arm"]],
    [
      /((ppc|powerpc)(64)?)( mac|;|\))/i
      // PowerPC
    ],
    [[xe, /ower/, Nt, Qe]],
    [
      / sun4\w[;\)]/i
      // SPARC
    ],
    [[xe, "sparc"]],
    [
      /\b(avr32|ia64(?=;)|68k(?=\))|\barm(?=v([1-7]|[5-7]1)l?|;|eabi)|(irix|mips|sparc)(64)?\b|pa-risc)/i
      // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
    ],
    [[xe, Qe]]
  ],
  device: [
    [
      //////////////////////////
      // MOBILES & TABLETS
      /////////////////////////
      // Samsung
      /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
    ],
    [g, [m, cn], [f, G]],
    [
      /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
      /samsung[- ]((?!sm-[lr]|browser)[-\w]+)/i,
      /sec-(sgh\w+)/i
    ],
    [g, [m, cn], [f, D]],
    [
      // Apple
      /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i
      // iPod/iPhone
    ],
    [g, [m, Lt], [f, D]],
    [
      /\((ipad);[-\w\),; ]+apple/i,
      // iPad
      /applecoremedia\/[\w\.]+ \((ipad)/i,
      /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
    ],
    [g, [m, Lt], [f, G]],
    [
      /(macintosh);/i
    ],
    [g, [m, Lt]],
    [
      // Sharp
      /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
    ],
    [g, [m, Os], [f, D]],
    [
      // Honor
      /\b((?:brt|eln|hey2?|gdi|jdn)-a?[lnw]09|(?:ag[rm]3?|jdn2|kob2)-a?[lw]0[09]hn)(?: bui|\)|;)/i
    ],
    [g, [m, Rs], [f, G]],
    [
      /honor([-\w ]+)[;\)]/i
    ],
    [g, [m, Rs], [f, D]],
    [
      // Huawei
      /\b((?:ag[rs][2356]?k?|bah[234]?|bg[2o]|bt[kv]|cmr|cpn|db[ry]2?|jdn2|got|kob2?k?|mon|pce|scm|sht?|[tw]gr|vrd)-[ad]?[lw][0125][09]b?|605hw|bg2-u03|(?:gem|fdr|m2|ple|t1)-[7a]0[1-4][lu]|t1-a2[13][lw]|mediapad[\w\. ]*(?= bui|\)))\b(?!.+d\/s)/i
    ],
    [g, [m, As], [f, G]],
    [
      /(?:huawei)([-\w ]+)[;\)]/i,
      /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
    ],
    [g, [m, As], [f, D]],
    [
      // Xiaomi
      /oid[^\)]+; (2[\dbc]{4}(182|283|rp\w{2})[cgl]|m2105k81a?c)(?: bui|\))/i,
      /\b((?:red)?mi[-_ ]?pad[\w- ]*)(?: bui|\))/i
      // Mi Pad tablets
    ],
    [[g, /_/g, " "], [m, Si], [f, G]],
    [
      /\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,
      // Xiaomi POCO
      /\b; (\w+) build\/hm\1/i,
      // Xiaomi Hongmi 'numeric' models
      /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,
      // Xiaomi Hongmi
      /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,
      // Xiaomi Redmi
      /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,
      // Xiaomi Redmi 'numeric' models
      /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite|pro)?)(?: bui|\))/i,
      // Xiaomi Mi
      / ([\w ]+) miui\/v?\d/i
    ],
    [[g, /_/g, " "], [m, Si], [f, D]],
    [
      // OnePlus
      /droid.+; (cph2[3-6]\d[13579]|((gm|hd)19|(ac|be|in|kb)20|(d[en]|eb|le|mt)21|ne22)[0-2]\d|p[g-k]\w[1m]10)\b/i,
      /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
    ],
    [g, [m, Cs], [f, D]],
    [
      // OPPO
      /; (\w+) bui.+ oppo/i,
      /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
    ],
    [g, [m, _i], [f, D]],
    [
      /\b(opd2(\d{3}a?))(?: bui|\))/i
    ],
    [g, [m, $e, { OnePlus: ["203", "304", "403", "404", "413", "415"], "*": _i }], [f, G]],
    [
      // BLU
      /(vivo (5r?|6|8l?|go|one|s|x[il]?[2-4]?)[\w\+ ]*)(?: bui|\))/i
      // Vivo series
    ],
    [g, [m, "BLU"], [f, D]],
    [
      // Vivo
      /; vivo (\w+)(?: bui|\))/i,
      /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
    ],
    [g, [m, "Vivo"], [f, D]],
    [
      // Realme
      /\b(rmx[1-3]\d{3})(?: bui|;|\))/i
    ],
    [g, [m, "Realme"], [f, D]],
    [
      // Lenovo
      /(ideatab[-\w ]+|602lv|d-42a|a101lv|a2109a|a3500-hv|s[56]000|pb-6505[my]|tb-?x?\d{3,4}(?:f[cu]|xu|[av])|yt\d?-[jx]?\d+[lfmx])( bui|;|\)|\/)/i,
      /lenovo ?(b[68]0[08]0-?[hf]?|tab(?:[\w- ]+?)|tb[\w-]{6,7})( bui|;|\)|\/)/i
    ],
    [g, [m, yi], [f, G]],
    [
      /lenovo[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i
    ],
    [g, [m, yi], [f, D]],
    [
      // Motorola
      /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
      /\bmot(?:orola)?[- ]([\w\s]+)(\)| bui)/i,
      /((?:moto(?! 360)[-\w\(\) ]+|xt\d{3,4}[cgkosw\+]?[-\d]*|nexus 6)(?= bui|\)))/i
    ],
    [g, [m, Ei], [f, D]],
    [
      /\b(mz60\d|xoom[2 ]{0,2}) build\//i
    ],
    [g, [m, Ei], [f, G]],
    [
      // LG
      /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
    ],
    [g, [m, Vn], [f, G]],
    [
      /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
      /\blg[-e;\/ ]+(?!.*(?:browser|netcast|android tv|watch|webos))(\w+)/i,
      /\blg-?([\d\w]+) bui/i
    ],
    [g, [m, Vn], [f, D]],
    [
      // Nokia
      /(nokia) (t[12][01])/i
    ],
    [m, g, [f, G]],
    [
      /(?:maemo|nokia).*(n900|lumia \d+|rm-\d+)/i,
      /nokia[-_ ]?(([-\w\. ]*))/i
    ],
    [[g, /_/g, " "], [f, D], [m, "Nokia"]],
    [
      // Google
      /(pixel (c|tablet))\b/i
      // Google Pixel C/Tablet
    ],
    [g, [m, yt], [f, G]],
    [
      // Google Pixel
      /droid.+;(?: google)? (g(01[13]a|020[aem]|025[jn]|1b60|1f8f|2ybb|4s1m|576d|5nz6|8hhn|8vou|a02099|c15s|d1yq|e2ae|ec77|gh2x|kv4x|p4bc|pj41|r83y|tt9q|ur25|wvk6)|pixel[\d ]*a?( pro)?( xl)?( fold)?( \(5g\))?)( bui|\))/i
    ],
    [g, [m, yt], [f, D]],
    [
      /(google) (pixelbook( go)?)/i
    ],
    [m, g],
    [
      // Sony
      /droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-\w\w\d\d)(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
    ],
    [g, [m, un], [f, D]],
    [
      /sony tablet [ps]/i,
      /\b(?:sony)?sgp\w+(?: bui|\))/i
    ],
    [[g, "Xperia Tablet"], [m, un], [f, G]],
    [
      // Amazon
      /(alexa)webm/i,
      /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,
      // Kindle Fire without Silk / Echo Show
      /(kf[a-z]+)( bui|\)).+silk\//i
      // Kindle Fire HD
    ],
    [g, [m, Fn], [f, G]],
    [
      /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
      // Fire Phone
    ],
    [[g, /(.+)/g, "Fire Phone $1"], [m, Fn], [f, D]],
    [
      // BlackBerry
      /(playbook);[-\w\),; ]+(rim)/i
      // BlackBerry PlayBook
    ],
    [g, m, [f, G]],
    [
      /\b((?:bb[a-f]|st[hv])100-\d)/i,
      /\(bb10; (\w+)/i
      // BlackBerry 10
    ],
    [g, [m, Ts], [f, D]],
    [
      // Asus
      /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
    ],
    [g, [m, Ss], [f, G]],
    [
      / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
    ],
    [g, [m, Ss], [f, D]],
    [
      // HTC
      /(nexus 9)/i
      // HTC Nexus 9
    ],
    [g, [m, "HTC"], [f, G]],
    [
      /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
      // HTC
      // ZTE
      /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
      /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i
      // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
    ],
    [m, [g, /_/g, " "], [f, D]],
    [
      // TCL
      /tcl (xess p17aa)/i,
      /droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])(_\w(\w|\w\w))?(\)| bui)/i
    ],
    [g, [m, "TCL"], [f, G]],
    [
      /droid [\w\.]+; (418(?:7d|8v)|5087z|5102l|61(?:02[dh]|25[adfh]|27[ai]|56[dh]|59k|65[ah])|a509dl|t(?:43(?:0w|1[adepqu])|50(?:6d|7[adju])|6(?:09dl|10k|12b|71[efho]|76[hjk])|7(?:66[ahju]|67[hw]|7[045][bh]|71[hk]|73o|76[ho]|79w|81[hks]?|82h|90[bhsy]|99b)|810[hs]))(_\w(\w|\w\w))?(\)| bui)/i
    ],
    [g, [m, "TCL"], [f, D]],
    [
      // itel
      /(itel) ((\w+))/i
    ],
    [[m, Qe], g, [f, $e, { tablet: ["p10001l", "w7001"], "*": "mobile" }]],
    [
      // Acer
      /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
    ],
    [g, [m, "Acer"], [f, G]],
    [
      // Meizu
      /droid.+; (m[1-5] note) bui/i,
      /\bmz-([-\w]{2,})/i
    ],
    [g, [m, "Meizu"], [f, D]],
    [
      // Ulefone
      /; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i
    ],
    [g, [m, "Ulefone"], [f, D]],
    [
      // Energizer
      /; (energy ?\w+)(?: bui|\))/i,
      /; energizer ([\w ]+)(?: bui|\))/i
    ],
    [g, [m, "Energizer"], [f, D]],
    [
      // Cat
      /; cat (b35);/i,
      /; (b15q?|s22 flip|s48c|s62 pro)(?: bui|\))/i
    ],
    [g, [m, "Cat"], [f, D]],
    [
      // Smartfren
      /((?:new )?andromax[\w- ]+)(?: bui|\))/i
    ],
    [g, [m, "Smartfren"], [f, D]],
    [
      // Nothing
      /droid.+; (a(in)?(0(15|59|6[35])|142)p?)/i
    ],
    [g, [m, "Nothing"], [f, D]],
    [
      // Archos
      /; (x67 5g|tikeasy \w+|ac[1789]\d\w+)( b|\))/i,
      /archos ?(5|gamepad2?|([\w ]*[t1789]|hello) ?\d+[\w ]*)( b|\))/i
    ],
    [g, [m, "Archos"], [f, G]],
    [
      /archos ([\w ]+)( b|\))/i,
      /; (ac[3-6]\d\w{2,8})( b|\))/i
    ],
    [g, [m, "Archos"], [f, D]],
    [
      // HMD
      /; (n159v)/i
    ],
    [g, [m, "HMD"], [f, D]],
    [
      // MIXED
      /(imo) (tab \w+)/i,
      // IMO
      /(infinix|tecno) (x1101b?|p904|dp(7c|8d|10a)( pro)?|p70[1-3]a?|p904|t1101)/i
      // Infinix XPad / Tecno
    ],
    [m, g, [f, G]],
    [
      /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus(?! zenw)|dell|jolla|meizu|motorola|polytron|tecno|micromax|advan)[-_ ]?([-\w]*)/i,
      // BlackBerry/BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron/Tecno/Micromax/Advan
      /; (blu|hmd|imo|infinix|lava|oneplus|tcl)[_ ]([\w\+ ]+?)(?: bui|\)|; r)/i,
      // BLU/HMD/IMO/Infinix/Lava/OnePlus/TCL
      /(hp) ([\w ]+\w)/i,
      // HP iPAQ
      /(microsoft); (lumia[\w ]+)/i,
      // Microsoft Lumia
      /(oppo) ?([\w ]+) bui/i
      // OPPO
    ],
    [m, g, [f, D]],
    [
      /(kobo)\s(ereader|touch)/i,
      // Kobo
      /(hp).+(touchpad(?!.+tablet)|tablet)/i,
      // HP TouchPad
      /(kindle)\/([\w\.]+)/i
      // Kindle
    ],
    [m, g, [f, G]],
    [
      /(surface duo)/i
      // Surface Duo
    ],
    [g, [m, ki], [f, G]],
    [
      /droid [\d\.]+; (fp\du?)(?: b|\))/i
      // Fairphone
    ],
    [g, [m, "Fairphone"], [f, D]],
    [
      /((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i
      // Nvidia Tablets
    ],
    [g, [m, vi], [f, G]],
    [
      /(sprint) (\w+)/i
      // Sprint Phones
    ],
    [m, g, [f, D]],
    [
      /(kin\.[onetw]{3})/i
      // Microsoft Kin
    ],
    [[g, /\./g, " "], [m, ki], [f, D]],
    [
      /droid.+; ([c6]+|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
      // Zebra
    ],
    [g, [m, Ti], [f, G]],
    [
      /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
    ],
    [g, [m, Ti], [f, D]],
    [
      ///////////////////
      // SMARTTVS
      ///////////////////
      /smart-tv.+(samsung)/i
      // Samsung
    ],
    [m, [f, ie]],
    [
      /hbbtv.+maple;(\d+)/i
    ],
    [[g, /^/, "SmartTV"], [m, cn], [f, ie]],
    [
      /(vizio)(?: |.+model\/)(\w+-\w+)/i,
      // Vizio
      /tcast.+(lg)e?. ([-\w]+)/i
      // LG SmartTV
    ],
    [m, g, [f, ie]],
    [
      /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i
    ],
    [[m, Vn], [f, ie]],
    [
      /(apple) ?tv/i
      // Apple TV
    ],
    [m, [g, Lt + " TV"], [f, ie]],
    [
      /crkey.*devicetype\/chromecast/i
      // Google Chromecast Third Generation
    ],
    [[g, lt + " Third Generation"], [m, yt], [f, ie]],
    [
      /crkey.*devicetype\/([^/]*)/i
      // Google Chromecast with specific device type
    ],
    [[g, /^/, "Chromecast "], [m, yt], [f, ie]],
    [
      /fuchsia.*crkey/i
      // Google Chromecast Nest Hub
    ],
    [[g, lt + " Nest Hub"], [m, yt], [f, ie]],
    [
      /crkey/i
      // Google Chromecast, Linux-based or unknown
    ],
    [[g, lt], [m, yt], [f, ie]],
    [
      /(portaltv)/i
      // Facebook Portal TV
    ],
    [g, [m, Ai], [f, ie]],
    [
      /droid.+aft(\w+)( bui|\))/i
      // Fire TV
    ],
    [g, [m, Fn], [f, ie]],
    [
      /(shield \w+ tv)/i
      // Nvidia Shield TV
    ],
    [g, [m, vi], [f, ie]],
    [
      /\(dtv[\);].+(aquos)/i,
      /(aquos-tv[\w ]+)\)/i
      // Sharp
    ],
    [g, [m, Os], [f, ie]],
    [
      /(bravia[\w ]+)( bui|\))/i
      // Sony
    ],
    [g, [m, un], [f, ie]],
    [
      /(mi(tv|box)-?\w+) bui/i
      // Xiaomi
    ],
    [g, [m, Si], [f, ie]],
    [
      /Hbbtv.*(technisat) (.*);/i
      // TechniSAT
    ],
    [m, g, [f, ie]],
    [
      /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
      // Roku
      /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i
      // HbbTV devices
    ],
    [[m, /.+\/(\w+)/, "$1", $e, { LG: "lge" }], [g, Jn], [f, ie]],
    [
      // SmartTV from Unidentified Vendors
      /droid.+; ([\w- ]+) (?:android tv|smart[- ]?tv)/i
    ],
    [g, [f, ie]],
    [
      /\b(android tv|smart[- ]?tv|opera tv|tv; rv:|large screen[\w ]+safari)\b/i
    ],
    [[f, ie]],
    [
      ///////////////////
      // CONSOLES
      ///////////////////
      /(playstation \w+)/i
      // Playstation
    ],
    [g, [m, un], [f, gn]],
    [
      /\b(xbox(?: one)?(?!; xbox))[\); ]/i
      // Microsoft Xbox
    ],
    [g, [m, ki], [f, gn]],
    [
      /(ouya)/i,
      // Ouya
      /(nintendo) (\w+)/i,
      // Nintendo
      /(retroid) (pocket ([^\)]+))/i
      // Retroid Pocket
    ],
    [m, g, [f, gn]],
    [
      /droid.+; (shield)( bui|\))/i
      // Nvidia Portable
    ],
    [g, [m, vi], [f, gn]],
    [
      ///////////////////
      // WEARABLES
      ///////////////////
      /\b(sm-[lr]\d\d[0156][fnuw]?s?|gear live)\b/i
      // Samsung Galaxy Watch
    ],
    [g, [m, cn], [f, He]],
    [
      /((pebble))app/i,
      // Pebble
      /(asus|google|lg|oppo) ((pixel |zen)?watch[\w ]*)( bui|\))/i
      // Asus ZenWatch / LG Watch / Pixel Watch
    ],
    [m, g, [f, He]],
    [
      /(ow(?:19|20)?we?[1-3]{1,3})/i
      // Oppo Watch
    ],
    [g, [m, _i], [f, He]],
    [
      /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i
      // Apple Watch
    ],
    [g, [m, Lt], [f, He]],
    [
      /(opwwe\d{3})/i
      // OnePlus Watch
    ],
    [g, [m, Cs], [f, He]],
    [
      /(moto 360)/i
      // Motorola 360
    ],
    [g, [m, Ei], [f, He]],
    [
      /(smartwatch 3)/i
      // Sony SmartWatch
    ],
    [g, [m, un], [f, He]],
    [
      /(g watch r)/i
      // LG G Watch R
    ],
    [g, [m, Vn], [f, He]],
    [
      /droid.+; (wt63?0{2,3})\)/i
    ],
    [g, [m, Ti], [f, He]],
    [
      ///////////////////
      // XR
      ///////////////////
      /droid.+; (glass) \d/i
      // Google Glass
    ],
    [g, [m, yt], [f, $n]],
    [
      /(pico) (4|neo3(?: link|pro)?)/i
      // Pico
    ],
    [m, g, [f, $n]],
    [
      /(quest( \d| pro)?s?).+vr/i
      // Meta Quest
    ],
    [g, [m, Ai], [f, $n]],
    [
      /mobile vr; rv.+firefox/i
      // Unidentifiable VR device using Firefox Reality / Wolvic
    ],
    [[f, $n]],
    [
      ///////////////////
      // EMBEDDED
      ///////////////////
      /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i
      // Tesla
    ],
    [m, [f, mn]],
    [
      /(aeobc)\b/i
      // Echo Dot
    ],
    [g, [m, Fn], [f, mn]],
    [
      /(homepod).+mac os/i
      // Apple HomePod
    ],
    [g, [m, Lt], [f, mn]],
    [
      /windows iot/i
      // Unidentifiable embedded device using Windows IoT
    ],
    [[f, mn]],
    [
      ////////////////////
      // MIXED (GENERIC)
      ///////////////////
      /droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+?(mobile|vr|\d) safari/i
    ],
    [g, [f, $e, { mobile: "Mobile", xr: "VR", "*": G }]],
    [
      /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i
      // Unidentifiable Tablet
    ],
    [[f, G]],
    [
      /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i
      // Unidentifiable Mobile
    ],
    [[f, D]],
    [
      /droid .+?; ([\w\. -]+)( bui|\))/i
      // Generic Android Device
    ],
    [g, [m, "Generic"]]
  ],
  engine: [
    [
      /windows.+ edge\/([\w\.]+)/i
      // EdgeHTML
    ],
    [x, [b, qn + "HTML"]],
    [
      /(arkweb)\/([\w\.]+)/i
      // ArkWeb
    ],
    [b, x],
    [
      /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i
      // Blink
    ],
    [x, [b, "Blink"]],
    [
      /(presto)\/([\w\.]+)/i,
      // Presto
      /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna|servo)\/([\w\.]+)/i,
      // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna/Servo
      /ekioh(flow)\/([\w\.]+)/i,
      // Flow
      /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,
      // KHTML/Tasman/Links
      /(icab)[\/ ]([23]\.[\d\.]+)/i,
      // iCab
      /\b(libweb)/i
      // LibWeb
    ],
    [b, x],
    [
      /ladybird\//i
    ],
    [[b, "LibWeb"]],
    [
      /rv\:([\w\.]{1,9})\b.+(gecko)/i
      // Gecko
    ],
    [x, b]
  ],
  os: [
    [
      // Windows
      /(windows nt) (6\.[23]); arm/i
      // Windows RT
    ],
    [[b, /N/, "R"], [x, $e, Ds]],
    [
      /(windows (?:phone|mobile|iot))(?: os)?[\/ ]?([\d\.]*( se)?)/i,
      // Windows IoT/Mobile/Phone
      // Windows NT/3.1/95/98/ME/2000/XP/Vista/7/8/8.1/10/11
      /(windows)[\/ ](1[01]|2000|3\.1|7|8(\.1)?|9[58]|me|server 20\d\d( r2)?|vista|xp)/i
    ],
    [b, x],
    [
      /windows nt ?([\d\.\)]*)(?!.+xbox)/i,
      /\bwin(?=3| ?9|n)(?:nt| 9x )?([\d\.;]*)/i
    ],
    [[x, /(;|\))/g, "", $e, Ds], [b, zi]],
    [
      /(windows ce)\/?([\d\.]*)/i
      // Windows CE
    ],
    [b, x],
    [
      // iOS/macOS
      /[adehimnop]{4,7}\b(?:.*os ([\w]+) like mac|; opera)/i,
      // iOS
      /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
      /cfnetwork\/.+darwin/i
    ],
    [[x, /_/g, "."], [b, "iOS"]],
    [
      /(mac os x) ?([\w\. ]*)/i,
      /(macintosh|mac_powerpc\b)(?!.+(haiku|morphos))/i
      // Mac OS
    ],
    [[b, "macOS"], [x, /_/g, "."]],
    [
      // Google Chromecast
      /android ([\d\.]+).*crkey/i
      // Google Chromecast, Android-based
    ],
    [x, [b, lt + " Android"]],
    [
      /fuchsia.*crkey\/([\d\.]+)/i
      // Google Chromecast, Fuchsia-based
    ],
    [x, [b, lt + " Fuchsia"]],
    [
      /crkey\/([\d\.]+).*devicetype\/smartspeaker/i
      // Google Chromecast, Linux-based Smart Speaker
    ],
    [x, [b, lt + " SmartSpeaker"]],
    [
      /linux.*crkey\/([\d\.]+)/i
      // Google Chromecast, Legacy Linux-based
    ],
    [x, [b, lt + " Linux"]],
    [
      /crkey\/([\d\.]+)/i
      // Google Chromecast, unknown
    ],
    [x, [b, lt]],
    [
      // Mobile OSes
      /droid ([\w\.]+)\b.+(android[- ]x86)/i
      // Android-x86
    ],
    [x, b],
    [
      /(ubuntu) ([\w\.]+) like android/i
      // Ubuntu Touch
    ],
    [[b, /(.+)/, "$1 Touch"], x],
    [
      /(harmonyos)[\/ ]?([\d\.]*)/i,
      // HarmonyOS
      // Android/Blackberry/WebOS/QNX/Bada/RIM/KaiOS/Maemo/MeeGo/S40/Sailfish OS/OpenHarmony/Tizen
      /(android|bada|blackberry|kaios|maemo|meego|openharmony|qnx|rim tablet os|sailfish|series40|symbian|tizen)\w*[-\/\.; ]?([\d\.]*)/i
    ],
    [b, x],
    [
      /\(bb(10);/i
      // BlackBerry 10
    ],
    [x, [b, Ts]],
    [
      /(?:symbian ?os|symbos|s60(?=;)|series ?60)[-\/ ]?([\w\.]*)/i
      // Symbian
    ],
    [x, [b, "Symbian"]],
    [
      /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
      // Firefox OS
    ],
    [x, [b, hn + " OS"]],
    [
      /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i,
      // WebOS
      /webos(?:[ \/]?|\.tv-20(?=2[2-9]))(\d[\d\.]*)/i
    ],
    [x, [b, "webOS"]],
    [
      /web0s;.+?(?:chr[o0]me|safari)\/(\d+)/i
      // https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine
    ],
    [[x, $e, { 25: "120", 24: "108", 23: "94", 22: "87", 6: "79", 5: "68", 4: "53", 3: "38", 2: "538", 1: "537", "*": "TV" }], [b, "webOS"]],
    [
      /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i
      // watchOS
    ],
    [x, [b, "watchOS"]],
    [
      // Google ChromeOS
      /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i
      // Chromium OS
    ],
    [[b, "Chrome OS"], x],
    [
      // Smart TVs
      /panasonic;(viera)/i,
      // Panasonic Viera
      /(netrange)mmh/i,
      // Netrange
      /(nettv)\/(\d+\.[\w\.]+)/i,
      // NetTV
      // Console
      /(nintendo|playstation) (\w+)/i,
      // Nintendo/Playstation
      /(xbox); +xbox ([^\);]+)/i,
      // Microsoft Xbox (360, One, X, S, Series X, Series S)
      /(pico) .+os([\w\.]+)/i,
      // Pico
      // Other
      /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,
      // Joli/Palm
      /linux.+(mint)[\/\(\) ]?([\w\.]*)/i,
      // Mint
      /(mageia|vectorlinux|fuchsia|arcaos|arch(?= ?linux))[;l ]([\d\.]*)/i,
      // Mageia/VectorLinux/Fuchsia/ArcaOS/Arch
      /([kxln]?ubuntu|debian|suse|opensuse|gentoo|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire|knoppix)(?: gnu[\/ ]linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
      // Ubuntu/Debian/SUSE/Gentoo/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus/Raspbian/Plan9/Minix/RISCOS/Contiki/Deepin/Manjaro/elementary/Sabayon/Linspire/Knoppix
      /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,
      // Solaris
      /\b(aix)[; ]([1-9\.]{0,4})/i,
      // AIX
      /(hurd|linux|morphos)(?: (?:arm|x86|ppc)\w*| ?)([\w\.]*)/i,
      // Hurd/Linux/MorphOS
      /(gnu) ?([\w\.]*)/i,
      // GNU
      /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,
      // FreeBSD/NetBSD/OpenBSD/PC-BSD/GhostBSD/DragonFly
      /(haiku) ?(r\d)?/i
      // Haiku
    ],
    [b, x],
    [
      /(sunos) ?([\d\.]*)/i
      // Solaris
    ],
    [[b, "Solaris"], x],
    [
      /\b(beos|os\/2|amigaos|openvms|hp-ux|serenityos)/i,
      // BeOS/OS2/AmigaOS/OpenVMS/HP-UX/SerenityOS
      /(unix) ?([\w\.]*)/i
      // UNIX
    ],
    [b, x]
  ]
}, jn = (function() {
  var n = { init: {}, isIgnore: {}, isIgnoreRgx: {}, toString: {} };
  return Je.call(n.init, [
    [be, [b, x, bn, f]],
    [Ye, [xe]],
    [Fe, [f, g, m]],
    [De, [b, x]],
    [Re, [b, x]]
  ]), Je.call(n.isIgnore, [
    [be, [x, bn]],
    [De, [x]],
    [Re, [x]]
  ]), Je.call(n.isIgnoreRgx, [
    [be, / ?browser$/i],
    [Re, / ?os$/i]
  ]), Je.call(n.toString, [
    [be, [b, x]],
    [Ye, [xe]],
    [Fe, [m, g]],
    [De, [b, x]],
    [Re, [b, x]]
  ]), n;
})(), aa = function(n, e) {
  var t = jn.init[e], i = jn.isIgnore[e] || 0, s = jn.isIgnoreRgx[e] || 0, r = jn.toString[e] || 0;
  function c() {
    Je.call(this, t);
  }
  return c.prototype.getItem = function() {
    return n;
  }, c.prototype.withClientHints = function() {
    return ct ? ct.getHighEntropyValues(nr).then(function(a) {
      return n.setCH(new ir(a, !1)).parseCH().get();
    }) : n.parseCH().get();
  }, c.prototype.withFeatureCheck = function() {
    return n.detectFeature().get();
  }, e != Dt && (c.prototype.is = function(a) {
    var h = !1;
    for (var u in this)
      if (this.hasOwnProperty(u) && !Hi(i, u) && Qe(s ? Ut(s, this[u]) : this[u]) == Qe(s ? Ut(s, a) : a)) {
        if (h = !0, a != ut) break;
      } else if (a == ut && h) {
        h = !h;
        break;
      }
    return h;
  }, c.prototype.toString = function() {
    var a = Nt;
    for (var h in r)
      typeof this[r[h]] !== ut && (a += (a ? " " : Nt) + this[r[h]]);
    return a || ut;
  }), ct || (c.prototype.then = function(a) {
    var h = this, u = function() {
      for (var O in h)
        h.hasOwnProperty(O) && (this[O] = h[O]);
    };
    u.prototype = {
      is: c.prototype.is,
      toString: c.prototype.toString
    };
    var p = new u();
    return a(p), p;
  }), new c();
};
function ir(n, e) {
  if (n = n || {}, Je.call(this, nr), e)
    Je.call(this, [
      [Ki, Ri(n[ht])],
      [Qi, Ri(n[Ko])],
      [D, /\?1/.test(n[ta])],
      [g, fn(n[na])],
      [Pt, fn(n[tr])],
      [Ji, fn(n[ia])],
      [xe, fn(n[Qo])],
      [kt, Ri(n[ea])],
      [ii, fn(n[Jo])]
    ]);
  else
    for (var t in n)
      this.hasOwnProperty(t) && typeof n[t] !== ut && (this[t] = n[t]);
}
function Bs(n, e, t, i) {
  return this.get = function(s) {
    return s ? this.data.hasOwnProperty(s) ? this.data[s] : void 0 : this.data;
  }, this.set = function(s, r) {
    return this.data[s] = r, this;
  }, this.setCH = function(s) {
    return this.uaCH = s, this;
  }, this.detectFeature = function() {
    if (ye && ye.userAgent == this.ua)
      switch (this.itemType) {
        case be:
          ye.brave && typeof ye.brave.isBrave == Kn && this.set(b, "Brave");
          break;
        case Fe:
          !this.get(f) && ct && ct[D] && this.set(f, D), this.get(g) == "Macintosh" && ye && typeof ye.standalone !== ut && ye.maxTouchPoints && ye.maxTouchPoints > 2 && this.set(g, "iPad").set(f, G);
          break;
        case Re:
          !this.get(b) && ct && ct[Pt] && this.set(b, ct[Pt]);
          break;
        case Dt:
          var s = this.data, r = function(c) {
            return s[c].getItem().detectFeature().get();
          };
          this.set(be, r(be)).set(Ye, r(Ye)).set(Fe, r(Fe)).set(De, r(De)).set(Re, r(Re));
      }
    return this;
  }, this.parseUA = function() {
    return this.itemType != Dt && Oi.call(this.data, this.ua, this.rgxMap), this.itemType == be && this.set(bn, Ci(this.get(x))), this;
  }, this.parseCH = function() {
    var s = this.uaCH, r = this.rgxMap;
    switch (this.itemType) {
      case be:
      case De:
        var c = s[Qi] || s[Ki], a;
        if (c)
          for (var h in c) {
            var u = c[h].brand || c[h], p = c[h].version;
            this.itemType == be && !/not.a.brand/i.test(u) && (!a || /Chrom/.test(a) && u != Ls || a == qn && /WebView2/.test(u)) && (u = $e(u, oa), a = this.get(b), a && !/Chrom/.test(a) && /Chrom/.test(u) || this.set(b, u).set(x, p).set(bn, Ci(p)), a = u), this.itemType == De && u == Ls && this.set(x, p);
          }
        break;
      case Ye:
        var O = s[xe];
        O && (O && s[ii] == "64" && (O += "64"), Oi.call(this.data, O + ";", r));
        break;
      case Fe:
        if (s[D] && this.set(f, D), s[g] && (this.set(g, s[g]), !this.get(f) || !this.get(m))) {
          var E = {};
          Oi.call(E, "droid 9; " + s[g] + ")", r), !this.get(f) && E.type && this.set(f, E.type), !this.get(m) && E.vendor && this.set(m, E.vendor);
        }
        if (s[kt]) {
          var H;
          if (typeof s[kt] != "string")
            for (var P = 0; !H && P < s[kt].length; )
              H = $e(s[kt][P++], Ps);
          else
            H = $e(s[kt], Ps);
          this.set(f, H);
        }
        break;
      case Re:
        var M = s[Pt];
        if (M) {
          var Te = s[Ji];
          M == zi && (Te = parseInt(Ci(Te), 10) >= 13 ? "11" : "10"), this.set(b, M).set(x, Te);
        }
        this.get(b) == zi && s[g] == "Xbox" && this.set(b, "Xbox").set(x, void 0);
        break;
      case Dt:
        var ke = this.data, se = function(me) {
          return ke[me].getItem().setCH(s).parseCH().get();
        };
        this.set(be, se(be)).set(Ye, se(Ye)).set(Fe, se(Fe)).set(De, se(De)).set(Re, se(Re));
    }
    return this;
  }, Je.call(this, [
    ["itemType", n],
    ["ua", e],
    ["uaCH", i],
    ["rgxMap", t],
    ["data", aa(this, n)]
  ]), this;
}
function et(n, e, t) {
  if (typeof n === Bt ? (Qn(n, !0) ? (typeof e === Bt && (t = e), e = n) : (t = n, e = void 0), n = void 0) : typeof n === Ui && !Qn(e, !0) && (t = e, e = void 0), t && typeof t.append === Kn) {
    var i = {};
    t.forEach(function(h, u) {
      i[u] = h;
    }), t = i;
  }
  if (!(this instanceof et))
    return new et(n, e, t).getResult();
  var s = typeof n === Ui ? n : (
    // Passed user-agent string
    t && t[vs] ? t[vs] : (
      // User-Agent from passed headers
      ye && ye.userAgent ? ye.userAgent : (
        // navigator.userAgent
        Nt
      )
    )
  ), r = new ir(t, !0), c = e ? ra(Ns, e) : Ns, a = function(h) {
    return h == Dt ? function() {
      return new Bs(h, s, c, r).set("ua", s).set(be, this.getBrowser()).set(Ye, this.getCPU()).set(Fe, this.getDevice()).set(De, this.getEngine()).set(Re, this.getOS()).get();
    } : function() {
      return new Bs(h, s, c[h], r).parseUA().get();
    };
  };
  return Je.call(this, [
    ["getBrowser", a(be)],
    ["getCPU", a(Ye)],
    ["getDevice", a(Fe)],
    ["getEngine", a(De)],
    ["getOS", a(Re)],
    ["getResult", a(Dt)],
    ["getUA", function() {
      return s;
    }],
    ["setUA", function(h) {
      return zt(h) && (s = h.length > Bi ? Jn(h, Bi) : h), this;
    }]
  ]).setUA(s), this;
}
et.VERSION = Zo;
et.BROWSER = si([b, x, bn, f]);
et.CPU = si([xe]);
et.DEVICE = si([g, m, f, gn, D, ie, G, He, mn]);
et.ENGINE = et.OS = si([b, x]);
class la {
  static isValidDevice() {
    return !new et().getDevice().type;
  }
}
async function ua(n, e, t = null, i = []) {
  t || (t = (M) => {
  });
  let s = i;
  const r = n.nodekit_version;
  let c = new qo();
  if (!la.isValidDevice()) {
    const M = new Error("Unsupported device. Please use a desktop browser.");
    throw c.showErrorMessageOverlay(M), M;
  }
  c.showConnectingOverlay();
  for (const M of e)
    c.boardViewsUI.assetManager.registerAsset(M);
  c.hideConnectingOverlay();
  const a = new Xo();
  await c.playStartScreen(), a.start();
  const h = {
    event_type: "StartEvent",
    t: 0
  };
  s.push(h), t(h);
  function u() {
    if (document.visibilityState === "hidden") {
      const M = {
        event_type: "LeaveEvent",
        t: a.now()
      };
      s.push(M), t(M);
    } else if (document.visibilityState === "visible") {
      const M = {
        event_type: "ReturnEvent",
        t: a.now()
      };
      s.push(M), t(M);
    }
  }
  document.addEventListener("visibilitychange", u);
  const p = Yo(), O = {
    event_type: "BrowserContextEvent",
    t: a.now(),
    user_agent: p.userAgent,
    viewport_width_px: p.viewportWidthPx,
    viewport_height_px: p.viewportHeightPx,
    display_width_px: p.displayWidthPx,
    display_height_px: p.displayHeightPx
  };
  s.push(O), t(O);
  const E = n.nodes;
  for (let M = 0; M < E.length; M++) {
    const Te = E[M], ke = await c.prepare(Te);
    let se = await c.play(ke);
    const me = {
      event_type: "NodeStartEvent",
      t: a.convertDomTimestampToClockTime(se.domTimestampStart),
      node_index: M
    };
    s.push(me), t(me);
    const J = {
      event_type: "ActionEvent",
      t: a.convertDomTimestampToClockTime(se.domTimestampAction),
      node_index: M,
      sensor_index: se.sensorIndex,
      action: se.action
    };
    s.push(J), t(J);
    const we = {
      event_type: "NodeEndEvent",
      t: a.convertDomTimestampToClockTime(se.domTimestampEnd),
      node_index: M
    };
    s.push(we), t(we), c.setProgressBar((M + 1) / E.length * 100);
  }
  await c.playEndScreen();
  const H = {
    event_type: "EndEvent",
    t: a.now()
  };
  s.push(H), t(H), document.removeEventListener("visibilitychange", u);
  const P = {
    nodekit_version: r,
    events: s
  };
  return c.showConsoleMessageOverlay(
    "Trace",
    P
  ), P;
}
export {
  ua as play
};
