class xe {
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
  _registerEventListener(e, t, s, i) {
    e.addEventListener(t, s, i), this._listenerRegistry.push({ type: t, handler: s, options: i });
  }
  _findChildrenComponents() {
    const e = [];
    for (const t of Object.keys(this)) {
      const s = this[t];
      s instanceof xe ? e.push(s) : Array.isArray(s) && s.every((i) => i instanceof xe) && e.push(...s);
    }
    return e;
  }
  removeAllEventListeners() {
    for (const { type: e, handler: t, options: s } of this._listenerRegistry)
      this.root.removeEventListener(e, t, s);
    this._listenerRegistry = [];
    for (const e of this._findChildrenComponents())
      e.removeAllEventListeners();
  }
}
class fr extends xe {
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
    const i = (/* @__PURE__ */ new Set(["positive", "negative", "neutral"])).has(e) ? e : "negative";
    t.classList.add(`status-dot--${i}`);
  }
}
class gr extends xe {
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
class ii extends xe {
  constructor(e) {
    super(), this.root = document.createElement("div"), this.root.classList.add("overlay"), this.root.id = e;
  }
  setVisibility(e) {
    e ? this.root.classList.add("overlay--visible-state") : this.root.classList.remove("overlay--visible-state");
  }
}
class mr extends xe {
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
class wr extends ii {
  constructor() {
    super("session-connecting-overlay"), this.displayTimeout = null;
    const e = document.createElement("div");
    e.classList.add("connecting-message-box"), this.root.appendChild(e), this.spinner = new mr(), this.spinner.mount(e);
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
function br(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var wi, as;
function xr() {
  if (as) return wi;
  as = 1;
  function n(a) {
    return a instanceof Map ? a.clear = a.delete = a.set = function() {
      throw new Error("map is read-only");
    } : a instanceof Set && (a.add = a.clear = a.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(a), Object.getOwnPropertyNames(a).forEach((u) => {
      const y = a[u], L = typeof y;
      (L === "object" || L === "function") && !Object.isFrozen(y) && n(y);
    }), a;
  }
  class e {
    /**
     * @param {CompiledMode} mode
     */
    constructor(u) {
      u.data === void 0 && (u.data = {}), this.data = u.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function t(a) {
    return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function s(a, ...u) {
    const y = /* @__PURE__ */ Object.create(null);
    for (const L in a)
      y[L] = a[L];
    return u.forEach(function(L) {
      for (const K in L)
        y[K] = L[K];
    }), /** @type {T} */
    y;
  }
  const i = "</span>", o = (a) => !!a.scope, r = (a, { prefix: u }) => {
    if (a.startsWith("language:"))
      return a.replace("language:", "language-");
    if (a.includes(".")) {
      const y = a.split(".");
      return [
        `${u}${y.shift()}`,
        ...y.map((L, K) => `${L}${"_".repeat(K + 1)}`)
      ].join(" ");
    }
    return `${u}${a}`;
  };
  class c {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(u, y) {
      this.buffer = "", this.classPrefix = y.classPrefix, u.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(u) {
      this.buffer += t(u);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(u) {
      if (!o(u)) return;
      const y = r(
        u.scope,
        { prefix: this.classPrefix }
      );
      this.span(y);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(u) {
      o(u) && (this.buffer += i);
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
    span(u) {
      this.buffer += `<span class="${u}">`;
    }
  }
  const h = (a = {}) => {
    const u = { children: [] };
    return Object.assign(u, a), u;
  };
  class p {
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
    add(u) {
      this.top.children.push(u);
    }
    /** @param {string} scope */
    openNode(u) {
      const y = h({ scope: u });
      this.add(y), this.stack.push(y);
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
    walk(u) {
      return this.constructor._walk(u, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(u, y) {
      return typeof y == "string" ? u.addText(y) : y.children && (u.openNode(y), y.children.forEach((L) => this._walk(u, L)), u.closeNode(y)), u;
    }
    /**
     * @param {Node} node
     */
    static _collapse(u) {
      typeof u != "string" && u.children && (u.children.every((y) => typeof y == "string") ? u.children = [u.children.join("")] : u.children.forEach((y) => {
        p._collapse(y);
      }));
    }
  }
  class S extends p {
    /**
     * @param {*} options
     */
    constructor(u) {
      super(), this.options = u;
    }
    /**
     * @param {string} text
     */
    addText(u) {
      u !== "" && this.add(u);
    }
    /** @param {string} scope */
    startScope(u) {
      this.openNode(u);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(u, y) {
      const L = u.root;
      y && (L.scope = `language:${y}`), this.add(L);
    }
    toHTML() {
      return new c(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function R(a) {
    return a ? typeof a == "string" ? a : a.source : null;
  }
  function I(a) {
    return M("(?=", a, ")");
  }
  function $(a) {
    return M("(?:", a, ")*");
  }
  function B(a) {
    return M("(?:", a, ")?");
  }
  function M(...a) {
    return a.map((y) => R(y)).join("");
  }
  function ye(a) {
    const u = a[a.length - 1];
    return typeof u == "object" && u.constructor === Object ? (a.splice(a.length - 1, 1), u) : {};
  }
  function ve(...a) {
    return "(" + (ye(a).capture ? "" : "?:") + a.map((L) => R(L)).join("|") + ")";
  }
  function ae(a) {
    return new RegExp(a.toString() + "|").exec("").length - 1;
  }
  function ge(a, u) {
    const y = a && a.exec(u);
    return y && y.index === 0;
  }
  const ee = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function Re(a, { joinWith: u }) {
    let y = 0;
    return a.map((L) => {
      y += 1;
      const K = y;
      let Z = R(L), E = "";
      for (; Z.length > 0; ) {
        const _ = ee.exec(Z);
        if (!_) {
          E += Z;
          break;
        }
        E += Z.substring(0, _.index), Z = Z.substring(_.index + _[0].length), _[0][0] === "\\" && _[1] ? E += "\\" + String(Number(_[1]) + K) : (E += _[0], _[0] === "(" && y++);
      }
      return E;
    }).map((L) => `(${L})`).join(u);
  }
  const Ve = /\b\B/, De = "[a-zA-Z]\\w*", Ft = "[a-zA-Z_]\\w*", _n = "\\b\\d+(\\.\\d+)?", En = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", oe = "\\b(0b[01]+)", jt = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", Gt = (a = {}) => {
    const u = /^#![ ]*\//;
    return a.binary && (a.begin = M(
      u,
      /.*\b/,
      a.binary,
      /\b.*/
    )), s({
      scope: "meta",
      begin: u,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (y, L) => {
        y.index !== 0 && L.ignoreMatch();
      }
    }, a);
  }, Fe = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, li = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [Fe]
  }, ci = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [Fe]
  }, ui = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, ht = function(a, u, y = {}) {
    const L = s(
      {
        scope: "comment",
        begin: a,
        end: u,
        contains: []
      },
      y
    );
    L.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const K = ve(
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
    return L.contains.push(
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
          K,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), L;
  }, hi = ht("//", "$"), Sn = ht("/\\*", "\\*/"), te = ht("#", "$"), Tn = {
    scope: "number",
    begin: _n,
    relevance: 0
  }, ie = {
    scope: "number",
    begin: En,
    relevance: 0
  }, An = {
    scope: "number",
    begin: oe,
    relevance: 0
  }, Q = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      Fe,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [Fe]
      }
    ]
  }, dt = {
    scope: "title",
    begin: De,
    relevance: 0
  }, Wt = {
    scope: "title",
    begin: Ft,
    relevance: 0
  }, Cn = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + Ft,
    relevance: 0
  };
  var pt = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: li,
    BACKSLASH_ESCAPE: Fe,
    BINARY_NUMBER_MODE: An,
    BINARY_NUMBER_RE: oe,
    COMMENT: ht,
    C_BLOCK_COMMENT_MODE: Sn,
    C_LINE_COMMENT_MODE: hi,
    C_NUMBER_MODE: ie,
    C_NUMBER_RE: En,
    END_SAME_AS_BEGIN: function(a) {
      return Object.assign(
        a,
        {
          /** @type {ModeCallback} */
          "on:begin": (u, y) => {
            y.data._beginMatch = u[1];
          },
          /** @type {ModeCallback} */
          "on:end": (u, y) => {
            y.data._beginMatch !== u[1] && y.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: te,
    IDENT_RE: De,
    MATCH_NOTHING_RE: Ve,
    METHOD_GUARD: Cn,
    NUMBER_MODE: Tn,
    NUMBER_RE: _n,
    PHRASAL_WORDS_MODE: ui,
    QUOTE_STRING_MODE: ci,
    REGEXP_MODE: Q,
    RE_STARTERS_RE: jt,
    SHEBANG: Gt,
    TITLE_MODE: dt,
    UNDERSCORE_IDENT_RE: Ft,
    UNDERSCORE_TITLE_MODE: Wt
  });
  function On(a, u) {
    a.input[a.index - 1] === "." && u.ignoreMatch();
  }
  function et(a, u) {
    a.className !== void 0 && (a.scope = a.className, delete a.className);
  }
  function Tt(a, u) {
    u && a.beginKeywords && (a.begin = "\\b(" + a.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", a.__beforeBegin = On, a.keywords = a.keywords || a.beginKeywords, delete a.beginKeywords, a.relevance === void 0 && (a.relevance = 0));
  }
  function je(a, u) {
    Array.isArray(a.illegal) && (a.illegal = ve(...a.illegal));
  }
  function qt(a, u) {
    if (a.match) {
      if (a.begin || a.end) throw new Error("begin & end are not supported with match");
      a.begin = a.match, delete a.match;
    }
  }
  function Xt(a, u) {
    a.relevance === void 0 && (a.relevance = 1);
  }
  const tt = (a, u) => {
    if (!a.beforeMatch) return;
    if (a.starts) throw new Error("beforeMatch cannot be used with starts");
    const y = Object.assign({}, a);
    Object.keys(a).forEach((L) => {
      delete a[L];
    }), a.keywords = y.keywords, a.begin = M(y.beforeMatch, I(y.begin)), a.starts = {
      relevance: 0,
      contains: [
        Object.assign(y, { endsParent: !0 })
      ]
    }, a.relevance = 0, delete y.beforeMatch;
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
  ], Ct = "keyword";
  function Yt(a, u, y = Ct) {
    const L = /* @__PURE__ */ Object.create(null);
    return typeof a == "string" ? K(y, a.split(" ")) : Array.isArray(a) ? K(y, a) : Object.keys(a).forEach(function(Z) {
      Object.assign(
        L,
        Yt(a[Z], u, Z)
      );
    }), L;
    function K(Z, E) {
      u && (E = E.map((_) => _.toLowerCase())), E.forEach(function(_) {
        const O = _.split("|");
        L[O[0]] = [Z, Mn(O[0], O[1])];
      });
    }
  }
  function Mn(a, u) {
    return u ? Number(u) : di(a) ? 0 : 1;
  }
  function di(a) {
    return At.includes(a.toLowerCase());
  }
  const Rt = {}, ke = (a) => {
    console.error(a);
  }, Ge = (a, ...u) => {
    console.log(`WARN: ${a}`, ...u);
  }, _e = (a, u) => {
    Rt[`${a}/${u}`] || (console.log(`Deprecated as of ${a}. ${u}`), Rt[`${a}/${u}`] = !0);
  }, ft = new Error();
  function Zt(a, u, { key: y }) {
    let L = 0;
    const K = a[y], Z = {}, E = {};
    for (let _ = 1; _ <= u.length; _++)
      E[_ + L] = K[_], Z[_ + L] = !0, L += ae(u[_ - 1]);
    a[y] = E, a[y]._emit = Z, a[y]._multi = !0;
  }
  function Ln(a) {
    if (Array.isArray(a.begin)) {
      if (a.skip || a.excludeBegin || a.returnBegin)
        throw ke("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), ft;
      if (typeof a.beginScope != "object" || a.beginScope === null)
        throw ke("beginScope must be object"), ft;
      Zt(a, a.begin, { key: "beginScope" }), a.begin = Re(a.begin, { joinWith: "" });
    }
  }
  function Kt(a) {
    if (Array.isArray(a.end)) {
      if (a.skip || a.excludeEnd || a.returnEnd)
        throw ke("skip, excludeEnd, returnEnd not compatible with endScope: {}"), ft;
      if (typeof a.endScope != "object" || a.endScope === null)
        throw ke("endScope must be object"), ft;
      Zt(a, a.end, { key: "endScope" }), a.end = Re(a.end, { joinWith: "" });
    }
  }
  function In(a) {
    a.scope && typeof a.scope == "object" && a.scope !== null && (a.beginScope = a.scope, delete a.scope);
  }
  function Ot(a) {
    In(a), typeof a.beginScope == "string" && (a.beginScope = { _wrap: a.beginScope }), typeof a.endScope == "string" && (a.endScope = { _wrap: a.endScope }), Ln(a), Kt(a);
  }
  function Mt(a) {
    function u(E, _) {
      return new RegExp(
        R(E),
        "m" + (a.case_insensitive ? "i" : "") + (a.unicodeRegex ? "u" : "") + (_ ? "g" : "")
      );
    }
    class y {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(_, O) {
        O.position = this.position++, this.matchIndexes[this.matchAt] = O, this.regexes.push([O, _]), this.matchAt += ae(_) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const _ = this.regexes.map((O) => O[1]);
        this.matcherRe = u(Re(_, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(_) {
        this.matcherRe.lastIndex = this.lastIndex;
        const O = this.matcherRe.exec(_);
        if (!O)
          return null;
        const V = O.findIndex((rt, Lt) => Lt > 0 && rt !== void 0), W = this.matchIndexes[V];
        return O.splice(0, V), Object.assign(O, W);
      }
    }
    class L {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(_) {
        if (this.multiRegexes[_]) return this.multiRegexes[_];
        const O = new y();
        return this.rules.slice(_).forEach(([V, W]) => O.addRule(V, W)), O.compile(), this.multiRegexes[_] = O, O;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(_, O) {
        this.rules.push([_, O]), O.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(_) {
        const O = this.getMatcher(this.regexIndex);
        O.lastIndex = this.lastIndex;
        let V = O.exec(_);
        if (this.resumingScanAtSamePosition() && !(V && V.index === this.lastIndex)) {
          const W = this.getMatcher(0);
          W.lastIndex = this.lastIndex + 1, V = W.exec(_);
        }
        return V && (this.regexIndex += V.position + 1, this.regexIndex === this.count && this.considerAll()), V;
      }
    }
    function K(E) {
      const _ = new L();
      return E.contains.forEach((O) => _.addRule(O.begin, { rule: O, type: "begin" })), E.terminatorEnd && _.addRule(E.terminatorEnd, { type: "end" }), E.illegal && _.addRule(E.illegal, { type: "illegal" }), _;
    }
    function Z(E, _) {
      const O = (
        /** @type CompiledMode */
        E
      );
      if (E.isCompiled) return O;
      [
        et,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        qt,
        Ot,
        tt
      ].forEach((W) => W(E, _)), a.compilerExtensions.forEach((W) => W(E, _)), E.__beforeBegin = null, [
        Tt,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        je,
        // default to 1 relevance if not specified
        Xt
      ].forEach((W) => W(E, _)), E.isCompiled = !0;
      let V = null;
      return typeof E.keywords == "object" && E.keywords.$pattern && (E.keywords = Object.assign({}, E.keywords), V = E.keywords.$pattern, delete E.keywords.$pattern), V = V || /\w+/, E.keywords && (E.keywords = Yt(E.keywords, a.case_insensitive)), O.keywordPatternRe = u(V, !0), _ && (E.begin || (E.begin = /\B|\b/), O.beginRe = u(O.begin), !E.end && !E.endsWithParent && (E.end = /\B|\b/), E.end && (O.endRe = u(O.end)), O.terminatorEnd = R(O.end) || "", E.endsWithParent && _.terminatorEnd && (O.terminatorEnd += (E.end ? "|" : "") + _.terminatorEnd)), E.illegal && (O.illegalRe = u(
        /** @type {RegExp | string} */
        E.illegal
      )), E.contains || (E.contains = []), E.contains = [].concat(...E.contains.map(function(W) {
        return nt(W === "self" ? E : W);
      })), E.contains.forEach(function(W) {
        Z(
          /** @type Mode */
          W,
          O
        );
      }), E.starts && Z(E.starts, _), O.matcher = K(O), O;
    }
    if (a.compilerExtensions || (a.compilerExtensions = []), a.contains && a.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return a.classNameAliases = s(a.classNameAliases || {}), Z(
      /** @type Mode */
      a
    );
  }
  function Te(a) {
    return a ? a.endsWithParent || Te(a.starts) : !1;
  }
  function nt(a) {
    return a.variants && !a.cachedVariants && (a.cachedVariants = a.variants.map(function(u) {
      return s(a, { variants: null }, u);
    })), a.cachedVariants ? a.cachedVariants : Te(a) ? s(a, { starts: a.starts ? s(a.starts) : null }) : Object.isFrozen(a) ? s(a) : a;
  }
  var Qt = "11.11.1";
  class Jt extends Error {
    constructor(u, y) {
      super(u), this.name = "HTMLInjectionError", this.html = y;
    }
  }
  const en = t, gt = s, mt = Symbol("nomatch"), pi = 7, it = function(a) {
    const u = /* @__PURE__ */ Object.create(null), y = /* @__PURE__ */ Object.create(null), L = [];
    let K = !0;
    const Z = "Could not find the language '{}', did you forget to load/include a language module?", E = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let _ = {
      ignoreUnescapedHTML: !1,
      throwUnescapedHTML: !1,
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      cssSelector: "pre code",
      languages: null,
      // beta configuration options, subject to change, welcome to discuss
      // https://github.com/highlightjs/highlight.js/issues/1086
      __emitter: S
    };
    function O(m) {
      return _.noHighlightRe.test(m);
    }
    function V(m) {
      let A = m.className + " ";
      A += m.parentNode ? m.parentNode.className : "";
      const U = _.languageDetectRe.exec(A);
      if (U) {
        const X = k(U[1]);
        return X || (Ge(Z.replace("{}", U[1])), Ge("Falling back to no-highlight mode for this block.", m)), X ? U[1] : "no-highlight";
      }
      return A.split(/\s+/).find((X) => O(X) || k(X));
    }
    function W(m, A, U) {
      let X = "", re = "";
      typeof A == "object" ? (X = m, U = A.ignoreIllegals, re = A.language) : (_e("10.7.0", "highlight(lang, code, ...args) has been deprecated."), _e("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), re = m, X = A), U === void 0 && (U = !0);
      const Me = {
        code: X,
        language: re
      };
      Pe("before:highlight", Me);
      const ot = Me.result ? Me.result : rt(Me.language, Me.code, U);
      return ot.code = Me.code, Pe("after:highlight", ot), ot;
    }
    function rt(m, A, U, X) {
      const re = /* @__PURE__ */ Object.create(null);
      function Me(v, C) {
        return v.keywords[C];
      }
      function ot() {
        if (!P.keywords) {
          le.addText(Y);
          return;
        }
        let v = 0;
        P.keywordPatternRe.lastIndex = 0;
        let C = P.keywordPatternRe.exec(Y), N = "";
        for (; C; ) {
          N += Y.substring(v, C.index);
          const F = Be.case_insensitive ? C[0].toLowerCase() : C[0], ue = Me(P, F);
          if (ue) {
            const [We, dr] = ue;
            if (le.addText(N), N = "", re[F] = (re[F] || 0) + 1, re[F] <= pi && ($n += dr), We.startsWith("_"))
              N += C[0];
            else {
              const pr = Be.classNameAliases[We] || We;
              Ne(C[0], pr);
            }
          } else
            N += C[0];
          v = P.keywordPatternRe.lastIndex, C = P.keywordPatternRe.exec(Y);
        }
        N += Y.substring(v), le.addText(N);
      }
      function Un() {
        if (Y === "") return;
        let v = null;
        if (typeof P.subLanguage == "string") {
          if (!u[P.subLanguage]) {
            le.addText(Y);
            return;
          }
          v = rt(P.subLanguage, Y, !0, os[P.subLanguage]), os[P.subLanguage] = /** @type {CompiledMode} */
          v._top;
        } else
          v = wt(Y, P.subLanguage.length ? P.subLanguage : null);
        P.relevance > 0 && ($n += v.relevance), le.__addSublanguage(v._emitter, v.language);
      }
      function Se() {
        P.subLanguage != null ? Un() : ot(), Y = "";
      }
      function Ne(v, C) {
        v !== "" && (le.startScope(C), le.addText(v), le.endScope());
      }
      function ns(v, C) {
        let N = 1;
        const F = C.length - 1;
        for (; N <= F; ) {
          if (!v._emit[N]) {
            N++;
            continue;
          }
          const ue = Be.classNameAliases[v[N]] || v[N], We = C[N];
          ue ? Ne(We, ue) : (Y = We, ot(), Y = ""), N++;
        }
      }
      function is(v, C) {
        return v.scope && typeof v.scope == "string" && le.openNode(Be.classNameAliases[v.scope] || v.scope), v.beginScope && (v.beginScope._wrap ? (Ne(Y, Be.classNameAliases[v.beginScope._wrap] || v.beginScope._wrap), Y = "") : v.beginScope._multi && (ns(v.beginScope, C), Y = "")), P = Object.create(v, { parent: { value: P } }), P;
      }
      function ss(v, C, N) {
        let F = ge(v.endRe, N);
        if (F) {
          if (v["on:end"]) {
            const ue = new e(v);
            v["on:end"](C, ue), ue.isMatchIgnored && (F = !1);
          }
          if (F) {
            for (; v.endsParent && v.parent; )
              v = v.parent;
            return v;
          }
        }
        if (v.endsWithParent)
          return ss(v.parent, C, N);
      }
      function ar(v) {
        return P.matcher.regexIndex === 0 ? (Y += v[0], 1) : (mi = !0, 0);
      }
      function lr(v) {
        const C = v[0], N = v.rule, F = new e(N), ue = [N.__beforeBegin, N["on:begin"]];
        for (const We of ue)
          if (We && (We(v, F), F.isMatchIgnored))
            return ar(C);
        return N.skip ? Y += C : (N.excludeBegin && (Y += C), Se(), !N.returnBegin && !N.excludeBegin && (Y = C)), is(N, v), N.returnBegin ? 0 : C.length;
      }
      function cr(v) {
        const C = v[0], N = A.substring(v.index), F = ss(P, v, N);
        if (!F)
          return mt;
        const ue = P;
        P.endScope && P.endScope._wrap ? (Se(), Ne(C, P.endScope._wrap)) : P.endScope && P.endScope._multi ? (Se(), ns(P.endScope, v)) : ue.skip ? Y += C : (ue.returnEnd || ue.excludeEnd || (Y += C), Se(), ue.excludeEnd && (Y = C));
        do
          P.scope && le.closeNode(), !P.skip && !P.subLanguage && ($n += P.relevance), P = P.parent;
        while (P !== F.parent);
        return F.starts && is(F.starts, v), ue.returnEnd ? 0 : C.length;
      }
      function ur() {
        const v = [];
        for (let C = P; C !== Be; C = C.parent)
          C.scope && v.unshift(C.scope);
        v.forEach((C) => le.openNode(C));
      }
      let zn = {};
      function rs(v, C) {
        const N = C && C[0];
        if (Y += v, N == null)
          return Se(), 0;
        if (zn.type === "begin" && C.type === "end" && zn.index === C.index && N === "") {
          if (Y += A.slice(C.index, C.index + 1), !K) {
            const F = new Error(`0 width match regex (${m})`);
            throw F.languageName = m, F.badRule = zn.rule, F;
          }
          return 1;
        }
        if (zn = C, C.type === "begin")
          return lr(C);
        if (C.type === "illegal" && !U) {
          const F = new Error('Illegal lexeme "' + N + '" for mode "' + (P.scope || "<unnamed>") + '"');
          throw F.mode = P, F;
        } else if (C.type === "end") {
          const F = cr(C);
          if (F !== mt)
            return F;
        }
        if (C.type === "illegal" && N === "")
          return Y += `
`, 1;
        if (gi > 1e5 && gi > C.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return Y += N, N.length;
      }
      const Be = k(m);
      if (!Be)
        throw ke(Z.replace("{}", m)), new Error('Unknown language: "' + m + '"');
      const hr = Mt(Be);
      let fi = "", P = X || hr;
      const os = {}, le = new _.__emitter(_);
      ur();
      let Y = "", $n = 0, bt = 0, gi = 0, mi = !1;
      try {
        if (Be.__emitTokens)
          Be.__emitTokens(A, le);
        else {
          for (P.matcher.considerAll(); ; ) {
            gi++, mi ? mi = !1 : P.matcher.considerAll(), P.matcher.lastIndex = bt;
            const v = P.matcher.exec(A);
            if (!v) break;
            const C = A.substring(bt, v.index), N = rs(C, v);
            bt = v.index + N;
          }
          rs(A.substring(bt));
        }
        return le.finalize(), fi = le.toHTML(), {
          language: m,
          value: fi,
          relevance: $n,
          illegal: !1,
          _emitter: le,
          _top: P
        };
      } catch (v) {
        if (v.message && v.message.includes("Illegal"))
          return {
            language: m,
            value: en(A),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: v.message,
              index: bt,
              context: A.slice(bt - 100, bt + 100),
              mode: v.mode,
              resultSoFar: fi
            },
            _emitter: le
          };
        if (K)
          return {
            language: m,
            value: en(A),
            illegal: !1,
            relevance: 0,
            errorRaised: v,
            _emitter: le,
            _top: P
          };
        throw v;
      }
    }
    function Lt(m) {
      const A = {
        value: en(m),
        illegal: !1,
        relevance: 0,
        _top: E,
        _emitter: new _.__emitter(_)
      };
      return A._emitter.addText(m), A;
    }
    function wt(m, A) {
      A = A || _.languages || Object.keys(u);
      const U = Lt(m), X = A.filter(k).filter(se).map(
        (Se) => rt(Se, m, !1)
      );
      X.unshift(U);
      const re = X.sort((Se, Ne) => {
        if (Se.relevance !== Ne.relevance) return Ne.relevance - Se.relevance;
        if (Se.language && Ne.language) {
          if (k(Se.language).supersetOf === Ne.language)
            return 1;
          if (k(Ne.language).supersetOf === Se.language)
            return -1;
        }
        return 0;
      }), [Me, ot] = re, Un = Me;
      return Un.secondBest = ot, Un;
    }
    function Dn(m, A, U) {
      const X = A && y[A] || U;
      m.classList.add("hljs"), m.classList.add(`language-${X}`);
    }
    function Ee(m) {
      let A = null;
      const U = V(m);
      if (O(U)) return;
      if (Pe(
        "before:highlightElement",
        { el: m, language: U }
      ), m.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", m);
        return;
      }
      if (m.children.length > 0 && (_.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(m)), _.throwUnescapedHTML))
        throw new Jt(
          "One of your code blocks includes unescaped HTML.",
          m.innerHTML
        );
      A = m;
      const X = A.textContent, re = U ? W(X, { language: U, ignoreIllegals: !0 }) : wt(X);
      m.innerHTML = re.value, m.dataset.highlighted = "yes", Dn(m, U, re.language), m.result = {
        language: re.language,
        // TODO: remove with version 11.0
        re: re.relevance,
        relevance: re.relevance
      }, re.secondBest && (m.secondBest = {
        language: re.secondBest.language,
        relevance: re.secondBest.relevance
      }), Pe("after:highlightElement", { el: m, result: re, text: X });
    }
    function Pn(m) {
      _ = gt(_, m);
    }
    const Nn = () => {
      It(), _e("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Bn() {
      It(), _e("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let tn = !1;
    function It() {
      function m() {
        It();
      }
      if (document.readyState === "loading") {
        tn || window.addEventListener("DOMContentLoaded", m, !1), tn = !0;
        return;
      }
      document.querySelectorAll(_.cssSelector).forEach(Ee);
    }
    function T(m, A) {
      let U = null;
      try {
        U = A(a);
      } catch (X) {
        if (ke("Language definition for '{}' could not be registered.".replace("{}", m)), K)
          ke(X);
        else
          throw X;
        U = E;
      }
      U.name || (U.name = m), u[m] = U, U.rawDefinition = A.bind(null, a), U.aliases && q(U.aliases, { languageName: m });
    }
    function l(m) {
      delete u[m];
      for (const A of Object.keys(y))
        y[A] === m && delete y[A];
    }
    function x() {
      return Object.keys(u);
    }
    function k(m) {
      return m = (m || "").toLowerCase(), u[m] || u[y[m]];
    }
    function q(m, { languageName: A }) {
      typeof m == "string" && (m = [m]), m.forEach((U) => {
        y[U.toLowerCase()] = A;
      });
    }
    function se(m) {
      const A = k(m);
      return A && !A.disableAutodetect;
    }
    function J(m) {
      m["before:highlightBlock"] && !m["before:highlightElement"] && (m["before:highlightElement"] = (A) => {
        m["before:highlightBlock"](
          Object.assign({ block: A.el }, A)
        );
      }), m["after:highlightBlock"] && !m["after:highlightElement"] && (m["after:highlightElement"] = (A) => {
        m["after:highlightBlock"](
          Object.assign({ block: A.el }, A)
        );
      });
    }
    function ce(m) {
      J(m), L.push(m);
    }
    function Oe(m) {
      const A = L.indexOf(m);
      A !== -1 && L.splice(A, 1);
    }
    function Pe(m, A) {
      const U = m;
      L.forEach(function(X) {
        X[U] && X[U](A);
      });
    }
    function nn(m) {
      return _e("10.7.0", "highlightBlock will be removed entirely in v12.0"), _e("10.7.0", "Please use highlightElement now."), Ee(m);
    }
    Object.assign(a, {
      highlight: W,
      highlightAuto: wt,
      highlightAll: It,
      highlightElement: Ee,
      // TODO: Remove with v12 API
      highlightBlock: nn,
      configure: Pn,
      initHighlighting: Nn,
      initHighlightingOnLoad: Bn,
      registerLanguage: T,
      unregisterLanguage: l,
      listLanguages: x,
      getLanguage: k,
      registerAliases: q,
      autoDetection: se,
      inherit: gt,
      addPlugin: ce,
      removePlugin: Oe
    }), a.debugMode = function() {
      K = !1;
    }, a.safeMode = function() {
      K = !0;
    }, a.versionString = Qt, a.regex = {
      concat: M,
      lookahead: I,
      either: ve,
      optional: B,
      anyNumberOfTimes: $
    };
    for (const m in pt)
      typeof pt[m] == "object" && n(pt[m]);
    return Object.assign(a, pt), a;
  }, st = it({});
  return st.newInstance = () => it({}), wi = st, st.HighlightJS = st, st.default = st, wi;
}
var yr = /* @__PURE__ */ xr();
const $s = /* @__PURE__ */ br(yr);
function vr(n) {
  const e = {
    className: "attr",
    begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
    relevance: 1.01
  }, t = {
    match: /[{}[\],:]/,
    className: "punctuation",
    relevance: 0
  }, s = [
    "true",
    "false",
    "null"
  ], i = {
    scope: "literal",
    beginKeywords: s.join(" ")
  };
  return {
    name: "JSON",
    aliases: ["jsonc"],
    keywords: {
      literal: s
    },
    contains: [
      e,
      t,
      n.QUOTE_STRING_MODE,
      i,
      n.C_NUMBER_MODE,
      n.C_LINE_COMMENT_MODE,
      n.C_BLOCK_COMMENT_MODE
    ],
    illegal: "\\S"
  };
}
$s.registerLanguage("json", vr);
class kr extends xe {
  constructor() {
    super(), this.root = document.createElement("div"), this.root.classList.add("json-viewer"), this.jsonViewerContent = document.createElement("div"), this.jsonViewerContent.classList.add("json-viewer__content"), this.root.appendChild(this.jsonViewerContent);
  }
  displayAsJson(e) {
    this.clear();
    const t = document.createElement("pre");
    t.classList.add("json-viewer__pre"), t.textContent = JSON.stringify(e, null, 2), $s.highlightElement(t), t.style.backgroundColor = "transparent", this.jsonViewerContent.appendChild(t);
  }
  clear() {
  }
}
class _r extends ii {
  constructor() {
    super("console-message-overlay");
    const e = document.createElement("div");
    e.classList.add("console-title-box"), this.root.appendChild(e), this.titleTextDiv = document.createElement("div"), this.titleTextDiv.classList.add("console-title-box__text"), e.appendChild(this.titleTextDiv), this.jsonViewer = new kr(), this.jsonViewer.mount(this.root);
    const t = new Er();
    t.setCopyTarget(this.jsonViewer.root), t.mount(e);
  }
  displayMessage(e, t) {
    this.titleTextDiv.innerHTML = e, this.jsonViewer.displayAsJson(t), super.setVisibility(!0);
  }
  hide() {
    this.titleTextDiv.innerHTML = "", this.jsonViewer.clear(), super.setVisibility(!1);
  }
}
class Er extends xe {
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
class Sr extends ii {
  constructor() {
    super("session-finished-overlay"), this.submitButton = new Tr(), this.submitButton.mount(this.root), this.messageBox = document.createElement("div"), this.messageBox.classList.add("debrief-message-box"), this.root.appendChild(this.messageBox), this.messageSpan = document.createElement("span"), this.messageSpan.classList.add("debrief-message-box__text"), this.messageBox.appendChild(this.messageSpan);
  }
  show(e, t) {
    e.length == 0 ? this.messageBox.style.visibility = "hidden" : this.messageBox.style.visibility = "visible", this.messageSpan.textContent = e, this.submitButton.attachClickListener(t), this.setVisibility(!0);
  }
  hide() {
    this.messageSpan.textContent = "", super.setVisibility(!1), this.submitButton.removeAllEventListeners();
  }
}
class Tr extends xe {
  constructor() {
    super();
    const e = document.createElement("button");
    e.classList.add("submit-button"), e.textContent = "Press to Submit", this.root = e;
  }
  attachClickListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class Ar extends ii {
  constructor() {
    super("session-started-overlay"), this.startButton = new Cr(), this.startButton.mount(this.root);
  }
  show(e) {
    this.startButton.attachClickListener(e), this.setVisibility(!0);
  }
  hide() {
    super.setVisibility(!1), this.startButton.removeAllEventListeners();
  }
}
class Cr extends xe {
  constructor() {
    super();
    const e = document.createElement("button");
    e.classList.add("start-button"), e.textContent = "Press to Start", this.root = e;
  }
  attachClickListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class Rr extends xe {
  constructor() {
    super(), this.root = document.createElement("div"), this.root.className = "shell-ui", this.progressBar = new gr("cognition"), this.progressBar.mount(this.root), this.statusDot = new fr(), this.statusDot.mount(this.root), this.sessionConnectingOverlay = new wr(), this.sessionConnectingOverlay.mount(this.root), this.overlayConsoleMessage = new _r(), this.overlayConsoleMessage.mount(this.root), this.sessionFinishedOverlay = new Sr(), this.sessionFinishedOverlay.mount(this.root), this.sessionStartedOverlay = new Ar(), this.sessionStartedOverlay.mount(this.root);
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
    await new Promise((t, s) => {
      this.sessionStartedOverlay.show(
        () => {
          this.sessionStartedOverlay.hide(), t();
        }
      );
    });
  }
  async playEndScreen(e = "", t = 1e4) {
    let s = new Promise((o, r) => {
      this.sessionFinishedOverlay.show(
        e,
        () => {
          this.sessionFinishedOverlay.hide(), o();
        }
      );
    });
    await s;
    let i = new Promise((o, r) => {
      setTimeout(() => {
        this.sessionFinishedOverlay.hide(), o();
      }, t);
    });
    await Promise.race([s, i]);
  }
}
class Ht {
  constructor(e, t) {
    this.card = e, this.boardCoords = t, this.root = document.createElement("div"), this.root.classList.add("card"), this.root.id = e.card_id;
    const { leftPx: s, topPx: i } = t.getBoardLocationPx(
      this.card.x,
      this.card.y,
      this.card.w,
      this.card.h
    ), { widthPx: o, heightPx: r } = t.getBoardRectanglePx(
      this.card.w,
      this.card.h
    );
    this.root.style.left = `${s}px`, this.root.style.top = `${i}px`, this.root.style.width = `${o}px`, this.root.style.height = `${r}px`, this.setVisibility(!1), this.setInteractivity(!1);
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
function ji() {
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
var St = ji();
function Hs(n) {
  St = n;
}
var yn = { exec: () => null };
function H(n, e = "") {
  let t = typeof n == "string" ? n : n.source;
  const s = {
    replace: (i, o) => {
      let r = typeof o == "string" ? o : o.source;
      return r = r.replace(de.caret, "$1"), t = t.replace(i, r), s;
    },
    getRegex: () => new RegExp(t, e)
  };
  return s;
}
var de = {
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
}, Or = /^(?:[ \t]*(?:\n|$))+/, Mr = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Lr = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, kn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Ir = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Gi = /(?:[*+-]|\d{1,9}[.)])/, Vs = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Fs = H(Vs).replace(/bull/g, Gi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Dr = H(Vs).replace(/bull/g, Gi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Wi = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Pr = /^[^\n]+/, qi = /(?!\s*\])(?:\\.|[^\[\]\\])+/, Nr = H(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", qi).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Br = H(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Gi).getRegex(), si = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Xi = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Ur = H(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", Xi).replace("tag", si).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), js = H(Wi).replace("hr", kn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", si).getRegex(), zr = H(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", js).getRegex(), Yi = {
  blockquote: zr,
  code: Mr,
  def: Nr,
  fences: Lr,
  heading: Ir,
  hr: kn,
  html: Ur,
  lheading: Fs,
  list: Br,
  newline: Or,
  paragraph: js,
  table: yn,
  text: Pr
}, ls = H(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", kn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", si).getRegex(), $r = {
  ...Yi,
  lheading: Dr,
  table: ls,
  paragraph: H(Wi).replace("hr", kn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", ls).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", si).getRegex()
}, Hr = {
  ...Yi,
  html: H(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", Xi).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: yn,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: H(Wi).replace("hr", kn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Fs).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, Vr = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Fr = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Gs = /^( {2,}|\\)\n(?!\s*$)/, jr = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, ri = /[\p{P}\p{S}]/u, Zi = /[\s\p{P}\p{S}]/u, Ws = /[^\s\p{P}\p{S}]/u, Gr = H(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Zi).getRegex(), qs = /(?!~)[\p{P}\p{S}]/u, Wr = /(?!~)[\s\p{P}\p{S}]/u, qr = /(?:[^\s\p{P}\p{S}]|~)/u, Xr = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, Xs = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Yr = H(Xs, "u").replace(/punct/g, ri).getRegex(), Zr = H(Xs, "u").replace(/punct/g, qs).getRegex(), Ys = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Kr = H(Ys, "gu").replace(/notPunctSpace/g, Ws).replace(/punctSpace/g, Zi).replace(/punct/g, ri).getRegex(), Qr = H(Ys, "gu").replace(/notPunctSpace/g, qr).replace(/punctSpace/g, Wr).replace(/punct/g, qs).getRegex(), Jr = H(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, Ws).replace(/punctSpace/g, Zi).replace(/punct/g, ri).getRegex(), eo = H(/\\(punct)/, "gu").replace(/punct/g, ri).getRegex(), to = H(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), no = H(Xi).replace("(?:-->|$)", "-->").getRegex(), io = H(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", no).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Kn = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, so = H(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", Kn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Zs = H(/^!?\[(label)\]\[(ref)\]/).replace("label", Kn).replace("ref", qi).getRegex(), Ks = H(/^!?\[(ref)\](?:\[\])?/).replace("ref", qi).getRegex(), ro = H("reflink|nolink(?!\\()", "g").replace("reflink", Zs).replace("nolink", Ks).getRegex(), Ki = {
  _backpedal: yn,
  // only used for GFM url
  anyPunctuation: eo,
  autolink: to,
  blockSkip: Xr,
  br: Gs,
  code: Fr,
  del: yn,
  emStrongLDelim: Yr,
  emStrongRDelimAst: Kr,
  emStrongRDelimUnd: Jr,
  escape: Vr,
  link: so,
  nolink: Ks,
  punctuation: Gr,
  reflink: Zs,
  reflinkSearch: ro,
  tag: io,
  text: jr,
  url: yn
}, oo = {
  ...Ki,
  link: H(/^!?\[(label)\]\((.*?)\)/).replace("label", Kn).getRegex(),
  reflink: H(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Kn).getRegex()
}, Di = {
  ...Ki,
  emStrongRDelimAst: Qr,
  emStrongLDelim: Zr,
  url: H(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, ao = {
  ...Di,
  br: H(Gs).replace("{2,}", "*").getRegex(),
  text: H(Di.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Hn = {
  normal: Yi,
  gfm: $r,
  pedantic: Hr
}, sn = {
  normal: Ki,
  gfm: Di,
  breaks: ao,
  pedantic: oo
}, lo = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, cs = (n) => lo[n];
function Ue(n, e) {
  if (e) {
    if (de.escapeTest.test(n))
      return n.replace(de.escapeReplace, cs);
  } else if (de.escapeTestNoEncode.test(n))
    return n.replace(de.escapeReplaceNoEncode, cs);
  return n;
}
function us(n) {
  try {
    n = encodeURI(n).replace(de.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function hs(n, e) {
  const t = n.replace(de.findPipe, (o, r, c) => {
    let h = !1, p = r;
    for (; --p >= 0 && c[p] === "\\"; ) h = !h;
    return h ? "|" : " |";
  }), s = t.split(de.splitPipe);
  let i = 0;
  if (s[0].trim() || s.shift(), s.length > 0 && !s.at(-1)?.trim() && s.pop(), e)
    if (s.length > e)
      s.splice(e);
    else
      for (; s.length < e; ) s.push("");
  for (; i < s.length; i++)
    s[i] = s[i].trim().replace(de.slashPipe, "|");
  return s;
}
function rn(n, e, t) {
  const s = n.length;
  if (s === 0)
    return "";
  let i = 0;
  for (; i < s && n.charAt(s - i - 1) === e; )
    i++;
  return n.slice(0, s - i);
}
function co(n, e) {
  if (n.indexOf(e[1]) === -1)
    return -1;
  let t = 0;
  for (let s = 0; s < n.length; s++)
    if (n[s] === "\\")
      s++;
    else if (n[s] === e[0])
      t++;
    else if (n[s] === e[1] && (t--, t < 0))
      return s;
  return t > 0 ? -2 : -1;
}
function ds(n, e, t, s, i) {
  const o = e.href, r = e.title || null, c = n[1].replace(i.other.outputLinkReplace, "$1");
  s.state.inLink = !0;
  const h = {
    type: n[0].charAt(0) === "!" ? "image" : "link",
    raw: t,
    href: o,
    title: r,
    text: c,
    tokens: s.inlineTokens(c)
  };
  return s.state.inLink = !1, h;
}
function uo(n, e, t) {
  const s = n.match(t.other.indentCodeCompensation);
  if (s === null)
    return e;
  const i = s[1];
  return e.split(`
`).map((o) => {
    const r = o.match(t.other.beginningSpace);
    if (r === null)
      return o;
    const [c] = r;
    return c.length >= i.length ? o.slice(i.length) : o;
  }).join(`
`);
}
var Qn = class {
  options;
  rules;
  // set by the lexer
  lexer;
  // set by the lexer
  constructor(n) {
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
      const t = e[0], s = uo(t, e[3] || "", this.rules);
      return {
        type: "code",
        raw: t,
        lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2],
        text: s
      };
    }
  }
  heading(n) {
    const e = this.rules.block.heading.exec(n);
    if (e) {
      let t = e[2].trim();
      if (this.rules.other.endingHash.test(t)) {
        const s = rn(t, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (t = s.trim());
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
`), s = "", i = "";
      const o = [];
      for (; t.length > 0; ) {
        let r = !1;
        const c = [];
        let h;
        for (h = 0; h < t.length; h++)
          if (this.rules.other.blockquoteStart.test(t[h]))
            c.push(t[h]), r = !0;
          else if (!r)
            c.push(t[h]);
          else
            break;
        t = t.slice(h);
        const p = c.join(`
`), S = p.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${p}` : p, i = i ? `${i}
${S}` : S;
        const R = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(S, o, !0), this.lexer.state.top = R, t.length === 0)
          break;
        const I = o.at(-1);
        if (I?.type === "code")
          break;
        if (I?.type === "blockquote") {
          const $ = I, B = $.raw + `
` + t.join(`
`), M = this.blockquote(B);
          o[o.length - 1] = M, s = s.substring(0, s.length - $.raw.length) + M.raw, i = i.substring(0, i.length - $.text.length) + M.text;
          break;
        } else if (I?.type === "list") {
          const $ = I, B = $.raw + `
` + t.join(`
`), M = this.list(B);
          o[o.length - 1] = M, s = s.substring(0, s.length - I.raw.length) + M.raw, i = i.substring(0, i.length - $.raw.length) + M.raw, t = B.substring(o.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return {
        type: "blockquote",
        raw: s,
        tokens: o,
        text: i
      };
    }
  }
  list(n) {
    let e = this.rules.block.list.exec(n);
    if (e) {
      let t = e[1].trim();
      const s = t.length > 1, i = {
        type: "list",
        raw: "",
        ordered: s,
        start: s ? +t.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      t = s ? `\\d{1,9}\\${t.slice(-1)}` : `\\${t}`, this.options.pedantic && (t = s ? t : "[*+-]");
      const o = this.rules.other.listItemRegex(t);
      let r = !1;
      for (; n; ) {
        let h = !1, p = "", S = "";
        if (!(e = o.exec(n)) || this.rules.block.hr.test(n))
          break;
        p = e[0], n = n.substring(p.length);
        let R = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (ve) => " ".repeat(3 * ve.length)), I = n.split(`
`, 1)[0], $ = !R.trim(), B = 0;
        if (this.options.pedantic ? (B = 2, S = R.trimStart()) : $ ? B = e[1].length + 1 : (B = e[2].search(this.rules.other.nonSpaceChar), B = B > 4 ? 1 : B, S = R.slice(B), B += e[1].length), $ && this.rules.other.blankLine.test(I) && (p += I + `
`, n = n.substring(I.length + 1), h = !0), !h) {
          const ve = this.rules.other.nextBulletRegex(B), ae = this.rules.other.hrRegex(B), ge = this.rules.other.fencesBeginRegex(B), ee = this.rules.other.headingBeginRegex(B), Re = this.rules.other.htmlBeginRegex(B);
          for (; n; ) {
            const Ve = n.split(`
`, 1)[0];
            let De;
            if (I = Ve, this.options.pedantic ? (I = I.replace(this.rules.other.listReplaceNesting, "  "), De = I) : De = I.replace(this.rules.other.tabCharGlobal, "    "), ge.test(I) || ee.test(I) || Re.test(I) || ve.test(I) || ae.test(I))
              break;
            if (De.search(this.rules.other.nonSpaceChar) >= B || !I.trim())
              S += `
` + De.slice(B);
            else {
              if ($ || R.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || ge.test(R) || ee.test(R) || ae.test(R))
                break;
              S += `
` + I;
            }
            !$ && !I.trim() && ($ = !0), p += Ve + `
`, n = n.substring(Ve.length + 1), R = De.slice(B);
          }
        }
        i.loose || (r ? i.loose = !0 : this.rules.other.doubleBlankLine.test(p) && (r = !0));
        let M = null, ye;
        this.options.gfm && (M = this.rules.other.listIsTask.exec(S), M && (ye = M[0] !== "[ ] ", S = S.replace(this.rules.other.listReplaceTask, ""))), i.items.push({
          type: "list_item",
          raw: p,
          task: !!M,
          checked: ye,
          loose: !1,
          text: S,
          tokens: []
        }), i.raw += p;
      }
      const c = i.items.at(-1);
      if (c)
        c.raw = c.raw.trimEnd(), c.text = c.text.trimEnd();
      else
        return;
      i.raw = i.raw.trimEnd();
      for (let h = 0; h < i.items.length; h++)
        if (this.lexer.state.top = !1, i.items[h].tokens = this.lexer.blockTokens(i.items[h].text, []), !i.loose) {
          const p = i.items[h].tokens.filter((R) => R.type === "space"), S = p.length > 0 && p.some((R) => this.rules.other.anyLine.test(R.raw));
          i.loose = S;
        }
      if (i.loose)
        for (let h = 0; h < i.items.length; h++)
          i.items[h].loose = !0;
      return i;
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
      const t = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), s = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return {
        type: "def",
        tag: t,
        raw: e[0],
        href: s,
        title: i
      };
    }
  }
  table(n) {
    const e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2]))
      return;
    const t = hs(e[1]), s = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], o = {
      type: "table",
      raw: e[0],
      header: [],
      align: [],
      rows: []
    };
    if (t.length === s.length) {
      for (const r of s)
        this.rules.other.tableAlignRight.test(r) ? o.align.push("right") : this.rules.other.tableAlignCenter.test(r) ? o.align.push("center") : this.rules.other.tableAlignLeft.test(r) ? o.align.push("left") : o.align.push(null);
      for (let r = 0; r < t.length; r++)
        o.header.push({
          text: t[r],
          tokens: this.lexer.inline(t[r]),
          header: !0,
          align: o.align[r]
        });
      for (const r of i)
        o.rows.push(hs(r, o.header.length).map((c, h) => ({
          text: c,
          tokens: this.lexer.inline(c),
          header: !1,
          align: o.align[h]
        })));
      return o;
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
        const o = rn(t.slice(0, -1), "\\");
        if ((t.length - o.length) % 2 === 0)
          return;
      } else {
        const o = co(e[2], "()");
        if (o === -2)
          return;
        if (o > -1) {
          const c = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + o;
          e[2] = e[2].substring(0, o), e[0] = e[0].substring(0, c).trim(), e[3] = "";
        }
      }
      let s = e[2], i = "";
      if (this.options.pedantic) {
        const o = this.rules.other.pedanticHrefTitle.exec(s);
        o && (s = o[1], i = o[3]);
      } else
        i = e[3] ? e[3].slice(1, -1) : "";
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(t) ? s = s.slice(1) : s = s.slice(1, -1)), ds(e, {
        href: s && s.replace(this.rules.inline.anyPunctuation, "$1"),
        title: i && i.replace(this.rules.inline.anyPunctuation, "$1")
      }, e[0], this.lexer, this.rules);
    }
  }
  reflink(n, e) {
    let t;
    if ((t = this.rules.inline.reflink.exec(n)) || (t = this.rules.inline.nolink.exec(n))) {
      const s = (t[2] || t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i = e[s.toLowerCase()];
      if (!i) {
        const o = t[0].charAt(0);
        return {
          type: "text",
          raw: o,
          text: o
        };
      }
      return ds(t, i, t[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, t = "") {
    let s = this.rules.inline.emStrongLDelim.exec(n);
    if (!s || s[3] && t.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(s[1] || s[2] || "") || !t || this.rules.inline.punctuation.exec(t)) {
      const o = [...s[0]].length - 1;
      let r, c, h = o, p = 0;
      const S = s[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (S.lastIndex = 0, e = e.slice(-1 * n.length + o); (s = S.exec(e)) != null; ) {
        if (r = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !r) continue;
        if (c = [...r].length, s[3] || s[4]) {
          h += c;
          continue;
        } else if ((s[5] || s[6]) && o % 3 && !((o + c) % 3)) {
          p += c;
          continue;
        }
        if (h -= c, h > 0) continue;
        c = Math.min(c, c + h + p);
        const R = [...s[0]][0].length, I = n.slice(0, o + s.index + R + c);
        if (Math.min(o, c) % 2) {
          const B = I.slice(1, -1);
          return {
            type: "em",
            raw: I,
            text: B,
            tokens: this.lexer.inlineTokens(B)
          };
        }
        const $ = I.slice(2, -2);
        return {
          type: "strong",
          raw: I,
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
      const s = this.rules.other.nonSpaceChar.test(t), i = this.rules.other.startingSpaceChar.test(t) && this.rules.other.endingSpaceChar.test(t);
      return s && i && (t = t.substring(1, t.length - 1)), {
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
      let t, s;
      return e[2] === "@" ? (t = e[1], s = "mailto:" + t) : (t = e[1], s = t), {
        type: "link",
        raw: e[0],
        text: t,
        href: s,
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
    let e;
    if (e = this.rules.inline.url.exec(n)) {
      let t, s;
      if (e[2] === "@")
        t = e[0], s = "mailto:" + t;
      else {
        let i;
        do
          i = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (i !== e[0]);
        t = e[0], e[1] === "www." ? s = "http://" + e[0] : s = e[0];
      }
      return {
        type: "link",
        raw: e[0],
        text: t,
        href: s,
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
}, Ye = class Pi {
  tokens;
  options;
  state;
  tokenizer;
  inlineQueue;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || St, this.options.tokenizer = this.options.tokenizer || new Qn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const t = {
      other: de,
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
    return new Pi(t).lex(e);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(e, t) {
    return new Pi(t).inlineTokens(e);
  }
  /**
   * Preprocessing
   */
  lex(e) {
    e = e.replace(de.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      const s = this.inlineQueue[t];
      this.inlineTokens(s.src, s.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], s = !1) {
    for (this.options.pedantic && (e = e.replace(de.tabCharGlobal, "    ").replace(de.spaceLine, "")); e; ) {
      let i;
      if (this.options.extensions?.block?.some((r) => (i = r.call({ lexer: this }, e, t)) ? (e = e.substring(i.raw.length), t.push(i), !0) : !1))
        continue;
      if (i = this.tokenizer.space(e)) {
        e = e.substring(i.raw.length);
        const r = t.at(-1);
        i.raw.length === 1 && r !== void 0 ? r.raw += `
` : t.push(i);
        continue;
      }
      if (i = this.tokenizer.code(e)) {
        e = e.substring(i.raw.length);
        const r = t.at(-1);
        r?.type === "paragraph" || r?.type === "text" ? (r.raw += `
` + i.raw, r.text += `
` + i.text, this.inlineQueue.at(-1).src = r.text) : t.push(i);
        continue;
      }
      if (i = this.tokenizer.fences(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (i = this.tokenizer.heading(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (i = this.tokenizer.hr(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (i = this.tokenizer.blockquote(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (i = this.tokenizer.list(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (i = this.tokenizer.html(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (i = this.tokenizer.def(e)) {
        e = e.substring(i.raw.length);
        const r = t.at(-1);
        r?.type === "paragraph" || r?.type === "text" ? (r.raw += `
` + i.raw, r.text += `
` + i.raw, this.inlineQueue.at(-1).src = r.text) : this.tokens.links[i.tag] || (this.tokens.links[i.tag] = {
          href: i.href,
          title: i.title
        });
        continue;
      }
      if (i = this.tokenizer.table(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (i = this.tokenizer.lheading(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      let o = e;
      if (this.options.extensions?.startBlock) {
        let r = 1 / 0;
        const c = e.slice(1);
        let h;
        this.options.extensions.startBlock.forEach((p) => {
          h = p.call({ lexer: this }, c), typeof h == "number" && h >= 0 && (r = Math.min(r, h));
        }), r < 1 / 0 && r >= 0 && (o = e.substring(0, r + 1));
      }
      if (this.state.top && (i = this.tokenizer.paragraph(o))) {
        const r = t.at(-1);
        s && r?.type === "paragraph" ? (r.raw += `
` + i.raw, r.text += `
` + i.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = r.text) : t.push(i), s = o.length !== e.length, e = e.substring(i.raw.length);
        continue;
      }
      if (i = this.tokenizer.text(e)) {
        e = e.substring(i.raw.length);
        const r = t.at(-1);
        r?.type === "text" ? (r.raw += `
` + i.raw, r.text += `
` + i.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = r.text) : t.push(i);
        continue;
      }
      if (e) {
        const r = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(r);
          break;
        } else
          throw new Error(r);
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
    let s = e, i = null;
    if (this.tokens.links) {
      const c = Object.keys(this.tokens.links);
      if (c.length > 0)
        for (; (i = this.tokenizer.rules.inline.reflinkSearch.exec(s)) != null; )
          c.includes(i[0].slice(i[0].lastIndexOf("[") + 1, -1)) && (s = s.slice(0, i.index) + "[" + "a".repeat(i[0].length - 2) + "]" + s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (i = this.tokenizer.rules.inline.anyPunctuation.exec(s)) != null; )
      s = s.slice(0, i.index) + "++" + s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (i = this.tokenizer.rules.inline.blockSkip.exec(s)) != null; )
      s = s.slice(0, i.index) + "[" + "a".repeat(i[0].length - 2) + "]" + s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    let o = !1, r = "";
    for (; e; ) {
      o || (r = ""), o = !1;
      let c;
      if (this.options.extensions?.inline?.some((p) => (c = p.call({ lexer: this }, e, t)) ? (e = e.substring(c.raw.length), t.push(c), !0) : !1))
        continue;
      if (c = this.tokenizer.escape(e)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (c = this.tokenizer.tag(e)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (c = this.tokenizer.link(e)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (c = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(c.raw.length);
        const p = t.at(-1);
        c.type === "text" && p?.type === "text" ? (p.raw += c.raw, p.text += c.text) : t.push(c);
        continue;
      }
      if (c = this.tokenizer.emStrong(e, s, r)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (c = this.tokenizer.codespan(e)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (c = this.tokenizer.br(e)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (c = this.tokenizer.del(e)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (c = this.tokenizer.autolink(e)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (!this.state.inLink && (c = this.tokenizer.url(e))) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      let h = e;
      if (this.options.extensions?.startInline) {
        let p = 1 / 0;
        const S = e.slice(1);
        let R;
        this.options.extensions.startInline.forEach((I) => {
          R = I.call({ lexer: this }, S), typeof R == "number" && R >= 0 && (p = Math.min(p, R));
        }), p < 1 / 0 && p >= 0 && (h = e.substring(0, p + 1));
      }
      if (c = this.tokenizer.inlineText(h)) {
        e = e.substring(c.raw.length), c.raw.slice(-1) !== "_" && (r = c.raw.slice(-1)), o = !0;
        const p = t.at(-1);
        p?.type === "text" ? (p.raw += c.raw, p.text += c.text) : t.push(c);
        continue;
      }
      if (e) {
        const p = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(p);
          break;
        } else
          throw new Error(p);
      }
    }
    return t;
  }
}, Jn = class {
  options;
  parser;
  // set by the parser
  constructor(n) {
    this.options = n || St;
  }
  space(n) {
    return "";
  }
  code({ text: n, lang: e, escaped: t }) {
    const s = (e || "").match(de.notSpaceStart)?.[0], i = n.replace(de.endingNewline, "") + `
`;
    return s ? '<pre><code class="language-' + Ue(s) + '">' + (t ? i : Ue(i, !0)) + `</code></pre>
` : "<pre><code>" + (t ? i : Ue(i, !0)) + `</code></pre>
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
    let s = "";
    for (let r = 0; r < n.items.length; r++) {
      const c = n.items[r];
      s += this.listitem(c);
    }
    const i = e ? "ol" : "ul", o = e && t !== 1 ? ' start="' + t + '"' : "";
    return "<" + i + o + `>
` + s + "</" + i + `>
`;
  }
  listitem(n) {
    let e = "";
    if (n.task) {
      const t = this.checkbox({ checked: !!n.checked });
      n.loose ? n.tokens[0]?.type === "paragraph" ? (n.tokens[0].text = t + " " + n.tokens[0].text, n.tokens[0].tokens && n.tokens[0].tokens.length > 0 && n.tokens[0].tokens[0].type === "text" && (n.tokens[0].tokens[0].text = t + " " + Ue(n.tokens[0].tokens[0].text), n.tokens[0].tokens[0].escaped = !0)) : n.tokens.unshift({
        type: "text",
        raw: t + " ",
        text: t + " ",
        escaped: !0
      }) : e += t + " ";
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
    for (let i = 0; i < n.header.length; i++)
      t += this.tablecell(n.header[i]);
    e += this.tablerow({ text: t });
    let s = "";
    for (let i = 0; i < n.rows.length; i++) {
      const o = n.rows[i];
      t = "";
      for (let r = 0; r < o.length; r++)
        t += this.tablecell(o[r]);
      s += this.tablerow({ text: t });
    }
    return s && (s = `<tbody>${s}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + s + `</table>
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
    return `<code>${Ue(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: e, tokens: t }) {
    const s = this.parser.parseInline(t), i = us(n);
    if (i === null)
      return s;
    n = i;
    let o = '<a href="' + n + '"';
    return e && (o += ' title="' + Ue(e) + '"'), o += ">" + s + "</a>", o;
  }
  image({ href: n, title: e, text: t, tokens: s }) {
    s && (t = this.parser.parseInline(s, this.parser.textRenderer));
    const i = us(n);
    if (i === null)
      return Ue(t);
    n = i;
    let o = `<img src="${n}" alt="${t}"`;
    return e && (o += ` title="${Ue(e)}"`), o += ">", o;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : Ue(n.text);
  }
}, Qi = class {
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
}, Ze = class Ni {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || St, this.options.renderer = this.options.renderer || new Jn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Qi();
  }
  /**
   * Static Parse Method
   */
  static parse(e, t) {
    return new Ni(t).parse(e);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(e, t) {
    return new Ni(t).parseInline(e);
  }
  /**
   * Parse Loop
   */
  parse(e, t = !0) {
    let s = "";
    for (let i = 0; i < e.length; i++) {
      const o = e[i];
      if (this.options.extensions?.renderers?.[o.type]) {
        const c = o, h = this.options.extensions.renderers[c.type].call({ parser: this }, c);
        if (h !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(c.type)) {
          s += h || "";
          continue;
        }
      }
      const r = o;
      switch (r.type) {
        case "space": {
          s += this.renderer.space(r);
          continue;
        }
        case "hr": {
          s += this.renderer.hr(r);
          continue;
        }
        case "heading": {
          s += this.renderer.heading(r);
          continue;
        }
        case "code": {
          s += this.renderer.code(r);
          continue;
        }
        case "table": {
          s += this.renderer.table(r);
          continue;
        }
        case "blockquote": {
          s += this.renderer.blockquote(r);
          continue;
        }
        case "list": {
          s += this.renderer.list(r);
          continue;
        }
        case "html": {
          s += this.renderer.html(r);
          continue;
        }
        case "paragraph": {
          s += this.renderer.paragraph(r);
          continue;
        }
        case "text": {
          let c = r, h = this.renderer.text(c);
          for (; i + 1 < e.length && e[i + 1].type === "text"; )
            c = e[++i], h += `
` + this.renderer.text(c);
          t ? s += this.renderer.paragraph({
            type: "paragraph",
            raw: h,
            text: h,
            tokens: [{ type: "text", raw: h, text: h, escaped: !0 }]
          }) : s += h;
          continue;
        }
        default: {
          const c = 'Token with "' + r.type + '" type was not found.';
          if (this.options.silent)
            return console.error(c), "";
          throw new Error(c);
        }
      }
    }
    return s;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(e, t = this.renderer) {
    let s = "";
    for (let i = 0; i < e.length; i++) {
      const o = e[i];
      if (this.options.extensions?.renderers?.[o.type]) {
        const c = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (c !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(o.type)) {
          s += c || "";
          continue;
        }
      }
      const r = o;
      switch (r.type) {
        case "escape": {
          s += t.text(r);
          break;
        }
        case "html": {
          s += t.html(r);
          break;
        }
        case "link": {
          s += t.link(r);
          break;
        }
        case "image": {
          s += t.image(r);
          break;
        }
        case "strong": {
          s += t.strong(r);
          break;
        }
        case "em": {
          s += t.em(r);
          break;
        }
        case "codespan": {
          s += t.codespan(r);
          break;
        }
        case "br": {
          s += t.br(r);
          break;
        }
        case "del": {
          s += t.del(r);
          break;
        }
        case "text": {
          s += t.text(r);
          break;
        }
        default: {
          const c = 'Token with "' + r.type + '" type was not found.';
          if (this.options.silent)
            return console.error(c), "";
          throw new Error(c);
        }
      }
    }
    return s;
  }
}, Xn = class {
  options;
  block;
  constructor(n) {
    this.options = n || St;
  }
  static passThroughHooks = /* @__PURE__ */ new Set([
    "preprocess",
    "postprocess",
    "processAllTokens"
  ]);
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
    return this.block ? Ye.lex : Ye.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? Ze.parse : Ze.parseInline;
  }
}, ho = class {
  defaults = ji();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = Ze;
  Renderer = Jn;
  TextRenderer = Qi;
  Lexer = Ye;
  Tokenizer = Qn;
  Hooks = Xn;
  constructor(...n) {
    this.use(...n);
  }
  /**
   * Run callback for every token
   */
  walkTokens(n, e) {
    let t = [];
    for (const s of n)
      switch (t = t.concat(e.call(this, s)), s.type) {
        case "table": {
          const i = s;
          for (const o of i.header)
            t = t.concat(this.walkTokens(o.tokens, e));
          for (const o of i.rows)
            for (const r of o)
              t = t.concat(this.walkTokens(r.tokens, e));
          break;
        }
        case "list": {
          const i = s;
          t = t.concat(this.walkTokens(i.items, e));
          break;
        }
        default: {
          const i = s;
          this.defaults.extensions?.childTokens?.[i.type] ? this.defaults.extensions.childTokens[i.type].forEach((o) => {
            const r = i[o].flat(1 / 0);
            t = t.concat(this.walkTokens(r, e));
          }) : i.tokens && (t = t.concat(this.walkTokens(i.tokens, e)));
        }
      }
    return t;
  }
  use(...n) {
    const e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return n.forEach((t) => {
      const s = { ...t };
      if (s.async = this.defaults.async || s.async || !1, t.extensions && (t.extensions.forEach((i) => {
        if (!i.name)
          throw new Error("extension name required");
        if ("renderer" in i) {
          const o = e.renderers[i.name];
          o ? e.renderers[i.name] = function(...r) {
            let c = i.renderer.apply(this, r);
            return c === !1 && (c = o.apply(this, r)), c;
          } : e.renderers[i.name] = i.renderer;
        }
        if ("tokenizer" in i) {
          if (!i.level || i.level !== "block" && i.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          const o = e[i.level];
          o ? o.unshift(i.tokenizer) : e[i.level] = [i.tokenizer], i.start && (i.level === "block" ? e.startBlock ? e.startBlock.push(i.start) : e.startBlock = [i.start] : i.level === "inline" && (e.startInline ? e.startInline.push(i.start) : e.startInline = [i.start]));
        }
        "childTokens" in i && i.childTokens && (e.childTokens[i.name] = i.childTokens);
      }), s.extensions = e), t.renderer) {
        const i = this.defaults.renderer || new Jn(this.defaults);
        for (const o in t.renderer) {
          if (!(o in i))
            throw new Error(`renderer '${o}' does not exist`);
          if (["options", "parser"].includes(o))
            continue;
          const r = o, c = t.renderer[r], h = i[r];
          i[r] = (...p) => {
            let S = c.apply(i, p);
            return S === !1 && (S = h.apply(i, p)), S || "";
          };
        }
        s.renderer = i;
      }
      if (t.tokenizer) {
        const i = this.defaults.tokenizer || new Qn(this.defaults);
        for (const o in t.tokenizer) {
          if (!(o in i))
            throw new Error(`tokenizer '${o}' does not exist`);
          if (["options", "rules", "lexer"].includes(o))
            continue;
          const r = o, c = t.tokenizer[r], h = i[r];
          i[r] = (...p) => {
            let S = c.apply(i, p);
            return S === !1 && (S = h.apply(i, p)), S;
          };
        }
        s.tokenizer = i;
      }
      if (t.hooks) {
        const i = this.defaults.hooks || new Xn();
        for (const o in t.hooks) {
          if (!(o in i))
            throw new Error(`hook '${o}' does not exist`);
          if (["options", "block"].includes(o))
            continue;
          const r = o, c = t.hooks[r], h = i[r];
          Xn.passThroughHooks.has(o) ? i[r] = (p) => {
            if (this.defaults.async)
              return Promise.resolve(c.call(i, p)).then((R) => h.call(i, R));
            const S = c.call(i, p);
            return h.call(i, S);
          } : i[r] = (...p) => {
            let S = c.apply(i, p);
            return S === !1 && (S = h.apply(i, p)), S;
          };
        }
        s.hooks = i;
      }
      if (t.walkTokens) {
        const i = this.defaults.walkTokens, o = t.walkTokens;
        s.walkTokens = function(r) {
          let c = [];
          return c.push(o.call(this, r)), i && (c = c.concat(i.call(this, r))), c;
        };
      }
      this.defaults = { ...this.defaults, ...s };
    }), this;
  }
  setOptions(n) {
    return this.defaults = { ...this.defaults, ...n }, this;
  }
  lexer(n, e) {
    return Ye.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return Ze.parse(n, e ?? this.defaults);
  }
  parseMarkdown(n) {
    return (t, s) => {
      const i = { ...s }, o = { ...this.defaults, ...i }, r = this.onError(!!o.silent, !!o.async);
      if (this.defaults.async === !0 && i.async === !1)
        return r(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null)
        return r(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string")
        return r(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      o.hooks && (o.hooks.options = o, o.hooks.block = n);
      const c = o.hooks ? o.hooks.provideLexer() : n ? Ye.lex : Ye.lexInline, h = o.hooks ? o.hooks.provideParser() : n ? Ze.parse : Ze.parseInline;
      if (o.async)
        return Promise.resolve(o.hooks ? o.hooks.preprocess(t) : t).then((p) => c(p, o)).then((p) => o.hooks ? o.hooks.processAllTokens(p) : p).then((p) => o.walkTokens ? Promise.all(this.walkTokens(p, o.walkTokens)).then(() => p) : p).then((p) => h(p, o)).then((p) => o.hooks ? o.hooks.postprocess(p) : p).catch(r);
      try {
        o.hooks && (t = o.hooks.preprocess(t));
        let p = c(t, o);
        o.hooks && (p = o.hooks.processAllTokens(p)), o.walkTokens && this.walkTokens(p, o.walkTokens);
        let S = h(p, o);
        return o.hooks && (S = o.hooks.postprocess(S)), S;
      } catch (p) {
        return r(p);
      }
    };
  }
  onError(n, e) {
    return (t) => {
      if (t.message += `
Please report this to https://github.com/markedjs/marked.`, n) {
        const s = "<p>An error occurred:</p><pre>" + Ue(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(s) : s;
      }
      if (e)
        return Promise.reject(t);
      throw t;
    };
  }
}, _t = new ho();
function j(n, e) {
  return _t.parse(n, e);
}
j.options = j.setOptions = function(n) {
  return _t.setOptions(n), j.defaults = _t.defaults, Hs(j.defaults), j;
};
j.getDefaults = ji;
j.defaults = St;
j.use = function(...n) {
  return _t.use(...n), j.defaults = _t.defaults, Hs(j.defaults), j;
};
j.walkTokens = function(n, e) {
  return _t.walkTokens(n, e);
};
j.parseInline = _t.parseInline;
j.Parser = Ze;
j.parser = Ze.parse;
j.Renderer = Jn;
j.TextRenderer = Qi;
j.Lexer = Ye;
j.lexer = Ye.lex;
j.Tokenizer = Qn;
j.Hooks = Xn;
j.parse = j;
j.options;
j.setOptions;
j.use;
j.walkTokens;
j.parseInline;
Ze.parse;
Ye.lex;
/*! @license DOMPurify 3.2.6 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.6/LICENSE */
const {
  entries: Qs,
  setPrototypeOf: ps,
  isFrozen: po,
  getPrototypeOf: fo,
  getOwnPropertyDescriptor: go
} = Object;
let {
  freeze: pe,
  seal: Ce,
  create: Js
} = Object, {
  apply: Bi,
  construct: Ui
} = typeof Reflect < "u" && Reflect;
pe || (pe = function(e) {
  return e;
});
Ce || (Ce = function(e) {
  return e;
});
Bi || (Bi = function(e, t, s) {
  return e.apply(t, s);
});
Ui || (Ui = function(e, t) {
  return new e(...t);
});
const Vn = fe(Array.prototype.forEach), mo = fe(Array.prototype.lastIndexOf), fs = fe(Array.prototype.pop), on = fe(Array.prototype.push), wo = fe(Array.prototype.splice), Yn = fe(String.prototype.toLowerCase), bi = fe(String.prototype.toString), gs = fe(String.prototype.match), an = fe(String.prototype.replace), bo = fe(String.prototype.indexOf), xo = fe(String.prototype.trim), Le = fe(Object.prototype.hasOwnProperty), he = fe(RegExp.prototype.test), ln = yo(TypeError);
function fe(n) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, s = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
      s[i - 1] = arguments[i];
    return Bi(n, e, s);
  };
}
function yo(n) {
  return function() {
    for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++)
      t[s] = arguments[s];
    return Ui(n, t);
  };
}
function z(n, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Yn;
  ps && ps(n, null);
  let s = e.length;
  for (; s--; ) {
    let i = e[s];
    if (typeof i == "string") {
      const o = t(i);
      o !== i && (po(e) || (e[s] = o), i = o);
    }
    n[i] = !0;
  }
  return n;
}
function vo(n) {
  for (let e = 0; e < n.length; e++)
    Le(n, e) || (n[e] = null);
  return n;
}
function qe(n) {
  const e = Js(null);
  for (const [t, s] of Qs(n))
    Le(n, t) && (Array.isArray(s) ? e[t] = vo(s) : s && typeof s == "object" && s.constructor === Object ? e[t] = qe(s) : e[t] = s);
  return e;
}
function cn(n, e) {
  for (; n !== null; ) {
    const s = go(n, e);
    if (s) {
      if (s.get)
        return fe(s.get);
      if (typeof s.value == "function")
        return fe(s.value);
    }
    n = fo(n);
  }
  function t() {
    return null;
  }
  return t;
}
const ms = pe(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), xi = pe(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), yi = pe(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), ko = pe(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), vi = pe(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), _o = pe(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), ws = pe(["#text"]), bs = pe(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), ki = pe(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), xs = pe(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Fn = pe(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Eo = Ce(/\{\{[\w\W]*|[\w\W]*\}\}/gm), So = Ce(/<%[\w\W]*|[\w\W]*%>/gm), To = Ce(/\$\{[\w\W]*/gm), Ao = Ce(/^data-[\-\w.\u00B7-\uFFFF]+$/), Co = Ce(/^aria-[\-\w]+$/), er = Ce(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Ro = Ce(/^(?:\w+script|data):/i), Oo = Ce(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), tr = Ce(/^html$/i), Mo = Ce(/^[a-z][.\w]*(-[.\w]+)+$/i);
var ys = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: Co,
  ATTR_WHITESPACE: Oo,
  CUSTOM_ELEMENT: Mo,
  DATA_ATTR: Ao,
  DOCTYPE_NAME: tr,
  ERB_EXPR: So,
  IS_ALLOWED_URI: er,
  IS_SCRIPT_OR_DATA: Ro,
  MUSTACHE_EXPR: Eo,
  TMPLIT_EXPR: To
});
const un = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, Lo = function() {
  return typeof window > "u" ? null : window;
}, Io = function(e, t) {
  if (typeof e != "object" || typeof e.createPolicy != "function")
    return null;
  let s = null;
  const i = "data-tt-policy-suffix";
  t && t.hasAttribute(i) && (s = t.getAttribute(i));
  const o = "dompurify" + (s ? "#" + s : "");
  try {
    return e.createPolicy(o, {
      createHTML(r) {
        return r;
      },
      createScriptURL(r) {
        return r;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + o + " could not be created."), null;
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
function nr() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Lo();
  const e = (T) => nr(T);
  if (e.version = "3.2.6", e.removed = [], !n || !n.document || n.document.nodeType !== un.document || !n.Element)
    return e.isSupported = !1, e;
  let {
    document: t
  } = n;
  const s = t, i = s.currentScript, {
    DocumentFragment: o,
    HTMLTemplateElement: r,
    Node: c,
    Element: h,
    NodeFilter: p,
    NamedNodeMap: S = n.NamedNodeMap || n.MozNamedAttrMap,
    HTMLFormElement: R,
    DOMParser: I,
    trustedTypes: $
  } = n, B = h.prototype, M = cn(B, "cloneNode"), ye = cn(B, "remove"), ve = cn(B, "nextSibling"), ae = cn(B, "childNodes"), ge = cn(B, "parentNode");
  if (typeof r == "function") {
    const T = t.createElement("template");
    T.content && T.content.ownerDocument && (t = T.content.ownerDocument);
  }
  let ee, Re = "";
  const {
    implementation: Ve,
    createNodeIterator: De,
    createDocumentFragment: Ft,
    getElementsByTagName: _n
  } = t, {
    importNode: En
  } = s;
  let oe = vs();
  e.isSupported = typeof Qs == "function" && typeof ge == "function" && Ve && Ve.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: jt,
    ERB_EXPR: Gt,
    TMPLIT_EXPR: Fe,
    DATA_ATTR: li,
    ARIA_ATTR: ci,
    IS_SCRIPT_OR_DATA: ui,
    ATTR_WHITESPACE: ht,
    CUSTOM_ELEMENT: hi
  } = ys;
  let {
    IS_ALLOWED_URI: Sn
  } = ys, te = null;
  const Tn = z({}, [...ms, ...xi, ...yi, ...vi, ...ws]);
  let ie = null;
  const An = z({}, [...bs, ...ki, ...xs, ...Fn]);
  let Q = Object.seal(Js(null, {
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
  })), dt = null, Wt = null, Cn = !0, Rn = !0, pt = !1, On = !0, et = !1, Tt = !0, je = !1, qt = !1, Xt = !1, tt = !1, At = !1, Ct = !1, Yt = !0, Mn = !1;
  const di = "user-content-";
  let Rt = !0, ke = !1, Ge = {}, _e = null;
  const ft = z({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let Zt = null;
  const Ln = z({}, ["audio", "video", "img", "source", "image", "track"]);
  let Kt = null;
  const In = z({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Ot = "http://www.w3.org/1998/Math/MathML", Mt = "http://www.w3.org/2000/svg", Te = "http://www.w3.org/1999/xhtml";
  let nt = Te, Qt = !1, Jt = null;
  const en = z({}, [Ot, Mt, Te], bi);
  let gt = z({}, ["mi", "mo", "mn", "ms", "mtext"]), mt = z({}, ["annotation-xml"]);
  const pi = z({}, ["title", "style", "font", "a", "script"]);
  let it = null;
  const st = ["application/xhtml+xml", "text/html"], a = "text/html";
  let u = null, y = null;
  const L = t.createElement("form"), K = function(l) {
    return l instanceof RegExp || l instanceof Function;
  }, Z = function() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(y && y === l)) {
      if ((!l || typeof l != "object") && (l = {}), l = qe(l), it = // eslint-disable-next-line unicorn/prefer-includes
      st.indexOf(l.PARSER_MEDIA_TYPE) === -1 ? a : l.PARSER_MEDIA_TYPE, u = it === "application/xhtml+xml" ? bi : Yn, te = Le(l, "ALLOWED_TAGS") ? z({}, l.ALLOWED_TAGS, u) : Tn, ie = Le(l, "ALLOWED_ATTR") ? z({}, l.ALLOWED_ATTR, u) : An, Jt = Le(l, "ALLOWED_NAMESPACES") ? z({}, l.ALLOWED_NAMESPACES, bi) : en, Kt = Le(l, "ADD_URI_SAFE_ATTR") ? z(qe(In), l.ADD_URI_SAFE_ATTR, u) : In, Zt = Le(l, "ADD_DATA_URI_TAGS") ? z(qe(Ln), l.ADD_DATA_URI_TAGS, u) : Ln, _e = Le(l, "FORBID_CONTENTS") ? z({}, l.FORBID_CONTENTS, u) : ft, dt = Le(l, "FORBID_TAGS") ? z({}, l.FORBID_TAGS, u) : qe({}), Wt = Le(l, "FORBID_ATTR") ? z({}, l.FORBID_ATTR, u) : qe({}), Ge = Le(l, "USE_PROFILES") ? l.USE_PROFILES : !1, Cn = l.ALLOW_ARIA_ATTR !== !1, Rn = l.ALLOW_DATA_ATTR !== !1, pt = l.ALLOW_UNKNOWN_PROTOCOLS || !1, On = l.ALLOW_SELF_CLOSE_IN_ATTR !== !1, et = l.SAFE_FOR_TEMPLATES || !1, Tt = l.SAFE_FOR_XML !== !1, je = l.WHOLE_DOCUMENT || !1, tt = l.RETURN_DOM || !1, At = l.RETURN_DOM_FRAGMENT || !1, Ct = l.RETURN_TRUSTED_TYPE || !1, Xt = l.FORCE_BODY || !1, Yt = l.SANITIZE_DOM !== !1, Mn = l.SANITIZE_NAMED_PROPS || !1, Rt = l.KEEP_CONTENT !== !1, ke = l.IN_PLACE || !1, Sn = l.ALLOWED_URI_REGEXP || er, nt = l.NAMESPACE || Te, gt = l.MATHML_TEXT_INTEGRATION_POINTS || gt, mt = l.HTML_INTEGRATION_POINTS || mt, Q = l.CUSTOM_ELEMENT_HANDLING || {}, l.CUSTOM_ELEMENT_HANDLING && K(l.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (Q.tagNameCheck = l.CUSTOM_ELEMENT_HANDLING.tagNameCheck), l.CUSTOM_ELEMENT_HANDLING && K(l.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (Q.attributeNameCheck = l.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), l.CUSTOM_ELEMENT_HANDLING && typeof l.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (Q.allowCustomizedBuiltInElements = l.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), et && (Rn = !1), At && (tt = !0), Ge && (te = z({}, ws), ie = [], Ge.html === !0 && (z(te, ms), z(ie, bs)), Ge.svg === !0 && (z(te, xi), z(ie, ki), z(ie, Fn)), Ge.svgFilters === !0 && (z(te, yi), z(ie, ki), z(ie, Fn)), Ge.mathMl === !0 && (z(te, vi), z(ie, xs), z(ie, Fn))), l.ADD_TAGS && (te === Tn && (te = qe(te)), z(te, l.ADD_TAGS, u)), l.ADD_ATTR && (ie === An && (ie = qe(ie)), z(ie, l.ADD_ATTR, u)), l.ADD_URI_SAFE_ATTR && z(Kt, l.ADD_URI_SAFE_ATTR, u), l.FORBID_CONTENTS && (_e === ft && (_e = qe(_e)), z(_e, l.FORBID_CONTENTS, u)), Rt && (te["#text"] = !0), je && z(te, ["html", "head", "body"]), te.table && (z(te, ["tbody"]), delete dt.tbody), l.TRUSTED_TYPES_POLICY) {
        if (typeof l.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw ln('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof l.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw ln('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        ee = l.TRUSTED_TYPES_POLICY, Re = ee.createHTML("");
      } else
        ee === void 0 && (ee = Io($, i)), ee !== null && typeof Re == "string" && (Re = ee.createHTML(""));
      pe && pe(l), y = l;
    }
  }, E = z({}, [...xi, ...yi, ...ko]), _ = z({}, [...vi, ..._o]), O = function(l) {
    let x = ge(l);
    (!x || !x.tagName) && (x = {
      namespaceURI: nt,
      tagName: "template"
    });
    const k = Yn(l.tagName), q = Yn(x.tagName);
    return Jt[l.namespaceURI] ? l.namespaceURI === Mt ? x.namespaceURI === Te ? k === "svg" : x.namespaceURI === Ot ? k === "svg" && (q === "annotation-xml" || gt[q]) : !!E[k] : l.namespaceURI === Ot ? x.namespaceURI === Te ? k === "math" : x.namespaceURI === Mt ? k === "math" && mt[q] : !!_[k] : l.namespaceURI === Te ? x.namespaceURI === Mt && !mt[q] || x.namespaceURI === Ot && !gt[q] ? !1 : !_[k] && (pi[k] || !E[k]) : !!(it === "application/xhtml+xml" && Jt[l.namespaceURI]) : !1;
  }, V = function(l) {
    on(e.removed, {
      element: l
    });
    try {
      ge(l).removeChild(l);
    } catch {
      ye(l);
    }
  }, W = function(l, x) {
    try {
      on(e.removed, {
        attribute: x.getAttributeNode(l),
        from: x
      });
    } catch {
      on(e.removed, {
        attribute: null,
        from: x
      });
    }
    if (x.removeAttribute(l), l === "is")
      if (tt || At)
        try {
          V(x);
        } catch {
        }
      else
        try {
          x.setAttribute(l, "");
        } catch {
        }
  }, rt = function(l) {
    let x = null, k = null;
    if (Xt)
      l = "<remove></remove>" + l;
    else {
      const J = gs(l, /^[\r\n\t ]+/);
      k = J && J[0];
    }
    it === "application/xhtml+xml" && nt === Te && (l = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + l + "</body></html>");
    const q = ee ? ee.createHTML(l) : l;
    if (nt === Te)
      try {
        x = new I().parseFromString(q, it);
      } catch {
      }
    if (!x || !x.documentElement) {
      x = Ve.createDocument(nt, "template", null);
      try {
        x.documentElement.innerHTML = Qt ? Re : q;
      } catch {
      }
    }
    const se = x.body || x.documentElement;
    return l && k && se.insertBefore(t.createTextNode(k), se.childNodes[0] || null), nt === Te ? _n.call(x, je ? "html" : "body")[0] : je ? x.documentElement : se;
  }, Lt = function(l) {
    return De.call(
      l.ownerDocument || l,
      l,
      // eslint-disable-next-line no-bitwise
      p.SHOW_ELEMENT | p.SHOW_COMMENT | p.SHOW_TEXT | p.SHOW_PROCESSING_INSTRUCTION | p.SHOW_CDATA_SECTION,
      null
    );
  }, wt = function(l) {
    return l instanceof R && (typeof l.nodeName != "string" || typeof l.textContent != "string" || typeof l.removeChild != "function" || !(l.attributes instanceof S) || typeof l.removeAttribute != "function" || typeof l.setAttribute != "function" || typeof l.namespaceURI != "string" || typeof l.insertBefore != "function" || typeof l.hasChildNodes != "function");
  }, Dn = function(l) {
    return typeof c == "function" && l instanceof c;
  };
  function Ee(T, l, x) {
    Vn(T, (k) => {
      k.call(e, l, x, y);
    });
  }
  const Pn = function(l) {
    let x = null;
    if (Ee(oe.beforeSanitizeElements, l, null), wt(l))
      return V(l), !0;
    const k = u(l.nodeName);
    if (Ee(oe.uponSanitizeElement, l, {
      tagName: k,
      allowedTags: te
    }), Tt && l.hasChildNodes() && !Dn(l.firstElementChild) && he(/<[/\w!]/g, l.innerHTML) && he(/<[/\w!]/g, l.textContent) || l.nodeType === un.progressingInstruction || Tt && l.nodeType === un.comment && he(/<[/\w]/g, l.data))
      return V(l), !0;
    if (!te[k] || dt[k]) {
      if (!dt[k] && Bn(k) && (Q.tagNameCheck instanceof RegExp && he(Q.tagNameCheck, k) || Q.tagNameCheck instanceof Function && Q.tagNameCheck(k)))
        return !1;
      if (Rt && !_e[k]) {
        const q = ge(l) || l.parentNode, se = ae(l) || l.childNodes;
        if (se && q) {
          const J = se.length;
          for (let ce = J - 1; ce >= 0; --ce) {
            const Oe = M(se[ce], !0);
            Oe.__removalCount = (l.__removalCount || 0) + 1, q.insertBefore(Oe, ve(l));
          }
        }
      }
      return V(l), !0;
    }
    return l instanceof h && !O(l) || (k === "noscript" || k === "noembed" || k === "noframes") && he(/<\/no(script|embed|frames)/i, l.innerHTML) ? (V(l), !0) : (et && l.nodeType === un.text && (x = l.textContent, Vn([jt, Gt, Fe], (q) => {
      x = an(x, q, " ");
    }), l.textContent !== x && (on(e.removed, {
      element: l.cloneNode()
    }), l.textContent = x)), Ee(oe.afterSanitizeElements, l, null), !1);
  }, Nn = function(l, x, k) {
    if (Yt && (x === "id" || x === "name") && (k in t || k in L))
      return !1;
    if (!(Rn && !Wt[x] && he(li, x))) {
      if (!(Cn && he(ci, x))) {
        if (!ie[x] || Wt[x]) {
          if (
            // First condition does a very basic check if a) it's basically a valid custom element tagname AND
            // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
            !(Bn(l) && (Q.tagNameCheck instanceof RegExp && he(Q.tagNameCheck, l) || Q.tagNameCheck instanceof Function && Q.tagNameCheck(l)) && (Q.attributeNameCheck instanceof RegExp && he(Q.attributeNameCheck, x) || Q.attributeNameCheck instanceof Function && Q.attributeNameCheck(x)) || // Alternative, second condition checks if it's an `is`-attribute, AND
            // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            x === "is" && Q.allowCustomizedBuiltInElements && (Q.tagNameCheck instanceof RegExp && he(Q.tagNameCheck, k) || Q.tagNameCheck instanceof Function && Q.tagNameCheck(k)))
          ) return !1;
        } else if (!Kt[x]) {
          if (!he(Sn, an(k, ht, ""))) {
            if (!((x === "src" || x === "xlink:href" || x === "href") && l !== "script" && bo(k, "data:") === 0 && Zt[l])) {
              if (!(pt && !he(ui, an(k, ht, "")))) {
                if (k)
                  return !1;
              }
            }
          }
        }
      }
    }
    return !0;
  }, Bn = function(l) {
    return l !== "annotation-xml" && gs(l, hi);
  }, tn = function(l) {
    Ee(oe.beforeSanitizeAttributes, l, null);
    const {
      attributes: x
    } = l;
    if (!x || wt(l))
      return;
    const k = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: ie,
      forceKeepAttr: void 0
    };
    let q = x.length;
    for (; q--; ) {
      const se = x[q], {
        name: J,
        namespaceURI: ce,
        value: Oe
      } = se, Pe = u(J), nn = Oe;
      let m = J === "value" ? nn : xo(nn);
      if (k.attrName = Pe, k.attrValue = m, k.keepAttr = !0, k.forceKeepAttr = void 0, Ee(oe.uponSanitizeAttribute, l, k), m = k.attrValue, Mn && (Pe === "id" || Pe === "name") && (W(J, l), m = di + m), Tt && he(/((--!?|])>)|<\/(style|title)/i, m)) {
        W(J, l);
        continue;
      }
      if (k.forceKeepAttr)
        continue;
      if (!k.keepAttr) {
        W(J, l);
        continue;
      }
      if (!On && he(/\/>/i, m)) {
        W(J, l);
        continue;
      }
      et && Vn([jt, Gt, Fe], (U) => {
        m = an(m, U, " ");
      });
      const A = u(l.nodeName);
      if (!Nn(A, Pe, m)) {
        W(J, l);
        continue;
      }
      if (ee && typeof $ == "object" && typeof $.getAttributeType == "function" && !ce)
        switch ($.getAttributeType(A, Pe)) {
          case "TrustedHTML": {
            m = ee.createHTML(m);
            break;
          }
          case "TrustedScriptURL": {
            m = ee.createScriptURL(m);
            break;
          }
        }
      if (m !== nn)
        try {
          ce ? l.setAttributeNS(ce, J, m) : l.setAttribute(J, m), wt(l) ? V(l) : fs(e.removed);
        } catch {
          W(J, l);
        }
    }
    Ee(oe.afterSanitizeAttributes, l, null);
  }, It = function T(l) {
    let x = null;
    const k = Lt(l);
    for (Ee(oe.beforeSanitizeShadowDOM, l, null); x = k.nextNode(); )
      Ee(oe.uponSanitizeShadowNode, x, null), Pn(x), tn(x), x.content instanceof o && T(x.content);
    Ee(oe.afterSanitizeShadowDOM, l, null);
  };
  return e.sanitize = function(T) {
    let l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, x = null, k = null, q = null, se = null;
    if (Qt = !T, Qt && (T = "<!-->"), typeof T != "string" && !Dn(T))
      if (typeof T.toString == "function") {
        if (T = T.toString(), typeof T != "string")
          throw ln("dirty is not a string, aborting");
      } else
        throw ln("toString is not a function");
    if (!e.isSupported)
      return T;
    if (qt || Z(l), e.removed = [], typeof T == "string" && (ke = !1), ke) {
      if (T.nodeName) {
        const Oe = u(T.nodeName);
        if (!te[Oe] || dt[Oe])
          throw ln("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (T instanceof c)
      x = rt("<!---->"), k = x.ownerDocument.importNode(T, !0), k.nodeType === un.element && k.nodeName === "BODY" || k.nodeName === "HTML" ? x = k : x.appendChild(k);
    else {
      if (!tt && !et && !je && // eslint-disable-next-line unicorn/prefer-includes
      T.indexOf("<") === -1)
        return ee && Ct ? ee.createHTML(T) : T;
      if (x = rt(T), !x)
        return tt ? null : Ct ? Re : "";
    }
    x && Xt && V(x.firstChild);
    const J = Lt(ke ? T : x);
    for (; q = J.nextNode(); )
      Pn(q), tn(q), q.content instanceof o && It(q.content);
    if (ke)
      return T;
    if (tt) {
      if (At)
        for (se = Ft.call(x.ownerDocument); x.firstChild; )
          se.appendChild(x.firstChild);
      else
        se = x;
      return (ie.shadowroot || ie.shadowrootmode) && (se = En.call(s, se, !0)), se;
    }
    let ce = je ? x.outerHTML : x.innerHTML;
    return je && te["!doctype"] && x.ownerDocument && x.ownerDocument.doctype && x.ownerDocument.doctype.name && he(tr, x.ownerDocument.doctype.name) && (ce = "<!DOCTYPE " + x.ownerDocument.doctype.name + `>
` + ce), et && Vn([jt, Gt, Fe], (Oe) => {
      ce = an(ce, Oe, " ");
    }), ee && Ct ? ee.createHTML(ce) : ce;
  }, e.setConfig = function() {
    let T = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    Z(T), qt = !0;
  }, e.clearConfig = function() {
    y = null, qt = !1;
  }, e.isValidAttribute = function(T, l, x) {
    y || Z({});
    const k = u(T), q = u(l);
    return Nn(k, q, x);
  }, e.addHook = function(T, l) {
    typeof l == "function" && on(oe[T], l);
  }, e.removeHook = function(T, l) {
    if (l !== void 0) {
      const x = mo(oe[T], l);
      return x === -1 ? void 0 : wo(oe[T], x, 1)[0];
    }
    return fs(oe[T]);
  }, e.removeHooks = function(T) {
    oe[T] = [];
  }, e.removeAllHooks = function() {
    oe = vs();
  }, e;
}
var ks = nr();
function Et(n) {
  const e = performance.timeOrigin + n;
  return new Date(e).toISOString();
}
function ir(n, e) {
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
  let s = j.parse(n.text);
  return s instanceof Promise ? s.then((i) => {
    t.innerHTML = ks.sanitize(i);
  }) : t.innerHTML = ks.sanitize(s), t;
}
class Do {
  constructor(e, t, s, i) {
    this.tArmed = null, this.cardView = s;
    const o = (r) => {
      if (!this.tArmed)
        return;
      const c = i.getBoardLocationFromMouseEvent(r), h = {
        sensor_id: e,
        action_type: "ClickAction",
        click_x: c.x,
        click_y: c.y,
        timestamp_action: Et(performance.now())
      };
      t(h);
    };
    s.addClickCallback(o);
  }
  arm() {
    this.cardView.root.classList.add("card--clickable"), this.tArmed = performance.now(), this.cardView.setInteractivity(!0);
  }
  destroy() {
    this.cardView.root.classList.remove("card--clickable"), this.tArmed = null, this.cardView.setInteractivity(!1);
  }
}
class Po {
  constructor(e, t, s) {
    this.tArmed = null, this.cardView = s, s.addDoneCallback(
      () => {
        if (!this.tArmed)
          return;
        const i = {
          sensor_id: e,
          action_type: "DoneAction",
          timestamp_action: Et(performance.now())
        };
        t(i);
      }
    );
  }
  arm() {
    this.tArmed = performance.now(), this.cardView.setInteractivity(!0);
  }
  destroy() {
    this.tArmed = null, this.cardView.setInteractivity(!1);
  }
}
class No {
  constructor(e, t) {
    this.sensorId = e, this.onSensorFired = t;
  }
  arm() {
    const e = {
      sensor_id: this.sensorId,
      action_type: "TimeoutAction",
      timestamp_action: Et(performance.now())
    };
    this.onSensorFired(e);
  }
  destroy() {
  }
}
class Bo {
  constructor(e, t, s) {
    this.tArmed = null, this.onKeyPress = (i) => {
      if (!this.tArmed)
        return;
      i.preventDefault();
      let o = i.key;
      if (!this.keys.includes(o))
        return;
      const r = {
        sensor_id: this.sensorId,
        action_type: "KeyAction",
        key: o,
        timestamp_action: Et(performance.now())
      };
      this.onSensorFired(r);
    }, this.sensorId = e, this.onSensorFired = t, this.keys = [s], document.addEventListener("keydown", this.onKeyPress);
  }
  arm() {
    this.tArmed = performance.now();
  }
  destroy() {
    this.tArmed = null, document.removeEventListener("keydown", this.onKeyPress);
  }
}
function Uo(n) {
  if (!("addClickCallback" in n))
    throw new Error("CardView is not clickable");
}
function zo(n) {
  if (!("addDoneCallback" in n))
    throw new Error("CardView is not doneable");
}
class $o extends Ht {
  async prepare() {
    this.button = document.createElement("button"), this.button.classList.add("fixation-point");
    const e = document.createElement("div");
    e.className = "fixation-point-cross--horizontal", this.button.appendChild(e);
    const t = document.createElement("div");
    t.className = "fixation-point-cross--vertical", this.button.appendChild(t), this.root.appendChild(this.button);
  }
  addClickCallback(e) {
    if (!this.button)
      throw new Error("Button not initialized. Did you forget to call load()?");
    this.button.addEventListener("click", (t) => {
      e(t);
    });
  }
}
class Ho extends Ht {
  constructor() {
    super(...arguments), this.pageIndex = 0, this.onPressDone = null, this.contentPages = [];
  }
  async prepare() {
    const e = this.card, t = this.boardCoords;
    if (e.pages.length === 0)
      throw new Error("No pages provided to MarkdownPagesViewer");
    const s = document.createElement("div");
    s.classList.add("markdown-pages-viewer"), this.root.appendChild(s), this.viewerDiv = document.createElement("div"), this.viewerDiv.classList.add("markdown-pages-viewer__window"), s.appendChild(this.viewerDiv), this.contentPages = [];
    for (const o of e.pages) {
      const r = {
        text: o,
        textColor: e.text_color,
        fontSize: e.font_size,
        justificationHorizontal: e.justification_horizontal,
        justificationVertical: e.justification_vertical
      }, c = ir(
        r,
        (h) => t.getSizePx(h) + "px"
      );
      this.contentPages.push(c);
    }
    let i = document.createElement("div");
    i.classList.add("nav-tray"), s.appendChild(i), this.navButtons = new Vo(), this.navButtons.mount(i), this.doneButton = new zi("Done"), this.doneButton.mount(i), this.goToPage(0), this.navButtons.addButtonPressListeners(
      () => this.handleBack(),
      () => this.handleNext()
    ), this.doneButton.addButtonPressListener(() => this.handleDone());
  }
  goToPage(e) {
    const t = this.contentPages.length;
    if (e < 0 || e >= t)
      throw new Error(`goToPage: index ${e} outside [0, ${t - 1}]`);
    if (!this.viewerDiv)
      throw new Error("Viewer div not initialized. Did you forget to call load()?");
    for (const s of this.contentPages)
      s.isConnected || this.viewerDiv.insertBefore(s, this.viewerDiv.lastElementChild);
    this.contentPages.forEach((s, i) => {
      s.style.display = i === e ? "block" : "none";
    }), this.pageIndex = e, this.setButtonStates();
  }
  handleBack() {
    this.pageIndex > 0 && this.goToPage(this.pageIndex - 1);
  }
  handleNext() {
    this.pageIndex < this.contentPages.length - 1 && this.goToPage(this.pageIndex + 1);
  }
  handleDone() {
    this.onPressDone?.();
  }
  setButtonStates() {
    if (!this.navButtons || !this.doneButton)
      throw new Error("Navigation buttons or Done button not initialized. Did you forget to call load()?");
    const e = this.contentPages.length;
    this.navButtons.setButtonStates(
      this.pageIndex > 0,
      // Back button enabled if not on first page
      this.pageIndex < e - 1
      // Next button enabled if not on last page
    ), this.pageIndex === e - 1 ? this.doneButton.enable() : this.doneButton.disable();
  }
  addDoneCallback(e) {
    this.onPressDone = () => {
      e();
    };
  }
}
class Vo extends xe {
  constructor() {
    super(), this.root = document.createElement("div"), this.lastButton = new zi("←"), this.lastButton.mount(this.root), this.nextButton = new zi("→"), this.nextButton.mount(this.root);
  }
  addButtonPressListeners(e, t) {
    if (!this.nextButton || !this.lastButton)
      throw new Error("Navigation button(s) not found");
    this.nextButton.addButtonPressListener(t), this.lastButton.addButtonPressListener(e);
  }
  setButtonStates(e, t) {
    e ? this.lastButton.enable() : this.lastButton.disable(), t ? this.nextButton.enable() : this.nextButton.disable();
  }
}
class zi extends xe {
  constructor(e) {
    super();
    const t = document.createElement("button");
    t.className = "nav-tray__button", t.textContent = e, this.root = t;
  }
  addButtonPressListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class Fo extends Ht {
  addClickCallback(e) {
    if (!this.imageContainer)
      throw new Error("Image container not initialized. Did you forget to call load()?");
    this.imageContainer.addEventListener("click", (t) => {
      e(t);
    });
  }
  async prepare(e) {
    this.imageContainer = document.createElement("div"), this.imageContainer.classList.add("image-card"), this.root.appendChild(this.imageContainer), this.image = await e.getImage(
      this.card.image_identifier
    ), this.image.classList.add("image-card__content"), this.image.draggable = !1, this.imageContainer.appendChild(this.image);
  }
}
class jo extends Ht {
  async prepare() {
    this.textContainer = document.createElement("div"), this.textContainer.classList.add("text-card"), this.root.appendChild(this.textContainer), this.textContainer.style.backgroundColor = this.card.background_color;
    const e = {
      text: this.card.text,
      textColor: this.card.text_color,
      fontSize: this.card.font_size,
      justificationHorizontal: this.card.justification_horizontal,
      justificationVertical: this.card.justification_vertical
    }, t = ir(
      e,
      (s) => this.boardCoords.getSizePx(s) + "px"
    );
    this.textContainer.appendChild(t);
  }
  addClickCallback(e) {
    if (!this.textContainer)
      throw new Error("Text container not initialized. Did you forget to call load()?");
    this.textContainer.addEventListener("click", (t) => {
      e(t);
    });
  }
}
class Go extends Ht {
  async prepare(e) {
    this.videoContainer = document.createElement("div"), this.videoContainer.classList.add("video-card"), this.root.appendChild(this.videoContainer), this.video = await e.getVideo(
      this.card.video_identifier
    ), this.video.classList.add("video-card__content"), this.videoContainer.appendChild(this.video), this.video.muted = this.card.muted, this.video.loop = this.card.loop, this.video.draggable = !0;
  }
  addClickCallback(e) {
    if (!this.videoContainer)
      throw new Error("Video container not initialized. Did you forget to call load()?");
    this.videoContainer.addEventListener("click", (t) => {
      e(t);
    });
  }
  onStart() {
    if (!this.video)
      throw new Error("Video not initialized. Did you forget to call load()?");
    let e = new Promise((i, o) => {
      setTimeout(() => {
        o(new Error("Video failed to play within 2 frames!"));
      }, 33);
    }), t = new Promise((i, o) => {
      if (!this.video)
        throw new Error("Video not initialized. Did you forget to call load()?");
      this.video.onplaying = () => {
        i(null);
      };
    });
    this.video.play(), Promise.race([t, e]).catch((i) => {
      console.error(i);
    });
  }
  onStop() {
    this.video && (this.video.pause(), this.video.currentTime = 0);
  }
  onDestroy() {
    this.video && (this.video.removeAttribute("src"), this.video.load());
  }
}
class Wo extends Ht {
  async prepare() {
    this.root.style.backgroundColor = this.card.color;
  }
  addClickCallback(e) {
    this.root.addEventListener("click", (t) => {
      e(t);
    });
  }
}
class qo {
  constructor(e, t, s, i) {
    this.boardWidthPx = e, this.boardHeightPx = t, this.boardLeftPx = s, this.boardTopPx = i;
  }
  getUnitPx() {
    return Math.min(this.boardWidthPx, this.boardHeightPx);
  }
  getBoardLocationPx(e, t, s, i) {
    const o = this.getUnitPx(), r = this.boardWidthPx / o, c = this.boardHeightPx / o, h = o * (e - s / 2 + r / 2), p = o * (-t - i / 2 + c / 2);
    return {
      leftPx: h,
      topPx: p
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
    const t = (e.clientX - this.boardLeftPx) / this.boardWidthPx - 0.5, s = -((e.clientY - this.boardTopPx) / this.boardHeightPx - 0.5);
    return {
      x: t,
      y: s
    };
  }
}
class Xo {
  // Map of sensor ID to SensorBinding
  constructor(e, t) {
    this.cardViews = /* @__PURE__ */ new Map(), this.sensorBindings = /* @__PURE__ */ new Map(), this.root = document.createElement("div"), this.root.className = "board-view", this.root.id = `${e}`, this.root.style.width = t.board_width_px + "px", this.root.style.height = t.board_height_px + "px", this.setBoardState(!1, !1);
  }
  getCoordinateSystem() {
    const { width: e, height: t, left: s, top: i } = this.root.getBoundingClientRect();
    return new qo(e, t, s, i);
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
    const s = this.getCoordinateSystem();
    let i = null;
    switch (e.card_type) {
      case "FixationPointCard":
        i = new $o(
          e,
          s
        );
        break;
      case "MarkdownPagesCard":
        i = new Ho(
          e,
          s
        );
        break;
      case "ImageCard":
        i = new Fo(
          e,
          s
        );
        break;
      case "VideoCard":
        i = new Go(
          e,
          s
        );
        break;
      case "TextCard":
        i = new jo(
          e,
          s
        );
        break;
      case "BlankCard":
        i = new Wo(
          e,
          s
        );
        break;
      default:
        throw new Error(`Unsupported Card type: ${e}`);
    }
    await i.prepare(t), this.root.appendChild(i.root), this.cardViews.set(e.card_id, i);
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
    let s = null;
    if (e.sensor_type === "TimeoutSensor")
      s = new No(
        e.sensor_id,
        t
      );
    else if (e.sensor_type === "KeySensor")
      s = new Bo(
        e.sensor_id,
        t,
        e.key
      );
    else if (e.sensor_type == "ClickSensor") {
      let i = this.getCardView(e.card_id);
      Uo(i), s = new Do(
        e.sensor_id,
        t,
        i,
        this.getCoordinateSystem()
      );
    } else if (e.sensor_type == "DoneSensor") {
      let i = this.getCardView(e.card_id);
      zo(i), s = new Po(
        e.sensor_id,
        t,
        i
      );
    } else
      throw new Error(`Unknown Sensor of type ${e.sensor_type}`);
    this.sensorBindings.set(e.sensor_id, s);
  }
  startSensor(e) {
    this.getSensorBinding(e).arm();
  }
  destroySensor(e) {
    this.getSensorBinding(e).destroy(), this.sensorBindings.delete(e);
  }
}
class Yo {
  constructor(e) {
    this.boardViews = /* @__PURE__ */ new Map(), this.activeBoardId = null, this.root = document.createElement("div"), this.root.className = "board-views-ui", this.assetManager = e;
  }
  createBoardView(e, t) {
    if (this.boardViews.has(e))
      return this.getBoardView(e);
    const s = new Xo(e, t);
    return this.boardViews.set(e, s), this.root.appendChild(s.root), s;
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
class Zo {
  constructor() {
    this.urlLookup = {};
  }
  getKey(e, t) {
    return `${e}|${t}`;
  }
  registerAsset(e) {
    let t = e.identifier.sha256, s = e.identifier.mime_type, i = this.getKey(t, s);
    this.urlLookup[i] = e;
  }
  lookupAssetUrl(e) {
    let t = this.getKey(e.sha256, e.mime_type), s = this.urlLookup[t];
    if (!s)
      throw new Error(`Asset not found: ${e.sha256} (${e.mime_type})`);
    return s;
  }
  async getImage(e) {
    let t = this.lookupAssetUrl(e), s = new Image();
    return s.src = t.url, new Promise(
      (i, o) => {
        s.onload = () => i(s), s.onerror = (r) => o(r);
      }
    );
  }
  async getVideo(e) {
    let t = this.lookupAssetUrl(e), s = document.createElement("video");
    s.controls = !1;
    let i = new Promise((o, r) => {
      s.oncanplaythrough = () => {
        o(s);
      }, s.onerror = (c) => r(c);
    });
    return s.src = t.url, s.load(), i;
  }
}
function Ko() {
  const n = document.createElement("div");
  document.body.appendChild(n);
  const e = document.createElement("div");
  e.classList.add("node-engine-container"), n.appendChild(e);
  const t = document.createElement("div");
  t.classList.add("node-engine-content"), e.appendChild(t);
  const s = new Zo(), i = new Yo(
    s
  );
  t.appendChild(i.root);
  const o = new Rr();
  return o.mount(t), {
    boardViewsUI: i,
    shellUI: o,
    assetManager: s
  };
}
class _s {
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
    }, s = this.events.findIndex((i) => i.triggerTimeMsec > t.triggerTimeMsec);
    s === -1 ? this.events.push(t) : this.events.splice(s, 0, t);
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
class Qo {
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
class Es {
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
class Jo {
  constructor(e, t) {
    this.prepared = !1, this.started = !1, this.deferredAction = new Es(), this.deferredOutcomeDone = new Es(), this.boardView = t, this.node = e, this.scheduler = new _s(), this.outcomeSchedulers = {};
  }
  async prepare(e) {
    let t = [];
    for (const i of this.node.cards)
      t.push(
        this.boardView.prepareCard(
          i,
          e
        )
      ), this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: i.t_start,
          triggerFunc: () => {
            this.boardView.startCard(i.card_id);
          }
        }
      ), i.t_end !== null && this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: i.t_end,
          triggerFunc: () => {
            this.boardView.stopCard(i.card_id);
          }
        }
      ), this.scheduler.scheduleOnStop(
        () => {
          this.boardView.destroyCard(i.card_id);
        }
      );
    await Promise.all(t);
    for (const i of this.node.sensors)
      this.boardView.prepareSensor(
        i,
        (o) => this.deferredAction.resolve(o)
      ), this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: i.t_start,
          triggerFunc: () => {
            this.boardView.startSensor(i.sensor_id);
          }
        }
      ), this.scheduler.scheduleOnStop(
        () => {
          this.boardView.destroySensor(i.sensor_id);
        }
      );
    for (const i of this.node.effects) {
      const o = new Qo(this.boardView);
      this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: i.t_start,
          triggerFunc: () => {
            o.start();
          }
        }
      ), i.t_end !== null && this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: i.t_end,
          triggerFunc: () => {
            o.stop();
          }
        }
      ), this.scheduler.scheduleOnStop(
        () => {
          o.stop();
        }
      );
    }
    let s = [];
    for (const i of this.node.outcomes) {
      const o = new _s();
      let r = 0;
      for (const c of i.cards)
        if (s.push(
          this.boardView.prepareCard(
            c,
            e
          )
        ), o.scheduleEvent(
          {
            triggerTimeMsec: c.t_start,
            triggerFunc: () => {
              this.boardView.startCard(c.card_id);
            }
          }
        ), c.t_end !== null)
          o.scheduleEvent(
            {
              triggerTimeMsec: c.t_end,
              triggerFunc: () => {
                this.boardView.stopCard(c.card_id);
              }
            }
          ), c.t_end > r && (r = c.t_end);
        else
          throw new Error(`Consequence Cards must have an end time: ${c.card_id} `);
      o.scheduleEvent(
        {
          triggerTimeMsec: r,
          triggerFunc: () => {
            this.deferredOutcomeDone.resolve();
          }
        }
      ), this.outcomeSchedulers[i.sensor_id] = o;
    }
    await Promise.all(s), this.prepared = !0;
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
    const s = t.sensor_id;
    if (s in this.outcomeSchedulers) {
      const i = this.outcomeSchedulers[s];
      i.start(), await this.deferredOutcomeDone.promise, i.stop();
    }
    return {
      action: t,
      timestamp_start: Et(e),
      timestamp_end: Et(performance.now())
    };
  }
}
class ea {
  constructor(e) {
    this.bufferedNodePlays = /* @__PURE__ */ new Map();
    const { shellUI: t, boardViewsUI: s } = Ko();
    this.shellUI = t, this.boardViewsUI = s, this._boardShape = e;
  }
  async prepare(e) {
    const t = crypto.randomUUID(), s = this.boardViewsUI.createBoardView(t, this._boardShape), i = new Jo(
      e,
      s
    );
    return await i.prepare(this.boardViewsUI.assetManager), this.bufferedNodePlays.set(t, i), t;
  }
  async play(e) {
    const t = this.bufferedNodePlays.get(e);
    if (!t) {
      const i = new Error(`NodePlay ${e} does not exist. `);
      throw this.showErrorMessageOverlay(i), i;
    }
    this.boardViewsUI.setActiveBoard(e);
    const s = await t.run();
    return this.boardViewsUI.destroyBoardView(e), this.bufferedNodePlays.delete(e), s;
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
function ta(n, e) {
  let t = 0, s = {};
  for (const o of e.nodes)
    s[o.node_id] = o.outcomes;
  n.sort((o, r) => o.timestamp_event.localeCompare(r.timestamp_event));
  let i = /* @__PURE__ */ new Set();
  for (let o = 0; o < n.length; o++) {
    const r = n[o];
    if (r.event_type !== "NodeResultEvent")
      continue;
    const c = r.event_payload, p = c.action.sensor_id;
    if (!i.has(c.node_id)) {
      i.add(c.node_id);
      for (const S of s[c.node_id] || [])
        if (S.sensor_id === p) {
          let R = parseFloat(S.bonus_amount_usd);
          !isNaN(R) && R > 0 && (t += R);
        }
    }
  }
  return t = Math.max(0, t), t = Math.round(t * 100) / 100, t;
}
function na() {
  return {
    user_agent: navigator.userAgent,
    display_width_px: screen.width,
    display_height_px: screen.height,
    viewport_width_px: window.innerWidth,
    viewport_height_px: window.innerHeight
  };
}
var ia = "2.0.4", $i = 500, Ss = "user-agent", Ut = "", Ts = "?", ei = "function", ct = "undefined", zt = "object", Hi = "string", me = "browser", Xe = "cpu", He = "device", Ie = "engine", Ae = "os", Nt = "result", w = "name", d = "type", g = "vendor", b = "version", we = "architecture", vn = "major", f = "model", bn = "console", D = "mobile", G = "tablet", ne = "smarttv", ze = "wearable", jn = "xr", xn = "embedded", hn = "inapp", Ji = "brands", kt = "formFactors", es = "fullVersionList", Bt = "platform", ts = "platformVersion", oi = "bitness", ut = "sec-ch-ua", sa = ut + "-full-version-list", ra = ut + "-arch", oa = ut + "-" + oi, aa = ut + "-form-factors", la = ut + "-" + D, ca = ut + "-" + f, sr = ut + "-" + Bt, ua = sr + "-version", rr = [Ji, es, D, f, Bt, ts, we, kt, oi], Gn = "Amazon", Dt = "Apple", As = "ASUS", Cs = "BlackBerry", xt = "Google", Rs = "Huawei", _i = "Lenovo", Os = "Honor", Wn = "LG", Ei = "Microsoft", Si = "Motorola", Ti = "Nvidia", Ms = "OnePlus", Ai = "OPPO", dn = "Samsung", Ls = "Sharp", pn = "Sony", Ci = "Xiaomi", Ri = "Zebra", Is = "Chrome", Ds = "Chromium", at = "Chromecast", Zn = "Edge", fn = "Firefox", gn = "Opera", Oi = "Facebook", Ps = "Sogou", Pt = "Mobile ", mn = " Browser", Vi = "Windows", ha = typeof window !== ct, be = ha && window.navigator ? window.navigator : void 0, lt = be && be.userAgentData ? be.userAgentData : void 0, da = function(n, e) {
  var t = {}, s = e;
  if (!ti(e)) {
    s = {};
    for (var i in e)
      for (var o in e[i])
        s[o] = e[i][o].concat(s[o] ? s[o] : []);
  }
  for (var r in n)
    t[r] = s[r] && s[r].length % 2 === 0 ? s[r].concat(n[r]) : n[r];
  return t;
}, ai = function(n) {
  for (var e = {}, t = 0; t < n.length; t++)
    e[n[t].toUpperCase()] = n[t];
  return e;
}, Fi = function(n, e) {
  if (typeof n === zt && n.length > 0) {
    for (var t in n)
      if (Ke(e) == Ke(n[t])) return !0;
    return !1;
  }
  return Vt(n) ? Ke(e) == Ke(n) : !1;
}, ti = function(n, e) {
  for (var t in n)
    return /^(browser|cpu|device|engine|os)$/.test(t) || (e ? ti(n[t]) : !1);
}, Vt = function(n) {
  return typeof n === Hi;
}, Mi = function(n) {
  if (n) {
    for (var e = [], t = $t(/\\?\"/g, n).split(","), s = 0; s < t.length; s++)
      if (t[s].indexOf(";") > -1) {
        var i = ni(t[s]).split(";v=");
        e[s] = { brand: i[0], version: i[1] };
      } else
        e[s] = ni(t[s]);
    return e;
  }
}, Ke = function(n) {
  return Vt(n) ? n.toLowerCase() : n;
}, Li = function(n) {
  return Vt(n) ? $t(/[^\d\.]/g, n).split(".")[0] : void 0;
}, Qe = function(n) {
  for (var e in n) {
    var t = n[e];
    typeof t == zt && t.length == 2 ? this[t[0]] = t[1] : this[t] = void 0;
  }
  return this;
}, $t = function(n, e) {
  return Vt(e) ? e.replace(n, Ut) : e;
}, wn = function(n) {
  return $t(/\\?\"/g, n);
}, ni = function(n, e) {
  if (Vt(n))
    return n = $t(/^\s\s*/, n), typeof e === ct ? n : n.substring(0, $i);
}, Ii = function(n, e) {
  if (!(!n || !e))
    for (var t = 0, s, i, o, r, c, h; t < e.length && !c; ) {
      var p = e[t], S = e[t + 1];
      for (s = i = 0; s < p.length && !c && p[s]; )
        if (c = p[s++].exec(n), c)
          for (o = 0; o < S.length; o++)
            h = c[++i], r = S[o], typeof r === zt && r.length > 0 ? r.length === 2 ? typeof r[1] == ei ? this[r[0]] = r[1].call(this, h) : this[r[0]] = r[1] : r.length >= 3 && (typeof r[1] === ei && !(r[1].exec && r[1].test) ? r.length > 3 ? this[r[0]] = h ? r[1].apply(this, r.slice(2)) : void 0 : this[r[0]] = h ? r[1].call(this, h, r[2]) : void 0 : r.length == 3 ? this[r[0]] = h ? h.replace(r[1], r[2]) : void 0 : r.length == 4 ? this[r[0]] = h ? r[3].call(this, h.replace(r[1], r[2])) : void 0 : r.length > 4 && (this[r[0]] = h ? r[3].apply(this, [h.replace(r[1], r[2])].concat(r.slice(4))) : void 0)) : this[r] = h || void 0;
      t += 2;
    }
}, $e = function(n, e) {
  for (var t in e)
    if (typeof e[t] === zt && e[t].length > 0) {
      for (var s = 0; s < e[t].length; s++)
        if (Fi(e[t][s], n))
          return t === Ts ? void 0 : t;
    } else if (Fi(e[t], n))
      return t === Ts ? void 0 : t;
  return e.hasOwnProperty("*") ? e["*"] : n;
}, Ns = {
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
}, Bs = {
  embedded: "Automotive",
  mobile: "Mobile",
  tablet: ["Tablet", "EInk"],
  smarttv: "TV",
  wearable: "Watch",
  xr: ["VR", "XR"],
  "?": ["Desktop", "Unknown"],
  "*": void 0
}, pa = {
  Chrome: "Google Chrome",
  Edge: "Microsoft Edge",
  "Edge WebView2": "Microsoft Edge WebView2",
  "Chrome WebView": "Android WebView",
  "Chrome Headless": "HeadlessChrome",
  "Huawei Browser": "HuaweiBrowser",
  "MIUI Browser": "Miui Browser",
  "Opera Mobi": "OperaMobile",
  Yandex: "YaBrowser"
}, Us = {
  browser: [
    [
      // Most common regardless engine
      /\b(?:crmo|crios)\/([\w\.]+)/i
      // Chrome for Android/iOS
    ],
    [b, [w, Pt + "Chrome"]],
    [
      /webview.+edge\/([\w\.]+)/i
      // Microsoft Edge
    ],
    [b, [w, Zn + " WebView"]],
    [
      /edg(?:e|ios|a)?\/([\w\.]+)/i
    ],
    [b, [w, "Edge"]],
    [
      // Presto based
      /(opera mini)\/([-\w\.]+)/i,
      // Opera Mini
      /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
      // Opera Mobi/Tablet
      /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i
      // Opera
    ],
    [w, b],
    [
      /opios[\/ ]+([\w\.]+)/i
      // Opera mini on iphone >= 8.0
    ],
    [b, [w, gn + " Mini"]],
    [
      /\bop(?:rg)?x\/([\w\.]+)/i
      // Opera GX
    ],
    [b, [w, gn + " GX"]],
    [
      /\bopr\/([\w\.]+)/i
      // Opera Webkit
    ],
    [b, [w, gn]],
    [
      // Mixed
      /\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i
      // Baidu
    ],
    [b, [w, "Baidu"]],
    [
      /\b(?:mxbrowser|mxios|myie2)\/?([-\w\.]*)\b/i
      // Maxthon
    ],
    [b, [w, "Maxthon"]],
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
    [w, b],
    [
      /quark(?:pc)?\/([-\w\.]+)/i
      // Quark
    ],
    [b, [w, "Quark"]],
    [
      /\bddg\/([\w\.]+)/i
      // DuckDuckGo
    ],
    [b, [w, "DuckDuckGo"]],
    [
      /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i
      // UCBrowser
    ],
    [b, [w, "UCBrowser"]],
    [
      /microm.+\bqbcore\/([\w\.]+)/i,
      // WeChat Desktop for Windows Built-in Browser
      /\bqbcore\/([\w\.]+).+microm/i,
      /micromessenger\/([\w\.]+)/i
      // WeChat
    ],
    [b, [w, "WeChat"]],
    [
      /konqueror\/([\w\.]+)/i
      // Konqueror
    ],
    [b, [w, "Konqueror"]],
    [
      /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i
      // IE11
    ],
    [b, [w, "IE"]],
    [
      /ya(?:search)?browser\/([\w\.]+)/i
      // Yandex
    ],
    [b, [w, "Yandex"]],
    [
      /slbrowser\/([\w\.]+)/i
      // Smart Lenovo Browser
    ],
    [b, [w, "Smart " + _i + mn]],
    [
      /(avast|avg)\/([\w\.]+)/i
      // Avast/AVG Secure Browser
    ],
    [[w, /(.+)/, "$1 Secure" + mn], b],
    [
      /\bfocus\/([\w\.]+)/i
      // Firefox Focus
    ],
    [b, [w, fn + " Focus"]],
    [
      /\bopt\/([\w\.]+)/i
      // Opera Touch
    ],
    [b, [w, gn + " Touch"]],
    [
      /coc_coc\w+\/([\w\.]+)/i
      // Coc Coc Browser
    ],
    [b, [w, "Coc Coc"]],
    [
      /dolfin\/([\w\.]+)/i
      // Dolphin
    ],
    [b, [w, "Dolphin"]],
    [
      /coast\/([\w\.]+)/i
      // Opera Coast
    ],
    [b, [w, gn + " Coast"]],
    [
      /miuibrowser\/([\w\.]+)/i
      // MIUI Browser
    ],
    [b, [w, "MIUI" + mn]],
    [
      /fxios\/([\w\.-]+)/i
      // Firefox for iOS
    ],
    [b, [w, Pt + fn]],
    [
      /\bqihoobrowser\/?([\w\.]*)/i
      // 360
    ],
    [b, [w, "360"]],
    [
      /\b(qq)\/([\w\.]+)/i
      // QQ
    ],
    [[w, /(.+)/, "$1Browser"], b],
    [
      /(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i
    ],
    [[w, /(.+)/, "$1" + mn], b],
    [
      // Oculus/Sailfish/HuaweiBrowser/VivoBrowser/PicoBrowser
      /samsungbrowser\/([\w\.]+)/i
      // Samsung Internet
    ],
    [b, [w, dn + " Internet"]],
    [
      /metasr[\/ ]?([\d\.]+)/i
      // Sogou Explorer
    ],
    [b, [w, Ps + " Explorer"]],
    [
      /(sogou)mo\w+\/([\d\.]+)/i
      // Sogou Mobile
    ],
    [[w, Ps + " Mobile"], b],
    [
      /(electron)\/([\w\.]+) safari/i,
      // Electron-based App
      /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
      // Tesla
      /m?(qqbrowser|2345(?=browser|chrome|explorer))\w*[\/ ]?v?([\w\.]+)/i
      // QQ/2345
    ],
    [w, b],
    [
      /(lbbrowser|rekonq)/i
      // LieBao Browser/Rekonq
    ],
    [w],
    [
      /ome\/([\w\.]+) \w* ?(iron) saf/i,
      // Iron
      /ome\/([\w\.]+).+qihu (360)[es]e/i
      // 360
    ],
    [b, w],
    [
      // WebView
      /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i
      // Facebook App for iOS & Android
    ],
    [[w, Oi], b, [d, hn]],
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
    [w, b, [d, hn]],
    [
      /\bgsa\/([\w\.]+) .*safari\//i
      // Google Search Appliance on iOS
    ],
    [b, [w, "GSA"], [d, hn]],
    [
      /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i
      // TikTok
    ],
    [b, [w, "TikTok"], [d, hn]],
    [
      /\[(linkedin)app\]/i
      // LinkedIn App for iOS & Android
    ],
    [w, [d, hn]],
    [
      /(chromium)[\/ ]([-\w\.]+)/i
      // Chromium
    ],
    [w, b],
    [
      /headlesschrome(?:\/([\w\.]+)| )/i
      // Chrome Headless
    ],
    [b, [w, Is + " Headless"]],
    [
      /wv\).+chrome\/([\w\.]+).+edgw\//i
      // Edge WebView2
    ],
    [b, [w, Zn + " WebView2"]],
    [
      / wv\).+(chrome)\/([\w\.]+)/i
      // Chrome WebView
    ],
    [[w, Is + " WebView"], b],
    [
      /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
      // Android Browser
    ],
    [b, [w, "Android" + mn]],
    [
      /chrome\/([\w\.]+) mobile/i
      // Chrome Mobile
    ],
    [b, [w, Pt + "Chrome"]],
    [
      /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
      // Chrome/OmniWeb/Arora/Tizen/Nokia
    ],
    [w, b],
    [
      /version\/([\w\.\,]+) .*mobile(?:\/\w+ | ?)safari/i
      // Safari Mobile
    ],
    [b, [w, Pt + "Safari"]],
    [
      /iphone .*mobile(?:\/\w+ | ?)safari/i
    ],
    [[w, Pt + "Safari"]],
    [
      /version\/([\w\.\,]+) .*(safari)/i
      // Safari
    ],
    [b, w],
    [
      /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i
      // Safari < 3.0
    ],
    [w, [b, "1"]],
    [
      /(webkit|khtml)\/([\w\.]+)/i
    ],
    [w, b],
    [
      // Gecko based
      /(?:mobile|tablet);.*(firefox)\/([\w\.-]+)/i
      // Firefox Mobile
    ],
    [[w, Pt + fn], b],
    [
      /(navigator|netscape\d?)\/([-\w\.]+)/i
      // Netscape
    ],
    [[w, "Netscape"], b],
    [
      /(wolvic|librewolf)\/([\w\.]+)/i
      // Wolvic/LibreWolf
    ],
    [w, b],
    [
      /mobile vr; rv:([\w\.]+)\).+firefox/i
      // Firefox Reality
    ],
    [b, [w, fn + " Reality"]],
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
    [w, [b, /_/g, "."]],
    [
      /(cobalt)\/([\w\.]+)/i
      // Cobalt
    ],
    [w, [b, /[^\d\.]+./, Ut]]
  ],
  cpu: [
    [
      /\b((amd|x|x86[-_]?|wow|win)64)\b/i
      // AMD64 (x64)
    ],
    [[we, "amd64"]],
    [
      /(ia32(?=;))/i,
      // IA32 (quicktime)
      /\b((i[346]|x)86)(pc)?\b/i
      // IA32 (x86)
    ],
    [[we, "ia32"]],
    [
      /\b(aarch64|arm(v?[89]e?l?|_?64))\b/i
      // ARM64
    ],
    [[we, "arm64"]],
    [
      /\b(arm(v[67])?ht?n?[fl]p?)\b/i
      // ARMHF
    ],
    [[we, "armhf"]],
    [
      // PocketPC mistakenly identified as PowerPC
      /( (ce|mobile); ppc;|\/[\w\.]+arm\b)/i
    ],
    [[we, "arm"]],
    [
      /((ppc|powerpc)(64)?)( mac|;|\))/i
      // PowerPC
    ],
    [[we, /ower/, Ut, Ke]],
    [
      / sun4\w[;\)]/i
      // SPARC
    ],
    [[we, "sparc"]],
    [
      /\b(avr32|ia64(?=;)|68k(?=\))|\barm(?=v([1-7]|[5-7]1)l?|;|eabi)|(irix|mips|sparc)(64)?\b|pa-risc)/i
      // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
    ],
    [[we, Ke]]
  ],
  device: [
    [
      //////////////////////////
      // MOBILES & TABLETS
      /////////////////////////
      // Samsung
      /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
    ],
    [f, [g, dn], [d, G]],
    [
      /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
      /samsung[- ]((?!sm-[lr]|browser)[-\w]+)/i,
      /sec-(sgh\w+)/i
    ],
    [f, [g, dn], [d, D]],
    [
      // Apple
      /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i
      // iPod/iPhone
    ],
    [f, [g, Dt], [d, D]],
    [
      /\((ipad);[-\w\),; ]+apple/i,
      // iPad
      /applecoremedia\/[\w\.]+ \((ipad)/i,
      /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
    ],
    [f, [g, Dt], [d, G]],
    [
      /(macintosh);/i
    ],
    [f, [g, Dt]],
    [
      // Sharp
      /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
    ],
    [f, [g, Ls], [d, D]],
    [
      // Honor
      /\b((?:brt|eln|hey2?|gdi|jdn)-a?[lnw]09|(?:ag[rm]3?|jdn2|kob2)-a?[lw]0[09]hn)(?: bui|\)|;)/i
    ],
    [f, [g, Os], [d, G]],
    [
      /honor([-\w ]+)[;\)]/i
    ],
    [f, [g, Os], [d, D]],
    [
      // Huawei
      /\b((?:ag[rs][2356]?k?|bah[234]?|bg[2o]|bt[kv]|cmr|cpn|db[ry]2?|jdn2|got|kob2?k?|mon|pce|scm|sht?|[tw]gr|vrd)-[ad]?[lw][0125][09]b?|605hw|bg2-u03|(?:gem|fdr|m2|ple|t1)-[7a]0[1-4][lu]|t1-a2[13][lw]|mediapad[\w\. ]*(?= bui|\)))\b(?!.+d\/s)/i
    ],
    [f, [g, Rs], [d, G]],
    [
      /(?:huawei)([-\w ]+)[;\)]/i,
      /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
    ],
    [f, [g, Rs], [d, D]],
    [
      // Xiaomi
      /oid[^\)]+; (2[\dbc]{4}(182|283|rp\w{2})[cgl]|m2105k81a?c)(?: bui|\))/i,
      /\b((?:red)?mi[-_ ]?pad[\w- ]*)(?: bui|\))/i
      // Mi Pad tablets
    ],
    [[f, /_/g, " "], [g, Ci], [d, G]],
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
    [[f, /_/g, " "], [g, Ci], [d, D]],
    [
      // OnePlus
      /droid.+; (cph2[3-6]\d[13579]|((gm|hd)19|(ac|be|in|kb)20|(d[en]|eb|le|mt)21|ne22)[0-2]\d|p[g-k]\w[1m]10)\b/i,
      /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
    ],
    [f, [g, Ms], [d, D]],
    [
      // OPPO
      /; (\w+) bui.+ oppo/i,
      /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
    ],
    [f, [g, Ai], [d, D]],
    [
      /\b(opd2(\d{3}a?))(?: bui|\))/i
    ],
    [f, [g, $e, { OnePlus: ["203", "304", "403", "404", "413", "415"], "*": Ai }], [d, G]],
    [
      // BLU
      /(vivo (5r?|6|8l?|go|one|s|x[il]?[2-4]?)[\w\+ ]*)(?: bui|\))/i
      // Vivo series
    ],
    [f, [g, "BLU"], [d, D]],
    [
      // Vivo
      /; vivo (\w+)(?: bui|\))/i,
      /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
    ],
    [f, [g, "Vivo"], [d, D]],
    [
      // Realme
      /\b(rmx[1-3]\d{3})(?: bui|;|\))/i
    ],
    [f, [g, "Realme"], [d, D]],
    [
      // Lenovo
      /(ideatab[-\w ]+|602lv|d-42a|a101lv|a2109a|a3500-hv|s[56]000|pb-6505[my]|tb-?x?\d{3,4}(?:f[cu]|xu|[av])|yt\d?-[jx]?\d+[lfmx])( bui|;|\)|\/)/i,
      /lenovo ?(b[68]0[08]0-?[hf]?|tab(?:[\w- ]+?)|tb[\w-]{6,7})( bui|;|\)|\/)/i
    ],
    [f, [g, _i], [d, G]],
    [
      /lenovo[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i
    ],
    [f, [g, _i], [d, D]],
    [
      // Motorola
      /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
      /\bmot(?:orola)?[- ]([\w\s]+)(\)| bui)/i,
      /((?:moto(?! 360)[-\w\(\) ]+|xt\d{3,4}[cgkosw\+]?[-\d]*|nexus 6)(?= bui|\)))/i
    ],
    [f, [g, Si], [d, D]],
    [
      /\b(mz60\d|xoom[2 ]{0,2}) build\//i
    ],
    [f, [g, Si], [d, G]],
    [
      // LG
      /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
    ],
    [f, [g, Wn], [d, G]],
    [
      /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
      /\blg[-e;\/ ]+(?!.*(?:browser|netcast|android tv|watch|webos))(\w+)/i,
      /\blg-?([\d\w]+) bui/i
    ],
    [f, [g, Wn], [d, D]],
    [
      // Nokia
      /(nokia) (t[12][01])/i
    ],
    [g, f, [d, G]],
    [
      /(?:maemo|nokia).*(n900|lumia \d+|rm-\d+)/i,
      /nokia[-_ ]?(([-\w\. ]*))/i
    ],
    [[f, /_/g, " "], [d, D], [g, "Nokia"]],
    [
      // Google
      /(pixel (c|tablet))\b/i
      // Google Pixel C/Tablet
    ],
    [f, [g, xt], [d, G]],
    [
      // Google Pixel
      /droid.+;(?: google)? (g(01[13]a|020[aem]|025[jn]|1b60|1f8f|2ybb|4s1m|576d|5nz6|8hhn|8vou|a02099|c15s|d1yq|e2ae|ec77|gh2x|kv4x|p4bc|pj41|r83y|tt9q|ur25|wvk6)|pixel[\d ]*a?( pro)?( xl)?( fold)?( \(5g\))?)( bui|\))/i
    ],
    [f, [g, xt], [d, D]],
    [
      /(google) (pixelbook( go)?)/i
    ],
    [g, f],
    [
      // Sony
      /droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-\w\w\d\d)(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
    ],
    [f, [g, pn], [d, D]],
    [
      /sony tablet [ps]/i,
      /\b(?:sony)?sgp\w+(?: bui|\))/i
    ],
    [[f, "Xperia Tablet"], [g, pn], [d, G]],
    [
      // Amazon
      /(alexa)webm/i,
      /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,
      // Kindle Fire without Silk / Echo Show
      /(kf[a-z]+)( bui|\)).+silk\//i
      // Kindle Fire HD
    ],
    [f, [g, Gn], [d, G]],
    [
      /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
      // Fire Phone
    ],
    [[f, /(.+)/g, "Fire Phone $1"], [g, Gn], [d, D]],
    [
      // BlackBerry
      /(playbook);[-\w\),; ]+(rim)/i
      // BlackBerry PlayBook
    ],
    [f, g, [d, G]],
    [
      /\b((?:bb[a-f]|st[hv])100-\d)/i,
      /\(bb10; (\w+)/i
      // BlackBerry 10
    ],
    [f, [g, Cs], [d, D]],
    [
      // Asus
      /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
    ],
    [f, [g, As], [d, G]],
    [
      / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
    ],
    [f, [g, As], [d, D]],
    [
      // HTC
      /(nexus 9)/i
      // HTC Nexus 9
    ],
    [f, [g, "HTC"], [d, G]],
    [
      /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
      // HTC
      // ZTE
      /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
      /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i
      // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
    ],
    [g, [f, /_/g, " "], [d, D]],
    [
      // TCL
      /tcl (xess p17aa)/i,
      /droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])(_\w(\w|\w\w))?(\)| bui)/i
    ],
    [f, [g, "TCL"], [d, G]],
    [
      /droid [\w\.]+; (418(?:7d|8v)|5087z|5102l|61(?:02[dh]|25[adfh]|27[ai]|56[dh]|59k|65[ah])|a509dl|t(?:43(?:0w|1[adepqu])|50(?:6d|7[adju])|6(?:09dl|10k|12b|71[efho]|76[hjk])|7(?:66[ahju]|67[hw]|7[045][bh]|71[hk]|73o|76[ho]|79w|81[hks]?|82h|90[bhsy]|99b)|810[hs]))(_\w(\w|\w\w))?(\)| bui)/i
    ],
    [f, [g, "TCL"], [d, D]],
    [
      // itel
      /(itel) ((\w+))/i
    ],
    [[g, Ke], f, [d, $e, { tablet: ["p10001l", "w7001"], "*": "mobile" }]],
    [
      // Acer
      /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
    ],
    [f, [g, "Acer"], [d, G]],
    [
      // Meizu
      /droid.+; (m[1-5] note) bui/i,
      /\bmz-([-\w]{2,})/i
    ],
    [f, [g, "Meizu"], [d, D]],
    [
      // Ulefone
      /; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i
    ],
    [f, [g, "Ulefone"], [d, D]],
    [
      // Energizer
      /; (energy ?\w+)(?: bui|\))/i,
      /; energizer ([\w ]+)(?: bui|\))/i
    ],
    [f, [g, "Energizer"], [d, D]],
    [
      // Cat
      /; cat (b35);/i,
      /; (b15q?|s22 flip|s48c|s62 pro)(?: bui|\))/i
    ],
    [f, [g, "Cat"], [d, D]],
    [
      // Smartfren
      /((?:new )?andromax[\w- ]+)(?: bui|\))/i
    ],
    [f, [g, "Smartfren"], [d, D]],
    [
      // Nothing
      /droid.+; (a(in)?(0(15|59|6[35])|142)p?)/i
    ],
    [f, [g, "Nothing"], [d, D]],
    [
      // Archos
      /; (x67 5g|tikeasy \w+|ac[1789]\d\w+)( b|\))/i,
      /archos ?(5|gamepad2?|([\w ]*[t1789]|hello) ?\d+[\w ]*)( b|\))/i
    ],
    [f, [g, "Archos"], [d, G]],
    [
      /archos ([\w ]+)( b|\))/i,
      /; (ac[3-6]\d\w{2,8})( b|\))/i
    ],
    [f, [g, "Archos"], [d, D]],
    [
      // HMD
      /; (n159v)/i
    ],
    [f, [g, "HMD"], [d, D]],
    [
      // MIXED
      /(imo) (tab \w+)/i,
      // IMO
      /(infinix|tecno) (x1101b?|p904|dp(7c|8d|10a)( pro)?|p70[1-3]a?|p904|t1101)/i
      // Infinix XPad / Tecno
    ],
    [g, f, [d, G]],
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
    [g, f, [d, D]],
    [
      /(kobo)\s(ereader|touch)/i,
      // Kobo
      /(hp).+(touchpad(?!.+tablet)|tablet)/i,
      // HP TouchPad
      /(kindle)\/([\w\.]+)/i
      // Kindle
    ],
    [g, f, [d, G]],
    [
      /(surface duo)/i
      // Surface Duo
    ],
    [f, [g, Ei], [d, G]],
    [
      /droid [\d\.]+; (fp\du?)(?: b|\))/i
      // Fairphone
    ],
    [f, [g, "Fairphone"], [d, D]],
    [
      /((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i
      // Nvidia Tablets
    ],
    [f, [g, Ti], [d, G]],
    [
      /(sprint) (\w+)/i
      // Sprint Phones
    ],
    [g, f, [d, D]],
    [
      /(kin\.[onetw]{3})/i
      // Microsoft Kin
    ],
    [[f, /\./g, " "], [g, Ei], [d, D]],
    [
      /droid.+; ([c6]+|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
      // Zebra
    ],
    [f, [g, Ri], [d, G]],
    [
      /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
    ],
    [f, [g, Ri], [d, D]],
    [
      ///////////////////
      // SMARTTVS
      ///////////////////
      /smart-tv.+(samsung)/i
      // Samsung
    ],
    [g, [d, ne]],
    [
      /hbbtv.+maple;(\d+)/i
    ],
    [[f, /^/, "SmartTV"], [g, dn], [d, ne]],
    [
      /(vizio)(?: |.+model\/)(\w+-\w+)/i,
      // Vizio
      /tcast.+(lg)e?. ([-\w]+)/i
      // LG SmartTV
    ],
    [g, f, [d, ne]],
    [
      /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i
    ],
    [[g, Wn], [d, ne]],
    [
      /(apple) ?tv/i
      // Apple TV
    ],
    [g, [f, Dt + " TV"], [d, ne]],
    [
      /crkey.*devicetype\/chromecast/i
      // Google Chromecast Third Generation
    ],
    [[f, at + " Third Generation"], [g, xt], [d, ne]],
    [
      /crkey.*devicetype\/([^/]*)/i
      // Google Chromecast with specific device type
    ],
    [[f, /^/, "Chromecast "], [g, xt], [d, ne]],
    [
      /fuchsia.*crkey/i
      // Google Chromecast Nest Hub
    ],
    [[f, at + " Nest Hub"], [g, xt], [d, ne]],
    [
      /crkey/i
      // Google Chromecast, Linux-based or unknown
    ],
    [[f, at], [g, xt], [d, ne]],
    [
      /(portaltv)/i
      // Facebook Portal TV
    ],
    [f, [g, Oi], [d, ne]],
    [
      /droid.+aft(\w+)( bui|\))/i
      // Fire TV
    ],
    [f, [g, Gn], [d, ne]],
    [
      /(shield \w+ tv)/i
      // Nvidia Shield TV
    ],
    [f, [g, Ti], [d, ne]],
    [
      /\(dtv[\);].+(aquos)/i,
      /(aquos-tv[\w ]+)\)/i
      // Sharp
    ],
    [f, [g, Ls], [d, ne]],
    [
      /(bravia[\w ]+)( bui|\))/i
      // Sony
    ],
    [f, [g, pn], [d, ne]],
    [
      /(mi(tv|box)-?\w+) bui/i
      // Xiaomi
    ],
    [f, [g, Ci], [d, ne]],
    [
      /Hbbtv.*(technisat) (.*);/i
      // TechniSAT
    ],
    [g, f, [d, ne]],
    [
      /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
      // Roku
      /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i
      // HbbTV devices
    ],
    [[g, /.+\/(\w+)/, "$1", $e, { LG: "lge" }], [f, ni], [d, ne]],
    [
      // SmartTV from Unidentified Vendors
      /droid.+; ([\w- ]+) (?:android tv|smart[- ]?tv)/i
    ],
    [f, [d, ne]],
    [
      /\b(android tv|smart[- ]?tv|opera tv|tv; rv:|large screen[\w ]+safari)\b/i
    ],
    [[d, ne]],
    [
      ///////////////////
      // CONSOLES
      ///////////////////
      /(playstation \w+)/i
      // Playstation
    ],
    [f, [g, pn], [d, bn]],
    [
      /\b(xbox(?: one)?(?!; xbox))[\); ]/i
      // Microsoft Xbox
    ],
    [f, [g, Ei], [d, bn]],
    [
      /(ouya)/i,
      // Ouya
      /(nintendo) (\w+)/i,
      // Nintendo
      /(retroid) (pocket ([^\)]+))/i
      // Retroid Pocket
    ],
    [g, f, [d, bn]],
    [
      /droid.+; (shield)( bui|\))/i
      // Nvidia Portable
    ],
    [f, [g, Ti], [d, bn]],
    [
      ///////////////////
      // WEARABLES
      ///////////////////
      /\b(sm-[lr]\d\d[0156][fnuw]?s?|gear live)\b/i
      // Samsung Galaxy Watch
    ],
    [f, [g, dn], [d, ze]],
    [
      /((pebble))app/i,
      // Pebble
      /(asus|google|lg|oppo) ((pixel |zen)?watch[\w ]*)( bui|\))/i
      // Asus ZenWatch / LG Watch / Pixel Watch
    ],
    [g, f, [d, ze]],
    [
      /(ow(?:19|20)?we?[1-3]{1,3})/i
      // Oppo Watch
    ],
    [f, [g, Ai], [d, ze]],
    [
      /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i
      // Apple Watch
    ],
    [f, [g, Dt], [d, ze]],
    [
      /(opwwe\d{3})/i
      // OnePlus Watch
    ],
    [f, [g, Ms], [d, ze]],
    [
      /(moto 360)/i
      // Motorola 360
    ],
    [f, [g, Si], [d, ze]],
    [
      /(smartwatch 3)/i
      // Sony SmartWatch
    ],
    [f, [g, pn], [d, ze]],
    [
      /(g watch r)/i
      // LG G Watch R
    ],
    [f, [g, Wn], [d, ze]],
    [
      /droid.+; (wt63?0{2,3})\)/i
    ],
    [f, [g, Ri], [d, ze]],
    [
      ///////////////////
      // XR
      ///////////////////
      /droid.+; (glass) \d/i
      // Google Glass
    ],
    [f, [g, xt], [d, jn]],
    [
      /(pico) (4|neo3(?: link|pro)?)/i
      // Pico
    ],
    [g, f, [d, jn]],
    [
      /(quest( \d| pro)?s?).+vr/i
      // Meta Quest
    ],
    [f, [g, Oi], [d, jn]],
    [
      /mobile vr; rv.+firefox/i
      // Unidentifiable VR device using Firefox Reality / Wolvic
    ],
    [[d, jn]],
    [
      ///////////////////
      // EMBEDDED
      ///////////////////
      /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i
      // Tesla
    ],
    [g, [d, xn]],
    [
      /(aeobc)\b/i
      // Echo Dot
    ],
    [f, [g, Gn], [d, xn]],
    [
      /(homepod).+mac os/i
      // Apple HomePod
    ],
    [f, [g, Dt], [d, xn]],
    [
      /windows iot/i
      // Unidentifiable embedded device using Windows IoT
    ],
    [[d, xn]],
    [
      ////////////////////
      // MIXED (GENERIC)
      ///////////////////
      /droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+?(mobile|vr|\d) safari/i
    ],
    [f, [d, $e, { mobile: "Mobile", xr: "VR", "*": G }]],
    [
      /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i
      // Unidentifiable Tablet
    ],
    [[d, G]],
    [
      /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i
      // Unidentifiable Mobile
    ],
    [[d, D]],
    [
      /droid .+?; ([\w\. -]+)( bui|\))/i
      // Generic Android Device
    ],
    [f, [g, "Generic"]]
  ],
  engine: [
    [
      /windows.+ edge\/([\w\.]+)/i
      // EdgeHTML
    ],
    [b, [w, Zn + "HTML"]],
    [
      /(arkweb)\/([\w\.]+)/i
      // ArkWeb
    ],
    [w, b],
    [
      /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i
      // Blink
    ],
    [b, [w, "Blink"]],
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
    [w, b],
    [
      /ladybird\//i
    ],
    [[w, "LibWeb"]],
    [
      /rv\:([\w\.]{1,9})\b.+(gecko)/i
      // Gecko
    ],
    [b, w]
  ],
  os: [
    [
      // Windows
      /(windows nt) (6\.[23]); arm/i
      // Windows RT
    ],
    [[w, /N/, "R"], [b, $e, Ns]],
    [
      /(windows (?:phone|mobile|iot))(?: os)?[\/ ]?([\d\.]*( se)?)/i,
      // Windows IoT/Mobile/Phone
      // Windows NT/3.1/95/98/ME/2000/XP/Vista/7/8/8.1/10/11
      /(windows)[\/ ](1[01]|2000|3\.1|7|8(\.1)?|9[58]|me|server 20\d\d( r2)?|vista|xp)/i
    ],
    [w, b],
    [
      /windows nt ?([\d\.\)]*)(?!.+xbox)/i,
      /\bwin(?=3| ?9|n)(?:nt| 9x )?([\d\.;]*)/i
    ],
    [[b, /(;|\))/g, "", $e, Ns], [w, Vi]],
    [
      /(windows ce)\/?([\d\.]*)/i
      // Windows CE
    ],
    [w, b],
    [
      // iOS/macOS
      /[adehimnop]{4,7}\b(?:.*os ([\w]+) like mac|; opera)/i,
      // iOS
      /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
      /cfnetwork\/.+darwin/i
    ],
    [[b, /_/g, "."], [w, "iOS"]],
    [
      /(mac os x) ?([\w\. ]*)/i,
      /(macintosh|mac_powerpc\b)(?!.+(haiku|morphos))/i
      // Mac OS
    ],
    [[w, "macOS"], [b, /_/g, "."]],
    [
      // Google Chromecast
      /android ([\d\.]+).*crkey/i
      // Google Chromecast, Android-based
    ],
    [b, [w, at + " Android"]],
    [
      /fuchsia.*crkey\/([\d\.]+)/i
      // Google Chromecast, Fuchsia-based
    ],
    [b, [w, at + " Fuchsia"]],
    [
      /crkey\/([\d\.]+).*devicetype\/smartspeaker/i
      // Google Chromecast, Linux-based Smart Speaker
    ],
    [b, [w, at + " SmartSpeaker"]],
    [
      /linux.*crkey\/([\d\.]+)/i
      // Google Chromecast, Legacy Linux-based
    ],
    [b, [w, at + " Linux"]],
    [
      /crkey\/([\d\.]+)/i
      // Google Chromecast, unknown
    ],
    [b, [w, at]],
    [
      // Mobile OSes
      /droid ([\w\.]+)\b.+(android[- ]x86)/i
      // Android-x86
    ],
    [b, w],
    [
      /(ubuntu) ([\w\.]+) like android/i
      // Ubuntu Touch
    ],
    [[w, /(.+)/, "$1 Touch"], b],
    [
      /(harmonyos)[\/ ]?([\d\.]*)/i,
      // HarmonyOS
      // Android/Blackberry/WebOS/QNX/Bada/RIM/KaiOS/Maemo/MeeGo/S40/Sailfish OS/OpenHarmony/Tizen
      /(android|bada|blackberry|kaios|maemo|meego|openharmony|qnx|rim tablet os|sailfish|series40|symbian|tizen)\w*[-\/\.; ]?([\d\.]*)/i
    ],
    [w, b],
    [
      /\(bb(10);/i
      // BlackBerry 10
    ],
    [b, [w, Cs]],
    [
      /(?:symbian ?os|symbos|s60(?=;)|series ?60)[-\/ ]?([\w\.]*)/i
      // Symbian
    ],
    [b, [w, "Symbian"]],
    [
      /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
      // Firefox OS
    ],
    [b, [w, fn + " OS"]],
    [
      /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i,
      // WebOS
      /webos(?:[ \/]?|\.tv-20(?=2[2-9]))(\d[\d\.]*)/i
    ],
    [b, [w, "webOS"]],
    [
      /web0s;.+?(?:chr[o0]me|safari)\/(\d+)/i
      // https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine
    ],
    [[b, $e, { 25: "120", 24: "108", 23: "94", 22: "87", 6: "79", 5: "68", 4: "53", 3: "38", 2: "538", 1: "537", "*": "TV" }], [w, "webOS"]],
    [
      /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i
      // watchOS
    ],
    [b, [w, "watchOS"]],
    [
      // Google ChromeOS
      /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i
      // Chromium OS
    ],
    [[w, "Chrome OS"], b],
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
    [w, b],
    [
      /(sunos) ?([\d\.]*)/i
      // Solaris
    ],
    [[w, "Solaris"], b],
    [
      /\b(beos|os\/2|amigaos|openvms|hp-ux|serenityos)/i,
      // BeOS/OS2/AmigaOS/OpenVMS/HP-UX/SerenityOS
      /(unix) ?([\w\.]*)/i
      // UNIX
    ],
    [w, b]
  ]
}, qn = (function() {
  var n = { init: {}, isIgnore: {}, isIgnoreRgx: {}, toString: {} };
  return Qe.call(n.init, [
    [me, [w, b, vn, d]],
    [Xe, [we]],
    [He, [d, f, g]],
    [Ie, [w, b]],
    [Ae, [w, b]]
  ]), Qe.call(n.isIgnore, [
    [me, [b, vn]],
    [Ie, [b]],
    [Ae, [b]]
  ]), Qe.call(n.isIgnoreRgx, [
    [me, / ?browser$/i],
    [Ae, / ?os$/i]
  ]), Qe.call(n.toString, [
    [me, [w, b]],
    [Xe, [we]],
    [He, [g, f]],
    [Ie, [w, b]],
    [Ae, [w, b]]
  ]), n;
})(), fa = function(n, e) {
  var t = qn.init[e], s = qn.isIgnore[e] || 0, i = qn.isIgnoreRgx[e] || 0, o = qn.toString[e] || 0;
  function r() {
    Qe.call(this, t);
  }
  return r.prototype.getItem = function() {
    return n;
  }, r.prototype.withClientHints = function() {
    return lt ? lt.getHighEntropyValues(rr).then(function(c) {
      return n.setCH(new or(c, !1)).parseCH().get();
    }) : n.parseCH().get();
  }, r.prototype.withFeatureCheck = function() {
    return n.detectFeature().get();
  }, e != Nt && (r.prototype.is = function(c) {
    var h = !1;
    for (var p in this)
      if (this.hasOwnProperty(p) && !Fi(s, p) && Ke(i ? $t(i, this[p]) : this[p]) == Ke(i ? $t(i, c) : c)) {
        if (h = !0, c != ct) break;
      } else if (c == ct && h) {
        h = !h;
        break;
      }
    return h;
  }, r.prototype.toString = function() {
    var c = Ut;
    for (var h in o)
      typeof this[o[h]] !== ct && (c += (c ? " " : Ut) + this[o[h]]);
    return c || ct;
  }), lt || (r.prototype.then = function(c) {
    var h = this, p = function() {
      for (var R in h)
        h.hasOwnProperty(R) && (this[R] = h[R]);
    };
    p.prototype = {
      is: r.prototype.is,
      toString: r.prototype.toString
    };
    var S = new p();
    return c(S), S;
  }), new r();
};
function or(n, e) {
  if (n = n || {}, Qe.call(this, rr), e)
    Qe.call(this, [
      [Ji, Mi(n[ut])],
      [es, Mi(n[sa])],
      [D, /\?1/.test(n[la])],
      [f, wn(n[ca])],
      [Bt, wn(n[sr])],
      [ts, wn(n[ua])],
      [we, wn(n[ra])],
      [kt, Mi(n[aa])],
      [oi, wn(n[oa])]
    ]);
  else
    for (var t in n)
      this.hasOwnProperty(t) && typeof n[t] !== ct && (this[t] = n[t]);
}
function zs(n, e, t, s) {
  return this.get = function(i) {
    return i ? this.data.hasOwnProperty(i) ? this.data[i] : void 0 : this.data;
  }, this.set = function(i, o) {
    return this.data[i] = o, this;
  }, this.setCH = function(i) {
    return this.uaCH = i, this;
  }, this.detectFeature = function() {
    if (be && be.userAgent == this.ua)
      switch (this.itemType) {
        case me:
          be.brave && typeof be.brave.isBrave == ei && this.set(w, "Brave");
          break;
        case He:
          !this.get(d) && lt && lt[D] && this.set(d, D), this.get(f) == "Macintosh" && be && typeof be.standalone !== ct && be.maxTouchPoints && be.maxTouchPoints > 2 && this.set(f, "iPad").set(d, G);
          break;
        case Ae:
          !this.get(w) && lt && lt[Bt] && this.set(w, lt[Bt]);
          break;
        case Nt:
          var i = this.data, o = function(r) {
            return i[r].getItem().detectFeature().get();
          };
          this.set(me, o(me)).set(Xe, o(Xe)).set(He, o(He)).set(Ie, o(Ie)).set(Ae, o(Ae));
      }
    return this;
  }, this.parseUA = function() {
    return this.itemType != Nt && Ii.call(this.data, this.ua, this.rgxMap), this.itemType == me && this.set(vn, Li(this.get(b))), this;
  }, this.parseCH = function() {
    var i = this.uaCH, o = this.rgxMap;
    switch (this.itemType) {
      case me:
      case Ie:
        var r = i[es] || i[Ji], c;
        if (r)
          for (var h in r) {
            var p = r[h].brand || r[h], S = r[h].version;
            this.itemType == me && !/not.a.brand/i.test(p) && (!c || /Chrom/.test(c) && p != Ds || c == Zn && /WebView2/.test(p)) && (p = $e(p, pa), c = this.get(w), c && !/Chrom/.test(c) && /Chrom/.test(p) || this.set(w, p).set(b, S).set(vn, Li(S)), c = p), this.itemType == Ie && p == Ds && this.set(b, S);
          }
        break;
      case Xe:
        var R = i[we];
        R && (R && i[oi] == "64" && (R += "64"), Ii.call(this.data, R + ";", o));
        break;
      case He:
        if (i[D] && this.set(d, D), i[f] && (this.set(f, i[f]), !this.get(d) || !this.get(g))) {
          var I = {};
          Ii.call(I, "droid 9; " + i[f] + ")", o), !this.get(d) && I.type && this.set(d, I.type), !this.get(g) && I.vendor && this.set(g, I.vendor);
        }
        if (i[kt]) {
          var $;
          if (typeof i[kt] != "string")
            for (var B = 0; !$ && B < i[kt].length; )
              $ = $e(i[kt][B++], Bs);
          else
            $ = $e(i[kt], Bs);
          this.set(d, $);
        }
        break;
      case Ae:
        var M = i[Bt];
        if (M) {
          var ye = i[ts];
          M == Vi && (ye = parseInt(Li(ye), 10) >= 13 ? "11" : "10"), this.set(w, M).set(b, ye);
        }
        this.get(w) == Vi && i[f] == "Xbox" && this.set(w, "Xbox").set(b, void 0);
        break;
      case Nt:
        var ve = this.data, ae = function(ge) {
          return ve[ge].getItem().setCH(i).parseCH().get();
        };
        this.set(me, ae(me)).set(Xe, ae(Xe)).set(He, ae(He)).set(Ie, ae(Ie)).set(Ae, ae(Ae));
    }
    return this;
  }, Qe.call(this, [
    ["itemType", n],
    ["ua", e],
    ["uaCH", s],
    ["rgxMap", t],
    ["data", fa(this, n)]
  ]), this;
}
function Je(n, e, t) {
  if (typeof n === zt ? (ti(n, !0) ? (typeof e === zt && (t = e), e = n) : (t = n, e = void 0), n = void 0) : typeof n === Hi && !ti(e, !0) && (t = e, e = void 0), t && typeof t.append === ei) {
    var s = {};
    t.forEach(function(h, p) {
      s[p] = h;
    }), t = s;
  }
  if (!(this instanceof Je))
    return new Je(n, e, t).getResult();
  var i = typeof n === Hi ? n : (
    // Passed user-agent string
    t && t[Ss] ? t[Ss] : (
      // User-Agent from passed headers
      be && be.userAgent ? be.userAgent : (
        // navigator.userAgent
        Ut
      )
    )
  ), o = new or(t, !0), r = e ? da(Us, e) : Us, c = function(h) {
    return h == Nt ? function() {
      return new zs(h, i, r, o).set("ua", i).set(me, this.getBrowser()).set(Xe, this.getCPU()).set(He, this.getDevice()).set(Ie, this.getEngine()).set(Ae, this.getOS()).get();
    } : function() {
      return new zs(h, i, r[h], o).parseUA().get();
    };
  };
  return Qe.call(this, [
    ["getBrowser", c(me)],
    ["getCPU", c(Xe)],
    ["getDevice", c(He)],
    ["getEngine", c(Ie)],
    ["getOS", c(Ae)],
    ["getResult", c(Nt)],
    ["getUA", function() {
      return i;
    }],
    ["setUA", function(h) {
      return Vt(h) && (i = h.length > $i ? ni(h, $i) : h), this;
    }]
  ]).setUA(i), this;
}
Je.VERSION = ia;
Je.BROWSER = ai([w, b, vn, d]);
Je.CPU = ai([we]);
Je.DEVICE = ai([f, g, d, bn, D, ne, G, ze, xn]);
Je.ENGINE = Je.OS = ai([w, b]);
class ga {
  static isValidDevice() {
    return !new Je().getDevice().type;
  }
}
function yt() {
  return crypto.randomUUID();
}
function vt() {
  return Et(performance.now());
}
async function ma(n, e, t = null, s = []) {
  t || (t = (M) => {
  });
  let i = s;
  const o = n.nodekit_version;
  let r = new ea(n.board);
  if (!ga.isValidDevice()) {
    const M = new Error("Unsupported device. Please use a desktop browser.");
    throw r.showErrorMessageOverlay(M), M;
  }
  r.showConnectingOverlay();
  for (const M of e)
    r.boardViewsUI.assetManager.registerAsset(M);
  r.hideConnectingOverlay(), await r.playStartScreen();
  const c = {
    event_id: yt(),
    timestamp_event: vt(),
    event_type: "StartEvent",
    event_payload: {},
    nodekit_version: o
  };
  i.push(c), t(c);
  function h() {
    if (document.visibilityState === "hidden") {
      const M = {
        event_id: yt(),
        timestamp_event: vt(),
        event_type: "LeaveEvent",
        event_payload: {},
        nodekit_version: o
      };
      i.push(M), t(M);
    } else if (document.visibilityState === "visible") {
      const M = {
        event_id: yt(),
        timestamp_event: vt(),
        event_type: "ReturnEvent",
        event_payload: {},
        nodekit_version: o
      };
      i.push(M), t(M);
    }
  }
  document.addEventListener("visibilitychange", h);
  const p = na(), S = {
    event_id: yt(),
    timestamp_event: vt(),
    event_type: "BrowserContextEvent",
    event_payload: p,
    nodekit_version: o
  };
  i.push(S), t(S);
  const R = n.nodes;
  for (let M = 0; M < R.length; M++) {
    const ye = R[M], ve = await r.prepare(ye);
    let ae = await r.play(ve);
    const ge = {
      event_id: yt(),
      timestamp_event: vt(),
      event_type: "NodeResultEvent",
      event_payload: {
        node_id: ye.node_id,
        timestamp_node_start: ae.timestamp_start,
        timestamp_node_end: ae.timestamp_end,
        action: ae.action
      },
      nodekit_version: o
    };
    i.push(ge), t(ge), r.setProgressBar((M + 1) / R.length * 100);
  }
  const I = ta(
    i,
    n
  );
  let $ = "";
  if (I > 0 && ($ = `Bonus: ${I} USD (pending validation)`), await r.playEndScreen($), $ !== "") {
    const M = {
      event_id: yt(),
      timestamp_event: vt(),
      event_type: "BonusDisclosureEvent",
      event_payload: {
        bonus_amount_usd: I.toFixed(2)
      },
      nodekit_version: o
    };
    i.push(M), t(M);
  }
  const B = {
    event_id: yt(),
    timestamp_event: vt(),
    event_type: "EndEvent",
    event_payload: {},
    nodekit_version: o
  };
  return i.push(B), t(B), document.removeEventListener("visibilitychange", h), r.showConsoleMessageOverlay(
    "Events",
    i
  ), i;
}
export {
  ma as play
};
