var pr = Object.defineProperty;
var fr = (n, e, t) => e in n ? pr(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var X = (n, e, t) => fr(n, typeof e != "symbol" ? e + "" : e, t);
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
class gr extends Re {
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
class mr extends Re {
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
class ni extends Re {
  constructor(e) {
    super(), this.root = document.createElement("div"), this.root.classList.add("overlay"), this.root.id = e;
  }
  setVisibility(e) {
    e ? this.root.classList.add("overlay--visible-state") : this.root.classList.remove("overlay--visible-state");
  }
}
class wr extends Re {
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
class br extends ni {
  constructor() {
    super("session-connecting-overlay"), this.displayTimeout = null;
    const e = document.createElement("div");
    e.classList.add("connecting-message-box"), this.root.appendChild(e), this.spinner = new wr(), this.spinner.mount(e);
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
function yr(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var wi, as;
function xr() {
  if (as) return wi;
  as = 1;
  function n(o) {
    return o instanceof Map ? o.clear = o.delete = o.set = function() {
      throw new Error("map is read-only");
    } : o instanceof Set && (o.add = o.clear = o.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(o), Object.getOwnPropertyNames(o).forEach((d) => {
      const _ = o[d], I = typeof _;
      (I === "object" || I === "function") && !Object.isFrozen(_) && n(_);
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
    const _ = /* @__PURE__ */ Object.create(null);
    for (const I in o)
      _[I] = o[I];
    return d.forEach(function(I) {
      for (const Q in I)
        _[Q] = I[Q];
    }), /** @type {T} */
    _;
  }
  const s = "</span>", r = (o) => !!o.scope, c = (o, { prefix: d }) => {
    if (o.startsWith("language:"))
      return o.replace("language:", "language-");
    if (o.includes(".")) {
      const _ = o.split(".");
      return [
        `${d}${_.shift()}`,
        ..._.map((I, Q) => `${I}${"_".repeat(Q + 1)}`)
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
    constructor(d, _) {
      this.buffer = "", this.classPrefix = _.classPrefix, d.walk(this);
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
      const _ = c(
        d.scope,
        { prefix: this.classPrefix }
      );
      this.span(_);
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
      const _ = h({ scope: d });
      this.add(_), this.stack.push(_);
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
    static _walk(d, _) {
      return typeof _ == "string" ? d.addText(_) : _.children && (d.openNode(_), _.children.forEach((I) => this._walk(d, I)), d.closeNode(_)), d;
    }
    /**
     * @param {Node} node
     */
    static _collapse(d) {
      typeof d != "string" && d.children && (d.children.every((_) => typeof _ == "string") ? d.children = [d.children.join("")] : d.children.forEach((_) => {
        u._collapse(_);
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
    __addSublanguage(d, _) {
      const I = d.root;
      _ && (I.scope = `language:${_}`), this.add(I);
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
  function k(o) {
    return M("(?=", o, ")");
  }
  function H(o) {
    return M("(?:", o, ")*");
  }
  function P(o) {
    return M("(?:", o, ")?");
  }
  function M(...o) {
    return o.map((_) => O(_)).join("");
  }
  function Se(o) {
    const d = o[o.length - 1];
    return typeof d == "object" && d.constructor === Object ? (o.splice(o.length - 1, 1), d) : {};
  }
  function xe(...o) {
    return "(" + (Se(o).capture ? "" : "?:") + o.map((I) => O(I)).join("|") + ")";
  }
  function ae(o) {
    return new RegExp(o.toString() + "|").exec("").length - 1;
  }
  function me(o, d) {
    const _ = o && o.exec(d);
    return _ && _.index === 0;
  }
  const te = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function Oe(o, { joinWith: d }) {
    let _ = 0;
    return o.map((I) => {
      _ += 1;
      const Q = _;
      let K = O(I), T = "";
      for (; K.length > 0; ) {
        const S = te.exec(K);
        if (!S) {
          T += K;
          break;
        }
        T += K.substring(0, S.index), K = K.substring(S.index + S[0].length), S[0][0] === "\\" && S[1] ? T += "\\" + String(Number(S[1]) + Q) : (T += S[0], S[0] === "(" && _++);
      }
      return T;
    }).map((I) => `(${I})`).join(d);
  }
  const Ve = /\b\B/, Pe = "[a-zA-Z]\\w*", Ft = "[a-zA-Z_]\\w*", kn = "\\b\\d+(\\.\\d+)?", vn = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", le = "\\b(0b[01]+)", Vt = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", jt = (o = {}) => {
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
      "on:begin": (_, I) => {
        _.index !== 0 && I.ignoreMatch();
      }
    }, o);
  }, je = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, li = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [je]
  }, ci = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [je]
  }, ui = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, dt = function(o, d, _ = {}) {
    const I = i(
      {
        scope: "comment",
        begin: o,
        end: d,
        contains: []
      },
      _
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
  }, hi = dt("//", "$"), En = dt("/\\*", "\\*/"), ne = dt("#", "$"), Sn = {
    scope: "number",
    begin: kn,
    relevance: 0
  }, se = {
    scope: "number",
    begin: vn,
    relevance: 0
  }, Tn = {
    scope: "number",
    begin: le,
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
  }, Gt = {
    scope: "title",
    begin: Ft,
    relevance: 0
  }, An = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + Ft,
    relevance: 0
  };
  var ft = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: li,
    BACKSLASH_ESCAPE: je,
    BINARY_NUMBER_MODE: Tn,
    BINARY_NUMBER_RE: le,
    COMMENT: dt,
    C_BLOCK_COMMENT_MODE: En,
    C_LINE_COMMENT_MODE: hi,
    C_NUMBER_MODE: se,
    C_NUMBER_RE: vn,
    END_SAME_AS_BEGIN: function(o) {
      return Object.assign(
        o,
        {
          /** @type {ModeCallback} */
          "on:begin": (d, _) => {
            _.data._beginMatch = d[1];
          },
          /** @type {ModeCallback} */
          "on:end": (d, _) => {
            _.data._beginMatch !== d[1] && _.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: ne,
    IDENT_RE: Pe,
    MATCH_NOTHING_RE: Ve,
    METHOD_GUARD: An,
    NUMBER_MODE: Sn,
    NUMBER_RE: kn,
    PHRASAL_WORDS_MODE: ui,
    QUOTE_STRING_MODE: ci,
    REGEXP_MODE: J,
    RE_STARTERS_RE: Vt,
    SHEBANG: jt,
    TITLE_MODE: pt,
    UNDERSCORE_IDENT_RE: Ft,
    UNDERSCORE_TITLE_MODE: Gt
  });
  function Cn(o, d) {
    o.input[o.index - 1] === "." && d.ignoreMatch();
  }
  function tt(o, d) {
    o.className !== void 0 && (o.scope = o.className, delete o.className);
  }
  function St(o, d) {
    d && o.beginKeywords && (o.begin = "\\b(" + o.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", o.__beforeBegin = Cn, o.keywords = o.keywords || o.beginKeywords, delete o.beginKeywords, o.relevance === void 0 && (o.relevance = 0));
  }
  function Ge(o, d) {
    Array.isArray(o.illegal) && (o.illegal = xe(...o.illegal));
  }
  function Wt(o, d) {
    if (o.match) {
      if (o.begin || o.end) throw new Error("begin & end are not supported with match");
      o.begin = o.match, delete o.match;
    }
  }
  function qt(o, d) {
    o.relevance === void 0 && (o.relevance = 1);
  }
  const nt = (o, d) => {
    if (!o.beforeMatch) return;
    if (o.starts) throw new Error("beforeMatch cannot be used with starts");
    const _ = Object.assign({}, o);
    Object.keys(o).forEach((I) => {
      delete o[I];
    }), o.keywords = _.keywords, o.begin = M(_.beforeMatch, k(_.begin)), o.starts = {
      relevance: 0,
      contains: [
        Object.assign(_, { endsParent: !0 })
      ]
    }, o.relevance = 0, delete _.beforeMatch;
  }, Tt = [
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
  ], At = "keyword";
  function Xt(o, d, _ = At) {
    const I = /* @__PURE__ */ Object.create(null);
    return typeof o == "string" ? Q(_, o.split(" ")) : Array.isArray(o) ? Q(_, o) : Object.keys(o).forEach(function(K) {
      Object.assign(
        I,
        Xt(o[K], d, K)
      );
    }), I;
    function Q(K, T) {
      d && (T = T.map((S) => S.toLowerCase())), T.forEach(function(S) {
        const L = S.split("|");
        I[L[0]] = [K, On(L[0], L[1])];
      });
    }
  }
  function On(o, d) {
    return d ? Number(d) : di(o) ? 0 : 1;
  }
  function di(o) {
    return Tt.includes(o.toLowerCase());
  }
  const Rt = {}, _e = (o) => {
    console.error(o);
  }, We = (o, ...d) => {
    console.log(`WARN: ${o}`, ...d);
  }, ke = (o, d) => {
    Rt[`${o}/${d}`] || (console.log(`Deprecated as of ${o}. ${d}`), Rt[`${o}/${d}`] = !0);
  }, gt = new Error();
  function Yt(o, d, { key: _ }) {
    let I = 0;
    const Q = o[_], K = {}, T = {};
    for (let S = 1; S <= d.length; S++)
      T[S + I] = Q[S], K[S + I] = !0, I += ae(d[S - 1]);
    o[_] = T, o[_]._emit = K, o[_]._multi = !0;
  }
  function Mn(o) {
    if (Array.isArray(o.begin)) {
      if (o.skip || o.excludeBegin || o.returnBegin)
        throw _e("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), gt;
      if (typeof o.beginScope != "object" || o.beginScope === null)
        throw _e("beginScope must be object"), gt;
      Yt(o, o.begin, { key: "beginScope" }), o.begin = Oe(o.begin, { joinWith: "" });
    }
  }
  function Zt(o) {
    if (Array.isArray(o.end)) {
      if (o.skip || o.excludeEnd || o.returnEnd)
        throw _e("skip, excludeEnd, returnEnd not compatible with endScope: {}"), gt;
      if (typeof o.endScope != "object" || o.endScope === null)
        throw _e("endScope must be object"), gt;
      Yt(o, o.end, { key: "endScope" }), o.end = Oe(o.end, { joinWith: "" });
    }
  }
  function Ln(o) {
    o.scope && typeof o.scope == "object" && o.scope !== null && (o.beginScope = o.scope, delete o.scope);
  }
  function Ct(o) {
    Ln(o), typeof o.beginScope == "string" && (o.beginScope = { _wrap: o.beginScope }), typeof o.endScope == "string" && (o.endScope = { _wrap: o.endScope }), Mn(o), Zt(o);
  }
  function Ot(o) {
    function d(T, S) {
      return new RegExp(
        O(T),
        "m" + (o.case_insensitive ? "i" : "") + (o.unicodeRegex ? "u" : "") + (S ? "g" : "")
      );
    }
    class _ {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(S, L) {
        L.position = this.position++, this.matchIndexes[this.matchAt] = L, this.regexes.push([L, S]), this.matchAt += ae(S) + 1;
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
        const F = L.findIndex((ot, Mt) => Mt > 0 && ot !== void 0), W = this.matchIndexes[F];
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
        const L = new _();
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
        Wt,
        Ct,
        nt
      ].forEach((W) => W(T, S)), o.compilerExtensions.forEach((W) => W(T, S)), T.__beforeBegin = null, [
        St,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        Ge,
        // default to 1 relevance if not specified
        qt
      ].forEach((W) => W(T, S)), T.isCompiled = !0;
      let F = null;
      return typeof T.keywords == "object" && T.keywords.$pattern && (T.keywords = Object.assign({}, T.keywords), F = T.keywords.$pattern, delete T.keywords.$pattern), F = F || /\w+/, T.keywords && (T.keywords = Xt(T.keywords, o.case_insensitive)), L.keywordPatternRe = d(F, !0), S && (T.begin || (T.begin = /\B|\b/), L.beginRe = d(L.begin), !T.end && !T.endsWithParent && (T.end = /\B|\b/), T.end && (L.endRe = d(L.end)), L.terminatorEnd = O(L.end) || "", T.endsWithParent && S.terminatorEnd && (L.terminatorEnd += (T.end ? "|" : "") + S.terminatorEnd)), T.illegal && (L.illegalRe = d(
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
  var Kt = "11.11.1";
  class Qt extends Error {
    constructor(d, _) {
      super(d), this.name = "HTMLInjectionError", this.html = _;
    }
  }
  const Jt = t, mt = i, wt = Symbol("nomatch"), pi = 7, st = function(o) {
    const d = /* @__PURE__ */ Object.create(null), _ = /* @__PURE__ */ Object.create(null), I = [];
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
      Ne("before:highlight", Le);
      const at = Le.result ? Le.result : ot(Le.language, Le.code, U);
      return at.code = Le.code, Ne("after:highlight", at), at;
    }
    function ot(w, R, U, Y) {
      const oe = /* @__PURE__ */ Object.create(null);
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
            const [qe, hr] = he;
            if (ce.addText(B), B = "", oe[V] = (oe[V] || 0) + 1, oe[V] <= pi && (zn += hr), qe.startsWith("_"))
              B += C[0];
            else {
              const dr = Ue.classNameAliases[qe] || qe;
              Be(C[0], dr);
            }
          } else
            B += C[0];
          v = N.keywordPatternRe.lastIndex, C = N.keywordPatternRe.exec(Z);
        }
        B += Z.substring(v), ce.addText(B);
      }
      function Bn() {
        if (Z === "") return;
        let v = null;
        if (typeof N.subLanguage == "string") {
          if (!d[N.subLanguage]) {
            ce.addText(Z);
            return;
          }
          v = ot(N.subLanguage, Z, !0, os[N.subLanguage]), os[N.subLanguage] = /** @type {CompiledMode} */
          v._top;
        } else
          v = bt(Z, N.subLanguage.length ? N.subLanguage : null);
        N.relevance > 0 && (zn += v.relevance), ce.__addSublanguage(v._emitter, v.language);
      }
      function Ee() {
        N.subLanguage != null ? Bn() : at(), Z = "";
      }
      function Be(v, C) {
        v !== "" && (ce.startScope(C), ce.addText(v), ce.endScope());
      }
      function ns(v, C) {
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
      function is(v, C) {
        return v.scope && typeof v.scope == "string" && ce.openNode(Ue.classNameAliases[v.scope] || v.scope), v.beginScope && (v.beginScope._wrap ? (Be(Z, Ue.classNameAliases[v.beginScope._wrap] || v.beginScope._wrap), Z = "") : v.beginScope._multi && (ns(v.beginScope, C), Z = "")), N = Object.create(v, { parent: { value: N } }), N;
      }
      function ss(v, C, B) {
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
          return ss(v.parent, C, B);
      }
      function or(v) {
        return N.matcher.regexIndex === 0 ? (Z += v[0], 1) : (mi = !0, 0);
      }
      function ar(v) {
        const C = v[0], B = v.rule, V = new e(B), he = [B.__beforeBegin, B["on:begin"]];
        for (const qe of he)
          if (qe && (qe(v, V), V.isMatchIgnored))
            return or(C);
        return B.skip ? Z += C : (B.excludeBegin && (Z += C), Ee(), !B.returnBegin && !B.excludeBegin && (Z = C)), is(B, v), B.returnBegin ? 0 : C.length;
      }
      function lr(v) {
        const C = v[0], B = R.substring(v.index), V = ss(N, v, B);
        if (!V)
          return wt;
        const he = N;
        N.endScope && N.endScope._wrap ? (Ee(), Be(C, N.endScope._wrap)) : N.endScope && N.endScope._multi ? (Ee(), ns(N.endScope, v)) : he.skip ? Z += C : (he.returnEnd || he.excludeEnd || (Z += C), Ee(), he.excludeEnd && (Z = C));
        do
          N.scope && ce.closeNode(), !N.skip && !N.subLanguage && (zn += N.relevance), N = N.parent;
        while (N !== V.parent);
        return V.starts && is(V.starts, v), he.returnEnd ? 0 : C.length;
      }
      function cr() {
        const v = [];
        for (let C = N; C !== Ue; C = C.parent)
          C.scope && v.unshift(C.scope);
        v.forEach((C) => ce.openNode(C));
      }
      let Un = {};
      function rs(v, C) {
        const B = C && C[0];
        if (Z += v, B == null)
          return Ee(), 0;
        if (Un.type === "begin" && C.type === "end" && Un.index === C.index && B === "") {
          if (Z += R.slice(C.index, C.index + 1), !Q) {
            const V = new Error(`0 width match regex (${w})`);
            throw V.languageName = w, V.badRule = Un.rule, V;
          }
          return 1;
        }
        if (Un = C, C.type === "begin")
          return ar(C);
        if (C.type === "illegal" && !U) {
          const V = new Error('Illegal lexeme "' + B + '" for mode "' + (N.scope || "<unnamed>") + '"');
          throw V.mode = N, V;
        } else if (C.type === "end") {
          const V = lr(C);
          if (V !== wt)
            return V;
        }
        if (C.type === "illegal" && B === "")
          return Z += `
`, 1;
        if (gi > 1e5 && gi > C.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return Z += B, B.length;
      }
      const Ue = E(w);
      if (!Ue)
        throw _e(K.replace("{}", w)), new Error('Unknown language: "' + w + '"');
      const ur = Ot(Ue);
      let fi = "", N = Y || ur;
      const os = {}, ce = new S.__emitter(S);
      cr();
      let Z = "", zn = 0, yt = 0, gi = 0, mi = !1;
      try {
        if (Ue.__emitTokens)
          Ue.__emitTokens(R, ce);
        else {
          for (N.matcher.considerAll(); ; ) {
            gi++, mi ? mi = !1 : N.matcher.considerAll(), N.matcher.lastIndex = yt;
            const v = N.matcher.exec(R);
            if (!v) break;
            const C = R.substring(yt, v.index), B = rs(C, v);
            yt = v.index + B;
          }
          rs(R.substring(yt));
        }
        return ce.finalize(), fi = ce.toHTML(), {
          language: w,
          value: fi,
          relevance: zn,
          illegal: !1,
          _emitter: ce,
          _top: N
        };
      } catch (v) {
        if (v.message && v.message.includes("Illegal"))
          return {
            language: w,
            value: Jt(R),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: v.message,
              index: yt,
              context: R.slice(yt - 100, yt + 100),
              mode: v.mode,
              resultSoFar: fi
            },
            _emitter: ce
          };
        if (Q)
          return {
            language: w,
            value: Jt(R),
            illegal: !1,
            relevance: 0,
            errorRaised: v,
            _emitter: ce,
            _top: N
          };
        throw v;
      }
    }
    function Mt(w) {
      const R = {
        value: Jt(w),
        illegal: !1,
        relevance: 0,
        _top: T,
        _emitter: new S.__emitter(S)
      };
      return R._emitter.addText(w), R;
    }
    function bt(w, R) {
      R = R || S.languages || Object.keys(d);
      const U = Mt(w), Y = R.filter(E).filter(re).map(
        (Ee) => ot(Ee, w, !1)
      );
      Y.unshift(U);
      const oe = Y.sort((Ee, Be) => {
        if (Ee.relevance !== Be.relevance) return Be.relevance - Ee.relevance;
        if (Ee.language && Be.language) {
          if (E(Ee.language).supersetOf === Be.language)
            return 1;
          if (E(Be.language).supersetOf === Ee.language)
            return -1;
        }
        return 0;
      }), [Le, at] = oe, Bn = Le;
      return Bn.secondBest = at, Bn;
    }
    function In(w, R, U) {
      const Y = R && _[R] || U;
      w.classList.add("hljs"), w.classList.add(`language-${Y}`);
    }
    function ve(w) {
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
        throw new Qt(
          "One of your code blocks includes unescaped HTML.",
          w.innerHTML
        );
      R = w;
      const Y = R.textContent, oe = U ? W(Y, { language: U, ignoreIllegals: !0 }) : bt(Y);
      w.innerHTML = oe.value, w.dataset.highlighted = "yes", In(w, U, oe.language), w.result = {
        language: oe.language,
        // TODO: remove with version 11.0
        re: oe.relevance,
        relevance: oe.relevance
      }, oe.secondBest && (w.secondBest = {
        language: oe.secondBest.language,
        relevance: oe.secondBest.relevance
      }), Ne("after:highlightElement", { el: w, result: oe, text: Y });
    }
    function Dn(w) {
      S = mt(S, w);
    }
    const Pn = () => {
      Lt(), ke("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Nn() {
      Lt(), ke("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let en = !1;
    function Lt() {
      function w() {
        Lt();
      }
      if (document.readyState === "loading") {
        en || window.addEventListener("DOMContentLoaded", w, !1), en = !0;
        return;
      }
      document.querySelectorAll(S.cssSelector).forEach(ve);
    }
    function A(w, R) {
      let U = null;
      try {
        U = R(o);
      } catch (Y) {
        if (_e("Language definition for '{}' could not be registered.".replace("{}", w)), Q)
          _e(Y);
        else
          throw Y;
        U = T;
      }
      U.name || (U.name = w), d[w] = U, U.rawDefinition = R.bind(null, o), U.aliases && q(U.aliases, { languageName: w });
    }
    function l(w) {
      delete d[w];
      for (const R of Object.keys(_))
        _[R] === w && delete _[R];
    }
    function x() {
      return Object.keys(d);
    }
    function E(w) {
      return w = (w || "").toLowerCase(), d[w] || d[_[w]];
    }
    function q(w, { languageName: R }) {
      typeof w == "string" && (w = [w]), w.forEach((U) => {
        _[U.toLowerCase()] = R;
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
    function Ne(w, R) {
      const U = w;
      I.forEach(function(Y) {
        Y[U] && Y[U](R);
      });
    }
    function tn(w) {
      return ke("10.7.0", "highlightBlock will be removed entirely in v12.0"), ke("10.7.0", "Please use highlightElement now."), ve(w);
    }
    Object.assign(o, {
      highlight: W,
      highlightAuto: bt,
      highlightAll: Lt,
      highlightElement: ve,
      // TODO: Remove with v12 API
      highlightBlock: tn,
      configure: Dn,
      initHighlighting: Pn,
      initHighlightingOnLoad: Nn,
      registerLanguage: A,
      unregisterLanguage: l,
      listLanguages: x,
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
    }, o.versionString = Kt, o.regex = {
      concat: M,
      lookahead: k,
      either: xe,
      optional: P,
      anyNumberOfTimes: H
    };
    for (const w in ft)
      typeof ft[w] == "object" && n(ft[w]);
    return Object.assign(o, ft), o;
  }, rt = st({});
  return rt.newInstance = () => st({}), wi = rt, rt.HighlightJS = rt, rt.default = rt, wi;
}
var _r = /* @__PURE__ */ xr();
const Hs = /* @__PURE__ */ yr(_r);
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
class vr extends Re {
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
class Er extends ni {
  constructor() {
    super("console-message-overlay");
    const e = document.createElement("div");
    e.classList.add("console-title-box"), this.root.appendChild(e), this.titleTextDiv = document.createElement("div"), this.titleTextDiv.classList.add("console-title-box__text"), e.appendChild(this.titleTextDiv), this.jsonViewer = new vr(), this.jsonViewer.mount(this.root);
    const t = new Sr();
    t.setCopyTarget(this.jsonViewer.root), t.mount(e);
  }
  displayMessage(e, t) {
    this.titleTextDiv.innerHTML = e, this.jsonViewer.displayAsJson(t), super.setVisibility(!0);
  }
  hide() {
    this.titleTextDiv.innerHTML = "", this.jsonViewer.clear(), super.setVisibility(!1);
  }
}
class Sr extends Re {
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
class Tr extends ni {
  constructor() {
    super("session-finished-overlay"), this.submitButton = new Ar(), this.submitButton.mount(this.root), this.messageBox = document.createElement("div"), this.messageBox.classList.add("debrief-message-box"), this.root.appendChild(this.messageBox), this.messageSpan = document.createElement("span"), this.messageSpan.classList.add("debrief-message-box__text"), this.messageBox.appendChild(this.messageSpan);
  }
  show(e, t) {
    e.length == 0 ? this.messageBox.style.visibility = "hidden" : this.messageBox.style.visibility = "visible", this.messageSpan.textContent = e, this.submitButton.attachClickListener(t), this.setVisibility(!0);
  }
  hide() {
    this.messageSpan.textContent = "", super.setVisibility(!1), this.submitButton.removeAllEventListeners();
  }
}
class Ar extends Re {
  constructor() {
    super();
    const e = document.createElement("button");
    e.classList.add("submit-button"), e.textContent = "Press to Submit", this.root = e;
  }
  attachClickListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class Rr extends ni {
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
class Cr extends Re {
  constructor() {
    super();
    const e = document.createElement("button");
    e.classList.add("start-button"), e.textContent = "Press to Start", this.root = e;
  }
  attachClickListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class Or extends Re {
  constructor() {
    super(), this.root = document.createElement("div"), this.root.className = "shell-ui", this.progressBar = new mr("cognition"), this.progressBar.mount(this.root), this.statusDot = new gr(), this.statusDot.mount(this.root), this.sessionConnectingOverlay = new br(), this.sessionConnectingOverlay.mount(this.root), this.overlayConsoleMessage = new Er(), this.overlayConsoleMessage.mount(this.root), this.sessionFinishedOverlay = new Tr(), this.sessionFinishedOverlay.mount(this.root), this.sessionStartedOverlay = new Rr(), this.sessionStartedOverlay.mount(this.root);
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
var Et = ji();
function $s(n) {
  Et = n;
}
var yn = { exec: () => null };
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
}, Mr = /^(?:[ \t]*(?:\n|$))+/, Lr = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Ir = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, _n = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Dr = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Gi = /(?:[*+-]|\d{1,9}[.)])/, Fs = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Vs = $(Fs).replace(/bull/g, Gi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Pr = $(Fs).replace(/bull/g, Gi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Wi = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Nr = /^[^\n]+/, qi = /(?!\s*\])(?:\\.|[^\[\]\\])+/, Br = $(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", qi).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Ur = $(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Gi).getRegex(), ii = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Xi = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, zr = $(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", Xi).replace("tag", ii).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), js = $(Wi).replace("hr", _n).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ii).getRegex(), Hr = $(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", js).getRegex(), Yi = {
  blockquote: Hr,
  code: Lr,
  def: Br,
  fences: Ir,
  heading: Dr,
  hr: _n,
  html: zr,
  lheading: Vs,
  list: Ur,
  newline: Mr,
  paragraph: js,
  table: yn,
  text: Nr
}, ls = $(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", _n).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ii).getRegex(), $r = {
  ...Yi,
  lheading: Pr,
  table: ls,
  paragraph: $(Wi).replace("hr", _n).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", ls).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ii).getRegex()
}, Fr = {
  ...Yi,
  html: $(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", Xi).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: yn,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: $(Wi).replace("hr", _n).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Vs).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, Vr = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, jr = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Gs = /^( {2,}|\\)\n(?!\s*$)/, Gr = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, si = /[\p{P}\p{S}]/u, Zi = /[\s\p{P}\p{S}]/u, Ws = /[^\s\p{P}\p{S}]/u, Wr = $(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Zi).getRegex(), qs = /(?!~)[\p{P}\p{S}]/u, qr = /(?!~)[\s\p{P}\p{S}]/u, Xr = /(?:[^\s\p{P}\p{S}]|~)/u, Yr = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, Xs = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Zr = $(Xs, "u").replace(/punct/g, si).getRegex(), Kr = $(Xs, "u").replace(/punct/g, qs).getRegex(), Ys = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Qr = $(Ys, "gu").replace(/notPunctSpace/g, Ws).replace(/punctSpace/g, Zi).replace(/punct/g, si).getRegex(), Jr = $(Ys, "gu").replace(/notPunctSpace/g, Xr).replace(/punctSpace/g, qr).replace(/punct/g, qs).getRegex(), eo = $(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, Ws).replace(/punctSpace/g, Zi).replace(/punct/g, si).getRegex(), to = $(/\\(punct)/, "gu").replace(/punct/g, si).getRegex(), no = $(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), io = $(Xi).replace("(?:-->|$)", "-->").getRegex(), so = $(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", io).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Zn = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, ro = $(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", Zn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Zs = $(/^!?\[(label)\]\[(ref)\]/).replace("label", Zn).replace("ref", qi).getRegex(), Ks = $(/^!?\[(ref)\](?:\[\])?/).replace("ref", qi).getRegex(), oo = $("reflink|nolink(?!\\()", "g").replace("reflink", Zs).replace("nolink", Ks).getRegex(), Ki = {
  _backpedal: yn,
  // only used for GFM url
  anyPunctuation: to,
  autolink: no,
  blockSkip: Yr,
  br: Gs,
  code: jr,
  del: yn,
  emStrongLDelim: Zr,
  emStrongRDelimAst: Qr,
  emStrongRDelimUnd: eo,
  escape: Vr,
  link: ro,
  nolink: Ks,
  punctuation: Wr,
  reflink: Zs,
  reflinkSearch: oo,
  tag: so,
  text: Gr,
  url: yn
}, ao = {
  ...Ki,
  link: $(/^!?\[(label)\]\((.*?)\)/).replace("label", Zn).getRegex(),
  reflink: $(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Zn).getRegex()
}, Pi = {
  ...Ki,
  emStrongRDelimAst: Jr,
  emStrongLDelim: Kr,
  url: $(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, lo = {
  ...Pi,
  br: $(Gs).replace("{2,}", "*").getRegex(),
  text: $(Pi.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Hn = {
  normal: Yi,
  gfm: $r,
  pedantic: Fr
}, nn = {
  normal: Ki,
  gfm: Pi,
  breaks: lo,
  pedantic: ao
}, co = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, cs = (n) => co[n];
function ze(n, e) {
  if (e) {
    if (pe.escapeTest.test(n))
      return n.replace(pe.escapeReplace, cs);
  } else if (pe.escapeTestNoEncode.test(n))
    return n.replace(pe.escapeReplaceNoEncode, cs);
  return n;
}
function us(n) {
  try {
    n = encodeURI(n).replace(pe.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function hs(n, e) {
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
function sn(n, e, t) {
  const i = n.length;
  if (i === 0)
    return "";
  let s = 0;
  for (; s < i && n.charAt(i - s - 1) === e; )
    s++;
  return n.slice(0, i - s);
}
function uo(n, e) {
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
function ds(n, e, t, i, s) {
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
function ho(n, e, t) {
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
var Kn = class {
  // set by the lexer
  constructor(n) {
    X(this, "options");
    X(this, "rules");
    // set by the lexer
    X(this, "lexer");
    this.options = n || Et;
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
        text: this.options.pedantic ? t : sn(t, `
`)
      };
    }
  }
  fences(n) {
    const e = this.rules.block.fences.exec(n);
    if (e) {
      const t = e[0], i = ho(t, e[3] || "", this.rules);
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
        const i = sn(t, "#");
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
        raw: sn(e[0], `
`)
      };
  }
  blockquote(n) {
    const e = this.rules.block.blockquote.exec(n);
    if (e) {
      let t = sn(e[0], `
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
        const k = r.at(-1);
        if ((k == null ? void 0 : k.type) === "code")
          break;
        if ((k == null ? void 0 : k.type) === "blockquote") {
          const H = k, P = H.raw + `
` + t.join(`
`), M = this.blockquote(P);
          r[r.length - 1] = M, i = i.substring(0, i.length - H.raw.length) + M.raw, s = s.substring(0, s.length - H.text.length) + M.text;
          break;
        } else if ((k == null ? void 0 : k.type) === "list") {
          const H = k, P = H.raw + `
` + t.join(`
`), M = this.list(P);
          r[r.length - 1] = M, i = i.substring(0, i.length - k.raw.length) + M.raw, s = s.substring(0, s.length - H.raw.length) + M.raw, t = P.substring(r.at(-1).raw.length).split(`
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
`, 1)[0].replace(this.rules.other.listReplaceTabs, (xe) => " ".repeat(3 * xe.length)), k = n.split(`
`, 1)[0], H = !O.trim(), P = 0;
        if (this.options.pedantic ? (P = 2, p = O.trimStart()) : H ? P = e[1].length + 1 : (P = e[2].search(this.rules.other.nonSpaceChar), P = P > 4 ? 1 : P, p = O.slice(P), P += e[1].length), H && this.rules.other.blankLine.test(k) && (u += k + `
`, n = n.substring(k.length + 1), h = !0), !h) {
          const xe = this.rules.other.nextBulletRegex(P), ae = this.rules.other.hrRegex(P), me = this.rules.other.fencesBeginRegex(P), te = this.rules.other.headingBeginRegex(P), Oe = this.rules.other.htmlBeginRegex(P);
          for (; n; ) {
            const Ve = n.split(`
`, 1)[0];
            let Pe;
            if (k = Ve, this.options.pedantic ? (k = k.replace(this.rules.other.listReplaceNesting, "  "), Pe = k) : Pe = k.replace(this.rules.other.tabCharGlobal, "    "), me.test(k) || te.test(k) || Oe.test(k) || xe.test(k) || ae.test(k))
              break;
            if (Pe.search(this.rules.other.nonSpaceChar) >= P || !k.trim())
              p += `
` + Pe.slice(P);
            else {
              if (H || O.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || me.test(O) || te.test(O) || ae.test(O))
                break;
              p += `
` + k;
            }
            !H && !k.trim() && (H = !0), u += Ve + `
`, n = n.substring(Ve.length + 1), O = Pe.slice(P);
          }
        }
        s.loose || (c ? s.loose = !0 : this.rules.other.doubleBlankLine.test(u) && (c = !0));
        let M = null, Se;
        this.options.gfm && (M = this.rules.other.listIsTask.exec(p), M && (Se = M[0] !== "[ ] ", p = p.replace(this.rules.other.listReplaceTask, ""))), s.items.push({
          type: "list_item",
          raw: u,
          task: !!M,
          checked: Se,
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
    const t = hs(e[1]), i = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = (c = e[3]) != null && c.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
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
        r.rows.push(hs(a, r.header.length).map((h, u) => ({
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
        const r = sn(t.slice(0, -1), "\\");
        if ((t.length - r.length) % 2 === 0)
          return;
      } else {
        const r = uo(e[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(t) ? i = i.slice(1) : i = i.slice(1, -1)), ds(e, {
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
      return ds(t, s, t[0], this.lexer, this.rules);
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
        const O = [...i[0]][0].length, k = n.slice(0, r + i.index + O + a);
        if (Math.min(r, a) % 2) {
          const P = k.slice(1, -1);
          return {
            type: "em",
            raw: k,
            text: P,
            tokens: this.lexer.inlineTokens(P)
          };
        }
        const H = k.slice(2, -2);
        return {
          type: "strong",
          raw: k,
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
}, Ze = class Ni {
  constructor(e) {
    X(this, "tokens");
    X(this, "options");
    X(this, "state");
    X(this, "tokenizer");
    X(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Et, this.options.tokenizer = this.options.tokenizer || new Kn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const t = {
      other: pe,
      block: Hn.normal,
      inline: nn.normal
    };
    this.options.pedantic ? (t.block = Hn.pedantic, t.inline = nn.pedantic) : this.options.gfm && (t.block = Hn.gfm, this.options.breaks ? t.inline = nn.breaks : t.inline = nn.gfm), this.tokenizer.rules = t;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: Hn,
      inline: nn
    };
  }
  /**
   * Static Lex Method
   */
  static lex(e, t) {
    return new Ni(t).lex(e);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(e, t) {
    return new Ni(t).inlineTokens(e);
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
        this.options.extensions.startBlock.forEach((k) => {
          O = k.call({ lexer: this }, p), typeof O == "number" && O >= 0 && (u = Math.min(u, O));
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
      if ((h = (a = this.options.extensions) == null ? void 0 : a.inline) != null && h.some((k) => (p = k.call({ lexer: this }, e, t)) ? (e = e.substring(p.raw.length), t.push(p), !0) : !1))
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
        const k = t.at(-1);
        p.type === "text" && (k == null ? void 0 : k.type) === "text" ? (k.raw += p.raw, k.text += p.text) : t.push(p);
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
        let k = 1 / 0;
        const H = e.slice(1);
        let P;
        this.options.extensions.startInline.forEach((M) => {
          P = M.call({ lexer: this }, H), typeof P == "number" && P >= 0 && (k = Math.min(k, P));
        }), k < 1 / 0 && k >= 0 && (O = e.substring(0, k + 1));
      }
      if (p = this.tokenizer.inlineText(O)) {
        e = e.substring(p.raw.length), p.raw.slice(-1) !== "_" && (c = p.raw.slice(-1)), r = !0;
        const k = t.at(-1);
        (k == null ? void 0 : k.type) === "text" ? (k.raw += p.raw, k.text += p.text) : t.push(p);
        continue;
      }
      if (e) {
        const k = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(k);
          break;
        } else
          throw new Error(k);
      }
    }
    return t;
  }
}, Qn = class {
  // set by the parser
  constructor(n) {
    X(this, "options");
    X(this, "parser");
    this.options = n || Et;
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
    const i = this.parser.parseInline(t), s = us(n);
    if (s === null)
      return i;
    n = s;
    let r = '<a href="' + n + '"';
    return e && (r += ' title="' + ze(e) + '"'), r += ">" + i + "</a>", r;
  }
  image({ href: n, title: e, text: t, tokens: i }) {
    i && (t = this.parser.parseInline(i, this.parser.textRenderer));
    const s = us(n);
    if (s === null)
      return ze(t);
    n = s;
    let r = `<img src="${n}" alt="${t}"`;
    return e && (r += ` title="${ze(e)}"`), r += ">", r;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : ze(n.text);
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
}, Ke = class Bi {
  constructor(e) {
    X(this, "options");
    X(this, "renderer");
    X(this, "textRenderer");
    this.options = e || Et, this.options.renderer = this.options.renderer || new Qn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Qi();
  }
  /**
   * Static Parse Method
   */
  static parse(e, t) {
    return new Bi(t).parse(e);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(e, t) {
    return new Bi(t).parseInline(e);
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
}, Di, qn = (Di = class {
  constructor(n) {
    X(this, "options");
    X(this, "block");
    this.options = n || Et;
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
])), Di), po = class {
  constructor(...n) {
    X(this, "defaults", ji());
    X(this, "options", this.setOptions);
    X(this, "parse", this.parseMarkdown(!0));
    X(this, "parseInline", this.parseMarkdown(!1));
    X(this, "Parser", Ke);
    X(this, "Renderer", Qn);
    X(this, "TextRenderer", Qi);
    X(this, "Lexer", Ze);
    X(this, "Tokenizer", Kn);
    X(this, "Hooks", qn);
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
        const s = this.defaults.renderer || new Qn(this.defaults);
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
        const s = this.defaults.tokenizer || new Kn(this.defaults);
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
        const s = this.defaults.hooks || new qn();
        for (const r in t.hooks) {
          if (!(r in s))
            throw new Error(`hook '${r}' does not exist`);
          if (["options", "block"].includes(r))
            continue;
          const c = r, a = t.hooks[c], h = s[c];
          qn.passThroughHooks.has(r) ? s[c] = (u) => {
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
}, vt = new po();
function j(n, e) {
  return vt.parse(n, e);
}
j.options = j.setOptions = function(n) {
  return vt.setOptions(n), j.defaults = vt.defaults, $s(j.defaults), j;
};
j.getDefaults = ji;
j.defaults = Et;
j.use = function(...n) {
  return vt.use(...n), j.defaults = vt.defaults, $s(j.defaults), j;
};
j.walkTokens = function(n, e) {
  return vt.walkTokens(n, e);
};
j.parseInline = vt.parseInline;
j.Parser = Ke;
j.parser = Ke.parse;
j.Renderer = Qn;
j.TextRenderer = Qi;
j.Lexer = Ze;
j.lexer = Ze.lex;
j.Tokenizer = Kn;
j.Hooks = qn;
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
  entries: Qs,
  setPrototypeOf: ps,
  isFrozen: fo,
  getPrototypeOf: go,
  getOwnPropertyDescriptor: mo
} = Object;
let {
  freeze: fe,
  seal: Ce,
  create: Js
} = Object, {
  apply: Ui,
  construct: zi
} = typeof Reflect < "u" && Reflect;
fe || (fe = function(e) {
  return e;
});
Ce || (Ce = function(e) {
  return e;
});
Ui || (Ui = function(e, t, i) {
  return e.apply(t, i);
});
zi || (zi = function(e, t) {
  return new e(...t);
});
const $n = ge(Array.prototype.forEach), wo = ge(Array.prototype.lastIndexOf), fs = ge(Array.prototype.pop), rn = ge(Array.prototype.push), bo = ge(Array.prototype.splice), Xn = ge(String.prototype.toLowerCase), bi = ge(String.prototype.toString), gs = ge(String.prototype.match), on = ge(String.prototype.replace), yo = ge(String.prototype.indexOf), xo = ge(String.prototype.trim), Ie = ge(Object.prototype.hasOwnProperty), de = ge(RegExp.prototype.test), an = _o(TypeError);
function ge(n) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++)
      i[s - 1] = arguments[s];
    return Ui(n, e, i);
  };
}
function _o(n) {
  return function() {
    for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++)
      t[i] = arguments[i];
    return zi(n, t);
  };
}
function z(n, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Xn;
  ps && ps(n, null);
  let i = e.length;
  for (; i--; ) {
    let s = e[i];
    if (typeof s == "string") {
      const r = t(s);
      r !== s && (fo(e) || (e[i] = r), s = r);
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
  const e = Js(null);
  for (const [t, i] of Qs(n))
    Ie(n, t) && (Array.isArray(i) ? e[t] = ko(i) : i && typeof i == "object" && i.constructor === Object ? e[t] = Xe(i) : e[t] = i);
  return e;
}
function ln(n, e) {
  for (; n !== null; ) {
    const i = mo(n, e);
    if (i) {
      if (i.get)
        return ge(i.get);
      if (typeof i.value == "function")
        return ge(i.value);
    }
    n = go(n);
  }
  function t() {
    return null;
  }
  return t;
}
const ms = fe(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), yi = fe(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), xi = fe(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), vo = fe(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), _i = fe(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Eo = fe(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), ws = fe(["#text"]), bs = fe(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), ki = fe(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), ys = fe(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Fn = fe(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), So = Ce(/\{\{[\w\W]*|[\w\W]*\}\}/gm), To = Ce(/<%[\w\W]*|[\w\W]*%>/gm), Ao = Ce(/\$\{[\w\W]*/gm), Ro = Ce(/^data-[\-\w.\u00B7-\uFFFF]+$/), Co = Ce(/^aria-[\-\w]+$/), er = Ce(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Oo = Ce(/^(?:\w+script|data):/i), Mo = Ce(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), tr = Ce(/^html$/i), Lo = Ce(/^[a-z][.\w]*(-[.\w]+)+$/i);
var xs = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: Co,
  ATTR_WHITESPACE: Mo,
  CUSTOM_ELEMENT: Lo,
  DATA_ATTR: Ro,
  DOCTYPE_NAME: tr,
  ERB_EXPR: To,
  IS_ALLOWED_URI: er,
  IS_SCRIPT_OR_DATA: Oo,
  MUSTACHE_EXPR: So,
  TMPLIT_EXPR: Ao
});
const cn = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, Io = function() {
  return typeof window > "u" ? null : window;
}, Do = function(e, t) {
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
}, _s = function() {
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
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Io();
  const e = (A) => nr(A);
  if (e.version = "3.2.6", e.removed = [], !n || !n.document || n.document.nodeType !== cn.document || !n.Element)
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
    DOMParser: k,
    trustedTypes: H
  } = n, P = h.prototype, M = ln(P, "cloneNode"), Se = ln(P, "remove"), xe = ln(P, "nextSibling"), ae = ln(P, "childNodes"), me = ln(P, "parentNode");
  if (typeof c == "function") {
    const A = t.createElement("template");
    A.content && A.content.ownerDocument && (t = A.content.ownerDocument);
  }
  let te, Oe = "";
  const {
    implementation: Ve,
    createNodeIterator: Pe,
    createDocumentFragment: Ft,
    getElementsByTagName: kn
  } = t, {
    importNode: vn
  } = i;
  let le = _s();
  e.isSupported = typeof Qs == "function" && typeof me == "function" && Ve && Ve.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: Vt,
    ERB_EXPR: jt,
    TMPLIT_EXPR: je,
    DATA_ATTR: li,
    ARIA_ATTR: ci,
    IS_SCRIPT_OR_DATA: ui,
    ATTR_WHITESPACE: dt,
    CUSTOM_ELEMENT: hi
  } = xs;
  let {
    IS_ALLOWED_URI: En
  } = xs, ne = null;
  const Sn = z({}, [...ms, ...yi, ...xi, ..._i, ...ws]);
  let se = null;
  const Tn = z({}, [...bs, ...ki, ...ys, ...Fn]);
  let J = Object.seal(Js(null, {
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
  })), pt = null, Gt = null, An = !0, Rn = !0, ft = !1, Cn = !0, tt = !1, St = !0, Ge = !1, Wt = !1, qt = !1, nt = !1, Tt = !1, At = !1, Xt = !0, On = !1;
  const di = "user-content-";
  let Rt = !0, _e = !1, We = {}, ke = null;
  const gt = z({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let Yt = null;
  const Mn = z({}, ["audio", "video", "img", "source", "image", "track"]);
  let Zt = null;
  const Ln = z({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Ct = "http://www.w3.org/1998/Math/MathML", Ot = "http://www.w3.org/2000/svg", Te = "http://www.w3.org/1999/xhtml";
  let it = Te, Kt = !1, Qt = null;
  const Jt = z({}, [Ct, Ot, Te], bi);
  let mt = z({}, ["mi", "mo", "mn", "ms", "mtext"]), wt = z({}, ["annotation-xml"]);
  const pi = z({}, ["title", "style", "font", "a", "script"]);
  let st = null;
  const rt = ["application/xhtml+xml", "text/html"], o = "text/html";
  let d = null, _ = null;
  const I = t.createElement("form"), Q = function(l) {
    return l instanceof RegExp || l instanceof Function;
  }, K = function() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(_ && _ === l)) {
      if ((!l || typeof l != "object") && (l = {}), l = Xe(l), st = // eslint-disable-next-line unicorn/prefer-includes
      rt.indexOf(l.PARSER_MEDIA_TYPE) === -1 ? o : l.PARSER_MEDIA_TYPE, d = st === "application/xhtml+xml" ? bi : Xn, ne = Ie(l, "ALLOWED_TAGS") ? z({}, l.ALLOWED_TAGS, d) : Sn, se = Ie(l, "ALLOWED_ATTR") ? z({}, l.ALLOWED_ATTR, d) : Tn, Qt = Ie(l, "ALLOWED_NAMESPACES") ? z({}, l.ALLOWED_NAMESPACES, bi) : Jt, Zt = Ie(l, "ADD_URI_SAFE_ATTR") ? z(Xe(Ln), l.ADD_URI_SAFE_ATTR, d) : Ln, Yt = Ie(l, "ADD_DATA_URI_TAGS") ? z(Xe(Mn), l.ADD_DATA_URI_TAGS, d) : Mn, ke = Ie(l, "FORBID_CONTENTS") ? z({}, l.FORBID_CONTENTS, d) : gt, pt = Ie(l, "FORBID_TAGS") ? z({}, l.FORBID_TAGS, d) : Xe({}), Gt = Ie(l, "FORBID_ATTR") ? z({}, l.FORBID_ATTR, d) : Xe({}), We = Ie(l, "USE_PROFILES") ? l.USE_PROFILES : !1, An = l.ALLOW_ARIA_ATTR !== !1, Rn = l.ALLOW_DATA_ATTR !== !1, ft = l.ALLOW_UNKNOWN_PROTOCOLS || !1, Cn = l.ALLOW_SELF_CLOSE_IN_ATTR !== !1, tt = l.SAFE_FOR_TEMPLATES || !1, St = l.SAFE_FOR_XML !== !1, Ge = l.WHOLE_DOCUMENT || !1, nt = l.RETURN_DOM || !1, Tt = l.RETURN_DOM_FRAGMENT || !1, At = l.RETURN_TRUSTED_TYPE || !1, qt = l.FORCE_BODY || !1, Xt = l.SANITIZE_DOM !== !1, On = l.SANITIZE_NAMED_PROPS || !1, Rt = l.KEEP_CONTENT !== !1, _e = l.IN_PLACE || !1, En = l.ALLOWED_URI_REGEXP || er, it = l.NAMESPACE || Te, mt = l.MATHML_TEXT_INTEGRATION_POINTS || mt, wt = l.HTML_INTEGRATION_POINTS || wt, J = l.CUSTOM_ELEMENT_HANDLING || {}, l.CUSTOM_ELEMENT_HANDLING && Q(l.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (J.tagNameCheck = l.CUSTOM_ELEMENT_HANDLING.tagNameCheck), l.CUSTOM_ELEMENT_HANDLING && Q(l.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (J.attributeNameCheck = l.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), l.CUSTOM_ELEMENT_HANDLING && typeof l.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (J.allowCustomizedBuiltInElements = l.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), tt && (Rn = !1), Tt && (nt = !0), We && (ne = z({}, ws), se = [], We.html === !0 && (z(ne, ms), z(se, bs)), We.svg === !0 && (z(ne, yi), z(se, ki), z(se, Fn)), We.svgFilters === !0 && (z(ne, xi), z(se, ki), z(se, Fn)), We.mathMl === !0 && (z(ne, _i), z(se, ys), z(se, Fn))), l.ADD_TAGS && (ne === Sn && (ne = Xe(ne)), z(ne, l.ADD_TAGS, d)), l.ADD_ATTR && (se === Tn && (se = Xe(se)), z(se, l.ADD_ATTR, d)), l.ADD_URI_SAFE_ATTR && z(Zt, l.ADD_URI_SAFE_ATTR, d), l.FORBID_CONTENTS && (ke === gt && (ke = Xe(ke)), z(ke, l.FORBID_CONTENTS, d)), Rt && (ne["#text"] = !0), Ge && z(ne, ["html", "head", "body"]), ne.table && (z(ne, ["tbody"]), delete pt.tbody), l.TRUSTED_TYPES_POLICY) {
        if (typeof l.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw an('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof l.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw an('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        te = l.TRUSTED_TYPES_POLICY, Oe = te.createHTML("");
      } else
        te === void 0 && (te = Do(H, s)), te !== null && typeof Oe == "string" && (Oe = te.createHTML(""));
      fe && fe(l), _ = l;
    }
  }, T = z({}, [...yi, ...xi, ...vo]), S = z({}, [..._i, ...Eo]), L = function(l) {
    let x = me(l);
    (!x || !x.tagName) && (x = {
      namespaceURI: it,
      tagName: "template"
    });
    const E = Xn(l.tagName), q = Xn(x.tagName);
    return Qt[l.namespaceURI] ? l.namespaceURI === Ot ? x.namespaceURI === Te ? E === "svg" : x.namespaceURI === Ct ? E === "svg" && (q === "annotation-xml" || mt[q]) : !!T[E] : l.namespaceURI === Ct ? x.namespaceURI === Te ? E === "math" : x.namespaceURI === Ot ? E === "math" && wt[q] : !!S[E] : l.namespaceURI === Te ? x.namespaceURI === Ot && !wt[q] || x.namespaceURI === Ct && !mt[q] ? !1 : !S[E] && (pi[E] || !T[E]) : !!(st === "application/xhtml+xml" && Qt[l.namespaceURI]) : !1;
  }, F = function(l) {
    rn(e.removed, {
      element: l
    });
    try {
      me(l).removeChild(l);
    } catch {
      Se(l);
    }
  }, W = function(l, x) {
    try {
      rn(e.removed, {
        attribute: x.getAttributeNode(l),
        from: x
      });
    } catch {
      rn(e.removed, {
        attribute: null,
        from: x
      });
    }
    if (x.removeAttribute(l), l === "is")
      if (nt || Tt)
        try {
          F(x);
        } catch {
        }
      else
        try {
          x.setAttribute(l, "");
        } catch {
        }
  }, ot = function(l) {
    let x = null, E = null;
    if (qt)
      l = "<remove></remove>" + l;
    else {
      const ee = gs(l, /^[\r\n\t ]+/);
      E = ee && ee[0];
    }
    st === "application/xhtml+xml" && it === Te && (l = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + l + "</body></html>");
    const q = te ? te.createHTML(l) : l;
    if (it === Te)
      try {
        x = new k().parseFromString(q, st);
      } catch {
      }
    if (!x || !x.documentElement) {
      x = Ve.createDocument(it, "template", null);
      try {
        x.documentElement.innerHTML = Kt ? Oe : q;
      } catch {
      }
    }
    const re = x.body || x.documentElement;
    return l && E && re.insertBefore(t.createTextNode(E), re.childNodes[0] || null), it === Te ? kn.call(x, Ge ? "html" : "body")[0] : Ge ? x.documentElement : re;
  }, Mt = function(l) {
    return Pe.call(
      l.ownerDocument || l,
      l,
      // eslint-disable-next-line no-bitwise
      u.SHOW_ELEMENT | u.SHOW_COMMENT | u.SHOW_TEXT | u.SHOW_PROCESSING_INSTRUCTION | u.SHOW_CDATA_SECTION,
      null
    );
  }, bt = function(l) {
    return l instanceof O && (typeof l.nodeName != "string" || typeof l.textContent != "string" || typeof l.removeChild != "function" || !(l.attributes instanceof p) || typeof l.removeAttribute != "function" || typeof l.setAttribute != "function" || typeof l.namespaceURI != "string" || typeof l.insertBefore != "function" || typeof l.hasChildNodes != "function");
  }, In = function(l) {
    return typeof a == "function" && l instanceof a;
  };
  function ve(A, l, x) {
    $n(A, (E) => {
      E.call(e, l, x, _);
    });
  }
  const Dn = function(l) {
    let x = null;
    if (ve(le.beforeSanitizeElements, l, null), bt(l))
      return F(l), !0;
    const E = d(l.nodeName);
    if (ve(le.uponSanitizeElement, l, {
      tagName: E,
      allowedTags: ne
    }), St && l.hasChildNodes() && !In(l.firstElementChild) && de(/<[/\w!]/g, l.innerHTML) && de(/<[/\w!]/g, l.textContent) || l.nodeType === cn.progressingInstruction || St && l.nodeType === cn.comment && de(/<[/\w]/g, l.data))
      return F(l), !0;
    if (!ne[E] || pt[E]) {
      if (!pt[E] && Nn(E) && (J.tagNameCheck instanceof RegExp && de(J.tagNameCheck, E) || J.tagNameCheck instanceof Function && J.tagNameCheck(E)))
        return !1;
      if (Rt && !ke[E]) {
        const q = me(l) || l.parentNode, re = ae(l) || l.childNodes;
        if (re && q) {
          const ee = re.length;
          for (let ue = ee - 1; ue >= 0; --ue) {
            const Me = M(re[ue], !0);
            Me.__removalCount = (l.__removalCount || 0) + 1, q.insertBefore(Me, xe(l));
          }
        }
      }
      return F(l), !0;
    }
    return l instanceof h && !L(l) || (E === "noscript" || E === "noembed" || E === "noframes") && de(/<\/no(script|embed|frames)/i, l.innerHTML) ? (F(l), !0) : (tt && l.nodeType === cn.text && (x = l.textContent, $n([Vt, jt, je], (q) => {
      x = on(x, q, " ");
    }), l.textContent !== x && (rn(e.removed, {
      element: l.cloneNode()
    }), l.textContent = x)), ve(le.afterSanitizeElements, l, null), !1);
  }, Pn = function(l, x, E) {
    if (Xt && (x === "id" || x === "name") && (E in t || E in I))
      return !1;
    if (!(Rn && !Gt[x] && de(li, x))) {
      if (!(An && de(ci, x))) {
        if (!se[x] || Gt[x]) {
          if (
            // First condition does a very basic check if a) it's basically a valid custom element tagname AND
            // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
            !(Nn(l) && (J.tagNameCheck instanceof RegExp && de(J.tagNameCheck, l) || J.tagNameCheck instanceof Function && J.tagNameCheck(l)) && (J.attributeNameCheck instanceof RegExp && de(J.attributeNameCheck, x) || J.attributeNameCheck instanceof Function && J.attributeNameCheck(x)) || // Alternative, second condition checks if it's an `is`-attribute, AND
            // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            x === "is" && J.allowCustomizedBuiltInElements && (J.tagNameCheck instanceof RegExp && de(J.tagNameCheck, E) || J.tagNameCheck instanceof Function && J.tagNameCheck(E)))
          ) return !1;
        } else if (!Zt[x]) {
          if (!de(En, on(E, dt, ""))) {
            if (!((x === "src" || x === "xlink:href" || x === "href") && l !== "script" && yo(E, "data:") === 0 && Yt[l])) {
              if (!(ft && !de(ui, on(E, dt, "")))) {
                if (E)
                  return !1;
              }
            }
          }
        }
      }
    }
    return !0;
  }, Nn = function(l) {
    return l !== "annotation-xml" && gs(l, hi);
  }, en = function(l) {
    ve(le.beforeSanitizeAttributes, l, null);
    const {
      attributes: x
    } = l;
    if (!x || bt(l))
      return;
    const E = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: se,
      forceKeepAttr: void 0
    };
    let q = x.length;
    for (; q--; ) {
      const re = x[q], {
        name: ee,
        namespaceURI: ue,
        value: Me
      } = re, Ne = d(ee), tn = Me;
      let w = ee === "value" ? tn : xo(tn);
      if (E.attrName = Ne, E.attrValue = w, E.keepAttr = !0, E.forceKeepAttr = void 0, ve(le.uponSanitizeAttribute, l, E), w = E.attrValue, On && (Ne === "id" || Ne === "name") && (W(ee, l), w = di + w), St && de(/((--!?|])>)|<\/(style|title)/i, w)) {
        W(ee, l);
        continue;
      }
      if (E.forceKeepAttr)
        continue;
      if (!E.keepAttr) {
        W(ee, l);
        continue;
      }
      if (!Cn && de(/\/>/i, w)) {
        W(ee, l);
        continue;
      }
      tt && $n([Vt, jt, je], (U) => {
        w = on(w, U, " ");
      });
      const R = d(l.nodeName);
      if (!Pn(R, Ne, w)) {
        W(ee, l);
        continue;
      }
      if (te && typeof H == "object" && typeof H.getAttributeType == "function" && !ue)
        switch (H.getAttributeType(R, Ne)) {
          case "TrustedHTML": {
            w = te.createHTML(w);
            break;
          }
          case "TrustedScriptURL": {
            w = te.createScriptURL(w);
            break;
          }
        }
      if (w !== tn)
        try {
          ue ? l.setAttributeNS(ue, ee, w) : l.setAttribute(ee, w), bt(l) ? F(l) : fs(e.removed);
        } catch {
          W(ee, l);
        }
    }
    ve(le.afterSanitizeAttributes, l, null);
  }, Lt = function A(l) {
    let x = null;
    const E = Mt(l);
    for (ve(le.beforeSanitizeShadowDOM, l, null); x = E.nextNode(); )
      ve(le.uponSanitizeShadowNode, x, null), Dn(x), en(x), x.content instanceof r && A(x.content);
    ve(le.afterSanitizeShadowDOM, l, null);
  };
  return e.sanitize = function(A) {
    let l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, x = null, E = null, q = null, re = null;
    if (Kt = !A, Kt && (A = "<!-->"), typeof A != "string" && !In(A))
      if (typeof A.toString == "function") {
        if (A = A.toString(), typeof A != "string")
          throw an("dirty is not a string, aborting");
      } else
        throw an("toString is not a function");
    if (!e.isSupported)
      return A;
    if (Wt || K(l), e.removed = [], typeof A == "string" && (_e = !1), _e) {
      if (A.nodeName) {
        const Me = d(A.nodeName);
        if (!ne[Me] || pt[Me])
          throw an("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (A instanceof a)
      x = ot("<!---->"), E = x.ownerDocument.importNode(A, !0), E.nodeType === cn.element && E.nodeName === "BODY" || E.nodeName === "HTML" ? x = E : x.appendChild(E);
    else {
      if (!nt && !tt && !Ge && // eslint-disable-next-line unicorn/prefer-includes
      A.indexOf("<") === -1)
        return te && At ? te.createHTML(A) : A;
      if (x = ot(A), !x)
        return nt ? null : At ? Oe : "";
    }
    x && qt && F(x.firstChild);
    const ee = Mt(_e ? A : x);
    for (; q = ee.nextNode(); )
      Dn(q), en(q), q.content instanceof r && Lt(q.content);
    if (_e)
      return A;
    if (nt) {
      if (Tt)
        for (re = Ft.call(x.ownerDocument); x.firstChild; )
          re.appendChild(x.firstChild);
      else
        re = x;
      return (se.shadowroot || se.shadowrootmode) && (re = vn.call(i, re, !0)), re;
    }
    let ue = Ge ? x.outerHTML : x.innerHTML;
    return Ge && ne["!doctype"] && x.ownerDocument && x.ownerDocument.doctype && x.ownerDocument.doctype.name && de(tr, x.ownerDocument.doctype.name) && (ue = "<!DOCTYPE " + x.ownerDocument.doctype.name + `>
` + ue), tt && $n([Vt, jt, je], (Me) => {
      ue = on(ue, Me, " ");
    }), te && At ? te.createHTML(ue) : ue;
  }, e.setConfig = function() {
    let A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    K(A), Wt = !0;
  }, e.clearConfig = function() {
    _ = null, Wt = !1;
  }, e.isValidAttribute = function(A, l, x) {
    _ || K({});
    const E = d(A), q = d(l);
    return Pn(E, q, x);
  }, e.addHook = function(A, l) {
    typeof l == "function" && rn(le[A], l);
  }, e.removeHook = function(A, l) {
    if (l !== void 0) {
      const x = wo(le[A], l);
      return x === -1 ? void 0 : bo(le[A], x, 1)[0];
    }
    return fs(le[A]);
  }, e.removeHooks = function(A) {
    le[A] = [];
  }, e.removeAllHooks = function() {
    le = _s();
  }, e;
}
var ks = nr();
function Bt(n) {
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
function No(n, e, t) {
  if (t.region_type !== "ShapeRegion")
    throw new Error(`Region type ${t.region_type} not implemented in checkPointInRegion`);
  switch (t.shape) {
    case "rectangle":
      const i = t.x - t.w / 2, s = t.x + t.w / 2, r = t.y + t.h / 2, c = t.y - t.h / 2;
      return n >= i && n <= s && e >= c && e <= r;
    case "ellipse":
      const a = t.w / 2, h = t.h / 2, u = n - t.x, p = e - t.y;
      return u * u / (a * a) + p * p / (h * h) <= 1;
    default:
      throw new Error(`Unknown region type: ${t.region_type}`);
  }
}
class Bo {
  constructor(e, t, i, s) {
    this.tArmed = null;
    const r = (c) => {
      if (!this.tArmed)
        return;
      const { x: a, y: h } = s.getBoardLocationFromMouseEvent(c);
      if (!No(a, h, e))
        return;
      const p = {
        action_type: "ClickAction",
        click_x: a,
        click_y: h,
        timestamp_action: Bt(performance.now())
      };
      t(p);
    };
    i.addEventListener(
      "mousedown",
      r,
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
class Uo {
  constructor(e) {
    this.onSensorFired = e;
  }
  arm() {
    const e = {
      action_type: "TimeoutAction",
      timestamp_action: Bt(performance.now())
    };
    this.onSensorFired(e);
  }
  destroy() {
  }
}
class zo {
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
        key: s,
        timestamp_action: Bt(performance.now())
      };
      this.onSensorFired(r);
    }, this.onSensorFired = e, this.keys = [t], document.addEventListener("keydown", this.onKeyPress);
  }
  arm() {
    this.tArmed = performance.now();
  }
  destroy() {
    this.tArmed = null, document.removeEventListener("keydown", this.onKeyPress);
  }
}
class ri {
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
class Ho extends ri {
  async prepare(e) {
    this.imageContainer = document.createElement("div"), this.imageContainer.classList.add("image-card"), this.root.appendChild(this.imageContainer), this.image = await e.getImage(
      this.card.image
    ), this.image.classList.add("image-card__content"), this.image.draggable = !1, this.imageContainer.appendChild(this.image);
  }
}
class $o extends ri {
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
class Fo extends ri {
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
class Vo extends ri {
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
class jo {
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
    const t = (e.clientX - this.boardLeftPx) / this.boardWidthPx - 0.5, i = -((e.clientY - this.boardTopPx) / this.boardHeightPx - 0.5);
    return {
      x: t,
      y: i
    };
  }
}
class Go {
  // Map of sensor ID to SensorBinding
  constructor(e, t) {
    this.cardViews = /* @__PURE__ */ new Map(), this.sensorBindings = /* @__PURE__ */ new Map(), this.root = document.createElement("div"), this.root.className = "board-view", this.root.id = `${e}`, this.root.style.width = t.board_width_px + "px", this.root.style.height = t.board_height_px + "px", this.root.style.backgroundColor = t.background_color, this.setBoardState(!1, !1);
  }
  getCoordinateSystem() {
    const { width: e, height: t, left: i, top: s } = this.root.getBoundingClientRect();
    return new jo(e, t, i, s);
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
        s = new Fo(
          e,
          i
        );
        break;
      case "TextCard":
        s = new $o(
          e,
          i
        );
        break;
      case "ShapeCard":
        s = new Vo(
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
      i = new Uo(
        t
      );
    else if (e.sensor_type === "KeySensor")
      i = new zo(
        t,
        e.key
      );
    else if (e.sensor_type == "ClickSensor")
      i = new Bo(
        e.region,
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
class Wo {
  constructor(e) {
    this.boardViews = /* @__PURE__ */ new Map(), this.activeBoardId = null, this.root = document.createElement("div"), this.root.className = "board-views-ui", this.assetManager = e;
  }
  createBoardView(e, t) {
    if (this.boardViews.has(e))
      return this.getBoardView(e);
    const i = new Go(e, t);
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
class qo {
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
function Xo() {
  const n = document.createElement("div");
  document.body.appendChild(n);
  const e = document.createElement("div");
  e.classList.add("node-engine-container"), n.appendChild(e);
  const t = document.createElement("div");
  t.classList.add("node-engine-content"), e.appendChild(t);
  const i = new qo(), s = new Wo(
    i
  );
  t.appendChild(s.root);
  const r = new Or();
  return r.mount(t), {
    boardViewsUI: s,
    shellUI: r,
    assetManager: i
  };
}
class vs {
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
class Yo {
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
class Zo {
  constructor(e, t) {
    this.prepared = !1, this.started = !1, this.deferredSensorFiring = new Es(), this.deferredOutcomeDone = new Es(), this.boardView = t, this.node = e, this.scheduler = new vs(), this.outcomeSchedulers = {};
  }
  async prepare(e) {
    for (const t of this.node.cards) {
      const i = await this.boardView.prepareCard(
        t,
        e
      );
      this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: t.t_start,
          triggerFunc: () => {
            this.boardView.startCard(i);
          }
        }
      ), t.t_end !== null && this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: t.t_end,
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
        (h) => this.deferredSensorFiring.resolve({
          sensorIndex: t,
          action: h
        })
      );
      if (this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: i.t_start,
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
      const r = i.outcome, c = new vs();
      let a = 0;
      for (const h of r.cards) {
        const u = await this.boardView.prepareCard(
          h,
          e
        );
        if (c.scheduleEvent(
          {
            triggerTimeMsec: h.t_start,
            triggerFunc: () => {
              this.boardView.startCard(u);
            }
          }
        ), h.t_end !== null)
          c.scheduleEvent(
            {
              triggerTimeMsec: h.t_end,
              triggerFunc: () => {
                this.boardView.stopCard(u);
              }
            }
          ), h.t_end > a && (a = h.t_end);
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
      const i = new Yo(this.boardView);
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
      sensor_index: t.sensorIndex,
      action: t.action,
      timestamp_start: Bt(e),
      timestamp_end: Bt(performance.now())
    };
  }
}
class Ko {
  constructor() {
    this.bufferedNodePlays = /* @__PURE__ */ new Map();
    const { shellUI: e, boardViewsUI: t } = Xo();
    this.shellUI = e, this.boardViewsUI = t;
  }
  async prepare(e) {
    const t = crypto.randomUUID(), i = this.boardViewsUI.createBoardView(t, e.board), s = new Zo(
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
function Qo(n, e) {
  let t = 0;
  n.sort((s, r) => s.timestamp_event.localeCompare(r.timestamp_event));
  let i = /* @__PURE__ */ new Set();
  for (let s = 0; s < n.length; s++) {
    const r = n[s];
    if (r.event_type !== "NodeResultEvent")
      continue;
    const c = r.node_index, a = r.sensor_index;
    if (i.has(c))
      continue;
    i.add(c);
    const p = e.nodes[c].sensors[a].outcome;
    if (!p)
      continue;
    let O = parseFloat(p.bonus_amount_usd);
    !isNaN(O) && O > 0 && (t += O);
  }
  return t = Math.max(0, t), t = Math.round(t * 100) / 100, t;
}
function Jo() {
  return {
    userAgent: navigator.userAgent,
    viewportWidthPx: window.innerWidth,
    viewportHeightPx: window.innerHeight,
    displayWidthPx: screen.width,
    displayHeightPx: screen.height
  };
}
var ea = "2.0.4", Hi = 500, Ss = "user-agent", Ut = "", Ts = "?", Jn = "function", ut = "undefined", zt = "object", $i = "string", we = "browser", Ye = "cpu", Fe = "device", De = "engine", Ae = "os", Pt = "result", b = "name", f = "type", m = "vendor", y = "version", be = "architecture", xn = "major", g = "model", wn = "console", D = "mobile", G = "tablet", ie = "smarttv", He = "wearable", Vn = "xr", bn = "embedded", un = "inapp", Ji = "brands", kt = "formFactors", es = "fullVersionList", Nt = "platform", ts = "platformVersion", oi = "bitness", ht = "sec-ch-ua", ta = ht + "-full-version-list", na = ht + "-arch", ia = ht + "-" + oi, sa = ht + "-form-factors", ra = ht + "-" + D, oa = ht + "-" + g, ir = ht + "-" + Nt, aa = ir + "-version", sr = [Ji, es, D, g, Nt, ts, be, kt, oi], jn = "Amazon", It = "Apple", As = "ASUS", Rs = "BlackBerry", xt = "Google", Cs = "Huawei", vi = "Lenovo", Os = "Honor", Gn = "LG", Ei = "Microsoft", Si = "Motorola", Ti = "Nvidia", Ms = "OnePlus", Ai = "OPPO", hn = "Samsung", Ls = "Sharp", dn = "Sony", Ri = "Xiaomi", Ci = "Zebra", Is = "Chrome", Ds = "Chromium", lt = "Chromecast", Yn = "Edge", pn = "Firefox", fn = "Opera", Oi = "Facebook", Ps = "Sogou", Dt = "Mobile ", gn = " Browser", Fi = "Windows", la = typeof window !== ut, ye = la && window.navigator ? window.navigator : void 0, ct = ye && ye.userAgentData ? ye.userAgentData : void 0, ca = function(n, e) {
  var t = {}, i = e;
  if (!ei(e)) {
    i = {};
    for (var s in e)
      for (var r in e[s])
        i[r] = e[s][r].concat(i[r] ? i[r] : []);
  }
  for (var c in n)
    t[c] = i[c] && i[c].length % 2 === 0 ? i[c].concat(n[c]) : n[c];
  return t;
}, ai = function(n) {
  for (var e = {}, t = 0; t < n.length; t++)
    e[n[t].toUpperCase()] = n[t];
  return e;
}, Vi = function(n, e) {
  if (typeof n === zt && n.length > 0) {
    for (var t in n)
      if (Qe(e) == Qe(n[t])) return !0;
    return !1;
  }
  return $t(n) ? Qe(e) == Qe(n) : !1;
}, ei = function(n, e) {
  for (var t in n)
    return /^(browser|cpu|device|engine|os)$/.test(t) || (e ? ei(n[t]) : !1);
}, $t = function(n) {
  return typeof n === $i;
}, Mi = function(n) {
  if (n) {
    for (var e = [], t = Ht(/\\?\"/g, n).split(","), i = 0; i < t.length; i++)
      if (t[i].indexOf(";") > -1) {
        var s = ti(t[i]).split(";v=");
        e[i] = { brand: s[0], version: s[1] };
      } else
        e[i] = ti(t[i]);
    return e;
  }
}, Qe = function(n) {
  return $t(n) ? n.toLowerCase() : n;
}, Li = function(n) {
  return $t(n) ? Ht(/[^\d\.]/g, n).split(".")[0] : void 0;
}, Je = function(n) {
  for (var e in n) {
    var t = n[e];
    typeof t == zt && t.length == 2 ? this[t[0]] = t[1] : this[t] = void 0;
  }
  return this;
}, Ht = function(n, e) {
  return $t(e) ? e.replace(n, Ut) : e;
}, mn = function(n) {
  return Ht(/\\?\"/g, n);
}, ti = function(n, e) {
  if ($t(n))
    return n = Ht(/^\s\s*/, n), typeof e === ut ? n : n.substring(0, Hi);
}, Ii = function(n, e) {
  if (!(!n || !e))
    for (var t = 0, i, s, r, c, a, h; t < e.length && !a; ) {
      var u = e[t], p = e[t + 1];
      for (i = s = 0; i < u.length && !a && u[i]; )
        if (a = u[i++].exec(n), a)
          for (r = 0; r < p.length; r++)
            h = a[++s], c = p[r], typeof c === zt && c.length > 0 ? c.length === 2 ? typeof c[1] == Jn ? this[c[0]] = c[1].call(this, h) : this[c[0]] = c[1] : c.length >= 3 && (typeof c[1] === Jn && !(c[1].exec && c[1].test) ? c.length > 3 ? this[c[0]] = h ? c[1].apply(this, c.slice(2)) : void 0 : this[c[0]] = h ? c[1].call(this, h, c[2]) : void 0 : c.length == 3 ? this[c[0]] = h ? h.replace(c[1], c[2]) : void 0 : c.length == 4 ? this[c[0]] = h ? c[3].call(this, h.replace(c[1], c[2])) : void 0 : c.length > 4 && (this[c[0]] = h ? c[3].apply(this, [h.replace(c[1], c[2])].concat(c.slice(4))) : void 0)) : this[c] = h || void 0;
      t += 2;
    }
}, $e = function(n, e) {
  for (var t in e)
    if (typeof e[t] === zt && e[t].length > 0) {
      for (var i = 0; i < e[t].length; i++)
        if (Vi(e[t][i], n))
          return t === Ts ? void 0 : t;
    } else if (Vi(e[t], n))
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
}, ua = {
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
    [y, [b, Dt + "Chrome"]],
    [
      /webview.+edge\/([\w\.]+)/i
      // Microsoft Edge
    ],
    [y, [b, Yn + " WebView"]],
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
    [y, [b, fn + " Mini"]],
    [
      /\bop(?:rg)?x\/([\w\.]+)/i
      // Opera GX
    ],
    [y, [b, fn + " GX"]],
    [
      /\bopr\/([\w\.]+)/i
      // Opera Webkit
    ],
    [y, [b, fn]],
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
    [y, [b, "Smart " + vi + gn]],
    [
      /(avast|avg)\/([\w\.]+)/i
      // Avast/AVG Secure Browser
    ],
    [[b, /(.+)/, "$1 Secure" + gn], y],
    [
      /\bfocus\/([\w\.]+)/i
      // Firefox Focus
    ],
    [y, [b, pn + " Focus"]],
    [
      /\bopt\/([\w\.]+)/i
      // Opera Touch
    ],
    [y, [b, fn + " Touch"]],
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
    [y, [b, fn + " Coast"]],
    [
      /miuibrowser\/([\w\.]+)/i
      // MIUI Browser
    ],
    [y, [b, "MIUI" + gn]],
    [
      /fxios\/([\w\.-]+)/i
      // Firefox for iOS
    ],
    [y, [b, Dt + pn]],
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
    [[b, /(.+)/, "$1" + gn], y],
    [
      // Oculus/Sailfish/HuaweiBrowser/VivoBrowser/PicoBrowser
      /samsungbrowser\/([\w\.]+)/i
      // Samsung Internet
    ],
    [y, [b, hn + " Internet"]],
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
    [[b, Oi], y, [f, un]],
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
    [b, y, [f, un]],
    [
      /\bgsa\/([\w\.]+) .*safari\//i
      // Google Search Appliance on iOS
    ],
    [y, [b, "GSA"], [f, un]],
    [
      /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i
      // TikTok
    ],
    [y, [b, "TikTok"], [f, un]],
    [
      /\[(linkedin)app\]/i
      // LinkedIn App for iOS & Android
    ],
    [b, [f, un]],
    [
      /(chromium)[\/ ]([-\w\.]+)/i
      // Chromium
    ],
    [b, y],
    [
      /headlesschrome(?:\/([\w\.]+)| )/i
      // Chrome Headless
    ],
    [y, [b, Is + " Headless"]],
    [
      /wv\).+chrome\/([\w\.]+).+edgw\//i
      // Edge WebView2
    ],
    [y, [b, Yn + " WebView2"]],
    [
      / wv\).+(chrome)\/([\w\.]+)/i
      // Chrome WebView
    ],
    [[b, Is + " WebView"], y],
    [
      /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
      // Android Browser
    ],
    [y, [b, "Android" + gn]],
    [
      /chrome\/([\w\.]+) mobile/i
      // Chrome Mobile
    ],
    [y, [b, Dt + "Chrome"]],
    [
      /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
      // Chrome/OmniWeb/Arora/Tizen/Nokia
    ],
    [b, y],
    [
      /version\/([\w\.\,]+) .*mobile(?:\/\w+ | ?)safari/i
      // Safari Mobile
    ],
    [y, [b, Dt + "Safari"]],
    [
      /iphone .*mobile(?:\/\w+ | ?)safari/i
    ],
    [[b, Dt + "Safari"]],
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
    [[b, Dt + pn], y],
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
    [y, [b, pn + " Reality"]],
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
    [b, [y, /[^\d\.]+./, Ut]]
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
    [[be, /ower/, Ut, Qe]],
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
    [g, [m, hn], [f, G]],
    [
      /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
      /samsung[- ]((?!sm-[lr]|browser)[-\w]+)/i,
      /sec-(sgh\w+)/i
    ],
    [g, [m, hn], [f, D]],
    [
      // Apple
      /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i
      // iPod/iPhone
    ],
    [g, [m, It], [f, D]],
    [
      /\((ipad);[-\w\),; ]+apple/i,
      // iPad
      /applecoremedia\/[\w\.]+ \((ipad)/i,
      /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
    ],
    [g, [m, It], [f, G]],
    [
      /(macintosh);/i
    ],
    [g, [m, It]],
    [
      // Sharp
      /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
    ],
    [g, [m, Ls], [f, D]],
    [
      // Honor
      /\b((?:brt|eln|hey2?|gdi|jdn)-a?[lnw]09|(?:ag[rm]3?|jdn2|kob2)-a?[lw]0[09]hn)(?: bui|\)|;)/i
    ],
    [g, [m, Os], [f, G]],
    [
      /honor([-\w ]+)[;\)]/i
    ],
    [g, [m, Os], [f, D]],
    [
      // Huawei
      /\b((?:ag[rs][2356]?k?|bah[234]?|bg[2o]|bt[kv]|cmr|cpn|db[ry]2?|jdn2|got|kob2?k?|mon|pce|scm|sht?|[tw]gr|vrd)-[ad]?[lw][0125][09]b?|605hw|bg2-u03|(?:gem|fdr|m2|ple|t1)-[7a]0[1-4][lu]|t1-a2[13][lw]|mediapad[\w\. ]*(?= bui|\)))\b(?!.+d\/s)/i
    ],
    [g, [m, Cs], [f, G]],
    [
      /(?:huawei)([-\w ]+)[;\)]/i,
      /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
    ],
    [g, [m, Cs], [f, D]],
    [
      // Xiaomi
      /oid[^\)]+; (2[\dbc]{4}(182|283|rp\w{2})[cgl]|m2105k81a?c)(?: bui|\))/i,
      /\b((?:red)?mi[-_ ]?pad[\w- ]*)(?: bui|\))/i
      // Mi Pad tablets
    ],
    [[g, /_/g, " "], [m, Ri], [f, G]],
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
    [[g, /_/g, " "], [m, Ri], [f, D]],
    [
      // OnePlus
      /droid.+; (cph2[3-6]\d[13579]|((gm|hd)19|(ac|be|in|kb)20|(d[en]|eb|le|mt)21|ne22)[0-2]\d|p[g-k]\w[1m]10)\b/i,
      /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
    ],
    [g, [m, Ms], [f, D]],
    [
      // OPPO
      /; (\w+) bui.+ oppo/i,
      /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
    ],
    [g, [m, Ai], [f, D]],
    [
      /\b(opd2(\d{3}a?))(?: bui|\))/i
    ],
    [g, [m, $e, { OnePlus: ["203", "304", "403", "404", "413", "415"], "*": Ai }], [f, G]],
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
    [g, [m, vi], [f, G]],
    [
      /lenovo[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i
    ],
    [g, [m, vi], [f, D]],
    [
      // Motorola
      /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
      /\bmot(?:orola)?[- ]([\w\s]+)(\)| bui)/i,
      /((?:moto(?! 360)[-\w\(\) ]+|xt\d{3,4}[cgkosw\+]?[-\d]*|nexus 6)(?= bui|\)))/i
    ],
    [g, [m, Si], [f, D]],
    [
      /\b(mz60\d|xoom[2 ]{0,2}) build\//i
    ],
    [g, [m, Si], [f, G]],
    [
      // LG
      /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
    ],
    [g, [m, Gn], [f, G]],
    [
      /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
      /\blg[-e;\/ ]+(?!.*(?:browser|netcast|android tv|watch|webos))(\w+)/i,
      /\blg-?([\d\w]+) bui/i
    ],
    [g, [m, Gn], [f, D]],
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
    [g, [m, xt], [f, G]],
    [
      // Google Pixel
      /droid.+;(?: google)? (g(01[13]a|020[aem]|025[jn]|1b60|1f8f|2ybb|4s1m|576d|5nz6|8hhn|8vou|a02099|c15s|d1yq|e2ae|ec77|gh2x|kv4x|p4bc|pj41|r83y|tt9q|ur25|wvk6)|pixel[\d ]*a?( pro)?( xl)?( fold)?( \(5g\))?)( bui|\))/i
    ],
    [g, [m, xt], [f, D]],
    [
      /(google) (pixelbook( go)?)/i
    ],
    [m, g],
    [
      // Sony
      /droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-\w\w\d\d)(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
    ],
    [g, [m, dn], [f, D]],
    [
      /sony tablet [ps]/i,
      /\b(?:sony)?sgp\w+(?: bui|\))/i
    ],
    [[g, "Xperia Tablet"], [m, dn], [f, G]],
    [
      // Amazon
      /(alexa)webm/i,
      /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,
      // Kindle Fire without Silk / Echo Show
      /(kf[a-z]+)( bui|\)).+silk\//i
      // Kindle Fire HD
    ],
    [g, [m, jn], [f, G]],
    [
      /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
      // Fire Phone
    ],
    [[g, /(.+)/g, "Fire Phone $1"], [m, jn], [f, D]],
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
    [g, [m, Rs], [f, D]],
    [
      // Asus
      /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
    ],
    [g, [m, As], [f, G]],
    [
      / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
    ],
    [g, [m, As], [f, D]],
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
    [g, [m, Ei], [f, G]],
    [
      /droid [\d\.]+; (fp\du?)(?: b|\))/i
      // Fairphone
    ],
    [g, [m, "Fairphone"], [f, D]],
    [
      /((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i
      // Nvidia Tablets
    ],
    [g, [m, Ti], [f, G]],
    [
      /(sprint) (\w+)/i
      // Sprint Phones
    ],
    [m, g, [f, D]],
    [
      /(kin\.[onetw]{3})/i
      // Microsoft Kin
    ],
    [[g, /\./g, " "], [m, Ei], [f, D]],
    [
      /droid.+; ([c6]+|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
      // Zebra
    ],
    [g, [m, Ci], [f, G]],
    [
      /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
    ],
    [g, [m, Ci], [f, D]],
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
    [[g, /^/, "SmartTV"], [m, hn], [f, ie]],
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
    [[m, Gn], [f, ie]],
    [
      /(apple) ?tv/i
      // Apple TV
    ],
    [m, [g, It + " TV"], [f, ie]],
    [
      /crkey.*devicetype\/chromecast/i
      // Google Chromecast Third Generation
    ],
    [[g, lt + " Third Generation"], [m, xt], [f, ie]],
    [
      /crkey.*devicetype\/([^/]*)/i
      // Google Chromecast with specific device type
    ],
    [[g, /^/, "Chromecast "], [m, xt], [f, ie]],
    [
      /fuchsia.*crkey/i
      // Google Chromecast Nest Hub
    ],
    [[g, lt + " Nest Hub"], [m, xt], [f, ie]],
    [
      /crkey/i
      // Google Chromecast, Linux-based or unknown
    ],
    [[g, lt], [m, xt], [f, ie]],
    [
      /(portaltv)/i
      // Facebook Portal TV
    ],
    [g, [m, Oi], [f, ie]],
    [
      /droid.+aft(\w+)( bui|\))/i
      // Fire TV
    ],
    [g, [m, jn], [f, ie]],
    [
      /(shield \w+ tv)/i
      // Nvidia Shield TV
    ],
    [g, [m, Ti], [f, ie]],
    [
      /\(dtv[\);].+(aquos)/i,
      /(aquos-tv[\w ]+)\)/i
      // Sharp
    ],
    [g, [m, Ls], [f, ie]],
    [
      /(bravia[\w ]+)( bui|\))/i
      // Sony
    ],
    [g, [m, dn], [f, ie]],
    [
      /(mi(tv|box)-?\w+) bui/i
      // Xiaomi
    ],
    [g, [m, Ri], [f, ie]],
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
    [[m, /.+\/(\w+)/, "$1", $e, { LG: "lge" }], [g, ti], [f, ie]],
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
    [g, [m, dn], [f, wn]],
    [
      /\b(xbox(?: one)?(?!; xbox))[\); ]/i
      // Microsoft Xbox
    ],
    [g, [m, Ei], [f, wn]],
    [
      /(ouya)/i,
      // Ouya
      /(nintendo) (\w+)/i,
      // Nintendo
      /(retroid) (pocket ([^\)]+))/i
      // Retroid Pocket
    ],
    [m, g, [f, wn]],
    [
      /droid.+; (shield)( bui|\))/i
      // Nvidia Portable
    ],
    [g, [m, Ti], [f, wn]],
    [
      ///////////////////
      // WEARABLES
      ///////////////////
      /\b(sm-[lr]\d\d[0156][fnuw]?s?|gear live)\b/i
      // Samsung Galaxy Watch
    ],
    [g, [m, hn], [f, He]],
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
    [g, [m, Ai], [f, He]],
    [
      /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i
      // Apple Watch
    ],
    [g, [m, It], [f, He]],
    [
      /(opwwe\d{3})/i
      // OnePlus Watch
    ],
    [g, [m, Ms], [f, He]],
    [
      /(moto 360)/i
      // Motorola 360
    ],
    [g, [m, Si], [f, He]],
    [
      /(smartwatch 3)/i
      // Sony SmartWatch
    ],
    [g, [m, dn], [f, He]],
    [
      /(g watch r)/i
      // LG G Watch R
    ],
    [g, [m, Gn], [f, He]],
    [
      /droid.+; (wt63?0{2,3})\)/i
    ],
    [g, [m, Ci], [f, He]],
    [
      ///////////////////
      // XR
      ///////////////////
      /droid.+; (glass) \d/i
      // Google Glass
    ],
    [g, [m, xt], [f, Vn]],
    [
      /(pico) (4|neo3(?: link|pro)?)/i
      // Pico
    ],
    [m, g, [f, Vn]],
    [
      /(quest( \d| pro)?s?).+vr/i
      // Meta Quest
    ],
    [g, [m, Oi], [f, Vn]],
    [
      /mobile vr; rv.+firefox/i
      // Unidentifiable VR device using Firefox Reality / Wolvic
    ],
    [[f, Vn]],
    [
      ///////////////////
      // EMBEDDED
      ///////////////////
      /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i
      // Tesla
    ],
    [m, [f, bn]],
    [
      /(aeobc)\b/i
      // Echo Dot
    ],
    [g, [m, jn], [f, bn]],
    [
      /(homepod).+mac os/i
      // Apple HomePod
    ],
    [g, [m, It], [f, bn]],
    [
      /windows iot/i
      // Unidentifiable embedded device using Windows IoT
    ],
    [[f, bn]],
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
    [y, [b, Yn + "HTML"]],
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
    [[b, /N/, "R"], [y, $e, Ns]],
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
    [[y, /(;|\))/g, "", $e, Ns], [b, Fi]],
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
    [y, [b, Rs]],
    [
      /(?:symbian ?os|symbos|s60(?=;)|series ?60)[-\/ ]?([\w\.]*)/i
      // Symbian
    ],
    [y, [b, "Symbian"]],
    [
      /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
      // Firefox OS
    ],
    [y, [b, pn + " OS"]],
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
    [[y, $e, { 25: "120", 24: "108", 23: "94", 22: "87", 6: "79", 5: "68", 4: "53", 3: "38", 2: "538", 1: "537", "*": "TV" }], [b, "webOS"]],
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
}, Wn = (function() {
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
})(), ha = function(n, e) {
  var t = Wn.init[e], i = Wn.isIgnore[e] || 0, s = Wn.isIgnoreRgx[e] || 0, r = Wn.toString[e] || 0;
  function c() {
    Je.call(this, t);
  }
  return c.prototype.getItem = function() {
    return n;
  }, c.prototype.withClientHints = function() {
    return ct ? ct.getHighEntropyValues(sr).then(function(a) {
      return n.setCH(new rr(a, !1)).parseCH().get();
    }) : n.parseCH().get();
  }, c.prototype.withFeatureCheck = function() {
    return n.detectFeature().get();
  }, e != Pt && (c.prototype.is = function(a) {
    var h = !1;
    for (var u in this)
      if (this.hasOwnProperty(u) && !Vi(i, u) && Qe(s ? Ht(s, this[u]) : this[u]) == Qe(s ? Ht(s, a) : a)) {
        if (h = !0, a != ut) break;
      } else if (a == ut && h) {
        h = !h;
        break;
      }
    return h;
  }, c.prototype.toString = function() {
    var a = Ut;
    for (var h in r)
      typeof this[r[h]] !== ut && (a += (a ? " " : Ut) + this[r[h]]);
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
function rr(n, e) {
  if (n = n || {}, Je.call(this, sr), e)
    Je.call(this, [
      [Ji, Mi(n[ht])],
      [es, Mi(n[ta])],
      [D, /\?1/.test(n[ra])],
      [g, mn(n[oa])],
      [Nt, mn(n[ir])],
      [ts, mn(n[aa])],
      [be, mn(n[na])],
      [kt, Mi(n[sa])],
      [oi, mn(n[ia])]
    ]);
  else
    for (var t in n)
      this.hasOwnProperty(t) && typeof n[t] !== ut && (this[t] = n[t]);
}
function zs(n, e, t, i) {
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
          ye.brave && typeof ye.brave.isBrave == Jn && this.set(b, "Brave");
          break;
        case Fe:
          !this.get(f) && ct && ct[D] && this.set(f, D), this.get(g) == "Macintosh" && ye && typeof ye.standalone !== ut && ye.maxTouchPoints && ye.maxTouchPoints > 2 && this.set(g, "iPad").set(f, G);
          break;
        case Ae:
          !this.get(b) && ct && ct[Nt] && this.set(b, ct[Nt]);
          break;
        case Pt:
          var s = this.data, r = function(c) {
            return s[c].getItem().detectFeature().get();
          };
          this.set(we, r(we)).set(Ye, r(Ye)).set(Fe, r(Fe)).set(De, r(De)).set(Ae, r(Ae));
      }
    return this;
  }, this.parseUA = function() {
    return this.itemType != Pt && Ii.call(this.data, this.ua, this.rgxMap), this.itemType == we && this.set(xn, Li(this.get(y))), this;
  }, this.parseCH = function() {
    var s = this.uaCH, r = this.rgxMap;
    switch (this.itemType) {
      case we:
      case De:
        var c = s[es] || s[Ji], a;
        if (c)
          for (var h in c) {
            var u = c[h].brand || c[h], p = c[h].version;
            this.itemType == we && !/not.a.brand/i.test(u) && (!a || /Chrom/.test(a) && u != Ds || a == Yn && /WebView2/.test(u)) && (u = $e(u, ua), a = this.get(b), a && !/Chrom/.test(a) && /Chrom/.test(u) || this.set(b, u).set(y, p).set(xn, Li(p)), a = u), this.itemType == De && u == Ds && this.set(y, p);
          }
        break;
      case Ye:
        var O = s[be];
        O && (O && s[oi] == "64" && (O += "64"), Ii.call(this.data, O + ";", r));
        break;
      case Fe:
        if (s[D] && this.set(f, D), s[g] && (this.set(g, s[g]), !this.get(f) || !this.get(m))) {
          var k = {};
          Ii.call(k, "droid 9; " + s[g] + ")", r), !this.get(f) && k.type && this.set(f, k.type), !this.get(m) && k.vendor && this.set(m, k.vendor);
        }
        if (s[kt]) {
          var H;
          if (typeof s[kt] != "string")
            for (var P = 0; !H && P < s[kt].length; )
              H = $e(s[kt][P++], Bs);
          else
            H = $e(s[kt], Bs);
          this.set(f, H);
        }
        break;
      case Ae:
        var M = s[Nt];
        if (M) {
          var Se = s[ts];
          M == Fi && (Se = parseInt(Li(Se), 10) >= 13 ? "11" : "10"), this.set(b, M).set(y, Se);
        }
        this.get(b) == Fi && s[g] == "Xbox" && this.set(b, "Xbox").set(y, void 0);
        break;
      case Pt:
        var xe = this.data, ae = function(me) {
          return xe[me].getItem().setCH(s).parseCH().get();
        };
        this.set(we, ae(we)).set(Ye, ae(Ye)).set(Fe, ae(Fe)).set(De, ae(De)).set(Ae, ae(Ae));
    }
    return this;
  }, Je.call(this, [
    ["itemType", n],
    ["ua", e],
    ["uaCH", i],
    ["rgxMap", t],
    ["data", ha(this, n)]
  ]), this;
}
function et(n, e, t) {
  if (typeof n === zt ? (ei(n, !0) ? (typeof e === zt && (t = e), e = n) : (t = n, e = void 0), n = void 0) : typeof n === $i && !ei(e, !0) && (t = e, e = void 0), t && typeof t.append === Jn) {
    var i = {};
    t.forEach(function(h, u) {
      i[u] = h;
    }), t = i;
  }
  if (!(this instanceof et))
    return new et(n, e, t).getResult();
  var s = typeof n === $i ? n : (
    // Passed user-agent string
    t && t[Ss] ? t[Ss] : (
      // User-Agent from passed headers
      ye && ye.userAgent ? ye.userAgent : (
        // navigator.userAgent
        Ut
      )
    )
  ), r = new rr(t, !0), c = e ? ca(Us, e) : Us, a = function(h) {
    return h == Pt ? function() {
      return new zs(h, s, c, r).set("ua", s).set(we, this.getBrowser()).set(Ye, this.getCPU()).set(Fe, this.getDevice()).set(De, this.getEngine()).set(Ae, this.getOS()).get();
    } : function() {
      return new zs(h, s, c[h], r).parseUA().get();
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
      return $t(h) && (s = h.length > Hi ? ti(h, Hi) : h), this;
    }]
  ]).setUA(s), this;
}
et.VERSION = ea;
et.BROWSER = ai([b, y, xn, f]);
et.CPU = ai([be]);
et.DEVICE = ai([g, m, f, wn, D, ie, G, He, bn]);
et.ENGINE = et.OS = ai([b, y]);
class da {
  static isValidDevice() {
    return !new et().getDevice().type;
  }
}
function _t() {
  return Bt(performance.now());
}
async function fa(n, e, t = null, i = []) {
  t || (t = (M) => {
  });
  let s = i;
  const r = n.nodekit_version;
  let c = new Ko();
  if (!da.isValidDevice()) {
    const M = new Error("Unsupported device. Please use a desktop browser.");
    throw c.showErrorMessageOverlay(M), M;
  }
  c.showConnectingOverlay();
  for (const M of e)
    c.boardViewsUI.assetManager.registerAsset(M);
  c.hideConnectingOverlay(), await c.playStartScreen();
  const a = {
    timestamp_event: _t(),
    event_type: "StartEvent",
    nodekit_version: r
  };
  s.push(a), t(a);
  function h() {
    if (document.visibilityState === "hidden") {
      const M = {
        timestamp_event: _t(),
        event_type: "LeaveEvent",
        nodekit_version: r
      };
      s.push(M), t(M);
    } else if (document.visibilityState === "visible") {
      const M = {
        timestamp_event: _t(),
        event_type: "ReturnEvent",
        nodekit_version: r
      };
      s.push(M), t(M);
    }
  }
  document.addEventListener("visibilitychange", h);
  const u = Jo(), p = {
    timestamp_event: _t(),
    event_type: "BrowserContextEvent",
    user_agent: u.userAgent,
    viewport_width_px: u.viewportWidthPx,
    viewport_height_px: u.viewportHeightPx,
    display_width_px: u.displayWidthPx,
    display_height_px: u.displayHeightPx,
    nodekit_version: r
  };
  s.push(p), t(p);
  const O = n.nodes;
  for (let M = 0; M < O.length; M++) {
    const Se = O[M], xe = await c.prepare(Se);
    let ae = await c.play(xe);
    const me = {
      timestamp_event: _t(),
      event_type: "NodeResultEvent",
      node_index: M,
      timestamp_node_start: ae.timestamp_start,
      timestamp_node_end: ae.timestamp_end,
      sensor_index: ae.sensor_index,
      action: ae.action,
      nodekit_version: r
    };
    s.push(me), t(me), c.setProgressBar((M + 1) / O.length * 100);
  }
  const k = Qo(
    s,
    n
  );
  let H = "";
  if (k > 0 && (H = `Bonus: ${k} USD (pending validation)`), await c.playEndScreen(H), H !== "") {
    const M = {
      timestamp_event: _t(),
      event_type: "BonusDisclosureEvent",
      bonus_amount_usd: k.toFixed(2),
      nodekit_version: r
    };
    s.push(M), t(M);
  }
  const P = {
    timestamp_event: _t(),
    event_type: "EndEvent",
    nodekit_version: r
  };
  return s.push(P), t(P), document.removeEventListener("visibilitychange", h), c.showConsoleMessageOverlay(
    "Events",
    s
  ), s;
}
export {
  fa as play
};
