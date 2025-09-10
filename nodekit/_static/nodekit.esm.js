var gr = Object.defineProperty;
var mr = (n, e, t) => e in n ? gr(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var X = (n, e, t) => mr(n, typeof e != "symbol" ? e + "" : e, t);
var wr = "2.0.4", Di = 500, cs = "user-agent", zt = "", us = "?", Qn = "function", ut = "undefined", Ht = "object", Ni = "string", we = "browser", Ye = "cpu", Fe = "device", Pe = "engine", Ae = "os", Bt = "result", b = "name", f = "type", m = "vendor", x = "version", be = "architecture", vn = "major", g = "model", bn = "console", P = "mobile", G = "tablet", ie = "smarttv", ze = "wearable", Fn = "xr", xn = "embedded", sn = "inapp", Gi = "brands", yt = "formFactors", Wi = "fullVersionList", Ut = "platform", qi = "platformVersion", si = "bitness", ht = "sec-ch-ua", br = ht + "-full-version-list", xr = ht + "-arch", _r = ht + "-" + si, vr = ht + "-form-factors", kr = ht + "-" + P, yr = ht + "-" + g, $s = ht + "-" + Ut, Er = $s + "-version", Fs = [Gi, Wi, P, g, Ut, qi, be, yt, si], Vn = "Amazon", Dt = "Apple", hs = "ASUS", ds = "BlackBerry", _t = "Google", ps = "Huawei", wi = "Lenovo", fs = "Honor", jn = "LG", bi = "Microsoft", xi = "Motorola", _i = "Nvidia", gs = "OnePlus", vi = "OPPO", rn = "Samsung", ms = "Sharp", on = "Sony", ki = "Xiaomi", yi = "Zebra", ws = "Chrome", bs = "Chromium", lt = "Chromecast", Yn = "Edge", an = "Firefox", ln = "Opera", Ei = "Facebook", xs = "Sogou", Nt = "Mobile ", cn = " Browser", Bi = "Windows", Sr = typeof window !== ut, xe = Sr && window.navigator ? window.navigator : void 0, ct = xe && xe.userAgentData ? xe.userAgentData : void 0, Tr = function(n, e) {
  var t = {}, i = e;
  if (!Jn(e)) {
    i = {};
    for (var s in e)
      for (var r in e[s])
        i[r] = e[s][r].concat(i[r] ? i[r] : []);
  }
  for (var a in n)
    t[a] = i[a] && i[a].length % 2 === 0 ? i[a].concat(n[a]) : n[a];
  return t;
}, ri = function(n) {
  for (var e = {}, t = 0; t < n.length; t++)
    e[n[t].toUpperCase()] = n[t];
  return e;
}, Ui = function(n, e) {
  if (typeof n === Ht && n.length > 0) {
    for (var t in n)
      if (Ze(e) == Ze(n[t])) return !0;
    return !1;
  }
  return Ft(n) ? Ze(e) == Ze(n) : !1;
}, Jn = function(n, e) {
  for (var t in n)
    return /^(browser|cpu|device|engine|os)$/.test(t) || (e ? Jn(n[t]) : !1);
}, Ft = function(n) {
  return typeof n === Ni;
}, Si = function(n) {
  if (n) {
    for (var e = [], t = $t(/\\?\"/g, n).split(","), i = 0; i < t.length; i++)
      if (t[i].indexOf(";") > -1) {
        var s = ei(t[i]).split(";v=");
        e[i] = { brand: s[0], version: s[1] };
      } else
        e[i] = ei(t[i]);
    return e;
  }
}, Ze = function(n) {
  return Ft(n) ? n.toLowerCase() : n;
}, Ti = function(n) {
  return Ft(n) ? $t(/[^\d\.]/g, n).split(".")[0] : void 0;
}, Ke = function(n) {
  for (var e in n) {
    var t = n[e];
    typeof t == Ht && t.length == 2 ? this[t[0]] = t[1] : this[t] = void 0;
  }
  return this;
}, $t = function(n, e) {
  return Ft(e) ? e.replace(n, zt) : e;
}, un = function(n) {
  return $t(/\\?\"/g, n);
}, ei = function(n, e) {
  if (Ft(n))
    return n = $t(/^\s\s*/, n), typeof e === ut ? n : n.substring(0, Di);
}, Ai = function(n, e) {
  if (!(!n || !e))
    for (var t = 0, i, s, r, a, c, h; t < e.length && !c; ) {
      var u = e[t], p = e[t + 1];
      for (i = s = 0; i < u.length && !c && u[i]; )
        if (c = u[i++].exec(n), c)
          for (r = 0; r < p.length; r++)
            h = c[++s], a = p[r], typeof a === Ht && a.length > 0 ? a.length === 2 ? typeof a[1] == Qn ? this[a[0]] = a[1].call(this, h) : this[a[0]] = a[1] : a.length >= 3 && (typeof a[1] === Qn && !(a[1].exec && a[1].test) ? a.length > 3 ? this[a[0]] = h ? a[1].apply(this, a.slice(2)) : void 0 : this[a[0]] = h ? a[1].call(this, h, a[2]) : void 0 : a.length == 3 ? this[a[0]] = h ? h.replace(a[1], a[2]) : void 0 : a.length == 4 ? this[a[0]] = h ? a[3].call(this, h.replace(a[1], a[2])) : void 0 : a.length > 4 && (this[a[0]] = h ? a[3].apply(this, [h.replace(a[1], a[2])].concat(a.slice(4))) : void 0)) : this[a] = h || void 0;
      t += 2;
    }
}, $e = function(n, e) {
  for (var t in e)
    if (typeof e[t] === Ht && e[t].length > 0) {
      for (var i = 0; i < e[t].length; i++)
        if (Ui(e[t][i], n))
          return t === us ? void 0 : t;
    } else if (Ui(e[t], n))
      return t === us ? void 0 : t;
  return e.hasOwnProperty("*") ? e["*"] : n;
}, _s = {
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
}, vs = {
  embedded: "Automotive",
  mobile: "Mobile",
  tablet: ["Tablet", "EInk"],
  smarttv: "TV",
  wearable: "Watch",
  xr: ["VR", "XR"],
  "?": ["Desktop", "Unknown"],
  "*": void 0
}, Ar = {
  Chrome: "Google Chrome",
  Edge: "Microsoft Edge",
  "Edge WebView2": "Microsoft Edge WebView2",
  "Chrome WebView": "Android WebView",
  "Chrome Headless": "HeadlessChrome",
  "Huawei Browser": "HuaweiBrowser",
  "MIUI Browser": "Miui Browser",
  "Opera Mobi": "OperaMobile",
  Yandex: "YaBrowser"
}, ks = {
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
    [x, [b, Yn + " WebView"]],
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
    [x, [b, ln + " Mini"]],
    [
      /\bop(?:rg)?x\/([\w\.]+)/i
      // Opera GX
    ],
    [x, [b, ln + " GX"]],
    [
      /\bopr\/([\w\.]+)/i
      // Opera Webkit
    ],
    [x, [b, ln]],
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
    [x, [b, "Smart " + wi + cn]],
    [
      /(avast|avg)\/([\w\.]+)/i
      // Avast/AVG Secure Browser
    ],
    [[b, /(.+)/, "$1 Secure" + cn], x],
    [
      /\bfocus\/([\w\.]+)/i
      // Firefox Focus
    ],
    [x, [b, an + " Focus"]],
    [
      /\bopt\/([\w\.]+)/i
      // Opera Touch
    ],
    [x, [b, ln + " Touch"]],
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
    [x, [b, ln + " Coast"]],
    [
      /miuibrowser\/([\w\.]+)/i
      // MIUI Browser
    ],
    [x, [b, "MIUI" + cn]],
    [
      /fxios\/([\w\.-]+)/i
      // Firefox for iOS
    ],
    [x, [b, Nt + an]],
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
    [[b, /(.+)/, "$1" + cn], x],
    [
      // Oculus/Sailfish/HuaweiBrowser/VivoBrowser/PicoBrowser
      /samsungbrowser\/([\w\.]+)/i
      // Samsung Internet
    ],
    [x, [b, rn + " Internet"]],
    [
      /metasr[\/ ]?([\d\.]+)/i
      // Sogou Explorer
    ],
    [x, [b, xs + " Explorer"]],
    [
      /(sogou)mo\w+\/([\d\.]+)/i
      // Sogou Mobile
    ],
    [[b, xs + " Mobile"], x],
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
    [[b, Ei], x, [f, sn]],
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
    [b, x, [f, sn]],
    [
      /\bgsa\/([\w\.]+) .*safari\//i
      // Google Search Appliance on iOS
    ],
    [x, [b, "GSA"], [f, sn]],
    [
      /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i
      // TikTok
    ],
    [x, [b, "TikTok"], [f, sn]],
    [
      /\[(linkedin)app\]/i
      // LinkedIn App for iOS & Android
    ],
    [b, [f, sn]],
    [
      /(chromium)[\/ ]([-\w\.]+)/i
      // Chromium
    ],
    [b, x],
    [
      /headlesschrome(?:\/([\w\.]+)| )/i
      // Chrome Headless
    ],
    [x, [b, ws + " Headless"]],
    [
      /wv\).+chrome\/([\w\.]+).+edgw\//i
      // Edge WebView2
    ],
    [x, [b, Yn + " WebView2"]],
    [
      / wv\).+(chrome)\/([\w\.]+)/i
      // Chrome WebView
    ],
    [[b, ws + " WebView"], x],
    [
      /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
      // Android Browser
    ],
    [x, [b, "Android" + cn]],
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
    [[b, Nt + an], x],
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
    [x, [b, an + " Reality"]],
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
    [[be, /ower/, zt, Ze]],
    [
      / sun4\w[;\)]/i
      // SPARC
    ],
    [[be, "sparc"]],
    [
      /\b(avr32|ia64(?=;)|68k(?=\))|\barm(?=v([1-7]|[5-7]1)l?|;|eabi)|(irix|mips|sparc)(64)?\b|pa-risc)/i
      // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
    ],
    [[be, Ze]]
  ],
  device: [
    [
      //////////////////////////
      // MOBILES & TABLETS
      /////////////////////////
      // Samsung
      /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
    ],
    [g, [m, rn], [f, G]],
    [
      /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
      /samsung[- ]((?!sm-[lr]|browser)[-\w]+)/i,
      /sec-(sgh\w+)/i
    ],
    [g, [m, rn], [f, P]],
    [
      // Apple
      /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i
      // iPod/iPhone
    ],
    [g, [m, Dt], [f, P]],
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
    [g, [m, ms], [f, P]],
    [
      // Honor
      /\b((?:brt|eln|hey2?|gdi|jdn)-a?[lnw]09|(?:ag[rm]3?|jdn2|kob2)-a?[lw]0[09]hn)(?: bui|\)|;)/i
    ],
    [g, [m, fs], [f, G]],
    [
      /honor([-\w ]+)[;\)]/i
    ],
    [g, [m, fs], [f, P]],
    [
      // Huawei
      /\b((?:ag[rs][2356]?k?|bah[234]?|bg[2o]|bt[kv]|cmr|cpn|db[ry]2?|jdn2|got|kob2?k?|mon|pce|scm|sht?|[tw]gr|vrd)-[ad]?[lw][0125][09]b?|605hw|bg2-u03|(?:gem|fdr|m2|ple|t1)-[7a]0[1-4][lu]|t1-a2[13][lw]|mediapad[\w\. ]*(?= bui|\)))\b(?!.+d\/s)/i
    ],
    [g, [m, ps], [f, G]],
    [
      /(?:huawei)([-\w ]+)[;\)]/i,
      /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
    ],
    [g, [m, ps], [f, P]],
    [
      // Xiaomi
      /oid[^\)]+; (2[\dbc]{4}(182|283|rp\w{2})[cgl]|m2105k81a?c)(?: bui|\))/i,
      /\b((?:red)?mi[-_ ]?pad[\w- ]*)(?: bui|\))/i
      // Mi Pad tablets
    ],
    [[g, /_/g, " "], [m, ki], [f, G]],
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
    [[g, /_/g, " "], [m, ki], [f, P]],
    [
      // OnePlus
      /droid.+; (cph2[3-6]\d[13579]|((gm|hd)19|(ac|be|in|kb)20|(d[en]|eb|le|mt)21|ne22)[0-2]\d|p[g-k]\w[1m]10)\b/i,
      /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
    ],
    [g, [m, gs], [f, P]],
    [
      // OPPO
      /; (\w+) bui.+ oppo/i,
      /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
    ],
    [g, [m, vi], [f, P]],
    [
      /\b(opd2(\d{3}a?))(?: bui|\))/i
    ],
    [g, [m, $e, { OnePlus: ["203", "304", "403", "404", "413", "415"], "*": vi }], [f, G]],
    [
      // BLU
      /(vivo (5r?|6|8l?|go|one|s|x[il]?[2-4]?)[\w\+ ]*)(?: bui|\))/i
      // Vivo series
    ],
    [g, [m, "BLU"], [f, P]],
    [
      // Vivo
      /; vivo (\w+)(?: bui|\))/i,
      /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
    ],
    [g, [m, "Vivo"], [f, P]],
    [
      // Realme
      /\b(rmx[1-3]\d{3})(?: bui|;|\))/i
    ],
    [g, [m, "Realme"], [f, P]],
    [
      // Lenovo
      /(ideatab[-\w ]+|602lv|d-42a|a101lv|a2109a|a3500-hv|s[56]000|pb-6505[my]|tb-?x?\d{3,4}(?:f[cu]|xu|[av])|yt\d?-[jx]?\d+[lfmx])( bui|;|\)|\/)/i,
      /lenovo ?(b[68]0[08]0-?[hf]?|tab(?:[\w- ]+?)|tb[\w-]{6,7})( bui|;|\)|\/)/i
    ],
    [g, [m, wi], [f, G]],
    [
      /lenovo[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i
    ],
    [g, [m, wi], [f, P]],
    [
      // Motorola
      /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
      /\bmot(?:orola)?[- ]([\w\s]+)(\)| bui)/i,
      /((?:moto(?! 360)[-\w\(\) ]+|xt\d{3,4}[cgkosw\+]?[-\d]*|nexus 6)(?= bui|\)))/i
    ],
    [g, [m, xi], [f, P]],
    [
      /\b(mz60\d|xoom[2 ]{0,2}) build\//i
    ],
    [g, [m, xi], [f, G]],
    [
      // LG
      /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
    ],
    [g, [m, jn], [f, G]],
    [
      /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
      /\blg[-e;\/ ]+(?!.*(?:browser|netcast|android tv|watch|webos))(\w+)/i,
      /\blg-?([\d\w]+) bui/i
    ],
    [g, [m, jn], [f, P]],
    [
      // Nokia
      /(nokia) (t[12][01])/i
    ],
    [m, g, [f, G]],
    [
      /(?:maemo|nokia).*(n900|lumia \d+|rm-\d+)/i,
      /nokia[-_ ]?(([-\w\. ]*))/i
    ],
    [[g, /_/g, " "], [f, P], [m, "Nokia"]],
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
    [g, [m, _t], [f, P]],
    [
      /(google) (pixelbook( go)?)/i
    ],
    [m, g],
    [
      // Sony
      /droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-\w\w\d\d)(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
    ],
    [g, [m, on], [f, P]],
    [
      /sony tablet [ps]/i,
      /\b(?:sony)?sgp\w+(?: bui|\))/i
    ],
    [[g, "Xperia Tablet"], [m, on], [f, G]],
    [
      // Amazon
      /(alexa)webm/i,
      /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,
      // Kindle Fire without Silk / Echo Show
      /(kf[a-z]+)( bui|\)).+silk\//i
      // Kindle Fire HD
    ],
    [g, [m, Vn], [f, G]],
    [
      /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
      // Fire Phone
    ],
    [[g, /(.+)/g, "Fire Phone $1"], [m, Vn], [f, P]],
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
    [g, [m, ds], [f, P]],
    [
      // Asus
      /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
    ],
    [g, [m, hs], [f, G]],
    [
      / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
    ],
    [g, [m, hs], [f, P]],
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
    [m, [g, /_/g, " "], [f, P]],
    [
      // TCL
      /tcl (xess p17aa)/i,
      /droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])(_\w(\w|\w\w))?(\)| bui)/i
    ],
    [g, [m, "TCL"], [f, G]],
    [
      /droid [\w\.]+; (418(?:7d|8v)|5087z|5102l|61(?:02[dh]|25[adfh]|27[ai]|56[dh]|59k|65[ah])|a509dl|t(?:43(?:0w|1[adepqu])|50(?:6d|7[adju])|6(?:09dl|10k|12b|71[efho]|76[hjk])|7(?:66[ahju]|67[hw]|7[045][bh]|71[hk]|73o|76[ho]|79w|81[hks]?|82h|90[bhsy]|99b)|810[hs]))(_\w(\w|\w\w))?(\)| bui)/i
    ],
    [g, [m, "TCL"], [f, P]],
    [
      // itel
      /(itel) ((\w+))/i
    ],
    [[m, Ze], g, [f, $e, { tablet: ["p10001l", "w7001"], "*": "mobile" }]],
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
    [g, [m, "Meizu"], [f, P]],
    [
      // Ulefone
      /; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i
    ],
    [g, [m, "Ulefone"], [f, P]],
    [
      // Energizer
      /; (energy ?\w+)(?: bui|\))/i,
      /; energizer ([\w ]+)(?: bui|\))/i
    ],
    [g, [m, "Energizer"], [f, P]],
    [
      // Cat
      /; cat (b35);/i,
      /; (b15q?|s22 flip|s48c|s62 pro)(?: bui|\))/i
    ],
    [g, [m, "Cat"], [f, P]],
    [
      // Smartfren
      /((?:new )?andromax[\w- ]+)(?: bui|\))/i
    ],
    [g, [m, "Smartfren"], [f, P]],
    [
      // Nothing
      /droid.+; (a(in)?(0(15|59|6[35])|142)p?)/i
    ],
    [g, [m, "Nothing"], [f, P]],
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
    [g, [m, "Archos"], [f, P]],
    [
      // HMD
      /; (n159v)/i
    ],
    [g, [m, "HMD"], [f, P]],
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
    [m, g, [f, P]],
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
    [g, [m, bi], [f, G]],
    [
      /droid [\d\.]+; (fp\du?)(?: b|\))/i
      // Fairphone
    ],
    [g, [m, "Fairphone"], [f, P]],
    [
      /((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i
      // Nvidia Tablets
    ],
    [g, [m, _i], [f, G]],
    [
      /(sprint) (\w+)/i
      // Sprint Phones
    ],
    [m, g, [f, P]],
    [
      /(kin\.[onetw]{3})/i
      // Microsoft Kin
    ],
    [[g, /\./g, " "], [m, bi], [f, P]],
    [
      /droid.+; ([c6]+|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
      // Zebra
    ],
    [g, [m, yi], [f, G]],
    [
      /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
    ],
    [g, [m, yi], [f, P]],
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
    [[g, /^/, "SmartTV"], [m, rn], [f, ie]],
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
    [[m, jn], [f, ie]],
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
    [g, [m, Ei], [f, ie]],
    [
      /droid.+aft(\w+)( bui|\))/i
      // Fire TV
    ],
    [g, [m, Vn], [f, ie]],
    [
      /(shield \w+ tv)/i
      // Nvidia Shield TV
    ],
    [g, [m, _i], [f, ie]],
    [
      /\(dtv[\);].+(aquos)/i,
      /(aquos-tv[\w ]+)\)/i
      // Sharp
    ],
    [g, [m, ms], [f, ie]],
    [
      /(bravia[\w ]+)( bui|\))/i
      // Sony
    ],
    [g, [m, on], [f, ie]],
    [
      /(mi(tv|box)-?\w+) bui/i
      // Xiaomi
    ],
    [g, [m, ki], [f, ie]],
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
    [[m, /.+\/(\w+)/, "$1", $e, { LG: "lge" }], [g, ei], [f, ie]],
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
    [g, [m, on], [f, bn]],
    [
      /\b(xbox(?: one)?(?!; xbox))[\); ]/i
      // Microsoft Xbox
    ],
    [g, [m, bi], [f, bn]],
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
    [g, [m, _i], [f, bn]],
    [
      ///////////////////
      // WEARABLES
      ///////////////////
      /\b(sm-[lr]\d\d[0156][fnuw]?s?|gear live)\b/i
      // Samsung Galaxy Watch
    ],
    [g, [m, rn], [f, ze]],
    [
      /((pebble))app/i,
      // Pebble
      /(asus|google|lg|oppo) ((pixel |zen)?watch[\w ]*)( bui|\))/i
      // Asus ZenWatch / LG Watch / Pixel Watch
    ],
    [m, g, [f, ze]],
    [
      /(ow(?:19|20)?we?[1-3]{1,3})/i
      // Oppo Watch
    ],
    [g, [m, vi], [f, ze]],
    [
      /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i
      // Apple Watch
    ],
    [g, [m, Dt], [f, ze]],
    [
      /(opwwe\d{3})/i
      // OnePlus Watch
    ],
    [g, [m, gs], [f, ze]],
    [
      /(moto 360)/i
      // Motorola 360
    ],
    [g, [m, xi], [f, ze]],
    [
      /(smartwatch 3)/i
      // Sony SmartWatch
    ],
    [g, [m, on], [f, ze]],
    [
      /(g watch r)/i
      // LG G Watch R
    ],
    [g, [m, jn], [f, ze]],
    [
      /droid.+; (wt63?0{2,3})\)/i
    ],
    [g, [m, yi], [f, ze]],
    [
      ///////////////////
      // XR
      ///////////////////
      /droid.+; (glass) \d/i
      // Google Glass
    ],
    [g, [m, _t], [f, Fn]],
    [
      /(pico) (4|neo3(?: link|pro)?)/i
      // Pico
    ],
    [m, g, [f, Fn]],
    [
      /(quest( \d| pro)?s?).+vr/i
      // Meta Quest
    ],
    [g, [m, Ei], [f, Fn]],
    [
      /mobile vr; rv.+firefox/i
      // Unidentifiable VR device using Firefox Reality / Wolvic
    ],
    [[f, Fn]],
    [
      ///////////////////
      // EMBEDDED
      ///////////////////
      /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i
      // Tesla
    ],
    [m, [f, xn]],
    [
      /(aeobc)\b/i
      // Echo Dot
    ],
    [g, [m, Vn], [f, xn]],
    [
      /(homepod).+mac os/i
      // Apple HomePod
    ],
    [g, [m, Dt], [f, xn]],
    [
      /windows iot/i
      // Unidentifiable embedded device using Windows IoT
    ],
    [[f, xn]],
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
    [[f, P]],
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
    [x, [b, Yn + "HTML"]],
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
    [[b, /N/, "R"], [x, $e, _s]],
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
    [[x, /(;|\))/g, "", $e, _s], [b, Bi]],
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
    [x, [b, ds]],
    [
      /(?:symbian ?os|symbos|s60(?=;)|series ?60)[-\/ ]?([\w\.]*)/i
      // Symbian
    ],
    [x, [b, "Symbian"]],
    [
      /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
      // Firefox OS
    ],
    [x, [b, an + " OS"]],
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
}, Gn = (function() {
  var n = { init: {}, isIgnore: {}, isIgnoreRgx: {}, toString: {} };
  return Ke.call(n.init, [
    [we, [b, x, vn, f]],
    [Ye, [be]],
    [Fe, [f, g, m]],
    [Pe, [b, x]],
    [Ae, [b, x]]
  ]), Ke.call(n.isIgnore, [
    [we, [x, vn]],
    [Pe, [x]],
    [Ae, [x]]
  ]), Ke.call(n.isIgnoreRgx, [
    [we, / ?browser$/i],
    [Ae, / ?os$/i]
  ]), Ke.call(n.toString, [
    [we, [b, x]],
    [Ye, [be]],
    [Fe, [m, g]],
    [Pe, [b, x]],
    [Ae, [b, x]]
  ]), n;
})(), Cr = function(n, e) {
  var t = Gn.init[e], i = Gn.isIgnore[e] || 0, s = Gn.isIgnoreRgx[e] || 0, r = Gn.toString[e] || 0;
  function a() {
    Ke.call(this, t);
  }
  return a.prototype.getItem = function() {
    return n;
  }, a.prototype.withClientHints = function() {
    return ct ? ct.getHighEntropyValues(Fs).then(function(c) {
      return n.setCH(new Vs(c, !1)).parseCH().get();
    }) : n.parseCH().get();
  }, a.prototype.withFeatureCheck = function() {
    return n.detectFeature().get();
  }, e != Bt && (a.prototype.is = function(c) {
    var h = !1;
    for (var u in this)
      if (this.hasOwnProperty(u) && !Ui(i, u) && Ze(s ? $t(s, this[u]) : this[u]) == Ze(s ? $t(s, c) : c)) {
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
      for (var M in h)
        h.hasOwnProperty(M) && (this[M] = h[M]);
    };
    u.prototype = {
      is: a.prototype.is,
      toString: a.prototype.toString
    };
    var p = new u();
    return c(p), p;
  }), new a();
};
function Vs(n, e) {
  if (n = n || {}, Ke.call(this, Fs), e)
    Ke.call(this, [
      [Gi, Si(n[ht])],
      [Wi, Si(n[br])],
      [P, /\?1/.test(n[kr])],
      [g, un(n[yr])],
      [Ut, un(n[$s])],
      [qi, un(n[Er])],
      [be, un(n[xr])],
      [yt, Si(n[vr])],
      [si, un(n[_r])]
    ]);
  else
    for (var t in n)
      this.hasOwnProperty(t) && typeof n[t] !== ut && (this[t] = n[t]);
}
function ys(n, e, t, i) {
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
          xe.brave && typeof xe.brave.isBrave == Qn && this.set(b, "Brave");
          break;
        case Fe:
          !this.get(f) && ct && ct[P] && this.set(f, P), this.get(g) == "Macintosh" && xe && typeof xe.standalone !== ut && xe.maxTouchPoints && xe.maxTouchPoints > 2 && this.set(g, "iPad").set(f, G);
          break;
        case Ae:
          !this.get(b) && ct && ct[Ut] && this.set(b, ct[Ut]);
          break;
        case Bt:
          var s = this.data, r = function(a) {
            return s[a].getItem().detectFeature().get();
          };
          this.set(we, r(we)).set(Ye, r(Ye)).set(Fe, r(Fe)).set(Pe, r(Pe)).set(Ae, r(Ae));
      }
    return this;
  }, this.parseUA = function() {
    return this.itemType != Bt && Ai.call(this.data, this.ua, this.rgxMap), this.itemType == we && this.set(vn, Ti(this.get(x))), this;
  }, this.parseCH = function() {
    var s = this.uaCH, r = this.rgxMap;
    switch (this.itemType) {
      case we:
      case Pe:
        var a = s[Wi] || s[Gi], c;
        if (a)
          for (var h in a) {
            var u = a[h].brand || a[h], p = a[h].version;
            this.itemType == we && !/not.a.brand/i.test(u) && (!c || /Chrom/.test(c) && u != bs || c == Yn && /WebView2/.test(u)) && (u = $e(u, Ar), c = this.get(b), c && !/Chrom/.test(c) && /Chrom/.test(u) || this.set(b, u).set(x, p).set(vn, Ti(p)), c = u), this.itemType == Pe && u == bs && this.set(x, p);
          }
        break;
      case Ye:
        var M = s[be];
        M && (M && s[si] == "64" && (M += "64"), Ai.call(this.data, M + ";", r));
        break;
      case Fe:
        if (s[P] && this.set(f, P), s[g] && (this.set(g, s[g]), !this.get(f) || !this.get(m))) {
          var k = {};
          Ai.call(k, "droid 9; " + s[g] + ")", r), !this.get(f) && k.type && this.set(f, k.type), !this.get(m) && k.vendor && this.set(m, k.vendor);
        }
        if (s[yt]) {
          var z;
          if (typeof s[yt] != "string")
            for (var O = 0; !z && O < s[yt].length; )
              z = $e(s[yt][O++], vs);
          else
            z = $e(s[yt], vs);
          this.set(f, z);
        }
        break;
      case Ae:
        var H = s[Ut];
        if (H) {
          var Se = s[qi];
          H == Bi && (Se = parseInt(Ti(Se), 10) >= 13 ? "11" : "10"), this.set(b, H).set(x, Se);
        }
        this.get(b) == Bi && s[g] == "Xbox" && this.set(b, "Xbox").set(x, void 0);
        break;
      case Bt:
        var de = this.data, ce = function(Re) {
          return de[Re].getItem().setCH(s).parseCH().get();
        };
        this.set(we, ce(we)).set(Ye, ce(Ye)).set(Fe, ce(Fe)).set(Pe, ce(Pe)).set(Ae, ce(Ae));
    }
    return this;
  }, Ke.call(this, [
    ["itemType", n],
    ["ua", e],
    ["uaCH", i],
    ["rgxMap", t],
    ["data", Cr(this, n)]
  ]), this;
}
function et(n, e, t) {
  if (typeof n === Ht ? (Jn(n, !0) ? (typeof e === Ht && (t = e), e = n) : (t = n, e = void 0), n = void 0) : typeof n === Ni && !Jn(e, !0) && (t = e, e = void 0), t && typeof t.append === Qn) {
    var i = {};
    t.forEach(function(h, u) {
      i[u] = h;
    }), t = i;
  }
  if (!(this instanceof et))
    return new et(n, e, t).getResult();
  var s = typeof n === Ni ? n : (
    // Passed user-agent string
    t && t[cs] ? t[cs] : (
      // User-Agent from passed headers
      xe && xe.userAgent ? xe.userAgent : (
        // navigator.userAgent
        zt
      )
    )
  ), r = new Vs(t, !0), a = e ? Tr(ks, e) : ks, c = function(h) {
    return h == Bt ? function() {
      return new ys(h, s, a, r).set("ua", s).set(we, this.getBrowser()).set(Ye, this.getCPU()).set(Fe, this.getDevice()).set(Pe, this.getEngine()).set(Ae, this.getOS()).get();
    } : function() {
      return new ys(h, s, a[h], r).parseUA().get();
    };
  };
  return Ke.call(this, [
    ["getBrowser", c(we)],
    ["getCPU", c(Ye)],
    ["getDevice", c(Fe)],
    ["getEngine", c(Pe)],
    ["getOS", c(Ae)],
    ["getResult", c(Bt)],
    ["getUA", function() {
      return s;
    }],
    ["setUA", function(h) {
      return Ft(h) && (s = h.length > Di ? ei(h, Di) : h), this;
    }]
  ]).setUA(s), this;
}
et.VERSION = wr;
et.BROWSER = ri([b, x, vn, f]);
et.CPU = ri([be]);
et.DEVICE = ri([g, m, f, bn, P, ie, G, ze, xn]);
et.ENGINE = et.OS = ri([b, x]);
class Rr {
  static isValidDevice() {
    return !new et().getDevice().type;
  }
}
class Ee {
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
      i instanceof Ee ? e.push(i) : Array.isArray(i) && i.every((s) => s instanceof Ee) && e.push(...i);
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
class Or extends Ee {
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
class Mr extends Ee {
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
class Xi extends Ee {
  constructor(e) {
    super(), this.root = document.createElement("div"), this.root.classList.add("overlay"), this.root.id = e;
  }
  setVisibility(e) {
    e ? this.root.classList.add("overlay--visible-state") : this.root.classList.remove("overlay--visible-state");
  }
}
class Lr extends Ee {
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
class Ir extends Xi {
  constructor() {
    super("session-connecting-overlay"), this.displayTimeout = null;
    const e = document.createElement("div");
    e.classList.add("connecting-message-box"), this.root.appendChild(e), this.spinner = new Lr(), this.spinner.mount(e);
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
function Pr(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var Ci, Es;
function Dr() {
  if (Es) return Ci;
  Es = 1;
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
  function M(o) {
    return o ? typeof o == "string" ? o : o.source : null;
  }
  function k(o) {
    return H("(?=", o, ")");
  }
  function z(o) {
    return H("(?:", o, ")*");
  }
  function O(o) {
    return H("(?:", o, ")?");
  }
  function H(...o) {
    return o.map((v) => M(v)).join("");
  }
  function Se(o) {
    const d = o[o.length - 1];
    return typeof d == "object" && d.constructor === Object ? (o.splice(o.length - 1, 1), d) : {};
  }
  function de(...o) {
    return "(" + (Se(o).capture ? "" : "?:") + o.map((I) => M(I)).join("|") + ")";
  }
  function ce(o) {
    return new RegExp(o.toString() + "|").exec("").length - 1;
  }
  function Re(o, d) {
    const v = o && o.exec(d);
    return v && v.index === 0;
  }
  const te = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function Oe(o, { joinWith: d }) {
    let v = 0;
    return o.map((I) => {
      v += 1;
      const Q = v;
      let K = M(I), T = "";
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
  const Ve = /\b\B/, De = "[a-zA-Z]\\w*", Vt = "[a-zA-Z_]\\w*", En = "\\b\\d+(\\.\\d+)?", Sn = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", ae = "\\b(0b[01]+)", jt = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", Gt = (o = {}) => {
    const d = /^#![ ]*\//;
    return o.binary && (o.begin = H(
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
    const Q = de(
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
        begin: H(
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
  }, hi = dt("//", "$"), Tn = dt("/\\*", "\\*/"), ne = dt("#", "$"), An = {
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
    APOS_STRING_MODE: li,
    BACKSLASH_ESCAPE: je,
    BINARY_NUMBER_MODE: Cn,
    BINARY_NUMBER_RE: ae,
    COMMENT: dt,
    C_BLOCK_COMMENT_MODE: Tn,
    C_LINE_COMMENT_MODE: hi,
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
    PHRASAL_WORDS_MODE: ui,
    QUOTE_STRING_MODE: ci,
    REGEXP_MODE: J,
    RE_STARTERS_RE: jt,
    SHEBANG: Gt,
    TITLE_MODE: pt,
    UNDERSCORE_IDENT_RE: Vt,
    UNDERSCORE_TITLE_MODE: Wt
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
    Array.isArray(o.illegal) && (o.illegal = de(...o.illegal));
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
    const v = Object.assign({}, o);
    Object.keys(o).forEach((I) => {
      delete o[I];
    }), o.keywords = v.keywords, o.begin = H(v.beforeMatch, k(v.begin)), o.starts = {
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
  function Yt(o, d, v = Rt) {
    const I = /* @__PURE__ */ Object.create(null);
    return typeof o == "string" ? Q(v, o.split(" ")) : Array.isArray(o) ? Q(v, o) : Object.keys(o).forEach(function(K) {
      Object.assign(
        I,
        Yt(o[K], d, K)
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
    return d ? Number(d) : di(o) ? 0 : 1;
  }
  function di(o) {
    return Ct.includes(o.toLowerCase());
  }
  const Ot = {}, _e = (o) => {
    console.error(o);
  }, We = (o, ...d) => {
    console.log(`WARN: ${o}`, ...d);
  }, ve = (o, d) => {
    Ot[`${o}/${d}`] || (console.log(`Deprecated as of ${o}. ${d}`), Ot[`${o}/${d}`] = !0);
  }, gt = new Error();
  function Zt(o, d, { key: v }) {
    let I = 0;
    const Q = o[v], K = {}, T = {};
    for (let S = 1; S <= d.length; S++)
      T[S + I] = Q[S], K[S + I] = !0, I += ce(d[S - 1]);
    o[v] = T, o[v]._emit = K, o[v]._multi = !0;
  }
  function In(o) {
    if (Array.isArray(o.begin)) {
      if (o.skip || o.excludeBegin || o.returnBegin)
        throw _e("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), gt;
      if (typeof o.beginScope != "object" || o.beginScope === null)
        throw _e("beginScope must be object"), gt;
      Zt(o, o.begin, { key: "beginScope" }), o.begin = Oe(o.begin, { joinWith: "" });
    }
  }
  function Kt(o) {
    if (Array.isArray(o.end)) {
      if (o.skip || o.excludeEnd || o.returnEnd)
        throw _e("skip, excludeEnd, returnEnd not compatible with endScope: {}"), gt;
      if (typeof o.endScope != "object" || o.endScope === null)
        throw _e("endScope must be object"), gt;
      Zt(o, o.end, { key: "endScope" }), o.end = Oe(o.end, { joinWith: "" });
    }
  }
  function Pn(o) {
    o.scope && typeof o.scope == "object" && o.scope !== null && (o.beginScope = o.scope, delete o.scope);
  }
  function Mt(o) {
    Pn(o), typeof o.beginScope == "string" && (o.beginScope = { _wrap: o.beginScope }), typeof o.endScope == "string" && (o.endScope = { _wrap: o.endScope }), In(o), Kt(o);
  }
  function Lt(o) {
    function d(T, S) {
      return new RegExp(
        M(T),
        "m" + (o.case_insensitive ? "i" : "") + (o.unicodeRegex ? "u" : "") + (S ? "g" : "")
      );
    }
    class v {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(S, L) {
        L.position = this.position++, this.matchIndexes[this.matchAt] = L, this.regexes.push([L, S]), this.matchAt += ce(S) + 1;
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
        qt,
        Mt,
        nt
      ].forEach((W) => W(T, S)), o.compilerExtensions.forEach((W) => W(T, S)), T.__beforeBegin = null, [
        At,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        Ge,
        // default to 1 relevance if not specified
        Xt
      ].forEach((W) => W(T, S)), T.isCompiled = !0;
      let F = null;
      return typeof T.keywords == "object" && T.keywords.$pattern && (T.keywords = Object.assign({}, T.keywords), F = T.keywords.$pattern, delete T.keywords.$pattern), F = F || /\w+/, T.keywords && (T.keywords = Yt(T.keywords, o.case_insensitive)), L.keywordPatternRe = d(F, !0), S && (T.begin || (T.begin = /\B|\b/), L.beginRe = d(L.begin), !T.end && !T.endsWithParent && (T.end = /\B|\b/), T.end && (L.endRe = d(L.end)), L.terminatorEnd = M(L.end) || "", T.endsWithParent && S.terminatorEnd && (L.terminatorEnd += (T.end ? "|" : "") + S.terminatorEnd)), T.illegal && (L.illegalRe = d(
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
    constructor(d, v) {
      super(d), this.name = "HTMLInjectionError", this.html = v;
    }
  }
  const en = t, mt = i, wt = Symbol("nomatch"), pi = 7, st = function(o) {
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
      __emitter: p
    };
    function L(w) {
      return S.noHighlightRe.test(w);
    }
    function F(w) {
      let C = w.className + " ";
      C += w.parentNode ? w.parentNode.className : "";
      const B = S.languageDetectRe.exec(C);
      if (B) {
        const Y = E(B[1]);
        return Y || (We(K.replace("{}", B[1])), We("Falling back to no-highlight mode for this block.", w)), Y ? B[1] : "no-highlight";
      }
      return C.split(/\s+/).find((Y) => L(Y) || E(Y));
    }
    function W(w, C, B) {
      let Y = "", oe = "";
      typeof C == "object" ? (Y = w, B = C.ignoreIllegals, oe = C.language) : (ve("10.7.0", "highlight(lang, code, ...args) has been deprecated."), ve("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), oe = w, Y = C), B === void 0 && (B = !0);
      const Le = {
        code: Y,
        language: oe
      };
      Ne("before:highlight", Le);
      const at = Le.result ? Le.result : ot(Le.language, Le.code, B);
      return at.code = Le.code, Ne("after:highlight", at), at;
    }
    function ot(w, C, B, Y) {
      const oe = /* @__PURE__ */ Object.create(null);
      function Le(y, R) {
        return y.keywords[R];
      }
      function at() {
        if (!D.keywords) {
          le.addText(Z);
          return;
        }
        let y = 0;
        D.keywordPatternRe.lastIndex = 0;
        let R = D.keywordPatternRe.exec(Z), N = "";
        for (; R; ) {
          N += Z.substring(y, R.index);
          const V = Ue.case_insensitive ? R[0].toLowerCase() : R[0], he = Le(D, V);
          if (he) {
            const [qe, pr] = he;
            if (le.addText(N), N = "", oe[V] = (oe[V] || 0) + 1, oe[V] <= pi && ($n += pr), qe.startsWith("_"))
              N += R[0];
            else {
              const fr = Ue.classNameAliases[qe] || qe;
              Be(R[0], fr);
            }
          } else
            N += R[0];
          y = D.keywordPatternRe.lastIndex, R = D.keywordPatternRe.exec(Z);
        }
        N += Z.substring(y), le.addText(N);
      }
      function zn() {
        if (Z === "") return;
        let y = null;
        if (typeof D.subLanguage == "string") {
          if (!d[D.subLanguage]) {
            le.addText(Z);
            return;
          }
          y = ot(D.subLanguage, Z, !0, ls[D.subLanguage]), ls[D.subLanguage] = /** @type {CompiledMode} */
          y._top;
        } else
          y = bt(Z, D.subLanguage.length ? D.subLanguage : null);
        D.relevance > 0 && ($n += y.relevance), le.__addSublanguage(y._emitter, y.language);
      }
      function ye() {
        D.subLanguage != null ? zn() : at(), Z = "";
      }
      function Be(y, R) {
        y !== "" && (le.startScope(R), le.addText(y), le.endScope());
      }
      function ss(y, R) {
        let N = 1;
        const V = R.length - 1;
        for (; N <= V; ) {
          if (!y._emit[N]) {
            N++;
            continue;
          }
          const he = Ue.classNameAliases[y[N]] || y[N], qe = R[N];
          he ? Be(qe, he) : (Z = qe, at(), Z = ""), N++;
        }
      }
      function rs(y, R) {
        return y.scope && typeof y.scope == "string" && le.openNode(Ue.classNameAliases[y.scope] || y.scope), y.beginScope && (y.beginScope._wrap ? (Be(Z, Ue.classNameAliases[y.beginScope._wrap] || y.beginScope._wrap), Z = "") : y.beginScope._multi && (ss(y.beginScope, R), Z = "")), D = Object.create(y, { parent: { value: D } }), D;
      }
      function os(y, R, N) {
        let V = Re(y.endRe, N);
        if (V) {
          if (y["on:end"]) {
            const he = new e(y);
            y["on:end"](R, he), he.isMatchIgnored && (V = !1);
          }
          if (V) {
            for (; y.endsParent && y.parent; )
              y = y.parent;
            return y;
          }
        }
        if (y.endsWithParent)
          return os(y.parent, R, N);
      }
      function lr(y) {
        return D.matcher.regexIndex === 0 ? (Z += y[0], 1) : (mi = !0, 0);
      }
      function cr(y) {
        const R = y[0], N = y.rule, V = new e(N), he = [N.__beforeBegin, N["on:begin"]];
        for (const qe of he)
          if (qe && (qe(y, V), V.isMatchIgnored))
            return lr(R);
        return N.skip ? Z += R : (N.excludeBegin && (Z += R), ye(), !N.returnBegin && !N.excludeBegin && (Z = R)), rs(N, y), N.returnBegin ? 0 : R.length;
      }
      function ur(y) {
        const R = y[0], N = C.substring(y.index), V = os(D, y, N);
        if (!V)
          return wt;
        const he = D;
        D.endScope && D.endScope._wrap ? (ye(), Be(R, D.endScope._wrap)) : D.endScope && D.endScope._multi ? (ye(), ss(D.endScope, y)) : he.skip ? Z += R : (he.returnEnd || he.excludeEnd || (Z += R), ye(), he.excludeEnd && (Z = R));
        do
          D.scope && le.closeNode(), !D.skip && !D.subLanguage && ($n += D.relevance), D = D.parent;
        while (D !== V.parent);
        return V.starts && rs(V.starts, y), he.returnEnd ? 0 : R.length;
      }
      function hr() {
        const y = [];
        for (let R = D; R !== Ue; R = R.parent)
          R.scope && y.unshift(R.scope);
        y.forEach((R) => le.openNode(R));
      }
      let Hn = {};
      function as(y, R) {
        const N = R && R[0];
        if (Z += y, N == null)
          return ye(), 0;
        if (Hn.type === "begin" && R.type === "end" && Hn.index === R.index && N === "") {
          if (Z += C.slice(R.index, R.index + 1), !Q) {
            const V = new Error(`0 width match regex (${w})`);
            throw V.languageName = w, V.badRule = Hn.rule, V;
          }
          return 1;
        }
        if (Hn = R, R.type === "begin")
          return cr(R);
        if (R.type === "illegal" && !B) {
          const V = new Error('Illegal lexeme "' + N + '" for mode "' + (D.scope || "<unnamed>") + '"');
          throw V.mode = D, V;
        } else if (R.type === "end") {
          const V = ur(R);
          if (V !== wt)
            return V;
        }
        if (R.type === "illegal" && N === "")
          return Z += `
`, 1;
        if (gi > 1e5 && gi > R.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return Z += N, N.length;
      }
      const Ue = E(w);
      if (!Ue)
        throw _e(K.replace("{}", w)), new Error('Unknown language: "' + w + '"');
      const dr = Lt(Ue);
      let fi = "", D = Y || dr;
      const ls = {}, le = new S.__emitter(S);
      hr();
      let Z = "", $n = 0, xt = 0, gi = 0, mi = !1;
      try {
        if (Ue.__emitTokens)
          Ue.__emitTokens(C, le);
        else {
          for (D.matcher.considerAll(); ; ) {
            gi++, mi ? mi = !1 : D.matcher.considerAll(), D.matcher.lastIndex = xt;
            const y = D.matcher.exec(C);
            if (!y) break;
            const R = C.substring(xt, y.index), N = as(R, y);
            xt = y.index + N;
          }
          as(C.substring(xt));
        }
        return le.finalize(), fi = le.toHTML(), {
          language: w,
          value: fi,
          relevance: $n,
          illegal: !1,
          _emitter: le,
          _top: D
        };
      } catch (y) {
        if (y.message && y.message.includes("Illegal"))
          return {
            language: w,
            value: en(C),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: y.message,
              index: xt,
              context: C.slice(xt - 100, xt + 100),
              mode: y.mode,
              resultSoFar: fi
            },
            _emitter: le
          };
        if (Q)
          return {
            language: w,
            value: en(C),
            illegal: !1,
            relevance: 0,
            errorRaised: y,
            _emitter: le,
            _top: D
          };
        throw y;
      }
    }
    function It(w) {
      const C = {
        value: en(w),
        illegal: !1,
        relevance: 0,
        _top: T,
        _emitter: new S.__emitter(S)
      };
      return C._emitter.addText(w), C;
    }
    function bt(w, C) {
      C = C || S.languages || Object.keys(d);
      const B = It(w), Y = C.filter(E).filter(re).map(
        (ye) => ot(ye, w, !1)
      );
      Y.unshift(B);
      const oe = Y.sort((ye, Be) => {
        if (ye.relevance !== Be.relevance) return Be.relevance - ye.relevance;
        if (ye.language && Be.language) {
          if (E(ye.language).supersetOf === Be.language)
            return 1;
          if (E(Be.language).supersetOf === ye.language)
            return -1;
        }
        return 0;
      }), [Le, at] = oe, zn = Le;
      return zn.secondBest = at, zn;
    }
    function Dn(w, C, B) {
      const Y = C && v[C] || B;
      w.classList.add("hljs"), w.classList.add(`language-${Y}`);
    }
    function ke(w) {
      let C = null;
      const B = F(w);
      if (L(B)) return;
      if (Ne(
        "before:highlightElement",
        { el: w, language: B }
      ), w.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", w);
        return;
      }
      if (w.children.length > 0 && (S.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(w)), S.throwUnescapedHTML))
        throw new Jt(
          "One of your code blocks includes unescaped HTML.",
          w.innerHTML
        );
      C = w;
      const Y = C.textContent, oe = B ? W(Y, { language: B, ignoreIllegals: !0 }) : bt(Y);
      w.innerHTML = oe.value, w.dataset.highlighted = "yes", Dn(w, B, oe.language), w.result = {
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
      Pt(), ve("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Un() {
      Pt(), ve("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let tn = !1;
    function Pt() {
      function w() {
        Pt();
      }
      if (document.readyState === "loading") {
        tn || window.addEventListener("DOMContentLoaded", w, !1), tn = !0;
        return;
      }
      document.querySelectorAll(S.cssSelector).forEach(ke);
    }
    function A(w, C) {
      let B = null;
      try {
        B = C(o);
      } catch (Y) {
        if (_e("Language definition for '{}' could not be registered.".replace("{}", w)), Q)
          _e(Y);
        else
          throw Y;
        B = T;
      }
      B.name || (B.name = w), d[w] = B, B.rawDefinition = C.bind(null, o), B.aliases && q(B.aliases, { languageName: w });
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
      typeof w == "string" && (w = [w]), w.forEach((B) => {
        v[B.toLowerCase()] = C;
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
      const B = w;
      I.forEach(function(Y) {
        Y[B] && Y[B](C);
      });
    }
    function nn(w) {
      return ve("10.7.0", "highlightBlock will be removed entirely in v12.0"), ve("10.7.0", "Please use highlightElement now."), ke(w);
    }
    Object.assign(o, {
      highlight: W,
      highlightAuto: bt,
      highlightAll: Pt,
      highlightElement: ke,
      // TODO: Remove with v12 API
      highlightBlock: nn,
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
    }, o.versionString = Qt, o.regex = {
      concat: H,
      lookahead: k,
      either: de,
      optional: O,
      anyNumberOfTimes: z
    };
    for (const w in ft)
      typeof ft[w] == "object" && n(ft[w]);
    return Object.assign(o, ft), o;
  }, rt = st({});
  return rt.newInstance = () => st({}), Ci = rt, rt.HighlightJS = rt, rt.default = rt, Ci;
}
var Nr = /* @__PURE__ */ Dr();
const js = /* @__PURE__ */ Pr(Nr);
function Br(n) {
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
js.registerLanguage("json", Br);
class Ur extends Ee {
  constructor() {
    super(), this.root = document.createElement("div"), this.root.classList.add("json-viewer"), this.jsonViewerContent = document.createElement("div"), this.jsonViewerContent.classList.add("json-viewer__content"), this.root.appendChild(this.jsonViewerContent);
  }
  displayAsJson(e) {
    this.clear();
    const t = document.createElement("pre");
    t.classList.add("json-viewer__pre"), t.textContent = JSON.stringify(e, null, 2), js.highlightElement(t), t.style.backgroundColor = "transparent", this.jsonViewerContent.appendChild(t);
  }
  clear() {
  }
}
class zr extends Xi {
  constructor() {
    super("console-message-overlay");
    const e = document.createElement("div");
    e.classList.add("console-title-box"), this.root.appendChild(e), this.titleTextDiv = document.createElement("div"), this.titleTextDiv.classList.add("console-title-box__text"), e.appendChild(this.titleTextDiv), this.jsonViewer = new Ur(), this.jsonViewer.mount(this.root);
    const t = new Hr();
    t.setCopyTarget(this.jsonViewer.root), t.mount(e);
  }
  displayMessage(e, t) {
    this.titleTextDiv.innerHTML = e, this.jsonViewer.displayAsJson(t), super.setVisibility(!0);
  }
  hide() {
    this.titleTextDiv.innerHTML = "", this.jsonViewer.clear(), super.setVisibility(!1);
  }
}
class Hr extends Ee {
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
class $r extends Xi {
  constructor() {
    super("session-finished-overlay"), this.submitButton = new Fr(), this.submitButton.mount(this.root), this.messageBox = document.createElement("div"), this.messageBox.classList.add("debrief-message-box"), this.root.appendChild(this.messageBox), this.messageSpan = document.createElement("span"), this.messageSpan.classList.add("debrief-message-box__text"), this.messageBox.appendChild(this.messageSpan);
  }
  show(e, t) {
    e.length == 0 ? this.messageBox.style.visibility = "hidden" : this.messageBox.style.visibility = "visible", this.messageSpan.textContent = e, this.submitButton.attachClickListener(t), this.setVisibility(!0);
  }
  hide() {
    this.messageSpan.textContent = "", super.setVisibility(!1), this.submitButton.removeAllEventListeners();
  }
}
class Fr extends Ee {
  constructor() {
    super();
    const e = document.createElement("button");
    e.classList.add("submit-button"), e.textContent = "Press to Submit", this.root = e;
  }
  attachClickListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class Vr extends Ee {
  constructor() {
    super(), this.root = document.createElement("div"), this.root.className = "shell-ui", this.progressBar = new Mr("cognition"), this.progressBar.mount(this.root), this.statusDot = new Or(), this.statusDot.mount(this.root), this.sessionConnectingOverlay = new Ir(), this.sessionConnectingOverlay.mount(this.root), this.overlayConsoleMessage = new zr(), this.overlayConsoleMessage.mount(this.root), this.sessionFinishedOverlay = new $r(), this.sessionFinishedOverlay.mount(this.root);
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
class kn {
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
class jr {
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
class Gr {
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
class Wr {
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
class qr {
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
        action_type: "KeyPressAction",
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
function Xr(n) {
  if (!("addClickCallback" in n))
    throw new Error("CardView is not clickable");
}
function Yr(n) {
  if (!("addDoneCallback" in n))
    throw new Error("CardView is not doneable");
}
class Zr extends kn {
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
function Yi() {
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
var Tt = Yi();
function Gs(n) {
  Tt = n;
}
var _n = { exec: () => null };
function $(n, e = "") {
  let t = typeof n == "string" ? n : n.source;
  const i = {
    replace: (s, r) => {
      let a = typeof r == "string" ? r : r.source;
      return a = a.replace(fe.caret, "$1"), t = t.replace(s, a), i;
    },
    getRegex: () => new RegExp(t, e)
  };
  return i;
}
var fe = {
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
}, Kr = /^(?:[ \t]*(?:\n|$))+/, Qr = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Jr = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, yn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, eo = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Zi = /(?:[*+-]|\d{1,9}[.)])/, Ws = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, qs = $(Ws).replace(/bull/g, Zi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), to = $(Ws).replace(/bull/g, Zi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Ki = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, no = /^[^\n]+/, Qi = /(?!\s*\])(?:\\.|[^\[\]\\])+/, io = $(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Qi).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), so = $(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Zi).getRegex(), oi = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Ji = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, ro = $(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", Ji).replace("tag", oi).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Xs = $(Ki).replace("hr", yn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", oi).getRegex(), oo = $(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Xs).getRegex(), es = {
  blockquote: oo,
  code: Qr,
  def: io,
  fences: Jr,
  heading: eo,
  hr: yn,
  html: ro,
  lheading: qs,
  list: so,
  newline: Kr,
  paragraph: Xs,
  table: _n,
  text: no
}, Ss = $(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", yn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", oi).getRegex(), ao = {
  ...es,
  lheading: to,
  table: Ss,
  paragraph: $(Ki).replace("hr", yn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Ss).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", oi).getRegex()
}, lo = {
  ...es,
  html: $(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", Ji).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: _n,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: $(Ki).replace("hr", yn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", qs).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, co = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, uo = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Ys = /^( {2,}|\\)\n(?!\s*$)/, ho = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, ai = /[\p{P}\p{S}]/u, ts = /[\s\p{P}\p{S}]/u, Zs = /[^\s\p{P}\p{S}]/u, po = $(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, ts).getRegex(), Ks = /(?!~)[\p{P}\p{S}]/u, fo = /(?!~)[\s\p{P}\p{S}]/u, go = /(?:[^\s\p{P}\p{S}]|~)/u, mo = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, Qs = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, wo = $(Qs, "u").replace(/punct/g, ai).getRegex(), bo = $(Qs, "u").replace(/punct/g, Ks).getRegex(), Js = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", xo = $(Js, "gu").replace(/notPunctSpace/g, Zs).replace(/punctSpace/g, ts).replace(/punct/g, ai).getRegex(), _o = $(Js, "gu").replace(/notPunctSpace/g, go).replace(/punctSpace/g, fo).replace(/punct/g, Ks).getRegex(), vo = $(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, Zs).replace(/punctSpace/g, ts).replace(/punct/g, ai).getRegex(), ko = $(/\\(punct)/, "gu").replace(/punct/g, ai).getRegex(), yo = $(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Eo = $(Ji).replace("(?:-->|$)", "-->").getRegex(), So = $(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", Eo).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), ti = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, To = $(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", ti).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), er = $(/^!?\[(label)\]\[(ref)\]/).replace("label", ti).replace("ref", Qi).getRegex(), tr = $(/^!?\[(ref)\](?:\[\])?/).replace("ref", Qi).getRegex(), Ao = $("reflink|nolink(?!\\()", "g").replace("reflink", er).replace("nolink", tr).getRegex(), ns = {
  _backpedal: _n,
  // only used for GFM url
  anyPunctuation: ko,
  autolink: yo,
  blockSkip: mo,
  br: Ys,
  code: uo,
  del: _n,
  emStrongLDelim: wo,
  emStrongRDelimAst: xo,
  emStrongRDelimUnd: vo,
  escape: co,
  link: To,
  nolink: tr,
  punctuation: po,
  reflink: er,
  reflinkSearch: Ao,
  tag: So,
  text: ho,
  url: _n
}, Co = {
  ...ns,
  link: $(/^!?\[(label)\]\((.*?)\)/).replace("label", ti).getRegex(),
  reflink: $(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", ti).getRegex()
}, zi = {
  ...ns,
  emStrongRDelimAst: _o,
  emStrongLDelim: bo,
  url: $(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, Ro = {
  ...zi,
  br: $(Ys).replace("{2,}", "*").getRegex(),
  text: $(zi.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Wn = {
  normal: es,
  gfm: ao,
  pedantic: lo
}, hn = {
  normal: ns,
  gfm: zi,
  breaks: Ro,
  pedantic: Co
}, Oo = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, Ts = (n) => Oo[n];
function He(n, e) {
  if (e) {
    if (fe.escapeTest.test(n))
      return n.replace(fe.escapeReplace, Ts);
  } else if (fe.escapeTestNoEncode.test(n))
    return n.replace(fe.escapeReplaceNoEncode, Ts);
  return n;
}
function As(n) {
  try {
    n = encodeURI(n).replace(fe.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function Cs(n, e) {
  var r;
  const t = n.replace(fe.findPipe, (a, c, h) => {
    let u = !1, p = c;
    for (; --p >= 0 && h[p] === "\\"; ) u = !u;
    return u ? "|" : " |";
  }), i = t.split(fe.splitPipe);
  let s = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !((r = i.at(-1)) != null && r.trim()) && i.pop(), e)
    if (i.length > e)
      i.splice(e);
    else
      for (; i.length < e; ) i.push("");
  for (; s < i.length; s++)
    i[s] = i[s].trim().replace(fe.slashPipe, "|");
  return i;
}
function dn(n, e, t) {
  const i = n.length;
  if (i === 0)
    return "";
  let s = 0;
  for (; s < i && n.charAt(i - s - 1) === e; )
    s++;
  return n.slice(0, i - s);
}
function Mo(n, e) {
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
function Rs(n, e, t, i, s) {
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
function Lo(n, e, t) {
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
var ni = class {
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
        text: this.options.pedantic ? t : dn(t, `
`)
      };
    }
  }
  fences(n) {
    const e = this.rules.block.fences.exec(n);
    if (e) {
      const t = e[0], i = Lo(t, e[3] || "", this.rules);
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
        const i = dn(t, "#");
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
        raw: dn(e[0], `
`)
      };
  }
  blockquote(n) {
    const e = this.rules.block.blockquote.exec(n);
    if (e) {
      let t = dn(e[0], `
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
`), p = u.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${u}` : u, s = s ? `${s}
${p}` : p;
        const M = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(p, r, !0), this.lexer.state.top = M, t.length === 0)
          break;
        const k = r.at(-1);
        if ((k == null ? void 0 : k.type) === "code")
          break;
        if ((k == null ? void 0 : k.type) === "blockquote") {
          const z = k, O = z.raw + `
` + t.join(`
`), H = this.blockquote(O);
          r[r.length - 1] = H, i = i.substring(0, i.length - z.raw.length) + H.raw, s = s.substring(0, s.length - z.text.length) + H.text;
          break;
        } else if ((k == null ? void 0 : k.type) === "list") {
          const z = k, O = z.raw + `
` + t.join(`
`), H = this.list(O);
          r[r.length - 1] = H, i = i.substring(0, i.length - k.raw.length) + H.raw, s = s.substring(0, s.length - z.raw.length) + H.raw, t = O.substring(r.at(-1).raw.length).split(`
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
        let h = !1, u = "", p = "";
        if (!(e = r.exec(n)) || this.rules.block.hr.test(n))
          break;
        u = e[0], n = n.substring(u.length);
        let M = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (de) => " ".repeat(3 * de.length)), k = n.split(`
`, 1)[0], z = !M.trim(), O = 0;
        if (this.options.pedantic ? (O = 2, p = M.trimStart()) : z ? O = e[1].length + 1 : (O = e[2].search(this.rules.other.nonSpaceChar), O = O > 4 ? 1 : O, p = M.slice(O), O += e[1].length), z && this.rules.other.blankLine.test(k) && (u += k + `
`, n = n.substring(k.length + 1), h = !0), !h) {
          const de = this.rules.other.nextBulletRegex(O), ce = this.rules.other.hrRegex(O), Re = this.rules.other.fencesBeginRegex(O), te = this.rules.other.headingBeginRegex(O), Oe = this.rules.other.htmlBeginRegex(O);
          for (; n; ) {
            const Ve = n.split(`
`, 1)[0];
            let De;
            if (k = Ve, this.options.pedantic ? (k = k.replace(this.rules.other.listReplaceNesting, "  "), De = k) : De = k.replace(this.rules.other.tabCharGlobal, "    "), Re.test(k) || te.test(k) || Oe.test(k) || de.test(k) || ce.test(k))
              break;
            if (De.search(this.rules.other.nonSpaceChar) >= O || !k.trim())
              p += `
` + De.slice(O);
            else {
              if (z || M.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || Re.test(M) || te.test(M) || ce.test(M))
                break;
              p += `
` + k;
            }
            !z && !k.trim() && (z = !0), u += Ve + `
`, n = n.substring(Ve.length + 1), M = De.slice(O);
          }
        }
        s.loose || (a ? s.loose = !0 : this.rules.other.doubleBlankLine.test(u) && (a = !0));
        let H = null, Se;
        this.options.gfm && (H = this.rules.other.listIsTask.exec(p), H && (Se = H[0] !== "[ ] ", p = p.replace(this.rules.other.listReplaceTask, ""))), s.items.push({
          type: "list_item",
          raw: u,
          task: !!H,
          checked: Se,
          loose: !1,
          text: p,
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
          const u = s.items[h].tokens.filter((M) => M.type === "space"), p = u.length > 0 && u.some((M) => this.rules.other.anyLine.test(M.raw));
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
    var a;
    const e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2]))
      return;
    const t = Cs(e[1]), i = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = (a = e[3]) != null && a.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
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
        r.rows.push(Cs(c, r.header.length).map((h, u) => ({
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
        const r = dn(t.slice(0, -1), "\\");
        if ((t.length - r.length) % 2 === 0)
          return;
      } else {
        const r = Mo(e[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(t) ? i = i.slice(1) : i = i.slice(1, -1)), Rs(e, {
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
      return Rs(t, s, t[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, t = "") {
    let i = this.rules.inline.emStrongLDelim.exec(n);
    if (!i || i[3] && t.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(i[1] || i[2] || "") || !t || this.rules.inline.punctuation.exec(t)) {
      const r = [...i[0]].length - 1;
      let a, c, h = r, u = 0;
      const p = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (p.lastIndex = 0, e = e.slice(-1 * n.length + r); (i = p.exec(e)) != null; ) {
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
        const M = [...i[0]][0].length, k = n.slice(0, r + i.index + M + c);
        if (Math.min(r, c) % 2) {
          const O = k.slice(1, -1);
          return {
            type: "em",
            raw: k,
            text: O,
            tokens: this.lexer.inlineTokens(O)
          };
        }
        const z = k.slice(2, -2);
        return {
          type: "strong",
          raw: k,
          text: z,
          tokens: this.lexer.inlineTokens(z)
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
}, Qe = class Hi {
  constructor(e) {
    X(this, "tokens");
    X(this, "options");
    X(this, "state");
    X(this, "tokenizer");
    X(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Tt, this.options.tokenizer = this.options.tokenizer || new ni(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const t = {
      other: fe,
      block: Wn.normal,
      inline: hn.normal
    };
    this.options.pedantic ? (t.block = Wn.pedantic, t.inline = hn.pedantic) : this.options.gfm && (t.block = Wn.gfm, this.options.breaks ? t.inline = hn.breaks : t.inline = hn.gfm), this.tokenizer.rules = t;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: Wn,
      inline: hn
    };
  }
  /**
   * Static Lex Method
   */
  static lex(e, t) {
    return new Hi(t).lex(e);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(e, t) {
    return new Hi(t).inlineTokens(e);
  }
  /**
   * Preprocessing
   */
  lex(e) {
    e = e.replace(fe.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      const i = this.inlineQueue[t];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], i = !1) {
    var s, r, a;
    for (this.options.pedantic && (e = e.replace(fe.tabCharGlobal, "    ").replace(fe.spaceLine, "")); e; ) {
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
        const p = e.slice(1);
        let M;
        this.options.extensions.startBlock.forEach((k) => {
          M = k.call({ lexer: this }, p), typeof M == "number" && M >= 0 && (u = Math.min(u, M));
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
      const p = Object.keys(this.tokens.links);
      if (p.length > 0)
        for (; (s = this.tokenizer.rules.inline.reflinkSearch.exec(i)) != null; )
          p.includes(s[0].slice(s[0].lastIndexOf("[") + 1, -1)) && (i = i.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (s = this.tokenizer.rules.inline.anyPunctuation.exec(i)) != null; )
      i = i.slice(0, s.index) + "++" + i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (s = this.tokenizer.rules.inline.blockSkip.exec(i)) != null; )
      i = i.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    let r = !1, a = "";
    for (; e; ) {
      r || (a = ""), r = !1;
      let p;
      if ((h = (c = this.options.extensions) == null ? void 0 : c.inline) != null && h.some((k) => (p = k.call({ lexer: this }, e, t)) ? (e = e.substring(p.raw.length), t.push(p), !0) : !1))
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
      if (p = this.tokenizer.emStrong(e, i, a)) {
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
      let M = e;
      if ((u = this.options.extensions) != null && u.startInline) {
        let k = 1 / 0;
        const z = e.slice(1);
        let O;
        this.options.extensions.startInline.forEach((H) => {
          O = H.call({ lexer: this }, z), typeof O == "number" && O >= 0 && (k = Math.min(k, O));
        }), k < 1 / 0 && k >= 0 && (M = e.substring(0, k + 1));
      }
      if (p = this.tokenizer.inlineText(M)) {
        e = e.substring(p.raw.length), p.raw.slice(-1) !== "_" && (a = p.raw.slice(-1)), r = !0;
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
}, ii = class {
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
    const i = (r = (e || "").match(fe.notSpaceStart)) == null ? void 0 : r[0], s = n.replace(fe.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + He(i) + '">' + (t ? s : He(s, !0)) + `</code></pre>
` : "<pre><code>" + (t ? s : He(s, !0)) + `</code></pre>
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
      n.loose ? ((t = n.tokens[0]) == null ? void 0 : t.type) === "paragraph" ? (n.tokens[0].text = i + " " + n.tokens[0].text, n.tokens[0].tokens && n.tokens[0].tokens.length > 0 && n.tokens[0].tokens[0].type === "text" && (n.tokens[0].tokens[0].text = i + " " + He(n.tokens[0].tokens[0].text), n.tokens[0].tokens[0].escaped = !0)) : n.tokens.unshift({
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
    return `<code>${He(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: e, tokens: t }) {
    const i = this.parser.parseInline(t), s = As(n);
    if (s === null)
      return i;
    n = s;
    let r = '<a href="' + n + '"';
    return e && (r += ' title="' + He(e) + '"'), r += ">" + i + "</a>", r;
  }
  image({ href: n, title: e, text: t, tokens: i }) {
    i && (t = this.parser.parseInline(i, this.parser.textRenderer));
    const s = As(n);
    if (s === null)
      return He(t);
    n = s;
    let r = `<img src="${n}" alt="${t}"`;
    return e && (r += ` title="${He(e)}"`), r += ">", r;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : He(n.text);
  }
}, is = class {
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
}, Je = class $i {
  constructor(e) {
    X(this, "options");
    X(this, "renderer");
    X(this, "textRenderer");
    this.options = e || Tt, this.options.renderer = this.options.renderer || new ii(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new is();
  }
  /**
   * Static Parse Method
   */
  static parse(e, t) {
    return new $i(t).parse(e);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(e, t) {
    return new $i(t).parseInline(e);
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
        const u = c, p = this.options.extensions.renderers[u.type].call({ parser: this }, u);
        if (p !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(u.type)) {
          i += p || "";
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
          let u = h, p = this.renderer.text(u);
          for (; a + 1 < e.length && e[a + 1].type === "text"; )
            u = e[++a], p += `
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
}, Pi, Zn = (Pi = class {
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
    return this.block ? Qe.lex : Qe.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? Je.parse : Je.parseInline;
  }
}, X(Pi, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
])), Pi), Io = class {
  constructor(...n) {
    X(this, "defaults", Yi());
    X(this, "options", this.setOptions);
    X(this, "parse", this.parseMarkdown(!0));
    X(this, "parseInline", this.parseMarkdown(!1));
    X(this, "Parser", Je);
    X(this, "Renderer", ii);
    X(this, "TextRenderer", is);
    X(this, "Lexer", Qe);
    X(this, "Tokenizer", ni);
    X(this, "Hooks", Zn);
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
        const s = this.defaults.renderer || new ii(this.defaults);
        for (const r in t.renderer) {
          if (!(r in s))
            throw new Error(`renderer '${r}' does not exist`);
          if (["options", "parser"].includes(r))
            continue;
          const a = r, c = t.renderer[a], h = s[a];
          s[a] = (...u) => {
            let p = c.apply(s, u);
            return p === !1 && (p = h.apply(s, u)), p || "";
          };
        }
        i.renderer = s;
      }
      if (t.tokenizer) {
        const s = this.defaults.tokenizer || new ni(this.defaults);
        for (const r in t.tokenizer) {
          if (!(r in s))
            throw new Error(`tokenizer '${r}' does not exist`);
          if (["options", "rules", "lexer"].includes(r))
            continue;
          const a = r, c = t.tokenizer[a], h = s[a];
          s[a] = (...u) => {
            let p = c.apply(s, u);
            return p === !1 && (p = h.apply(s, u)), p;
          };
        }
        i.tokenizer = s;
      }
      if (t.hooks) {
        const s = this.defaults.hooks || new Zn();
        for (const r in t.hooks) {
          if (!(r in s))
            throw new Error(`hook '${r}' does not exist`);
          if (["options", "block"].includes(r))
            continue;
          const a = r, c = t.hooks[a], h = s[a];
          Zn.passThroughHooks.has(r) ? s[a] = (u) => {
            if (this.defaults.async)
              return Promise.resolve(c.call(s, u)).then((M) => h.call(s, M));
            const p = c.call(s, u);
            return h.call(s, p);
          } : s[a] = (...u) => {
            let p = c.apply(s, u);
            return p === !1 && (p = h.apply(s, u)), p;
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
    return Qe.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return Je.parse(n, e ?? this.defaults);
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
      const c = r.hooks ? r.hooks.provideLexer() : n ? Qe.lex : Qe.lexInline, h = r.hooks ? r.hooks.provideParser() : n ? Je.parse : Je.parseInline;
      if (r.async)
        return Promise.resolve(r.hooks ? r.hooks.preprocess(t) : t).then((u) => c(u, r)).then((u) => r.hooks ? r.hooks.processAllTokens(u) : u).then((u) => r.walkTokens ? Promise.all(this.walkTokens(u, r.walkTokens)).then(() => u) : u).then((u) => h(u, r)).then((u) => r.hooks ? r.hooks.postprocess(u) : u).catch(a);
      try {
        r.hooks && (t = r.hooks.preprocess(t));
        let u = c(t, r);
        r.hooks && (u = r.hooks.processAllTokens(u)), r.walkTokens && this.walkTokens(u, r.walkTokens);
        let p = h(u, r);
        return r.hooks && (p = r.hooks.postprocess(p)), p;
      } catch (u) {
        return a(u);
      }
    };
  }
  onError(n, e) {
    return (t) => {
      if (t.message += `
Please report this to https://github.com/markedjs/marked.`, n) {
        const i = "<p>An error occurred:</p><pre>" + He(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(i) : i;
      }
      if (e)
        return Promise.reject(t);
      throw t;
    };
  }
}, St = new Io();
function j(n, e) {
  return St.parse(n, e);
}
j.options = j.setOptions = function(n) {
  return St.setOptions(n), j.defaults = St.defaults, Gs(j.defaults), j;
};
j.getDefaults = Yi;
j.defaults = Tt;
j.use = function(...n) {
  return St.use(...n), j.defaults = St.defaults, Gs(j.defaults), j;
};
j.walkTokens = function(n, e) {
  return St.walkTokens(n, e);
};
j.parseInline = St.parseInline;
j.Parser = Je;
j.parser = Je.parse;
j.Renderer = ii;
j.TextRenderer = is;
j.Lexer = Qe;
j.lexer = Qe.lex;
j.Tokenizer = ni;
j.Hooks = Zn;
j.parse = j;
j.options;
j.setOptions;
j.use;
j.walkTokens;
j.parseInline;
Je.parse;
Qe.lex;
/*! @license DOMPurify 3.2.6 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.6/LICENSE */
const {
  entries: nr,
  setPrototypeOf: Os,
  isFrozen: Po,
  getPrototypeOf: Do,
  getOwnPropertyDescriptor: No
} = Object;
let {
  freeze: ge,
  seal: Ce,
  create: ir
} = Object, {
  apply: Fi,
  construct: Vi
} = typeof Reflect < "u" && Reflect;
ge || (ge = function(e) {
  return e;
});
Ce || (Ce = function(e) {
  return e;
});
Fi || (Fi = function(e, t, i) {
  return e.apply(t, i);
});
Vi || (Vi = function(e, t) {
  return new e(...t);
});
const qn = me(Array.prototype.forEach), Bo = me(Array.prototype.lastIndexOf), Ms = me(Array.prototype.pop), pn = me(Array.prototype.push), Uo = me(Array.prototype.splice), Kn = me(String.prototype.toLowerCase), Ri = me(String.prototype.toString), Ls = me(String.prototype.match), fn = me(String.prototype.replace), zo = me(String.prototype.indexOf), Ho = me(String.prototype.trim), Ie = me(Object.prototype.hasOwnProperty), pe = me(RegExp.prototype.test), gn = $o(TypeError);
function me(n) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++)
      i[s - 1] = arguments[s];
    return Fi(n, e, i);
  };
}
function $o(n) {
  return function() {
    for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++)
      t[i] = arguments[i];
    return Vi(n, t);
  };
}
function U(n, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Kn;
  Os && Os(n, null);
  let i = e.length;
  for (; i--; ) {
    let s = e[i];
    if (typeof s == "string") {
      const r = t(s);
      r !== s && (Po(e) || (e[i] = r), s = r);
    }
    n[s] = !0;
  }
  return n;
}
function Fo(n) {
  for (let e = 0; e < n.length; e++)
    Ie(n, e) || (n[e] = null);
  return n;
}
function Xe(n) {
  const e = ir(null);
  for (const [t, i] of nr(n))
    Ie(n, t) && (Array.isArray(i) ? e[t] = Fo(i) : i && typeof i == "object" && i.constructor === Object ? e[t] = Xe(i) : e[t] = i);
  return e;
}
function mn(n, e) {
  for (; n !== null; ) {
    const i = No(n, e);
    if (i) {
      if (i.get)
        return me(i.get);
      if (typeof i.value == "function")
        return me(i.value);
    }
    n = Do(n);
  }
  function t() {
    return null;
  }
  return t;
}
const Is = ge(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), Oi = ge(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), Mi = ge(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Vo = ge(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Li = ge(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), jo = ge(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Ps = ge(["#text"]), Ds = ge(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), Ii = ge(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), Ns = ge(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Xn = ge(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Go = Ce(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Wo = Ce(/<%[\w\W]*|[\w\W]*%>/gm), qo = Ce(/\$\{[\w\W]*/gm), Xo = Ce(/^data-[\-\w.\u00B7-\uFFFF]+$/), Yo = Ce(/^aria-[\-\w]+$/), sr = Ce(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Zo = Ce(/^(?:\w+script|data):/i), Ko = Ce(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), rr = Ce(/^html$/i), Qo = Ce(/^[a-z][.\w]*(-[.\w]+)+$/i);
var Bs = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: Yo,
  ATTR_WHITESPACE: Ko,
  CUSTOM_ELEMENT: Qo,
  DATA_ATTR: Xo,
  DOCTYPE_NAME: rr,
  ERB_EXPR: Wo,
  IS_ALLOWED_URI: sr,
  IS_SCRIPT_OR_DATA: Zo,
  MUSTACHE_EXPR: Go,
  TMPLIT_EXPR: qo
});
const wn = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, Jo = function() {
  return typeof window > "u" ? null : window;
}, ea = function(e, t) {
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
}, Us = function() {
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
function or() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Jo();
  const e = (A) => or(A);
  if (e.version = "3.2.6", e.removed = [], !n || !n.document || n.document.nodeType !== wn.document || !n.Element)
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
    NamedNodeMap: p = n.NamedNodeMap || n.MozNamedAttrMap,
    HTMLFormElement: M,
    DOMParser: k,
    trustedTypes: z
  } = n, O = h.prototype, H = mn(O, "cloneNode"), Se = mn(O, "remove"), de = mn(O, "nextSibling"), ce = mn(O, "childNodes"), Re = mn(O, "parentNode");
  if (typeof a == "function") {
    const A = t.createElement("template");
    A.content && A.content.ownerDocument && (t = A.content.ownerDocument);
  }
  let te, Oe = "";
  const {
    implementation: Ve,
    createNodeIterator: De,
    createDocumentFragment: Vt,
    getElementsByTagName: En
  } = t, {
    importNode: Sn
  } = i;
  let ae = Us();
  e.isSupported = typeof nr == "function" && typeof Re == "function" && Ve && Ve.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: jt,
    ERB_EXPR: Gt,
    TMPLIT_EXPR: je,
    DATA_ATTR: li,
    ARIA_ATTR: ci,
    IS_SCRIPT_OR_DATA: ui,
    ATTR_WHITESPACE: dt,
    CUSTOM_ELEMENT: hi
  } = Bs;
  let {
    IS_ALLOWED_URI: Tn
  } = Bs, ne = null;
  const An = U({}, [...Is, ...Oi, ...Mi, ...Li, ...Ps]);
  let se = null;
  const Cn = U({}, [...Ds, ...Ii, ...Ns, ...Xn]);
  let J = Object.seal(ir(null, {
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
  })), pt = null, Wt = null, Rn = !0, On = !0, ft = !1, Mn = !0, tt = !1, At = !0, Ge = !1, qt = !1, Xt = !1, nt = !1, Ct = !1, Rt = !1, Yt = !0, Ln = !1;
  const di = "user-content-";
  let Ot = !0, _e = !1, We = {}, ve = null;
  const gt = U({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let Zt = null;
  const In = U({}, ["audio", "video", "img", "source", "image", "track"]);
  let Kt = null;
  const Pn = U({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Mt = "http://www.w3.org/1998/Math/MathML", Lt = "http://www.w3.org/2000/svg", Te = "http://www.w3.org/1999/xhtml";
  let it = Te, Qt = !1, Jt = null;
  const en = U({}, [Mt, Lt, Te], Ri);
  let mt = U({}, ["mi", "mo", "mn", "ms", "mtext"]), wt = U({}, ["annotation-xml"]);
  const pi = U({}, ["title", "style", "font", "a", "script"]);
  let st = null;
  const rt = ["application/xhtml+xml", "text/html"], o = "text/html";
  let d = null, v = null;
  const I = t.createElement("form"), Q = function(l) {
    return l instanceof RegExp || l instanceof Function;
  }, K = function() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(v && v === l)) {
      if ((!l || typeof l != "object") && (l = {}), l = Xe(l), st = // eslint-disable-next-line unicorn/prefer-includes
      rt.indexOf(l.PARSER_MEDIA_TYPE) === -1 ? o : l.PARSER_MEDIA_TYPE, d = st === "application/xhtml+xml" ? Ri : Kn, ne = Ie(l, "ALLOWED_TAGS") ? U({}, l.ALLOWED_TAGS, d) : An, se = Ie(l, "ALLOWED_ATTR") ? U({}, l.ALLOWED_ATTR, d) : Cn, Jt = Ie(l, "ALLOWED_NAMESPACES") ? U({}, l.ALLOWED_NAMESPACES, Ri) : en, Kt = Ie(l, "ADD_URI_SAFE_ATTR") ? U(Xe(Pn), l.ADD_URI_SAFE_ATTR, d) : Pn, Zt = Ie(l, "ADD_DATA_URI_TAGS") ? U(Xe(In), l.ADD_DATA_URI_TAGS, d) : In, ve = Ie(l, "FORBID_CONTENTS") ? U({}, l.FORBID_CONTENTS, d) : gt, pt = Ie(l, "FORBID_TAGS") ? U({}, l.FORBID_TAGS, d) : Xe({}), Wt = Ie(l, "FORBID_ATTR") ? U({}, l.FORBID_ATTR, d) : Xe({}), We = Ie(l, "USE_PROFILES") ? l.USE_PROFILES : !1, Rn = l.ALLOW_ARIA_ATTR !== !1, On = l.ALLOW_DATA_ATTR !== !1, ft = l.ALLOW_UNKNOWN_PROTOCOLS || !1, Mn = l.ALLOW_SELF_CLOSE_IN_ATTR !== !1, tt = l.SAFE_FOR_TEMPLATES || !1, At = l.SAFE_FOR_XML !== !1, Ge = l.WHOLE_DOCUMENT || !1, nt = l.RETURN_DOM || !1, Ct = l.RETURN_DOM_FRAGMENT || !1, Rt = l.RETURN_TRUSTED_TYPE || !1, Xt = l.FORCE_BODY || !1, Yt = l.SANITIZE_DOM !== !1, Ln = l.SANITIZE_NAMED_PROPS || !1, Ot = l.KEEP_CONTENT !== !1, _e = l.IN_PLACE || !1, Tn = l.ALLOWED_URI_REGEXP || sr, it = l.NAMESPACE || Te, mt = l.MATHML_TEXT_INTEGRATION_POINTS || mt, wt = l.HTML_INTEGRATION_POINTS || wt, J = l.CUSTOM_ELEMENT_HANDLING || {}, l.CUSTOM_ELEMENT_HANDLING && Q(l.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (J.tagNameCheck = l.CUSTOM_ELEMENT_HANDLING.tagNameCheck), l.CUSTOM_ELEMENT_HANDLING && Q(l.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (J.attributeNameCheck = l.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), l.CUSTOM_ELEMENT_HANDLING && typeof l.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (J.allowCustomizedBuiltInElements = l.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), tt && (On = !1), Ct && (nt = !0), We && (ne = U({}, Ps), se = [], We.html === !0 && (U(ne, Is), U(se, Ds)), We.svg === !0 && (U(ne, Oi), U(se, Ii), U(se, Xn)), We.svgFilters === !0 && (U(ne, Mi), U(se, Ii), U(se, Xn)), We.mathMl === !0 && (U(ne, Li), U(se, Ns), U(se, Xn))), l.ADD_TAGS && (ne === An && (ne = Xe(ne)), U(ne, l.ADD_TAGS, d)), l.ADD_ATTR && (se === Cn && (se = Xe(se)), U(se, l.ADD_ATTR, d)), l.ADD_URI_SAFE_ATTR && U(Kt, l.ADD_URI_SAFE_ATTR, d), l.FORBID_CONTENTS && (ve === gt && (ve = Xe(ve)), U(ve, l.FORBID_CONTENTS, d)), Ot && (ne["#text"] = !0), Ge && U(ne, ["html", "head", "body"]), ne.table && (U(ne, ["tbody"]), delete pt.tbody), l.TRUSTED_TYPES_POLICY) {
        if (typeof l.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw gn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof l.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw gn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        te = l.TRUSTED_TYPES_POLICY, Oe = te.createHTML("");
      } else
        te === void 0 && (te = ea(z, s)), te !== null && typeof Oe == "string" && (Oe = te.createHTML(""));
      ge && ge(l), v = l;
    }
  }, T = U({}, [...Oi, ...Mi, ...Vo]), S = U({}, [...Li, ...jo]), L = function(l) {
    let _ = Re(l);
    (!_ || !_.tagName) && (_ = {
      namespaceURI: it,
      tagName: "template"
    });
    const E = Kn(l.tagName), q = Kn(_.tagName);
    return Jt[l.namespaceURI] ? l.namespaceURI === Lt ? _.namespaceURI === Te ? E === "svg" : _.namespaceURI === Mt ? E === "svg" && (q === "annotation-xml" || mt[q]) : !!T[E] : l.namespaceURI === Mt ? _.namespaceURI === Te ? E === "math" : _.namespaceURI === Lt ? E === "math" && wt[q] : !!S[E] : l.namespaceURI === Te ? _.namespaceURI === Lt && !wt[q] || _.namespaceURI === Mt && !mt[q] ? !1 : !S[E] && (pi[E] || !T[E]) : !!(st === "application/xhtml+xml" && Jt[l.namespaceURI]) : !1;
  }, F = function(l) {
    pn(e.removed, {
      element: l
    });
    try {
      Re(l).removeChild(l);
    } catch {
      Se(l);
    }
  }, W = function(l, _) {
    try {
      pn(e.removed, {
        attribute: _.getAttributeNode(l),
        from: _
      });
    } catch {
      pn(e.removed, {
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
    if (Xt)
      l = "<remove></remove>" + l;
    else {
      const ee = Ls(l, /^[\r\n\t ]+/);
      E = ee && ee[0];
    }
    st === "application/xhtml+xml" && it === Te && (l = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + l + "</body></html>");
    const q = te ? te.createHTML(l) : l;
    if (it === Te)
      try {
        _ = new k().parseFromString(q, st);
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
    return l && E && re.insertBefore(t.createTextNode(E), re.childNodes[0] || null), it === Te ? En.call(_, Ge ? "html" : "body")[0] : Ge ? _.documentElement : re;
  }, It = function(l) {
    return De.call(
      l.ownerDocument || l,
      l,
      // eslint-disable-next-line no-bitwise
      u.SHOW_ELEMENT | u.SHOW_COMMENT | u.SHOW_TEXT | u.SHOW_PROCESSING_INSTRUCTION | u.SHOW_CDATA_SECTION,
      null
    );
  }, bt = function(l) {
    return l instanceof M && (typeof l.nodeName != "string" || typeof l.textContent != "string" || typeof l.removeChild != "function" || !(l.attributes instanceof p) || typeof l.removeAttribute != "function" || typeof l.setAttribute != "function" || typeof l.namespaceURI != "string" || typeof l.insertBefore != "function" || typeof l.hasChildNodes != "function");
  }, Dn = function(l) {
    return typeof c == "function" && l instanceof c;
  };
  function ke(A, l, _) {
    qn(A, (E) => {
      E.call(e, l, _, v);
    });
  }
  const Nn = function(l) {
    let _ = null;
    if (ke(ae.beforeSanitizeElements, l, null), bt(l))
      return F(l), !0;
    const E = d(l.nodeName);
    if (ke(ae.uponSanitizeElement, l, {
      tagName: E,
      allowedTags: ne
    }), At && l.hasChildNodes() && !Dn(l.firstElementChild) && pe(/<[/\w!]/g, l.innerHTML) && pe(/<[/\w!]/g, l.textContent) || l.nodeType === wn.progressingInstruction || At && l.nodeType === wn.comment && pe(/<[/\w]/g, l.data))
      return F(l), !0;
    if (!ne[E] || pt[E]) {
      if (!pt[E] && Un(E) && (J.tagNameCheck instanceof RegExp && pe(J.tagNameCheck, E) || J.tagNameCheck instanceof Function && J.tagNameCheck(E)))
        return !1;
      if (Ot && !ve[E]) {
        const q = Re(l) || l.parentNode, re = ce(l) || l.childNodes;
        if (re && q) {
          const ee = re.length;
          for (let ue = ee - 1; ue >= 0; --ue) {
            const Me = H(re[ue], !0);
            Me.__removalCount = (l.__removalCount || 0) + 1, q.insertBefore(Me, de(l));
          }
        }
      }
      return F(l), !0;
    }
    return l instanceof h && !L(l) || (E === "noscript" || E === "noembed" || E === "noframes") && pe(/<\/no(script|embed|frames)/i, l.innerHTML) ? (F(l), !0) : (tt && l.nodeType === wn.text && (_ = l.textContent, qn([jt, Gt, je], (q) => {
      _ = fn(_, q, " ");
    }), l.textContent !== _ && (pn(e.removed, {
      element: l.cloneNode()
    }), l.textContent = _)), ke(ae.afterSanitizeElements, l, null), !1);
  }, Bn = function(l, _, E) {
    if (Yt && (_ === "id" || _ === "name") && (E in t || E in I))
      return !1;
    if (!(On && !Wt[_] && pe(li, _))) {
      if (!(Rn && pe(ci, _))) {
        if (!se[_] || Wt[_]) {
          if (
            // First condition does a very basic check if a) it's basically a valid custom element tagname AND
            // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
            !(Un(l) && (J.tagNameCheck instanceof RegExp && pe(J.tagNameCheck, l) || J.tagNameCheck instanceof Function && J.tagNameCheck(l)) && (J.attributeNameCheck instanceof RegExp && pe(J.attributeNameCheck, _) || J.attributeNameCheck instanceof Function && J.attributeNameCheck(_)) || // Alternative, second condition checks if it's an `is`-attribute, AND
            // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            _ === "is" && J.allowCustomizedBuiltInElements && (J.tagNameCheck instanceof RegExp && pe(J.tagNameCheck, E) || J.tagNameCheck instanceof Function && J.tagNameCheck(E)))
          ) return !1;
        } else if (!Kt[_]) {
          if (!pe(Tn, fn(E, dt, ""))) {
            if (!((_ === "src" || _ === "xlink:href" || _ === "href") && l !== "script" && zo(E, "data:") === 0 && Zt[l])) {
              if (!(ft && !pe(ui, fn(E, dt, "")))) {
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
    return l !== "annotation-xml" && Ls(l, hi);
  }, tn = function(l) {
    ke(ae.beforeSanitizeAttributes, l, null);
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
      } = re, Ne = d(ee), nn = Me;
      let w = ee === "value" ? nn : Ho(nn);
      if (E.attrName = Ne, E.attrValue = w, E.keepAttr = !0, E.forceKeepAttr = void 0, ke(ae.uponSanitizeAttribute, l, E), w = E.attrValue, Ln && (Ne === "id" || Ne === "name") && (W(ee, l), w = di + w), At && pe(/((--!?|])>)|<\/(style|title)/i, w)) {
        W(ee, l);
        continue;
      }
      if (E.forceKeepAttr)
        continue;
      if (!E.keepAttr) {
        W(ee, l);
        continue;
      }
      if (!Mn && pe(/\/>/i, w)) {
        W(ee, l);
        continue;
      }
      tt && qn([jt, Gt, je], (B) => {
        w = fn(w, B, " ");
      });
      const C = d(l.nodeName);
      if (!Bn(C, Ne, w)) {
        W(ee, l);
        continue;
      }
      if (te && typeof z == "object" && typeof z.getAttributeType == "function" && !ue)
        switch (z.getAttributeType(C, Ne)) {
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
          ue ? l.setAttributeNS(ue, ee, w) : l.setAttribute(ee, w), bt(l) ? F(l) : Ms(e.removed);
        } catch {
          W(ee, l);
        }
    }
    ke(ae.afterSanitizeAttributes, l, null);
  }, Pt = function A(l) {
    let _ = null;
    const E = It(l);
    for (ke(ae.beforeSanitizeShadowDOM, l, null); _ = E.nextNode(); )
      ke(ae.uponSanitizeShadowNode, _, null), Nn(_), tn(_), _.content instanceof r && A(_.content);
    ke(ae.afterSanitizeShadowDOM, l, null);
  };
  return e.sanitize = function(A) {
    let l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ = null, E = null, q = null, re = null;
    if (Qt = !A, Qt && (A = "<!-->"), typeof A != "string" && !Dn(A))
      if (typeof A.toString == "function") {
        if (A = A.toString(), typeof A != "string")
          throw gn("dirty is not a string, aborting");
      } else
        throw gn("toString is not a function");
    if (!e.isSupported)
      return A;
    if (qt || K(l), e.removed = [], typeof A == "string" && (_e = !1), _e) {
      if (A.nodeName) {
        const Me = d(A.nodeName);
        if (!ne[Me] || pt[Me])
          throw gn("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (A instanceof c)
      _ = ot("<!---->"), E = _.ownerDocument.importNode(A, !0), E.nodeType === wn.element && E.nodeName === "BODY" || E.nodeName === "HTML" ? _ = E : _.appendChild(E);
    else {
      if (!nt && !tt && !Ge && // eslint-disable-next-line unicorn/prefer-includes
      A.indexOf("<") === -1)
        return te && Rt ? te.createHTML(A) : A;
      if (_ = ot(A), !_)
        return nt ? null : Rt ? Oe : "";
    }
    _ && Xt && F(_.firstChild);
    const ee = It(_e ? A : _);
    for (; q = ee.nextNode(); )
      Nn(q), tn(q), q.content instanceof r && Pt(q.content);
    if (_e)
      return A;
    if (nt) {
      if (Ct)
        for (re = Vt.call(_.ownerDocument); _.firstChild; )
          re.appendChild(_.firstChild);
      else
        re = _;
      return (se.shadowroot || se.shadowrootmode) && (re = Sn.call(i, re, !0)), re;
    }
    let ue = Ge ? _.outerHTML : _.innerHTML;
    return Ge && ne["!doctype"] && _.ownerDocument && _.ownerDocument.doctype && _.ownerDocument.doctype.name && pe(rr, _.ownerDocument.doctype.name) && (ue = "<!DOCTYPE " + _.ownerDocument.doctype.name + `>
` + ue), tt && qn([jt, Gt, je], (Me) => {
      ue = fn(ue, Me, " ");
    }), te && Rt ? te.createHTML(ue) : ue;
  }, e.setConfig = function() {
    let A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    K(A), qt = !0;
  }, e.clearConfig = function() {
    v = null, qt = !1;
  }, e.isValidAttribute = function(A, l, _) {
    v || K({});
    const E = d(A), q = d(l);
    return Bn(E, q, _);
  }, e.addHook = function(A, l) {
    typeof l == "function" && pn(ae[A], l);
  }, e.removeHook = function(A, l) {
    if (l !== void 0) {
      const _ = Bo(ae[A], l);
      return _ === -1 ? void 0 : Uo(ae[A], _, 1)[0];
    }
    return Ms(ae[A]);
  }, e.removeHooks = function(A) {
    ae[A] = [];
  }, e.removeAllHooks = function() {
    ae = Us();
  }, e;
}
var zs = or();
class ta extends kn {
  constructor(e, t) {
    super(e, t), this.textContainer = document.createElement("div"), this.textContainer.classList.add("text-card"), this.root.appendChild(this.textContainer), this.textContainer.style.backgroundColor = e.background_color;
    const i = ar(
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
function ar(n, e) {
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
    t.innerHTML = zs.sanitize(r);
  }) : t.innerHTML = zs.sanitize(s), t;
}
class na extends kn {
  constructor(e, t) {
    if (super(e, t), this.pageIndex = 0, this.onPressDone = null, e.pages.length === 0)
      throw new Error("No markdown pages provided to MarkdownPagesViewer");
    const i = document.createElement("div");
    i.classList.add("markdown-pages-viewer"), this.root.appendChild(i), this.viewerDiv = document.createElement("div"), this.viewerDiv.classList.add("markdown-pages-viewer__window"), i.appendChild(this.viewerDiv), this.contentPages = [];
    for (const r of e.pages) {
      const a = ar(
        r,
        (c) => this.boardView.getCoordinateSystem().getSizePx(c) + "px"
      );
      this.contentPages.push(a);
    }
    let s = document.createElement("div");
    s.classList.add("nav-tray"), i.appendChild(s), this.navButtons = new ia(), this.navButtons.mount(s), this.doneButton = new ji("Done"), this.doneButton.mount(s), this.goToPage(0), this.navButtons.addButtonPressListeners(
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
class ia extends Ee {
  constructor() {
    super(), this.root = document.createElement("div"), this.lastButton = new ji("←"), this.lastButton.mount(this.root), this.nextButton = new ji("→"), this.nextButton.mount(this.root);
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
class ji extends Ee {
  constructor(e) {
    super();
    const t = document.createElement("button");
    t.className = "nav-tray__button", t.textContent = e, this.root = t;
  }
  addButtonPressListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class sa extends kn {
  constructor(e, t) {
    super(e, t), this.imageContainer = document.createElement("div"), this.imageContainer.classList.add("image-card"), this.root.appendChild(this.imageContainer), this.imageLoadedPromise = (async () => {
      this.image = await t.assetManager.loadImageAsset(
        e.image_link
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
class ra extends kn {
  constructor(e, t) {
    super(e, t), this.videoContainer = document.createElement("div"), this.videoContainer.classList.add("video-card"), this.root.appendChild(this.videoContainer), this.videoLoadedPromise = (async () => {
      this.video = await t.assetManager.loadVideoAsset(
        e.video_link
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
    await super.start(), this.video.autoplay = !0, this.video.controls = !1;
    let e = new Promise((i, s) => {
      setTimeout(() => {
        s(new Error("Video failed to play!"));
      }, 33);
    }), t = new Promise((i, s) => {
      this.video.onplaying = () => {
        i(null);
      };
    });
    await Promise.race([t, e]);
  }
}
class oa {
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
class aa {
  // Map of sensor ID to SensorBinding
  constructor(e, t, i) {
    this.cardViews = /* @__PURE__ */ new Map(), this.sensorBindings = /* @__PURE__ */ new Map(), this.root = document.createElement("div"), this.root.className = "board-view", this.root.id = `${e}`, this.root.style.width = t.board_width_px + "px", this.root.style.height = t.board_height_px + "px", this.assetManager = i, this.reset(), this.setState(!1, !1);
  }
  getCoordinateSystem() {
    const { width: e, height: t } = this.root.getBoundingClientRect();
    return new oa(e, t);
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
    const t = await ca(
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
    const i = la(e, t, this);
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
function la(n, e, t) {
  if (n.sensor_type === "TimeoutSensor")
    return new Wr(
      n.sensor_id,
      e,
      n.t_armed
    );
  if (n.sensor_type === "KeySensor")
    return new qr(
      n.sensor_id,
      e,
      n.key
    );
  if (n.sensor_type == "ClickSensor") {
    let i = t.getCardView(n.card_id);
    return Xr(i), new jr(
      n.sensor_id,
      e,
      i,
      t
    );
  } else if (n.sensor_type == "DoneSensor") {
    let i = t.getCardView(n.card_id);
    return Yr(i), new Gr(
      n.sensor_id,
      e,
      i
    );
  } else
    throw new Error(`Unknown Sensor of type ${n.sensor_type}`);
}
async function ca(n, e) {
  let t = null;
  switch (n.card_type) {
    case "FixationPointCard":
      t = new Zr(
        n,
        e
      );
      break;
    case "MarkdownPagesCard":
      t = new na(
        n,
        e
      );
      break;
    case "ImageCard":
      t = new sa(
        n,
        e
      );
      break;
    case "VideoCard":
      t = new ra(
        n,
        e
      );
      break;
    case "TextCard":
      t = new ta(
        n,
        e
      );
      break;
    default:
      throw new Error(`Unsupported Card type: ${n}`);
  }
  return await t.load(), t;
}
class ua {
  constructor(e) {
    this.boardViews = /* @__PURE__ */ new Map(), this.activeBoardId = null, this.root = document.createElement("div"), this.root.className = "board-views-ui", this.assetManager = e;
  }
  createBoardView(e, t) {
    if (this.boardViews.has(e))
      return this.getBoardView(e);
    const i = new aa(e, t, this.assetManager);
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
class ha {
  async loadImageAsset(e) {
    let t = new Image();
    return t.src = e.asset_url, new Promise(
      (i, s) => {
        t.onload = () => i(t), t.onerror = (r) => s(r);
      }
    );
  }
  async loadVideoAsset(e) {
    let t = document.createElement("video");
    return t.src = e.asset_url, new Promise((i, s) => {
      t.oncanplaythrough = () => i(t), t.onerror = (r) => s(r);
    });
  }
}
function da() {
  const n = document.createElement("div");
  document.body.appendChild(n);
  const e = document.createElement("div");
  e.classList.add("node-engine-container"), n.appendChild(e);
  const t = document.createElement("div");
  t.classList.add("node-engine-content"), e.appendChild(t);
  const i = new ha(), s = new ua(
    i
  );
  t.appendChild(s.root);
  const r = new Vr();
  return r.mount(t), {
    boardViewsUI: s,
    shellUI: r,
    assetManager: i
  };
}
class Hs {
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
class pa {
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
class fa {
  constructor(e, t) {
    this.prepared = !1, this.started = !1, this.terminated = !1, this.abortController = new AbortController(), this.boardView = t, this.node = e, this.scheduler = new Hs(this.abortController.signal);
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
      const i = new pa(this.boardView);
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
    for (const a of this.node.consequences)
      e.sensor_id === a.sensor_id && (t = a.cards);
    const i = new Hs(this.abortController.signal);
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
class ga {
  constructor(e) {
    this.bufferedNodePlays = /* @__PURE__ */ new Map();
    const { shellUI: t, boardViewsUI: i } = da();
    this.shellUI = t, this.boardViewsUI = i, this._boardShape = e;
    try {
      if (!Rr.isValidDevice())
        throw new Error("Unsupported device. Please use a desktop browser.");
    } catch (s) {
      throw this.showErrorMessageOverlay(s), new Error("NodePlayer initialization failed: " + s.message);
    }
  }
  async prepare(e) {
    try {
      const t = crypto.randomUUID(), i = this.boardViewsUI.createBoardView(t, this._boardShape), s = new fa(
        e,
        i
      );
      return await s.prepare(), this.bufferedNodePlays.set(t, s), t;
    } catch (t) {
      throw this.showErrorMessageOverlay(t), new Error("NodePlayer preparation failed: " + t.message);
    }
  }
  async play(e) {
    try {
      const t = this.bufferedNodePlays.get(e);
      if (!t)
        throw new Error(`NodePlay ${e} does not exist. `);
      this.boardViewsUI.setActiveBoard(e);
      const i = await t.run();
      return this.boardViewsUI.destroyBoardView(e), this.bufferedNodePlays.delete(e), i;
    } catch (t) {
      throw this.showErrorMessageOverlay(t), t;
    }
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
function ma(n, e) {
  let t = 0, i = {};
  for (const r of e.nodes)
    i[r.node_id] = r.consequences;
  n.sort((r, a) => r.event_timestamp.localeCompare(a.event_timestamp));
  let s = /* @__PURE__ */ new Set();
  for (let r = 0; r < n.length; r++) {
    const a = n[r];
    if (a.event_type !== "NodeResultEvent")
      continue;
    const c = a.event_payload, u = c.action.sensor_id;
    if (!s.has(c.node_id)) {
      s.add(c.node_id);
      for (const p of i[c.node_id] || [])
        if (p.sensor_id === u) {
          let M = parseFloat(p.bonus_amount_usd);
          !isNaN(M) && M > 0 && (t += M);
        }
    }
  }
  return t = Math.max(0, t), t = Math.round(t * 100) / 100, t;
}
function wa() {
  return {
    user_agent: navigator.userAgent,
    display_width_px: screen.width,
    display_height_px: screen.height,
    viewport_width_px: window.innerWidth,
    viewport_height_px: window.innerHeight
  };
}
function vt() {
  return crypto.randomUUID();
}
function kt() {
  return Et(performance.now());
}
async function xa(n, e = null, t = []) {
  e || (e = (O) => {
  });
  let i = t;
  const s = n.nodekit_version;
  function r() {
    if (document.visibilityState === "hidden") {
      const O = {
        event_id: vt(),
        event_timestamp: kt(),
        event_type: "LeaveEvent",
        event_payload: {},
        nodekit_version: s
      };
      i.push(O), e(O);
    } else if (document.visibilityState === "visible") {
      const O = {
        event_id: vt(),
        event_timestamp: kt(),
        event_type: "ReturnEvent",
        event_payload: {},
        nodekit_version: s
      };
      i.push(O), e(O);
    }
  }
  document.addEventListener("visibilitychange", r);
  const a = {
    event_id: vt(),
    event_timestamp: kt(),
    event_type: "StartEvent",
    event_payload: {},
    nodekit_version: s
  };
  i.push(a), e(a);
  const c = wa(), h = {
    event_id: vt(),
    event_timestamp: kt(),
    event_type: "BrowserContextEvent",
    event_payload: c,
    nodekit_version: s
  };
  i.push(h), e(h);
  const u = n.nodes;
  let p = new ga(n.board);
  for (let O = 0; O < u.length; O++) {
    const H = u[O], Se = await p.prepare(H);
    let de = await p.play(Se);
    p.setProgressBar((O + 1) / u.length * 100);
    const ce = {
      event_id: vt(),
      event_timestamp: kt(),
      event_type: "NodeResultEvent",
      event_payload: {
        node_id: H.node_id,
        node_execution_index: O,
        timestamp_start: de.timestamp_start,
        timestamp_end: de.timestamp_end,
        action: de.action
      },
      nodekit_version: s
    };
    i.push(ce), e(ce);
  }
  const M = ma(
    i,
    n
  );
  let k = "";
  if (M > 0 && (k = `Bonus: ${M} USD (pending validation)`), await p.playEndScreen(k), k !== "") {
    const O = {
      event_id: vt(),
      event_timestamp: kt(),
      event_type: "BonusDisclosureEvent",
      event_payload: {
        bonus_amount_usd: M.toFixed(2)
      },
      nodekit_version: s
    };
    i.push(O), e(O);
  }
  const z = {
    event_id: vt(),
    event_timestamp: kt(),
    event_type: "EndEvent",
    event_payload: {},
    nodekit_version: s
  };
  return i.push(z), e(z), document.removeEventListener("visibilitychange", r), p.showConsoleMessageOverlay(
    "Events",
    i
  ), i;
}
export {
  xa as play
};
