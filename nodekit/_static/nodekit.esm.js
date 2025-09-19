var fr = Object.defineProperty;
var gr = (n, e, t) => e in n ? fr(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var X = (n, e, t) => gr(n, typeof e != "symbol" ? e + "" : e, t);
class Re {
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
      i instanceof Re ? e.push(i) : Array.isArray(i) && i.every((s) => s instanceof Re) && e.push(...i);
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
class mr extends Re {
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
class wr extends Re {
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
class ii extends Re {
  constructor(e) {
    super(), this.root = document.createElement("div"), this.root.classList.add("overlay"), this.root.id = e;
  }
  setVisibility(e) {
    e ? this.root.classList.add("overlay--visible-state") : this.root.classList.remove("overlay--visible-state");
  }
}
class br extends Re {
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
class yr extends ii {
  constructor() {
    super("session-connecting-overlay"), this.displayTimeout = null;
    const e = document.createElement("div");
    e.classList.add("connecting-message-box"), this.root.appendChild(e), this.spinner = new br(), this.spinner.mount(e);
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
function _r(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var bi, ls;
function xr() {
  if (ls) return bi;
  ls = 1;
  function n(o) {
    return o instanceof Map ? o.clear = o.delete = o.set = function() {
      throw new Error("map is read-only");
    } : o instanceof Set && (o.add = o.clear = o.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(o), Object.getOwnPropertyNames(o).forEach((d) => {
      const x = o[d], I = typeof x;
      (I === "object" || I === "function") && !Object.isFrozen(x) && n(x);
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
    const x = /* @__PURE__ */ Object.create(null);
    for (const I in o)
      x[I] = o[I];
    return d.forEach(function(I) {
      for (const Q in I)
        x[Q] = I[Q];
    }), /** @type {T} */
    x;
  }
  const s = "</span>", r = (o) => !!o.scope, l = (o, { prefix: d }) => {
    if (o.startsWith("language:"))
      return o.replace("language:", "language-");
    if (o.includes(".")) {
      const x = o.split(".");
      return [
        `${d}${x.shift()}`,
        ...x.map((I, Q) => `${I}${"_".repeat(Q + 1)}`)
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
    constructor(d, x) {
      this.buffer = "", this.classPrefix = x.classPrefix, d.walk(this);
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
      const x = l(
        d.scope,
        { prefix: this.classPrefix }
      );
      this.span(x);
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
      const x = h({ scope: d });
      this.add(x), this.stack.push(x);
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
    static _walk(d, x) {
      return typeof x == "string" ? d.addText(x) : x.children && (d.openNode(x), x.children.forEach((I) => this._walk(d, I)), d.closeNode(x)), d;
    }
    /**
     * @param {Node} node
     */
    static _collapse(d) {
      typeof d != "string" && d.children && (d.children.every((x) => typeof x == "string") ? d.children = [d.children.join("")] : d.children.forEach((x) => {
        u._collapse(x);
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
    __addSublanguage(d, x) {
      const I = d.root;
      x && (I.scope = `language:${x}`), this.add(I);
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
  function v(o) {
    return M("(?=", o, ")");
  }
  function $(o) {
    return M("(?:", o, ")*");
  }
  function N(o) {
    return M("(?:", o, ")?");
  }
  function M(...o) {
    return o.map((x) => O(x)).join("");
  }
  function _e(o) {
    const d = o[o.length - 1];
    return typeof d == "object" && d.constructor === Object ? (o.splice(o.length - 1, 1), d) : {};
  }
  function xe(...o) {
    return "(" + (_e(o).capture ? "" : "?:") + o.map((I) => O(I)).join("|") + ")";
  }
  function le(o) {
    return new RegExp(o.toString() + "|").exec("").length - 1;
  }
  function me(o, d) {
    const x = o && o.exec(d);
    return x && x.index === 0;
  }
  const te = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function Oe(o, { joinWith: d }) {
    let x = 0;
    return o.map((I) => {
      x += 1;
      const Q = x;
      let K = O(I), T = "";
      for (; K.length > 0; ) {
        const S = te.exec(K);
        if (!S) {
          T += K;
          break;
        }
        T += K.substring(0, S.index), K = K.substring(S.index + S[0].length), S[0][0] === "\\" && S[1] ? T += "\\" + String(Number(S[1]) + Q) : (T += S[0], S[0] === "(" && x++);
      }
      return T;
    }).map((I) => `(${I})`).join(d);
  }
  const Ve = /\b\B/, Ne = "[a-zA-Z]\\w*", Vt = "[a-zA-Z_]\\w*", kn = "\\b\\d+(\\.\\d+)?", En = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", ae = "\\b(0b[01]+)", jt = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", Gt = (o = {}) => {
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
      "on:begin": (x, I) => {
        x.index !== 0 && I.ignoreMatch();
      }
    }, o);
  }, je = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, ci = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [je]
  }, ui = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [je]
  }, hi = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, dt = function(o, d, x = {}) {
    const I = i(
      {
        scope: "comment",
        begin: o,
        end: d,
        contains: []
      },
      x
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
    const Q = xe(
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
  }, di = dt("//", "$"), Sn = dt("/\\*", "\\*/"), ne = dt("#", "$"), Tn = {
    scope: "number",
    begin: kn,
    relevance: 0
  }, se = {
    scope: "number",
    begin: En,
    relevance: 0
  }, An = {
    scope: "number",
    begin: ae,
    relevance: 0
  }, J = {
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
    begin: Ne,
    relevance: 0
  }, Wt = {
    scope: "title",
    begin: Vt,
    relevance: 0
  }, Rn = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + Vt,
    relevance: 0
  };
  var ft = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: ci,
    BACKSLASH_ESCAPE: je,
    BINARY_NUMBER_MODE: An,
    BINARY_NUMBER_RE: ae,
    COMMENT: dt,
    C_BLOCK_COMMENT_MODE: Sn,
    C_LINE_COMMENT_MODE: di,
    C_NUMBER_MODE: se,
    C_NUMBER_RE: En,
    END_SAME_AS_BEGIN: function(o) {
      return Object.assign(
        o,
        {
          /** @type {ModeCallback} */
          "on:begin": (d, x) => {
            x.data._beginMatch = d[1];
          },
          /** @type {ModeCallback} */
          "on:end": (d, x) => {
            x.data._beginMatch !== d[1] && x.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: ne,
    IDENT_RE: Ne,
    MATCH_NOTHING_RE: Ve,
    METHOD_GUARD: Rn,
    NUMBER_MODE: Tn,
    NUMBER_RE: kn,
    PHRASAL_WORDS_MODE: hi,
    QUOTE_STRING_MODE: ui,
    REGEXP_MODE: J,
    RE_STARTERS_RE: jt,
    SHEBANG: Gt,
    TITLE_MODE: pt,
    UNDERSCORE_IDENT_RE: Vt,
    UNDERSCORE_TITLE_MODE: Wt
  });
  function On(o, d) {
    o.input[o.index - 1] === "." && d.ignoreMatch();
  }
  function tt(o, d) {
    o.className !== void 0 && (o.scope = o.className, delete o.className);
  }
  function Tt(o, d) {
    d && o.beginKeywords && (o.begin = "\\b(" + o.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", o.__beforeBegin = On, o.keywords = o.keywords || o.beginKeywords, delete o.beginKeywords, o.relevance === void 0 && (o.relevance = 0));
  }
  function Ge(o, d) {
    Array.isArray(o.illegal) && (o.illegal = xe(...o.illegal));
  }
  function qt(o, d) {
    if (o.match) {
      if (o.begin || o.end) throw new Error("begin & end are not supported with match");
      o.begin = o.match, delete o.match;
    }
  }
  function Xt(o, d) {
    o.relevance === void 0 && (o.relevance = 1);
  }
  const nt = (o, d) => {
    if (!o.beforeMatch) return;
    if (o.starts) throw new Error("beforeMatch cannot be used with starts");
    const x = Object.assign({}, o);
    Object.keys(o).forEach((I) => {
      delete o[I];
    }), o.keywords = x.keywords, o.begin = M(x.beforeMatch, v(x.begin)), o.starts = {
      relevance: 0,
      contains: [
        Object.assign(x, { endsParent: !0 })
      ]
    }, o.relevance = 0, delete x.beforeMatch;
  }, At = [
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
  ], Rt = "keyword";
  function Yt(o, d, x = Rt) {
    const I = /* @__PURE__ */ Object.create(null);
    return typeof o == "string" ? Q(x, o.split(" ")) : Array.isArray(o) ? Q(x, o) : Object.keys(o).forEach(function(K) {
      Object.assign(
        I,
        Yt(o[K], d, K)
      );
    }), I;
    function Q(K, T) {
      d && (T = T.map((S) => S.toLowerCase())), T.forEach(function(S) {
        const L = S.split("|");
        I[L[0]] = [K, Mn(L[0], L[1])];
      });
    }
  }
  function Mn(o, d) {
    return d ? Number(d) : pi(o) ? 0 : 1;
  }
  function pi(o) {
    return At.includes(o.toLowerCase());
  }
  const Ct = {}, ve = (o) => {
    console.error(o);
  }, We = (o, ...d) => {
    console.log(`WARN: ${o}`, ...d);
  }, ke = (o, d) => {
    Ct[`${o}/${d}`] || (console.log(`Deprecated as of ${o}. ${d}`), Ct[`${o}/${d}`] = !0);
  }, gt = new Error();
  function Zt(o, d, { key: x }) {
    let I = 0;
    const Q = o[x], K = {}, T = {};
    for (let S = 1; S <= d.length; S++)
      T[S + I] = Q[S], K[S + I] = !0, I += le(d[S - 1]);
    o[x] = T, o[x]._emit = K, o[x]._multi = !0;
  }
  function Ln(o) {
    if (Array.isArray(o.begin)) {
      if (o.skip || o.excludeBegin || o.returnBegin)
        throw ve("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), gt;
      if (typeof o.beginScope != "object" || o.beginScope === null)
        throw ve("beginScope must be object"), gt;
      Zt(o, o.begin, { key: "beginScope" }), o.begin = Oe(o.begin, { joinWith: "" });
    }
  }
  function Kt(o) {
    if (Array.isArray(o.end)) {
      if (o.skip || o.excludeEnd || o.returnEnd)
        throw ve("skip, excludeEnd, returnEnd not compatible with endScope: {}"), gt;
      if (typeof o.endScope != "object" || o.endScope === null)
        throw ve("endScope must be object"), gt;
      Zt(o, o.end, { key: "endScope" }), o.end = Oe(o.end, { joinWith: "" });
    }
  }
  function In(o) {
    o.scope && typeof o.scope == "object" && o.scope !== null && (o.beginScope = o.scope, delete o.scope);
  }
  function Ot(o) {
    In(o), typeof o.beginScope == "string" && (o.beginScope = { _wrap: o.beginScope }), typeof o.endScope == "string" && (o.endScope = { _wrap: o.endScope }), Ln(o), Kt(o);
  }
  function Mt(o) {
    function d(T, S) {
      return new RegExp(
        O(T),
        "m" + (o.case_insensitive ? "i" : "") + (o.unicodeRegex ? "u" : "") + (S ? "g" : "")
      );
    }
    class x {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(S, L) {
        L.position = this.position++, this.matchIndexes[this.matchAt] = L, this.regexes.push([L, S]), this.matchAt += le(S) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const S = this.regexes.map((L) => L[1]);
        this.matcherRe = d(Oe(S, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(S) {
        this.matcherRe.lastIndex = this.lastIndex;
        const L = this.matcherRe.exec(S);
        if (!L)
          return null;
        const F = L.findIndex((ot, Lt) => Lt > 0 && ot !== void 0), W = this.matchIndexes[F];
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
        const L = new x();
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
        qt,
        Ot,
        nt
      ].forEach((W) => W(T, S)), o.compilerExtensions.forEach((W) => W(T, S)), T.__beforeBegin = null, [
        Tt,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        Ge,
        // default to 1 relevance if not specified
        Xt
      ].forEach((W) => W(T, S)), T.isCompiled = !0;
      let F = null;
      return typeof T.keywords == "object" && T.keywords.$pattern && (T.keywords = Object.assign({}, T.keywords), F = T.keywords.$pattern, delete T.keywords.$pattern), F = F || /\w+/, T.keywords && (T.keywords = Yt(T.keywords, o.case_insensitive)), L.keywordPatternRe = d(F, !0), S && (T.begin || (T.begin = /\B|\b/), L.beginRe = d(L.begin), !T.end && !T.endsWithParent && (T.end = /\B|\b/), T.end && (L.endRe = d(L.end)), L.terminatorEnd = O(L.end) || "", T.endsWithParent && S.terminatorEnd && (L.terminatorEnd += (T.end ? "|" : "") + S.terminatorEnd)), T.illegal && (L.illegalRe = d(
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
  function Te(o) {
    return o ? o.endsWithParent || Te(o.starts) : !1;
  }
  function it(o) {
    return o.variants && !o.cachedVariants && (o.cachedVariants = o.variants.map(function(d) {
      return i(o, { variants: null }, d);
    })), o.cachedVariants ? o.cachedVariants : Te(o) ? i(o, { starts: o.starts ? i(o.starts) : null }) : Object.isFrozen(o) ? i(o) : o;
  }
  var Qt = "11.11.1";
  class Jt extends Error {
    constructor(d, x) {
      super(d), this.name = "HTMLInjectionError", this.html = x;
    }
  }
  const en = t, mt = i, wt = Symbol("nomatch"), fi = 7, st = function(o) {
    const d = /* @__PURE__ */ Object.create(null), x = /* @__PURE__ */ Object.create(null), I = [];
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
        const Y = E(U[1]);
        return Y || (We(K.replace("{}", U[1])), We("Falling back to no-highlight mode for this block.", w)), Y ? U[1] : "no-highlight";
      }
      return R.split(/\s+/).find((Y) => L(Y) || E(Y));
    }
    function W(w, R, U) {
      let Y = "", oe = "";
      typeof R == "object" ? (Y = w, U = R.ignoreIllegals, oe = R.language) : (ke("10.7.0", "highlight(lang, code, ...args) has been deprecated."), ke("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), oe = w, Y = R), U === void 0 && (U = !0);
      const Le = {
        code: Y,
        language: oe
      };
      Pe("before:highlight", Le);
      const at = Le.result ? Le.result : ot(Le.language, Le.code, U);
      return at.code = Le.code, Pe("after:highlight", at), at;
    }
    function ot(w, R, U, Y) {
      const oe = /* @__PURE__ */ Object.create(null);
      function Le(k, C) {
        return k.keywords[C];
      }
      function at() {
        if (!P.keywords) {
          ce.addText(Z);
          return;
        }
        let k = 0;
        P.keywordPatternRe.lastIndex = 0;
        let C = P.keywordPatternRe.exec(Z), B = "";
        for (; C; ) {
          B += Z.substring(k, C.index);
          const V = Ue.case_insensitive ? C[0].toLowerCase() : C[0], he = Le(P, V);
          if (he) {
            const [qe, dr] = he;
            if (ce.addText(B), B = "", oe[V] = (oe[V] || 0) + 1, oe[V] <= fi && ($n += dr), qe.startsWith("_"))
              B += C[0];
            else {
              const pr = Ue.classNameAliases[qe] || qe;
              Be(C[0], pr);
            }
          } else
            B += C[0];
          k = P.keywordPatternRe.lastIndex, C = P.keywordPatternRe.exec(Z);
        }
        B += Z.substring(k), ce.addText(B);
      }
      function Un() {
        if (Z === "") return;
        let k = null;
        if (typeof P.subLanguage == "string") {
          if (!d[P.subLanguage]) {
            ce.addText(Z);
            return;
          }
          k = ot(P.subLanguage, Z, !0, as[P.subLanguage]), as[P.subLanguage] = /** @type {CompiledMode} */
          k._top;
        } else
          k = bt(Z, P.subLanguage.length ? P.subLanguage : null);
        P.relevance > 0 && ($n += k.relevance), ce.__addSublanguage(k._emitter, k.language);
      }
      function Se() {
        P.subLanguage != null ? Un() : at(), Z = "";
      }
      function Be(k, C) {
        k !== "" && (ce.startScope(C), ce.addText(k), ce.endScope());
      }
      function is(k, C) {
        let B = 1;
        const V = C.length - 1;
        for (; B <= V; ) {
          if (!k._emit[B]) {
            B++;
            continue;
          }
          const he = Ue.classNameAliases[k[B]] || k[B], qe = C[B];
          he ? Be(qe, he) : (Z = qe, at(), Z = ""), B++;
        }
      }
      function ss(k, C) {
        return k.scope && typeof k.scope == "string" && ce.openNode(Ue.classNameAliases[k.scope] || k.scope), k.beginScope && (k.beginScope._wrap ? (Be(Z, Ue.classNameAliases[k.beginScope._wrap] || k.beginScope._wrap), Z = "") : k.beginScope._multi && (is(k.beginScope, C), Z = "")), P = Object.create(k, { parent: { value: P } }), P;
      }
      function rs(k, C, B) {
        let V = me(k.endRe, B);
        if (V) {
          if (k["on:end"]) {
            const he = new e(k);
            k["on:end"](C, he), he.isMatchIgnored && (V = !1);
          }
          if (V) {
            for (; k.endsParent && k.parent; )
              k = k.parent;
            return k;
          }
        }
        if (k.endsWithParent)
          return rs(k.parent, C, B);
      }
      function ar(k) {
        return P.matcher.regexIndex === 0 ? (Z += k[0], 1) : (wi = !0, 0);
      }
      function lr(k) {
        const C = k[0], B = k.rule, V = new e(B), he = [B.__beforeBegin, B["on:begin"]];
        for (const qe of he)
          if (qe && (qe(k, V), V.isMatchIgnored))
            return ar(C);
        return B.skip ? Z += C : (B.excludeBegin && (Z += C), Se(), !B.returnBegin && !B.excludeBegin && (Z = C)), ss(B, k), B.returnBegin ? 0 : C.length;
      }
      function cr(k) {
        const C = k[0], B = R.substring(k.index), V = rs(P, k, B);
        if (!V)
          return wt;
        const he = P;
        P.endScope && P.endScope._wrap ? (Se(), Be(C, P.endScope._wrap)) : P.endScope && P.endScope._multi ? (Se(), is(P.endScope, k)) : he.skip ? Z += C : (he.returnEnd || he.excludeEnd || (Z += C), Se(), he.excludeEnd && (Z = C));
        do
          P.scope && ce.closeNode(), !P.skip && !P.subLanguage && ($n += P.relevance), P = P.parent;
        while (P !== V.parent);
        return V.starts && ss(V.starts, k), he.returnEnd ? 0 : C.length;
      }
      function ur() {
        const k = [];
        for (let C = P; C !== Ue; C = C.parent)
          C.scope && k.unshift(C.scope);
        k.forEach((C) => ce.openNode(C));
      }
      let zn = {};
      function os(k, C) {
        const B = C && C[0];
        if (Z += k, B == null)
          return Se(), 0;
        if (zn.type === "begin" && C.type === "end" && zn.index === C.index && B === "") {
          if (Z += R.slice(C.index, C.index + 1), !Q) {
            const V = new Error(`0 width match regex (${w})`);
            throw V.languageName = w, V.badRule = zn.rule, V;
          }
          return 1;
        }
        if (zn = C, C.type === "begin")
          return lr(C);
        if (C.type === "illegal" && !U) {
          const V = new Error('Illegal lexeme "' + B + '" for mode "' + (P.scope || "<unnamed>") + '"');
          throw V.mode = P, V;
        } else if (C.type === "end") {
          const V = cr(C);
          if (V !== wt)
            return V;
        }
        if (C.type === "illegal" && B === "")
          return Z += `
`, 1;
        if (mi > 1e5 && mi > C.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return Z += B, B.length;
      }
      const Ue = E(w);
      if (!Ue)
        throw ve(K.replace("{}", w)), new Error('Unknown language: "' + w + '"');
      const hr = Mt(Ue);
      let gi = "", P = Y || hr;
      const as = {}, ce = new S.__emitter(S);
      ur();
      let Z = "", $n = 0, yt = 0, mi = 0, wi = !1;
      try {
        if (Ue.__emitTokens)
          Ue.__emitTokens(R, ce);
        else {
          for (P.matcher.considerAll(); ; ) {
            mi++, wi ? wi = !1 : P.matcher.considerAll(), P.matcher.lastIndex = yt;
            const k = P.matcher.exec(R);
            if (!k) break;
            const C = R.substring(yt, k.index), B = os(C, k);
            yt = k.index + B;
          }
          os(R.substring(yt));
        }
        return ce.finalize(), gi = ce.toHTML(), {
          language: w,
          value: gi,
          relevance: $n,
          illegal: !1,
          _emitter: ce,
          _top: P
        };
      } catch (k) {
        if (k.message && k.message.includes("Illegal"))
          return {
            language: w,
            value: en(R),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: k.message,
              index: yt,
              context: R.slice(yt - 100, yt + 100),
              mode: k.mode,
              resultSoFar: gi
            },
            _emitter: ce
          };
        if (Q)
          return {
            language: w,
            value: en(R),
            illegal: !1,
            relevance: 0,
            errorRaised: k,
            _emitter: ce,
            _top: P
          };
        throw k;
      }
    }
    function Lt(w) {
      const R = {
        value: en(w),
        illegal: !1,
        relevance: 0,
        _top: T,
        _emitter: new S.__emitter(S)
      };
      return R._emitter.addText(w), R;
    }
    function bt(w, R) {
      R = R || S.languages || Object.keys(d);
      const U = Lt(w), Y = R.filter(E).filter(re).map(
        (Se) => ot(Se, w, !1)
      );
      Y.unshift(U);
      const oe = Y.sort((Se, Be) => {
        if (Se.relevance !== Be.relevance) return Be.relevance - Se.relevance;
        if (Se.language && Be.language) {
          if (E(Se.language).supersetOf === Be.language)
            return 1;
          if (E(Be.language).supersetOf === Se.language)
            return -1;
        }
        return 0;
      }), [Le, at] = oe, Un = Le;
      return Un.secondBest = at, Un;
    }
    function Dn(w, R, U) {
      const Y = R && x[R] || U;
      w.classList.add("hljs"), w.classList.add(`language-${Y}`);
    }
    function Ee(w) {
      let R = null;
      const U = F(w);
      if (L(U)) return;
      if (Pe(
        "before:highlightElement",
        { el: w, language: U }
      ), w.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", w);
        return;
      }
      if (w.children.length > 0 && (S.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(w)), S.throwUnescapedHTML))
        throw new Jt(
          "One of your code blocks includes unescaped HTML.",
          w.innerHTML
        );
      R = w;
      const Y = R.textContent, oe = U ? W(Y, { language: U, ignoreIllegals: !0 }) : bt(Y);
      w.innerHTML = oe.value, w.dataset.highlighted = "yes", Dn(w, U, oe.language), w.result = {
        language: oe.language,
        // TODO: remove with version 11.0
        re: oe.relevance,
        relevance: oe.relevance
      }, oe.secondBest && (w.secondBest = {
        language: oe.secondBest.language,
        relevance: oe.secondBest.relevance
      }), Pe("after:highlightElement", { el: w, result: oe, text: Y });
    }
    function Nn(w) {
      S = mt(S, w);
    }
    const Pn = () => {
      It(), ke("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Bn() {
      It(), ke("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let tn = !1;
    function It() {
      function w() {
        It();
      }
      if (document.readyState === "loading") {
        tn || window.addEventListener("DOMContentLoaded", w, !1), tn = !0;
        return;
      }
      document.querySelectorAll(S.cssSelector).forEach(Ee);
    }
    function A(w, R) {
      let U = null;
      try {
        U = R(o);
      } catch (Y) {
        if (ve("Language definition for '{}' could not be registered.".replace("{}", w)), Q)
          ve(Y);
        else
          throw Y;
        U = T;
      }
      U.name || (U.name = w), d[w] = U, U.rawDefinition = R.bind(null, o), U.aliases && q(U.aliases, { languageName: w });
    }
    function c(w) {
      delete d[w];
      for (const R of Object.keys(x))
        x[R] === w && delete x[R];
    }
    function _() {
      return Object.keys(d);
    }
    function E(w) {
      return w = (w || "").toLowerCase(), d[w] || d[x[w]];
    }
    function q(w, { languageName: R }) {
      typeof w == "string" && (w = [w]), w.forEach((U) => {
        x[U.toLowerCase()] = R;
      });
    }
    function re(w) {
      const R = E(w);
      return R && !R.disableAutodetect;
    }
    function ee(w) {
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
      ee(w), I.push(w);
    }
    function Me(w) {
      const R = I.indexOf(w);
      R !== -1 && I.splice(R, 1);
    }
    function Pe(w, R) {
      const U = w;
      I.forEach(function(Y) {
        Y[U] && Y[U](R);
      });
    }
    function nn(w) {
      return ke("10.7.0", "highlightBlock will be removed entirely in v12.0"), ke("10.7.0", "Please use highlightElement now."), Ee(w);
    }
    Object.assign(o, {
      highlight: W,
      highlightAuto: bt,
      highlightAll: It,
      highlightElement: Ee,
      // TODO: Remove with v12 API
      highlightBlock: nn,
      configure: Nn,
      initHighlighting: Pn,
      initHighlightingOnLoad: Bn,
      registerLanguage: A,
      unregisterLanguage: c,
      listLanguages: _,
      getLanguage: E,
      registerAliases: q,
      autoDetection: re,
      inherit: mt,
      addPlugin: ue,
      removePlugin: Me
    }), o.debugMode = function() {
      Q = !1;
    }, o.safeMode = function() {
      Q = !0;
    }, o.versionString = Qt, o.regex = {
      concat: M,
      lookahead: v,
      either: xe,
      optional: N,
      anyNumberOfTimes: $
    };
    for (const w in ft)
      typeof ft[w] == "object" && n(ft[w]);
    return Object.assign(o, ft), o;
  }, rt = st({});
  return rt.newInstance = () => st({}), bi = rt, rt.HighlightJS = rt, rt.default = rt, bi;
}
var vr = /* @__PURE__ */ xr();
const Hs = /* @__PURE__ */ _r(vr);
function kr(n) {
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
Hs.registerLanguage("json", kr);
class Er extends Re {
  constructor() {
    super(), this.root = document.createElement("div"), this.root.classList.add("json-viewer"), this.jsonViewerContent = document.createElement("div"), this.jsonViewerContent.classList.add("json-viewer__content"), this.root.appendChild(this.jsonViewerContent);
  }
  displayAsJson(e) {
    this.clear();
    const t = document.createElement("pre");
    t.classList.add("json-viewer__pre"), t.textContent = JSON.stringify(e, null, 2), Hs.highlightElement(t), t.style.backgroundColor = "transparent", this.jsonViewerContent.appendChild(t);
  }
  clear() {
  }
}
class Sr extends ii {
  constructor() {
    super("console-message-overlay");
    const e = document.createElement("div");
    e.classList.add("console-title-box"), this.root.appendChild(e), this.titleTextDiv = document.createElement("div"), this.titleTextDiv.classList.add("console-title-box__text"), e.appendChild(this.titleTextDiv), this.jsonViewer = new Er(), this.jsonViewer.mount(this.root);
    const t = new Tr();
    t.setCopyTarget(this.jsonViewer.root), t.mount(e);
  }
  displayMessage(e, t) {
    this.titleTextDiv.innerHTML = e, this.jsonViewer.displayAsJson(t), super.setVisibility(!0);
  }
  hide() {
    this.titleTextDiv.innerHTML = "", this.jsonViewer.clear(), super.setVisibility(!1);
  }
}
class Tr extends Re {
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
class Ar extends ii {
  constructor() {
    super("session-finished-overlay"), this.submitButton = new Rr(), this.submitButton.mount(this.root), this.messageBox = document.createElement("div"), this.messageBox.classList.add("debrief-message-box"), this.root.appendChild(this.messageBox), this.messageSpan = document.createElement("span"), this.messageSpan.classList.add("debrief-message-box__text"), this.messageBox.appendChild(this.messageSpan);
  }
  show(e, t) {
    e.length == 0 ? this.messageBox.style.visibility = "hidden" : this.messageBox.style.visibility = "visible", this.messageSpan.textContent = e, this.submitButton.attachClickListener(t), this.setVisibility(!0);
  }
  hide() {
    this.messageSpan.textContent = "", super.setVisibility(!1), this.submitButton.removeAllEventListeners();
  }
}
class Rr extends Re {
  constructor() {
    super();
    const e = document.createElement("button");
    e.classList.add("submit-button"), e.textContent = "Press to Submit", this.root = e;
  }
  attachClickListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class Cr extends ii {
  constructor() {
    super("session-started-overlay"), this.startButton = new Or(), this.startButton.mount(this.root);
  }
  show(e) {
    this.startButton.attachClickListener(e), this.setVisibility(!0);
  }
  hide() {
    super.setVisibility(!1), this.startButton.removeAllEventListeners();
  }
}
class Or extends Re {
  constructor() {
    super();
    const e = document.createElement("button");
    e.classList.add("start-button"), e.textContent = "Press to Start", this.root = e;
  }
  attachClickListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class Mr extends Re {
  constructor() {
    super(), this.root = document.createElement("div"), this.root.className = "shell-ui", this.progressBar = new wr("cognition"), this.progressBar.mount(this.root), this.statusDot = new mr(), this.statusDot.mount(this.root), this.sessionConnectingOverlay = new yr(), this.sessionConnectingOverlay.mount(this.root), this.overlayConsoleMessage = new Sr(), this.overlayConsoleMessage.mount(this.root), this.sessionFinishedOverlay = new Ar(), this.sessionFinishedOverlay.mount(this.root), this.sessionStartedOverlay = new Cr(), this.sessionStartedOverlay.mount(this.root);
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
    let i = new Promise((r, l) => {
      this.sessionFinishedOverlay.show(
        e,
        () => {
          this.sessionFinishedOverlay.hide(), r();
        }
      );
    });
    await i;
    let s = new Promise((r, l) => {
      setTimeout(() => {
        this.sessionFinishedOverlay.hide(), r();
      }, t);
    });
    await Promise.race([i, s]);
  }
}
function Gi() {
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
var St = Gi();
function Fs(n) {
  St = n;
}
var _n = { exec: () => null };
function H(n, e = "") {
  let t = typeof n == "string" ? n : n.source;
  const i = {
    replace: (s, r) => {
      let l = typeof r == "string" ? r : r.source;
      return l = l.replace(pe.caret, "$1"), t = t.replace(s, l), i;
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
}, Lr = /^(?:[ \t]*(?:\n|$))+/, Ir = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Dr = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, vn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Nr = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Wi = /(?:[*+-]|\d{1,9}[.)])/, Vs = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, js = H(Vs).replace(/bull/g, Wi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Pr = H(Vs).replace(/bull/g, Wi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), qi = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Br = /^[^\n]+/, Xi = /(?!\s*\])(?:\\.|[^\[\]\\])+/, Ur = H(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Xi).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), zr = H(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Wi).getRegex(), si = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Yi = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, $r = H(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", Yi).replace("tag", si).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Gs = H(qi).replace("hr", vn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", si).getRegex(), Hr = H(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Gs).getRegex(), Zi = {
  blockquote: Hr,
  code: Ir,
  def: Ur,
  fences: Dr,
  heading: Nr,
  hr: vn,
  html: $r,
  lheading: js,
  list: zr,
  newline: Lr,
  paragraph: Gs,
  table: _n,
  text: Br
}, cs = H(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", vn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", si).getRegex(), Fr = {
  ...Zi,
  lheading: Pr,
  table: cs,
  paragraph: H(qi).replace("hr", vn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", cs).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", si).getRegex()
}, Vr = {
  ...Zi,
  html: H(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", Yi).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: _n,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: H(qi).replace("hr", vn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", js).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, jr = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Gr = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Ws = /^( {2,}|\\)\n(?!\s*$)/, Wr = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, ri = /[\p{P}\p{S}]/u, Ki = /[\s\p{P}\p{S}]/u, qs = /[^\s\p{P}\p{S}]/u, qr = H(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Ki).getRegex(), Xs = /(?!~)[\p{P}\p{S}]/u, Xr = /(?!~)[\s\p{P}\p{S}]/u, Yr = /(?:[^\s\p{P}\p{S}]|~)/u, Zr = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, Ys = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Kr = H(Ys, "u").replace(/punct/g, ri).getRegex(), Qr = H(Ys, "u").replace(/punct/g, Xs).getRegex(), Zs = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Jr = H(Zs, "gu").replace(/notPunctSpace/g, qs).replace(/punctSpace/g, Ki).replace(/punct/g, ri).getRegex(), eo = H(Zs, "gu").replace(/notPunctSpace/g, Yr).replace(/punctSpace/g, Xr).replace(/punct/g, Xs).getRegex(), to = H(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, qs).replace(/punctSpace/g, Ki).replace(/punct/g, ri).getRegex(), no = H(/\\(punct)/, "gu").replace(/punct/g, ri).getRegex(), io = H(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), so = H(Yi).replace("(?:-->|$)", "-->").getRegex(), ro = H(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", so).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Kn = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, oo = H(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", Kn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Ks = H(/^!?\[(label)\]\[(ref)\]/).replace("label", Kn).replace("ref", Xi).getRegex(), Qs = H(/^!?\[(ref)\](?:\[\])?/).replace("ref", Xi).getRegex(), ao = H("reflink|nolink(?!\\()", "g").replace("reflink", Ks).replace("nolink", Qs).getRegex(), Qi = {
  _backpedal: _n,
  // only used for GFM url
  anyPunctuation: no,
  autolink: io,
  blockSkip: Zr,
  br: Ws,
  code: Gr,
  del: _n,
  emStrongLDelim: Kr,
  emStrongRDelimAst: Jr,
  emStrongRDelimUnd: to,
  escape: jr,
  link: oo,
  nolink: Qs,
  punctuation: qr,
  reflink: Ks,
  reflinkSearch: ao,
  tag: ro,
  text: Wr,
  url: _n
}, lo = {
  ...Qi,
  link: H(/^!?\[(label)\]\((.*?)\)/).replace("label", Kn).getRegex(),
  reflink: H(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Kn).getRegex()
}, Pi = {
  ...Qi,
  emStrongRDelimAst: eo,
  emStrongLDelim: Qr,
  url: H(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, co = {
  ...Pi,
  br: H(Ws).replace("{2,}", "*").getRegex(),
  text: H(Pi.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Hn = {
  normal: Zi,
  gfm: Fr,
  pedantic: Vr
}, sn = {
  normal: Qi,
  gfm: Pi,
  breaks: co,
  pedantic: lo
}, uo = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, us = (n) => uo[n];
function ze(n, e) {
  if (e) {
    if (pe.escapeTest.test(n))
      return n.replace(pe.escapeReplace, us);
  } else if (pe.escapeTestNoEncode.test(n))
    return n.replace(pe.escapeReplaceNoEncode, us);
  return n;
}
function hs(n) {
  try {
    n = encodeURI(n).replace(pe.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function ds(n, e) {
  var r;
  const t = n.replace(pe.findPipe, (l, a, h) => {
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
function rn(n, e, t) {
  const i = n.length;
  if (i === 0)
    return "";
  let s = 0;
  for (; s < i && n.charAt(i - s - 1) === e; )
    s++;
  return n.slice(0, i - s);
}
function ho(n, e) {
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
function ps(n, e, t, i, s) {
  const r = e.href, l = e.title || null, a = n[1].replace(s.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  const h = {
    type: n[0].charAt(0) === "!" ? "image" : "link",
    raw: t,
    href: r,
    title: l,
    text: a,
    tokens: i.inlineTokens(a)
  };
  return i.state.inLink = !1, h;
}
function po(n, e, t) {
  const i = n.match(t.other.indentCodeCompensation);
  if (i === null)
    return e;
  const s = i[1];
  return e.split(`
`).map((r) => {
    const l = r.match(t.other.beginningSpace);
    if (l === null)
      return r;
    const [a] = l;
    return a.length >= s.length ? r.slice(s.length) : r;
  }).join(`
`);
}
var Qn = class {
  // set by the lexer
  constructor(n) {
    X(this, "options");
    X(this, "rules");
    // set by the lexer
    X(this, "lexer");
    this.options = n || St;
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
        text: this.options.pedantic ? t : rn(t, `
`)
      };
    }
  }
  fences(n) {
    const e = this.rules.block.fences.exec(n);
    if (e) {
      const t = e[0], i = po(t, e[3] || "", this.rules);
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
        const i = rn(t, "#");
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
        raw: rn(e[0], `
`)
      };
  }
  blockquote(n) {
    const e = this.rules.block.blockquote.exec(n);
    if (e) {
      let t = rn(e[0], `
`).split(`
`), i = "", s = "";
      const r = [];
      for (; t.length > 0; ) {
        let l = !1;
        const a = [];
        let h;
        for (h = 0; h < t.length; h++)
          if (this.rules.other.blockquoteStart.test(t[h]))
            a.push(t[h]), l = !0;
          else if (!l)
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
        const v = r.at(-1);
        if ((v == null ? void 0 : v.type) === "code")
          break;
        if ((v == null ? void 0 : v.type) === "blockquote") {
          const $ = v, N = $.raw + `
` + t.join(`
`), M = this.blockquote(N);
          r[r.length - 1] = M, i = i.substring(0, i.length - $.raw.length) + M.raw, s = s.substring(0, s.length - $.text.length) + M.text;
          break;
        } else if ((v == null ? void 0 : v.type) === "list") {
          const $ = v, N = $.raw + `
` + t.join(`
`), M = this.list(N);
          r[r.length - 1] = M, i = i.substring(0, i.length - v.raw.length) + M.raw, s = s.substring(0, s.length - $.raw.length) + M.raw, t = N.substring(r.at(-1).raw.length).split(`
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
      let l = !1;
      for (; n; ) {
        let h = !1, u = "", p = "";
        if (!(e = r.exec(n)) || this.rules.block.hr.test(n))
          break;
        u = e[0], n = n.substring(u.length);
        let O = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (xe) => " ".repeat(3 * xe.length)), v = n.split(`
`, 1)[0], $ = !O.trim(), N = 0;
        if (this.options.pedantic ? (N = 2, p = O.trimStart()) : $ ? N = e[1].length + 1 : (N = e[2].search(this.rules.other.nonSpaceChar), N = N > 4 ? 1 : N, p = O.slice(N), N += e[1].length), $ && this.rules.other.blankLine.test(v) && (u += v + `
`, n = n.substring(v.length + 1), h = !0), !h) {
          const xe = this.rules.other.nextBulletRegex(N), le = this.rules.other.hrRegex(N), me = this.rules.other.fencesBeginRegex(N), te = this.rules.other.headingBeginRegex(N), Oe = this.rules.other.htmlBeginRegex(N);
          for (; n; ) {
            const Ve = n.split(`
`, 1)[0];
            let Ne;
            if (v = Ve, this.options.pedantic ? (v = v.replace(this.rules.other.listReplaceNesting, "  "), Ne = v) : Ne = v.replace(this.rules.other.tabCharGlobal, "    "), me.test(v) || te.test(v) || Oe.test(v) || xe.test(v) || le.test(v))
              break;
            if (Ne.search(this.rules.other.nonSpaceChar) >= N || !v.trim())
              p += `
` + Ne.slice(N);
            else {
              if ($ || O.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || me.test(O) || te.test(O) || le.test(O))
                break;
              p += `
` + v;
            }
            !$ && !v.trim() && ($ = !0), u += Ve + `
`, n = n.substring(Ve.length + 1), O = Ne.slice(N);
          }
        }
        s.loose || (l ? s.loose = !0 : this.rules.other.doubleBlankLine.test(u) && (l = !0));
        let M = null, _e;
        this.options.gfm && (M = this.rules.other.listIsTask.exec(p), M && (_e = M[0] !== "[ ] ", p = p.replace(this.rules.other.listReplaceTask, ""))), s.items.push({
          type: "list_item",
          raw: u,
          task: !!M,
          checked: _e,
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
    var l;
    const e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2]))
      return;
    const t = ds(e[1]), i = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = (l = e[3]) != null && l.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
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
        r.rows.push(ds(a, r.header.length).map((h, u) => ({
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
        const r = rn(t.slice(0, -1), "\\");
        if ((t.length - r.length) % 2 === 0)
          return;
      } else {
        const r = ho(e[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(t) ? i = i.slice(1) : i = i.slice(1, -1)), ps(e, {
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
      return ps(t, s, t[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, t = "") {
    let i = this.rules.inline.emStrongLDelim.exec(n);
    if (!i || i[3] && t.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(i[1] || i[2] || "") || !t || this.rules.inline.punctuation.exec(t)) {
      const r = [...i[0]].length - 1;
      let l, a, h = r, u = 0;
      const p = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (p.lastIndex = 0, e = e.slice(-1 * n.length + r); (i = p.exec(e)) != null; ) {
        if (l = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !l) continue;
        if (a = [...l].length, i[3] || i[4]) {
          h += a;
          continue;
        } else if ((i[5] || i[6]) && r % 3 && !((r + a) % 3)) {
          u += a;
          continue;
        }
        if (h -= a, h > 0) continue;
        a = Math.min(a, a + h + u);
        const O = [...i[0]][0].length, v = n.slice(0, r + i.index + O + a);
        if (Math.min(r, a) % 2) {
          const N = v.slice(1, -1);
          return {
            type: "em",
            raw: v,
            text: N,
            tokens: this.lexer.inlineTokens(N)
          };
        }
        const $ = v.slice(2, -2);
        return {
          type: "strong",
          raw: v,
          text: $,
          tokens: this.lexer.inlineTokens($)
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
}, Ze = class Bi {
  constructor(e) {
    X(this, "tokens");
    X(this, "options");
    X(this, "state");
    X(this, "tokenizer");
    X(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || St, this.options.tokenizer = this.options.tokenizer || new Qn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const t = {
      other: pe,
      block: Hn.normal,
      inline: sn.normal
    };
    this.options.pedantic ? (t.block = Hn.pedantic, t.inline = sn.pedantic) : this.options.gfm && (t.block = Hn.gfm, this.options.breaks ? t.inline = sn.breaks : t.inline = sn.gfm), this.tokenizer.rules = t;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: Hn,
      inline: sn
    };
  }
  /**
   * Static Lex Method
   */
  static lex(e, t) {
    return new Bi(t).lex(e);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(e, t) {
    return new Bi(t).inlineTokens(e);
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
    var s, r, l;
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
      if ((l = this.options.extensions) != null && l.startBlock) {
        let u = 1 / 0;
        const p = e.slice(1);
        let O;
        this.options.extensions.startBlock.forEach((v) => {
          O = v.call({ lexer: this }, p), typeof O == "number" && O >= 0 && (u = Math.min(u, O));
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
    let r = !1, l = "";
    for (; e; ) {
      r || (l = ""), r = !1;
      let p;
      if ((h = (a = this.options.extensions) == null ? void 0 : a.inline) != null && h.some((v) => (p = v.call({ lexer: this }, e, t)) ? (e = e.substring(p.raw.length), t.push(p), !0) : !1))
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
        const v = t.at(-1);
        p.type === "text" && (v == null ? void 0 : v.type) === "text" ? (v.raw += p.raw, v.text += p.text) : t.push(p);
        continue;
      }
      if (p = this.tokenizer.emStrong(e, i, l)) {
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
        let v = 1 / 0;
        const $ = e.slice(1);
        let N;
        this.options.extensions.startInline.forEach((M) => {
          N = M.call({ lexer: this }, $), typeof N == "number" && N >= 0 && (v = Math.min(v, N));
        }), v < 1 / 0 && v >= 0 && (O = e.substring(0, v + 1));
      }
      if (p = this.tokenizer.inlineText(O)) {
        e = e.substring(p.raw.length), p.raw.slice(-1) !== "_" && (l = p.raw.slice(-1)), r = !0;
        const v = t.at(-1);
        (v == null ? void 0 : v.type) === "text" ? (v.raw += p.raw, v.text += p.text) : t.push(p);
        continue;
      }
      if (e) {
        const v = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(v);
          break;
        } else
          throw new Error(v);
      }
    }
    return t;
  }
}, Jn = class {
  // set by the parser
  constructor(n) {
    X(this, "options");
    X(this, "parser");
    this.options = n || St;
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
    for (let l = 0; l < n.items.length; l++) {
      const a = n.items[l];
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
      for (let l = 0; l < r.length; l++)
        t += this.tablecell(r[l]);
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
    const i = this.parser.parseInline(t), s = hs(n);
    if (s === null)
      return i;
    n = s;
    let r = '<a href="' + n + '"';
    return e && (r += ' title="' + ze(e) + '"'), r += ">" + i + "</a>", r;
  }
  image({ href: n, title: e, text: t, tokens: i }) {
    i && (t = this.parser.parseInline(i, this.parser.textRenderer));
    const s = hs(n);
    if (s === null)
      return ze(t);
    n = s;
    let r = `<img src="${n}" alt="${t}"`;
    return e && (r += ` title="${ze(e)}"`), r += ">", r;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : ze(n.text);
  }
}, Ji = class {
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
}, Ke = class Ui {
  constructor(e) {
    X(this, "options");
    X(this, "renderer");
    X(this, "textRenderer");
    this.options = e || St, this.options.renderer = this.options.renderer || new Jn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Ji();
  }
  /**
   * Static Parse Method
   */
  static parse(e, t) {
    return new Ui(t).parse(e);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(e, t) {
    return new Ui(t).parseInline(e);
  }
  /**
   * Parse Loop
   */
  parse(e, t = !0) {
    var s, r;
    let i = "";
    for (let l = 0; l < e.length; l++) {
      const a = e[l];
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
          for (; l + 1 < e.length && e[l + 1].type === "text"; )
            u = e[++l], p += `
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
    for (let l = 0; l < e.length; l++) {
      const a = e[l];
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
}, Ni, Xn = (Ni = class {
  constructor(n) {
    X(this, "options");
    X(this, "block");
    this.options = n || St;
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
}, X(Ni, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
])), Ni), fo = class {
  constructor(...n) {
    X(this, "defaults", Gi());
    X(this, "options", this.setOptions);
    X(this, "parse", this.parseMarkdown(!0));
    X(this, "parseInline", this.parseMarkdown(!1));
    X(this, "Parser", Ke);
    X(this, "Renderer", Jn);
    X(this, "TextRenderer", Ji);
    X(this, "Lexer", Ze);
    X(this, "Tokenizer", Qn);
    X(this, "Hooks", Xn);
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
          const l = r;
          for (const a of l.header)
            t = t.concat(this.walkTokens(a.tokens, e));
          for (const a of l.rows)
            for (const h of a)
              t = t.concat(this.walkTokens(h.tokens, e));
          break;
        }
        case "list": {
          const l = r;
          t = t.concat(this.walkTokens(l.items, e));
          break;
        }
        default: {
          const l = r;
          (s = (i = this.defaults.extensions) == null ? void 0 : i.childTokens) != null && s[l.type] ? this.defaults.extensions.childTokens[l.type].forEach((a) => {
            const h = l[a].flat(1 / 0);
            t = t.concat(this.walkTokens(h, e));
          }) : l.tokens && (t = t.concat(this.walkTokens(l.tokens, e)));
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
          r ? e.renderers[s.name] = function(...l) {
            let a = s.renderer.apply(this, l);
            return a === !1 && (a = r.apply(this, l)), a;
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
        const s = this.defaults.renderer || new Jn(this.defaults);
        for (const r in t.renderer) {
          if (!(r in s))
            throw new Error(`renderer '${r}' does not exist`);
          if (["options", "parser"].includes(r))
            continue;
          const l = r, a = t.renderer[l], h = s[l];
          s[l] = (...u) => {
            let p = a.apply(s, u);
            return p === !1 && (p = h.apply(s, u)), p || "";
          };
        }
        i.renderer = s;
      }
      if (t.tokenizer) {
        const s = this.defaults.tokenizer || new Qn(this.defaults);
        for (const r in t.tokenizer) {
          if (!(r in s))
            throw new Error(`tokenizer '${r}' does not exist`);
          if (["options", "rules", "lexer"].includes(r))
            continue;
          const l = r, a = t.tokenizer[l], h = s[l];
          s[l] = (...u) => {
            let p = a.apply(s, u);
            return p === !1 && (p = h.apply(s, u)), p;
          };
        }
        i.tokenizer = s;
      }
      if (t.hooks) {
        const s = this.defaults.hooks || new Xn();
        for (const r in t.hooks) {
          if (!(r in s))
            throw new Error(`hook '${r}' does not exist`);
          if (["options", "block"].includes(r))
            continue;
          const l = r, a = t.hooks[l], h = s[l];
          Xn.passThroughHooks.has(r) ? s[l] = (u) => {
            if (this.defaults.async)
              return Promise.resolve(a.call(s, u)).then((O) => h.call(s, O));
            const p = a.call(s, u);
            return h.call(s, p);
          } : s[l] = (...u) => {
            let p = a.apply(s, u);
            return p === !1 && (p = h.apply(s, u)), p;
          };
        }
        i.hooks = s;
      }
      if (t.walkTokens) {
        const s = this.defaults.walkTokens, r = t.walkTokens;
        i.walkTokens = function(l) {
          let a = [];
          return a.push(r.call(this, l)), s && (a = a.concat(s.call(this, l))), a;
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
      const s = { ...i }, r = { ...this.defaults, ...s }, l = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && s.async === !1)
        return l(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null)
        return l(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string")
        return l(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      r.hooks && (r.hooks.options = r, r.hooks.block = n);
      const a = r.hooks ? r.hooks.provideLexer() : n ? Ze.lex : Ze.lexInline, h = r.hooks ? r.hooks.provideParser() : n ? Ke.parse : Ke.parseInline;
      if (r.async)
        return Promise.resolve(r.hooks ? r.hooks.preprocess(t) : t).then((u) => a(u, r)).then((u) => r.hooks ? r.hooks.processAllTokens(u) : u).then((u) => r.walkTokens ? Promise.all(this.walkTokens(u, r.walkTokens)).then(() => u) : u).then((u) => h(u, r)).then((u) => r.hooks ? r.hooks.postprocess(u) : u).catch(l);
      try {
        r.hooks && (t = r.hooks.preprocess(t));
        let u = a(t, r);
        r.hooks && (u = r.hooks.processAllTokens(u)), r.walkTokens && this.walkTokens(u, r.walkTokens);
        let p = h(u, r);
        return r.hooks && (p = r.hooks.postprocess(p)), p;
      } catch (u) {
        return l(u);
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
}, Et = new fo();
function j(n, e) {
  return Et.parse(n, e);
}
j.options = j.setOptions = function(n) {
  return Et.setOptions(n), j.defaults = Et.defaults, Fs(j.defaults), j;
};
j.getDefaults = Gi;
j.defaults = St;
j.use = function(...n) {
  return Et.use(...n), j.defaults = Et.defaults, Fs(j.defaults), j;
};
j.walkTokens = function(n, e) {
  return Et.walkTokens(n, e);
};
j.parseInline = Et.parseInline;
j.Parser = Ke;
j.parser = Ke.parse;
j.Renderer = Jn;
j.TextRenderer = Ji;
j.Lexer = Ze;
j.lexer = Ze.lex;
j.Tokenizer = Qn;
j.Hooks = Xn;
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
  entries: Js,
  setPrototypeOf: fs,
  isFrozen: go,
  getPrototypeOf: mo,
  getOwnPropertyDescriptor: wo
} = Object;
let {
  freeze: fe,
  seal: Ce,
  create: er
} = Object, {
  apply: zi,
  construct: $i
} = typeof Reflect < "u" && Reflect;
fe || (fe = function(e) {
  return e;
});
Ce || (Ce = function(e) {
  return e;
});
zi || (zi = function(e, t, i) {
  return e.apply(t, i);
});
$i || ($i = function(e, t) {
  return new e(...t);
});
const Fn = ge(Array.prototype.forEach), bo = ge(Array.prototype.lastIndexOf), gs = ge(Array.prototype.pop), on = ge(Array.prototype.push), yo = ge(Array.prototype.splice), Yn = ge(String.prototype.toLowerCase), yi = ge(String.prototype.toString), ms = ge(String.prototype.match), an = ge(String.prototype.replace), _o = ge(String.prototype.indexOf), xo = ge(String.prototype.trim), Ie = ge(Object.prototype.hasOwnProperty), de = ge(RegExp.prototype.test), ln = vo(TypeError);
function ge(n) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++)
      i[s - 1] = arguments[s];
    return zi(n, e, i);
  };
}
function vo(n) {
  return function() {
    for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++)
      t[i] = arguments[i];
    return $i(n, t);
  };
}
function z(n, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Yn;
  fs && fs(n, null);
  let i = e.length;
  for (; i--; ) {
    let s = e[i];
    if (typeof s == "string") {
      const r = t(s);
      r !== s && (go(e) || (e[i] = r), s = r);
    }
    n[s] = !0;
  }
  return n;
}
function ko(n) {
  for (let e = 0; e < n.length; e++)
    Ie(n, e) || (n[e] = null);
  return n;
}
function Xe(n) {
  const e = er(null);
  for (const [t, i] of Js(n))
    Ie(n, t) && (Array.isArray(i) ? e[t] = ko(i) : i && typeof i == "object" && i.constructor === Object ? e[t] = Xe(i) : e[t] = i);
  return e;
}
function cn(n, e) {
  for (; n !== null; ) {
    const i = wo(n, e);
    if (i) {
      if (i.get)
        return ge(i.get);
      if (typeof i.value == "function")
        return ge(i.value);
    }
    n = mo(n);
  }
  function t() {
    return null;
  }
  return t;
}
const ws = fe(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), _i = fe(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), xi = fe(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Eo = fe(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), vi = fe(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), So = fe(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), bs = fe(["#text"]), ys = fe(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), ki = fe(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), _s = fe(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Vn = fe(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), To = Ce(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Ao = Ce(/<%[\w\W]*|[\w\W]*%>/gm), Ro = Ce(/\$\{[\w\W]*/gm), Co = Ce(/^data-[\-\w.\u00B7-\uFFFF]+$/), Oo = Ce(/^aria-[\-\w]+$/), tr = Ce(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Mo = Ce(/^(?:\w+script|data):/i), Lo = Ce(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), nr = Ce(/^html$/i), Io = Ce(/^[a-z][.\w]*(-[.\w]+)+$/i);
var xs = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: Oo,
  ATTR_WHITESPACE: Lo,
  CUSTOM_ELEMENT: Io,
  DATA_ATTR: Co,
  DOCTYPE_NAME: nr,
  ERB_EXPR: Ao,
  IS_ALLOWED_URI: tr,
  IS_SCRIPT_OR_DATA: Mo,
  MUSTACHE_EXPR: To,
  TMPLIT_EXPR: Ro
});
const un = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, Do = function() {
  return typeof window > "u" ? null : window;
}, No = function(e, t) {
  if (typeof e != "object" || typeof e.createPolicy != "function")
    return null;
  let i = null;
  const s = "data-tt-policy-suffix";
  t && t.hasAttribute(s) && (i = t.getAttribute(s));
  const r = "dompurify" + (i ? "#" + i : "");
  try {
    return e.createPolicy(r, {
      createHTML(l) {
        return l;
      },
      createScriptURL(l) {
        return l;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + r + " could not be created."), null;
  }
}, vs = function() {
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
function ir() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Do();
  const e = (A) => ir(A);
  if (e.version = "3.2.6", e.removed = [], !n || !n.document || n.document.nodeType !== un.document || !n.Element)
    return e.isSupported = !1, e;
  let {
    document: t
  } = n;
  const i = t, s = i.currentScript, {
    DocumentFragment: r,
    HTMLTemplateElement: l,
    Node: a,
    Element: h,
    NodeFilter: u,
    NamedNodeMap: p = n.NamedNodeMap || n.MozNamedAttrMap,
    HTMLFormElement: O,
    DOMParser: v,
    trustedTypes: $
  } = n, N = h.prototype, M = cn(N, "cloneNode"), _e = cn(N, "remove"), xe = cn(N, "nextSibling"), le = cn(N, "childNodes"), me = cn(N, "parentNode");
  if (typeof l == "function") {
    const A = t.createElement("template");
    A.content && A.content.ownerDocument && (t = A.content.ownerDocument);
  }
  let te, Oe = "";
  const {
    implementation: Ve,
    createNodeIterator: Ne,
    createDocumentFragment: Vt,
    getElementsByTagName: kn
  } = t, {
    importNode: En
  } = i;
  let ae = vs();
  e.isSupported = typeof Js == "function" && typeof me == "function" && Ve && Ve.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: jt,
    ERB_EXPR: Gt,
    TMPLIT_EXPR: je,
    DATA_ATTR: ci,
    ARIA_ATTR: ui,
    IS_SCRIPT_OR_DATA: hi,
    ATTR_WHITESPACE: dt,
    CUSTOM_ELEMENT: di
  } = xs;
  let {
    IS_ALLOWED_URI: Sn
  } = xs, ne = null;
  const Tn = z({}, [...ws, ..._i, ...xi, ...vi, ...bs]);
  let se = null;
  const An = z({}, [...ys, ...ki, ..._s, ...Vn]);
  let J = Object.seal(er(null, {
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
  })), pt = null, Wt = null, Rn = !0, Cn = !0, ft = !1, On = !0, tt = !1, Tt = !0, Ge = !1, qt = !1, Xt = !1, nt = !1, At = !1, Rt = !1, Yt = !0, Mn = !1;
  const pi = "user-content-";
  let Ct = !0, ve = !1, We = {}, ke = null;
  const gt = z({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let Zt = null;
  const Ln = z({}, ["audio", "video", "img", "source", "image", "track"]);
  let Kt = null;
  const In = z({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Ot = "http://www.w3.org/1998/Math/MathML", Mt = "http://www.w3.org/2000/svg", Te = "http://www.w3.org/1999/xhtml";
  let it = Te, Qt = !1, Jt = null;
  const en = z({}, [Ot, Mt, Te], yi);
  let mt = z({}, ["mi", "mo", "mn", "ms", "mtext"]), wt = z({}, ["annotation-xml"]);
  const fi = z({}, ["title", "style", "font", "a", "script"]);
  let st = null;
  const rt = ["application/xhtml+xml", "text/html"], o = "text/html";
  let d = null, x = null;
  const I = t.createElement("form"), Q = function(c) {
    return c instanceof RegExp || c instanceof Function;
  }, K = function() {
    let c = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(x && x === c)) {
      if ((!c || typeof c != "object") && (c = {}), c = Xe(c), st = // eslint-disable-next-line unicorn/prefer-includes
      rt.indexOf(c.PARSER_MEDIA_TYPE) === -1 ? o : c.PARSER_MEDIA_TYPE, d = st === "application/xhtml+xml" ? yi : Yn, ne = Ie(c, "ALLOWED_TAGS") ? z({}, c.ALLOWED_TAGS, d) : Tn, se = Ie(c, "ALLOWED_ATTR") ? z({}, c.ALLOWED_ATTR, d) : An, Jt = Ie(c, "ALLOWED_NAMESPACES") ? z({}, c.ALLOWED_NAMESPACES, yi) : en, Kt = Ie(c, "ADD_URI_SAFE_ATTR") ? z(Xe(In), c.ADD_URI_SAFE_ATTR, d) : In, Zt = Ie(c, "ADD_DATA_URI_TAGS") ? z(Xe(Ln), c.ADD_DATA_URI_TAGS, d) : Ln, ke = Ie(c, "FORBID_CONTENTS") ? z({}, c.FORBID_CONTENTS, d) : gt, pt = Ie(c, "FORBID_TAGS") ? z({}, c.FORBID_TAGS, d) : Xe({}), Wt = Ie(c, "FORBID_ATTR") ? z({}, c.FORBID_ATTR, d) : Xe({}), We = Ie(c, "USE_PROFILES") ? c.USE_PROFILES : !1, Rn = c.ALLOW_ARIA_ATTR !== !1, Cn = c.ALLOW_DATA_ATTR !== !1, ft = c.ALLOW_UNKNOWN_PROTOCOLS || !1, On = c.ALLOW_SELF_CLOSE_IN_ATTR !== !1, tt = c.SAFE_FOR_TEMPLATES || !1, Tt = c.SAFE_FOR_XML !== !1, Ge = c.WHOLE_DOCUMENT || !1, nt = c.RETURN_DOM || !1, At = c.RETURN_DOM_FRAGMENT || !1, Rt = c.RETURN_TRUSTED_TYPE || !1, Xt = c.FORCE_BODY || !1, Yt = c.SANITIZE_DOM !== !1, Mn = c.SANITIZE_NAMED_PROPS || !1, Ct = c.KEEP_CONTENT !== !1, ve = c.IN_PLACE || !1, Sn = c.ALLOWED_URI_REGEXP || tr, it = c.NAMESPACE || Te, mt = c.MATHML_TEXT_INTEGRATION_POINTS || mt, wt = c.HTML_INTEGRATION_POINTS || wt, J = c.CUSTOM_ELEMENT_HANDLING || {}, c.CUSTOM_ELEMENT_HANDLING && Q(c.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (J.tagNameCheck = c.CUSTOM_ELEMENT_HANDLING.tagNameCheck), c.CUSTOM_ELEMENT_HANDLING && Q(c.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (J.attributeNameCheck = c.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), c.CUSTOM_ELEMENT_HANDLING && typeof c.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (J.allowCustomizedBuiltInElements = c.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), tt && (Cn = !1), At && (nt = !0), We && (ne = z({}, bs), se = [], We.html === !0 && (z(ne, ws), z(se, ys)), We.svg === !0 && (z(ne, _i), z(se, ki), z(se, Vn)), We.svgFilters === !0 && (z(ne, xi), z(se, ki), z(se, Vn)), We.mathMl === !0 && (z(ne, vi), z(se, _s), z(se, Vn))), c.ADD_TAGS && (ne === Tn && (ne = Xe(ne)), z(ne, c.ADD_TAGS, d)), c.ADD_ATTR && (se === An && (se = Xe(se)), z(se, c.ADD_ATTR, d)), c.ADD_URI_SAFE_ATTR && z(Kt, c.ADD_URI_SAFE_ATTR, d), c.FORBID_CONTENTS && (ke === gt && (ke = Xe(ke)), z(ke, c.FORBID_CONTENTS, d)), Ct && (ne["#text"] = !0), Ge && z(ne, ["html", "head", "body"]), ne.table && (z(ne, ["tbody"]), delete pt.tbody), c.TRUSTED_TYPES_POLICY) {
        if (typeof c.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw ln('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof c.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw ln('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        te = c.TRUSTED_TYPES_POLICY, Oe = te.createHTML("");
      } else
        te === void 0 && (te = No($, s)), te !== null && typeof Oe == "string" && (Oe = te.createHTML(""));
      fe && fe(c), x = c;
    }
  }, T = z({}, [..._i, ...xi, ...Eo]), S = z({}, [...vi, ...So]), L = function(c) {
    let _ = me(c);
    (!_ || !_.tagName) && (_ = {
      namespaceURI: it,
      tagName: "template"
    });
    const E = Yn(c.tagName), q = Yn(_.tagName);
    return Jt[c.namespaceURI] ? c.namespaceURI === Mt ? _.namespaceURI === Te ? E === "svg" : _.namespaceURI === Ot ? E === "svg" && (q === "annotation-xml" || mt[q]) : !!T[E] : c.namespaceURI === Ot ? _.namespaceURI === Te ? E === "math" : _.namespaceURI === Mt ? E === "math" && wt[q] : !!S[E] : c.namespaceURI === Te ? _.namespaceURI === Mt && !wt[q] || _.namespaceURI === Ot && !mt[q] ? !1 : !S[E] && (fi[E] || !T[E]) : !!(st === "application/xhtml+xml" && Jt[c.namespaceURI]) : !1;
  }, F = function(c) {
    on(e.removed, {
      element: c
    });
    try {
      me(c).removeChild(c);
    } catch {
      _e(c);
    }
  }, W = function(c, _) {
    try {
      on(e.removed, {
        attribute: _.getAttributeNode(c),
        from: _
      });
    } catch {
      on(e.removed, {
        attribute: null,
        from: _
      });
    }
    if (_.removeAttribute(c), c === "is")
      if (nt || At)
        try {
          F(_);
        } catch {
        }
      else
        try {
          _.setAttribute(c, "");
        } catch {
        }
  }, ot = function(c) {
    let _ = null, E = null;
    if (Xt)
      c = "<remove></remove>" + c;
    else {
      const ee = ms(c, /^[\r\n\t ]+/);
      E = ee && ee[0];
    }
    st === "application/xhtml+xml" && it === Te && (c = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + c + "</body></html>");
    const q = te ? te.createHTML(c) : c;
    if (it === Te)
      try {
        _ = new v().parseFromString(q, st);
      } catch {
      }
    if (!_ || !_.documentElement) {
      _ = Ve.createDocument(it, "template", null);
      try {
        _.documentElement.innerHTML = Qt ? Oe : q;
      } catch {
      }
    }
    const re = _.body || _.documentElement;
    return c && E && re.insertBefore(t.createTextNode(E), re.childNodes[0] || null), it === Te ? kn.call(_, Ge ? "html" : "body")[0] : Ge ? _.documentElement : re;
  }, Lt = function(c) {
    return Ne.call(
      c.ownerDocument || c,
      c,
      // eslint-disable-next-line no-bitwise
      u.SHOW_ELEMENT | u.SHOW_COMMENT | u.SHOW_TEXT | u.SHOW_PROCESSING_INSTRUCTION | u.SHOW_CDATA_SECTION,
      null
    );
  }, bt = function(c) {
    return c instanceof O && (typeof c.nodeName != "string" || typeof c.textContent != "string" || typeof c.removeChild != "function" || !(c.attributes instanceof p) || typeof c.removeAttribute != "function" || typeof c.setAttribute != "function" || typeof c.namespaceURI != "string" || typeof c.insertBefore != "function" || typeof c.hasChildNodes != "function");
  }, Dn = function(c) {
    return typeof a == "function" && c instanceof a;
  };
  function Ee(A, c, _) {
    Fn(A, (E) => {
      E.call(e, c, _, x);
    });
  }
  const Nn = function(c) {
    let _ = null;
    if (Ee(ae.beforeSanitizeElements, c, null), bt(c))
      return F(c), !0;
    const E = d(c.nodeName);
    if (Ee(ae.uponSanitizeElement, c, {
      tagName: E,
      allowedTags: ne
    }), Tt && c.hasChildNodes() && !Dn(c.firstElementChild) && de(/<[/\w!]/g, c.innerHTML) && de(/<[/\w!]/g, c.textContent) || c.nodeType === un.progressingInstruction || Tt && c.nodeType === un.comment && de(/<[/\w]/g, c.data))
      return F(c), !0;
    if (!ne[E] || pt[E]) {
      if (!pt[E] && Bn(E) && (J.tagNameCheck instanceof RegExp && de(J.tagNameCheck, E) || J.tagNameCheck instanceof Function && J.tagNameCheck(E)))
        return !1;
      if (Ct && !ke[E]) {
        const q = me(c) || c.parentNode, re = le(c) || c.childNodes;
        if (re && q) {
          const ee = re.length;
          for (let ue = ee - 1; ue >= 0; --ue) {
            const Me = M(re[ue], !0);
            Me.__removalCount = (c.__removalCount || 0) + 1, q.insertBefore(Me, xe(c));
          }
        }
      }
      return F(c), !0;
    }
    return c instanceof h && !L(c) || (E === "noscript" || E === "noembed" || E === "noframes") && de(/<\/no(script|embed|frames)/i, c.innerHTML) ? (F(c), !0) : (tt && c.nodeType === un.text && (_ = c.textContent, Fn([jt, Gt, je], (q) => {
      _ = an(_, q, " ");
    }), c.textContent !== _ && (on(e.removed, {
      element: c.cloneNode()
    }), c.textContent = _)), Ee(ae.afterSanitizeElements, c, null), !1);
  }, Pn = function(c, _, E) {
    if (Yt && (_ === "id" || _ === "name") && (E in t || E in I))
      return !1;
    if (!(Cn && !Wt[_] && de(ci, _))) {
      if (!(Rn && de(ui, _))) {
        if (!se[_] || Wt[_]) {
          if (
            // First condition does a very basic check if a) it's basically a valid custom element tagname AND
            // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
            !(Bn(c) && (J.tagNameCheck instanceof RegExp && de(J.tagNameCheck, c) || J.tagNameCheck instanceof Function && J.tagNameCheck(c)) && (J.attributeNameCheck instanceof RegExp && de(J.attributeNameCheck, _) || J.attributeNameCheck instanceof Function && J.attributeNameCheck(_)) || // Alternative, second condition checks if it's an `is`-attribute, AND
            // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            _ === "is" && J.allowCustomizedBuiltInElements && (J.tagNameCheck instanceof RegExp && de(J.tagNameCheck, E) || J.tagNameCheck instanceof Function && J.tagNameCheck(E)))
          ) return !1;
        } else if (!Kt[_]) {
          if (!de(Sn, an(E, dt, ""))) {
            if (!((_ === "src" || _ === "xlink:href" || _ === "href") && c !== "script" && _o(E, "data:") === 0 && Zt[c])) {
              if (!(ft && !de(hi, an(E, dt, "")))) {
                if (E)
                  return !1;
              }
            }
          }
        }
      }
    }
    return !0;
  }, Bn = function(c) {
    return c !== "annotation-xml" && ms(c, di);
  }, tn = function(c) {
    Ee(ae.beforeSanitizeAttributes, c, null);
    const {
      attributes: _
    } = c;
    if (!_ || bt(c))
      return;
    const E = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: se,
      forceKeepAttr: void 0
    };
    let q = _.length;
    for (; q--; ) {
      const re = _[q], {
        name: ee,
        namespaceURI: ue,
        value: Me
      } = re, Pe = d(ee), nn = Me;
      let w = ee === "value" ? nn : xo(nn);
      if (E.attrName = Pe, E.attrValue = w, E.keepAttr = !0, E.forceKeepAttr = void 0, Ee(ae.uponSanitizeAttribute, c, E), w = E.attrValue, Mn && (Pe === "id" || Pe === "name") && (W(ee, c), w = pi + w), Tt && de(/((--!?|])>)|<\/(style|title)/i, w)) {
        W(ee, c);
        continue;
      }
      if (E.forceKeepAttr)
        continue;
      if (!E.keepAttr) {
        W(ee, c);
        continue;
      }
      if (!On && de(/\/>/i, w)) {
        W(ee, c);
        continue;
      }
      tt && Fn([jt, Gt, je], (U) => {
        w = an(w, U, " ");
      });
      const R = d(c.nodeName);
      if (!Pn(R, Pe, w)) {
        W(ee, c);
        continue;
      }
      if (te && typeof $ == "object" && typeof $.getAttributeType == "function" && !ue)
        switch ($.getAttributeType(R, Pe)) {
          case "TrustedHTML": {
            w = te.createHTML(w);
            break;
          }
          case "TrustedScriptURL": {
            w = te.createScriptURL(w);
            break;
          }
        }
      if (w !== nn)
        try {
          ue ? c.setAttributeNS(ue, ee, w) : c.setAttribute(ee, w), bt(c) ? F(c) : gs(e.removed);
        } catch {
          W(ee, c);
        }
    }
    Ee(ae.afterSanitizeAttributes, c, null);
  }, It = function A(c) {
    let _ = null;
    const E = Lt(c);
    for (Ee(ae.beforeSanitizeShadowDOM, c, null); _ = E.nextNode(); )
      Ee(ae.uponSanitizeShadowNode, _, null), Nn(_), tn(_), _.content instanceof r && A(_.content);
    Ee(ae.afterSanitizeShadowDOM, c, null);
  };
  return e.sanitize = function(A) {
    let c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ = null, E = null, q = null, re = null;
    if (Qt = !A, Qt && (A = "<!-->"), typeof A != "string" && !Dn(A))
      if (typeof A.toString == "function") {
        if (A = A.toString(), typeof A != "string")
          throw ln("dirty is not a string, aborting");
      } else
        throw ln("toString is not a function");
    if (!e.isSupported)
      return A;
    if (qt || K(c), e.removed = [], typeof A == "string" && (ve = !1), ve) {
      if (A.nodeName) {
        const Me = d(A.nodeName);
        if (!ne[Me] || pt[Me])
          throw ln("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (A instanceof a)
      _ = ot("<!---->"), E = _.ownerDocument.importNode(A, !0), E.nodeType === un.element && E.nodeName === "BODY" || E.nodeName === "HTML" ? _ = E : _.appendChild(E);
    else {
      if (!nt && !tt && !Ge && // eslint-disable-next-line unicorn/prefer-includes
      A.indexOf("<") === -1)
        return te && Rt ? te.createHTML(A) : A;
      if (_ = ot(A), !_)
        return nt ? null : Rt ? Oe : "";
    }
    _ && Xt && F(_.firstChild);
    const ee = Lt(ve ? A : _);
    for (; q = ee.nextNode(); )
      Nn(q), tn(q), q.content instanceof r && It(q.content);
    if (ve)
      return A;
    if (nt) {
      if (At)
        for (re = Vt.call(_.ownerDocument); _.firstChild; )
          re.appendChild(_.firstChild);
      else
        re = _;
      return (se.shadowroot || se.shadowrootmode) && (re = En.call(i, re, !0)), re;
    }
    let ue = Ge ? _.outerHTML : _.innerHTML;
    return Ge && ne["!doctype"] && _.ownerDocument && _.ownerDocument.doctype && _.ownerDocument.doctype.name && de(nr, _.ownerDocument.doctype.name) && (ue = "<!DOCTYPE " + _.ownerDocument.doctype.name + `>
` + ue), tt && Fn([jt, Gt, je], (Me) => {
      ue = an(ue, Me, " ");
    }), te && Rt ? te.createHTML(ue) : ue;
  }, e.setConfig = function() {
    let A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    K(A), qt = !0;
  }, e.clearConfig = function() {
    x = null, qt = !1;
  }, e.isValidAttribute = function(A, c, _) {
    x || K({});
    const E = d(A), q = d(c);
    return Pn(E, q, _);
  }, e.addHook = function(A, c) {
    typeof c == "function" && on(ae[A], c);
  }, e.removeHook = function(A, c) {
    if (c !== void 0) {
      const _ = bo(ae[A], c);
      return _ === -1 ? void 0 : yo(ae[A], _, 1)[0];
    }
    return gs(ae[A]);
  }, e.removeHooks = function(A) {
    ae[A] = [];
  }, e.removeAllHooks = function() {
    ae = vs();
  }, e;
}
var ks = ir();
function Ut(n) {
  const e = performance.timeOrigin + n;
  return new Date(e).toISOString();
}
function Po(n, e) {
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
    t.innerHTML = ks.sanitize(s);
  }) : t.innerHTML = ks.sanitize(i), t;
}
function Bo(n, e, t) {
  if (t.region_type !== "ShapeRegion")
    throw new Error(`Region type ${t.region_type} not implemented in checkPointInRegion`);
  switch (t.shape) {
    case "rectangle":
      const i = t.x - t.w / 2, s = t.x + t.w / 2, r = t.y + t.h / 2, l = t.y - t.h / 2;
      return n >= i && n <= s && e >= l && e <= r;
    case "ellipse":
      const a = t.w / 2, h = t.h / 2, u = n - t.x, p = e - t.y;
      return u * u / (a * a) + p * p / (h * h) <= 1;
    default:
      throw new Error(`Unknown region type: ${t.region_type}`);
  }
}
class Uo {
  constructor(e, t, i, s, r) {
    this.tArmed = null;
    const l = (a) => {
      if (!this.tArmed)
        return;
      const { x: h, y: u } = r.getBoardLocationFromMouseEvent(a);
      if (!Bo(h, u, t))
        return;
      const O = {
        sensor_id: e,
        action_type: "ClickAction",
        click_x: h,
        click_y: u,
        timestamp_action: Ut(performance.now())
      };
      i(O);
    };
    s.addEventListener(
      "mousedown",
      l,
      {
        capture: !0
        // Capture phase to get the event before it might be stopped by children.
      }
    );
  }
  arm() {
    this.tArmed = performance.now();
  }
  destroy() {
    this.tArmed = null;
  }
}
class zo {
  constructor(e, t) {
    this.sensorId = e, this.onSensorFired = t;
  }
  arm() {
    const e = {
      sensor_id: this.sensorId,
      action_type: "TimeoutAction",
      timestamp_action: Ut(performance.now())
    };
    this.onSensorFired(e);
  }
  destroy() {
  }
}
class $o {
  constructor(e, t, i) {
    this.tArmed = null, this.onKeyPress = (s) => {
      if (!this.tArmed)
        return;
      s.preventDefault();
      let r = s.key;
      if (!this.keys.includes(r))
        return;
      const l = {
        sensor_id: this.sensorId,
        action_type: "KeyAction",
        key: r,
        timestamp_action: Ut(performance.now())
      };
      this.onSensorFired(l);
    }, this.sensorId = e, this.onSensorFired = t, this.keys = [i], document.addEventListener("keydown", this.onKeyPress);
  }
  arm() {
    this.tArmed = performance.now();
  }
  destroy() {
    this.tArmed = null, document.removeEventListener("keydown", this.onKeyPress);
  }
}
class oi {
  constructor(e, t) {
    this.card = e, this.boardCoords = t, this.root = document.createElement("div"), this.root.classList.add("card"), this.root.id = e.card_id;
    const { leftPx: i, topPx: s } = t.getBoardLocationPx(
      this.card.x,
      this.card.y,
      this.card.w,
      this.card.h
    ), { widthPx: r, heightPx: l } = t.getBoardRectanglePx(
      this.card.w,
      this.card.h
    );
    this.root.style.left = `${i}px`, this.root.style.top = `${s}px`, this.root.style.width = `${r}px`, this.root.style.height = `${l}px`, this.setVisibility(!1), this.setInteractivity(!1);
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
class Ho extends oi {
  async prepare(e) {
    this.imageContainer = document.createElement("div"), this.imageContainer.classList.add("image-card"), this.root.appendChild(this.imageContainer), this.image = await e.getImage(
      this.card.image
    ), this.image.classList.add("image-card__content"), this.image.draggable = !1, this.imageContainer.appendChild(this.image);
  }
}
class Fo extends oi {
  async prepare() {
    this.textContainer = document.createElement("div"), this.textContainer.classList.add("text-card"), this.root.appendChild(this.textContainer), this.textContainer.style.backgroundColor = this.card.background_color;
    const e = {
      text: this.card.text,
      textColor: this.card.text_color,
      fontSize: this.card.font_size,
      justificationHorizontal: this.card.justification_horizontal,
      justificationVertical: this.card.justification_vertical
    }, t = Po(
      e,
      (i) => this.boardCoords.getSizePx(i) + "px"
    );
    this.textContainer.appendChild(t);
  }
}
class Vo extends oi {
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
class jo extends oi {
  async prepare() {
    let e;
    if (this.card.shape == "rectangle")
      e = document.createElement("div"), e.style.position = "absolute", e.style.top = "0", e.style.left = "0", e.style.width = "100%", e.style.height = "100%";
    else if (this.card.shape == "ellipse")
      e = document.createElement("div"), e.style.position = "absolute", e.style.top = "0", e.style.left = "0", e.style.width = "100%", e.style.height = "100%", e.style.borderRadius = "50%";
    else
      throw new Error(`Unknown shape given: ${this.card.shape}`);
    e.style.backgroundColor = this.card.color, this.root.appendChild(e);
  }
}
class Go {
  constructor(e, t, i, s) {
    this.boardWidthPx = e, this.boardHeightPx = t, this.boardLeftPx = i, this.boardTopPx = s;
  }
  getUnitPx() {
    return Math.min(this.boardWidthPx, this.boardHeightPx);
  }
  getBoardLocationPx(e, t, i, s) {
    const r = this.getUnitPx(), l = this.boardWidthPx / r, a = this.boardHeightPx / r, h = r * (e - i / 2 + l / 2), u = r * (-t - s / 2 + a / 2);
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
    const t = (e.clientX - this.boardLeftPx) / this.boardWidthPx - 0.5, i = -((e.clientY - this.boardTopPx) / this.boardHeightPx - 0.5);
    return {
      x: t,
      y: i
    };
  }
}
class Wo {
  // Map of sensor ID to SensorBinding
  constructor(e, t) {
    this.cardViews = /* @__PURE__ */ new Map(), this.sensorBindings = /* @__PURE__ */ new Map(), this.root = document.createElement("div"), this.root.className = "board-view", this.root.id = `${e}`, this.root.style.width = t.board_width_px + "px", this.root.style.height = t.board_height_px + "px", this.root.style.backgroundColor = t.background_color, this.setBoardState(!1, !1);
  }
  getCoordinateSystem() {
    const { width: e, height: t, left: i, top: s } = this.root.getBoundingClientRect();
    return new Go(e, t, i, s);
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
        s = new Ho(
          e,
          i
        );
        break;
      case "VideoCard":
        s = new Vo(
          e,
          i
        );
        break;
      case "TextCard":
        s = new Fo(
          e,
          i
        );
        break;
      case "ShapeCard":
        s = new jo(
          e,
          i
        );
        break;
      default:
        throw new Error(`Unsupported Card type: ${e}`);
    }
    await s.prepare(t), this.root.appendChild(s.root), this.cardViews.set(e.card_id, s);
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
      i = new zo(
        e.sensor_id,
        t
      );
    else if (e.sensor_type === "KeySensor")
      i = new $o(
        e.sensor_id,
        t,
        e.key
      );
    else if (e.sensor_type == "ClickSensor")
      i = new Uo(
        e.sensor_id,
        e.region,
        t,
        this.root,
        this.getCoordinateSystem()
      );
    else
      throw new Error(`Unknown Sensor provided: ${e}`);
    this.sensorBindings.set(e.sensor_id, i);
  }
  startSensor(e) {
    this.getSensorBinding(e).arm();
  }
  destroySensor(e) {
    this.getSensorBinding(e).destroy(), this.sensorBindings.delete(e);
  }
}
class qo {
  constructor(e) {
    this.boardViews = /* @__PURE__ */ new Map(), this.activeBoardId = null, this.root = document.createElement("div"), this.root.className = "board-views-ui", this.assetManager = e;
  }
  createBoardView(e, t) {
    if (this.boardViews.has(e))
      return this.getBoardView(e);
    const i = new Wo(e, t);
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
class Xo {
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
        i.onload = () => s(i), i.onerror = (l) => r(l);
      }
    );
  }
  async getVideo(e) {
    let t = this.lookupAssetUrl(e), i = document.createElement("video");
    i.controls = !1;
    let s = new Promise((r, l) => {
      i.oncanplaythrough = () => {
        r(i);
      }, i.onerror = (a) => l(a);
    });
    return i.src = t.url, i.load(), s;
  }
}
function Yo() {
  const n = document.createElement("div");
  document.body.appendChild(n);
  const e = document.createElement("div");
  e.classList.add("node-engine-container"), n.appendChild(e);
  const t = document.createElement("div");
  t.classList.add("node-engine-content"), e.appendChild(t);
  const i = new Xo(), s = new qo(
    i
  );
  t.appendChild(s.root);
  const r = new Mr();
  return r.mount(t), {
    boardViewsUI: s,
    shellUI: r,
    assetManager: i
  };
}
class Es {
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
class Zo {
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
class Ss {
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
class Ko {
  constructor(e, t) {
    this.prepared = !1, this.started = !1, this.deferredAction = new Ss(), this.deferredOutcomeDone = new Ss(), this.boardView = t, this.node = e, this.scheduler = new Es(), this.outcomeSchedulers = {};
  }
  async prepare(e) {
    let t = [];
    for (const s of this.node.cards)
      t.push(
        this.boardView.prepareCard(
          s,
          e
        )
      ), this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: s.t_start,
          triggerFunc: () => {
            this.boardView.startCard(s.card_id);
          }
        }
      ), s.t_end !== null && this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: s.t_end,
          triggerFunc: () => {
            this.boardView.stopCard(s.card_id);
          }
        }
      ), this.scheduler.scheduleOnStop(
        () => {
          this.boardView.destroyCard(s.card_id);
        }
      );
    await Promise.all(t);
    for (const s of this.node.sensors)
      this.boardView.prepareSensor(
        s,
        (r) => this.deferredAction.resolve(r)
      ), this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: s.t_start,
          triggerFunc: () => {
            this.boardView.startSensor(s.sensor_id);
          }
        }
      ), this.scheduler.scheduleOnStop(
        () => {
          this.boardView.destroySensor(s.sensor_id);
        }
      );
    for (const s of this.node.effects) {
      const r = new Zo(this.boardView);
      this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: s.t_start,
          triggerFunc: () => {
            r.start();
          }
        }
      ), s.t_end !== null && this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: s.t_end,
          triggerFunc: () => {
            r.stop();
          }
        }
      ), this.scheduler.scheduleOnStop(
        () => {
          r.stop();
        }
      );
    }
    let i = [];
    for (const s of this.node.outcomes) {
      const r = new Es();
      let l = 0;
      for (const a of s.cards)
        if (i.push(
          this.boardView.prepareCard(
            a,
            e
          )
        ), r.scheduleEvent(
          {
            triggerTimeMsec: a.t_start,
            triggerFunc: () => {
              this.boardView.startCard(a.card_id);
            }
          }
        ), a.t_end !== null)
          r.scheduleEvent(
            {
              triggerTimeMsec: a.t_end,
              triggerFunc: () => {
                this.boardView.stopCard(a.card_id);
              }
            }
          ), a.t_end > l && (l = a.t_end);
        else
          throw new Error(`Consequence Cards must have an end time: ${a.card_id} `);
      r.scheduleEvent(
        {
          triggerTimeMsec: l,
          triggerFunc: () => {
            this.deferredOutcomeDone.resolve();
          }
        }
      ), this.outcomeSchedulers[s.sensor_id] = r;
    }
    await Promise.all(i), this.prepared = !0;
  }
  async run() {
    if (!this.prepared)
      throw new Error("NodePlay not prepared");
    if (this.started)
      throw new Error("NodePlay already started");
    this.started = !0;
    const e = performance.now();
    this.scheduler.start();
    const t = await this.deferredAction.promise;
    this.scheduler.stop();
    const i = t.sensor_id;
    if (i in this.outcomeSchedulers) {
      const s = this.outcomeSchedulers[i];
      s.start(), await this.deferredOutcomeDone.promise, s.stop();
    }
    return {
      action: t,
      timestamp_start: Ut(e),
      timestamp_end: Ut(performance.now())
    };
  }
}
class Qo {
  constructor() {
    this.bufferedNodePlays = /* @__PURE__ */ new Map();
    const { shellUI: e, boardViewsUI: t } = Yo();
    this.shellUI = e, this.boardViewsUI = t;
  }
  async prepare(e) {
    const t = crypto.randomUUID(), i = this.boardViewsUI.createBoardView(t, e.board), s = new Ko(
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
function Jo(n, e) {
  let t = 0, i = {};
  for (const r of e.nodes)
    i[r.node_id] = r.outcomes;
  n.sort((r, l) => r.timestamp_event.localeCompare(l.timestamp_event));
  let s = /* @__PURE__ */ new Set();
  for (let r = 0; r < n.length; r++) {
    const l = n[r];
    if (l.event_type !== "NodeResultEvent")
      continue;
    const a = l.event_payload, u = a.action.sensor_id;
    if (!s.has(a.node_id)) {
      s.add(a.node_id);
      for (const p of i[a.node_id] || [])
        if (p.sensor_id === u) {
          let O = parseFloat(p.bonus_amount_usd);
          !isNaN(O) && O > 0 && (t += O);
        }
    }
  }
  return t = Math.max(0, t), t = Math.round(t * 100) / 100, t;
}
function ea() {
  return {
    user_agent: navigator.userAgent,
    display_width_px: screen.width,
    display_height_px: screen.height,
    viewport_width_px: window.innerWidth,
    viewport_height_px: window.innerHeight
  };
}
var ta = "2.0.4", Hi = 500, Ts = "user-agent", zt = "", As = "?", ei = "function", ut = "undefined", $t = "object", Fi = "string", we = "browser", Ye = "cpu", Fe = "device", De = "engine", Ae = "os", Pt = "result", b = "name", f = "type", m = "vendor", y = "version", be = "architecture", xn = "major", g = "model", bn = "console", D = "mobile", G = "tablet", ie = "smarttv", $e = "wearable", jn = "xr", yn = "embedded", hn = "inapp", es = "brands", kt = "formFactors", ts = "fullVersionList", Bt = "platform", ns = "platformVersion", ai = "bitness", ht = "sec-ch-ua", na = ht + "-full-version-list", ia = ht + "-arch", sa = ht + "-" + ai, ra = ht + "-form-factors", oa = ht + "-" + D, aa = ht + "-" + g, sr = ht + "-" + Bt, la = sr + "-version", rr = [es, ts, D, g, Bt, ns, be, kt, ai], Gn = "Amazon", Dt = "Apple", Rs = "ASUS", Cs = "BlackBerry", _t = "Google", Os = "Huawei", Ei = "Lenovo", Ms = "Honor", Wn = "LG", Si = "Microsoft", Ti = "Motorola", Ai = "Nvidia", Ls = "OnePlus", Ri = "OPPO", dn = "Samsung", Is = "Sharp", pn = "Sony", Ci = "Xiaomi", Oi = "Zebra", Ds = "Chrome", Ns = "Chromium", lt = "Chromecast", Zn = "Edge", fn = "Firefox", gn = "Opera", Mi = "Facebook", Ps = "Sogou", Nt = "Mobile ", mn = " Browser", Vi = "Windows", ca = typeof window !== ut, ye = ca && window.navigator ? window.navigator : void 0, ct = ye && ye.userAgentData ? ye.userAgentData : void 0, ua = function(n, e) {
  var t = {}, i = e;
  if (!ti(e)) {
    i = {};
    for (var s in e)
      for (var r in e[s])
        i[r] = e[s][r].concat(i[r] ? i[r] : []);
  }
  for (var l in n)
    t[l] = i[l] && i[l].length % 2 === 0 ? i[l].concat(n[l]) : n[l];
  return t;
}, li = function(n) {
  for (var e = {}, t = 0; t < n.length; t++)
    e[n[t].toUpperCase()] = n[t];
  return e;
}, ji = function(n, e) {
  if (typeof n === $t && n.length > 0) {
    for (var t in n)
      if (Qe(e) == Qe(n[t])) return !0;
    return !1;
  }
  return Ft(n) ? Qe(e) == Qe(n) : !1;
}, ti = function(n, e) {
  for (var t in n)
    return /^(browser|cpu|device|engine|os)$/.test(t) || (e ? ti(n[t]) : !1);
}, Ft = function(n) {
  return typeof n === Fi;
}, Li = function(n) {
  if (n) {
    for (var e = [], t = Ht(/\\?\"/g, n).split(","), i = 0; i < t.length; i++)
      if (t[i].indexOf(";") > -1) {
        var s = ni(t[i]).split(";v=");
        e[i] = { brand: s[0], version: s[1] };
      } else
        e[i] = ni(t[i]);
    return e;
  }
}, Qe = function(n) {
  return Ft(n) ? n.toLowerCase() : n;
}, Ii = function(n) {
  return Ft(n) ? Ht(/[^\d\.]/g, n).split(".")[0] : void 0;
}, Je = function(n) {
  for (var e in n) {
    var t = n[e];
    typeof t == $t && t.length == 2 ? this[t[0]] = t[1] : this[t] = void 0;
  }
  return this;
}, Ht = function(n, e) {
  return Ft(e) ? e.replace(n, zt) : e;
}, wn = function(n) {
  return Ht(/\\?\"/g, n);
}, ni = function(n, e) {
  if (Ft(n))
    return n = Ht(/^\s\s*/, n), typeof e === ut ? n : n.substring(0, Hi);
}, Di = function(n, e) {
  if (!(!n || !e))
    for (var t = 0, i, s, r, l, a, h; t < e.length && !a; ) {
      var u = e[t], p = e[t + 1];
      for (i = s = 0; i < u.length && !a && u[i]; )
        if (a = u[i++].exec(n), a)
          for (r = 0; r < p.length; r++)
            h = a[++s], l = p[r], typeof l === $t && l.length > 0 ? l.length === 2 ? typeof l[1] == ei ? this[l[0]] = l[1].call(this, h) : this[l[0]] = l[1] : l.length >= 3 && (typeof l[1] === ei && !(l[1].exec && l[1].test) ? l.length > 3 ? this[l[0]] = h ? l[1].apply(this, l.slice(2)) : void 0 : this[l[0]] = h ? l[1].call(this, h, l[2]) : void 0 : l.length == 3 ? this[l[0]] = h ? h.replace(l[1], l[2]) : void 0 : l.length == 4 ? this[l[0]] = h ? l[3].call(this, h.replace(l[1], l[2])) : void 0 : l.length > 4 && (this[l[0]] = h ? l[3].apply(this, [h.replace(l[1], l[2])].concat(l.slice(4))) : void 0)) : this[l] = h || void 0;
      t += 2;
    }
}, He = function(n, e) {
  for (var t in e)
    if (typeof e[t] === $t && e[t].length > 0) {
      for (var i = 0; i < e[t].length; i++)
        if (ji(e[t][i], n))
          return t === As ? void 0 : t;
    } else if (ji(e[t], n))
      return t === As ? void 0 : t;
  return e.hasOwnProperty("*") ? e["*"] : n;
}, Bs = {
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
}, Us = {
  embedded: "Automotive",
  mobile: "Mobile",
  tablet: ["Tablet", "EInk"],
  smarttv: "TV",
  wearable: "Watch",
  xr: ["VR", "XR"],
  "?": ["Desktop", "Unknown"],
  "*": void 0
}, ha = {
  Chrome: "Google Chrome",
  Edge: "Microsoft Edge",
  "Edge WebView2": "Microsoft Edge WebView2",
  "Chrome WebView": "Android WebView",
  "Chrome Headless": "HeadlessChrome",
  "Huawei Browser": "HuaweiBrowser",
  "MIUI Browser": "Miui Browser",
  "Opera Mobi": "OperaMobile",
  Yandex: "YaBrowser"
}, zs = {
  browser: [
    [
      // Most common regardless engine
      /\b(?:crmo|crios)\/([\w\.]+)/i
      // Chrome for Android/iOS
    ],
    [y, [b, Nt + "Chrome"]],
    [
      /webview.+edge\/([\w\.]+)/i
      // Microsoft Edge
    ],
    [y, [b, Zn + " WebView"]],
    [
      /edg(?:e|ios|a)?\/([\w\.]+)/i
    ],
    [y, [b, "Edge"]],
    [
      // Presto based
      /(opera mini)\/([-\w\.]+)/i,
      // Opera Mini
      /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
      // Opera Mobi/Tablet
      /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i
      // Opera
    ],
    [b, y],
    [
      /opios[\/ ]+([\w\.]+)/i
      // Opera mini on iphone >= 8.0
    ],
    [y, [b, gn + " Mini"]],
    [
      /\bop(?:rg)?x\/([\w\.]+)/i
      // Opera GX
    ],
    [y, [b, gn + " GX"]],
    [
      /\bopr\/([\w\.]+)/i
      // Opera Webkit
    ],
    [y, [b, gn]],
    [
      // Mixed
      /\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i
      // Baidu
    ],
    [y, [b, "Baidu"]],
    [
      /\b(?:mxbrowser|mxios|myie2)\/?([-\w\.]*)\b/i
      // Maxthon
    ],
    [y, [b, "Maxthon"]],
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
    [b, y],
    [
      /quark(?:pc)?\/([-\w\.]+)/i
      // Quark
    ],
    [y, [b, "Quark"]],
    [
      /\bddg\/([\w\.]+)/i
      // DuckDuckGo
    ],
    [y, [b, "DuckDuckGo"]],
    [
      /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i
      // UCBrowser
    ],
    [y, [b, "UCBrowser"]],
    [
      /microm.+\bqbcore\/([\w\.]+)/i,
      // WeChat Desktop for Windows Built-in Browser
      /\bqbcore\/([\w\.]+).+microm/i,
      /micromessenger\/([\w\.]+)/i
      // WeChat
    ],
    [y, [b, "WeChat"]],
    [
      /konqueror\/([\w\.]+)/i
      // Konqueror
    ],
    [y, [b, "Konqueror"]],
    [
      /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i
      // IE11
    ],
    [y, [b, "IE"]],
    [
      /ya(?:search)?browser\/([\w\.]+)/i
      // Yandex
    ],
    [y, [b, "Yandex"]],
    [
      /slbrowser\/([\w\.]+)/i
      // Smart Lenovo Browser
    ],
    [y, [b, "Smart " + Ei + mn]],
    [
      /(avast|avg)\/([\w\.]+)/i
      // Avast/AVG Secure Browser
    ],
    [[b, /(.+)/, "$1 Secure" + mn], y],
    [
      /\bfocus\/([\w\.]+)/i
      // Firefox Focus
    ],
    [y, [b, fn + " Focus"]],
    [
      /\bopt\/([\w\.]+)/i
      // Opera Touch
    ],
    [y, [b, gn + " Touch"]],
    [
      /coc_coc\w+\/([\w\.]+)/i
      // Coc Coc Browser
    ],
    [y, [b, "Coc Coc"]],
    [
      /dolfin\/([\w\.]+)/i
      // Dolphin
    ],
    [y, [b, "Dolphin"]],
    [
      /coast\/([\w\.]+)/i
      // Opera Coast
    ],
    [y, [b, gn + " Coast"]],
    [
      /miuibrowser\/([\w\.]+)/i
      // MIUI Browser
    ],
    [y, [b, "MIUI" + mn]],
    [
      /fxios\/([\w\.-]+)/i
      // Firefox for iOS
    ],
    [y, [b, Nt + fn]],
    [
      /\bqihoobrowser\/?([\w\.]*)/i
      // 360
    ],
    [y, [b, "360"]],
    [
      /\b(qq)\/([\w\.]+)/i
      // QQ
    ],
    [[b, /(.+)/, "$1Browser"], y],
    [
      /(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i
    ],
    [[b, /(.+)/, "$1" + mn], y],
    [
      // Oculus/Sailfish/HuaweiBrowser/VivoBrowser/PicoBrowser
      /samsungbrowser\/([\w\.]+)/i
      // Samsung Internet
    ],
    [y, [b, dn + " Internet"]],
    [
      /metasr[\/ ]?([\d\.]+)/i
      // Sogou Explorer
    ],
    [y, [b, Ps + " Explorer"]],
    [
      /(sogou)mo\w+\/([\d\.]+)/i
      // Sogou Mobile
    ],
    [[b, Ps + " Mobile"], y],
    [
      /(electron)\/([\w\.]+) safari/i,
      // Electron-based App
      /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
      // Tesla
      /m?(qqbrowser|2345(?=browser|chrome|explorer))\w*[\/ ]?v?([\w\.]+)/i
      // QQ/2345
    ],
    [b, y],
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
    [y, b],
    [
      // WebView
      /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i
      // Facebook App for iOS & Android
    ],
    [[b, Mi], y, [f, hn]],
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
    [b, y, [f, hn]],
    [
      /\bgsa\/([\w\.]+) .*safari\//i
      // Google Search Appliance on iOS
    ],
    [y, [b, "GSA"], [f, hn]],
    [
      /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i
      // TikTok
    ],
    [y, [b, "TikTok"], [f, hn]],
    [
      /\[(linkedin)app\]/i
      // LinkedIn App for iOS & Android
    ],
    [b, [f, hn]],
    [
      /(chromium)[\/ ]([-\w\.]+)/i
      // Chromium
    ],
    [b, y],
    [
      /headlesschrome(?:\/([\w\.]+)| )/i
      // Chrome Headless
    ],
    [y, [b, Ds + " Headless"]],
    [
      /wv\).+chrome\/([\w\.]+).+edgw\//i
      // Edge WebView2
    ],
    [y, [b, Zn + " WebView2"]],
    [
      / wv\).+(chrome)\/([\w\.]+)/i
      // Chrome WebView
    ],
    [[b, Ds + " WebView"], y],
    [
      /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
      // Android Browser
    ],
    [y, [b, "Android" + mn]],
    [
      /chrome\/([\w\.]+) mobile/i
      // Chrome Mobile
    ],
    [y, [b, Nt + "Chrome"]],
    [
      /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
      // Chrome/OmniWeb/Arora/Tizen/Nokia
    ],
    [b, y],
    [
      /version\/([\w\.\,]+) .*mobile(?:\/\w+ | ?)safari/i
      // Safari Mobile
    ],
    [y, [b, Nt + "Safari"]],
    [
      /iphone .*mobile(?:\/\w+ | ?)safari/i
    ],
    [[b, Nt + "Safari"]],
    [
      /version\/([\w\.\,]+) .*(safari)/i
      // Safari
    ],
    [y, b],
    [
      /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i
      // Safari < 3.0
    ],
    [b, [y, "1"]],
    [
      /(webkit|khtml)\/([\w\.]+)/i
    ],
    [b, y],
    [
      // Gecko based
      /(?:mobile|tablet);.*(firefox)\/([\w\.-]+)/i
      // Firefox Mobile
    ],
    [[b, Nt + fn], y],
    [
      /(navigator|netscape\d?)\/([-\w\.]+)/i
      // Netscape
    ],
    [[b, "Netscape"], y],
    [
      /(wolvic|librewolf)\/([\w\.]+)/i
      // Wolvic/LibreWolf
    ],
    [b, y],
    [
      /mobile vr; rv:([\w\.]+)\).+firefox/i
      // Firefox Reality
    ],
    [y, [b, fn + " Reality"]],
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
    [b, [y, /_/g, "."]],
    [
      /(cobalt)\/([\w\.]+)/i
      // Cobalt
    ],
    [b, [y, /[^\d\.]+./, zt]]
  ],
  cpu: [
    [
      /\b((amd|x|x86[-_]?|wow|win)64)\b/i
      // AMD64 (x64)
    ],
    [[be, "amd64"]],
    [
      /(ia32(?=;))/i,
      // IA32 (quicktime)
      /\b((i[346]|x)86)(pc)?\b/i
      // IA32 (x86)
    ],
    [[be, "ia32"]],
    [
      /\b(aarch64|arm(v?[89]e?l?|_?64))\b/i
      // ARM64
    ],
    [[be, "arm64"]],
    [
      /\b(arm(v[67])?ht?n?[fl]p?)\b/i
      // ARMHF
    ],
    [[be, "armhf"]],
    [
      // PocketPC mistakenly identified as PowerPC
      /( (ce|mobile); ppc;|\/[\w\.]+arm\b)/i
    ],
    [[be, "arm"]],
    [
      /((ppc|powerpc)(64)?)( mac|;|\))/i
      // PowerPC
    ],
    [[be, /ower/, zt, Qe]],
    [
      / sun4\w[;\)]/i
      // SPARC
    ],
    [[be, "sparc"]],
    [
      /\b(avr32|ia64(?=;)|68k(?=\))|\barm(?=v([1-7]|[5-7]1)l?|;|eabi)|(irix|mips|sparc)(64)?\b|pa-risc)/i
      // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
    ],
    [[be, Qe]]
  ],
  device: [
    [
      //////////////////////////
      // MOBILES & TABLETS
      /////////////////////////
      // Samsung
      /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
    ],
    [g, [m, dn], [f, G]],
    [
      /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
      /samsung[- ]((?!sm-[lr]|browser)[-\w]+)/i,
      /sec-(sgh\w+)/i
    ],
    [g, [m, dn], [f, D]],
    [
      // Apple
      /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i
      // iPod/iPhone
    ],
    [g, [m, Dt], [f, D]],
    [
      /\((ipad);[-\w\),; ]+apple/i,
      // iPad
      /applecoremedia\/[\w\.]+ \((ipad)/i,
      /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
    ],
    [g, [m, Dt], [f, G]],
    [
      /(macintosh);/i
    ],
    [g, [m, Dt]],
    [
      // Sharp
      /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
    ],
    [g, [m, Is], [f, D]],
    [
      // Honor
      /\b((?:brt|eln|hey2?|gdi|jdn)-a?[lnw]09|(?:ag[rm]3?|jdn2|kob2)-a?[lw]0[09]hn)(?: bui|\)|;)/i
    ],
    [g, [m, Ms], [f, G]],
    [
      /honor([-\w ]+)[;\)]/i
    ],
    [g, [m, Ms], [f, D]],
    [
      // Huawei
      /\b((?:ag[rs][2356]?k?|bah[234]?|bg[2o]|bt[kv]|cmr|cpn|db[ry]2?|jdn2|got|kob2?k?|mon|pce|scm|sht?|[tw]gr|vrd)-[ad]?[lw][0125][09]b?|605hw|bg2-u03|(?:gem|fdr|m2|ple|t1)-[7a]0[1-4][lu]|t1-a2[13][lw]|mediapad[\w\. ]*(?= bui|\)))\b(?!.+d\/s)/i
    ],
    [g, [m, Os], [f, G]],
    [
      /(?:huawei)([-\w ]+)[;\)]/i,
      /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
    ],
    [g, [m, Os], [f, D]],
    [
      // Xiaomi
      /oid[^\)]+; (2[\dbc]{4}(182|283|rp\w{2})[cgl]|m2105k81a?c)(?: bui|\))/i,
      /\b((?:red)?mi[-_ ]?pad[\w- ]*)(?: bui|\))/i
      // Mi Pad tablets
    ],
    [[g, /_/g, " "], [m, Ci], [f, G]],
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
    [[g, /_/g, " "], [m, Ci], [f, D]],
    [
      // OnePlus
      /droid.+; (cph2[3-6]\d[13579]|((gm|hd)19|(ac|be|in|kb)20|(d[en]|eb|le|mt)21|ne22)[0-2]\d|p[g-k]\w[1m]10)\b/i,
      /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
    ],
    [g, [m, Ls], [f, D]],
    [
      // OPPO
      /; (\w+) bui.+ oppo/i,
      /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
    ],
    [g, [m, Ri], [f, D]],
    [
      /\b(opd2(\d{3}a?))(?: bui|\))/i
    ],
    [g, [m, He, { OnePlus: ["203", "304", "403", "404", "413", "415"], "*": Ri }], [f, G]],
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
    [g, [m, Ei], [f, G]],
    [
      /lenovo[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i
    ],
    [g, [m, Ei], [f, D]],
    [
      // Motorola
      /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
      /\bmot(?:orola)?[- ]([\w\s]+)(\)| bui)/i,
      /((?:moto(?! 360)[-\w\(\) ]+|xt\d{3,4}[cgkosw\+]?[-\d]*|nexus 6)(?= bui|\)))/i
    ],
    [g, [m, Ti], [f, D]],
    [
      /\b(mz60\d|xoom[2 ]{0,2}) build\//i
    ],
    [g, [m, Ti], [f, G]],
    [
      // LG
      /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
    ],
    [g, [m, Wn], [f, G]],
    [
      /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
      /\blg[-e;\/ ]+(?!.*(?:browser|netcast|android tv|watch|webos))(\w+)/i,
      /\blg-?([\d\w]+) bui/i
    ],
    [g, [m, Wn], [f, D]],
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
    [g, [m, _t], [f, G]],
    [
      // Google Pixel
      /droid.+;(?: google)? (g(01[13]a|020[aem]|025[jn]|1b60|1f8f|2ybb|4s1m|576d|5nz6|8hhn|8vou|a02099|c15s|d1yq|e2ae|ec77|gh2x|kv4x|p4bc|pj41|r83y|tt9q|ur25|wvk6)|pixel[\d ]*a?( pro)?( xl)?( fold)?( \(5g\))?)( bui|\))/i
    ],
    [g, [m, _t], [f, D]],
    [
      /(google) (pixelbook( go)?)/i
    ],
    [m, g],
    [
      // Sony
      /droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-\w\w\d\d)(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
    ],
    [g, [m, pn], [f, D]],
    [
      /sony tablet [ps]/i,
      /\b(?:sony)?sgp\w+(?: bui|\))/i
    ],
    [[g, "Xperia Tablet"], [m, pn], [f, G]],
    [
      // Amazon
      /(alexa)webm/i,
      /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,
      // Kindle Fire without Silk / Echo Show
      /(kf[a-z]+)( bui|\)).+silk\//i
      // Kindle Fire HD
    ],
    [g, [m, Gn], [f, G]],
    [
      /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
      // Fire Phone
    ],
    [[g, /(.+)/g, "Fire Phone $1"], [m, Gn], [f, D]],
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
    [g, [m, Cs], [f, D]],
    [
      // Asus
      /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
    ],
    [g, [m, Rs], [f, G]],
    [
      / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
    ],
    [g, [m, Rs], [f, D]],
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
    [[m, Qe], g, [f, He, { tablet: ["p10001l", "w7001"], "*": "mobile" }]],
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
    [g, [m, Si], [f, G]],
    [
      /droid [\d\.]+; (fp\du?)(?: b|\))/i
      // Fairphone
    ],
    [g, [m, "Fairphone"], [f, D]],
    [
      /((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i
      // Nvidia Tablets
    ],
    [g, [m, Ai], [f, G]],
    [
      /(sprint) (\w+)/i
      // Sprint Phones
    ],
    [m, g, [f, D]],
    [
      /(kin\.[onetw]{3})/i
      // Microsoft Kin
    ],
    [[g, /\./g, " "], [m, Si], [f, D]],
    [
      /droid.+; ([c6]+|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
      // Zebra
    ],
    [g, [m, Oi], [f, G]],
    [
      /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
    ],
    [g, [m, Oi], [f, D]],
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
    [[g, /^/, "SmartTV"], [m, dn], [f, ie]],
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
    [[m, Wn], [f, ie]],
    [
      /(apple) ?tv/i
      // Apple TV
    ],
    [m, [g, Dt + " TV"], [f, ie]],
    [
      /crkey.*devicetype\/chromecast/i
      // Google Chromecast Third Generation
    ],
    [[g, lt + " Third Generation"], [m, _t], [f, ie]],
    [
      /crkey.*devicetype\/([^/]*)/i
      // Google Chromecast with specific device type
    ],
    [[g, /^/, "Chromecast "], [m, _t], [f, ie]],
    [
      /fuchsia.*crkey/i
      // Google Chromecast Nest Hub
    ],
    [[g, lt + " Nest Hub"], [m, _t], [f, ie]],
    [
      /crkey/i
      // Google Chromecast, Linux-based or unknown
    ],
    [[g, lt], [m, _t], [f, ie]],
    [
      /(portaltv)/i
      // Facebook Portal TV
    ],
    [g, [m, Mi], [f, ie]],
    [
      /droid.+aft(\w+)( bui|\))/i
      // Fire TV
    ],
    [g, [m, Gn], [f, ie]],
    [
      /(shield \w+ tv)/i
      // Nvidia Shield TV
    ],
    [g, [m, Ai], [f, ie]],
    [
      /\(dtv[\);].+(aquos)/i,
      /(aquos-tv[\w ]+)\)/i
      // Sharp
    ],
    [g, [m, Is], [f, ie]],
    [
      /(bravia[\w ]+)( bui|\))/i
      // Sony
    ],
    [g, [m, pn], [f, ie]],
    [
      /(mi(tv|box)-?\w+) bui/i
      // Xiaomi
    ],
    [g, [m, Ci], [f, ie]],
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
    [[m, /.+\/(\w+)/, "$1", He, { LG: "lge" }], [g, ni], [f, ie]],
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
    [g, [m, pn], [f, bn]],
    [
      /\b(xbox(?: one)?(?!; xbox))[\); ]/i
      // Microsoft Xbox
    ],
    [g, [m, Si], [f, bn]],
    [
      /(ouya)/i,
      // Ouya
      /(nintendo) (\w+)/i,
      // Nintendo
      /(retroid) (pocket ([^\)]+))/i
      // Retroid Pocket
    ],
    [m, g, [f, bn]],
    [
      /droid.+; (shield)( bui|\))/i
      // Nvidia Portable
    ],
    [g, [m, Ai], [f, bn]],
    [
      ///////////////////
      // WEARABLES
      ///////////////////
      /\b(sm-[lr]\d\d[0156][fnuw]?s?|gear live)\b/i
      // Samsung Galaxy Watch
    ],
    [g, [m, dn], [f, $e]],
    [
      /((pebble))app/i,
      // Pebble
      /(asus|google|lg|oppo) ((pixel |zen)?watch[\w ]*)( bui|\))/i
      // Asus ZenWatch / LG Watch / Pixel Watch
    ],
    [m, g, [f, $e]],
    [
      /(ow(?:19|20)?we?[1-3]{1,3})/i
      // Oppo Watch
    ],
    [g, [m, Ri], [f, $e]],
    [
      /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i
      // Apple Watch
    ],
    [g, [m, Dt], [f, $e]],
    [
      /(opwwe\d{3})/i
      // OnePlus Watch
    ],
    [g, [m, Ls], [f, $e]],
    [
      /(moto 360)/i
      // Motorola 360
    ],
    [g, [m, Ti], [f, $e]],
    [
      /(smartwatch 3)/i
      // Sony SmartWatch
    ],
    [g, [m, pn], [f, $e]],
    [
      /(g watch r)/i
      // LG G Watch R
    ],
    [g, [m, Wn], [f, $e]],
    [
      /droid.+; (wt63?0{2,3})\)/i
    ],
    [g, [m, Oi], [f, $e]],
    [
      ///////////////////
      // XR
      ///////////////////
      /droid.+; (glass) \d/i
      // Google Glass
    ],
    [g, [m, _t], [f, jn]],
    [
      /(pico) (4|neo3(?: link|pro)?)/i
      // Pico
    ],
    [m, g, [f, jn]],
    [
      /(quest( \d| pro)?s?).+vr/i
      // Meta Quest
    ],
    [g, [m, Mi], [f, jn]],
    [
      /mobile vr; rv.+firefox/i
      // Unidentifiable VR device using Firefox Reality / Wolvic
    ],
    [[f, jn]],
    [
      ///////////////////
      // EMBEDDED
      ///////////////////
      /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i
      // Tesla
    ],
    [m, [f, yn]],
    [
      /(aeobc)\b/i
      // Echo Dot
    ],
    [g, [m, Gn], [f, yn]],
    [
      /(homepod).+mac os/i
      // Apple HomePod
    ],
    [g, [m, Dt], [f, yn]],
    [
      /windows iot/i
      // Unidentifiable embedded device using Windows IoT
    ],
    [[f, yn]],
    [
      ////////////////////
      // MIXED (GENERIC)
      ///////////////////
      /droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+?(mobile|vr|\d) safari/i
    ],
    [g, [f, He, { mobile: "Mobile", xr: "VR", "*": G }]],
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
    [y, [b, Zn + "HTML"]],
    [
      /(arkweb)\/([\w\.]+)/i
      // ArkWeb
    ],
    [b, y],
    [
      /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i
      // Blink
    ],
    [y, [b, "Blink"]],
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
    [b, y],
    [
      /ladybird\//i
    ],
    [[b, "LibWeb"]],
    [
      /rv\:([\w\.]{1,9})\b.+(gecko)/i
      // Gecko
    ],
    [y, b]
  ],
  os: [
    [
      // Windows
      /(windows nt) (6\.[23]); arm/i
      // Windows RT
    ],
    [[b, /N/, "R"], [y, He, Bs]],
    [
      /(windows (?:phone|mobile|iot))(?: os)?[\/ ]?([\d\.]*( se)?)/i,
      // Windows IoT/Mobile/Phone
      // Windows NT/3.1/95/98/ME/2000/XP/Vista/7/8/8.1/10/11
      /(windows)[\/ ](1[01]|2000|3\.1|7|8(\.1)?|9[58]|me|server 20\d\d( r2)?|vista|xp)/i
    ],
    [b, y],
    [
      /windows nt ?([\d\.\)]*)(?!.+xbox)/i,
      /\bwin(?=3| ?9|n)(?:nt| 9x )?([\d\.;]*)/i
    ],
    [[y, /(;|\))/g, "", He, Bs], [b, Vi]],
    [
      /(windows ce)\/?([\d\.]*)/i
      // Windows CE
    ],
    [b, y],
    [
      // iOS/macOS
      /[adehimnop]{4,7}\b(?:.*os ([\w]+) like mac|; opera)/i,
      // iOS
      /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
      /cfnetwork\/.+darwin/i
    ],
    [[y, /_/g, "."], [b, "iOS"]],
    [
      /(mac os x) ?([\w\. ]*)/i,
      /(macintosh|mac_powerpc\b)(?!.+(haiku|morphos))/i
      // Mac OS
    ],
    [[b, "macOS"], [y, /_/g, "."]],
    [
      // Google Chromecast
      /android ([\d\.]+).*crkey/i
      // Google Chromecast, Android-based
    ],
    [y, [b, lt + " Android"]],
    [
      /fuchsia.*crkey\/([\d\.]+)/i
      // Google Chromecast, Fuchsia-based
    ],
    [y, [b, lt + " Fuchsia"]],
    [
      /crkey\/([\d\.]+).*devicetype\/smartspeaker/i
      // Google Chromecast, Linux-based Smart Speaker
    ],
    [y, [b, lt + " SmartSpeaker"]],
    [
      /linux.*crkey\/([\d\.]+)/i
      // Google Chromecast, Legacy Linux-based
    ],
    [y, [b, lt + " Linux"]],
    [
      /crkey\/([\d\.]+)/i
      // Google Chromecast, unknown
    ],
    [y, [b, lt]],
    [
      // Mobile OSes
      /droid ([\w\.]+)\b.+(android[- ]x86)/i
      // Android-x86
    ],
    [y, b],
    [
      /(ubuntu) ([\w\.]+) like android/i
      // Ubuntu Touch
    ],
    [[b, /(.+)/, "$1 Touch"], y],
    [
      /(harmonyos)[\/ ]?([\d\.]*)/i,
      // HarmonyOS
      // Android/Blackberry/WebOS/QNX/Bada/RIM/KaiOS/Maemo/MeeGo/S40/Sailfish OS/OpenHarmony/Tizen
      /(android|bada|blackberry|kaios|maemo|meego|openharmony|qnx|rim tablet os|sailfish|series40|symbian|tizen)\w*[-\/\.; ]?([\d\.]*)/i
    ],
    [b, y],
    [
      /\(bb(10);/i
      // BlackBerry 10
    ],
    [y, [b, Cs]],
    [
      /(?:symbian ?os|symbos|s60(?=;)|series ?60)[-\/ ]?([\w\.]*)/i
      // Symbian
    ],
    [y, [b, "Symbian"]],
    [
      /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
      // Firefox OS
    ],
    [y, [b, fn + " OS"]],
    [
      /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i,
      // WebOS
      /webos(?:[ \/]?|\.tv-20(?=2[2-9]))(\d[\d\.]*)/i
    ],
    [y, [b, "webOS"]],
    [
      /web0s;.+?(?:chr[o0]me|safari)\/(\d+)/i
      // https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine
    ],
    [[y, He, { 25: "120", 24: "108", 23: "94", 22: "87", 6: "79", 5: "68", 4: "53", 3: "38", 2: "538", 1: "537", "*": "TV" }], [b, "webOS"]],
    [
      /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i
      // watchOS
    ],
    [y, [b, "watchOS"]],
    [
      // Google ChromeOS
      /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i
      // Chromium OS
    ],
    [[b, "Chrome OS"], y],
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
    [b, y],
    [
      /(sunos) ?([\d\.]*)/i
      // Solaris
    ],
    [[b, "Solaris"], y],
    [
      /\b(beos|os\/2|amigaos|openvms|hp-ux|serenityos)/i,
      // BeOS/OS2/AmigaOS/OpenVMS/HP-UX/SerenityOS
      /(unix) ?([\w\.]*)/i
      // UNIX
    ],
    [b, y]
  ]
}, qn = (function() {
  var n = { init: {}, isIgnore: {}, isIgnoreRgx: {}, toString: {} };
  return Je.call(n.init, [
    [we, [b, y, xn, f]],
    [Ye, [be]],
    [Fe, [f, g, m]],
    [De, [b, y]],
    [Ae, [b, y]]
  ]), Je.call(n.isIgnore, [
    [we, [y, xn]],
    [De, [y]],
    [Ae, [y]]
  ]), Je.call(n.isIgnoreRgx, [
    [we, / ?browser$/i],
    [Ae, / ?os$/i]
  ]), Je.call(n.toString, [
    [we, [b, y]],
    [Ye, [be]],
    [Fe, [m, g]],
    [De, [b, y]],
    [Ae, [b, y]]
  ]), n;
})(), da = function(n, e) {
  var t = qn.init[e], i = qn.isIgnore[e] || 0, s = qn.isIgnoreRgx[e] || 0, r = qn.toString[e] || 0;
  function l() {
    Je.call(this, t);
  }
  return l.prototype.getItem = function() {
    return n;
  }, l.prototype.withClientHints = function() {
    return ct ? ct.getHighEntropyValues(rr).then(function(a) {
      return n.setCH(new or(a, !1)).parseCH().get();
    }) : n.parseCH().get();
  }, l.prototype.withFeatureCheck = function() {
    return n.detectFeature().get();
  }, e != Pt && (l.prototype.is = function(a) {
    var h = !1;
    for (var u in this)
      if (this.hasOwnProperty(u) && !ji(i, u) && Qe(s ? Ht(s, this[u]) : this[u]) == Qe(s ? Ht(s, a) : a)) {
        if (h = !0, a != ut) break;
      } else if (a == ut && h) {
        h = !h;
        break;
      }
    return h;
  }, l.prototype.toString = function() {
    var a = zt;
    for (var h in r)
      typeof this[r[h]] !== ut && (a += (a ? " " : zt) + this[r[h]]);
    return a || ut;
  }), ct || (l.prototype.then = function(a) {
    var h = this, u = function() {
      for (var O in h)
        h.hasOwnProperty(O) && (this[O] = h[O]);
    };
    u.prototype = {
      is: l.prototype.is,
      toString: l.prototype.toString
    };
    var p = new u();
    return a(p), p;
  }), new l();
};
function or(n, e) {
  if (n = n || {}, Je.call(this, rr), e)
    Je.call(this, [
      [es, Li(n[ht])],
      [ts, Li(n[na])],
      [D, /\?1/.test(n[oa])],
      [g, wn(n[aa])],
      [Bt, wn(n[sr])],
      [ns, wn(n[la])],
      [be, wn(n[ia])],
      [kt, Li(n[ra])],
      [ai, wn(n[sa])]
    ]);
  else
    for (var t in n)
      this.hasOwnProperty(t) && typeof n[t] !== ut && (this[t] = n[t]);
}
function $s(n, e, t, i) {
  return this.get = function(s) {
    return s ? this.data.hasOwnProperty(s) ? this.data[s] : void 0 : this.data;
  }, this.set = function(s, r) {
    return this.data[s] = r, this;
  }, this.setCH = function(s) {
    return this.uaCH = s, this;
  }, this.detectFeature = function() {
    if (ye && ye.userAgent == this.ua)
      switch (this.itemType) {
        case we:
          ye.brave && typeof ye.brave.isBrave == ei && this.set(b, "Brave");
          break;
        case Fe:
          !this.get(f) && ct && ct[D] && this.set(f, D), this.get(g) == "Macintosh" && ye && typeof ye.standalone !== ut && ye.maxTouchPoints && ye.maxTouchPoints > 2 && this.set(g, "iPad").set(f, G);
          break;
        case Ae:
          !this.get(b) && ct && ct[Bt] && this.set(b, ct[Bt]);
          break;
        case Pt:
          var s = this.data, r = function(l) {
            return s[l].getItem().detectFeature().get();
          };
          this.set(we, r(we)).set(Ye, r(Ye)).set(Fe, r(Fe)).set(De, r(De)).set(Ae, r(Ae));
      }
    return this;
  }, this.parseUA = function() {
    return this.itemType != Pt && Di.call(this.data, this.ua, this.rgxMap), this.itemType == we && this.set(xn, Ii(this.get(y))), this;
  }, this.parseCH = function() {
    var s = this.uaCH, r = this.rgxMap;
    switch (this.itemType) {
      case we:
      case De:
        var l = s[ts] || s[es], a;
        if (l)
          for (var h in l) {
            var u = l[h].brand || l[h], p = l[h].version;
            this.itemType == we && !/not.a.brand/i.test(u) && (!a || /Chrom/.test(a) && u != Ns || a == Zn && /WebView2/.test(u)) && (u = He(u, ha), a = this.get(b), a && !/Chrom/.test(a) && /Chrom/.test(u) || this.set(b, u).set(y, p).set(xn, Ii(p)), a = u), this.itemType == De && u == Ns && this.set(y, p);
          }
        break;
      case Ye:
        var O = s[be];
        O && (O && s[ai] == "64" && (O += "64"), Di.call(this.data, O + ";", r));
        break;
      case Fe:
        if (s[D] && this.set(f, D), s[g] && (this.set(g, s[g]), !this.get(f) || !this.get(m))) {
          var v = {};
          Di.call(v, "droid 9; " + s[g] + ")", r), !this.get(f) && v.type && this.set(f, v.type), !this.get(m) && v.vendor && this.set(m, v.vendor);
        }
        if (s[kt]) {
          var $;
          if (typeof s[kt] != "string")
            for (var N = 0; !$ && N < s[kt].length; )
              $ = He(s[kt][N++], Us);
          else
            $ = He(s[kt], Us);
          this.set(f, $);
        }
        break;
      case Ae:
        var M = s[Bt];
        if (M) {
          var _e = s[ns];
          M == Vi && (_e = parseInt(Ii(_e), 10) >= 13 ? "11" : "10"), this.set(b, M).set(y, _e);
        }
        this.get(b) == Vi && s[g] == "Xbox" && this.set(b, "Xbox").set(y, void 0);
        break;
      case Pt:
        var xe = this.data, le = function(me) {
          return xe[me].getItem().setCH(s).parseCH().get();
        };
        this.set(we, le(we)).set(Ye, le(Ye)).set(Fe, le(Fe)).set(De, le(De)).set(Ae, le(Ae));
    }
    return this;
  }, Je.call(this, [
    ["itemType", n],
    ["ua", e],
    ["uaCH", i],
    ["rgxMap", t],
    ["data", da(this, n)]
  ]), this;
}
function et(n, e, t) {
  if (typeof n === $t ? (ti(n, !0) ? (typeof e === $t && (t = e), e = n) : (t = n, e = void 0), n = void 0) : typeof n === Fi && !ti(e, !0) && (t = e, e = void 0), t && typeof t.append === ei) {
    var i = {};
    t.forEach(function(h, u) {
      i[u] = h;
    }), t = i;
  }
  if (!(this instanceof et))
    return new et(n, e, t).getResult();
  var s = typeof n === Fi ? n : (
    // Passed user-agent string
    t && t[Ts] ? t[Ts] : (
      // User-Agent from passed headers
      ye && ye.userAgent ? ye.userAgent : (
        // navigator.userAgent
        zt
      )
    )
  ), r = new or(t, !0), l = e ? ua(zs, e) : zs, a = function(h) {
    return h == Pt ? function() {
      return new $s(h, s, l, r).set("ua", s).set(we, this.getBrowser()).set(Ye, this.getCPU()).set(Fe, this.getDevice()).set(De, this.getEngine()).set(Ae, this.getOS()).get();
    } : function() {
      return new $s(h, s, l[h], r).parseUA().get();
    };
  };
  return Je.call(this, [
    ["getBrowser", a(we)],
    ["getCPU", a(Ye)],
    ["getDevice", a(Fe)],
    ["getEngine", a(De)],
    ["getOS", a(Ae)],
    ["getResult", a(Pt)],
    ["getUA", function() {
      return s;
    }],
    ["setUA", function(h) {
      return Ft(h) && (s = h.length > Hi ? ni(h, Hi) : h), this;
    }]
  ]).setUA(s), this;
}
et.VERSION = ta;
et.BROWSER = li([b, y, xn, f]);
et.CPU = li([be]);
et.DEVICE = li([g, m, f, bn, D, ie, G, $e, yn]);
et.ENGINE = et.OS = li([b, y]);
class pa {
  static isValidDevice() {
    return !new et().getDevice().type;
  }
}
function xt() {
  return crypto.randomUUID();
}
function vt() {
  return Ut(performance.now());
}
async function ga(n, e, t = null, i = []) {
  t || (t = (M) => {
  });
  let s = i;
  const r = n.nodekit_version;
  let l = new Qo();
  if (!pa.isValidDevice()) {
    const M = new Error("Unsupported device. Please use a desktop browser.");
    throw l.showErrorMessageOverlay(M), M;
  }
  l.showConnectingOverlay();
  for (const M of e)
    l.boardViewsUI.assetManager.registerAsset(M);
  l.hideConnectingOverlay(), await l.playStartScreen();
  const a = {
    event_id: xt(),
    timestamp_event: vt(),
    event_type: "StartEvent",
    event_payload: {},
    nodekit_version: r
  };
  s.push(a), t(a);
  function h() {
    if (document.visibilityState === "hidden") {
      const M = {
        event_id: xt(),
        timestamp_event: vt(),
        event_type: "LeaveEvent",
        event_payload: {},
        nodekit_version: r
      };
      s.push(M), t(M);
    } else if (document.visibilityState === "visible") {
      const M = {
        event_id: xt(),
        timestamp_event: vt(),
        event_type: "ReturnEvent",
        event_payload: {},
        nodekit_version: r
      };
      s.push(M), t(M);
    }
  }
  document.addEventListener("visibilitychange", h);
  const u = ea(), p = {
    event_id: xt(),
    timestamp_event: vt(),
    event_type: "BrowserContextEvent",
    event_payload: u,
    nodekit_version: r
  };
  s.push(p), t(p);
  const O = n.nodes;
  for (let M = 0; M < O.length; M++) {
    const _e = O[M], xe = await l.prepare(_e);
    let le = await l.play(xe);
    const me = {
      event_id: xt(),
      timestamp_event: vt(),
      event_type: "NodeResultEvent",
      event_payload: {
        node_id: _e.node_id,
        timestamp_node_start: le.timestamp_start,
        timestamp_node_end: le.timestamp_end,
        action: le.action
      },
      nodekit_version: r
    };
    s.push(me), t(me), l.setProgressBar((M + 1) / O.length * 100);
  }
  const v = Jo(
    s,
    n
  );
  let $ = "";
  if (v > 0 && ($ = `Bonus: ${v} USD (pending validation)`), await l.playEndScreen($), $ !== "") {
    const M = {
      event_id: xt(),
      timestamp_event: vt(),
      event_type: "BonusDisclosureEvent",
      event_payload: {
        bonus_amount_usd: v.toFixed(2)
      },
      nodekit_version: r
    };
    s.push(M), t(M);
  }
  const N = {
    event_id: xt(),
    timestamp_event: vt(),
    event_type: "EndEvent",
    event_payload: {},
    nodekit_version: r
  };
  return s.push(N), t(N), document.removeEventListener("visibilitychange", h), l.showConsoleMessageOverlay(
    "Events",
    s
  ), s;
}
export {
  ga as play
};
