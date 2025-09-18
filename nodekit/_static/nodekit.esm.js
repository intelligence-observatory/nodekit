var mr = Object.defineProperty;
var wr = (n, e, t) => e in n ? mr(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var X = (n, e, t) => wr(n, typeof e != "symbol" ? e + "" : e, t);
class ye {
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
      i instanceof ye ? e.push(i) : Array.isArray(i) && i.every((s) => s instanceof ye) && e.push(...i);
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
class br extends ye {
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
class xr extends ye {
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
class si extends ye {
  constructor(e) {
    super(), this.root = document.createElement("div"), this.root.classList.add("overlay"), this.root.id = e;
  }
  setVisibility(e) {
    e ? this.root.classList.add("overlay--visible-state") : this.root.classList.remove("overlay--visible-state");
  }
}
class yr extends ye {
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
class vr extends si {
  constructor() {
    super("session-connecting-overlay"), this.displayTimeout = null;
    const e = document.createElement("div");
    e.classList.add("connecting-message-box"), this.root.appendChild(e), this.spinner = new yr(), this.spinner.mount(e);
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
var bi, cs;
function kr() {
  if (cs) return bi;
  cs = 1;
  function n(o) {
    return o instanceof Map ? o.clear = o.delete = o.set = function() {
      throw new Error("map is read-only");
    } : o instanceof Set && (o.add = o.clear = o.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(o), Object.getOwnPropertyNames(o).forEach((d) => {
      const v = o[d], I = typeof v;
      (I === "object" || I === "function") && !Object.isFrozen(v) && n(v);
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
    const v = /* @__PURE__ */ Object.create(null);
    for (const I in o)
      v[I] = o[I];
    return d.forEach(function(I) {
      for (const Q in I)
        v[Q] = I[Q];
    }), /** @type {T} */
    v;
  }
  const s = "</span>", r = (o) => !!o.scope, l = (o, { prefix: d }) => {
    if (o.startsWith("language:"))
      return o.replace("language:", "language-");
    if (o.includes(".")) {
      const v = o.split(".");
      return [
        `${d}${v.shift()}`,
        ...v.map((I, Q) => `${I}${"_".repeat(Q + 1)}`)
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
    constructor(d, v) {
      this.buffer = "", this.classPrefix = v.classPrefix, d.walk(this);
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
      const v = l(
        d.scope,
        { prefix: this.classPrefix }
      );
      this.span(v);
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
      const v = h({ scope: d });
      this.add(v), this.stack.push(v);
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
    static _walk(d, v) {
      return typeof v == "string" ? d.addText(v) : v.children && (d.openNode(v), v.children.forEach((I) => this._walk(d, I)), d.closeNode(v)), d;
    }
    /**
     * @param {Node} node
     */
    static _collapse(d) {
      typeof d != "string" && d.children && (d.children.every((v) => typeof v == "string") ? d.children = [d.children.join("")] : d.children.forEach((v) => {
        u._collapse(v);
      }));
    }
  }
  class f extends u {
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
    __addSublanguage(d, v) {
      const I = d.root;
      v && (I.scope = `language:${v}`), this.add(I);
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
  function _(o) {
    return M("(?=", o, ")");
  }
  function $(o) {
    return M("(?:", o, ")*");
  }
  function P(o) {
    return M("(?:", o, ")?");
  }
  function M(...o) {
    return o.map((v) => O(v)).join("");
  }
  function ve(o) {
    const d = o[o.length - 1];
    return typeof d == "object" && d.constructor === Object ? (o.splice(o.length - 1, 1), d) : {};
  }
  function _e(...o) {
    return "(" + (ve(o).capture ? "" : "?:") + o.map((I) => O(I)).join("|") + ")";
  }
  function le(o) {
    return new RegExp(o.toString() + "|").exec("").length - 1;
  }
  function me(o, d) {
    const v = o && o.exec(d);
    return v && v.index === 0;
  }
  const te = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function Oe(o, { joinWith: d }) {
    let v = 0;
    return o.map((I) => {
      v += 1;
      const Q = v;
      let K = O(I), T = "";
      for (; K.length > 0; ) {
        const S = te.exec(K);
        if (!S) {
          T += K;
          break;
        }
        T += K.substring(0, S.index), K = K.substring(S.index + S[0].length), S[0][0] === "\\" && S[1] ? T += "\\" + String(Number(S[1]) + Q) : (T += S[0], S[0] === "(" && v++);
      }
      return T;
    }).map((I) => `(${I})`).join(d);
  }
  const Fe = /\b\B/, Pe = "[a-zA-Z]\\w*", jt = "[a-zA-Z_]\\w*", En = "\\b\\d+(\\.\\d+)?", Sn = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", ae = "\\b(0b[01]+)", Gt = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", Wt = (o = {}) => {
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
      "on:begin": (v, I) => {
        v.index !== 0 && I.ignoreMatch();
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
  }, dt = function(o, d, v = {}) {
    const I = i(
      {
        scope: "comment",
        begin: o,
        end: d,
        contains: []
      },
      v
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
    const Q = _e(
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
  }, di = dt("//", "$"), Tn = dt("/\\*", "\\*/"), ne = dt("#", "$"), An = {
    scope: "number",
    begin: En,
    relevance: 0
  }, se = {
    scope: "number",
    begin: Sn,
    relevance: 0
  }, Cn = {
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
    begin: Pe,
    relevance: 0
  }, qt = {
    scope: "title",
    begin: jt,
    relevance: 0
  }, Rn = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + jt,
    relevance: 0
  };
  var ft = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: ci,
    BACKSLASH_ESCAPE: je,
    BINARY_NUMBER_MODE: Cn,
    BINARY_NUMBER_RE: ae,
    COMMENT: dt,
    C_BLOCK_COMMENT_MODE: Tn,
    C_LINE_COMMENT_MODE: di,
    C_NUMBER_MODE: se,
    C_NUMBER_RE: Sn,
    END_SAME_AS_BEGIN: function(o) {
      return Object.assign(
        o,
        {
          /** @type {ModeCallback} */
          "on:begin": (d, v) => {
            v.data._beginMatch = d[1];
          },
          /** @type {ModeCallback} */
          "on:end": (d, v) => {
            v.data._beginMatch !== d[1] && v.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: ne,
    IDENT_RE: Pe,
    MATCH_NOTHING_RE: Fe,
    METHOD_GUARD: Rn,
    NUMBER_MODE: An,
    NUMBER_RE: En,
    PHRASAL_WORDS_MODE: hi,
    QUOTE_STRING_MODE: ui,
    REGEXP_MODE: J,
    RE_STARTERS_RE: Gt,
    SHEBANG: Wt,
    TITLE_MODE: pt,
    UNDERSCORE_IDENT_RE: jt,
    UNDERSCORE_TITLE_MODE: qt
  });
  function Mn(o, d) {
    o.input[o.index - 1] === "." && d.ignoreMatch();
  }
  function tt(o, d) {
    o.className !== void 0 && (o.scope = o.className, delete o.className);
  }
  function At(o, d) {
    d && o.beginKeywords && (o.begin = "\\b(" + o.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", o.__beforeBegin = Mn, o.keywords = o.keywords || o.beginKeywords, delete o.beginKeywords, o.relevance === void 0 && (o.relevance = 0));
  }
  function Ge(o, d) {
    Array.isArray(o.illegal) && (o.illegal = _e(...o.illegal));
  }
  function Xt(o, d) {
    if (o.match) {
      if (o.begin || o.end) throw new Error("begin & end are not supported with match");
      o.begin = o.match, delete o.match;
    }
  }
  function Yt(o, d) {
    o.relevance === void 0 && (o.relevance = 1);
  }
  const nt = (o, d) => {
    if (!o.beforeMatch) return;
    if (o.starts) throw new Error("beforeMatch cannot be used with starts");
    const v = Object.assign({}, o);
    Object.keys(o).forEach((I) => {
      delete o[I];
    }), o.keywords = v.keywords, o.begin = M(v.beforeMatch, _(v.begin)), o.starts = {
      relevance: 0,
      contains: [
        Object.assign(v, { endsParent: !0 })
      ]
    }, o.relevance = 0, delete v.beforeMatch;
  }, Ct = [
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
  function Zt(o, d, v = Rt) {
    const I = /* @__PURE__ */ Object.create(null);
    return typeof o == "string" ? Q(v, o.split(" ")) : Array.isArray(o) ? Q(v, o) : Object.keys(o).forEach(function(K) {
      Object.assign(
        I,
        Zt(o[K], d, K)
      );
    }), I;
    function Q(K, T) {
      d && (T = T.map((S) => S.toLowerCase())), T.forEach(function(S) {
        const L = S.split("|");
        I[L[0]] = [K, Ln(L[0], L[1])];
      });
    }
  }
  function Ln(o, d) {
    return d ? Number(d) : pi(o) ? 0 : 1;
  }
  function pi(o) {
    return Ct.includes(o.toLowerCase());
  }
  const Ot = {}, ke = (o) => {
    console.error(o);
  }, We = (o, ...d) => {
    console.log(`WARN: ${o}`, ...d);
  }, Ee = (o, d) => {
    Ot[`${o}/${d}`] || (console.log(`Deprecated as of ${o}. ${d}`), Ot[`${o}/${d}`] = !0);
  }, gt = new Error();
  function Kt(o, d, { key: v }) {
    let I = 0;
    const Q = o[v], K = {}, T = {};
    for (let S = 1; S <= d.length; S++)
      T[S + I] = Q[S], K[S + I] = !0, I += le(d[S - 1]);
    o[v] = T, o[v]._emit = K, o[v]._multi = !0;
  }
  function In(o) {
    if (Array.isArray(o.begin)) {
      if (o.skip || o.excludeBegin || o.returnBegin)
        throw ke("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), gt;
      if (typeof o.beginScope != "object" || o.beginScope === null)
        throw ke("beginScope must be object"), gt;
      Kt(o, o.begin, { key: "beginScope" }), o.begin = Oe(o.begin, { joinWith: "" });
    }
  }
  function Qt(o) {
    if (Array.isArray(o.end)) {
      if (o.skip || o.excludeEnd || o.returnEnd)
        throw ke("skip, excludeEnd, returnEnd not compatible with endScope: {}"), gt;
      if (typeof o.endScope != "object" || o.endScope === null)
        throw ke("endScope must be object"), gt;
      Kt(o, o.end, { key: "endScope" }), o.end = Oe(o.end, { joinWith: "" });
    }
  }
  function Dn(o) {
    o.scope && typeof o.scope == "object" && o.scope !== null && (o.beginScope = o.scope, delete o.scope);
  }
  function Mt(o) {
    Dn(o), typeof o.beginScope == "string" && (o.beginScope = { _wrap: o.beginScope }), typeof o.endScope == "string" && (o.endScope = { _wrap: o.endScope }), In(o), Qt(o);
  }
  function Lt(o) {
    function d(T, S) {
      return new RegExp(
        O(T),
        "m" + (o.case_insensitive ? "i" : "") + (o.unicodeRegex ? "u" : "") + (S ? "g" : "")
      );
    }
    class v {
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
        const V = L.findIndex((ot, It) => It > 0 && ot !== void 0), W = this.matchIndexes[V];
        return L.splice(0, V), Object.assign(L, W);
      }
    }
    class I {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(S) {
        if (this.multiRegexes[S]) return this.multiRegexes[S];
        const L = new v();
        return this.rules.slice(S).forEach(([V, W]) => L.addRule(V, W)), L.compile(), this.multiRegexes[S] = L, L;
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
        let V = L.exec(S);
        if (this.resumingScanAtSamePosition() && !(V && V.index === this.lastIndex)) {
          const W = this.getMatcher(0);
          W.lastIndex = this.lastIndex + 1, V = W.exec(S);
        }
        return V && (this.regexIndex += V.position + 1, this.regexIndex === this.count && this.considerAll()), V;
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
        Xt,
        Mt,
        nt
      ].forEach((W) => W(T, S)), o.compilerExtensions.forEach((W) => W(T, S)), T.__beforeBegin = null, [
        At,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        Ge,
        // default to 1 relevance if not specified
        Yt
      ].forEach((W) => W(T, S)), T.isCompiled = !0;
      let V = null;
      return typeof T.keywords == "object" && T.keywords.$pattern && (T.keywords = Object.assign({}, T.keywords), V = T.keywords.$pattern, delete T.keywords.$pattern), V = V || /\w+/, T.keywords && (T.keywords = Zt(T.keywords, o.case_insensitive)), L.keywordPatternRe = d(V, !0), S && (T.begin || (T.begin = /\B|\b/), L.beginRe = d(L.begin), !T.end && !T.endsWithParent && (T.end = /\B|\b/), T.end && (L.endRe = d(L.end)), L.terminatorEnd = O(L.end) || "", T.endsWithParent && S.terminatorEnd && (L.terminatorEnd += (T.end ? "|" : "") + S.terminatorEnd)), T.illegal && (L.illegalRe = d(
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
  var Jt = "11.11.1";
  class en extends Error {
    constructor(d, v) {
      super(d), this.name = "HTMLInjectionError", this.html = v;
    }
  }
  const tn = t, mt = i, wt = Symbol("nomatch"), fi = 7, st = function(o) {
    const d = /* @__PURE__ */ Object.create(null), v = /* @__PURE__ */ Object.create(null), I = [];
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
      __emitter: f
    };
    function L(w) {
      return S.noHighlightRe.test(w);
    }
    function V(w) {
      let C = w.className + " ";
      C += w.parentNode ? w.parentNode.className : "";
      const U = S.languageDetectRe.exec(C);
      if (U) {
        const Y = E(U[1]);
        return Y || (We(K.replace("{}", U[1])), We("Falling back to no-highlight mode for this block.", w)), Y ? U[1] : "no-highlight";
      }
      return C.split(/\s+/).find((Y) => L(Y) || E(Y));
    }
    function W(w, C, U) {
      let Y = "", oe = "";
      typeof C == "object" ? (Y = w, U = C.ignoreIllegals, oe = C.language) : (Ee("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Ee("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), oe = w, Y = C), U === void 0 && (U = !0);
      const Le = {
        code: Y,
        language: oe
      };
      Ne("before:highlight", Le);
      const at = Le.result ? Le.result : ot(Le.language, Le.code, U);
      return at.code = Le.code, Ne("after:highlight", at), at;
    }
    function ot(w, C, U, Y) {
      const oe = /* @__PURE__ */ Object.create(null);
      function Le(k, R) {
        return k.keywords[R];
      }
      function at() {
        if (!N.keywords) {
          ce.addText(Z);
          return;
        }
        let k = 0;
        N.keywordPatternRe.lastIndex = 0;
        let R = N.keywordPatternRe.exec(Z), B = "";
        for (; R; ) {
          B += Z.substring(k, R.index);
          const F = Ue.case_insensitive ? R[0].toLowerCase() : R[0], he = Le(N, F);
          if (he) {
            const [qe, fr] = he;
            if (ce.addText(B), B = "", oe[F] = (oe[F] || 0) + 1, oe[F] <= fi && (Hn += fr), qe.startsWith("_"))
              B += R[0];
            else {
              const gr = Ue.classNameAliases[qe] || qe;
              Be(R[0], gr);
            }
          } else
            B += R[0];
          k = N.keywordPatternRe.lastIndex, R = N.keywordPatternRe.exec(Z);
        }
        B += Z.substring(k), ce.addText(B);
      }
      function zn() {
        if (Z === "") return;
        let k = null;
        if (typeof N.subLanguage == "string") {
          if (!d[N.subLanguage]) {
            ce.addText(Z);
            return;
          }
          k = ot(N.subLanguage, Z, !0, ls[N.subLanguage]), ls[N.subLanguage] = /** @type {CompiledMode} */
          k._top;
        } else
          k = bt(Z, N.subLanguage.length ? N.subLanguage : null);
        N.relevance > 0 && (Hn += k.relevance), ce.__addSublanguage(k._emitter, k.language);
      }
      function Te() {
        N.subLanguage != null ? zn() : at(), Z = "";
      }
      function Be(k, R) {
        k !== "" && (ce.startScope(R), ce.addText(k), ce.endScope());
      }
      function ss(k, R) {
        let B = 1;
        const F = R.length - 1;
        for (; B <= F; ) {
          if (!k._emit[B]) {
            B++;
            continue;
          }
          const he = Ue.classNameAliases[k[B]] || k[B], qe = R[B];
          he ? Be(qe, he) : (Z = qe, at(), Z = ""), B++;
        }
      }
      function rs(k, R) {
        return k.scope && typeof k.scope == "string" && ce.openNode(Ue.classNameAliases[k.scope] || k.scope), k.beginScope && (k.beginScope._wrap ? (Be(Z, Ue.classNameAliases[k.beginScope._wrap] || k.beginScope._wrap), Z = "") : k.beginScope._multi && (ss(k.beginScope, R), Z = "")), N = Object.create(k, { parent: { value: N } }), N;
      }
      function os(k, R, B) {
        let F = me(k.endRe, B);
        if (F) {
          if (k["on:end"]) {
            const he = new e(k);
            k["on:end"](R, he), he.isMatchIgnored && (F = !1);
          }
          if (F) {
            for (; k.endsParent && k.parent; )
              k = k.parent;
            return k;
          }
        }
        if (k.endsWithParent)
          return os(k.parent, R, B);
      }
      function cr(k) {
        return N.matcher.regexIndex === 0 ? (Z += k[0], 1) : (wi = !0, 0);
      }
      function ur(k) {
        const R = k[0], B = k.rule, F = new e(B), he = [B.__beforeBegin, B["on:begin"]];
        for (const qe of he)
          if (qe && (qe(k, F), F.isMatchIgnored))
            return cr(R);
        return B.skip ? Z += R : (B.excludeBegin && (Z += R), Te(), !B.returnBegin && !B.excludeBegin && (Z = R)), rs(B, k), B.returnBegin ? 0 : R.length;
      }
      function hr(k) {
        const R = k[0], B = C.substring(k.index), F = os(N, k, B);
        if (!F)
          return wt;
        const he = N;
        N.endScope && N.endScope._wrap ? (Te(), Be(R, N.endScope._wrap)) : N.endScope && N.endScope._multi ? (Te(), ss(N.endScope, k)) : he.skip ? Z += R : (he.returnEnd || he.excludeEnd || (Z += R), Te(), he.excludeEnd && (Z = R));
        do
          N.scope && ce.closeNode(), !N.skip && !N.subLanguage && (Hn += N.relevance), N = N.parent;
        while (N !== F.parent);
        return F.starts && rs(F.starts, k), he.returnEnd ? 0 : R.length;
      }
      function dr() {
        const k = [];
        for (let R = N; R !== Ue; R = R.parent)
          R.scope && k.unshift(R.scope);
        k.forEach((R) => ce.openNode(R));
      }
      let $n = {};
      function as(k, R) {
        const B = R && R[0];
        if (Z += k, B == null)
          return Te(), 0;
        if ($n.type === "begin" && R.type === "end" && $n.index === R.index && B === "") {
          if (Z += C.slice(R.index, R.index + 1), !Q) {
            const F = new Error(`0 width match regex (${w})`);
            throw F.languageName = w, F.badRule = $n.rule, F;
          }
          return 1;
        }
        if ($n = R, R.type === "begin")
          return ur(R);
        if (R.type === "illegal" && !U) {
          const F = new Error('Illegal lexeme "' + B + '" for mode "' + (N.scope || "<unnamed>") + '"');
          throw F.mode = N, F;
        } else if (R.type === "end") {
          const F = hr(R);
          if (F !== wt)
            return F;
        }
        if (R.type === "illegal" && B === "")
          return Z += `
`, 1;
        if (mi > 1e5 && mi > R.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return Z += B, B.length;
      }
      const Ue = E(w);
      if (!Ue)
        throw ke(K.replace("{}", w)), new Error('Unknown language: "' + w + '"');
      const pr = Lt(Ue);
      let gi = "", N = Y || pr;
      const ls = {}, ce = new S.__emitter(S);
      dr();
      let Z = "", Hn = 0, xt = 0, mi = 0, wi = !1;
      try {
        if (Ue.__emitTokens)
          Ue.__emitTokens(C, ce);
        else {
          for (N.matcher.considerAll(); ; ) {
            mi++, wi ? wi = !1 : N.matcher.considerAll(), N.matcher.lastIndex = xt;
            const k = N.matcher.exec(C);
            if (!k) break;
            const R = C.substring(xt, k.index), B = as(R, k);
            xt = k.index + B;
          }
          as(C.substring(xt));
        }
        return ce.finalize(), gi = ce.toHTML(), {
          language: w,
          value: gi,
          relevance: Hn,
          illegal: !1,
          _emitter: ce,
          _top: N
        };
      } catch (k) {
        if (k.message && k.message.includes("Illegal"))
          return {
            language: w,
            value: tn(C),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: k.message,
              index: xt,
              context: C.slice(xt - 100, xt + 100),
              mode: k.mode,
              resultSoFar: gi
            },
            _emitter: ce
          };
        if (Q)
          return {
            language: w,
            value: tn(C),
            illegal: !1,
            relevance: 0,
            errorRaised: k,
            _emitter: ce,
            _top: N
          };
        throw k;
      }
    }
    function It(w) {
      const C = {
        value: tn(w),
        illegal: !1,
        relevance: 0,
        _top: T,
        _emitter: new S.__emitter(S)
      };
      return C._emitter.addText(w), C;
    }
    function bt(w, C) {
      C = C || S.languages || Object.keys(d);
      const U = It(w), Y = C.filter(E).filter(re).map(
        (Te) => ot(Te, w, !1)
      );
      Y.unshift(U);
      const oe = Y.sort((Te, Be) => {
        if (Te.relevance !== Be.relevance) return Be.relevance - Te.relevance;
        if (Te.language && Be.language) {
          if (E(Te.language).supersetOf === Be.language)
            return 1;
          if (E(Be.language).supersetOf === Te.language)
            return -1;
        }
        return 0;
      }), [Le, at] = oe, zn = Le;
      return zn.secondBest = at, zn;
    }
    function Pn(w, C, U) {
      const Y = C && v[C] || U;
      w.classList.add("hljs"), w.classList.add(`language-${Y}`);
    }
    function Se(w) {
      let C = null;
      const U = V(w);
      if (L(U)) return;
      if (Ne(
        "before:highlightElement",
        { el: w, language: U }
      ), w.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", w);
        return;
      }
      if (w.children.length > 0 && (S.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(w)), S.throwUnescapedHTML))
        throw new en(
          "One of your code blocks includes unescaped HTML.",
          w.innerHTML
        );
      C = w;
      const Y = C.textContent, oe = U ? W(Y, { language: U, ignoreIllegals: !0 }) : bt(Y);
      w.innerHTML = oe.value, w.dataset.highlighted = "yes", Pn(w, U, oe.language), w.result = {
        language: oe.language,
        // TODO: remove with version 11.0
        re: oe.relevance,
        relevance: oe.relevance
      }, oe.secondBest && (w.secondBest = {
        language: oe.secondBest.language,
        relevance: oe.secondBest.relevance
      }), Ne("after:highlightElement", { el: w, result: oe, text: Y });
    }
    function Nn(w) {
      S = mt(S, w);
    }
    const Bn = () => {
      Dt(), Ee("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Un() {
      Dt(), Ee("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let nn = !1;
    function Dt() {
      function w() {
        Dt();
      }
      if (document.readyState === "loading") {
        nn || window.addEventListener("DOMContentLoaded", w, !1), nn = !0;
        return;
      }
      document.querySelectorAll(S.cssSelector).forEach(Se);
    }
    function A(w, C) {
      let U = null;
      try {
        U = C(o);
      } catch (Y) {
        if (ke("Language definition for '{}' could not be registered.".replace("{}", w)), Q)
          ke(Y);
        else
          throw Y;
        U = T;
      }
      U.name || (U.name = w), d[w] = U, U.rawDefinition = C.bind(null, o), U.aliases && q(U.aliases, { languageName: w });
    }
    function c(w) {
      delete d[w];
      for (const C of Object.keys(v))
        v[C] === w && delete v[C];
    }
    function y() {
      return Object.keys(d);
    }
    function E(w) {
      return w = (w || "").toLowerCase(), d[w] || d[v[w]];
    }
    function q(w, { languageName: C }) {
      typeof w == "string" && (w = [w]), w.forEach((U) => {
        v[U.toLowerCase()] = C;
      });
    }
    function re(w) {
      const C = E(w);
      return C && !C.disableAutodetect;
    }
    function ee(w) {
      w["before:highlightBlock"] && !w["before:highlightElement"] && (w["before:highlightElement"] = (C) => {
        w["before:highlightBlock"](
          Object.assign({ block: C.el }, C)
        );
      }), w["after:highlightBlock"] && !w["after:highlightElement"] && (w["after:highlightElement"] = (C) => {
        w["after:highlightBlock"](
          Object.assign({ block: C.el }, C)
        );
      });
    }
    function ue(w) {
      ee(w), I.push(w);
    }
    function Me(w) {
      const C = I.indexOf(w);
      C !== -1 && I.splice(C, 1);
    }
    function Ne(w, C) {
      const U = w;
      I.forEach(function(Y) {
        Y[U] && Y[U](C);
      });
    }
    function sn(w) {
      return Ee("10.7.0", "highlightBlock will be removed entirely in v12.0"), Ee("10.7.0", "Please use highlightElement now."), Se(w);
    }
    Object.assign(o, {
      highlight: W,
      highlightAuto: bt,
      highlightAll: Dt,
      highlightElement: Se,
      // TODO: Remove with v12 API
      highlightBlock: sn,
      configure: Nn,
      initHighlighting: Bn,
      initHighlightingOnLoad: Un,
      registerLanguage: A,
      unregisterLanguage: c,
      listLanguages: y,
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
    }, o.versionString = Jt, o.regex = {
      concat: M,
      lookahead: _,
      either: _e,
      optional: P,
      anyNumberOfTimes: $
    };
    for (const w in ft)
      typeof ft[w] == "object" && n(ft[w]);
    return Object.assign(o, ft), o;
  }, rt = st({});
  return rt.newInstance = () => st({}), bi = rt, rt.HighlightJS = rt, rt.default = rt, bi;
}
var Er = /* @__PURE__ */ kr();
const Vs = /* @__PURE__ */ _r(Er);
function Sr(n) {
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
Vs.registerLanguage("json", Sr);
class Tr extends ye {
  constructor() {
    super(), this.root = document.createElement("div"), this.root.classList.add("json-viewer"), this.jsonViewerContent = document.createElement("div"), this.jsonViewerContent.classList.add("json-viewer__content"), this.root.appendChild(this.jsonViewerContent);
  }
  displayAsJson(e) {
    this.clear();
    const t = document.createElement("pre");
    t.classList.add("json-viewer__pre"), t.textContent = JSON.stringify(e, null, 2), Vs.highlightElement(t), t.style.backgroundColor = "transparent", this.jsonViewerContent.appendChild(t);
  }
  clear() {
  }
}
class Ar extends si {
  constructor() {
    super("console-message-overlay");
    const e = document.createElement("div");
    e.classList.add("console-title-box"), this.root.appendChild(e), this.titleTextDiv = document.createElement("div"), this.titleTextDiv.classList.add("console-title-box__text"), e.appendChild(this.titleTextDiv), this.jsonViewer = new Tr(), this.jsonViewer.mount(this.root);
    const t = new Cr();
    t.setCopyTarget(this.jsonViewer.root), t.mount(e);
  }
  displayMessage(e, t) {
    this.titleTextDiv.innerHTML = e, this.jsonViewer.displayAsJson(t), super.setVisibility(!0);
  }
  hide() {
    this.titleTextDiv.innerHTML = "", this.jsonViewer.clear(), super.setVisibility(!1);
  }
}
class Cr extends ye {
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
class Rr extends si {
  constructor() {
    super("session-finished-overlay"), this.submitButton = new Or(), this.submitButton.mount(this.root), this.messageBox = document.createElement("div"), this.messageBox.classList.add("debrief-message-box"), this.root.appendChild(this.messageBox), this.messageSpan = document.createElement("span"), this.messageSpan.classList.add("debrief-message-box__text"), this.messageBox.appendChild(this.messageSpan);
  }
  show(e, t) {
    e.length == 0 ? this.messageBox.style.visibility = "hidden" : this.messageBox.style.visibility = "visible", this.messageSpan.textContent = e, this.submitButton.attachClickListener(t), this.setVisibility(!0);
  }
  hide() {
    this.messageSpan.textContent = "", super.setVisibility(!1), this.submitButton.removeAllEventListeners();
  }
}
class Or extends ye {
  constructor() {
    super();
    const e = document.createElement("button");
    e.classList.add("submit-button"), e.textContent = "Press to Submit", this.root = e;
  }
  attachClickListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class Mr extends si {
  constructor() {
    super("session-started-overlay"), this.startButton = new Lr(), this.startButton.mount(this.root);
  }
  show(e) {
    this.startButton.attachClickListener(e), this.setVisibility(!0);
  }
  hide() {
    super.setVisibility(!1), this.startButton.removeAllEventListeners();
  }
}
class Lr extends ye {
  constructor() {
    super();
    const e = document.createElement("button");
    e.classList.add("start-button"), e.textContent = "Press to Start", this.root = e;
  }
  attachClickListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class Ir extends ye {
  constructor() {
    super(), this.root = document.createElement("div"), this.root.className = "shell-ui", this.progressBar = new xr("cognition"), this.progressBar.mount(this.root), this.statusDot = new br(), this.statusDot.mount(this.root), this.sessionConnectingOverlay = new vr(), this.sessionConnectingOverlay.mount(this.root), this.overlayConsoleMessage = new Ar(), this.overlayConsoleMessage.mount(this.root), this.sessionFinishedOverlay = new Rr(), this.sessionFinishedOverlay.mount(this.root), this.sessionStartedOverlay = new Mr(), this.sessionStartedOverlay.mount(this.root);
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
class Vt {
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
function Wi() {
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
var Tt = Wi();
function Fs(n) {
  Tt = n;
}
var vn = { exec: () => null };
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
}, Dr = /^(?:[ \t]*(?:\n|$))+/, Pr = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Nr = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, kn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Br = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, qi = /(?:[*+-]|\d{1,9}[.)])/, js = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Gs = H(js).replace(/bull/g, qi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Ur = H(js).replace(/bull/g, qi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Xi = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, zr = /^[^\n]+/, Yi = /(?!\s*\])(?:\\.|[^\[\]\\])+/, $r = H(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Yi).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Hr = H(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, qi).getRegex(), ri = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Zi = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Vr = H(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", Zi).replace("tag", ri).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Ws = H(Xi).replace("hr", kn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ri).getRegex(), Fr = H(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Ws).getRegex(), Ki = {
  blockquote: Fr,
  code: Pr,
  def: $r,
  fences: Nr,
  heading: Br,
  hr: kn,
  html: Vr,
  lheading: Gs,
  list: Hr,
  newline: Dr,
  paragraph: Ws,
  table: vn,
  text: zr
}, us = H(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", kn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ri).getRegex(), jr = {
  ...Ki,
  lheading: Ur,
  table: us,
  paragraph: H(Xi).replace("hr", kn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", us).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ri).getRegex()
}, Gr = {
  ...Ki,
  html: H(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", Zi).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: vn,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: H(Xi).replace("hr", kn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Gs).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, Wr = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, qr = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, qs = /^( {2,}|\\)\n(?!\s*$)/, Xr = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, oi = /[\p{P}\p{S}]/u, Qi = /[\s\p{P}\p{S}]/u, Xs = /[^\s\p{P}\p{S}]/u, Yr = H(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Qi).getRegex(), Ys = /(?!~)[\p{P}\p{S}]/u, Zr = /(?!~)[\s\p{P}\p{S}]/u, Kr = /(?:[^\s\p{P}\p{S}]|~)/u, Qr = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, Zs = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Jr = H(Zs, "u").replace(/punct/g, oi).getRegex(), eo = H(Zs, "u").replace(/punct/g, Ys).getRegex(), Ks = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", to = H(Ks, "gu").replace(/notPunctSpace/g, Xs).replace(/punctSpace/g, Qi).replace(/punct/g, oi).getRegex(), no = H(Ks, "gu").replace(/notPunctSpace/g, Kr).replace(/punctSpace/g, Zr).replace(/punct/g, Ys).getRegex(), io = H(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, Xs).replace(/punctSpace/g, Qi).replace(/punct/g, oi).getRegex(), so = H(/\\(punct)/, "gu").replace(/punct/g, oi).getRegex(), ro = H(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), oo = H(Zi).replace("(?:-->|$)", "-->").getRegex(), ao = H(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", oo).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Qn = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, lo = H(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", Qn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Qs = H(/^!?\[(label)\]\[(ref)\]/).replace("label", Qn).replace("ref", Yi).getRegex(), Js = H(/^!?\[(ref)\](?:\[\])?/).replace("ref", Yi).getRegex(), co = H("reflink|nolink(?!\\()", "g").replace("reflink", Qs).replace("nolink", Js).getRegex(), Ji = {
  _backpedal: vn,
  // only used for GFM url
  anyPunctuation: so,
  autolink: ro,
  blockSkip: Qr,
  br: qs,
  code: qr,
  del: vn,
  emStrongLDelim: Jr,
  emStrongRDelimAst: to,
  emStrongRDelimUnd: io,
  escape: Wr,
  link: lo,
  nolink: Js,
  punctuation: Yr,
  reflink: Qs,
  reflinkSearch: co,
  tag: ao,
  text: Xr,
  url: vn
}, uo = {
  ...Ji,
  link: H(/^!?\[(label)\]\((.*?)\)/).replace("label", Qn).getRegex(),
  reflink: H(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Qn).getRegex()
}, Ni = {
  ...Ji,
  emStrongRDelimAst: no,
  emStrongLDelim: eo,
  url: H(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, ho = {
  ...Ni,
  br: H(qs).replace("{2,}", "*").getRegex(),
  text: H(Ni.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Vn = {
  normal: Ki,
  gfm: jr,
  pedantic: Gr
}, rn = {
  normal: Ji,
  gfm: Ni,
  breaks: ho,
  pedantic: uo
}, po = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, hs = (n) => po[n];
function ze(n, e) {
  if (e) {
    if (pe.escapeTest.test(n))
      return n.replace(pe.escapeReplace, hs);
  } else if (pe.escapeTestNoEncode.test(n))
    return n.replace(pe.escapeReplaceNoEncode, hs);
  return n;
}
function ds(n) {
  try {
    n = encodeURI(n).replace(pe.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function ps(n, e) {
  var r;
  const t = n.replace(pe.findPipe, (l, a, h) => {
    let u = !1, f = a;
    for (; --f >= 0 && h[f] === "\\"; ) u = !u;
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
function on(n, e, t) {
  const i = n.length;
  if (i === 0)
    return "";
  let s = 0;
  for (; s < i && n.charAt(i - s - 1) === e; )
    s++;
  return n.slice(0, i - s);
}
function fo(n, e) {
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
function fs(n, e, t, i, s) {
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
function go(n, e, t) {
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
var Jn = class {
  // set by the lexer
  constructor(n) {
    X(this, "options");
    X(this, "rules");
    // set by the lexer
    X(this, "lexer");
    this.options = n || Tt;
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
        text: this.options.pedantic ? t : on(t, `
`)
      };
    }
  }
  fences(n) {
    const e = this.rules.block.fences.exec(n);
    if (e) {
      const t = e[0], i = go(t, e[3] || "", this.rules);
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
        const i = on(t, "#");
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
        raw: on(e[0], `
`)
      };
  }
  blockquote(n) {
    const e = this.rules.block.blockquote.exec(n);
    if (e) {
      let t = on(e[0], `
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
`), f = u.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${u}` : u, s = s ? `${s}
${f}` : f;
        const O = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(f, r, !0), this.lexer.state.top = O, t.length === 0)
          break;
        const _ = r.at(-1);
        if ((_ == null ? void 0 : _.type) === "code")
          break;
        if ((_ == null ? void 0 : _.type) === "blockquote") {
          const $ = _, P = $.raw + `
` + t.join(`
`), M = this.blockquote(P);
          r[r.length - 1] = M, i = i.substring(0, i.length - $.raw.length) + M.raw, s = s.substring(0, s.length - $.text.length) + M.text;
          break;
        } else if ((_ == null ? void 0 : _.type) === "list") {
          const $ = _, P = $.raw + `
` + t.join(`
`), M = this.list(P);
          r[r.length - 1] = M, i = i.substring(0, i.length - _.raw.length) + M.raw, s = s.substring(0, s.length - $.raw.length) + M.raw, t = P.substring(r.at(-1).raw.length).split(`
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
        let h = !1, u = "", f = "";
        if (!(e = r.exec(n)) || this.rules.block.hr.test(n))
          break;
        u = e[0], n = n.substring(u.length);
        let O = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (_e) => " ".repeat(3 * _e.length)), _ = n.split(`
`, 1)[0], $ = !O.trim(), P = 0;
        if (this.options.pedantic ? (P = 2, f = O.trimStart()) : $ ? P = e[1].length + 1 : (P = e[2].search(this.rules.other.nonSpaceChar), P = P > 4 ? 1 : P, f = O.slice(P), P += e[1].length), $ && this.rules.other.blankLine.test(_) && (u += _ + `
`, n = n.substring(_.length + 1), h = !0), !h) {
          const _e = this.rules.other.nextBulletRegex(P), le = this.rules.other.hrRegex(P), me = this.rules.other.fencesBeginRegex(P), te = this.rules.other.headingBeginRegex(P), Oe = this.rules.other.htmlBeginRegex(P);
          for (; n; ) {
            const Fe = n.split(`
`, 1)[0];
            let Pe;
            if (_ = Fe, this.options.pedantic ? (_ = _.replace(this.rules.other.listReplaceNesting, "  "), Pe = _) : Pe = _.replace(this.rules.other.tabCharGlobal, "    "), me.test(_) || te.test(_) || Oe.test(_) || _e.test(_) || le.test(_))
              break;
            if (Pe.search(this.rules.other.nonSpaceChar) >= P || !_.trim())
              f += `
` + Pe.slice(P);
            else {
              if ($ || O.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || me.test(O) || te.test(O) || le.test(O))
                break;
              f += `
` + _;
            }
            !$ && !_.trim() && ($ = !0), u += Fe + `
`, n = n.substring(Fe.length + 1), O = Pe.slice(P);
          }
        }
        s.loose || (l ? s.loose = !0 : this.rules.other.doubleBlankLine.test(u) && (l = !0));
        let M = null, ve;
        this.options.gfm && (M = this.rules.other.listIsTask.exec(f), M && (ve = M[0] !== "[ ] ", f = f.replace(this.rules.other.listReplaceTask, ""))), s.items.push({
          type: "list_item",
          raw: u,
          task: !!M,
          checked: ve,
          loose: !1,
          text: f,
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
          const u = s.items[h].tokens.filter((O) => O.type === "space"), f = u.length > 0 && u.some((O) => this.rules.other.anyLine.test(O.raw));
          s.loose = f;
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
    const t = ps(e[1]), i = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = (l = e[3]) != null && l.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
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
        r.rows.push(ps(a, r.header.length).map((h, u) => ({
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
        const r = on(t.slice(0, -1), "\\");
        if ((t.length - r.length) % 2 === 0)
          return;
      } else {
        const r = fo(e[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(t) ? i = i.slice(1) : i = i.slice(1, -1)), fs(e, {
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
      return fs(t, s, t[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, t = "") {
    let i = this.rules.inline.emStrongLDelim.exec(n);
    if (!i || i[3] && t.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(i[1] || i[2] || "") || !t || this.rules.inline.punctuation.exec(t)) {
      const r = [...i[0]].length - 1;
      let l, a, h = r, u = 0;
      const f = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (f.lastIndex = 0, e = e.slice(-1 * n.length + r); (i = f.exec(e)) != null; ) {
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
        const O = [...i[0]][0].length, _ = n.slice(0, r + i.index + O + a);
        if (Math.min(r, a) % 2) {
          const P = _.slice(1, -1);
          return {
            type: "em",
            raw: _,
            text: P,
            tokens: this.lexer.inlineTokens(P)
          };
        }
        const $ = _.slice(2, -2);
        return {
          type: "strong",
          raw: _,
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
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Tt, this.options.tokenizer = this.options.tokenizer || new Jn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const t = {
      other: pe,
      block: Vn.normal,
      inline: rn.normal
    };
    this.options.pedantic ? (t.block = Vn.pedantic, t.inline = rn.pedantic) : this.options.gfm && (t.block = Vn.gfm, this.options.breaks ? t.inline = rn.breaks : t.inline = rn.gfm), this.tokenizer.rules = t;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: Vn,
      inline: rn
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
        const f = e.slice(1);
        let O;
        this.options.extensions.startBlock.forEach((_) => {
          O = _.call({ lexer: this }, f), typeof O == "number" && O >= 0 && (u = Math.min(u, O));
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
      const f = Object.keys(this.tokens.links);
      if (f.length > 0)
        for (; (s = this.tokenizer.rules.inline.reflinkSearch.exec(i)) != null; )
          f.includes(s[0].slice(s[0].lastIndexOf("[") + 1, -1)) && (i = i.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (s = this.tokenizer.rules.inline.anyPunctuation.exec(i)) != null; )
      i = i.slice(0, s.index) + "++" + i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (s = this.tokenizer.rules.inline.blockSkip.exec(i)) != null; )
      i = i.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    let r = !1, l = "";
    for (; e; ) {
      r || (l = ""), r = !1;
      let f;
      if ((h = (a = this.options.extensions) == null ? void 0 : a.inline) != null && h.some((_) => (f = _.call({ lexer: this }, e, t)) ? (e = e.substring(f.raw.length), t.push(f), !0) : !1))
        continue;
      if (f = this.tokenizer.escape(e)) {
        e = e.substring(f.raw.length), t.push(f);
        continue;
      }
      if (f = this.tokenizer.tag(e)) {
        e = e.substring(f.raw.length), t.push(f);
        continue;
      }
      if (f = this.tokenizer.link(e)) {
        e = e.substring(f.raw.length), t.push(f);
        continue;
      }
      if (f = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(f.raw.length);
        const _ = t.at(-1);
        f.type === "text" && (_ == null ? void 0 : _.type) === "text" ? (_.raw += f.raw, _.text += f.text) : t.push(f);
        continue;
      }
      if (f = this.tokenizer.emStrong(e, i, l)) {
        e = e.substring(f.raw.length), t.push(f);
        continue;
      }
      if (f = this.tokenizer.codespan(e)) {
        e = e.substring(f.raw.length), t.push(f);
        continue;
      }
      if (f = this.tokenizer.br(e)) {
        e = e.substring(f.raw.length), t.push(f);
        continue;
      }
      if (f = this.tokenizer.del(e)) {
        e = e.substring(f.raw.length), t.push(f);
        continue;
      }
      if (f = this.tokenizer.autolink(e)) {
        e = e.substring(f.raw.length), t.push(f);
        continue;
      }
      if (!this.state.inLink && (f = this.tokenizer.url(e))) {
        e = e.substring(f.raw.length), t.push(f);
        continue;
      }
      let O = e;
      if ((u = this.options.extensions) != null && u.startInline) {
        let _ = 1 / 0;
        const $ = e.slice(1);
        let P;
        this.options.extensions.startInline.forEach((M) => {
          P = M.call({ lexer: this }, $), typeof P == "number" && P >= 0 && (_ = Math.min(_, P));
        }), _ < 1 / 0 && _ >= 0 && (O = e.substring(0, _ + 1));
      }
      if (f = this.tokenizer.inlineText(O)) {
        e = e.substring(f.raw.length), f.raw.slice(-1) !== "_" && (l = f.raw.slice(-1)), r = !0;
        const _ = t.at(-1);
        (_ == null ? void 0 : _.type) === "text" ? (_.raw += f.raw, _.text += f.text) : t.push(f);
        continue;
      }
      if (e) {
        const _ = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(_);
          break;
        } else
          throw new Error(_);
      }
    }
    return t;
  }
}, ei = class {
  // set by the parser
  constructor(n) {
    X(this, "options");
    X(this, "parser");
    this.options = n || Tt;
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
    const i = this.parser.parseInline(t), s = ds(n);
    if (s === null)
      return i;
    n = s;
    let r = '<a href="' + n + '"';
    return e && (r += ' title="' + ze(e) + '"'), r += ">" + i + "</a>", r;
  }
  image({ href: n, title: e, text: t, tokens: i }) {
    i && (t = this.parser.parseInline(i, this.parser.textRenderer));
    const s = ds(n);
    if (s === null)
      return ze(t);
    n = s;
    let r = `<img src="${n}" alt="${t}"`;
    return e && (r += ` title="${ze(e)}"`), r += ">", r;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : ze(n.text);
  }
}, es = class {
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
    this.options = e || Tt, this.options.renderer = this.options.renderer || new ei(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new es();
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
        const u = a, f = this.options.extensions.renderers[u.type].call({ parser: this }, u);
        if (f !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(u.type)) {
          i += f || "";
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
          let u = h, f = this.renderer.text(u);
          for (; l + 1 < e.length && e[l + 1].type === "text"; )
            u = e[++l], f += `
` + this.renderer.text(u);
          t ? i += this.renderer.paragraph({
            type: "paragraph",
            raw: f,
            text: f,
            tokens: [{ type: "text", raw: f, text: f, escaped: !0 }]
          }) : i += f;
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
}, Pi, Yn = (Pi = class {
  constructor(n) {
    X(this, "options");
    X(this, "block");
    this.options = n || Tt;
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
}, X(Pi, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
])), Pi), mo = class {
  constructor(...n) {
    X(this, "defaults", Wi());
    X(this, "options", this.setOptions);
    X(this, "parse", this.parseMarkdown(!0));
    X(this, "parseInline", this.parseMarkdown(!1));
    X(this, "Parser", Ke);
    X(this, "Renderer", ei);
    X(this, "TextRenderer", es);
    X(this, "Lexer", Ze);
    X(this, "Tokenizer", Jn);
    X(this, "Hooks", Yn);
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
        const s = this.defaults.renderer || new ei(this.defaults);
        for (const r in t.renderer) {
          if (!(r in s))
            throw new Error(`renderer '${r}' does not exist`);
          if (["options", "parser"].includes(r))
            continue;
          const l = r, a = t.renderer[l], h = s[l];
          s[l] = (...u) => {
            let f = a.apply(s, u);
            return f === !1 && (f = h.apply(s, u)), f || "";
          };
        }
        i.renderer = s;
      }
      if (t.tokenizer) {
        const s = this.defaults.tokenizer || new Jn(this.defaults);
        for (const r in t.tokenizer) {
          if (!(r in s))
            throw new Error(`tokenizer '${r}' does not exist`);
          if (["options", "rules", "lexer"].includes(r))
            continue;
          const l = r, a = t.tokenizer[l], h = s[l];
          s[l] = (...u) => {
            let f = a.apply(s, u);
            return f === !1 && (f = h.apply(s, u)), f;
          };
        }
        i.tokenizer = s;
      }
      if (t.hooks) {
        const s = this.defaults.hooks || new Yn();
        for (const r in t.hooks) {
          if (!(r in s))
            throw new Error(`hook '${r}' does not exist`);
          if (["options", "block"].includes(r))
            continue;
          const l = r, a = t.hooks[l], h = s[l];
          Yn.passThroughHooks.has(r) ? s[l] = (u) => {
            if (this.defaults.async)
              return Promise.resolve(a.call(s, u)).then((O) => h.call(s, O));
            const f = a.call(s, u);
            return h.call(s, f);
          } : s[l] = (...u) => {
            let f = a.apply(s, u);
            return f === !1 && (f = h.apply(s, u)), f;
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
        let f = h(u, r);
        return r.hooks && (f = r.hooks.postprocess(f)), f;
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
}, Et = new mo();
function j(n, e) {
  return Et.parse(n, e);
}
j.options = j.setOptions = function(n) {
  return Et.setOptions(n), j.defaults = Et.defaults, Fs(j.defaults), j;
};
j.getDefaults = Wi;
j.defaults = Tt;
j.use = function(...n) {
  return Et.use(...n), j.defaults = Et.defaults, Fs(j.defaults), j;
};
j.walkTokens = function(n, e) {
  return Et.walkTokens(n, e);
};
j.parseInline = Et.parseInline;
j.Parser = Ke;
j.parser = Ke.parse;
j.Renderer = ei;
j.TextRenderer = es;
j.Lexer = Ze;
j.lexer = Ze.lex;
j.Tokenizer = Jn;
j.Hooks = Yn;
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
  entries: er,
  setPrototypeOf: gs,
  isFrozen: wo,
  getPrototypeOf: bo,
  getOwnPropertyDescriptor: xo
} = Object;
let {
  freeze: fe,
  seal: Re,
  create: tr
} = Object, {
  apply: zi,
  construct: $i
} = typeof Reflect < "u" && Reflect;
fe || (fe = function(e) {
  return e;
});
Re || (Re = function(e) {
  return e;
});
zi || (zi = function(e, t, i) {
  return e.apply(t, i);
});
$i || ($i = function(e, t) {
  return new e(...t);
});
const Fn = ge(Array.prototype.forEach), yo = ge(Array.prototype.lastIndexOf), ms = ge(Array.prototype.pop), an = ge(Array.prototype.push), vo = ge(Array.prototype.splice), Zn = ge(String.prototype.toLowerCase), xi = ge(String.prototype.toString), ws = ge(String.prototype.match), ln = ge(String.prototype.replace), _o = ge(String.prototype.indexOf), ko = ge(String.prototype.trim), Ie = ge(Object.prototype.hasOwnProperty), de = ge(RegExp.prototype.test), cn = Eo(TypeError);
function ge(n) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++)
      i[s - 1] = arguments[s];
    return zi(n, e, i);
  };
}
function Eo(n) {
  return function() {
    for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++)
      t[i] = arguments[i];
    return $i(n, t);
  };
}
function z(n, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Zn;
  gs && gs(n, null);
  let i = e.length;
  for (; i--; ) {
    let s = e[i];
    if (typeof s == "string") {
      const r = t(s);
      r !== s && (wo(e) || (e[i] = r), s = r);
    }
    n[s] = !0;
  }
  return n;
}
function So(n) {
  for (let e = 0; e < n.length; e++)
    Ie(n, e) || (n[e] = null);
  return n;
}
function Xe(n) {
  const e = tr(null);
  for (const [t, i] of er(n))
    Ie(n, t) && (Array.isArray(i) ? e[t] = So(i) : i && typeof i == "object" && i.constructor === Object ? e[t] = Xe(i) : e[t] = i);
  return e;
}
function un(n, e) {
  for (; n !== null; ) {
    const i = xo(n, e);
    if (i) {
      if (i.get)
        return ge(i.get);
      if (typeof i.value == "function")
        return ge(i.value);
    }
    n = bo(n);
  }
  function t() {
    return null;
  }
  return t;
}
const bs = fe(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), yi = fe(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), vi = fe(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), To = fe(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), _i = fe(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Ao = fe(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), xs = fe(["#text"]), ys = fe(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), ki = fe(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), vs = fe(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), jn = fe(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Co = Re(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Ro = Re(/<%[\w\W]*|[\w\W]*%>/gm), Oo = Re(/\$\{[\w\W]*/gm), Mo = Re(/^data-[\-\w.\u00B7-\uFFFF]+$/), Lo = Re(/^aria-[\-\w]+$/), nr = Re(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Io = Re(/^(?:\w+script|data):/i), Do = Re(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), ir = Re(/^html$/i), Po = Re(/^[a-z][.\w]*(-[.\w]+)+$/i);
var _s = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: Lo,
  ATTR_WHITESPACE: Do,
  CUSTOM_ELEMENT: Po,
  DATA_ATTR: Mo,
  DOCTYPE_NAME: ir,
  ERB_EXPR: Ro,
  IS_ALLOWED_URI: nr,
  IS_SCRIPT_OR_DATA: Io,
  MUSTACHE_EXPR: Co,
  TMPLIT_EXPR: Oo
});
const hn = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, No = function() {
  return typeof window > "u" ? null : window;
}, Bo = function(e, t) {
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
}, ks = function() {
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
function sr() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : No();
  const e = (A) => sr(A);
  if (e.version = "3.2.6", e.removed = [], !n || !n.document || n.document.nodeType !== hn.document || !n.Element)
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
    NamedNodeMap: f = n.NamedNodeMap || n.MozNamedAttrMap,
    HTMLFormElement: O,
    DOMParser: _,
    trustedTypes: $
  } = n, P = h.prototype, M = un(P, "cloneNode"), ve = un(P, "remove"), _e = un(P, "nextSibling"), le = un(P, "childNodes"), me = un(P, "parentNode");
  if (typeof l == "function") {
    const A = t.createElement("template");
    A.content && A.content.ownerDocument && (t = A.content.ownerDocument);
  }
  let te, Oe = "";
  const {
    implementation: Fe,
    createNodeIterator: Pe,
    createDocumentFragment: jt,
    getElementsByTagName: En
  } = t, {
    importNode: Sn
  } = i;
  let ae = ks();
  e.isSupported = typeof er == "function" && typeof me == "function" && Fe && Fe.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: Gt,
    ERB_EXPR: Wt,
    TMPLIT_EXPR: je,
    DATA_ATTR: ci,
    ARIA_ATTR: ui,
    IS_SCRIPT_OR_DATA: hi,
    ATTR_WHITESPACE: dt,
    CUSTOM_ELEMENT: di
  } = _s;
  let {
    IS_ALLOWED_URI: Tn
  } = _s, ne = null;
  const An = z({}, [...bs, ...yi, ...vi, ..._i, ...xs]);
  let se = null;
  const Cn = z({}, [...ys, ...ki, ...vs, ...jn]);
  let J = Object.seal(tr(null, {
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
  })), pt = null, qt = null, Rn = !0, On = !0, ft = !1, Mn = !0, tt = !1, At = !0, Ge = !1, Xt = !1, Yt = !1, nt = !1, Ct = !1, Rt = !1, Zt = !0, Ln = !1;
  const pi = "user-content-";
  let Ot = !0, ke = !1, We = {}, Ee = null;
  const gt = z({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let Kt = null;
  const In = z({}, ["audio", "video", "img", "source", "image", "track"]);
  let Qt = null;
  const Dn = z({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Mt = "http://www.w3.org/1998/Math/MathML", Lt = "http://www.w3.org/2000/svg", Ae = "http://www.w3.org/1999/xhtml";
  let it = Ae, Jt = !1, en = null;
  const tn = z({}, [Mt, Lt, Ae], xi);
  let mt = z({}, ["mi", "mo", "mn", "ms", "mtext"]), wt = z({}, ["annotation-xml"]);
  const fi = z({}, ["title", "style", "font", "a", "script"]);
  let st = null;
  const rt = ["application/xhtml+xml", "text/html"], o = "text/html";
  let d = null, v = null;
  const I = t.createElement("form"), Q = function(c) {
    return c instanceof RegExp || c instanceof Function;
  }, K = function() {
    let c = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(v && v === c)) {
      if ((!c || typeof c != "object") && (c = {}), c = Xe(c), st = // eslint-disable-next-line unicorn/prefer-includes
      rt.indexOf(c.PARSER_MEDIA_TYPE) === -1 ? o : c.PARSER_MEDIA_TYPE, d = st === "application/xhtml+xml" ? xi : Zn, ne = Ie(c, "ALLOWED_TAGS") ? z({}, c.ALLOWED_TAGS, d) : An, se = Ie(c, "ALLOWED_ATTR") ? z({}, c.ALLOWED_ATTR, d) : Cn, en = Ie(c, "ALLOWED_NAMESPACES") ? z({}, c.ALLOWED_NAMESPACES, xi) : tn, Qt = Ie(c, "ADD_URI_SAFE_ATTR") ? z(Xe(Dn), c.ADD_URI_SAFE_ATTR, d) : Dn, Kt = Ie(c, "ADD_DATA_URI_TAGS") ? z(Xe(In), c.ADD_DATA_URI_TAGS, d) : In, Ee = Ie(c, "FORBID_CONTENTS") ? z({}, c.FORBID_CONTENTS, d) : gt, pt = Ie(c, "FORBID_TAGS") ? z({}, c.FORBID_TAGS, d) : Xe({}), qt = Ie(c, "FORBID_ATTR") ? z({}, c.FORBID_ATTR, d) : Xe({}), We = Ie(c, "USE_PROFILES") ? c.USE_PROFILES : !1, Rn = c.ALLOW_ARIA_ATTR !== !1, On = c.ALLOW_DATA_ATTR !== !1, ft = c.ALLOW_UNKNOWN_PROTOCOLS || !1, Mn = c.ALLOW_SELF_CLOSE_IN_ATTR !== !1, tt = c.SAFE_FOR_TEMPLATES || !1, At = c.SAFE_FOR_XML !== !1, Ge = c.WHOLE_DOCUMENT || !1, nt = c.RETURN_DOM || !1, Ct = c.RETURN_DOM_FRAGMENT || !1, Rt = c.RETURN_TRUSTED_TYPE || !1, Yt = c.FORCE_BODY || !1, Zt = c.SANITIZE_DOM !== !1, Ln = c.SANITIZE_NAMED_PROPS || !1, Ot = c.KEEP_CONTENT !== !1, ke = c.IN_PLACE || !1, Tn = c.ALLOWED_URI_REGEXP || nr, it = c.NAMESPACE || Ae, mt = c.MATHML_TEXT_INTEGRATION_POINTS || mt, wt = c.HTML_INTEGRATION_POINTS || wt, J = c.CUSTOM_ELEMENT_HANDLING || {}, c.CUSTOM_ELEMENT_HANDLING && Q(c.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (J.tagNameCheck = c.CUSTOM_ELEMENT_HANDLING.tagNameCheck), c.CUSTOM_ELEMENT_HANDLING && Q(c.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (J.attributeNameCheck = c.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), c.CUSTOM_ELEMENT_HANDLING && typeof c.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (J.allowCustomizedBuiltInElements = c.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), tt && (On = !1), Ct && (nt = !0), We && (ne = z({}, xs), se = [], We.html === !0 && (z(ne, bs), z(se, ys)), We.svg === !0 && (z(ne, yi), z(se, ki), z(se, jn)), We.svgFilters === !0 && (z(ne, vi), z(se, ki), z(se, jn)), We.mathMl === !0 && (z(ne, _i), z(se, vs), z(se, jn))), c.ADD_TAGS && (ne === An && (ne = Xe(ne)), z(ne, c.ADD_TAGS, d)), c.ADD_ATTR && (se === Cn && (se = Xe(se)), z(se, c.ADD_ATTR, d)), c.ADD_URI_SAFE_ATTR && z(Qt, c.ADD_URI_SAFE_ATTR, d), c.FORBID_CONTENTS && (Ee === gt && (Ee = Xe(Ee)), z(Ee, c.FORBID_CONTENTS, d)), Ot && (ne["#text"] = !0), Ge && z(ne, ["html", "head", "body"]), ne.table && (z(ne, ["tbody"]), delete pt.tbody), c.TRUSTED_TYPES_POLICY) {
        if (typeof c.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw cn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof c.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw cn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        te = c.TRUSTED_TYPES_POLICY, Oe = te.createHTML("");
      } else
        te === void 0 && (te = Bo($, s)), te !== null && typeof Oe == "string" && (Oe = te.createHTML(""));
      fe && fe(c), v = c;
    }
  }, T = z({}, [...yi, ...vi, ...To]), S = z({}, [..._i, ...Ao]), L = function(c) {
    let y = me(c);
    (!y || !y.tagName) && (y = {
      namespaceURI: it,
      tagName: "template"
    });
    const E = Zn(c.tagName), q = Zn(y.tagName);
    return en[c.namespaceURI] ? c.namespaceURI === Lt ? y.namespaceURI === Ae ? E === "svg" : y.namespaceURI === Mt ? E === "svg" && (q === "annotation-xml" || mt[q]) : !!T[E] : c.namespaceURI === Mt ? y.namespaceURI === Ae ? E === "math" : y.namespaceURI === Lt ? E === "math" && wt[q] : !!S[E] : c.namespaceURI === Ae ? y.namespaceURI === Lt && !wt[q] || y.namespaceURI === Mt && !mt[q] ? !1 : !S[E] && (fi[E] || !T[E]) : !!(st === "application/xhtml+xml" && en[c.namespaceURI]) : !1;
  }, V = function(c) {
    an(e.removed, {
      element: c
    });
    try {
      me(c).removeChild(c);
    } catch {
      ve(c);
    }
  }, W = function(c, y) {
    try {
      an(e.removed, {
        attribute: y.getAttributeNode(c),
        from: y
      });
    } catch {
      an(e.removed, {
        attribute: null,
        from: y
      });
    }
    if (y.removeAttribute(c), c === "is")
      if (nt || Ct)
        try {
          V(y);
        } catch {
        }
      else
        try {
          y.setAttribute(c, "");
        } catch {
        }
  }, ot = function(c) {
    let y = null, E = null;
    if (Yt)
      c = "<remove></remove>" + c;
    else {
      const ee = ws(c, /^[\r\n\t ]+/);
      E = ee && ee[0];
    }
    st === "application/xhtml+xml" && it === Ae && (c = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + c + "</body></html>");
    const q = te ? te.createHTML(c) : c;
    if (it === Ae)
      try {
        y = new _().parseFromString(q, st);
      } catch {
      }
    if (!y || !y.documentElement) {
      y = Fe.createDocument(it, "template", null);
      try {
        y.documentElement.innerHTML = Jt ? Oe : q;
      } catch {
      }
    }
    const re = y.body || y.documentElement;
    return c && E && re.insertBefore(t.createTextNode(E), re.childNodes[0] || null), it === Ae ? En.call(y, Ge ? "html" : "body")[0] : Ge ? y.documentElement : re;
  }, It = function(c) {
    return Pe.call(
      c.ownerDocument || c,
      c,
      // eslint-disable-next-line no-bitwise
      u.SHOW_ELEMENT | u.SHOW_COMMENT | u.SHOW_TEXT | u.SHOW_PROCESSING_INSTRUCTION | u.SHOW_CDATA_SECTION,
      null
    );
  }, bt = function(c) {
    return c instanceof O && (typeof c.nodeName != "string" || typeof c.textContent != "string" || typeof c.removeChild != "function" || !(c.attributes instanceof f) || typeof c.removeAttribute != "function" || typeof c.setAttribute != "function" || typeof c.namespaceURI != "string" || typeof c.insertBefore != "function" || typeof c.hasChildNodes != "function");
  }, Pn = function(c) {
    return typeof a == "function" && c instanceof a;
  };
  function Se(A, c, y) {
    Fn(A, (E) => {
      E.call(e, c, y, v);
    });
  }
  const Nn = function(c) {
    let y = null;
    if (Se(ae.beforeSanitizeElements, c, null), bt(c))
      return V(c), !0;
    const E = d(c.nodeName);
    if (Se(ae.uponSanitizeElement, c, {
      tagName: E,
      allowedTags: ne
    }), At && c.hasChildNodes() && !Pn(c.firstElementChild) && de(/<[/\w!]/g, c.innerHTML) && de(/<[/\w!]/g, c.textContent) || c.nodeType === hn.progressingInstruction || At && c.nodeType === hn.comment && de(/<[/\w]/g, c.data))
      return V(c), !0;
    if (!ne[E] || pt[E]) {
      if (!pt[E] && Un(E) && (J.tagNameCheck instanceof RegExp && de(J.tagNameCheck, E) || J.tagNameCheck instanceof Function && J.tagNameCheck(E)))
        return !1;
      if (Ot && !Ee[E]) {
        const q = me(c) || c.parentNode, re = le(c) || c.childNodes;
        if (re && q) {
          const ee = re.length;
          for (let ue = ee - 1; ue >= 0; --ue) {
            const Me = M(re[ue], !0);
            Me.__removalCount = (c.__removalCount || 0) + 1, q.insertBefore(Me, _e(c));
          }
        }
      }
      return V(c), !0;
    }
    return c instanceof h && !L(c) || (E === "noscript" || E === "noembed" || E === "noframes") && de(/<\/no(script|embed|frames)/i, c.innerHTML) ? (V(c), !0) : (tt && c.nodeType === hn.text && (y = c.textContent, Fn([Gt, Wt, je], (q) => {
      y = ln(y, q, " ");
    }), c.textContent !== y && (an(e.removed, {
      element: c.cloneNode()
    }), c.textContent = y)), Se(ae.afterSanitizeElements, c, null), !1);
  }, Bn = function(c, y, E) {
    if (Zt && (y === "id" || y === "name") && (E in t || E in I))
      return !1;
    if (!(On && !qt[y] && de(ci, y))) {
      if (!(Rn && de(ui, y))) {
        if (!se[y] || qt[y]) {
          if (
            // First condition does a very basic check if a) it's basically a valid custom element tagname AND
            // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
            !(Un(c) && (J.tagNameCheck instanceof RegExp && de(J.tagNameCheck, c) || J.tagNameCheck instanceof Function && J.tagNameCheck(c)) && (J.attributeNameCheck instanceof RegExp && de(J.attributeNameCheck, y) || J.attributeNameCheck instanceof Function && J.attributeNameCheck(y)) || // Alternative, second condition checks if it's an `is`-attribute, AND
            // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            y === "is" && J.allowCustomizedBuiltInElements && (J.tagNameCheck instanceof RegExp && de(J.tagNameCheck, E) || J.tagNameCheck instanceof Function && J.tagNameCheck(E)))
          ) return !1;
        } else if (!Qt[y]) {
          if (!de(Tn, ln(E, dt, ""))) {
            if (!((y === "src" || y === "xlink:href" || y === "href") && c !== "script" && _o(E, "data:") === 0 && Kt[c])) {
              if (!(ft && !de(hi, ln(E, dt, "")))) {
                if (E)
                  return !1;
              }
            }
          }
        }
      }
    }
    return !0;
  }, Un = function(c) {
    return c !== "annotation-xml" && ws(c, di);
  }, nn = function(c) {
    Se(ae.beforeSanitizeAttributes, c, null);
    const {
      attributes: y
    } = c;
    if (!y || bt(c))
      return;
    const E = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: se,
      forceKeepAttr: void 0
    };
    let q = y.length;
    for (; q--; ) {
      const re = y[q], {
        name: ee,
        namespaceURI: ue,
        value: Me
      } = re, Ne = d(ee), sn = Me;
      let w = ee === "value" ? sn : ko(sn);
      if (E.attrName = Ne, E.attrValue = w, E.keepAttr = !0, E.forceKeepAttr = void 0, Se(ae.uponSanitizeAttribute, c, E), w = E.attrValue, Ln && (Ne === "id" || Ne === "name") && (W(ee, c), w = pi + w), At && de(/((--!?|])>)|<\/(style|title)/i, w)) {
        W(ee, c);
        continue;
      }
      if (E.forceKeepAttr)
        continue;
      if (!E.keepAttr) {
        W(ee, c);
        continue;
      }
      if (!Mn && de(/\/>/i, w)) {
        W(ee, c);
        continue;
      }
      tt && Fn([Gt, Wt, je], (U) => {
        w = ln(w, U, " ");
      });
      const C = d(c.nodeName);
      if (!Bn(C, Ne, w)) {
        W(ee, c);
        continue;
      }
      if (te && typeof $ == "object" && typeof $.getAttributeType == "function" && !ue)
        switch ($.getAttributeType(C, Ne)) {
          case "TrustedHTML": {
            w = te.createHTML(w);
            break;
          }
          case "TrustedScriptURL": {
            w = te.createScriptURL(w);
            break;
          }
        }
      if (w !== sn)
        try {
          ue ? c.setAttributeNS(ue, ee, w) : c.setAttribute(ee, w), bt(c) ? V(c) : ms(e.removed);
        } catch {
          W(ee, c);
        }
    }
    Se(ae.afterSanitizeAttributes, c, null);
  }, Dt = function A(c) {
    let y = null;
    const E = It(c);
    for (Se(ae.beforeSanitizeShadowDOM, c, null); y = E.nextNode(); )
      Se(ae.uponSanitizeShadowNode, y, null), Nn(y), nn(y), y.content instanceof r && A(y.content);
    Se(ae.afterSanitizeShadowDOM, c, null);
  };
  return e.sanitize = function(A) {
    let c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, y = null, E = null, q = null, re = null;
    if (Jt = !A, Jt && (A = "<!-->"), typeof A != "string" && !Pn(A))
      if (typeof A.toString == "function") {
        if (A = A.toString(), typeof A != "string")
          throw cn("dirty is not a string, aborting");
      } else
        throw cn("toString is not a function");
    if (!e.isSupported)
      return A;
    if (Xt || K(c), e.removed = [], typeof A == "string" && (ke = !1), ke) {
      if (A.nodeName) {
        const Me = d(A.nodeName);
        if (!ne[Me] || pt[Me])
          throw cn("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (A instanceof a)
      y = ot("<!---->"), E = y.ownerDocument.importNode(A, !0), E.nodeType === hn.element && E.nodeName === "BODY" || E.nodeName === "HTML" ? y = E : y.appendChild(E);
    else {
      if (!nt && !tt && !Ge && // eslint-disable-next-line unicorn/prefer-includes
      A.indexOf("<") === -1)
        return te && Rt ? te.createHTML(A) : A;
      if (y = ot(A), !y)
        return nt ? null : Rt ? Oe : "";
    }
    y && Yt && V(y.firstChild);
    const ee = It(ke ? A : y);
    for (; q = ee.nextNode(); )
      Nn(q), nn(q), q.content instanceof r && Dt(q.content);
    if (ke)
      return A;
    if (nt) {
      if (Ct)
        for (re = jt.call(y.ownerDocument); y.firstChild; )
          re.appendChild(y.firstChild);
      else
        re = y;
      return (se.shadowroot || se.shadowrootmode) && (re = Sn.call(i, re, !0)), re;
    }
    let ue = Ge ? y.outerHTML : y.innerHTML;
    return Ge && ne["!doctype"] && y.ownerDocument && y.ownerDocument.doctype && y.ownerDocument.doctype.name && de(ir, y.ownerDocument.doctype.name) && (ue = "<!DOCTYPE " + y.ownerDocument.doctype.name + `>
` + ue), tt && Fn([Gt, Wt, je], (Me) => {
      ue = ln(ue, Me, " ");
    }), te && Rt ? te.createHTML(ue) : ue;
  }, e.setConfig = function() {
    let A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    K(A), Xt = !0;
  }, e.clearConfig = function() {
    v = null, Xt = !1;
  }, e.isValidAttribute = function(A, c, y) {
    v || K({});
    const E = d(A), q = d(c);
    return Bn(E, q, y);
  }, e.addHook = function(A, c) {
    typeof c == "function" && an(ae[A], c);
  }, e.removeHook = function(A, c) {
    if (c !== void 0) {
      const y = yo(ae[A], c);
      return y === -1 ? void 0 : vo(ae[A], y, 1)[0];
    }
    return ms(ae[A]);
  }, e.removeHooks = function(A) {
    ae[A] = [];
  }, e.removeAllHooks = function() {
    ae = ks();
  }, e;
}
var Es = sr();
function St(n) {
  const e = performance.timeOrigin + n;
  return new Date(e).toISOString();
}
function rr(n, e) {
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
    t.innerHTML = Es.sanitize(s);
  }) : t.innerHTML = Es.sanitize(i), t;
}
class Uo {
  constructor(e, t, i, s) {
    this.tArmed = null, this.cardView = i;
    const r = (l) => {
      if (!this.tArmed)
        return;
      const a = s.getBoardLocationFromMouseEvent(l), h = {
        sensor_id: e,
        action_type: "ClickAction",
        click_x: a.x,
        click_y: a.y,
        timestamp_action: St(performance.now())
      };
      t(h);
    };
    i.addClickCallback(r);
  }
  arm() {
    this.cardView.root.classList.add("card--clickable"), this.tArmed = performance.now(), this.cardView.setInteractivity(!0);
  }
  destroy() {
    this.cardView.root.classList.remove("card--clickable"), this.tArmed = null, this.cardView.setInteractivity(!1);
  }
}
class zo {
  constructor(e, t, i) {
    this.tArmed = null, this.cardView = i, i.addDoneCallback(
      () => {
        if (!this.tArmed)
          return;
        const s = {
          sensor_id: e,
          action_type: "DoneAction",
          timestamp_action: St(performance.now())
        };
        t(s);
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
class $o {
  constructor(e, t) {
    this.sensorId = e, this.onSensorFired = t;
  }
  arm() {
    const e = {
      sensor_id: this.sensorId,
      action_type: "TimeoutAction",
      timestamp_action: St(performance.now())
    };
    this.onSensorFired(e);
  }
  destroy() {
  }
}
class Ho {
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
        timestamp_action: St(performance.now())
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
function Vo(n) {
  if (!("addClickCallback" in n))
    throw new Error("CardView is not clickable");
}
function Fo(n) {
  if (!("addDoneCallback" in n))
    throw new Error("CardView is not doneable");
}
class jo extends Vt {
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
class Go extends Vt {
  constructor() {
    super(...arguments), this.pageIndex = 0, this.onPressDone = null, this.contentPages = [];
  }
  async prepare() {
    const e = this.card, t = this.boardCoords;
    if (e.pages.length === 0)
      throw new Error("No pages provided to MarkdownPagesViewer");
    const i = document.createElement("div");
    i.classList.add("markdown-pages-viewer"), this.root.appendChild(i), this.viewerDiv = document.createElement("div"), this.viewerDiv.classList.add("markdown-pages-viewer__window"), i.appendChild(this.viewerDiv), this.contentPages = [];
    for (const r of e.pages) {
      const l = {
        text: r,
        textColor: e.text_color,
        fontSize: e.font_size,
        justificationHorizontal: e.justification_horizontal,
        justificationVertical: e.justification_vertical
      }, a = rr(
        l,
        (h) => t.getSizePx(h) + "px"
      );
      this.contentPages.push(a);
    }
    let s = document.createElement("div");
    s.classList.add("nav-tray"), i.appendChild(s), this.navButtons = new Wo(), this.navButtons.mount(s), this.doneButton = new Hi("Done"), this.doneButton.mount(s), this.goToPage(0), this.navButtons.addButtonPressListeners(
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
    for (const i of this.contentPages)
      i.isConnected || this.viewerDiv.insertBefore(i, this.viewerDiv.lastElementChild);
    this.contentPages.forEach((i, s) => {
      i.style.display = s === e ? "block" : "none";
    }), this.pageIndex = e, this.setButtonStates();
  }
  handleBack() {
    this.pageIndex > 0 && this.goToPage(this.pageIndex - 1);
  }
  handleNext() {
    this.pageIndex < this.contentPages.length - 1 && this.goToPage(this.pageIndex + 1);
  }
  handleDone() {
    var e;
    (e = this.onPressDone) == null || e.call(this);
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
class Wo extends ye {
  constructor() {
    super(), this.root = document.createElement("div"), this.lastButton = new Hi("←"), this.lastButton.mount(this.root), this.nextButton = new Hi("→"), this.nextButton.mount(this.root);
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
class Hi extends ye {
  constructor(e) {
    super();
    const t = document.createElement("button");
    t.className = "nav-tray__button", t.textContent = e, this.root = t;
  }
  addButtonPressListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class qo extends Vt {
  addClickCallback(e) {
    if (!this.imageContainer)
      throw new Error("Image container not initialized. Did you forget to call load()?");
    this.imageContainer.addEventListener("click", (t) => {
      e(t);
    });
  }
  async prepare(e) {
    this.imageContainer = document.createElement("div"), this.imageContainer.classList.add("image-card"), this.root.appendChild(this.imageContainer), this.image = await e.getImage(
      this.card.image
    ), this.image.classList.add("image-card__content"), this.image.draggable = !1, this.imageContainer.appendChild(this.image);
  }
}
class Xo extends Vt {
  async prepare() {
    this.textContainer = document.createElement("div"), this.textContainer.classList.add("text-card"), this.root.appendChild(this.textContainer), this.textContainer.style.backgroundColor = this.card.background_color;
    const e = {
      text: this.card.text,
      textColor: this.card.text_color,
      fontSize: this.card.font_size,
      justificationHorizontal: this.card.justification_horizontal,
      justificationVertical: this.card.justification_vertical
    }, t = rr(
      e,
      (i) => this.boardCoords.getSizePx(i) + "px"
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
class Yo extends Vt {
  async prepare(e) {
    this.videoContainer = document.createElement("div"), this.videoContainer.classList.add("video-card"), this.root.appendChild(this.videoContainer), this.video = await e.getVideo(
      this.card.video
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
class Zo extends Vt {
  async prepare() {
    this.root.style.backgroundColor = this.card.color;
  }
  addClickCallback(e) {
    this.root.addEventListener("click", (t) => {
      e(t);
    });
  }
}
class Ko {
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
class Qo {
  // Map of sensor ID to SensorBinding
  constructor(e, t) {
    this.cardViews = /* @__PURE__ */ new Map(), this.sensorBindings = /* @__PURE__ */ new Map(), this.root = document.createElement("div"), this.root.className = "board-view", this.root.id = `${e}`, this.root.style.width = t.board_width_px + "px", this.root.style.height = t.board_height_px + "px", this.root.style.backgroundColor = t.background_color, this.setBoardState(!1, !1);
  }
  getCoordinateSystem() {
    const { width: e, height: t, left: i, top: s } = this.root.getBoundingClientRect();
    return new Ko(e, t, i, s);
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
      case "FixationPointCard":
        s = new jo(
          e,
          i
        );
        break;
      case "MarkdownPagesCard":
        s = new Go(
          e,
          i
        );
        break;
      case "ImageCard":
        s = new qo(
          e,
          i
        );
        break;
      case "VideoCard":
        s = new Yo(
          e,
          i
        );
        break;
      case "TextCard":
        s = new Xo(
          e,
          i
        );
        break;
      case "BlankCard":
        s = new Zo(
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
      i = new $o(
        e.sensor_id,
        t
      );
    else if (e.sensor_type === "KeySensor")
      i = new Ho(
        e.sensor_id,
        t,
        e.key
      );
    else if (e.sensor_type == "ClickSensor") {
      let s = this.getCardView(e.card_id);
      Vo(s), i = new Uo(
        e.sensor_id,
        t,
        s,
        this.getCoordinateSystem()
      );
    } else if (e.sensor_type == "DoneSensor") {
      let s = this.getCardView(e.card_id);
      Fo(s), i = new zo(
        e.sensor_id,
        t,
        s
      );
    } else
      throw new Error(`Unknown Sensor of type ${e.sensor_type}`);
    this.sensorBindings.set(e.sensor_id, i);
  }
  startSensor(e) {
    this.getSensorBinding(e).arm();
  }
  destroySensor(e) {
    this.getSensorBinding(e).destroy(), this.sensorBindings.delete(e);
  }
}
class Jo {
  constructor(e) {
    this.boardViews = /* @__PURE__ */ new Map(), this.activeBoardId = null, this.root = document.createElement("div"), this.root.className = "board-views-ui", this.assetManager = e;
  }
  createBoardView(e, t) {
    if (this.boardViews.has(e))
      return this.getBoardView(e);
    const i = new Qo(e, t);
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
class ea {
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
function ta() {
  const n = document.createElement("div");
  document.body.appendChild(n);
  const e = document.createElement("div");
  e.classList.add("node-engine-container"), n.appendChild(e);
  const t = document.createElement("div");
  t.classList.add("node-engine-content"), e.appendChild(t);
  const i = new ea(), s = new Jo(
    i
  );
  t.appendChild(s.root);
  const r = new Ir();
  return r.mount(t), {
    boardViewsUI: s,
    shellUI: r,
    assetManager: i
  };
}
class Ss {
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
class na {
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
class Ts {
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
class ia {
  constructor(e, t) {
    this.prepared = !1, this.started = !1, this.deferredAction = new Ts(), this.deferredOutcomeDone = new Ts(), this.boardView = t, this.node = e, this.scheduler = new Ss(), this.outcomeSchedulers = {};
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
      const r = new na(this.boardView);
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
      const r = new Ss();
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
      timestamp_start: St(e),
      timestamp_end: St(performance.now())
    };
  }
}
class sa {
  constructor() {
    this.bufferedNodePlays = /* @__PURE__ */ new Map();
    const { shellUI: e, boardViewsUI: t } = ta();
    this.shellUI = e, this.boardViewsUI = t;
  }
  async prepare(e) {
    const t = crypto.randomUUID(), i = this.boardViewsUI.createBoardView(t, e.board), s = new ia(
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
function ra(n, e) {
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
      for (const f of i[a.node_id] || [])
        if (f.sensor_id === u) {
          let O = parseFloat(f.bonus_amount_usd);
          !isNaN(O) && O > 0 && (t += O);
        }
    }
  }
  return t = Math.max(0, t), t = Math.round(t * 100) / 100, t;
}
function oa() {
  return {
    user_agent: navigator.userAgent,
    display_width_px: screen.width,
    display_height_px: screen.height,
    viewport_width_px: window.innerWidth,
    viewport_height_px: window.innerHeight
  };
}
var aa = "2.0.4", Vi = 500, As = "user-agent", zt = "", Cs = "?", ti = "function", ut = "undefined", $t = "object", Fi = "string", we = "browser", Ye = "cpu", Ve = "device", De = "engine", Ce = "os", Bt = "result", b = "name", p = "type", m = "vendor", x = "version", be = "architecture", _n = "major", g = "model", xn = "console", D = "mobile", G = "tablet", ie = "smarttv", $e = "wearable", Gn = "xr", yn = "embedded", dn = "inapp", ts = "brands", kt = "formFactors", ns = "fullVersionList", Ut = "platform", is = "platformVersion", ai = "bitness", ht = "sec-ch-ua", la = ht + "-full-version-list", ca = ht + "-arch", ua = ht + "-" + ai, ha = ht + "-form-factors", da = ht + "-" + D, pa = ht + "-" + g, or = ht + "-" + Ut, fa = or + "-version", ar = [ts, ns, D, g, Ut, is, be, kt, ai], Wn = "Amazon", Pt = "Apple", Rs = "ASUS", Os = "BlackBerry", yt = "Google", Ms = "Huawei", Ei = "Lenovo", Ls = "Honor", qn = "LG", Si = "Microsoft", Ti = "Motorola", Ai = "Nvidia", Is = "OnePlus", Ci = "OPPO", pn = "Samsung", Ds = "Sharp", fn = "Sony", Ri = "Xiaomi", Oi = "Zebra", Ps = "Chrome", Ns = "Chromium", lt = "Chromecast", Kn = "Edge", gn = "Firefox", mn = "Opera", Mi = "Facebook", Bs = "Sogou", Nt = "Mobile ", wn = " Browser", ji = "Windows", ga = typeof window !== ut, xe = ga && window.navigator ? window.navigator : void 0, ct = xe && xe.userAgentData ? xe.userAgentData : void 0, ma = function(n, e) {
  var t = {}, i = e;
  if (!ni(e)) {
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
}, Gi = function(n, e) {
  if (typeof n === $t && n.length > 0) {
    for (var t in n)
      if (Qe(e) == Qe(n[t])) return !0;
    return !1;
  }
  return Ft(n) ? Qe(e) == Qe(n) : !1;
}, ni = function(n, e) {
  for (var t in n)
    return /^(browser|cpu|device|engine|os)$/.test(t) || (e ? ni(n[t]) : !1);
}, Ft = function(n) {
  return typeof n === Fi;
}, Li = function(n) {
  if (n) {
    for (var e = [], t = Ht(/\\?\"/g, n).split(","), i = 0; i < t.length; i++)
      if (t[i].indexOf(";") > -1) {
        var s = ii(t[i]).split(";v=");
        e[i] = { brand: s[0], version: s[1] };
      } else
        e[i] = ii(t[i]);
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
}, bn = function(n) {
  return Ht(/\\?\"/g, n);
}, ii = function(n, e) {
  if (Ft(n))
    return n = Ht(/^\s\s*/, n), typeof e === ut ? n : n.substring(0, Vi);
}, Di = function(n, e) {
  if (!(!n || !e))
    for (var t = 0, i, s, r, l, a, h; t < e.length && !a; ) {
      var u = e[t], f = e[t + 1];
      for (i = s = 0; i < u.length && !a && u[i]; )
        if (a = u[i++].exec(n), a)
          for (r = 0; r < f.length; r++)
            h = a[++s], l = f[r], typeof l === $t && l.length > 0 ? l.length === 2 ? typeof l[1] == ti ? this[l[0]] = l[1].call(this, h) : this[l[0]] = l[1] : l.length >= 3 && (typeof l[1] === ti && !(l[1].exec && l[1].test) ? l.length > 3 ? this[l[0]] = h ? l[1].apply(this, l.slice(2)) : void 0 : this[l[0]] = h ? l[1].call(this, h, l[2]) : void 0 : l.length == 3 ? this[l[0]] = h ? h.replace(l[1], l[2]) : void 0 : l.length == 4 ? this[l[0]] = h ? l[3].call(this, h.replace(l[1], l[2])) : void 0 : l.length > 4 && (this[l[0]] = h ? l[3].apply(this, [h.replace(l[1], l[2])].concat(l.slice(4))) : void 0)) : this[l] = h || void 0;
      t += 2;
    }
}, He = function(n, e) {
  for (var t in e)
    if (typeof e[t] === $t && e[t].length > 0) {
      for (var i = 0; i < e[t].length; i++)
        if (Gi(e[t][i], n))
          return t === Cs ? void 0 : t;
    } else if (Gi(e[t], n))
      return t === Cs ? void 0 : t;
  return e.hasOwnProperty("*") ? e["*"] : n;
}, Us = {
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
}, zs = {
  embedded: "Automotive",
  mobile: "Mobile",
  tablet: ["Tablet", "EInk"],
  smarttv: "TV",
  wearable: "Watch",
  xr: ["VR", "XR"],
  "?": ["Desktop", "Unknown"],
  "*": void 0
}, wa = {
  Chrome: "Google Chrome",
  Edge: "Microsoft Edge",
  "Edge WebView2": "Microsoft Edge WebView2",
  "Chrome WebView": "Android WebView",
  "Chrome Headless": "HeadlessChrome",
  "Huawei Browser": "HuaweiBrowser",
  "MIUI Browser": "Miui Browser",
  "Opera Mobi": "OperaMobile",
  Yandex: "YaBrowser"
}, $s = {
  browser: [
    [
      // Most common regardless engine
      /\b(?:crmo|crios)\/([\w\.]+)/i
      // Chrome for Android/iOS
    ],
    [x, [b, Nt + "Chrome"]],
    [
      /webview.+edge\/([\w\.]+)/i
      // Microsoft Edge
    ],
    [x, [b, Kn + " WebView"]],
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
    [x, [b, mn + " Mini"]],
    [
      /\bop(?:rg)?x\/([\w\.]+)/i
      // Opera GX
    ],
    [x, [b, mn + " GX"]],
    [
      /\bopr\/([\w\.]+)/i
      // Opera Webkit
    ],
    [x, [b, mn]],
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
    [x, [b, "Smart " + Ei + wn]],
    [
      /(avast|avg)\/([\w\.]+)/i
      // Avast/AVG Secure Browser
    ],
    [[b, /(.+)/, "$1 Secure" + wn], x],
    [
      /\bfocus\/([\w\.]+)/i
      // Firefox Focus
    ],
    [x, [b, gn + " Focus"]],
    [
      /\bopt\/([\w\.]+)/i
      // Opera Touch
    ],
    [x, [b, mn + " Touch"]],
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
    [x, [b, mn + " Coast"]],
    [
      /miuibrowser\/([\w\.]+)/i
      // MIUI Browser
    ],
    [x, [b, "MIUI" + wn]],
    [
      /fxios\/([\w\.-]+)/i
      // Firefox for iOS
    ],
    [x, [b, Nt + gn]],
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
    [[b, /(.+)/, "$1" + wn], x],
    [
      // Oculus/Sailfish/HuaweiBrowser/VivoBrowser/PicoBrowser
      /samsungbrowser\/([\w\.]+)/i
      // Samsung Internet
    ],
    [x, [b, pn + " Internet"]],
    [
      /metasr[\/ ]?([\d\.]+)/i
      // Sogou Explorer
    ],
    [x, [b, Bs + " Explorer"]],
    [
      /(sogou)mo\w+\/([\d\.]+)/i
      // Sogou Mobile
    ],
    [[b, Bs + " Mobile"], x],
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
    [[b, Mi], x, [p, dn]],
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
    [b, x, [p, dn]],
    [
      /\bgsa\/([\w\.]+) .*safari\//i
      // Google Search Appliance on iOS
    ],
    [x, [b, "GSA"], [p, dn]],
    [
      /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i
      // TikTok
    ],
    [x, [b, "TikTok"], [p, dn]],
    [
      /\[(linkedin)app\]/i
      // LinkedIn App for iOS & Android
    ],
    [b, [p, dn]],
    [
      /(chromium)[\/ ]([-\w\.]+)/i
      // Chromium
    ],
    [b, x],
    [
      /headlesschrome(?:\/([\w\.]+)| )/i
      // Chrome Headless
    ],
    [x, [b, Ps + " Headless"]],
    [
      /wv\).+chrome\/([\w\.]+).+edgw\//i
      // Edge WebView2
    ],
    [x, [b, Kn + " WebView2"]],
    [
      / wv\).+(chrome)\/([\w\.]+)/i
      // Chrome WebView
    ],
    [[b, Ps + " WebView"], x],
    [
      /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
      // Android Browser
    ],
    [x, [b, "Android" + wn]],
    [
      /chrome\/([\w\.]+) mobile/i
      // Chrome Mobile
    ],
    [x, [b, Nt + "Chrome"]],
    [
      /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
      // Chrome/OmniWeb/Arora/Tizen/Nokia
    ],
    [b, x],
    [
      /version\/([\w\.\,]+) .*mobile(?:\/\w+ | ?)safari/i
      // Safari Mobile
    ],
    [x, [b, Nt + "Safari"]],
    [
      /iphone .*mobile(?:\/\w+ | ?)safari/i
    ],
    [[b, Nt + "Safari"]],
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
    [[b, Nt + gn], x],
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
    [x, [b, gn + " Reality"]],
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
    [b, [x, /[^\d\.]+./, zt]]
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
    [g, [m, pn], [p, G]],
    [
      /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
      /samsung[- ]((?!sm-[lr]|browser)[-\w]+)/i,
      /sec-(sgh\w+)/i
    ],
    [g, [m, pn], [p, D]],
    [
      // Apple
      /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i
      // iPod/iPhone
    ],
    [g, [m, Pt], [p, D]],
    [
      /\((ipad);[-\w\),; ]+apple/i,
      // iPad
      /applecoremedia\/[\w\.]+ \((ipad)/i,
      /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
    ],
    [g, [m, Pt], [p, G]],
    [
      /(macintosh);/i
    ],
    [g, [m, Pt]],
    [
      // Sharp
      /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
    ],
    [g, [m, Ds], [p, D]],
    [
      // Honor
      /\b((?:brt|eln|hey2?|gdi|jdn)-a?[lnw]09|(?:ag[rm]3?|jdn2|kob2)-a?[lw]0[09]hn)(?: bui|\)|;)/i
    ],
    [g, [m, Ls], [p, G]],
    [
      /honor([-\w ]+)[;\)]/i
    ],
    [g, [m, Ls], [p, D]],
    [
      // Huawei
      /\b((?:ag[rs][2356]?k?|bah[234]?|bg[2o]|bt[kv]|cmr|cpn|db[ry]2?|jdn2|got|kob2?k?|mon|pce|scm|sht?|[tw]gr|vrd)-[ad]?[lw][0125][09]b?|605hw|bg2-u03|(?:gem|fdr|m2|ple|t1)-[7a]0[1-4][lu]|t1-a2[13][lw]|mediapad[\w\. ]*(?= bui|\)))\b(?!.+d\/s)/i
    ],
    [g, [m, Ms], [p, G]],
    [
      /(?:huawei)([-\w ]+)[;\)]/i,
      /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
    ],
    [g, [m, Ms], [p, D]],
    [
      // Xiaomi
      /oid[^\)]+; (2[\dbc]{4}(182|283|rp\w{2})[cgl]|m2105k81a?c)(?: bui|\))/i,
      /\b((?:red)?mi[-_ ]?pad[\w- ]*)(?: bui|\))/i
      // Mi Pad tablets
    ],
    [[g, /_/g, " "], [m, Ri], [p, G]],
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
    [[g, /_/g, " "], [m, Ri], [p, D]],
    [
      // OnePlus
      /droid.+; (cph2[3-6]\d[13579]|((gm|hd)19|(ac|be|in|kb)20|(d[en]|eb|le|mt)21|ne22)[0-2]\d|p[g-k]\w[1m]10)\b/i,
      /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
    ],
    [g, [m, Is], [p, D]],
    [
      // OPPO
      /; (\w+) bui.+ oppo/i,
      /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
    ],
    [g, [m, Ci], [p, D]],
    [
      /\b(opd2(\d{3}a?))(?: bui|\))/i
    ],
    [g, [m, He, { OnePlus: ["203", "304", "403", "404", "413", "415"], "*": Ci }], [p, G]],
    [
      // BLU
      /(vivo (5r?|6|8l?|go|one|s|x[il]?[2-4]?)[\w\+ ]*)(?: bui|\))/i
      // Vivo series
    ],
    [g, [m, "BLU"], [p, D]],
    [
      // Vivo
      /; vivo (\w+)(?: bui|\))/i,
      /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
    ],
    [g, [m, "Vivo"], [p, D]],
    [
      // Realme
      /\b(rmx[1-3]\d{3})(?: bui|;|\))/i
    ],
    [g, [m, "Realme"], [p, D]],
    [
      // Lenovo
      /(ideatab[-\w ]+|602lv|d-42a|a101lv|a2109a|a3500-hv|s[56]000|pb-6505[my]|tb-?x?\d{3,4}(?:f[cu]|xu|[av])|yt\d?-[jx]?\d+[lfmx])( bui|;|\)|\/)/i,
      /lenovo ?(b[68]0[08]0-?[hf]?|tab(?:[\w- ]+?)|tb[\w-]{6,7})( bui|;|\)|\/)/i
    ],
    [g, [m, Ei], [p, G]],
    [
      /lenovo[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i
    ],
    [g, [m, Ei], [p, D]],
    [
      // Motorola
      /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
      /\bmot(?:orola)?[- ]([\w\s]+)(\)| bui)/i,
      /((?:moto(?! 360)[-\w\(\) ]+|xt\d{3,4}[cgkosw\+]?[-\d]*|nexus 6)(?= bui|\)))/i
    ],
    [g, [m, Ti], [p, D]],
    [
      /\b(mz60\d|xoom[2 ]{0,2}) build\//i
    ],
    [g, [m, Ti], [p, G]],
    [
      // LG
      /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
    ],
    [g, [m, qn], [p, G]],
    [
      /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
      /\blg[-e;\/ ]+(?!.*(?:browser|netcast|android tv|watch|webos))(\w+)/i,
      /\blg-?([\d\w]+) bui/i
    ],
    [g, [m, qn], [p, D]],
    [
      // Nokia
      /(nokia) (t[12][01])/i
    ],
    [m, g, [p, G]],
    [
      /(?:maemo|nokia).*(n900|lumia \d+|rm-\d+)/i,
      /nokia[-_ ]?(([-\w\. ]*))/i
    ],
    [[g, /_/g, " "], [p, D], [m, "Nokia"]],
    [
      // Google
      /(pixel (c|tablet))\b/i
      // Google Pixel C/Tablet
    ],
    [g, [m, yt], [p, G]],
    [
      // Google Pixel
      /droid.+;(?: google)? (g(01[13]a|020[aem]|025[jn]|1b60|1f8f|2ybb|4s1m|576d|5nz6|8hhn|8vou|a02099|c15s|d1yq|e2ae|ec77|gh2x|kv4x|p4bc|pj41|r83y|tt9q|ur25|wvk6)|pixel[\d ]*a?( pro)?( xl)?( fold)?( \(5g\))?)( bui|\))/i
    ],
    [g, [m, yt], [p, D]],
    [
      /(google) (pixelbook( go)?)/i
    ],
    [m, g],
    [
      // Sony
      /droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-\w\w\d\d)(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
    ],
    [g, [m, fn], [p, D]],
    [
      /sony tablet [ps]/i,
      /\b(?:sony)?sgp\w+(?: bui|\))/i
    ],
    [[g, "Xperia Tablet"], [m, fn], [p, G]],
    [
      // Amazon
      /(alexa)webm/i,
      /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,
      // Kindle Fire without Silk / Echo Show
      /(kf[a-z]+)( bui|\)).+silk\//i
      // Kindle Fire HD
    ],
    [g, [m, Wn], [p, G]],
    [
      /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
      // Fire Phone
    ],
    [[g, /(.+)/g, "Fire Phone $1"], [m, Wn], [p, D]],
    [
      // BlackBerry
      /(playbook);[-\w\),; ]+(rim)/i
      // BlackBerry PlayBook
    ],
    [g, m, [p, G]],
    [
      /\b((?:bb[a-f]|st[hv])100-\d)/i,
      /\(bb10; (\w+)/i
      // BlackBerry 10
    ],
    [g, [m, Os], [p, D]],
    [
      // Asus
      /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
    ],
    [g, [m, Rs], [p, G]],
    [
      / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
    ],
    [g, [m, Rs], [p, D]],
    [
      // HTC
      /(nexus 9)/i
      // HTC Nexus 9
    ],
    [g, [m, "HTC"], [p, G]],
    [
      /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
      // HTC
      // ZTE
      /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
      /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i
      // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
    ],
    [m, [g, /_/g, " "], [p, D]],
    [
      // TCL
      /tcl (xess p17aa)/i,
      /droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])(_\w(\w|\w\w))?(\)| bui)/i
    ],
    [g, [m, "TCL"], [p, G]],
    [
      /droid [\w\.]+; (418(?:7d|8v)|5087z|5102l|61(?:02[dh]|25[adfh]|27[ai]|56[dh]|59k|65[ah])|a509dl|t(?:43(?:0w|1[adepqu])|50(?:6d|7[adju])|6(?:09dl|10k|12b|71[efho]|76[hjk])|7(?:66[ahju]|67[hw]|7[045][bh]|71[hk]|73o|76[ho]|79w|81[hks]?|82h|90[bhsy]|99b)|810[hs]))(_\w(\w|\w\w))?(\)| bui)/i
    ],
    [g, [m, "TCL"], [p, D]],
    [
      // itel
      /(itel) ((\w+))/i
    ],
    [[m, Qe], g, [p, He, { tablet: ["p10001l", "w7001"], "*": "mobile" }]],
    [
      // Acer
      /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
    ],
    [g, [m, "Acer"], [p, G]],
    [
      // Meizu
      /droid.+; (m[1-5] note) bui/i,
      /\bmz-([-\w]{2,})/i
    ],
    [g, [m, "Meizu"], [p, D]],
    [
      // Ulefone
      /; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i
    ],
    [g, [m, "Ulefone"], [p, D]],
    [
      // Energizer
      /; (energy ?\w+)(?: bui|\))/i,
      /; energizer ([\w ]+)(?: bui|\))/i
    ],
    [g, [m, "Energizer"], [p, D]],
    [
      // Cat
      /; cat (b35);/i,
      /; (b15q?|s22 flip|s48c|s62 pro)(?: bui|\))/i
    ],
    [g, [m, "Cat"], [p, D]],
    [
      // Smartfren
      /((?:new )?andromax[\w- ]+)(?: bui|\))/i
    ],
    [g, [m, "Smartfren"], [p, D]],
    [
      // Nothing
      /droid.+; (a(in)?(0(15|59|6[35])|142)p?)/i
    ],
    [g, [m, "Nothing"], [p, D]],
    [
      // Archos
      /; (x67 5g|tikeasy \w+|ac[1789]\d\w+)( b|\))/i,
      /archos ?(5|gamepad2?|([\w ]*[t1789]|hello) ?\d+[\w ]*)( b|\))/i
    ],
    [g, [m, "Archos"], [p, G]],
    [
      /archos ([\w ]+)( b|\))/i,
      /; (ac[3-6]\d\w{2,8})( b|\))/i
    ],
    [g, [m, "Archos"], [p, D]],
    [
      // HMD
      /; (n159v)/i
    ],
    [g, [m, "HMD"], [p, D]],
    [
      // MIXED
      /(imo) (tab \w+)/i,
      // IMO
      /(infinix|tecno) (x1101b?|p904|dp(7c|8d|10a)( pro)?|p70[1-3]a?|p904|t1101)/i
      // Infinix XPad / Tecno
    ],
    [m, g, [p, G]],
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
    [m, g, [p, D]],
    [
      /(kobo)\s(ereader|touch)/i,
      // Kobo
      /(hp).+(touchpad(?!.+tablet)|tablet)/i,
      // HP TouchPad
      /(kindle)\/([\w\.]+)/i
      // Kindle
    ],
    [m, g, [p, G]],
    [
      /(surface duo)/i
      // Surface Duo
    ],
    [g, [m, Si], [p, G]],
    [
      /droid [\d\.]+; (fp\du?)(?: b|\))/i
      // Fairphone
    ],
    [g, [m, "Fairphone"], [p, D]],
    [
      /((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i
      // Nvidia Tablets
    ],
    [g, [m, Ai], [p, G]],
    [
      /(sprint) (\w+)/i
      // Sprint Phones
    ],
    [m, g, [p, D]],
    [
      /(kin\.[onetw]{3})/i
      // Microsoft Kin
    ],
    [[g, /\./g, " "], [m, Si], [p, D]],
    [
      /droid.+; ([c6]+|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
      // Zebra
    ],
    [g, [m, Oi], [p, G]],
    [
      /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
    ],
    [g, [m, Oi], [p, D]],
    [
      ///////////////////
      // SMARTTVS
      ///////////////////
      /smart-tv.+(samsung)/i
      // Samsung
    ],
    [m, [p, ie]],
    [
      /hbbtv.+maple;(\d+)/i
    ],
    [[g, /^/, "SmartTV"], [m, pn], [p, ie]],
    [
      /(vizio)(?: |.+model\/)(\w+-\w+)/i,
      // Vizio
      /tcast.+(lg)e?. ([-\w]+)/i
      // LG SmartTV
    ],
    [m, g, [p, ie]],
    [
      /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i
    ],
    [[m, qn], [p, ie]],
    [
      /(apple) ?tv/i
      // Apple TV
    ],
    [m, [g, Pt + " TV"], [p, ie]],
    [
      /crkey.*devicetype\/chromecast/i
      // Google Chromecast Third Generation
    ],
    [[g, lt + " Third Generation"], [m, yt], [p, ie]],
    [
      /crkey.*devicetype\/([^/]*)/i
      // Google Chromecast with specific device type
    ],
    [[g, /^/, "Chromecast "], [m, yt], [p, ie]],
    [
      /fuchsia.*crkey/i
      // Google Chromecast Nest Hub
    ],
    [[g, lt + " Nest Hub"], [m, yt], [p, ie]],
    [
      /crkey/i
      // Google Chromecast, Linux-based or unknown
    ],
    [[g, lt], [m, yt], [p, ie]],
    [
      /(portaltv)/i
      // Facebook Portal TV
    ],
    [g, [m, Mi], [p, ie]],
    [
      /droid.+aft(\w+)( bui|\))/i
      // Fire TV
    ],
    [g, [m, Wn], [p, ie]],
    [
      /(shield \w+ tv)/i
      // Nvidia Shield TV
    ],
    [g, [m, Ai], [p, ie]],
    [
      /\(dtv[\);].+(aquos)/i,
      /(aquos-tv[\w ]+)\)/i
      // Sharp
    ],
    [g, [m, Ds], [p, ie]],
    [
      /(bravia[\w ]+)( bui|\))/i
      // Sony
    ],
    [g, [m, fn], [p, ie]],
    [
      /(mi(tv|box)-?\w+) bui/i
      // Xiaomi
    ],
    [g, [m, Ri], [p, ie]],
    [
      /Hbbtv.*(technisat) (.*);/i
      // TechniSAT
    ],
    [m, g, [p, ie]],
    [
      /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
      // Roku
      /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i
      // HbbTV devices
    ],
    [[m, /.+\/(\w+)/, "$1", He, { LG: "lge" }], [g, ii], [p, ie]],
    [
      // SmartTV from Unidentified Vendors
      /droid.+; ([\w- ]+) (?:android tv|smart[- ]?tv)/i
    ],
    [g, [p, ie]],
    [
      /\b(android tv|smart[- ]?tv|opera tv|tv; rv:|large screen[\w ]+safari)\b/i
    ],
    [[p, ie]],
    [
      ///////////////////
      // CONSOLES
      ///////////////////
      /(playstation \w+)/i
      // Playstation
    ],
    [g, [m, fn], [p, xn]],
    [
      /\b(xbox(?: one)?(?!; xbox))[\); ]/i
      // Microsoft Xbox
    ],
    [g, [m, Si], [p, xn]],
    [
      /(ouya)/i,
      // Ouya
      /(nintendo) (\w+)/i,
      // Nintendo
      /(retroid) (pocket ([^\)]+))/i
      // Retroid Pocket
    ],
    [m, g, [p, xn]],
    [
      /droid.+; (shield)( bui|\))/i
      // Nvidia Portable
    ],
    [g, [m, Ai], [p, xn]],
    [
      ///////////////////
      // WEARABLES
      ///////////////////
      /\b(sm-[lr]\d\d[0156][fnuw]?s?|gear live)\b/i
      // Samsung Galaxy Watch
    ],
    [g, [m, pn], [p, $e]],
    [
      /((pebble))app/i,
      // Pebble
      /(asus|google|lg|oppo) ((pixel |zen)?watch[\w ]*)( bui|\))/i
      // Asus ZenWatch / LG Watch / Pixel Watch
    ],
    [m, g, [p, $e]],
    [
      /(ow(?:19|20)?we?[1-3]{1,3})/i
      // Oppo Watch
    ],
    [g, [m, Ci], [p, $e]],
    [
      /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i
      // Apple Watch
    ],
    [g, [m, Pt], [p, $e]],
    [
      /(opwwe\d{3})/i
      // OnePlus Watch
    ],
    [g, [m, Is], [p, $e]],
    [
      /(moto 360)/i
      // Motorola 360
    ],
    [g, [m, Ti], [p, $e]],
    [
      /(smartwatch 3)/i
      // Sony SmartWatch
    ],
    [g, [m, fn], [p, $e]],
    [
      /(g watch r)/i
      // LG G Watch R
    ],
    [g, [m, qn], [p, $e]],
    [
      /droid.+; (wt63?0{2,3})\)/i
    ],
    [g, [m, Oi], [p, $e]],
    [
      ///////////////////
      // XR
      ///////////////////
      /droid.+; (glass) \d/i
      // Google Glass
    ],
    [g, [m, yt], [p, Gn]],
    [
      /(pico) (4|neo3(?: link|pro)?)/i
      // Pico
    ],
    [m, g, [p, Gn]],
    [
      /(quest( \d| pro)?s?).+vr/i
      // Meta Quest
    ],
    [g, [m, Mi], [p, Gn]],
    [
      /mobile vr; rv.+firefox/i
      // Unidentifiable VR device using Firefox Reality / Wolvic
    ],
    [[p, Gn]],
    [
      ///////////////////
      // EMBEDDED
      ///////////////////
      /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i
      // Tesla
    ],
    [m, [p, yn]],
    [
      /(aeobc)\b/i
      // Echo Dot
    ],
    [g, [m, Wn], [p, yn]],
    [
      /(homepod).+mac os/i
      // Apple HomePod
    ],
    [g, [m, Pt], [p, yn]],
    [
      /windows iot/i
      // Unidentifiable embedded device using Windows IoT
    ],
    [[p, yn]],
    [
      ////////////////////
      // MIXED (GENERIC)
      ///////////////////
      /droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+?(mobile|vr|\d) safari/i
    ],
    [g, [p, He, { mobile: "Mobile", xr: "VR", "*": G }]],
    [
      /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i
      // Unidentifiable Tablet
    ],
    [[p, G]],
    [
      /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i
      // Unidentifiable Mobile
    ],
    [[p, D]],
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
    [x, [b, Kn + "HTML"]],
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
    [[b, /N/, "R"], [x, He, Us]],
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
    [[x, /(;|\))/g, "", He, Us], [b, ji]],
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
    [x, [b, Os]],
    [
      /(?:symbian ?os|symbos|s60(?=;)|series ?60)[-\/ ]?([\w\.]*)/i
      // Symbian
    ],
    [x, [b, "Symbian"]],
    [
      /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
      // Firefox OS
    ],
    [x, [b, gn + " OS"]],
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
    [[x, He, { 25: "120", 24: "108", 23: "94", 22: "87", 6: "79", 5: "68", 4: "53", 3: "38", 2: "538", 1: "537", "*": "TV" }], [b, "webOS"]],
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
}, Xn = (function() {
  var n = { init: {}, isIgnore: {}, isIgnoreRgx: {}, toString: {} };
  return Je.call(n.init, [
    [we, [b, x, _n, p]],
    [Ye, [be]],
    [Ve, [p, g, m]],
    [De, [b, x]],
    [Ce, [b, x]]
  ]), Je.call(n.isIgnore, [
    [we, [x, _n]],
    [De, [x]],
    [Ce, [x]]
  ]), Je.call(n.isIgnoreRgx, [
    [we, / ?browser$/i],
    [Ce, / ?os$/i]
  ]), Je.call(n.toString, [
    [we, [b, x]],
    [Ye, [be]],
    [Ve, [m, g]],
    [De, [b, x]],
    [Ce, [b, x]]
  ]), n;
})(), ba = function(n, e) {
  var t = Xn.init[e], i = Xn.isIgnore[e] || 0, s = Xn.isIgnoreRgx[e] || 0, r = Xn.toString[e] || 0;
  function l() {
    Je.call(this, t);
  }
  return l.prototype.getItem = function() {
    return n;
  }, l.prototype.withClientHints = function() {
    return ct ? ct.getHighEntropyValues(ar).then(function(a) {
      return n.setCH(new lr(a, !1)).parseCH().get();
    }) : n.parseCH().get();
  }, l.prototype.withFeatureCheck = function() {
    return n.detectFeature().get();
  }, e != Bt && (l.prototype.is = function(a) {
    var h = !1;
    for (var u in this)
      if (this.hasOwnProperty(u) && !Gi(i, u) && Qe(s ? Ht(s, this[u]) : this[u]) == Qe(s ? Ht(s, a) : a)) {
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
    var f = new u();
    return a(f), f;
  }), new l();
};
function lr(n, e) {
  if (n = n || {}, Je.call(this, ar), e)
    Je.call(this, [
      [ts, Li(n[ht])],
      [ns, Li(n[la])],
      [D, /\?1/.test(n[da])],
      [g, bn(n[pa])],
      [Ut, bn(n[or])],
      [is, bn(n[fa])],
      [be, bn(n[ca])],
      [kt, Li(n[ha])],
      [ai, bn(n[ua])]
    ]);
  else
    for (var t in n)
      this.hasOwnProperty(t) && typeof n[t] !== ut && (this[t] = n[t]);
}
function Hs(n, e, t, i) {
  return this.get = function(s) {
    return s ? this.data.hasOwnProperty(s) ? this.data[s] : void 0 : this.data;
  }, this.set = function(s, r) {
    return this.data[s] = r, this;
  }, this.setCH = function(s) {
    return this.uaCH = s, this;
  }, this.detectFeature = function() {
    if (xe && xe.userAgent == this.ua)
      switch (this.itemType) {
        case we:
          xe.brave && typeof xe.brave.isBrave == ti && this.set(b, "Brave");
          break;
        case Ve:
          !this.get(p) && ct && ct[D] && this.set(p, D), this.get(g) == "Macintosh" && xe && typeof xe.standalone !== ut && xe.maxTouchPoints && xe.maxTouchPoints > 2 && this.set(g, "iPad").set(p, G);
          break;
        case Ce:
          !this.get(b) && ct && ct[Ut] && this.set(b, ct[Ut]);
          break;
        case Bt:
          var s = this.data, r = function(l) {
            return s[l].getItem().detectFeature().get();
          };
          this.set(we, r(we)).set(Ye, r(Ye)).set(Ve, r(Ve)).set(De, r(De)).set(Ce, r(Ce));
      }
    return this;
  }, this.parseUA = function() {
    return this.itemType != Bt && Di.call(this.data, this.ua, this.rgxMap), this.itemType == we && this.set(_n, Ii(this.get(x))), this;
  }, this.parseCH = function() {
    var s = this.uaCH, r = this.rgxMap;
    switch (this.itemType) {
      case we:
      case De:
        var l = s[ns] || s[ts], a;
        if (l)
          for (var h in l) {
            var u = l[h].brand || l[h], f = l[h].version;
            this.itemType == we && !/not.a.brand/i.test(u) && (!a || /Chrom/.test(a) && u != Ns || a == Kn && /WebView2/.test(u)) && (u = He(u, wa), a = this.get(b), a && !/Chrom/.test(a) && /Chrom/.test(u) || this.set(b, u).set(x, f).set(_n, Ii(f)), a = u), this.itemType == De && u == Ns && this.set(x, f);
          }
        break;
      case Ye:
        var O = s[be];
        O && (O && s[ai] == "64" && (O += "64"), Di.call(this.data, O + ";", r));
        break;
      case Ve:
        if (s[D] && this.set(p, D), s[g] && (this.set(g, s[g]), !this.get(p) || !this.get(m))) {
          var _ = {};
          Di.call(_, "droid 9; " + s[g] + ")", r), !this.get(p) && _.type && this.set(p, _.type), !this.get(m) && _.vendor && this.set(m, _.vendor);
        }
        if (s[kt]) {
          var $;
          if (typeof s[kt] != "string")
            for (var P = 0; !$ && P < s[kt].length; )
              $ = He(s[kt][P++], zs);
          else
            $ = He(s[kt], zs);
          this.set(p, $);
        }
        break;
      case Ce:
        var M = s[Ut];
        if (M) {
          var ve = s[is];
          M == ji && (ve = parseInt(Ii(ve), 10) >= 13 ? "11" : "10"), this.set(b, M).set(x, ve);
        }
        this.get(b) == ji && s[g] == "Xbox" && this.set(b, "Xbox").set(x, void 0);
        break;
      case Bt:
        var _e = this.data, le = function(me) {
          return _e[me].getItem().setCH(s).parseCH().get();
        };
        this.set(we, le(we)).set(Ye, le(Ye)).set(Ve, le(Ve)).set(De, le(De)).set(Ce, le(Ce));
    }
    return this;
  }, Je.call(this, [
    ["itemType", n],
    ["ua", e],
    ["uaCH", i],
    ["rgxMap", t],
    ["data", ba(this, n)]
  ]), this;
}
function et(n, e, t) {
  if (typeof n === $t ? (ni(n, !0) ? (typeof e === $t && (t = e), e = n) : (t = n, e = void 0), n = void 0) : typeof n === Fi && !ni(e, !0) && (t = e, e = void 0), t && typeof t.append === ti) {
    var i = {};
    t.forEach(function(h, u) {
      i[u] = h;
    }), t = i;
  }
  if (!(this instanceof et))
    return new et(n, e, t).getResult();
  var s = typeof n === Fi ? n : (
    // Passed user-agent string
    t && t[As] ? t[As] : (
      // User-Agent from passed headers
      xe && xe.userAgent ? xe.userAgent : (
        // navigator.userAgent
        zt
      )
    )
  ), r = new lr(t, !0), l = e ? ma($s, e) : $s, a = function(h) {
    return h == Bt ? function() {
      return new Hs(h, s, l, r).set("ua", s).set(we, this.getBrowser()).set(Ye, this.getCPU()).set(Ve, this.getDevice()).set(De, this.getEngine()).set(Ce, this.getOS()).get();
    } : function() {
      return new Hs(h, s, l[h], r).parseUA().get();
    };
  };
  return Je.call(this, [
    ["getBrowser", a(we)],
    ["getCPU", a(Ye)],
    ["getDevice", a(Ve)],
    ["getEngine", a(De)],
    ["getOS", a(Ce)],
    ["getResult", a(Bt)],
    ["getUA", function() {
      return s;
    }],
    ["setUA", function(h) {
      return Ft(h) && (s = h.length > Vi ? ii(h, Vi) : h), this;
    }]
  ]).setUA(s), this;
}
et.VERSION = aa;
et.BROWSER = li([b, x, _n, p]);
et.CPU = li([be]);
et.DEVICE = li([g, m, p, xn, D, ie, G, $e, yn]);
et.ENGINE = et.OS = li([b, x]);
class xa {
  static isValidDevice() {
    return !new et().getDevice().type;
  }
}
function vt() {
  return crypto.randomUUID();
}
function _t() {
  return St(performance.now());
}
async function va(n, e, t = null, i = []) {
  t || (t = (M) => {
  });
  let s = i;
  const r = n.nodekit_version;
  let l = new sa();
  if (!xa.isValidDevice()) {
    const M = new Error("Unsupported device. Please use a desktop browser.");
    throw l.showErrorMessageOverlay(M), M;
  }
  l.showConnectingOverlay();
  for (const M of e)
    l.boardViewsUI.assetManager.registerAsset(M);
  l.hideConnectingOverlay(), await l.playStartScreen();
  const a = {
    event_id: vt(),
    timestamp_event: _t(),
    event_type: "StartEvent",
    event_payload: {},
    nodekit_version: r
  };
  s.push(a), t(a);
  function h() {
    if (document.visibilityState === "hidden") {
      const M = {
        event_id: vt(),
        timestamp_event: _t(),
        event_type: "LeaveEvent",
        event_payload: {},
        nodekit_version: r
      };
      s.push(M), t(M);
    } else if (document.visibilityState === "visible") {
      const M = {
        event_id: vt(),
        timestamp_event: _t(),
        event_type: "ReturnEvent",
        event_payload: {},
        nodekit_version: r
      };
      s.push(M), t(M);
    }
  }
  document.addEventListener("visibilitychange", h);
  const u = oa(), f = {
    event_id: vt(),
    timestamp_event: _t(),
    event_type: "BrowserContextEvent",
    event_payload: u,
    nodekit_version: r
  };
  s.push(f), t(f);
  const O = n.nodes;
  for (let M = 0; M < O.length; M++) {
    const ve = O[M], _e = await l.prepare(ve);
    let le = await l.play(_e);
    const me = {
      event_id: vt(),
      timestamp_event: _t(),
      event_type: "NodeResultEvent",
      event_payload: {
        node_id: ve.node_id,
        timestamp_node_start: le.timestamp_start,
        timestamp_node_end: le.timestamp_end,
        action: le.action
      },
      nodekit_version: r
    };
    s.push(me), t(me), l.setProgressBar((M + 1) / O.length * 100);
  }
  const _ = ra(
    s,
    n
  );
  let $ = "";
  if (_ > 0 && ($ = `Bonus: ${_} USD (pending validation)`), await l.playEndScreen($), $ !== "") {
    const M = {
      event_id: vt(),
      timestamp_event: _t(),
      event_type: "BonusDisclosureEvent",
      event_payload: {
        bonus_amount_usd: _.toFixed(2)
      },
      nodekit_version: r
    };
    s.push(M), t(M);
  }
  const P = {
    event_id: vt(),
    timestamp_event: _t(),
    event_type: "EndEvent",
    event_payload: {},
    nodekit_version: r
  };
  return s.push(P), t(P), document.removeEventListener("visibilitychange", h), l.showConsoleMessageOverlay(
    "Events",
    s
  ), s;
}
export {
  va as play
};
