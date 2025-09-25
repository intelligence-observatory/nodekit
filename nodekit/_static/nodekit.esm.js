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
var ga = "2.0.4", Ni = 500, ps = "user-agent", Kt = "", fs = "?", ir = "function", _t = "undefined", Zt = "object", Pi = "string", Ie = "browser", ut = "cpu", rt = "device", We = "engine", He = "os", Xt = "result", y = "name", m = "type", E = "vendor", x = "version", Ne = "architecture", On = "major", w = "model", Tn = "console", Z = "mobile", he = "tablet", ye = "smarttv", et = "wearable", Vn = "xr", An = "embedded", fn = "inapp", zi = "brands", $t = "formFactors", qi = "fullVersionList", Yt = "platform", Gi = "platformVersion", ur = "bitness", Tt = "sec-ch-ua", ma = Tt + "-full-version-list", wa = Tt + "-arch", ba = Tt + "-" + ur, Ea = Tt + "-form-factors", va = Tt + "-" + Z, ya = Tt + "-" + w, $o = Tt + "-" + Yt, xa = $o + "-version", Mo = [zi, qi, Z, w, Yt, Gi, Ne, $t, ur], Wn = "Amazon", Vt = "Apple", ds = "ASUS", gs = "BlackBerry", Pt = "Google", ms = "Huawei", Sr = "Lenovo", ws = "Honor", Xn = "LG", _r = "Microsoft", Tr = "Motorola", Ar = "Nvidia", bs = "OnePlus", Cr = "OPPO", dn = "Samsung", Es = "Sharp", gn = "Sony", Or = "Xiaomi", Lr = "Zebra", vs = "Chrome", ys = "Chromium", Rt = "Chromecast", tr = "Edge", mn = "Firefox", wn = "Opera", Ir = "Facebook", xs = "Sogou", Wt = "Mobile ", bn = " Browser", $i = "Windows", ka = typeof window !== _t, Pe = ka && window.navigator ? window.navigator : void 0, St = Pe && Pe.userAgentData ? Pe.userAgentData : void 0, Ra = function(n, e) {
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
      if (ht(e) == ht(n[t])) return !0;
    return !1;
  }
  return Jt(n) ? ht(e) == ht(n) : !1;
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
}, ht = function(n) {
  return Jt(n) ? n.toLowerCase() : n;
}, Pr = function(n) {
  return Jt(n) ? Qt(/[^\d\.]/g, n).split(".")[0] : void 0;
}, pt = function(n) {
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
    return n = Qt(/^\s\s*/, n), typeof e === _t ? n : n.substring(0, Ni);
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
}, nt = function(n, e) {
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
}, Sa = {
  Chrome: "Google Chrome",
  Edge: "Microsoft Edge",
  "Edge WebView2": "Microsoft Edge WebView2",
  "Chrome WebView": "Android WebView",
  "Chrome Headless": "HeadlessChrome",
  "Huawei Browser": "HuaweiBrowser",
  "MIUI Browser": "Miui Browser",
  "Opera Mobi": "OperaMobile",
  Yandex: "YaBrowser"
}, Ss = {
  browser: [
    [
      // Most common regardless engine
      /\b(?:crmo|crios)\/([\w\.]+)/i
      // Chrome for Android/iOS
    ],
    [x, [y, Wt + "Chrome"]],
    [
      /webview.+edge\/([\w\.]+)/i
      // Microsoft Edge
    ],
    [x, [y, tr + " WebView"]],
    [
      /edg(?:e|ios|a)?\/([\w\.]+)/i
    ],
    [x, [y, "Edge"]],
    [
      // Presto based
      /(opera mini)\/([-\w\.]+)/i,
      // Opera Mini
      /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
      // Opera Mobi/Tablet
      /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i
      // Opera
    ],
    [y, x],
    [
      /opios[\/ ]+([\w\.]+)/i
      // Opera mini on iphone >= 8.0
    ],
    [x, [y, wn + " Mini"]],
    [
      /\bop(?:rg)?x\/([\w\.]+)/i
      // Opera GX
    ],
    [x, [y, wn + " GX"]],
    [
      /\bopr\/([\w\.]+)/i
      // Opera Webkit
    ],
    [x, [y, wn]],
    [
      // Mixed
      /\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i
      // Baidu
    ],
    [x, [y, "Baidu"]],
    [
      /\b(?:mxbrowser|mxios|myie2)\/?([-\w\.]*)\b/i
      // Maxthon
    ],
    [x, [y, "Maxthon"]],
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
    [y, x],
    [
      /quark(?:pc)?\/([-\w\.]+)/i
      // Quark
    ],
    [x, [y, "Quark"]],
    [
      /\bddg\/([\w\.]+)/i
      // DuckDuckGo
    ],
    [x, [y, "DuckDuckGo"]],
    [
      /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i
      // UCBrowser
    ],
    [x, [y, "UCBrowser"]],
    [
      /microm.+\bqbcore\/([\w\.]+)/i,
      // WeChat Desktop for Windows Built-in Browser
      /\bqbcore\/([\w\.]+).+microm/i,
      /micromessenger\/([\w\.]+)/i
      // WeChat
    ],
    [x, [y, "WeChat"]],
    [
      /konqueror\/([\w\.]+)/i
      // Konqueror
    ],
    [x, [y, "Konqueror"]],
    [
      /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i
      // IE11
    ],
    [x, [y, "IE"]],
    [
      /ya(?:search)?browser\/([\w\.]+)/i
      // Yandex
    ],
    [x, [y, "Yandex"]],
    [
      /slbrowser\/([\w\.]+)/i
      // Smart Lenovo Browser
    ],
    [x, [y, "Smart " + Sr + bn]],
    [
      /(avast|avg)\/([\w\.]+)/i
      // Avast/AVG Secure Browser
    ],
    [[y, /(.+)/, "$1 Secure" + bn], x],
    [
      /\bfocus\/([\w\.]+)/i
      // Firefox Focus
    ],
    [x, [y, mn + " Focus"]],
    [
      /\bopt\/([\w\.]+)/i
      // Opera Touch
    ],
    [x, [y, wn + " Touch"]],
    [
      /coc_coc\w+\/([\w\.]+)/i
      // Coc Coc Browser
    ],
    [x, [y, "Coc Coc"]],
    [
      /dolfin\/([\w\.]+)/i
      // Dolphin
    ],
    [x, [y, "Dolphin"]],
    [
      /coast\/([\w\.]+)/i
      // Opera Coast
    ],
    [x, [y, wn + " Coast"]],
    [
      /miuibrowser\/([\w\.]+)/i
      // MIUI Browser
    ],
    [x, [y, "MIUI" + bn]],
    [
      /fxios\/([\w\.-]+)/i
      // Firefox for iOS
    ],
    [x, [y, Wt + mn]],
    [
      /\bqihoobrowser\/?([\w\.]*)/i
      // 360
    ],
    [x, [y, "360"]],
    [
      /\b(qq)\/([\w\.]+)/i
      // QQ
    ],
    [[y, /(.+)/, "$1Browser"], x],
    [
      /(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i
    ],
    [[y, /(.+)/, "$1" + bn], x],
    [
      // Oculus/Sailfish/HuaweiBrowser/VivoBrowser/PicoBrowser
      /samsungbrowser\/([\w\.]+)/i
      // Samsung Internet
    ],
    [x, [y, dn + " Internet"]],
    [
      /metasr[\/ ]?([\d\.]+)/i
      // Sogou Explorer
    ],
    [x, [y, xs + " Explorer"]],
    [
      /(sogou)mo\w+\/([\d\.]+)/i
      // Sogou Mobile
    ],
    [[y, xs + " Mobile"], x],
    [
      /(electron)\/([\w\.]+) safari/i,
      // Electron-based App
      /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
      // Tesla
      /m?(qqbrowser|2345(?=browser|chrome|explorer))\w*[\/ ]?v?([\w\.]+)/i
      // QQ/2345
    ],
    [y, x],
    [
      /(lbbrowser|rekonq)/i
      // LieBao Browser/Rekonq
    ],
    [y],
    [
      /ome\/([\w\.]+) \w* ?(iron) saf/i,
      // Iron
      /ome\/([\w\.]+).+qihu (360)[es]e/i
      // 360
    ],
    [x, y],
    [
      // WebView
      /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i
      // Facebook App for iOS & Android
    ],
    [[y, Ir], x, [m, fn]],
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
    [y, x, [m, fn]],
    [
      /\bgsa\/([\w\.]+) .*safari\//i
      // Google Search Appliance on iOS
    ],
    [x, [y, "GSA"], [m, fn]],
    [
      /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i
      // TikTok
    ],
    [x, [y, "TikTok"], [m, fn]],
    [
      /\[(linkedin)app\]/i
      // LinkedIn App for iOS & Android
    ],
    [y, [m, fn]],
    [
      /(chromium)[\/ ]([-\w\.]+)/i
      // Chromium
    ],
    [y, x],
    [
      /headlesschrome(?:\/([\w\.]+)| )/i
      // Chrome Headless
    ],
    [x, [y, vs + " Headless"]],
    [
      /wv\).+chrome\/([\w\.]+).+edgw\//i
      // Edge WebView2
    ],
    [x, [y, tr + " WebView2"]],
    [
      / wv\).+(chrome)\/([\w\.]+)/i
      // Chrome WebView
    ],
    [[y, vs + " WebView"], x],
    [
      /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
      // Android Browser
    ],
    [x, [y, "Android" + bn]],
    [
      /chrome\/([\w\.]+) mobile/i
      // Chrome Mobile
    ],
    [x, [y, Wt + "Chrome"]],
    [
      /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
      // Chrome/OmniWeb/Arora/Tizen/Nokia
    ],
    [y, x],
    [
      /version\/([\w\.\,]+) .*mobile(?:\/\w+ | ?)safari/i
      // Safari Mobile
    ],
    [x, [y, Wt + "Safari"]],
    [
      /iphone .*mobile(?:\/\w+ | ?)safari/i
    ],
    [[y, Wt + "Safari"]],
    [
      /version\/([\w\.\,]+) .*(safari)/i
      // Safari
    ],
    [x, y],
    [
      /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i
      // Safari < 3.0
    ],
    [y, [x, "1"]],
    [
      /(webkit|khtml)\/([\w\.]+)/i
    ],
    [y, x],
    [
      // Gecko based
      /(?:mobile|tablet);.*(firefox)\/([\w\.-]+)/i
      // Firefox Mobile
    ],
    [[y, Wt + mn], x],
    [
      /(navigator|netscape\d?)\/([-\w\.]+)/i
      // Netscape
    ],
    [[y, "Netscape"], x],
    [
      /(wolvic|librewolf)\/([\w\.]+)/i
      // Wolvic/LibreWolf
    ],
    [y, x],
    [
      /mobile vr; rv:([\w\.]+)\).+firefox/i
      // Firefox Reality
    ],
    [x, [y, mn + " Reality"]],
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
    [y, [x, /_/g, "."]],
    [
      /(cobalt)\/([\w\.]+)/i
      // Cobalt
    ],
    [y, [x, /[^\d\.]+./, Kt]]
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
    [w, [E, dn], [m, he]],
    [
      /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
      /samsung[- ]((?!sm-[lr]|browser)[-\w]+)/i,
      /sec-(sgh\w+)/i
    ],
    [w, [E, dn], [m, Z]],
    [
      // Apple
      /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i
      // iPod/iPhone
    ],
    [w, [E, Vt], [m, Z]],
    [
      /\((ipad);[-\w\),; ]+apple/i,
      // iPad
      /applecoremedia\/[\w\.]+ \((ipad)/i,
      /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
    ],
    [w, [E, Vt], [m, he]],
    [
      /(macintosh);/i
    ],
    [w, [E, Vt]],
    [
      // Sharp
      /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
    ],
    [w, [E, Es], [m, Z]],
    [
      // Honor
      /\b((?:brt|eln|hey2?|gdi|jdn)-a?[lnw]09|(?:ag[rm]3?|jdn2|kob2)-a?[lw]0[09]hn)(?: bui|\)|;)/i
    ],
    [w, [E, ws], [m, he]],
    [
      /honor([-\w ]+)[;\)]/i
    ],
    [w, [E, ws], [m, Z]],
    [
      // Huawei
      /\b((?:ag[rs][2356]?k?|bah[234]?|bg[2o]|bt[kv]|cmr|cpn|db[ry]2?|jdn2|got|kob2?k?|mon|pce|scm|sht?|[tw]gr|vrd)-[ad]?[lw][0125][09]b?|605hw|bg2-u03|(?:gem|fdr|m2|ple|t1)-[7a]0[1-4][lu]|t1-a2[13][lw]|mediapad[\w\. ]*(?= bui|\)))\b(?!.+d\/s)/i
    ],
    [w, [E, ms], [m, he]],
    [
      /(?:huawei)([-\w ]+)[;\)]/i,
      /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
    ],
    [w, [E, ms], [m, Z]],
    [
      // Xiaomi
      /oid[^\)]+; (2[\dbc]{4}(182|283|rp\w{2})[cgl]|m2105k81a?c)(?: bui|\))/i,
      /\b((?:red)?mi[-_ ]?pad[\w- ]*)(?: bui|\))/i
      // Mi Pad tablets
    ],
    [[w, /_/g, " "], [E, Or], [m, he]],
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
    [[w, /_/g, " "], [E, Or], [m, Z]],
    [
      // OnePlus
      /droid.+; (cph2[3-6]\d[13579]|((gm|hd)19|(ac|be|in|kb)20|(d[en]|eb|le|mt)21|ne22)[0-2]\d|p[g-k]\w[1m]10)\b/i,
      /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
    ],
    [w, [E, bs], [m, Z]],
    [
      // OPPO
      /; (\w+) bui.+ oppo/i,
      /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
    ],
    [w, [E, Cr], [m, Z]],
    [
      /\b(opd2(\d{3}a?))(?: bui|\))/i
    ],
    [w, [E, nt, { OnePlus: ["203", "304", "403", "404", "413", "415"], "*": Cr }], [m, he]],
    [
      // BLU
      /(vivo (5r?|6|8l?|go|one|s|x[il]?[2-4]?)[\w\+ ]*)(?: bui|\))/i
      // Vivo series
    ],
    [w, [E, "BLU"], [m, Z]],
    [
      // Vivo
      /; vivo (\w+)(?: bui|\))/i,
      /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
    ],
    [w, [E, "Vivo"], [m, Z]],
    [
      // Realme
      /\b(rmx[1-3]\d{3})(?: bui|;|\))/i
    ],
    [w, [E, "Realme"], [m, Z]],
    [
      // Lenovo
      /(ideatab[-\w ]+|602lv|d-42a|a101lv|a2109a|a3500-hv|s[56]000|pb-6505[my]|tb-?x?\d{3,4}(?:f[cu]|xu|[av])|yt\d?-[jx]?\d+[lfmx])( bui|;|\)|\/)/i,
      /lenovo ?(b[68]0[08]0-?[hf]?|tab(?:[\w- ]+?)|tb[\w-]{6,7})( bui|;|\)|\/)/i
    ],
    [w, [E, Sr], [m, he]],
    [
      /lenovo[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i
    ],
    [w, [E, Sr], [m, Z]],
    [
      // Motorola
      /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
      /\bmot(?:orola)?[- ]([\w\s]+)(\)| bui)/i,
      /((?:moto(?! 360)[-\w\(\) ]+|xt\d{3,4}[cgkosw\+]?[-\d]*|nexus 6)(?= bui|\)))/i
    ],
    [w, [E, Tr], [m, Z]],
    [
      /\b(mz60\d|xoom[2 ]{0,2}) build\//i
    ],
    [w, [E, Tr], [m, he]],
    [
      // LG
      /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
    ],
    [w, [E, Xn], [m, he]],
    [
      /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
      /\blg[-e;\/ ]+(?!.*(?:browser|netcast|android tv|watch|webos))(\w+)/i,
      /\blg-?([\d\w]+) bui/i
    ],
    [w, [E, Xn], [m, Z]],
    [
      // Nokia
      /(nokia) (t[12][01])/i
    ],
    [E, w, [m, he]],
    [
      /(?:maemo|nokia).*(n900|lumia \d+|rm-\d+)/i,
      /nokia[-_ ]?(([-\w\. ]*))/i
    ],
    [[w, /_/g, " "], [m, Z], [E, "Nokia"]],
    [
      // Google
      /(pixel (c|tablet))\b/i
      // Google Pixel C/Tablet
    ],
    [w, [E, Pt], [m, he]],
    [
      // Google Pixel
      /droid.+;(?: google)? (g(01[13]a|020[aem]|025[jn]|1b60|1f8f|2ybb|4s1m|576d|5nz6|8hhn|8vou|a02099|c15s|d1yq|e2ae|ec77|gh2x|kv4x|p4bc|pj41|r83y|tt9q|ur25|wvk6)|pixel[\d ]*a?( pro)?( xl)?( fold)?( \(5g\))?)( bui|\))/i
    ],
    [w, [E, Pt], [m, Z]],
    [
      /(google) (pixelbook( go)?)/i
    ],
    [E, w],
    [
      // Sony
      /droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-\w\w\d\d)(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
    ],
    [w, [E, gn], [m, Z]],
    [
      /sony tablet [ps]/i,
      /\b(?:sony)?sgp\w+(?: bui|\))/i
    ],
    [[w, "Xperia Tablet"], [E, gn], [m, he]],
    [
      // Amazon
      /(alexa)webm/i,
      /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,
      // Kindle Fire without Silk / Echo Show
      /(kf[a-z]+)( bui|\)).+silk\//i
      // Kindle Fire HD
    ],
    [w, [E, Wn], [m, he]],
    [
      /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
      // Fire Phone
    ],
    [[w, /(.+)/g, "Fire Phone $1"], [E, Wn], [m, Z]],
    [
      // BlackBerry
      /(playbook);[-\w\),; ]+(rim)/i
      // BlackBerry PlayBook
    ],
    [w, E, [m, he]],
    [
      /\b((?:bb[a-f]|st[hv])100-\d)/i,
      /\(bb10; (\w+)/i
      // BlackBerry 10
    ],
    [w, [E, gs], [m, Z]],
    [
      // Asus
      /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
    ],
    [w, [E, ds], [m, he]],
    [
      / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
    ],
    [w, [E, ds], [m, Z]],
    [
      // HTC
      /(nexus 9)/i
      // HTC Nexus 9
    ],
    [w, [E, "HTC"], [m, he]],
    [
      /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
      // HTC
      // ZTE
      /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
      /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i
      // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
    ],
    [E, [w, /_/g, " "], [m, Z]],
    [
      // TCL
      /tcl (xess p17aa)/i,
      /droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])(_\w(\w|\w\w))?(\)| bui)/i
    ],
    [w, [E, "TCL"], [m, he]],
    [
      /droid [\w\.]+; (418(?:7d|8v)|5087z|5102l|61(?:02[dh]|25[adfh]|27[ai]|56[dh]|59k|65[ah])|a509dl|t(?:43(?:0w|1[adepqu])|50(?:6d|7[adju])|6(?:09dl|10k|12b|71[efho]|76[hjk])|7(?:66[ahju]|67[hw]|7[045][bh]|71[hk]|73o|76[ho]|79w|81[hks]?|82h|90[bhsy]|99b)|810[hs]))(_\w(\w|\w\w))?(\)| bui)/i
    ],
    [w, [E, "TCL"], [m, Z]],
    [
      // itel
      /(itel) ((\w+))/i
    ],
    [[E, ht], w, [m, nt, { tablet: ["p10001l", "w7001"], "*": "mobile" }]],
    [
      // Acer
      /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
    ],
    [w, [E, "Acer"], [m, he]],
    [
      // Meizu
      /droid.+; (m[1-5] note) bui/i,
      /\bmz-([-\w]{2,})/i
    ],
    [w, [E, "Meizu"], [m, Z]],
    [
      // Ulefone
      /; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i
    ],
    [w, [E, "Ulefone"], [m, Z]],
    [
      // Energizer
      /; (energy ?\w+)(?: bui|\))/i,
      /; energizer ([\w ]+)(?: bui|\))/i
    ],
    [w, [E, "Energizer"], [m, Z]],
    [
      // Cat
      /; cat (b35);/i,
      /; (b15q?|s22 flip|s48c|s62 pro)(?: bui|\))/i
    ],
    [w, [E, "Cat"], [m, Z]],
    [
      // Smartfren
      /((?:new )?andromax[\w- ]+)(?: bui|\))/i
    ],
    [w, [E, "Smartfren"], [m, Z]],
    [
      // Nothing
      /droid.+; (a(in)?(0(15|59|6[35])|142)p?)/i
    ],
    [w, [E, "Nothing"], [m, Z]],
    [
      // Archos
      /; (x67 5g|tikeasy \w+|ac[1789]\d\w+)( b|\))/i,
      /archos ?(5|gamepad2?|([\w ]*[t1789]|hello) ?\d+[\w ]*)( b|\))/i
    ],
    [w, [E, "Archos"], [m, he]],
    [
      /archos ([\w ]+)( b|\))/i,
      /; (ac[3-6]\d\w{2,8})( b|\))/i
    ],
    [w, [E, "Archos"], [m, Z]],
    [
      // HMD
      /; (n159v)/i
    ],
    [w, [E, "HMD"], [m, Z]],
    [
      // MIXED
      /(imo) (tab \w+)/i,
      // IMO
      /(infinix|tecno) (x1101b?|p904|dp(7c|8d|10a)( pro)?|p70[1-3]a?|p904|t1101)/i
      // Infinix XPad / Tecno
    ],
    [E, w, [m, he]],
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
    [E, w, [m, Z]],
    [
      /(kobo)\s(ereader|touch)/i,
      // Kobo
      /(hp).+(touchpad(?!.+tablet)|tablet)/i,
      // HP TouchPad
      /(kindle)\/([\w\.]+)/i
      // Kindle
    ],
    [E, w, [m, he]],
    [
      /(surface duo)/i
      // Surface Duo
    ],
    [w, [E, _r], [m, he]],
    [
      /droid [\d\.]+; (fp\du?)(?: b|\))/i
      // Fairphone
    ],
    [w, [E, "Fairphone"], [m, Z]],
    [
      /((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i
      // Nvidia Tablets
    ],
    [w, [E, Ar], [m, he]],
    [
      /(sprint) (\w+)/i
      // Sprint Phones
    ],
    [E, w, [m, Z]],
    [
      /(kin\.[onetw]{3})/i
      // Microsoft Kin
    ],
    [[w, /\./g, " "], [E, _r], [m, Z]],
    [
      /droid.+; ([c6]+|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
      // Zebra
    ],
    [w, [E, Lr], [m, he]],
    [
      /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
    ],
    [w, [E, Lr], [m, Z]],
    [
      ///////////////////
      // SMARTTVS
      ///////////////////
      /smart-tv.+(samsung)/i
      // Samsung
    ],
    [E, [m, ye]],
    [
      /hbbtv.+maple;(\d+)/i
    ],
    [[w, /^/, "SmartTV"], [E, dn], [m, ye]],
    [
      /(vizio)(?: |.+model\/)(\w+-\w+)/i,
      // Vizio
      /tcast.+(lg)e?. ([-\w]+)/i
      // LG SmartTV
    ],
    [E, w, [m, ye]],
    [
      /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i
    ],
    [[E, Xn], [m, ye]],
    [
      /(apple) ?tv/i
      // Apple TV
    ],
    [E, [w, Vt + " TV"], [m, ye]],
    [
      /crkey.*devicetype\/chromecast/i
      // Google Chromecast Third Generation
    ],
    [[w, Rt + " Third Generation"], [E, Pt], [m, ye]],
    [
      /crkey.*devicetype\/([^/]*)/i
      // Google Chromecast with specific device type
    ],
    [[w, /^/, "Chromecast "], [E, Pt], [m, ye]],
    [
      /fuchsia.*crkey/i
      // Google Chromecast Nest Hub
    ],
    [[w, Rt + " Nest Hub"], [E, Pt], [m, ye]],
    [
      /crkey/i
      // Google Chromecast, Linux-based or unknown
    ],
    [[w, Rt], [E, Pt], [m, ye]],
    [
      /(portaltv)/i
      // Facebook Portal TV
    ],
    [w, [E, Ir], [m, ye]],
    [
      /droid.+aft(\w+)( bui|\))/i
      // Fire TV
    ],
    [w, [E, Wn], [m, ye]],
    [
      /(shield \w+ tv)/i
      // Nvidia Shield TV
    ],
    [w, [E, Ar], [m, ye]],
    [
      /\(dtv[\);].+(aquos)/i,
      /(aquos-tv[\w ]+)\)/i
      // Sharp
    ],
    [w, [E, Es], [m, ye]],
    [
      /(bravia[\w ]+)( bui|\))/i
      // Sony
    ],
    [w, [E, gn], [m, ye]],
    [
      /(mi(tv|box)-?\w+) bui/i
      // Xiaomi
    ],
    [w, [E, Or], [m, ye]],
    [
      /Hbbtv.*(technisat) (.*);/i
      // TechniSAT
    ],
    [E, w, [m, ye]],
    [
      /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
      // Roku
      /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i
      // HbbTV devices
    ],
    [[E, /.+\/(\w+)/, "$1", nt, { LG: "lge" }], [w, or], [m, ye]],
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
    [w, [E, gn], [m, Tn]],
    [
      /\b(xbox(?: one)?(?!; xbox))[\); ]/i
      // Microsoft Xbox
    ],
    [w, [E, _r], [m, Tn]],
    [
      /(ouya)/i,
      // Ouya
      /(nintendo) (\w+)/i,
      // Nintendo
      /(retroid) (pocket ([^\)]+))/i
      // Retroid Pocket
    ],
    [E, w, [m, Tn]],
    [
      /droid.+; (shield)( bui|\))/i
      // Nvidia Portable
    ],
    [w, [E, Ar], [m, Tn]],
    [
      ///////////////////
      // WEARABLES
      ///////////////////
      /\b(sm-[lr]\d\d[0156][fnuw]?s?|gear live)\b/i
      // Samsung Galaxy Watch
    ],
    [w, [E, dn], [m, et]],
    [
      /((pebble))app/i,
      // Pebble
      /(asus|google|lg|oppo) ((pixel |zen)?watch[\w ]*)( bui|\))/i
      // Asus ZenWatch / LG Watch / Pixel Watch
    ],
    [E, w, [m, et]],
    [
      /(ow(?:19|20)?we?[1-3]{1,3})/i
      // Oppo Watch
    ],
    [w, [E, Cr], [m, et]],
    [
      /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i
      // Apple Watch
    ],
    [w, [E, Vt], [m, et]],
    [
      /(opwwe\d{3})/i
      // OnePlus Watch
    ],
    [w, [E, bs], [m, et]],
    [
      /(moto 360)/i
      // Motorola 360
    ],
    [w, [E, Tr], [m, et]],
    [
      /(smartwatch 3)/i
      // Sony SmartWatch
    ],
    [w, [E, gn], [m, et]],
    [
      /(g watch r)/i
      // LG G Watch R
    ],
    [w, [E, Xn], [m, et]],
    [
      /droid.+; (wt63?0{2,3})\)/i
    ],
    [w, [E, Lr], [m, et]],
    [
      ///////////////////
      // XR
      ///////////////////
      /droid.+; (glass) \d/i
      // Google Glass
    ],
    [w, [E, Pt], [m, Vn]],
    [
      /(pico) (4|neo3(?: link|pro)?)/i
      // Pico
    ],
    [E, w, [m, Vn]],
    [
      /(quest( \d| pro)?s?).+vr/i
      // Meta Quest
    ],
    [w, [E, Ir], [m, Vn]],
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
    [E, [m, An]],
    [
      /(aeobc)\b/i
      // Echo Dot
    ],
    [w, [E, Wn], [m, An]],
    [
      /(homepod).+mac os/i
      // Apple HomePod
    ],
    [w, [E, Vt], [m, An]],
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
    [[m, Z]],
    [
      /droid .+?; ([\w\. -]+)( bui|\))/i
      // Generic Android Device
    ],
    [w, [E, "Generic"]]
  ],
  engine: [
    [
      /windows.+ edge\/([\w\.]+)/i
      // EdgeHTML
    ],
    [x, [y, tr + "HTML"]],
    [
      /(arkweb)\/([\w\.]+)/i
      // ArkWeb
    ],
    [y, x],
    [
      /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i
      // Blink
    ],
    [x, [y, "Blink"]],
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
    [y, x],
    [
      /ladybird\//i
    ],
    [[y, "LibWeb"]],
    [
      /rv\:([\w\.]{1,9})\b.+(gecko)/i
      // Gecko
    ],
    [x, y]
  ],
  os: [
    [
      // Windows
      /(windows nt) (6\.[23]); arm/i
      // Windows RT
    ],
    [[y, /N/, "R"], [x, nt, ks]],
    [
      /(windows (?:phone|mobile|iot))(?: os)?[\/ ]?([\d\.]*( se)?)/i,
      // Windows IoT/Mobile/Phone
      // Windows NT/3.1/95/98/ME/2000/XP/Vista/7/8/8.1/10/11
      /(windows)[\/ ](1[01]|2000|3\.1|7|8(\.1)?|9[58]|me|server 20\d\d( r2)?|vista|xp)/i
    ],
    [y, x],
    [
      /windows nt ?([\d\.\)]*)(?!.+xbox)/i,
      /\bwin(?=3| ?9|n)(?:nt| 9x )?([\d\.;]*)/i
    ],
    [[x, /(;|\))/g, "", nt, ks], [y, $i]],
    [
      /(windows ce)\/?([\d\.]*)/i
      // Windows CE
    ],
    [y, x],
    [
      // iOS/macOS
      /[adehimnop]{4,7}\b(?:.*os ([\w]+) like mac|; opera)/i,
      // iOS
      /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
      /cfnetwork\/.+darwin/i
    ],
    [[x, /_/g, "."], [y, "iOS"]],
    [
      /(mac os x) ?([\w\. ]*)/i,
      /(macintosh|mac_powerpc\b)(?!.+(haiku|morphos))/i
      // Mac OS
    ],
    [[y, "macOS"], [x, /_/g, "."]],
    [
      // Google Chromecast
      /android ([\d\.]+).*crkey/i
      // Google Chromecast, Android-based
    ],
    [x, [y, Rt + " Android"]],
    [
      /fuchsia.*crkey\/([\d\.]+)/i
      // Google Chromecast, Fuchsia-based
    ],
    [x, [y, Rt + " Fuchsia"]],
    [
      /crkey\/([\d\.]+).*devicetype\/smartspeaker/i
      // Google Chromecast, Linux-based Smart Speaker
    ],
    [x, [y, Rt + " SmartSpeaker"]],
    [
      /linux.*crkey\/([\d\.]+)/i
      // Google Chromecast, Legacy Linux-based
    ],
    [x, [y, Rt + " Linux"]],
    [
      /crkey\/([\d\.]+)/i
      // Google Chromecast, unknown
    ],
    [x, [y, Rt]],
    [
      // Mobile OSes
      /droid ([\w\.]+)\b.+(android[- ]x86)/i
      // Android-x86
    ],
    [x, y],
    [
      /(ubuntu) ([\w\.]+) like android/i
      // Ubuntu Touch
    ],
    [[y, /(.+)/, "$1 Touch"], x],
    [
      /(harmonyos)[\/ ]?([\d\.]*)/i,
      // HarmonyOS
      // Android/Blackberry/WebOS/QNX/Bada/RIM/KaiOS/Maemo/MeeGo/S40/Sailfish OS/OpenHarmony/Tizen
      /(android|bada|blackberry|kaios|maemo|meego|openharmony|qnx|rim tablet os|sailfish|series40|symbian|tizen)\w*[-\/\.; ]?([\d\.]*)/i
    ],
    [y, x],
    [
      /\(bb(10);/i
      // BlackBerry 10
    ],
    [x, [y, gs]],
    [
      /(?:symbian ?os|symbos|s60(?=;)|series ?60)[-\/ ]?([\w\.]*)/i
      // Symbian
    ],
    [x, [y, "Symbian"]],
    [
      /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
      // Firefox OS
    ],
    [x, [y, mn + " OS"]],
    [
      /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i,
      // WebOS
      /webos(?:[ \/]?|\.tv-20(?=2[2-9]))(\d[\d\.]*)/i
    ],
    [x, [y, "webOS"]],
    [
      /web0s;.+?(?:chr[o0]me|safari)\/(\d+)/i
      // https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine
    ],
    [[x, nt, { 25: "120", 24: "108", 23: "94", 22: "87", 6: "79", 5: "68", 4: "53", 3: "38", 2: "538", 1: "537", "*": "TV" }], [y, "webOS"]],
    [
      /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i
      // watchOS
    ],
    [x, [y, "watchOS"]],
    [
      // Google ChromeOS
      /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i
      // Chromium OS
    ],
    [[y, "Chrome OS"], x],
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
    [y, x],
    [
      /(sunos) ?([\d\.]*)/i
      // Solaris
    ],
    [[y, "Solaris"], x],
    [
      /\b(beos|os\/2|amigaos|openvms|hp-ux|serenityos)/i,
      // BeOS/OS2/AmigaOS/OpenVMS/HP-UX/SerenityOS
      /(unix) ?([\w\.]*)/i
      // UNIX
    ],
    [y, x]
  ]
}, Yn = (function() {
  var n = { init: {}, isIgnore: {}, isIgnoreRgx: {}, toString: {} };
  return pt.call(n.init, [
    [Ie, [y, x, On, m]],
    [ut, [Ne]],
    [rt, [m, w, E]],
    [We, [y, x]],
    [He, [y, x]]
  ]), pt.call(n.isIgnore, [
    [Ie, [x, On]],
    [We, [x]],
    [He, [x]]
  ]), pt.call(n.isIgnoreRgx, [
    [Ie, / ?browser$/i],
    [He, / ?os$/i]
  ]), pt.call(n.toString, [
    [Ie, [y, x]],
    [ut, [Ne]],
    [rt, [E, w]],
    [We, [y, x]],
    [He, [y, x]]
  ]), n;
})(), _a = function(n, e) {
  var t = Yn.init[e], r = Yn.isIgnore[e] || 0, i = Yn.isIgnoreRgx[e] || 0, o = Yn.toString[e] || 0;
  function s() {
    pt.call(this, t);
  }
  return s.prototype.getItem = function() {
    return n;
  }, s.prototype.withClientHints = function() {
    return St ? St.getHighEntropyValues(Mo).then(function(a) {
      return n.setCH(new Do(a, !1)).parseCH().get();
    }) : n.parseCH().get();
  }, s.prototype.withFeatureCheck = function() {
    return n.detectFeature().get();
  }, e != Xt && (s.prototype.is = function(a) {
    var c = !1;
    for (var l in this)
      if (this.hasOwnProperty(l) && !Mi(r, l) && ht(i ? Qt(i, this[l]) : this[l]) == ht(i ? Qt(i, a) : a)) {
        if (c = !0, a != _t) break;
      } else if (a == _t && c) {
        c = !c;
        break;
      }
    return c;
  }, s.prototype.toString = function() {
    var a = Kt;
    for (var c in o)
      typeof this[o[c]] !== _t && (a += (a ? " " : Kt) + this[o[c]]);
    return a || _t;
  }), St || (s.prototype.then = function(a) {
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
  if (n = n || {}, pt.call(this, Mo), e)
    pt.call(this, [
      [zi, Nr(n[Tt])],
      [qi, Nr(n[ma])],
      [Z, /\?1/.test(n[va])],
      [w, En(n[ya])],
      [Yt, En(n[$o])],
      [Gi, En(n[xa])],
      [Ne, En(n[wa])],
      [$t, Nr(n[Ea])],
      [ur, En(n[ba])]
    ]);
  else
    for (var t in n)
      this.hasOwnProperty(t) && typeof n[t] !== _t && (this[t] = n[t]);
}
function _s(n, e, t, r) {
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
          Pe.brave && typeof Pe.brave.isBrave == ir && this.set(y, "Brave");
          break;
        case rt:
          !this.get(m) && St && St[Z] && this.set(m, Z), this.get(w) == "Macintosh" && Pe && typeof Pe.standalone !== _t && Pe.maxTouchPoints && Pe.maxTouchPoints > 2 && this.set(w, "iPad").set(m, he);
          break;
        case He:
          !this.get(y) && St && St[Yt] && this.set(y, St[Yt]);
          break;
        case Xt:
          var i = this.data, o = function(s) {
            return i[s].getItem().detectFeature().get();
          };
          this.set(Ie, o(Ie)).set(ut, o(ut)).set(rt, o(rt)).set(We, o(We)).set(He, o(He));
      }
    return this;
  }, this.parseUA = function() {
    return this.itemType != Xt && $r.call(this.data, this.ua, this.rgxMap), this.itemType == Ie && this.set(On, Pr(this.get(x))), this;
  }, this.parseCH = function() {
    var i = this.uaCH, o = this.rgxMap;
    switch (this.itemType) {
      case Ie:
      case We:
        var s = i[qi] || i[zi], a;
        if (s)
          for (var c in s) {
            var l = s[c].brand || s[c], u = s[c].version;
            this.itemType == Ie && !/not.a.brand/i.test(l) && (!a || /Chrom/.test(a) && l != ys || a == tr && /WebView2/.test(l)) && (l = nt(l, Sa), a = this.get(y), a && !/Chrom/.test(a) && /Chrom/.test(l) || this.set(y, l).set(x, u).set(On, Pr(u)), a = l), this.itemType == We && l == ys && this.set(x, u);
          }
        break;
      case ut:
        var f = i[Ne];
        f && (f && i[ur] == "64" && (f += "64"), $r.call(this.data, f + ";", o));
        break;
      case rt:
        if (i[Z] && this.set(m, Z), i[w] && (this.set(w, i[w]), !this.get(m) || !this.get(E))) {
          var d = {};
          $r.call(d, "droid 9; " + i[w] + ")", o), !this.get(m) && d.type && this.set(m, d.type), !this.get(E) && d.vendor && this.set(E, d.vendor);
        }
        if (i[$t]) {
          var k;
          if (typeof i[$t] != "string")
            for (var C = 0; !k && C < i[$t].length; )
              k = nt(i[$t][C++], Rs);
          else
            k = nt(i[$t], Rs);
          this.set(m, k);
        }
        break;
      case He:
        var b = i[Yt];
        if (b) {
          var H = i[Gi];
          b == $i && (H = parseInt(Pr(H), 10) >= 13 ? "11" : "10"), this.set(y, b).set(x, H);
        }
        this.get(y) == $i && i[w] == "Xbox" && this.set(y, "Xbox").set(x, void 0);
        break;
      case Xt:
        var W = this.data, X = function(Y) {
          return W[Y].getItem().setCH(i).parseCH().get();
        };
        this.set(Ie, X(Ie)).set(ut, X(ut)).set(rt, X(rt)).set(We, X(We)).set(He, X(He));
    }
    return this;
  }, pt.call(this, [
    ["itemType", n],
    ["ua", e],
    ["uaCH", r],
    ["rgxMap", t],
    ["data", _a(this, n)]
  ]), this;
}
function gt(n, e, t) {
  if (typeof n === Zt ? (sr(n, !0) ? (typeof e === Zt && (t = e), e = n) : (t = n, e = void 0), n = void 0) : typeof n === Pi && !sr(e, !0) && (t = e, e = void 0), t && typeof t.append === ir) {
    var r = {};
    t.forEach(function(c, l) {
      r[l] = c;
    }), t = r;
  }
  if (!(this instanceof gt))
    return new gt(n, e, t).getResult();
  var i = typeof n === Pi ? n : (
    // Passed user-agent string
    t && t[ps] ? t[ps] : (
      // User-Agent from passed headers
      Pe && Pe.userAgent ? Pe.userAgent : (
        // navigator.userAgent
        Kt
      )
    )
  ), o = new Do(t, !0), s = e ? Ra(Ss, e) : Ss, a = function(c) {
    return c == Xt ? function() {
      return new _s(c, i, s, o).set("ua", i).set(Ie, this.getBrowser()).set(ut, this.getCPU()).set(rt, this.getDevice()).set(We, this.getEngine()).set(He, this.getOS()).get();
    } : function() {
      return new _s(c, i, s[c], o).parseUA().get();
    };
  };
  return pt.call(this, [
    ["getBrowser", a(Ie)],
    ["getCPU", a(ut)],
    ["getDevice", a(rt)],
    ["getEngine", a(We)],
    ["getOS", a(He)],
    ["getResult", a(Xt)],
    ["getUA", function() {
      return i;
    }],
    ["setUA", function(c) {
      return Jt(c) && (i = c.length > Ni ? or(c, Ni) : c), this;
    }]
  ]).setUA(i), this;
}
gt.VERSION = ga;
gt.BROWSER = hr([y, x, On, m]);
gt.CPU = hr([Ne]);
gt.DEVICE = hr([w, E, m, Tn, Z, ye, he, et, An]);
gt.ENGINE = gt.OS = hr([y, x]);
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
class ze {
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
      r instanceof ze ? e.push(r) : Array.isArray(r) && r.every((i) => i instanceof ze) && e.push(...r);
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
class Oa extends ze {
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
class La extends ze {
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
class pr extends ze {
  constructor(e) {
    super(), this.root = document.createElement("div"), this.root.classList.add("overlay"), this.root.id = e;
  }
  setVisibility(e) {
    e ? this.root.classList.add("overlay--visible-state") : this.root.classList.remove("overlay--visible-state");
  }
}
class Ia extends ze {
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
      const S = h[g], j = typeof S;
      (j === "object" || j === "function") && !Object.isFrozen(S) && n(S);
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
    const S = /* @__PURE__ */ Object.create(null);
    for (const j in h)
      S[j] = h[j];
    return g.forEach(function(j) {
      for (const we in j)
        S[we] = j[we];
    }), /** @type {T} */
    S;
  }
  const i = "</span>", o = (h) => !!h.scope, s = (h, { prefix: g }) => {
    if (h.startsWith("language:"))
      return h.replace("language:", "language-");
    if (h.includes(".")) {
      const S = h.split(".");
      return [
        `${g}${S.shift()}`,
        ...S.map((j, we) => `${j}${"_".repeat(we + 1)}`)
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
    constructor(g, S) {
      this.buffer = "", this.classPrefix = S.classPrefix, g.walk(this);
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
      const S = s(
        g.scope,
        { prefix: this.classPrefix }
      );
      this.span(S);
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
      const S = c({ scope: g });
      this.add(S), this.stack.push(S);
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
    static _walk(g, S) {
      return typeof S == "string" ? g.addText(S) : S.children && (g.openNode(S), S.children.forEach((j) => this._walk(g, j)), g.closeNode(S)), g;
    }
    /**
     * @param {Node} node
     */
    static _collapse(g) {
      typeof g != "string" && g.children && (g.children.every((S) => typeof S == "string") ? g.children = [g.children.join("")] : g.children.forEach((S) => {
        l._collapse(S);
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
    __addSublanguage(g, S) {
      const j = g.root;
      S && (j.scope = `language:${S}`), this.add(j);
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
    return b("(?=", h, ")");
  }
  function k(h) {
    return b("(?:", h, ")*");
  }
  function C(h) {
    return b("(?:", h, ")?");
  }
  function b(...h) {
    return h.map((S) => f(S)).join("");
  }
  function H(h) {
    const g = h[h.length - 1];
    return typeof g == "object" && g.constructor === Object ? (h.splice(h.length - 1, 1), g) : {};
  }
  function W(...h) {
    return "(" + (H(h).capture ? "" : "?:") + h.map((j) => f(j)).join("|") + ")";
  }
  function X(h) {
    return new RegExp(h.toString() + "|").exec("").length - 1;
  }
  function Y(h, g) {
    const S = h && h.exec(g);
    return S && S.index === 0;
  }
  const Q = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function ue(h, { joinWith: g }) {
    let S = 0;
    return h.map((j) => {
      S += 1;
      const we = S;
      let me = f(j), I = "";
      for (; me.length > 0; ) {
        const L = Q.exec(me);
        if (!L) {
          I += me;
          break;
        }
        I += me.substring(0, L.index), me = me.substring(L.index + L[0].length), L[0][0] === "\\" && L[1] ? I += "\\" + String(Number(L[1]) + we) : (I += L[0], L[0] === "(" && S++);
      }
      return I;
    }).map((j) => `(${j})`).join(g);
  }
  const ie = /\b\B/, se = "[a-zA-Z]\\w*", q = "[a-zA-Z_]\\w*", Ke = "\\b\\d+(\\.\\d+)?", mt = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", be = "\\b(0b[01]+)", it = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", st = (h = {}) => {
    const g = /^#![ ]*\//;
    return h.binary && (h.begin = b(
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
      "on:begin": (S, j) => {
        S.index !== 0 && j.ignoreMatch();
      }
    }, h);
  }, T = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, _ = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [T]
  }, U = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [T]
  }, N = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, $ = function(h, g, S = {}) {
    const j = r(
      {
        scope: "comment",
        begin: h,
        end: g,
        contains: []
      },
      S
    );
    j.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const we = W(
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
    return j.contains.push(
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
        begin: b(
          /[ ]+/,
          // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
          "(",
          we,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), j;
  }, P = $("//", "$"), G = $("/\\*", "\\*/"), F = $("#", "$"), J = {
    scope: "number",
    begin: Ke,
    relevance: 0
  }, V = {
    scope: "number",
    begin: mt,
    relevance: 0
  }, ve = {
    scope: "number",
    begin: be,
    relevance: 0
  }, K = {
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
  }, $e = {
    scope: "title",
    begin: se,
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
    APOS_STRING_MODE: _,
    BACKSLASH_ESCAPE: T,
    BINARY_NUMBER_MODE: ve,
    BINARY_NUMBER_RE: be,
    COMMENT: $,
    C_BLOCK_COMMENT_MODE: G,
    C_LINE_COMMENT_MODE: P,
    C_NUMBER_MODE: V,
    C_NUMBER_RE: mt,
    END_SAME_AS_BEGIN: function(h) {
      return Object.assign(
        h,
        {
          /** @type {ModeCallback} */
          "on:begin": (g, S) => {
            S.data._beginMatch = g[1];
          },
          /** @type {ModeCallback} */
          "on:end": (g, S) => {
            S.data._beginMatch !== g[1] && S.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: F,
    IDENT_RE: se,
    MATCH_NOTHING_RE: ie,
    METHOD_GUARD: Nn,
    NUMBER_MODE: J,
    NUMBER_RE: Ke,
    PHRASAL_WORDS_MODE: N,
    QUOTE_STRING_MODE: U,
    REGEXP_MODE: K,
    RE_STARTERS_RE: it,
    SHEBANG: st,
    TITLE_MODE: $e,
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
  function ot(h, g) {
    Array.isArray(h.illegal) && (h.illegal = W(...h.illegal));
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
    const S = Object.assign({}, h);
    Object.keys(h).forEach((j) => {
      delete h[j];
    }), h.keywords = S.keywords, h.begin = b(S.beforeMatch, d(S.begin)), h.starts = {
      relevance: 0,
      contains: [
        Object.assign(S, { endsParent: !0 })
      ]
    }, h.relevance = 0, delete S.beforeMatch;
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
  function sn(h, g, S = Ft) {
    const j = /* @__PURE__ */ Object.create(null);
    return typeof h == "string" ? we(S, h.split(" ")) : Array.isArray(h) ? we(S, h) : Object.keys(h).forEach(function(me) {
      Object.assign(
        j,
        sn(h[me], g, me)
      );
    }), j;
    function we(me, I) {
      g && (I = I.map((L) => L.toLowerCase())), I.forEach(function(L) {
        const z = L.split("|");
        j[z[0]] = [me, Mn(z[0], z[1])];
      });
    }
  }
  function Mn(h, g) {
    return g ? Number(g) : vr(h) ? 0 : 1;
  }
  function vr(h) {
    return Ut.includes(h.toLowerCase());
  }
  const Ht = {}, Me = (h) => {
    console.error(h);
  }, at = (h, ...g) => {
    console.log(`WARN: ${h}`, ...g);
  }, De = (h, g) => {
    Ht[`${h}/${g}`] || (console.log(`Deprecated as of ${h}. ${g}`), Ht[`${h}/${g}`] = !0);
  }, Ct = new Error();
  function on(h, g, { key: S }) {
    let j = 0;
    const we = h[S], me = {}, I = {};
    for (let L = 1; L <= g.length; L++)
      I[L + j] = we[L], me[L + j] = !0, j += X(g[L - 1]);
    h[S] = I, h[S]._emit = me, h[S]._multi = !0;
  }
  function Dn(h) {
    if (Array.isArray(h.begin)) {
      if (h.skip || h.excludeBegin || h.returnBegin)
        throw Me("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Ct;
      if (typeof h.beginScope != "object" || h.beginScope === null)
        throw Me("beginScope must be object"), Ct;
      on(h, h.begin, { key: "beginScope" }), h.begin = ue(h.begin, { joinWith: "" });
    }
  }
  function an(h) {
    if (Array.isArray(h.end)) {
      if (h.skip || h.excludeEnd || h.returnEnd)
        throw Me("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Ct;
      if (typeof h.endScope != "object" || h.endScope === null)
        throw Me("endScope must be object"), Ct;
      on(h, h.end, { key: "endScope" }), h.end = ue(h.end, { joinWith: "" });
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
    class S {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(L, z) {
        z.position = this.position++, this.matchIndexes[this.matchAt] = z, this.regexes.push([z, L]), this.matchAt += X(L) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const L = this.regexes.map((z) => z[1]);
        this.matcherRe = g(ue(L, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(L) {
        this.matcherRe.lastIndex = this.lastIndex;
        const z = this.matcherRe.exec(L);
        if (!z)
          return null;
        const ae = z.findIndex((xt, Gt) => Gt > 0 && xt !== void 0), pe = this.matchIndexes[ae];
        return z.splice(0, ae), Object.assign(z, pe);
      }
    }
    class j {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(L) {
        if (this.multiRegexes[L]) return this.multiRegexes[L];
        const z = new S();
        return this.rules.slice(L).forEach(([ae, pe]) => z.addRule(ae, pe)), z.compile(), this.multiRegexes[L] = z, z;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(L, z) {
        this.rules.push([L, z]), z.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(L) {
        const z = this.getMatcher(this.regexIndex);
        z.lastIndex = this.lastIndex;
        let ae = z.exec(L);
        if (this.resumingScanAtSamePosition() && !(ae && ae.index === this.lastIndex)) {
          const pe = this.getMatcher(0);
          pe.lastIndex = this.lastIndex + 1, ae = pe.exec(L);
        }
        return ae && (this.regexIndex += ae.position + 1, this.regexIndex === this.count && this.considerAll()), ae;
      }
    }
    function we(I) {
      const L = new j();
      return I.contains.forEach((z) => L.addRule(z.begin, { rule: z, type: "begin" })), I.terminatorEnd && L.addRule(I.terminatorEnd, { type: "end" }), I.illegal && L.addRule(I.illegal, { type: "illegal" }), L;
    }
    function me(I, L) {
      const z = (
        /** @type CompiledMode */
        I
      );
      if (I.isCompiled) return z;
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
        ot,
        // default to 1 relevance if not specified
        rn
      ].forEach((pe) => pe(I, L)), I.isCompiled = !0;
      let ae = null;
      return typeof I.keywords == "object" && I.keywords.$pattern && (I.keywords = Object.assign({}, I.keywords), ae = I.keywords.$pattern, delete I.keywords.$pattern), ae = ae || /\w+/, I.keywords && (I.keywords = sn(I.keywords, h.case_insensitive)), z.keywordPatternRe = g(ae, !0), L && (I.begin || (I.begin = /\B|\b/), z.beginRe = g(z.begin), !I.end && !I.endsWithParent && (I.end = /\B|\b/), I.end && (z.endRe = g(z.end)), z.terminatorEnd = f(z.end) || "", I.endsWithParent && L.terminatorEnd && (z.terminatorEnd += (I.end ? "|" : "") + L.terminatorEnd)), I.illegal && (z.illegalRe = g(
        /** @type {RegExp | string} */
        I.illegal
      )), I.contains || (I.contains = []), I.contains = [].concat(...I.contains.map(function(pe) {
        return Et(pe === "self" ? I : pe);
      })), I.contains.forEach(function(pe) {
        me(
          /** @type Mode */
          pe,
          z
        );
      }), I.starts && me(I.starts, L), z.matcher = we(z), z;
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
    return h.variants && !h.cachedVariants && (h.cachedVariants = h.variants.map(function(g) {
      return r(h, { variants: null }, g);
    })), h.cachedVariants ? h.cachedVariants : Fe(h) ? r(h, { starts: h.starts ? r(h.starts) : null }) : Object.isFrozen(h) ? r(h) : h;
  }
  var ln = "11.11.1";
  class cn extends Error {
    constructor(g, S) {
      super(g), this.name = "HTMLInjectionError", this.html = S;
    }
  }
  const un = t, Ot = r, Lt = Symbol("nomatch"), yr = 7, vt = function(h) {
    const g = /* @__PURE__ */ Object.create(null), S = /* @__PURE__ */ Object.create(null), j = [];
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
    function z(v) {
      return L.noHighlightRe.test(v);
    }
    function ae(v) {
      let D = v.className + " ";
      D += v.parentNode ? v.parentNode.className : "";
      const ne = L.languageDetectRe.exec(D);
      if (ne) {
        const de = O(ne[1]);
        return de || (at(me.replace("{}", ne[1])), at("Falling back to no-highlight mode for this block.", v)), de ? ne[1] : "no-highlight";
      }
      return D.split(/\s+/).find((de) => z(de) || O(de));
    }
    function pe(v, D, ne) {
      let de = "", ke = "";
      typeof D == "object" ? (de = v, ne = D.ignoreIllegals, ke = D.language) : (De("10.7.0", "highlight(lang, code, ...args) has been deprecated."), De("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), ke = v, de = D), ne === void 0 && (ne = !0);
      const je = {
        code: de,
        language: ke
      };
      Ze("before:highlight", je);
      const kt = je.result ? je.result : xt(je.language, je.code, ne);
      return kt.code = je.code, Ze("after:highlight", kt), kt;
    }
    function xt(v, D, ne, de) {
      const ke = /* @__PURE__ */ Object.create(null);
      function je(A, B) {
        return A.keywords[B];
      }
      function kt() {
        if (!ee.keywords) {
          Re.addText(ge);
          return;
        }
        let A = 0;
        ee.keywordPatternRe.lastIndex = 0;
        let B = ee.keywordPatternRe.exec(ge), te = "";
        for (; B; ) {
          te += ge.substring(A, B.index);
          const le = Je.case_insensitive ? B[0].toLowerCase() : B[0], _e = je(ee, le);
          if (_e) {
            const [lt, ha] = _e;
            if (Re.addText(te), te = "", ke[le] = (ke[le] || 0) + 1, ke[le] <= yr && (jn += ha), lt.startsWith("_"))
              te += B[0];
            else {
              const pa = Je.classNameAliases[lt] || lt;
              Qe(B[0], pa);
            }
          } else
            te += B[0];
          A = ee.keywordPatternRe.lastIndex, B = ee.keywordPatternRe.exec(ge);
        }
        te += ge.substring(A), Re.addText(te);
      }
      function qn() {
        if (ge === "") return;
        let A = null;
        if (typeof ee.subLanguage == "string") {
          if (!g[ee.subLanguage]) {
            Re.addText(ge);
            return;
          }
          A = xt(ee.subLanguage, ge, !0, hs[ee.subLanguage]), hs[ee.subLanguage] = /** @type {CompiledMode} */
          A._top;
        } else
          A = It(ge, ee.subLanguage.length ? ee.subLanguage : null);
        ee.relevance > 0 && (jn += A.relevance), Re.__addSublanguage(A._emitter, A.language);
      }
      function Ue() {
        ee.subLanguage != null ? qn() : kt(), ge = "";
      }
      function Qe(A, B) {
        A !== "" && (Re.startScope(B), Re.addText(A), Re.endScope());
      }
      function as(A, B) {
        let te = 1;
        const le = B.length - 1;
        for (; te <= le; ) {
          if (!A._emit[te]) {
            te++;
            continue;
          }
          const _e = Je.classNameAliases[A[te]] || A[te], lt = B[te];
          _e ? Qe(lt, _e) : (ge = lt, kt(), ge = ""), te++;
        }
      }
      function ls(A, B) {
        return A.scope && typeof A.scope == "string" && Re.openNode(Je.classNameAliases[A.scope] || A.scope), A.beginScope && (A.beginScope._wrap ? (Qe(ge, Je.classNameAliases[A.beginScope._wrap] || A.beginScope._wrap), ge = "") : A.beginScope._multi && (as(A.beginScope, B), ge = "")), ee = Object.create(A, { parent: { value: ee } }), ee;
      }
      function cs(A, B, te) {
        let le = Y(A.endRe, te);
        if (le) {
          if (A["on:end"]) {
            const _e = new e(A);
            A["on:end"](B, _e), _e.isMatchIgnored && (le = !1);
          }
          if (le) {
            for (; A.endsParent && A.parent; )
              A = A.parent;
            return A;
          }
        }
        if (A.endsWithParent)
          return cs(A.parent, B, te);
      }
      function oa(A) {
        return ee.matcher.regexIndex === 0 ? (ge += A[0], 1) : (Rr = !0, 0);
      }
      function aa(A) {
        const B = A[0], te = A.rule, le = new e(te), _e = [te.__beforeBegin, te["on:begin"]];
        for (const lt of _e)
          if (lt && (lt(A, le), le.isMatchIgnored))
            return oa(B);
        return te.skip ? ge += B : (te.excludeBegin && (ge += B), Ue(), !te.returnBegin && !te.excludeBegin && (ge = B)), ls(te, A), te.returnBegin ? 0 : B.length;
      }
      function la(A) {
        const B = A[0], te = D.substring(A.index), le = cs(ee, A, te);
        if (!le)
          return Lt;
        const _e = ee;
        ee.endScope && ee.endScope._wrap ? (Ue(), Qe(B, ee.endScope._wrap)) : ee.endScope && ee.endScope._multi ? (Ue(), as(ee.endScope, A)) : _e.skip ? ge += B : (_e.returnEnd || _e.excludeEnd || (ge += B), Ue(), _e.excludeEnd && (ge = B));
        do
          ee.scope && Re.closeNode(), !ee.skip && !ee.subLanguage && (jn += ee.relevance), ee = ee.parent;
        while (ee !== le.parent);
        return le.starts && ls(le.starts, A), _e.returnEnd ? 0 : B.length;
      }
      function ca() {
        const A = [];
        for (let B = ee; B !== Je; B = B.parent)
          B.scope && A.unshift(B.scope);
        A.forEach((B) => Re.openNode(B));
      }
      let Gn = {};
      function us(A, B) {
        const te = B && B[0];
        if (ge += A, te == null)
          return Ue(), 0;
        if (Gn.type === "begin" && B.type === "end" && Gn.index === B.index && te === "") {
          if (ge += D.slice(B.index, B.index + 1), !we) {
            const le = new Error(`0 width match regex (${v})`);
            throw le.languageName = v, le.badRule = Gn.rule, le;
          }
          return 1;
        }
        if (Gn = B, B.type === "begin")
          return aa(B);
        if (B.type === "illegal" && !ne) {
          const le = new Error('Illegal lexeme "' + te + '" for mode "' + (ee.scope || "<unnamed>") + '"');
          throw le.mode = ee, le;
        } else if (B.type === "end") {
          const le = la(B);
          if (le !== Lt)
            return le;
        }
        if (B.type === "illegal" && te === "")
          return ge += `
`, 1;
        if (kr > 1e5 && kr > B.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return ge += te, te.length;
      }
      const Je = O(v);
      if (!Je)
        throw Me(me.replace("{}", v)), new Error('Unknown language: "' + v + '"');
      const ua = qt(Je);
      let xr = "", ee = de || ua;
      const hs = {}, Re = new L.__emitter(L);
      ca();
      let ge = "", jn = 0, Nt = 0, kr = 0, Rr = !1;
      try {
        if (Je.__emitTokens)
          Je.__emitTokens(D, Re);
        else {
          for (ee.matcher.considerAll(); ; ) {
            kr++, Rr ? Rr = !1 : ee.matcher.considerAll(), ee.matcher.lastIndex = Nt;
            const A = ee.matcher.exec(D);
            if (!A) break;
            const B = D.substring(Nt, A.index), te = us(B, A);
            Nt = A.index + te;
          }
          us(D.substring(Nt));
        }
        return Re.finalize(), xr = Re.toHTML(), {
          language: v,
          value: xr,
          relevance: jn,
          illegal: !1,
          _emitter: Re,
          _top: ee
        };
      } catch (A) {
        if (A.message && A.message.includes("Illegal"))
          return {
            language: v,
            value: un(D),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: A.message,
              index: Nt,
              context: D.slice(Nt - 100, Nt + 100),
              mode: A.mode,
              resultSoFar: xr
            },
            _emitter: Re
          };
        if (we)
          return {
            language: v,
            value: un(D),
            illegal: !1,
            relevance: 0,
            errorRaised: A,
            _emitter: Re,
            _top: ee
          };
        throw A;
      }
    }
    function Gt(v) {
      const D = {
        value: un(v),
        illegal: !1,
        relevance: 0,
        _top: I,
        _emitter: new L.__emitter(L)
      };
      return D._emitter.addText(v), D;
    }
    function It(v, D) {
      D = D || L.languages || Object.keys(g);
      const ne = Gt(v), de = D.filter(O).filter(xe).map(
        (Ue) => xt(Ue, v, !1)
      );
      de.unshift(ne);
      const ke = de.sort((Ue, Qe) => {
        if (Ue.relevance !== Qe.relevance) return Qe.relevance - Ue.relevance;
        if (Ue.language && Qe.language) {
          if (O(Ue.language).supersetOf === Qe.language)
            return 1;
          if (O(Qe.language).supersetOf === Ue.language)
            return -1;
        }
        return 0;
      }), [je, kt] = ke, qn = je;
      return qn.secondBest = kt, qn;
    }
    function Un(v, D, ne) {
      const de = D && S[D] || ne;
      v.classList.add("hljs"), v.classList.add(`language-${de}`);
    }
    function Be(v) {
      let D = null;
      const ne = ae(v);
      if (z(ne)) return;
      if (Ze(
        "before:highlightElement",
        { el: v, language: ne }
      ), v.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", v);
        return;
      }
      if (v.children.length > 0 && (L.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(v)), L.throwUnescapedHTML))
        throw new cn(
          "One of your code blocks includes unescaped HTML.",
          v.innerHTML
        );
      D = v;
      const de = D.textContent, ke = ne ? pe(de, { language: ne, ignoreIllegals: !0 }) : It(de);
      v.innerHTML = ke.value, v.dataset.highlighted = "yes", Un(v, ne, ke.language), v.result = {
        language: ke.language,
        // TODO: remove with version 11.0
        re: ke.relevance,
        relevance: ke.relevance
      }, ke.secondBest && (v.secondBest = {
        language: ke.secondBest.language,
        relevance: ke.secondBest.relevance
      }), Ze("after:highlightElement", { el: v, result: ke, text: de });
    }
    function Fn(v) {
      L = Ot(L, v);
    }
    const Hn = () => {
      jt(), De("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function zn() {
      jt(), De("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let hn = !1;
    function jt() {
      function v() {
        jt();
      }
      if (document.readyState === "loading") {
        hn || window.addEventListener("DOMContentLoaded", v, !1), hn = !0;
        return;
      }
      document.querySelectorAll(L.cssSelector).forEach(Be);
    }
    function M(v, D) {
      let ne = null;
      try {
        ne = D(h);
      } catch (de) {
        if (Me("Language definition for '{}' could not be registered.".replace("{}", v)), we)
          Me(de);
        else
          throw de;
        ne = I;
      }
      ne.name || (ne.name = v), g[v] = ne, ne.rawDefinition = D.bind(null, h), ne.aliases && fe(ne.aliases, { languageName: v });
    }
    function p(v) {
      delete g[v];
      for (const D of Object.keys(S))
        S[D] === v && delete S[D];
    }
    function R() {
      return Object.keys(g);
    }
    function O(v) {
      return v = (v || "").toLowerCase(), g[v] || g[S[v]];
    }
    function fe(v, { languageName: D }) {
      typeof v == "string" && (v = [v]), v.forEach((ne) => {
        S[ne.toLowerCase()] = D;
      });
    }
    function xe(v) {
      const D = O(v);
      return D && !D.disableAutodetect;
    }
    function Ee(v) {
      v["before:highlightBlock"] && !v["before:highlightElement"] && (v["before:highlightElement"] = (D) => {
        v["before:highlightBlock"](
          Object.assign({ block: D.el }, D)
        );
      }), v["after:highlightBlock"] && !v["after:highlightElement"] && (v["after:highlightElement"] = (D) => {
        v["after:highlightBlock"](
          Object.assign({ block: D.el }, D)
        );
      });
    }
    function Se(v) {
      Ee(v), j.push(v);
    }
    function Ge(v) {
      const D = j.indexOf(v);
      D !== -1 && j.splice(D, 1);
    }
    function Ze(v, D) {
      const ne = v;
      j.forEach(function(de) {
        de[ne] && de[ne](D);
      });
    }
    function pn(v) {
      return De("10.7.0", "highlightBlock will be removed entirely in v12.0"), De("10.7.0", "Please use highlightElement now."), Be(v);
    }
    Object.assign(h, {
      highlight: pe,
      highlightAuto: It,
      highlightAll: jt,
      highlightElement: Be,
      // TODO: Remove with v12 API
      highlightBlock: pn,
      configure: Fn,
      initHighlighting: Hn,
      initHighlightingOnLoad: zn,
      registerLanguage: M,
      unregisterLanguage: p,
      listLanguages: R,
      getLanguage: O,
      registerAliases: fe,
      autoDetection: xe,
      inherit: Ot,
      addPlugin: Se,
      removePlugin: Ge
    }), h.debugMode = function() {
      we = !1;
    }, h.safeMode = function() {
      we = !0;
    }, h.versionString = ln, h.regex = {
      concat: b,
      lookahead: d,
      either: W,
      optional: C,
      anyNumberOfTimes: k
    };
    for (const v in At)
      typeof At[v] == "object" && n(At[v]);
    return Object.assign(h, At), h;
  }, yt = vt({});
  return yt.newInstance = () => vt({}), Mr = yt, yt.HighlightJS = yt, yt.default = yt, Mr;
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
class Ba extends ze {
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
class Fa extends ze {
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
class za extends ze {
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
class Ga extends ze {
  constructor() {
    super();
    const e = document.createElement("button");
    e.classList.add("start-button"), e.textContent = "Press to Start", this.root = e;
  }
  attachClickListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class ja extends ze {
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
}, Za = /^(?:[ \t]*(?:\n|$))+/, Qa = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Ja = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Ln = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, el = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Wi = /(?:[*+-]|\d{1,9}[.)])/, Fo = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Ho = oe(Fo).replace(/bull/g, Wi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), tl = oe(Fo).replace(/bull/g, Wi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Xi = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, nl = /^[^\n]+/, Yi = /(?!\s*\])(?:\\.|[^\[\]\\])+/, rl = oe(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Yi).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), il = oe(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Wi).getRegex(), fr = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Ki = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, sl = oe(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", Ki).replace("tag", fr).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), zo = oe(Xi).replace("hr", Ln).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", fr).getRegex(), ol = oe(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", zo).getRegex(), Zi = {
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
}, As = oe(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", Ln).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", fr).getRegex(), al = {
  ...Zi,
  lheading: tl,
  table: As,
  paragraph: oe(Xi).replace("hr", Ln).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", As).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", fr).getRegex()
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
  paragraph: oe(Xi).replace("hr", Ln).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Ho).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, cl = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, ul = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, qo = /^( {2,}|\\)\n(?!\s*$)/, hl = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, dr = /[\p{P}\p{S}]/u, Qi = /[\s\p{P}\p{S}]/u, Go = /[^\s\p{P}\p{S}]/u, pl = oe(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Qi).getRegex(), jo = /(?!~)[\p{P}\p{S}]/u, fl = /(?!~)[\s\p{P}\p{S}]/u, dl = /(?:[^\s\p{P}\p{S}]|~)/u, gl = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, Vo = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, ml = oe(Vo, "u").replace(/punct/g, dr).getRegex(), wl = oe(Vo, "u").replace(/punct/g, jo).getRegex(), Wo = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", bl = oe(Wo, "gu").replace(/notPunctSpace/g, Go).replace(/punctSpace/g, Qi).replace(/punct/g, dr).getRegex(), El = oe(Wo, "gu").replace(/notPunctSpace/g, dl).replace(/punctSpace/g, fl).replace(/punct/g, jo).getRegex(), vl = oe(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, Go).replace(/punctSpace/g, Qi).replace(/punct/g, dr).getRegex(), yl = oe(/\\(punct)/, "gu").replace(/punct/g, dr).getRegex(), xl = oe(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), kl = oe(Ki).replace("(?:-->|$)", "-->").getRegex(), Rl = oe(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", kl).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), ar = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, Sl = oe(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", ar).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Xo = oe(/^!?\[(label)\]\[(ref)\]/).replace("label", ar).replace("ref", Yi).getRegex(), Yo = oe(/^!?\[(ref)\](?:\[\])?/).replace("ref", Yi).getRegex(), _l = oe("reflink|nolink(?!\\()", "g").replace("reflink", Xo).replace("nolink", Yo).getRegex(), Ji = {
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
  link: Sl,
  nolink: Yo,
  punctuation: pl,
  reflink: Xo,
  reflinkSearch: _l,
  tag: Rl,
  text: hl,
  url: Cn
}, Tl = {
  ...Ji,
  link: oe(/^!?\[(label)\]\((.*?)\)/).replace("label", ar).getRegex(),
  reflink: oe(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", ar).getRegex()
}, Di = {
  ...Ji,
  emStrongRDelimAst: El,
  emStrongLDelim: wl,
  url: oe(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, Al = {
  ...Di,
  br: oe(qo).replace("{2,}", "*").getRegex(),
  text: oe(Di.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
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
function tt(n, e) {
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
function yn(n, e, t) {
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
        const f = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(u, o, !0), this.lexer.state.top = f, t.length === 0)
          break;
        const d = o.at(-1);
        if (d?.type === "code")
          break;
        if (d?.type === "blockquote") {
          const k = d, C = k.raw + `
` + t.join(`
`), b = this.blockquote(C);
          o[o.length - 1] = b, r = r.substring(0, r.length - k.raw.length) + b.raw, i = i.substring(0, i.length - k.text.length) + b.text;
          break;
        } else if (d?.type === "list") {
          const k = d, C = k.raw + `
` + t.join(`
`), b = this.list(C);
          o[o.length - 1] = b, r = r.substring(0, r.length - d.raw.length) + b.raw, i = i.substring(0, i.length - k.raw.length) + b.raw, t = C.substring(o.at(-1).raw.length).split(`
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
`, 1)[0].replace(this.rules.other.listReplaceTabs, (W) => " ".repeat(3 * W.length)), d = n.split(`
`, 1)[0], k = !f.trim(), C = 0;
        if (this.options.pedantic ? (C = 2, u = f.trimStart()) : k ? C = e[1].length + 1 : (C = e[2].search(this.rules.other.nonSpaceChar), C = C > 4 ? 1 : C, u = f.slice(C), C += e[1].length), k && this.rules.other.blankLine.test(d) && (l += d + `
`, n = n.substring(d.length + 1), c = !0), !c) {
          const W = this.rules.other.nextBulletRegex(C), X = this.rules.other.hrRegex(C), Y = this.rules.other.fencesBeginRegex(C), Q = this.rules.other.headingBeginRegex(C), ue = this.rules.other.htmlBeginRegex(C);
          for (; n; ) {
            const ie = n.split(`
`, 1)[0];
            let se;
            if (d = ie, this.options.pedantic ? (d = d.replace(this.rules.other.listReplaceNesting, "  "), se = d) : se = d.replace(this.rules.other.tabCharGlobal, "    "), Y.test(d) || Q.test(d) || ue.test(d) || W.test(d) || X.test(d))
              break;
            if (se.search(this.rules.other.nonSpaceChar) >= C || !d.trim())
              u += `
` + se.slice(C);
            else {
              if (k || f.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || Y.test(f) || Q.test(f) || X.test(f))
                break;
              u += `
` + d;
            }
            !k && !d.trim() && (k = !0), l += ie + `
`, n = n.substring(ie.length + 1), f = se.slice(C);
          }
        }
        i.loose || (s ? i.loose = !0 : this.rules.other.doubleBlankLine.test(l) && (s = !0));
        let b = null, H;
        this.options.gfm && (b = this.rules.other.listIsTask.exec(u), b && (H = b[0] !== "[ ] ", u = u.replace(this.rules.other.listReplaceTask, ""))), i.items.push({
          type: "list_item",
          raw: l,
          task: !!b,
          checked: H,
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
        const o = yn(t.slice(0, -1), "\\");
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
}, ft = class Bi {
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
    const r = this.parser.parseInline(t), i = Os(n);
    if (i === null)
      return r;
    n = i;
    let o = '<a href="' + n + '"';
    return e && (o += ' title="' + tt(e) + '"'), o += ">" + r + "</a>", o;
  }
  image({ href: n, title: e, text: t, tokens: r }) {
    r && (t = this.parser.parseInline(r, this.parser.textRenderer));
    const i = Os(n);
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
}, dt = class Ui {
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
    return this.block ? ft.lex : ft.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? dt.parse : dt.parseInline;
  }
}, Il = class {
  defaults = Vi();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = dt;
  Renderer = cr;
  TextRenderer = es;
  Lexer = ft;
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
    return ft.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return dt.parse(n, e ?? this.defaults);
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
      const a = o.hooks ? o.hooks.provideLexer() : n ? ft.lex : ft.lexInline, c = o.hooks ? o.hooks.provideParser() : n ? dt.parse : dt.parseInline;
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
}, Mt = new Il();
function ce(n, e) {
  return Mt.parse(n, e);
}
ce.options = ce.setOptions = function(n) {
  return Mt.setOptions(n), ce.defaults = Mt.defaults, Uo(ce.defaults), ce;
};
ce.getDefaults = Vi;
ce.defaults = Dt;
ce.use = function(...n) {
  return Mt.use(...n), ce.defaults = Mt.defaults, Uo(ce.defaults), ce;
};
ce.walkTokens = function(n, e) {
  return Mt.walkTokens(n, e);
};
ce.parseInline = Mt.parseInline;
ce.Parser = dt;
ce.parser = dt.parse;
ce.Renderer = cr;
ce.TextRenderer = es;
ce.Lexer = ft;
ce.lexer = ft.lex;
ce.Tokenizer = lr;
ce.Hooks = nr;
ce.parse = ce;
ce.options;
ce.setOptions;
ce.use;
ce.walkTokens;
ce.parseInline;
dt.parse;
ft.lex;
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
  seal: qe,
  create: Zo
} = Object, {
  apply: Fi,
  construct: Hi
} = typeof Reflect < "u" && Reflect;
Ce || (Ce = function(e) {
  return e;
});
qe || (qe = function(e) {
  return e;
});
Fi || (Fi = function(e, t, r) {
  return e.apply(t, r);
});
Hi || (Hi = function(e, t) {
  return new e(...t);
});
const Zn = Oe(Array.prototype.forEach), Ml = Oe(Array.prototype.lastIndexOf), Ps = Oe(Array.prototype.pop), xn = Oe(Array.prototype.push), Dl = Oe(Array.prototype.splice), rr = Oe(String.prototype.toLowerCase), Dr = Oe(String.prototype.toString), $s = Oe(String.prototype.match), kn = Oe(String.prototype.replace), Bl = Oe(String.prototype.indexOf), Ul = Oe(String.prototype.trim), Ve = Oe(Object.prototype.hasOwnProperty), Te = Oe(RegExp.prototype.test), Rn = Fl(TypeError);
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
function re(n, e) {
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
    Ve(n, e) || (n[e] = null);
  return n;
}
function ct(n) {
  const e = Zo(null);
  for (const [t, r] of Ko(n))
    Ve(n, t) && (Array.isArray(r) ? e[t] = Hl(r) : r && typeof r == "object" && r.constructor === Object ? e[t] = ct(r) : e[t] = r);
  return e;
}
function Sn(n, e) {
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
const Ms = Ce(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), Br = Ce(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), Ur = Ce(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), zl = Ce(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Fr = Ce(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), ql = Ce(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Ds = Ce(["#text"]), Bs = Ce(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), Hr = Ce(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), Us = Ce(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Qn = Ce(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Gl = qe(/\{\{[\w\W]*|[\w\W]*\}\}/gm), jl = qe(/<%[\w\W]*|[\w\W]*%>/gm), Vl = qe(/\$\{[\w\W]*/gm), Wl = qe(/^data-[\-\w.\u00B7-\uFFFF]+$/), Xl = qe(/^aria-[\-\w]+$/), Qo = qe(
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
const _n = {
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
  const e = (M) => ea(M);
  if (e.version = "3.2.6", e.removed = [], !n || !n.document || n.document.nodeType !== _n.document || !n.Element)
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
  } = n, C = c.prototype, b = Sn(C, "cloneNode"), H = Sn(C, "remove"), W = Sn(C, "nextSibling"), X = Sn(C, "childNodes"), Y = Sn(C, "parentNode");
  if (typeof s == "function") {
    const M = t.createElement("template");
    M.content && M.content.ownerDocument && (t = M.content.ownerDocument);
  }
  let Q, ue = "";
  const {
    implementation: ie,
    createNodeIterator: se,
    createDocumentFragment: q,
    getElementsByTagName: Ke
  } = t, {
    importNode: mt
  } = r;
  let be = Hs();
  e.isSupported = typeof Ko == "function" && typeof Y == "function" && ie && ie.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: it,
    ERB_EXPR: st,
    TMPLIT_EXPR: T,
    DATA_ATTR: _,
    ARIA_ATTR: U,
    IS_SCRIPT_OR_DATA: N,
    ATTR_WHITESPACE: $,
    CUSTOM_ELEMENT: P
  } = Fs;
  let {
    IS_ALLOWED_URI: G
  } = Fs, F = null;
  const J = re({}, [...Ms, ...Br, ...Ur, ...Fr, ...Ds]);
  let V = null;
  const ve = re({}, [...Bs, ...Hr, ...Us, ...Qn]);
  let K = Object.seal(Zo(null, {
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
  })), $e = null, tn = null, Nn = !0, Pn = !0, At = !1, $n = !0, wt = !1, Bt = !0, ot = !1, nn = !1, rn = !1, bt = !1, Ut = !1, Ft = !1, sn = !0, Mn = !1;
  const vr = "user-content-";
  let Ht = !0, Me = !1, at = {}, De = null;
  const Ct = re({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let on = null;
  const Dn = re({}, ["audio", "video", "img", "source", "image", "track"]);
  let an = null;
  const Bn = re({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), zt = "http://www.w3.org/1998/Math/MathML", qt = "http://www.w3.org/2000/svg", Fe = "http://www.w3.org/1999/xhtml";
  let Et = Fe, ln = !1, cn = null;
  const un = re({}, [zt, qt, Fe], Dr);
  let Ot = re({}, ["mi", "mo", "mn", "ms", "mtext"]), Lt = re({}, ["annotation-xml"]);
  const yr = re({}, ["title", "style", "font", "a", "script"]);
  let vt = null;
  const yt = ["application/xhtml+xml", "text/html"], h = "text/html";
  let g = null, S = null;
  const j = t.createElement("form"), we = function(p) {
    return p instanceof RegExp || p instanceof Function;
  }, me = function() {
    let p = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(S && S === p)) {
      if ((!p || typeof p != "object") && (p = {}), p = ct(p), vt = // eslint-disable-next-line unicorn/prefer-includes
      yt.indexOf(p.PARSER_MEDIA_TYPE) === -1 ? h : p.PARSER_MEDIA_TYPE, g = vt === "application/xhtml+xml" ? Dr : rr, F = Ve(p, "ALLOWED_TAGS") ? re({}, p.ALLOWED_TAGS, g) : J, V = Ve(p, "ALLOWED_ATTR") ? re({}, p.ALLOWED_ATTR, g) : ve, cn = Ve(p, "ALLOWED_NAMESPACES") ? re({}, p.ALLOWED_NAMESPACES, Dr) : un, an = Ve(p, "ADD_URI_SAFE_ATTR") ? re(ct(Bn), p.ADD_URI_SAFE_ATTR, g) : Bn, on = Ve(p, "ADD_DATA_URI_TAGS") ? re(ct(Dn), p.ADD_DATA_URI_TAGS, g) : Dn, De = Ve(p, "FORBID_CONTENTS") ? re({}, p.FORBID_CONTENTS, g) : Ct, $e = Ve(p, "FORBID_TAGS") ? re({}, p.FORBID_TAGS, g) : ct({}), tn = Ve(p, "FORBID_ATTR") ? re({}, p.FORBID_ATTR, g) : ct({}), at = Ve(p, "USE_PROFILES") ? p.USE_PROFILES : !1, Nn = p.ALLOW_ARIA_ATTR !== !1, Pn = p.ALLOW_DATA_ATTR !== !1, At = p.ALLOW_UNKNOWN_PROTOCOLS || !1, $n = p.ALLOW_SELF_CLOSE_IN_ATTR !== !1, wt = p.SAFE_FOR_TEMPLATES || !1, Bt = p.SAFE_FOR_XML !== !1, ot = p.WHOLE_DOCUMENT || !1, bt = p.RETURN_DOM || !1, Ut = p.RETURN_DOM_FRAGMENT || !1, Ft = p.RETURN_TRUSTED_TYPE || !1, rn = p.FORCE_BODY || !1, sn = p.SANITIZE_DOM !== !1, Mn = p.SANITIZE_NAMED_PROPS || !1, Ht = p.KEEP_CONTENT !== !1, Me = p.IN_PLACE || !1, G = p.ALLOWED_URI_REGEXP || Qo, Et = p.NAMESPACE || Fe, Ot = p.MATHML_TEXT_INTEGRATION_POINTS || Ot, Lt = p.HTML_INTEGRATION_POINTS || Lt, K = p.CUSTOM_ELEMENT_HANDLING || {}, p.CUSTOM_ELEMENT_HANDLING && we(p.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (K.tagNameCheck = p.CUSTOM_ELEMENT_HANDLING.tagNameCheck), p.CUSTOM_ELEMENT_HANDLING && we(p.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (K.attributeNameCheck = p.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), p.CUSTOM_ELEMENT_HANDLING && typeof p.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (K.allowCustomizedBuiltInElements = p.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), wt && (Pn = !1), Ut && (bt = !0), at && (F = re({}, Ds), V = [], at.html === !0 && (re(F, Ms), re(V, Bs)), at.svg === !0 && (re(F, Br), re(V, Hr), re(V, Qn)), at.svgFilters === !0 && (re(F, Ur), re(V, Hr), re(V, Qn)), at.mathMl === !0 && (re(F, Fr), re(V, Us), re(V, Qn))), p.ADD_TAGS && (F === J && (F = ct(F)), re(F, p.ADD_TAGS, g)), p.ADD_ATTR && (V === ve && (V = ct(V)), re(V, p.ADD_ATTR, g)), p.ADD_URI_SAFE_ATTR && re(an, p.ADD_URI_SAFE_ATTR, g), p.FORBID_CONTENTS && (De === Ct && (De = ct(De)), re(De, p.FORBID_CONTENTS, g)), Ht && (F["#text"] = !0), ot && re(F, ["html", "head", "body"]), F.table && (re(F, ["tbody"]), delete $e.tbody), p.TRUSTED_TYPES_POLICY) {
        if (typeof p.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw Rn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof p.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw Rn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        Q = p.TRUSTED_TYPES_POLICY, ue = Q.createHTML("");
      } else
        Q === void 0 && (Q = Jl(k, i)), Q !== null && typeof ue == "string" && (ue = Q.createHTML(""));
      Ce && Ce(p), S = p;
    }
  }, I = re({}, [...Br, ...Ur, ...zl]), L = re({}, [...Fr, ...ql]), z = function(p) {
    let R = Y(p);
    (!R || !R.tagName) && (R = {
      namespaceURI: Et,
      tagName: "template"
    });
    const O = rr(p.tagName), fe = rr(R.tagName);
    return cn[p.namespaceURI] ? p.namespaceURI === qt ? R.namespaceURI === Fe ? O === "svg" : R.namespaceURI === zt ? O === "svg" && (fe === "annotation-xml" || Ot[fe]) : !!I[O] : p.namespaceURI === zt ? R.namespaceURI === Fe ? O === "math" : R.namespaceURI === qt ? O === "math" && Lt[fe] : !!L[O] : p.namespaceURI === Fe ? R.namespaceURI === qt && !Lt[fe] || R.namespaceURI === zt && !Ot[fe] ? !1 : !L[O] && (yr[O] || !I[O]) : !!(vt === "application/xhtml+xml" && cn[p.namespaceURI]) : !1;
  }, ae = function(p) {
    xn(e.removed, {
      element: p
    });
    try {
      Y(p).removeChild(p);
    } catch {
      H(p);
    }
  }, pe = function(p, R) {
    try {
      xn(e.removed, {
        attribute: R.getAttributeNode(p),
        from: R
      });
    } catch {
      xn(e.removed, {
        attribute: null,
        from: R
      });
    }
    if (R.removeAttribute(p), p === "is")
      if (bt || Ut)
        try {
          ae(R);
        } catch {
        }
      else
        try {
          R.setAttribute(p, "");
        } catch {
        }
  }, xt = function(p) {
    let R = null, O = null;
    if (rn)
      p = "<remove></remove>" + p;
    else {
      const Ee = $s(p, /^[\r\n\t ]+/);
      O = Ee && Ee[0];
    }
    vt === "application/xhtml+xml" && Et === Fe && (p = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + p + "</body></html>");
    const fe = Q ? Q.createHTML(p) : p;
    if (Et === Fe)
      try {
        R = new d().parseFromString(fe, vt);
      } catch {
      }
    if (!R || !R.documentElement) {
      R = ie.createDocument(Et, "template", null);
      try {
        R.documentElement.innerHTML = ln ? ue : fe;
      } catch {
      }
    }
    const xe = R.body || R.documentElement;
    return p && O && xe.insertBefore(t.createTextNode(O), xe.childNodes[0] || null), Et === Fe ? Ke.call(R, ot ? "html" : "body")[0] : ot ? R.documentElement : xe;
  }, Gt = function(p) {
    return se.call(
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
  function Be(M, p, R) {
    Zn(M, (O) => {
      O.call(e, p, R, S);
    });
  }
  const Fn = function(p) {
    let R = null;
    if (Be(be.beforeSanitizeElements, p, null), It(p))
      return ae(p), !0;
    const O = g(p.nodeName);
    if (Be(be.uponSanitizeElement, p, {
      tagName: O,
      allowedTags: F
    }), Bt && p.hasChildNodes() && !Un(p.firstElementChild) && Te(/<[/\w!]/g, p.innerHTML) && Te(/<[/\w!]/g, p.textContent) || p.nodeType === _n.progressingInstruction || Bt && p.nodeType === _n.comment && Te(/<[/\w]/g, p.data))
      return ae(p), !0;
    if (!F[O] || $e[O]) {
      if (!$e[O] && zn(O) && (K.tagNameCheck instanceof RegExp && Te(K.tagNameCheck, O) || K.tagNameCheck instanceof Function && K.tagNameCheck(O)))
        return !1;
      if (Ht && !De[O]) {
        const fe = Y(p) || p.parentNode, xe = X(p) || p.childNodes;
        if (xe && fe) {
          const Ee = xe.length;
          for (let Se = Ee - 1; Se >= 0; --Se) {
            const Ge = b(xe[Se], !0);
            Ge.__removalCount = (p.__removalCount || 0) + 1, fe.insertBefore(Ge, W(p));
          }
        }
      }
      return ae(p), !0;
    }
    return p instanceof c && !z(p) || (O === "noscript" || O === "noembed" || O === "noframes") && Te(/<\/no(script|embed|frames)/i, p.innerHTML) ? (ae(p), !0) : (wt && p.nodeType === _n.text && (R = p.textContent, Zn([it, st, T], (fe) => {
      R = kn(R, fe, " ");
    }), p.textContent !== R && (xn(e.removed, {
      element: p.cloneNode()
    }), p.textContent = R)), Be(be.afterSanitizeElements, p, null), !1);
  }, Hn = function(p, R, O) {
    if (sn && (R === "id" || R === "name") && (O in t || O in j))
      return !1;
    if (!(Pn && !tn[R] && Te(_, R))) {
      if (!(Nn && Te(U, R))) {
        if (!V[R] || tn[R]) {
          if (
            // First condition does a very basic check if a) it's basically a valid custom element tagname AND
            // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
            !(zn(p) && (K.tagNameCheck instanceof RegExp && Te(K.tagNameCheck, p) || K.tagNameCheck instanceof Function && K.tagNameCheck(p)) && (K.attributeNameCheck instanceof RegExp && Te(K.attributeNameCheck, R) || K.attributeNameCheck instanceof Function && K.attributeNameCheck(R)) || // Alternative, second condition checks if it's an `is`-attribute, AND
            // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            R === "is" && K.allowCustomizedBuiltInElements && (K.tagNameCheck instanceof RegExp && Te(K.tagNameCheck, O) || K.tagNameCheck instanceof Function && K.tagNameCheck(O)))
          ) return !1;
        } else if (!an[R]) {
          if (!Te(G, kn(O, $, ""))) {
            if (!((R === "src" || R === "xlink:href" || R === "href") && p !== "script" && Bl(O, "data:") === 0 && on[p])) {
              if (!(At && !Te(N, kn(O, $, "")))) {
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
    Be(be.beforeSanitizeAttributes, p, null);
    const {
      attributes: R
    } = p;
    if (!R || It(p))
      return;
    const O = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: V,
      forceKeepAttr: void 0
    };
    let fe = R.length;
    for (; fe--; ) {
      const xe = R[fe], {
        name: Ee,
        namespaceURI: Se,
        value: Ge
      } = xe, Ze = g(Ee), pn = Ge;
      let v = Ee === "value" ? pn : Ul(pn);
      if (O.attrName = Ze, O.attrValue = v, O.keepAttr = !0, O.forceKeepAttr = void 0, Be(be.uponSanitizeAttribute, p, O), v = O.attrValue, Mn && (Ze === "id" || Ze === "name") && (pe(Ee, p), v = vr + v), Bt && Te(/((--!?|])>)|<\/(style|title)/i, v)) {
        pe(Ee, p);
        continue;
      }
      if (O.forceKeepAttr)
        continue;
      if (!O.keepAttr) {
        pe(Ee, p);
        continue;
      }
      if (!$n && Te(/\/>/i, v)) {
        pe(Ee, p);
        continue;
      }
      wt && Zn([it, st, T], (ne) => {
        v = kn(v, ne, " ");
      });
      const D = g(p.nodeName);
      if (!Hn(D, Ze, v)) {
        pe(Ee, p);
        continue;
      }
      if (Q && typeof k == "object" && typeof k.getAttributeType == "function" && !Se)
        switch (k.getAttributeType(D, Ze)) {
          case "TrustedHTML": {
            v = Q.createHTML(v);
            break;
          }
          case "TrustedScriptURL": {
            v = Q.createScriptURL(v);
            break;
          }
        }
      if (v !== pn)
        try {
          Se ? p.setAttributeNS(Se, Ee, v) : p.setAttribute(Ee, v), It(p) ? ae(p) : Ps(e.removed);
        } catch {
          pe(Ee, p);
        }
    }
    Be(be.afterSanitizeAttributes, p, null);
  }, jt = function M(p) {
    let R = null;
    const O = Gt(p);
    for (Be(be.beforeSanitizeShadowDOM, p, null); R = O.nextNode(); )
      Be(be.uponSanitizeShadowNode, R, null), Fn(R), hn(R), R.content instanceof o && M(R.content);
    Be(be.afterSanitizeShadowDOM, p, null);
  };
  return e.sanitize = function(M) {
    let p = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, R = null, O = null, fe = null, xe = null;
    if (ln = !M, ln && (M = "<!-->"), typeof M != "string" && !Un(M))
      if (typeof M.toString == "function") {
        if (M = M.toString(), typeof M != "string")
          throw Rn("dirty is not a string, aborting");
      } else
        throw Rn("toString is not a function");
    if (!e.isSupported)
      return M;
    if (nn || me(p), e.removed = [], typeof M == "string" && (Me = !1), Me) {
      if (M.nodeName) {
        const Ge = g(M.nodeName);
        if (!F[Ge] || $e[Ge])
          throw Rn("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (M instanceof a)
      R = xt("<!---->"), O = R.ownerDocument.importNode(M, !0), O.nodeType === _n.element && O.nodeName === "BODY" || O.nodeName === "HTML" ? R = O : R.appendChild(O);
    else {
      if (!bt && !wt && !ot && // eslint-disable-next-line unicorn/prefer-includes
      M.indexOf("<") === -1)
        return Q && Ft ? Q.createHTML(M) : M;
      if (R = xt(M), !R)
        return bt ? null : Ft ? ue : "";
    }
    R && rn && ae(R.firstChild);
    const Ee = Gt(Me ? M : R);
    for (; fe = Ee.nextNode(); )
      Fn(fe), hn(fe), fe.content instanceof o && jt(fe.content);
    if (Me)
      return M;
    if (bt) {
      if (Ut)
        for (xe = q.call(R.ownerDocument); R.firstChild; )
          xe.appendChild(R.firstChild);
      else
        xe = R;
      return (V.shadowroot || V.shadowrootmode) && (xe = mt.call(r, xe, !0)), xe;
    }
    let Se = ot ? R.outerHTML : R.innerHTML;
    return ot && F["!doctype"] && R.ownerDocument && R.ownerDocument.doctype && R.ownerDocument.doctype.name && Te(Jo, R.ownerDocument.doctype.name) && (Se = "<!DOCTYPE " + R.ownerDocument.doctype.name + `>
` + Se), wt && Zn([it, st, T], (Ge) => {
      Se = kn(Se, Ge, " ");
    }), Q && Ft ? Q.createHTML(Se) : Se;
  }, e.setConfig = function() {
    let M = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    me(M), nn = !0;
  }, e.clearConfig = function() {
    S = null, nn = !1;
  }, e.isValidAttribute = function(M, p, R) {
    S || me({});
    const O = g(M), fe = g(p);
    return Hn(O, fe, R);
  }, e.addHook = function(M, p) {
    typeof p == "function" && xn(be[M], p);
  }, e.removeHook = function(M, p) {
    if (p !== void 0) {
      const R = Ml(be[M], p);
      return R === -1 ? void 0 : Dl(be[M], R, 1)[0];
    }
    return Ps(be[M]);
  }, e.removeHooks = function(M) {
    be[M] = [];
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
  let r = ce.parse(n.text);
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
    for (let t in this.node.cards) {
      const r = this.node.cards[t], i = await this.boardView.prepareCard(
        r,
        e
      );
      this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: r.start_msec,
          triggerFunc: () => {
            this.boardView.startCard(i);
          }
        }
      ), r.end_msec !== null && this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: r.end_msec,
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
    for (let t in this.node.sensors) {
      const r = this.node.sensors[t], i = this.boardView.prepareSensor(
        r,
        (o, s) => this.deferredSensorFiring.resolve({
          sensorId: t,
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
      sensorId: t.sensorId,
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
    ], C = (H) => {
      for (const [W, X] of k)
        H = H.split(`${W}*`).join(`${W}{0,${X}}`).split(`${W}+`).join(`${W}{1,${X}}`);
      return H;
    }, b = (H, W, X) => {
      const Y = C(W), Q = f++;
      o(H, Q, W), u[H] = Q, c[Q] = W, l[Q] = Y, s[Q] = new RegExp(W, X ? "g" : void 0), a[Q] = new RegExp(Y, X ? "g" : void 0);
    };
    b("NUMERICIDENTIFIER", "0|[1-9]\\d*"), b("NUMERICIDENTIFIERLOOSE", "\\d+"), b("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${d}*`), b("MAINVERSION", `(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})`), b("MAINVERSIONLOOSE", `(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})`), b("PRERELEASEIDENTIFIER", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIER]})`), b("PRERELEASEIDENTIFIERLOOSE", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIERLOOSE]})`), b("PRERELEASE", `(?:-(${c[u.PRERELEASEIDENTIFIER]}(?:\\.${c[u.PRERELEASEIDENTIFIER]})*))`), b("PRERELEASELOOSE", `(?:-?(${c[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[u.PRERELEASEIDENTIFIERLOOSE]})*))`), b("BUILDIDENTIFIER", `${d}+`), b("BUILD", `(?:\\+(${c[u.BUILDIDENTIFIER]}(?:\\.${c[u.BUILDIDENTIFIER]})*))`), b("FULLPLAIN", `v?${c[u.MAINVERSION]}${c[u.PRERELEASE]}?${c[u.BUILD]}?`), b("FULL", `^${c[u.FULLPLAIN]}$`), b("LOOSEPLAIN", `[v=\\s]*${c[u.MAINVERSIONLOOSE]}${c[u.PRERELEASELOOSE]}?${c[u.BUILD]}?`), b("LOOSE", `^${c[u.LOOSEPLAIN]}$`), b("GTLT", "((?:<|>)?=?)"), b("XRANGEIDENTIFIERLOOSE", `${c[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), b("XRANGEIDENTIFIER", `${c[u.NUMERICIDENTIFIER]}|x|X|\\*`), b("XRANGEPLAIN", `[v=\\s]*(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:${c[u.PRERELEASE]})?${c[u.BUILD]}?)?)?`), b("XRANGEPLAINLOOSE", `[v=\\s]*(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:${c[u.PRERELEASELOOSE]})?${c[u.BUILD]}?)?)?`), b("XRANGE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAIN]}$`), b("XRANGELOOSE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAINLOOSE]}$`), b("COERCEPLAIN", `(^|[^\\d])(\\d{1,${t}})(?:\\.(\\d{1,${t}}))?(?:\\.(\\d{1,${t}}))?`), b("COERCE", `${c[u.COERCEPLAIN]}(?:$|[^\\d])`), b("COERCEFULL", c[u.COERCEPLAIN] + `(?:${c[u.PRERELEASE]})?(?:${c[u.BUILD]})?(?:$|[^\\d])`), b("COERCERTL", c[u.COERCE], !0), b("COERCERTLFULL", c[u.COERCEFULL], !0), b("LONETILDE", "(?:~>?)"), b("TILDETRIM", `(\\s*)${c[u.LONETILDE]}\\s+`, !0), e.tildeTrimReplace = "$1~", b("TILDE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAIN]}$`), b("TILDELOOSE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAINLOOSE]}$`), b("LONECARET", "(?:\\^)"), b("CARETTRIM", `(\\s*)${c[u.LONECARET]}\\s+`, !0), e.caretTrimReplace = "$1^", b("CARET", `^${c[u.LONECARET]}${c[u.XRANGEPLAIN]}$`), b("CARETLOOSE", `^${c[u.LONECARET]}${c[u.XRANGEPLAINLOOSE]}$`), b("COMPARATORLOOSE", `^${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]})$|^$`), b("COMPARATOR", `^${c[u.GTLT]}\\s*(${c[u.FULLPLAIN]})$|^$`), b("COMPARATORTRIM", `(\\s*)${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]}|${c[u.XRANGEPLAIN]})`, !0), e.comparatorTrimReplace = "$1$2$3", b("HYPHENRANGE", `^\\s*(${c[u.XRANGEPLAIN]})\\s+-\\s+(${c[u.XRANGEPLAIN]})\\s*$`), b("HYPHENRANGELOOSE", `^\\s*(${c[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[u.XRANGEPLAINLOOSE]})\\s*$`), b("STAR", "(<|>)?=?\\s*\\*"), b("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), b("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
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
function Xe() {
  if (io) return ni;
  io = 1;
  const n = Le();
  return ni = (t, r, i) => new n(t, i).compare(new n(r, i)), ni;
}
var ri, so;
function wc() {
  if (so) return ri;
  so = 1;
  const n = Xe();
  return ri = (t, r, i) => n(r, t, i), ri;
}
var ii, oo;
function bc() {
  if (oo) return ii;
  oo = 1;
  const n = Xe();
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
  const n = Xe();
  return li = (t, r, i) => n(t, r, i) > 0, li;
}
var ci, ho;
function rs() {
  if (ho) return ci;
  ho = 1;
  const n = Xe();
  return ci = (t, r, i) => n(t, r, i) < 0, ci;
}
var ui, po;
function ra() {
  if (po) return ui;
  po = 1;
  const n = Xe();
  return ui = (t, r, i) => n(t, r, i) === 0, ui;
}
var hi, fo;
function ia() {
  if (fo) return hi;
  fo = 1;
  const n = Xe();
  return hi = (t, r, i) => n(t, r, i) !== 0, hi;
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
function yc() {
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
function xc() {
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
function Ye() {
  if (vo) return wi;
  vo = 1;
  const n = /\s+/g;
  class e {
    constructor(_, U) {
      if (U = i(U), _ instanceof e)
        return _.loose === !!U.loose && _.includePrerelease === !!U.includePrerelease ? _ : new e(_.raw, U);
      if (_ instanceof o)
        return this.raw = _.value, this.set = [[_]], this.formatted = void 0, this;
      if (this.options = U, this.loose = !!U.loose, this.includePrerelease = !!U.includePrerelease, this.raw = _.trim().replace(n, " "), this.set = this.raw.split("||").map((N) => this.parseRange(N.trim())).filter((N) => N.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const N = this.set[0];
        if (this.set = this.set.filter(($) => !b($[0])), this.set.length === 0)
          this.set = [N];
        else if (this.set.length > 1) {
          for (const $ of this.set)
            if ($.length === 1 && H($[0])) {
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
        for (let _ = 0; _ < this.set.length; _++) {
          _ > 0 && (this.formatted += "||");
          const U = this.set[_];
          for (let N = 0; N < U.length; N++)
            N > 0 && (this.formatted += " "), this.formatted += U[N].toString().trim();
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
    parseRange(_) {
      const N = ((this.options.includePrerelease && k) | (this.options.loose && C)) + ":" + _, $ = r.get(N);
      if ($)
        return $;
      const P = this.options.loose, G = P ? c[l.HYPHENRANGELOOSE] : c[l.HYPHENRANGE];
      _ = _.replace(G, it(this.options.includePrerelease)), s("hyphen replace", _), _ = _.replace(c[l.COMPARATORTRIM], u), s("comparator trim", _), _ = _.replace(c[l.TILDETRIM], f), s("tilde trim", _), _ = _.replace(c[l.CARETTRIM], d), s("caret trim", _);
      let F = _.split(" ").map((K) => X(K, this.options)).join(" ").split(/\s+/).map((K) => be(K, this.options));
      P && (F = F.filter((K) => (s("loose invalid filter", K, this.options), !!K.match(c[l.COMPARATORLOOSE])))), s("range list", F);
      const J = /* @__PURE__ */ new Map(), V = F.map((K) => new o(K, this.options));
      for (const K of V) {
        if (b(K))
          return [K];
        J.set(K.value, K);
      }
      J.size > 1 && J.has("") && J.delete("");
      const ve = [...J.values()];
      return r.set(N, ve), ve;
    }
    intersects(_, U) {
      if (!(_ instanceof e))
        throw new TypeError("a Range is required");
      return this.set.some((N) => W(N, U) && _.set.some(($) => W($, U) && N.every((P) => $.every((G) => P.intersects(G, U)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(_) {
      if (!_)
        return !1;
      if (typeof _ == "string")
        try {
          _ = new a(_, this.options);
        } catch {
          return !1;
        }
      for (let U = 0; U < this.set.length; U++)
        if (st(this.set[U], _, this.options))
          return !0;
      return !1;
    }
  }
  wi = e;
  const t = xc(), r = new t(), i = ts(), o = br(), s = mr(), a = Le(), {
    safeRe: c,
    t: l,
    comparatorTrimReplace: u,
    tildeTrimReplace: f,
    caretTrimReplace: d
  } = In(), { FLAG_INCLUDE_PRERELEASE: k, FLAG_LOOSE: C } = gr(), b = (T) => T.value === "<0.0.0-0", H = (T) => T.value === "", W = (T, _) => {
    let U = !0;
    const N = T.slice();
    let $ = N.pop();
    for (; U && N.length; )
      U = N.every((P) => $.intersects(P, _)), $ = N.pop();
    return U;
  }, X = (T, _) => (s("comp", T, _), T = ie(T, _), s("caret", T), T = Q(T, _), s("tildes", T), T = q(T, _), s("xrange", T), T = mt(T, _), s("stars", T), T), Y = (T) => !T || T.toLowerCase() === "x" || T === "*", Q = (T, _) => T.trim().split(/\s+/).map((U) => ue(U, _)).join(" "), ue = (T, _) => {
    const U = _.loose ? c[l.TILDELOOSE] : c[l.TILDE];
    return T.replace(U, (N, $, P, G, F) => {
      s("tilde", T, N, $, P, G, F);
      let J;
      return Y($) ? J = "" : Y(P) ? J = `>=${$}.0.0 <${+$ + 1}.0.0-0` : Y(G) ? J = `>=${$}.${P}.0 <${$}.${+P + 1}.0-0` : F ? (s("replaceTilde pr", F), J = `>=${$}.${P}.${G}-${F} <${$}.${+P + 1}.0-0`) : J = `>=${$}.${P}.${G} <${$}.${+P + 1}.0-0`, s("tilde return", J), J;
    });
  }, ie = (T, _) => T.trim().split(/\s+/).map((U) => se(U, _)).join(" "), se = (T, _) => {
    s("caret", T, _);
    const U = _.loose ? c[l.CARETLOOSE] : c[l.CARET], N = _.includePrerelease ? "-0" : "";
    return T.replace(U, ($, P, G, F, J) => {
      s("caret", T, $, P, G, F, J);
      let V;
      return Y(P) ? V = "" : Y(G) ? V = `>=${P}.0.0${N} <${+P + 1}.0.0-0` : Y(F) ? P === "0" ? V = `>=${P}.${G}.0${N} <${P}.${+G + 1}.0-0` : V = `>=${P}.${G}.0${N} <${+P + 1}.0.0-0` : J ? (s("replaceCaret pr", J), P === "0" ? G === "0" ? V = `>=${P}.${G}.${F}-${J} <${P}.${G}.${+F + 1}-0` : V = `>=${P}.${G}.${F}-${J} <${P}.${+G + 1}.0-0` : V = `>=${P}.${G}.${F}-${J} <${+P + 1}.0.0-0`) : (s("no pr"), P === "0" ? G === "0" ? V = `>=${P}.${G}.${F}${N} <${P}.${G}.${+F + 1}-0` : V = `>=${P}.${G}.${F}${N} <${P}.${+G + 1}.0-0` : V = `>=${P}.${G}.${F} <${+P + 1}.0.0-0`), s("caret return", V), V;
    });
  }, q = (T, _) => (s("replaceXRanges", T, _), T.split(/\s+/).map((U) => Ke(U, _)).join(" ")), Ke = (T, _) => {
    T = T.trim();
    const U = _.loose ? c[l.XRANGELOOSE] : c[l.XRANGE];
    return T.replace(U, (N, $, P, G, F, J) => {
      s("xRange", T, N, $, P, G, F, J);
      const V = Y(P), ve = V || Y(G), K = ve || Y(F), $e = K;
      return $ === "=" && $e && ($ = ""), J = _.includePrerelease ? "-0" : "", V ? $ === ">" || $ === "<" ? N = "<0.0.0-0" : N = "*" : $ && $e ? (ve && (G = 0), F = 0, $ === ">" ? ($ = ">=", ve ? (P = +P + 1, G = 0, F = 0) : (G = +G + 1, F = 0)) : $ === "<=" && ($ = "<", ve ? P = +P + 1 : G = +G + 1), $ === "<" && (J = "-0"), N = `${$ + P}.${G}.${F}${J}`) : ve ? N = `>=${P}.0.0${J} <${+P + 1}.0.0-0` : K && (N = `>=${P}.${G}.0${J} <${P}.${+G + 1}.0-0`), s("xRange return", N), N;
    });
  }, mt = (T, _) => (s("replaceStars", T, _), T.trim().replace(c[l.STAR], "")), be = (T, _) => (s("replaceGTE0", T, _), T.trim().replace(c[_.includePrerelease ? l.GTE0PRE : l.GTE0], "")), it = (T) => (_, U, N, $, P, G, F, J, V, ve, K, $e) => (Y(N) ? U = "" : Y($) ? U = `>=${N}.0.0${T ? "-0" : ""}` : Y(P) ? U = `>=${N}.${$}.0${T ? "-0" : ""}` : G ? U = `>=${U}` : U = `>=${U}${T ? "-0" : ""}`, Y(V) ? J = "" : Y(ve) ? J = `<${+V + 1}.0.0-0` : Y(K) ? J = `<${V}.${+ve + 1}.0-0` : $e ? J = `<=${V}.${ve}.${K}-${$e}` : T ? J = `<${V}.${ve}.${+K + 1}-0` : J = `<=${J}`, `${U} ${J}`.trim()), st = (T, _, U) => {
    for (let N = 0; N < T.length; N++)
      if (!T[N].test(_))
        return !1;
    if (_.prerelease.length && !U.includePrerelease) {
      for (let N = 0; N < T.length; N++)
        if (s(T[N].semver), T[N].semver !== o.ANY && T[N].semver.prerelease.length > 0) {
          const $ = T[N].semver;
          if ($.major === _.major && $.minor === _.minor && $.patch === _.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return wi;
}
var bi, yo;
function br() {
  if (yo) return bi;
  yo = 1;
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
  const t = ts(), { safeRe: r, t: i } = In(), o = sa(), s = mr(), a = Le(), c = Ye();
  return bi;
}
var Ei, xo;
function Er() {
  if (xo) return Ei;
  xo = 1;
  const n = Ye();
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
  const n = Ye();
  return vi = (t, r) => new n(t, r).set.map((i) => i.map((o) => o.value).join(" ").trim().split(" ")), vi;
}
var yi, Ro;
function Rc() {
  if (Ro) return yi;
  Ro = 1;
  const n = Le(), e = Ye();
  return yi = (r, i, o) => {
    let s = null, a = null, c = null;
    try {
      c = new e(i, o);
    } catch {
      return null;
    }
    return r.forEach((l) => {
      c.test(l) && (!s || a.compare(l) === -1) && (s = l, a = new n(s, o));
    }), s;
  }, yi;
}
var xi, So;
function Sc() {
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
      c.test(l) && (!s || a.compare(l) === 1) && (s = l, a = new n(s, o));
    }), s;
  }, xi;
}
var ki, _o;
function _c() {
  if (_o) return ki;
  _o = 1;
  const n = Le(), e = Ye(), t = wr();
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
  const n = Ye();
  return Ri = (t, r) => {
    try {
      return new n(t, r).range || "*";
    } catch {
      return null;
    }
  }, Ri;
}
var Si, Ao;
function os() {
  if (Ao) return Si;
  Ao = 1;
  const n = Le(), e = br(), { ANY: t } = e, r = Ye(), i = Er(), o = wr(), s = rs(), a = ss(), c = is();
  return Si = (u, f, d, k) => {
    u = new n(u, k), f = new r(f, k);
    let C, b, H, W, X;
    switch (d) {
      case ">":
        C = o, b = a, H = s, W = ">", X = ">=";
        break;
      case "<":
        C = s, b = c, H = o, W = "<", X = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (i(u, f, k))
      return !1;
    for (let Y = 0; Y < f.set.length; ++Y) {
      const Q = f.set[Y];
      let ue = null, ie = null;
      if (Q.forEach((se) => {
        se.semver === t && (se = new e(">=0.0.0")), ue = ue || se, ie = ie || se, C(se.semver, ue.semver, k) ? ue = se : H(se.semver, ie.semver, k) && (ie = se);
      }), ue.operator === W || ue.operator === X || (!ie.operator || ie.operator === W) && b(u, ie.semver))
        return !1;
      if (ie.operator === X && H(u, ie.semver))
        return !1;
    }
    return !0;
  }, Si;
}
var _i, Co;
function Ac() {
  if (Co) return _i;
  Co = 1;
  const n = os();
  return _i = (t, r, i) => n(t, r, ">", i), _i;
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
  const n = Ye();
  return Ai = (t, r, i) => (t = new n(t, i), r = new n(r, i), t.intersects(r, i)), Ai;
}
var Ci, Io;
function Lc() {
  if (Io) return Ci;
  Io = 1;
  const n = Er(), e = Xe();
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
  const n = Ye(), e = br(), { ANY: t } = e, r = Er(), i = Xe(), o = (f, d, k = {}) => {
    if (f === d)
      return !0;
    f = new n(f, k), d = new n(d, k);
    let C = !1;
    e: for (const b of f.set) {
      for (const H of d.set) {
        const W = c(b, H, k);
        if (C = C || W !== null, W)
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
    let b, H;
    for (const q of f)
      q.operator === ">" || q.operator === ">=" ? b = l(b, q, k) : q.operator === "<" || q.operator === "<=" ? H = u(H, q, k) : C.add(q.semver);
    if (C.size > 1)
      return null;
    let W;
    if (b && H) {
      if (W = i(b.semver, H.semver, k), W > 0)
        return null;
      if (W === 0 && (b.operator !== ">=" || H.operator !== "<="))
        return null;
    }
    for (const q of C) {
      if (b && !r(q, String(b), k) || H && !r(q, String(H), k))
        return null;
      for (const Ke of d)
        if (!r(q, String(Ke), k))
          return !1;
      return !0;
    }
    let X, Y, Q, ue, ie = H && !k.includePrerelease && H.semver.prerelease.length ? H.semver : !1, se = b && !k.includePrerelease && b.semver.prerelease.length ? b.semver : !1;
    ie && ie.prerelease.length === 1 && H.operator === "<" && ie.prerelease[0] === 0 && (ie = !1);
    for (const q of d) {
      if (ue = ue || q.operator === ">" || q.operator === ">=", Q = Q || q.operator === "<" || q.operator === "<=", b) {
        if (se && q.semver.prerelease && q.semver.prerelease.length && q.semver.major === se.major && q.semver.minor === se.minor && q.semver.patch === se.patch && (se = !1), q.operator === ">" || q.operator === ">=") {
          if (X = l(b, q, k), X === q && X !== b)
            return !1;
        } else if (b.operator === ">=" && !r(b.semver, String(q), k))
          return !1;
      }
      if (H) {
        if (ie && q.semver.prerelease && q.semver.prerelease.length && q.semver.major === ie.major && q.semver.minor === ie.minor && q.semver.patch === ie.patch && (ie = !1), q.operator === "<" || q.operator === "<=") {
          if (Y = u(H, q, k), Y === q && Y !== H)
            return !1;
        } else if (H.operator === "<=" && !r(H.semver, String(q), k))
          return !1;
      }
      if (!q.operator && (H || b) && W !== 0)
        return !1;
    }
    return !(b && Q && !H && W !== 0 || H && ue && !b && W !== 0 || se || ie);
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
  const n = In(), e = gr(), t = Le(), r = na(), i = en(), o = cc(), s = uc(), a = hc(), c = pc(), l = fc(), u = dc(), f = gc(), d = mc(), k = Xe(), C = wc(), b = bc(), H = ns(), W = Ec(), X = vc(), Y = wr(), Q = rs(), ue = ra(), ie = ia(), se = is(), q = ss(), Ke = sa(), mt = yc(), be = br(), it = Ye(), st = Er(), T = kc(), _ = Rc(), U = Sc(), N = _c(), $ = Tc(), P = os(), G = Ac(), F = Cc(), J = Oc(), V = Lc(), ve = Ic();
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
    compareLoose: b,
    compareBuild: H,
    sort: W,
    rsort: X,
    gt: Y,
    lt: Q,
    eq: ue,
    neq: ie,
    gte: se,
    lte: q,
    cmp: Ke,
    coerce: mt,
    Comparator: be,
    Range: it,
    satisfies: st,
    toComparators: T,
    maxSatisfying: _,
    minSatisfying: U,
    minVersion: N,
    validRange: $,
    outside: P,
    gtr: G,
    ltr: F,
    intersects: J,
    simplifyRange: V,
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
  t || (t = (X) => {
  });
  const i = new Pc(r, t), o = Aa(), s = new ja();
  o.appendChild(s.root);
  const a = Va();
  if (o.appendChild(a), Ii.gt(n.nodekit_version, Jn) || Ii.major(n.nodekit_version) !== Ii.major(Jn))
    throw new Error(`Incompatible NodeKit version. Timeline version: ${n.nodekit_version}, NodeKit version: ${Jn}`);
  if (!Ta()) {
    const X = new Error("Unsupported device for NodeKit. Please use a desktop browser.");
    throw s.showErrorOverlay(X), X;
  }
  s.showSessionConnectingOverlay();
  const c = new Ca();
  for (const X of e)
    c.registerAsset(X);
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
      const X = {
        event_type: "LeaveEvent",
        t: l.now()
      };
      i.push(X);
    } else if (document.visibilityState === "visible") {
      const X = {
        event_type: "ReturnEvent",
        t: l.now()
      };
      i.push(X);
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
  const C = n.nodes;
  let b = n.start_node_id;
  for (; b !== "END"; ) {
    const X = C[b], Y = new lc(
      X
    );
    a.appendChild(Y.boardView.root), await Y.prepare(c);
    let Q = await Y.run();
    const ue = {
      event_type: "NodeEnterEvent",
      t: l.convertDomTimestampToClockTime(Q.domTimestampStart),
      node_id: b
    };
    i.push(ue);
    const ie = {
      event_type: "NodeExitEvent",
      t: l.convertDomTimestampToClockTime(Q.domTimestampAction),
      node_id: b,
      sensor_id: Q.sensorId,
      action: Q.action
    };
    for (i.push(ie); a.firstChild; )
      a.removeChild(a.firstChild);
    b = n.transitions[b][Q.sensorId];
  }
  await s.playEndScreen();
  const H = {
    event_type: "EndEvent",
    t: l.now()
  };
  i.push(H), document.removeEventListener("visibilitychange", f);
  const W = {
    nodekit_version: Jn,
    events: i.events
  };
  return s.showConsoleMessageOverlay(
    "Trace",
    W
  ), W;
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
