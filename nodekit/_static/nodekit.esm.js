class fa {
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
function da() {
  return {
    userAgent: navigator.userAgent,
    viewportWidthPx: window.innerWidth,
    viewportHeightPx: window.innerHeight,
    displayWidthPx: screen.width,
    displayHeightPx: screen.height
  };
}
var ga = "2.0.4", Ni = 500, ps = "user-agent", Kt = "", fs = "?", ir = "function", St = "undefined", Zt = "object", Pi = "string", Ie = "browser", ht = "cpu", it = "device", Ye = "engine", qe = "os", Xt = "result", v = "name", m = "type", b = "vendor", y = "version", Ne = "architecture", On = "major", w = "model", Tn = "console", Y = "mobile", he = "tablet", xe = "smarttv", tt = "wearable", Vn = "xr", An = "embedded", fn = "inapp", zi = "brands", $t = "formFactors", qi = "fullVersionList", Yt = "platform", Gi = "platformVersion", ur = "bitness", Tt = "sec-ch-ua", ma = Tt + "-full-version-list", wa = Tt + "-arch", ba = Tt + "-" + ur, Ea = Tt + "-form-factors", va = Tt + "-" + Y, xa = Tt + "-" + w, $o = Tt + "-" + Yt, ya = $o + "-version", Mo = [zi, qi, Y, w, Yt, Gi, Ne, $t, ur], Wn = "Amazon", Vt = "Apple", ds = "ASUS", gs = "BlackBerry", Pt = "Google", ms = "Huawei", _r = "Lenovo", ws = "Honor", Xn = "LG", Sr = "Microsoft", Tr = "Motorola", Ar = "Nvidia", bs = "OnePlus", Cr = "OPPO", dn = "Samsung", Es = "Sharp", gn = "Sony", Or = "Xiaomi", Lr = "Zebra", vs = "Chrome", xs = "Chromium", Rt = "Chromecast", tr = "Edge", mn = "Firefox", wn = "Opera", Ir = "Facebook", ys = "Sogou", Wt = "Mobile ", bn = " Browser", $i = "Windows", ka = typeof window !== St, Pe = ka && window.navigator ? window.navigator : void 0, _t = Pe && Pe.userAgentData ? Pe.userAgentData : void 0, Ra = function(n, e) {
  var t = {}, r = e;
  if (!sr(e)) {
    r = {};
    for (var i in e)
      for (var o in e[i])
        r[o] = e[i][o].concat(r[o] ? r[o] : []);
  }
  for (var s in n)
    t[s] = r[s] && r[s].length % 2 === 0 ? r[s].concat(n[s]) : n[s];
  return t;
}, hr = function(n) {
  for (var e = {}, t = 0; t < n.length; t++)
    e[n[t].toUpperCase()] = n[t];
  return e;
}, Mi = function(n, e) {
  if (typeof n === Zt && n.length > 0) {
    for (var t in n)
      if (pt(e) == pt(n[t])) return !0;
    return !1;
  }
  return Jt(n) ? pt(e) == pt(n) : !1;
}, sr = function(n, e) {
  for (var t in n)
    return /^(browser|cpu|device|engine|os)$/.test(t) || (e ? sr(n[t]) : !1);
}, Jt = function(n) {
  return typeof n === Pi;
}, Nr = function(n) {
  if (n) {
    for (var e = [], t = Qt(/\\?\"/g, n).split(","), r = 0; r < t.length; r++)
      if (t[r].indexOf(";") > -1) {
        var i = or(t[r]).split(";v=");
        e[r] = { brand: i[0], version: i[1] };
      } else
        e[r] = or(t[r]);
    return e;
  }
}, pt = function(n) {
  return Jt(n) ? n.toLowerCase() : n;
}, Pr = function(n) {
  return Jt(n) ? Qt(/[^\d\.]/g, n).split(".")[0] : void 0;
}, ft = function(n) {
  for (var e in n) {
    var t = n[e];
    typeof t == Zt && t.length == 2 ? this[t[0]] = t[1] : this[t] = void 0;
  }
  return this;
}, Qt = function(n, e) {
  return Jt(e) ? e.replace(n, Kt) : e;
}, En = function(n) {
  return Qt(/\\?\"/g, n);
}, or = function(n, e) {
  if (Jt(n))
    return n = Qt(/^\s\s*/, n), typeof e === St ? n : n.substring(0, Ni);
}, $r = function(n, e) {
  if (!(!n || !e))
    for (var t = 0, r, i, o, s, a, c; t < e.length && !a; ) {
      var l = e[t], u = e[t + 1];
      for (r = i = 0; r < l.length && !a && l[r]; )
        if (a = l[r++].exec(n), a)
          for (o = 0; o < u.length; o++)
            c = a[++i], s = u[o], typeof s === Zt && s.length > 0 ? s.length === 2 ? typeof s[1] == ir ? this[s[0]] = s[1].call(this, c) : this[s[0]] = s[1] : s.length >= 3 && (typeof s[1] === ir && !(s[1].exec && s[1].test) ? s.length > 3 ? this[s[0]] = c ? s[1].apply(this, s.slice(2)) : void 0 : this[s[0]] = c ? s[1].call(this, c, s[2]) : void 0 : s.length == 3 ? this[s[0]] = c ? c.replace(s[1], s[2]) : void 0 : s.length == 4 ? this[s[0]] = c ? s[3].call(this, c.replace(s[1], s[2])) : void 0 : s.length > 4 && (this[s[0]] = c ? s[3].apply(this, [c.replace(s[1], s[2])].concat(s.slice(4))) : void 0)) : this[s] = c || void 0;
      t += 2;
    }
}, rt = function(n, e) {
  for (var t in e)
    if (typeof e[t] === Zt && e[t].length > 0) {
      for (var r = 0; r < e[t].length; r++)
        if (Mi(e[t][r], n))
          return t === fs ? void 0 : t;
    } else if (Mi(e[t], n))
      return t === fs ? void 0 : t;
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
}, Rs = {
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
    [y, [v, Wt + "Chrome"]],
    [
      /webview.+edge\/([\w\.]+)/i
      // Microsoft Edge
    ],
    [y, [v, tr + " WebView"]],
    [
      /edg(?:e|ios|a)?\/([\w\.]+)/i
    ],
    [y, [v, "Edge"]],
    [
      // Presto based
      /(opera mini)\/([-\w\.]+)/i,
      // Opera Mini
      /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
      // Opera Mobi/Tablet
      /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i
      // Opera
    ],
    [v, y],
    [
      /opios[\/ ]+([\w\.]+)/i
      // Opera mini on iphone >= 8.0
    ],
    [y, [v, wn + " Mini"]],
    [
      /\bop(?:rg)?x\/([\w\.]+)/i
      // Opera GX
    ],
    [y, [v, wn + " GX"]],
    [
      /\bopr\/([\w\.]+)/i
      // Opera Webkit
    ],
    [y, [v, wn]],
    [
      // Mixed
      /\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i
      // Baidu
    ],
    [y, [v, "Baidu"]],
    [
      /\b(?:mxbrowser|mxios|myie2)\/?([-\w\.]*)\b/i
      // Maxthon
    ],
    [y, [v, "Maxthon"]],
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
    [v, y],
    [
      /quark(?:pc)?\/([-\w\.]+)/i
      // Quark
    ],
    [y, [v, "Quark"]],
    [
      /\bddg\/([\w\.]+)/i
      // DuckDuckGo
    ],
    [y, [v, "DuckDuckGo"]],
    [
      /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i
      // UCBrowser
    ],
    [y, [v, "UCBrowser"]],
    [
      /microm.+\bqbcore\/([\w\.]+)/i,
      // WeChat Desktop for Windows Built-in Browser
      /\bqbcore\/([\w\.]+).+microm/i,
      /micromessenger\/([\w\.]+)/i
      // WeChat
    ],
    [y, [v, "WeChat"]],
    [
      /konqueror\/([\w\.]+)/i
      // Konqueror
    ],
    [y, [v, "Konqueror"]],
    [
      /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i
      // IE11
    ],
    [y, [v, "IE"]],
    [
      /ya(?:search)?browser\/([\w\.]+)/i
      // Yandex
    ],
    [y, [v, "Yandex"]],
    [
      /slbrowser\/([\w\.]+)/i
      // Smart Lenovo Browser
    ],
    [y, [v, "Smart " + _r + bn]],
    [
      /(avast|avg)\/([\w\.]+)/i
      // Avast/AVG Secure Browser
    ],
    [[v, /(.+)/, "$1 Secure" + bn], y],
    [
      /\bfocus\/([\w\.]+)/i
      // Firefox Focus
    ],
    [y, [v, mn + " Focus"]],
    [
      /\bopt\/([\w\.]+)/i
      // Opera Touch
    ],
    [y, [v, wn + " Touch"]],
    [
      /coc_coc\w+\/([\w\.]+)/i
      // Coc Coc Browser
    ],
    [y, [v, "Coc Coc"]],
    [
      /dolfin\/([\w\.]+)/i
      // Dolphin
    ],
    [y, [v, "Dolphin"]],
    [
      /coast\/([\w\.]+)/i
      // Opera Coast
    ],
    [y, [v, wn + " Coast"]],
    [
      /miuibrowser\/([\w\.]+)/i
      // MIUI Browser
    ],
    [y, [v, "MIUI" + bn]],
    [
      /fxios\/([\w\.-]+)/i
      // Firefox for iOS
    ],
    [y, [v, Wt + mn]],
    [
      /\bqihoobrowser\/?([\w\.]*)/i
      // 360
    ],
    [y, [v, "360"]],
    [
      /\b(qq)\/([\w\.]+)/i
      // QQ
    ],
    [[v, /(.+)/, "$1Browser"], y],
    [
      /(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i
    ],
    [[v, /(.+)/, "$1" + bn], y],
    [
      // Oculus/Sailfish/HuaweiBrowser/VivoBrowser/PicoBrowser
      /samsungbrowser\/([\w\.]+)/i
      // Samsung Internet
    ],
    [y, [v, dn + " Internet"]],
    [
      /metasr[\/ ]?([\d\.]+)/i
      // Sogou Explorer
    ],
    [y, [v, ys + " Explorer"]],
    [
      /(sogou)mo\w+\/([\d\.]+)/i
      // Sogou Mobile
    ],
    [[v, ys + " Mobile"], y],
    [
      /(electron)\/([\w\.]+) safari/i,
      // Electron-based App
      /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
      // Tesla
      /m?(qqbrowser|2345(?=browser|chrome|explorer))\w*[\/ ]?v?([\w\.]+)/i
      // QQ/2345
    ],
    [v, y],
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
    [y, v],
    [
      // WebView
      /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i
      // Facebook App for iOS & Android
    ],
    [[v, Ir], y, [m, fn]],
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
    [v, y, [m, fn]],
    [
      /\bgsa\/([\w\.]+) .*safari\//i
      // Google Search Appliance on iOS
    ],
    [y, [v, "GSA"], [m, fn]],
    [
      /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i
      // TikTok
    ],
    [y, [v, "TikTok"], [m, fn]],
    [
      /\[(linkedin)app\]/i
      // LinkedIn App for iOS & Android
    ],
    [v, [m, fn]],
    [
      /(chromium)[\/ ]([-\w\.]+)/i
      // Chromium
    ],
    [v, y],
    [
      /headlesschrome(?:\/([\w\.]+)| )/i
      // Chrome Headless
    ],
    [y, [v, vs + " Headless"]],
    [
      /wv\).+chrome\/([\w\.]+).+edgw\//i
      // Edge WebView2
    ],
    [y, [v, tr + " WebView2"]],
    [
      / wv\).+(chrome)\/([\w\.]+)/i
      // Chrome WebView
    ],
    [[v, vs + " WebView"], y],
    [
      /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
      // Android Browser
    ],
    [y, [v, "Android" + bn]],
    [
      /chrome\/([\w\.]+) mobile/i
      // Chrome Mobile
    ],
    [y, [v, Wt + "Chrome"]],
    [
      /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
      // Chrome/OmniWeb/Arora/Tizen/Nokia
    ],
    [v, y],
    [
      /version\/([\w\.\,]+) .*mobile(?:\/\w+ | ?)safari/i
      // Safari Mobile
    ],
    [y, [v, Wt + "Safari"]],
    [
      /iphone .*mobile(?:\/\w+ | ?)safari/i
    ],
    [[v, Wt + "Safari"]],
    [
      /version\/([\w\.\,]+) .*(safari)/i
      // Safari
    ],
    [y, v],
    [
      /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i
      // Safari < 3.0
    ],
    [v, [y, "1"]],
    [
      /(webkit|khtml)\/([\w\.]+)/i
    ],
    [v, y],
    [
      // Gecko based
      /(?:mobile|tablet);.*(firefox)\/([\w\.-]+)/i
      // Firefox Mobile
    ],
    [[v, Wt + mn], y],
    [
      /(navigator|netscape\d?)\/([-\w\.]+)/i
      // Netscape
    ],
    [[v, "Netscape"], y],
    [
      /(wolvic|librewolf)\/([\w\.]+)/i
      // Wolvic/LibreWolf
    ],
    [v, y],
    [
      /mobile vr; rv:([\w\.]+)\).+firefox/i
      // Firefox Reality
    ],
    [y, [v, mn + " Reality"]],
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
    [v, [y, /_/g, "."]],
    [
      /(cobalt)\/([\w\.]+)/i
      // Cobalt
    ],
    [v, [y, /[^\d\.]+./, Kt]]
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
    [[Ne, /ower/, Kt, pt]],
    [
      / sun4\w[;\)]/i
      // SPARC
    ],
    [[Ne, "sparc"]],
    [
      /\b(avr32|ia64(?=;)|68k(?=\))|\barm(?=v([1-7]|[5-7]1)l?|;|eabi)|(irix|mips|sparc)(64)?\b|pa-risc)/i
      // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
    ],
    [[Ne, pt]]
  ],
  device: [
    [
      //////////////////////////
      // MOBILES & TABLETS
      /////////////////////////
      // Samsung
      /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
    ],
    [w, [b, dn], [m, he]],
    [
      /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
      /samsung[- ]((?!sm-[lr]|browser)[-\w]+)/i,
      /sec-(sgh\w+)/i
    ],
    [w, [b, dn], [m, Y]],
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
    [[w, /_/g, " "], [b, Or], [m, he]],
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
    [[w, /_/g, " "], [b, Or], [m, Y]],
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
    [w, [b, Cr], [m, Y]],
    [
      /\b(opd2(\d{3}a?))(?: bui|\))/i
    ],
    [w, [b, rt, { OnePlus: ["203", "304", "403", "404", "413", "415"], "*": Cr }], [m, he]],
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
    [w, [b, _r], [m, he]],
    [
      /lenovo[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i
    ],
    [w, [b, _r], [m, Y]],
    [
      // Motorola
      /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
      /\bmot(?:orola)?[- ]([\w\s]+)(\)| bui)/i,
      /((?:moto(?! 360)[-\w\(\) ]+|xt\d{3,4}[cgkosw\+]?[-\d]*|nexus 6)(?= bui|\)))/i
    ],
    [w, [b, Tr], [m, Y]],
    [
      /\b(mz60\d|xoom[2 ]{0,2}) build\//i
    ],
    [w, [b, Tr], [m, he]],
    [
      // LG
      /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
    ],
    [w, [b, Xn], [m, he]],
    [
      /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
      /\blg[-e;\/ ]+(?!.*(?:browser|netcast|android tv|watch|webos))(\w+)/i,
      /\blg-?([\d\w]+) bui/i
    ],
    [w, [b, Xn], [m, Y]],
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
    [w, [b, Wn], [m, he]],
    [
      /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
      // Fire Phone
    ],
    [[w, /(.+)/g, "Fire Phone $1"], [b, Wn], [m, Y]],
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
    [w, [b, ds], [m, he]],
    [
      / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
    ],
    [w, [b, ds], [m, Y]],
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
    [[b, pt], w, [m, rt, { tablet: ["p10001l", "w7001"], "*": "mobile" }]],
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
    [w, [b, Sr], [m, he]],
    [
      /droid [\d\.]+; (fp\du?)(?: b|\))/i
      // Fairphone
    ],
    [w, [b, "Fairphone"], [m, Y]],
    [
      /((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i
      // Nvidia Tablets
    ],
    [w, [b, Ar], [m, he]],
    [
      /(sprint) (\w+)/i
      // Sprint Phones
    ],
    [b, w, [m, Y]],
    [
      /(kin\.[onetw]{3})/i
      // Microsoft Kin
    ],
    [[w, /\./g, " "], [b, Sr], [m, Y]],
    [
      /droid.+; ([c6]+|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
      // Zebra
    ],
    [w, [b, Lr], [m, he]],
    [
      /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
    ],
    [w, [b, Lr], [m, Y]],
    [
      ///////////////////
      // SMARTTVS
      ///////////////////
      /smart-tv.+(samsung)/i
      // Samsung
    ],
    [b, [m, xe]],
    [
      /hbbtv.+maple;(\d+)/i
    ],
    [[w, /^/, "SmartTV"], [b, dn], [m, xe]],
    [
      /(vizio)(?: |.+model\/)(\w+-\w+)/i,
      // Vizio
      /tcast.+(lg)e?. ([-\w]+)/i
      // LG SmartTV
    ],
    [b, w, [m, xe]],
    [
      /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i
    ],
    [[b, Xn], [m, xe]],
    [
      /(apple) ?tv/i
      // Apple TV
    ],
    [b, [w, Vt + " TV"], [m, xe]],
    [
      /crkey.*devicetype\/chromecast/i
      // Google Chromecast Third Generation
    ],
    [[w, Rt + " Third Generation"], [b, Pt], [m, xe]],
    [
      /crkey.*devicetype\/([^/]*)/i
      // Google Chromecast with specific device type
    ],
    [[w, /^/, "Chromecast "], [b, Pt], [m, xe]],
    [
      /fuchsia.*crkey/i
      // Google Chromecast Nest Hub
    ],
    [[w, Rt + " Nest Hub"], [b, Pt], [m, xe]],
    [
      /crkey/i
      // Google Chromecast, Linux-based or unknown
    ],
    [[w, Rt], [b, Pt], [m, xe]],
    [
      /(portaltv)/i
      // Facebook Portal TV
    ],
    [w, [b, Ir], [m, xe]],
    [
      /droid.+aft(\w+)( bui|\))/i
      // Fire TV
    ],
    [w, [b, Wn], [m, xe]],
    [
      /(shield \w+ tv)/i
      // Nvidia Shield TV
    ],
    [w, [b, Ar], [m, xe]],
    [
      /\(dtv[\);].+(aquos)/i,
      /(aquos-tv[\w ]+)\)/i
      // Sharp
    ],
    [w, [b, Es], [m, xe]],
    [
      /(bravia[\w ]+)( bui|\))/i
      // Sony
    ],
    [w, [b, gn], [m, xe]],
    [
      /(mi(tv|box)-?\w+) bui/i
      // Xiaomi
    ],
    [w, [b, Or], [m, xe]],
    [
      /Hbbtv.*(technisat) (.*);/i
      // TechniSAT
    ],
    [b, w, [m, xe]],
    [
      /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
      // Roku
      /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i
      // HbbTV devices
    ],
    [[b, /.+\/(\w+)/, "$1", rt, { LG: "lge" }], [w, or], [m, xe]],
    [
      // SmartTV from Unidentified Vendors
      /droid.+; ([\w- ]+) (?:android tv|smart[- ]?tv)/i
    ],
    [w, [m, xe]],
    [
      /\b(android tv|smart[- ]?tv|opera tv|tv; rv:|large screen[\w ]+safari)\b/i
    ],
    [[m, xe]],
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
    [w, [b, Sr], [m, Tn]],
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
    [w, [b, Ar], [m, Tn]],
    [
      ///////////////////
      // WEARABLES
      ///////////////////
      /\b(sm-[lr]\d\d[0156][fnuw]?s?|gear live)\b/i
      // Samsung Galaxy Watch
    ],
    [w, [b, dn], [m, tt]],
    [
      /((pebble))app/i,
      // Pebble
      /(asus|google|lg|oppo) ((pixel |zen)?watch[\w ]*)( bui|\))/i
      // Asus ZenWatch / LG Watch / Pixel Watch
    ],
    [b, w, [m, tt]],
    [
      /(ow(?:19|20)?we?[1-3]{1,3})/i
      // Oppo Watch
    ],
    [w, [b, Cr], [m, tt]],
    [
      /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i
      // Apple Watch
    ],
    [w, [b, Vt], [m, tt]],
    [
      /(opwwe\d{3})/i
      // OnePlus Watch
    ],
    [w, [b, bs], [m, tt]],
    [
      /(moto 360)/i
      // Motorola 360
    ],
    [w, [b, Tr], [m, tt]],
    [
      /(smartwatch 3)/i
      // Sony SmartWatch
    ],
    [w, [b, gn], [m, tt]],
    [
      /(g watch r)/i
      // LG G Watch R
    ],
    [w, [b, Xn], [m, tt]],
    [
      /droid.+; (wt63?0{2,3})\)/i
    ],
    [w, [b, Lr], [m, tt]],
    [
      ///////////////////
      // XR
      ///////////////////
      /droid.+; (glass) \d/i
      // Google Glass
    ],
    [w, [b, Pt], [m, Vn]],
    [
      /(pico) (4|neo3(?: link|pro)?)/i
      // Pico
    ],
    [b, w, [m, Vn]],
    [
      /(quest( \d| pro)?s?).+vr/i
      // Meta Quest
    ],
    [w, [b, Ir], [m, Vn]],
    [
      /mobile vr; rv.+firefox/i
      // Unidentifiable VR device using Firefox Reality / Wolvic
    ],
    [[m, Vn]],
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
    [w, [b, Wn], [m, An]],
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
    [w, [m, rt, { mobile: "Mobile", xr: "VR", "*": he }]],
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
    [y, [v, tr + "HTML"]],
    [
      /(arkweb)\/([\w\.]+)/i
      // ArkWeb
    ],
    [v, y],
    [
      /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i
      // Blink
    ],
    [y, [v, "Blink"]],
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
    [v, y],
    [
      /ladybird\//i
    ],
    [[v, "LibWeb"]],
    [
      /rv\:([\w\.]{1,9})\b.+(gecko)/i
      // Gecko
    ],
    [y, v]
  ],
  os: [
    [
      // Windows
      /(windows nt) (6\.[23]); arm/i
      // Windows RT
    ],
    [[v, /N/, "R"], [y, rt, ks]],
    [
      /(windows (?:phone|mobile|iot))(?: os)?[\/ ]?([\d\.]*( se)?)/i,
      // Windows IoT/Mobile/Phone
      // Windows NT/3.1/95/98/ME/2000/XP/Vista/7/8/8.1/10/11
      /(windows)[\/ ](1[01]|2000|3\.1|7|8(\.1)?|9[58]|me|server 20\d\d( r2)?|vista|xp)/i
    ],
    [v, y],
    [
      /windows nt ?([\d\.\)]*)(?!.+xbox)/i,
      /\bwin(?=3| ?9|n)(?:nt| 9x )?([\d\.;]*)/i
    ],
    [[y, /(;|\))/g, "", rt, ks], [v, $i]],
    [
      /(windows ce)\/?([\d\.]*)/i
      // Windows CE
    ],
    [v, y],
    [
      // iOS/macOS
      /[adehimnop]{4,7}\b(?:.*os ([\w]+) like mac|; opera)/i,
      // iOS
      /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
      /cfnetwork\/.+darwin/i
    ],
    [[y, /_/g, "."], [v, "iOS"]],
    [
      /(mac os x) ?([\w\. ]*)/i,
      /(macintosh|mac_powerpc\b)(?!.+(haiku|morphos))/i
      // Mac OS
    ],
    [[v, "macOS"], [y, /_/g, "."]],
    [
      // Google Chromecast
      /android ([\d\.]+).*crkey/i
      // Google Chromecast, Android-based
    ],
    [y, [v, Rt + " Android"]],
    [
      /fuchsia.*crkey\/([\d\.]+)/i
      // Google Chromecast, Fuchsia-based
    ],
    [y, [v, Rt + " Fuchsia"]],
    [
      /crkey\/([\d\.]+).*devicetype\/smartspeaker/i
      // Google Chromecast, Linux-based Smart Speaker
    ],
    [y, [v, Rt + " SmartSpeaker"]],
    [
      /linux.*crkey\/([\d\.]+)/i
      // Google Chromecast, Legacy Linux-based
    ],
    [y, [v, Rt + " Linux"]],
    [
      /crkey\/([\d\.]+)/i
      // Google Chromecast, unknown
    ],
    [y, [v, Rt]],
    [
      // Mobile OSes
      /droid ([\w\.]+)\b.+(android[- ]x86)/i
      // Android-x86
    ],
    [y, v],
    [
      /(ubuntu) ([\w\.]+) like android/i
      // Ubuntu Touch
    ],
    [[v, /(.+)/, "$1 Touch"], y],
    [
      /(harmonyos)[\/ ]?([\d\.]*)/i,
      // HarmonyOS
      // Android/Blackberry/WebOS/QNX/Bada/RIM/KaiOS/Maemo/MeeGo/S40/Sailfish OS/OpenHarmony/Tizen
      /(android|bada|blackberry|kaios|maemo|meego|openharmony|qnx|rim tablet os|sailfish|series40|symbian|tizen)\w*[-\/\.; ]?([\d\.]*)/i
    ],
    [v, y],
    [
      /\(bb(10);/i
      // BlackBerry 10
    ],
    [y, [v, gs]],
    [
      /(?:symbian ?os|symbos|s60(?=;)|series ?60)[-\/ ]?([\w\.]*)/i
      // Symbian
    ],
    [y, [v, "Symbian"]],
    [
      /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
      // Firefox OS
    ],
    [y, [v, mn + " OS"]],
    [
      /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i,
      // WebOS
      /webos(?:[ \/]?|\.tv-20(?=2[2-9]))(\d[\d\.]*)/i
    ],
    [y, [v, "webOS"]],
    [
      /web0s;.+?(?:chr[o0]me|safari)\/(\d+)/i
      // https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine
    ],
    [[y, rt, { 25: "120", 24: "108", 23: "94", 22: "87", 6: "79", 5: "68", 4: "53", 3: "38", 2: "538", 1: "537", "*": "TV" }], [v, "webOS"]],
    [
      /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i
      // watchOS
    ],
    [y, [v, "watchOS"]],
    [
      // Google ChromeOS
      /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i
      // Chromium OS
    ],
    [[v, "Chrome OS"], y],
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
    [v, y],
    [
      /(sunos) ?([\d\.]*)/i
      // Solaris
    ],
    [[v, "Solaris"], y],
    [
      /\b(beos|os\/2|amigaos|openvms|hp-ux|serenityos)/i,
      // BeOS/OS2/AmigaOS/OpenVMS/HP-UX/SerenityOS
      /(unix) ?([\w\.]*)/i
      // UNIX
    ],
    [v, y]
  ]
}, Yn = (function() {
  var n = { init: {}, isIgnore: {}, isIgnoreRgx: {}, toString: {} };
  return ft.call(n.init, [
    [Ie, [v, y, On, m]],
    [ht, [Ne]],
    [it, [m, w, b]],
    [Ye, [v, y]],
    [qe, [v, y]]
  ]), ft.call(n.isIgnore, [
    [Ie, [y, On]],
    [Ye, [y]],
    [qe, [y]]
  ]), ft.call(n.isIgnoreRgx, [
    [Ie, / ?browser$/i],
    [qe, / ?os$/i]
  ]), ft.call(n.toString, [
    [Ie, [v, y]],
    [ht, [Ne]],
    [it, [b, w]],
    [Ye, [v, y]],
    [qe, [v, y]]
  ]), n;
})(), Sa = function(n, e) {
  var t = Yn.init[e], r = Yn.isIgnore[e] || 0, i = Yn.isIgnoreRgx[e] || 0, o = Yn.toString[e] || 0;
  function s() {
    ft.call(this, t);
  }
  return s.prototype.getItem = function() {
    return n;
  }, s.prototype.withClientHints = function() {
    return _t ? _t.getHighEntropyValues(Mo).then(function(a) {
      return n.setCH(new Do(a, !1)).parseCH().get();
    }) : n.parseCH().get();
  }, s.prototype.withFeatureCheck = function() {
    return n.detectFeature().get();
  }, e != Xt && (s.prototype.is = function(a) {
    var c = !1;
    for (var l in this)
      if (this.hasOwnProperty(l) && !Mi(r, l) && pt(i ? Qt(i, this[l]) : this[l]) == pt(i ? Qt(i, a) : a)) {
        if (c = !0, a != St) break;
      } else if (a == St && c) {
        c = !c;
        break;
      }
    return c;
  }, s.prototype.toString = function() {
    var a = Kt;
    for (var c in o)
      typeof this[o[c]] !== St && (a += (a ? " " : Kt) + this[o[c]]);
    return a || St;
  }), _t || (s.prototype.then = function(a) {
    var c = this, l = function() {
      for (var f in c)
        c.hasOwnProperty(f) && (this[f] = c[f]);
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
  if (n = n || {}, ft.call(this, Mo), e)
    ft.call(this, [
      [zi, Nr(n[Tt])],
      [qi, Nr(n[ma])],
      [Y, /\?1/.test(n[va])],
      [w, En(n[xa])],
      [Yt, En(n[$o])],
      [Gi, En(n[ya])],
      [Ne, En(n[wa])],
      [$t, Nr(n[Ea])],
      [ur, En(n[ba])]
    ]);
  else
    for (var t in n)
      this.hasOwnProperty(t) && typeof n[t] !== St && (this[t] = n[t]);
}
function Ss(n, e, t, r) {
  return this.get = function(i) {
    return i ? this.data.hasOwnProperty(i) ? this.data[i] : void 0 : this.data;
  }, this.set = function(i, o) {
    return this.data[i] = o, this;
  }, this.setCH = function(i) {
    return this.uaCH = i, this;
  }, this.detectFeature = function() {
    if (Pe && Pe.userAgent == this.ua)
      switch (this.itemType) {
        case Ie:
          Pe.brave && typeof Pe.brave.isBrave == ir && this.set(v, "Brave");
          break;
        case it:
          !this.get(m) && _t && _t[Y] && this.set(m, Y), this.get(w) == "Macintosh" && Pe && typeof Pe.standalone !== St && Pe.maxTouchPoints && Pe.maxTouchPoints > 2 && this.set(w, "iPad").set(m, he);
          break;
        case qe:
          !this.get(v) && _t && _t[Yt] && this.set(v, _t[Yt]);
          break;
        case Xt:
          var i = this.data, o = function(s) {
            return i[s].getItem().detectFeature().get();
          };
          this.set(Ie, o(Ie)).set(ht, o(ht)).set(it, o(it)).set(Ye, o(Ye)).set(qe, o(qe));
      }
    return this;
  }, this.parseUA = function() {
    return this.itemType != Xt && $r.call(this.data, this.ua, this.rgxMap), this.itemType == Ie && this.set(On, Pr(this.get(y))), this;
  }, this.parseCH = function() {
    var i = this.uaCH, o = this.rgxMap;
    switch (this.itemType) {
      case Ie:
      case Ye:
        var s = i[qi] || i[zi], a;
        if (s)
          for (var c in s) {
            var l = s[c].brand || s[c], u = s[c].version;
            this.itemType == Ie && !/not.a.brand/i.test(l) && (!a || /Chrom/.test(a) && l != xs || a == tr && /WebView2/.test(l)) && (l = rt(l, _a), a = this.get(v), a && !/Chrom/.test(a) && /Chrom/.test(l) || this.set(v, l).set(y, u).set(On, Pr(u)), a = l), this.itemType == Ye && l == xs && this.set(y, u);
          }
        break;
      case ht:
        var f = i[Ne];
        f && (f && i[ur] == "64" && (f += "64"), $r.call(this.data, f + ";", o));
        break;
      case it:
        if (i[Y] && this.set(m, Y), i[w] && (this.set(w, i[w]), !this.get(m) || !this.get(b))) {
          var d = {};
          $r.call(d, "droid 9; " + i[w] + ")", o), !this.get(m) && d.type && this.set(m, d.type), !this.get(b) && d.vendor && this.set(b, d.vendor);
        }
        if (i[$t]) {
          var k;
          if (typeof i[$t] != "string")
            for (var C = 0; !k && C < i[$t].length; )
              k = rt(i[$t][C++], Rs);
          else
            k = rt(i[$t], Rs);
          this.set(m, k);
        }
        break;
      case qe:
        var x = i[Yt];
        if (x) {
          var $ = i[Gi];
          x == $i && ($ = parseInt(Pr($), 10) >= 13 ? "11" : "10"), this.set(v, x).set(y, $);
        }
        this.get(v) == $i && i[w] == "Xbox" && this.set(v, "Xbox").set(y, void 0);
        break;
      case Xt:
        var K = this.data, ie = function(F) {
          return K[F].getItem().setCH(i).parseCH().get();
        };
        this.set(Ie, ie(Ie)).set(ht, ie(ht)).set(it, ie(it)).set(Ye, ie(Ye)).set(qe, ie(qe));
    }
    return this;
  }, ft.call(this, [
    ["itemType", n],
    ["ua", e],
    ["uaCH", r],
    ["rgxMap", t],
    ["data", Sa(this, n)]
  ]), this;
}
function mt(n, e, t) {
  if (typeof n === Zt ? (sr(n, !0) ? (typeof e === Zt && (t = e), e = n) : (t = n, e = void 0), n = void 0) : typeof n === Pi && !sr(e, !0) && (t = e, e = void 0), t && typeof t.append === ir) {
    var r = {};
    t.forEach(function(c, l) {
      r[l] = c;
    }), t = r;
  }
  if (!(this instanceof mt))
    return new mt(n, e, t).getResult();
  var i = typeof n === Pi ? n : (
    // Passed user-agent string
    t && t[ps] ? t[ps] : (
      // User-Agent from passed headers
      Pe && Pe.userAgent ? Pe.userAgent : (
        // navigator.userAgent
        Kt
      )
    )
  ), o = new Do(t, !0), s = e ? Ra(_s, e) : _s, a = function(c) {
    return c == Xt ? function() {
      return new Ss(c, i, s, o).set("ua", i).set(Ie, this.getBrowser()).set(ht, this.getCPU()).set(it, this.getDevice()).set(Ye, this.getEngine()).set(qe, this.getOS()).get();
    } : function() {
      return new Ss(c, i, s[c], o).parseUA().get();
    };
  };
  return ft.call(this, [
    ["getBrowser", a(Ie)],
    ["getCPU", a(ht)],
    ["getDevice", a(it)],
    ["getEngine", a(Ye)],
    ["getOS", a(qe)],
    ["getResult", a(Xt)],
    ["getUA", function() {
      return i;
    }],
    ["setUA", function(c) {
      return Jt(c) && (i = c.length > Ni ? or(c, Ni) : c), this;
    }]
  ]).setUA(i), this;
}
mt.VERSION = ga;
mt.BROWSER = hr([v, y, On, m]);
mt.CPU = hr([Ne]);
mt.DEVICE = hr([w, b, m, Tn, Y, xe, he, tt, An]);
mt.ENGINE = mt.OS = hr([v, y]);
function Ta() {
  return !new mt().getDevice().type;
}
function Aa() {
  const n = document.createElement("div");
  n.classList.add("nodekit-container"), document.body.appendChild(n);
  const e = document.createElement("div");
  return e.classList.add("nodekit-content"), n.appendChild(e), e;
}
class Ca {
  constructor() {
    this.urlLookup = {};
  }
  getKey(e, t) {
    return `${e}|${t}`;
  }
  registerAsset(e) {
    let t = e.identifier.sha256, r = e.identifier.mime_type, i = this.getKey(t, r);
    this.urlLookup[i] = e;
  }
  lookupAssetUrl(e) {
    let t = this.getKey(e.sha256, e.mime_type), r = this.urlLookup[t];
    if (!r)
      throw new Error(`Asset not found: ${e.sha256} (${e.mime_type})`);
    return r;
  }
  async getImage(e) {
    let t = this.lookupAssetUrl(e), r = new Image();
    return r.src = t.url, new Promise(
      (i, o) => {
        r.onload = () => i(r), r.onerror = (s) => o(s);
      }
    );
  }
  async getVideo(e) {
    let t = this.lookupAssetUrl(e), r = document.createElement("video");
    r.controls = !1;
    let i = new Promise((o, s) => {
      r.oncanplaythrough = () => {
        o(r);
      }, r.onerror = (a) => s(a);
    });
    return r.src = t.url, r.load(), i;
  }
}
class Ge {
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
      r instanceof Ge ? e.push(r) : Array.isArray(r) && r.every((i) => i instanceof Ge) && e.push(...r);
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
class Oa extends Ge {
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
class La extends Ge {
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
class pr extends Ge {
  constructor(e) {
    super(), this.root = document.createElement("div"), this.root.classList.add("overlay"), this.root.id = e;
  }
  setVisibility(e) {
    e ? this.root.classList.add("overlay--visible-state") : this.root.classList.remove("overlay--visible-state");
  }
}
class Ia extends Ge {
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
    e.classList.add("connecting-message-box"), this.root.appendChild(e), this.spinner = new Ia(), this.spinner.mount(e);
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
var Mr, Ts;
function $a() {
  if (Ts) return Mr;
  Ts = 1;
  function n(h) {
    return h instanceof Map ? h.clear = h.delete = h.set = function() {
      throw new Error("map is read-only");
    } : h instanceof Set && (h.add = h.clear = h.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(h), Object.getOwnPropertyNames(h).forEach((g) => {
      const _ = h[g], V = typeof _;
      (V === "object" || V === "function") && !Object.isFrozen(_) && n(_);
    }), h;
  }
  class e {
    /**
     * @param {CompiledMode} mode
     */
    constructor(g) {
      g.data === void 0 && (g.data = {}), this.data = g.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function t(h) {
    return h.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function r(h, ...g) {
    const _ = /* @__PURE__ */ Object.create(null);
    for (const V in h)
      _[V] = h[V];
    return g.forEach(function(V) {
      for (const we in V)
        _[we] = V[we];
    }), /** @type {T} */
    _;
  }
  const i = "</span>", o = (h) => !!h.scope, s = (h, { prefix: g }) => {
    if (h.startsWith("language:"))
      return h.replace("language:", "language-");
    if (h.includes(".")) {
      const _ = h.split(".");
      return [
        `${g}${_.shift()}`,
        ..._.map((V, we) => `${V}${"_".repeat(we + 1)}`)
      ].join(" ");
    }
    return `${g}${h}`;
  };
  class a {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(g, _) {
      this.buffer = "", this.classPrefix = _.classPrefix, g.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(g) {
      this.buffer += t(g);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(g) {
      if (!o(g)) return;
      const _ = s(
        g.scope,
        { prefix: this.classPrefix }
      );
      this.span(_);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(g) {
      o(g) && (this.buffer += i);
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
    span(g) {
      this.buffer += `<span class="${g}">`;
    }
  }
  const c = (h = {}) => {
    const g = { children: [] };
    return Object.assign(g, h), g;
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
    add(g) {
      this.top.children.push(g);
    }
    /** @param {string} scope */
    openNode(g) {
      const _ = c({ scope: g });
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
    walk(g) {
      return this.constructor._walk(g, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(g, _) {
      return typeof _ == "string" ? g.addText(_) : _.children && (g.openNode(_), _.children.forEach((V) => this._walk(g, V)), g.closeNode(_)), g;
    }
    /**
     * @param {Node} node
     */
    static _collapse(g) {
      typeof g != "string" && g.children && (g.children.every((_) => typeof _ == "string") ? g.children = [g.children.join("")] : g.children.forEach((_) => {
        l._collapse(_);
      }));
    }
  }
  class u extends l {
    /**
     * @param {*} options
     */
    constructor(g) {
      super(), this.options = g;
    }
    /**
     * @param {string} text
     */
    addText(g) {
      g !== "" && this.add(g);
    }
    /** @param {string} scope */
    startScope(g) {
      this.openNode(g);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(g, _) {
      const V = g.root;
      _ && (V.scope = `language:${_}`), this.add(V);
    }
    toHTML() {
      return new a(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function f(h) {
    return h ? typeof h == "string" ? h : h.source : null;
  }
  function d(h) {
    return x("(?=", h, ")");
  }
  function k(h) {
    return x("(?:", h, ")*");
  }
  function C(h) {
    return x("(?:", h, ")?");
  }
  function x(...h) {
    return h.map((_) => f(_)).join("");
  }
  function $(h) {
    const g = h[h.length - 1];
    return typeof g == "object" && g.constructor === Object ? (h.splice(h.length - 1, 1), g) : {};
  }
  function K(...h) {
    return "(" + ($(h).capture ? "" : "?:") + h.map((V) => f(V)).join("|") + ")";
  }
  function ie(h) {
    return new RegExp(h.toString() + "|").exec("").length - 1;
  }
  function F(h, g) {
    const _ = h && h.exec(g);
    return _ && _.index === 0;
  }
  const J = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function se(h, { joinWith: g }) {
    let _ = 0;
    return h.map((V) => {
      _ += 1;
      const we = _;
      let me = f(V), I = "";
      for (; me.length > 0; ) {
        const L = J.exec(me);
        if (!L) {
          I += me;
          break;
        }
        I += me.substring(0, L.index), me = me.substring(L.index + L[0].length), L[0][0] === "\\" && L[1] ? I += "\\" + String(Number(L[1]) + we) : (I += L[0], L[0] === "(" && _++);
      }
      return I;
    }).map((V) => `(${V})`).join(g);
  }
  const re = /\b\B/, oe = "[a-zA-Z]\\w*", q = "[a-zA-Z_]\\w*", $e = "\\b\\d+(\\.\\d+)?", He = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", be = "\\b(0b[01]+)", st = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", ot = (h = {}) => {
    const g = /^#![ ]*\//;
    return h.binary && (h.begin = x(
      g,
      /.*\b/,
      h.binary,
      /\b.*/
    )), r({
      scope: "meta",
      begin: g,
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
  }, S = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [T]
  }, H = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [T]
  }, N = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, M = function(h, g, _ = {}) {
    const V = r(
      {
        scope: "comment",
        begin: h,
        end: g,
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
        begin: x(
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
  }, P = M("//", "$"), j = M("/\\*", "\\*/"), z = M("#", "$"), Z = {
    scope: "number",
    begin: $e,
    relevance: 0
  }, W = {
    scope: "number",
    begin: He,
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
    begin: oe,
    relevance: 0
  }, tn = {
    scope: "title",
    begin: q,
    relevance: 0
  }, Nn = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + q,
    relevance: 0
  };
  var At = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: S,
    BACKSLASH_ESCAPE: T,
    BINARY_NUMBER_MODE: ve,
    BINARY_NUMBER_RE: be,
    COMMENT: M,
    C_BLOCK_COMMENT_MODE: j,
    C_LINE_COMMENT_MODE: P,
    C_NUMBER_MODE: W,
    C_NUMBER_RE: He,
    END_SAME_AS_BEGIN: function(h) {
      return Object.assign(
        h,
        {
          /** @type {ModeCallback} */
          "on:begin": (g, _) => {
            _.data._beginMatch = g[1];
          },
          /** @type {ModeCallback} */
          "on:end": (g, _) => {
            _.data._beginMatch !== g[1] && _.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: z,
    IDENT_RE: oe,
    MATCH_NOTHING_RE: re,
    METHOD_GUARD: Nn,
    NUMBER_MODE: Z,
    NUMBER_RE: $e,
    PHRASAL_WORDS_MODE: N,
    QUOTE_STRING_MODE: H,
    REGEXP_MODE: X,
    RE_STARTERS_RE: st,
    SHEBANG: ot,
    TITLE_MODE: Me,
    UNDERSCORE_IDENT_RE: q,
    UNDERSCORE_TITLE_MODE: tn
  });
  function $n(h, g) {
    h.input[h.index - 1] === "." && g.ignoreMatch();
  }
  function wt(h, g) {
    h.className !== void 0 && (h.scope = h.className, delete h.className);
  }
  function Bt(h, g) {
    g && h.beginKeywords && (h.begin = "\\b(" + h.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", h.__beforeBegin = $n, h.keywords = h.keywords || h.beginKeywords, delete h.beginKeywords, h.relevance === void 0 && (h.relevance = 0));
  }
  function at(h, g) {
    Array.isArray(h.illegal) && (h.illegal = K(...h.illegal));
  }
  function nn(h, g) {
    if (h.match) {
      if (h.begin || h.end) throw new Error("begin & end are not supported with match");
      h.begin = h.match, delete h.match;
    }
  }
  function rn(h, g) {
    h.relevance === void 0 && (h.relevance = 1);
  }
  const bt = (h, g) => {
    if (!h.beforeMatch) return;
    if (h.starts) throw new Error("beforeMatch cannot be used with starts");
    const _ = Object.assign({}, h);
    Object.keys(h).forEach((V) => {
      delete h[V];
    }), h.keywords = _.keywords, h.begin = x(_.beforeMatch, d(_.begin)), h.starts = {
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
  function sn(h, g, _ = Ft) {
    const V = /* @__PURE__ */ Object.create(null);
    return typeof h == "string" ? we(_, h.split(" ")) : Array.isArray(h) ? we(_, h) : Object.keys(h).forEach(function(me) {
      Object.assign(
        V,
        sn(h[me], g, me)
      );
    }), V;
    function we(me, I) {
      g && (I = I.map((L) => L.toLowerCase())), I.forEach(function(L) {
        const G = L.split("|");
        V[G[0]] = [me, Mn(G[0], G[1])];
      });
    }
  }
  function Mn(h, g) {
    return g ? Number(g) : vr(h) ? 0 : 1;
  }
  function vr(h) {
    return Ut.includes(h.toLowerCase());
  }
  const Ht = {}, De = (h) => {
    console.error(h);
  }, lt = (h, ...g) => {
    console.log(`WARN: ${h}`, ...g);
  }, Be = (h, g) => {
    Ht[`${h}/${g}`] || (console.log(`Deprecated as of ${h}. ${g}`), Ht[`${h}/${g}`] = !0);
  }, Ct = new Error();
  function on(h, g, { key: _ }) {
    let V = 0;
    const we = h[_], me = {}, I = {};
    for (let L = 1; L <= g.length; L++)
      I[L + V] = we[L], me[L + V] = !0, V += ie(g[L - 1]);
    h[_] = I, h[_]._emit = me, h[_]._multi = !0;
  }
  function Dn(h) {
    if (Array.isArray(h.begin)) {
      if (h.skip || h.excludeBegin || h.returnBegin)
        throw De("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Ct;
      if (typeof h.beginScope != "object" || h.beginScope === null)
        throw De("beginScope must be object"), Ct;
      on(h, h.begin, { key: "beginScope" }), h.begin = se(h.begin, { joinWith: "" });
    }
  }
  function an(h) {
    if (Array.isArray(h.end)) {
      if (h.skip || h.excludeEnd || h.returnEnd)
        throw De("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Ct;
      if (typeof h.endScope != "object" || h.endScope === null)
        throw De("endScope must be object"), Ct;
      on(h, h.end, { key: "endScope" }), h.end = se(h.end, { joinWith: "" });
    }
  }
  function Bn(h) {
    h.scope && typeof h.scope == "object" && h.scope !== null && (h.beginScope = h.scope, delete h.scope);
  }
  function zt(h) {
    Bn(h), typeof h.beginScope == "string" && (h.beginScope = { _wrap: h.beginScope }), typeof h.endScope == "string" && (h.endScope = { _wrap: h.endScope }), Dn(h), an(h);
  }
  function qt(h) {
    function g(I, L) {
      return new RegExp(
        f(I),
        "m" + (h.case_insensitive ? "i" : "") + (h.unicodeRegex ? "u" : "") + (L ? "g" : "")
      );
    }
    class _ {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(L, G) {
        G.position = this.position++, this.matchIndexes[this.matchAt] = G, this.regexes.push([G, L]), this.matchAt += ie(L) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const L = this.regexes.map((G) => G[1]);
        this.matcherRe = g(se(L, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(L) {
        this.matcherRe.lastIndex = this.lastIndex;
        const G = this.matcherRe.exec(L);
        if (!G)
          return null;
        const le = G.findIndex((yt, Gt) => Gt > 0 && yt !== void 0), pe = this.matchIndexes[le];
        return G.splice(0, le), Object.assign(G, pe);
      }
    }
    class V {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(L) {
        if (this.multiRegexes[L]) return this.multiRegexes[L];
        const G = new _();
        return this.rules.slice(L).forEach(([le, pe]) => G.addRule(le, pe)), G.compile(), this.multiRegexes[L] = G, G;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(L, G) {
        this.rules.push([L, G]), G.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(L) {
        const G = this.getMatcher(this.regexIndex);
        G.lastIndex = this.lastIndex;
        let le = G.exec(L);
        if (this.resumingScanAtSamePosition() && !(le && le.index === this.lastIndex)) {
          const pe = this.getMatcher(0);
          pe.lastIndex = this.lastIndex + 1, le = pe.exec(L);
        }
        return le && (this.regexIndex += le.position + 1, this.regexIndex === this.count && this.considerAll()), le;
      }
    }
    function we(I) {
      const L = new V();
      return I.contains.forEach((G) => L.addRule(G.begin, { rule: G, type: "begin" })), I.terminatorEnd && L.addRule(I.terminatorEnd, { type: "end" }), I.illegal && L.addRule(I.illegal, { type: "illegal" }), L;
    }
    function me(I, L) {
      const G = (
        /** @type CompiledMode */
        I
      );
      if (I.isCompiled) return G;
      [
        wt,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        nn,
        zt,
        bt
      ].forEach((pe) => pe(I, L)), h.compilerExtensions.forEach((pe) => pe(I, L)), I.__beforeBegin = null, [
        Bt,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        at,
        // default to 1 relevance if not specified
        rn
      ].forEach((pe) => pe(I, L)), I.isCompiled = !0;
      let le = null;
      return typeof I.keywords == "object" && I.keywords.$pattern && (I.keywords = Object.assign({}, I.keywords), le = I.keywords.$pattern, delete I.keywords.$pattern), le = le || /\w+/, I.keywords && (I.keywords = sn(I.keywords, h.case_insensitive)), G.keywordPatternRe = g(le, !0), L && (I.begin || (I.begin = /\B|\b/), G.beginRe = g(G.begin), !I.end && !I.endsWithParent && (I.end = /\B|\b/), I.end && (G.endRe = g(G.end)), G.terminatorEnd = f(G.end) || "", I.endsWithParent && L.terminatorEnd && (G.terminatorEnd += (I.end ? "|" : "") + L.terminatorEnd)), I.illegal && (G.illegalRe = g(
        /** @type {RegExp | string} */
        I.illegal
      )), I.contains || (I.contains = []), I.contains = [].concat(...I.contains.map(function(pe) {
        return Et(pe === "self" ? I : pe);
      })), I.contains.forEach(function(pe) {
        me(
          /** @type Mode */
          pe,
          G
        );
      }), I.starts && me(I.starts, L), G.matcher = we(G), G;
    }
    if (h.compilerExtensions || (h.compilerExtensions = []), h.contains && h.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return h.classNameAliases = r(h.classNameAliases || {}), me(
      /** @type Mode */
      h
    );
  }
  function ze(h) {
    return h ? h.endsWithParent || ze(h.starts) : !1;
  }
  function Et(h) {
    return h.variants && !h.cachedVariants && (h.cachedVariants = h.variants.map(function(g) {
      return r(h, { variants: null }, g);
    })), h.cachedVariants ? h.cachedVariants : ze(h) ? r(h, { starts: h.starts ? r(h.starts) : null }) : Object.isFrozen(h) ? r(h) : h;
  }
  var ln = "11.11.1";
  class cn extends Error {
    constructor(g, _) {
      super(g), this.name = "HTMLInjectionError", this.html = _;
    }
  }
  const un = t, Ot = r, Lt = Symbol("nomatch"), xr = 7, vt = function(h) {
    const g = /* @__PURE__ */ Object.create(null), _ = /* @__PURE__ */ Object.create(null), V = [];
    let we = !0;
    const me = "Could not find the language '{}', did you forget to load/include a language module?", I = { disableAutodetect: !0, name: "Plain text", contains: [] };
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
    function G(E) {
      return L.noHighlightRe.test(E);
    }
    function le(E) {
      let B = E.className + " ";
      B += E.parentNode ? E.parentNode.className : "";
      const te = L.languageDetectRe.exec(B);
      if (te) {
        const de = O(te[1]);
        return de || (lt(me.replace("{}", te[1])), lt("Falling back to no-highlight mode for this block.", E)), de ? te[1] : "no-highlight";
      }
      return B.split(/\s+/).find((de) => G(de) || O(de));
    }
    function pe(E, B, te) {
      let de = "", ke = "";
      typeof B == "object" ? (de = E, te = B.ignoreIllegals, ke = B.language) : (Be("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Be("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), ke = E, de = B), te === void 0 && (te = !0);
      const We = {
        code: de,
        language: ke
      };
      Qe("before:highlight", We);
      const kt = We.result ? We.result : yt(We.language, We.code, te);
      return kt.code = We.code, Qe("after:highlight", kt), kt;
    }
    function yt(E, B, te, de) {
      const ke = /* @__PURE__ */ Object.create(null);
      function We(A, U) {
        return A.keywords[U];
      }
      function kt() {
        if (!Q.keywords) {
          Re.addText(ge);
          return;
        }
        let A = 0;
        Q.keywordPatternRe.lastIndex = 0;
        let U = Q.keywordPatternRe.exec(ge), ee = "";
        for (; U; ) {
          ee += ge.substring(A, U.index);
          const ce = et.case_insensitive ? U[0].toLowerCase() : U[0], Se = We(Q, ce);
          if (Se) {
            const [ct, ha] = Se;
            if (Re.addText(ee), ee = "", ke[ce] = (ke[ce] || 0) + 1, ke[ce] <= xr && (jn += ha), ct.startsWith("_"))
              ee += U[0];
            else {
              const pa = et.classNameAliases[ct] || ct;
              Je(U[0], pa);
            }
          } else
            ee += U[0];
          A = Q.keywordPatternRe.lastIndex, U = Q.keywordPatternRe.exec(ge);
        }
        ee += ge.substring(A), Re.addText(ee);
      }
      function qn() {
        if (ge === "") return;
        let A = null;
        if (typeof Q.subLanguage == "string") {
          if (!g[Q.subLanguage]) {
            Re.addText(ge);
            return;
          }
          A = yt(Q.subLanguage, ge, !0, hs[Q.subLanguage]), hs[Q.subLanguage] = /** @type {CompiledMode} */
          A._top;
        } else
          A = It(ge, Q.subLanguage.length ? Q.subLanguage : null);
        Q.relevance > 0 && (jn += A.relevance), Re.__addSublanguage(A._emitter, A.language);
      }
      function Fe() {
        Q.subLanguage != null ? qn() : kt(), ge = "";
      }
      function Je(A, U) {
        A !== "" && (Re.startScope(U), Re.addText(A), Re.endScope());
      }
      function as(A, U) {
        let ee = 1;
        const ce = U.length - 1;
        for (; ee <= ce; ) {
          if (!A._emit[ee]) {
            ee++;
            continue;
          }
          const Se = et.classNameAliases[A[ee]] || A[ee], ct = U[ee];
          Se ? Je(ct, Se) : (ge = ct, kt(), ge = ""), ee++;
        }
      }
      function ls(A, U) {
        return A.scope && typeof A.scope == "string" && Re.openNode(et.classNameAliases[A.scope] || A.scope), A.beginScope && (A.beginScope._wrap ? (Je(ge, et.classNameAliases[A.beginScope._wrap] || A.beginScope._wrap), ge = "") : A.beginScope._multi && (as(A.beginScope, U), ge = "")), Q = Object.create(A, { parent: { value: Q } }), Q;
      }
      function cs(A, U, ee) {
        let ce = F(A.endRe, ee);
        if (ce) {
          if (A["on:end"]) {
            const Se = new e(A);
            A["on:end"](U, Se), Se.isMatchIgnored && (ce = !1);
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
        return Q.matcher.regexIndex === 0 ? (ge += A[0], 1) : (Rr = !0, 0);
      }
      function aa(A) {
        const U = A[0], ee = A.rule, ce = new e(ee), Se = [ee.__beforeBegin, ee["on:begin"]];
        for (const ct of Se)
          if (ct && (ct(A, ce), ce.isMatchIgnored))
            return oa(U);
        return ee.skip ? ge += U : (ee.excludeBegin && (ge += U), Fe(), !ee.returnBegin && !ee.excludeBegin && (ge = U)), ls(ee, A), ee.returnBegin ? 0 : U.length;
      }
      function la(A) {
        const U = A[0], ee = B.substring(A.index), ce = cs(Q, A, ee);
        if (!ce)
          return Lt;
        const Se = Q;
        Q.endScope && Q.endScope._wrap ? (Fe(), Je(U, Q.endScope._wrap)) : Q.endScope && Q.endScope._multi ? (Fe(), as(Q.endScope, A)) : Se.skip ? ge += U : (Se.returnEnd || Se.excludeEnd || (ge += U), Fe(), Se.excludeEnd && (ge = U));
        do
          Q.scope && Re.closeNode(), !Q.skip && !Q.subLanguage && (jn += Q.relevance), Q = Q.parent;
        while (Q !== ce.parent);
        return ce.starts && ls(ce.starts, A), Se.returnEnd ? 0 : U.length;
      }
      function ca() {
        const A = [];
        for (let U = Q; U !== et; U = U.parent)
          U.scope && A.unshift(U.scope);
        A.forEach((U) => Re.openNode(U));
      }
      let Gn = {};
      function us(A, U) {
        const ee = U && U[0];
        if (ge += A, ee == null)
          return Fe(), 0;
        if (Gn.type === "begin" && U.type === "end" && Gn.index === U.index && ee === "") {
          if (ge += B.slice(U.index, U.index + 1), !we) {
            const ce = new Error(`0 width match regex (${E})`);
            throw ce.languageName = E, ce.badRule = Gn.rule, ce;
          }
          return 1;
        }
        if (Gn = U, U.type === "begin")
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
        if (kr > 1e5 && kr > U.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return ge += ee, ee.length;
      }
      const et = O(E);
      if (!et)
        throw De(me.replace("{}", E)), new Error('Unknown language: "' + E + '"');
      const ua = qt(et);
      let yr = "", Q = de || ua;
      const hs = {}, Re = new L.__emitter(L);
      ca();
      let ge = "", jn = 0, Nt = 0, kr = 0, Rr = !1;
      try {
        if (et.__emitTokens)
          et.__emitTokens(B, Re);
        else {
          for (Q.matcher.considerAll(); ; ) {
            kr++, Rr ? Rr = !1 : Q.matcher.considerAll(), Q.matcher.lastIndex = Nt;
            const A = Q.matcher.exec(B);
            if (!A) break;
            const U = B.substring(Nt, A.index), ee = us(U, A);
            Nt = A.index + ee;
          }
          us(B.substring(Nt));
        }
        return Re.finalize(), yr = Re.toHTML(), {
          language: E,
          value: yr,
          relevance: jn,
          illegal: !1,
          _emitter: Re,
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
              resultSoFar: yr
            },
            _emitter: Re
          };
        if (we)
          return {
            language: E,
            value: un(B),
            illegal: !1,
            relevance: 0,
            errorRaised: A,
            _emitter: Re,
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
        _top: I,
        _emitter: new L.__emitter(L)
      };
      return B._emitter.addText(E), B;
    }
    function It(E, B) {
      B = B || L.languages || Object.keys(g);
      const te = Gt(E), de = B.filter(O).filter(ye).map(
        (Fe) => yt(Fe, E, !1)
      );
      de.unshift(te);
      const ke = de.sort((Fe, Je) => {
        if (Fe.relevance !== Je.relevance) return Je.relevance - Fe.relevance;
        if (Fe.language && Je.language) {
          if (O(Fe.language).supersetOf === Je.language)
            return 1;
          if (O(Je.language).supersetOf === Fe.language)
            return -1;
        }
        return 0;
      }), [We, kt] = ke, qn = We;
      return qn.secondBest = kt, qn;
    }
    function Un(E, B, te) {
      const de = B && _[B] || te;
      E.classList.add("hljs"), E.classList.add(`language-${de}`);
    }
    function Ue(E) {
      let B = null;
      const te = le(E);
      if (G(te)) return;
      if (Qe(
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
      const de = B.textContent, ke = te ? pe(de, { language: te, ignoreIllegals: !0 }) : It(de);
      E.innerHTML = ke.value, E.dataset.highlighted = "yes", Un(E, te, ke.language), E.result = {
        language: ke.language,
        // TODO: remove with version 11.0
        re: ke.relevance,
        relevance: ke.relevance
      }, ke.secondBest && (E.secondBest = {
        language: ke.secondBest.language,
        relevance: ke.secondBest.relevance
      }), Qe("after:highlightElement", { el: E, result: ke, text: de });
    }
    function Fn(E) {
      L = Ot(L, E);
    }
    const Hn = () => {
      jt(), Be("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function zn() {
      jt(), Be("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
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
      document.querySelectorAll(L.cssSelector).forEach(Ue);
    }
    function D(E, B) {
      let te = null;
      try {
        te = B(h);
      } catch (de) {
        if (De("Language definition for '{}' could not be registered.".replace("{}", E)), we)
          De(de);
        else
          throw de;
        te = I;
      }
      te.name || (te.name = E), g[E] = te, te.rawDefinition = B.bind(null, h), te.aliases && fe(te.aliases, { languageName: E });
    }
    function p(E) {
      delete g[E];
      for (const B of Object.keys(_))
        _[B] === E && delete _[B];
    }
    function R() {
      return Object.keys(g);
    }
    function O(E) {
      return E = (E || "").toLowerCase(), g[E] || g[_[E]];
    }
    function fe(E, { languageName: B }) {
      typeof E == "string" && (E = [E]), E.forEach((te) => {
        _[te.toLowerCase()] = B;
      });
    }
    function ye(E) {
      const B = O(E);
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
    function Ve(E) {
      const B = V.indexOf(E);
      B !== -1 && V.splice(B, 1);
    }
    function Qe(E, B) {
      const te = E;
      V.forEach(function(de) {
        de[te] && de[te](B);
      });
    }
    function pn(E) {
      return Be("10.7.0", "highlightBlock will be removed entirely in v12.0"), Be("10.7.0", "Please use highlightElement now."), Ue(E);
    }
    Object.assign(h, {
      highlight: pe,
      highlightAuto: It,
      highlightAll: jt,
      highlightElement: Ue,
      // TODO: Remove with v12 API
      highlightBlock: pn,
      configure: Fn,
      initHighlighting: Hn,
      initHighlightingOnLoad: zn,
      registerLanguage: D,
      unregisterLanguage: p,
      listLanguages: R,
      getLanguage: O,
      registerAliases: fe,
      autoDetection: ye,
      inherit: Ot,
      addPlugin: _e,
      removePlugin: Ve
    }), h.debugMode = function() {
      we = !1;
    }, h.safeMode = function() {
      we = !0;
    }, h.versionString = ln, h.regex = {
      concat: x,
      lookahead: d,
      either: K,
      optional: C,
      anyNumberOfTimes: k
    };
    for (const E in At)
      typeof At[E] == "object" && n(At[E]);
    return Object.assign(h, At), h;
  }, xt = vt({});
  return xt.newInstance = () => vt({}), Mr = xt, xt.HighlightJS = xt, xt.default = xt, Mr;
}
var Ma = /* @__PURE__ */ $a();
const Bo = /* @__PURE__ */ Pa(Ma);
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
class Ba extends Ge {
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
class Fa extends Ge {
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
class Ha extends pr {
  constructor() {
    super("session-finished-overlay"), this.submitButton = new za(), this.submitButton.mount(this.root), this.messageBox = document.createElement("div"), this.messageBox.classList.add("debrief-message-box"), this.root.appendChild(this.messageBox), this.messageSpan = document.createElement("span"), this.messageSpan.classList.add("debrief-message-box__text"), this.messageBox.appendChild(this.messageSpan);
  }
  show(e, t) {
    e.length == 0 ? this.messageBox.style.visibility = "hidden" : this.messageBox.style.visibility = "visible", this.messageSpan.textContent = e, this.submitButton.attachClickListener(t), this.setVisibility(!0);
  }
  hide() {
    this.messageSpan.textContent = "", super.setVisibility(!1), this.submitButton.removeAllEventListeners();
  }
}
class za extends Ge {
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
class Ga extends Ge {
  constructor() {
    super();
    const e = document.createElement("button");
    e.classList.add("start-button"), e.textContent = "Press to Start", this.root = e;
  }
  attachClickListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class ja extends Ge {
  constructor() {
    super(), this.root = document.createElement("div"), this.root.className = "shell-ui", this.progressBar = new La("cognition"), this.progressBar.mount(this.root), this.statusDot = new Oa(), this.statusDot.mount(this.root), this.sessionConnectingOverlay = new Na(), this.sessionConnectingOverlay.mount(this.root), this.overlayConsoleMessage = new Ua(), this.overlayConsoleMessage.mount(this.root), this.sessionFinishedOverlay = new Ha(), this.sessionFinishedOverlay.mount(this.root), this.sessionStartedOverlay = new qa(), this.sessionStartedOverlay.mount(this.root);
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
      const f = {
        action_type: "ClickAction",
        x: l.x,
        y: l.y
      };
      s(
        f,
        l.domTimestamp
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
        const c = r.w / 2, l = r.h / 2, u = e - r.x, f = t - r.y;
        return u * u / (c * c) + f * f / (l * l) <= 1;
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
class Ya {
  constructor(e, t) {
    this.tArmed = null, this.onKeyPress = (r) => {
      if (!this.tArmed)
        return;
      r.preventDefault();
      let i = r.key;
      if (!this.keys.includes(i))
        return;
      const o = {
        action_type: "KeyAction",
        key: i
      };
      this.onSensorFired(o, performance.now());
    }, this.onSensorFired = e, this.keys = [t], document.addEventListener("keydown", this.onKeyPress);
  }
  arm() {
    this.tArmed = performance.now();
  }
  destroy() {
    this.tArmed = null, document.removeEventListener("keydown", this.onKeyPress);
  }
}
class ji {
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
class Ka extends ji {
  async prepare(e) {
    this.imageContainer = document.createElement("div"), this.imageContainer.classList.add("image-card"), this.root.appendChild(this.imageContainer), this.image = await e.getImage(
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
function ae(n, e = "") {
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
}, Za = /^(?:[ \t]*(?:\n|$))+/, Qa = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Ja = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Ln = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, el = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Wi = /(?:[*+-]|\d{1,9}[.)])/, Fo = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Ho = ae(Fo).replace(/bull/g, Wi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), tl = ae(Fo).replace(/bull/g, Wi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Xi = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, nl = /^[^\n]+/, Yi = /(?!\s*\])(?:\\.|[^\[\]\\])+/, rl = ae(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Yi).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), il = ae(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Wi).getRegex(), fr = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Ki = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, sl = ae(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", Ki).replace("tag", fr).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), zo = ae(Xi).replace("hr", Ln).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", fr).getRegex(), ol = ae(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", zo).getRegex(), Zi = {
  blockquote: ol,
  code: Qa,
  def: rl,
  fences: Ja,
  heading: el,
  hr: Ln,
  html: sl,
  lheading: Ho,
  list: il,
  newline: Za,
  paragraph: zo,
  table: Cn,
  text: nl
}, As = ae(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", Ln).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", fr).getRegex(), al = {
  ...Zi,
  lheading: tl,
  table: As,
  paragraph: ae(Xi).replace("hr", Ln).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", As).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", fr).getRegex()
}, ll = {
  ...Zi,
  html: ae(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", Ki).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: Cn,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: ae(Xi).replace("hr", Ln).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Ho).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, cl = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, ul = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, qo = /^( {2,}|\\)\n(?!\s*$)/, hl = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, dr = /[\p{P}\p{S}]/u, Qi = /[\s\p{P}\p{S}]/u, Go = /[^\s\p{P}\p{S}]/u, pl = ae(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Qi).getRegex(), jo = /(?!~)[\p{P}\p{S}]/u, fl = /(?!~)[\s\p{P}\p{S}]/u, dl = /(?:[^\s\p{P}\p{S}]|~)/u, gl = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, Vo = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, ml = ae(Vo, "u").replace(/punct/g, dr).getRegex(), wl = ae(Vo, "u").replace(/punct/g, jo).getRegex(), Wo = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", bl = ae(Wo, "gu").replace(/notPunctSpace/g, Go).replace(/punctSpace/g, Qi).replace(/punct/g, dr).getRegex(), El = ae(Wo, "gu").replace(/notPunctSpace/g, dl).replace(/punctSpace/g, fl).replace(/punct/g, jo).getRegex(), vl = ae(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, Go).replace(/punctSpace/g, Qi).replace(/punct/g, dr).getRegex(), xl = ae(/\\(punct)/, "gu").replace(/punct/g, dr).getRegex(), yl = ae(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), kl = ae(Ki).replace("(?:-->|$)", "-->").getRegex(), Rl = ae(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", kl).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), ar = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, _l = ae(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", ar).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Xo = ae(/^!?\[(label)\]\[(ref)\]/).replace("label", ar).replace("ref", Yi).getRegex(), Yo = ae(/^!?\[(ref)\](?:\[\])?/).replace("ref", Yi).getRegex(), Sl = ae("reflink|nolink(?!\\()", "g").replace("reflink", Xo).replace("nolink", Yo).getRegex(), Ji = {
  _backpedal: Cn,
  // only used for GFM url
  anyPunctuation: xl,
  autolink: yl,
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
  punctuation: pl,
  reflink: Xo,
  reflinkSearch: Sl,
  tag: Rl,
  text: hl,
  url: Cn
}, Tl = {
  ...Ji,
  link: ae(/^!?\[(label)\]\((.*?)\)/).replace("label", ar).getRegex(),
  reflink: ae(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", ar).getRegex()
}, Di = {
  ...Ji,
  emStrongRDelimAst: El,
  emStrongLDelim: wl,
  url: ae(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, Al = {
  ...Di,
  br: ae(qo).replace("{2,}", "*").getRegex(),
  text: ae(Di.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Kn = {
  normal: Zi,
  gfm: al,
  pedantic: ll
}, vn = {
  normal: Ji,
  gfm: Di,
  breaks: Al,
  pedantic: Tl
}, Cl = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, Cs = (n) => Cl[n];
function nt(n, e) {
  if (e) {
    if (Ae.escapeTest.test(n))
      return n.replace(Ae.escapeReplace, Cs);
  } else if (Ae.escapeTestNoEncode.test(n))
    return n.replace(Ae.escapeReplaceNoEncode, Cs);
  return n;
}
function Os(n) {
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
function xn(n, e, t) {
  const r = n.length;
  if (r === 0)
    return "";
  let i = 0;
  for (; i < r && n.charAt(r - i - 1) === e; )
    i++;
  return n.slice(0, r - i);
}
function Ol(n, e) {
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
function Is(n, e, t, r, i) {
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
var lr = class {
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
        text: this.options.pedantic ? t : xn(t, `
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
        const r = xn(t, "#");
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
        raw: xn(e[0], `
`)
      };
  }
  blockquote(n) {
    const e = this.rules.block.blockquote.exec(n);
    if (e) {
      let t = xn(e[0], `
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
        const f = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(u, o, !0), this.lexer.state.top = f, t.length === 0)
          break;
        const d = o.at(-1);
        if (d?.type === "code")
          break;
        if (d?.type === "blockquote") {
          const k = d, C = k.raw + `
` + t.join(`
`), x = this.blockquote(C);
          o[o.length - 1] = x, r = r.substring(0, r.length - k.raw.length) + x.raw, i = i.substring(0, i.length - k.text.length) + x.text;
          break;
        } else if (d?.type === "list") {
          const k = d, C = k.raw + `
` + t.join(`
`), x = this.list(C);
          o[o.length - 1] = x, r = r.substring(0, r.length - d.raw.length) + x.raw, i = i.substring(0, i.length - k.raw.length) + x.raw, t = C.substring(o.at(-1).raw.length).split(`
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
        let f = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (K) => " ".repeat(3 * K.length)), d = n.split(`
`, 1)[0], k = !f.trim(), C = 0;
        if (this.options.pedantic ? (C = 2, u = f.trimStart()) : k ? C = e[1].length + 1 : (C = e[2].search(this.rules.other.nonSpaceChar), C = C > 4 ? 1 : C, u = f.slice(C), C += e[1].length), k && this.rules.other.blankLine.test(d) && (l += d + `
`, n = n.substring(d.length + 1), c = !0), !c) {
          const K = this.rules.other.nextBulletRegex(C), ie = this.rules.other.hrRegex(C), F = this.rules.other.fencesBeginRegex(C), J = this.rules.other.headingBeginRegex(C), se = this.rules.other.htmlBeginRegex(C);
          for (; n; ) {
            const re = n.split(`
`, 1)[0];
            let oe;
            if (d = re, this.options.pedantic ? (d = d.replace(this.rules.other.listReplaceNesting, "  "), oe = d) : oe = d.replace(this.rules.other.tabCharGlobal, "    "), F.test(d) || J.test(d) || se.test(d) || K.test(d) || ie.test(d))
              break;
            if (oe.search(this.rules.other.nonSpaceChar) >= C || !d.trim())
              u += `
` + oe.slice(C);
            else {
              if (k || f.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || F.test(f) || J.test(f) || ie.test(f))
                break;
              u += `
` + d;
            }
            !k && !d.trim() && (k = !0), l += re + `
`, n = n.substring(re.length + 1), f = oe.slice(C);
          }
        }
        i.loose || (s ? i.loose = !0 : this.rules.other.doubleBlankLine.test(l) && (s = !0));
        let x = null, $;
        this.options.gfm && (x = this.rules.other.listIsTask.exec(u), x && ($ = x[0] !== "[ ] ", u = u.replace(this.rules.other.listReplaceTask, ""))), i.items.push({
          type: "list_item",
          raw: l,
          task: !!x,
          checked: $,
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
          const l = i.items[c].tokens.filter((f) => f.type === "space"), u = l.length > 0 && l.some((f) => this.rules.other.anyLine.test(f.raw));
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
        const o = xn(t.slice(0, -1), "\\");
        if ((t.length - o.length) % 2 === 0)
          return;
      } else {
        const o = Ol(e[2], "()");
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
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(t) ? r = r.slice(1) : r = r.slice(1, -1)), Is(e, {
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
      return Is(t, i, t[0], this.lexer, this.rules);
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
        const f = [...r[0]][0].length, d = n.slice(0, o + r.index + f + a);
        if (Math.min(o, a) % 2) {
          const C = d.slice(1, -1);
          return {
            type: "em",
            raw: d,
            text: C,
            tokens: this.lexer.inlineTokens(C)
          };
        }
        const k = d.slice(2, -2);
        return {
          type: "strong",
          raw: d,
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
}, dt = class Bi {
  tokens;
  options;
  state;
  tokenizer;
  inlineQueue;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Dt, this.options.tokenizer = this.options.tokenizer || new lr(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const t = {
      other: Ae,
      block: Kn.normal,
      inline: vn.normal
    };
    this.options.pedantic ? (t.block = Kn.pedantic, t.inline = vn.pedantic) : this.options.gfm && (t.block = Kn.gfm, this.options.breaks ? t.inline = vn.breaks : t.inline = vn.gfm), this.tokenizer.rules = t;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: Kn,
      inline: vn
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
        let f;
        this.options.extensions.startInline.forEach((d) => {
          f = d.call({ lexer: this }, u), typeof f == "number" && f >= 0 && (l = Math.min(l, f));
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
}, cr = class {
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
    return r ? '<pre><code class="language-' + nt(r) + '">' + (t ? i : nt(i, !0)) + `</code></pre>
` : "<pre><code>" + (t ? i : nt(i, !0)) + `</code></pre>
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
      n.loose ? n.tokens[0]?.type === "paragraph" ? (n.tokens[0].text = t + " " + n.tokens[0].text, n.tokens[0].tokens && n.tokens[0].tokens.length > 0 && n.tokens[0].tokens[0].type === "text" && (n.tokens[0].tokens[0].text = t + " " + nt(n.tokens[0].tokens[0].text), n.tokens[0].tokens[0].escaped = !0)) : n.tokens.unshift({
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
    return `<code>${nt(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: e, tokens: t }) {
    const r = this.parser.parseInline(t), i = Os(n);
    if (i === null)
      return r;
    n = i;
    let o = '<a href="' + n + '"';
    return e && (o += ' title="' + nt(e) + '"'), o += ">" + r + "</a>", o;
  }
  image({ href: n, title: e, text: t, tokens: r }) {
    r && (t = this.parser.parseInline(r, this.parser.textRenderer));
    const i = Os(n);
    if (i === null)
      return nt(t);
    n = i;
    let o = `<img src="${n}" alt="${t}"`;
    return e && (o += ` title="${nt(e)}"`), o += ">", o;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : nt(n.text);
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
}, gt = class Ui {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || Dt, this.options.renderer = this.options.renderer || new cr(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new es();
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
}, nr = class {
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
    return this.block ? dt.lex : dt.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? gt.parse : gt.parseInline;
  }
}, Il = class {
  defaults = Vi();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = gt;
  Renderer = cr;
  TextRenderer = es;
  Lexer = dt;
  Tokenizer = lr;
  Hooks = nr;
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
        const i = this.defaults.renderer || new cr(this.defaults);
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
        const i = this.defaults.tokenizer || new lr(this.defaults);
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
        const i = this.defaults.hooks || new nr();
        for (const o in t.hooks) {
          if (!(o in i))
            throw new Error(`hook '${o}' does not exist`);
          if (["options", "block"].includes(o))
            continue;
          const s = o, a = t.hooks[s], c = i[s];
          nr.passThroughHooks.has(o) ? i[s] = (l) => {
            if (this.defaults.async)
              return Promise.resolve(a.call(i, l)).then((f) => c.call(i, f));
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
    return dt.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return gt.parse(n, e ?? this.defaults);
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
      const a = o.hooks ? o.hooks.provideLexer() : n ? dt.lex : dt.lexInline, c = o.hooks ? o.hooks.provideParser() : n ? gt.parse : gt.parseInline;
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
        const r = "<p>An error occurred:</p><pre>" + nt(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e)
        return Promise.reject(t);
      throw t;
    };
  }
}, Mt = new Il();
function ue(n, e) {
  return Mt.parse(n, e);
}
ue.options = ue.setOptions = function(n) {
  return Mt.setOptions(n), ue.defaults = Mt.defaults, Uo(ue.defaults), ue;
};
ue.getDefaults = Vi;
ue.defaults = Dt;
ue.use = function(...n) {
  return Mt.use(...n), ue.defaults = Mt.defaults, Uo(ue.defaults), ue;
};
ue.walkTokens = function(n, e) {
  return Mt.walkTokens(n, e);
};
ue.parseInline = Mt.parseInline;
ue.Parser = gt;
ue.parser = gt.parse;
ue.Renderer = cr;
ue.TextRenderer = es;
ue.Lexer = dt;
ue.lexer = dt.lex;
ue.Tokenizer = lr;
ue.Hooks = nr;
ue.parse = ue;
ue.options;
ue.setOptions;
ue.use;
ue.walkTokens;
ue.parseInline;
gt.parse;
dt.lex;
/*! @license DOMPurify 3.2.6 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.6/LICENSE */
const {
  entries: Ko,
  setPrototypeOf: Ns,
  isFrozen: Nl,
  getPrototypeOf: Pl,
  getOwnPropertyDescriptor: $l
} = Object;
let {
  freeze: Ce,
  seal: je,
  create: Zo
} = Object, {
  apply: Fi,
  construct: Hi
} = typeof Reflect < "u" && Reflect;
Ce || (Ce = function(e) {
  return e;
});
je || (je = function(e) {
  return e;
});
Fi || (Fi = function(e, t, r) {
  return e.apply(t, r);
});
Hi || (Hi = function(e, t) {
  return new e(...t);
});
const Zn = Oe(Array.prototype.forEach), Ml = Oe(Array.prototype.lastIndexOf), Ps = Oe(Array.prototype.pop), yn = Oe(Array.prototype.push), Dl = Oe(Array.prototype.splice), rr = Oe(String.prototype.toLowerCase), Dr = Oe(String.prototype.toString), $s = Oe(String.prototype.match), kn = Oe(String.prototype.replace), Bl = Oe(String.prototype.indexOf), Ul = Oe(String.prototype.trim), Xe = Oe(Object.prototype.hasOwnProperty), Te = Oe(RegExp.prototype.test), Rn = Fl(TypeError);
function Oe(n) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
      r[i - 1] = arguments[i];
    return Fi(n, e, r);
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
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : rr;
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
function Hl(n) {
  for (let e = 0; e < n.length; e++)
    Xe(n, e) || (n[e] = null);
  return n;
}
function ut(n) {
  const e = Zo(null);
  for (const [t, r] of Ko(n))
    Xe(n, t) && (Array.isArray(r) ? e[t] = Hl(r) : r && typeof r == "object" && r.constructor === Object ? e[t] = ut(r) : e[t] = r);
  return e;
}
function _n(n, e) {
  for (; n !== null; ) {
    const r = $l(n, e);
    if (r) {
      if (r.get)
        return Oe(r.get);
      if (typeof r.value == "function")
        return Oe(r.value);
    }
    n = Pl(n);
  }
  function t() {
    return null;
  }
  return t;
}
const Ms = Ce(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), Br = Ce(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), Ur = Ce(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), zl = Ce(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Fr = Ce(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), ql = Ce(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Ds = Ce(["#text"]), Bs = Ce(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), Hr = Ce(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), Us = Ce(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Qn = Ce(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Gl = je(/\{\{[\w\W]*|[\w\W]*\}\}/gm), jl = je(/<%[\w\W]*|[\w\W]*%>/gm), Vl = je(/\$\{[\w\W]*/gm), Wl = je(/^data-[\-\w.\u00B7-\uFFFF]+$/), Xl = je(/^aria-[\-\w]+$/), Qo = je(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Yl = je(/^(?:\w+script|data):/i), Kl = je(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), Jo = je(/^html$/i), Zl = je(/^[a-z][.\w]*(-[.\w]+)+$/i);
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
const Sn = {
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
}, Hs = function() {
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
  if (e.version = "3.2.6", e.removed = [], !n || !n.document || n.document.nodeType !== Sn.document || !n.Element)
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
    HTMLFormElement: f,
    DOMParser: d,
    trustedTypes: k
  } = n, C = c.prototype, x = _n(C, "cloneNode"), $ = _n(C, "remove"), K = _n(C, "nextSibling"), ie = _n(C, "childNodes"), F = _n(C, "parentNode");
  if (typeof s == "function") {
    const D = t.createElement("template");
    D.content && D.content.ownerDocument && (t = D.content.ownerDocument);
  }
  let J, se = "";
  const {
    implementation: re,
    createNodeIterator: oe,
    createDocumentFragment: q,
    getElementsByTagName: $e
  } = t, {
    importNode: He
  } = r;
  let be = Hs();
  e.isSupported = typeof Ko == "function" && typeof F == "function" && re && re.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: st,
    ERB_EXPR: ot,
    TMPLIT_EXPR: T,
    DATA_ATTR: S,
    ARIA_ATTR: H,
    IS_SCRIPT_OR_DATA: N,
    ATTR_WHITESPACE: M,
    CUSTOM_ELEMENT: P
  } = Fs;
  let {
    IS_ALLOWED_URI: j
  } = Fs, z = null;
  const Z = ne({}, [...Ms, ...Br, ...Ur, ...Fr, ...Ds]);
  let W = null;
  const ve = ne({}, [...Bs, ...Hr, ...Us, ...Qn]);
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
  })), Me = null, tn = null, Nn = !0, Pn = !0, At = !1, $n = !0, wt = !1, Bt = !0, at = !1, nn = !1, rn = !1, bt = !1, Ut = !1, Ft = !1, sn = !0, Mn = !1;
  const vr = "user-content-";
  let Ht = !0, De = !1, lt = {}, Be = null;
  const Ct = ne({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let on = null;
  const Dn = ne({}, ["audio", "video", "img", "source", "image", "track"]);
  let an = null;
  const Bn = ne({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), zt = "http://www.w3.org/1998/Math/MathML", qt = "http://www.w3.org/2000/svg", ze = "http://www.w3.org/1999/xhtml";
  let Et = ze, ln = !1, cn = null;
  const un = ne({}, [zt, qt, ze], Dr);
  let Ot = ne({}, ["mi", "mo", "mn", "ms", "mtext"]), Lt = ne({}, ["annotation-xml"]);
  const xr = ne({}, ["title", "style", "font", "a", "script"]);
  let vt = null;
  const xt = ["application/xhtml+xml", "text/html"], h = "text/html";
  let g = null, _ = null;
  const V = t.createElement("form"), we = function(p) {
    return p instanceof RegExp || p instanceof Function;
  }, me = function() {
    let p = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(_ && _ === p)) {
      if ((!p || typeof p != "object") && (p = {}), p = ut(p), vt = // eslint-disable-next-line unicorn/prefer-includes
      xt.indexOf(p.PARSER_MEDIA_TYPE) === -1 ? h : p.PARSER_MEDIA_TYPE, g = vt === "application/xhtml+xml" ? Dr : rr, z = Xe(p, "ALLOWED_TAGS") ? ne({}, p.ALLOWED_TAGS, g) : Z, W = Xe(p, "ALLOWED_ATTR") ? ne({}, p.ALLOWED_ATTR, g) : ve, cn = Xe(p, "ALLOWED_NAMESPACES") ? ne({}, p.ALLOWED_NAMESPACES, Dr) : un, an = Xe(p, "ADD_URI_SAFE_ATTR") ? ne(ut(Bn), p.ADD_URI_SAFE_ATTR, g) : Bn, on = Xe(p, "ADD_DATA_URI_TAGS") ? ne(ut(Dn), p.ADD_DATA_URI_TAGS, g) : Dn, Be = Xe(p, "FORBID_CONTENTS") ? ne({}, p.FORBID_CONTENTS, g) : Ct, Me = Xe(p, "FORBID_TAGS") ? ne({}, p.FORBID_TAGS, g) : ut({}), tn = Xe(p, "FORBID_ATTR") ? ne({}, p.FORBID_ATTR, g) : ut({}), lt = Xe(p, "USE_PROFILES") ? p.USE_PROFILES : !1, Nn = p.ALLOW_ARIA_ATTR !== !1, Pn = p.ALLOW_DATA_ATTR !== !1, At = p.ALLOW_UNKNOWN_PROTOCOLS || !1, $n = p.ALLOW_SELF_CLOSE_IN_ATTR !== !1, wt = p.SAFE_FOR_TEMPLATES || !1, Bt = p.SAFE_FOR_XML !== !1, at = p.WHOLE_DOCUMENT || !1, bt = p.RETURN_DOM || !1, Ut = p.RETURN_DOM_FRAGMENT || !1, Ft = p.RETURN_TRUSTED_TYPE || !1, rn = p.FORCE_BODY || !1, sn = p.SANITIZE_DOM !== !1, Mn = p.SANITIZE_NAMED_PROPS || !1, Ht = p.KEEP_CONTENT !== !1, De = p.IN_PLACE || !1, j = p.ALLOWED_URI_REGEXP || Qo, Et = p.NAMESPACE || ze, Ot = p.MATHML_TEXT_INTEGRATION_POINTS || Ot, Lt = p.HTML_INTEGRATION_POINTS || Lt, X = p.CUSTOM_ELEMENT_HANDLING || {}, p.CUSTOM_ELEMENT_HANDLING && we(p.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (X.tagNameCheck = p.CUSTOM_ELEMENT_HANDLING.tagNameCheck), p.CUSTOM_ELEMENT_HANDLING && we(p.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (X.attributeNameCheck = p.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), p.CUSTOM_ELEMENT_HANDLING && typeof p.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (X.allowCustomizedBuiltInElements = p.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), wt && (Pn = !1), Ut && (bt = !0), lt && (z = ne({}, Ds), W = [], lt.html === !0 && (ne(z, Ms), ne(W, Bs)), lt.svg === !0 && (ne(z, Br), ne(W, Hr), ne(W, Qn)), lt.svgFilters === !0 && (ne(z, Ur), ne(W, Hr), ne(W, Qn)), lt.mathMl === !0 && (ne(z, Fr), ne(W, Us), ne(W, Qn))), p.ADD_TAGS && (z === Z && (z = ut(z)), ne(z, p.ADD_TAGS, g)), p.ADD_ATTR && (W === ve && (W = ut(W)), ne(W, p.ADD_ATTR, g)), p.ADD_URI_SAFE_ATTR && ne(an, p.ADD_URI_SAFE_ATTR, g), p.FORBID_CONTENTS && (Be === Ct && (Be = ut(Be)), ne(Be, p.FORBID_CONTENTS, g)), Ht && (z["#text"] = !0), at && ne(z, ["html", "head", "body"]), z.table && (ne(z, ["tbody"]), delete Me.tbody), p.TRUSTED_TYPES_POLICY) {
        if (typeof p.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw Rn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof p.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw Rn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        J = p.TRUSTED_TYPES_POLICY, se = J.createHTML("");
      } else
        J === void 0 && (J = Jl(k, i)), J !== null && typeof se == "string" && (se = J.createHTML(""));
      Ce && Ce(p), _ = p;
    }
  }, I = ne({}, [...Br, ...Ur, ...zl]), L = ne({}, [...Fr, ...ql]), G = function(p) {
    let R = F(p);
    (!R || !R.tagName) && (R = {
      namespaceURI: Et,
      tagName: "template"
    });
    const O = rr(p.tagName), fe = rr(R.tagName);
    return cn[p.namespaceURI] ? p.namespaceURI === qt ? R.namespaceURI === ze ? O === "svg" : R.namespaceURI === zt ? O === "svg" && (fe === "annotation-xml" || Ot[fe]) : !!I[O] : p.namespaceURI === zt ? R.namespaceURI === ze ? O === "math" : R.namespaceURI === qt ? O === "math" && Lt[fe] : !!L[O] : p.namespaceURI === ze ? R.namespaceURI === qt && !Lt[fe] || R.namespaceURI === zt && !Ot[fe] ? !1 : !L[O] && (xr[O] || !I[O]) : !!(vt === "application/xhtml+xml" && cn[p.namespaceURI]) : !1;
  }, le = function(p) {
    yn(e.removed, {
      element: p
    });
    try {
      F(p).removeChild(p);
    } catch {
      $(p);
    }
  }, pe = function(p, R) {
    try {
      yn(e.removed, {
        attribute: R.getAttributeNode(p),
        from: R
      });
    } catch {
      yn(e.removed, {
        attribute: null,
        from: R
      });
    }
    if (R.removeAttribute(p), p === "is")
      if (bt || Ut)
        try {
          le(R);
        } catch {
        }
      else
        try {
          R.setAttribute(p, "");
        } catch {
        }
  }, yt = function(p) {
    let R = null, O = null;
    if (rn)
      p = "<remove></remove>" + p;
    else {
      const Ee = $s(p, /^[\r\n\t ]+/);
      O = Ee && Ee[0];
    }
    vt === "application/xhtml+xml" && Et === ze && (p = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + p + "</body></html>");
    const fe = J ? J.createHTML(p) : p;
    if (Et === ze)
      try {
        R = new d().parseFromString(fe, vt);
      } catch {
      }
    if (!R || !R.documentElement) {
      R = re.createDocument(Et, "template", null);
      try {
        R.documentElement.innerHTML = ln ? se : fe;
      } catch {
      }
    }
    const ye = R.body || R.documentElement;
    return p && O && ye.insertBefore(t.createTextNode(O), ye.childNodes[0] || null), Et === ze ? $e.call(R, at ? "html" : "body")[0] : at ? R.documentElement : ye;
  }, Gt = function(p) {
    return oe.call(
      p.ownerDocument || p,
      p,
      // eslint-disable-next-line no-bitwise
      l.SHOW_ELEMENT | l.SHOW_COMMENT | l.SHOW_TEXT | l.SHOW_PROCESSING_INSTRUCTION | l.SHOW_CDATA_SECTION,
      null
    );
  }, It = function(p) {
    return p instanceof f && (typeof p.nodeName != "string" || typeof p.textContent != "string" || typeof p.removeChild != "function" || !(p.attributes instanceof u) || typeof p.removeAttribute != "function" || typeof p.setAttribute != "function" || typeof p.namespaceURI != "string" || typeof p.insertBefore != "function" || typeof p.hasChildNodes != "function");
  }, Un = function(p) {
    return typeof a == "function" && p instanceof a;
  };
  function Ue(D, p, R) {
    Zn(D, (O) => {
      O.call(e, p, R, _);
    });
  }
  const Fn = function(p) {
    let R = null;
    if (Ue(be.beforeSanitizeElements, p, null), It(p))
      return le(p), !0;
    const O = g(p.nodeName);
    if (Ue(be.uponSanitizeElement, p, {
      tagName: O,
      allowedTags: z
    }), Bt && p.hasChildNodes() && !Un(p.firstElementChild) && Te(/<[/\w!]/g, p.innerHTML) && Te(/<[/\w!]/g, p.textContent) || p.nodeType === Sn.progressingInstruction || Bt && p.nodeType === Sn.comment && Te(/<[/\w]/g, p.data))
      return le(p), !0;
    if (!z[O] || Me[O]) {
      if (!Me[O] && zn(O) && (X.tagNameCheck instanceof RegExp && Te(X.tagNameCheck, O) || X.tagNameCheck instanceof Function && X.tagNameCheck(O)))
        return !1;
      if (Ht && !Be[O]) {
        const fe = F(p) || p.parentNode, ye = ie(p) || p.childNodes;
        if (ye && fe) {
          const Ee = ye.length;
          for (let _e = Ee - 1; _e >= 0; --_e) {
            const Ve = x(ye[_e], !0);
            Ve.__removalCount = (p.__removalCount || 0) + 1, fe.insertBefore(Ve, K(p));
          }
        }
      }
      return le(p), !0;
    }
    return p instanceof c && !G(p) || (O === "noscript" || O === "noembed" || O === "noframes") && Te(/<\/no(script|embed|frames)/i, p.innerHTML) ? (le(p), !0) : (wt && p.nodeType === Sn.text && (R = p.textContent, Zn([st, ot, T], (fe) => {
      R = kn(R, fe, " ");
    }), p.textContent !== R && (yn(e.removed, {
      element: p.cloneNode()
    }), p.textContent = R)), Ue(be.afterSanitizeElements, p, null), !1);
  }, Hn = function(p, R, O) {
    if (sn && (R === "id" || R === "name") && (O in t || O in V))
      return !1;
    if (!(Pn && !tn[R] && Te(S, R))) {
      if (!(Nn && Te(H, R))) {
        if (!W[R] || tn[R]) {
          if (
            // First condition does a very basic check if a) it's basically a valid custom element tagname AND
            // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
            !(zn(p) && (X.tagNameCheck instanceof RegExp && Te(X.tagNameCheck, p) || X.tagNameCheck instanceof Function && X.tagNameCheck(p)) && (X.attributeNameCheck instanceof RegExp && Te(X.attributeNameCheck, R) || X.attributeNameCheck instanceof Function && X.attributeNameCheck(R)) || // Alternative, second condition checks if it's an `is`-attribute, AND
            // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            R === "is" && X.allowCustomizedBuiltInElements && (X.tagNameCheck instanceof RegExp && Te(X.tagNameCheck, O) || X.tagNameCheck instanceof Function && X.tagNameCheck(O)))
          ) return !1;
        } else if (!an[R]) {
          if (!Te(j, kn(O, M, ""))) {
            if (!((R === "src" || R === "xlink:href" || R === "href") && p !== "script" && Bl(O, "data:") === 0 && on[p])) {
              if (!(At && !Te(N, kn(O, M, "")))) {
                if (O)
                  return !1;
              }
            }
          }
        }
      }
    }
    return !0;
  }, zn = function(p) {
    return p !== "annotation-xml" && $s(p, P);
  }, hn = function(p) {
    Ue(be.beforeSanitizeAttributes, p, null);
    const {
      attributes: R
    } = p;
    if (!R || It(p))
      return;
    const O = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: W,
      forceKeepAttr: void 0
    };
    let fe = R.length;
    for (; fe--; ) {
      const ye = R[fe], {
        name: Ee,
        namespaceURI: _e,
        value: Ve
      } = ye, Qe = g(Ee), pn = Ve;
      let E = Ee === "value" ? pn : Ul(pn);
      if (O.attrName = Qe, O.attrValue = E, O.keepAttr = !0, O.forceKeepAttr = void 0, Ue(be.uponSanitizeAttribute, p, O), E = O.attrValue, Mn && (Qe === "id" || Qe === "name") && (pe(Ee, p), E = vr + E), Bt && Te(/((--!?|])>)|<\/(style|title)/i, E)) {
        pe(Ee, p);
        continue;
      }
      if (O.forceKeepAttr)
        continue;
      if (!O.keepAttr) {
        pe(Ee, p);
        continue;
      }
      if (!$n && Te(/\/>/i, E)) {
        pe(Ee, p);
        continue;
      }
      wt && Zn([st, ot, T], (te) => {
        E = kn(E, te, " ");
      });
      const B = g(p.nodeName);
      if (!Hn(B, Qe, E)) {
        pe(Ee, p);
        continue;
      }
      if (J && typeof k == "object" && typeof k.getAttributeType == "function" && !_e)
        switch (k.getAttributeType(B, Qe)) {
          case "TrustedHTML": {
            E = J.createHTML(E);
            break;
          }
          case "TrustedScriptURL": {
            E = J.createScriptURL(E);
            break;
          }
        }
      if (E !== pn)
        try {
          _e ? p.setAttributeNS(_e, Ee, E) : p.setAttribute(Ee, E), It(p) ? le(p) : Ps(e.removed);
        } catch {
          pe(Ee, p);
        }
    }
    Ue(be.afterSanitizeAttributes, p, null);
  }, jt = function D(p) {
    let R = null;
    const O = Gt(p);
    for (Ue(be.beforeSanitizeShadowDOM, p, null); R = O.nextNode(); )
      Ue(be.uponSanitizeShadowNode, R, null), Fn(R), hn(R), R.content instanceof o && D(R.content);
    Ue(be.afterSanitizeShadowDOM, p, null);
  };
  return e.sanitize = function(D) {
    let p = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, R = null, O = null, fe = null, ye = null;
    if (ln = !D, ln && (D = "<!-->"), typeof D != "string" && !Un(D))
      if (typeof D.toString == "function") {
        if (D = D.toString(), typeof D != "string")
          throw Rn("dirty is not a string, aborting");
      } else
        throw Rn("toString is not a function");
    if (!e.isSupported)
      return D;
    if (nn || me(p), e.removed = [], typeof D == "string" && (De = !1), De) {
      if (D.nodeName) {
        const Ve = g(D.nodeName);
        if (!z[Ve] || Me[Ve])
          throw Rn("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (D instanceof a)
      R = yt("<!---->"), O = R.ownerDocument.importNode(D, !0), O.nodeType === Sn.element && O.nodeName === "BODY" || O.nodeName === "HTML" ? R = O : R.appendChild(O);
    else {
      if (!bt && !wt && !at && // eslint-disable-next-line unicorn/prefer-includes
      D.indexOf("<") === -1)
        return J && Ft ? J.createHTML(D) : D;
      if (R = yt(D), !R)
        return bt ? null : Ft ? se : "";
    }
    R && rn && le(R.firstChild);
    const Ee = Gt(De ? D : R);
    for (; fe = Ee.nextNode(); )
      Fn(fe), hn(fe), fe.content instanceof o && jt(fe.content);
    if (De)
      return D;
    if (bt) {
      if (Ut)
        for (ye = q.call(R.ownerDocument); R.firstChild; )
          ye.appendChild(R.firstChild);
      else
        ye = R;
      return (W.shadowroot || W.shadowrootmode) && (ye = He.call(r, ye, !0)), ye;
    }
    let _e = at ? R.outerHTML : R.innerHTML;
    return at && z["!doctype"] && R.ownerDocument && R.ownerDocument.doctype && R.ownerDocument.doctype.name && Te(Jo, R.ownerDocument.doctype.name) && (_e = "<!DOCTYPE " + R.ownerDocument.doctype.name + `>
` + _e), wt && Zn([st, ot, T], (Ve) => {
      _e = kn(_e, Ve, " ");
    }), J && Ft ? J.createHTML(_e) : _e;
  }, e.setConfig = function() {
    let D = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    me(D), nn = !0;
  }, e.clearConfig = function() {
    _ = null, nn = !1;
  }, e.isValidAttribute = function(D, p, R) {
    _ || me({});
    const O = g(D), fe = g(p);
    return Hn(O, fe, R);
  }, e.addHook = function(D, p) {
    typeof p == "function" && yn(be[D], p);
  }, e.removeHook = function(D, p) {
    if (p !== void 0) {
      const R = Ml(be[D], p);
      return R === -1 ? void 0 : Dl(be[D], R, 1)[0];
    }
    return Ps(be[D]);
  }, e.removeHooks = function(D) {
    be[D] = [];
  }, e.removeAllHooks = function() {
    be = Hs();
  }, e;
}
var zs = ea();
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
    t.innerHTML = zs.sanitize(i);
  }) : t.innerHTML = zs.sanitize(r), t;
}
class tc extends ji {
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
class nc extends ji {
  async prepare(e) {
    this.videoContainer = document.createElement("div"), this.videoContainer.classList.add("video-card"), this.root.appendChild(this.videoContainer), this.video = await e.getVideo(
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
  constructor(e) {
    this.subscriptions = [], this.target = e, this.boardCoordinateSystem = this.getCoordinateSystem();
    const t = () => {
      this.boardCoordinateSystem = this.getCoordinateSystem();
    };
    window.addEventListener("resize", t);
    let r = !1, i = 0;
    const o = 30, s = (a) => {
      r || (this.boardCoordinateSystem = this.getCoordinateSystem(), r = !0);
      let c;
      switch (a.type) {
        case "pointermove":
          if (a.timeStamp - i < 1e3 / o)
            return;
          c = "move", i = a.timeStamp;
          break;
        case "pointerdown":
          if (a.button !== 0)
            return;
          c = "down";
          break;
        case "pointerup":
          if (a.button !== 0)
            return;
          c = "up";
          break;
        default:
          return;
      }
      const { x: l, y: u } = this.boardCoordinateSystem.getBoardLocationFromPointerEvent(a), f = {
        sampleType: c,
        x: l,
        y: u,
        domTimestamp: a.timeStamp
      };
      this.subscriptions.forEach((d) => d(f));
    };
    this.target.addEventListener("pointermove", s), this.target.addEventListener("pointerdown", s), this.target.addEventListener("pointerup", s);
  }
  getCoordinateSystem() {
    return new ta(this.target);
  }
  subscribe(e) {
    return this.subscriptions.push(e), (() => {
      this.subscriptions = this.subscriptions.filter((t) => t !== e);
    });
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
class ic {
  constructor(e) {
    this.cardViews = /* @__PURE__ */ new Map(), this.sensorBindings = /* @__PURE__ */ new Map(), this.root = document.createElement("div"), this.root.className = "board-view", this.root.style.width = e.board_width_px + "px", this.root.style.height = e.board_height_px + "px", this.root.style.backgroundColor = e.background_color, this.setBoardState(!1, !1), this.pointerStream = new rc(this.root);
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
      default:
        throw new Error(`Unsupported Card type: ${e}`);
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
  prepareSensor(e, t) {
    let r = null;
    if (e.sensor_type === "TimeoutSensor")
      r = new Xa(
        t
      );
    else if (e.sensor_type === "KeySensor")
      r = new Ya(
        t,
        e.key
      );
    else if (e.sensor_type == "ClickSensor")
      r = new Wa(
        e.x,
        e.y,
        e.w,
        e.h,
        e.mask,
        t,
        this.pointerStream
      );
    else
      throw new Error(`Unknown Sensor provided: ${e}`);
    const i = crypto.randomUUID();
    return this.sensorBindings.set(i, r), i;
  }
  startSensor(e) {
    this.getSensorBinding(e).arm();
  }
  destroySensor(e) {
    const t = this.getSensorBinding(e);
    t && (t.destroy(), this.sensorBindings.delete(e));
  }
}
class sc {
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
class oc {
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
class ac {
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
class lc {
  constructor(e) {
    this.prepared = !1, this.started = !1, this.deferredSensorFiring = new ac(), this.boardView = new ic(e.board), this.node = e, this.scheduler = new sc();
  }
  async prepare(e) {
    for (const t of this.node.cards) {
      const r = await this.boardView.prepareCard(
        t,
        e
      );
      this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: t.start_msec,
          triggerFunc: () => {
            this.boardView.startCard(r);
          }
        }
      ), t.end_msec !== null && this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: t.end_msec,
          triggerFunc: () => {
            this.boardView.stopCard(r);
          }
        }
      ), this.scheduler.scheduleOnStop(
        () => {
          this.boardView.destroyCard(r);
        }
      );
    }
    for (let t = 0; t < this.node.sensors.length; t++) {
      const r = this.node.sensors[t], i = this.boardView.prepareSensor(
        r,
        (o, s) => this.deferredSensorFiring.resolve({
          sensorIndex: t,
          domTimestampAction: s,
          action: o
        })
      );
      this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: r.start_msec,
          triggerFunc: () => {
            this.boardView.startSensor(i);
          }
        }
      ), r.end_msec !== null && this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: r.end_msec,
          triggerFunc: () => {
            this.boardView.destroySensor(i);
          }
        }
      ), this.scheduler.scheduleOnStop(
        () => {
          this.boardView.destroySensor(i);
        }
      );
    }
    for (const t of this.node.effects) {
      const r = new oc(this.boardView);
      this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: t.start_msec,
          triggerFunc: () => {
            r.start();
          }
        }
      ), t.end_msec !== null && this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: t.end_msec,
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
    this.prepared = !0;
  }
  async run() {
    if (!this.prepared)
      throw new Error("NodePlay not prepared");
    if (this.started)
      throw new Error("NodePlay already started");
    this.boardView.setBoardState(!0, !0), this.started = !0;
    const e = performance.now();
    this.scheduler.start();
    const t = await this.deferredSensorFiring.promise;
    return this.scheduler.stop(), this.boardView.reset(), {
      sensorIndex: t.sensorIndex,
      action: t.action,
      domTimestampStart: e,
      domTimestampAction: t.domTimestampAction,
      domTimestampEnd: performance.now()
    };
  }
}
const Jn = "0.1.0";
var er = { exports: {} }, zr, qs;
function gr() {
  if (qs) return zr;
  qs = 1;
  const n = "2.0.0", e = 256, t = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
  9007199254740991, r = 16, i = e - 6;
  return zr = {
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
  }, zr;
}
var qr, Gs;
function mr() {
  return Gs || (Gs = 1, qr = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
  }), qr;
}
var js;
function In() {
  return js || (js = 1, (function(n, e) {
    const {
      MAX_SAFE_COMPONENT_LENGTH: t,
      MAX_SAFE_BUILD_LENGTH: r,
      MAX_LENGTH: i
    } = gr(), o = mr();
    e = n.exports = {};
    const s = e.re = [], a = e.safeRe = [], c = e.src = [], l = e.safeSrc = [], u = e.t = {};
    let f = 0;
    const d = "[a-zA-Z0-9-]", k = [
      ["\\s", 1],
      ["\\d", i],
      [d, r]
    ], C = ($) => {
      for (const [K, ie] of k)
        $ = $.split(`${K}*`).join(`${K}{0,${ie}}`).split(`${K}+`).join(`${K}{1,${ie}}`);
      return $;
    }, x = ($, K, ie) => {
      const F = C(K), J = f++;
      o($, J, K), u[$] = J, c[J] = K, l[J] = F, s[J] = new RegExp(K, ie ? "g" : void 0), a[J] = new RegExp(F, ie ? "g" : void 0);
    };
    x("NUMERICIDENTIFIER", "0|[1-9]\\d*"), x("NUMERICIDENTIFIERLOOSE", "\\d+"), x("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${d}*`), x("MAINVERSION", `(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})`), x("MAINVERSIONLOOSE", `(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})`), x("PRERELEASEIDENTIFIER", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIER]})`), x("PRERELEASEIDENTIFIERLOOSE", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIERLOOSE]})`), x("PRERELEASE", `(?:-(${c[u.PRERELEASEIDENTIFIER]}(?:\\.${c[u.PRERELEASEIDENTIFIER]})*))`), x("PRERELEASELOOSE", `(?:-?(${c[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[u.PRERELEASEIDENTIFIERLOOSE]})*))`), x("BUILDIDENTIFIER", `${d}+`), x("BUILD", `(?:\\+(${c[u.BUILDIDENTIFIER]}(?:\\.${c[u.BUILDIDENTIFIER]})*))`), x("FULLPLAIN", `v?${c[u.MAINVERSION]}${c[u.PRERELEASE]}?${c[u.BUILD]}?`), x("FULL", `^${c[u.FULLPLAIN]}$`), x("LOOSEPLAIN", `[v=\\s]*${c[u.MAINVERSIONLOOSE]}${c[u.PRERELEASELOOSE]}?${c[u.BUILD]}?`), x("LOOSE", `^${c[u.LOOSEPLAIN]}$`), x("GTLT", "((?:<|>)?=?)"), x("XRANGEIDENTIFIERLOOSE", `${c[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), x("XRANGEIDENTIFIER", `${c[u.NUMERICIDENTIFIER]}|x|X|\\*`), x("XRANGEPLAIN", `[v=\\s]*(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:${c[u.PRERELEASE]})?${c[u.BUILD]}?)?)?`), x("XRANGEPLAINLOOSE", `[v=\\s]*(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:${c[u.PRERELEASELOOSE]})?${c[u.BUILD]}?)?)?`), x("XRANGE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAIN]}$`), x("XRANGELOOSE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAINLOOSE]}$`), x("COERCEPLAIN", `(^|[^\\d])(\\d{1,${t}})(?:\\.(\\d{1,${t}}))?(?:\\.(\\d{1,${t}}))?`), x("COERCE", `${c[u.COERCEPLAIN]}(?:$|[^\\d])`), x("COERCEFULL", c[u.COERCEPLAIN] + `(?:${c[u.PRERELEASE]})?(?:${c[u.BUILD]})?(?:$|[^\\d])`), x("COERCERTL", c[u.COERCE], !0), x("COERCERTLFULL", c[u.COERCEFULL], !0), x("LONETILDE", "(?:~>?)"), x("TILDETRIM", `(\\s*)${c[u.LONETILDE]}\\s+`, !0), e.tildeTrimReplace = "$1~", x("TILDE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAIN]}$`), x("TILDELOOSE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAINLOOSE]}$`), x("LONECARET", "(?:\\^)"), x("CARETTRIM", `(\\s*)${c[u.LONECARET]}\\s+`, !0), e.caretTrimReplace = "$1^", x("CARET", `^${c[u.LONECARET]}${c[u.XRANGEPLAIN]}$`), x("CARETLOOSE", `^${c[u.LONECARET]}${c[u.XRANGEPLAINLOOSE]}$`), x("COMPARATORLOOSE", `^${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]})$|^$`), x("COMPARATOR", `^${c[u.GTLT]}\\s*(${c[u.FULLPLAIN]})$|^$`), x("COMPARATORTRIM", `(\\s*)${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]}|${c[u.XRANGEPLAIN]})`, !0), e.comparatorTrimReplace = "$1$2$3", x("HYPHENRANGE", `^\\s*(${c[u.XRANGEPLAIN]})\\s+-\\s+(${c[u.XRANGEPLAIN]})\\s*$`), x("HYPHENRANGELOOSE", `^\\s*(${c[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[u.XRANGEPLAINLOOSE]})\\s*$`), x("STAR", "(<|>)?=?\\s*\\*"), x("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), x("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  })(er, er.exports)), er.exports;
}
var Gr, Vs;
function ts() {
  if (Vs) return Gr;
  Vs = 1;
  const n = Object.freeze({ loose: !0 }), e = Object.freeze({});
  return Gr = (r) => r ? typeof r != "object" ? n : r : e, Gr;
}
var jr, Ws;
function na() {
  if (Ws) return jr;
  Ws = 1;
  const n = /^[0-9]+$/, e = (r, i) => {
    const o = n.test(r), s = n.test(i);
    return o && s && (r = +r, i = +i), r === i ? 0 : o && !s ? -1 : s && !o ? 1 : r < i ? -1 : 1;
  };
  return jr = {
    compareIdentifiers: e,
    rcompareIdentifiers: (r, i) => e(i, r)
  }, jr;
}
var Vr, Xs;
function Le() {
  if (Xs) return Vr;
  Xs = 1;
  const n = mr(), { MAX_LENGTH: e, MAX_SAFE_INTEGER: t } = gr(), { safeRe: r, t: i } = In(), o = ts(), { compareIdentifiers: s } = na();
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
      const f = l.trim().match(u.loose ? r[i.LOOSE] : r[i.FULL]);
      if (!f)
        throw new TypeError(`Invalid Version: ${l}`);
      if (this.raw = l, this.major = +f[1], this.minor = +f[2], this.patch = +f[3], this.major > t || this.major < 0)
        throw new TypeError("Invalid major version");
      if (this.minor > t || this.minor < 0)
        throw new TypeError("Invalid minor version");
      if (this.patch > t || this.patch < 0)
        throw new TypeError("Invalid patch version");
      f[4] ? this.prerelease = f[4].split(".").map((d) => {
        if (/^[0-9]+$/.test(d)) {
          const k = +d;
          if (k >= 0 && k < t)
            return k;
        }
        return d;
      }) : this.prerelease = [], this.build = f[5] ? f[5].split(".") : [], this.format();
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
        const f = this.prerelease[u], d = l.prerelease[u];
        if (n("prerelease compare", u, f, d), f === void 0 && d === void 0)
          return 0;
        if (d === void 0)
          return 1;
        if (f === void 0)
          return -1;
        if (f === d)
          continue;
        return s(f, d);
      } while (++u);
    }
    compareBuild(l) {
      l instanceof a || (l = new a(l, this.options));
      let u = 0;
      do {
        const f = this.build[u], d = l.build[u];
        if (n("build compare", u, f, d), f === void 0 && d === void 0)
          return 0;
        if (d === void 0)
          return 1;
        if (f === void 0)
          return -1;
        if (f === d)
          continue;
        return s(f, d);
      } while (++u);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(l, u, f) {
      if (l.startsWith("pre")) {
        if (!u && f === !1)
          throw new Error("invalid increment argument: identifier is empty");
        if (u) {
          const d = `-${u}`.match(this.options.loose ? r[i.PRERELEASELOOSE] : r[i.PRERELEASE]);
          if (!d || d[1] !== u)
            throw new Error(`invalid identifier: ${u}`);
        }
      }
      switch (l) {
        case "premajor":
          this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", u, f);
          break;
        case "preminor":
          this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", u, f);
          break;
        case "prepatch":
          this.prerelease.length = 0, this.inc("patch", u, f), this.inc("pre", u, f);
          break;
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case "prerelease":
          this.prerelease.length === 0 && this.inc("patch", u, f), this.inc("pre", u, f);
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
          const d = Number(f) ? 1 : 0;
          if (this.prerelease.length === 0)
            this.prerelease = [d];
          else {
            let k = this.prerelease.length;
            for (; --k >= 0; )
              typeof this.prerelease[k] == "number" && (this.prerelease[k]++, k = -2);
            if (k === -1) {
              if (u === this.prerelease.join(".") && f === !1)
                throw new Error("invalid increment argument: identifier already exists");
              this.prerelease.push(d);
            }
          }
          if (u) {
            let k = [u, d];
            f === !1 && (k = [u]), s(this.prerelease[0], u) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = k) : this.prerelease = k;
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${l}`);
      }
      return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
    }
  }
  return Vr = a, Vr;
}
var Wr, Ys;
function en() {
  if (Ys) return Wr;
  Ys = 1;
  const n = Le();
  return Wr = (t, r, i = !1) => {
    if (t instanceof n)
      return t;
    try {
      return new n(t, r);
    } catch (o) {
      if (!i)
        return null;
      throw o;
    }
  }, Wr;
}
var Xr, Ks;
function cc() {
  if (Ks) return Xr;
  Ks = 1;
  const n = en();
  return Xr = (t, r) => {
    const i = n(t, r);
    return i ? i.version : null;
  }, Xr;
}
var Yr, Zs;
function uc() {
  if (Zs) return Yr;
  Zs = 1;
  const n = en();
  return Yr = (t, r) => {
    const i = n(t.trim().replace(/^[=v]+/, ""), r);
    return i ? i.version : null;
  }, Yr;
}
var Kr, Qs;
function hc() {
  if (Qs) return Kr;
  Qs = 1;
  const n = Le();
  return Kr = (t, r, i, o, s) => {
    typeof i == "string" && (s = o, o = i, i = void 0);
    try {
      return new n(
        t instanceof n ? t.version : t,
        i
      ).inc(r, o, s).version;
    } catch {
      return null;
    }
  }, Kr;
}
var Zr, Js;
function pc() {
  if (Js) return Zr;
  Js = 1;
  const n = en();
  return Zr = (t, r) => {
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
    const d = u ? "pre" : "";
    return i.major !== o.major ? d + "major" : i.minor !== o.minor ? d + "minor" : i.patch !== o.patch ? d + "patch" : "prerelease";
  }, Zr;
}
var Qr, eo;
function fc() {
  if (eo) return Qr;
  eo = 1;
  const n = Le();
  return Qr = (t, r) => new n(t, r).major, Qr;
}
var Jr, to;
function dc() {
  if (to) return Jr;
  to = 1;
  const n = Le();
  return Jr = (t, r) => new n(t, r).minor, Jr;
}
var ei, no;
function gc() {
  if (no) return ei;
  no = 1;
  const n = Le();
  return ei = (t, r) => new n(t, r).patch, ei;
}
var ti, ro;
function mc() {
  if (ro) return ti;
  ro = 1;
  const n = en();
  return ti = (t, r) => {
    const i = n(t, r);
    return i && i.prerelease.length ? i.prerelease : null;
  }, ti;
}
var ni, io;
function Ke() {
  if (io) return ni;
  io = 1;
  const n = Le();
  return ni = (t, r, i) => new n(t, i).compare(new n(r, i)), ni;
}
var ri, so;
function wc() {
  if (so) return ri;
  so = 1;
  const n = Ke();
  return ri = (t, r, i) => n(r, t, i), ri;
}
var ii, oo;
function bc() {
  if (oo) return ii;
  oo = 1;
  const n = Ke();
  return ii = (t, r) => n(t, r, !0), ii;
}
var si, ao;
function ns() {
  if (ao) return si;
  ao = 1;
  const n = Le();
  return si = (t, r, i) => {
    const o = new n(t, i), s = new n(r, i);
    return o.compare(s) || o.compareBuild(s);
  }, si;
}
var oi, lo;
function Ec() {
  if (lo) return oi;
  lo = 1;
  const n = ns();
  return oi = (t, r) => t.sort((i, o) => n(i, o, r)), oi;
}
var ai, co;
function vc() {
  if (co) return ai;
  co = 1;
  const n = ns();
  return ai = (t, r) => t.sort((i, o) => n(o, i, r)), ai;
}
var li, uo;
function wr() {
  if (uo) return li;
  uo = 1;
  const n = Ke();
  return li = (t, r, i) => n(t, r, i) > 0, li;
}
var ci, ho;
function rs() {
  if (ho) return ci;
  ho = 1;
  const n = Ke();
  return ci = (t, r, i) => n(t, r, i) < 0, ci;
}
var ui, po;
function ra() {
  if (po) return ui;
  po = 1;
  const n = Ke();
  return ui = (t, r, i) => n(t, r, i) === 0, ui;
}
var hi, fo;
function ia() {
  if (fo) return hi;
  fo = 1;
  const n = Ke();
  return hi = (t, r, i) => n(t, r, i) !== 0, hi;
}
var pi, go;
function is() {
  if (go) return pi;
  go = 1;
  const n = Ke();
  return pi = (t, r, i) => n(t, r, i) >= 0, pi;
}
var fi, mo;
function ss() {
  if (mo) return fi;
  mo = 1;
  const n = Ke();
  return fi = (t, r, i) => n(t, r, i) <= 0, fi;
}
var di, wo;
function sa() {
  if (wo) return di;
  wo = 1;
  const n = ra(), e = ia(), t = wr(), r = is(), i = rs(), o = ss();
  return di = (a, c, l, u) => {
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
  }, di;
}
var gi, bo;
function xc() {
  if (bo) return gi;
  bo = 1;
  const n = Le(), e = en(), { safeRe: t, t: r } = In();
  return gi = (o, s) => {
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
    const c = a[2], l = a[3] || "0", u = a[4] || "0", f = s.includePrerelease && a[5] ? `-${a[5]}` : "", d = s.includePrerelease && a[6] ? `+${a[6]}` : "";
    return e(`${c}.${l}.${u}${f}${d}`, s);
  }, gi;
}
var mi, Eo;
function yc() {
  if (Eo) return mi;
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
  return mi = n, mi;
}
var wi, vo;
function Ze() {
  if (vo) return wi;
  vo = 1;
  const n = /\s+/g;
  class e {
    constructor(S, H) {
      if (H = i(H), S instanceof e)
        return S.loose === !!H.loose && S.includePrerelease === !!H.includePrerelease ? S : new e(S.raw, H);
      if (S instanceof o)
        return this.raw = S.value, this.set = [[S]], this.formatted = void 0, this;
      if (this.options = H, this.loose = !!H.loose, this.includePrerelease = !!H.includePrerelease, this.raw = S.trim().replace(n, " "), this.set = this.raw.split("||").map((N) => this.parseRange(N.trim())).filter((N) => N.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const N = this.set[0];
        if (this.set = this.set.filter((M) => !x(M[0])), this.set.length === 0)
          this.set = [N];
        else if (this.set.length > 1) {
          for (const M of this.set)
            if (M.length === 1 && $(M[0])) {
              this.set = [M];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let S = 0; S < this.set.length; S++) {
          S > 0 && (this.formatted += "||");
          const H = this.set[S];
          for (let N = 0; N < H.length; N++)
            N > 0 && (this.formatted += " "), this.formatted += H[N].toString().trim();
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
    parseRange(S) {
      const N = ((this.options.includePrerelease && k) | (this.options.loose && C)) + ":" + S, M = r.get(N);
      if (M)
        return M;
      const P = this.options.loose, j = P ? c[l.HYPHENRANGELOOSE] : c[l.HYPHENRANGE];
      S = S.replace(j, st(this.options.includePrerelease)), s("hyphen replace", S), S = S.replace(c[l.COMPARATORTRIM], u), s("comparator trim", S), S = S.replace(c[l.TILDETRIM], f), s("tilde trim", S), S = S.replace(c[l.CARETTRIM], d), s("caret trim", S);
      let z = S.split(" ").map((X) => ie(X, this.options)).join(" ").split(/\s+/).map((X) => be(X, this.options));
      P && (z = z.filter((X) => (s("loose invalid filter", X, this.options), !!X.match(c[l.COMPARATORLOOSE])))), s("range list", z);
      const Z = /* @__PURE__ */ new Map(), W = z.map((X) => new o(X, this.options));
      for (const X of W) {
        if (x(X))
          return [X];
        Z.set(X.value, X);
      }
      Z.size > 1 && Z.has("") && Z.delete("");
      const ve = [...Z.values()];
      return r.set(N, ve), ve;
    }
    intersects(S, H) {
      if (!(S instanceof e))
        throw new TypeError("a Range is required");
      return this.set.some((N) => K(N, H) && S.set.some((M) => K(M, H) && N.every((P) => M.every((j) => P.intersects(j, H)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(S) {
      if (!S)
        return !1;
      if (typeof S == "string")
        try {
          S = new a(S, this.options);
        } catch {
          return !1;
        }
      for (let H = 0; H < this.set.length; H++)
        if (ot(this.set[H], S, this.options))
          return !0;
      return !1;
    }
  }
  wi = e;
  const t = yc(), r = new t(), i = ts(), o = br(), s = mr(), a = Le(), {
    safeRe: c,
    t: l,
    comparatorTrimReplace: u,
    tildeTrimReplace: f,
    caretTrimReplace: d
  } = In(), { FLAG_INCLUDE_PRERELEASE: k, FLAG_LOOSE: C } = gr(), x = (T) => T.value === "<0.0.0-0", $ = (T) => T.value === "", K = (T, S) => {
    let H = !0;
    const N = T.slice();
    let M = N.pop();
    for (; H && N.length; )
      H = N.every((P) => M.intersects(P, S)), M = N.pop();
    return H;
  }, ie = (T, S) => (s("comp", T, S), T = re(T, S), s("caret", T), T = J(T, S), s("tildes", T), T = q(T, S), s("xrange", T), T = He(T, S), s("stars", T), T), F = (T) => !T || T.toLowerCase() === "x" || T === "*", J = (T, S) => T.trim().split(/\s+/).map((H) => se(H, S)).join(" "), se = (T, S) => {
    const H = S.loose ? c[l.TILDELOOSE] : c[l.TILDE];
    return T.replace(H, (N, M, P, j, z) => {
      s("tilde", T, N, M, P, j, z);
      let Z;
      return F(M) ? Z = "" : F(P) ? Z = `>=${M}.0.0 <${+M + 1}.0.0-0` : F(j) ? Z = `>=${M}.${P}.0 <${M}.${+P + 1}.0-0` : z ? (s("replaceTilde pr", z), Z = `>=${M}.${P}.${j}-${z} <${M}.${+P + 1}.0-0`) : Z = `>=${M}.${P}.${j} <${M}.${+P + 1}.0-0`, s("tilde return", Z), Z;
    });
  }, re = (T, S) => T.trim().split(/\s+/).map((H) => oe(H, S)).join(" "), oe = (T, S) => {
    s("caret", T, S);
    const H = S.loose ? c[l.CARETLOOSE] : c[l.CARET], N = S.includePrerelease ? "-0" : "";
    return T.replace(H, (M, P, j, z, Z) => {
      s("caret", T, M, P, j, z, Z);
      let W;
      return F(P) ? W = "" : F(j) ? W = `>=${P}.0.0${N} <${+P + 1}.0.0-0` : F(z) ? P === "0" ? W = `>=${P}.${j}.0${N} <${P}.${+j + 1}.0-0` : W = `>=${P}.${j}.0${N} <${+P + 1}.0.0-0` : Z ? (s("replaceCaret pr", Z), P === "0" ? j === "0" ? W = `>=${P}.${j}.${z}-${Z} <${P}.${j}.${+z + 1}-0` : W = `>=${P}.${j}.${z}-${Z} <${P}.${+j + 1}.0-0` : W = `>=${P}.${j}.${z}-${Z} <${+P + 1}.0.0-0`) : (s("no pr"), P === "0" ? j === "0" ? W = `>=${P}.${j}.${z}${N} <${P}.${j}.${+z + 1}-0` : W = `>=${P}.${j}.${z}${N} <${P}.${+j + 1}.0-0` : W = `>=${P}.${j}.${z} <${+P + 1}.0.0-0`), s("caret return", W), W;
    });
  }, q = (T, S) => (s("replaceXRanges", T, S), T.split(/\s+/).map((H) => $e(H, S)).join(" ")), $e = (T, S) => {
    T = T.trim();
    const H = S.loose ? c[l.XRANGELOOSE] : c[l.XRANGE];
    return T.replace(H, (N, M, P, j, z, Z) => {
      s("xRange", T, N, M, P, j, z, Z);
      const W = F(P), ve = W || F(j), X = ve || F(z), Me = X;
      return M === "=" && Me && (M = ""), Z = S.includePrerelease ? "-0" : "", W ? M === ">" || M === "<" ? N = "<0.0.0-0" : N = "*" : M && Me ? (ve && (j = 0), z = 0, M === ">" ? (M = ">=", ve ? (P = +P + 1, j = 0, z = 0) : (j = +j + 1, z = 0)) : M === "<=" && (M = "<", ve ? P = +P + 1 : j = +j + 1), M === "<" && (Z = "-0"), N = `${M + P}.${j}.${z}${Z}`) : ve ? N = `>=${P}.0.0${Z} <${+P + 1}.0.0-0` : X && (N = `>=${P}.${j}.0${Z} <${P}.${+j + 1}.0-0`), s("xRange return", N), N;
    });
  }, He = (T, S) => (s("replaceStars", T, S), T.trim().replace(c[l.STAR], "")), be = (T, S) => (s("replaceGTE0", T, S), T.trim().replace(c[S.includePrerelease ? l.GTE0PRE : l.GTE0], "")), st = (T) => (S, H, N, M, P, j, z, Z, W, ve, X, Me) => (F(N) ? H = "" : F(M) ? H = `>=${N}.0.0${T ? "-0" : ""}` : F(P) ? H = `>=${N}.${M}.0${T ? "-0" : ""}` : j ? H = `>=${H}` : H = `>=${H}${T ? "-0" : ""}`, F(W) ? Z = "" : F(ve) ? Z = `<${+W + 1}.0.0-0` : F(X) ? Z = `<${W}.${+ve + 1}.0-0` : Me ? Z = `<=${W}.${ve}.${X}-${Me}` : T ? Z = `<${W}.${ve}.${+X + 1}-0` : Z = `<=${Z}`, `${H} ${Z}`.trim()), ot = (T, S, H) => {
    for (let N = 0; N < T.length; N++)
      if (!T[N].test(S))
        return !1;
    if (S.prerelease.length && !H.includePrerelease) {
      for (let N = 0; N < T.length; N++)
        if (s(T[N].semver), T[N].semver !== o.ANY && T[N].semver.prerelease.length > 0) {
          const M = T[N].semver;
          if (M.major === S.major && M.minor === S.minor && M.patch === S.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return wi;
}
var bi, xo;
function br() {
  if (xo) return bi;
  xo = 1;
  const n = Symbol("SemVer ANY");
  class e {
    static get ANY() {
      return n;
    }
    constructor(u, f) {
      if (f = t(f), u instanceof e) {
        if (u.loose === !!f.loose)
          return u;
        u = u.value;
      }
      u = u.trim().split(/\s+/).join(" "), s("comparator", u, f), this.options = f, this.loose = !!f.loose, this.parse(u), this.semver === n ? this.value = "" : this.value = this.operator + this.semver.version, s("comp", this);
    }
    parse(u) {
      const f = this.options.loose ? r[i.COMPARATORLOOSE] : r[i.COMPARATOR], d = u.match(f);
      if (!d)
        throw new TypeError(`Invalid comparator: ${u}`);
      this.operator = d[1] !== void 0 ? d[1] : "", this.operator === "=" && (this.operator = ""), d[2] ? this.semver = new a(d[2], this.options.loose) : this.semver = n;
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
    intersects(u, f) {
      if (!(u instanceof e))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(u.value, f).test(this.value) : u.operator === "" ? u.value === "" ? !0 : new c(this.value, f).test(u.semver) : (f = t(f), f.includePrerelease && (this.value === "<0.0.0-0" || u.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || u.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && u.operator.startsWith(">") || this.operator.startsWith("<") && u.operator.startsWith("<") || this.semver.version === u.semver.version && this.operator.includes("=") && u.operator.includes("=") || o(this.semver, "<", u.semver, f) && this.operator.startsWith(">") && u.operator.startsWith("<") || o(this.semver, ">", u.semver, f) && this.operator.startsWith("<") && u.operator.startsWith(">")));
    }
  }
  bi = e;
  const t = ts(), { safeRe: r, t: i } = In(), o = sa(), s = mr(), a = Le(), c = Ze();
  return bi;
}
var Ei, yo;
function Er() {
  if (yo) return Ei;
  yo = 1;
  const n = Ze();
  return Ei = (t, r, i) => {
    try {
      r = new n(r, i);
    } catch {
      return !1;
    }
    return r.test(t);
  }, Ei;
}
var vi, ko;
function kc() {
  if (ko) return vi;
  ko = 1;
  const n = Ze();
  return vi = (t, r) => new n(t, r).set.map((i) => i.map((o) => o.value).join(" ").trim().split(" ")), vi;
}
var xi, Ro;
function Rc() {
  if (Ro) return xi;
  Ro = 1;
  const n = Le(), e = Ze();
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
var yi, _o;
function _c() {
  if (_o) return yi;
  _o = 1;
  const n = Le(), e = Ze();
  return yi = (r, i, o) => {
    let s = null, a = null, c = null;
    try {
      c = new e(i, o);
    } catch {
      return null;
    }
    return r.forEach((l) => {
      c.test(l) && (!s || a.compare(l) === 1) && (s = l, a = new n(s, o));
    }), s;
  }, yi;
}
var ki, So;
function Sc() {
  if (So) return ki;
  So = 1;
  const n = Le(), e = Ze(), t = wr();
  return ki = (i, o) => {
    i = new e(i, o);
    let s = new n("0.0.0");
    if (i.test(s) || (s = new n("0.0.0-0"), i.test(s)))
      return s;
    s = null;
    for (let a = 0; a < i.set.length; ++a) {
      const c = i.set[a];
      let l = null;
      c.forEach((u) => {
        const f = new n(u.semver.version);
        switch (u.operator) {
          case ">":
            f.prerelease.length === 0 ? f.patch++ : f.prerelease.push(0), f.raw = f.format();
          /* fallthrough */
          case "":
          case ">=":
            (!l || t(f, l)) && (l = f);
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
  }, ki;
}
var Ri, To;
function Tc() {
  if (To) return Ri;
  To = 1;
  const n = Ze();
  return Ri = (t, r) => {
    try {
      return new n(t, r).range || "*";
    } catch {
      return null;
    }
  }, Ri;
}
var _i, Ao;
function os() {
  if (Ao) return _i;
  Ao = 1;
  const n = Le(), e = br(), { ANY: t } = e, r = Ze(), i = Er(), o = wr(), s = rs(), a = ss(), c = is();
  return _i = (u, f, d, k) => {
    u = new n(u, k), f = new r(f, k);
    let C, x, $, K, ie;
    switch (d) {
      case ">":
        C = o, x = a, $ = s, K = ">", ie = ">=";
        break;
      case "<":
        C = s, x = c, $ = o, K = "<", ie = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (i(u, f, k))
      return !1;
    for (let F = 0; F < f.set.length; ++F) {
      const J = f.set[F];
      let se = null, re = null;
      if (J.forEach((oe) => {
        oe.semver === t && (oe = new e(">=0.0.0")), se = se || oe, re = re || oe, C(oe.semver, se.semver, k) ? se = oe : $(oe.semver, re.semver, k) && (re = oe);
      }), se.operator === K || se.operator === ie || (!re.operator || re.operator === K) && x(u, re.semver))
        return !1;
      if (re.operator === ie && $(u, re.semver))
        return !1;
    }
    return !0;
  }, _i;
}
var Si, Co;
function Ac() {
  if (Co) return Si;
  Co = 1;
  const n = os();
  return Si = (t, r, i) => n(t, r, ">", i), Si;
}
var Ti, Oo;
function Cc() {
  if (Oo) return Ti;
  Oo = 1;
  const n = os();
  return Ti = (t, r, i) => n(t, r, "<", i), Ti;
}
var Ai, Lo;
function Oc() {
  if (Lo) return Ai;
  Lo = 1;
  const n = Ze();
  return Ai = (t, r, i) => (t = new n(t, i), r = new n(r, i), t.intersects(r, i)), Ai;
}
var Ci, Io;
function Lc() {
  if (Io) return Ci;
  Io = 1;
  const n = Er(), e = Ke();
  return Ci = (t, r, i) => {
    const o = [];
    let s = null, a = null;
    const c = t.sort((d, k) => e(d, k, i));
    for (const d of c)
      n(d, r, i) ? (a = d, s || (s = d)) : (a && o.push([s, a]), a = null, s = null);
    s && o.push([s, null]);
    const l = [];
    for (const [d, k] of o)
      d === k ? l.push(d) : !k && d === c[0] ? l.push("*") : k ? d === c[0] ? l.push(`<=${k}`) : l.push(`${d} - ${k}`) : l.push(`>=${d}`);
    const u = l.join(" || "), f = typeof r.raw == "string" ? r.raw : String(r);
    return u.length < f.length ? u : r;
  }, Ci;
}
var Oi, No;
function Ic() {
  if (No) return Oi;
  No = 1;
  const n = Ze(), e = br(), { ANY: t } = e, r = Er(), i = Ke(), o = (f, d, k = {}) => {
    if (f === d)
      return !0;
    f = new n(f, k), d = new n(d, k);
    let C = !1;
    e: for (const x of f.set) {
      for (const $ of d.set) {
        const K = c(x, $, k);
        if (C = C || K !== null, K)
          continue e;
      }
      if (C)
        return !1;
    }
    return !0;
  }, s = [new e(">=0.0.0-0")], a = [new e(">=0.0.0")], c = (f, d, k) => {
    if (f === d)
      return !0;
    if (f.length === 1 && f[0].semver === t) {
      if (d.length === 1 && d[0].semver === t)
        return !0;
      k.includePrerelease ? f = s : f = a;
    }
    if (d.length === 1 && d[0].semver === t) {
      if (k.includePrerelease)
        return !0;
      d = a;
    }
    const C = /* @__PURE__ */ new Set();
    let x, $;
    for (const q of f)
      q.operator === ">" || q.operator === ">=" ? x = l(x, q, k) : q.operator === "<" || q.operator === "<=" ? $ = u($, q, k) : C.add(q.semver);
    if (C.size > 1)
      return null;
    let K;
    if (x && $) {
      if (K = i(x.semver, $.semver, k), K > 0)
        return null;
      if (K === 0 && (x.operator !== ">=" || $.operator !== "<="))
        return null;
    }
    for (const q of C) {
      if (x && !r(q, String(x), k) || $ && !r(q, String($), k))
        return null;
      for (const $e of d)
        if (!r(q, String($e), k))
          return !1;
      return !0;
    }
    let ie, F, J, se, re = $ && !k.includePrerelease && $.semver.prerelease.length ? $.semver : !1, oe = x && !k.includePrerelease && x.semver.prerelease.length ? x.semver : !1;
    re && re.prerelease.length === 1 && $.operator === "<" && re.prerelease[0] === 0 && (re = !1);
    for (const q of d) {
      if (se = se || q.operator === ">" || q.operator === ">=", J = J || q.operator === "<" || q.operator === "<=", x) {
        if (oe && q.semver.prerelease && q.semver.prerelease.length && q.semver.major === oe.major && q.semver.minor === oe.minor && q.semver.patch === oe.patch && (oe = !1), q.operator === ">" || q.operator === ">=") {
          if (ie = l(x, q, k), ie === q && ie !== x)
            return !1;
        } else if (x.operator === ">=" && !r(x.semver, String(q), k))
          return !1;
      }
      if ($) {
        if (re && q.semver.prerelease && q.semver.prerelease.length && q.semver.major === re.major && q.semver.minor === re.minor && q.semver.patch === re.patch && (re = !1), q.operator === "<" || q.operator === "<=") {
          if (F = u($, q, k), F === q && F !== $)
            return !1;
        } else if ($.operator === "<=" && !r($.semver, String(q), k))
          return !1;
      }
      if (!q.operator && ($ || x) && K !== 0)
        return !1;
    }
    return !(x && J && !$ && K !== 0 || $ && se && !x && K !== 0 || oe || re);
  }, l = (f, d, k) => {
    if (!f)
      return d;
    const C = i(f.semver, d.semver, k);
    return C > 0 ? f : C < 0 || d.operator === ">" && f.operator === ">=" ? d : f;
  }, u = (f, d, k) => {
    if (!f)
      return d;
    const C = i(f.semver, d.semver, k);
    return C < 0 ? f : C > 0 || d.operator === "<" && f.operator === "<=" ? d : f;
  };
  return Oi = o, Oi;
}
var Li, Po;
function Nc() {
  if (Po) return Li;
  Po = 1;
  const n = In(), e = gr(), t = Le(), r = na(), i = en(), o = cc(), s = uc(), a = hc(), c = pc(), l = fc(), u = dc(), f = gc(), d = mc(), k = Ke(), C = wc(), x = bc(), $ = ns(), K = Ec(), ie = vc(), F = wr(), J = rs(), se = ra(), re = ia(), oe = is(), q = ss(), $e = sa(), He = xc(), be = br(), st = Ze(), ot = Er(), T = kc(), S = Rc(), H = _c(), N = Sc(), M = Tc(), P = os(), j = Ac(), z = Cc(), Z = Oc(), W = Lc(), ve = Ic();
  return Li = {
    parse: i,
    valid: o,
    clean: s,
    inc: a,
    diff: c,
    major: l,
    minor: u,
    patch: f,
    prerelease: d,
    compare: k,
    rcompare: C,
    compareLoose: x,
    compareBuild: $,
    sort: K,
    rsort: ie,
    gt: F,
    lt: J,
    eq: se,
    neq: re,
    gte: oe,
    lte: q,
    cmp: $e,
    coerce: He,
    Comparator: be,
    Range: st,
    satisfies: ot,
    toComparators: T,
    maxSatisfying: S,
    minSatisfying: H,
    minVersion: N,
    validRange: M,
    outside: P,
    gtr: j,
    ltr: z,
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
  }, Li;
}
var Ii = Nc();
async function $c(n, e, t = null, r = []) {
  t || (t = (F) => {
  });
  const i = new Pc(r, t), o = Aa(), s = new ja();
  o.appendChild(s.root);
  const a = Va();
  if (o.appendChild(a), Ii.gt(n.nodekit_version, Jn) || Ii.major(n.nodekit_version) !== Ii.major(Jn))
    throw new Error(`Incompatible NodeKit version. Timeline version: ${n.nodekit_version}, NodeKit version: ${Jn}`);
  if (!Ta()) {
    const F = new Error("Unsupported device for NodeKit. Please use a desktop browser.");
    throw s.showErrorOverlay(F), F;
  }
  s.showSessionConnectingOverlay();
  const c = new Ca();
  for (const F of e)
    c.registerAsset(F);
  s.hideSessionConnectingOverlay();
  const l = new fa();
  await s.playStartScreen(), l.start();
  const u = {
    event_type: "StartEvent",
    t: 0
  };
  i.push(u);
  function f() {
    if (document.visibilityState === "hidden") {
      const F = {
        event_type: "LeaveEvent",
        t: l.now()
      };
      i.push(F);
    } else if (document.visibilityState === "visible") {
      const F = {
        event_type: "ReturnEvent",
        t: l.now()
      };
      i.push(F);
    }
  }
  document.addEventListener("visibilitychange", f);
  const d = da(), k = {
    event_type: "BrowserContextEvent",
    t: l.now(),
    user_agent: d.userAgent,
    viewport_width_px: d.viewportWidthPx,
    viewport_height_px: d.viewportHeightPx,
    display_width_px: d.displayWidthPx,
    display_height_px: d.displayHeightPx
  };
  i.push(k);
  const C = n.nodes, x = n.transitions;
  let $ = "END";
  for (let F of x)
    if (F.node_index === "START") {
      $ = F.next_node_index;
      break;
    }
  for (; $ !== "END"; ) {
    const F = C[$], J = new lc(
      F
    );
    a.appendChild(J.boardView.root), await J.prepare(c);
    let se = await J.run();
    const re = {
      event_type: "NodeStartEvent",
      t: l.convertDomTimestampToClockTime(se.domTimestampStart),
      node_index: $
    };
    i.push(re);
    const oe = {
      event_type: "ActionEvent",
      t: l.convertDomTimestampToClockTime(se.domTimestampAction),
      node_index: $,
      sensor_index: se.sensorIndex,
      action: se.action
    };
    i.push(oe);
    const q = {
      event_type: "NodeEndEvent",
      t: l.convertDomTimestampToClockTime(se.domTimestampEnd),
      node_index: $
    };
    for (i.push(q); a.firstChild; )
      a.removeChild(a.firstChild);
    let $e = "END";
    for (let He of x)
      if (He.node_index === $ && He.sensor_index === se.sensorIndex) {
        $e = He.next_node_index;
        break;
      }
    $ = $e;
  }
  await s.playEndScreen();
  const K = {
    event_type: "EndEvent",
    t: l.now()
  };
  i.push(K), document.removeEventListener("visibilitychange", f);
  const ie = {
    nodekit_version: Jn,
    events: i.events
  };
  return s.showConsoleMessageOverlay(
    "Trace",
    ie
  ), ie;
}
class Pc {
  constructor(e, t) {
    this.onEventCallback = t, this.events = e;
  }
  push(e) {
    this.events.push(e), this.onEventCallback(e);
  }
}
export {
  $c as play
};
