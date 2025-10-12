class pa {
  constructor() {
    this.startTime = null;
  }
  start() {
    this.startTime = performance.now();
  }
  now() {
    if (this.startTime === null)
      throw new Error("Clock has not been started. Call start() before calling convertToTimeElapsedMsec().");
    let e = performance.now() - this.startTime;
    return e = Math.round(e), e;
  }
  checkClockStarted() {
    return this.startTime !== null;
  }
}
function fa() {
  return {
    userAgent: navigator.userAgent,
    viewportWidthPx: window.innerWidth,
    viewportHeightPx: window.innerHeight,
    displayWidthPx: screen.width,
    displayHeightPx: screen.height,
    devicePixelRatio: window.devicePixelRatio
  };
}
var ga = "2.0.4", Pi = 500, ds = "user-agent", Kt = "", ps = "?", sr = "function", Rt = "undefined", Zt = "object", Mi = "string", Oe = "browser", ut = "cpu", rt = "device", We = "engine", ze = "os", Xt = "result", v = "name", m = "type", b = "vendor", x = "version", Ne = "architecture", In = "major", w = "model", Tn = "console", Y = "mobile", he = "tablet", ye = "smarttv", et = "wearable", Wn = "xr", An = "embedded", pn = "inapp", qi = "brands", Mt = "formFactors", Gi = "fullVersionList", Yt = "platform", ji = "platformVersion", hr = "bitness", Tt = "sec-ch-ua", ma = Tt + "-full-version-list", wa = Tt + "-arch", ba = Tt + "-" + hr, Ea = Tt + "-form-factors", va = Tt + "-" + Y, ya = Tt + "-" + w, Mo = Tt + "-" + Yt, xa = Mo + "-version", $o = [qi, Gi, Y, w, Yt, ji, Ne, Mt, hr], Xn = "Amazon", Vt = "Apple", fs = "ASUS", gs = "BlackBerry", Pt = "Google", ms = "Huawei", Rr = "Lenovo", ws = "Honor", Yn = "LG", Tr = "Microsoft", Ar = "Motorola", Cr = "Nvidia", bs = "OnePlus", Ir = "OPPO", fn = "Samsung", Es = "Sharp", gn = "Sony", Lr = "Xiaomi", Or = "Zebra", vs = "Chrome", ys = "Chromium", St = "Chromecast", nr = "Edge", mn = "Firefox", wn = "Opera", Nr = "Facebook", xs = "Sogou", Wt = "Mobile ", bn = " Browser", $i = "Windows", ka = typeof window !== Rt, Pe = ka && window.navigator ? window.navigator : void 0, _t = Pe && Pe.userAgentData ? Pe.userAgentData : void 0, Sa = function(n, e) {
  var t = {}, r = e;
  if (!or(e)) {
    r = {};
    for (var i in e)
      for (var o in e[i])
        r[o] = e[i][o].concat(r[o] ? r[o] : []);
  }
  for (var s in n)
    t[s] = r[s] && r[s].length % 2 === 0 ? r[s].concat(n[s]) : n[s];
  return t;
}, dr = function(n) {
  for (var e = {}, t = 0; t < n.length; t++)
    e[n[t].toUpperCase()] = n[t];
  return e;
}, Di = function(n, e) {
  if (typeof n === Zt && n.length > 0) {
    for (var t in n)
      if (ht(e) == ht(n[t])) return !0;
    return !1;
  }
  return Jt(n) ? ht(e) == ht(n) : !1;
}, or = function(n, e) {
  for (var t in n)
    return /^(browser|cpu|device|engine|os)$/.test(t) || (e ? or(n[t]) : !1);
}, Jt = function(n) {
  return typeof n === Mi;
}, Pr = function(n) {
  if (n) {
    for (var e = [], t = Qt(/\\?\"/g, n).split(","), r = 0; r < t.length; r++)
      if (t[r].indexOf(";") > -1) {
        var i = ar(t[r]).split(";v=");
        e[r] = { brand: i[0], version: i[1] };
      } else
        e[r] = ar(t[r]);
    return e;
  }
}, ht = function(n) {
  return Jt(n) ? n.toLowerCase() : n;
}, Mr = function(n) {
  return Jt(n) ? Qt(/[^\d\.]/g, n).split(".")[0] : void 0;
}, dt = function(n) {
  for (var e in n) {
    var t = n[e];
    typeof t == Zt && t.length == 2 ? this[t[0]] = t[1] : this[t] = void 0;
  }
  return this;
}, Qt = function(n, e) {
  return Jt(e) ? e.replace(n, Kt) : e;
}, En = function(n) {
  return Qt(/\\?\"/g, n);
}, ar = function(n, e) {
  if (Jt(n))
    return n = Qt(/^\s\s*/, n), typeof e === Rt ? n : n.substring(0, Pi);
}, $r = function(n, e) {
  if (!(!n || !e))
    for (var t = 0, r, i, o, s, a, c; t < e.length && !a; ) {
      var l = e[t], u = e[t + 1];
      for (r = i = 0; r < l.length && !a && l[r]; )
        if (a = l[r++].exec(n), a)
          for (o = 0; o < u.length; o++)
            c = a[++i], s = u[o], typeof s === Zt && s.length > 0 ? s.length === 2 ? typeof s[1] == sr ? this[s[0]] = s[1].call(this, c) : this[s[0]] = s[1] : s.length >= 3 && (typeof s[1] === sr && !(s[1].exec && s[1].test) ? s.length > 3 ? this[s[0]] = c ? s[1].apply(this, s.slice(2)) : void 0 : this[s[0]] = c ? s[1].call(this, c, s[2]) : void 0 : s.length == 3 ? this[s[0]] = c ? c.replace(s[1], s[2]) : void 0 : s.length == 4 ? this[s[0]] = c ? s[3].call(this, c.replace(s[1], s[2])) : void 0 : s.length > 4 && (this[s[0]] = c ? s[3].apply(this, [c.replace(s[1], s[2])].concat(s.slice(4))) : void 0)) : this[s] = c || void 0;
      t += 2;
    }
}, nt = function(n, e) {
  for (var t in e)
    if (typeof e[t] === Zt && e[t].length > 0) {
      for (var r = 0; r < e[t].length; r++)
        if (Di(e[t][r], n))
          return t === ps ? void 0 : t;
    } else if (Di(e[t], n))
      return t === ps ? void 0 : t;
  return e.hasOwnProperty("*") ? e["*"] : n;
}, ks = {
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
}, Ss = {
  embedded: "Automotive",
  mobile: "Mobile",
  tablet: ["Tablet", "EInk"],
  smarttv: "TV",
  wearable: "Watch",
  xr: ["VR", "XR"],
  "?": ["Desktop", "Unknown"],
  "*": void 0
}, _a = {
  Chrome: "Google Chrome",
  Edge: "Microsoft Edge",
  "Edge WebView2": "Microsoft Edge WebView2",
  "Chrome WebView": "Android WebView",
  "Chrome Headless": "HeadlessChrome",
  "Huawei Browser": "HuaweiBrowser",
  "MIUI Browser": "Miui Browser",
  "Opera Mobi": "OperaMobile",
  Yandex: "YaBrowser"
}, _s = {
  browser: [
    [
      // Most common regardless engine
      /\b(?:crmo|crios)\/([\w\.]+)/i
      // Chrome for Android/iOS
    ],
    [x, [v, Wt + "Chrome"]],
    [
      /webview.+edge\/([\w\.]+)/i
      // Microsoft Edge
    ],
    [x, [v, nr + " WebView"]],
    [
      /edg(?:e|ios|a)?\/([\w\.]+)/i
    ],
    [x, [v, "Edge"]],
    [
      // Presto based
      /(opera mini)\/([-\w\.]+)/i,
      // Opera Mini
      /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
      // Opera Mobi/Tablet
      /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i
      // Opera
    ],
    [v, x],
    [
      /opios[\/ ]+([\w\.]+)/i
      // Opera mini on iphone >= 8.0
    ],
    [x, [v, wn + " Mini"]],
    [
      /\bop(?:rg)?x\/([\w\.]+)/i
      // Opera GX
    ],
    [x, [v, wn + " GX"]],
    [
      /\bopr\/([\w\.]+)/i
      // Opera Webkit
    ],
    [x, [v, wn]],
    [
      // Mixed
      /\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i
      // Baidu
    ],
    [x, [v, "Baidu"]],
    [
      /\b(?:mxbrowser|mxios|myie2)\/?([-\w\.]*)\b/i
      // Maxthon
    ],
    [x, [v, "Maxthon"]],
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
    [v, x],
    [
      /quark(?:pc)?\/([-\w\.]+)/i
      // Quark
    ],
    [x, [v, "Quark"]],
    [
      /\bddg\/([\w\.]+)/i
      // DuckDuckGo
    ],
    [x, [v, "DuckDuckGo"]],
    [
      /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i
      // UCBrowser
    ],
    [x, [v, "UCBrowser"]],
    [
      /microm.+\bqbcore\/([\w\.]+)/i,
      // WeChat Desktop for Windows Built-in Browser
      /\bqbcore\/([\w\.]+).+microm/i,
      /micromessenger\/([\w\.]+)/i
      // WeChat
    ],
    [x, [v, "WeChat"]],
    [
      /konqueror\/([\w\.]+)/i
      // Konqueror
    ],
    [x, [v, "Konqueror"]],
    [
      /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i
      // IE11
    ],
    [x, [v, "IE"]],
    [
      /ya(?:search)?browser\/([\w\.]+)/i
      // Yandex
    ],
    [x, [v, "Yandex"]],
    [
      /slbrowser\/([\w\.]+)/i
      // Smart Lenovo Browser
    ],
    [x, [v, "Smart " + Rr + bn]],
    [
      /(avast|avg)\/([\w\.]+)/i
      // Avast/AVG Secure Browser
    ],
    [[v, /(.+)/, "$1 Secure" + bn], x],
    [
      /\bfocus\/([\w\.]+)/i
      // Firefox Focus
    ],
    [x, [v, mn + " Focus"]],
    [
      /\bopt\/([\w\.]+)/i
      // Opera Touch
    ],
    [x, [v, wn + " Touch"]],
    [
      /coc_coc\w+\/([\w\.]+)/i
      // Coc Coc Browser
    ],
    [x, [v, "Coc Coc"]],
    [
      /dolfin\/([\w\.]+)/i
      // Dolphin
    ],
    [x, [v, "Dolphin"]],
    [
      /coast\/([\w\.]+)/i
      // Opera Coast
    ],
    [x, [v, wn + " Coast"]],
    [
      /miuibrowser\/([\w\.]+)/i
      // MIUI Browser
    ],
    [x, [v, "MIUI" + bn]],
    [
      /fxios\/([\w\.-]+)/i
      // Firefox for iOS
    ],
    [x, [v, Wt + mn]],
    [
      /\bqihoobrowser\/?([\w\.]*)/i
      // 360
    ],
    [x, [v, "360"]],
    [
      /\b(qq)\/([\w\.]+)/i
      // QQ
    ],
    [[v, /(.+)/, "$1Browser"], x],
    [
      /(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i
    ],
    [[v, /(.+)/, "$1" + bn], x],
    [
      // Oculus/Sailfish/HuaweiBrowser/VivoBrowser/PicoBrowser
      /samsungbrowser\/([\w\.]+)/i
      // Samsung Internet
    ],
    [x, [v, fn + " Internet"]],
    [
      /metasr[\/ ]?([\d\.]+)/i
      // Sogou Explorer
    ],
    [x, [v, xs + " Explorer"]],
    [
      /(sogou)mo\w+\/([\d\.]+)/i
      // Sogou Mobile
    ],
    [[v, xs + " Mobile"], x],
    [
      /(electron)\/([\w\.]+) safari/i,
      // Electron-based App
      /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
      // Tesla
      /m?(qqbrowser|2345(?=browser|chrome|explorer))\w*[\/ ]?v?([\w\.]+)/i
      // QQ/2345
    ],
    [v, x],
    [
      /(lbbrowser|rekonq)/i
      // LieBao Browser/Rekonq
    ],
    [v],
    [
      /ome\/([\w\.]+) \w* ?(iron) saf/i,
      // Iron
      /ome\/([\w\.]+).+qihu (360)[es]e/i
      // 360
    ],
    [x, v],
    [
      // WebView
      /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i
      // Facebook App for iOS & Android
    ],
    [[v, Nr], x, [m, pn]],
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
    [v, x, [m, pn]],
    [
      /\bgsa\/([\w\.]+) .*safari\//i
      // Google Search Appliance on iOS
    ],
    [x, [v, "GSA"], [m, pn]],
    [
      /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i
      // TikTok
    ],
    [x, [v, "TikTok"], [m, pn]],
    [
      /\[(linkedin)app\]/i
      // LinkedIn App for iOS & Android
    ],
    [v, [m, pn]],
    [
      /(chromium)[\/ ]([-\w\.]+)/i
      // Chromium
    ],
    [v, x],
    [
      /headlesschrome(?:\/([\w\.]+)| )/i
      // Chrome Headless
    ],
    [x, [v, vs + " Headless"]],
    [
      /wv\).+chrome\/([\w\.]+).+edgw\//i
      // Edge WebView2
    ],
    [x, [v, nr + " WebView2"]],
    [
      / wv\).+(chrome)\/([\w\.]+)/i
      // Chrome WebView
    ],
    [[v, vs + " WebView"], x],
    [
      /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
      // Android Browser
    ],
    [x, [v, "Android" + bn]],
    [
      /chrome\/([\w\.]+) mobile/i
      // Chrome Mobile
    ],
    [x, [v, Wt + "Chrome"]],
    [
      /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
      // Chrome/OmniWeb/Arora/Tizen/Nokia
    ],
    [v, x],
    [
      /version\/([\w\.\,]+) .*mobile(?:\/\w+ | ?)safari/i
      // Safari Mobile
    ],
    [x, [v, Wt + "Safari"]],
    [
      /iphone .*mobile(?:\/\w+ | ?)safari/i
    ],
    [[v, Wt + "Safari"]],
    [
      /version\/([\w\.\,]+) .*(safari)/i
      // Safari
    ],
    [x, v],
    [
      /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i
      // Safari < 3.0
    ],
    [v, [x, "1"]],
    [
      /(webkit|khtml)\/([\w\.]+)/i
    ],
    [v, x],
    [
      // Gecko based
      /(?:mobile|tablet);.*(firefox)\/([\w\.-]+)/i
      // Firefox Mobile
    ],
    [[v, Wt + mn], x],
    [
      /(navigator|netscape\d?)\/([-\w\.]+)/i
      // Netscape
    ],
    [[v, "Netscape"], x],
    [
      /(wolvic|librewolf)\/([\w\.]+)/i
      // Wolvic/LibreWolf
    ],
    [v, x],
    [
      /mobile vr; rv:([\w\.]+)\).+firefox/i
      // Firefox Reality
    ],
    [x, [v, mn + " Reality"]],
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
    [v, [x, /_/g, "."]],
    [
      /(cobalt)\/([\w\.]+)/i
      // Cobalt
    ],
    [v, [x, /[^\d\.]+./, Kt]]
  ],
  cpu: [
    [
      /\b((amd|x|x86[-_]?|wow|win)64)\b/i
      // AMD64 (x64)
    ],
    [[Ne, "amd64"]],
    [
      /(ia32(?=;))/i,
      // IA32 (quicktime)
      /\b((i[346]|x)86)(pc)?\b/i
      // IA32 (x86)
    ],
    [[Ne, "ia32"]],
    [
      /\b(aarch64|arm(v?[89]e?l?|_?64))\b/i
      // ARM64
    ],
    [[Ne, "arm64"]],
    [
      /\b(arm(v[67])?ht?n?[fl]p?)\b/i
      // ARMHF
    ],
    [[Ne, "armhf"]],
    [
      // PocketPC mistakenly identified as PowerPC
      /( (ce|mobile); ppc;|\/[\w\.]+arm\b)/i
    ],
    [[Ne, "arm"]],
    [
      /((ppc|powerpc)(64)?)( mac|;|\))/i
      // PowerPC
    ],
    [[Ne, /ower/, Kt, ht]],
    [
      / sun4\w[;\)]/i
      // SPARC
    ],
    [[Ne, "sparc"]],
    [
      /\b(avr32|ia64(?=;)|68k(?=\))|\barm(?=v([1-7]|[5-7]1)l?|;|eabi)|(irix|mips|sparc)(64)?\b|pa-risc)/i
      // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
    ],
    [[Ne, ht]]
  ],
  device: [
    [
      //////////////////////////
      // MOBILES & TABLETS
      /////////////////////////
      // Samsung
      /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
    ],
    [w, [b, fn], [m, he]],
    [
      /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
      /samsung[- ]((?!sm-[lr]|browser)[-\w]+)/i,
      /sec-(sgh\w+)/i
    ],
    [w, [b, fn], [m, Y]],
    [
      // Apple
      /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i
      // iPod/iPhone
    ],
    [w, [b, Vt], [m, Y]],
    [
      /\((ipad);[-\w\),; ]+apple/i,
      // iPad
      /applecoremedia\/[\w\.]+ \((ipad)/i,
      /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
    ],
    [w, [b, Vt], [m, he]],
    [
      /(macintosh);/i
    ],
    [w, [b, Vt]],
    [
      // Sharp
      /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
    ],
    [w, [b, Es], [m, Y]],
    [
      // Honor
      /\b((?:brt|eln|hey2?|gdi|jdn)-a?[lnw]09|(?:ag[rm]3?|jdn2|kob2)-a?[lw]0[09]hn)(?: bui|\)|;)/i
    ],
    [w, [b, ws], [m, he]],
    [
      /honor([-\w ]+)[;\)]/i
    ],
    [w, [b, ws], [m, Y]],
    [
      // Huawei
      /\b((?:ag[rs][2356]?k?|bah[234]?|bg[2o]|bt[kv]|cmr|cpn|db[ry]2?|jdn2|got|kob2?k?|mon|pce|scm|sht?|[tw]gr|vrd)-[ad]?[lw][0125][09]b?|605hw|bg2-u03|(?:gem|fdr|m2|ple|t1)-[7a]0[1-4][lu]|t1-a2[13][lw]|mediapad[\w\. ]*(?= bui|\)))\b(?!.+d\/s)/i
    ],
    [w, [b, ms], [m, he]],
    [
      /(?:huawei)([-\w ]+)[;\)]/i,
      /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
    ],
    [w, [b, ms], [m, Y]],
    [
      // Xiaomi
      /oid[^\)]+; (2[\dbc]{4}(182|283|rp\w{2})[cgl]|m2105k81a?c)(?: bui|\))/i,
      /\b((?:red)?mi[-_ ]?pad[\w- ]*)(?: bui|\))/i
      // Mi Pad tablets
    ],
    [[w, /_/g, " "], [b, Lr], [m, he]],
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
    [[w, /_/g, " "], [b, Lr], [m, Y]],
    [
      // OnePlus
      /droid.+; (cph2[3-6]\d[13579]|((gm|hd)19|(ac|be|in|kb)20|(d[en]|eb|le|mt)21|ne22)[0-2]\d|p[g-k]\w[1m]10)\b/i,
      /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
    ],
    [w, [b, bs], [m, Y]],
    [
      // OPPO
      /; (\w+) bui.+ oppo/i,
      /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
    ],
    [w, [b, Ir], [m, Y]],
    [
      /\b(opd2(\d{3}a?))(?: bui|\))/i
    ],
    [w, [b, nt, { OnePlus: ["203", "304", "403", "404", "413", "415"], "*": Ir }], [m, he]],
    [
      // BLU
      /(vivo (5r?|6|8l?|go|one|s|x[il]?[2-4]?)[\w\+ ]*)(?: bui|\))/i
      // Vivo series
    ],
    [w, [b, "BLU"], [m, Y]],
    [
      // Vivo
      /; vivo (\w+)(?: bui|\))/i,
      /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
    ],
    [w, [b, "Vivo"], [m, Y]],
    [
      // Realme
      /\b(rmx[1-3]\d{3})(?: bui|;|\))/i
    ],
    [w, [b, "Realme"], [m, Y]],
    [
      // Lenovo
      /(ideatab[-\w ]+|602lv|d-42a|a101lv|a2109a|a3500-hv|s[56]000|pb-6505[my]|tb-?x?\d{3,4}(?:f[cu]|xu|[av])|yt\d?-[jx]?\d+[lfmx])( bui|;|\)|\/)/i,
      /lenovo ?(b[68]0[08]0-?[hf]?|tab(?:[\w- ]+?)|tb[\w-]{6,7})( bui|;|\)|\/)/i
    ],
    [w, [b, Rr], [m, he]],
    [
      /lenovo[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i
    ],
    [w, [b, Rr], [m, Y]],
    [
      // Motorola
      /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
      /\bmot(?:orola)?[- ]([\w\s]+)(\)| bui)/i,
      /((?:moto(?! 360)[-\w\(\) ]+|xt\d{3,4}[cgkosw\+]?[-\d]*|nexus 6)(?= bui|\)))/i
    ],
    [w, [b, Ar], [m, Y]],
    [
      /\b(mz60\d|xoom[2 ]{0,2}) build\//i
    ],
    [w, [b, Ar], [m, he]],
    [
      // LG
      /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
    ],
    [w, [b, Yn], [m, he]],
    [
      /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
      /\blg[-e;\/ ]+(?!.*(?:browser|netcast|android tv|watch|webos))(\w+)/i,
      /\blg-?([\d\w]+) bui/i
    ],
    [w, [b, Yn], [m, Y]],
    [
      // Nokia
      /(nokia) (t[12][01])/i
    ],
    [b, w, [m, he]],
    [
      /(?:maemo|nokia).*(n900|lumia \d+|rm-\d+)/i,
      /nokia[-_ ]?(([-\w\. ]*))/i
    ],
    [[w, /_/g, " "], [m, Y], [b, "Nokia"]],
    [
      // Google
      /(pixel (c|tablet))\b/i
      // Google Pixel C/Tablet
    ],
    [w, [b, Pt], [m, he]],
    [
      // Google Pixel
      /droid.+;(?: google)? (g(01[13]a|020[aem]|025[jn]|1b60|1f8f|2ybb|4s1m|576d|5nz6|8hhn|8vou|a02099|c15s|d1yq|e2ae|ec77|gh2x|kv4x|p4bc|pj41|r83y|tt9q|ur25|wvk6)|pixel[\d ]*a?( pro)?( xl)?( fold)?( \(5g\))?)( bui|\))/i
    ],
    [w, [b, Pt], [m, Y]],
    [
      /(google) (pixelbook( go)?)/i
    ],
    [b, w],
    [
      // Sony
      /droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-\w\w\d\d)(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
    ],
    [w, [b, gn], [m, Y]],
    [
      /sony tablet [ps]/i,
      /\b(?:sony)?sgp\w+(?: bui|\))/i
    ],
    [[w, "Xperia Tablet"], [b, gn], [m, he]],
    [
      // Amazon
      /(alexa)webm/i,
      /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,
      // Kindle Fire without Silk / Echo Show
      /(kf[a-z]+)( bui|\)).+silk\//i
      // Kindle Fire HD
    ],
    [w, [b, Xn], [m, he]],
    [
      /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
      // Fire Phone
    ],
    [[w, /(.+)/g, "Fire Phone $1"], [b, Xn], [m, Y]],
    [
      // BlackBerry
      /(playbook);[-\w\),; ]+(rim)/i
      // BlackBerry PlayBook
    ],
    [w, b, [m, he]],
    [
      /\b((?:bb[a-f]|st[hv])100-\d)/i,
      /\(bb10; (\w+)/i
      // BlackBerry 10
    ],
    [w, [b, gs], [m, Y]],
    [
      // Asus
      /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
    ],
    [w, [b, fs], [m, he]],
    [
      / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
    ],
    [w, [b, fs], [m, Y]],
    [
      // HTC
      /(nexus 9)/i
      // HTC Nexus 9
    ],
    [w, [b, "HTC"], [m, he]],
    [
      /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
      // HTC
      // ZTE
      /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
      /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i
      // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
    ],
    [b, [w, /_/g, " "], [m, Y]],
    [
      // TCL
      /tcl (xess p17aa)/i,
      /droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])(_\w(\w|\w\w))?(\)| bui)/i
    ],
    [w, [b, "TCL"], [m, he]],
    [
      /droid [\w\.]+; (418(?:7d|8v)|5087z|5102l|61(?:02[dh]|25[adfh]|27[ai]|56[dh]|59k|65[ah])|a509dl|t(?:43(?:0w|1[adepqu])|50(?:6d|7[adju])|6(?:09dl|10k|12b|71[efho]|76[hjk])|7(?:66[ahju]|67[hw]|7[045][bh]|71[hk]|73o|76[ho]|79w|81[hks]?|82h|90[bhsy]|99b)|810[hs]))(_\w(\w|\w\w))?(\)| bui)/i
    ],
    [w, [b, "TCL"], [m, Y]],
    [
      // itel
      /(itel) ((\w+))/i
    ],
    [[b, ht], w, [m, nt, { tablet: ["p10001l", "w7001"], "*": "mobile" }]],
    [
      // Acer
      /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
    ],
    [w, [b, "Acer"], [m, he]],
    [
      // Meizu
      /droid.+; (m[1-5] note) bui/i,
      /\bmz-([-\w]{2,})/i
    ],
    [w, [b, "Meizu"], [m, Y]],
    [
      // Ulefone
      /; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i
    ],
    [w, [b, "Ulefone"], [m, Y]],
    [
      // Energizer
      /; (energy ?\w+)(?: bui|\))/i,
      /; energizer ([\w ]+)(?: bui|\))/i
    ],
    [w, [b, "Energizer"], [m, Y]],
    [
      // Cat
      /; cat (b35);/i,
      /; (b15q?|s22 flip|s48c|s62 pro)(?: bui|\))/i
    ],
    [w, [b, "Cat"], [m, Y]],
    [
      // Smartfren
      /((?:new )?andromax[\w- ]+)(?: bui|\))/i
    ],
    [w, [b, "Smartfren"], [m, Y]],
    [
      // Nothing
      /droid.+; (a(in)?(0(15|59|6[35])|142)p?)/i
    ],
    [w, [b, "Nothing"], [m, Y]],
    [
      // Archos
      /; (x67 5g|tikeasy \w+|ac[1789]\d\w+)( b|\))/i,
      /archos ?(5|gamepad2?|([\w ]*[t1789]|hello) ?\d+[\w ]*)( b|\))/i
    ],
    [w, [b, "Archos"], [m, he]],
    [
      /archos ([\w ]+)( b|\))/i,
      /; (ac[3-6]\d\w{2,8})( b|\))/i
    ],
    [w, [b, "Archos"], [m, Y]],
    [
      // HMD
      /; (n159v)/i
    ],
    [w, [b, "HMD"], [m, Y]],
    [
      // MIXED
      /(imo) (tab \w+)/i,
      // IMO
      /(infinix|tecno) (x1101b?|p904|dp(7c|8d|10a)( pro)?|p70[1-3]a?|p904|t1101)/i
      // Infinix XPad / Tecno
    ],
    [b, w, [m, he]],
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
    [b, w, [m, Y]],
    [
      /(kobo)\s(ereader|touch)/i,
      // Kobo
      /(hp).+(touchpad(?!.+tablet)|tablet)/i,
      // HP TouchPad
      /(kindle)\/([\w\.]+)/i
      // Kindle
    ],
    [b, w, [m, he]],
    [
      /(surface duo)/i
      // Surface Duo
    ],
    [w, [b, Tr], [m, he]],
    [
      /droid [\d\.]+; (fp\du?)(?: b|\))/i
      // Fairphone
    ],
    [w, [b, "Fairphone"], [m, Y]],
    [
      /((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i
      // Nvidia Tablets
    ],
    [w, [b, Cr], [m, he]],
    [
      /(sprint) (\w+)/i
      // Sprint Phones
    ],
    [b, w, [m, Y]],
    [
      /(kin\.[onetw]{3})/i
      // Microsoft Kin
    ],
    [[w, /\./g, " "], [b, Tr], [m, Y]],
    [
      /droid.+; ([c6]+|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
      // Zebra
    ],
    [w, [b, Or], [m, he]],
    [
      /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
    ],
    [w, [b, Or], [m, Y]],
    [
      ///////////////////
      // SMARTTVS
      ///////////////////
      /smart-tv.+(samsung)/i
      // Samsung
    ],
    [b, [m, ye]],
    [
      /hbbtv.+maple;(\d+)/i
    ],
    [[w, /^/, "SmartTV"], [b, fn], [m, ye]],
    [
      /(vizio)(?: |.+model\/)(\w+-\w+)/i,
      // Vizio
      /tcast.+(lg)e?. ([-\w]+)/i
      // LG SmartTV
    ],
    [b, w, [m, ye]],
    [
      /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i
    ],
    [[b, Yn], [m, ye]],
    [
      /(apple) ?tv/i
      // Apple TV
    ],
    [b, [w, Vt + " TV"], [m, ye]],
    [
      /crkey.*devicetype\/chromecast/i
      // Google Chromecast Third Generation
    ],
    [[w, St + " Third Generation"], [b, Pt], [m, ye]],
    [
      /crkey.*devicetype\/([^/]*)/i
      // Google Chromecast with specific device type
    ],
    [[w, /^/, "Chromecast "], [b, Pt], [m, ye]],
    [
      /fuchsia.*crkey/i
      // Google Chromecast Nest Hub
    ],
    [[w, St + " Nest Hub"], [b, Pt], [m, ye]],
    [
      /crkey/i
      // Google Chromecast, Linux-based or unknown
    ],
    [[w, St], [b, Pt], [m, ye]],
    [
      /(portaltv)/i
      // Facebook Portal TV
    ],
    [w, [b, Nr], [m, ye]],
    [
      /droid.+aft(\w+)( bui|\))/i
      // Fire TV
    ],
    [w, [b, Xn], [m, ye]],
    [
      /(shield \w+ tv)/i
      // Nvidia Shield TV
    ],
    [w, [b, Cr], [m, ye]],
    [
      /\(dtv[\);].+(aquos)/i,
      /(aquos-tv[\w ]+)\)/i
      // Sharp
    ],
    [w, [b, Es], [m, ye]],
    [
      /(bravia[\w ]+)( bui|\))/i
      // Sony
    ],
    [w, [b, gn], [m, ye]],
    [
      /(mi(tv|box)-?\w+) bui/i
      // Xiaomi
    ],
    [w, [b, Lr], [m, ye]],
    [
      /Hbbtv.*(technisat) (.*);/i
      // TechniSAT
    ],
    [b, w, [m, ye]],
    [
      /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
      // Roku
      /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i
      // HbbTV devices
    ],
    [[b, /.+\/(\w+)/, "$1", nt, { LG: "lge" }], [w, ar], [m, ye]],
    [
      // SmartTV from Unidentified Vendors
      /droid.+; ([\w- ]+) (?:android tv|smart[- ]?tv)/i
    ],
    [w, [m, ye]],
    [
      /\b(android tv|smart[- ]?tv|opera tv|tv; rv:|large screen[\w ]+safari)\b/i
    ],
    [[m, ye]],
    [
      ///////////////////
      // CONSOLES
      ///////////////////
      /(playstation \w+)/i
      // Playstation
    ],
    [w, [b, gn], [m, Tn]],
    [
      /\b(xbox(?: one)?(?!; xbox))[\); ]/i
      // Microsoft Xbox
    ],
    [w, [b, Tr], [m, Tn]],
    [
      /(ouya)/i,
      // Ouya
      /(nintendo) (\w+)/i,
      // Nintendo
      /(retroid) (pocket ([^\)]+))/i
      // Retroid Pocket
    ],
    [b, w, [m, Tn]],
    [
      /droid.+; (shield)( bui|\))/i
      // Nvidia Portable
    ],
    [w, [b, Cr], [m, Tn]],
    [
      ///////////////////
      // WEARABLES
      ///////////////////
      /\b(sm-[lr]\d\d[0156][fnuw]?s?|gear live)\b/i
      // Samsung Galaxy Watch
    ],
    [w, [b, fn], [m, et]],
    [
      /((pebble))app/i,
      // Pebble
      /(asus|google|lg|oppo) ((pixel |zen)?watch[\w ]*)( bui|\))/i
      // Asus ZenWatch / LG Watch / Pixel Watch
    ],
    [b, w, [m, et]],
    [
      /(ow(?:19|20)?we?[1-3]{1,3})/i
      // Oppo Watch
    ],
    [w, [b, Ir], [m, et]],
    [
      /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i
      // Apple Watch
    ],
    [w, [b, Vt], [m, et]],
    [
      /(opwwe\d{3})/i
      // OnePlus Watch
    ],
    [w, [b, bs], [m, et]],
    [
      /(moto 360)/i
      // Motorola 360
    ],
    [w, [b, Ar], [m, et]],
    [
      /(smartwatch 3)/i
      // Sony SmartWatch
    ],
    [w, [b, gn], [m, et]],
    [
      /(g watch r)/i
      // LG G Watch R
    ],
    [w, [b, Yn], [m, et]],
    [
      /droid.+; (wt63?0{2,3})\)/i
    ],
    [w, [b, Or], [m, et]],
    [
      ///////////////////
      // XR
      ///////////////////
      /droid.+; (glass) \d/i
      // Google Glass
    ],
    [w, [b, Pt], [m, Wn]],
    [
      /(pico) (4|neo3(?: link|pro)?)/i
      // Pico
    ],
    [b, w, [m, Wn]],
    [
      /(quest( \d| pro)?s?).+vr/i
      // Meta Quest
    ],
    [w, [b, Nr], [m, Wn]],
    [
      /mobile vr; rv.+firefox/i
      // Unidentifiable VR device using Firefox Reality / Wolvic
    ],
    [[m, Wn]],
    [
      ///////////////////
      // EMBEDDED
      ///////////////////
      /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i
      // Tesla
    ],
    [b, [m, An]],
    [
      /(aeobc)\b/i
      // Echo Dot
    ],
    [w, [b, Xn], [m, An]],
    [
      /(homepod).+mac os/i
      // Apple HomePod
    ],
    [w, [b, Vt], [m, An]],
    [
      /windows iot/i
      // Unidentifiable embedded device using Windows IoT
    ],
    [[m, An]],
    [
      ////////////////////
      // MIXED (GENERIC)
      ///////////////////
      /droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+?(mobile|vr|\d) safari/i
    ],
    [w, [m, nt, { mobile: "Mobile", xr: "VR", "*": he }]],
    [
      /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i
      // Unidentifiable Tablet
    ],
    [[m, he]],
    [
      /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i
      // Unidentifiable Mobile
    ],
    [[m, Y]],
    [
      /droid .+?; ([\w\. -]+)( bui|\))/i
      // Generic Android Device
    ],
    [w, [b, "Generic"]]
  ],
  engine: [
    [
      /windows.+ edge\/([\w\.]+)/i
      // EdgeHTML
    ],
    [x, [v, nr + "HTML"]],
    [
      /(arkweb)\/([\w\.]+)/i
      // ArkWeb
    ],
    [v, x],
    [
      /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i
      // Blink
    ],
    [x, [v, "Blink"]],
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
    [v, x],
    [
      /ladybird\//i
    ],
    [[v, "LibWeb"]],
    [
      /rv\:([\w\.]{1,9})\b.+(gecko)/i
      // Gecko
    ],
    [x, v]
  ],
  os: [
    [
      // Windows
      /(windows nt) (6\.[23]); arm/i
      // Windows RT
    ],
    [[v, /N/, "R"], [x, nt, ks]],
    [
      /(windows (?:phone|mobile|iot))(?: os)?[\/ ]?([\d\.]*( se)?)/i,
      // Windows IoT/Mobile/Phone
      // Windows NT/3.1/95/98/ME/2000/XP/Vista/7/8/8.1/10/11
      /(windows)[\/ ](1[01]|2000|3\.1|7|8(\.1)?|9[58]|me|server 20\d\d( r2)?|vista|xp)/i
    ],
    [v, x],
    [
      /windows nt ?([\d\.\)]*)(?!.+xbox)/i,
      /\bwin(?=3| ?9|n)(?:nt| 9x )?([\d\.;]*)/i
    ],
    [[x, /(;|\))/g, "", nt, ks], [v, $i]],
    [
      /(windows ce)\/?([\d\.]*)/i
      // Windows CE
    ],
    [v, x],
    [
      // iOS/macOS
      /[adehimnop]{4,7}\b(?:.*os ([\w]+) like mac|; opera)/i,
      // iOS
      /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
      /cfnetwork\/.+darwin/i
    ],
    [[x, /_/g, "."], [v, "iOS"]],
    [
      /(mac os x) ?([\w\. ]*)/i,
      /(macintosh|mac_powerpc\b)(?!.+(haiku|morphos))/i
      // Mac OS
    ],
    [[v, "macOS"], [x, /_/g, "."]],
    [
      // Google Chromecast
      /android ([\d\.]+).*crkey/i
      // Google Chromecast, Android-based
    ],
    [x, [v, St + " Android"]],
    [
      /fuchsia.*crkey\/([\d\.]+)/i
      // Google Chromecast, Fuchsia-based
    ],
    [x, [v, St + " Fuchsia"]],
    [
      /crkey\/([\d\.]+).*devicetype\/smartspeaker/i
      // Google Chromecast, Linux-based Smart Speaker
    ],
    [x, [v, St + " SmartSpeaker"]],
    [
      /linux.*crkey\/([\d\.]+)/i
      // Google Chromecast, Legacy Linux-based
    ],
    [x, [v, St + " Linux"]],
    [
      /crkey\/([\d\.]+)/i
      // Google Chromecast, unknown
    ],
    [x, [v, St]],
    [
      // Mobile OSes
      /droid ([\w\.]+)\b.+(android[- ]x86)/i
      // Android-x86
    ],
    [x, v],
    [
      /(ubuntu) ([\w\.]+) like android/i
      // Ubuntu Touch
    ],
    [[v, /(.+)/, "$1 Touch"], x],
    [
      /(harmonyos)[\/ ]?([\d\.]*)/i,
      // HarmonyOS
      // Android/Blackberry/WebOS/QNX/Bada/RIM/KaiOS/Maemo/MeeGo/S40/Sailfish OS/OpenHarmony/Tizen
      /(android|bada|blackberry|kaios|maemo|meego|openharmony|qnx|rim tablet os|sailfish|series40|symbian|tizen)\w*[-\/\.; ]?([\d\.]*)/i
    ],
    [v, x],
    [
      /\(bb(10);/i
      // BlackBerry 10
    ],
    [x, [v, gs]],
    [
      /(?:symbian ?os|symbos|s60(?=;)|series ?60)[-\/ ]?([\w\.]*)/i
      // Symbian
    ],
    [x, [v, "Symbian"]],
    [
      /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
      // Firefox OS
    ],
    [x, [v, mn + " OS"]],
    [
      /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i,
      // WebOS
      /webos(?:[ \/]?|\.tv-20(?=2[2-9]))(\d[\d\.]*)/i
    ],
    [x, [v, "webOS"]],
    [
      /web0s;.+?(?:chr[o0]me|safari)\/(\d+)/i
      // https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine
    ],
    [[x, nt, { 25: "120", 24: "108", 23: "94", 22: "87", 6: "79", 5: "68", 4: "53", 3: "38", 2: "538", 1: "537", "*": "TV" }], [v, "webOS"]],
    [
      /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i
      // watchOS
    ],
    [x, [v, "watchOS"]],
    [
      // Google ChromeOS
      /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i
      // Chromium OS
    ],
    [[v, "Chrome OS"], x],
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
    [v, x],
    [
      /(sunos) ?([\d\.]*)/i
      // Solaris
    ],
    [[v, "Solaris"], x],
    [
      /\b(beos|os\/2|amigaos|openvms|hp-ux|serenityos)/i,
      // BeOS/OS2/AmigaOS/OpenVMS/HP-UX/SerenityOS
      /(unix) ?([\w\.]*)/i
      // UNIX
    ],
    [v, x]
  ]
}, Kn = (function() {
  var n = { init: {}, isIgnore: {}, isIgnoreRgx: {}, toString: {} };
  return dt.call(n.init, [
    [Oe, [v, x, In, m]],
    [ut, [Ne]],
    [rt, [m, w, b]],
    [We, [v, x]],
    [ze, [v, x]]
  ]), dt.call(n.isIgnore, [
    [Oe, [x, In]],
    [We, [x]],
    [ze, [x]]
  ]), dt.call(n.isIgnoreRgx, [
    [Oe, / ?browser$/i],
    [ze, / ?os$/i]
  ]), dt.call(n.toString, [
    [Oe, [v, x]],
    [ut, [Ne]],
    [rt, [b, w]],
    [We, [v, x]],
    [ze, [v, x]]
  ]), n;
})(), Ra = function(n, e) {
  var t = Kn.init[e], r = Kn.isIgnore[e] || 0, i = Kn.isIgnoreRgx[e] || 0, o = Kn.toString[e] || 0;
  function s() {
    dt.call(this, t);
  }
  return s.prototype.getItem = function() {
    return n;
  }, s.prototype.withClientHints = function() {
    return _t ? _t.getHighEntropyValues($o).then(function(a) {
      return n.setCH(new Do(a, !1)).parseCH().get();
    }) : n.parseCH().get();
  }, s.prototype.withFeatureCheck = function() {
    return n.detectFeature().get();
  }, e != Xt && (s.prototype.is = function(a) {
    var c = !1;
    for (var l in this)
      if (this.hasOwnProperty(l) && !Di(r, l) && ht(i ? Qt(i, this[l]) : this[l]) == ht(i ? Qt(i, a) : a)) {
        if (c = !0, a != Rt) break;
      } else if (a == Rt && c) {
        c = !c;
        break;
      }
    return c;
  }, s.prototype.toString = function() {
    var a = Kt;
    for (var c in o)
      typeof this[o[c]] !== Rt && (a += (a ? " " : Kt) + this[o[c]]);
    return a || Rt;
  }), _t || (s.prototype.then = function(a) {
    var c = this, l = function() {
      for (var p in c)
        c.hasOwnProperty(p) && (this[p] = c[p]);
    };
    l.prototype = {
      is: s.prototype.is,
      toString: s.prototype.toString
    };
    var u = new l();
    return a(u), u;
  }), new s();
};
function Do(n, e) {
  if (n = n || {}, dt.call(this, $o), e)
    dt.call(this, [
      [qi, Pr(n[Tt])],
      [Gi, Pr(n[ma])],
      [Y, /\?1/.test(n[va])],
      [w, En(n[ya])],
      [Yt, En(n[Mo])],
      [ji, En(n[xa])],
      [Ne, En(n[wa])],
      [Mt, Pr(n[Ea])],
      [hr, En(n[ba])]
    ]);
  else
    for (var t in n)
      this.hasOwnProperty(t) && typeof n[t] !== Rt && (this[t] = n[t]);
}
function Rs(n, e, t, r) {
  return this.get = function(i) {
    return i ? this.data.hasOwnProperty(i) ? this.data[i] : void 0 : this.data;
  }, this.set = function(i, o) {
    return this.data[i] = o, this;
  }, this.setCH = function(i) {
    return this.uaCH = i, this;
  }, this.detectFeature = function() {
    if (Pe && Pe.userAgent == this.ua)
      switch (this.itemType) {
        case Oe:
          Pe.brave && typeof Pe.brave.isBrave == sr && this.set(v, "Brave");
          break;
        case rt:
          !this.get(m) && _t && _t[Y] && this.set(m, Y), this.get(w) == "Macintosh" && Pe && typeof Pe.standalone !== Rt && Pe.maxTouchPoints && Pe.maxTouchPoints > 2 && this.set(w, "iPad").set(m, he);
          break;
        case ze:
          !this.get(v) && _t && _t[Yt] && this.set(v, _t[Yt]);
          break;
        case Xt:
          var i = this.data, o = function(s) {
            return i[s].getItem().detectFeature().get();
          };
          this.set(Oe, o(Oe)).set(ut, o(ut)).set(rt, o(rt)).set(We, o(We)).set(ze, o(ze));
      }
    return this;
  }, this.parseUA = function() {
    return this.itemType != Xt && $r.call(this.data, this.ua, this.rgxMap), this.itemType == Oe && this.set(In, Mr(this.get(x))), this;
  }, this.parseCH = function() {
    var i = this.uaCH, o = this.rgxMap;
    switch (this.itemType) {
      case Oe:
      case We:
        var s = i[Gi] || i[qi], a;
        if (s)
          for (var c in s) {
            var l = s[c].brand || s[c], u = s[c].version;
            this.itemType == Oe && !/not.a.brand/i.test(l) && (!a || /Chrom/.test(a) && l != ys || a == nr && /WebView2/.test(l)) && (l = nt(l, _a), a = this.get(v), a && !/Chrom/.test(a) && /Chrom/.test(l) || this.set(v, l).set(x, u).set(In, Mr(u)), a = l), this.itemType == We && l == ys && this.set(x, u);
          }
        break;
      case ut:
        var p = i[Ne];
        p && (p && i[hr] == "64" && (p += "64"), $r.call(this.data, p + ";", o));
        break;
      case rt:
        if (i[Y] && this.set(m, Y), i[w] && (this.set(w, i[w]), !this.get(m) || !this.get(b))) {
          var g = {};
          $r.call(g, "droid 9; " + i[w] + ")", o), !this.get(m) && g.type && this.set(m, g.type), !this.get(b) && g.vendor && this.set(b, g.vendor);
        }
        if (i[Mt]) {
          var k;
          if (typeof i[Mt] != "string")
            for (var C = 0; !k && C < i[Mt].length; )
              k = nt(i[Mt][C++], Ss);
          else
            k = nt(i[Mt], Ss);
          this.set(m, k);
        }
        break;
      case ze:
        var y = i[Yt];
        if (y) {
          var F = i[ji];
          y == $i && (F = parseInt(Mr(F), 10) >= 13 ? "11" : "10"), this.set(v, y).set(x, F);
        }
        this.get(v) == $i && i[w] == "Xbox" && this.set(v, "Xbox").set(x, void 0);
        break;
      case Xt:
        var K = this.data, re = function(N) {
          return K[N].getItem().setCH(i).parseCH().get();
        };
        this.set(Oe, re(Oe)).set(ut, re(ut)).set(rt, re(rt)).set(We, re(We)).set(ze, re(ze));
    }
    return this;
  }, dt.call(this, [
    ["itemType", n],
    ["ua", e],
    ["uaCH", r],
    ["rgxMap", t],
    ["data", Ra(this, n)]
  ]), this;
}
function gt(n, e, t) {
  if (typeof n === Zt ? (or(n, !0) ? (typeof e === Zt && (t = e), e = n) : (t = n, e = void 0), n = void 0) : typeof n === Mi && !or(e, !0) && (t = e, e = void 0), t && typeof t.append === sr) {
    var r = {};
    t.forEach(function(c, l) {
      r[l] = c;
    }), t = r;
  }
  if (!(this instanceof gt))
    return new gt(n, e, t).getResult();
  var i = typeof n === Mi ? n : (
    // Passed user-agent string
    t && t[ds] ? t[ds] : (
      // User-Agent from passed headers
      Pe && Pe.userAgent ? Pe.userAgent : (
        // navigator.userAgent
        Kt
      )
    )
  ), o = new Do(t, !0), s = e ? Sa(_s, e) : _s, a = function(c) {
    return c == Xt ? function() {
      return new Rs(c, i, s, o).set("ua", i).set(Oe, this.getBrowser()).set(ut, this.getCPU()).set(rt, this.getDevice()).set(We, this.getEngine()).set(ze, this.getOS()).get();
    } : function() {
      return new Rs(c, i, s[c], o).parseUA().get();
    };
  };
  return dt.call(this, [
    ["getBrowser", a(Oe)],
    ["getCPU", a(ut)],
    ["getDevice", a(rt)],
    ["getEngine", a(We)],
    ["getOS", a(ze)],
    ["getResult", a(Xt)],
    ["getUA", function() {
      return i;
    }],
    ["setUA", function(c) {
      return Jt(c) && (i = c.length > Pi ? ar(c, Pi) : c), this;
    }]
  ]).setUA(i), this;
}
gt.VERSION = ga;
gt.BROWSER = dr([v, x, In, m]);
gt.CPU = dr([Ne]);
gt.DEVICE = dr([w, b, m, Tn, Y, ye, he, et, An]);
gt.ENGINE = gt.OS = dr([v, x]);
function Ta() {
  return !new gt().getDevice().type;
}
function Aa() {
  const n = document.createElement("div");
  n.classList.add("nodekit-container"), document.body.appendChild(n);
  const e = document.createElement("div");
  return e.classList.add("nodekit-content"), n.appendChild(e), e;
}
class Ca {
  resolveAssetUrl(e) {
    if (e.locator.locator_type == "URL")
      return e.locator.url;
    if (e.locator.locator_type == "RelativePath") {
      let t = document.baseURI;
      return console.log(t), new URL(e.locator.relative_path, t).toString();
    }
    throw new Error("Unsupported locator for the browser environment. Found:" + JSON.stringify(e));
  }
  async getImageElement(e) {
    let t = this.resolveAssetUrl(e), r = new Image();
    return r.src = t, new Promise(
      (i, o) => {
        r.onload = () => i(r), r.onerror = (s) => o(s);
      }
    );
  }
  async getVideoElement(e) {
    let t = this.resolveAssetUrl(e), r = document.createElement("video");
    r.controls = !1;
    let i = new Promise((o, s) => {
      r.oncanplaythrough = () => {
        o(r);
      }, r.onerror = (a) => s(a);
    });
    return r.src = t, r.load(), i;
  }
}
class He {
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
  _registerEventListener(e, t, r, i) {
    e.addEventListener(t, r, i), this._listenerRegistry.push({ type: t, handler: r, options: i });
  }
  _findChildrenComponents() {
    const e = [];
    for (const t of Object.keys(this)) {
      const r = this[t];
      r instanceof He ? e.push(r) : Array.isArray(r) && r.every((i) => i instanceof He) && e.push(...r);
    }
    return e;
  }
  removeAllEventListeners() {
    for (const { type: e, handler: t, options: r } of this._listenerRegistry)
      this.root.removeEventListener(e, t, r);
    this._listenerRegistry = [];
    for (const e of this._findChildrenComponents())
      e.removeAllEventListeners();
  }
}
class Ia extends He {
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
class La extends He {
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
class pr extends He {
  constructor(e) {
    super(), this.root = document.createElement("div"), this.root.classList.add("overlay"), this.root.id = e;
  }
  setVisibility(e) {
    e ? this.root.classList.add("overlay--visible-state") : this.root.classList.remove("overlay--visible-state");
  }
}
class Oa extends He {
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
class Na extends pr {
  constructor() {
    super("session-connecting-overlay"), this.displayTimeout = null;
    const e = document.createElement("div");
    e.classList.add("connecting-message-box"), this.root.appendChild(e), this.spinner = new Oa(), this.spinner.mount(e);
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
function Pa(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var Dr, Ts;
function Ma() {
  if (Ts) return Dr;
  Ts = 1;
  function n(h) {
    return h instanceof Map ? h.clear = h.delete = h.set = function() {
      throw new Error("map is read-only");
    } : h instanceof Set && (h.add = h.clear = h.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(h), Object.getOwnPropertyNames(h).forEach((f) => {
      const _ = h[f], V = typeof _;
      (V === "object" || V === "function") && !Object.isFrozen(_) && n(_);
    }), h;
  }
  class e {
    /**
     * @param {CompiledMode} mode
     */
    constructor(f) {
      f.data === void 0 && (f.data = {}), this.data = f.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function t(h) {
    return h.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function r(h, ...f) {
    const _ = /* @__PURE__ */ Object.create(null);
    for (const V in h)
      _[V] = h[V];
    return f.forEach(function(V) {
      for (const we in V)
        _[we] = V[we];
    }), /** @type {T} */
    _;
  }
  const i = "</span>", o = (h) => !!h.scope, s = (h, { prefix: f }) => {
    if (h.startsWith("language:"))
      return h.replace("language:", "language-");
    if (h.includes(".")) {
      const _ = h.split(".");
      return [
        `${f}${_.shift()}`,
        ..._.map((V, we) => `${V}${"_".repeat(we + 1)}`)
      ].join(" ");
    }
    return `${f}${h}`;
  };
  class a {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(f, _) {
      this.buffer = "", this.classPrefix = _.classPrefix, f.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(f) {
      this.buffer += t(f);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(f) {
      if (!o(f)) return;
      const _ = s(
        f.scope,
        { prefix: this.classPrefix }
      );
      this.span(_);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(f) {
      o(f) && (this.buffer += i);
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
    span(f) {
      this.buffer += `<span class="${f}">`;
    }
  }
  const c = (h = {}) => {
    const f = { children: [] };
    return Object.assign(f, h), f;
  };
  class l {
    constructor() {
      this.rootNode = c(), this.stack = [this.rootNode];
    }
    get top() {
      return this.stack[this.stack.length - 1];
    }
    get root() {
      return this.rootNode;
    }
    /** @param {Node} node */
    add(f) {
      this.top.children.push(f);
    }
    /** @param {string} scope */
    openNode(f) {
      const _ = c({ scope: f });
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
    walk(f) {
      return this.constructor._walk(f, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(f, _) {
      return typeof _ == "string" ? f.addText(_) : _.children && (f.openNode(_), _.children.forEach((V) => this._walk(f, V)), f.closeNode(_)), f;
    }
    /**
     * @param {Node} node
     */
    static _collapse(f) {
      typeof f != "string" && f.children && (f.children.every((_) => typeof _ == "string") ? f.children = [f.children.join("")] : f.children.forEach((_) => {
        l._collapse(_);
      }));
    }
  }
  class u extends l {
    /**
     * @param {*} options
     */
    constructor(f) {
      super(), this.options = f;
    }
    /**
     * @param {string} text
     */
    addText(f) {
      f !== "" && this.add(f);
    }
    /** @param {string} scope */
    startScope(f) {
      this.openNode(f);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(f, _) {
      const V = f.root;
      _ && (V.scope = `language:${_}`), this.add(V);
    }
    toHTML() {
      return new a(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function p(h) {
    return h ? typeof h == "string" ? h : h.source : null;
  }
  function g(h) {
    return y("(?=", h, ")");
  }
  function k(h) {
    return y("(?:", h, ")*");
  }
  function C(h) {
    return y("(?:", h, ")?");
  }
  function y(...h) {
    return h.map((_) => p(_)).join("");
  }
  function F(h) {
    const f = h[h.length - 1];
    return typeof f == "object" && f.constructor === Object ? (h.splice(h.length - 1, 1), f) : {};
  }
  function K(...h) {
    return "(" + (F(h).capture ? "" : "?:") + h.map((V) => p(V)).join("|") + ")";
  }
  function re(h) {
    return new RegExp(h.toString() + "|").exec("").length - 1;
  }
  function N(h, f) {
    const _ = h && h.exec(f);
    return _ && _.index === 0;
  }
  const J = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function ae(h, { joinWith: f }) {
    let _ = 0;
    return h.map((V) => {
      _ += 1;
      const we = _;
      let me = p(V), O = "";
      for (; me.length > 0; ) {
        const L = J.exec(me);
        if (!L) {
          O += me;
          break;
        }
        O += me.substring(0, L.index), me = me.substring(L.index + L[0].length), L[0][0] === "\\" && L[1] ? O += "\\" + String(Number(L[1]) + we) : (O += L[0], L[0] === "(" && _++);
      }
      return O;
    }).map((V) => `(${V})`).join(f);
  }
  const ie = /\b\B/, se = "[a-zA-Z]\\w*", G = "[a-zA-Z_]\\w*", Ke = "\\b\\d+(\\.\\d+)?", mt = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", be = "\\b(0b[01]+)", it = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", st = (h = {}) => {
    const f = /^#![ ]*\//;
    return h.binary && (h.begin = y(
      f,
      /.*\b/,
      h.binary,
      /\b.*/
    )), r({
      scope: "meta",
      begin: f,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (_, V) => {
        _.index !== 0 && V.ignoreMatch();
      }
    }, h);
  }, T = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, R = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [T]
  }, z = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [T]
  }, P = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, $ = function(h, f, _ = {}) {
    const V = r(
      {
        scope: "comment",
        begin: h,
        end: f,
        contains: []
      },
      _
    );
    V.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const we = K(
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
    return V.contains.push(
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
        begin: y(
          /[ ]+/,
          // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
          "(",
          we,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), V;
  }, M = $("//", "$"), j = $("/\\*", "\\*/"), H = $("#", "$"), Z = {
    scope: "number",
    begin: Ke,
    relevance: 0
  }, W = {
    scope: "number",
    begin: mt,
    relevance: 0
  }, ve = {
    scope: "number",
    begin: be,
    relevance: 0
  }, X = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      T,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [T]
      }
    ]
  }, Me = {
    scope: "title",
    begin: se,
    relevance: 0
  }, tn = {
    scope: "title",
    begin: G,
    relevance: 0
  }, Pn = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + G,
    relevance: 0
  };
  var At = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: R,
    BACKSLASH_ESCAPE: T,
    BINARY_NUMBER_MODE: ve,
    BINARY_NUMBER_RE: be,
    COMMENT: $,
    C_BLOCK_COMMENT_MODE: j,
    C_LINE_COMMENT_MODE: M,
    C_NUMBER_MODE: W,
    C_NUMBER_RE: mt,
    END_SAME_AS_BEGIN: function(h) {
      return Object.assign(
        h,
        {
          /** @type {ModeCallback} */
          "on:begin": (f, _) => {
            _.data._beginMatch = f[1];
          },
          /** @type {ModeCallback} */
          "on:end": (f, _) => {
            _.data._beginMatch !== f[1] && _.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: H,
    IDENT_RE: se,
    MATCH_NOTHING_RE: ie,
    METHOD_GUARD: Pn,
    NUMBER_MODE: Z,
    NUMBER_RE: Ke,
    PHRASAL_WORDS_MODE: P,
    QUOTE_STRING_MODE: z,
    REGEXP_MODE: X,
    RE_STARTERS_RE: it,
    SHEBANG: st,
    TITLE_MODE: Me,
    UNDERSCORE_IDENT_RE: G,
    UNDERSCORE_TITLE_MODE: tn
  });
  function $n(h, f) {
    h.input[h.index - 1] === "." && f.ignoreMatch();
  }
  function wt(h, f) {
    h.className !== void 0 && (h.scope = h.className, delete h.className);
  }
  function Bt(h, f) {
    f && h.beginKeywords && (h.begin = "\\b(" + h.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", h.__beforeBegin = $n, h.keywords = h.keywords || h.beginKeywords, delete h.beginKeywords, h.relevance === void 0 && (h.relevance = 0));
  }
  function ot(h, f) {
    Array.isArray(h.illegal) && (h.illegal = K(...h.illegal));
  }
  function nn(h, f) {
    if (h.match) {
      if (h.begin || h.end) throw new Error("begin & end are not supported with match");
      h.begin = h.match, delete h.match;
    }
  }
  function rn(h, f) {
    h.relevance === void 0 && (h.relevance = 1);
  }
  const bt = (h, f) => {
    if (!h.beforeMatch) return;
    if (h.starts) throw new Error("beforeMatch cannot be used with starts");
    const _ = Object.assign({}, h);
    Object.keys(h).forEach((V) => {
      delete h[V];
    }), h.keywords = _.keywords, h.begin = y(_.beforeMatch, g(_.begin)), h.starts = {
      relevance: 0,
      contains: [
        Object.assign(_, { endsParent: !0 })
      ]
    }, h.relevance = 0, delete _.beforeMatch;
  }, Ut = [
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
  ], Ft = "keyword";
  function sn(h, f, _ = Ft) {
    const V = /* @__PURE__ */ Object.create(null);
    return typeof h == "string" ? we(_, h.split(" ")) : Array.isArray(h) ? we(_, h) : Object.keys(h).forEach(function(me) {
      Object.assign(
        V,
        sn(h[me], f, me)
      );
    }), V;
    function we(me, O) {
      f && (O = O.map((L) => L.toLowerCase())), O.forEach(function(L) {
        const q = L.split("|");
        V[q[0]] = [me, Dn(q[0], q[1])];
      });
    }
  }
  function Dn(h, f) {
    return f ? Number(f) : yr(h) ? 0 : 1;
  }
  function yr(h) {
    return Ut.includes(h.toLowerCase());
  }
  const zt = {}, $e = (h) => {
    console.error(h);
  }, at = (h, ...f) => {
    console.log(`WARN: ${h}`, ...f);
  }, De = (h, f) => {
    zt[`${h}/${f}`] || (console.log(`Deprecated as of ${h}. ${f}`), zt[`${h}/${f}`] = !0);
  }, Ct = new Error();
  function on(h, f, { key: _ }) {
    let V = 0;
    const we = h[_], me = {}, O = {};
    for (let L = 1; L <= f.length; L++)
      O[L + V] = we[L], me[L + V] = !0, V += re(f[L - 1]);
    h[_] = O, h[_]._emit = me, h[_]._multi = !0;
  }
  function Bn(h) {
    if (Array.isArray(h.begin)) {
      if (h.skip || h.excludeBegin || h.returnBegin)
        throw $e("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Ct;
      if (typeof h.beginScope != "object" || h.beginScope === null)
        throw $e("beginScope must be object"), Ct;
      on(h, h.begin, { key: "beginScope" }), h.begin = ae(h.begin, { joinWith: "" });
    }
  }
  function an(h) {
    if (Array.isArray(h.end)) {
      if (h.skip || h.excludeEnd || h.returnEnd)
        throw $e("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Ct;
      if (typeof h.endScope != "object" || h.endScope === null)
        throw $e("endScope must be object"), Ct;
      on(h, h.end, { key: "endScope" }), h.end = ae(h.end, { joinWith: "" });
    }
  }
  function Un(h) {
    h.scope && typeof h.scope == "object" && h.scope !== null && (h.beginScope = h.scope, delete h.scope);
  }
  function Ht(h) {
    Un(h), typeof h.beginScope == "string" && (h.beginScope = { _wrap: h.beginScope }), typeof h.endScope == "string" && (h.endScope = { _wrap: h.endScope }), Bn(h), an(h);
  }
  function qt(h) {
    function f(O, L) {
      return new RegExp(
        p(O),
        "m" + (h.case_insensitive ? "i" : "") + (h.unicodeRegex ? "u" : "") + (L ? "g" : "")
      );
    }
    class _ {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(L, q) {
        q.position = this.position++, this.matchIndexes[this.matchAt] = q, this.regexes.push([q, L]), this.matchAt += re(L) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const L = this.regexes.map((q) => q[1]);
        this.matcherRe = f(ae(L, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(L) {
        this.matcherRe.lastIndex = this.lastIndex;
        const q = this.matcherRe.exec(L);
        if (!q)
          return null;
        const le = q.findIndex((xt, Gt) => Gt > 0 && xt !== void 0), de = this.matchIndexes[le];
        return q.splice(0, le), Object.assign(q, de);
      }
    }
    class V {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(L) {
        if (this.multiRegexes[L]) return this.multiRegexes[L];
        const q = new _();
        return this.rules.slice(L).forEach(([le, de]) => q.addRule(le, de)), q.compile(), this.multiRegexes[L] = q, q;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(L, q) {
        this.rules.push([L, q]), q.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(L) {
        const q = this.getMatcher(this.regexIndex);
        q.lastIndex = this.lastIndex;
        let le = q.exec(L);
        if (this.resumingScanAtSamePosition() && !(le && le.index === this.lastIndex)) {
          const de = this.getMatcher(0);
          de.lastIndex = this.lastIndex + 1, le = de.exec(L);
        }
        return le && (this.regexIndex += le.position + 1, this.regexIndex === this.count && this.considerAll()), le;
      }
    }
    function we(O) {
      const L = new V();
      return O.contains.forEach((q) => L.addRule(q.begin, { rule: q, type: "begin" })), O.terminatorEnd && L.addRule(O.terminatorEnd, { type: "end" }), O.illegal && L.addRule(O.illegal, { type: "illegal" }), L;
    }
    function me(O, L) {
      const q = (
        /** @type CompiledMode */
        O
      );
      if (O.isCompiled) return q;
      [
        wt,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        nn,
        Ht,
        bt
      ].forEach((de) => de(O, L)), h.compilerExtensions.forEach((de) => de(O, L)), O.__beforeBegin = null, [
        Bt,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        ot,
        // default to 1 relevance if not specified
        rn
      ].forEach((de) => de(O, L)), O.isCompiled = !0;
      let le = null;
      return typeof O.keywords == "object" && O.keywords.$pattern && (O.keywords = Object.assign({}, O.keywords), le = O.keywords.$pattern, delete O.keywords.$pattern), le = le || /\w+/, O.keywords && (O.keywords = sn(O.keywords, h.case_insensitive)), q.keywordPatternRe = f(le, !0), L && (O.begin || (O.begin = /\B|\b/), q.beginRe = f(q.begin), !O.end && !O.endsWithParent && (O.end = /\B|\b/), O.end && (q.endRe = f(q.end)), q.terminatorEnd = p(q.end) || "", O.endsWithParent && L.terminatorEnd && (q.terminatorEnd += (O.end ? "|" : "") + L.terminatorEnd)), O.illegal && (q.illegalRe = f(
        /** @type {RegExp | string} */
        O.illegal
      )), O.contains || (O.contains = []), O.contains = [].concat(...O.contains.map(function(de) {
        return Et(de === "self" ? O : de);
      })), O.contains.forEach(function(de) {
        me(
          /** @type Mode */
          de,
          q
        );
      }), O.starts && me(O.starts, L), q.matcher = we(q), q;
    }
    if (h.compilerExtensions || (h.compilerExtensions = []), h.contains && h.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return h.classNameAliases = r(h.classNameAliases || {}), me(
      /** @type Mode */
      h
    );
  }
  function Fe(h) {
    return h ? h.endsWithParent || Fe(h.starts) : !1;
  }
  function Et(h) {
    return h.variants && !h.cachedVariants && (h.cachedVariants = h.variants.map(function(f) {
      return r(h, { variants: null }, f);
    })), h.cachedVariants ? h.cachedVariants : Fe(h) ? r(h, { starts: h.starts ? r(h.starts) : null }) : Object.isFrozen(h) ? r(h) : h;
  }
  var ln = "11.11.1";
  class cn extends Error {
    constructor(f, _) {
      super(f), this.name = "HTMLInjectionError", this.html = _;
    }
  }
  const un = t, It = r, Lt = Symbol("nomatch"), xr = 7, vt = function(h) {
    const f = /* @__PURE__ */ Object.create(null), _ = /* @__PURE__ */ Object.create(null), V = [];
    let we = !0;
    const me = "Could not find the language '{}', did you forget to load/include a language module?", O = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let L = {
      ignoreUnescapedHTML: !1,
      throwUnescapedHTML: !1,
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      cssSelector: "pre code",
      languages: null,
      // beta configuration options, subject to change, welcome to discuss
      // https://github.com/highlightjs/highlight.js/issues/1086
      __emitter: u
    };
    function q(E) {
      return L.noHighlightRe.test(E);
    }
    function le(E) {
      let B = E.className + " ";
      B += E.parentNode ? E.parentNode.className : "";
      const te = L.languageDetectRe.exec(B);
      if (te) {
        const fe = I(te[1]);
        return fe || (at(me.replace("{}", te[1])), at("Falling back to no-highlight mode for this block.", E)), fe ? te[1] : "no-highlight";
      }
      return B.split(/\s+/).find((fe) => q(fe) || I(fe));
    }
    function de(E, B, te) {
      let fe = "", ke = "";
      typeof B == "object" ? (fe = E, te = B.ignoreIllegals, ke = B.language) : (De("10.7.0", "highlight(lang, code, ...args) has been deprecated."), De("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), ke = E, fe = B), te === void 0 && (te = !0);
      const je = {
        code: fe,
        language: ke
      };
      Ze("before:highlight", je);
      const kt = je.result ? je.result : xt(je.language, je.code, te);
      return kt.code = je.code, Ze("after:highlight", kt), kt;
    }
    function xt(E, B, te, fe) {
      const ke = /* @__PURE__ */ Object.create(null);
      function je(A, U) {
        return A.keywords[U];
      }
      function kt() {
        if (!Q.keywords) {
          Se.addText(ge);
          return;
        }
        let A = 0;
        Q.keywordPatternRe.lastIndex = 0;
        let U = Q.keywordPatternRe.exec(ge), ee = "";
        for (; U; ) {
          ee += ge.substring(A, U.index);
          const ce = Je.case_insensitive ? U[0].toLowerCase() : U[0], Re = je(Q, ce);
          if (Re) {
            const [lt, ha] = Re;
            if (Se.addText(ee), ee = "", ke[ce] = (ke[ce] || 0) + 1, ke[ce] <= xr && (Vn += ha), lt.startsWith("_"))
              ee += U[0];
            else {
              const da = Je.classNameAliases[lt] || lt;
              Qe(U[0], da);
            }
          } else
            ee += U[0];
          A = Q.keywordPatternRe.lastIndex, U = Q.keywordPatternRe.exec(ge);
        }
        ee += ge.substring(A), Se.addText(ee);
      }
      function Gn() {
        if (ge === "") return;
        let A = null;
        if (typeof Q.subLanguage == "string") {
          if (!f[Q.subLanguage]) {
            Se.addText(ge);
            return;
          }
          A = xt(Q.subLanguage, ge, !0, hs[Q.subLanguage]), hs[Q.subLanguage] = /** @type {CompiledMode} */
          A._top;
        } else
          A = Ot(ge, Q.subLanguage.length ? Q.subLanguage : null);
        Q.relevance > 0 && (Vn += A.relevance), Se.__addSublanguage(A._emitter, A.language);
      }
      function Ue() {
        Q.subLanguage != null ? Gn() : kt(), ge = "";
      }
      function Qe(A, U) {
        A !== "" && (Se.startScope(U), Se.addText(A), Se.endScope());
      }
      function as(A, U) {
        let ee = 1;
        const ce = U.length - 1;
        for (; ee <= ce; ) {
          if (!A._emit[ee]) {
            ee++;
            continue;
          }
          const Re = Je.classNameAliases[A[ee]] || A[ee], lt = U[ee];
          Re ? Qe(lt, Re) : (ge = lt, kt(), ge = ""), ee++;
        }
      }
      function ls(A, U) {
        return A.scope && typeof A.scope == "string" && Se.openNode(Je.classNameAliases[A.scope] || A.scope), A.beginScope && (A.beginScope._wrap ? (Qe(ge, Je.classNameAliases[A.beginScope._wrap] || A.beginScope._wrap), ge = "") : A.beginScope._multi && (as(A.beginScope, U), ge = "")), Q = Object.create(A, { parent: { value: Q } }), Q;
      }
      function cs(A, U, ee) {
        let ce = N(A.endRe, ee);
        if (ce) {
          if (A["on:end"]) {
            const Re = new e(A);
            A["on:end"](U, Re), Re.isMatchIgnored && (ce = !1);
          }
          if (ce) {
            for (; A.endsParent && A.parent; )
              A = A.parent;
            return A;
          }
        }
        if (A.endsWithParent)
          return cs(A.parent, U, ee);
      }
      function oa(A) {
        return Q.matcher.regexIndex === 0 ? (ge += A[0], 1) : (_r = !0, 0);
      }
      function aa(A) {
        const U = A[0], ee = A.rule, ce = new e(ee), Re = [ee.__beforeBegin, ee["on:begin"]];
        for (const lt of Re)
          if (lt && (lt(A, ce), ce.isMatchIgnored))
            return oa(U);
        return ee.skip ? ge += U : (ee.excludeBegin && (ge += U), Ue(), !ee.returnBegin && !ee.excludeBegin && (ge = U)), ls(ee, A), ee.returnBegin ? 0 : U.length;
      }
      function la(A) {
        const U = A[0], ee = B.substring(A.index), ce = cs(Q, A, ee);
        if (!ce)
          return Lt;
        const Re = Q;
        Q.endScope && Q.endScope._wrap ? (Ue(), Qe(U, Q.endScope._wrap)) : Q.endScope && Q.endScope._multi ? (Ue(), as(Q.endScope, A)) : Re.skip ? ge += U : (Re.returnEnd || Re.excludeEnd || (ge += U), Ue(), Re.excludeEnd && (ge = U));
        do
          Q.scope && Se.closeNode(), !Q.skip && !Q.subLanguage && (Vn += Q.relevance), Q = Q.parent;
        while (Q !== ce.parent);
        return ce.starts && ls(ce.starts, A), Re.returnEnd ? 0 : U.length;
      }
      function ca() {
        const A = [];
        for (let U = Q; U !== Je; U = U.parent)
          U.scope && A.unshift(U.scope);
        A.forEach((U) => Se.openNode(U));
      }
      let jn = {};
      function us(A, U) {
        const ee = U && U[0];
        if (ge += A, ee == null)
          return Ue(), 0;
        if (jn.type === "begin" && U.type === "end" && jn.index === U.index && ee === "") {
          if (ge += B.slice(U.index, U.index + 1), !we) {
            const ce = new Error(`0 width match regex (${E})`);
            throw ce.languageName = E, ce.badRule = jn.rule, ce;
          }
          return 1;
        }
        if (jn = U, U.type === "begin")
          return aa(U);
        if (U.type === "illegal" && !te) {
          const ce = new Error('Illegal lexeme "' + ee + '" for mode "' + (Q.scope || "<unnamed>") + '"');
          throw ce.mode = Q, ce;
        } else if (U.type === "end") {
          const ce = la(U);
          if (ce !== Lt)
            return ce;
        }
        if (U.type === "illegal" && ee === "")
          return ge += `
`, 1;
        if (Sr > 1e5 && Sr > U.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return ge += ee, ee.length;
      }
      const Je = I(E);
      if (!Je)
        throw $e(me.replace("{}", E)), new Error('Unknown language: "' + E + '"');
      const ua = qt(Je);
      let kr = "", Q = fe || ua;
      const hs = {}, Se = new L.__emitter(L);
      ca();
      let ge = "", Vn = 0, Nt = 0, Sr = 0, _r = !1;
      try {
        if (Je.__emitTokens)
          Je.__emitTokens(B, Se);
        else {
          for (Q.matcher.considerAll(); ; ) {
            Sr++, _r ? _r = !1 : Q.matcher.considerAll(), Q.matcher.lastIndex = Nt;
            const A = Q.matcher.exec(B);
            if (!A) break;
            const U = B.substring(Nt, A.index), ee = us(U, A);
            Nt = A.index + ee;
          }
          us(B.substring(Nt));
        }
        return Se.finalize(), kr = Se.toHTML(), {
          language: E,
          value: kr,
          relevance: Vn,
          illegal: !1,
          _emitter: Se,
          _top: Q
        };
      } catch (A) {
        if (A.message && A.message.includes("Illegal"))
          return {
            language: E,
            value: un(B),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: A.message,
              index: Nt,
              context: B.slice(Nt - 100, Nt + 100),
              mode: A.mode,
              resultSoFar: kr
            },
            _emitter: Se
          };
        if (we)
          return {
            language: E,
            value: un(B),
            illegal: !1,
            relevance: 0,
            errorRaised: A,
            _emitter: Se,
            _top: Q
          };
        throw A;
      }
    }
    function Gt(E) {
      const B = {
        value: un(E),
        illegal: !1,
        relevance: 0,
        _top: O,
        _emitter: new L.__emitter(L)
      };
      return B._emitter.addText(E), B;
    }
    function Ot(E, B) {
      B = B || L.languages || Object.keys(f);
      const te = Gt(E), fe = B.filter(I).filter(xe).map(
        (Ue) => xt(Ue, E, !1)
      );
      fe.unshift(te);
      const ke = fe.sort((Ue, Qe) => {
        if (Ue.relevance !== Qe.relevance) return Qe.relevance - Ue.relevance;
        if (Ue.language && Qe.language) {
          if (I(Ue.language).supersetOf === Qe.language)
            return 1;
          if (I(Qe.language).supersetOf === Ue.language)
            return -1;
        }
        return 0;
      }), [je, kt] = ke, Gn = je;
      return Gn.secondBest = kt, Gn;
    }
    function Fn(E, B, te) {
      const fe = B && _[B] || te;
      E.classList.add("hljs"), E.classList.add(`language-${fe}`);
    }
    function Be(E) {
      let B = null;
      const te = le(E);
      if (q(te)) return;
      if (Ze(
        "before:highlightElement",
        { el: E, language: te }
      ), E.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", E);
        return;
      }
      if (E.children.length > 0 && (L.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(E)), L.throwUnescapedHTML))
        throw new cn(
          "One of your code blocks includes unescaped HTML.",
          E.innerHTML
        );
      B = E;
      const fe = B.textContent, ke = te ? de(fe, { language: te, ignoreIllegals: !0 }) : Ot(fe);
      E.innerHTML = ke.value, E.dataset.highlighted = "yes", Fn(E, te, ke.language), E.result = {
        language: ke.language,
        // TODO: remove with version 11.0
        re: ke.relevance,
        relevance: ke.relevance
      }, ke.secondBest && (E.secondBest = {
        language: ke.secondBest.language,
        relevance: ke.secondBest.relevance
      }), Ze("after:highlightElement", { el: E, result: ke, text: fe });
    }
    function zn(E) {
      L = It(L, E);
    }
    const Hn = () => {
      jt(), De("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function qn() {
      jt(), De("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let hn = !1;
    function jt() {
      function E() {
        jt();
      }
      if (document.readyState === "loading") {
        hn || window.addEventListener("DOMContentLoaded", E, !1), hn = !0;
        return;
      }
      document.querySelectorAll(L.cssSelector).forEach(Be);
    }
    function D(E, B) {
      let te = null;
      try {
        te = B(h);
      } catch (fe) {
        if ($e("Language definition for '{}' could not be registered.".replace("{}", E)), we)
          $e(fe);
        else
          throw fe;
        te = O;
      }
      te.name || (te.name = E), f[E] = te, te.rawDefinition = B.bind(null, h), te.aliases && pe(te.aliases, { languageName: E });
    }
    function d(E) {
      delete f[E];
      for (const B of Object.keys(_))
        _[B] === E && delete _[B];
    }
    function S() {
      return Object.keys(f);
    }
    function I(E) {
      return E = (E || "").toLowerCase(), f[E] || f[_[E]];
    }
    function pe(E, { languageName: B }) {
      typeof E == "string" && (E = [E]), E.forEach((te) => {
        _[te.toLowerCase()] = B;
      });
    }
    function xe(E) {
      const B = I(E);
      return B && !B.disableAutodetect;
    }
    function Ee(E) {
      E["before:highlightBlock"] && !E["before:highlightElement"] && (E["before:highlightElement"] = (B) => {
        E["before:highlightBlock"](
          Object.assign({ block: B.el }, B)
        );
      }), E["after:highlightBlock"] && !E["after:highlightElement"] && (E["after:highlightElement"] = (B) => {
        E["after:highlightBlock"](
          Object.assign({ block: B.el }, B)
        );
      });
    }
    function _e(E) {
      Ee(E), V.push(E);
    }
    function Ge(E) {
      const B = V.indexOf(E);
      B !== -1 && V.splice(B, 1);
    }
    function Ze(E, B) {
      const te = E;
      V.forEach(function(fe) {
        fe[te] && fe[te](B);
      });
    }
    function dn(E) {
      return De("10.7.0", "highlightBlock will be removed entirely in v12.0"), De("10.7.0", "Please use highlightElement now."), Be(E);
    }
    Object.assign(h, {
      highlight: de,
      highlightAuto: Ot,
      highlightAll: jt,
      highlightElement: Be,
      // TODO: Remove with v12 API
      highlightBlock: dn,
      configure: zn,
      initHighlighting: Hn,
      initHighlightingOnLoad: qn,
      registerLanguage: D,
      unregisterLanguage: d,
      listLanguages: S,
      getLanguage: I,
      registerAliases: pe,
      autoDetection: xe,
      inherit: It,
      addPlugin: _e,
      removePlugin: Ge
    }), h.debugMode = function() {
      we = !1;
    }, h.safeMode = function() {
      we = !0;
    }, h.versionString = ln, h.regex = {
      concat: y,
      lookahead: g,
      either: K,
      optional: C,
      anyNumberOfTimes: k
    };
    for (const E in At)
      typeof At[E] == "object" && n(At[E]);
    return Object.assign(h, At), h;
  }, yt = vt({});
  return yt.newInstance = () => vt({}), Dr = yt, yt.HighlightJS = yt, yt.default = yt, Dr;
}
var $a = /* @__PURE__ */ Ma();
const Bo = /* @__PURE__ */ Pa($a);
function Da(n) {
  const e = {
    className: "attr",
    begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
    relevance: 1.01
  }, t = {
    match: /[{}[\],:]/,
    className: "punctuation",
    relevance: 0
  }, r = [
    "true",
    "false",
    "null"
  ], i = {
    scope: "literal",
    beginKeywords: r.join(" ")
  };
  return {
    name: "JSON",
    aliases: ["jsonc"],
    keywords: {
      literal: r
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
Bo.registerLanguage("json", Da);
class Ba extends He {
  constructor() {
    super(), this.root = document.createElement("div"), this.root.classList.add("json-viewer"), this.jsonViewerContent = document.createElement("div"), this.jsonViewerContent.classList.add("json-viewer__content"), this.root.appendChild(this.jsonViewerContent);
  }
  displayAsJson(e) {
    this.clear();
    const t = document.createElement("pre");
    t.classList.add("json-viewer__pre"), t.textContent = JSON.stringify(e, null, 2), Bo.highlightElement(t), t.style.backgroundColor = "transparent", this.jsonViewerContent.appendChild(t);
  }
  clear() {
  }
}
class Ua extends pr {
  constructor() {
    super("console-message-overlay");
    const e = document.createElement("div");
    e.classList.add("console-title-box"), this.root.appendChild(e), this.titleTextDiv = document.createElement("div"), this.titleTextDiv.classList.add("console-title-box__text"), e.appendChild(this.titleTextDiv), this.jsonViewer = new Ba(), this.jsonViewer.mount(this.root);
    const t = new Fa();
    t.setCopyTarget(this.jsonViewer.root), t.mount(e);
  }
  displayMessage(e, t) {
    this.titleTextDiv.innerHTML = e, this.jsonViewer.displayAsJson(t), super.setVisibility(!0);
  }
  hide() {
    this.titleTextDiv.innerHTML = "", this.jsonViewer.clear(), super.setVisibility(!1);
  }
}
class Fa extends He {
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
class za extends pr {
  constructor() {
    super("session-finished-overlay"), this.submitButton = new Ha(), this.submitButton.mount(this.root), this.messageBox = document.createElement("div"), this.messageBox.classList.add("debrief-message-box"), this.root.appendChild(this.messageBox), this.messageSpan = document.createElement("span"), this.messageSpan.classList.add("debrief-message-box__text"), this.messageBox.appendChild(this.messageSpan);
  }
  show(e, t) {
    e.length == 0 ? this.messageBox.style.visibility = "hidden" : this.messageBox.style.visibility = "visible", this.messageSpan.textContent = e, this.submitButton.attachClickListener(t), this.setVisibility(!0);
  }
  hide() {
    this.messageSpan.textContent = "", super.setVisibility(!1), this.submitButton.removeAllEventListeners();
  }
}
class Ha extends He {
  constructor() {
    super();
    const e = document.createElement("button");
    e.classList.add("submit-button"), e.textContent = "Press to Submit", this.root = e;
  }
  attachClickListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class qa extends pr {
  constructor() {
    super("session-started-overlay"), this.startButton = new Ga(), this.startButton.mount(this.root);
  }
  show(e) {
    this.startButton.attachClickListener(e), this.setVisibility(!0);
  }
  hide() {
    super.setVisibility(!1), this.startButton.removeAllEventListeners();
  }
}
class Ga extends He {
  constructor() {
    super();
    const e = document.createElement("button");
    e.classList.add("start-button"), e.textContent = "Press to Start", this.root = e;
  }
  attachClickListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class ja extends He {
  constructor() {
    super(), this.root = document.createElement("div"), this.root.className = "shell-ui", this.progressBar = new La("cognition"), this.progressBar.mount(this.root), this.statusDot = new Ia(), this.statusDot.mount(this.root), this.sessionConnectingOverlay = new Na(), this.sessionConnectingOverlay.mount(this.root), this.overlayConsoleMessage = new Ua(), this.overlayConsoleMessage.mount(this.root), this.sessionFinishedOverlay = new za(), this.sessionFinishedOverlay.mount(this.root), this.sessionStartedOverlay = new qa(), this.sessionStartedOverlay.mount(this.root);
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
  showErrorOverlay(e) {
    this.showConsoleMessageOverlay(
      "The following error occurred:",
      {
        name: e.name,
        message: e.message,
        stack: e.stack
      }
    );
  }
  hideConsoleMessageOverlay() {
    this.overlayConsoleMessage.hide();
  }
  async playStartScreen() {
    await new Promise((t, r) => {
      this.sessionStartedOverlay.show(
        () => {
          this.sessionStartedOverlay.hide(), t();
        }
      );
    });
  }
  async playEndScreen(e = "", t = 1e4) {
    let r = new Promise((o, s) => {
      this.sessionFinishedOverlay.show(
        e,
        () => {
          this.sessionFinishedOverlay.hide(), o();
        }
      );
    });
    await r;
    let i = new Promise((o, s) => {
      setTimeout(() => {
        this.sessionFinishedOverlay.hide(), o();
      }, t);
    });
    await Promise.race([r, i]);
  }
}
function Va() {
  const n = document.createElement("div");
  return n.className = "board-views-ui", n;
}
class Wa {
  constructor(e, t, r, i, o, s, a) {
    this.tArmed = null, this.region = {
      x: e,
      y: t,
      w: r,
      h: i,
      mask: o
    };
    const c = (l) => {
      if (!this.tArmed || l.sampleType !== "down" || !this.checkPointInRegion(
        l.x,
        l.y
      ))
        return;
      const p = {
        action_type: "ClickAction",
        x: l.x,
        y: l.y
      };
      s(
        p,
        l.t
      );
    };
    this.unsubscribe = a.subscribe(c);
  }
  checkPointInRegion(e, t) {
    const r = this.region;
    switch (r.mask) {
      case "rectangle":
        const i = r.x - r.w / 2, o = r.x + r.w / 2, s = r.y + r.h / 2, a = r.y - r.h / 2;
        return e >= i && e <= o && t >= a && t <= s;
      case "ellipse":
        const c = r.w / 2, l = r.h / 2, u = e - r.x, p = t - r.y;
        return u * u / (c * c) + p * p / (l * l) <= 1;
      default:
        throw new Error(`Unknown mask: ${r.mask}`);
    }
  }
  arm() {
    this.tArmed = performance.now();
  }
  destroy() {
    this.tArmed = null, this.unsubscribe();
  }
}
class Xa {
  constructor(e, t) {
    this.onSensorFired = e, this.clock = t;
  }
  arm() {
    const e = {
      action_type: "TimeoutAction"
    };
    this.onSensorFired(e, this.clock.now());
  }
  destroy() {
  }
}
class Ya {
  constructor(e, t, r) {
    this.tArmed = null, this.onSensorFired = e;
    const i = (o) => {
      if (!this.tArmed || o.sampleType !== "down" || o.key !== t)
        return;
      const s = {
        action_type: "KeyAction",
        key: o.key
      };
      this.onSensorFired(s, o.t);
    };
    this.unsubscribe = r.subscribe(i);
  }
  arm() {
    this.tArmed = performance.now();
  }
  destroy() {
    this.tArmed = null, this.unsubscribe();
  }
}
class Ln {
  constructor(e, t) {
    this.card = e, this.boardCoords = t, this.root = document.createElement("div"), this.root.classList.add("card");
    const { leftPx: r, topPx: i } = t.getBoardLocationPx(
      this.card.x,
      this.card.y,
      this.card.w,
      this.card.h
    ), { widthPx: o, heightPx: s } = t.getBoardRectanglePx(
      this.card.w,
      this.card.h
    );
    this.root.style.left = `${r}px`, this.root.style.top = `${i}px`, this.root.style.width = `${o}px`, this.root.style.height = `${s}px`, this.setVisibility(!1), this.setInteractivity(!1);
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
class Ka extends Ln {
  async prepare(e) {
    this.imageContainer = document.createElement("div"), this.imageContainer.classList.add("image-card"), this.root.appendChild(this.imageContainer), this.image = await e.getImageElement(
      this.card.image
    ), this.image.classList.add("image-card__content"), this.image.draggable = !1, this.imageContainer.appendChild(this.image);
  }
}
function Vi() {
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
var Dt = Vi();
function Uo(n) {
  Dt = n;
}
var Cn = { exec: () => null };
function oe(n, e = "") {
  let t = typeof n == "string" ? n : n.source;
  const r = {
    replace: (i, o) => {
      let s = typeof o == "string" ? o : o.source;
      return s = s.replace(Ae.caret, "$1"), t = t.replace(i, s), r;
    },
    getRegex: () => new RegExp(t, e)
  };
  return r;
}
var Ae = {
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
}, Za = /^(?:[ \t]*(?:\n|$))+/, Qa = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Ja = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, On = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, el = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Wi = /(?:[*+-]|\d{1,9}[.)])/, Fo = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, zo = oe(Fo).replace(/bull/g, Wi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), tl = oe(Fo).replace(/bull/g, Wi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Xi = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, nl = /^[^\n]+/, Yi = /(?!\s*\])(?:\\.|[^\[\]\\])+/, rl = oe(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Yi).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), il = oe(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Wi).getRegex(), fr = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Ki = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, sl = oe(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", Ki).replace("tag", fr).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Ho = oe(Xi).replace("hr", On).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", fr).getRegex(), ol = oe(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Ho).getRegex(), Zi = {
  blockquote: ol,
  code: Qa,
  def: rl,
  fences: Ja,
  heading: el,
  hr: On,
  html: sl,
  lheading: zo,
  list: il,
  newline: Za,
  paragraph: Ho,
  table: Cn,
  text: nl
}, As = oe(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", On).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", fr).getRegex(), al = {
  ...Zi,
  lheading: tl,
  table: As,
  paragraph: oe(Xi).replace("hr", On).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", As).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", fr).getRegex()
}, ll = {
  ...Zi,
  html: oe(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", Ki).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: Cn,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: oe(Xi).replace("hr", On).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", zo).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, cl = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, ul = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, qo = /^( {2,}|\\)\n(?!\s*$)/, hl = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, gr = /[\p{P}\p{S}]/u, Qi = /[\s\p{P}\p{S}]/u, Go = /[^\s\p{P}\p{S}]/u, dl = oe(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Qi).getRegex(), jo = /(?!~)[\p{P}\p{S}]/u, pl = /(?!~)[\s\p{P}\p{S}]/u, fl = /(?:[^\s\p{P}\p{S}]|~)/u, gl = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, Vo = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, ml = oe(Vo, "u").replace(/punct/g, gr).getRegex(), wl = oe(Vo, "u").replace(/punct/g, jo).getRegex(), Wo = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", bl = oe(Wo, "gu").replace(/notPunctSpace/g, Go).replace(/punctSpace/g, Qi).replace(/punct/g, gr).getRegex(), El = oe(Wo, "gu").replace(/notPunctSpace/g, fl).replace(/punctSpace/g, pl).replace(/punct/g, jo).getRegex(), vl = oe(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, Go).replace(/punctSpace/g, Qi).replace(/punct/g, gr).getRegex(), yl = oe(/\\(punct)/, "gu").replace(/punct/g, gr).getRegex(), xl = oe(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), kl = oe(Ki).replace("(?:-->|$)", "-->").getRegex(), Sl = oe(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", kl).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), lr = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, _l = oe(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", lr).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Xo = oe(/^!?\[(label)\]\[(ref)\]/).replace("label", lr).replace("ref", Yi).getRegex(), Yo = oe(/^!?\[(ref)\](?:\[\])?/).replace("ref", Yi).getRegex(), Rl = oe("reflink|nolink(?!\\()", "g").replace("reflink", Xo).replace("nolink", Yo).getRegex(), Ji = {
  _backpedal: Cn,
  // only used for GFM url
  anyPunctuation: yl,
  autolink: xl,
  blockSkip: gl,
  br: qo,
  code: ul,
  del: Cn,
  emStrongLDelim: ml,
  emStrongRDelimAst: bl,
  emStrongRDelimUnd: vl,
  escape: cl,
  link: _l,
  nolink: Yo,
  punctuation: dl,
  reflink: Xo,
  reflinkSearch: Rl,
  tag: Sl,
  text: hl,
  url: Cn
}, Tl = {
  ...Ji,
  link: oe(/^!?\[(label)\]\((.*?)\)/).replace("label", lr).getRegex(),
  reflink: oe(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", lr).getRegex()
}, Bi = {
  ...Ji,
  emStrongRDelimAst: El,
  emStrongLDelim: wl,
  url: oe(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, Al = {
  ...Bi,
  br: oe(qo).replace("{2,}", "*").getRegex(),
  text: oe(Bi.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Zn = {
  normal: Zi,
  gfm: al,
  pedantic: ll
}, vn = {
  normal: Ji,
  gfm: Bi,
  breaks: Al,
  pedantic: Tl
}, Cl = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, Cs = (n) => Cl[n];
function tt(n, e) {
  if (e) {
    if (Ae.escapeTest.test(n))
      return n.replace(Ae.escapeReplace, Cs);
  } else if (Ae.escapeTestNoEncode.test(n))
    return n.replace(Ae.escapeReplaceNoEncode, Cs);
  return n;
}
function Is(n) {
  try {
    n = encodeURI(n).replace(Ae.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function Ls(n, e) {
  const t = n.replace(Ae.findPipe, (o, s, a) => {
    let c = !1, l = s;
    for (; --l >= 0 && a[l] === "\\"; ) c = !c;
    return c ? "|" : " |";
  }), r = t.split(Ae.splitPipe);
  let i = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !r.at(-1)?.trim() && r.pop(), e)
    if (r.length > e)
      r.splice(e);
    else
      for (; r.length < e; ) r.push("");
  for (; i < r.length; i++)
    r[i] = r[i].trim().replace(Ae.slashPipe, "|");
  return r;
}
function yn(n, e, t) {
  const r = n.length;
  if (r === 0)
    return "";
  let i = 0;
  for (; i < r && n.charAt(r - i - 1) === e; )
    i++;
  return n.slice(0, r - i);
}
function Il(n, e) {
  if (n.indexOf(e[1]) === -1)
    return -1;
  let t = 0;
  for (let r = 0; r < n.length; r++)
    if (n[r] === "\\")
      r++;
    else if (n[r] === e[0])
      t++;
    else if (n[r] === e[1] && (t--, t < 0))
      return r;
  return t > 0 ? -2 : -1;
}
function Os(n, e, t, r, i) {
  const o = e.href, s = e.title || null, a = n[1].replace(i.other.outputLinkReplace, "$1");
  r.state.inLink = !0;
  const c = {
    type: n[0].charAt(0) === "!" ? "image" : "link",
    raw: t,
    href: o,
    title: s,
    text: a,
    tokens: r.inlineTokens(a)
  };
  return r.state.inLink = !1, c;
}
function Ll(n, e, t) {
  const r = n.match(t.other.indentCodeCompensation);
  if (r === null)
    return e;
  const i = r[1];
  return e.split(`
`).map((o) => {
    const s = o.match(t.other.beginningSpace);
    if (s === null)
      return o;
    const [a] = s;
    return a.length >= i.length ? o.slice(i.length) : o;
  }).join(`
`);
}
var cr = class {
  options;
  rules;
  // set by the lexer
  lexer;
  // set by the lexer
  constructor(n) {
    this.options = n || Dt;
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
        text: this.options.pedantic ? t : yn(t, `
`)
      };
    }
  }
  fences(n) {
    const e = this.rules.block.fences.exec(n);
    if (e) {
      const t = e[0], r = Ll(t, e[3] || "", this.rules);
      return {
        type: "code",
        raw: t,
        lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2],
        text: r
      };
    }
  }
  heading(n) {
    const e = this.rules.block.heading.exec(n);
    if (e) {
      let t = e[2].trim();
      if (this.rules.other.endingHash.test(t)) {
        const r = yn(t, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (t = r.trim());
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
        raw: yn(e[0], `
`)
      };
  }
  blockquote(n) {
    const e = this.rules.block.blockquote.exec(n);
    if (e) {
      let t = yn(e[0], `
`).split(`
`), r = "", i = "";
      const o = [];
      for (; t.length > 0; ) {
        let s = !1;
        const a = [];
        let c;
        for (c = 0; c < t.length; c++)
          if (this.rules.other.blockquoteStart.test(t[c]))
            a.push(t[c]), s = !0;
          else if (!s)
            a.push(t[c]);
          else
            break;
        t = t.slice(c);
        const l = a.join(`
`), u = l.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${l}` : l, i = i ? `${i}
${u}` : u;
        const p = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(u, o, !0), this.lexer.state.top = p, t.length === 0)
          break;
        const g = o.at(-1);
        if (g?.type === "code")
          break;
        if (g?.type === "blockquote") {
          const k = g, C = k.raw + `
` + t.join(`
`), y = this.blockquote(C);
          o[o.length - 1] = y, r = r.substring(0, r.length - k.raw.length) + y.raw, i = i.substring(0, i.length - k.text.length) + y.text;
          break;
        } else if (g?.type === "list") {
          const k = g, C = k.raw + `
` + t.join(`
`), y = this.list(C);
          o[o.length - 1] = y, r = r.substring(0, r.length - g.raw.length) + y.raw, i = i.substring(0, i.length - k.raw.length) + y.raw, t = C.substring(o.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return {
        type: "blockquote",
        raw: r,
        tokens: o,
        text: i
      };
    }
  }
  list(n) {
    let e = this.rules.block.list.exec(n);
    if (e) {
      let t = e[1].trim();
      const r = t.length > 1, i = {
        type: "list",
        raw: "",
        ordered: r,
        start: r ? +t.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      t = r ? `\\d{1,9}\\${t.slice(-1)}` : `\\${t}`, this.options.pedantic && (t = r ? t : "[*+-]");
      const o = this.rules.other.listItemRegex(t);
      let s = !1;
      for (; n; ) {
        let c = !1, l = "", u = "";
        if (!(e = o.exec(n)) || this.rules.block.hr.test(n))
          break;
        l = e[0], n = n.substring(l.length);
        let p = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (K) => " ".repeat(3 * K.length)), g = n.split(`
`, 1)[0], k = !p.trim(), C = 0;
        if (this.options.pedantic ? (C = 2, u = p.trimStart()) : k ? C = e[1].length + 1 : (C = e[2].search(this.rules.other.nonSpaceChar), C = C > 4 ? 1 : C, u = p.slice(C), C += e[1].length), k && this.rules.other.blankLine.test(g) && (l += g + `
`, n = n.substring(g.length + 1), c = !0), !c) {
          const K = this.rules.other.nextBulletRegex(C), re = this.rules.other.hrRegex(C), N = this.rules.other.fencesBeginRegex(C), J = this.rules.other.headingBeginRegex(C), ae = this.rules.other.htmlBeginRegex(C);
          for (; n; ) {
            const ie = n.split(`
`, 1)[0];
            let se;
            if (g = ie, this.options.pedantic ? (g = g.replace(this.rules.other.listReplaceNesting, "  "), se = g) : se = g.replace(this.rules.other.tabCharGlobal, "    "), N.test(g) || J.test(g) || ae.test(g) || K.test(g) || re.test(g))
              break;
            if (se.search(this.rules.other.nonSpaceChar) >= C || !g.trim())
              u += `
` + se.slice(C);
            else {
              if (k || p.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || N.test(p) || J.test(p) || re.test(p))
                break;
              u += `
` + g;
            }
            !k && !g.trim() && (k = !0), l += ie + `
`, n = n.substring(ie.length + 1), p = se.slice(C);
          }
        }
        i.loose || (s ? i.loose = !0 : this.rules.other.doubleBlankLine.test(l) && (s = !0));
        let y = null, F;
        this.options.gfm && (y = this.rules.other.listIsTask.exec(u), y && (F = y[0] !== "[ ] ", u = u.replace(this.rules.other.listReplaceTask, ""))), i.items.push({
          type: "list_item",
          raw: l,
          task: !!y,
          checked: F,
          loose: !1,
          text: u,
          tokens: []
        }), i.raw += l;
      }
      const a = i.items.at(-1);
      if (a)
        a.raw = a.raw.trimEnd(), a.text = a.text.trimEnd();
      else
        return;
      i.raw = i.raw.trimEnd();
      for (let c = 0; c < i.items.length; c++)
        if (this.lexer.state.top = !1, i.items[c].tokens = this.lexer.blockTokens(i.items[c].text, []), !i.loose) {
          const l = i.items[c].tokens.filter((p) => p.type === "space"), u = l.length > 0 && l.some((p) => this.rules.other.anyLine.test(p.raw));
          i.loose = u;
        }
      if (i.loose)
        for (let c = 0; c < i.items.length; c++)
          i.items[c].loose = !0;
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
      const t = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return {
        type: "def",
        tag: t,
        raw: e[0],
        href: r,
        title: i
      };
    }
  }
  table(n) {
    const e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2]))
      return;
    const t = Ls(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], o = {
      type: "table",
      raw: e[0],
      header: [],
      align: [],
      rows: []
    };
    if (t.length === r.length) {
      for (const s of r)
        this.rules.other.tableAlignRight.test(s) ? o.align.push("right") : this.rules.other.tableAlignCenter.test(s) ? o.align.push("center") : this.rules.other.tableAlignLeft.test(s) ? o.align.push("left") : o.align.push(null);
      for (let s = 0; s < t.length; s++)
        o.header.push({
          text: t[s],
          tokens: this.lexer.inline(t[s]),
          header: !0,
          align: o.align[s]
        });
      for (const s of i)
        o.rows.push(Ls(s, o.header.length).map((a, c) => ({
          text: a,
          tokens: this.lexer.inline(a),
          header: !1,
          align: o.align[c]
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
        const o = yn(t.slice(0, -1), "\\");
        if ((t.length - o.length) % 2 === 0)
          return;
      } else {
        const o = Il(e[2], "()");
        if (o === -2)
          return;
        if (o > -1) {
          const a = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + o;
          e[2] = e[2].substring(0, o), e[0] = e[0].substring(0, a).trim(), e[3] = "";
        }
      }
      let r = e[2], i = "";
      if (this.options.pedantic) {
        const o = this.rules.other.pedanticHrefTitle.exec(r);
        o && (r = o[1], i = o[3]);
      } else
        i = e[3] ? e[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(t) ? r = r.slice(1) : r = r.slice(1, -1)), Os(e, {
        href: r && r.replace(this.rules.inline.anyPunctuation, "$1"),
        title: i && i.replace(this.rules.inline.anyPunctuation, "$1")
      }, e[0], this.lexer, this.rules);
    }
  }
  reflink(n, e) {
    let t;
    if ((t = this.rules.inline.reflink.exec(n)) || (t = this.rules.inline.nolink.exec(n))) {
      const r = (t[2] || t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i = e[r.toLowerCase()];
      if (!i) {
        const o = t[0].charAt(0);
        return {
          type: "text",
          raw: o,
          text: o
        };
      }
      return Os(t, i, t[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, t = "") {
    let r = this.rules.inline.emStrongLDelim.exec(n);
    if (!r || r[3] && t.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(r[1] || r[2] || "") || !t || this.rules.inline.punctuation.exec(t)) {
      const o = [...r[0]].length - 1;
      let s, a, c = o, l = 0;
      const u = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (u.lastIndex = 0, e = e.slice(-1 * n.length + o); (r = u.exec(e)) != null; ) {
        if (s = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !s) continue;
        if (a = [...s].length, r[3] || r[4]) {
          c += a;
          continue;
        } else if ((r[5] || r[6]) && o % 3 && !((o + a) % 3)) {
          l += a;
          continue;
        }
        if (c -= a, c > 0) continue;
        a = Math.min(a, a + c + l);
        const p = [...r[0]][0].length, g = n.slice(0, o + r.index + p + a);
        if (Math.min(o, a) % 2) {
          const C = g.slice(1, -1);
          return {
            type: "em",
            raw: g,
            text: C,
            tokens: this.lexer.inlineTokens(C)
          };
        }
        const k = g.slice(2, -2);
        return {
          type: "strong",
          raw: g,
          text: k,
          tokens: this.lexer.inlineTokens(k)
        };
      }
    }
  }
  codespan(n) {
    const e = this.rules.inline.code.exec(n);
    if (e) {
      let t = e[2].replace(this.rules.other.newLineCharGlobal, " ");
      const r = this.rules.other.nonSpaceChar.test(t), i = this.rules.other.startingSpaceChar.test(t) && this.rules.other.endingSpaceChar.test(t);
      return r && i && (t = t.substring(1, t.length - 1)), {
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
      let t, r;
      return e[2] === "@" ? (t = e[1], r = "mailto:" + t) : (t = e[1], r = t), {
        type: "link",
        raw: e[0],
        text: t,
        href: r,
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
      let t, r;
      if (e[2] === "@")
        t = e[0], r = "mailto:" + t;
      else {
        let i;
        do
          i = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (i !== e[0]);
        t = e[0], e[1] === "www." ? r = "http://" + e[0] : r = e[0];
      }
      return {
        type: "link",
        raw: e[0],
        text: t,
        href: r,
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
}, pt = class Ui {
  tokens;
  options;
  state;
  tokenizer;
  inlineQueue;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Dt, this.options.tokenizer = this.options.tokenizer || new cr(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const t = {
      other: Ae,
      block: Zn.normal,
      inline: vn.normal
    };
    this.options.pedantic ? (t.block = Zn.pedantic, t.inline = vn.pedantic) : this.options.gfm && (t.block = Zn.gfm, this.options.breaks ? t.inline = vn.breaks : t.inline = vn.gfm), this.tokenizer.rules = t;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: Zn,
      inline: vn
    };
  }
  /**
   * Static Lex Method
   */
  static lex(e, t) {
    return new Ui(t).lex(e);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(e, t) {
    return new Ui(t).inlineTokens(e);
  }
  /**
   * Preprocessing
   */
  lex(e) {
    e = e.replace(Ae.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      const r = this.inlineQueue[t];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], r = !1) {
    for (this.options.pedantic && (e = e.replace(Ae.tabCharGlobal, "    ").replace(Ae.spaceLine, "")); e; ) {
      let i;
      if (this.options.extensions?.block?.some((s) => (i = s.call({ lexer: this }, e, t)) ? (e = e.substring(i.raw.length), t.push(i), !0) : !1))
        continue;
      if (i = this.tokenizer.space(e)) {
        e = e.substring(i.raw.length);
        const s = t.at(-1);
        i.raw.length === 1 && s !== void 0 ? s.raw += `
` : t.push(i);
        continue;
      }
      if (i = this.tokenizer.code(e)) {
        e = e.substring(i.raw.length);
        const s = t.at(-1);
        s?.type === "paragraph" || s?.type === "text" ? (s.raw += `
` + i.raw, s.text += `
` + i.text, this.inlineQueue.at(-1).src = s.text) : t.push(i);
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
        const s = t.at(-1);
        s?.type === "paragraph" || s?.type === "text" ? (s.raw += `
` + i.raw, s.text += `
` + i.raw, this.inlineQueue.at(-1).src = s.text) : this.tokens.links[i.tag] || (this.tokens.links[i.tag] = {
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
        let s = 1 / 0;
        const a = e.slice(1);
        let c;
        this.options.extensions.startBlock.forEach((l) => {
          c = l.call({ lexer: this }, a), typeof c == "number" && c >= 0 && (s = Math.min(s, c));
        }), s < 1 / 0 && s >= 0 && (o = e.substring(0, s + 1));
      }
      if (this.state.top && (i = this.tokenizer.paragraph(o))) {
        const s = t.at(-1);
        r && s?.type === "paragraph" ? (s.raw += `
` + i.raw, s.text += `
` + i.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(i), r = o.length !== e.length, e = e.substring(i.raw.length);
        continue;
      }
      if (i = this.tokenizer.text(e)) {
        e = e.substring(i.raw.length);
        const s = t.at(-1);
        s?.type === "text" ? (s.raw += `
` + i.raw, s.text += `
` + i.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(i);
        continue;
      }
      if (e) {
        const s = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(s);
          break;
        } else
          throw new Error(s);
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
    let r = e, i = null;
    if (this.tokens.links) {
      const a = Object.keys(this.tokens.links);
      if (a.length > 0)
        for (; (i = this.tokenizer.rules.inline.reflinkSearch.exec(r)) != null; )
          a.includes(i[0].slice(i[0].lastIndexOf("[") + 1, -1)) && (r = r.slice(0, i.index) + "[" + "a".repeat(i[0].length - 2) + "]" + r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (i = this.tokenizer.rules.inline.anyPunctuation.exec(r)) != null; )
      r = r.slice(0, i.index) + "++" + r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (i = this.tokenizer.rules.inline.blockSkip.exec(r)) != null; )
      r = r.slice(0, i.index) + "[" + "a".repeat(i[0].length - 2) + "]" + r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    let o = !1, s = "";
    for (; e; ) {
      o || (s = ""), o = !1;
      let a;
      if (this.options.extensions?.inline?.some((l) => (a = l.call({ lexer: this }, e, t)) ? (e = e.substring(a.raw.length), t.push(a), !0) : !1))
        continue;
      if (a = this.tokenizer.escape(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.tag(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.link(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(a.raw.length);
        const l = t.at(-1);
        a.type === "text" && l?.type === "text" ? (l.raw += a.raw, l.text += a.text) : t.push(a);
        continue;
      }
      if (a = this.tokenizer.emStrong(e, r, s)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.codespan(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.br(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.del(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.autolink(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (!this.state.inLink && (a = this.tokenizer.url(e))) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      let c = e;
      if (this.options.extensions?.startInline) {
        let l = 1 / 0;
        const u = e.slice(1);
        let p;
        this.options.extensions.startInline.forEach((g) => {
          p = g.call({ lexer: this }, u), typeof p == "number" && p >= 0 && (l = Math.min(l, p));
        }), l < 1 / 0 && l >= 0 && (c = e.substring(0, l + 1));
      }
      if (a = this.tokenizer.inlineText(c)) {
        e = e.substring(a.raw.length), a.raw.slice(-1) !== "_" && (s = a.raw.slice(-1)), o = !0;
        const l = t.at(-1);
        l?.type === "text" ? (l.raw += a.raw, l.text += a.text) : t.push(a);
        continue;
      }
      if (e) {
        const l = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(l);
          break;
        } else
          throw new Error(l);
      }
    }
    return t;
  }
}, ur = class {
  options;
  parser;
  // set by the parser
  constructor(n) {
    this.options = n || Dt;
  }
  space(n) {
    return "";
  }
  code({ text: n, lang: e, escaped: t }) {
    const r = (e || "").match(Ae.notSpaceStart)?.[0], i = n.replace(Ae.endingNewline, "") + `
`;
    return r ? '<pre><code class="language-' + tt(r) + '">' + (t ? i : tt(i, !0)) + `</code></pre>
` : "<pre><code>" + (t ? i : tt(i, !0)) + `</code></pre>
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
    let r = "";
    for (let s = 0; s < n.items.length; s++) {
      const a = n.items[s];
      r += this.listitem(a);
    }
    const i = e ? "ol" : "ul", o = e && t !== 1 ? ' start="' + t + '"' : "";
    return "<" + i + o + `>
` + r + "</" + i + `>
`;
  }
  listitem(n) {
    let e = "";
    if (n.task) {
      const t = this.checkbox({ checked: !!n.checked });
      n.loose ? n.tokens[0]?.type === "paragraph" ? (n.tokens[0].text = t + " " + n.tokens[0].text, n.tokens[0].tokens && n.tokens[0].tokens.length > 0 && n.tokens[0].tokens[0].type === "text" && (n.tokens[0].tokens[0].text = t + " " + tt(n.tokens[0].tokens[0].text), n.tokens[0].tokens[0].escaped = !0)) : n.tokens.unshift({
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
    let r = "";
    for (let i = 0; i < n.rows.length; i++) {
      const o = n.rows[i];
      t = "";
      for (let s = 0; s < o.length; s++)
        t += this.tablecell(o[s]);
      r += this.tablerow({ text: t });
    }
    return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + r + `</table>
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
    return `<code>${tt(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: e, tokens: t }) {
    const r = this.parser.parseInline(t), i = Is(n);
    if (i === null)
      return r;
    n = i;
    let o = '<a href="' + n + '"';
    return e && (o += ' title="' + tt(e) + '"'), o += ">" + r + "</a>", o;
  }
  image({ href: n, title: e, text: t, tokens: r }) {
    r && (t = this.parser.parseInline(r, this.parser.textRenderer));
    const i = Is(n);
    if (i === null)
      return tt(t);
    n = i;
    let o = `<img src="${n}" alt="${t}"`;
    return e && (o += ` title="${tt(e)}"`), o += ">", o;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : tt(n.text);
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
}, ft = class Fi {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || Dt, this.options.renderer = this.options.renderer || new ur(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new es();
  }
  /**
   * Static Parse Method
   */
  static parse(e, t) {
    return new Fi(t).parse(e);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(e, t) {
    return new Fi(t).parseInline(e);
  }
  /**
   * Parse Loop
   */
  parse(e, t = !0) {
    let r = "";
    for (let i = 0; i < e.length; i++) {
      const o = e[i];
      if (this.options.extensions?.renderers?.[o.type]) {
        const a = o, c = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (c !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(a.type)) {
          r += c || "";
          continue;
        }
      }
      const s = o;
      switch (s.type) {
        case "space": {
          r += this.renderer.space(s);
          continue;
        }
        case "hr": {
          r += this.renderer.hr(s);
          continue;
        }
        case "heading": {
          r += this.renderer.heading(s);
          continue;
        }
        case "code": {
          r += this.renderer.code(s);
          continue;
        }
        case "table": {
          r += this.renderer.table(s);
          continue;
        }
        case "blockquote": {
          r += this.renderer.blockquote(s);
          continue;
        }
        case "list": {
          r += this.renderer.list(s);
          continue;
        }
        case "html": {
          r += this.renderer.html(s);
          continue;
        }
        case "paragraph": {
          r += this.renderer.paragraph(s);
          continue;
        }
        case "text": {
          let a = s, c = this.renderer.text(a);
          for (; i + 1 < e.length && e[i + 1].type === "text"; )
            a = e[++i], c += `
` + this.renderer.text(a);
          t ? r += this.renderer.paragraph({
            type: "paragraph",
            raw: c,
            text: c,
            tokens: [{ type: "text", raw: c, text: c, escaped: !0 }]
          }) : r += c;
          continue;
        }
        default: {
          const a = 'Token with "' + s.type + '" type was not found.';
          if (this.options.silent)
            return console.error(a), "";
          throw new Error(a);
        }
      }
    }
    return r;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(e, t = this.renderer) {
    let r = "";
    for (let i = 0; i < e.length; i++) {
      const o = e[i];
      if (this.options.extensions?.renderers?.[o.type]) {
        const a = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (a !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(o.type)) {
          r += a || "";
          continue;
        }
      }
      const s = o;
      switch (s.type) {
        case "escape": {
          r += t.text(s);
          break;
        }
        case "html": {
          r += t.html(s);
          break;
        }
        case "link": {
          r += t.link(s);
          break;
        }
        case "image": {
          r += t.image(s);
          break;
        }
        case "strong": {
          r += t.strong(s);
          break;
        }
        case "em": {
          r += t.em(s);
          break;
        }
        case "codespan": {
          r += t.codespan(s);
          break;
        }
        case "br": {
          r += t.br(s);
          break;
        }
        case "del": {
          r += t.del(s);
          break;
        }
        case "text": {
          r += t.text(s);
          break;
        }
        default: {
          const a = 'Token with "' + s.type + '" type was not found.';
          if (this.options.silent)
            return console.error(a), "";
          throw new Error(a);
        }
      }
    }
    return r;
  }
}, rr = class {
  options;
  block;
  constructor(n) {
    this.options = n || Dt;
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
    return this.block ? pt.lex : pt.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? ft.parse : ft.parseInline;
  }
}, Ol = class {
  defaults = Vi();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = ft;
  Renderer = ur;
  TextRenderer = es;
  Lexer = pt;
  Tokenizer = cr;
  Hooks = rr;
  constructor(...n) {
    this.use(...n);
  }
  /**
   * Run callback for every token
   */
  walkTokens(n, e) {
    let t = [];
    for (const r of n)
      switch (t = t.concat(e.call(this, r)), r.type) {
        case "table": {
          const i = r;
          for (const o of i.header)
            t = t.concat(this.walkTokens(o.tokens, e));
          for (const o of i.rows)
            for (const s of o)
              t = t.concat(this.walkTokens(s.tokens, e));
          break;
        }
        case "list": {
          const i = r;
          t = t.concat(this.walkTokens(i.items, e));
          break;
        }
        default: {
          const i = r;
          this.defaults.extensions?.childTokens?.[i.type] ? this.defaults.extensions.childTokens[i.type].forEach((o) => {
            const s = i[o].flat(1 / 0);
            t = t.concat(this.walkTokens(s, e));
          }) : i.tokens && (t = t.concat(this.walkTokens(i.tokens, e)));
        }
      }
    return t;
  }
  use(...n) {
    const e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return n.forEach((t) => {
      const r = { ...t };
      if (r.async = this.defaults.async || r.async || !1, t.extensions && (t.extensions.forEach((i) => {
        if (!i.name)
          throw new Error("extension name required");
        if ("renderer" in i) {
          const o = e.renderers[i.name];
          o ? e.renderers[i.name] = function(...s) {
            let a = i.renderer.apply(this, s);
            return a === !1 && (a = o.apply(this, s)), a;
          } : e.renderers[i.name] = i.renderer;
        }
        if ("tokenizer" in i) {
          if (!i.level || i.level !== "block" && i.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          const o = e[i.level];
          o ? o.unshift(i.tokenizer) : e[i.level] = [i.tokenizer], i.start && (i.level === "block" ? e.startBlock ? e.startBlock.push(i.start) : e.startBlock = [i.start] : i.level === "inline" && (e.startInline ? e.startInline.push(i.start) : e.startInline = [i.start]));
        }
        "childTokens" in i && i.childTokens && (e.childTokens[i.name] = i.childTokens);
      }), r.extensions = e), t.renderer) {
        const i = this.defaults.renderer || new ur(this.defaults);
        for (const o in t.renderer) {
          if (!(o in i))
            throw new Error(`renderer '${o}' does not exist`);
          if (["options", "parser"].includes(o))
            continue;
          const s = o, a = t.renderer[s], c = i[s];
          i[s] = (...l) => {
            let u = a.apply(i, l);
            return u === !1 && (u = c.apply(i, l)), u || "";
          };
        }
        r.renderer = i;
      }
      if (t.tokenizer) {
        const i = this.defaults.tokenizer || new cr(this.defaults);
        for (const o in t.tokenizer) {
          if (!(o in i))
            throw new Error(`tokenizer '${o}' does not exist`);
          if (["options", "rules", "lexer"].includes(o))
            continue;
          const s = o, a = t.tokenizer[s], c = i[s];
          i[s] = (...l) => {
            let u = a.apply(i, l);
            return u === !1 && (u = c.apply(i, l)), u;
          };
        }
        r.tokenizer = i;
      }
      if (t.hooks) {
        const i = this.defaults.hooks || new rr();
        for (const o in t.hooks) {
          if (!(o in i))
            throw new Error(`hook '${o}' does not exist`);
          if (["options", "block"].includes(o))
            continue;
          const s = o, a = t.hooks[s], c = i[s];
          rr.passThroughHooks.has(o) ? i[s] = (l) => {
            if (this.defaults.async)
              return Promise.resolve(a.call(i, l)).then((p) => c.call(i, p));
            const u = a.call(i, l);
            return c.call(i, u);
          } : i[s] = (...l) => {
            let u = a.apply(i, l);
            return u === !1 && (u = c.apply(i, l)), u;
          };
        }
        r.hooks = i;
      }
      if (t.walkTokens) {
        const i = this.defaults.walkTokens, o = t.walkTokens;
        r.walkTokens = function(s) {
          let a = [];
          return a.push(o.call(this, s)), i && (a = a.concat(i.call(this, s))), a;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(n) {
    return this.defaults = { ...this.defaults, ...n }, this;
  }
  lexer(n, e) {
    return pt.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return ft.parse(n, e ?? this.defaults);
  }
  parseMarkdown(n) {
    return (t, r) => {
      const i = { ...r }, o = { ...this.defaults, ...i }, s = this.onError(!!o.silent, !!o.async);
      if (this.defaults.async === !0 && i.async === !1)
        return s(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null)
        return s(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string")
        return s(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      o.hooks && (o.hooks.options = o, o.hooks.block = n);
      const a = o.hooks ? o.hooks.provideLexer() : n ? pt.lex : pt.lexInline, c = o.hooks ? o.hooks.provideParser() : n ? ft.parse : ft.parseInline;
      if (o.async)
        return Promise.resolve(o.hooks ? o.hooks.preprocess(t) : t).then((l) => a(l, o)).then((l) => o.hooks ? o.hooks.processAllTokens(l) : l).then((l) => o.walkTokens ? Promise.all(this.walkTokens(l, o.walkTokens)).then(() => l) : l).then((l) => c(l, o)).then((l) => o.hooks ? o.hooks.postprocess(l) : l).catch(s);
      try {
        o.hooks && (t = o.hooks.preprocess(t));
        let l = a(t, o);
        o.hooks && (l = o.hooks.processAllTokens(l)), o.walkTokens && this.walkTokens(l, o.walkTokens);
        let u = c(l, o);
        return o.hooks && (u = o.hooks.postprocess(u)), u;
      } catch (l) {
        return s(l);
      }
    };
  }
  onError(n, e) {
    return (t) => {
      if (t.message += `
Please report this to https://github.com/markedjs/marked.`, n) {
        const r = "<p>An error occurred:</p><pre>" + tt(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e)
        return Promise.reject(t);
      throw t;
    };
  }
}, $t = new Ol();
function ue(n, e) {
  return $t.parse(n, e);
}
ue.options = ue.setOptions = function(n) {
  return $t.setOptions(n), ue.defaults = $t.defaults, Uo(ue.defaults), ue;
};
ue.getDefaults = Vi;
ue.defaults = Dt;
ue.use = function(...n) {
  return $t.use(...n), ue.defaults = $t.defaults, Uo(ue.defaults), ue;
};
ue.walkTokens = function(n, e) {
  return $t.walkTokens(n, e);
};
ue.parseInline = $t.parseInline;
ue.Parser = ft;
ue.parser = ft.parse;
ue.Renderer = ur;
ue.TextRenderer = es;
ue.Lexer = pt;
ue.lexer = pt.lex;
ue.Tokenizer = cr;
ue.Hooks = rr;
ue.parse = ue;
ue.options;
ue.setOptions;
ue.use;
ue.walkTokens;
ue.parseInline;
ft.parse;
pt.lex;
/*! @license DOMPurify 3.2.6 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.6/LICENSE */
const {
  entries: Ko,
  setPrototypeOf: Ns,
  isFrozen: Nl,
  getPrototypeOf: Pl,
  getOwnPropertyDescriptor: Ml
} = Object;
let {
  freeze: Ce,
  seal: qe,
  create: Zo
} = Object, {
  apply: zi,
  construct: Hi
} = typeof Reflect < "u" && Reflect;
Ce || (Ce = function(e) {
  return e;
});
qe || (qe = function(e) {
  return e;
});
zi || (zi = function(e, t, r) {
  return e.apply(t, r);
});
Hi || (Hi = function(e, t) {
  return new e(...t);
});
const Qn = Ie(Array.prototype.forEach), $l = Ie(Array.prototype.lastIndexOf), Ps = Ie(Array.prototype.pop), xn = Ie(Array.prototype.push), Dl = Ie(Array.prototype.splice), ir = Ie(String.prototype.toLowerCase), Br = Ie(String.prototype.toString), Ms = Ie(String.prototype.match), kn = Ie(String.prototype.replace), Bl = Ie(String.prototype.indexOf), Ul = Ie(String.prototype.trim), Ve = Ie(Object.prototype.hasOwnProperty), Te = Ie(RegExp.prototype.test), Sn = Fl(TypeError);
function Ie(n) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
      r[i - 1] = arguments[i];
    return zi(n, e, r);
  };
}
function Fl(n) {
  return function() {
    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
      t[r] = arguments[r];
    return Hi(n, t);
  };
}
function ne(n, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ir;
  Ns && Ns(n, null);
  let r = e.length;
  for (; r--; ) {
    let i = e[r];
    if (typeof i == "string") {
      const o = t(i);
      o !== i && (Nl(e) || (e[r] = o), i = o);
    }
    n[i] = !0;
  }
  return n;
}
function zl(n) {
  for (let e = 0; e < n.length; e++)
    Ve(n, e) || (n[e] = null);
  return n;
}
function ct(n) {
  const e = Zo(null);
  for (const [t, r] of Ko(n))
    Ve(n, t) && (Array.isArray(r) ? e[t] = zl(r) : r && typeof r == "object" && r.constructor === Object ? e[t] = ct(r) : e[t] = r);
  return e;
}
function _n(n, e) {
  for (; n !== null; ) {
    const r = Ml(n, e);
    if (r) {
      if (r.get)
        return Ie(r.get);
      if (typeof r.value == "function")
        return Ie(r.value);
    }
    n = Pl(n);
  }
  function t() {
    return null;
  }
  return t;
}
const $s = Ce(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), Ur = Ce(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), Fr = Ce(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Hl = Ce(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), zr = Ce(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), ql = Ce(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Ds = Ce(["#text"]), Bs = Ce(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), Hr = Ce(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), Us = Ce(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Jn = Ce(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Gl = qe(/\{\{[\w\W]*|[\w\W]*\}\}/gm), jl = qe(/<%[\w\W]*|[\w\W]*%>/gm), Vl = qe(/\$\{[\w\W]*/gm), Wl = qe(/^data-[\-\w.\u00B7-\uFFFF]+$/), Xl = qe(/^aria-[\-\w]+$/), Qo = qe(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Yl = qe(/^(?:\w+script|data):/i), Kl = qe(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), Jo = qe(/^html$/i), Zl = qe(/^[a-z][.\w]*(-[.\w]+)+$/i);
var Fs = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: Xl,
  ATTR_WHITESPACE: Kl,
  CUSTOM_ELEMENT: Zl,
  DATA_ATTR: Wl,
  DOCTYPE_NAME: Jo,
  ERB_EXPR: jl,
  IS_ALLOWED_URI: Qo,
  IS_SCRIPT_OR_DATA: Yl,
  MUSTACHE_EXPR: Gl,
  TMPLIT_EXPR: Vl
});
const Rn = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, Ql = function() {
  return typeof window > "u" ? null : window;
}, Jl = function(e, t) {
  if (typeof e != "object" || typeof e.createPolicy != "function")
    return null;
  let r = null;
  const i = "data-tt-policy-suffix";
  t && t.hasAttribute(i) && (r = t.getAttribute(i));
  const o = "dompurify" + (r ? "#" + r : "");
  try {
    return e.createPolicy(o, {
      createHTML(s) {
        return s;
      },
      createScriptURL(s) {
        return s;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + o + " could not be created."), null;
  }
}, zs = function() {
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
function ea() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Ql();
  const e = (D) => ea(D);
  if (e.version = "3.2.6", e.removed = [], !n || !n.document || n.document.nodeType !== Rn.document || !n.Element)
    return e.isSupported = !1, e;
  let {
    document: t
  } = n;
  const r = t, i = r.currentScript, {
    DocumentFragment: o,
    HTMLTemplateElement: s,
    Node: a,
    Element: c,
    NodeFilter: l,
    NamedNodeMap: u = n.NamedNodeMap || n.MozNamedAttrMap,
    HTMLFormElement: p,
    DOMParser: g,
    trustedTypes: k
  } = n, C = c.prototype, y = _n(C, "cloneNode"), F = _n(C, "remove"), K = _n(C, "nextSibling"), re = _n(C, "childNodes"), N = _n(C, "parentNode");
  if (typeof s == "function") {
    const D = t.createElement("template");
    D.content && D.content.ownerDocument && (t = D.content.ownerDocument);
  }
  let J, ae = "";
  const {
    implementation: ie,
    createNodeIterator: se,
    createDocumentFragment: G,
    getElementsByTagName: Ke
  } = t, {
    importNode: mt
  } = r;
  let be = zs();
  e.isSupported = typeof Ko == "function" && typeof N == "function" && ie && ie.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: it,
    ERB_EXPR: st,
    TMPLIT_EXPR: T,
    DATA_ATTR: R,
    ARIA_ATTR: z,
    IS_SCRIPT_OR_DATA: P,
    ATTR_WHITESPACE: $,
    CUSTOM_ELEMENT: M
  } = Fs;
  let {
    IS_ALLOWED_URI: j
  } = Fs, H = null;
  const Z = ne({}, [...$s, ...Ur, ...Fr, ...zr, ...Ds]);
  let W = null;
  const ve = ne({}, [...Bs, ...Hr, ...Us, ...Jn]);
  let X = Object.seal(Zo(null, {
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
  })), Me = null, tn = null, Pn = !0, Mn = !0, At = !1, $n = !0, wt = !1, Bt = !0, ot = !1, nn = !1, rn = !1, bt = !1, Ut = !1, Ft = !1, sn = !0, Dn = !1;
  const yr = "user-content-";
  let zt = !0, $e = !1, at = {}, De = null;
  const Ct = ne({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let on = null;
  const Bn = ne({}, ["audio", "video", "img", "source", "image", "track"]);
  let an = null;
  const Un = ne({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Ht = "http://www.w3.org/1998/Math/MathML", qt = "http://www.w3.org/2000/svg", Fe = "http://www.w3.org/1999/xhtml";
  let Et = Fe, ln = !1, cn = null;
  const un = ne({}, [Ht, qt, Fe], Br);
  let It = ne({}, ["mi", "mo", "mn", "ms", "mtext"]), Lt = ne({}, ["annotation-xml"]);
  const xr = ne({}, ["title", "style", "font", "a", "script"]);
  let vt = null;
  const yt = ["application/xhtml+xml", "text/html"], h = "text/html";
  let f = null, _ = null;
  const V = t.createElement("form"), we = function(d) {
    return d instanceof RegExp || d instanceof Function;
  }, me = function() {
    let d = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(_ && _ === d)) {
      if ((!d || typeof d != "object") && (d = {}), d = ct(d), vt = // eslint-disable-next-line unicorn/prefer-includes
      yt.indexOf(d.PARSER_MEDIA_TYPE) === -1 ? h : d.PARSER_MEDIA_TYPE, f = vt === "application/xhtml+xml" ? Br : ir, H = Ve(d, "ALLOWED_TAGS") ? ne({}, d.ALLOWED_TAGS, f) : Z, W = Ve(d, "ALLOWED_ATTR") ? ne({}, d.ALLOWED_ATTR, f) : ve, cn = Ve(d, "ALLOWED_NAMESPACES") ? ne({}, d.ALLOWED_NAMESPACES, Br) : un, an = Ve(d, "ADD_URI_SAFE_ATTR") ? ne(ct(Un), d.ADD_URI_SAFE_ATTR, f) : Un, on = Ve(d, "ADD_DATA_URI_TAGS") ? ne(ct(Bn), d.ADD_DATA_URI_TAGS, f) : Bn, De = Ve(d, "FORBID_CONTENTS") ? ne({}, d.FORBID_CONTENTS, f) : Ct, Me = Ve(d, "FORBID_TAGS") ? ne({}, d.FORBID_TAGS, f) : ct({}), tn = Ve(d, "FORBID_ATTR") ? ne({}, d.FORBID_ATTR, f) : ct({}), at = Ve(d, "USE_PROFILES") ? d.USE_PROFILES : !1, Pn = d.ALLOW_ARIA_ATTR !== !1, Mn = d.ALLOW_DATA_ATTR !== !1, At = d.ALLOW_UNKNOWN_PROTOCOLS || !1, $n = d.ALLOW_SELF_CLOSE_IN_ATTR !== !1, wt = d.SAFE_FOR_TEMPLATES || !1, Bt = d.SAFE_FOR_XML !== !1, ot = d.WHOLE_DOCUMENT || !1, bt = d.RETURN_DOM || !1, Ut = d.RETURN_DOM_FRAGMENT || !1, Ft = d.RETURN_TRUSTED_TYPE || !1, rn = d.FORCE_BODY || !1, sn = d.SANITIZE_DOM !== !1, Dn = d.SANITIZE_NAMED_PROPS || !1, zt = d.KEEP_CONTENT !== !1, $e = d.IN_PLACE || !1, j = d.ALLOWED_URI_REGEXP || Qo, Et = d.NAMESPACE || Fe, It = d.MATHML_TEXT_INTEGRATION_POINTS || It, Lt = d.HTML_INTEGRATION_POINTS || Lt, X = d.CUSTOM_ELEMENT_HANDLING || {}, d.CUSTOM_ELEMENT_HANDLING && we(d.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (X.tagNameCheck = d.CUSTOM_ELEMENT_HANDLING.tagNameCheck), d.CUSTOM_ELEMENT_HANDLING && we(d.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (X.attributeNameCheck = d.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), d.CUSTOM_ELEMENT_HANDLING && typeof d.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (X.allowCustomizedBuiltInElements = d.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), wt && (Mn = !1), Ut && (bt = !0), at && (H = ne({}, Ds), W = [], at.html === !0 && (ne(H, $s), ne(W, Bs)), at.svg === !0 && (ne(H, Ur), ne(W, Hr), ne(W, Jn)), at.svgFilters === !0 && (ne(H, Fr), ne(W, Hr), ne(W, Jn)), at.mathMl === !0 && (ne(H, zr), ne(W, Us), ne(W, Jn))), d.ADD_TAGS && (H === Z && (H = ct(H)), ne(H, d.ADD_TAGS, f)), d.ADD_ATTR && (W === ve && (W = ct(W)), ne(W, d.ADD_ATTR, f)), d.ADD_URI_SAFE_ATTR && ne(an, d.ADD_URI_SAFE_ATTR, f), d.FORBID_CONTENTS && (De === Ct && (De = ct(De)), ne(De, d.FORBID_CONTENTS, f)), zt && (H["#text"] = !0), ot && ne(H, ["html", "head", "body"]), H.table && (ne(H, ["tbody"]), delete Me.tbody), d.TRUSTED_TYPES_POLICY) {
        if (typeof d.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw Sn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof d.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw Sn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        J = d.TRUSTED_TYPES_POLICY, ae = J.createHTML("");
      } else
        J === void 0 && (J = Jl(k, i)), J !== null && typeof ae == "string" && (ae = J.createHTML(""));
      Ce && Ce(d), _ = d;
    }
  }, O = ne({}, [...Ur, ...Fr, ...Hl]), L = ne({}, [...zr, ...ql]), q = function(d) {
    let S = N(d);
    (!S || !S.tagName) && (S = {
      namespaceURI: Et,
      tagName: "template"
    });
    const I = ir(d.tagName), pe = ir(S.tagName);
    return cn[d.namespaceURI] ? d.namespaceURI === qt ? S.namespaceURI === Fe ? I === "svg" : S.namespaceURI === Ht ? I === "svg" && (pe === "annotation-xml" || It[pe]) : !!O[I] : d.namespaceURI === Ht ? S.namespaceURI === Fe ? I === "math" : S.namespaceURI === qt ? I === "math" && Lt[pe] : !!L[I] : d.namespaceURI === Fe ? S.namespaceURI === qt && !Lt[pe] || S.namespaceURI === Ht && !It[pe] ? !1 : !L[I] && (xr[I] || !O[I]) : !!(vt === "application/xhtml+xml" && cn[d.namespaceURI]) : !1;
  }, le = function(d) {
    xn(e.removed, {
      element: d
    });
    try {
      N(d).removeChild(d);
    } catch {
      F(d);
    }
  }, de = function(d, S) {
    try {
      xn(e.removed, {
        attribute: S.getAttributeNode(d),
        from: S
      });
    } catch {
      xn(e.removed, {
        attribute: null,
        from: S
      });
    }
    if (S.removeAttribute(d), d === "is")
      if (bt || Ut)
        try {
          le(S);
        } catch {
        }
      else
        try {
          S.setAttribute(d, "");
        } catch {
        }
  }, xt = function(d) {
    let S = null, I = null;
    if (rn)
      d = "<remove></remove>" + d;
    else {
      const Ee = Ms(d, /^[\r\n\t ]+/);
      I = Ee && Ee[0];
    }
    vt === "application/xhtml+xml" && Et === Fe && (d = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + d + "</body></html>");
    const pe = J ? J.createHTML(d) : d;
    if (Et === Fe)
      try {
        S = new g().parseFromString(pe, vt);
      } catch {
      }
    if (!S || !S.documentElement) {
      S = ie.createDocument(Et, "template", null);
      try {
        S.documentElement.innerHTML = ln ? ae : pe;
      } catch {
      }
    }
    const xe = S.body || S.documentElement;
    return d && I && xe.insertBefore(t.createTextNode(I), xe.childNodes[0] || null), Et === Fe ? Ke.call(S, ot ? "html" : "body")[0] : ot ? S.documentElement : xe;
  }, Gt = function(d) {
    return se.call(
      d.ownerDocument || d,
      d,
      // eslint-disable-next-line no-bitwise
      l.SHOW_ELEMENT | l.SHOW_COMMENT | l.SHOW_TEXT | l.SHOW_PROCESSING_INSTRUCTION | l.SHOW_CDATA_SECTION,
      null
    );
  }, Ot = function(d) {
    return d instanceof p && (typeof d.nodeName != "string" || typeof d.textContent != "string" || typeof d.removeChild != "function" || !(d.attributes instanceof u) || typeof d.removeAttribute != "function" || typeof d.setAttribute != "function" || typeof d.namespaceURI != "string" || typeof d.insertBefore != "function" || typeof d.hasChildNodes != "function");
  }, Fn = function(d) {
    return typeof a == "function" && d instanceof a;
  };
  function Be(D, d, S) {
    Qn(D, (I) => {
      I.call(e, d, S, _);
    });
  }
  const zn = function(d) {
    let S = null;
    if (Be(be.beforeSanitizeElements, d, null), Ot(d))
      return le(d), !0;
    const I = f(d.nodeName);
    if (Be(be.uponSanitizeElement, d, {
      tagName: I,
      allowedTags: H
    }), Bt && d.hasChildNodes() && !Fn(d.firstElementChild) && Te(/<[/\w!]/g, d.innerHTML) && Te(/<[/\w!]/g, d.textContent) || d.nodeType === Rn.progressingInstruction || Bt && d.nodeType === Rn.comment && Te(/<[/\w]/g, d.data))
      return le(d), !0;
    if (!H[I] || Me[I]) {
      if (!Me[I] && qn(I) && (X.tagNameCheck instanceof RegExp && Te(X.tagNameCheck, I) || X.tagNameCheck instanceof Function && X.tagNameCheck(I)))
        return !1;
      if (zt && !De[I]) {
        const pe = N(d) || d.parentNode, xe = re(d) || d.childNodes;
        if (xe && pe) {
          const Ee = xe.length;
          for (let _e = Ee - 1; _e >= 0; --_e) {
            const Ge = y(xe[_e], !0);
            Ge.__removalCount = (d.__removalCount || 0) + 1, pe.insertBefore(Ge, K(d));
          }
        }
      }
      return le(d), !0;
    }
    return d instanceof c && !q(d) || (I === "noscript" || I === "noembed" || I === "noframes") && Te(/<\/no(script|embed|frames)/i, d.innerHTML) ? (le(d), !0) : (wt && d.nodeType === Rn.text && (S = d.textContent, Qn([it, st, T], (pe) => {
      S = kn(S, pe, " ");
    }), d.textContent !== S && (xn(e.removed, {
      element: d.cloneNode()
    }), d.textContent = S)), Be(be.afterSanitizeElements, d, null), !1);
  }, Hn = function(d, S, I) {
    if (sn && (S === "id" || S === "name") && (I in t || I in V))
      return !1;
    if (!(Mn && !tn[S] && Te(R, S))) {
      if (!(Pn && Te(z, S))) {
        if (!W[S] || tn[S]) {
          if (
            // First condition does a very basic check if a) it's basically a valid custom element tagname AND
            // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
            !(qn(d) && (X.tagNameCheck instanceof RegExp && Te(X.tagNameCheck, d) || X.tagNameCheck instanceof Function && X.tagNameCheck(d)) && (X.attributeNameCheck instanceof RegExp && Te(X.attributeNameCheck, S) || X.attributeNameCheck instanceof Function && X.attributeNameCheck(S)) || // Alternative, second condition checks if it's an `is`-attribute, AND
            // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            S === "is" && X.allowCustomizedBuiltInElements && (X.tagNameCheck instanceof RegExp && Te(X.tagNameCheck, I) || X.tagNameCheck instanceof Function && X.tagNameCheck(I)))
          ) return !1;
        } else if (!an[S]) {
          if (!Te(j, kn(I, $, ""))) {
            if (!((S === "src" || S === "xlink:href" || S === "href") && d !== "script" && Bl(I, "data:") === 0 && on[d])) {
              if (!(At && !Te(P, kn(I, $, "")))) {
                if (I)
                  return !1;
              }
            }
          }
        }
      }
    }
    return !0;
  }, qn = function(d) {
    return d !== "annotation-xml" && Ms(d, M);
  }, hn = function(d) {
    Be(be.beforeSanitizeAttributes, d, null);
    const {
      attributes: S
    } = d;
    if (!S || Ot(d))
      return;
    const I = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: W,
      forceKeepAttr: void 0
    };
    let pe = S.length;
    for (; pe--; ) {
      const xe = S[pe], {
        name: Ee,
        namespaceURI: _e,
        value: Ge
      } = xe, Ze = f(Ee), dn = Ge;
      let E = Ee === "value" ? dn : Ul(dn);
      if (I.attrName = Ze, I.attrValue = E, I.keepAttr = !0, I.forceKeepAttr = void 0, Be(be.uponSanitizeAttribute, d, I), E = I.attrValue, Dn && (Ze === "id" || Ze === "name") && (de(Ee, d), E = yr + E), Bt && Te(/((--!?|])>)|<\/(style|title)/i, E)) {
        de(Ee, d);
        continue;
      }
      if (I.forceKeepAttr)
        continue;
      if (!I.keepAttr) {
        de(Ee, d);
        continue;
      }
      if (!$n && Te(/\/>/i, E)) {
        de(Ee, d);
        continue;
      }
      wt && Qn([it, st, T], (te) => {
        E = kn(E, te, " ");
      });
      const B = f(d.nodeName);
      if (!Hn(B, Ze, E)) {
        de(Ee, d);
        continue;
      }
      if (J && typeof k == "object" && typeof k.getAttributeType == "function" && !_e)
        switch (k.getAttributeType(B, Ze)) {
          case "TrustedHTML": {
            E = J.createHTML(E);
            break;
          }
          case "TrustedScriptURL": {
            E = J.createScriptURL(E);
            break;
          }
        }
      if (E !== dn)
        try {
          _e ? d.setAttributeNS(_e, Ee, E) : d.setAttribute(Ee, E), Ot(d) ? le(d) : Ps(e.removed);
        } catch {
          de(Ee, d);
        }
    }
    Be(be.afterSanitizeAttributes, d, null);
  }, jt = function D(d) {
    let S = null;
    const I = Gt(d);
    for (Be(be.beforeSanitizeShadowDOM, d, null); S = I.nextNode(); )
      Be(be.uponSanitizeShadowNode, S, null), zn(S), hn(S), S.content instanceof o && D(S.content);
    Be(be.afterSanitizeShadowDOM, d, null);
  };
  return e.sanitize = function(D) {
    let d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, S = null, I = null, pe = null, xe = null;
    if (ln = !D, ln && (D = "<!-->"), typeof D != "string" && !Fn(D))
      if (typeof D.toString == "function") {
        if (D = D.toString(), typeof D != "string")
          throw Sn("dirty is not a string, aborting");
      } else
        throw Sn("toString is not a function");
    if (!e.isSupported)
      return D;
    if (nn || me(d), e.removed = [], typeof D == "string" && ($e = !1), $e) {
      if (D.nodeName) {
        const Ge = f(D.nodeName);
        if (!H[Ge] || Me[Ge])
          throw Sn("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (D instanceof a)
      S = xt("<!---->"), I = S.ownerDocument.importNode(D, !0), I.nodeType === Rn.element && I.nodeName === "BODY" || I.nodeName === "HTML" ? S = I : S.appendChild(I);
    else {
      if (!bt && !wt && !ot && // eslint-disable-next-line unicorn/prefer-includes
      D.indexOf("<") === -1)
        return J && Ft ? J.createHTML(D) : D;
      if (S = xt(D), !S)
        return bt ? null : Ft ? ae : "";
    }
    S && rn && le(S.firstChild);
    const Ee = Gt($e ? D : S);
    for (; pe = Ee.nextNode(); )
      zn(pe), hn(pe), pe.content instanceof o && jt(pe.content);
    if ($e)
      return D;
    if (bt) {
      if (Ut)
        for (xe = G.call(S.ownerDocument); S.firstChild; )
          xe.appendChild(S.firstChild);
      else
        xe = S;
      return (W.shadowroot || W.shadowrootmode) && (xe = mt.call(r, xe, !0)), xe;
    }
    let _e = ot ? S.outerHTML : S.innerHTML;
    return ot && H["!doctype"] && S.ownerDocument && S.ownerDocument.doctype && S.ownerDocument.doctype.name && Te(Jo, S.ownerDocument.doctype.name) && (_e = "<!DOCTYPE " + S.ownerDocument.doctype.name + `>
` + _e), wt && Qn([it, st, T], (Ge) => {
      _e = kn(_e, Ge, " ");
    }), J && Ft ? J.createHTML(_e) : _e;
  }, e.setConfig = function() {
    let D = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    me(D), nn = !0;
  }, e.clearConfig = function() {
    _ = null, nn = !1;
  }, e.isValidAttribute = function(D, d, S) {
    _ || me({});
    const I = f(D), pe = f(d);
    return Hn(I, pe, S);
  }, e.addHook = function(D, d) {
    typeof d == "function" && xn(be[D], d);
  }, e.removeHook = function(D, d) {
    if (d !== void 0) {
      const S = $l(be[D], d);
      return S === -1 ? void 0 : Dl(be[D], S, 1)[0];
    }
    return Ps(be[D]);
  }, e.removeHooks = function(D) {
    be[D] = [];
  }, e.removeAllHooks = function() {
    be = zs();
  }, e;
}
var Hs = ea();
function ec(n, e) {
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
  let r = ue.parse(n.text);
  return r instanceof Promise ? r.then((i) => {
    t.innerHTML = Hs.sanitize(i);
  }) : t.innerHTML = Hs.sanitize(r), t;
}
class tc extends Ln {
  async prepare() {
    this.textContainer = document.createElement("div"), this.textContainer.classList.add("text-card"), this.root.appendChild(this.textContainer), this.textContainer.style.backgroundColor = this.card.background_color;
    const e = {
      text: this.card.text,
      textColor: this.card.text_color,
      fontSize: this.card.font_size,
      justificationHorizontal: this.card.justification_horizontal,
      justificationVertical: this.card.justification_vertical
    }, t = ec(
      e,
      (r) => this.boardCoords.getSizePx(r) + "px"
    );
    this.textContainer.appendChild(t);
  }
}
class nc extends Ln {
  async prepare(e) {
    this.videoContainer = document.createElement("div"), this.videoContainer.classList.add("video-card"), this.root.appendChild(this.videoContainer), this.video = await e.getVideoElement(
      this.card.video
    ), this.video.classList.add("video-card__content"), this.videoContainer.appendChild(this.video), this.video.muted = this.card.muted, this.video.loop = this.card.loop, this.video.draggable = !0;
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
class rc {
  constructor(e, t) {
    this.subscriptions = [], this.target = e, this.clock = t, this.boardCoordinateSystem = this.getCoordinateSystem();
    const r = () => {
      this.boardCoordinateSystem = this.getCoordinateSystem();
    };
    window.addEventListener("resize", r);
    let i = !1, o = 0;
    const s = 30, a = (c) => {
      if (!this.clock.checkClockStarted())
        return;
      i || (this.boardCoordinateSystem = this.getCoordinateSystem(), i = !0);
      let l;
      switch (c.type) {
        case "pointermove":
          if (c.timeStamp - o < 1e3 / s)
            return;
          l = "move", o = c.timeStamp;
          break;
        case "pointerdown":
          if (c.button !== 0)
            return;
          l = "down";
          break;
        case "pointerup":
          if (c.button !== 0)
            return;
          l = "up";
          break;
        default:
          return;
      }
      const { x: u, y: p } = this.boardCoordinateSystem.getBoardLocationFromPointerEvent(c), g = {
        sampleType: l,
        x: u,
        y: p,
        t: t.now()
      };
      this.subscriptions.forEach((k) => k(g));
    };
    this.target.addEventListener("pointermove", a), this.target.addEventListener("pointerdown", a), this.target.addEventListener("pointerup", a);
  }
  getCoordinateSystem() {
    return new ta(this.target);
  }
  subscribe(e) {
    return this.subscriptions.push(e), (() => {
      this.subscriptions = this.subscriptions.filter((t) => t !== e);
    });
  }
  destroy() {
    this.subscriptions = [];
  }
}
class ic {
  constructor(e) {
    this.listeners = [], this.holdingKeys = /* @__PURE__ */ new Set(), this.handleKeyDown = (t) => {
      if (!this.clock.checkClockStarted() || this.holdingKeys.has(t.key) && t.repeat)
        return;
      this.holdingKeys.add(t.key);
      const r = {
        sampleType: "down",
        key: t.key,
        t: this.clock.now()
      };
      this.emit(r);
    }, this.handleKeyUp = (t) => {
      if (!this.clock.checkClockStarted())
        return;
      this.holdingKeys.delete(t.key);
      const r = {
        sampleType: "up",
        key: t.key,
        t: this.clock.now()
      };
      this.emit(r);
    }, window.addEventListener("keydown", this.handleKeyDown), window.addEventListener("keyup", this.handleKeyUp), window.addEventListener("blur", () => {
      this.holdingKeys.clear();
    }), this.clock = e;
  }
  emit(e) {
    for (const t of this.listeners)
      t(e);
  }
  subscribe(e) {
    return this.listeners.push(e), () => {
      this.listeners = this.listeners.filter((t) => t !== e);
    };
  }
  destroy() {
    window.removeEventListener("keydown", this.handleKeyDown), window.removeEventListener("keyup", this.handleKeyUp), this.listeners = [];
  }
}
class sc extends Ln {
  async prepare() {
    this.sliderElement = document.createElement("input"), this.sliderElement.type = "range", this.sliderElement.classList.add("slider-card"), this.sliderElement.min = "1", this.sliderElement.step = "1", this.sliderElement.max = this.card.num_bins.toString(), this.card.orientation === "horizontal" ? this.sliderElement.classList.add("slider-card--horizontal") : this.sliderElement.classList.add("slider-card--vertical");
    const e = this.card.num_bins / 2;
    this.sliderElement.value = e.toString(), this.root.appendChild(this.sliderElement);
  }
  onStart() {
    this.setInteractivity(!0);
  }
}
class oc extends Ln {
  async prepare() {
    this.freeTextInputElement = document.createElement("textarea"), this.freeTextInputElement.classList.add("free-text-entry-card"), this.freeTextInputElement.spellcheck = !1, this.freeTextInputElement.style.backgroundColor = this.card.background_color, this.freeTextInputElement.style.color = this.card.text_color, this.freeTextInputElement.style.fontSize = this.boardCoords.getSizePx(this.card.font_size) + "px", this.freeTextInputElement.placeholder = this.card.prompt;
    let e = 1e4;
    this.card.max_length !== null && (e = this.card.max_length), this.freeTextInputElement.maxLength = e, this.root.appendChild(this.freeTextInputElement);
  }
  onStart() {
    this.setInteractivity(!0);
  }
  onStop() {
  }
  onDestroy() {
  }
}
class ta {
  constructor(e) {
    const { width: t, height: r, left: i, top: o } = e.getBoundingClientRect();
    this.boardWidthPx = t, this.boardHeightPx = r, this.boardLeftPx = i, this.boardTopPx = o;
  }
  getUnitPx() {
    return Math.min(this.boardWidthPx, this.boardHeightPx);
  }
  getBoardLocationPx(e, t, r, i) {
    const o = this.getUnitPx(), s = this.boardWidthPx / o, a = this.boardHeightPx / o, c = o * (e - r / 2 + s / 2), l = o * (-t - i / 2 + a / 2);
    return {
      leftPx: c,
      topPx: l
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
  getBoardLocationFromPointerEvent(e) {
    let t = (e.clientX - this.boardLeftPx) / this.boardWidthPx - 0.5, r = -((e.clientY - this.boardTopPx) / this.boardHeightPx - 0.5);
    const i = 10;
    return t = parseFloat(t.toFixed(i)), r = parseFloat(r.toFixed(i)), {
      x: t,
      y: r
    };
  }
}
class ac {
  // Map of sensor ID to SensorBinding
  constructor(e) {
    this.cardViews = /* @__PURE__ */ new Map(), this.sensorBindings = /* @__PURE__ */ new Map(), this.root = document.createElement("div"), this.root.className = "board-view", this.root.style.backgroundColor = e, document.body.style.backgroundColor = e, this.setBoardState(!1, !1);
  }
  getCoordinateSystem() {
    return new ta(this.root);
  }
  reset() {
    for (; this.root.firstChild; )
      this.root.removeChild(this.root.firstChild);
  }
  setBoardState(e, t) {
    e ? this.root.style.opacity = "1" : this.root.style.opacity = "0", t ? (this.root.removeAttribute("disabled"), this.root.style.pointerEvents = "", this.root.style.userSelect = "", this.root.style.opacity = "") : (this.root.setAttribute("disabled", "true"), this.root.style.pointerEvents = "none", this.root.style.userSelect = "none");
  }
  getCardView(e) {
    const t = this.cardViews.get(e);
    if (!t)
      throw new Error(`CardView with ID ${e} not found.`);
    return t;
  }
  async prepareCard(e, t) {
    const r = this.getCoordinateSystem();
    let i = null;
    switch (e.card_type) {
      case "ImageCard":
        i = new Ka(
          e,
          r
        );
        break;
      case "VideoCard":
        i = new nc(
          e,
          r
        );
        break;
      case "TextCard":
        i = new tc(
          e,
          r
        );
        break;
      case "SliderCard":
        i = new sc(
          e,
          r
        );
        break;
      case "FreeTextEntryCard":
        i = new oc(
          e,
          r
        );
        break;
      default:
        throw new Error(`Unsupported Card type: ${JSON.stringify(e)}`);
    }
    await i.prepare(t), this.root.appendChild(i.root);
    const o = crypto.randomUUID();
    return this.cardViews.set(o, i), o;
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
  getSensorBinding(e) {
    const t = this.sensorBindings.get(e);
    if (!t)
      throw new Error(`SensorBinding with ID ${e} not found.`);
    return t;
  }
  prepareSensor(e, t, r, i, o) {
    let s = null;
    if (e.sensor_type === "TimeoutSensor")
      s = new Xa(
        t,
        o
      );
    else if (e.sensor_type === "KeySensor")
      s = new Ya(
        t,
        e.key,
        r
      );
    else if (e.sensor_type == "ClickSensor")
      s = new Wa(
        e.x,
        e.y,
        e.w,
        e.h,
        e.mask,
        t,
        i
      );
    else
      throw new Error(`Unknown Sensor provided: ${e}`);
    const a = crypto.randomUUID();
    return this.sensorBindings.set(a, s), a;
  }
  startSensor(e) {
    this.getSensorBinding(e).arm();
  }
  destroySensor(e) {
    const t = this.getSensorBinding(e);
    t && (t.destroy(), this.sensorBindings.delete(e));
  }
}
class lc {
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
    }, r = this.events.findIndex((i) => i.triggerTimeMsec > t.triggerTimeMsec);
    r === -1 ? this.events.push(t) : this.events.splice(r, 0, t);
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
class cc {
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
class uc {
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
class hc {
  constructor(e, t) {
    this.prepared = !1, this.started = !1, this.deferredSensorFiring = new uc(), this.boardView = new ac(t.board_color), this.node = t, this.nodeId = e, this.scheduler = new lc();
  }
  async prepare(e, t, r, i, o) {
    for (let s in this.node.cards) {
      const a = this.node.cards[s], c = await this.boardView.prepareCard(
        a,
        e
      );
      this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: a.start_msec,
          triggerFunc: () => {
            this.boardView.startCard(c);
            const l = {
              event_type: "CardShownEvent",
              t: i.now(),
              node_id: this.nodeId,
              card_id: s
            };
            o.push(l);
          }
        }
      ), a.end_msec !== null && this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: a.end_msec,
          triggerFunc: () => {
            this.boardView.stopCard(c);
            const l = {
              event_type: "CardHiddenEvent",
              t: i.now(),
              node_id: this.nodeId,
              card_id: s
            };
            o.push(l);
          }
        }
      ), this.scheduler.scheduleOnStop(
        () => {
          this.boardView.destroyCard(c);
        }
      );
    }
    for (let s in this.node.sensors) {
      const a = this.node.sensors[s], c = this.boardView.prepareSensor(
        a,
        (l, u) => this.deferredSensorFiring.resolve({
          sensorId: s,
          t: u,
          action: l
        }),
        t,
        r,
        i
      );
      (a.sensor_type === "ClickSensor" || a.sensor_type === "KeySensor") && (this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: a.start_msec,
          triggerFunc: () => {
            this.boardView.startSensor(c);
            const l = {
              event_type: "SensorArmedEvent",
              t: i.now(),
              node_id: this.nodeId,
              sensor_id: s
            };
            o.push(l);
          }
        }
      ), a.end_msec !== null && this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: a.end_msec,
          triggerFunc: () => {
            this.boardView.destroySensor(c);
            const l = {
              event_type: "SensorDisarmedEvent",
              t: i.now(),
              node_id: this.nodeId,
              sensor_id: s
            };
            o.push(l);
          }
        }
      )), a.sensor_type === "TimeoutSensor" && this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: a.timeout_msec,
          triggerFunc: () => {
            this.boardView.startSensor(c);
          }
        }
      ), this.scheduler.scheduleOnStop(
        () => {
          this.boardView.destroySensor(c);
        }
      );
    }
    for (const s of this.node.effects) {
      const a = new cc(this.boardView);
      this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: s.start_msec,
          triggerFunc: () => {
            a.start();
          }
        }
      ), s.end_msec !== null && this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: s.end_msec,
          triggerFunc: () => {
            a.stop();
          }
        }
      ), this.scheduler.scheduleOnStop(
        () => {
          a.stop();
        }
      );
    }
    this.prepared = !0;
  }
  async run(e, t) {
    if (!this.prepared)
      throw new Error("NodePlay not prepared");
    if (this.started)
      throw new Error("NodePlay already started");
    this.boardView.setBoardState(!0, !0), this.started = !0;
    const r = {
      event_type: "NodeEnteredEvent",
      t: e.now(),
      node_id: this.nodeId
    };
    t.push(r), this.scheduler.start();
    const i = await this.deferredSensorFiring.promise;
    this.scheduler.stop();
    const o = {
      event_type: "SensorFiredEvent",
      t: i.t,
      node_id: this.nodeId,
      sensor_id: i.sensorId,
      action: i.action
    };
    t.push(o), this.boardView.reset();
    const s = {
      event_type: "NodeExitedEvent",
      t: e.now(),
      node_id: this.nodeId
    };
    return t.push(s), {
      sensorId: i.sensorId,
      action: i.action
    };
  }
}
const er = "0.1.0";
var tr = { exports: {} }, qr, qs;
function mr() {
  if (qs) return qr;
  qs = 1;
  const n = "2.0.0", e = 256, t = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
  9007199254740991, r = 16, i = e - 6;
  return qr = {
    MAX_LENGTH: e,
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: i,
    MAX_SAFE_INTEGER: t,
    RELEASE_TYPES: [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ],
    SEMVER_SPEC_VERSION: n,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  }, qr;
}
var Gr, Gs;
function wr() {
  return Gs || (Gs = 1, Gr = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
  }), Gr;
}
var js;
function Nn() {
  return js || (js = 1, (function(n, e) {
    const {
      MAX_SAFE_COMPONENT_LENGTH: t,
      MAX_SAFE_BUILD_LENGTH: r,
      MAX_LENGTH: i
    } = mr(), o = wr();
    e = n.exports = {};
    const s = e.re = [], a = e.safeRe = [], c = e.src = [], l = e.safeSrc = [], u = e.t = {};
    let p = 0;
    const g = "[a-zA-Z0-9-]", k = [
      ["\\s", 1],
      ["\\d", i],
      [g, r]
    ], C = (F) => {
      for (const [K, re] of k)
        F = F.split(`${K}*`).join(`${K}{0,${re}}`).split(`${K}+`).join(`${K}{1,${re}}`);
      return F;
    }, y = (F, K, re) => {
      const N = C(K), J = p++;
      o(F, J, K), u[F] = J, c[J] = K, l[J] = N, s[J] = new RegExp(K, re ? "g" : void 0), a[J] = new RegExp(N, re ? "g" : void 0);
    };
    y("NUMERICIDENTIFIER", "0|[1-9]\\d*"), y("NUMERICIDENTIFIERLOOSE", "\\d+"), y("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${g}*`), y("MAINVERSION", `(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})`), y("MAINVERSIONLOOSE", `(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASEIDENTIFIER", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIER]})`), y("PRERELEASEIDENTIFIERLOOSE", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASE", `(?:-(${c[u.PRERELEASEIDENTIFIER]}(?:\\.${c[u.PRERELEASEIDENTIFIER]})*))`), y("PRERELEASELOOSE", `(?:-?(${c[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[u.PRERELEASEIDENTIFIERLOOSE]})*))`), y("BUILDIDENTIFIER", `${g}+`), y("BUILD", `(?:\\+(${c[u.BUILDIDENTIFIER]}(?:\\.${c[u.BUILDIDENTIFIER]})*))`), y("FULLPLAIN", `v?${c[u.MAINVERSION]}${c[u.PRERELEASE]}?${c[u.BUILD]}?`), y("FULL", `^${c[u.FULLPLAIN]}$`), y("LOOSEPLAIN", `[v=\\s]*${c[u.MAINVERSIONLOOSE]}${c[u.PRERELEASELOOSE]}?${c[u.BUILD]}?`), y("LOOSE", `^${c[u.LOOSEPLAIN]}$`), y("GTLT", "((?:<|>)?=?)"), y("XRANGEIDENTIFIERLOOSE", `${c[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), y("XRANGEIDENTIFIER", `${c[u.NUMERICIDENTIFIER]}|x|X|\\*`), y("XRANGEPLAIN", `[v=\\s]*(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:${c[u.PRERELEASE]})?${c[u.BUILD]}?)?)?`), y("XRANGEPLAINLOOSE", `[v=\\s]*(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:${c[u.PRERELEASELOOSE]})?${c[u.BUILD]}?)?)?`), y("XRANGE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAIN]}$`), y("XRANGELOOSE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAINLOOSE]}$`), y("COERCEPLAIN", `(^|[^\\d])(\\d{1,${t}})(?:\\.(\\d{1,${t}}))?(?:\\.(\\d{1,${t}}))?`), y("COERCE", `${c[u.COERCEPLAIN]}(?:$|[^\\d])`), y("COERCEFULL", c[u.COERCEPLAIN] + `(?:${c[u.PRERELEASE]})?(?:${c[u.BUILD]})?(?:$|[^\\d])`), y("COERCERTL", c[u.COERCE], !0), y("COERCERTLFULL", c[u.COERCEFULL], !0), y("LONETILDE", "(?:~>?)"), y("TILDETRIM", `(\\s*)${c[u.LONETILDE]}\\s+`, !0), e.tildeTrimReplace = "$1~", y("TILDE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAIN]}$`), y("TILDELOOSE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAINLOOSE]}$`), y("LONECARET", "(?:\\^)"), y("CARETTRIM", `(\\s*)${c[u.LONECARET]}\\s+`, !0), e.caretTrimReplace = "$1^", y("CARET", `^${c[u.LONECARET]}${c[u.XRANGEPLAIN]}$`), y("CARETLOOSE", `^${c[u.LONECARET]}${c[u.XRANGEPLAINLOOSE]}$`), y("COMPARATORLOOSE", `^${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]})$|^$`), y("COMPARATOR", `^${c[u.GTLT]}\\s*(${c[u.FULLPLAIN]})$|^$`), y("COMPARATORTRIM", `(\\s*)${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]}|${c[u.XRANGEPLAIN]})`, !0), e.comparatorTrimReplace = "$1$2$3", y("HYPHENRANGE", `^\\s*(${c[u.XRANGEPLAIN]})\\s+-\\s+(${c[u.XRANGEPLAIN]})\\s*$`), y("HYPHENRANGELOOSE", `^\\s*(${c[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[u.XRANGEPLAINLOOSE]})\\s*$`), y("STAR", "(<|>)?=?\\s*\\*"), y("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), y("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  })(tr, tr.exports)), tr.exports;
}
var jr, Vs;
function ts() {
  if (Vs) return jr;
  Vs = 1;
  const n = Object.freeze({ loose: !0 }), e = Object.freeze({});
  return jr = (r) => r ? typeof r != "object" ? n : r : e, jr;
}
var Vr, Ws;
function na() {
  if (Ws) return Vr;
  Ws = 1;
  const n = /^[0-9]+$/, e = (r, i) => {
    const o = n.test(r), s = n.test(i);
    return o && s && (r = +r, i = +i), r === i ? 0 : o && !s ? -1 : s && !o ? 1 : r < i ? -1 : 1;
  };
  return Vr = {
    compareIdentifiers: e,
    rcompareIdentifiers: (r, i) => e(i, r)
  }, Vr;
}
var Wr, Xs;
function Le() {
  if (Xs) return Wr;
  Xs = 1;
  const n = wr(), { MAX_LENGTH: e, MAX_SAFE_INTEGER: t } = mr(), { safeRe: r, t: i } = Nn(), o = ts(), { compareIdentifiers: s } = na();
  class a {
    constructor(l, u) {
      if (u = o(u), l instanceof a) {
        if (l.loose === !!u.loose && l.includePrerelease === !!u.includePrerelease)
          return l;
        l = l.version;
      } else if (typeof l != "string")
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof l}".`);
      if (l.length > e)
        throw new TypeError(
          `version is longer than ${e} characters`
        );
      n("SemVer", l, u), this.options = u, this.loose = !!u.loose, this.includePrerelease = !!u.includePrerelease;
      const p = l.trim().match(u.loose ? r[i.LOOSE] : r[i.FULL]);
      if (!p)
        throw new TypeError(`Invalid Version: ${l}`);
      if (this.raw = l, this.major = +p[1], this.minor = +p[2], this.patch = +p[3], this.major > t || this.major < 0)
        throw new TypeError("Invalid major version");
      if (this.minor > t || this.minor < 0)
        throw new TypeError("Invalid minor version");
      if (this.patch > t || this.patch < 0)
        throw new TypeError("Invalid patch version");
      p[4] ? this.prerelease = p[4].split(".").map((g) => {
        if (/^[0-9]+$/.test(g)) {
          const k = +g;
          if (k >= 0 && k < t)
            return k;
        }
        return g;
      }) : this.prerelease = [], this.build = p[5] ? p[5].split(".") : [], this.format();
    }
    format() {
      return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
    }
    toString() {
      return this.version;
    }
    compare(l) {
      if (n("SemVer.compare", this.version, this.options, l), !(l instanceof a)) {
        if (typeof l == "string" && l === this.version)
          return 0;
        l = new a(l, this.options);
      }
      return l.version === this.version ? 0 : this.compareMain(l) || this.comparePre(l);
    }
    compareMain(l) {
      return l instanceof a || (l = new a(l, this.options)), s(this.major, l.major) || s(this.minor, l.minor) || s(this.patch, l.patch);
    }
    comparePre(l) {
      if (l instanceof a || (l = new a(l, this.options)), this.prerelease.length && !l.prerelease.length)
        return -1;
      if (!this.prerelease.length && l.prerelease.length)
        return 1;
      if (!this.prerelease.length && !l.prerelease.length)
        return 0;
      let u = 0;
      do {
        const p = this.prerelease[u], g = l.prerelease[u];
        if (n("prerelease compare", u, p, g), p === void 0 && g === void 0)
          return 0;
        if (g === void 0)
          return 1;
        if (p === void 0)
          return -1;
        if (p === g)
          continue;
        return s(p, g);
      } while (++u);
    }
    compareBuild(l) {
      l instanceof a || (l = new a(l, this.options));
      let u = 0;
      do {
        const p = this.build[u], g = l.build[u];
        if (n("build compare", u, p, g), p === void 0 && g === void 0)
          return 0;
        if (g === void 0)
          return 1;
        if (p === void 0)
          return -1;
        if (p === g)
          continue;
        return s(p, g);
      } while (++u);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(l, u, p) {
      if (l.startsWith("pre")) {
        if (!u && p === !1)
          throw new Error("invalid increment argument: identifier is empty");
        if (u) {
          const g = `-${u}`.match(this.options.loose ? r[i.PRERELEASELOOSE] : r[i.PRERELEASE]);
          if (!g || g[1] !== u)
            throw new Error(`invalid identifier: ${u}`);
        }
      }
      switch (l) {
        case "premajor":
          this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", u, p);
          break;
        case "preminor":
          this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", u, p);
          break;
        case "prepatch":
          this.prerelease.length = 0, this.inc("patch", u, p), this.inc("pre", u, p);
          break;
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case "prerelease":
          this.prerelease.length === 0 && this.inc("patch", u, p), this.inc("pre", u, p);
          break;
        case "release":
          if (this.prerelease.length === 0)
            throw new Error(`version ${this.raw} is not a prerelease`);
          this.prerelease.length = 0;
          break;
        case "major":
          (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
          break;
        case "minor":
          (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
          break;
        case "patch":
          this.prerelease.length === 0 && this.patch++, this.prerelease = [];
          break;
        // This probably shouldn't be used publicly.
        // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
        case "pre": {
          const g = Number(p) ? 1 : 0;
          if (this.prerelease.length === 0)
            this.prerelease = [g];
          else {
            let k = this.prerelease.length;
            for (; --k >= 0; )
              typeof this.prerelease[k] == "number" && (this.prerelease[k]++, k = -2);
            if (k === -1) {
              if (u === this.prerelease.join(".") && p === !1)
                throw new Error("invalid increment argument: identifier already exists");
              this.prerelease.push(g);
            }
          }
          if (u) {
            let k = [u, g];
            p === !1 && (k = [u]), s(this.prerelease[0], u) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = k) : this.prerelease = k;
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${l}`);
      }
      return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
    }
  }
  return Wr = a, Wr;
}
var Xr, Ys;
function en() {
  if (Ys) return Xr;
  Ys = 1;
  const n = Le();
  return Xr = (t, r, i = !1) => {
    if (t instanceof n)
      return t;
    try {
      return new n(t, r);
    } catch (o) {
      if (!i)
        return null;
      throw o;
    }
  }, Xr;
}
var Yr, Ks;
function dc() {
  if (Ks) return Yr;
  Ks = 1;
  const n = en();
  return Yr = (t, r) => {
    const i = n(t, r);
    return i ? i.version : null;
  }, Yr;
}
var Kr, Zs;
function pc() {
  if (Zs) return Kr;
  Zs = 1;
  const n = en();
  return Kr = (t, r) => {
    const i = n(t.trim().replace(/^[=v]+/, ""), r);
    return i ? i.version : null;
  }, Kr;
}
var Zr, Qs;
function fc() {
  if (Qs) return Zr;
  Qs = 1;
  const n = Le();
  return Zr = (t, r, i, o, s) => {
    typeof i == "string" && (s = o, o = i, i = void 0);
    try {
      return new n(
        t instanceof n ? t.version : t,
        i
      ).inc(r, o, s).version;
    } catch {
      return null;
    }
  }, Zr;
}
var Qr, Js;
function gc() {
  if (Js) return Qr;
  Js = 1;
  const n = en();
  return Qr = (t, r) => {
    const i = n(t, null, !0), o = n(r, null, !0), s = i.compare(o);
    if (s === 0)
      return null;
    const a = s > 0, c = a ? i : o, l = a ? o : i, u = !!c.prerelease.length;
    if (!!l.prerelease.length && !u) {
      if (!l.patch && !l.minor)
        return "major";
      if (l.compareMain(c) === 0)
        return l.minor && !l.patch ? "minor" : "patch";
    }
    const g = u ? "pre" : "";
    return i.major !== o.major ? g + "major" : i.minor !== o.minor ? g + "minor" : i.patch !== o.patch ? g + "patch" : "prerelease";
  }, Qr;
}
var Jr, eo;
function mc() {
  if (eo) return Jr;
  eo = 1;
  const n = Le();
  return Jr = (t, r) => new n(t, r).major, Jr;
}
var ei, to;
function wc() {
  if (to) return ei;
  to = 1;
  const n = Le();
  return ei = (t, r) => new n(t, r).minor, ei;
}
var ti, no;
function bc() {
  if (no) return ti;
  no = 1;
  const n = Le();
  return ti = (t, r) => new n(t, r).patch, ti;
}
var ni, ro;
function Ec() {
  if (ro) return ni;
  ro = 1;
  const n = en();
  return ni = (t, r) => {
    const i = n(t, r);
    return i && i.prerelease.length ? i.prerelease : null;
  }, ni;
}
var ri, io;
function Xe() {
  if (io) return ri;
  io = 1;
  const n = Le();
  return ri = (t, r, i) => new n(t, i).compare(new n(r, i)), ri;
}
var ii, so;
function vc() {
  if (so) return ii;
  so = 1;
  const n = Xe();
  return ii = (t, r, i) => n(r, t, i), ii;
}
var si, oo;
function yc() {
  if (oo) return si;
  oo = 1;
  const n = Xe();
  return si = (t, r) => n(t, r, !0), si;
}
var oi, ao;
function ns() {
  if (ao) return oi;
  ao = 1;
  const n = Le();
  return oi = (t, r, i) => {
    const o = new n(t, i), s = new n(r, i);
    return o.compare(s) || o.compareBuild(s);
  }, oi;
}
var ai, lo;
function xc() {
  if (lo) return ai;
  lo = 1;
  const n = ns();
  return ai = (t, r) => t.sort((i, o) => n(i, o, r)), ai;
}
var li, co;
function kc() {
  if (co) return li;
  co = 1;
  const n = ns();
  return li = (t, r) => t.sort((i, o) => n(o, i, r)), li;
}
var ci, uo;
function br() {
  if (uo) return ci;
  uo = 1;
  const n = Xe();
  return ci = (t, r, i) => n(t, r, i) > 0, ci;
}
var ui, ho;
function rs() {
  if (ho) return ui;
  ho = 1;
  const n = Xe();
  return ui = (t, r, i) => n(t, r, i) < 0, ui;
}
var hi, po;
function ra() {
  if (po) return hi;
  po = 1;
  const n = Xe();
  return hi = (t, r, i) => n(t, r, i) === 0, hi;
}
var di, fo;
function ia() {
  if (fo) return di;
  fo = 1;
  const n = Xe();
  return di = (t, r, i) => n(t, r, i) !== 0, di;
}
var pi, go;
function is() {
  if (go) return pi;
  go = 1;
  const n = Xe();
  return pi = (t, r, i) => n(t, r, i) >= 0, pi;
}
var fi, mo;
function ss() {
  if (mo) return fi;
  mo = 1;
  const n = Xe();
  return fi = (t, r, i) => n(t, r, i) <= 0, fi;
}
var gi, wo;
function sa() {
  if (wo) return gi;
  wo = 1;
  const n = ra(), e = ia(), t = br(), r = is(), i = rs(), o = ss();
  return gi = (a, c, l, u) => {
    switch (c) {
      case "===":
        return typeof a == "object" && (a = a.version), typeof l == "object" && (l = l.version), a === l;
      case "!==":
        return typeof a == "object" && (a = a.version), typeof l == "object" && (l = l.version), a !== l;
      case "":
      case "=":
      case "==":
        return n(a, l, u);
      case "!=":
        return e(a, l, u);
      case ">":
        return t(a, l, u);
      case ">=":
        return r(a, l, u);
      case "<":
        return i(a, l, u);
      case "<=":
        return o(a, l, u);
      default:
        throw new TypeError(`Invalid operator: ${c}`);
    }
  }, gi;
}
var mi, bo;
function Sc() {
  if (bo) return mi;
  bo = 1;
  const n = Le(), e = en(), { safeRe: t, t: r } = Nn();
  return mi = (o, s) => {
    if (o instanceof n)
      return o;
    if (typeof o == "number" && (o = String(o)), typeof o != "string")
      return null;
    s = s || {};
    let a = null;
    if (!s.rtl)
      a = o.match(s.includePrerelease ? t[r.COERCEFULL] : t[r.COERCE]);
    else {
      const k = s.includePrerelease ? t[r.COERCERTLFULL] : t[r.COERCERTL];
      let C;
      for (; (C = k.exec(o)) && (!a || a.index + a[0].length !== o.length); )
        (!a || C.index + C[0].length !== a.index + a[0].length) && (a = C), k.lastIndex = C.index + C[1].length + C[2].length;
      k.lastIndex = -1;
    }
    if (a === null)
      return null;
    const c = a[2], l = a[3] || "0", u = a[4] || "0", p = s.includePrerelease && a[5] ? `-${a[5]}` : "", g = s.includePrerelease && a[6] ? `+${a[6]}` : "";
    return e(`${c}.${l}.${u}${p}${g}`, s);
  }, mi;
}
var wi, Eo;
function _c() {
  if (Eo) return wi;
  Eo = 1;
  class n {
    constructor() {
      this.max = 1e3, this.map = /* @__PURE__ */ new Map();
    }
    get(t) {
      const r = this.map.get(t);
      if (r !== void 0)
        return this.map.delete(t), this.map.set(t, r), r;
    }
    delete(t) {
      return this.map.delete(t);
    }
    set(t, r) {
      if (!this.delete(t) && r !== void 0) {
        if (this.map.size >= this.max) {
          const o = this.map.keys().next().value;
          this.delete(o);
        }
        this.map.set(t, r);
      }
      return this;
    }
  }
  return wi = n, wi;
}
var bi, vo;
function Ye() {
  if (vo) return bi;
  vo = 1;
  const n = /\s+/g;
  class e {
    constructor(R, z) {
      if (z = i(z), R instanceof e)
        return R.loose === !!z.loose && R.includePrerelease === !!z.includePrerelease ? R : new e(R.raw, z);
      if (R instanceof o)
        return this.raw = R.value, this.set = [[R]], this.formatted = void 0, this;
      if (this.options = z, this.loose = !!z.loose, this.includePrerelease = !!z.includePrerelease, this.raw = R.trim().replace(n, " "), this.set = this.raw.split("||").map((P) => this.parseRange(P.trim())).filter((P) => P.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const P = this.set[0];
        if (this.set = this.set.filter(($) => !y($[0])), this.set.length === 0)
          this.set = [P];
        else if (this.set.length > 1) {
          for (const $ of this.set)
            if ($.length === 1 && F($[0])) {
              this.set = [$];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let R = 0; R < this.set.length; R++) {
          R > 0 && (this.formatted += "||");
          const z = this.set[R];
          for (let P = 0; P < z.length; P++)
            P > 0 && (this.formatted += " "), this.formatted += z[P].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(R) {
      const P = ((this.options.includePrerelease && k) | (this.options.loose && C)) + ":" + R, $ = r.get(P);
      if ($)
        return $;
      const M = this.options.loose, j = M ? c[l.HYPHENRANGELOOSE] : c[l.HYPHENRANGE];
      R = R.replace(j, it(this.options.includePrerelease)), s("hyphen replace", R), R = R.replace(c[l.COMPARATORTRIM], u), s("comparator trim", R), R = R.replace(c[l.TILDETRIM], p), s("tilde trim", R), R = R.replace(c[l.CARETTRIM], g), s("caret trim", R);
      let H = R.split(" ").map((X) => re(X, this.options)).join(" ").split(/\s+/).map((X) => be(X, this.options));
      M && (H = H.filter((X) => (s("loose invalid filter", X, this.options), !!X.match(c[l.COMPARATORLOOSE])))), s("range list", H);
      const Z = /* @__PURE__ */ new Map(), W = H.map((X) => new o(X, this.options));
      for (const X of W) {
        if (y(X))
          return [X];
        Z.set(X.value, X);
      }
      Z.size > 1 && Z.has("") && Z.delete("");
      const ve = [...Z.values()];
      return r.set(P, ve), ve;
    }
    intersects(R, z) {
      if (!(R instanceof e))
        throw new TypeError("a Range is required");
      return this.set.some((P) => K(P, z) && R.set.some(($) => K($, z) && P.every((M) => $.every((j) => M.intersects(j, z)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(R) {
      if (!R)
        return !1;
      if (typeof R == "string")
        try {
          R = new a(R, this.options);
        } catch {
          return !1;
        }
      for (let z = 0; z < this.set.length; z++)
        if (st(this.set[z], R, this.options))
          return !0;
      return !1;
    }
  }
  bi = e;
  const t = _c(), r = new t(), i = ts(), o = Er(), s = wr(), a = Le(), {
    safeRe: c,
    t: l,
    comparatorTrimReplace: u,
    tildeTrimReplace: p,
    caretTrimReplace: g
  } = Nn(), { FLAG_INCLUDE_PRERELEASE: k, FLAG_LOOSE: C } = mr(), y = (T) => T.value === "<0.0.0-0", F = (T) => T.value === "", K = (T, R) => {
    let z = !0;
    const P = T.slice();
    let $ = P.pop();
    for (; z && P.length; )
      z = P.every((M) => $.intersects(M, R)), $ = P.pop();
    return z;
  }, re = (T, R) => (s("comp", T, R), T = ie(T, R), s("caret", T), T = J(T, R), s("tildes", T), T = G(T, R), s("xrange", T), T = mt(T, R), s("stars", T), T), N = (T) => !T || T.toLowerCase() === "x" || T === "*", J = (T, R) => T.trim().split(/\s+/).map((z) => ae(z, R)).join(" "), ae = (T, R) => {
    const z = R.loose ? c[l.TILDELOOSE] : c[l.TILDE];
    return T.replace(z, (P, $, M, j, H) => {
      s("tilde", T, P, $, M, j, H);
      let Z;
      return N($) ? Z = "" : N(M) ? Z = `>=${$}.0.0 <${+$ + 1}.0.0-0` : N(j) ? Z = `>=${$}.${M}.0 <${$}.${+M + 1}.0-0` : H ? (s("replaceTilde pr", H), Z = `>=${$}.${M}.${j}-${H} <${$}.${+M + 1}.0-0`) : Z = `>=${$}.${M}.${j} <${$}.${+M + 1}.0-0`, s("tilde return", Z), Z;
    });
  }, ie = (T, R) => T.trim().split(/\s+/).map((z) => se(z, R)).join(" "), se = (T, R) => {
    s("caret", T, R);
    const z = R.loose ? c[l.CARETLOOSE] : c[l.CARET], P = R.includePrerelease ? "-0" : "";
    return T.replace(z, ($, M, j, H, Z) => {
      s("caret", T, $, M, j, H, Z);
      let W;
      return N(M) ? W = "" : N(j) ? W = `>=${M}.0.0${P} <${+M + 1}.0.0-0` : N(H) ? M === "0" ? W = `>=${M}.${j}.0${P} <${M}.${+j + 1}.0-0` : W = `>=${M}.${j}.0${P} <${+M + 1}.0.0-0` : Z ? (s("replaceCaret pr", Z), M === "0" ? j === "0" ? W = `>=${M}.${j}.${H}-${Z} <${M}.${j}.${+H + 1}-0` : W = `>=${M}.${j}.${H}-${Z} <${M}.${+j + 1}.0-0` : W = `>=${M}.${j}.${H}-${Z} <${+M + 1}.0.0-0`) : (s("no pr"), M === "0" ? j === "0" ? W = `>=${M}.${j}.${H}${P} <${M}.${j}.${+H + 1}-0` : W = `>=${M}.${j}.${H}${P} <${M}.${+j + 1}.0-0` : W = `>=${M}.${j}.${H} <${+M + 1}.0.0-0`), s("caret return", W), W;
    });
  }, G = (T, R) => (s("replaceXRanges", T, R), T.split(/\s+/).map((z) => Ke(z, R)).join(" ")), Ke = (T, R) => {
    T = T.trim();
    const z = R.loose ? c[l.XRANGELOOSE] : c[l.XRANGE];
    return T.replace(z, (P, $, M, j, H, Z) => {
      s("xRange", T, P, $, M, j, H, Z);
      const W = N(M), ve = W || N(j), X = ve || N(H), Me = X;
      return $ === "=" && Me && ($ = ""), Z = R.includePrerelease ? "-0" : "", W ? $ === ">" || $ === "<" ? P = "<0.0.0-0" : P = "*" : $ && Me ? (ve && (j = 0), H = 0, $ === ">" ? ($ = ">=", ve ? (M = +M + 1, j = 0, H = 0) : (j = +j + 1, H = 0)) : $ === "<=" && ($ = "<", ve ? M = +M + 1 : j = +j + 1), $ === "<" && (Z = "-0"), P = `${$ + M}.${j}.${H}${Z}`) : ve ? P = `>=${M}.0.0${Z} <${+M + 1}.0.0-0` : X && (P = `>=${M}.${j}.0${Z} <${M}.${+j + 1}.0-0`), s("xRange return", P), P;
    });
  }, mt = (T, R) => (s("replaceStars", T, R), T.trim().replace(c[l.STAR], "")), be = (T, R) => (s("replaceGTE0", T, R), T.trim().replace(c[R.includePrerelease ? l.GTE0PRE : l.GTE0], "")), it = (T) => (R, z, P, $, M, j, H, Z, W, ve, X, Me) => (N(P) ? z = "" : N($) ? z = `>=${P}.0.0${T ? "-0" : ""}` : N(M) ? z = `>=${P}.${$}.0${T ? "-0" : ""}` : j ? z = `>=${z}` : z = `>=${z}${T ? "-0" : ""}`, N(W) ? Z = "" : N(ve) ? Z = `<${+W + 1}.0.0-0` : N(X) ? Z = `<${W}.${+ve + 1}.0-0` : Me ? Z = `<=${W}.${ve}.${X}-${Me}` : T ? Z = `<${W}.${ve}.${+X + 1}-0` : Z = `<=${Z}`, `${z} ${Z}`.trim()), st = (T, R, z) => {
    for (let P = 0; P < T.length; P++)
      if (!T[P].test(R))
        return !1;
    if (R.prerelease.length && !z.includePrerelease) {
      for (let P = 0; P < T.length; P++)
        if (s(T[P].semver), T[P].semver !== o.ANY && T[P].semver.prerelease.length > 0) {
          const $ = T[P].semver;
          if ($.major === R.major && $.minor === R.minor && $.patch === R.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return bi;
}
var Ei, yo;
function Er() {
  if (yo) return Ei;
  yo = 1;
  const n = Symbol("SemVer ANY");
  class e {
    static get ANY() {
      return n;
    }
    constructor(u, p) {
      if (p = t(p), u instanceof e) {
        if (u.loose === !!p.loose)
          return u;
        u = u.value;
      }
      u = u.trim().split(/\s+/).join(" "), s("comparator", u, p), this.options = p, this.loose = !!p.loose, this.parse(u), this.semver === n ? this.value = "" : this.value = this.operator + this.semver.version, s("comp", this);
    }
    parse(u) {
      const p = this.options.loose ? r[i.COMPARATORLOOSE] : r[i.COMPARATOR], g = u.match(p);
      if (!g)
        throw new TypeError(`Invalid comparator: ${u}`);
      this.operator = g[1] !== void 0 ? g[1] : "", this.operator === "=" && (this.operator = ""), g[2] ? this.semver = new a(g[2], this.options.loose) : this.semver = n;
    }
    toString() {
      return this.value;
    }
    test(u) {
      if (s("Comparator.test", u, this.options.loose), this.semver === n || u === n)
        return !0;
      if (typeof u == "string")
        try {
          u = new a(u, this.options);
        } catch {
          return !1;
        }
      return o(u, this.operator, this.semver, this.options);
    }
    intersects(u, p) {
      if (!(u instanceof e))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(u.value, p).test(this.value) : u.operator === "" ? u.value === "" ? !0 : new c(this.value, p).test(u.semver) : (p = t(p), p.includePrerelease && (this.value === "<0.0.0-0" || u.value === "<0.0.0-0") || !p.includePrerelease && (this.value.startsWith("<0.0.0") || u.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && u.operator.startsWith(">") || this.operator.startsWith("<") && u.operator.startsWith("<") || this.semver.version === u.semver.version && this.operator.includes("=") && u.operator.includes("=") || o(this.semver, "<", u.semver, p) && this.operator.startsWith(">") && u.operator.startsWith("<") || o(this.semver, ">", u.semver, p) && this.operator.startsWith("<") && u.operator.startsWith(">")));
    }
  }
  Ei = e;
  const t = ts(), { safeRe: r, t: i } = Nn(), o = sa(), s = wr(), a = Le(), c = Ye();
  return Ei;
}
var vi, xo;
function vr() {
  if (xo) return vi;
  xo = 1;
  const n = Ye();
  return vi = (t, r, i) => {
    try {
      r = new n(r, i);
    } catch {
      return !1;
    }
    return r.test(t);
  }, vi;
}
var yi, ko;
function Rc() {
  if (ko) return yi;
  ko = 1;
  const n = Ye();
  return yi = (t, r) => new n(t, r).set.map((i) => i.map((o) => o.value).join(" ").trim().split(" ")), yi;
}
var xi, So;
function Tc() {
  if (So) return xi;
  So = 1;
  const n = Le(), e = Ye();
  return xi = (r, i, o) => {
    let s = null, a = null, c = null;
    try {
      c = new e(i, o);
    } catch {
      return null;
    }
    return r.forEach((l) => {
      c.test(l) && (!s || a.compare(l) === -1) && (s = l, a = new n(s, o));
    }), s;
  }, xi;
}
var ki, _o;
function Ac() {
  if (_o) return ki;
  _o = 1;
  const n = Le(), e = Ye();
  return ki = (r, i, o) => {
    let s = null, a = null, c = null;
    try {
      c = new e(i, o);
    } catch {
      return null;
    }
    return r.forEach((l) => {
      c.test(l) && (!s || a.compare(l) === 1) && (s = l, a = new n(s, o));
    }), s;
  }, ki;
}
var Si, Ro;
function Cc() {
  if (Ro) return Si;
  Ro = 1;
  const n = Le(), e = Ye(), t = br();
  return Si = (i, o) => {
    i = new e(i, o);
    let s = new n("0.0.0");
    if (i.test(s) || (s = new n("0.0.0-0"), i.test(s)))
      return s;
    s = null;
    for (let a = 0; a < i.set.length; ++a) {
      const c = i.set[a];
      let l = null;
      c.forEach((u) => {
        const p = new n(u.semver.version);
        switch (u.operator) {
          case ">":
            p.prerelease.length === 0 ? p.patch++ : p.prerelease.push(0), p.raw = p.format();
          /* fallthrough */
          case "":
          case ">=":
            (!l || t(p, l)) && (l = p);
            break;
          case "<":
          case "<=":
            break;
          /* istanbul ignore next */
          default:
            throw new Error(`Unexpected operation: ${u.operator}`);
        }
      }), l && (!s || t(s, l)) && (s = l);
    }
    return s && i.test(s) ? s : null;
  }, Si;
}
var _i, To;
function Ic() {
  if (To) return _i;
  To = 1;
  const n = Ye();
  return _i = (t, r) => {
    try {
      return new n(t, r).range || "*";
    } catch {
      return null;
    }
  }, _i;
}
var Ri, Ao;
function os() {
  if (Ao) return Ri;
  Ao = 1;
  const n = Le(), e = Er(), { ANY: t } = e, r = Ye(), i = vr(), o = br(), s = rs(), a = ss(), c = is();
  return Ri = (u, p, g, k) => {
    u = new n(u, k), p = new r(p, k);
    let C, y, F, K, re;
    switch (g) {
      case ">":
        C = o, y = a, F = s, K = ">", re = ">=";
        break;
      case "<":
        C = s, y = c, F = o, K = "<", re = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (i(u, p, k))
      return !1;
    for (let N = 0; N < p.set.length; ++N) {
      const J = p.set[N];
      let ae = null, ie = null;
      if (J.forEach((se) => {
        se.semver === t && (se = new e(">=0.0.0")), ae = ae || se, ie = ie || se, C(se.semver, ae.semver, k) ? ae = se : F(se.semver, ie.semver, k) && (ie = se);
      }), ae.operator === K || ae.operator === re || (!ie.operator || ie.operator === K) && y(u, ie.semver))
        return !1;
      if (ie.operator === re && F(u, ie.semver))
        return !1;
    }
    return !0;
  }, Ri;
}
var Ti, Co;
function Lc() {
  if (Co) return Ti;
  Co = 1;
  const n = os();
  return Ti = (t, r, i) => n(t, r, ">", i), Ti;
}
var Ai, Io;
function Oc() {
  if (Io) return Ai;
  Io = 1;
  const n = os();
  return Ai = (t, r, i) => n(t, r, "<", i), Ai;
}
var Ci, Lo;
function Nc() {
  if (Lo) return Ci;
  Lo = 1;
  const n = Ye();
  return Ci = (t, r, i) => (t = new n(t, i), r = new n(r, i), t.intersects(r, i)), Ci;
}
var Ii, Oo;
function Pc() {
  if (Oo) return Ii;
  Oo = 1;
  const n = vr(), e = Xe();
  return Ii = (t, r, i) => {
    const o = [];
    let s = null, a = null;
    const c = t.sort((g, k) => e(g, k, i));
    for (const g of c)
      n(g, r, i) ? (a = g, s || (s = g)) : (a && o.push([s, a]), a = null, s = null);
    s && o.push([s, null]);
    const l = [];
    for (const [g, k] of o)
      g === k ? l.push(g) : !k && g === c[0] ? l.push("*") : k ? g === c[0] ? l.push(`<=${k}`) : l.push(`${g} - ${k}`) : l.push(`>=${g}`);
    const u = l.join(" || "), p = typeof r.raw == "string" ? r.raw : String(r);
    return u.length < p.length ? u : r;
  }, Ii;
}
var Li, No;
function Mc() {
  if (No) return Li;
  No = 1;
  const n = Ye(), e = Er(), { ANY: t } = e, r = vr(), i = Xe(), o = (p, g, k = {}) => {
    if (p === g)
      return !0;
    p = new n(p, k), g = new n(g, k);
    let C = !1;
    e: for (const y of p.set) {
      for (const F of g.set) {
        const K = c(y, F, k);
        if (C = C || K !== null, K)
          continue e;
      }
      if (C)
        return !1;
    }
    return !0;
  }, s = [new e(">=0.0.0-0")], a = [new e(">=0.0.0")], c = (p, g, k) => {
    if (p === g)
      return !0;
    if (p.length === 1 && p[0].semver === t) {
      if (g.length === 1 && g[0].semver === t)
        return !0;
      k.includePrerelease ? p = s : p = a;
    }
    if (g.length === 1 && g[0].semver === t) {
      if (k.includePrerelease)
        return !0;
      g = a;
    }
    const C = /* @__PURE__ */ new Set();
    let y, F;
    for (const G of p)
      G.operator === ">" || G.operator === ">=" ? y = l(y, G, k) : G.operator === "<" || G.operator === "<=" ? F = u(F, G, k) : C.add(G.semver);
    if (C.size > 1)
      return null;
    let K;
    if (y && F) {
      if (K = i(y.semver, F.semver, k), K > 0)
        return null;
      if (K === 0 && (y.operator !== ">=" || F.operator !== "<="))
        return null;
    }
    for (const G of C) {
      if (y && !r(G, String(y), k) || F && !r(G, String(F), k))
        return null;
      for (const Ke of g)
        if (!r(G, String(Ke), k))
          return !1;
      return !0;
    }
    let re, N, J, ae, ie = F && !k.includePrerelease && F.semver.prerelease.length ? F.semver : !1, se = y && !k.includePrerelease && y.semver.prerelease.length ? y.semver : !1;
    ie && ie.prerelease.length === 1 && F.operator === "<" && ie.prerelease[0] === 0 && (ie = !1);
    for (const G of g) {
      if (ae = ae || G.operator === ">" || G.operator === ">=", J = J || G.operator === "<" || G.operator === "<=", y) {
        if (se && G.semver.prerelease && G.semver.prerelease.length && G.semver.major === se.major && G.semver.minor === se.minor && G.semver.patch === se.patch && (se = !1), G.operator === ">" || G.operator === ">=") {
          if (re = l(y, G, k), re === G && re !== y)
            return !1;
        } else if (y.operator === ">=" && !r(y.semver, String(G), k))
          return !1;
      }
      if (F) {
        if (ie && G.semver.prerelease && G.semver.prerelease.length && G.semver.major === ie.major && G.semver.minor === ie.minor && G.semver.patch === ie.patch && (ie = !1), G.operator === "<" || G.operator === "<=") {
          if (N = u(F, G, k), N === G && N !== F)
            return !1;
        } else if (F.operator === "<=" && !r(F.semver, String(G), k))
          return !1;
      }
      if (!G.operator && (F || y) && K !== 0)
        return !1;
    }
    return !(y && J && !F && K !== 0 || F && ae && !y && K !== 0 || se || ie);
  }, l = (p, g, k) => {
    if (!p)
      return g;
    const C = i(p.semver, g.semver, k);
    return C > 0 ? p : C < 0 || g.operator === ">" && p.operator === ">=" ? g : p;
  }, u = (p, g, k) => {
    if (!p)
      return g;
    const C = i(p.semver, g.semver, k);
    return C < 0 ? p : C > 0 || g.operator === "<" && p.operator === "<=" ? g : p;
  };
  return Li = o, Li;
}
var Oi, Po;
function $c() {
  if (Po) return Oi;
  Po = 1;
  const n = Nn(), e = mr(), t = Le(), r = na(), i = en(), o = dc(), s = pc(), a = fc(), c = gc(), l = mc(), u = wc(), p = bc(), g = Ec(), k = Xe(), C = vc(), y = yc(), F = ns(), K = xc(), re = kc(), N = br(), J = rs(), ae = ra(), ie = ia(), se = is(), G = ss(), Ke = sa(), mt = Sc(), be = Er(), it = Ye(), st = vr(), T = Rc(), R = Tc(), z = Ac(), P = Cc(), $ = Ic(), M = os(), j = Lc(), H = Oc(), Z = Nc(), W = Pc(), ve = Mc();
  return Oi = {
    parse: i,
    valid: o,
    clean: s,
    inc: a,
    diff: c,
    major: l,
    minor: u,
    patch: p,
    prerelease: g,
    compare: k,
    rcompare: C,
    compareLoose: y,
    compareBuild: F,
    sort: K,
    rsort: re,
    gt: N,
    lt: J,
    eq: ae,
    neq: ie,
    gte: se,
    lte: G,
    cmp: Ke,
    coerce: mt,
    Comparator: be,
    Range: it,
    satisfies: st,
    toComparators: T,
    maxSatisfying: R,
    minSatisfying: z,
    minVersion: P,
    validRange: $,
    outside: M,
    gtr: j,
    ltr: H,
    intersects: Z,
    simplifyRange: W,
    subset: ve,
    SemVer: t,
    re: n.re,
    src: n.src,
    tokens: n.t,
    SEMVER_SPEC_VERSION: e.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: e.RELEASE_TYPES,
    compareIdentifiers: r.compareIdentifiers,
    rcompareIdentifiers: r.rcompareIdentifiers
  }, Oi;
}
var Ni = $c();
class Dc {
  constructor(e, t) {
    this.onEventCallback = t, this.events = e;
  }
  push(e) {
    this.events.push(e), this.onEventCallback(e);
  }
}
async function Bc(n, e = null, t = []) {
  e || (e = (N) => {
  });
  const r = new Dc(t, e), i = Aa(), o = new ja();
  i.appendChild(o.root);
  const s = Va();
  if (i.appendChild(s), Ni.gt(n.nodekit_version, er) || Ni.major(n.nodekit_version) !== Ni.major(er))
    throw new Error(`Incompatible NodeKit version requested: ${n.nodekit_version}, Runtime version: ${er}`);
  if (!Ta()) {
    const N = new Error("Unsupported device for NodeKit. Please use a desktop browser.");
    throw o.showErrorOverlay(N), N;
  }
  o.showSessionConnectingOverlay();
  const a = new Ca(), c = new pa(), l = new ic(c);
  l.subscribe(
    // Subscribe to the key stream:
    (N) => {
      r.push(
        {
          event_type: "KeySampledEvent",
          t: N.t,
          kind: N.sampleType,
          key: N.key
        }
      );
    }
  );
  const u = new rc(s, c);
  u.subscribe(
    // Subscribe to the pointer stream:
    (N) => {
      r.push(
        {
          event_type: "PointerSampledEvent",
          t: N.t,
          kind: N.sampleType,
          x: N.x,
          y: N.y
        }
      );
    }
  ), o.hideSessionConnectingOverlay(), await o.playStartScreen(), c.start();
  const p = {
    event_type: "TraceStartedEvent",
    t: 0
  };
  r.push(p);
  function g() {
    if (document.visibilityState === "hidden") {
      const N = {
        event_type: "PageSuspendedEvent",
        t: c.now()
      };
      r.push(N);
    } else if (document.visibilityState === "visible") {
      const N = {
        event_type: "PageResumedEvent",
        t: c.now()
      };
      r.push(N);
    }
  }
  document.addEventListener("visibilitychange", g);
  const k = fa(), C = {
    event_type: "BrowserContextSampledEvent",
    t: c.now(),
    user_agent: k.userAgent,
    viewport_width_px: k.viewportWidthPx,
    viewport_height_px: k.viewportHeightPx,
    display_width_px: k.displayWidthPx,
    display_height_px: k.displayHeightPx,
    device_pixel_ratio: k.devicePixelRatio
  };
  r.push(C);
  const y = n.nodes;
  let F = n.start;
  for (; ; ) {
    const N = y[F], J = new hc(
      F,
      N
    );
    s.appendChild(J.boardView.root), await J.prepare(
      a,
      l,
      u,
      c,
      r
    );
    let ae = await J.run(c, r);
    for (; s.firstChild; )
      s.removeChild(s.firstChild);
    if (!(F in n.transitions) || !(ae.sensorId in n.transitions[F]))
      break;
    F = n.transitions[F][ae.sensorId];
  }
  await o.playEndScreen(), l.destroy(), u.destroy();
  const K = {
    event_type: "TraceEndedEvent",
    t: c.now()
  };
  r.push(K), document.removeEventListener("visibilitychange", g);
  const re = {
    nodekit_version: er,
    events: r.events
  };
  return o.showConsoleMessageOverlay(
    "Trace",
    re
  ), re;
}
export {
  Bc as play
};
