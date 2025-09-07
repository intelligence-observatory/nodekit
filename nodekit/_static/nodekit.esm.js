var mr = Object.defineProperty;
var wr = (n, e, t) => e in n ? mr(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var K = (n, e, t) => wr(n, typeof e != "symbol" ? e + "" : e, t);
var br = "2.0.4", Di = 500, cs = "user-agent", zt = "", us = "?", Qn = "function", ht = "undefined", Ht = "object", Ni = "string", ge = "browser", Ye = "cpu", Ve = "device", Pe = "engine", Te = "os", Bt = "result", b = "name", p = "type", m = "vendor", _ = "version", me = "architecture", xn = "major", g = "model", bn = "console", P = "mobile", G = "tablet", ie = "smarttv", He = "wearable", Fn = "xr", _n = "embedded", sn = "inapp", Gi = "brands", vt = "formFactors", Wi = "fullVersionList", Ut = "platform", qi = "platformVersion", si = "bitness", dt = "sec-ch-ua", _r = dt + "-full-version-list", yr = dt + "-arch", xr = dt + "-" + si, vr = dt + "-form-factors", kr = dt + "-" + P, Er = dt + "-" + g, $s = dt + "-" + Ut, Tr = $s + "-version", Fs = [Gi, Wi, P, g, Ut, qi, me, vt, si], Vn = "Amazon", It = "Apple", hs = "ASUS", ds = "BlackBerry", xt = "Google", ps = "Huawei", wi = "Lenovo", fs = "Honor", jn = "LG", bi = "Microsoft", _i = "Motorola", yi = "Nvidia", gs = "OnePlus", xi = "OPPO", rn = "Samsung", ms = "Sharp", on = "Sony", vi = "Xiaomi", ki = "Zebra", ws = "Chrome", bs = "Chromium", ct = "Chromecast", Xn = "Edge", an = "Firefox", ln = "Opera", Ei = "Facebook", _s = "Sogou", Pt = "Mobile ", cn = " Browser", Bi = "Windows", Sr = typeof window !== ht, we = Sr && window.navigator ? window.navigator : void 0, ut = we && we.userAgentData ? we.userAgentData : void 0, Ar = function(n, e) {
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
}, Ti = function(n) {
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
}, Si = function(n) {
  return Ft(n) ? $t(/[^\d\.]/g, n).split(".")[0] : void 0;
}, Qe = function(n) {
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
    return n = $t(/^\s\s*/, n), typeof e === ht ? n : n.substring(0, Di);
}, Ai = function(n, e) {
  if (!(!n || !e))
    for (var t = 0, i, s, r, a, l, h; t < e.length && !l; ) {
      var u = e[t], f = e[t + 1];
      for (i = s = 0; i < u.length && !l && u[i]; )
        if (l = u[i++].exec(n), l)
          for (r = 0; r < f.length; r++)
            h = l[++s], a = f[r], typeof a === Ht && a.length > 0 ? a.length === 2 ? typeof a[1] == Qn ? this[a[0]] = a[1].call(this, h) : this[a[0]] = a[1] : a.length >= 3 && (typeof a[1] === Qn && !(a[1].exec && a[1].test) ? a.length > 3 ? this[a[0]] = h ? a[1].apply(this, a.slice(2)) : void 0 : this[a[0]] = h ? a[1].call(this, h, a[2]) : void 0 : a.length == 3 ? this[a[0]] = h ? h.replace(a[1], a[2]) : void 0 : a.length == 4 ? this[a[0]] = h ? a[3].call(this, h.replace(a[1], a[2])) : void 0 : a.length > 4 && (this[a[0]] = h ? a[3].apply(this, [h.replace(a[1], a[2])].concat(a.slice(4))) : void 0)) : this[a] = h || void 0;
      t += 2;
    }
}, Fe = function(n, e) {
  for (var t in e)
    if (typeof e[t] === Ht && e[t].length > 0) {
      for (var i = 0; i < e[t].length; i++)
        if (Ui(e[t][i], n))
          return t === us ? void 0 : t;
    } else if (Ui(e[t], n))
      return t === us ? void 0 : t;
  return e.hasOwnProperty("*") ? e["*"] : n;
}, ys = {
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
}, xs = {
  embedded: "Automotive",
  mobile: "Mobile",
  tablet: ["Tablet", "EInk"],
  smarttv: "TV",
  wearable: "Watch",
  xr: ["VR", "XR"],
  "?": ["Desktop", "Unknown"],
  "*": void 0
}, Cr = {
  Chrome: "Google Chrome",
  Edge: "Microsoft Edge",
  "Edge WebView2": "Microsoft Edge WebView2",
  "Chrome WebView": "Android WebView",
  "Chrome Headless": "HeadlessChrome",
  "Huawei Browser": "HuaweiBrowser",
  "MIUI Browser": "Miui Browser",
  "Opera Mobi": "OperaMobile",
  Yandex: "YaBrowser"
}, vs = {
  browser: [
    [
      // Most common regardless engine
      /\b(?:crmo|crios)\/([\w\.]+)/i
      // Chrome for Android/iOS
    ],
    [_, [b, Pt + "Chrome"]],
    [
      /webview.+edge\/([\w\.]+)/i
      // Microsoft Edge
    ],
    [_, [b, Xn + " WebView"]],
    [
      /edg(?:e|ios|a)?\/([\w\.]+)/i
    ],
    [_, [b, "Edge"]],
    [
      // Presto based
      /(opera mini)\/([-\w\.]+)/i,
      // Opera Mini
      /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
      // Opera Mobi/Tablet
      /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i
      // Opera
    ],
    [b, _],
    [
      /opios[\/ ]+([\w\.]+)/i
      // Opera mini on iphone >= 8.0
    ],
    [_, [b, ln + " Mini"]],
    [
      /\bop(?:rg)?x\/([\w\.]+)/i
      // Opera GX
    ],
    [_, [b, ln + " GX"]],
    [
      /\bopr\/([\w\.]+)/i
      // Opera Webkit
    ],
    [_, [b, ln]],
    [
      // Mixed
      /\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i
      // Baidu
    ],
    [_, [b, "Baidu"]],
    [
      /\b(?:mxbrowser|mxios|myie2)\/?([-\w\.]*)\b/i
      // Maxthon
    ],
    [_, [b, "Maxthon"]],
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
    [b, _],
    [
      /quark(?:pc)?\/([-\w\.]+)/i
      // Quark
    ],
    [_, [b, "Quark"]],
    [
      /\bddg\/([\w\.]+)/i
      // DuckDuckGo
    ],
    [_, [b, "DuckDuckGo"]],
    [
      /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i
      // UCBrowser
    ],
    [_, [b, "UCBrowser"]],
    [
      /microm.+\bqbcore\/([\w\.]+)/i,
      // WeChat Desktop for Windows Built-in Browser
      /\bqbcore\/([\w\.]+).+microm/i,
      /micromessenger\/([\w\.]+)/i
      // WeChat
    ],
    [_, [b, "WeChat"]],
    [
      /konqueror\/([\w\.]+)/i
      // Konqueror
    ],
    [_, [b, "Konqueror"]],
    [
      /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i
      // IE11
    ],
    [_, [b, "IE"]],
    [
      /ya(?:search)?browser\/([\w\.]+)/i
      // Yandex
    ],
    [_, [b, "Yandex"]],
    [
      /slbrowser\/([\w\.]+)/i
      // Smart Lenovo Browser
    ],
    [_, [b, "Smart " + wi + cn]],
    [
      /(avast|avg)\/([\w\.]+)/i
      // Avast/AVG Secure Browser
    ],
    [[b, /(.+)/, "$1 Secure" + cn], _],
    [
      /\bfocus\/([\w\.]+)/i
      // Firefox Focus
    ],
    [_, [b, an + " Focus"]],
    [
      /\bopt\/([\w\.]+)/i
      // Opera Touch
    ],
    [_, [b, ln + " Touch"]],
    [
      /coc_coc\w+\/([\w\.]+)/i
      // Coc Coc Browser
    ],
    [_, [b, "Coc Coc"]],
    [
      /dolfin\/([\w\.]+)/i
      // Dolphin
    ],
    [_, [b, "Dolphin"]],
    [
      /coast\/([\w\.]+)/i
      // Opera Coast
    ],
    [_, [b, ln + " Coast"]],
    [
      /miuibrowser\/([\w\.]+)/i
      // MIUI Browser
    ],
    [_, [b, "MIUI" + cn]],
    [
      /fxios\/([\w\.-]+)/i
      // Firefox for iOS
    ],
    [_, [b, Pt + an]],
    [
      /\bqihoobrowser\/?([\w\.]*)/i
      // 360
    ],
    [_, [b, "360"]],
    [
      /\b(qq)\/([\w\.]+)/i
      // QQ
    ],
    [[b, /(.+)/, "$1Browser"], _],
    [
      /(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i
    ],
    [[b, /(.+)/, "$1" + cn], _],
    [
      // Oculus/Sailfish/HuaweiBrowser/VivoBrowser/PicoBrowser
      /samsungbrowser\/([\w\.]+)/i
      // Samsung Internet
    ],
    [_, [b, rn + " Internet"]],
    [
      /metasr[\/ ]?([\d\.]+)/i
      // Sogou Explorer
    ],
    [_, [b, _s + " Explorer"]],
    [
      /(sogou)mo\w+\/([\d\.]+)/i
      // Sogou Mobile
    ],
    [[b, _s + " Mobile"], _],
    [
      /(electron)\/([\w\.]+) safari/i,
      // Electron-based App
      /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
      // Tesla
      /m?(qqbrowser|2345(?=browser|chrome|explorer))\w*[\/ ]?v?([\w\.]+)/i
      // QQ/2345
    ],
    [b, _],
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
    [_, b],
    [
      // WebView
      /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i
      // Facebook App for iOS & Android
    ],
    [[b, Ei], _, [p, sn]],
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
    [b, _, [p, sn]],
    [
      /\bgsa\/([\w\.]+) .*safari\//i
      // Google Search Appliance on iOS
    ],
    [_, [b, "GSA"], [p, sn]],
    [
      /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i
      // TikTok
    ],
    [_, [b, "TikTok"], [p, sn]],
    [
      /\[(linkedin)app\]/i
      // LinkedIn App for iOS & Android
    ],
    [b, [p, sn]],
    [
      /(chromium)[\/ ]([-\w\.]+)/i
      // Chromium
    ],
    [b, _],
    [
      /headlesschrome(?:\/([\w\.]+)| )/i
      // Chrome Headless
    ],
    [_, [b, ws + " Headless"]],
    [
      /wv\).+chrome\/([\w\.]+).+edgw\//i
      // Edge WebView2
    ],
    [_, [b, Xn + " WebView2"]],
    [
      / wv\).+(chrome)\/([\w\.]+)/i
      // Chrome WebView
    ],
    [[b, ws + " WebView"], _],
    [
      /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
      // Android Browser
    ],
    [_, [b, "Android" + cn]],
    [
      /chrome\/([\w\.]+) mobile/i
      // Chrome Mobile
    ],
    [_, [b, Pt + "Chrome"]],
    [
      /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
      // Chrome/OmniWeb/Arora/Tizen/Nokia
    ],
    [b, _],
    [
      /version\/([\w\.\,]+) .*mobile(?:\/\w+ | ?)safari/i
      // Safari Mobile
    ],
    [_, [b, Pt + "Safari"]],
    [
      /iphone .*mobile(?:\/\w+ | ?)safari/i
    ],
    [[b, Pt + "Safari"]],
    [
      /version\/([\w\.\,]+) .*(safari)/i
      // Safari
    ],
    [_, b],
    [
      /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i
      // Safari < 3.0
    ],
    [b, [_, "1"]],
    [
      /(webkit|khtml)\/([\w\.]+)/i
    ],
    [b, _],
    [
      // Gecko based
      /(?:mobile|tablet);.*(firefox)\/([\w\.-]+)/i
      // Firefox Mobile
    ],
    [[b, Pt + an], _],
    [
      /(navigator|netscape\d?)\/([-\w\.]+)/i
      // Netscape
    ],
    [[b, "Netscape"], _],
    [
      /(wolvic|librewolf)\/([\w\.]+)/i
      // Wolvic/LibreWolf
    ],
    [b, _],
    [
      /mobile vr; rv:([\w\.]+)\).+firefox/i
      // Firefox Reality
    ],
    [_, [b, an + " Reality"]],
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
    [b, [_, /_/g, "."]],
    [
      /(cobalt)\/([\w\.]+)/i
      // Cobalt
    ],
    [b, [_, /[^\d\.]+./, zt]]
  ],
  cpu: [
    [
      /\b((amd|x|x86[-_]?|wow|win)64)\b/i
      // AMD64 (x64)
    ],
    [[me, "amd64"]],
    [
      /(ia32(?=;))/i,
      // IA32 (quicktime)
      /\b((i[346]|x)86)(pc)?\b/i
      // IA32 (x86)
    ],
    [[me, "ia32"]],
    [
      /\b(aarch64|arm(v?[89]e?l?|_?64))\b/i
      // ARM64
    ],
    [[me, "arm64"]],
    [
      /\b(arm(v[67])?ht?n?[fl]p?)\b/i
      // ARMHF
    ],
    [[me, "armhf"]],
    [
      // PocketPC mistakenly identified as PowerPC
      /( (ce|mobile); ppc;|\/[\w\.]+arm\b)/i
    ],
    [[me, "arm"]],
    [
      /((ppc|powerpc)(64)?)( mac|;|\))/i
      // PowerPC
    ],
    [[me, /ower/, zt, Ze]],
    [
      / sun4\w[;\)]/i
      // SPARC
    ],
    [[me, "sparc"]],
    [
      /\b(avr32|ia64(?=;)|68k(?=\))|\barm(?=v([1-7]|[5-7]1)l?|;|eabi)|(irix|mips|sparc)(64)?\b|pa-risc)/i
      // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
    ],
    [[me, Ze]]
  ],
  device: [
    [
      //////////////////////////
      // MOBILES & TABLETS
      /////////////////////////
      // Samsung
      /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
    ],
    [g, [m, rn], [p, G]],
    [
      /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
      /samsung[- ]((?!sm-[lr]|browser)[-\w]+)/i,
      /sec-(sgh\w+)/i
    ],
    [g, [m, rn], [p, P]],
    [
      // Apple
      /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i
      // iPod/iPhone
    ],
    [g, [m, It], [p, P]],
    [
      /\((ipad);[-\w\),; ]+apple/i,
      // iPad
      /applecoremedia\/[\w\.]+ \((ipad)/i,
      /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
    ],
    [g, [m, It], [p, G]],
    [
      /(macintosh);/i
    ],
    [g, [m, It]],
    [
      // Sharp
      /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
    ],
    [g, [m, ms], [p, P]],
    [
      // Honor
      /\b((?:brt|eln|hey2?|gdi|jdn)-a?[lnw]09|(?:ag[rm]3?|jdn2|kob2)-a?[lw]0[09]hn)(?: bui|\)|;)/i
    ],
    [g, [m, fs], [p, G]],
    [
      /honor([-\w ]+)[;\)]/i
    ],
    [g, [m, fs], [p, P]],
    [
      // Huawei
      /\b((?:ag[rs][2356]?k?|bah[234]?|bg[2o]|bt[kv]|cmr|cpn|db[ry]2?|jdn2|got|kob2?k?|mon|pce|scm|sht?|[tw]gr|vrd)-[ad]?[lw][0125][09]b?|605hw|bg2-u03|(?:gem|fdr|m2|ple|t1)-[7a]0[1-4][lu]|t1-a2[13][lw]|mediapad[\w\. ]*(?= bui|\)))\b(?!.+d\/s)/i
    ],
    [g, [m, ps], [p, G]],
    [
      /(?:huawei)([-\w ]+)[;\)]/i,
      /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
    ],
    [g, [m, ps], [p, P]],
    [
      // Xiaomi
      /oid[^\)]+; (2[\dbc]{4}(182|283|rp\w{2})[cgl]|m2105k81a?c)(?: bui|\))/i,
      /\b((?:red)?mi[-_ ]?pad[\w- ]*)(?: bui|\))/i
      // Mi Pad tablets
    ],
    [[g, /_/g, " "], [m, vi], [p, G]],
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
    [[g, /_/g, " "], [m, vi], [p, P]],
    [
      // OnePlus
      /droid.+; (cph2[3-6]\d[13579]|((gm|hd)19|(ac|be|in|kb)20|(d[en]|eb|le|mt)21|ne22)[0-2]\d|p[g-k]\w[1m]10)\b/i,
      /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
    ],
    [g, [m, gs], [p, P]],
    [
      // OPPO
      /; (\w+) bui.+ oppo/i,
      /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
    ],
    [g, [m, xi], [p, P]],
    [
      /\b(opd2(\d{3}a?))(?: bui|\))/i
    ],
    [g, [m, Fe, { OnePlus: ["203", "304", "403", "404", "413", "415"], "*": xi }], [p, G]],
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
    [g, [m, wi], [p, G]],
    [
      /lenovo[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i
    ],
    [g, [m, wi], [p, P]],
    [
      // Motorola
      /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
      /\bmot(?:orola)?[- ]([\w\s]+)(\)| bui)/i,
      /((?:moto(?! 360)[-\w\(\) ]+|xt\d{3,4}[cgkosw\+]?[-\d]*|nexus 6)(?= bui|\)))/i
    ],
    [g, [m, _i], [p, P]],
    [
      /\b(mz60\d|xoom[2 ]{0,2}) build\//i
    ],
    [g, [m, _i], [p, G]],
    [
      // LG
      /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
    ],
    [g, [m, jn], [p, G]],
    [
      /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
      /\blg[-e;\/ ]+(?!.*(?:browser|netcast|android tv|watch|webos))(\w+)/i,
      /\blg-?([\d\w]+) bui/i
    ],
    [g, [m, jn], [p, P]],
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
    [g, [m, xt], [p, G]],
    [
      // Google Pixel
      /droid.+;(?: google)? (g(01[13]a|020[aem]|025[jn]|1b60|1f8f|2ybb|4s1m|576d|5nz6|8hhn|8vou|a02099|c15s|d1yq|e2ae|ec77|gh2x|kv4x|p4bc|pj41|r83y|tt9q|ur25|wvk6)|pixel[\d ]*a?( pro)?( xl)?( fold)?( \(5g\))?)( bui|\))/i
    ],
    [g, [m, xt], [p, P]],
    [
      /(google) (pixelbook( go)?)/i
    ],
    [m, g],
    [
      // Sony
      /droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-\w\w\d\d)(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
    ],
    [g, [m, on], [p, P]],
    [
      /sony tablet [ps]/i,
      /\b(?:sony)?sgp\w+(?: bui|\))/i
    ],
    [[g, "Xperia Tablet"], [m, on], [p, G]],
    [
      // Amazon
      /(alexa)webm/i,
      /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,
      // Kindle Fire without Silk / Echo Show
      /(kf[a-z]+)( bui|\)).+silk\//i
      // Kindle Fire HD
    ],
    [g, [m, Vn], [p, G]],
    [
      /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
      // Fire Phone
    ],
    [[g, /(.+)/g, "Fire Phone $1"], [m, Vn], [p, P]],
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
    [g, [m, ds], [p, P]],
    [
      // Asus
      /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
    ],
    [g, [m, hs], [p, G]],
    [
      / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
    ],
    [g, [m, hs], [p, P]],
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
    [[m, Ze], g, [p, Fe, { tablet: ["p10001l", "w7001"], "*": "mobile" }]],
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
    [g, [m, bi], [p, G]],
    [
      /droid [\d\.]+; (fp\du?)(?: b|\))/i
      // Fairphone
    ],
    [g, [m, "Fairphone"], [p, P]],
    [
      /((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i
      // Nvidia Tablets
    ],
    [g, [m, yi], [p, G]],
    [
      /(sprint) (\w+)/i
      // Sprint Phones
    ],
    [m, g, [p, P]],
    [
      /(kin\.[onetw]{3})/i
      // Microsoft Kin
    ],
    [[g, /\./g, " "], [m, bi], [p, P]],
    [
      /droid.+; ([c6]+|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
      // Zebra
    ],
    [g, [m, ki], [p, G]],
    [
      /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
    ],
    [g, [m, ki], [p, P]],
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
    [[g, /^/, "SmartTV"], [m, rn], [p, ie]],
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
    [[m, jn], [p, ie]],
    [
      /(apple) ?tv/i
      // Apple TV
    ],
    [m, [g, It + " TV"], [p, ie]],
    [
      /crkey.*devicetype\/chromecast/i
      // Google Chromecast Third Generation
    ],
    [[g, ct + " Third Generation"], [m, xt], [p, ie]],
    [
      /crkey.*devicetype\/([^/]*)/i
      // Google Chromecast with specific device type
    ],
    [[g, /^/, "Chromecast "], [m, xt], [p, ie]],
    [
      /fuchsia.*crkey/i
      // Google Chromecast Nest Hub
    ],
    [[g, ct + " Nest Hub"], [m, xt], [p, ie]],
    [
      /crkey/i
      // Google Chromecast, Linux-based or unknown
    ],
    [[g, ct], [m, xt], [p, ie]],
    [
      /(portaltv)/i
      // Facebook Portal TV
    ],
    [g, [m, Ei], [p, ie]],
    [
      /droid.+aft(\w+)( bui|\))/i
      // Fire TV
    ],
    [g, [m, Vn], [p, ie]],
    [
      /(shield \w+ tv)/i
      // Nvidia Shield TV
    ],
    [g, [m, yi], [p, ie]],
    [
      /\(dtv[\);].+(aquos)/i,
      /(aquos-tv[\w ]+)\)/i
      // Sharp
    ],
    [g, [m, ms], [p, ie]],
    [
      /(bravia[\w ]+)( bui|\))/i
      // Sony
    ],
    [g, [m, on], [p, ie]],
    [
      /(mi(tv|box)-?\w+) bui/i
      // Xiaomi
    ],
    [g, [m, vi], [p, ie]],
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
    [[m, /.+\/(\w+)/, "$1", Fe, { LG: "lge" }], [g, ei], [p, ie]],
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
    [g, [m, on], [p, bn]],
    [
      /\b(xbox(?: one)?(?!; xbox))[\); ]/i
      // Microsoft Xbox
    ],
    [g, [m, bi], [p, bn]],
    [
      /(ouya)/i,
      // Ouya
      /(nintendo) (\w+)/i,
      // Nintendo
      /(retroid) (pocket ([^\)]+))/i
      // Retroid Pocket
    ],
    [m, g, [p, bn]],
    [
      /droid.+; (shield)( bui|\))/i
      // Nvidia Portable
    ],
    [g, [m, yi], [p, bn]],
    [
      ///////////////////
      // WEARABLES
      ///////////////////
      /\b(sm-[lr]\d\d[0156][fnuw]?s?|gear live)\b/i
      // Samsung Galaxy Watch
    ],
    [g, [m, rn], [p, He]],
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
    [g, [m, xi], [p, He]],
    [
      /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i
      // Apple Watch
    ],
    [g, [m, It], [p, He]],
    [
      /(opwwe\d{3})/i
      // OnePlus Watch
    ],
    [g, [m, gs], [p, He]],
    [
      /(moto 360)/i
      // Motorola 360
    ],
    [g, [m, _i], [p, He]],
    [
      /(smartwatch 3)/i
      // Sony SmartWatch
    ],
    [g, [m, on], [p, He]],
    [
      /(g watch r)/i
      // LG G Watch R
    ],
    [g, [m, jn], [p, He]],
    [
      /droid.+; (wt63?0{2,3})\)/i
    ],
    [g, [m, ki], [p, He]],
    [
      ///////////////////
      // XR
      ///////////////////
      /droid.+; (glass) \d/i
      // Google Glass
    ],
    [g, [m, xt], [p, Fn]],
    [
      /(pico) (4|neo3(?: link|pro)?)/i
      // Pico
    ],
    [m, g, [p, Fn]],
    [
      /(quest( \d| pro)?s?).+vr/i
      // Meta Quest
    ],
    [g, [m, Ei], [p, Fn]],
    [
      /mobile vr; rv.+firefox/i
      // Unidentifiable VR device using Firefox Reality / Wolvic
    ],
    [[p, Fn]],
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
    [g, [m, Vn], [p, _n]],
    [
      /(homepod).+mac os/i
      // Apple HomePod
    ],
    [g, [m, It], [p, _n]],
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
    [g, [p, Fe, { mobile: "Mobile", xr: "VR", "*": G }]],
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
    [_, [b, Xn + "HTML"]],
    [
      /(arkweb)\/([\w\.]+)/i
      // ArkWeb
    ],
    [b, _],
    [
      /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i
      // Blink
    ],
    [_, [b, "Blink"]],
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
    [b, _],
    [
      /ladybird\//i
    ],
    [[b, "LibWeb"]],
    [
      /rv\:([\w\.]{1,9})\b.+(gecko)/i
      // Gecko
    ],
    [_, b]
  ],
  os: [
    [
      // Windows
      /(windows nt) (6\.[23]); arm/i
      // Windows RT
    ],
    [[b, /N/, "R"], [_, Fe, ys]],
    [
      /(windows (?:phone|mobile|iot))(?: os)?[\/ ]?([\d\.]*( se)?)/i,
      // Windows IoT/Mobile/Phone
      // Windows NT/3.1/95/98/ME/2000/XP/Vista/7/8/8.1/10/11
      /(windows)[\/ ](1[01]|2000|3\.1|7|8(\.1)?|9[58]|me|server 20\d\d( r2)?|vista|xp)/i
    ],
    [b, _],
    [
      /windows nt ?([\d\.\)]*)(?!.+xbox)/i,
      /\bwin(?=3| ?9|n)(?:nt| 9x )?([\d\.;]*)/i
    ],
    [[_, /(;|\))/g, "", Fe, ys], [b, Bi]],
    [
      /(windows ce)\/?([\d\.]*)/i
      // Windows CE
    ],
    [b, _],
    [
      // iOS/macOS
      /[adehimnop]{4,7}\b(?:.*os ([\w]+) like mac|; opera)/i,
      // iOS
      /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
      /cfnetwork\/.+darwin/i
    ],
    [[_, /_/g, "."], [b, "iOS"]],
    [
      /(mac os x) ?([\w\. ]*)/i,
      /(macintosh|mac_powerpc\b)(?!.+(haiku|morphos))/i
      // Mac OS
    ],
    [[b, "macOS"], [_, /_/g, "."]],
    [
      // Google Chromecast
      /android ([\d\.]+).*crkey/i
      // Google Chromecast, Android-based
    ],
    [_, [b, ct + " Android"]],
    [
      /fuchsia.*crkey\/([\d\.]+)/i
      // Google Chromecast, Fuchsia-based
    ],
    [_, [b, ct + " Fuchsia"]],
    [
      /crkey\/([\d\.]+).*devicetype\/smartspeaker/i
      // Google Chromecast, Linux-based Smart Speaker
    ],
    [_, [b, ct + " SmartSpeaker"]],
    [
      /linux.*crkey\/([\d\.]+)/i
      // Google Chromecast, Legacy Linux-based
    ],
    [_, [b, ct + " Linux"]],
    [
      /crkey\/([\d\.]+)/i
      // Google Chromecast, unknown
    ],
    [_, [b, ct]],
    [
      // Mobile OSes
      /droid ([\w\.]+)\b.+(android[- ]x86)/i
      // Android-x86
    ],
    [_, b],
    [
      /(ubuntu) ([\w\.]+) like android/i
      // Ubuntu Touch
    ],
    [[b, /(.+)/, "$1 Touch"], _],
    [
      /(harmonyos)[\/ ]?([\d\.]*)/i,
      // HarmonyOS
      // Android/Blackberry/WebOS/QNX/Bada/RIM/KaiOS/Maemo/MeeGo/S40/Sailfish OS/OpenHarmony/Tizen
      /(android|bada|blackberry|kaios|maemo|meego|openharmony|qnx|rim tablet os|sailfish|series40|symbian|tizen)\w*[-\/\.; ]?([\d\.]*)/i
    ],
    [b, _],
    [
      /\(bb(10);/i
      // BlackBerry 10
    ],
    [_, [b, ds]],
    [
      /(?:symbian ?os|symbos|s60(?=;)|series ?60)[-\/ ]?([\w\.]*)/i
      // Symbian
    ],
    [_, [b, "Symbian"]],
    [
      /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
      // Firefox OS
    ],
    [_, [b, an + " OS"]],
    [
      /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i,
      // WebOS
      /webos(?:[ \/]?|\.tv-20(?=2[2-9]))(\d[\d\.]*)/i
    ],
    [_, [b, "webOS"]],
    [
      /web0s;.+?(?:chr[o0]me|safari)\/(\d+)/i
      // https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine
    ],
    [[_, Fe, { 25: "120", 24: "108", 23: "94", 22: "87", 6: "79", 5: "68", 4: "53", 3: "38", 2: "538", 1: "537", "*": "TV" }], [b, "webOS"]],
    [
      /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i
      // watchOS
    ],
    [_, [b, "watchOS"]],
    [
      // Google ChromeOS
      /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i
      // Chromium OS
    ],
    [[b, "Chrome OS"], _],
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
    [b, _],
    [
      /(sunos) ?([\d\.]*)/i
      // Solaris
    ],
    [[b, "Solaris"], _],
    [
      /\b(beos|os\/2|amigaos|openvms|hp-ux|serenityos)/i,
      // BeOS/OS2/AmigaOS/OpenVMS/HP-UX/SerenityOS
      /(unix) ?([\w\.]*)/i
      // UNIX
    ],
    [b, _]
  ]
}, Gn = (function() {
  var n = { init: {}, isIgnore: {}, isIgnoreRgx: {}, toString: {} };
  return Qe.call(n.init, [
    [ge, [b, _, xn, p]],
    [Ye, [me]],
    [Ve, [p, g, m]],
    [Pe, [b, _]],
    [Te, [b, _]]
  ]), Qe.call(n.isIgnore, [
    [ge, [_, xn]],
    [Pe, [_]],
    [Te, [_]]
  ]), Qe.call(n.isIgnoreRgx, [
    [ge, / ?browser$/i],
    [Te, / ?os$/i]
  ]), Qe.call(n.toString, [
    [ge, [b, _]],
    [Ye, [me]],
    [Ve, [m, g]],
    [Pe, [b, _]],
    [Te, [b, _]]
  ]), n;
})(), Rr = function(n, e) {
  var t = Gn.init[e], i = Gn.isIgnore[e] || 0, s = Gn.isIgnoreRgx[e] || 0, r = Gn.toString[e] || 0;
  function a() {
    Qe.call(this, t);
  }
  return a.prototype.getItem = function() {
    return n;
  }, a.prototype.withClientHints = function() {
    return ut ? ut.getHighEntropyValues(Fs).then(function(l) {
      return n.setCH(new Vs(l, !1)).parseCH().get();
    }) : n.parseCH().get();
  }, a.prototype.withFeatureCheck = function() {
    return n.detectFeature().get();
  }, e != Bt && (a.prototype.is = function(l) {
    var h = !1;
    for (var u in this)
      if (this.hasOwnProperty(u) && !Ui(i, u) && Ze(s ? $t(s, this[u]) : this[u]) == Ze(s ? $t(s, l) : l)) {
        if (h = !0, l != ht) break;
      } else if (l == ht && h) {
        h = !h;
        break;
      }
    return h;
  }, a.prototype.toString = function() {
    var l = zt;
    for (var h in r)
      typeof this[r[h]] !== ht && (l += (l ? " " : zt) + this[r[h]]);
    return l || ht;
  }), ut || (a.prototype.then = function(l) {
    var h = this, u = function() {
      for (var A in h)
        h.hasOwnProperty(A) && (this[A] = h[A]);
    };
    u.prototype = {
      is: a.prototype.is,
      toString: a.prototype.toString
    };
    var f = new u();
    return l(f), f;
  }), new a();
};
function Vs(n, e) {
  if (n = n || {}, Qe.call(this, Fs), e)
    Qe.call(this, [
      [Gi, Ti(n[dt])],
      [Wi, Ti(n[_r])],
      [P, /\?1/.test(n[kr])],
      [g, un(n[Er])],
      [Ut, un(n[$s])],
      [qi, un(n[Tr])],
      [me, un(n[yr])],
      [vt, Ti(n[vr])],
      [si, un(n[xr])]
    ]);
  else
    for (var t in n)
      this.hasOwnProperty(t) && typeof n[t] !== ht && (this[t] = n[t]);
}
function ks(n, e, t, i) {
  return this.get = function(s) {
    return s ? this.data.hasOwnProperty(s) ? this.data[s] : void 0 : this.data;
  }, this.set = function(s, r) {
    return this.data[s] = r, this;
  }, this.setCH = function(s) {
    return this.uaCH = s, this;
  }, this.detectFeature = function() {
    if (we && we.userAgent == this.ua)
      switch (this.itemType) {
        case ge:
          we.brave && typeof we.brave.isBrave == Qn && this.set(b, "Brave");
          break;
        case Ve:
          !this.get(p) && ut && ut[P] && this.set(p, P), this.get(g) == "Macintosh" && we && typeof we.standalone !== ht && we.maxTouchPoints && we.maxTouchPoints > 2 && this.set(g, "iPad").set(p, G);
          break;
        case Te:
          !this.get(b) && ut && ut[Ut] && this.set(b, ut[Ut]);
          break;
        case Bt:
          var s = this.data, r = function(a) {
            return s[a].getItem().detectFeature().get();
          };
          this.set(ge, r(ge)).set(Ye, r(Ye)).set(Ve, r(Ve)).set(Pe, r(Pe)).set(Te, r(Te));
      }
    return this;
  }, this.parseUA = function() {
    return this.itemType != Bt && Ai.call(this.data, this.ua, this.rgxMap), this.itemType == ge && this.set(xn, Si(this.get(_))), this;
  }, this.parseCH = function() {
    var s = this.uaCH, r = this.rgxMap;
    switch (this.itemType) {
      case ge:
      case Pe:
        var a = s[Wi] || s[Gi], l;
        if (a)
          for (var h in a) {
            var u = a[h].brand || a[h], f = a[h].version;
            this.itemType == ge && !/not.a.brand/i.test(u) && (!l || /Chrom/.test(l) && u != bs || l == Xn && /WebView2/.test(u)) && (u = Fe(u, Cr), l = this.get(b), l && !/Chrom/.test(l) && /Chrom/.test(u) || this.set(b, u).set(_, f).set(xn, Si(f)), l = u), this.itemType == Pe && u == bs && this.set(_, f);
          }
        break;
      case Ye:
        var A = s[me];
        A && (A && s[si] == "64" && (A += "64"), Ai.call(this.data, A + ";", r));
        break;
      case Ve:
        if (s[P] && this.set(p, P), s[g] && (this.set(g, s[g]), !this.get(p) || !this.get(m))) {
          var v = {};
          Ai.call(v, "droid 9; " + s[g] + ")", r), !this.get(p) && v.type && this.set(p, v.type), !this.get(m) && v.vendor && this.set(m, v.vendor);
        }
        if (s[vt]) {
          var z;
          if (typeof s[vt] != "string")
            for (var I = 0; !z && I < s[vt].length; )
              z = Fe(s[vt][I++], xs);
          else
            z = Fe(s[vt], xs);
          this.set(p, z);
        }
        break;
      case Te:
        var H = s[Ut];
        if (H) {
          var De = s[qi];
          H == Bi && (De = parseInt(Si(De), 10) >= 13 ? "11" : "10"), this.set(b, H).set(_, De);
        }
        this.get(b) == Bi && s[g] == "Xbox" && this.set(b, "Xbox").set(_, void 0);
        break;
      case Bt:
        var Ce = this.data, be = function(Re) {
          return Ce[Re].getItem().setCH(s).parseCH().get();
        };
        this.set(ge, be(ge)).set(Ye, be(Ye)).set(Ve, be(Ve)).set(Pe, be(Pe)).set(Te, be(Te));
    }
    return this;
  }, Qe.call(this, [
    ["itemType", n],
    ["ua", e],
    ["uaCH", i],
    ["rgxMap", t],
    ["data", Rr(this, n)]
  ]), this;
}
function tt(n, e, t) {
  if (typeof n === Ht ? (Jn(n, !0) ? (typeof e === Ht && (t = e), e = n) : (t = n, e = void 0), n = void 0) : typeof n === Ni && !Jn(e, !0) && (t = e, e = void 0), t && typeof t.append === Qn) {
    var i = {};
    t.forEach(function(h, u) {
      i[u] = h;
    }), t = i;
  }
  if (!(this instanceof tt))
    return new tt(n, e, t).getResult();
  var s = typeof n === Ni ? n : (
    // Passed user-agent string
    t && t[cs] ? t[cs] : (
      // User-Agent from passed headers
      we && we.userAgent ? we.userAgent : (
        // navigator.userAgent
        zt
      )
    )
  ), r = new Vs(t, !0), a = e ? Ar(vs, e) : vs, l = function(h) {
    return h == Bt ? function() {
      return new ks(h, s, a, r).set("ua", s).set(ge, this.getBrowser()).set(Ye, this.getCPU()).set(Ve, this.getDevice()).set(Pe, this.getEngine()).set(Te, this.getOS()).get();
    } : function() {
      return new ks(h, s, a[h], r).parseUA().get();
    };
  };
  return Qe.call(this, [
    ["getBrowser", l(ge)],
    ["getCPU", l(Ye)],
    ["getDevice", l(Ve)],
    ["getEngine", l(Pe)],
    ["getOS", l(Te)],
    ["getResult", l(Bt)],
    ["getUA", function() {
      return s;
    }],
    ["setUA", function(h) {
      return Ft(h) && (s = h.length > Di ? ei(h, Di) : h), this;
    }]
  ]).setUA(s), this;
}
tt.VERSION = br;
tt.BROWSER = ri([b, _, xn, p]);
tt.CPU = ri([me]);
tt.DEVICE = ri([g, m, p, bn, P, ie, G, He, _n]);
tt.ENGINE = tt.OS = ri([b, _]);
class Mr {
  static isValidDevice() {
    return !new tt().getDevice().type;
  }
}
class ke {
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
      i instanceof ke ? e.push(i) : Array.isArray(i) && i.every((s) => s instanceof ke) && e.push(...i);
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
class Or extends ke {
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
class Lr extends ke {
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
class Ki extends ke {
  constructor(e) {
    super(), this.root = document.createElement("div"), this.root.classList.add("overlay"), this.root.id = e;
  }
  setVisibility(e) {
    e ? this.root.classList.add("overlay--visible-state") : this.root.classList.remove("overlay--visible-state");
  }
}
class Ir extends ke {
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
class Pr extends Ki {
  constructor() {
    super("session-connecting-overlay"), this.displayTimeout = null;
    const e = document.createElement("div");
    e.classList.add("connecting-message-box"), this.root.appendChild(e), this.spinner = new Ir(), this.spinner.mount(e);
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
function Dr(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var Ci, Es;
function Nr() {
  if (Es) return Ci;
  Es = 1;
  function n(o) {
    return o instanceof Map ? o.clear = o.delete = o.set = function() {
      throw new Error("map is read-only");
    } : o instanceof Set && (o.add = o.clear = o.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(o), Object.getOwnPropertyNames(o).forEach((d) => {
      const x = o[d], L = typeof x;
      (L === "object" || L === "function") && !Object.isFrozen(x) && n(x);
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
    for (const L in o)
      x[L] = o[L];
    return d.forEach(function(L) {
      for (const Q in L)
        x[Q] = L[Q];
    }), /** @type {T} */
    x;
  }
  const s = "</span>", r = (o) => !!o.scope, a = (o, { prefix: d }) => {
    if (o.startsWith("language:"))
      return o.replace("language:", "language-");
    if (o.includes(".")) {
      const x = o.split(".");
      return [
        `${d}${x.shift()}`,
        ...x.map((L, Q) => `${L}${"_".repeat(Q + 1)}`)
      ].join(" ");
    }
    return `${d}${o}`;
  };
  class l {
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
      const x = a(
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
      return typeof x == "string" ? d.addText(x) : x.children && (d.openNode(x), x.children.forEach((L) => this._walk(d, L)), d.closeNode(x)), d;
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
    __addSublanguage(d, x) {
      const L = d.root;
      x && (L.scope = `language:${x}`), this.add(L);
    }
    toHTML() {
      return new l(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function A(o) {
    return o ? typeof o == "string" ? o : o.source : null;
  }
  function v(o) {
    return H("(?=", o, ")");
  }
  function z(o) {
    return H("(?:", o, ")*");
  }
  function I(o) {
    return H("(?:", o, ")?");
  }
  function H(...o) {
    return o.map((x) => A(x)).join("");
  }
  function De(o) {
    const d = o[o.length - 1];
    return typeof d == "object" && d.constructor === Object ? (o.splice(o.length - 1, 1), d) : {};
  }
  function Ce(...o) {
    return "(" + (De(o).capture ? "" : "?:") + o.map((L) => A(L)).join("|") + ")";
  }
  function be(o) {
    return new RegExp(o.toString() + "|").exec("").length - 1;
  }
  function Re(o, d) {
    const x = o && o.exec(d);
    return x && x.index === 0;
  }
  const te = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function Me(o, { joinWith: d }) {
    let x = 0;
    return o.map((L) => {
      x += 1;
      const Q = x;
      let Z = A(L), S = "";
      for (; Z.length > 0; ) {
        const T = te.exec(Z);
        if (!T) {
          S += Z;
          break;
        }
        S += Z.substring(0, T.index), Z = Z.substring(T.index + T[0].length), T[0][0] === "\\" && T[1] ? S += "\\" + String(Number(T[1]) + Q) : (S += T[0], T[0] === "(" && x++);
      }
      return S;
    }).map((L) => `(${L})`).join(d);
  }
  const je = /\b\B/, Ne = "[a-zA-Z]\\w*", Vt = "[a-zA-Z_]\\w*", En = "\\b\\d+(\\.\\d+)?", Tn = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", ae = "\\b(0b[01]+)", jt = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", Gt = (o = {}) => {
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
      "on:begin": (x, L) => {
        x.index !== 0 && L.ignoreMatch();
      }
    }, o);
  }, Ge = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, li = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [Ge]
  }, ci = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [Ge]
  }, ui = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, pt = function(o, d, x = {}) {
    const L = i(
      {
        scope: "comment",
        begin: o,
        end: d,
        contains: []
      },
      x
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
    const Q = Ce(
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
    ), L;
  }, hi = pt("//", "$"), Sn = pt("/\\*", "\\*/"), ne = pt("#", "$"), An = {
    scope: "number",
    begin: En,
    relevance: 0
  }, se = {
    scope: "number",
    begin: Tn,
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
      Ge,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [Ge]
      }
    ]
  }, ft = {
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
  var gt = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: li,
    BACKSLASH_ESCAPE: Ge,
    BINARY_NUMBER_MODE: Cn,
    BINARY_NUMBER_RE: ae,
    COMMENT: pt,
    C_BLOCK_COMMENT_MODE: Sn,
    C_LINE_COMMENT_MODE: hi,
    C_NUMBER_MODE: se,
    C_NUMBER_RE: Tn,
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
    MATCH_NOTHING_RE: je,
    METHOD_GUARD: Rn,
    NUMBER_MODE: An,
    NUMBER_RE: En,
    PHRASAL_WORDS_MODE: ui,
    QUOTE_STRING_MODE: ci,
    REGEXP_MODE: J,
    RE_STARTERS_RE: jt,
    SHEBANG: Gt,
    TITLE_MODE: ft,
    UNDERSCORE_IDENT_RE: Vt,
    UNDERSCORE_TITLE_MODE: Wt
  });
  function On(o, d) {
    o.input[o.index - 1] === "." && d.ignoreMatch();
  }
  function nt(o, d) {
    o.className !== void 0 && (o.scope = o.className, delete o.className);
  }
  function Tt(o, d) {
    d && o.beginKeywords && (o.begin = "\\b(" + o.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", o.__beforeBegin = On, o.keywords = o.keywords || o.beginKeywords, delete o.beginKeywords, o.relevance === void 0 && (o.relevance = 0));
  }
  function We(o, d) {
    Array.isArray(o.illegal) && (o.illegal = Ce(...o.illegal));
  }
  function qt(o, d) {
    if (o.match) {
      if (o.begin || o.end) throw new Error("begin & end are not supported with match");
      o.begin = o.match, delete o.match;
    }
  }
  function Kt(o, d) {
    o.relevance === void 0 && (o.relevance = 1);
  }
  const it = (o, d) => {
    if (!o.beforeMatch) return;
    if (o.starts) throw new Error("beforeMatch cannot be used with starts");
    const x = Object.assign({}, o);
    Object.keys(o).forEach((L) => {
      delete o[L];
    }), o.keywords = x.keywords, o.begin = H(x.beforeMatch, v(x.begin)), o.starts = {
      relevance: 0,
      contains: [
        Object.assign(x, { endsParent: !0 })
      ]
    }, o.relevance = 0, delete x.beforeMatch;
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
  ], At = "keyword";
  function Xt(o, d, x = At) {
    const L = /* @__PURE__ */ Object.create(null);
    return typeof o == "string" ? Q(x, o.split(" ")) : Array.isArray(o) ? Q(x, o) : Object.keys(o).forEach(function(Z) {
      Object.assign(
        L,
        Xt(o[Z], d, Z)
      );
    }), L;
    function Q(Z, S) {
      d && (S = S.map((T) => T.toLowerCase())), S.forEach(function(T) {
        const O = T.split("|");
        L[O[0]] = [Z, Ln(O[0], O[1])];
      });
    }
  }
  function Ln(o, d) {
    return d ? Number(d) : di(o) ? 0 : 1;
  }
  function di(o) {
    return St.includes(o.toLowerCase());
  }
  const Ct = {}, _e = (o) => {
    console.error(o);
  }, qe = (o, ...d) => {
    console.log(`WARN: ${o}`, ...d);
  }, ye = (o, d) => {
    Ct[`${o}/${d}`] || (console.log(`Deprecated as of ${o}. ${d}`), Ct[`${o}/${d}`] = !0);
  }, mt = new Error();
  function Yt(o, d, { key: x }) {
    let L = 0;
    const Q = o[x], Z = {}, S = {};
    for (let T = 1; T <= d.length; T++)
      S[T + L] = Q[T], Z[T + L] = !0, L += be(d[T - 1]);
    o[x] = S, o[x]._emit = Z, o[x]._multi = !0;
  }
  function In(o) {
    if (Array.isArray(o.begin)) {
      if (o.skip || o.excludeBegin || o.returnBegin)
        throw _e("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), mt;
      if (typeof o.beginScope != "object" || o.beginScope === null)
        throw _e("beginScope must be object"), mt;
      Yt(o, o.begin, { key: "beginScope" }), o.begin = Me(o.begin, { joinWith: "" });
    }
  }
  function Zt(o) {
    if (Array.isArray(o.end)) {
      if (o.skip || o.excludeEnd || o.returnEnd)
        throw _e("skip, excludeEnd, returnEnd not compatible with endScope: {}"), mt;
      if (typeof o.endScope != "object" || o.endScope === null)
        throw _e("endScope must be object"), mt;
      Yt(o, o.end, { key: "endScope" }), o.end = Me(o.end, { joinWith: "" });
    }
  }
  function Pn(o) {
    o.scope && typeof o.scope == "object" && o.scope !== null && (o.beginScope = o.scope, delete o.scope);
  }
  function Rt(o) {
    Pn(o), typeof o.beginScope == "string" && (o.beginScope = { _wrap: o.beginScope }), typeof o.endScope == "string" && (o.endScope = { _wrap: o.endScope }), In(o), Zt(o);
  }
  function Mt(o) {
    function d(S, T) {
      return new RegExp(
        A(S),
        "m" + (o.case_insensitive ? "i" : "") + (o.unicodeRegex ? "u" : "") + (T ? "g" : "")
      );
    }
    class x {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(T, O) {
        O.position = this.position++, this.matchIndexes[this.matchAt] = O, this.regexes.push([O, T]), this.matchAt += be(T) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const T = this.regexes.map((O) => O[1]);
        this.matcherRe = d(Me(T, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(T) {
        this.matcherRe.lastIndex = this.lastIndex;
        const O = this.matcherRe.exec(T);
        if (!O)
          return null;
        const F = O.findIndex((at, Ot) => Ot > 0 && at !== void 0), W = this.matchIndexes[F];
        return O.splice(0, F), Object.assign(O, W);
      }
    }
    class L {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(T) {
        if (this.multiRegexes[T]) return this.multiRegexes[T];
        const O = new x();
        return this.rules.slice(T).forEach(([F, W]) => O.addRule(F, W)), O.compile(), this.multiRegexes[T] = O, O;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(T, O) {
        this.rules.push([T, O]), O.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(T) {
        const O = this.getMatcher(this.regexIndex);
        O.lastIndex = this.lastIndex;
        let F = O.exec(T);
        if (this.resumingScanAtSamePosition() && !(F && F.index === this.lastIndex)) {
          const W = this.getMatcher(0);
          W.lastIndex = this.lastIndex + 1, F = W.exec(T);
        }
        return F && (this.regexIndex += F.position + 1, this.regexIndex === this.count && this.considerAll()), F;
      }
    }
    function Q(S) {
      const T = new L();
      return S.contains.forEach((O) => T.addRule(O.begin, { rule: O, type: "begin" })), S.terminatorEnd && T.addRule(S.terminatorEnd, { type: "end" }), S.illegal && T.addRule(S.illegal, { type: "illegal" }), T;
    }
    function Z(S, T) {
      const O = (
        /** @type CompiledMode */
        S
      );
      if (S.isCompiled) return O;
      [
        nt,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        qt,
        Rt,
        it
      ].forEach((W) => W(S, T)), o.compilerExtensions.forEach((W) => W(S, T)), S.__beforeBegin = null, [
        Tt,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        We,
        // default to 1 relevance if not specified
        Kt
      ].forEach((W) => W(S, T)), S.isCompiled = !0;
      let F = null;
      return typeof S.keywords == "object" && S.keywords.$pattern && (S.keywords = Object.assign({}, S.keywords), F = S.keywords.$pattern, delete S.keywords.$pattern), F = F || /\w+/, S.keywords && (S.keywords = Xt(S.keywords, o.case_insensitive)), O.keywordPatternRe = d(F, !0), T && (S.begin || (S.begin = /\B|\b/), O.beginRe = d(O.begin), !S.end && !S.endsWithParent && (S.end = /\B|\b/), S.end && (O.endRe = d(O.end)), O.terminatorEnd = A(O.end) || "", S.endsWithParent && T.terminatorEnd && (O.terminatorEnd += (S.end ? "|" : "") + T.terminatorEnd)), S.illegal && (O.illegalRe = d(
        /** @type {RegExp | string} */
        S.illegal
      )), S.contains || (S.contains = []), S.contains = [].concat(...S.contains.map(function(W) {
        return st(W === "self" ? S : W);
      })), S.contains.forEach(function(W) {
        Z(
          /** @type Mode */
          W,
          O
        );
      }), S.starts && Z(S.starts, T), O.matcher = Q(O), O;
    }
    if (o.compilerExtensions || (o.compilerExtensions = []), o.contains && o.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return o.classNameAliases = i(o.classNameAliases || {}), Z(
      /** @type Mode */
      o
    );
  }
  function Ee(o) {
    return o ? o.endsWithParent || Ee(o.starts) : !1;
  }
  function st(o) {
    return o.variants && !o.cachedVariants && (o.cachedVariants = o.variants.map(function(d) {
      return i(o, { variants: null }, d);
    })), o.cachedVariants ? o.cachedVariants : Ee(o) ? i(o, { starts: o.starts ? i(o.starts) : null }) : Object.isFrozen(o) ? i(o) : o;
  }
  var Qt = "11.11.1";
  class Jt extends Error {
    constructor(d, x) {
      super(d), this.name = "HTMLInjectionError", this.html = x;
    }
  }
  const en = t, wt = i, bt = Symbol("nomatch"), pi = 7, rt = function(o) {
    const d = /* @__PURE__ */ Object.create(null), x = /* @__PURE__ */ Object.create(null), L = [];
    let Q = !0;
    const Z = "Could not find the language '{}', did you forget to load/include a language module?", S = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let T = {
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
    function O(w) {
      return T.noHighlightRe.test(w);
    }
    function F(w) {
      let R = w.className + " ";
      R += w.parentNode ? w.parentNode.className : "";
      const B = T.languageDetectRe.exec(R);
      if (B) {
        const X = E(B[1]);
        return X || (qe(Z.replace("{}", B[1])), qe("Falling back to no-highlight mode for this block.", w)), X ? B[1] : "no-highlight";
      }
      return R.split(/\s+/).find((X) => O(X) || E(X));
    }
    function W(w, R, B) {
      let X = "", oe = "";
      typeof R == "object" ? (X = w, B = R.ignoreIllegals, oe = R.language) : (ye("10.7.0", "highlight(lang, code, ...args) has been deprecated."), ye("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), oe = w, X = R), B === void 0 && (B = !0);
      const Le = {
        code: X,
        language: oe
      };
      Be("before:highlight", Le);
      const lt = Le.result ? Le.result : at(Le.language, Le.code, B);
      return lt.code = Le.code, Be("after:highlight", lt), lt;
    }
    function at(w, R, B, X) {
      const oe = /* @__PURE__ */ Object.create(null);
      function Le(k, M) {
        return k.keywords[M];
      }
      function lt() {
        if (!D.keywords) {
          le.addText(Y);
          return;
        }
        let k = 0;
        D.keywordPatternRe.lastIndex = 0;
        let M = D.keywordPatternRe.exec(Y), N = "";
        for (; M; ) {
          N += Y.substring(k, M.index);
          const V = ze.case_insensitive ? M[0].toLowerCase() : M[0], ue = Le(D, V);
          if (ue) {
            const [Ke, fr] = ue;
            if (le.addText(N), N = "", oe[V] = (oe[V] || 0) + 1, oe[V] <= pi && ($n += fr), Ke.startsWith("_"))
              N += M[0];
            else {
              const gr = ze.classNameAliases[Ke] || Ke;
              Ue(M[0], gr);
            }
          } else
            N += M[0];
          k = D.keywordPatternRe.lastIndex, M = D.keywordPatternRe.exec(Y);
        }
        N += Y.substring(k), le.addText(N);
      }
      function zn() {
        if (Y === "") return;
        let k = null;
        if (typeof D.subLanguage == "string") {
          if (!d[D.subLanguage]) {
            le.addText(Y);
            return;
          }
          k = at(D.subLanguage, Y, !0, ls[D.subLanguage]), ls[D.subLanguage] = /** @type {CompiledMode} */
          k._top;
        } else
          k = _t(Y, D.subLanguage.length ? D.subLanguage : null);
        D.relevance > 0 && ($n += k.relevance), le.__addSublanguage(k._emitter, k.language);
      }
      function ve() {
        D.subLanguage != null ? zn() : lt(), Y = "";
      }
      function Ue(k, M) {
        k !== "" && (le.startScope(M), le.addText(k), le.endScope());
      }
      function ss(k, M) {
        let N = 1;
        const V = M.length - 1;
        for (; N <= V; ) {
          if (!k._emit[N]) {
            N++;
            continue;
          }
          const ue = ze.classNameAliases[k[N]] || k[N], Ke = M[N];
          ue ? Ue(Ke, ue) : (Y = Ke, lt(), Y = ""), N++;
        }
      }
      function rs(k, M) {
        return k.scope && typeof k.scope == "string" && le.openNode(ze.classNameAliases[k.scope] || k.scope), k.beginScope && (k.beginScope._wrap ? (Ue(Y, ze.classNameAliases[k.beginScope._wrap] || k.beginScope._wrap), Y = "") : k.beginScope._multi && (ss(k.beginScope, M), Y = "")), D = Object.create(k, { parent: { value: D } }), D;
      }
      function os(k, M, N) {
        let V = Re(k.endRe, N);
        if (V) {
          if (k["on:end"]) {
            const ue = new e(k);
            k["on:end"](M, ue), ue.isMatchIgnored && (V = !1);
          }
          if (V) {
            for (; k.endsParent && k.parent; )
              k = k.parent;
            return k;
          }
        }
        if (k.endsWithParent)
          return os(k.parent, M, N);
      }
      function cr(k) {
        return D.matcher.regexIndex === 0 ? (Y += k[0], 1) : (mi = !0, 0);
      }
      function ur(k) {
        const M = k[0], N = k.rule, V = new e(N), ue = [N.__beforeBegin, N["on:begin"]];
        for (const Ke of ue)
          if (Ke && (Ke(k, V), V.isMatchIgnored))
            return cr(M);
        return N.skip ? Y += M : (N.excludeBegin && (Y += M), ve(), !N.returnBegin && !N.excludeBegin && (Y = M)), rs(N, k), N.returnBegin ? 0 : M.length;
      }
      function hr(k) {
        const M = k[0], N = R.substring(k.index), V = os(D, k, N);
        if (!V)
          return bt;
        const ue = D;
        D.endScope && D.endScope._wrap ? (ve(), Ue(M, D.endScope._wrap)) : D.endScope && D.endScope._multi ? (ve(), ss(D.endScope, k)) : ue.skip ? Y += M : (ue.returnEnd || ue.excludeEnd || (Y += M), ve(), ue.excludeEnd && (Y = M));
        do
          D.scope && le.closeNode(), !D.skip && !D.subLanguage && ($n += D.relevance), D = D.parent;
        while (D !== V.parent);
        return V.starts && rs(V.starts, k), ue.returnEnd ? 0 : M.length;
      }
      function dr() {
        const k = [];
        for (let M = D; M !== ze; M = M.parent)
          M.scope && k.unshift(M.scope);
        k.forEach((M) => le.openNode(M));
      }
      let Hn = {};
      function as(k, M) {
        const N = M && M[0];
        if (Y += k, N == null)
          return ve(), 0;
        if (Hn.type === "begin" && M.type === "end" && Hn.index === M.index && N === "") {
          if (Y += R.slice(M.index, M.index + 1), !Q) {
            const V = new Error(`0 width match regex (${w})`);
            throw V.languageName = w, V.badRule = Hn.rule, V;
          }
          return 1;
        }
        if (Hn = M, M.type === "begin")
          return ur(M);
        if (M.type === "illegal" && !B) {
          const V = new Error('Illegal lexeme "' + N + '" for mode "' + (D.scope || "<unnamed>") + '"');
          throw V.mode = D, V;
        } else if (M.type === "end") {
          const V = hr(M);
          if (V !== bt)
            return V;
        }
        if (M.type === "illegal" && N === "")
          return Y += `
`, 1;
        if (gi > 1e5 && gi > M.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return Y += N, N.length;
      }
      const ze = E(w);
      if (!ze)
        throw _e(Z.replace("{}", w)), new Error('Unknown language: "' + w + '"');
      const pr = Mt(ze);
      let fi = "", D = X || pr;
      const ls = {}, le = new T.__emitter(T);
      dr();
      let Y = "", $n = 0, yt = 0, gi = 0, mi = !1;
      try {
        if (ze.__emitTokens)
          ze.__emitTokens(R, le);
        else {
          for (D.matcher.considerAll(); ; ) {
            gi++, mi ? mi = !1 : D.matcher.considerAll(), D.matcher.lastIndex = yt;
            const k = D.matcher.exec(R);
            if (!k) break;
            const M = R.substring(yt, k.index), N = as(M, k);
            yt = k.index + N;
          }
          as(R.substring(yt));
        }
        return le.finalize(), fi = le.toHTML(), {
          language: w,
          value: fi,
          relevance: $n,
          illegal: !1,
          _emitter: le,
          _top: D
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
              resultSoFar: fi
            },
            _emitter: le
          };
        if (Q)
          return {
            language: w,
            value: en(R),
            illegal: !1,
            relevance: 0,
            errorRaised: k,
            _emitter: le,
            _top: D
          };
        throw k;
      }
    }
    function Ot(w) {
      const R = {
        value: en(w),
        illegal: !1,
        relevance: 0,
        _top: S,
        _emitter: new T.__emitter(T)
      };
      return R._emitter.addText(w), R;
    }
    function _t(w, R) {
      R = R || T.languages || Object.keys(d);
      const B = Ot(w), X = R.filter(E).filter(re).map(
        (ve) => at(ve, w, !1)
      );
      X.unshift(B);
      const oe = X.sort((ve, Ue) => {
        if (ve.relevance !== Ue.relevance) return Ue.relevance - ve.relevance;
        if (ve.language && Ue.language) {
          if (E(ve.language).supersetOf === Ue.language)
            return 1;
          if (E(Ue.language).supersetOf === ve.language)
            return -1;
        }
        return 0;
      }), [Le, lt] = oe, zn = Le;
      return zn.secondBest = lt, zn;
    }
    function Dn(w, R, B) {
      const X = R && x[R] || B;
      w.classList.add("hljs"), w.classList.add(`language-${X}`);
    }
    function xe(w) {
      let R = null;
      const B = F(w);
      if (O(B)) return;
      if (Be(
        "before:highlightElement",
        { el: w, language: B }
      ), w.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", w);
        return;
      }
      if (w.children.length > 0 && (T.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(w)), T.throwUnescapedHTML))
        throw new Jt(
          "One of your code blocks includes unescaped HTML.",
          w.innerHTML
        );
      R = w;
      const X = R.textContent, oe = B ? W(X, { language: B, ignoreIllegals: !0 }) : _t(X);
      w.innerHTML = oe.value, w.dataset.highlighted = "yes", Dn(w, B, oe.language), w.result = {
        language: oe.language,
        // TODO: remove with version 11.0
        re: oe.relevance,
        relevance: oe.relevance
      }, oe.secondBest && (w.secondBest = {
        language: oe.secondBest.language,
        relevance: oe.secondBest.relevance
      }), Be("after:highlightElement", { el: w, result: oe, text: X });
    }
    function Nn(w) {
      T = wt(T, w);
    }
    const Bn = () => {
      Lt(), ye("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Un() {
      Lt(), ye("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let tn = !1;
    function Lt() {
      function w() {
        Lt();
      }
      if (document.readyState === "loading") {
        tn || window.addEventListener("DOMContentLoaded", w, !1), tn = !0;
        return;
      }
      document.querySelectorAll(T.cssSelector).forEach(xe);
    }
    function C(w, R) {
      let B = null;
      try {
        B = R(o);
      } catch (X) {
        if (_e("Language definition for '{}' could not be registered.".replace("{}", w)), Q)
          _e(X);
        else
          throw X;
        B = S;
      }
      B.name || (B.name = w), d[w] = B, B.rawDefinition = R.bind(null, o), B.aliases && q(B.aliases, { languageName: w });
    }
    function c(w) {
      delete d[w];
      for (const R of Object.keys(x))
        x[R] === w && delete x[R];
    }
    function y() {
      return Object.keys(d);
    }
    function E(w) {
      return w = (w || "").toLowerCase(), d[w] || d[x[w]];
    }
    function q(w, { languageName: R }) {
      typeof w == "string" && (w = [w]), w.forEach((B) => {
        x[B.toLowerCase()] = R;
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
    function ce(w) {
      ee(w), L.push(w);
    }
    function Oe(w) {
      const R = L.indexOf(w);
      R !== -1 && L.splice(R, 1);
    }
    function Be(w, R) {
      const B = w;
      L.forEach(function(X) {
        X[B] && X[B](R);
      });
    }
    function nn(w) {
      return ye("10.7.0", "highlightBlock will be removed entirely in v12.0"), ye("10.7.0", "Please use highlightElement now."), xe(w);
    }
    Object.assign(o, {
      highlight: W,
      highlightAuto: _t,
      highlightAll: Lt,
      highlightElement: xe,
      // TODO: Remove with v12 API
      highlightBlock: nn,
      configure: Nn,
      initHighlighting: Bn,
      initHighlightingOnLoad: Un,
      registerLanguage: C,
      unregisterLanguage: c,
      listLanguages: y,
      getLanguage: E,
      registerAliases: q,
      autoDetection: re,
      inherit: wt,
      addPlugin: ce,
      removePlugin: Oe
    }), o.debugMode = function() {
      Q = !1;
    }, o.safeMode = function() {
      Q = !0;
    }, o.versionString = Qt, o.regex = {
      concat: H,
      lookahead: v,
      either: Ce,
      optional: I,
      anyNumberOfTimes: z
    };
    for (const w in gt)
      typeof gt[w] == "object" && n(gt[w]);
    return Object.assign(o, gt), o;
  }, ot = rt({});
  return ot.newInstance = () => rt({}), Ci = ot, ot.HighlightJS = ot, ot.default = ot, Ci;
}
var Br = /* @__PURE__ */ Nr();
const js = /* @__PURE__ */ Dr(Br);
function Ur(n) {
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
js.registerLanguage("json", Ur);
class zr extends ke {
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
class Hr extends Ki {
  constructor() {
    super("console-message-overlay");
    const e = document.createElement("div");
    e.classList.add("console-title-box"), this.root.appendChild(e), this.titleTextDiv = document.createElement("div"), this.titleTextDiv.classList.add("console-title-box__text"), e.appendChild(this.titleTextDiv), this.jsonViewer = new zr(), this.jsonViewer.mount(this.root);
    const t = new $r();
    t.setCopyTarget(this.jsonViewer.root), t.mount(e);
  }
  displayMessage(e, t) {
    this.titleTextDiv.innerHTML = e, this.jsonViewer.displayAsJson(t), super.setVisibility(!0);
  }
  hide() {
    this.titleTextDiv.innerHTML = "", this.jsonViewer.clear(), super.setVisibility(!1);
  }
}
class $r extends ke {
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
class Fr extends Ki {
  constructor() {
    super("session-finished-overlay"), this.submitButton = new Vr(), this.submitButton.mount(this.root), this.messageBox = document.createElement("div"), this.messageBox.classList.add("debrief-message-box"), this.root.appendChild(this.messageBox), this.messageSpan = document.createElement("span"), this.messageSpan.classList.add("debrief-message-box__text"), this.messageBox.appendChild(this.messageSpan);
  }
  show(e, t) {
    e.length == 0 ? this.messageBox.style.visibility = "hidden" : this.messageBox.style.visibility = "visible", this.messageSpan.textContent = e, this.submitButton.attachClickListener(t), this.setVisibility(!0);
  }
  hide() {
    this.messageSpan.textContent = "", super.setVisibility(!1), this.submitButton.removeAllEventListeners();
  }
}
class Vr extends ke {
  constructor() {
    super();
    const e = document.createElement("button");
    e.classList.add("submit-button"), e.textContent = "Press to Submit", this.root = e;
  }
  attachClickListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class jr extends ke {
  constructor() {
    super(), this.root = document.createElement("div"), this.root.className = "shell-ui", this.progressBar = new Lr("cognition"), this.progressBar.mount(this.root), this.statusDot = new Or(), this.statusDot.mount(this.root), this.sessionConnectingOverlay = new Pr(), this.sessionConnectingOverlay.mount(this.root), this.overlayConsoleMessage = new Hr(), this.overlayConsoleMessage.mount(this.root), this.sessionFinishedOverlay = new Fr(), this.sessionFinishedOverlay.mount(this.root);
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
class vn {
  constructor(e, t) {
    this.root = document.createElement("div"), this.root.classList.add("card"), this.root.id = e.card_id, this.card = e, this.boardView = t, this.setVisibility(!1), this.setInteractivity(!1), this.place(t);
  }
  place(e) {
    const t = e.getCoordinateSystem(), { leftPx: i, topPx: s } = t.getBoardLocationPx(
      this.card.card_location,
      this.card.card_shape
    ), { widthPx: r, heightPx: a } = t.getBoardRectanglePx(
      this.card.card_shape
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
function Se(n) {
  const e = performance.timeOrigin + n;
  return new Date(e).toISOString();
}
class Gr {
  constructor(e, t, i, s) {
    this.tArmed = null, this.cardView = i, i.addClickCallback(
      (r) => {
        if (!this.tArmed)
          return;
        const a = s.root.getBoundingClientRect(), l = (r.clientX - a.left) / a.width - 0.5, h = (r.clientY - a.top) / a.height - 0.5, u = {
          sensor_id: e,
          action_type: "ClickAction",
          action_value: {
            click_x: l,
            click_y: h
          },
          timestamp_action: Se(performance.now())
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
class Wr {
  constructor(e, t, i) {
    this.tArmed = null, this.cardView = i, i.addDoneCallback(
      () => {
        if (!this.tArmed)
          return;
        const s = {
          sensor_id: e,
          action_type: "DoneAction",
          action_value: {},
          timestamp_action: Se(performance.now())
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
class qr {
  constructor(e, t, i) {
    this.timeoutId = null, this.sensorId = e, this.onSensorFired = t, this.timeoutMsec = i;
  }
  arm() {
    this.timeoutId = window.setTimeout(
      () => {
        const e = {
          sensor_id: this.sensorId,
          action_type: "TimeoutAction",
          action_value: {},
          timestamp_action: Se(performance.now())
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
class Kr {
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
        action_value: {
          key: r
        },
        timestamp_action: Se(performance.now())
      };
      this.disarm(), this.onSensorFired(a);
    }, this.sensorId = e, this.onSensorFired = t, this.keys = [...i], document.addEventListener("keydown", this.onKeyPress);
  }
  arm() {
    this.tArmed = performance.now();
  }
  disarm() {
    this.tArmed = null, document.removeEventListener("keydown", this.onKeyPress);
  }
}
class Xr {
  constructor(e, t, i) {
    this.tArmed = null, this.onKeyboardEvent = (s) => {
      if (!this.tArmed)
        return;
      const r = s.key;
      r in this.keyToKeyEvents && (s.preventDefault(), !(s.repeat && this.keyToKeyEvents[r].length > 0) && this.keyToKeyEvents[r].push({
        event: s,
        t: performance.now()
      }));
    }, this.sensorId = e, this.onSensorFired = t, this.keyToKeyEvents = {}, i.forEach((s) => {
      this.keyToKeyEvents[s] = [];
    }), document.addEventListener("keydown", this.onKeyboardEvent), document.addEventListener("keyup", this.onKeyboardEvent);
  }
  arm() {
    this.tArmed = performance.now();
  }
  disarm() {
    document.removeEventListener("keydown", this.onKeyboardEvent), document.removeEventListener("keyup", this.onKeyboardEvent), this.tArmed = null;
    const e = performance.now();
    let t = this.deriveKeyHolds(), i = {
      sensor_id: this.sensorId,
      action_type: "KeyHoldsAction",
      action_value: {
        key_holds: t
      },
      timestamp_action: Se(e)
    };
    this.onSensorFired(i);
  }
  deriveKeyHolds() {
    const e = [];
    for (const t of Object.keys(this.keyToKeyEvents)) {
      const i = [...this.keyToKeyEvents[t]].sort((r, a) => r.t - a.t);
      let s = null;
      for (const { event: r, t: a } of i)
        if (r.type === "keydown") {
          if (s !== null) continue;
          s = a;
        } else r.type === "keyup" && (s === null ? e.push({
          key: t,
          timestamp_start: null,
          timestamp_end: Se(a)
        }) : (e.push({
          key: t,
          timestamp_start: Se(s),
          timestamp_end: Se(a)
        }), s = null));
      s !== null && e.push({
        key: t,
        timestamp_start: Se(s),
        timestamp_end: null
      });
    }
    return e;
  }
}
function Yr(n) {
  if (!("addClickCallback" in n))
    throw new Error("CardView is not clickable");
}
function Zr(n) {
  if (!("addDoneCallback" in n))
    throw new Error("CardView is not doneable");
}
class Qr extends vn {
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
function Xi() {
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
var Et = Xi();
function Gs(n) {
  Et = n;
}
var yn = { exec: () => null };
function $(n, e = "") {
  let t = typeof n == "string" ? n : n.source;
  const i = {
    replace: (s, r) => {
      let a = typeof r == "string" ? r : r.source;
      return a = a.replace(de.caret, "$1"), t = t.replace(s, a), i;
    },
    getRegex: () => new RegExp(t, e)
  };
  return i;
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
}, Jr = /^(?:[ \t]*(?:\n|$))+/, eo = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, to = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, kn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, no = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Yi = /(?:[*+-]|\d{1,9}[.)])/, Ws = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, qs = $(Ws).replace(/bull/g, Yi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), io = $(Ws).replace(/bull/g, Yi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Zi = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, so = /^[^\n]+/, Qi = /(?!\s*\])(?:\\.|[^\[\]\\])+/, ro = $(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Qi).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), oo = $(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Yi).getRegex(), oi = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Ji = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, ao = $(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", Ji).replace("tag", oi).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Ks = $(Zi).replace("hr", kn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", oi).getRegex(), lo = $(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Ks).getRegex(), es = {
  blockquote: lo,
  code: eo,
  def: ro,
  fences: to,
  heading: no,
  hr: kn,
  html: ao,
  lheading: qs,
  list: oo,
  newline: Jr,
  paragraph: Ks,
  table: yn,
  text: so
}, Ts = $(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", kn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", oi).getRegex(), co = {
  ...es,
  lheading: io,
  table: Ts,
  paragraph: $(Zi).replace("hr", kn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Ts).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", oi).getRegex()
}, uo = {
  ...es,
  html: $(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", Ji).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: yn,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: $(Zi).replace("hr", kn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", qs).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, ho = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, po = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Xs = /^( {2,}|\\)\n(?!\s*$)/, fo = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, ai = /[\p{P}\p{S}]/u, ts = /[\s\p{P}\p{S}]/u, Ys = /[^\s\p{P}\p{S}]/u, go = $(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, ts).getRegex(), Zs = /(?!~)[\p{P}\p{S}]/u, mo = /(?!~)[\s\p{P}\p{S}]/u, wo = /(?:[^\s\p{P}\p{S}]|~)/u, bo = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, Qs = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, _o = $(Qs, "u").replace(/punct/g, ai).getRegex(), yo = $(Qs, "u").replace(/punct/g, Zs).getRegex(), Js = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", xo = $(Js, "gu").replace(/notPunctSpace/g, Ys).replace(/punctSpace/g, ts).replace(/punct/g, ai).getRegex(), vo = $(Js, "gu").replace(/notPunctSpace/g, wo).replace(/punctSpace/g, mo).replace(/punct/g, Zs).getRegex(), ko = $(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, Ys).replace(/punctSpace/g, ts).replace(/punct/g, ai).getRegex(), Eo = $(/\\(punct)/, "gu").replace(/punct/g, ai).getRegex(), To = $(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), So = $(Ji).replace("(?:-->|$)", "-->").getRegex(), Ao = $(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", So).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), ti = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, Co = $(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", ti).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), er = $(/^!?\[(label)\]\[(ref)\]/).replace("label", ti).replace("ref", Qi).getRegex(), tr = $(/^!?\[(ref)\](?:\[\])?/).replace("ref", Qi).getRegex(), Ro = $("reflink|nolink(?!\\()", "g").replace("reflink", er).replace("nolink", tr).getRegex(), ns = {
  _backpedal: yn,
  // only used for GFM url
  anyPunctuation: Eo,
  autolink: To,
  blockSkip: bo,
  br: Xs,
  code: po,
  del: yn,
  emStrongLDelim: _o,
  emStrongRDelimAst: xo,
  emStrongRDelimUnd: ko,
  escape: ho,
  link: Co,
  nolink: tr,
  punctuation: go,
  reflink: er,
  reflinkSearch: Ro,
  tag: Ao,
  text: fo,
  url: yn
}, Mo = {
  ...ns,
  link: $(/^!?\[(label)\]\((.*?)\)/).replace("label", ti).getRegex(),
  reflink: $(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", ti).getRegex()
}, zi = {
  ...ns,
  emStrongRDelimAst: vo,
  emStrongLDelim: yo,
  url: $(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, Oo = {
  ...zi,
  br: $(Xs).replace("{2,}", "*").getRegex(),
  text: $(zi.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Wn = {
  normal: es,
  gfm: co,
  pedantic: uo
}, hn = {
  normal: ns,
  gfm: zi,
  breaks: Oo,
  pedantic: Mo
}, Lo = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, Ss = (n) => Lo[n];
function $e(n, e) {
  if (e) {
    if (de.escapeTest.test(n))
      return n.replace(de.escapeReplace, Ss);
  } else if (de.escapeTestNoEncode.test(n))
    return n.replace(de.escapeReplaceNoEncode, Ss);
  return n;
}
function As(n) {
  try {
    n = encodeURI(n).replace(de.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function Cs(n, e) {
  var r;
  const t = n.replace(de.findPipe, (a, l, h) => {
    let u = !1, f = l;
    for (; --f >= 0 && h[f] === "\\"; ) u = !u;
    return u ? "|" : " |";
  }), i = t.split(de.splitPipe);
  let s = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !((r = i.at(-1)) != null && r.trim()) && i.pop(), e)
    if (i.length > e)
      i.splice(e);
    else
      for (; i.length < e; ) i.push("");
  for (; s < i.length; s++)
    i[s] = i[s].trim().replace(de.slashPipe, "|");
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
function Io(n, e) {
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
  const r = e.href, a = e.title || null, l = n[1].replace(s.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  const h = {
    type: n[0].charAt(0) === "!" ? "image" : "link",
    raw: t,
    href: r,
    title: a,
    text: l,
    tokens: i.inlineTokens(l)
  };
  return i.state.inLink = !1, h;
}
function Po(n, e, t) {
  const i = n.match(t.other.indentCodeCompensation);
  if (i === null)
    return e;
  const s = i[1];
  return e.split(`
`).map((r) => {
    const a = r.match(t.other.beginningSpace);
    if (a === null)
      return r;
    const [l] = a;
    return l.length >= s.length ? r.slice(s.length) : r;
  }).join(`
`);
}
var ni = class {
  // set by the lexer
  constructor(n) {
    K(this, "options");
    K(this, "rules");
    // set by the lexer
    K(this, "lexer");
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
        text: this.options.pedantic ? t : dn(t, `
`)
      };
    }
  }
  fences(n) {
    const e = this.rules.block.fences.exec(n);
    if (e) {
      const t = e[0], i = Po(t, e[3] || "", this.rules);
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
        const l = [];
        let h;
        for (h = 0; h < t.length; h++)
          if (this.rules.other.blockquoteStart.test(t[h]))
            l.push(t[h]), a = !0;
          else if (!a)
            l.push(t[h]);
          else
            break;
        t = t.slice(h);
        const u = l.join(`
`), f = u.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${u}` : u, s = s ? `${s}
${f}` : f;
        const A = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(f, r, !0), this.lexer.state.top = A, t.length === 0)
          break;
        const v = r.at(-1);
        if ((v == null ? void 0 : v.type) === "code")
          break;
        if ((v == null ? void 0 : v.type) === "blockquote") {
          const z = v, I = z.raw + `
` + t.join(`
`), H = this.blockquote(I);
          r[r.length - 1] = H, i = i.substring(0, i.length - z.raw.length) + H.raw, s = s.substring(0, s.length - z.text.length) + H.text;
          break;
        } else if ((v == null ? void 0 : v.type) === "list") {
          const z = v, I = z.raw + `
` + t.join(`
`), H = this.list(I);
          r[r.length - 1] = H, i = i.substring(0, i.length - v.raw.length) + H.raw, s = s.substring(0, s.length - z.raw.length) + H.raw, t = I.substring(r.at(-1).raw.length).split(`
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
        let A = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (Ce) => " ".repeat(3 * Ce.length)), v = n.split(`
`, 1)[0], z = !A.trim(), I = 0;
        if (this.options.pedantic ? (I = 2, f = A.trimStart()) : z ? I = e[1].length + 1 : (I = e[2].search(this.rules.other.nonSpaceChar), I = I > 4 ? 1 : I, f = A.slice(I), I += e[1].length), z && this.rules.other.blankLine.test(v) && (u += v + `
`, n = n.substring(v.length + 1), h = !0), !h) {
          const Ce = this.rules.other.nextBulletRegex(I), be = this.rules.other.hrRegex(I), Re = this.rules.other.fencesBeginRegex(I), te = this.rules.other.headingBeginRegex(I), Me = this.rules.other.htmlBeginRegex(I);
          for (; n; ) {
            const je = n.split(`
`, 1)[0];
            let Ne;
            if (v = je, this.options.pedantic ? (v = v.replace(this.rules.other.listReplaceNesting, "  "), Ne = v) : Ne = v.replace(this.rules.other.tabCharGlobal, "    "), Re.test(v) || te.test(v) || Me.test(v) || Ce.test(v) || be.test(v))
              break;
            if (Ne.search(this.rules.other.nonSpaceChar) >= I || !v.trim())
              f += `
` + Ne.slice(I);
            else {
              if (z || A.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || Re.test(A) || te.test(A) || be.test(A))
                break;
              f += `
` + v;
            }
            !z && !v.trim() && (z = !0), u += je + `
`, n = n.substring(je.length + 1), A = Ne.slice(I);
          }
        }
        s.loose || (a ? s.loose = !0 : this.rules.other.doubleBlankLine.test(u) && (a = !0));
        let H = null, De;
        this.options.gfm && (H = this.rules.other.listIsTask.exec(f), H && (De = H[0] !== "[ ] ", f = f.replace(this.rules.other.listReplaceTask, ""))), s.items.push({
          type: "list_item",
          raw: u,
          task: !!H,
          checked: De,
          loose: !1,
          text: f,
          tokens: []
        }), s.raw += u;
      }
      const l = s.items.at(-1);
      if (l)
        l.raw = l.raw.trimEnd(), l.text = l.text.trimEnd();
      else
        return;
      s.raw = s.raw.trimEnd();
      for (let h = 0; h < s.items.length; h++)
        if (this.lexer.state.top = !1, s.items[h].tokens = this.lexer.blockTokens(s.items[h].text, []), !s.loose) {
          const u = s.items[h].tokens.filter((A) => A.type === "space"), f = u.length > 0 && u.some((A) => this.rules.other.anyLine.test(A.raw));
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
    const t = Cs(e[1]), i = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = (a = e[3]) != null && a.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], r = {
      type: "table",
      raw: e[0],
      header: [],
      align: [],
      rows: []
    };
    if (t.length === i.length) {
      for (const l of i)
        this.rules.other.tableAlignRight.test(l) ? r.align.push("right") : this.rules.other.tableAlignCenter.test(l) ? r.align.push("center") : this.rules.other.tableAlignLeft.test(l) ? r.align.push("left") : r.align.push(null);
      for (let l = 0; l < t.length; l++)
        r.header.push({
          text: t[l],
          tokens: this.lexer.inline(t[l]),
          header: !0,
          align: r.align[l]
        });
      for (const l of s)
        r.rows.push(Cs(l, r.header.length).map((h, u) => ({
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
        const r = Io(e[2], "()");
        if (r === -2)
          return;
        if (r > -1) {
          const l = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + r;
          e[2] = e[2].substring(0, r), e[0] = e[0].substring(0, l).trim(), e[3] = "";
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
      let a, l, h = r, u = 0;
      const f = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (f.lastIndex = 0, e = e.slice(-1 * n.length + r); (i = f.exec(e)) != null; ) {
        if (a = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !a) continue;
        if (l = [...a].length, i[3] || i[4]) {
          h += l;
          continue;
        } else if ((i[5] || i[6]) && r % 3 && !((r + l) % 3)) {
          u += l;
          continue;
        }
        if (h -= l, h > 0) continue;
        l = Math.min(l, l + h + u);
        const A = [...i[0]][0].length, v = n.slice(0, r + i.index + A + l);
        if (Math.min(r, l) % 2) {
          const I = v.slice(1, -1);
          return {
            type: "em",
            raw: v,
            text: I,
            tokens: this.lexer.inlineTokens(I)
          };
        }
        const z = v.slice(2, -2);
        return {
          type: "strong",
          raw: v,
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
}, Je = class Hi {
  constructor(e) {
    K(this, "tokens");
    K(this, "options");
    K(this, "state");
    K(this, "tokenizer");
    K(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Et, this.options.tokenizer = this.options.tokenizer || new ni(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const t = {
      other: de,
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
    e = e.replace(de.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      const i = this.inlineQueue[t];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], i = !1) {
    var s, r, a;
    for (this.options.pedantic && (e = e.replace(de.tabCharGlobal, "    ").replace(de.spaceLine, "")); e; ) {
      let l;
      if ((r = (s = this.options.extensions) == null ? void 0 : s.block) != null && r.some((u) => (l = u.call({ lexer: this }, e, t)) ? (e = e.substring(l.raw.length), t.push(l), !0) : !1))
        continue;
      if (l = this.tokenizer.space(e)) {
        e = e.substring(l.raw.length);
        const u = t.at(-1);
        l.raw.length === 1 && u !== void 0 ? u.raw += `
` : t.push(l);
        continue;
      }
      if (l = this.tokenizer.code(e)) {
        e = e.substring(l.raw.length);
        const u = t.at(-1);
        (u == null ? void 0 : u.type) === "paragraph" || (u == null ? void 0 : u.type) === "text" ? (u.raw += `
` + l.raw, u.text += `
` + l.text, this.inlineQueue.at(-1).src = u.text) : t.push(l);
        continue;
      }
      if (l = this.tokenizer.fences(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      if (l = this.tokenizer.heading(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      if (l = this.tokenizer.hr(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      if (l = this.tokenizer.blockquote(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      if (l = this.tokenizer.list(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      if (l = this.tokenizer.html(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      if (l = this.tokenizer.def(e)) {
        e = e.substring(l.raw.length);
        const u = t.at(-1);
        (u == null ? void 0 : u.type) === "paragraph" || (u == null ? void 0 : u.type) === "text" ? (u.raw += `
` + l.raw, u.text += `
` + l.raw, this.inlineQueue.at(-1).src = u.text) : this.tokens.links[l.tag] || (this.tokens.links[l.tag] = {
          href: l.href,
          title: l.title
        });
        continue;
      }
      if (l = this.tokenizer.table(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      if (l = this.tokenizer.lheading(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      let h = e;
      if ((a = this.options.extensions) != null && a.startBlock) {
        let u = 1 / 0;
        const f = e.slice(1);
        let A;
        this.options.extensions.startBlock.forEach((v) => {
          A = v.call({ lexer: this }, f), typeof A == "number" && A >= 0 && (u = Math.min(u, A));
        }), u < 1 / 0 && u >= 0 && (h = e.substring(0, u + 1));
      }
      if (this.state.top && (l = this.tokenizer.paragraph(h))) {
        const u = t.at(-1);
        i && (u == null ? void 0 : u.type) === "paragraph" ? (u.raw += `
` + l.raw, u.text += `
` + l.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = u.text) : t.push(l), i = h.length !== e.length, e = e.substring(l.raw.length);
        continue;
      }
      if (l = this.tokenizer.text(e)) {
        e = e.substring(l.raw.length);
        const u = t.at(-1);
        (u == null ? void 0 : u.type) === "text" ? (u.raw += `
` + l.raw, u.text += `
` + l.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = u.text) : t.push(l);
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
    var l, h, u;
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
      if ((h = (l = this.options.extensions) == null ? void 0 : l.inline) != null && h.some((v) => (f = v.call({ lexer: this }, e, t)) ? (e = e.substring(f.raw.length), t.push(f), !0) : !1))
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
        const v = t.at(-1);
        f.type === "text" && (v == null ? void 0 : v.type) === "text" ? (v.raw += f.raw, v.text += f.text) : t.push(f);
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
      let A = e;
      if ((u = this.options.extensions) != null && u.startInline) {
        let v = 1 / 0;
        const z = e.slice(1);
        let I;
        this.options.extensions.startInline.forEach((H) => {
          I = H.call({ lexer: this }, z), typeof I == "number" && I >= 0 && (v = Math.min(v, I));
        }), v < 1 / 0 && v >= 0 && (A = e.substring(0, v + 1));
      }
      if (f = this.tokenizer.inlineText(A)) {
        e = e.substring(f.raw.length), f.raw.slice(-1) !== "_" && (a = f.raw.slice(-1)), r = !0;
        const v = t.at(-1);
        (v == null ? void 0 : v.type) === "text" ? (v.raw += f.raw, v.text += f.text) : t.push(f);
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
}, ii = class {
  // set by the parser
  constructor(n) {
    K(this, "options");
    K(this, "parser");
    this.options = n || Et;
  }
  space(n) {
    return "";
  }
  code({ text: n, lang: e, escaped: t }) {
    var r;
    const i = (r = (e || "").match(de.notSpaceStart)) == null ? void 0 : r[0], s = n.replace(de.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + $e(i) + '">' + (t ? s : $e(s, !0)) + `</code></pre>
` : "<pre><code>" + (t ? s : $e(s, !0)) + `</code></pre>
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
      const l = n.items[a];
      i += this.listitem(l);
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
      n.loose ? ((t = n.tokens[0]) == null ? void 0 : t.type) === "paragraph" ? (n.tokens[0].text = i + " " + n.tokens[0].text, n.tokens[0].tokens && n.tokens[0].tokens.length > 0 && n.tokens[0].tokens[0].type === "text" && (n.tokens[0].tokens[0].text = i + " " + $e(n.tokens[0].tokens[0].text), n.tokens[0].tokens[0].escaped = !0)) : n.tokens.unshift({
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
    return `<code>${$e(n, !0)}</code>`;
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
    return e && (r += ' title="' + $e(e) + '"'), r += ">" + i + "</a>", r;
  }
  image({ href: n, title: e, text: t, tokens: i }) {
    i && (t = this.parser.parseInline(i, this.parser.textRenderer));
    const s = As(n);
    if (s === null)
      return $e(t);
    n = s;
    let r = `<img src="${n}" alt="${t}"`;
    return e && (r += ` title="${$e(e)}"`), r += ">", r;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : $e(n.text);
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
}, et = class $i {
  constructor(e) {
    K(this, "options");
    K(this, "renderer");
    K(this, "textRenderer");
    this.options = e || Et, this.options.renderer = this.options.renderer || new ii(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new is();
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
      const l = e[a];
      if ((r = (s = this.options.extensions) == null ? void 0 : s.renderers) != null && r[l.type]) {
        const u = l, f = this.options.extensions.renderers[u.type].call({ parser: this }, u);
        if (f !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(u.type)) {
          i += f || "";
          continue;
        }
      }
      const h = l;
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
      const l = e[a];
      if ((r = (s = this.options.extensions) == null ? void 0 : s.renderers) != null && r[l.type]) {
        const u = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (u !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(l.type)) {
          i += u || "";
          continue;
        }
      }
      const h = l;
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
    K(this, "options");
    K(this, "block");
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
    return this.block ? Je.lex : Je.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? et.parse : et.parseInline;
  }
}, K(Pi, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
])), Pi), Do = class {
  constructor(...n) {
    K(this, "defaults", Xi());
    K(this, "options", this.setOptions);
    K(this, "parse", this.parseMarkdown(!0));
    K(this, "parseInline", this.parseMarkdown(!1));
    K(this, "Parser", et);
    K(this, "Renderer", ii);
    K(this, "TextRenderer", is);
    K(this, "Lexer", Je);
    K(this, "Tokenizer", ni);
    K(this, "Hooks", Yn);
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
          for (const l of a.header)
            t = t.concat(this.walkTokens(l.tokens, e));
          for (const l of a.rows)
            for (const h of l)
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
          (s = (i = this.defaults.extensions) == null ? void 0 : i.childTokens) != null && s[a.type] ? this.defaults.extensions.childTokens[a.type].forEach((l) => {
            const h = a[l].flat(1 / 0);
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
            let l = s.renderer.apply(this, a);
            return l === !1 && (l = r.apply(this, a)), l;
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
          const a = r, l = t.renderer[a], h = s[a];
          s[a] = (...u) => {
            let f = l.apply(s, u);
            return f === !1 && (f = h.apply(s, u)), f || "";
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
          const a = r, l = t.tokenizer[a], h = s[a];
          s[a] = (...u) => {
            let f = l.apply(s, u);
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
          const a = r, l = t.hooks[a], h = s[a];
          Yn.passThroughHooks.has(r) ? s[a] = (u) => {
            if (this.defaults.async)
              return Promise.resolve(l.call(s, u)).then((A) => h.call(s, A));
            const f = l.call(s, u);
            return h.call(s, f);
          } : s[a] = (...u) => {
            let f = l.apply(s, u);
            return f === !1 && (f = h.apply(s, u)), f;
          };
        }
        i.hooks = s;
      }
      if (t.walkTokens) {
        const s = this.defaults.walkTokens, r = t.walkTokens;
        i.walkTokens = function(a) {
          let l = [];
          return l.push(r.call(this, a)), s && (l = l.concat(s.call(this, a))), l;
        };
      }
      this.defaults = { ...this.defaults, ...i };
    }), this;
  }
  setOptions(n) {
    return this.defaults = { ...this.defaults, ...n }, this;
  }
  lexer(n, e) {
    return Je.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return et.parse(n, e ?? this.defaults);
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
      const l = r.hooks ? r.hooks.provideLexer() : n ? Je.lex : Je.lexInline, h = r.hooks ? r.hooks.provideParser() : n ? et.parse : et.parseInline;
      if (r.async)
        return Promise.resolve(r.hooks ? r.hooks.preprocess(t) : t).then((u) => l(u, r)).then((u) => r.hooks ? r.hooks.processAllTokens(u) : u).then((u) => r.walkTokens ? Promise.all(this.walkTokens(u, r.walkTokens)).then(() => u) : u).then((u) => h(u, r)).then((u) => r.hooks ? r.hooks.postprocess(u) : u).catch(a);
      try {
        r.hooks && (t = r.hooks.preprocess(t));
        let u = l(t, r);
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
        const i = "<p>An error occurred:</p><pre>" + $e(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(i) : i;
      }
      if (e)
        return Promise.reject(t);
      throw t;
    };
  }
}, kt = new Do();
function j(n, e) {
  return kt.parse(n, e);
}
j.options = j.setOptions = function(n) {
  return kt.setOptions(n), j.defaults = kt.defaults, Gs(j.defaults), j;
};
j.getDefaults = Xi;
j.defaults = Et;
j.use = function(...n) {
  return kt.use(...n), j.defaults = kt.defaults, Gs(j.defaults), j;
};
j.walkTokens = function(n, e) {
  return kt.walkTokens(n, e);
};
j.parseInline = kt.parseInline;
j.Parser = et;
j.parser = et.parse;
j.Renderer = ii;
j.TextRenderer = is;
j.Lexer = Je;
j.lexer = Je.lex;
j.Tokenizer = ni;
j.Hooks = Yn;
j.parse = j;
j.options;
j.setOptions;
j.use;
j.walkTokens;
j.parseInline;
et.parse;
Je.lex;
/*! @license DOMPurify 3.2.6 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.6/LICENSE */
const {
  entries: nr,
  setPrototypeOf: Ms,
  isFrozen: No,
  getPrototypeOf: Bo,
  getOwnPropertyDescriptor: Uo
} = Object;
let {
  freeze: pe,
  seal: Ae,
  create: ir
} = Object, {
  apply: Fi,
  construct: Vi
} = typeof Reflect < "u" && Reflect;
pe || (pe = function(e) {
  return e;
});
Ae || (Ae = function(e) {
  return e;
});
Fi || (Fi = function(e, t, i) {
  return e.apply(t, i);
});
Vi || (Vi = function(e, t) {
  return new e(...t);
});
const qn = fe(Array.prototype.forEach), zo = fe(Array.prototype.lastIndexOf), Os = fe(Array.prototype.pop), pn = fe(Array.prototype.push), Ho = fe(Array.prototype.splice), Zn = fe(String.prototype.toLowerCase), Ri = fe(String.prototype.toString), Ls = fe(String.prototype.match), fn = fe(String.prototype.replace), $o = fe(String.prototype.indexOf), Fo = fe(String.prototype.trim), Ie = fe(Object.prototype.hasOwnProperty), he = fe(RegExp.prototype.test), gn = Vo(TypeError);
function fe(n) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++)
      i[s - 1] = arguments[s];
    return Fi(n, e, i);
  };
}
function Vo(n) {
  return function() {
    for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++)
      t[i] = arguments[i];
    return Vi(n, t);
  };
}
function U(n, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Zn;
  Ms && Ms(n, null);
  let i = e.length;
  for (; i--; ) {
    let s = e[i];
    if (typeof s == "string") {
      const r = t(s);
      r !== s && (No(e) || (e[i] = r), s = r);
    }
    n[s] = !0;
  }
  return n;
}
function jo(n) {
  for (let e = 0; e < n.length; e++)
    Ie(n, e) || (n[e] = null);
  return n;
}
function Xe(n) {
  const e = ir(null);
  for (const [t, i] of nr(n))
    Ie(n, t) && (Array.isArray(i) ? e[t] = jo(i) : i && typeof i == "object" && i.constructor === Object ? e[t] = Xe(i) : e[t] = i);
  return e;
}
function mn(n, e) {
  for (; n !== null; ) {
    const i = Uo(n, e);
    if (i) {
      if (i.get)
        return fe(i.get);
      if (typeof i.value == "function")
        return fe(i.value);
    }
    n = Bo(n);
  }
  function t() {
    return null;
  }
  return t;
}
const Is = pe(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), Mi = pe(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), Oi = pe(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Go = pe(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Li = pe(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Wo = pe(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Ps = pe(["#text"]), Ds = pe(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), Ii = pe(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), Ns = pe(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Kn = pe(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), qo = Ae(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Ko = Ae(/<%[\w\W]*|[\w\W]*%>/gm), Xo = Ae(/\$\{[\w\W]*/gm), Yo = Ae(/^data-[\-\w.\u00B7-\uFFFF]+$/), Zo = Ae(/^aria-[\-\w]+$/), sr = Ae(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Qo = Ae(/^(?:\w+script|data):/i), Jo = Ae(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), rr = Ae(/^html$/i), ea = Ae(/^[a-z][.\w]*(-[.\w]+)+$/i);
var Bs = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: Zo,
  ATTR_WHITESPACE: Jo,
  CUSTOM_ELEMENT: ea,
  DATA_ATTR: Yo,
  DOCTYPE_NAME: rr,
  ERB_EXPR: Ko,
  IS_ALLOWED_URI: sr,
  IS_SCRIPT_OR_DATA: Qo,
  MUSTACHE_EXPR: qo,
  TMPLIT_EXPR: Xo
});
const wn = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, ta = function() {
  return typeof window > "u" ? null : window;
}, na = function(e, t) {
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
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ta();
  const e = (C) => or(C);
  if (e.version = "3.2.6", e.removed = [], !n || !n.document || n.document.nodeType !== wn.document || !n.Element)
    return e.isSupported = !1, e;
  let {
    document: t
  } = n;
  const i = t, s = i.currentScript, {
    DocumentFragment: r,
    HTMLTemplateElement: a,
    Node: l,
    Element: h,
    NodeFilter: u,
    NamedNodeMap: f = n.NamedNodeMap || n.MozNamedAttrMap,
    HTMLFormElement: A,
    DOMParser: v,
    trustedTypes: z
  } = n, I = h.prototype, H = mn(I, "cloneNode"), De = mn(I, "remove"), Ce = mn(I, "nextSibling"), be = mn(I, "childNodes"), Re = mn(I, "parentNode");
  if (typeof a == "function") {
    const C = t.createElement("template");
    C.content && C.content.ownerDocument && (t = C.content.ownerDocument);
  }
  let te, Me = "";
  const {
    implementation: je,
    createNodeIterator: Ne,
    createDocumentFragment: Vt,
    getElementsByTagName: En
  } = t, {
    importNode: Tn
  } = i;
  let ae = Us();
  e.isSupported = typeof nr == "function" && typeof Re == "function" && je && je.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: jt,
    ERB_EXPR: Gt,
    TMPLIT_EXPR: Ge,
    DATA_ATTR: li,
    ARIA_ATTR: ci,
    IS_SCRIPT_OR_DATA: ui,
    ATTR_WHITESPACE: pt,
    CUSTOM_ELEMENT: hi
  } = Bs;
  let {
    IS_ALLOWED_URI: Sn
  } = Bs, ne = null;
  const An = U({}, [...Is, ...Mi, ...Oi, ...Li, ...Ps]);
  let se = null;
  const Cn = U({}, [...Ds, ...Ii, ...Ns, ...Kn]);
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
  })), ft = null, Wt = null, Rn = !0, Mn = !0, gt = !1, On = !0, nt = !1, Tt = !0, We = !1, qt = !1, Kt = !1, it = !1, St = !1, At = !1, Xt = !0, Ln = !1;
  const di = "user-content-";
  let Ct = !0, _e = !1, qe = {}, ye = null;
  const mt = U({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let Yt = null;
  const In = U({}, ["audio", "video", "img", "source", "image", "track"]);
  let Zt = null;
  const Pn = U({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Rt = "http://www.w3.org/1998/Math/MathML", Mt = "http://www.w3.org/2000/svg", Ee = "http://www.w3.org/1999/xhtml";
  let st = Ee, Qt = !1, Jt = null;
  const en = U({}, [Rt, Mt, Ee], Ri);
  let wt = U({}, ["mi", "mo", "mn", "ms", "mtext"]), bt = U({}, ["annotation-xml"]);
  const pi = U({}, ["title", "style", "font", "a", "script"]);
  let rt = null;
  const ot = ["application/xhtml+xml", "text/html"], o = "text/html";
  let d = null, x = null;
  const L = t.createElement("form"), Q = function(c) {
    return c instanceof RegExp || c instanceof Function;
  }, Z = function() {
    let c = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(x && x === c)) {
      if ((!c || typeof c != "object") && (c = {}), c = Xe(c), rt = // eslint-disable-next-line unicorn/prefer-includes
      ot.indexOf(c.PARSER_MEDIA_TYPE) === -1 ? o : c.PARSER_MEDIA_TYPE, d = rt === "application/xhtml+xml" ? Ri : Zn, ne = Ie(c, "ALLOWED_TAGS") ? U({}, c.ALLOWED_TAGS, d) : An, se = Ie(c, "ALLOWED_ATTR") ? U({}, c.ALLOWED_ATTR, d) : Cn, Jt = Ie(c, "ALLOWED_NAMESPACES") ? U({}, c.ALLOWED_NAMESPACES, Ri) : en, Zt = Ie(c, "ADD_URI_SAFE_ATTR") ? U(Xe(Pn), c.ADD_URI_SAFE_ATTR, d) : Pn, Yt = Ie(c, "ADD_DATA_URI_TAGS") ? U(Xe(In), c.ADD_DATA_URI_TAGS, d) : In, ye = Ie(c, "FORBID_CONTENTS") ? U({}, c.FORBID_CONTENTS, d) : mt, ft = Ie(c, "FORBID_TAGS") ? U({}, c.FORBID_TAGS, d) : Xe({}), Wt = Ie(c, "FORBID_ATTR") ? U({}, c.FORBID_ATTR, d) : Xe({}), qe = Ie(c, "USE_PROFILES") ? c.USE_PROFILES : !1, Rn = c.ALLOW_ARIA_ATTR !== !1, Mn = c.ALLOW_DATA_ATTR !== !1, gt = c.ALLOW_UNKNOWN_PROTOCOLS || !1, On = c.ALLOW_SELF_CLOSE_IN_ATTR !== !1, nt = c.SAFE_FOR_TEMPLATES || !1, Tt = c.SAFE_FOR_XML !== !1, We = c.WHOLE_DOCUMENT || !1, it = c.RETURN_DOM || !1, St = c.RETURN_DOM_FRAGMENT || !1, At = c.RETURN_TRUSTED_TYPE || !1, Kt = c.FORCE_BODY || !1, Xt = c.SANITIZE_DOM !== !1, Ln = c.SANITIZE_NAMED_PROPS || !1, Ct = c.KEEP_CONTENT !== !1, _e = c.IN_PLACE || !1, Sn = c.ALLOWED_URI_REGEXP || sr, st = c.NAMESPACE || Ee, wt = c.MATHML_TEXT_INTEGRATION_POINTS || wt, bt = c.HTML_INTEGRATION_POINTS || bt, J = c.CUSTOM_ELEMENT_HANDLING || {}, c.CUSTOM_ELEMENT_HANDLING && Q(c.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (J.tagNameCheck = c.CUSTOM_ELEMENT_HANDLING.tagNameCheck), c.CUSTOM_ELEMENT_HANDLING && Q(c.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (J.attributeNameCheck = c.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), c.CUSTOM_ELEMENT_HANDLING && typeof c.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (J.allowCustomizedBuiltInElements = c.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), nt && (Mn = !1), St && (it = !0), qe && (ne = U({}, Ps), se = [], qe.html === !0 && (U(ne, Is), U(se, Ds)), qe.svg === !0 && (U(ne, Mi), U(se, Ii), U(se, Kn)), qe.svgFilters === !0 && (U(ne, Oi), U(se, Ii), U(se, Kn)), qe.mathMl === !0 && (U(ne, Li), U(se, Ns), U(se, Kn))), c.ADD_TAGS && (ne === An && (ne = Xe(ne)), U(ne, c.ADD_TAGS, d)), c.ADD_ATTR && (se === Cn && (se = Xe(se)), U(se, c.ADD_ATTR, d)), c.ADD_URI_SAFE_ATTR && U(Zt, c.ADD_URI_SAFE_ATTR, d), c.FORBID_CONTENTS && (ye === mt && (ye = Xe(ye)), U(ye, c.FORBID_CONTENTS, d)), Ct && (ne["#text"] = !0), We && U(ne, ["html", "head", "body"]), ne.table && (U(ne, ["tbody"]), delete ft.tbody), c.TRUSTED_TYPES_POLICY) {
        if (typeof c.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw gn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof c.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw gn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        te = c.TRUSTED_TYPES_POLICY, Me = te.createHTML("");
      } else
        te === void 0 && (te = na(z, s)), te !== null && typeof Me == "string" && (Me = te.createHTML(""));
      pe && pe(c), x = c;
    }
  }, S = U({}, [...Mi, ...Oi, ...Go]), T = U({}, [...Li, ...Wo]), O = function(c) {
    let y = Re(c);
    (!y || !y.tagName) && (y = {
      namespaceURI: st,
      tagName: "template"
    });
    const E = Zn(c.tagName), q = Zn(y.tagName);
    return Jt[c.namespaceURI] ? c.namespaceURI === Mt ? y.namespaceURI === Ee ? E === "svg" : y.namespaceURI === Rt ? E === "svg" && (q === "annotation-xml" || wt[q]) : !!S[E] : c.namespaceURI === Rt ? y.namespaceURI === Ee ? E === "math" : y.namespaceURI === Mt ? E === "math" && bt[q] : !!T[E] : c.namespaceURI === Ee ? y.namespaceURI === Mt && !bt[q] || y.namespaceURI === Rt && !wt[q] ? !1 : !T[E] && (pi[E] || !S[E]) : !!(rt === "application/xhtml+xml" && Jt[c.namespaceURI]) : !1;
  }, F = function(c) {
    pn(e.removed, {
      element: c
    });
    try {
      Re(c).removeChild(c);
    } catch {
      De(c);
    }
  }, W = function(c, y) {
    try {
      pn(e.removed, {
        attribute: y.getAttributeNode(c),
        from: y
      });
    } catch {
      pn(e.removed, {
        attribute: null,
        from: y
      });
    }
    if (y.removeAttribute(c), c === "is")
      if (it || St)
        try {
          F(y);
        } catch {
        }
      else
        try {
          y.setAttribute(c, "");
        } catch {
        }
  }, at = function(c) {
    let y = null, E = null;
    if (Kt)
      c = "<remove></remove>" + c;
    else {
      const ee = Ls(c, /^[\r\n\t ]+/);
      E = ee && ee[0];
    }
    rt === "application/xhtml+xml" && st === Ee && (c = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + c + "</body></html>");
    const q = te ? te.createHTML(c) : c;
    if (st === Ee)
      try {
        y = new v().parseFromString(q, rt);
      } catch {
      }
    if (!y || !y.documentElement) {
      y = je.createDocument(st, "template", null);
      try {
        y.documentElement.innerHTML = Qt ? Me : q;
      } catch {
      }
    }
    const re = y.body || y.documentElement;
    return c && E && re.insertBefore(t.createTextNode(E), re.childNodes[0] || null), st === Ee ? En.call(y, We ? "html" : "body")[0] : We ? y.documentElement : re;
  }, Ot = function(c) {
    return Ne.call(
      c.ownerDocument || c,
      c,
      // eslint-disable-next-line no-bitwise
      u.SHOW_ELEMENT | u.SHOW_COMMENT | u.SHOW_TEXT | u.SHOW_PROCESSING_INSTRUCTION | u.SHOW_CDATA_SECTION,
      null
    );
  }, _t = function(c) {
    return c instanceof A && (typeof c.nodeName != "string" || typeof c.textContent != "string" || typeof c.removeChild != "function" || !(c.attributes instanceof f) || typeof c.removeAttribute != "function" || typeof c.setAttribute != "function" || typeof c.namespaceURI != "string" || typeof c.insertBefore != "function" || typeof c.hasChildNodes != "function");
  }, Dn = function(c) {
    return typeof l == "function" && c instanceof l;
  };
  function xe(C, c, y) {
    qn(C, (E) => {
      E.call(e, c, y, x);
    });
  }
  const Nn = function(c) {
    let y = null;
    if (xe(ae.beforeSanitizeElements, c, null), _t(c))
      return F(c), !0;
    const E = d(c.nodeName);
    if (xe(ae.uponSanitizeElement, c, {
      tagName: E,
      allowedTags: ne
    }), Tt && c.hasChildNodes() && !Dn(c.firstElementChild) && he(/<[/\w!]/g, c.innerHTML) && he(/<[/\w!]/g, c.textContent) || c.nodeType === wn.progressingInstruction || Tt && c.nodeType === wn.comment && he(/<[/\w]/g, c.data))
      return F(c), !0;
    if (!ne[E] || ft[E]) {
      if (!ft[E] && Un(E) && (J.tagNameCheck instanceof RegExp && he(J.tagNameCheck, E) || J.tagNameCheck instanceof Function && J.tagNameCheck(E)))
        return !1;
      if (Ct && !ye[E]) {
        const q = Re(c) || c.parentNode, re = be(c) || c.childNodes;
        if (re && q) {
          const ee = re.length;
          for (let ce = ee - 1; ce >= 0; --ce) {
            const Oe = H(re[ce], !0);
            Oe.__removalCount = (c.__removalCount || 0) + 1, q.insertBefore(Oe, Ce(c));
          }
        }
      }
      return F(c), !0;
    }
    return c instanceof h && !O(c) || (E === "noscript" || E === "noembed" || E === "noframes") && he(/<\/no(script|embed|frames)/i, c.innerHTML) ? (F(c), !0) : (nt && c.nodeType === wn.text && (y = c.textContent, qn([jt, Gt, Ge], (q) => {
      y = fn(y, q, " ");
    }), c.textContent !== y && (pn(e.removed, {
      element: c.cloneNode()
    }), c.textContent = y)), xe(ae.afterSanitizeElements, c, null), !1);
  }, Bn = function(c, y, E) {
    if (Xt && (y === "id" || y === "name") && (E in t || E in L))
      return !1;
    if (!(Mn && !Wt[y] && he(li, y))) {
      if (!(Rn && he(ci, y))) {
        if (!se[y] || Wt[y]) {
          if (
            // First condition does a very basic check if a) it's basically a valid custom element tagname AND
            // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
            !(Un(c) && (J.tagNameCheck instanceof RegExp && he(J.tagNameCheck, c) || J.tagNameCheck instanceof Function && J.tagNameCheck(c)) && (J.attributeNameCheck instanceof RegExp && he(J.attributeNameCheck, y) || J.attributeNameCheck instanceof Function && J.attributeNameCheck(y)) || // Alternative, second condition checks if it's an `is`-attribute, AND
            // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            y === "is" && J.allowCustomizedBuiltInElements && (J.tagNameCheck instanceof RegExp && he(J.tagNameCheck, E) || J.tagNameCheck instanceof Function && J.tagNameCheck(E)))
          ) return !1;
        } else if (!Zt[y]) {
          if (!he(Sn, fn(E, pt, ""))) {
            if (!((y === "src" || y === "xlink:href" || y === "href") && c !== "script" && $o(E, "data:") === 0 && Yt[c])) {
              if (!(gt && !he(ui, fn(E, pt, "")))) {
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
    return c !== "annotation-xml" && Ls(c, hi);
  }, tn = function(c) {
    xe(ae.beforeSanitizeAttributes, c, null);
    const {
      attributes: y
    } = c;
    if (!y || _t(c))
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
        namespaceURI: ce,
        value: Oe
      } = re, Be = d(ee), nn = Oe;
      let w = ee === "value" ? nn : Fo(nn);
      if (E.attrName = Be, E.attrValue = w, E.keepAttr = !0, E.forceKeepAttr = void 0, xe(ae.uponSanitizeAttribute, c, E), w = E.attrValue, Ln && (Be === "id" || Be === "name") && (W(ee, c), w = di + w), Tt && he(/((--!?|])>)|<\/(style|title)/i, w)) {
        W(ee, c);
        continue;
      }
      if (E.forceKeepAttr)
        continue;
      if (!E.keepAttr) {
        W(ee, c);
        continue;
      }
      if (!On && he(/\/>/i, w)) {
        W(ee, c);
        continue;
      }
      nt && qn([jt, Gt, Ge], (B) => {
        w = fn(w, B, " ");
      });
      const R = d(c.nodeName);
      if (!Bn(R, Be, w)) {
        W(ee, c);
        continue;
      }
      if (te && typeof z == "object" && typeof z.getAttributeType == "function" && !ce)
        switch (z.getAttributeType(R, Be)) {
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
          ce ? c.setAttributeNS(ce, ee, w) : c.setAttribute(ee, w), _t(c) ? F(c) : Os(e.removed);
        } catch {
          W(ee, c);
        }
    }
    xe(ae.afterSanitizeAttributes, c, null);
  }, Lt = function C(c) {
    let y = null;
    const E = Ot(c);
    for (xe(ae.beforeSanitizeShadowDOM, c, null); y = E.nextNode(); )
      xe(ae.uponSanitizeShadowNode, y, null), Nn(y), tn(y), y.content instanceof r && C(y.content);
    xe(ae.afterSanitizeShadowDOM, c, null);
  };
  return e.sanitize = function(C) {
    let c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, y = null, E = null, q = null, re = null;
    if (Qt = !C, Qt && (C = "<!-->"), typeof C != "string" && !Dn(C))
      if (typeof C.toString == "function") {
        if (C = C.toString(), typeof C != "string")
          throw gn("dirty is not a string, aborting");
      } else
        throw gn("toString is not a function");
    if (!e.isSupported)
      return C;
    if (qt || Z(c), e.removed = [], typeof C == "string" && (_e = !1), _e) {
      if (C.nodeName) {
        const Oe = d(C.nodeName);
        if (!ne[Oe] || ft[Oe])
          throw gn("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (C instanceof l)
      y = at("<!---->"), E = y.ownerDocument.importNode(C, !0), E.nodeType === wn.element && E.nodeName === "BODY" || E.nodeName === "HTML" ? y = E : y.appendChild(E);
    else {
      if (!it && !nt && !We && // eslint-disable-next-line unicorn/prefer-includes
      C.indexOf("<") === -1)
        return te && At ? te.createHTML(C) : C;
      if (y = at(C), !y)
        return it ? null : At ? Me : "";
    }
    y && Kt && F(y.firstChild);
    const ee = Ot(_e ? C : y);
    for (; q = ee.nextNode(); )
      Nn(q), tn(q), q.content instanceof r && Lt(q.content);
    if (_e)
      return C;
    if (it) {
      if (St)
        for (re = Vt.call(y.ownerDocument); y.firstChild; )
          re.appendChild(y.firstChild);
      else
        re = y;
      return (se.shadowroot || se.shadowrootmode) && (re = Tn.call(i, re, !0)), re;
    }
    let ce = We ? y.outerHTML : y.innerHTML;
    return We && ne["!doctype"] && y.ownerDocument && y.ownerDocument.doctype && y.ownerDocument.doctype.name && he(rr, y.ownerDocument.doctype.name) && (ce = "<!DOCTYPE " + y.ownerDocument.doctype.name + `>
` + ce), nt && qn([jt, Gt, Ge], (Oe) => {
      ce = fn(ce, Oe, " ");
    }), te && At ? te.createHTML(ce) : ce;
  }, e.setConfig = function() {
    let C = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    Z(C), qt = !0;
  }, e.clearConfig = function() {
    x = null, qt = !1;
  }, e.isValidAttribute = function(C, c, y) {
    x || Z({});
    const E = d(C), q = d(c);
    return Bn(E, q, y);
  }, e.addHook = function(C, c) {
    typeof c == "function" && pn(ae[C], c);
  }, e.removeHook = function(C, c) {
    if (c !== void 0) {
      const y = zo(ae[C], c);
      return y === -1 ? void 0 : Ho(ae[C], y, 1)[0];
    }
    return Os(ae[C]);
  }, e.removeHooks = function(C) {
    ae[C] = [];
  }, e.removeAllHooks = function() {
    ae = Us();
  }, e;
}
var zs = or();
class ia extends vn {
  constructor(e, t) {
    super(e, t), this.textContainer = document.createElement("div"), this.textContainer.classList.add("text-card"), this.root.appendChild(this.textContainer), this.textContainer.style.backgroundColor = e.card_parameters.background_color;
    const i = ar(
      e.card_parameters.content,
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
class sa extends vn {
  constructor(e, t) {
    if (super(e, t), this.pageIndex = 0, this.onPressDone = null, e.card_parameters.pages.length === 0)
      throw new Error("No markdown pages provided to MarkdownPagesViewer");
    const i = document.createElement("div");
    i.classList.add("markdown-pages-viewer"), this.root.appendChild(i), this.viewerDiv = document.createElement("div"), this.viewerDiv.classList.add("markdown-pages-viewer__window"), i.appendChild(this.viewerDiv), this.contentPages = [];
    for (const r of e.card_parameters.pages) {
      const a = ar(
        r,
        (l) => this.boardView.getCoordinateSystem().getSizePx(l) + "px"
      );
      this.contentPages.push(a);
    }
    let s = document.createElement("div");
    s.classList.add("nav-tray"), i.appendChild(s), this.navButtons = new ra(), this.navButtons.mount(s), this.doneButton = new ji("Done"), this.doneButton.mount(s), this.goToPage(0), this.navButtons.addButtonPressListeners(
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
class ra extends ke {
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
class ji extends ke {
  constructor(e) {
    super();
    const t = document.createElement("button");
    t.className = "nav-tray__button", t.textContent = e, this.root = t;
  }
  addButtonPressListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class oa extends vn {
  constructor(e, t) {
    super(e, t), this.imageContainer = document.createElement("div"), this.imageContainer.classList.add("image-card"), this.root.appendChild(this.imageContainer), this.imageLoadedPromise = (async () => {
      this.image = await t.assetManager.loadImageAsset(
        e.card_parameters.image_link
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
class aa extends vn {
  constructor(e, t) {
    super(e, t), this.videoContainer = document.createElement("div"), this.videoContainer.classList.add("video-card"), this.root.appendChild(this.videoContainer), this.videoLoadedPromise = (async () => {
      this.video = await t.assetManager.loadVideoAsset(
        e.card_parameters.video_link
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
class la {
  // Height of the board in pixels
  constructor(e, t) {
    this.boardWidthPx = e, this.boardHeightPx = t;
  }
  getUnitPx() {
    return Math.min(this.boardWidthPx, this.boardHeightPx);
  }
  getBoardLocationPx(e, t) {
    const i = this.getUnitPx(), s = this.boardWidthPx / i, r = this.boardHeightPx / i, a = i * (e.x - t.width / 2 + s / 2), l = i * (-e.y - t.height / 2 + r / 2);
    return {
      leftPx: a,
      topPx: l
    };
  }
  getBoardRectanglePx(e) {
    return {
      widthPx: this.getSizePx(e.width),
      heightPx: this.getSizePx(e.height)
    };
  }
  getSizePx(e) {
    return this.getUnitPx() * e;
  }
}
class ca {
  // Map of sensor ID to SensorBinding
  constructor(e, t, i) {
    this.cardViews = /* @__PURE__ */ new Map(), this.sensorBindings = /* @__PURE__ */ new Map(), this.root = document.createElement("div"), this.root.className = "board-view", this.root.id = `${e}`, this.root.style.width = t.board_width_px + "px", this.root.style.height = t.board_height_px + "px", this.assetManager = i, this.reset(), this.setState(!1, !1);
  }
  getCoordinateSystem() {
    const { width: e, height: t } = this.root.getBoundingClientRect();
    return new la(e, t);
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
    const t = await ha(
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
    const i = ua(e, t, this);
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
function ua(n, e, t) {
  const i = n.card_id;
  if (!i)
    if (n.sensor_type === "TimeoutSensor") {
      if (n.sensor_timespan.end_time_msec !== null)
        throw new Error(`${n.sensor_type} must not have a defined end_time_msec`);
      return new qr(
        n.sensor_id,
        e,
        n.sensor_parameters.timeout_msec
      );
    } else {
      if (n.sensor_type === "KeyPressSensor")
        return new Kr(
          n.sensor_id,
          e,
          n.sensor_parameters.keys
        );
      if (n.sensor_type == "KeyHoldsSensor") {
        if (!n.sensor_timespan.end_time_msec)
          throw new Error(`${n.sensor_type} must have a defined end_time_msec`);
        return new Xr(
          n.sensor_id,
          e,
          n.sensor_parameters.keys
        );
      } else
        throw new Error(`${n.sensor_type} can't be bound to the board.`);
    }
  const s = t.getCardView(i);
  switch (n.sensor_type) {
    case "ClickSensor":
      return Yr(s), new Gr(
        n.sensor_id,
        e,
        s,
        t
      );
    case "DoneSensor":
      return Zr(s), new Wr(
        n.sensor_id,
        e,
        s
      );
    default:
      const r = n;
      throw new Error(`Unknown sensor type: ${r}`);
  }
}
async function ha(n, e) {
  let t = null;
  switch (n.card_type) {
    case "FixationPointCard":
      t = new Qr(
        n,
        e
      );
      break;
    case "MarkdownPagesCard":
      t = new sa(
        n,
        e
      );
      break;
    case "ImageCard":
      t = new oa(
        n,
        e
      );
      break;
    case "VideoCard":
      t = new aa(
        n,
        e
      );
      break;
    case "TextCard":
      t = new ia(
        n,
        e
      );
      break;
    default:
      throw new Error(`Unsupported Card type: ${n}`);
  }
  return await t.load(), t;
}
class da {
  constructor(e) {
    this.boardViews = /* @__PURE__ */ new Map(), this.activeBoardId = null, this.root = document.createElement("div"), this.root.className = "board-views-ui", this.assetManager = e;
  }
  createBoardView(e, t) {
    if (this.boardViews.has(e))
      return this.getBoardView(e);
    const i = new ca(e, t, this.assetManager);
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
class pa {
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
function fa() {
  const n = document.createElement("div");
  document.body.appendChild(n);
  const e = document.createElement("div");
  e.classList.add("node-engine-container"), n.appendChild(e);
  const t = document.createElement("div");
  t.classList.add("node-engine-content"), e.appendChild(t);
  const i = new pa(), s = new da(
    i
  );
  t.appendChild(s.root);
  const r = new jr();
  return r.mount(t), {
    boardViewsUI: s,
    shellUI: r,
    assetManager: i
  };
}
function ga(n, e) {
  switch (n.reinforcer_map_type) {
    case "ConstantReinforcerMap":
      return n.reinforcer_map_parameters.reinforcer;
    case "NullReinforcerMap":
      return lr();
    default:
      const t = n;
      throw new Error(`Unknown reinforcer map type: ${t}`);
  }
}
function lr() {
  return {
    reinforcer_cards: []
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
class ma {
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
class wa {
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
          triggerTimeMsec: t.card_timespan.start_time_msec,
          triggerFunc: () => {
            this.boardView.showCard(t.card_id);
          }
        }
      ), t.card_timespan.end_time_msec !== null && this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: t.card_timespan.end_time_msec,
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
          triggerTimeMsec: t.sensor_timespan.start_time_msec,
          triggerFunc: () => {
            this.boardView.armSensor(t.sensor_id);
          }
        }
      ), t.sensor_timespan.end_time_msec !== null && this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: t.sensor_timespan.end_time_msec,
          triggerFunc: () => {
            this.boardView.disarmSensor(t.sensor_id);
          }
        }
      );
    for (const t of this.node.effects) {
      const i = new ma(this.boardView);
      this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: t.effect_timespan.start_time_msec,
          triggerFunc: () => {
            i.start();
          }
        }
      ), t.effect_timespan.end_time_msec !== null && this.scheduler.scheduleEvent(
        {
          triggerTimeMsec: t.effect_timespan.end_time_msec,
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
      (l, h) => this.resolvePlay = l
    ), t = performance.now();
    this.scheduler.start();
    const i = await e, s = performance.now(), [r, a] = i;
    return {
      action: r,
      runtime_metrics: this.getRuntimeMetrics(),
      timestamp_start: Se(t),
      timestamp_end: Se(s)
    };
  }
  reportSensorFired(e) {
    if (this.terminated) return;
    this.terminated = !0, this.abortController.abort(), this.boardView.reset();
    const t = this.getReinforcer(e), i = new Hs(this.abortController.signal);
    let s = 0, r = [];
    for (const a of t.reinforcer_cards)
      r.push(this.boardView.placeCardHidden(a));
    Promise.all(r).then(
      () => {
        for (const a of t.reinforcer_cards)
          if (i.scheduleEvent(
            {
              triggerTimeMsec: a.card_timespan.start_time_msec,
              triggerFunc: () => {
                this.boardView.showCard(a.card_id);
              }
            }
          ), a.card_timespan.end_time_msec !== null)
            i.scheduleEvent(
              {
                triggerTimeMsec: a.card_timespan.end_time_msec,
                triggerFunc: () => {
                  this.boardView.hideCard(a.card_id);
                }
              }
            ), a.card_timespan.end_time_msec > s && (s = a.card_timespan.end_time_msec);
          else
            throw new Error(`ReinforcerCard must have an end time: ${a.card_id} `);
        i.scheduleEvent(
          {
            triggerTimeMsec: s,
            triggerFunc: () => {
              this.resolvePlay(
                [
                  e,
                  t
                ]
              );
            }
          }
        ), i.start();
      }
    );
  }
  getReinforcer(e) {
    const t = e.sensor_id;
    for (const i of this.node.reinforcer_maps)
      if (i.sensor_id === t)
        return ga(i);
    return lr();
  }
  getRuntimeMetrics() {
    return {
      display_area: {
        width_px: screen.width,
        height_px: screen.height
      },
      viewport_area: {
        width_px: window.innerWidth,
        height_px: window.innerHeight
      },
      board_area: this.boardView.getArea(),
      user_agent: navigator.userAgent
    };
  }
}
class ba {
  constructor() {
    this.bufferedNodePlays = /* @__PURE__ */ new Map();
    const { shellUI: e, boardViewsUI: t } = fa();
    this.shellUI = e, this.boardViewsUI = t;
    try {
      if (!Mr.isValidDevice())
        throw new Error("Unsupported device. Please use a desktop browser.");
    } catch (i) {
      throw this.showErrorMessageOverlay(i), new Error("NodePlayer initialization failed: " + i.message);
    }
  }
  async prepare(e) {
    try {
      const t = crypto.randomUUID(), i = this.boardViewsUI.createBoardView(t, e.board), s = new wa(
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
function _a(n, e) {
  let t = 0;
  for (let i = 0; i < n.length; i++) {
    const s = n[i];
    if (s.event_type !== "NodeResultEvent")
      continue;
    const a = s.event_payload.action;
    for (let l = 0; l < e.length; l++) {
      const h = e[l];
      if (h.bonus_rule_type === "ConstantBonusRule") {
        const u = h.bonus_rule_parameters;
        u.sensor_id === a.sensor_id && (t += Number(u.bonus_amount_usd));
      }
    }
  }
  return t = Math.max(0, t), t = Math.round(t * 100) / 100, t;
}
function Dt() {
  return crypto.randomUUID();
}
function Nt() {
  return Se(performance.now());
}
async function xa(n, e = null, t = []) {
  let i = t;
  e || (e = (A) => {
  });
  function s() {
    if (document.visibilityState === "hidden") {
      const A = {
        event_id: Dt(),
        event_timestamp: Nt(),
        event_type: "LeaveEvent",
        event_payload: {}
      };
      i.push(A), e(A);
    } else if (document.visibilityState === "visible") {
      const A = {
        event_id: Dt(),
        event_timestamp: Nt(),
        event_type: "ReturnEvent",
        event_payload: {}
      };
      i.push(A), e(A);
    }
  }
  document.addEventListener("visibilitychange", s);
  const r = {
    event_id: Dt(),
    event_timestamp: Nt(),
    event_type: "StartEvent",
    event_payload: {}
  };
  i.push(r), e(r);
  const a = n.nodes;
  let l = new ba();
  for (let A = 0; A < a.length; A++) {
    const v = a[A], z = await l.prepare(v);
    let I = await l.play(z);
    l.setProgressBar((A + 1) / a.length * 100);
    const H = {
      event_id: Dt(),
      event_timestamp: Nt(),
      event_type: "NodeResultEvent",
      event_payload: {
        node_id: v.node_id,
        node_execution_index: A,
        timestamp_start: I.timestamp_start,
        timestamp_end: I.timestamp_end,
        action: I.action,
        runtime_metrics: I.runtime_metrics
      }
    };
    i.push(H), e(H);
  }
  const h = _a(
    i,
    n.bonus_rules
  );
  let u = "";
  if (h > 0 && (u = `Bonus: ${h} USD (pending validation)`), await l.playEndScreen(u), u !== "") {
    const A = {
      event_id: Dt(),
      event_timestamp: Nt(),
      event_type: "BonusDisclosureEvent",
      event_payload: {
        bonus_amount_usd: h.toFixed(2)
      }
    };
    i.push(A), e(A);
  }
  const f = {
    event_id: Dt(),
    event_timestamp: Nt(),
    event_type: "EndEvent",
    event_payload: {}
  };
  return i.push(f), e(f), document.removeEventListener("visibilitychange", s), l.showConsoleMessageOverlay(
    "Events",
    i
  ), i;
}
export {
  xa as play
};
