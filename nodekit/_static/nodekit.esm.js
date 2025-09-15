var gr = Object.defineProperty;
var mr = (n, e, t) => e in n ? gr(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var X = (n, e, t) => mr(n, typeof e != "symbol" ? e + "" : e, t);
class _e {
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
      i instanceof _e ? e.push(i) : Array.isArray(i) && i.every((s) => s instanceof _e) && e.push(...i);
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
class wr extends _e {
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
class br extends _e {
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
class si extends _e {
  constructor(e) {
    super(), this.root = document.createElement("div"), this.root.classList.add("overlay"), this.root.id = e;
  }
  setVisibility(e) {
    e ? this.root.classList.add("overlay--visible-state") : this.root.classList.remove("overlay--visible-state");
  }
}
class xr extends _e {
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
class _r extends si {
  constructor() {
    super("session-connecting-overlay"), this.displayTimeout = null;
    const e = document.createElement("div");
    e.classList.add("connecting-message-box"), this.root.appendChild(e), this.spinner = new xr(), this.spinner.mount(e);
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
function vr(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var bi, cs;
function yr() {
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
  const s = "</span>", r = (o) => !!o.scope, a = (o, { prefix: d }) => {
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
  class c {
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
      const v = a(
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
      return new c(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function O(o) {
    return o ? typeof o == "string" ? o : o.source : null;
  }
  function y(o) {
    return M("(?=", o, ")");
  }
  function H(o) {
    return M("(?:", o, ")*");
  }
  function D(o) {
    return M("(?:", o, ")?");
  }
  function M(...o) {
    return o.map((v) => O(v)).join("");
  }
  function ve(o) {
    const d = o[o.length - 1];
    return typeof d == "object" && d.constructor === Object ? (o.splice(o.length - 1, 1), d) : {};
  }
  function ye(...o) {
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
  const Ve = /\b\B/, De = "[a-zA-Z]\\w*", jt = "[a-zA-Z_]\\w*", En = "\\b\\d+(\\.\\d+)?", Sn = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", ae = "\\b(0b[01]+)", Gt = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", Wt = (o = {}) => {
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
    const Q = ye(
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
    begin: De,
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
    IDENT_RE: De,
    MATCH_NOTHING_RE: Ve,
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
    Array.isArray(o.illegal) && (o.illegal = ye(...o.illegal));
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
    }), o.keywords = v.keywords, o.begin = M(v.beforeMatch, y(v.begin)), o.starts = {
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
  function Pn(o) {
    o.scope && typeof o.scope == "object" && o.scope !== null && (o.beginScope = o.scope, delete o.scope);
  }
  function Mt(o) {
    Pn(o), typeof o.beginScope == "string" && (o.beginScope = { _wrap: o.beginScope }), typeof o.endScope == "string" && (o.endScope = { _wrap: o.endScope }), In(o), Qt(o);
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
        const F = L.findIndex((ot, It) => It > 0 && ot !== void 0), W = this.matchIndexes[F];
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
        const L = new v();
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
      let F = null;
      return typeof T.keywords == "object" && T.keywords.$pattern && (T.keywords = Object.assign({}, T.keywords), F = T.keywords.$pattern, delete T.keywords.$pattern), F = F || /\w+/, T.keywords && (T.keywords = Zt(T.keywords, o.case_insensitive)), L.keywordPatternRe = d(F, !0), S && (T.begin || (T.begin = /\B|\b/), L.beginRe = d(L.begin), !T.end && !T.endsWithParent && (T.end = /\B|\b/), T.end && (L.endRe = d(L.end)), L.terminatorEnd = O(L.end) || "", T.endsWithParent && S.terminatorEnd && (L.terminatorEnd += (T.end ? "|" : "") + S.terminatorEnd)), T.illegal && (L.illegalRe = d(
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
    function F(w) {
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
          const V = Ue.case_insensitive ? R[0].toLowerCase() : R[0], he = Le(N, V);
          if (he) {
            const [qe, pr] = he;
            if (ce.addText(B), B = "", oe[V] = (oe[V] || 0) + 1, oe[V] <= fi && ($n += pr), qe.startsWith("_"))
              B += R[0];
            else {
              const fr = Ue.classNameAliases[qe] || qe;
              Be(R[0], fr);
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
        N.relevance > 0 && ($n += k.relevance), ce.__addSublanguage(k._emitter, k.language);
      }
      function Te() {
        N.subLanguage != null ? zn() : at(), Z = "";
      }
      function Be(k, R) {
        k !== "" && (ce.startScope(R), ce.addText(k), ce.endScope());
      }
      function ss(k, R) {
        let B = 1;
        const V = R.length - 1;
        for (; B <= V; ) {
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
        let V = me(k.endRe, B);
        if (V) {
          if (k["on:end"]) {
            const he = new e(k);
            k["on:end"](R, he), he.isMatchIgnored && (V = !1);
          }
          if (V) {
            for (; k.endsParent && k.parent; )
              k = k.parent;
            return k;
          }
        }
        if (k.endsWithParent)
          return os(k.parent, R, B);
      }
      function lr(k) {
        return N.matcher.regexIndex === 0 ? (Z += k[0], 1) : (wi = !0, 0);
      }
      function cr(k) {
        const R = k[0], B = k.rule, V = new e(B), he = [B.__beforeBegin, B["on:begin"]];
        for (const qe of he)
          if (qe && (qe(k, V), V.isMatchIgnored))
            return lr(R);
        return B.skip ? Z += R : (B.excludeBegin && (Z += R), Te(), !B.returnBegin && !B.excludeBegin && (Z = R)), rs(B, k), B.returnBegin ? 0 : R.length;
      }
      function ur(k) {
        const R = k[0], B = C.substring(k.index), V = os(N, k, B);
        if (!V)
          return wt;
        const he = N;
        N.endScope && N.endScope._wrap ? (Te(), Be(R, N.endScope._wrap)) : N.endScope && N.endScope._multi ? (Te(), ss(N.endScope, k)) : he.skip ? Z += R : (he.returnEnd || he.excludeEnd || (Z += R), Te(), he.excludeEnd && (Z = R));
        do
          N.scope && ce.closeNode(), !N.skip && !N.subLanguage && ($n += N.relevance), N = N.parent;
        while (N !== V.parent);
        return V.starts && rs(V.starts, k), he.returnEnd ? 0 : R.length;
      }
      function hr() {
        const k = [];
        for (let R = N; R !== Ue; R = R.parent)
          R.scope && k.unshift(R.scope);
        k.forEach((R) => ce.openNode(R));
      }
      let Hn = {};
      function as(k, R) {
        const B = R && R[0];
        if (Z += k, B == null)
          return Te(), 0;
        if (Hn.type === "begin" && R.type === "end" && Hn.index === R.index && B === "") {
          if (Z += C.slice(R.index, R.index + 1), !Q) {
            const V = new Error(`0 width match regex (${w})`);
            throw V.languageName = w, V.badRule = Hn.rule, V;
          }
          return 1;
        }
        if (Hn = R, R.type === "begin")
          return cr(R);
        if (R.type === "illegal" && !U) {
          const V = new Error('Illegal lexeme "' + B + '" for mode "' + (N.scope || "<unnamed>") + '"');
          throw V.mode = N, V;
        } else if (R.type === "end") {
          const V = ur(R);
          if (V !== wt)
            return V;
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
      const dr = Lt(Ue);
      let gi = "", N = Y || dr;
      const ls = {}, ce = new S.__emitter(S);
      hr();
      let Z = "", $n = 0, xt = 0, mi = 0, wi = !1;
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
          relevance: $n,
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
    function Dn(w, C, U) {
      const Y = C && v[C] || U;
      w.classList.add("hljs"), w.classList.add(`language-${Y}`);
    }
    function Se(w) {
      let C = null;
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
        throw new en(
          "One of your code blocks includes unescaped HTML.",
          w.innerHTML
        );
      C = w;
      const Y = C.textContent, oe = U ? W(Y, { language: U, ignoreIllegals: !0 }) : bt(Y);
      w.innerHTML = oe.value, w.dataset.highlighted = "yes", Dn(w, U, oe.language), w.result = {
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
      Pt(), Ee("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Un() {
      Pt(), Ee("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let nn = !1;
    function Pt() {
      function w() {
        Pt();
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
    function l(w) {
      delete d[w];
      for (const C of Object.keys(v))
        v[C] === w && delete v[C];
    }
    function _() {
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
      highlightAll: Pt,
      highlightElement: Se,
      // TODO: Remove with v12 API
      highlightBlock: sn,
      configure: Nn,
      initHighlighting: Bn,
      initHighlightingOnLoad: Un,
      registerLanguage: A,
      unregisterLanguage: l,
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
    }, o.versionString = Jt, o.regex = {
      concat: M,
      lookahead: y,
      either: ye,
      optional: D,
      anyNumberOfTimes: H
    };
    for (const w in ft)
      typeof ft[w] == "object" && n(ft[w]);
    return Object.assign(o, ft), o;
  }, rt = st({});
  return rt.newInstance = () => st({}), bi = rt, rt.HighlightJS = rt, rt.default = rt, bi;
}
var kr = /* @__PURE__ */ yr();
const $s = /* @__PURE__ */ vr(kr);
function Er(n) {
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
$s.registerLanguage("json", Er);
class Sr extends _e {
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
class Tr extends si {
  constructor() {
    super("console-message-overlay");
    const e = document.createElement("div");
    e.classList.add("console-title-box"), this.root.appendChild(e), this.titleTextDiv = document.createElement("div"), this.titleTextDiv.classList.add("console-title-box__text"), e.appendChild(this.titleTextDiv), this.jsonViewer = new Sr(), this.jsonViewer.mount(this.root);
    const t = new Ar();
    t.setCopyTarget(this.jsonViewer.root), t.mount(e);
  }
  displayMessage(e, t) {
    this.titleTextDiv.innerHTML = e, this.jsonViewer.displayAsJson(t), super.setVisibility(!0);
  }
  hide() {
    this.titleTextDiv.innerHTML = "", this.jsonViewer.clear(), super.setVisibility(!1);
  }
}
class Ar extends _e {
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
class Cr extends si {
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
class Rr extends _e {
  constructor() {
    super();
    const e = document.createElement("button");
    e.classList.add("submit-button"), e.textContent = "Press to Submit", this.root = e;
  }
  attachClickListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class Or extends si {
  constructor() {
    super("session-started-overlay"), this.startButton = new Mr(), this.startButton.mount(this.root);
  }
  show(e) {
    this.startButton.attachClickListener(e), this.setVisibility(!0);
  }
  hide() {
    super.setVisibility(!1), this.startButton.removeAllEventListeners();
  }
}
class Mr extends _e {
  constructor() {
    super();
    const e = document.createElement("button");
    e.classList.add("start-button"), e.textContent = "Press to Start", this.root = e;
  }
  attachClickListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class Lr extends _e {
  constructor() {
    super(), this.root = document.createElement("div"), this.root.className = "shell-ui", this.progressBar = new br("cognition"), this.progressBar.mount(this.root), this.statusDot = new wr(), this.statusDot.mount(this.root), this.sessionConnectingOverlay = new _r(), this.sessionConnectingOverlay.mount(this.root), this.overlayConsoleMessage = new Tr(), this.overlayConsoleMessage.mount(this.root), this.sessionFinishedOverlay = new Cr(), this.sessionFinishedOverlay.mount(this.root), this.sessionStartedOverlay = new Or(), this.sessionStartedOverlay.mount(this.root);
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
    let i = new Promise((r, a) => {
      this.sessionFinishedOverlay.show(
        e,
        () => {
          this.sessionFinishedOverlay.hide(), r();
        }
      );
    });
    await i;
    let s = new Promise((r, a) => {
      setTimeout(() => {
        this.sessionFinishedOverlay.hide(), r();
      }, t);
    });
    await Promise.race([i, s]);
  }
}
class Ft {
  constructor(e, t) {
    this.root = document.createElement("div"), this.root.classList.add("card"), this.root.id = e.card_id, this.card = e, this.boardView = t, this.setVisibility(!1), this.setInteractivity(!1), this.place(t);
  }
  place(e) {
    const t = e.getCoordinateSystem(), { leftPx: i, topPx: s } = t.getBoardLocationPx(
      this.card.x,
      this.card.y,
      this.card.w,
      this.card.h
    ), { widthPx: r, heightPx: a } = t.getBoardRectanglePx(
      this.card.w,
      this.card.h
    );
    this.root.style.left = `${i}px`, this.root.style.top = `${s}px`, this.root.style.width = `${r}px`, this.root.style.height = `${a}px`, e.root.appendChild(this.root);
  }
  setVisibility(e) {
    e ? this.root.classList.remove("card--hidden") : this.root.classList.add("card--hidden");
  }
  setInteractivity(e) {
    e ? this.root.classList.remove("card--noninteractive") : this.root.classList.add("card--noninteractive");
  }
  async load() {
  }
  // Override this to unload assets.
  unload() {
  }
  // Do something when the card starts.
  async start() {
  }
}
function Et(n) {
  const e = performance.timeOrigin + n;
  return new Date(e).toISOString();
}
class Ir {
  constructor(e, t, i, s) {
    this.tArmed = null, this.cardView = i, i.addClickCallback(
      (r) => {
        if (!this.tArmed)
          return;
        const a = s.root.getBoundingClientRect(), c = (r.clientX - a.left) / a.width - 0.5, h = (r.clientY - a.top) / a.height - 0.5, u = {
          sensor_id: e,
          action_type: "ClickAction",
          click_x: c,
          click_y: h,
          timestamp_action: Et(performance.now())
        };
        t(u);
      }
    );
  }
  arm() {
    this.cardView.root.classList.add("card--clickable"), this.tArmed = performance.now(), this.cardView.setInteractivity(!0);
  }
  disarm() {
    this.cardView.root.classList.remove("card--clickable"), this.tArmed = null, this.cardView.setInteractivity(!1);
  }
}
class Pr {
  constructor(e, t, i) {
    this.tArmed = null, this.cardView = i, i.addDoneCallback(
      () => {
        if (!this.tArmed)
          return;
        const s = {
          sensor_id: e,
          action_type: "DoneAction",
          timestamp_action: Et(performance.now())
        };
        t(s);
      }
    );
  }
  arm() {
    this.tArmed = performance.now(), this.cardView.setInteractivity(!0);
  }
  disarm() {
    this.tArmed = null, this.cardView.setInteractivity(!1);
  }
}
class Dr {
  constructor(e, t, i) {
    this.timeoutId = null, this.sensorId = e, this.onSensorFired = t, this.timeoutMsec = i;
  }
  arm() {
    this.timeoutId = window.setTimeout(
      () => {
        const e = {
          sensor_id: this.sensorId,
          action_type: "TimeoutAction",
          timestamp_action: Et(performance.now())
        };
        this.onSensorFired(e);
      },
      this.timeoutMsec
    );
  }
  disarm() {
    this.timeoutId !== null && (clearTimeout(this.timeoutId), this.timeoutId = null);
  }
}
class Nr {
  constructor(e, t, i) {
    this.tArmed = null, this.onKeyPress = (s) => {
      if (!this.tArmed)
        return;
      s.preventDefault();
      let r = s.key;
      if (!this.keys.includes(r))
        return;
      const a = {
        sensor_id: this.sensorId,
        action_type: "KeyAction",
        key: r,
        timestamp_action: Et(performance.now())
      };
      this.disarm(), this.onSensorFired(a);
    }, this.sensorId = e, this.onSensorFired = t, this.keys = [i], document.addEventListener("keydown", this.onKeyPress);
  }
  arm() {
    this.tArmed = performance.now();
  }
  disarm() {
    this.tArmed = null, document.removeEventListener("keydown", this.onKeyPress);
  }
}
function Br(n) {
  if (!("addClickCallback" in n))
    throw new Error("CardView is not clickable");
}
function Ur(n) {
  if (!("addDoneCallback" in n))
    throw new Error("CardView is not doneable");
}
class zr extends Ft {
  constructor(e, t) {
    super(e, t), this.button = document.createElement("button"), this.button.classList.add("fixation-point");
    const i = document.createElement("div");
    i.className = "fixation-point-cross--horizontal", this.button.appendChild(i);
    const s = document.createElement("div");
    s.className = "fixation-point-cross--vertical", this.button.appendChild(s), this.root.appendChild(this.button);
  }
  addClickCallback(e) {
    this.button.addEventListener("click", (t) => {
      e(t);
    });
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
function $(n, e = "") {
  let t = typeof n == "string" ? n : n.source;
  const i = {
    replace: (s, r) => {
      let a = typeof r == "string" ? r : r.source;
      return a = a.replace(pe.caret, "$1"), t = t.replace(s, a), i;
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
}, Hr = /^(?:[ \t]*(?:\n|$))+/, $r = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Fr = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, kn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Vr = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, qi = /(?:[*+-]|\d{1,9}[.)])/, Vs = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, js = $(Vs).replace(/bull/g, qi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), jr = $(Vs).replace(/bull/g, qi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Xi = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Gr = /^[^\n]+/, Yi = /(?!\s*\])(?:\\.|[^\[\]\\])+/, Wr = $(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Yi).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), qr = $(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, qi).getRegex(), ri = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Zi = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Xr = $(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", Zi).replace("tag", ri).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Gs = $(Xi).replace("hr", kn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ri).getRegex(), Yr = $(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Gs).getRegex(), Ki = {
  blockquote: Yr,
  code: $r,
  def: Wr,
  fences: Fr,
  heading: Vr,
  hr: kn,
  html: Xr,
  lheading: js,
  list: qr,
  newline: Hr,
  paragraph: Gs,
  table: vn,
  text: Gr
}, us = $(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", kn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ri).getRegex(), Zr = {
  ...Ki,
  lheading: jr,
  table: us,
  paragraph: $(Xi).replace("hr", kn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", us).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ri).getRegex()
}, Kr = {
  ...Ki,
  html: $(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", Zi).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: vn,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: $(Xi).replace("hr", kn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", js).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, Qr = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Jr = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Ws = /^( {2,}|\\)\n(?!\s*$)/, eo = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, oi = /[\p{P}\p{S}]/u, Qi = /[\s\p{P}\p{S}]/u, qs = /[^\s\p{P}\p{S}]/u, to = $(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Qi).getRegex(), Xs = /(?!~)[\p{P}\p{S}]/u, no = /(?!~)[\s\p{P}\p{S}]/u, io = /(?:[^\s\p{P}\p{S}]|~)/u, so = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, Ys = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, ro = $(Ys, "u").replace(/punct/g, oi).getRegex(), oo = $(Ys, "u").replace(/punct/g, Xs).getRegex(), Zs = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", ao = $(Zs, "gu").replace(/notPunctSpace/g, qs).replace(/punctSpace/g, Qi).replace(/punct/g, oi).getRegex(), lo = $(Zs, "gu").replace(/notPunctSpace/g, io).replace(/punctSpace/g, no).replace(/punct/g, Xs).getRegex(), co = $(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, qs).replace(/punctSpace/g, Qi).replace(/punct/g, oi).getRegex(), uo = $(/\\(punct)/, "gu").replace(/punct/g, oi).getRegex(), ho = $(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), po = $(Zi).replace("(?:-->|$)", "-->").getRegex(), fo = $(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", po).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Qn = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, go = $(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", Qn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Ks = $(/^!?\[(label)\]\[(ref)\]/).replace("label", Qn).replace("ref", Yi).getRegex(), Qs = $(/^!?\[(ref)\](?:\[\])?/).replace("ref", Yi).getRegex(), mo = $("reflink|nolink(?!\\()", "g").replace("reflink", Ks).replace("nolink", Qs).getRegex(), Ji = {
  _backpedal: vn,
  // only used for GFM url
  anyPunctuation: uo,
  autolink: ho,
  blockSkip: so,
  br: Ws,
  code: Jr,
  del: vn,
  emStrongLDelim: ro,
  emStrongRDelimAst: ao,
  emStrongRDelimUnd: co,
  escape: Qr,
  link: go,
  nolink: Qs,
  punctuation: to,
  reflink: Ks,
  reflinkSearch: mo,
  tag: fo,
  text: eo,
  url: vn
}, wo = {
  ...Ji,
  link: $(/^!?\[(label)\]\((.*?)\)/).replace("label", Qn).getRegex(),
  reflink: $(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Qn).getRegex()
}, Ni = {
  ...Ji,
  emStrongRDelimAst: lo,
  emStrongLDelim: oo,
  url: $(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, bo = {
  ...Ni,
  br: $(Ws).replace("{2,}", "*").getRegex(),
  text: $(Ni.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Fn = {
  normal: Ki,
  gfm: Zr,
  pedantic: Kr
}, rn = {
  normal: Ji,
  gfm: Ni,
  breaks: bo,
  pedantic: wo
}, xo = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, hs = (n) => xo[n];
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
  const t = n.replace(pe.findPipe, (a, c, h) => {
    let u = !1, f = c;
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
function _o(n, e) {
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
  const r = e.href, a = e.title || null, c = n[1].replace(s.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  const h = {
    type: n[0].charAt(0) === "!" ? "image" : "link",
    raw: t,
    href: r,
    title: a,
    text: c,
    tokens: i.inlineTokens(c)
  };
  return i.state.inLink = !1, h;
}
function vo(n, e, t) {
  const i = n.match(t.other.indentCodeCompensation);
  if (i === null)
    return e;
  const s = i[1];
  return e.split(`
`).map((r) => {
    const a = r.match(t.other.beginningSpace);
    if (a === null)
      return r;
    const [c] = a;
    return c.length >= s.length ? r.slice(s.length) : r;
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
      const t = e[0], i = vo(t, e[3] || "", this.rules);
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
        let a = !1;
        const c = [];
        let h;
        for (h = 0; h < t.length; h++)
          if (this.rules.other.blockquoteStart.test(t[h]))
            c.push(t[h]), a = !0;
          else if (!a)
            c.push(t[h]);
          else
            break;
        t = t.slice(h);
        const u = c.join(`
`), f = u.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${u}` : u, s = s ? `${s}
${f}` : f;
        const O = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(f, r, !0), this.lexer.state.top = O, t.length === 0)
          break;
        const y = r.at(-1);
        if ((y == null ? void 0 : y.type) === "code")
          break;
        if ((y == null ? void 0 : y.type) === "blockquote") {
          const H = y, D = H.raw + `
` + t.join(`
`), M = this.blockquote(D);
          r[r.length - 1] = M, i = i.substring(0, i.length - H.raw.length) + M.raw, s = s.substring(0, s.length - H.text.length) + M.text;
          break;
        } else if ((y == null ? void 0 : y.type) === "list") {
          const H = y, D = H.raw + `
` + t.join(`
`), M = this.list(D);
          r[r.length - 1] = M, i = i.substring(0, i.length - y.raw.length) + M.raw, s = s.substring(0, s.length - H.raw.length) + M.raw, t = D.substring(r.at(-1).raw.length).split(`
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
      let a = !1;
      for (; n; ) {
        let h = !1, u = "", f = "";
        if (!(e = r.exec(n)) || this.rules.block.hr.test(n))
          break;
        u = e[0], n = n.substring(u.length);
        let O = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (ye) => " ".repeat(3 * ye.length)), y = n.split(`
`, 1)[0], H = !O.trim(), D = 0;
        if (this.options.pedantic ? (D = 2, f = O.trimStart()) : H ? D = e[1].length + 1 : (D = e[2].search(this.rules.other.nonSpaceChar), D = D > 4 ? 1 : D, f = O.slice(D), D += e[1].length), H && this.rules.other.blankLine.test(y) && (u += y + `
`, n = n.substring(y.length + 1), h = !0), !h) {
          const ye = this.rules.other.nextBulletRegex(D), le = this.rules.other.hrRegex(D), me = this.rules.other.fencesBeginRegex(D), te = this.rules.other.headingBeginRegex(D), Oe = this.rules.other.htmlBeginRegex(D);
          for (; n; ) {
            const Ve = n.split(`
`, 1)[0];
            let De;
            if (y = Ve, this.options.pedantic ? (y = y.replace(this.rules.other.listReplaceNesting, "  "), De = y) : De = y.replace(this.rules.other.tabCharGlobal, "    "), me.test(y) || te.test(y) || Oe.test(y) || ye.test(y) || le.test(y))
              break;
            if (De.search(this.rules.other.nonSpaceChar) >= D || !y.trim())
              f += `
` + De.slice(D);
            else {
              if (H || O.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || me.test(O) || te.test(O) || le.test(O))
                break;
              f += `
` + y;
            }
            !H && !y.trim() && (H = !0), u += Ve + `
`, n = n.substring(Ve.length + 1), O = De.slice(D);
          }
        }
        s.loose || (a ? s.loose = !0 : this.rules.other.doubleBlankLine.test(u) && (a = !0));
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
      const c = s.items.at(-1);
      if (c)
        c.raw = c.raw.trimEnd(), c.text = c.text.trimEnd();
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
    var a;
    const e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2]))
      return;
    const t = ps(e[1]), i = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = (a = e[3]) != null && a.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], r = {
      type: "table",
      raw: e[0],
      header: [],
      align: [],
      rows: []
    };
    if (t.length === i.length) {
      for (const c of i)
        this.rules.other.tableAlignRight.test(c) ? r.align.push("right") : this.rules.other.tableAlignCenter.test(c) ? r.align.push("center") : this.rules.other.tableAlignLeft.test(c) ? r.align.push("left") : r.align.push(null);
      for (let c = 0; c < t.length; c++)
        r.header.push({
          text: t[c],
          tokens: this.lexer.inline(t[c]),
          header: !0,
          align: r.align[c]
        });
      for (const c of s)
        r.rows.push(ps(c, r.header.length).map((h, u) => ({
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
        const r = _o(e[2], "()");
        if (r === -2)
          return;
        if (r > -1) {
          const c = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + r;
          e[2] = e[2].substring(0, r), e[0] = e[0].substring(0, c).trim(), e[3] = "";
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
      let a, c, h = r, u = 0;
      const f = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (f.lastIndex = 0, e = e.slice(-1 * n.length + r); (i = f.exec(e)) != null; ) {
        if (a = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !a) continue;
        if (c = [...a].length, i[3] || i[4]) {
          h += c;
          continue;
        } else if ((i[5] || i[6]) && r % 3 && !((r + c) % 3)) {
          u += c;
          continue;
        }
        if (h -= c, h > 0) continue;
        c = Math.min(c, c + h + u);
        const O = [...i[0]][0].length, y = n.slice(0, r + i.index + O + c);
        if (Math.min(r, c) % 2) {
          const D = y.slice(1, -1);
          return {
            type: "em",
            raw: y,
            text: D,
            tokens: this.lexer.inlineTokens(D)
          };
        }
        const H = y.slice(2, -2);
        return {
          type: "strong",
          raw: y,
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
      block: Fn.normal,
      inline: rn.normal
    };
    this.options.pedantic ? (t.block = Fn.pedantic, t.inline = rn.pedantic) : this.options.gfm && (t.block = Fn.gfm, this.options.breaks ? t.inline = rn.breaks : t.inline = rn.gfm), this.tokenizer.rules = t;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: Fn,
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
    var s, r, a;
    for (this.options.pedantic && (e = e.replace(pe.tabCharGlobal, "    ").replace(pe.spaceLine, "")); e; ) {
      let c;
      if ((r = (s = this.options.extensions) == null ? void 0 : s.block) != null && r.some((u) => (c = u.call({ lexer: this }, e, t)) ? (e = e.substring(c.raw.length), t.push(c), !0) : !1))
        continue;
      if (c = this.tokenizer.space(e)) {
        e = e.substring(c.raw.length);
        const u = t.at(-1);
        c.raw.length === 1 && u !== void 0 ? u.raw += `
` : t.push(c);
        continue;
      }
      if (c = this.tokenizer.code(e)) {
        e = e.substring(c.raw.length);
        const u = t.at(-1);
        (u == null ? void 0 : u.type) === "paragraph" || (u == null ? void 0 : u.type) === "text" ? (u.raw += `
` + c.raw, u.text += `
` + c.text, this.inlineQueue.at(-1).src = u.text) : t.push(c);
        continue;
      }
      if (c = this.tokenizer.fences(e)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (c = this.tokenizer.heading(e)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (c = this.tokenizer.hr(e)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (c = this.tokenizer.blockquote(e)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (c = this.tokenizer.list(e)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (c = this.tokenizer.html(e)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (c = this.tokenizer.def(e)) {
        e = e.substring(c.raw.length);
        const u = t.at(-1);
        (u == null ? void 0 : u.type) === "paragraph" || (u == null ? void 0 : u.type) === "text" ? (u.raw += `
` + c.raw, u.text += `
` + c.raw, this.inlineQueue.at(-1).src = u.text) : this.tokens.links[c.tag] || (this.tokens.links[c.tag] = {
          href: c.href,
          title: c.title
        });
        continue;
      }
      if (c = this.tokenizer.table(e)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (c = this.tokenizer.lheading(e)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      let h = e;
      if ((a = this.options.extensions) != null && a.startBlock) {
        let u = 1 / 0;
        const f = e.slice(1);
        let O;
        this.options.extensions.startBlock.forEach((y) => {
          O = y.call({ lexer: this }, f), typeof O == "number" && O >= 0 && (u = Math.min(u, O));
        }), u < 1 / 0 && u >= 0 && (h = e.substring(0, u + 1));
      }
      if (this.state.top && (c = this.tokenizer.paragraph(h))) {
        const u = t.at(-1);
        i && (u == null ? void 0 : u.type) === "paragraph" ? (u.raw += `
` + c.raw, u.text += `
` + c.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = u.text) : t.push(c), i = h.length !== e.length, e = e.substring(c.raw.length);
        continue;
      }
      if (c = this.tokenizer.text(e)) {
        e = e.substring(c.raw.length);
        const u = t.at(-1);
        (u == null ? void 0 : u.type) === "text" ? (u.raw += `
` + c.raw, u.text += `
` + c.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = u.text) : t.push(c);
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
    var c, h, u;
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
    let r = !1, a = "";
    for (; e; ) {
      r || (a = ""), r = !1;
      let f;
      if ((h = (c = this.options.extensions) == null ? void 0 : c.inline) != null && h.some((y) => (f = y.call({ lexer: this }, e, t)) ? (e = e.substring(f.raw.length), t.push(f), !0) : !1))
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
        const y = t.at(-1);
        f.type === "text" && (y == null ? void 0 : y.type) === "text" ? (y.raw += f.raw, y.text += f.text) : t.push(f);
        continue;
      }
      if (f = this.tokenizer.emStrong(e, i, a)) {
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
        let y = 1 / 0;
        const H = e.slice(1);
        let D;
        this.options.extensions.startInline.forEach((M) => {
          D = M.call({ lexer: this }, H), typeof D == "number" && D >= 0 && (y = Math.min(y, D));
        }), y < 1 / 0 && y >= 0 && (O = e.substring(0, y + 1));
      }
      if (f = this.tokenizer.inlineText(O)) {
        e = e.substring(f.raw.length), f.raw.slice(-1) !== "_" && (a = f.raw.slice(-1)), r = !0;
        const y = t.at(-1);
        (y == null ? void 0 : y.type) === "text" ? (y.raw += f.raw, y.text += f.text) : t.push(f);
        continue;
      }
      if (e) {
        const y = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(y);
          break;
        } else
          throw new Error(y);
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
    for (let a = 0; a < n.items.length; a++) {
      const c = n.items[a];
      i += this.listitem(c);
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
      for (let a = 0; a < r.length; a++)
        t += this.tablecell(r[a]);
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
    for (let a = 0; a < e.length; a++) {
      const c = e[a];
      if ((r = (s = this.options.extensions) == null ? void 0 : s.renderers) != null && r[c.type]) {
        const u = c, f = this.options.extensions.renderers[u.type].call({ parser: this }, u);
        if (f !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(u.type)) {
          i += f || "";
          continue;
        }
      }
      const h = c;
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
          for (; a + 1 < e.length && e[a + 1].type === "text"; )
            u = e[++a], f += `
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
    for (let a = 0; a < e.length; a++) {
      const c = e[a];
      if ((r = (s = this.options.extensions) == null ? void 0 : s.renderers) != null && r[c.type]) {
        const u = this.options.extensions.renderers[c.type].call({ parser: this }, c);
        if (u !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(c.type)) {
          i += u || "";
          continue;
        }
      }
      const h = c;
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
}, Di, Yn = (Di = class {
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
}, X(Di, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
])), Di), yo = class {
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
          const a = r;
          for (const c of a.header)
            t = t.concat(this.walkTokens(c.tokens, e));
          for (const c of a.rows)
            for (const h of c)
              t = t.concat(this.walkTokens(h.tokens, e));
          break;
        }
        case "list": {
          const a = r;
          t = t.concat(this.walkTokens(a.items, e));
          break;
        }
        default: {
          const a = r;
          (s = (i = this.defaults.extensions) == null ? void 0 : i.childTokens) != null && s[a.type] ? this.defaults.extensions.childTokens[a.type].forEach((c) => {
            const h = a[c].flat(1 / 0);
            t = t.concat(this.walkTokens(h, e));
          }) : a.tokens && (t = t.concat(this.walkTokens(a.tokens, e)));
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
          r ? e.renderers[s.name] = function(...a) {
            let c = s.renderer.apply(this, a);
            return c === !1 && (c = r.apply(this, a)), c;
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
          const a = r, c = t.renderer[a], h = s[a];
          s[a] = (...u) => {
            let f = c.apply(s, u);
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
          const a = r, c = t.tokenizer[a], h = s[a];
          s[a] = (...u) => {
            let f = c.apply(s, u);
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
          const a = r, c = t.hooks[a], h = s[a];
          Yn.passThroughHooks.has(r) ? s[a] = (u) => {
            if (this.defaults.async)
              return Promise.resolve(c.call(s, u)).then((O) => h.call(s, O));
            const f = c.call(s, u);
            return h.call(s, f);
          } : s[a] = (...u) => {
            let f = c.apply(s, u);
            return f === !1 && (f = h.apply(s, u)), f;
          };
        }
        i.hooks = s;
      }
      if (t.walkTokens) {
        const s = this.defaults.walkTokens, r = t.walkTokens;
        i.walkTokens = function(a) {
          let c = [];
          return c.push(r.call(this, a)), s && (c = c.concat(s.call(this, a))), c;
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
      const s = { ...i }, r = { ...this.defaults, ...s }, a = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && s.async === !1)
        return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null)
        return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string")
        return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      r.hooks && (r.hooks.options = r, r.hooks.block = n);
      const c = r.hooks ? r.hooks.provideLexer() : n ? Ze.lex : Ze.lexInline, h = r.hooks ? r.hooks.provideParser() : n ? Ke.parse : Ke.parseInline;
      if (r.async)
        return Promise.resolve(r.hooks ? r.hooks.preprocess(t) : t).then((u) => c(u, r)).then((u) => r.hooks ? r.hooks.processAllTokens(u) : u).then((u) => r.walkTokens ? Promise.all(this.walkTokens(u, r.walkTokens)).then(() => u) : u).then((u) => h(u, r)).then((u) => r.hooks ? r.hooks.postprocess(u) : u).catch(a);
      try {
        r.hooks && (t = r.hooks.preprocess(t));
        let u = c(t, r);
        r.hooks && (u = r.hooks.processAllTokens(u)), r.walkTokens && this.walkTokens(u, r.walkTokens);
        let f = h(u, r);
        return r.hooks && (f = r.hooks.postprocess(f)), f;
      } catch (u) {
        return a(u);
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
}, St = new yo();
function j(n, e) {
  return St.parse(n, e);
}
j.options = j.setOptions = function(n) {
  return St.setOptions(n), j.defaults = St.defaults, Fs(j.defaults), j;
};
j.getDefaults = Wi;
j.defaults = Tt;
j.use = function(...n) {
  return St.use(...n), j.defaults = St.defaults, Fs(j.defaults), j;
};
j.walkTokens = function(n, e) {
  return St.walkTokens(n, e);
};
j.parseInline = St.parseInline;
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
  entries: Js,
  setPrototypeOf: gs,
  isFrozen: ko,
  getPrototypeOf: Eo,
  getOwnPropertyDescriptor: So
} = Object;
let {
  freeze: fe,
  seal: Re,
  create: er
} = Object, {
  apply: zi,
  construct: Hi
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
Hi || (Hi = function(e, t) {
  return new e(...t);
});
const Vn = ge(Array.prototype.forEach), To = ge(Array.prototype.lastIndexOf), ms = ge(Array.prototype.pop), an = ge(Array.prototype.push), Ao = ge(Array.prototype.splice), Zn = ge(String.prototype.toLowerCase), xi = ge(String.prototype.toString), ws = ge(String.prototype.match), ln = ge(String.prototype.replace), Co = ge(String.prototype.indexOf), Ro = ge(String.prototype.trim), Ie = ge(Object.prototype.hasOwnProperty), de = ge(RegExp.prototype.test), cn = Oo(TypeError);
function ge(n) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++)
      i[s - 1] = arguments[s];
    return zi(n, e, i);
  };
}
function Oo(n) {
  return function() {
    for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++)
      t[i] = arguments[i];
    return Hi(n, t);
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
      r !== s && (ko(e) || (e[i] = r), s = r);
    }
    n[s] = !0;
  }
  return n;
}
function Mo(n) {
  for (let e = 0; e < n.length; e++)
    Ie(n, e) || (n[e] = null);
  return n;
}
function Xe(n) {
  const e = er(null);
  for (const [t, i] of Js(n))
    Ie(n, t) && (Array.isArray(i) ? e[t] = Mo(i) : i && typeof i == "object" && i.constructor === Object ? e[t] = Xe(i) : e[t] = i);
  return e;
}
function un(n, e) {
  for (; n !== null; ) {
    const i = So(n, e);
    if (i) {
      if (i.get)
        return ge(i.get);
      if (typeof i.value == "function")
        return ge(i.value);
    }
    n = Eo(n);
  }
  function t() {
    return null;
  }
  return t;
}
const bs = fe(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), _i = fe(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), vi = fe(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Lo = fe(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), yi = fe(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Io = fe(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), xs = fe(["#text"]), _s = fe(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), ki = fe(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), vs = fe(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), jn = fe(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Po = Re(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Do = Re(/<%[\w\W]*|[\w\W]*%>/gm), No = Re(/\$\{[\w\W]*/gm), Bo = Re(/^data-[\-\w.\u00B7-\uFFFF]+$/), Uo = Re(/^aria-[\-\w]+$/), tr = Re(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), zo = Re(/^(?:\w+script|data):/i), Ho = Re(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), nr = Re(/^html$/i), $o = Re(/^[a-z][.\w]*(-[.\w]+)+$/i);
var ys = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: Uo,
  ATTR_WHITESPACE: Ho,
  CUSTOM_ELEMENT: $o,
  DATA_ATTR: Bo,
  DOCTYPE_NAME: nr,
  ERB_EXPR: Do,
  IS_ALLOWED_URI: tr,
  IS_SCRIPT_OR_DATA: zo,
  MUSTACHE_EXPR: Po,
  TMPLIT_EXPR: No
});
const hn = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, Fo = function() {
  return typeof window > "u" ? null : window;
}, Vo = function(e, t) {
  if (typeof e != "object" || typeof e.createPolicy != "function")
    return null;
  let i = null;
  const s = "data-tt-policy-suffix";
  t && t.hasAttribute(s) && (i = t.getAttribute(s));
  const r = "dompurify" + (i ? "#" + i : "");
  try {
    return e.createPolicy(r, {
      createHTML(a) {
        return a;
      },
      createScriptURL(a) {
        return a;
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
function ir() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Fo();
  const e = (A) => ir(A);
  if (e.version = "3.2.6", e.removed = [], !n || !n.document || n.document.nodeType !== hn.document || !n.Element)
    return e.isSupported = !1, e;
  let {
    document: t
  } = n;
  const i = t, s = i.currentScript, {
    DocumentFragment: r,
    HTMLTemplateElement: a,
    Node: c,
    Element: h,
    NodeFilter: u,
    NamedNodeMap: f = n.NamedNodeMap || n.MozNamedAttrMap,
    HTMLFormElement: O,
    DOMParser: y,
    trustedTypes: H
  } = n, D = h.prototype, M = un(D, "cloneNode"), ve = un(D, "remove"), ye = un(D, "nextSibling"), le = un(D, "childNodes"), me = un(D, "parentNode");
  if (typeof a == "function") {
    const A = t.createElement("template");
    A.content && A.content.ownerDocument && (t = A.content.ownerDocument);
  }
  let te, Oe = "";
  const {
    implementation: Ve,
    createNodeIterator: De,
    createDocumentFragment: jt,
    getElementsByTagName: En
  } = t, {
    importNode: Sn
  } = i;
  let ae = ks();
  e.isSupported = typeof Js == "function" && typeof me == "function" && Ve && Ve.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: Gt,
    ERB_EXPR: Wt,
    TMPLIT_EXPR: je,
    DATA_ATTR: ci,
    ARIA_ATTR: ui,
    IS_SCRIPT_OR_DATA: hi,
    ATTR_WHITESPACE: dt,
    CUSTOM_ELEMENT: di
  } = ys;
  let {
    IS_ALLOWED_URI: Tn
  } = ys, ne = null;
  const An = z({}, [...bs, ..._i, ...vi, ...yi, ...xs]);
  let se = null;
  const Cn = z({}, [..._s, ...ki, ...vs, ...jn]);
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
  })), pt = null, qt = null, Rn = !0, On = !0, ft = !1, Mn = !0, tt = !1, At = !0, Ge = !1, Xt = !1, Yt = !1, nt = !1, Ct = !1, Rt = !1, Zt = !0, Ln = !1;
  const pi = "user-content-";
  let Ot = !0, ke = !1, We = {}, Ee = null;
  const gt = z({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let Kt = null;
  const In = z({}, ["audio", "video", "img", "source", "image", "track"]);
  let Qt = null;
  const Pn = z({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Mt = "http://www.w3.org/1998/Math/MathML", Lt = "http://www.w3.org/2000/svg", Ae = "http://www.w3.org/1999/xhtml";
  let it = Ae, Jt = !1, en = null;
  const tn = z({}, [Mt, Lt, Ae], xi);
  let mt = z({}, ["mi", "mo", "mn", "ms", "mtext"]), wt = z({}, ["annotation-xml"]);
  const fi = z({}, ["title", "style", "font", "a", "script"]);
  let st = null;
  const rt = ["application/xhtml+xml", "text/html"], o = "text/html";
  let d = null, v = null;
  const I = t.createElement("form"), Q = function(l) {
    return l instanceof RegExp || l instanceof Function;
  }, K = function() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(v && v === l)) {
      if ((!l || typeof l != "object") && (l = {}), l = Xe(l), st = // eslint-disable-next-line unicorn/prefer-includes
      rt.indexOf(l.PARSER_MEDIA_TYPE) === -1 ? o : l.PARSER_MEDIA_TYPE, d = st === "application/xhtml+xml" ? xi : Zn, ne = Ie(l, "ALLOWED_TAGS") ? z({}, l.ALLOWED_TAGS, d) : An, se = Ie(l, "ALLOWED_ATTR") ? z({}, l.ALLOWED_ATTR, d) : Cn, en = Ie(l, "ALLOWED_NAMESPACES") ? z({}, l.ALLOWED_NAMESPACES, xi) : tn, Qt = Ie(l, "ADD_URI_SAFE_ATTR") ? z(Xe(Pn), l.ADD_URI_SAFE_ATTR, d) : Pn, Kt = Ie(l, "ADD_DATA_URI_TAGS") ? z(Xe(In), l.ADD_DATA_URI_TAGS, d) : In, Ee = Ie(l, "FORBID_CONTENTS") ? z({}, l.FORBID_CONTENTS, d) : gt, pt = Ie(l, "FORBID_TAGS") ? z({}, l.FORBID_TAGS, d) : Xe({}), qt = Ie(l, "FORBID_ATTR") ? z({}, l.FORBID_ATTR, d) : Xe({}), We = Ie(l, "USE_PROFILES") ? l.USE_PROFILES : !1, Rn = l.ALLOW_ARIA_ATTR !== !1, On = l.ALLOW_DATA_ATTR !== !1, ft = l.ALLOW_UNKNOWN_PROTOCOLS || !1, Mn = l.ALLOW_SELF_CLOSE_IN_ATTR !== !1, tt = l.SAFE_FOR_TEMPLATES || !1, At = l.SAFE_FOR_XML !== !1, Ge = l.WHOLE_DOCUMENT || !1, nt = l.RETURN_DOM || !1, Ct = l.RETURN_DOM_FRAGMENT || !1, Rt = l.RETURN_TRUSTED_TYPE || !1, Yt = l.FORCE_BODY || !1, Zt = l.SANITIZE_DOM !== !1, Ln = l.SANITIZE_NAMED_PROPS || !1, Ot = l.KEEP_CONTENT !== !1, ke = l.IN_PLACE || !1, Tn = l.ALLOWED_URI_REGEXP || tr, it = l.NAMESPACE || Ae, mt = l.MATHML_TEXT_INTEGRATION_POINTS || mt, wt = l.HTML_INTEGRATION_POINTS || wt, J = l.CUSTOM_ELEMENT_HANDLING || {}, l.CUSTOM_ELEMENT_HANDLING && Q(l.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (J.tagNameCheck = l.CUSTOM_ELEMENT_HANDLING.tagNameCheck), l.CUSTOM_ELEMENT_HANDLING && Q(l.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (J.attributeNameCheck = l.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), l.CUSTOM_ELEMENT_HANDLING && typeof l.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (J.allowCustomizedBuiltInElements = l.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), tt && (On = !1), Ct && (nt = !0), We && (ne = z({}, xs), se = [], We.html === !0 && (z(ne, bs), z(se, _s)), We.svg === !0 && (z(ne, _i), z(se, ki), z(se, jn)), We.svgFilters === !0 && (z(ne, vi), z(se, ki), z(se, jn)), We.mathMl === !0 && (z(ne, yi), z(se, vs), z(se, jn))), l.ADD_TAGS && (ne === An && (ne = Xe(ne)), z(ne, l.ADD_TAGS, d)), l.ADD_ATTR && (se === Cn && (se = Xe(se)), z(se, l.ADD_ATTR, d)), l.ADD_URI_SAFE_ATTR && z(Qt, l.ADD_URI_SAFE_ATTR, d), l.FORBID_CONTENTS && (Ee === gt && (Ee = Xe(Ee)), z(Ee, l.FORBID_CONTENTS, d)), Ot && (ne["#text"] = !0), Ge && z(ne, ["html", "head", "body"]), ne.table && (z(ne, ["tbody"]), delete pt.tbody), l.TRUSTED_TYPES_POLICY) {
        if (typeof l.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw cn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof l.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw cn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        te = l.TRUSTED_TYPES_POLICY, Oe = te.createHTML("");
      } else
        te === void 0 && (te = Vo(H, s)), te !== null && typeof Oe == "string" && (Oe = te.createHTML(""));
      fe && fe(l), v = l;
    }
  }, T = z({}, [..._i, ...vi, ...Lo]), S = z({}, [...yi, ...Io]), L = function(l) {
    let _ = me(l);
    (!_ || !_.tagName) && (_ = {
      namespaceURI: it,
      tagName: "template"
    });
    const E = Zn(l.tagName), q = Zn(_.tagName);
    return en[l.namespaceURI] ? l.namespaceURI === Lt ? _.namespaceURI === Ae ? E === "svg" : _.namespaceURI === Mt ? E === "svg" && (q === "annotation-xml" || mt[q]) : !!T[E] : l.namespaceURI === Mt ? _.namespaceURI === Ae ? E === "math" : _.namespaceURI === Lt ? E === "math" && wt[q] : !!S[E] : l.namespaceURI === Ae ? _.namespaceURI === Lt && !wt[q] || _.namespaceURI === Mt && !mt[q] ? !1 : !S[E] && (fi[E] || !T[E]) : !!(st === "application/xhtml+xml" && en[l.namespaceURI]) : !1;
  }, F = function(l) {
    an(e.removed, {
      element: l
    });
    try {
      me(l).removeChild(l);
    } catch {
      ve(l);
    }
  }, W = function(l, _) {
    try {
      an(e.removed, {
        attribute: _.getAttributeNode(l),
        from: _
      });
    } catch {
      an(e.removed, {
        attribute: null,
        from: _
      });
    }
    if (_.removeAttribute(l), l === "is")
      if (nt || Ct)
        try {
          F(_);
        } catch {
        }
      else
        try {
          _.setAttribute(l, "");
        } catch {
        }
  }, ot = function(l) {
    let _ = null, E = null;
    if (Yt)
      l = "<remove></remove>" + l;
    else {
      const ee = ws(l, /^[\r\n\t ]+/);
      E = ee && ee[0];
    }
    st === "application/xhtml+xml" && it === Ae && (l = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + l + "</body></html>");
    const q = te ? te.createHTML(l) : l;
    if (it === Ae)
      try {
        _ = new y().parseFromString(q, st);
      } catch {
      }
    if (!_ || !_.documentElement) {
      _ = Ve.createDocument(it, "template", null);
      try {
        _.documentElement.innerHTML = Jt ? Oe : q;
      } catch {
      }
    }
    const re = _.body || _.documentElement;
    return l && E && re.insertBefore(t.createTextNode(E), re.childNodes[0] || null), it === Ae ? En.call(_, Ge ? "html" : "body")[0] : Ge ? _.documentElement : re;
  }, It = function(l) {
    return De.call(
      l.ownerDocument || l,
      l,
      // eslint-disable-next-line no-bitwise
      u.SHOW_ELEMENT | u.SHOW_COMMENT | u.SHOW_TEXT | u.SHOW_PROCESSING_INSTRUCTION | u.SHOW_CDATA_SECTION,
      null
    );
  }, bt = function(l) {
    return l instanceof O && (typeof l.nodeName != "string" || typeof l.textContent != "string" || typeof l.removeChild != "function" || !(l.attributes instanceof f) || typeof l.removeAttribute != "function" || typeof l.setAttribute != "function" || typeof l.namespaceURI != "string" || typeof l.insertBefore != "function" || typeof l.hasChildNodes != "function");
  }, Dn = function(l) {
    return typeof c == "function" && l instanceof c;
  };
  function Se(A, l, _) {
    Vn(A, (E) => {
      E.call(e, l, _, v);
    });
  }
  const Nn = function(l) {
    let _ = null;
    if (Se(ae.beforeSanitizeElements, l, null), bt(l))
      return F(l), !0;
    const E = d(l.nodeName);
    if (Se(ae.uponSanitizeElement, l, {
      tagName: E,
      allowedTags: ne
    }), At && l.hasChildNodes() && !Dn(l.firstElementChild) && de(/<[/\w!]/g, l.innerHTML) && de(/<[/\w!]/g, l.textContent) || l.nodeType === hn.progressingInstruction || At && l.nodeType === hn.comment && de(/<[/\w]/g, l.data))
      return F(l), !0;
    if (!ne[E] || pt[E]) {
      if (!pt[E] && Un(E) && (J.tagNameCheck instanceof RegExp && de(J.tagNameCheck, E) || J.tagNameCheck instanceof Function && J.tagNameCheck(E)))
        return !1;
      if (Ot && !Ee[E]) {
        const q = me(l) || l.parentNode, re = le(l) || l.childNodes;
        if (re && q) {
          const ee = re.length;
          for (let ue = ee - 1; ue >= 0; --ue) {
            const Me = M(re[ue], !0);
            Me.__removalCount = (l.__removalCount || 0) + 1, q.insertBefore(Me, ye(l));
          }
        }
      }
      return F(l), !0;
    }
    return l instanceof h && !L(l) || (E === "noscript" || E === "noembed" || E === "noframes") && de(/<\/no(script|embed|frames)/i, l.innerHTML) ? (F(l), !0) : (tt && l.nodeType === hn.text && (_ = l.textContent, Vn([Gt, Wt, je], (q) => {
      _ = ln(_, q, " ");
    }), l.textContent !== _ && (an(e.removed, {
      element: l.cloneNode()
    }), l.textContent = _)), Se(ae.afterSanitizeElements, l, null), !1);
  }, Bn = function(l, _, E) {
    if (Zt && (_ === "id" || _ === "name") && (E in t || E in I))
      return !1;
    if (!(On && !qt[_] && de(ci, _))) {
      if (!(Rn && de(ui, _))) {
        if (!se[_] || qt[_]) {
          if (
            // First condition does a very basic check if a) it's basically a valid custom element tagname AND
            // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
            !(Un(l) && (J.tagNameCheck instanceof RegExp && de(J.tagNameCheck, l) || J.tagNameCheck instanceof Function && J.tagNameCheck(l)) && (J.attributeNameCheck instanceof RegExp && de(J.attributeNameCheck, _) || J.attributeNameCheck instanceof Function && J.attributeNameCheck(_)) || // Alternative, second condition checks if it's an `is`-attribute, AND
            // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            _ === "is" && J.allowCustomizedBuiltInElements && (J.tagNameCheck instanceof RegExp && de(J.tagNameCheck, E) || J.tagNameCheck instanceof Function && J.tagNameCheck(E)))
          ) return !1;
        } else if (!Qt[_]) {
          if (!de(Tn, ln(E, dt, ""))) {
            if (!((_ === "src" || _ === "xlink:href" || _ === "href") && l !== "script" && Co(E, "data:") === 0 && Kt[l])) {
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
  }, Un = function(l) {
    return l !== "annotation-xml" && ws(l, di);
  }, nn = function(l) {
    Se(ae.beforeSanitizeAttributes, l, null);
    const {
      attributes: _
    } = l;
    if (!_ || bt(l))
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
      } = re, Ne = d(ee), sn = Me;
      let w = ee === "value" ? sn : Ro(sn);
      if (E.attrName = Ne, E.attrValue = w, E.keepAttr = !0, E.forceKeepAttr = void 0, Se(ae.uponSanitizeAttribute, l, E), w = E.attrValue, Ln && (Ne === "id" || Ne === "name") && (W(ee, l), w = pi + w), At && de(/((--!?|])>)|<\/(style|title)/i, w)) {
        W(ee, l);
        continue;
      }
      if (E.forceKeepAttr)
        continue;
      if (!E.keepAttr) {
        W(ee, l);
        continue;
      }
      if (!Mn && de(/\/>/i, w)) {
        W(ee, l);
        continue;
      }
      tt && Vn([Gt, Wt, je], (U) => {
        w = ln(w, U, " ");
      });
      const C = d(l.nodeName);
      if (!Bn(C, Ne, w)) {
        W(ee, l);
        continue;
      }
      if (te && typeof H == "object" && typeof H.getAttributeType == "function" && !ue)
        switch (H.getAttributeType(C, Ne)) {
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
          ue ? l.setAttributeNS(ue, ee, w) : l.setAttribute(ee, w), bt(l) ? F(l) : ms(e.removed);
        } catch {
          W(ee, l);
        }
    }
    Se(ae.afterSanitizeAttributes, l, null);
  }, Pt = function A(l) {
    let _ = null;
    const E = It(l);
    for (Se(ae.beforeSanitizeShadowDOM, l, null); _ = E.nextNode(); )
      Se(ae.uponSanitizeShadowNode, _, null), Nn(_), nn(_), _.content instanceof r && A(_.content);
    Se(ae.afterSanitizeShadowDOM, l, null);
  };
  return e.sanitize = function(A) {
    let l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ = null, E = null, q = null, re = null;
    if (Jt = !A, Jt && (A = "<!-->"), typeof A != "string" && !Dn(A))
      if (typeof A.toString == "function") {
        if (A = A.toString(), typeof A != "string")
          throw cn("dirty is not a string, aborting");
      } else
        throw cn("toString is not a function");
    if (!e.isSupported)
      return A;
    if (Xt || K(l), e.removed = [], typeof A == "string" && (ke = !1), ke) {
      if (A.nodeName) {
        const Me = d(A.nodeName);
        if (!ne[Me] || pt[Me])
          throw cn("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (A instanceof c)
      _ = ot("<!---->"), E = _.ownerDocument.importNode(A, !0), E.nodeType === hn.element && E.nodeName === "BODY" || E.nodeName === "HTML" ? _ = E : _.appendChild(E);
    else {
      if (!nt && !tt && !Ge && // eslint-disable-next-line unicorn/prefer-includes
      A.indexOf("<") === -1)
        return te && Rt ? te.createHTML(A) : A;
      if (_ = ot(A), !_)
        return nt ? null : Rt ? Oe : "";
    }
    _ && Yt && F(_.firstChild);
    const ee = It(ke ? A : _);
    for (; q = ee.nextNode(); )
      Nn(q), nn(q), q.content instanceof r && Pt(q.content);
    if (ke)
      return A;
    if (nt) {
      if (Ct)
        for (re = jt.call(_.ownerDocument); _.firstChild; )
          re.appendChild(_.firstChild);
      else
        re = _;
      return (se.shadowroot || se.shadowrootmode) && (re = Sn.call(i, re, !0)), re;
    }
    let ue = Ge ? _.outerHTML : _.innerHTML;
    return Ge && ne["!doctype"] && _.ownerDocument && _.ownerDocument.doctype && _.ownerDocument.doctype.name && de(nr, _.ownerDocument.doctype.name) && (ue = "<!DOCTYPE " + _.ownerDocument.doctype.name + `>
` + ue), tt && Vn([Gt, Wt, je], (Me) => {
      ue = ln(ue, Me, " ");
    }), te && Rt ? te.createHTML(ue) : ue;
  }, e.setConfig = function() {
    let A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    K(A), Xt = !0;
  }, e.clearConfig = function() {
    v = null, Xt = !1;
  }, e.isValidAttribute = function(A, l, _) {
    v || K({});
    const E = d(A), q = d(l);
    return Bn(E, q, _);
  }, e.addHook = function(A, l) {
    typeof l == "function" && an(ae[A], l);
  }, e.removeHook = function(A, l) {
    if (l !== void 0) {
      const _ = To(ae[A], l);
      return _ === -1 ? void 0 : Ao(ae[A], _, 1)[0];
    }
    return ms(ae[A]);
  }, e.removeHooks = function(A) {
    ae[A] = [];
  }, e.removeAllHooks = function() {
    ae = ks();
  }, e;
}
var Es = ir();
class jo extends Ft {
  constructor(e, t) {
    super(e, t), this.textContainer = document.createElement("div"), this.textContainer.classList.add("text-card"), this.root.appendChild(this.textContainer), this.textContainer.style.backgroundColor = e.background_color;
    const i = sr(
      e,
      (s) => t.getCoordinateSystem().getSizePx(s) + "px"
    );
    this.textContainer.appendChild(i);
  }
  addClickCallback(e) {
    this.textContainer.addEventListener("click", (t) => {
      e(t);
    });
  }
}
function sr(n, e) {
  const t = document.createElement("div");
  switch (t.classList.add("text-content"), t.style.color = n.text_color, t.style.textAlign = n.justification_horizontal, n.justification_vertical) {
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
      throw new Error(`Unknown vertical justification: ${n.justification_vertical}`);
  }
  const i = e(n.font_size);
  t.style.fontSize = i;
  let s = j.parse(n.text);
  return s instanceof Promise ? s.then((r) => {
    t.innerHTML = Es.sanitize(r);
  }) : t.innerHTML = Es.sanitize(s), t;
}
class Go extends Ft {
  constructor(e, t) {
    if (super(e, t), this.pageIndex = 0, this.onPressDone = null, e.pages.length === 0)
      throw new Error("No markdown pages provided to MarkdownPagesViewer");
    const i = document.createElement("div");
    i.classList.add("markdown-pages-viewer"), this.root.appendChild(i), this.viewerDiv = document.createElement("div"), this.viewerDiv.classList.add("markdown-pages-viewer__window"), i.appendChild(this.viewerDiv), this.contentPages = [];
    for (const r of e.pages) {
      const a = sr(
        r,
        (c) => this.boardView.getCoordinateSystem().getSizePx(c) + "px"
      );
      this.contentPages.push(a);
    }
    let s = document.createElement("div");
    s.classList.add("nav-tray"), i.appendChild(s), this.navButtons = new Wo(), this.navButtons.mount(s), this.doneButton = new $i("Done"), this.doneButton.mount(s), this.goToPage(0), this.navButtons.addButtonPressListeners(
      () => this.handleBack(),
      () => this.handleNext()
    ), this.doneButton.addButtonPressListener(() => this.handleDone());
  }
  goToPage(e) {
    const t = this.contentPages.length;
    if (e < 0 || e >= t)
      throw new Error(`goToPage: index ${e} outside [0, ${t - 1}]`);
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
class Wo extends _e {
  constructor() {
    super(), this.root = document.createElement("div"), this.lastButton = new $i("←"), this.lastButton.mount(this.root), this.nextButton = new $i("→"), this.nextButton.mount(this.root);
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
class $i extends _e {
  constructor(e) {
    super();
    const t = document.createElement("button");
    t.className = "nav-tray__button", t.textContent = e, this.root = t;
  }
  addButtonPressListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class qo extends Ft {
  constructor(e, t) {
    super(e, t), this.imageContainer = document.createElement("div"), this.imageContainer.classList.add("image-card"), this.root.appendChild(this.imageContainer), this.imageLoadedPromise = (async () => {
      this.image = await t.assetManager.getImage(
        e.image_identifier
      ), this.image.classList.add("image-card__content"), this.image.draggable = !1, this.imageContainer.appendChild(this.image);
    })();
  }
  addClickCallback(e) {
    this.imageContainer.addEventListener("click", (t) => {
      e(t);
    });
  }
  async load() {
    return this.imageLoadedPromise;
  }
}
class Xo extends Ft {
  constructor(e, t) {
    super(e, t), this.videoContainer = document.createElement("div"), this.videoContainer.classList.add("video-card"), this.root.appendChild(this.videoContainer), this.videoLoadedPromise = (async () => {
      this.video = await t.assetManager.getVideo(
        e.video_identifier
      ), this.video.classList.add("video-card__content"), this.videoContainer.appendChild(this.video), this.video.draggable = !1, this.video.muted = !0;
    })();
  }
  addClickCallback(e) {
    this.videoContainer.addEventListener("click", (t) => {
      e(t);
    });
  }
  async load() {
    return this.videoLoadedPromise;
  }
  unload() {
    super.unload(), this.video.removeAttribute("src"), this.video.load();
  }
  async start() {
    await super.start();
    let e = new Promise((i, s) => {
      setTimeout(() => {
        s(new Error("Video failed to play!"));
      }, 33);
    }), t = new Promise((i, s) => {
      this.video.onplaying = () => {
        i(null);
      };
    });
    this.video.autoplay = !0, await Promise.race([t, e]);
  }
}
class Yo extends Ft {
  constructor(e, t) {
    super(e, t), this.root.style.backgroundColor = e.color;
  }
  addClickCallback(e) {
    this.root.addEventListener("click", (t) => {
      e(t);
    });
  }
}
class Zo {
  // Height of the board in pixels
  constructor(e, t) {
    this.boardWidthPx = e, this.boardHeightPx = t;
  }
  getUnitPx() {
    return Math.min(this.boardWidthPx, this.boardHeightPx);
  }
  getBoardLocationPx(e, t, i, s) {
    const r = this.getUnitPx(), a = this.boardWidthPx / r, c = this.boardHeightPx / r, h = r * (e - i / 2 + a / 2), u = r * (-t - s / 2 + c / 2);
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
}
class Ko {
  // Map of sensor ID to SensorBinding
  constructor(e, t, i) {
    this.cardViews = /* @__PURE__ */ new Map(), this.sensorBindings = /* @__PURE__ */ new Map(), this.root = document.createElement("div"), this.root.className = "board-view", this.root.id = `${e}`, this.root.style.width = t.board_width_px + "px", this.root.style.height = t.board_height_px + "px", this.assetManager = i, this.reset(), this.setState(!1, !1);
  }
  getCoordinateSystem() {
    const { width: e, height: t } = this.root.getBoundingClientRect();
    return new Zo(e, t);
  }
  reset() {
    for (this.cardViews.forEach((e) => {
      e.unload();
    }); this.root.firstChild; )
      this.root.removeChild(this.root.firstChild);
  }
  setState(e, t) {
    e ? this.root.style.opacity = "1" : this.root.style.opacity = "0", t ? (this.root.removeAttribute("disabled"), this.root.style.pointerEvents = "", this.root.style.userSelect = "", this.root.style.opacity = "") : (this.root.setAttribute("disabled", "true"), this.root.style.pointerEvents = "none", this.root.style.userSelect = "none");
  }
  getArea() {
    return {
      width_px: this.root.offsetWidth,
      height_px: this.root.offsetHeight
    };
  }
  // Cards
  async placeCardHidden(e) {
    const t = await Jo(
      e,
      this
    );
    this.cardViews.set(e.card_id, t);
  }
  getCardView(e) {
    const t = this.cardViews.get(e);
    if (!t)
      throw new Error(`CardView with ID ${e} not found.`);
    return t;
  }
  showCard(e) {
    const t = this.getCardView(e);
    t.setVisibility(!0), t.start();
  }
  hideCard(e) {
    this.getCardView(e).setVisibility(!1);
  }
  // Sensors
  placeSensorUnarmed(e, t) {
    const i = Qo(e, t, this);
    this.sensorBindings.set(e.sensor_id, i);
  }
  getSensorBinding(e) {
    const t = this.sensorBindings.get(e);
    if (!t)
      throw new Error(`SensorBinding with ID ${e} not found.`);
    return t;
  }
  armSensor(e) {
    this.getSensorBinding(e).arm();
  }
  disarmSensor(e) {
    this.getSensorBinding(e).disarm();
  }
}
function Qo(n, e, t) {
  if (n.sensor_type === "TimeoutSensor")
    return new Dr(
      n.sensor_id,
      e,
      n.t_armed
    );
  if (n.sensor_type === "KeySensor")
    return new Nr(
      n.sensor_id,
      e,
      n.key
    );
  if (n.sensor_type == "ClickSensor") {
    let i = t.getCardView(n.card_id);
    return Br(i), new Ir(
      n.sensor_id,
      e,
      i,
      t
    );
  } else if (n.sensor_type == "DoneSensor") {
    let i = t.getCardView(n.card_id);
    return Ur(i), new Pr(
      n.sensor_id,
      e,
      i
    );
  } else
    throw new Error(`Unknown Sensor of type ${n.sensor_type}`);
}
async function Jo(n, e) {
  let t = null;
  switch (n.card_type) {
    case "FixationPointCard":
      t = new zr(
        n,
        e
      );
      break;
    case "MarkdownPagesCard":
      t = new Go(
        n,
        e
      );
      break;
    case "ImageCard":
      t = new qo(
        n,
        e
      );
      break;
    case "VideoCard":
      t = new Xo(
        n,
        e
      );
      break;
    case "TextCard":
      t = new jo(
        n,
        e
      );
      break;
    case "BlankCard":
      t = new Yo(
        n,
        e
      );
      break;
    default:
      throw new Error(`Unsupported Card type: ${n}`);
  }
  return await t.load(), t;
}
class ea {
  constructor(e) {
    this.boardViews = /* @__PURE__ */ new Map(), this.activeBoardId = null, this.root = document.createElement("div"), this.root.className = "board-views-ui", this.assetManager = e;
  }
  createBoardView(e, t) {
    if (this.boardViews.has(e))
      return this.getBoardView(e);
    const i = new Ko(e, t, this.assetManager);
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
      this.getBoardView(this.activeBoardId).setState(!1, !1);
    }
    this.getBoardView(e).setState(!0, !0), this.activeBoardId = e;
  }
  destroyBoardView(e) {
    const t = this.boardViews.get(e);
    t && (t.reset(), this.root.removeChild(t.root), this.boardViews.delete(e), this.activeBoardId === e && (this.activeBoardId = null));
  }
}
class ta {
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
        i.onload = () => s(i), i.onerror = (a) => r(a);
      }
    );
  }
  async getVideo(e) {
    let t = this.lookupAssetUrl(e), i = document.createElement("video");
    i.controls = !1;
    let s = new Promise((r, a) => {
      i.oncanplaythrough = () => {
        r(i);
      }, i.onerror = (c) => a(c);
    });
    return i.src = t.url, i.load(), s;
  }
}
function na() {
  const n = document.createElement("div");
  document.body.appendChild(n);
  const e = document.createElement("div");
  e.classList.add("node-engine-container"), n.appendChild(e);
  const t = document.createElement("div");
  t.classList.add("node-engine-content"), e.appendChild(t);
  const i = new ta(), s = new ea(
    i
  );
  t.appendChild(s.root);
  const r = new Lr();
  return r.mount(t), {
    boardViewsUI: s,
    shellUI: r,
    assetManager: i
  };
}
class Ss {
  constructor(e) {
    this.events = [], this.nextToken = 1, this.running = !1, this.rafId = null, this.t0 = 0, this.loop = (i) => {
      if (!this.running)
        return;
      const s = i - this.t0;
      for (; this.events.length > 0 && this.events[0].triggerTimeMsec <= s; )
        this.events.shift().triggerFunc();
      this.events.length > 0 ? this.rafId = requestAnimationFrame(this.loop) : this.stop();
    }, this.abortSignal = e;
    const t = () => {
      this.stop(), this.abortSignal.removeEventListener("abort", t);
    };
    this.abortSignal.addEventListener("abort", t, { once: !0 });
  }
  scheduleEvent(e) {
    this.running || this.start();
    const t = this.nextToken++, i = {
      triggerTimeMsec: e.triggerTimeMsec,
      triggerFunc: e.triggerFunc,
      token: t
    }, s = this.events.findIndex((r) => r.triggerTimeMsec > i.triggerTimeMsec);
    s === -1 ? this.events.push(i) : this.events.splice(s, 0, i);
  }
  start() {
    this.running || (this.running = !0, this.t0 = performance.now(), this.loop(this.t0));
  }
  stop() {
    this.running && (this.running = !1, this.rafId !== null && (cancelAnimationFrame(this.rafId), this.rafId = null));
  }
}
class ia {
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
class sa {
  constructor(e, t) {
    this.prepared = !1, this.started = !1, this.terminated = !1, this.abortController = new AbortController(), this.boardView = t, this.node = e, this.scheduler = new Ss(this.abortController.signal);
  }
  async prepare() {
    let e = [];
    for (const t of this.node.cards)
      e.push(this.boardView.placeCardHidden(t));
    await Promise.all(e);
    for (const t of this.node.cards)
      this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: t.t_start,
          triggerFunc: () => {
            this.boardView.showCard(t.card_id);
          }
        }
      ), t.t_end !== null && this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: t.t_end,
          triggerFunc: () => {
            this.boardView.hideCard(t.card_id);
          }
        }
      );
    for (const t of this.node.sensors)
      this.boardView.placeSensorUnarmed(
        t,
        (i) => this.reportSensorFired(i)
      ), this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: t.t_armed,
          triggerFunc: () => {
            this.boardView.armSensor(t.sensor_id);
          }
        }
      );
    for (const t of this.node.effects) {
      const i = new ia(this.boardView);
      this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: t.t_start,
          triggerFunc: () => {
            i.start();
          }
        }
      ), t.t_end !== null && this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: t.t_end,
          triggerFunc: () => {
            i.stop();
          }
        }
      );
    }
    this.prepared = !0;
  }
  async run() {
    if (this.prepared || await this.prepare(), this.started)
      throw new Error("NodePlay already started");
    this.started = !0;
    const e = new Promise(
      (r, a) => this.resolvePlay = r
    ), t = performance.now();
    this.scheduler.start();
    const i = await e, s = performance.now();
    return {
      action: i,
      timestamp_start: Et(t),
      timestamp_end: Et(s)
    };
  }
  reportSensorFired(e) {
    if (this.terminated) return;
    this.terminated = !0, this.abortController.abort(), this.boardView.reset();
    let t = [];
    for (const a of this.node.outcomes)
      e.sensor_id === a.sensor_id && (t = a.cards);
    const i = new Ss(this.abortController.signal);
    let s = 0, r = [];
    for (const a of t)
      r.push(this.boardView.placeCardHidden(a));
    Promise.all(r).then(
      () => {
        for (const a of t)
          if (i.scheduleEvent(
            {
              triggerTimeMsec: a.t_start,
              triggerFunc: () => {
                this.boardView.showCard(a.card_id);
              }
            }
          ), a.t_end !== null)
            i.scheduleEvent(
              {
                triggerTimeMsec: a.t_end,
                triggerFunc: () => {
                  this.boardView.hideCard(a.card_id);
                }
              }
            ), a.t_end > s && (s = a.t_end);
          else
            throw new Error(`Consequence Cards must have an end time: ${a.card_id} `);
        i.scheduleEvent(
          {
            triggerTimeMsec: s,
            triggerFunc: () => {
              this.resolvePlay(e);
            }
          }
        ), i.start();
      }
    );
  }
}
class ra {
  constructor(e) {
    this.bufferedNodePlays = /* @__PURE__ */ new Map();
    const { shellUI: t, boardViewsUI: i } = na();
    this.shellUI = t, this.boardViewsUI = i, this._boardShape = e;
  }
  async prepare(e) {
    try {
      const t = crypto.randomUUID(), i = this.boardViewsUI.createBoardView(t, this._boardShape), s = new sa(
        e,
        i
      );
      return await s.prepare(), this.bufferedNodePlays.set(t, s), t;
    } catch (t) {
      throw this.showErrorMessageOverlay(t), new Error("NodePlayer preparation failed: " + t.message);
    }
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
function oa(n, e) {
  let t = 0, i = {};
  for (const r of e.nodes)
    i[r.node_id] = r.outcomes;
  n.sort((r, a) => r.timestamp_event.localeCompare(a.timestamp_event));
  let s = /* @__PURE__ */ new Set();
  for (let r = 0; r < n.length; r++) {
    const a = n[r];
    if (a.event_type !== "NodeResultEvent")
      continue;
    const c = a.event_payload, u = c.action.sensor_id;
    if (!s.has(c.node_id)) {
      s.add(c.node_id);
      for (const f of i[c.node_id] || [])
        if (f.sensor_id === u) {
          let O = parseFloat(f.bonus_amount_usd);
          !isNaN(O) && O > 0 && (t += O);
        }
    }
  }
  return t = Math.max(0, t), t = Math.round(t * 100) / 100, t;
}
function aa() {
  return {
    user_agent: navigator.userAgent,
    display_width_px: screen.width,
    display_height_px: screen.height,
    viewport_width_px: window.innerWidth,
    viewport_height_px: window.innerHeight
  };
}
var la = "2.0.4", Fi = 500, Ts = "user-agent", zt = "", As = "?", ti = "function", ut = "undefined", Ht = "object", Vi = "string", we = "browser", Ye = "cpu", Fe = "device", Pe = "engine", Ce = "os", Bt = "result", b = "name", p = "type", m = "vendor", x = "version", be = "architecture", yn = "major", g = "model", xn = "console", P = "mobile", G = "tablet", ie = "smarttv", He = "wearable", Gn = "xr", _n = "embedded", dn = "inapp", ts = "brands", kt = "formFactors", ns = "fullVersionList", Ut = "platform", is = "platformVersion", ai = "bitness", ht = "sec-ch-ua", ca = ht + "-full-version-list", ua = ht + "-arch", ha = ht + "-" + ai, da = ht + "-form-factors", pa = ht + "-" + P, fa = ht + "-" + g, rr = ht + "-" + Ut, ga = rr + "-version", or = [ts, ns, P, g, Ut, is, be, kt, ai], Wn = "Amazon", Dt = "Apple", Cs = "ASUS", Rs = "BlackBerry", _t = "Google", Os = "Huawei", Ei = "Lenovo", Ms = "Honor", qn = "LG", Si = "Microsoft", Ti = "Motorola", Ai = "Nvidia", Ls = "OnePlus", Ci = "OPPO", pn = "Samsung", Is = "Sharp", fn = "Sony", Ri = "Xiaomi", Oi = "Zebra", Ps = "Chrome", Ds = "Chromium", lt = "Chromecast", Kn = "Edge", gn = "Firefox", mn = "Opera", Mi = "Facebook", Ns = "Sogou", Nt = "Mobile ", wn = " Browser", ji = "Windows", ma = typeof window !== ut, xe = ma && window.navigator ? window.navigator : void 0, ct = xe && xe.userAgentData ? xe.userAgentData : void 0, wa = function(n, e) {
  var t = {}, i = e;
  if (!ni(e)) {
    i = {};
    for (var s in e)
      for (var r in e[s])
        i[r] = e[s][r].concat(i[r] ? i[r] : []);
  }
  for (var a in n)
    t[a] = i[a] && i[a].length % 2 === 0 ? i[a].concat(n[a]) : n[a];
  return t;
}, li = function(n) {
  for (var e = {}, t = 0; t < n.length; t++)
    e[n[t].toUpperCase()] = n[t];
  return e;
}, Gi = function(n, e) {
  if (typeof n === Ht && n.length > 0) {
    for (var t in n)
      if (Qe(e) == Qe(n[t])) return !0;
    return !1;
  }
  return Vt(n) ? Qe(e) == Qe(n) : !1;
}, ni = function(n, e) {
  for (var t in n)
    return /^(browser|cpu|device|engine|os)$/.test(t) || (e ? ni(n[t]) : !1);
}, Vt = function(n) {
  return typeof n === Vi;
}, Li = function(n) {
  if (n) {
    for (var e = [], t = $t(/\\?\"/g, n).split(","), i = 0; i < t.length; i++)
      if (t[i].indexOf(";") > -1) {
        var s = ii(t[i]).split(";v=");
        e[i] = { brand: s[0], version: s[1] };
      } else
        e[i] = ii(t[i]);
    return e;
  }
}, Qe = function(n) {
  return Vt(n) ? n.toLowerCase() : n;
}, Ii = function(n) {
  return Vt(n) ? $t(/[^\d\.]/g, n).split(".")[0] : void 0;
}, Je = function(n) {
  for (var e in n) {
    var t = n[e];
    typeof t == Ht && t.length == 2 ? this[t[0]] = t[1] : this[t] = void 0;
  }
  return this;
}, $t = function(n, e) {
  return Vt(e) ? e.replace(n, zt) : e;
}, bn = function(n) {
  return $t(/\\?\"/g, n);
}, ii = function(n, e) {
  if (Vt(n))
    return n = $t(/^\s\s*/, n), typeof e === ut ? n : n.substring(0, Fi);
}, Pi = function(n, e) {
  if (!(!n || !e))
    for (var t = 0, i, s, r, a, c, h; t < e.length && !c; ) {
      var u = e[t], f = e[t + 1];
      for (i = s = 0; i < u.length && !c && u[i]; )
        if (c = u[i++].exec(n), c)
          for (r = 0; r < f.length; r++)
            h = c[++s], a = f[r], typeof a === Ht && a.length > 0 ? a.length === 2 ? typeof a[1] == ti ? this[a[0]] = a[1].call(this, h) : this[a[0]] = a[1] : a.length >= 3 && (typeof a[1] === ti && !(a[1].exec && a[1].test) ? a.length > 3 ? this[a[0]] = h ? a[1].apply(this, a.slice(2)) : void 0 : this[a[0]] = h ? a[1].call(this, h, a[2]) : void 0 : a.length == 3 ? this[a[0]] = h ? h.replace(a[1], a[2]) : void 0 : a.length == 4 ? this[a[0]] = h ? a[3].call(this, h.replace(a[1], a[2])) : void 0 : a.length > 4 && (this[a[0]] = h ? a[3].apply(this, [h.replace(a[1], a[2])].concat(a.slice(4))) : void 0)) : this[a] = h || void 0;
      t += 2;
    }
}, $e = function(n, e) {
  for (var t in e)
    if (typeof e[t] === Ht && e[t].length > 0) {
      for (var i = 0; i < e[t].length; i++)
        if (Gi(e[t][i], n))
          return t === As ? void 0 : t;
    } else if (Gi(e[t], n))
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
}, ba = {
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
    [x, [b, Ns + " Explorer"]],
    [
      /(sogou)mo\w+\/([\d\.]+)/i
      // Sogou Mobile
    ],
    [[b, Ns + " Mobile"], x],
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
    [g, [m, pn], [p, P]],
    [
      // Apple
      /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i
      // iPod/iPhone
    ],
    [g, [m, Dt], [p, P]],
    [
      /\((ipad);[-\w\),; ]+apple/i,
      // iPad
      /applecoremedia\/[\w\.]+ \((ipad)/i,
      /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
    ],
    [g, [m, Dt], [p, G]],
    [
      /(macintosh);/i
    ],
    [g, [m, Dt]],
    [
      // Sharp
      /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
    ],
    [g, [m, Is], [p, P]],
    [
      // Honor
      /\b((?:brt|eln|hey2?|gdi|jdn)-a?[lnw]09|(?:ag[rm]3?|jdn2|kob2)-a?[lw]0[09]hn)(?: bui|\)|;)/i
    ],
    [g, [m, Ms], [p, G]],
    [
      /honor([-\w ]+)[;\)]/i
    ],
    [g, [m, Ms], [p, P]],
    [
      // Huawei
      /\b((?:ag[rs][2356]?k?|bah[234]?|bg[2o]|bt[kv]|cmr|cpn|db[ry]2?|jdn2|got|kob2?k?|mon|pce|scm|sht?|[tw]gr|vrd)-[ad]?[lw][0125][09]b?|605hw|bg2-u03|(?:gem|fdr|m2|ple|t1)-[7a]0[1-4][lu]|t1-a2[13][lw]|mediapad[\w\. ]*(?= bui|\)))\b(?!.+d\/s)/i
    ],
    [g, [m, Os], [p, G]],
    [
      /(?:huawei)([-\w ]+)[;\)]/i,
      /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
    ],
    [g, [m, Os], [p, P]],
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
    [[g, /_/g, " "], [m, Ri], [p, P]],
    [
      // OnePlus
      /droid.+; (cph2[3-6]\d[13579]|((gm|hd)19|(ac|be|in|kb)20|(d[en]|eb|le|mt)21|ne22)[0-2]\d|p[g-k]\w[1m]10)\b/i,
      /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
    ],
    [g, [m, Ls], [p, P]],
    [
      // OPPO
      /; (\w+) bui.+ oppo/i,
      /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
    ],
    [g, [m, Ci], [p, P]],
    [
      /\b(opd2(\d{3}a?))(?: bui|\))/i
    ],
    [g, [m, $e, { OnePlus: ["203", "304", "403", "404", "413", "415"], "*": Ci }], [p, G]],
    [
      // BLU
      /(vivo (5r?|6|8l?|go|one|s|x[il]?[2-4]?)[\w\+ ]*)(?: bui|\))/i
      // Vivo series
    ],
    [g, [m, "BLU"], [p, P]],
    [
      // Vivo
      /; vivo (\w+)(?: bui|\))/i,
      /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
    ],
    [g, [m, "Vivo"], [p, P]],
    [
      // Realme
      /\b(rmx[1-3]\d{3})(?: bui|;|\))/i
    ],
    [g, [m, "Realme"], [p, P]],
    [
      // Lenovo
      /(ideatab[-\w ]+|602lv|d-42a|a101lv|a2109a|a3500-hv|s[56]000|pb-6505[my]|tb-?x?\d{3,4}(?:f[cu]|xu|[av])|yt\d?-[jx]?\d+[lfmx])( bui|;|\)|\/)/i,
      /lenovo ?(b[68]0[08]0-?[hf]?|tab(?:[\w- ]+?)|tb[\w-]{6,7})( bui|;|\)|\/)/i
    ],
    [g, [m, Ei], [p, G]],
    [
      /lenovo[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i
    ],
    [g, [m, Ei], [p, P]],
    [
      // Motorola
      /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
      /\bmot(?:orola)?[- ]([\w\s]+)(\)| bui)/i,
      /((?:moto(?! 360)[-\w\(\) ]+|xt\d{3,4}[cgkosw\+]?[-\d]*|nexus 6)(?= bui|\)))/i
    ],
    [g, [m, Ti], [p, P]],
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
    [g, [m, qn], [p, P]],
    [
      // Nokia
      /(nokia) (t[12][01])/i
    ],
    [m, g, [p, G]],
    [
      /(?:maemo|nokia).*(n900|lumia \d+|rm-\d+)/i,
      /nokia[-_ ]?(([-\w\. ]*))/i
    ],
    [[g, /_/g, " "], [p, P], [m, "Nokia"]],
    [
      // Google
      /(pixel (c|tablet))\b/i
      // Google Pixel C/Tablet
    ],
    [g, [m, _t], [p, G]],
    [
      // Google Pixel
      /droid.+;(?: google)? (g(01[13]a|020[aem]|025[jn]|1b60|1f8f|2ybb|4s1m|576d|5nz6|8hhn|8vou|a02099|c15s|d1yq|e2ae|ec77|gh2x|kv4x|p4bc|pj41|r83y|tt9q|ur25|wvk6)|pixel[\d ]*a?( pro)?( xl)?( fold)?( \(5g\))?)( bui|\))/i
    ],
    [g, [m, _t], [p, P]],
    [
      /(google) (pixelbook( go)?)/i
    ],
    [m, g],
    [
      // Sony
      /droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-\w\w\d\d)(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
    ],
    [g, [m, fn], [p, P]],
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
    [[g, /(.+)/g, "Fire Phone $1"], [m, Wn], [p, P]],
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
    [g, [m, Rs], [p, P]],
    [
      // Asus
      /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
    ],
    [g, [m, Cs], [p, G]],
    [
      / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
    ],
    [g, [m, Cs], [p, P]],
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
    [m, [g, /_/g, " "], [p, P]],
    [
      // TCL
      /tcl (xess p17aa)/i,
      /droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])(_\w(\w|\w\w))?(\)| bui)/i
    ],
    [g, [m, "TCL"], [p, G]],
    [
      /droid [\w\.]+; (418(?:7d|8v)|5087z|5102l|61(?:02[dh]|25[adfh]|27[ai]|56[dh]|59k|65[ah])|a509dl|t(?:43(?:0w|1[adepqu])|50(?:6d|7[adju])|6(?:09dl|10k|12b|71[efho]|76[hjk])|7(?:66[ahju]|67[hw]|7[045][bh]|71[hk]|73o|76[ho]|79w|81[hks]?|82h|90[bhsy]|99b)|810[hs]))(_\w(\w|\w\w))?(\)| bui)/i
    ],
    [g, [m, "TCL"], [p, P]],
    [
      // itel
      /(itel) ((\w+))/i
    ],
    [[m, Qe], g, [p, $e, { tablet: ["p10001l", "w7001"], "*": "mobile" }]],
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
    [g, [m, "Meizu"], [p, P]],
    [
      // Ulefone
      /; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i
    ],
    [g, [m, "Ulefone"], [p, P]],
    [
      // Energizer
      /; (energy ?\w+)(?: bui|\))/i,
      /; energizer ([\w ]+)(?: bui|\))/i
    ],
    [g, [m, "Energizer"], [p, P]],
    [
      // Cat
      /; cat (b35);/i,
      /; (b15q?|s22 flip|s48c|s62 pro)(?: bui|\))/i
    ],
    [g, [m, "Cat"], [p, P]],
    [
      // Smartfren
      /((?:new )?andromax[\w- ]+)(?: bui|\))/i
    ],
    [g, [m, "Smartfren"], [p, P]],
    [
      // Nothing
      /droid.+; (a(in)?(0(15|59|6[35])|142)p?)/i
    ],
    [g, [m, "Nothing"], [p, P]],
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
    [g, [m, "Archos"], [p, P]],
    [
      // HMD
      /; (n159v)/i
    ],
    [g, [m, "HMD"], [p, P]],
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
    [m, g, [p, P]],
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
    [g, [m, "Fairphone"], [p, P]],
    [
      /((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i
      // Nvidia Tablets
    ],
    [g, [m, Ai], [p, G]],
    [
      /(sprint) (\w+)/i
      // Sprint Phones
    ],
    [m, g, [p, P]],
    [
      /(kin\.[onetw]{3})/i
      // Microsoft Kin
    ],
    [[g, /\./g, " "], [m, Si], [p, P]],
    [
      /droid.+; ([c6]+|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
      // Zebra
    ],
    [g, [m, Oi], [p, G]],
    [
      /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
    ],
    [g, [m, Oi], [p, P]],
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
    [m, [g, Dt + " TV"], [p, ie]],
    [
      /crkey.*devicetype\/chromecast/i
      // Google Chromecast Third Generation
    ],
    [[g, lt + " Third Generation"], [m, _t], [p, ie]],
    [
      /crkey.*devicetype\/([^/]*)/i
      // Google Chromecast with specific device type
    ],
    [[g, /^/, "Chromecast "], [m, _t], [p, ie]],
    [
      /fuchsia.*crkey/i
      // Google Chromecast Nest Hub
    ],
    [[g, lt + " Nest Hub"], [m, _t], [p, ie]],
    [
      /crkey/i
      // Google Chromecast, Linux-based or unknown
    ],
    [[g, lt], [m, _t], [p, ie]],
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
    [g, [m, Is], [p, ie]],
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
    [[m, /.+\/(\w+)/, "$1", $e, { LG: "lge" }], [g, ii], [p, ie]],
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
    [g, [m, pn], [p, He]],
    [
      /((pebble))app/i,
      // Pebble
      /(asus|google|lg|oppo) ((pixel |zen)?watch[\w ]*)( bui|\))/i
      // Asus ZenWatch / LG Watch / Pixel Watch
    ],
    [m, g, [p, He]],
    [
      /(ow(?:19|20)?we?[1-3]{1,3})/i
      // Oppo Watch
    ],
    [g, [m, Ci], [p, He]],
    [
      /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i
      // Apple Watch
    ],
    [g, [m, Dt], [p, He]],
    [
      /(opwwe\d{3})/i
      // OnePlus Watch
    ],
    [g, [m, Ls], [p, He]],
    [
      /(moto 360)/i
      // Motorola 360
    ],
    [g, [m, Ti], [p, He]],
    [
      /(smartwatch 3)/i
      // Sony SmartWatch
    ],
    [g, [m, fn], [p, He]],
    [
      /(g watch r)/i
      // LG G Watch R
    ],
    [g, [m, qn], [p, He]],
    [
      /droid.+; (wt63?0{2,3})\)/i
    ],
    [g, [m, Oi], [p, He]],
    [
      ///////////////////
      // XR
      ///////////////////
      /droid.+; (glass) \d/i
      // Google Glass
    ],
    [g, [m, _t], [p, Gn]],
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
    [m, [p, _n]],
    [
      /(aeobc)\b/i
      // Echo Dot
    ],
    [g, [m, Wn], [p, _n]],
    [
      /(homepod).+mac os/i
      // Apple HomePod
    ],
    [g, [m, Dt], [p, _n]],
    [
      /windows iot/i
      // Unidentifiable embedded device using Windows IoT
    ],
    [[p, _n]],
    [
      ////////////////////
      // MIXED (GENERIC)
      ///////////////////
      /droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+?(mobile|vr|\d) safari/i
    ],
    [g, [p, $e, { mobile: "Mobile", xr: "VR", "*": G }]],
    [
      /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i
      // Unidentifiable Tablet
    ],
    [[p, G]],
    [
      /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i
      // Unidentifiable Mobile
    ],
    [[p, P]],
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
    [[b, /N/, "R"], [x, $e, Bs]],
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
    [[x, /(;|\))/g, "", $e, Bs], [b, ji]],
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
    [x, [b, Rs]],
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
}, Xn = (function() {
  var n = { init: {}, isIgnore: {}, isIgnoreRgx: {}, toString: {} };
  return Je.call(n.init, [
    [we, [b, x, yn, p]],
    [Ye, [be]],
    [Fe, [p, g, m]],
    [Pe, [b, x]],
    [Ce, [b, x]]
  ]), Je.call(n.isIgnore, [
    [we, [x, yn]],
    [Pe, [x]],
    [Ce, [x]]
  ]), Je.call(n.isIgnoreRgx, [
    [we, / ?browser$/i],
    [Ce, / ?os$/i]
  ]), Je.call(n.toString, [
    [we, [b, x]],
    [Ye, [be]],
    [Fe, [m, g]],
    [Pe, [b, x]],
    [Ce, [b, x]]
  ]), n;
})(), xa = function(n, e) {
  var t = Xn.init[e], i = Xn.isIgnore[e] || 0, s = Xn.isIgnoreRgx[e] || 0, r = Xn.toString[e] || 0;
  function a() {
    Je.call(this, t);
  }
  return a.prototype.getItem = function() {
    return n;
  }, a.prototype.withClientHints = function() {
    return ct ? ct.getHighEntropyValues(or).then(function(c) {
      return n.setCH(new ar(c, !1)).parseCH().get();
    }) : n.parseCH().get();
  }, a.prototype.withFeatureCheck = function() {
    return n.detectFeature().get();
  }, e != Bt && (a.prototype.is = function(c) {
    var h = !1;
    for (var u in this)
      if (this.hasOwnProperty(u) && !Gi(i, u) && Qe(s ? $t(s, this[u]) : this[u]) == Qe(s ? $t(s, c) : c)) {
        if (h = !0, c != ut) break;
      } else if (c == ut && h) {
        h = !h;
        break;
      }
    return h;
  }, a.prototype.toString = function() {
    var c = zt;
    for (var h in r)
      typeof this[r[h]] !== ut && (c += (c ? " " : zt) + this[r[h]]);
    return c || ut;
  }), ct || (a.prototype.then = function(c) {
    var h = this, u = function() {
      for (var O in h)
        h.hasOwnProperty(O) && (this[O] = h[O]);
    };
    u.prototype = {
      is: a.prototype.is,
      toString: a.prototype.toString
    };
    var f = new u();
    return c(f), f;
  }), new a();
};
function ar(n, e) {
  if (n = n || {}, Je.call(this, or), e)
    Je.call(this, [
      [ts, Li(n[ht])],
      [ns, Li(n[ca])],
      [P, /\?1/.test(n[pa])],
      [g, bn(n[fa])],
      [Ut, bn(n[rr])],
      [is, bn(n[ga])],
      [be, bn(n[ua])],
      [kt, Li(n[da])],
      [ai, bn(n[ha])]
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
        case Fe:
          !this.get(p) && ct && ct[P] && this.set(p, P), this.get(g) == "Macintosh" && xe && typeof xe.standalone !== ut && xe.maxTouchPoints && xe.maxTouchPoints > 2 && this.set(g, "iPad").set(p, G);
          break;
        case Ce:
          !this.get(b) && ct && ct[Ut] && this.set(b, ct[Ut]);
          break;
        case Bt:
          var s = this.data, r = function(a) {
            return s[a].getItem().detectFeature().get();
          };
          this.set(we, r(we)).set(Ye, r(Ye)).set(Fe, r(Fe)).set(Pe, r(Pe)).set(Ce, r(Ce));
      }
    return this;
  }, this.parseUA = function() {
    return this.itemType != Bt && Pi.call(this.data, this.ua, this.rgxMap), this.itemType == we && this.set(yn, Ii(this.get(x))), this;
  }, this.parseCH = function() {
    var s = this.uaCH, r = this.rgxMap;
    switch (this.itemType) {
      case we:
      case Pe:
        var a = s[ns] || s[ts], c;
        if (a)
          for (var h in a) {
            var u = a[h].brand || a[h], f = a[h].version;
            this.itemType == we && !/not.a.brand/i.test(u) && (!c || /Chrom/.test(c) && u != Ds || c == Kn && /WebView2/.test(u)) && (u = $e(u, ba), c = this.get(b), c && !/Chrom/.test(c) && /Chrom/.test(u) || this.set(b, u).set(x, f).set(yn, Ii(f)), c = u), this.itemType == Pe && u == Ds && this.set(x, f);
          }
        break;
      case Ye:
        var O = s[be];
        O && (O && s[ai] == "64" && (O += "64"), Pi.call(this.data, O + ";", r));
        break;
      case Fe:
        if (s[P] && this.set(p, P), s[g] && (this.set(g, s[g]), !this.get(p) || !this.get(m))) {
          var y = {};
          Pi.call(y, "droid 9; " + s[g] + ")", r), !this.get(p) && y.type && this.set(p, y.type), !this.get(m) && y.vendor && this.set(m, y.vendor);
        }
        if (s[kt]) {
          var H;
          if (typeof s[kt] != "string")
            for (var D = 0; !H && D < s[kt].length; )
              H = $e(s[kt][D++], Us);
          else
            H = $e(s[kt], Us);
          this.set(p, H);
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
        var ye = this.data, le = function(me) {
          return ye[me].getItem().setCH(s).parseCH().get();
        };
        this.set(we, le(we)).set(Ye, le(Ye)).set(Fe, le(Fe)).set(Pe, le(Pe)).set(Ce, le(Ce));
    }
    return this;
  }, Je.call(this, [
    ["itemType", n],
    ["ua", e],
    ["uaCH", i],
    ["rgxMap", t],
    ["data", xa(this, n)]
  ]), this;
}
function et(n, e, t) {
  if (typeof n === Ht ? (ni(n, !0) ? (typeof e === Ht && (t = e), e = n) : (t = n, e = void 0), n = void 0) : typeof n === Vi && !ni(e, !0) && (t = e, e = void 0), t && typeof t.append === ti) {
    var i = {};
    t.forEach(function(h, u) {
      i[u] = h;
    }), t = i;
  }
  if (!(this instanceof et))
    return new et(n, e, t).getResult();
  var s = typeof n === Vi ? n : (
    // Passed user-agent string
    t && t[Ts] ? t[Ts] : (
      // User-Agent from passed headers
      xe && xe.userAgent ? xe.userAgent : (
        // navigator.userAgent
        zt
      )
    )
  ), r = new ar(t, !0), a = e ? wa(zs, e) : zs, c = function(h) {
    return h == Bt ? function() {
      return new Hs(h, s, a, r).set("ua", s).set(we, this.getBrowser()).set(Ye, this.getCPU()).set(Fe, this.getDevice()).set(Pe, this.getEngine()).set(Ce, this.getOS()).get();
    } : function() {
      return new Hs(h, s, a[h], r).parseUA().get();
    };
  };
  return Je.call(this, [
    ["getBrowser", c(we)],
    ["getCPU", c(Ye)],
    ["getDevice", c(Fe)],
    ["getEngine", c(Pe)],
    ["getOS", c(Ce)],
    ["getResult", c(Bt)],
    ["getUA", function() {
      return s;
    }],
    ["setUA", function(h) {
      return Vt(h) && (s = h.length > Fi ? ii(h, Fi) : h), this;
    }]
  ]).setUA(s), this;
}
et.VERSION = la;
et.BROWSER = li([b, x, yn, p]);
et.CPU = li([be]);
et.DEVICE = li([g, m, p, xn, P, ie, G, He, _n]);
et.ENGINE = et.OS = li([b, x]);
class _a {
  static isValidDevice() {
    return !new et().getDevice().type;
  }
}
function vt() {
  return crypto.randomUUID();
}
function yt() {
  return Et(performance.now());
}
async function ya(n, e, t = null, i = []) {
  t || (t = (M) => {
  });
  let s = i;
  const r = n.nodekit_version;
  let a = new ra(n.board);
  if (!_a.isValidDevice()) {
    const M = new Error("Unsupported device. Please use a desktop browser.");
    throw a.showErrorMessageOverlay(M), M;
  }
  a.showConnectingOverlay();
  for (const M of e)
    a.boardViewsUI.assetManager.registerAsset(M);
  a.hideConnectingOverlay(), await a.playStartScreen();
  const c = {
    event_id: vt(),
    timestamp_event: yt(),
    event_type: "StartEvent",
    event_payload: {},
    nodekit_version: r
  };
  s.push(c), t(c);
  function h() {
    if (document.visibilityState === "hidden") {
      const M = {
        event_id: vt(),
        timestamp_event: yt(),
        event_type: "LeaveEvent",
        event_payload: {},
        nodekit_version: r
      };
      s.push(M), t(M);
    } else if (document.visibilityState === "visible") {
      const M = {
        event_id: vt(),
        timestamp_event: yt(),
        event_type: "ReturnEvent",
        event_payload: {},
        nodekit_version: r
      };
      s.push(M), t(M);
    }
  }
  document.addEventListener("visibilitychange", h);
  const u = aa(), f = {
    event_id: vt(),
    timestamp_event: yt(),
    event_type: "BrowserContextEvent",
    event_payload: u,
    nodekit_version: r
  };
  s.push(f), t(f);
  const O = n.nodes;
  for (let M = 0; M < O.length; M++) {
    const ve = O[M], ye = await a.prepare(ve);
    let le = await a.play(ye);
    const me = {
      event_id: vt(),
      timestamp_event: yt(),
      event_type: "NodeResultEvent",
      event_payload: {
        node_id: ve.node_id,
        timestamp_node_start: le.timestamp_start,
        timestamp_node_end: le.timestamp_end,
        action: le.action
      },
      nodekit_version: r
    };
    s.push(me), t(me), a.setProgressBar((M + 1) / O.length * 100);
  }
  const y = oa(
    s,
    n
  );
  let H = "";
  if (y > 0 && (H = `Bonus: ${y} USD (pending validation)`), await a.playEndScreen(H), H !== "") {
    const M = {
      event_id: vt(),
      timestamp_event: yt(),
      event_type: "BonusDisclosureEvent",
      event_payload: {
        bonus_amount_usd: y.toFixed(2)
      },
      nodekit_version: r
    };
    s.push(M), t(M);
  }
  const D = {
    event_id: vt(),
    timestamp_event: yt(),
    event_type: "EndEvent",
    event_payload: {},
    nodekit_version: r
  };
  return s.push(D), t(D), document.removeEventListener("visibilitychange", h), a.showConsoleMessageOverlay(
    "Events",
    s
  ), s;
}
export {
  ya as play
};
