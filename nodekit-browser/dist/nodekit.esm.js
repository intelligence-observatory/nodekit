var mr = Object.defineProperty;
var wr = (n, e, t) => e in n ? mr(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var X = (n, e, t) => wr(n, typeof e != "symbol" ? e + "" : e, t);
var br = "2.0.4", Pi = 500, ls = "user-agent", Ut = "", cs = "?", Kn = "function", ut = "undefined", zt = "object", Di = "string", ge = "browser", Ye = "cpu", Fe = "device", Ie = "engine", Se = "os", Nt = "result", b = "name", p = "type", m = "vendor", _ = "version", me = "architecture", xn = "major", g = "model", wn = "console", P = "mobile", G = "tablet", ie = "smarttv", ze = "wearable", $n = "xr", bn = "embedded", nn = "inapp", ji = "brands", vt = "formFactors", Gi = "fullVersionList", Bt = "platform", Wi = "platformVersion", ii = "bitness", ht = "sec-ch-ua", _r = ht + "-full-version-list", xr = ht + "-arch", vr = ht + "-" + ii, yr = ht + "-form-factors", kr = ht + "-" + P, Er = ht + "-" + g, $s = ht + "-" + Bt, Sr = $s + "-version", Fs = [ji, Gi, P, g, Bt, Wi, me, vt, ii], Fn = "Amazon", Lt = "Apple", us = "ASUS", hs = "BlackBerry", xt = "Google", ds = "Huawei", mi = "Lenovo", ps = "Honor", Vn = "LG", wi = "Microsoft", bi = "Motorola", _i = "Nvidia", fs = "OnePlus", xi = "OPPO", sn = "Samsung", gs = "Sharp", rn = "Sony", vi = "Xiaomi", yi = "Zebra", ms = "Chrome", ws = "Chromium", lt = "Chromecast", Xn = "Edge", on = "Firefox", an = "Opera", ki = "Facebook", bs = "Sogou", It = "Mobile ", ln = " Browser", Ni = "Windows", Tr = typeof window !== ut, we = Tr && window.navigator ? window.navigator : void 0, ct = we && we.userAgentData ? we.userAgentData : void 0, Ar = function(n, e) {
  var t = {}, i = e;
  if (!Qn(e)) {
    i = {};
    for (var s in e)
      for (var r in e[s])
        i[r] = e[s][r].concat(i[r] ? i[r] : []);
  }
  for (var c in n)
    t[c] = i[c] && i[c].length % 2 === 0 ? i[c].concat(n[c]) : n[c];
  return t;
}, si = function(n) {
  for (var e = {}, t = 0; t < n.length; t++)
    e[n[t].toUpperCase()] = n[t];
  return e;
}, Bi = function(n, e) {
  if (typeof n === zt && n.length > 0) {
    for (var t in n)
      if (Ze(e) == Ze(n[t])) return !0;
    return !1;
  }
  return $t(n) ? Ze(e) == Ze(n) : !1;
}, Qn = function(n, e) {
  for (var t in n)
    return /^(browser|cpu|device|engine|os)$/.test(t) || (e ? Qn(n[t]) : !1);
}, $t = function(n) {
  return typeof n === Di;
}, Ei = function(n) {
  if (n) {
    for (var e = [], t = Ht(/\\?\"/g, n).split(","), i = 0; i < t.length; i++)
      if (t[i].indexOf(";") > -1) {
        var s = Jn(t[i]).split(";v=");
        e[i] = { brand: s[0], version: s[1] };
      } else
        e[i] = Jn(t[i]);
    return e;
  }
}, Ze = function(n) {
  return $t(n) ? n.toLowerCase() : n;
}, Si = function(n) {
  return $t(n) ? Ht(/[^\d\.]/g, n).split(".")[0] : void 0;
}, Ke = function(n) {
  for (var e in n) {
    var t = n[e];
    typeof t == zt && t.length == 2 ? this[t[0]] = t[1] : this[t] = void 0;
  }
  return this;
}, Ht = function(n, e) {
  return $t(e) ? e.replace(n, Ut) : e;
}, cn = function(n) {
  return Ht(/\\?\"/g, n);
}, Jn = function(n, e) {
  if ($t(n))
    return n = Ht(/^\s\s*/, n), typeof e === ut ? n : n.substring(0, Pi);
}, Ti = function(n, e) {
  if (!(!n || !e))
    for (var t = 0, i, s, r, c, a, h; t < e.length && !a; ) {
      var u = e[t], f = e[t + 1];
      for (i = s = 0; i < u.length && !a && u[i]; )
        if (a = u[i++].exec(n), a)
          for (r = 0; r < f.length; r++)
            h = a[++s], c = f[r], typeof c === zt && c.length > 0 ? c.length === 2 ? typeof c[1] == Kn ? this[c[0]] = c[1].call(this, h) : this[c[0]] = c[1] : c.length >= 3 && (typeof c[1] === Kn && !(c[1].exec && c[1].test) ? c.length > 3 ? this[c[0]] = h ? c[1].apply(this, c.slice(2)) : void 0 : this[c[0]] = h ? c[1].call(this, h, c[2]) : void 0 : c.length == 3 ? this[c[0]] = h ? h.replace(c[1], c[2]) : void 0 : c.length == 4 ? this[c[0]] = h ? c[3].call(this, h.replace(c[1], c[2])) : void 0 : c.length > 4 && (this[c[0]] = h ? c[3].apply(this, [h.replace(c[1], c[2])].concat(c.slice(4))) : void 0)) : this[c] = h || void 0;
      t += 2;
    }
}, $e = function(n, e) {
  for (var t in e)
    if (typeof e[t] === zt && e[t].length > 0) {
      for (var i = 0; i < e[t].length; i++)
        if (Bi(e[t][i], n))
          return t === cs ? void 0 : t;
    } else if (Bi(e[t], n))
      return t === cs ? void 0 : t;
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
    [_, [b, It + "Chrome"]],
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
    [_, [b, an + " Mini"]],
    [
      /\bop(?:rg)?x\/([\w\.]+)/i
      // Opera GX
    ],
    [_, [b, an + " GX"]],
    [
      /\bopr\/([\w\.]+)/i
      // Opera Webkit
    ],
    [_, [b, an]],
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
    [_, [b, "Smart " + mi + ln]],
    [
      /(avast|avg)\/([\w\.]+)/i
      // Avast/AVG Secure Browser
    ],
    [[b, /(.+)/, "$1 Secure" + ln], _],
    [
      /\bfocus\/([\w\.]+)/i
      // Firefox Focus
    ],
    [_, [b, on + " Focus"]],
    [
      /\bopt\/([\w\.]+)/i
      // Opera Touch
    ],
    [_, [b, an + " Touch"]],
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
    [_, [b, an + " Coast"]],
    [
      /miuibrowser\/([\w\.]+)/i
      // MIUI Browser
    ],
    [_, [b, "MIUI" + ln]],
    [
      /fxios\/([\w\.-]+)/i
      // Firefox for iOS
    ],
    [_, [b, It + on]],
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
    [[b, /(.+)/, "$1" + ln], _],
    [
      // Oculus/Sailfish/HuaweiBrowser/VivoBrowser/PicoBrowser
      /samsungbrowser\/([\w\.]+)/i
      // Samsung Internet
    ],
    [_, [b, sn + " Internet"]],
    [
      /metasr[\/ ]?([\d\.]+)/i
      // Sogou Explorer
    ],
    [_, [b, bs + " Explorer"]],
    [
      /(sogou)mo\w+\/([\d\.]+)/i
      // Sogou Mobile
    ],
    [[b, bs + " Mobile"], _],
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
    [[b, ki], _, [p, nn]],
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
    [b, _, [p, nn]],
    [
      /\bgsa\/([\w\.]+) .*safari\//i
      // Google Search Appliance on iOS
    ],
    [_, [b, "GSA"], [p, nn]],
    [
      /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i
      // TikTok
    ],
    [_, [b, "TikTok"], [p, nn]],
    [
      /\[(linkedin)app\]/i
      // LinkedIn App for iOS & Android
    ],
    [b, [p, nn]],
    [
      /(chromium)[\/ ]([-\w\.]+)/i
      // Chromium
    ],
    [b, _],
    [
      /headlesschrome(?:\/([\w\.]+)| )/i
      // Chrome Headless
    ],
    [_, [b, ms + " Headless"]],
    [
      /wv\).+chrome\/([\w\.]+).+edgw\//i
      // Edge WebView2
    ],
    [_, [b, Xn + " WebView2"]],
    [
      / wv\).+(chrome)\/([\w\.]+)/i
      // Chrome WebView
    ],
    [[b, ms + " WebView"], _],
    [
      /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
      // Android Browser
    ],
    [_, [b, "Android" + ln]],
    [
      /chrome\/([\w\.]+) mobile/i
      // Chrome Mobile
    ],
    [_, [b, It + "Chrome"]],
    [
      /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
      // Chrome/OmniWeb/Arora/Tizen/Nokia
    ],
    [b, _],
    [
      /version\/([\w\.\,]+) .*mobile(?:\/\w+ | ?)safari/i
      // Safari Mobile
    ],
    [_, [b, It + "Safari"]],
    [
      /iphone .*mobile(?:\/\w+ | ?)safari/i
    ],
    [[b, It + "Safari"]],
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
    [[b, It + on], _],
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
    [_, [b, on + " Reality"]],
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
    [b, [_, /[^\d\.]+./, Ut]]
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
    [[me, /ower/, Ut, Ze]],
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
    [g, [m, sn], [p, G]],
    [
      /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
      /samsung[- ]((?!sm-[lr]|browser)[-\w]+)/i,
      /sec-(sgh\w+)/i
    ],
    [g, [m, sn], [p, P]],
    [
      // Apple
      /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i
      // iPod/iPhone
    ],
    [g, [m, Lt], [p, P]],
    [
      /\((ipad);[-\w\),; ]+apple/i,
      // iPad
      /applecoremedia\/[\w\.]+ \((ipad)/i,
      /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
    ],
    [g, [m, Lt], [p, G]],
    [
      /(macintosh);/i
    ],
    [g, [m, Lt]],
    [
      // Sharp
      /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
    ],
    [g, [m, gs], [p, P]],
    [
      // Honor
      /\b((?:brt|eln|hey2?|gdi|jdn)-a?[lnw]09|(?:ag[rm]3?|jdn2|kob2)-a?[lw]0[09]hn)(?: bui|\)|;)/i
    ],
    [g, [m, ps], [p, G]],
    [
      /honor([-\w ]+)[;\)]/i
    ],
    [g, [m, ps], [p, P]],
    [
      // Huawei
      /\b((?:ag[rs][2356]?k?|bah[234]?|bg[2o]|bt[kv]|cmr|cpn|db[ry]2?|jdn2|got|kob2?k?|mon|pce|scm|sht?|[tw]gr|vrd)-[ad]?[lw][0125][09]b?|605hw|bg2-u03|(?:gem|fdr|m2|ple|t1)-[7a]0[1-4][lu]|t1-a2[13][lw]|mediapad[\w\. ]*(?= bui|\)))\b(?!.+d\/s)/i
    ],
    [g, [m, ds], [p, G]],
    [
      /(?:huawei)([-\w ]+)[;\)]/i,
      /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
    ],
    [g, [m, ds], [p, P]],
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
    [g, [m, fs], [p, P]],
    [
      // OPPO
      /; (\w+) bui.+ oppo/i,
      /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
    ],
    [g, [m, xi], [p, P]],
    [
      /\b(opd2(\d{3}a?))(?: bui|\))/i
    ],
    [g, [m, $e, { OnePlus: ["203", "304", "403", "404", "413", "415"], "*": xi }], [p, G]],
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
    [g, [m, mi], [p, G]],
    [
      /lenovo[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i
    ],
    [g, [m, mi], [p, P]],
    [
      // Motorola
      /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
      /\bmot(?:orola)?[- ]([\w\s]+)(\)| bui)/i,
      /((?:moto(?! 360)[-\w\(\) ]+|xt\d{3,4}[cgkosw\+]?[-\d]*|nexus 6)(?= bui|\)))/i
    ],
    [g, [m, bi], [p, P]],
    [
      /\b(mz60\d|xoom[2 ]{0,2}) build\//i
    ],
    [g, [m, bi], [p, G]],
    [
      // LG
      /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
    ],
    [g, [m, Vn], [p, G]],
    [
      /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
      /\blg[-e;\/ ]+(?!.*(?:browser|netcast|android tv|watch|webos))(\w+)/i,
      /\blg-?([\d\w]+) bui/i
    ],
    [g, [m, Vn], [p, P]],
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
    [g, [m, rn], [p, P]],
    [
      /sony tablet [ps]/i,
      /\b(?:sony)?sgp\w+(?: bui|\))/i
    ],
    [[g, "Xperia Tablet"], [m, rn], [p, G]],
    [
      // Amazon
      /(alexa)webm/i,
      /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,
      // Kindle Fire without Silk / Echo Show
      /(kf[a-z]+)( bui|\)).+silk\//i
      // Kindle Fire HD
    ],
    [g, [m, Fn], [p, G]],
    [
      /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
      // Fire Phone
    ],
    [[g, /(.+)/g, "Fire Phone $1"], [m, Fn], [p, P]],
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
    [g, [m, hs], [p, P]],
    [
      // Asus
      /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
    ],
    [g, [m, us], [p, G]],
    [
      / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
    ],
    [g, [m, us], [p, P]],
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
    [[m, Ze], g, [p, $e, { tablet: ["p10001l", "w7001"], "*": "mobile" }]],
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
    [g, [m, wi], [p, G]],
    [
      /droid [\d\.]+; (fp\du?)(?: b|\))/i
      // Fairphone
    ],
    [g, [m, "Fairphone"], [p, P]],
    [
      /((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i
      // Nvidia Tablets
    ],
    [g, [m, _i], [p, G]],
    [
      /(sprint) (\w+)/i
      // Sprint Phones
    ],
    [m, g, [p, P]],
    [
      /(kin\.[onetw]{3})/i
      // Microsoft Kin
    ],
    [[g, /\./g, " "], [m, wi], [p, P]],
    [
      /droid.+; ([c6]+|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
      // Zebra
    ],
    [g, [m, yi], [p, G]],
    [
      /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
    ],
    [g, [m, yi], [p, P]],
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
    [[g, /^/, "SmartTV"], [m, sn], [p, ie]],
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
    [[m, Vn], [p, ie]],
    [
      /(apple) ?tv/i
      // Apple TV
    ],
    [m, [g, Lt + " TV"], [p, ie]],
    [
      /crkey.*devicetype\/chromecast/i
      // Google Chromecast Third Generation
    ],
    [[g, lt + " Third Generation"], [m, xt], [p, ie]],
    [
      /crkey.*devicetype\/([^/]*)/i
      // Google Chromecast with specific device type
    ],
    [[g, /^/, "Chromecast "], [m, xt], [p, ie]],
    [
      /fuchsia.*crkey/i
      // Google Chromecast Nest Hub
    ],
    [[g, lt + " Nest Hub"], [m, xt], [p, ie]],
    [
      /crkey/i
      // Google Chromecast, Linux-based or unknown
    ],
    [[g, lt], [m, xt], [p, ie]],
    [
      /(portaltv)/i
      // Facebook Portal TV
    ],
    [g, [m, ki], [p, ie]],
    [
      /droid.+aft(\w+)( bui|\))/i
      // Fire TV
    ],
    [g, [m, Fn], [p, ie]],
    [
      /(shield \w+ tv)/i
      // Nvidia Shield TV
    ],
    [g, [m, _i], [p, ie]],
    [
      /\(dtv[\);].+(aquos)/i,
      /(aquos-tv[\w ]+)\)/i
      // Sharp
    ],
    [g, [m, gs], [p, ie]],
    [
      /(bravia[\w ]+)( bui|\))/i
      // Sony
    ],
    [g, [m, rn], [p, ie]],
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
    [[m, /.+\/(\w+)/, "$1", $e, { LG: "lge" }], [g, Jn], [p, ie]],
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
    [g, [m, rn], [p, wn]],
    [
      /\b(xbox(?: one)?(?!; xbox))[\); ]/i
      // Microsoft Xbox
    ],
    [g, [m, wi], [p, wn]],
    [
      /(ouya)/i,
      // Ouya
      /(nintendo) (\w+)/i,
      // Nintendo
      /(retroid) (pocket ([^\)]+))/i
      // Retroid Pocket
    ],
    [m, g, [p, wn]],
    [
      /droid.+; (shield)( bui|\))/i
      // Nvidia Portable
    ],
    [g, [m, _i], [p, wn]],
    [
      ///////////////////
      // WEARABLES
      ///////////////////
      /\b(sm-[lr]\d\d[0156][fnuw]?s?|gear live)\b/i
      // Samsung Galaxy Watch
    ],
    [g, [m, sn], [p, ze]],
    [
      /((pebble))app/i,
      // Pebble
      /(asus|google|lg|oppo) ((pixel |zen)?watch[\w ]*)( bui|\))/i
      // Asus ZenWatch / LG Watch / Pixel Watch
    ],
    [m, g, [p, ze]],
    [
      /(ow(?:19|20)?we?[1-3]{1,3})/i
      // Oppo Watch
    ],
    [g, [m, xi], [p, ze]],
    [
      /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i
      // Apple Watch
    ],
    [g, [m, Lt], [p, ze]],
    [
      /(opwwe\d{3})/i
      // OnePlus Watch
    ],
    [g, [m, fs], [p, ze]],
    [
      /(moto 360)/i
      // Motorola 360
    ],
    [g, [m, bi], [p, ze]],
    [
      /(smartwatch 3)/i
      // Sony SmartWatch
    ],
    [g, [m, rn], [p, ze]],
    [
      /(g watch r)/i
      // LG G Watch R
    ],
    [g, [m, Vn], [p, ze]],
    [
      /droid.+; (wt63?0{2,3})\)/i
    ],
    [g, [m, yi], [p, ze]],
    [
      ///////////////////
      // XR
      ///////////////////
      /droid.+; (glass) \d/i
      // Google Glass
    ],
    [g, [m, xt], [p, $n]],
    [
      /(pico) (4|neo3(?: link|pro)?)/i
      // Pico
    ],
    [m, g, [p, $n]],
    [
      /(quest( \d| pro)?s?).+vr/i
      // Meta Quest
    ],
    [g, [m, ki], [p, $n]],
    [
      /mobile vr; rv.+firefox/i
      // Unidentifiable VR device using Firefox Reality / Wolvic
    ],
    [[p, $n]],
    [
      ///////////////////
      // EMBEDDED
      ///////////////////
      /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i
      // Tesla
    ],
    [m, [p, bn]],
    [
      /(aeobc)\b/i
      // Echo Dot
    ],
    [g, [m, Fn], [p, bn]],
    [
      /(homepod).+mac os/i
      // Apple HomePod
    ],
    [g, [m, Lt], [p, bn]],
    [
      /windows iot/i
      // Unidentifiable embedded device using Windows IoT
    ],
    [[p, bn]],
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
    [[b, /N/, "R"], [_, $e, _s]],
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
    [[_, /(;|\))/g, "", $e, _s], [b, Ni]],
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
    [_, [b, lt + " Android"]],
    [
      /fuchsia.*crkey\/([\d\.]+)/i
      // Google Chromecast, Fuchsia-based
    ],
    [_, [b, lt + " Fuchsia"]],
    [
      /crkey\/([\d\.]+).*devicetype\/smartspeaker/i
      // Google Chromecast, Linux-based Smart Speaker
    ],
    [_, [b, lt + " SmartSpeaker"]],
    [
      /linux.*crkey\/([\d\.]+)/i
      // Google Chromecast, Legacy Linux-based
    ],
    [_, [b, lt + " Linux"]],
    [
      /crkey\/([\d\.]+)/i
      // Google Chromecast, unknown
    ],
    [_, [b, lt]],
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
    [_, [b, hs]],
    [
      /(?:symbian ?os|symbos|s60(?=;)|series ?60)[-\/ ]?([\w\.]*)/i
      // Symbian
    ],
    [_, [b, "Symbian"]],
    [
      /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
      // Firefox OS
    ],
    [_, [b, on + " OS"]],
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
    [[_, $e, { 25: "120", 24: "108", 23: "94", 22: "87", 6: "79", 5: "68", 4: "53", 3: "38", 2: "538", 1: "537", "*": "TV" }], [b, "webOS"]],
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
}, jn = (function() {
  var n = { init: {}, isIgnore: {}, isIgnoreRgx: {}, toString: {} };
  return Ke.call(n.init, [
    [ge, [b, _, xn, p]],
    [Ye, [me]],
    [Fe, [p, g, m]],
    [Ie, [b, _]],
    [Se, [b, _]]
  ]), Ke.call(n.isIgnore, [
    [ge, [_, xn]],
    [Ie, [_]],
    [Se, [_]]
  ]), Ke.call(n.isIgnoreRgx, [
    [ge, / ?browser$/i],
    [Se, / ?os$/i]
  ]), Ke.call(n.toString, [
    [ge, [b, _]],
    [Ye, [me]],
    [Fe, [m, g]],
    [Ie, [b, _]],
    [Se, [b, _]]
  ]), n;
})(), Rr = function(n, e) {
  var t = jn.init[e], i = jn.isIgnore[e] || 0, s = jn.isIgnoreRgx[e] || 0, r = jn.toString[e] || 0;
  function c() {
    Ke.call(this, t);
  }
  return c.prototype.getItem = function() {
    return n;
  }, c.prototype.withClientHints = function() {
    return ct ? ct.getHighEntropyValues(Fs).then(function(a) {
      return n.setCH(new Vs(a, !1)).parseCH().get();
    }) : n.parseCH().get();
  }, c.prototype.withFeatureCheck = function() {
    return n.detectFeature().get();
  }, e != Nt && (c.prototype.is = function(a) {
    var h = !1;
    for (var u in this)
      if (this.hasOwnProperty(u) && !Bi(i, u) && Ze(s ? Ht(s, this[u]) : this[u]) == Ze(s ? Ht(s, a) : a)) {
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
      for (var A in h)
        h.hasOwnProperty(A) && (this[A] = h[A]);
    };
    u.prototype = {
      is: c.prototype.is,
      toString: c.prototype.toString
    };
    var f = new u();
    return a(f), f;
  }), new c();
};
function Vs(n, e) {
  if (n = n || {}, Ke.call(this, Fs), e)
    Ke.call(this, [
      [ji, Ei(n[ht])],
      [Gi, Ei(n[_r])],
      [P, /\?1/.test(n[kr])],
      [g, cn(n[Er])],
      [Bt, cn(n[$s])],
      [Wi, cn(n[Sr])],
      [me, cn(n[xr])],
      [vt, Ei(n[yr])],
      [ii, cn(n[vr])]
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
    if (we && we.userAgent == this.ua)
      switch (this.itemType) {
        case ge:
          we.brave && typeof we.brave.isBrave == Kn && this.set(b, "Brave");
          break;
        case Fe:
          !this.get(p) && ct && ct[P] && this.set(p, P), this.get(g) == "Macintosh" && we && typeof we.standalone !== ut && we.maxTouchPoints && we.maxTouchPoints > 2 && this.set(g, "iPad").set(p, G);
          break;
        case Se:
          !this.get(b) && ct && ct[Bt] && this.set(b, ct[Bt]);
          break;
        case Nt:
          var s = this.data, r = function(c) {
            return s[c].getItem().detectFeature().get();
          };
          this.set(ge, r(ge)).set(Ye, r(Ye)).set(Fe, r(Fe)).set(Ie, r(Ie)).set(Se, r(Se));
      }
    return this;
  }, this.parseUA = function() {
    return this.itemType != Nt && Ti.call(this.data, this.ua, this.rgxMap), this.itemType == ge && this.set(xn, Si(this.get(_))), this;
  }, this.parseCH = function() {
    var s = this.uaCH, r = this.rgxMap;
    switch (this.itemType) {
      case ge:
      case Ie:
        var c = s[Gi] || s[ji], a;
        if (c)
          for (var h in c) {
            var u = c[h].brand || c[h], f = c[h].version;
            this.itemType == ge && !/not.a.brand/i.test(u) && (!a || /Chrom/.test(a) && u != ws || a == Xn && /WebView2/.test(u)) && (u = $e(u, Cr), a = this.get(b), a && !/Chrom/.test(a) && /Chrom/.test(u) || this.set(b, u).set(_, f).set(xn, Si(f)), a = u), this.itemType == Ie && u == ws && this.set(_, f);
          }
        break;
      case Ye:
        var A = s[me];
        A && (A && s[ii] == "64" && (A += "64"), Ti.call(this.data, A + ";", r));
        break;
      case Fe:
        if (s[P] && this.set(p, P), s[g] && (this.set(g, s[g]), !this.get(p) || !this.get(m))) {
          var y = {};
          Ti.call(y, "droid 9; " + s[g] + ")", r), !this.get(p) && y.type && this.set(p, y.type), !this.get(m) && y.vendor && this.set(m, y.vendor);
        }
        if (s[vt]) {
          var z;
          if (typeof s[vt] != "string")
            for (var I = 0; !z && I < s[vt].length; )
              z = $e(s[vt][I++], xs);
          else
            z = $e(s[vt], xs);
          this.set(p, z);
        }
        break;
      case Se:
        var H = s[Bt];
        if (H) {
          var Pe = s[Wi];
          H == Ni && (Pe = parseInt(Si(Pe), 10) >= 13 ? "11" : "10"), this.set(b, H).set(_, Pe);
        }
        this.get(b) == Ni && s[g] == "Xbox" && this.set(b, "Xbox").set(_, void 0);
        break;
      case Nt:
        var Ae = this.data, be = function(Ce) {
          return Ae[Ce].getItem().setCH(s).parseCH().get();
        };
        this.set(ge, be(ge)).set(Ye, be(Ye)).set(Fe, be(Fe)).set(Ie, be(Ie)).set(Se, be(Se));
    }
    return this;
  }, Ke.call(this, [
    ["itemType", n],
    ["ua", e],
    ["uaCH", i],
    ["rgxMap", t],
    ["data", Rr(this, n)]
  ]), this;
}
function et(n, e, t) {
  if (typeof n === zt ? (Qn(n, !0) ? (typeof e === zt && (t = e), e = n) : (t = n, e = void 0), n = void 0) : typeof n === Di && !Qn(e, !0) && (t = e, e = void 0), t && typeof t.append === Kn) {
    var i = {};
    t.forEach(function(h, u) {
      i[u] = h;
    }), t = i;
  }
  if (!(this instanceof et))
    return new et(n, e, t).getResult();
  var s = typeof n === Di ? n : (
    // Passed user-agent string
    t && t[ls] ? t[ls] : (
      // User-Agent from passed headers
      we && we.userAgent ? we.userAgent : (
        // navigator.userAgent
        Ut
      )
    )
  ), r = new Vs(t, !0), c = e ? Ar(vs, e) : vs, a = function(h) {
    return h == Nt ? function() {
      return new ys(h, s, c, r).set("ua", s).set(ge, this.getBrowser()).set(Ye, this.getCPU()).set(Fe, this.getDevice()).set(Ie, this.getEngine()).set(Se, this.getOS()).get();
    } : function() {
      return new ys(h, s, c[h], r).parseUA().get();
    };
  };
  return Ke.call(this, [
    ["getBrowser", a(ge)],
    ["getCPU", a(Ye)],
    ["getDevice", a(Fe)],
    ["getEngine", a(Ie)],
    ["getOS", a(Se)],
    ["getResult", a(Nt)],
    ["getUA", function() {
      return s;
    }],
    ["setUA", function(h) {
      return $t(h) && (s = h.length > Pi ? Jn(h, Pi) : h), this;
    }]
  ]).setUA(s), this;
}
et.VERSION = br;
et.BROWSER = si([b, _, xn, p]);
et.CPU = si([me]);
et.DEVICE = si([g, m, p, wn, P, ie, G, ze, bn]);
et.ENGINE = et.OS = si([b, _]);
class Mr {
  static isValidDevice() {
    return !new et().getDevice().type;
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
class qi extends ke {
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
class Pr extends qi {
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
var Ai, ks;
function Nr() {
  if (ks) return Ai;
  ks = 1;
  function n(o) {
    return o instanceof Map ? o.clear = o.delete = o.set = function() {
      throw new Error("map is read-only");
    } : o instanceof Set && (o.add = o.clear = o.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(o), Object.getOwnPropertyNames(o).forEach((d) => {
      const v = o[d], L = typeof v;
      (L === "object" || L === "function") && !Object.isFrozen(v) && n(v);
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
    for (const L in o)
      v[L] = o[L];
    return d.forEach(function(L) {
      for (const Q in L)
        v[Q] = L[Q];
    }), /** @type {T} */
    v;
  }
  const s = "</span>", r = (o) => !!o.scope, c = (o, { prefix: d }) => {
    if (o.startsWith("language:"))
      return o.replace("language:", "language-");
    if (o.includes(".")) {
      const v = o.split(".");
      return [
        `${d}${v.shift()}`,
        ...v.map((L, Q) => `${L}${"_".repeat(Q + 1)}`)
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
      const v = c(
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
      return typeof v == "string" ? d.addText(v) : v.children && (d.openNode(v), v.children.forEach((L) => this._walk(d, L)), d.closeNode(v)), d;
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
      const L = d.root;
      v && (L.scope = `language:${v}`), this.add(L);
    }
    toHTML() {
      return new a(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function A(o) {
    return o ? typeof o == "string" ? o : o.source : null;
  }
  function y(o) {
    return H("(?=", o, ")");
  }
  function z(o) {
    return H("(?:", o, ")*");
  }
  function I(o) {
    return H("(?:", o, ")?");
  }
  function H(...o) {
    return o.map((v) => A(v)).join("");
  }
  function Pe(o) {
    const d = o[o.length - 1];
    return typeof d == "object" && d.constructor === Object ? (o.splice(o.length - 1, 1), d) : {};
  }
  function Ae(...o) {
    return "(" + (Pe(o).capture ? "" : "?:") + o.map((L) => A(L)).join("|") + ")";
  }
  function be(o) {
    return new RegExp(o.toString() + "|").exec("").length - 1;
  }
  function Ce(o, d) {
    const v = o && o.exec(d);
    return v && v.index === 0;
  }
  const te = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function Re(o, { joinWith: d }) {
    let v = 0;
    return o.map((L) => {
      v += 1;
      const Q = v;
      let K = A(L), T = "";
      for (; K.length > 0; ) {
        const S = te.exec(K);
        if (!S) {
          T += K;
          break;
        }
        T += K.substring(0, S.index), K = K.substring(S.index + S[0].length), S[0][0] === "\\" && S[1] ? T += "\\" + String(Number(S[1]) + Q) : (T += S[0], S[0] === "(" && v++);
      }
      return T;
    }).map((L) => `(${L})`).join(d);
  }
  const Ve = /\b\B/, De = "[a-zA-Z]\\w*", Ft = "[a-zA-Z_]\\w*", kn = "\\b\\d+(\\.\\d+)?", En = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", ae = "\\b(0b[01]+)", Vt = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", jt = (o = {}) => {
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
      "on:begin": (v, L) => {
        v.index !== 0 && L.ignoreMatch();
      }
    }, o);
  }, je = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, ai = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [je]
  }, li = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [je]
  }, ci = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, dt = function(o, d, v = {}) {
    const L = i(
      {
        scope: "comment",
        begin: o,
        end: d,
        contains: []
      },
      v
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
    const Q = Ae(
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
  }, ui = dt("//", "$"), Sn = dt("/\\*", "\\*/"), ne = dt("#", "$"), Tn = {
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
    begin: De,
    relevance: 0
  }, Gt = {
    scope: "title",
    begin: Ft,
    relevance: 0
  }, Cn = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + Ft,
    relevance: 0
  };
  var ft = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: ai,
    BACKSLASH_ESCAPE: je,
    BINARY_NUMBER_MODE: An,
    BINARY_NUMBER_RE: ae,
    COMMENT: dt,
    C_BLOCK_COMMENT_MODE: Sn,
    C_LINE_COMMENT_MODE: ui,
    C_NUMBER_MODE: se,
    C_NUMBER_RE: En,
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
    METHOD_GUARD: Cn,
    NUMBER_MODE: Tn,
    NUMBER_RE: kn,
    PHRASAL_WORDS_MODE: ci,
    QUOTE_STRING_MODE: li,
    REGEXP_MODE: J,
    RE_STARTERS_RE: Vt,
    SHEBANG: jt,
    TITLE_MODE: pt,
    UNDERSCORE_IDENT_RE: Ft,
    UNDERSCORE_TITLE_MODE: Gt
  });
  function Mn(o, d) {
    o.input[o.index - 1] === "." && d.ignoreMatch();
  }
  function tt(o, d) {
    o.className !== void 0 && (o.scope = o.className, delete o.className);
  }
  function Et(o, d) {
    d && o.beginKeywords && (o.begin = "\\b(" + o.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", o.__beforeBegin = Mn, o.keywords = o.keywords || o.beginKeywords, delete o.beginKeywords, o.relevance === void 0 && (o.relevance = 0));
  }
  function Ge(o, d) {
    Array.isArray(o.illegal) && (o.illegal = Ae(...o.illegal));
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
    const v = Object.assign({}, o);
    Object.keys(o).forEach((L) => {
      delete o[L];
    }), o.keywords = v.keywords, o.begin = H(v.beforeMatch, y(v.begin)), o.starts = {
      relevance: 0,
      contains: [
        Object.assign(v, { endsParent: !0 })
      ]
    }, o.relevance = 0, delete v.beforeMatch;
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
  ], Tt = "keyword";
  function Xt(o, d, v = Tt) {
    const L = /* @__PURE__ */ Object.create(null);
    return typeof o == "string" ? Q(v, o.split(" ")) : Array.isArray(o) ? Q(v, o) : Object.keys(o).forEach(function(K) {
      Object.assign(
        L,
        Xt(o[K], d, K)
      );
    }), L;
    function Q(K, T) {
      d && (T = T.map((S) => S.toLowerCase())), T.forEach(function(S) {
        const O = S.split("|");
        L[O[0]] = [K, On(O[0], O[1])];
      });
    }
  }
  function On(o, d) {
    return d ? Number(d) : hi(o) ? 0 : 1;
  }
  function hi(o) {
    return St.includes(o.toLowerCase());
  }
  const At = {}, _e = (o) => {
    console.error(o);
  }, We = (o, ...d) => {
    console.log(`WARN: ${o}`, ...d);
  }, xe = (o, d) => {
    At[`${o}/${d}`] || (console.log(`Deprecated as of ${o}. ${d}`), At[`${o}/${d}`] = !0);
  }, gt = new Error();
  function Yt(o, d, { key: v }) {
    let L = 0;
    const Q = o[v], K = {}, T = {};
    for (let S = 1; S <= d.length; S++)
      T[S + L] = Q[S], K[S + L] = !0, L += be(d[S - 1]);
    o[v] = T, o[v]._emit = K, o[v]._multi = !0;
  }
  function Ln(o) {
    if (Array.isArray(o.begin)) {
      if (o.skip || o.excludeBegin || o.returnBegin)
        throw _e("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), gt;
      if (typeof o.beginScope != "object" || o.beginScope === null)
        throw _e("beginScope must be object"), gt;
      Yt(o, o.begin, { key: "beginScope" }), o.begin = Re(o.begin, { joinWith: "" });
    }
  }
  function Zt(o) {
    if (Array.isArray(o.end)) {
      if (o.skip || o.excludeEnd || o.returnEnd)
        throw _e("skip, excludeEnd, returnEnd not compatible with endScope: {}"), gt;
      if (typeof o.endScope != "object" || o.endScope === null)
        throw _e("endScope must be object"), gt;
      Yt(o, o.end, { key: "endScope" }), o.end = Re(o.end, { joinWith: "" });
    }
  }
  function In(o) {
    o.scope && typeof o.scope == "object" && o.scope !== null && (o.beginScope = o.scope, delete o.scope);
  }
  function Ct(o) {
    In(o), typeof o.beginScope == "string" && (o.beginScope = { _wrap: o.beginScope }), typeof o.endScope == "string" && (o.endScope = { _wrap: o.endScope }), Ln(o), Zt(o);
  }
  function Rt(o) {
    function d(T, S) {
      return new RegExp(
        A(T),
        "m" + (o.case_insensitive ? "i" : "") + (o.unicodeRegex ? "u" : "") + (S ? "g" : "")
      );
    }
    class v {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(S, O) {
        O.position = this.position++, this.matchIndexes[this.matchAt] = O, this.regexes.push([O, S]), this.matchAt += be(S) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const S = this.regexes.map((O) => O[1]);
        this.matcherRe = d(Re(S, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(S) {
        this.matcherRe.lastIndex = this.lastIndex;
        const O = this.matcherRe.exec(S);
        if (!O)
          return null;
        const F = O.findIndex((ot, Mt) => Mt > 0 && ot !== void 0), W = this.matchIndexes[F];
        return O.splice(0, F), Object.assign(O, W);
      }
    }
    class L {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(S) {
        if (this.multiRegexes[S]) return this.multiRegexes[S];
        const O = new v();
        return this.rules.slice(S).forEach(([F, W]) => O.addRule(F, W)), O.compile(), this.multiRegexes[S] = O, O;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(S, O) {
        this.rules.push([S, O]), O.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(S) {
        const O = this.getMatcher(this.regexIndex);
        O.lastIndex = this.lastIndex;
        let F = O.exec(S);
        if (this.resumingScanAtSamePosition() && !(F && F.index === this.lastIndex)) {
          const W = this.getMatcher(0);
          W.lastIndex = this.lastIndex + 1, F = W.exec(S);
        }
        return F && (this.regexIndex += F.position + 1, this.regexIndex === this.count && this.considerAll()), F;
      }
    }
    function Q(T) {
      const S = new L();
      return T.contains.forEach((O) => S.addRule(O.begin, { rule: O, type: "begin" })), T.terminatorEnd && S.addRule(T.terminatorEnd, { type: "end" }), T.illegal && S.addRule(T.illegal, { type: "illegal" }), S;
    }
    function K(T, S) {
      const O = (
        /** @type CompiledMode */
        T
      );
      if (T.isCompiled) return O;
      [
        tt,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        Wt,
        Ct,
        nt
      ].forEach((W) => W(T, S)), o.compilerExtensions.forEach((W) => W(T, S)), T.__beforeBegin = null, [
        Et,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        Ge,
        // default to 1 relevance if not specified
        qt
      ].forEach((W) => W(T, S)), T.isCompiled = !0;
      let F = null;
      return typeof T.keywords == "object" && T.keywords.$pattern && (T.keywords = Object.assign({}, T.keywords), F = T.keywords.$pattern, delete T.keywords.$pattern), F = F || /\w+/, T.keywords && (T.keywords = Xt(T.keywords, o.case_insensitive)), O.keywordPatternRe = d(F, !0), S && (T.begin || (T.begin = /\B|\b/), O.beginRe = d(O.begin), !T.end && !T.endsWithParent && (T.end = /\B|\b/), T.end && (O.endRe = d(O.end)), O.terminatorEnd = A(O.end) || "", T.endsWithParent && S.terminatorEnd && (O.terminatorEnd += (T.end ? "|" : "") + S.terminatorEnd)), T.illegal && (O.illegalRe = d(
        /** @type {RegExp | string} */
        T.illegal
      )), T.contains || (T.contains = []), T.contains = [].concat(...T.contains.map(function(W) {
        return it(W === "self" ? T : W);
      })), T.contains.forEach(function(W) {
        K(
          /** @type Mode */
          W,
          O
        );
      }), T.starts && K(T.starts, S), O.matcher = Q(O), O;
    }
    if (o.compilerExtensions || (o.compilerExtensions = []), o.contains && o.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return o.classNameAliases = i(o.classNameAliases || {}), K(
      /** @type Mode */
      o
    );
  }
  function Ee(o) {
    return o ? o.endsWithParent || Ee(o.starts) : !1;
  }
  function it(o) {
    return o.variants && !o.cachedVariants && (o.cachedVariants = o.variants.map(function(d) {
      return i(o, { variants: null }, d);
    })), o.cachedVariants ? o.cachedVariants : Ee(o) ? i(o, { starts: o.starts ? i(o.starts) : null }) : Object.isFrozen(o) ? i(o) : o;
  }
  var Kt = "11.11.1";
  class Qt extends Error {
    constructor(d, v) {
      super(d), this.name = "HTMLInjectionError", this.html = v;
    }
  }
  const Jt = t, mt = i, wt = Symbol("nomatch"), di = 7, st = function(o) {
    const d = /* @__PURE__ */ Object.create(null), v = /* @__PURE__ */ Object.create(null), L = [];
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
    function O(w) {
      return S.noHighlightRe.test(w);
    }
    function F(w) {
      let R = w.className + " ";
      R += w.parentNode ? w.parentNode.className : "";
      const B = S.languageDetectRe.exec(R);
      if (B) {
        const Y = E(B[1]);
        return Y || (We(K.replace("{}", B[1])), We("Falling back to no-highlight mode for this block.", w)), Y ? B[1] : "no-highlight";
      }
      return R.split(/\s+/).find((Y) => O(Y) || E(Y));
    }
    function W(w, R, B) {
      let Y = "", oe = "";
      typeof R == "object" ? (Y = w, B = R.ignoreIllegals, oe = R.language) : (xe("10.7.0", "highlight(lang, code, ...args) has been deprecated."), xe("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), oe = w, Y = R), B === void 0 && (B = !0);
      const Oe = {
        code: Y,
        language: oe
      };
      Ne("before:highlight", Oe);
      const at = Oe.result ? Oe.result : ot(Oe.language, Oe.code, B);
      return at.code = Oe.code, Ne("after:highlight", at), at;
    }
    function ot(w, R, B, Y) {
      const oe = /* @__PURE__ */ Object.create(null);
      function Oe(k, M) {
        return k.keywords[M];
      }
      function at() {
        if (!D.keywords) {
          le.addText(Z);
          return;
        }
        let k = 0;
        D.keywordPatternRe.lastIndex = 0;
        let M = D.keywordPatternRe.exec(Z), N = "";
        for (; M; ) {
          N += Z.substring(k, M.index);
          const V = Ue.case_insensitive ? M[0].toLowerCase() : M[0], ue = Oe(D, V);
          if (ue) {
            const [qe, fr] = ue;
            if (le.addText(N), N = "", oe[V] = (oe[V] || 0) + 1, oe[V] <= di && (Hn += fr), qe.startsWith("_"))
              N += M[0];
            else {
              const gr = Ue.classNameAliases[qe] || qe;
              Be(M[0], gr);
            }
          } else
            N += M[0];
          k = D.keywordPatternRe.lastIndex, M = D.keywordPatternRe.exec(Z);
        }
        N += Z.substring(k), le.addText(N);
      }
      function Un() {
        if (Z === "") return;
        let k = null;
        if (typeof D.subLanguage == "string") {
          if (!d[D.subLanguage]) {
            le.addText(Z);
            return;
          }
          k = ot(D.subLanguage, Z, !0, as[D.subLanguage]), as[D.subLanguage] = /** @type {CompiledMode} */
          k._top;
        } else
          k = bt(Z, D.subLanguage.length ? D.subLanguage : null);
        D.relevance > 0 && (Hn += k.relevance), le.__addSublanguage(k._emitter, k.language);
      }
      function ye() {
        D.subLanguage != null ? Un() : at(), Z = "";
      }
      function Be(k, M) {
        k !== "" && (le.startScope(M), le.addText(k), le.endScope());
      }
      function is(k, M) {
        let N = 1;
        const V = M.length - 1;
        for (; N <= V; ) {
          if (!k._emit[N]) {
            N++;
            continue;
          }
          const ue = Ue.classNameAliases[k[N]] || k[N], qe = M[N];
          ue ? Be(qe, ue) : (Z = qe, at(), Z = ""), N++;
        }
      }
      function ss(k, M) {
        return k.scope && typeof k.scope == "string" && le.openNode(Ue.classNameAliases[k.scope] || k.scope), k.beginScope && (k.beginScope._wrap ? (Be(Z, Ue.classNameAliases[k.beginScope._wrap] || k.beginScope._wrap), Z = "") : k.beginScope._multi && (is(k.beginScope, M), Z = "")), D = Object.create(k, { parent: { value: D } }), D;
      }
      function rs(k, M, N) {
        let V = Ce(k.endRe, N);
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
          return rs(k.parent, M, N);
      }
      function cr(k) {
        return D.matcher.regexIndex === 0 ? (Z += k[0], 1) : (gi = !0, 0);
      }
      function ur(k) {
        const M = k[0], N = k.rule, V = new e(N), ue = [N.__beforeBegin, N["on:begin"]];
        for (const qe of ue)
          if (qe && (qe(k, V), V.isMatchIgnored))
            return cr(M);
        return N.skip ? Z += M : (N.excludeBegin && (Z += M), ye(), !N.returnBegin && !N.excludeBegin && (Z = M)), ss(N, k), N.returnBegin ? 0 : M.length;
      }
      function hr(k) {
        const M = k[0], N = R.substring(k.index), V = rs(D, k, N);
        if (!V)
          return wt;
        const ue = D;
        D.endScope && D.endScope._wrap ? (ye(), Be(M, D.endScope._wrap)) : D.endScope && D.endScope._multi ? (ye(), is(D.endScope, k)) : ue.skip ? Z += M : (ue.returnEnd || ue.excludeEnd || (Z += M), ye(), ue.excludeEnd && (Z = M));
        do
          D.scope && le.closeNode(), !D.skip && !D.subLanguage && (Hn += D.relevance), D = D.parent;
        while (D !== V.parent);
        return V.starts && ss(V.starts, k), ue.returnEnd ? 0 : M.length;
      }
      function dr() {
        const k = [];
        for (let M = D; M !== Ue; M = M.parent)
          M.scope && k.unshift(M.scope);
        k.forEach((M) => le.openNode(M));
      }
      let zn = {};
      function os(k, M) {
        const N = M && M[0];
        if (Z += k, N == null)
          return ye(), 0;
        if (zn.type === "begin" && M.type === "end" && zn.index === M.index && N === "") {
          if (Z += R.slice(M.index, M.index + 1), !Q) {
            const V = new Error(`0 width match regex (${w})`);
            throw V.languageName = w, V.badRule = zn.rule, V;
          }
          return 1;
        }
        if (zn = M, M.type === "begin")
          return ur(M);
        if (M.type === "illegal" && !B) {
          const V = new Error('Illegal lexeme "' + N + '" for mode "' + (D.scope || "<unnamed>") + '"');
          throw V.mode = D, V;
        } else if (M.type === "end") {
          const V = hr(M);
          if (V !== wt)
            return V;
        }
        if (M.type === "illegal" && N === "")
          return Z += `
`, 1;
        if (fi > 1e5 && fi > M.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return Z += N, N.length;
      }
      const Ue = E(w);
      if (!Ue)
        throw _e(K.replace("{}", w)), new Error('Unknown language: "' + w + '"');
      const pr = Rt(Ue);
      let pi = "", D = Y || pr;
      const as = {}, le = new S.__emitter(S);
      dr();
      let Z = "", Hn = 0, _t = 0, fi = 0, gi = !1;
      try {
        if (Ue.__emitTokens)
          Ue.__emitTokens(R, le);
        else {
          for (D.matcher.considerAll(); ; ) {
            fi++, gi ? gi = !1 : D.matcher.considerAll(), D.matcher.lastIndex = _t;
            const k = D.matcher.exec(R);
            if (!k) break;
            const M = R.substring(_t, k.index), N = os(M, k);
            _t = k.index + N;
          }
          os(R.substring(_t));
        }
        return le.finalize(), pi = le.toHTML(), {
          language: w,
          value: pi,
          relevance: Hn,
          illegal: !1,
          _emitter: le,
          _top: D
        };
      } catch (k) {
        if (k.message && k.message.includes("Illegal"))
          return {
            language: w,
            value: Jt(R),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: k.message,
              index: _t,
              context: R.slice(_t - 100, _t + 100),
              mode: k.mode,
              resultSoFar: pi
            },
            _emitter: le
          };
        if (Q)
          return {
            language: w,
            value: Jt(R),
            illegal: !1,
            relevance: 0,
            errorRaised: k,
            _emitter: le,
            _top: D
          };
        throw k;
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
      const B = Mt(w), Y = R.filter(E).filter(re).map(
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
      }), [Oe, at] = oe, Un = Oe;
      return Un.secondBest = at, Un;
    }
    function Pn(w, R, B) {
      const Y = R && v[R] || B;
      w.classList.add("hljs"), w.classList.add(`language-${Y}`);
    }
    function ve(w) {
      let R = null;
      const B = F(w);
      if (O(B)) return;
      if (Ne(
        "before:highlightElement",
        { el: w, language: B }
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
      const Y = R.textContent, oe = B ? W(Y, { language: B, ignoreIllegals: !0 }) : bt(Y);
      w.innerHTML = oe.value, w.dataset.highlighted = "yes", Pn(w, B, oe.language), w.result = {
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
    const Nn = () => {
      Ot(), xe("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Bn() {
      Ot(), xe("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let en = !1;
    function Ot() {
      function w() {
        Ot();
      }
      if (document.readyState === "loading") {
        en || window.addEventListener("DOMContentLoaded", w, !1), en = !0;
        return;
      }
      document.querySelectorAll(S.cssSelector).forEach(ve);
    }
    function C(w, R) {
      let B = null;
      try {
        B = R(o);
      } catch (Y) {
        if (_e("Language definition for '{}' could not be registered.".replace("{}", w)), Q)
          _e(Y);
        else
          throw Y;
        B = T;
      }
      B.name || (B.name = w), d[w] = B, B.rawDefinition = R.bind(null, o), B.aliases && q(B.aliases, { languageName: w });
    }
    function l(w) {
      delete d[w];
      for (const R of Object.keys(v))
        v[R] === w && delete v[R];
    }
    function x() {
      return Object.keys(d);
    }
    function E(w) {
      return w = (w || "").toLowerCase(), d[w] || d[v[w]];
    }
    function q(w, { languageName: R }) {
      typeof w == "string" && (w = [w]), w.forEach((B) => {
        v[B.toLowerCase()] = R;
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
    function Me(w) {
      const R = L.indexOf(w);
      R !== -1 && L.splice(R, 1);
    }
    function Ne(w, R) {
      const B = w;
      L.forEach(function(Y) {
        Y[B] && Y[B](R);
      });
    }
    function tn(w) {
      return xe("10.7.0", "highlightBlock will be removed entirely in v12.0"), xe("10.7.0", "Please use highlightElement now."), ve(w);
    }
    Object.assign(o, {
      highlight: W,
      highlightAuto: bt,
      highlightAll: Ot,
      highlightElement: ve,
      // TODO: Remove with v12 API
      highlightBlock: tn,
      configure: Dn,
      initHighlighting: Nn,
      initHighlightingOnLoad: Bn,
      registerLanguage: C,
      unregisterLanguage: l,
      listLanguages: x,
      getLanguage: E,
      registerAliases: q,
      autoDetection: re,
      inherit: mt,
      addPlugin: ce,
      removePlugin: Me
    }), o.debugMode = function() {
      Q = !1;
    }, o.safeMode = function() {
      Q = !0;
    }, o.versionString = Kt, o.regex = {
      concat: H,
      lookahead: y,
      either: Ae,
      optional: I,
      anyNumberOfTimes: z
    };
    for (const w in ft)
      typeof ft[w] == "object" && n(ft[w]);
    return Object.assign(o, ft), o;
  }, rt = st({});
  return rt.newInstance = () => st({}), Ai = rt, rt.HighlightJS = rt, rt.default = rt, Ai;
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
class Hr extends qi {
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
class Fr extends qi {
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
class vn {
  constructor(e, t) {
    this.root = document.createElement("div"), this.root.classList.add("card"), this.root.id = e.card_id, this.card = e, this.boardView = t, this.setVisibility(!1), this.setInteractivity(!1), this.place(t);
  }
  place(e) {
    const t = e.getCoordinateSystem(), { leftPx: i, topPx: s } = t.getBoardLocationPx(
      this.card.card_location,
      this.card.card_shape
    ), { widthPx: r, heightPx: c } = t.getBoardRectanglePx(
      this.card.card_shape
    );
    this.root.style.left = `${i}px`, this.root.style.top = `${s}px`, this.root.style.width = `${r}px`, this.root.style.height = `${c}px`, e.root.appendChild(this.root);
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
class Gr {
  constructor(e, t, i, s) {
    this.tArmed = null, this.cardView = i, i.addClickCallback(
      (r) => {
        if (!this.tArmed)
          return;
        const c = Math.round(performance.now() - this.tArmed), a = s.root.getBoundingClientRect(), h = (r.clientX - a.left) / a.width - 0.5, u = (r.clientY - a.top) / a.height - 0.5;
        t({
          sensor_id: e,
          action_type: "ClickAction",
          action_value: {
            click_x: h,
            click_y: u
          },
          reaction_time_msec: c
        });
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
        const s = Math.round(performance.now() - this.tArmed);
        t({
          sensor_id: e,
          action_type: "DoneAction",
          action_value: {},
          reaction_time_msec: s
        });
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
    const e = performance.now();
    this.timeoutId = window.setTimeout(
      () => {
        const t = Math.round(performance.now() - e), i = {
          sensor_id: this.sensorId,
          action_type: "TimeoutAction",
          action_value: {},
          reaction_time_msec: t
        };
        this.onSensorFired(i);
      },
      this.timeoutMsec
    );
  }
  disarm() {
    this.timeoutId !== null && (clearTimeout(this.timeoutId), this.timeoutId = null);
  }
}
class Xr {
  constructor(e, t, i) {
    this.tArmed = null, this.sensorId = e, this.onSensorFired = t, this.keys = [...i], document.addEventListener("keydown", (s) => this.onKeyPress(s));
  }
  arm() {
    this.tArmed = performance.now();
  }
  disarm() {
    this.tArmed = null, document.removeEventListener("keydown", this.onKeyPress);
  }
  onKeyPress(e) {
    if (!this.tArmed)
      return;
    e.preventDefault();
    let t = e.key;
    if (this.keys.includes(t)) {
      const i = Math.round(performance.now() - this.tArmed), s = {
        sensor_id: this.sensorId,
        action_type: "KeyPressAction",
        action_value: {
          key: t
        },
        reaction_time_msec: i
      };
      this.onSensorFired(s);
    }
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
class Kr extends vn {
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
var kt = Xi();
function Gs(n) {
  kt = n;
}
var _n = { exec: () => null };
function $(n, e = "") {
  let t = typeof n == "string" ? n : n.source;
  const i = {
    replace: (s, r) => {
      let c = typeof r == "string" ? r : r.source;
      return c = c.replace(de.caret, "$1"), t = t.replace(s, c), i;
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
}, Qr = /^(?:[ \t]*(?:\n|$))+/, Jr = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, eo = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, yn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, to = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Yi = /(?:[*+-]|\d{1,9}[.)])/, Ws = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, qs = $(Ws).replace(/bull/g, Yi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), no = $(Ws).replace(/bull/g, Yi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Zi = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, io = /^[^\n]+/, Ki = /(?!\s*\])(?:\\.|[^\[\]\\])+/, so = $(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Ki).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), ro = $(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Yi).getRegex(), ri = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Qi = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, oo = $(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", Qi).replace("tag", ri).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Xs = $(Zi).replace("hr", yn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ri).getRegex(), ao = $(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Xs).getRegex(), Ji = {
  blockquote: ao,
  code: Jr,
  def: so,
  fences: eo,
  heading: to,
  hr: yn,
  html: oo,
  lheading: qs,
  list: ro,
  newline: Qr,
  paragraph: Xs,
  table: _n,
  text: io
}, Es = $(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", yn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ri).getRegex(), lo = {
  ...Ji,
  lheading: no,
  table: Es,
  paragraph: $(Zi).replace("hr", yn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Es).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ri).getRegex()
}, co = {
  ...Ji,
  html: $(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", Qi).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: _n,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: $(Zi).replace("hr", yn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", qs).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, uo = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, ho = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Ys = /^( {2,}|\\)\n(?!\s*$)/, po = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, oi = /[\p{P}\p{S}]/u, es = /[\s\p{P}\p{S}]/u, Zs = /[^\s\p{P}\p{S}]/u, fo = $(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, es).getRegex(), Ks = /(?!~)[\p{P}\p{S}]/u, go = /(?!~)[\s\p{P}\p{S}]/u, mo = /(?:[^\s\p{P}\p{S}]|~)/u, wo = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, Qs = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, bo = $(Qs, "u").replace(/punct/g, oi).getRegex(), _o = $(Qs, "u").replace(/punct/g, Ks).getRegex(), Js = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", xo = $(Js, "gu").replace(/notPunctSpace/g, Zs).replace(/punctSpace/g, es).replace(/punct/g, oi).getRegex(), vo = $(Js, "gu").replace(/notPunctSpace/g, mo).replace(/punctSpace/g, go).replace(/punct/g, Ks).getRegex(), yo = $(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, Zs).replace(/punctSpace/g, es).replace(/punct/g, oi).getRegex(), ko = $(/\\(punct)/, "gu").replace(/punct/g, oi).getRegex(), Eo = $(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), So = $(Qi).replace("(?:-->|$)", "-->").getRegex(), To = $(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", So).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), ei = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, Ao = $(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", ei).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), er = $(/^!?\[(label)\]\[(ref)\]/).replace("label", ei).replace("ref", Ki).getRegex(), tr = $(/^!?\[(ref)\](?:\[\])?/).replace("ref", Ki).getRegex(), Co = $("reflink|nolink(?!\\()", "g").replace("reflink", er).replace("nolink", tr).getRegex(), ts = {
  _backpedal: _n,
  // only used for GFM url
  anyPunctuation: ko,
  autolink: Eo,
  blockSkip: wo,
  br: Ys,
  code: ho,
  del: _n,
  emStrongLDelim: bo,
  emStrongRDelimAst: xo,
  emStrongRDelimUnd: yo,
  escape: uo,
  link: Ao,
  nolink: tr,
  punctuation: fo,
  reflink: er,
  reflinkSearch: Co,
  tag: To,
  text: po,
  url: _n
}, Ro = {
  ...ts,
  link: $(/^!?\[(label)\]\((.*?)\)/).replace("label", ei).getRegex(),
  reflink: $(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", ei).getRegex()
}, Ui = {
  ...ts,
  emStrongRDelimAst: vo,
  emStrongLDelim: _o,
  url: $(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, Mo = {
  ...Ui,
  br: $(Ys).replace("{2,}", "*").getRegex(),
  text: $(Ui.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Gn = {
  normal: Ji,
  gfm: lo,
  pedantic: co
}, un = {
  normal: ts,
  gfm: Ui,
  breaks: Mo,
  pedantic: Ro
}, Oo = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, Ss = (n) => Oo[n];
function He(n, e) {
  if (e) {
    if (de.escapeTest.test(n))
      return n.replace(de.escapeReplace, Ss);
  } else if (de.escapeTestNoEncode.test(n))
    return n.replace(de.escapeReplaceNoEncode, Ss);
  return n;
}
function Ts(n) {
  try {
    n = encodeURI(n).replace(de.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function As(n, e) {
  var r;
  const t = n.replace(de.findPipe, (c, a, h) => {
    let u = !1, f = a;
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
function hn(n, e, t) {
  const i = n.length;
  if (i === 0)
    return "";
  let s = 0;
  for (; s < i && n.charAt(i - s - 1) === e; )
    s++;
  return n.slice(0, i - s);
}
function Lo(n, e) {
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
function Cs(n, e, t, i, s) {
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
function Io(n, e, t) {
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
var ti = class {
  // set by the lexer
  constructor(n) {
    X(this, "options");
    X(this, "rules");
    // set by the lexer
    X(this, "lexer");
    this.options = n || kt;
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
        text: this.options.pedantic ? t : hn(t, `
`)
      };
    }
  }
  fences(n) {
    const e = this.rules.block.fences.exec(n);
    if (e) {
      const t = e[0], i = Io(t, e[3] || "", this.rules);
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
        const i = hn(t, "#");
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
        raw: hn(e[0], `
`)
      };
  }
  blockquote(n) {
    const e = this.rules.block.blockquote.exec(n);
    if (e) {
      let t = hn(e[0], `
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
`), f = u.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${u}` : u, s = s ? `${s}
${f}` : f;
        const A = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(f, r, !0), this.lexer.state.top = A, t.length === 0)
          break;
        const y = r.at(-1);
        if ((y == null ? void 0 : y.type) === "code")
          break;
        if ((y == null ? void 0 : y.type) === "blockquote") {
          const z = y, I = z.raw + `
` + t.join(`
`), H = this.blockquote(I);
          r[r.length - 1] = H, i = i.substring(0, i.length - z.raw.length) + H.raw, s = s.substring(0, s.length - z.text.length) + H.text;
          break;
        } else if ((y == null ? void 0 : y.type) === "list") {
          const z = y, I = z.raw + `
` + t.join(`
`), H = this.list(I);
          r[r.length - 1] = H, i = i.substring(0, i.length - y.raw.length) + H.raw, s = s.substring(0, s.length - z.raw.length) + H.raw, t = I.substring(r.at(-1).raw.length).split(`
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
        let h = !1, u = "", f = "";
        if (!(e = r.exec(n)) || this.rules.block.hr.test(n))
          break;
        u = e[0], n = n.substring(u.length);
        let A = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (Ae) => " ".repeat(3 * Ae.length)), y = n.split(`
`, 1)[0], z = !A.trim(), I = 0;
        if (this.options.pedantic ? (I = 2, f = A.trimStart()) : z ? I = e[1].length + 1 : (I = e[2].search(this.rules.other.nonSpaceChar), I = I > 4 ? 1 : I, f = A.slice(I), I += e[1].length), z && this.rules.other.blankLine.test(y) && (u += y + `
`, n = n.substring(y.length + 1), h = !0), !h) {
          const Ae = this.rules.other.nextBulletRegex(I), be = this.rules.other.hrRegex(I), Ce = this.rules.other.fencesBeginRegex(I), te = this.rules.other.headingBeginRegex(I), Re = this.rules.other.htmlBeginRegex(I);
          for (; n; ) {
            const Ve = n.split(`
`, 1)[0];
            let De;
            if (y = Ve, this.options.pedantic ? (y = y.replace(this.rules.other.listReplaceNesting, "  "), De = y) : De = y.replace(this.rules.other.tabCharGlobal, "    "), Ce.test(y) || te.test(y) || Re.test(y) || Ae.test(y) || be.test(y))
              break;
            if (De.search(this.rules.other.nonSpaceChar) >= I || !y.trim())
              f += `
` + De.slice(I);
            else {
              if (z || A.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || Ce.test(A) || te.test(A) || be.test(A))
                break;
              f += `
` + y;
            }
            !z && !y.trim() && (z = !0), u += Ve + `
`, n = n.substring(Ve.length + 1), A = De.slice(I);
          }
        }
        s.loose || (c ? s.loose = !0 : this.rules.other.doubleBlankLine.test(u) && (c = !0));
        let H = null, Pe;
        this.options.gfm && (H = this.rules.other.listIsTask.exec(f), H && (Pe = H[0] !== "[ ] ", f = f.replace(this.rules.other.listReplaceTask, ""))), s.items.push({
          type: "list_item",
          raw: u,
          task: !!H,
          checked: Pe,
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
    var c;
    const e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2]))
      return;
    const t = As(e[1]), i = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = (c = e[3]) != null && c.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
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
        r.rows.push(As(a, r.header.length).map((h, u) => ({
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
        const r = hn(t.slice(0, -1), "\\");
        if ((t.length - r.length) % 2 === 0)
          return;
      } else {
        const r = Lo(e[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(t) ? i = i.slice(1) : i = i.slice(1, -1)), Cs(e, {
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
      return Cs(t, s, t[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, t = "") {
    let i = this.rules.inline.emStrongLDelim.exec(n);
    if (!i || i[3] && t.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(i[1] || i[2] || "") || !t || this.rules.inline.punctuation.exec(t)) {
      const r = [...i[0]].length - 1;
      let c, a, h = r, u = 0;
      const f = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (f.lastIndex = 0, e = e.slice(-1 * n.length + r); (i = f.exec(e)) != null; ) {
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
        const A = [...i[0]][0].length, y = n.slice(0, r + i.index + A + a);
        if (Math.min(r, a) % 2) {
          const I = y.slice(1, -1);
          return {
            type: "em",
            raw: y,
            text: I,
            tokens: this.lexer.inlineTokens(I)
          };
        }
        const z = y.slice(2, -2);
        return {
          type: "strong",
          raw: y,
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
}, Qe = class zi {
  constructor(e) {
    X(this, "tokens");
    X(this, "options");
    X(this, "state");
    X(this, "tokenizer");
    X(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || kt, this.options.tokenizer = this.options.tokenizer || new ti(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const t = {
      other: de,
      block: Gn.normal,
      inline: un.normal
    };
    this.options.pedantic ? (t.block = Gn.pedantic, t.inline = un.pedantic) : this.options.gfm && (t.block = Gn.gfm, this.options.breaks ? t.inline = un.breaks : t.inline = un.gfm), this.tokenizer.rules = t;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: Gn,
      inline: un
    };
  }
  /**
   * Static Lex Method
   */
  static lex(e, t) {
    return new zi(t).lex(e);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(e, t) {
    return new zi(t).inlineTokens(e);
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
    var s, r, c;
    for (this.options.pedantic && (e = e.replace(de.tabCharGlobal, "    ").replace(de.spaceLine, "")); e; ) {
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
        const f = e.slice(1);
        let A;
        this.options.extensions.startBlock.forEach((y) => {
          A = y.call({ lexer: this }, f), typeof A == "number" && A >= 0 && (u = Math.min(u, A));
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
    let r = !1, c = "";
    for (; e; ) {
      r || (c = ""), r = !1;
      let f;
      if ((h = (a = this.options.extensions) == null ? void 0 : a.inline) != null && h.some((y) => (f = y.call({ lexer: this }, e, t)) ? (e = e.substring(f.raw.length), t.push(f), !0) : !1))
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
      if (f = this.tokenizer.emStrong(e, i, c)) {
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
        let y = 1 / 0;
        const z = e.slice(1);
        let I;
        this.options.extensions.startInline.forEach((H) => {
          I = H.call({ lexer: this }, z), typeof I == "number" && I >= 0 && (y = Math.min(y, I));
        }), y < 1 / 0 && y >= 0 && (A = e.substring(0, y + 1));
      }
      if (f = this.tokenizer.inlineText(A)) {
        e = e.substring(f.raw.length), f.raw.slice(-1) !== "_" && (c = f.raw.slice(-1)), r = !0;
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
}, ni = class {
  // set by the parser
  constructor(n) {
    X(this, "options");
    X(this, "parser");
    this.options = n || kt;
  }
  space(n) {
    return "";
  }
  code({ text: n, lang: e, escaped: t }) {
    var r;
    const i = (r = (e || "").match(de.notSpaceStart)) == null ? void 0 : r[0], s = n.replace(de.endingNewline, "") + `
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
    return `<code>${He(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: e, tokens: t }) {
    const i = this.parser.parseInline(t), s = Ts(n);
    if (s === null)
      return i;
    n = s;
    let r = '<a href="' + n + '"';
    return e && (r += ' title="' + He(e) + '"'), r += ">" + i + "</a>", r;
  }
  image({ href: n, title: e, text: t, tokens: i }) {
    i && (t = this.parser.parseInline(i, this.parser.textRenderer));
    const s = Ts(n);
    if (s === null)
      return He(t);
    n = s;
    let r = `<img src="${n}" alt="${t}"`;
    return e && (r += ` title="${He(e)}"`), r += ">", r;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : He(n.text);
  }
}, ns = class {
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
}, Je = class Hi {
  constructor(e) {
    X(this, "options");
    X(this, "renderer");
    X(this, "textRenderer");
    this.options = e || kt, this.options.renderer = this.options.renderer || new ni(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new ns();
  }
  /**
   * Static Parse Method
   */
  static parse(e, t) {
    return new Hi(t).parse(e);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(e, t) {
    return new Hi(t).parseInline(e);
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
          for (; c + 1 < e.length && e[c + 1].type === "text"; )
            u = e[++c], f += `
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
}, Ii, Yn = (Ii = class {
  constructor(n) {
    X(this, "options");
    X(this, "block");
    this.options = n || kt;
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
}, X(Ii, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
])), Ii), Po = class {
  constructor(...n) {
    X(this, "defaults", Xi());
    X(this, "options", this.setOptions);
    X(this, "parse", this.parseMarkdown(!0));
    X(this, "parseInline", this.parseMarkdown(!1));
    X(this, "Parser", Je);
    X(this, "Renderer", ni);
    X(this, "TextRenderer", ns);
    X(this, "Lexer", Qe);
    X(this, "Tokenizer", ti);
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
        const s = this.defaults.renderer || new ni(this.defaults);
        for (const r in t.renderer) {
          if (!(r in s))
            throw new Error(`renderer '${r}' does not exist`);
          if (["options", "parser"].includes(r))
            continue;
          const c = r, a = t.renderer[c], h = s[c];
          s[c] = (...u) => {
            let f = a.apply(s, u);
            return f === !1 && (f = h.apply(s, u)), f || "";
          };
        }
        i.renderer = s;
      }
      if (t.tokenizer) {
        const s = this.defaults.tokenizer || new ti(this.defaults);
        for (const r in t.tokenizer) {
          if (!(r in s))
            throw new Error(`tokenizer '${r}' does not exist`);
          if (["options", "rules", "lexer"].includes(r))
            continue;
          const c = r, a = t.tokenizer[c], h = s[c];
          s[c] = (...u) => {
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
          const c = r, a = t.hooks[c], h = s[c];
          Yn.passThroughHooks.has(r) ? s[c] = (u) => {
            if (this.defaults.async)
              return Promise.resolve(a.call(s, u)).then((A) => h.call(s, A));
            const f = a.call(s, u);
            return h.call(s, f);
          } : s[c] = (...u) => {
            let f = a.apply(s, u);
            return f === !1 && (f = h.apply(s, u)), f;
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
    return Qe.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return Je.parse(n, e ?? this.defaults);
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
      const a = r.hooks ? r.hooks.provideLexer() : n ? Qe.lex : Qe.lexInline, h = r.hooks ? r.hooks.provideParser() : n ? Je.parse : Je.parseInline;
      if (r.async)
        return Promise.resolve(r.hooks ? r.hooks.preprocess(t) : t).then((u) => a(u, r)).then((u) => r.hooks ? r.hooks.processAllTokens(u) : u).then((u) => r.walkTokens ? Promise.all(this.walkTokens(u, r.walkTokens)).then(() => u) : u).then((u) => h(u, r)).then((u) => r.hooks ? r.hooks.postprocess(u) : u).catch(c);
      try {
        r.hooks && (t = r.hooks.preprocess(t));
        let u = a(t, r);
        r.hooks && (u = r.hooks.processAllTokens(u)), r.walkTokens && this.walkTokens(u, r.walkTokens);
        let f = h(u, r);
        return r.hooks && (f = r.hooks.postprocess(f)), f;
      } catch (u) {
        return c(u);
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
}, yt = new Po();
function j(n, e) {
  return yt.parse(n, e);
}
j.options = j.setOptions = function(n) {
  return yt.setOptions(n), j.defaults = yt.defaults, Gs(j.defaults), j;
};
j.getDefaults = Xi;
j.defaults = kt;
j.use = function(...n) {
  return yt.use(...n), j.defaults = yt.defaults, Gs(j.defaults), j;
};
j.walkTokens = function(n, e) {
  return yt.walkTokens(n, e);
};
j.parseInline = yt.parseInline;
j.Parser = Je;
j.parser = Je.parse;
j.Renderer = ni;
j.TextRenderer = ns;
j.Lexer = Qe;
j.lexer = Qe.lex;
j.Tokenizer = ti;
j.Hooks = Yn;
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
  setPrototypeOf: Rs,
  isFrozen: Do,
  getPrototypeOf: No,
  getOwnPropertyDescriptor: Bo
} = Object;
let {
  freeze: pe,
  seal: Te,
  create: ir
} = Object, {
  apply: $i,
  construct: Fi
} = typeof Reflect < "u" && Reflect;
pe || (pe = function(e) {
  return e;
});
Te || (Te = function(e) {
  return e;
});
$i || ($i = function(e, t, i) {
  return e.apply(t, i);
});
Fi || (Fi = function(e, t) {
  return new e(...t);
});
const Wn = fe(Array.prototype.forEach), Uo = fe(Array.prototype.lastIndexOf), Ms = fe(Array.prototype.pop), dn = fe(Array.prototype.push), zo = fe(Array.prototype.splice), Zn = fe(String.prototype.toLowerCase), Ci = fe(String.prototype.toString), Os = fe(String.prototype.match), pn = fe(String.prototype.replace), Ho = fe(String.prototype.indexOf), $o = fe(String.prototype.trim), Le = fe(Object.prototype.hasOwnProperty), he = fe(RegExp.prototype.test), fn = Fo(TypeError);
function fe(n) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++)
      i[s - 1] = arguments[s];
    return $i(n, e, i);
  };
}
function Fo(n) {
  return function() {
    for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++)
      t[i] = arguments[i];
    return Fi(n, t);
  };
}
function U(n, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Zn;
  Rs && Rs(n, null);
  let i = e.length;
  for (; i--; ) {
    let s = e[i];
    if (typeof s == "string") {
      const r = t(s);
      r !== s && (Do(e) || (e[i] = r), s = r);
    }
    n[s] = !0;
  }
  return n;
}
function Vo(n) {
  for (let e = 0; e < n.length; e++)
    Le(n, e) || (n[e] = null);
  return n;
}
function Xe(n) {
  const e = ir(null);
  for (const [t, i] of nr(n))
    Le(n, t) && (Array.isArray(i) ? e[t] = Vo(i) : i && typeof i == "object" && i.constructor === Object ? e[t] = Xe(i) : e[t] = i);
  return e;
}
function gn(n, e) {
  for (; n !== null; ) {
    const i = Bo(n, e);
    if (i) {
      if (i.get)
        return fe(i.get);
      if (typeof i.value == "function")
        return fe(i.value);
    }
    n = No(n);
  }
  function t() {
    return null;
  }
  return t;
}
const Ls = pe(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), Ri = pe(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), Mi = pe(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), jo = pe(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Oi = pe(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Go = pe(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Is = pe(["#text"]), Ps = pe(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), Li = pe(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), Ds = pe(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), qn = pe(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Wo = Te(/\{\{[\w\W]*|[\w\W]*\}\}/gm), qo = Te(/<%[\w\W]*|[\w\W]*%>/gm), Xo = Te(/\$\{[\w\W]*/gm), Yo = Te(/^data-[\-\w.\u00B7-\uFFFF]+$/), Zo = Te(/^aria-[\-\w]+$/), sr = Te(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Ko = Te(/^(?:\w+script|data):/i), Qo = Te(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), rr = Te(/^html$/i), Jo = Te(/^[a-z][.\w]*(-[.\w]+)+$/i);
var Ns = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: Zo,
  ATTR_WHITESPACE: Qo,
  CUSTOM_ELEMENT: Jo,
  DATA_ATTR: Yo,
  DOCTYPE_NAME: rr,
  ERB_EXPR: qo,
  IS_ALLOWED_URI: sr,
  IS_SCRIPT_OR_DATA: Ko,
  MUSTACHE_EXPR: Wo,
  TMPLIT_EXPR: Xo
});
const mn = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, ea = function() {
  return typeof window > "u" ? null : window;
}, ta = function(e, t) {
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
}, Bs = function() {
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
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ea();
  const e = (C) => or(C);
  if (e.version = "3.2.6", e.removed = [], !n || !n.document || n.document.nodeType !== mn.document || !n.Element)
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
    NamedNodeMap: f = n.NamedNodeMap || n.MozNamedAttrMap,
    HTMLFormElement: A,
    DOMParser: y,
    trustedTypes: z
  } = n, I = h.prototype, H = gn(I, "cloneNode"), Pe = gn(I, "remove"), Ae = gn(I, "nextSibling"), be = gn(I, "childNodes"), Ce = gn(I, "parentNode");
  if (typeof c == "function") {
    const C = t.createElement("template");
    C.content && C.content.ownerDocument && (t = C.content.ownerDocument);
  }
  let te, Re = "";
  const {
    implementation: Ve,
    createNodeIterator: De,
    createDocumentFragment: Ft,
    getElementsByTagName: kn
  } = t, {
    importNode: En
  } = i;
  let ae = Bs();
  e.isSupported = typeof nr == "function" && typeof Ce == "function" && Ve && Ve.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: Vt,
    ERB_EXPR: jt,
    TMPLIT_EXPR: je,
    DATA_ATTR: ai,
    ARIA_ATTR: li,
    IS_SCRIPT_OR_DATA: ci,
    ATTR_WHITESPACE: dt,
    CUSTOM_ELEMENT: ui
  } = Ns;
  let {
    IS_ALLOWED_URI: Sn
  } = Ns, ne = null;
  const Tn = U({}, [...Ls, ...Ri, ...Mi, ...Oi, ...Is]);
  let se = null;
  const An = U({}, [...Ps, ...Li, ...Ds, ...qn]);
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
  })), pt = null, Gt = null, Cn = !0, Rn = !0, ft = !1, Mn = !0, tt = !1, Et = !0, Ge = !1, Wt = !1, qt = !1, nt = !1, St = !1, Tt = !1, Xt = !0, On = !1;
  const hi = "user-content-";
  let At = !0, _e = !1, We = {}, xe = null;
  const gt = U({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let Yt = null;
  const Ln = U({}, ["audio", "video", "img", "source", "image", "track"]);
  let Zt = null;
  const In = U({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Ct = "http://www.w3.org/1998/Math/MathML", Rt = "http://www.w3.org/2000/svg", Ee = "http://www.w3.org/1999/xhtml";
  let it = Ee, Kt = !1, Qt = null;
  const Jt = U({}, [Ct, Rt, Ee], Ci);
  let mt = U({}, ["mi", "mo", "mn", "ms", "mtext"]), wt = U({}, ["annotation-xml"]);
  const di = U({}, ["title", "style", "font", "a", "script"]);
  let st = null;
  const rt = ["application/xhtml+xml", "text/html"], o = "text/html";
  let d = null, v = null;
  const L = t.createElement("form"), Q = function(l) {
    return l instanceof RegExp || l instanceof Function;
  }, K = function() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(v && v === l)) {
      if ((!l || typeof l != "object") && (l = {}), l = Xe(l), st = // eslint-disable-next-line unicorn/prefer-includes
      rt.indexOf(l.PARSER_MEDIA_TYPE) === -1 ? o : l.PARSER_MEDIA_TYPE, d = st === "application/xhtml+xml" ? Ci : Zn, ne = Le(l, "ALLOWED_TAGS") ? U({}, l.ALLOWED_TAGS, d) : Tn, se = Le(l, "ALLOWED_ATTR") ? U({}, l.ALLOWED_ATTR, d) : An, Qt = Le(l, "ALLOWED_NAMESPACES") ? U({}, l.ALLOWED_NAMESPACES, Ci) : Jt, Zt = Le(l, "ADD_URI_SAFE_ATTR") ? U(Xe(In), l.ADD_URI_SAFE_ATTR, d) : In, Yt = Le(l, "ADD_DATA_URI_TAGS") ? U(Xe(Ln), l.ADD_DATA_URI_TAGS, d) : Ln, xe = Le(l, "FORBID_CONTENTS") ? U({}, l.FORBID_CONTENTS, d) : gt, pt = Le(l, "FORBID_TAGS") ? U({}, l.FORBID_TAGS, d) : Xe({}), Gt = Le(l, "FORBID_ATTR") ? U({}, l.FORBID_ATTR, d) : Xe({}), We = Le(l, "USE_PROFILES") ? l.USE_PROFILES : !1, Cn = l.ALLOW_ARIA_ATTR !== !1, Rn = l.ALLOW_DATA_ATTR !== !1, ft = l.ALLOW_UNKNOWN_PROTOCOLS || !1, Mn = l.ALLOW_SELF_CLOSE_IN_ATTR !== !1, tt = l.SAFE_FOR_TEMPLATES || !1, Et = l.SAFE_FOR_XML !== !1, Ge = l.WHOLE_DOCUMENT || !1, nt = l.RETURN_DOM || !1, St = l.RETURN_DOM_FRAGMENT || !1, Tt = l.RETURN_TRUSTED_TYPE || !1, qt = l.FORCE_BODY || !1, Xt = l.SANITIZE_DOM !== !1, On = l.SANITIZE_NAMED_PROPS || !1, At = l.KEEP_CONTENT !== !1, _e = l.IN_PLACE || !1, Sn = l.ALLOWED_URI_REGEXP || sr, it = l.NAMESPACE || Ee, mt = l.MATHML_TEXT_INTEGRATION_POINTS || mt, wt = l.HTML_INTEGRATION_POINTS || wt, J = l.CUSTOM_ELEMENT_HANDLING || {}, l.CUSTOM_ELEMENT_HANDLING && Q(l.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (J.tagNameCheck = l.CUSTOM_ELEMENT_HANDLING.tagNameCheck), l.CUSTOM_ELEMENT_HANDLING && Q(l.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (J.attributeNameCheck = l.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), l.CUSTOM_ELEMENT_HANDLING && typeof l.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (J.allowCustomizedBuiltInElements = l.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), tt && (Rn = !1), St && (nt = !0), We && (ne = U({}, Is), se = [], We.html === !0 && (U(ne, Ls), U(se, Ps)), We.svg === !0 && (U(ne, Ri), U(se, Li), U(se, qn)), We.svgFilters === !0 && (U(ne, Mi), U(se, Li), U(se, qn)), We.mathMl === !0 && (U(ne, Oi), U(se, Ds), U(se, qn))), l.ADD_TAGS && (ne === Tn && (ne = Xe(ne)), U(ne, l.ADD_TAGS, d)), l.ADD_ATTR && (se === An && (se = Xe(se)), U(se, l.ADD_ATTR, d)), l.ADD_URI_SAFE_ATTR && U(Zt, l.ADD_URI_SAFE_ATTR, d), l.FORBID_CONTENTS && (xe === gt && (xe = Xe(xe)), U(xe, l.FORBID_CONTENTS, d)), At && (ne["#text"] = !0), Ge && U(ne, ["html", "head", "body"]), ne.table && (U(ne, ["tbody"]), delete pt.tbody), l.TRUSTED_TYPES_POLICY) {
        if (typeof l.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw fn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof l.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw fn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        te = l.TRUSTED_TYPES_POLICY, Re = te.createHTML("");
      } else
        te === void 0 && (te = ta(z, s)), te !== null && typeof Re == "string" && (Re = te.createHTML(""));
      pe && pe(l), v = l;
    }
  }, T = U({}, [...Ri, ...Mi, ...jo]), S = U({}, [...Oi, ...Go]), O = function(l) {
    let x = Ce(l);
    (!x || !x.tagName) && (x = {
      namespaceURI: it,
      tagName: "template"
    });
    const E = Zn(l.tagName), q = Zn(x.tagName);
    return Qt[l.namespaceURI] ? l.namespaceURI === Rt ? x.namespaceURI === Ee ? E === "svg" : x.namespaceURI === Ct ? E === "svg" && (q === "annotation-xml" || mt[q]) : !!T[E] : l.namespaceURI === Ct ? x.namespaceURI === Ee ? E === "math" : x.namespaceURI === Rt ? E === "math" && wt[q] : !!S[E] : l.namespaceURI === Ee ? x.namespaceURI === Rt && !wt[q] || x.namespaceURI === Ct && !mt[q] ? !1 : !S[E] && (di[E] || !T[E]) : !!(st === "application/xhtml+xml" && Qt[l.namespaceURI]) : !1;
  }, F = function(l) {
    dn(e.removed, {
      element: l
    });
    try {
      Ce(l).removeChild(l);
    } catch {
      Pe(l);
    }
  }, W = function(l, x) {
    try {
      dn(e.removed, {
        attribute: x.getAttributeNode(l),
        from: x
      });
    } catch {
      dn(e.removed, {
        attribute: null,
        from: x
      });
    }
    if (x.removeAttribute(l), l === "is")
      if (nt || St)
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
      const ee = Os(l, /^[\r\n\t ]+/);
      E = ee && ee[0];
    }
    st === "application/xhtml+xml" && it === Ee && (l = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + l + "</body></html>");
    const q = te ? te.createHTML(l) : l;
    if (it === Ee)
      try {
        x = new y().parseFromString(q, st);
      } catch {
      }
    if (!x || !x.documentElement) {
      x = Ve.createDocument(it, "template", null);
      try {
        x.documentElement.innerHTML = Kt ? Re : q;
      } catch {
      }
    }
    const re = x.body || x.documentElement;
    return l && E && re.insertBefore(t.createTextNode(E), re.childNodes[0] || null), it === Ee ? kn.call(x, Ge ? "html" : "body")[0] : Ge ? x.documentElement : re;
  }, Mt = function(l) {
    return De.call(
      l.ownerDocument || l,
      l,
      // eslint-disable-next-line no-bitwise
      u.SHOW_ELEMENT | u.SHOW_COMMENT | u.SHOW_TEXT | u.SHOW_PROCESSING_INSTRUCTION | u.SHOW_CDATA_SECTION,
      null
    );
  }, bt = function(l) {
    return l instanceof A && (typeof l.nodeName != "string" || typeof l.textContent != "string" || typeof l.removeChild != "function" || !(l.attributes instanceof f) || typeof l.removeAttribute != "function" || typeof l.setAttribute != "function" || typeof l.namespaceURI != "string" || typeof l.insertBefore != "function" || typeof l.hasChildNodes != "function");
  }, Pn = function(l) {
    return typeof a == "function" && l instanceof a;
  };
  function ve(C, l, x) {
    Wn(C, (E) => {
      E.call(e, l, x, v);
    });
  }
  const Dn = function(l) {
    let x = null;
    if (ve(ae.beforeSanitizeElements, l, null), bt(l))
      return F(l), !0;
    const E = d(l.nodeName);
    if (ve(ae.uponSanitizeElement, l, {
      tagName: E,
      allowedTags: ne
    }), Et && l.hasChildNodes() && !Pn(l.firstElementChild) && he(/<[/\w!]/g, l.innerHTML) && he(/<[/\w!]/g, l.textContent) || l.nodeType === mn.progressingInstruction || Et && l.nodeType === mn.comment && he(/<[/\w]/g, l.data))
      return F(l), !0;
    if (!ne[E] || pt[E]) {
      if (!pt[E] && Bn(E) && (J.tagNameCheck instanceof RegExp && he(J.tagNameCheck, E) || J.tagNameCheck instanceof Function && J.tagNameCheck(E)))
        return !1;
      if (At && !xe[E]) {
        const q = Ce(l) || l.parentNode, re = be(l) || l.childNodes;
        if (re && q) {
          const ee = re.length;
          for (let ce = ee - 1; ce >= 0; --ce) {
            const Me = H(re[ce], !0);
            Me.__removalCount = (l.__removalCount || 0) + 1, q.insertBefore(Me, Ae(l));
          }
        }
      }
      return F(l), !0;
    }
    return l instanceof h && !O(l) || (E === "noscript" || E === "noembed" || E === "noframes") && he(/<\/no(script|embed|frames)/i, l.innerHTML) ? (F(l), !0) : (tt && l.nodeType === mn.text && (x = l.textContent, Wn([Vt, jt, je], (q) => {
      x = pn(x, q, " ");
    }), l.textContent !== x && (dn(e.removed, {
      element: l.cloneNode()
    }), l.textContent = x)), ve(ae.afterSanitizeElements, l, null), !1);
  }, Nn = function(l, x, E) {
    if (Xt && (x === "id" || x === "name") && (E in t || E in L))
      return !1;
    if (!(Rn && !Gt[x] && he(ai, x))) {
      if (!(Cn && he(li, x))) {
        if (!se[x] || Gt[x]) {
          if (
            // First condition does a very basic check if a) it's basically a valid custom element tagname AND
            // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
            !(Bn(l) && (J.tagNameCheck instanceof RegExp && he(J.tagNameCheck, l) || J.tagNameCheck instanceof Function && J.tagNameCheck(l)) && (J.attributeNameCheck instanceof RegExp && he(J.attributeNameCheck, x) || J.attributeNameCheck instanceof Function && J.attributeNameCheck(x)) || // Alternative, second condition checks if it's an `is`-attribute, AND
            // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            x === "is" && J.allowCustomizedBuiltInElements && (J.tagNameCheck instanceof RegExp && he(J.tagNameCheck, E) || J.tagNameCheck instanceof Function && J.tagNameCheck(E)))
          ) return !1;
        } else if (!Zt[x]) {
          if (!he(Sn, pn(E, dt, ""))) {
            if (!((x === "src" || x === "xlink:href" || x === "href") && l !== "script" && Ho(E, "data:") === 0 && Yt[l])) {
              if (!(ft && !he(ci, pn(E, dt, "")))) {
                if (E)
                  return !1;
              }
            }
          }
        }
      }
    }
    return !0;
  }, Bn = function(l) {
    return l !== "annotation-xml" && Os(l, ui);
  }, en = function(l) {
    ve(ae.beforeSanitizeAttributes, l, null);
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
        namespaceURI: ce,
        value: Me
      } = re, Ne = d(ee), tn = Me;
      let w = ee === "value" ? tn : $o(tn);
      if (E.attrName = Ne, E.attrValue = w, E.keepAttr = !0, E.forceKeepAttr = void 0, ve(ae.uponSanitizeAttribute, l, E), w = E.attrValue, On && (Ne === "id" || Ne === "name") && (W(ee, l), w = hi + w), Et && he(/((--!?|])>)|<\/(style|title)/i, w)) {
        W(ee, l);
        continue;
      }
      if (E.forceKeepAttr)
        continue;
      if (!E.keepAttr) {
        W(ee, l);
        continue;
      }
      if (!Mn && he(/\/>/i, w)) {
        W(ee, l);
        continue;
      }
      tt && Wn([Vt, jt, je], (B) => {
        w = pn(w, B, " ");
      });
      const R = d(l.nodeName);
      if (!Nn(R, Ne, w)) {
        W(ee, l);
        continue;
      }
      if (te && typeof z == "object" && typeof z.getAttributeType == "function" && !ce)
        switch (z.getAttributeType(R, Ne)) {
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
          ce ? l.setAttributeNS(ce, ee, w) : l.setAttribute(ee, w), bt(l) ? F(l) : Ms(e.removed);
        } catch {
          W(ee, l);
        }
    }
    ve(ae.afterSanitizeAttributes, l, null);
  }, Ot = function C(l) {
    let x = null;
    const E = Mt(l);
    for (ve(ae.beforeSanitizeShadowDOM, l, null); x = E.nextNode(); )
      ve(ae.uponSanitizeShadowNode, x, null), Dn(x), en(x), x.content instanceof r && C(x.content);
    ve(ae.afterSanitizeShadowDOM, l, null);
  };
  return e.sanitize = function(C) {
    let l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, x = null, E = null, q = null, re = null;
    if (Kt = !C, Kt && (C = "<!-->"), typeof C != "string" && !Pn(C))
      if (typeof C.toString == "function") {
        if (C = C.toString(), typeof C != "string")
          throw fn("dirty is not a string, aborting");
      } else
        throw fn("toString is not a function");
    if (!e.isSupported)
      return C;
    if (Wt || K(l), e.removed = [], typeof C == "string" && (_e = !1), _e) {
      if (C.nodeName) {
        const Me = d(C.nodeName);
        if (!ne[Me] || pt[Me])
          throw fn("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (C instanceof a)
      x = ot("<!---->"), E = x.ownerDocument.importNode(C, !0), E.nodeType === mn.element && E.nodeName === "BODY" || E.nodeName === "HTML" ? x = E : x.appendChild(E);
    else {
      if (!nt && !tt && !Ge && // eslint-disable-next-line unicorn/prefer-includes
      C.indexOf("<") === -1)
        return te && Tt ? te.createHTML(C) : C;
      if (x = ot(C), !x)
        return nt ? null : Tt ? Re : "";
    }
    x && qt && F(x.firstChild);
    const ee = Mt(_e ? C : x);
    for (; q = ee.nextNode(); )
      Dn(q), en(q), q.content instanceof r && Ot(q.content);
    if (_e)
      return C;
    if (nt) {
      if (St)
        for (re = Ft.call(x.ownerDocument); x.firstChild; )
          re.appendChild(x.firstChild);
      else
        re = x;
      return (se.shadowroot || se.shadowrootmode) && (re = En.call(i, re, !0)), re;
    }
    let ce = Ge ? x.outerHTML : x.innerHTML;
    return Ge && ne["!doctype"] && x.ownerDocument && x.ownerDocument.doctype && x.ownerDocument.doctype.name && he(rr, x.ownerDocument.doctype.name) && (ce = "<!DOCTYPE " + x.ownerDocument.doctype.name + `>
` + ce), tt && Wn([Vt, jt, je], (Me) => {
      ce = pn(ce, Me, " ");
    }), te && Tt ? te.createHTML(ce) : ce;
  }, e.setConfig = function() {
    let C = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    K(C), Wt = !0;
  }, e.clearConfig = function() {
    v = null, Wt = !1;
  }, e.isValidAttribute = function(C, l, x) {
    v || K({});
    const E = d(C), q = d(l);
    return Nn(E, q, x);
  }, e.addHook = function(C, l) {
    typeof l == "function" && dn(ae[C], l);
  }, e.removeHook = function(C, l) {
    if (l !== void 0) {
      const x = Uo(ae[C], l);
      return x === -1 ? void 0 : zo(ae[C], x, 1)[0];
    }
    return Ms(ae[C]);
  }, e.removeHooks = function(C) {
    ae[C] = [];
  }, e.removeAllHooks = function() {
    ae = Bs();
  }, e;
}
var Us = or();
class na extends vn {
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
    t.innerHTML = Us.sanitize(r);
  }) : t.innerHTML = Us.sanitize(s), t;
}
class ia extends vn {
  constructor(e, t) {
    if (super(e, t), this.pageIndex = 0, this.onPressDone = null, e.card_parameters.pages.length === 0)
      throw new Error("No markdown pages provided to MarkdownPagesViewer");
    const i = document.createElement("div");
    i.classList.add("markdown-pages-viewer"), this.root.appendChild(i), this.viewerDiv = document.createElement("div"), this.viewerDiv.classList.add("markdown-pages-viewer__window"), i.appendChild(this.viewerDiv), this.contentPages = [];
    for (const r of e.card_parameters.pages) {
      const c = ar(
        r,
        (a) => this.boardView.getCoordinateSystem().getSizePx(a) + "px"
      );
      this.contentPages.push(c);
    }
    let s = document.createElement("div");
    s.classList.add("nav-tray"), i.appendChild(s), this.navButtons = new sa(), this.navButtons.mount(s), this.doneButton = new Vi("Done"), this.doneButton.mount(s), this.goToPage(0), this.navButtons.addButtonPressListeners(
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
class sa extends ke {
  constructor() {
    super(), this.root = document.createElement("div"), this.lastButton = new Vi("←"), this.lastButton.mount(this.root), this.nextButton = new Vi("→"), this.nextButton.mount(this.root);
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
class Vi extends ke {
  constructor(e) {
    super();
    const t = document.createElement("button");
    t.className = "nav-tray__button", t.textContent = e, this.root = t;
  }
  addButtonPressListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class ra extends vn {
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
class oa extends vn {
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
class aa {
  // Height of the board in pixels
  constructor(e, t) {
    this.boardWidthPx = e, this.boardHeightPx = t;
  }
  getUnitPx() {
    return Math.min(this.boardWidthPx, this.boardHeightPx);
  }
  getBoardLocationPx(e, t) {
    const i = this.getUnitPx(), s = this.boardWidthPx / i, r = this.boardHeightPx / i, c = i * (e.x - t.width / 2 + s / 2), a = i * (-e.y - t.height / 2 + r / 2);
    return {
      leftPx: c,
      topPx: a
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
class la {
  // Map of sensor ID to SensorBinding
  constructor(e, t, i) {
    this.cardViews = /* @__PURE__ */ new Map(), this.sensorBindings = /* @__PURE__ */ new Map(), this.root = document.createElement("div"), this.root.className = "board-view", this.root.id = `${e}`, this.root.style.width = t.board_width_px + "px", this.root.style.height = t.board_height_px + "px", this.assetManager = i, this.reset(), this.setState(!1, !1);
  }
  getCoordinateSystem() {
    const { width: e, height: t } = this.root.getBoundingClientRect();
    return new aa(e, t);
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
    const t = await ua(
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
    const i = ca(e, t, this);
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
function ca(n, e, t) {
  const i = n.card_id;
  if (!i) {
    if (n.sensor_type === "TimeoutSensor")
      return new qr(
        n.sensor_id,
        e,
        n.sensor_parameters.timeout_msec
      );
    if (n.sensor_type === "KeyPressSensor") {
      if (n.sensor_timespan.end_time_msec !== null)
        throw new Error(`${n.sensor_type} must not have a defined end_time_msec`);
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
async function ua(n, e) {
  let t = null;
  switch (n.card_type) {
    case "FixationPointCard":
      t = new Kr(
        n,
        e
      );
      break;
    case "MarkdownPagesCard":
      t = new ia(
        n,
        e
      );
      break;
    case "ImageCard":
      t = new ra(
        n,
        e
      );
      break;
    case "VideoCard":
      t = new oa(
        n,
        e
      );
      break;
    case "TextCard":
      t = new na(
        n,
        e
      );
      break;
    default:
      throw new Error(`Unsupported Card type: ${n}`);
  }
  return await t.load(), t;
}
class ha {
  constructor(e) {
    this.boardViews = /* @__PURE__ */ new Map(), this.activeBoardId = null, this.root = document.createElement("div"), this.root.className = "board-views-ui", this.assetManager = e;
  }
  createBoardView(e, t) {
    if (this.boardViews.has(e))
      return this.getBoardView(e);
    const i = new la(e, t, this.assetManager);
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
class da {
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
function pa() {
  const n = document.createElement("div");
  document.body.appendChild(n);
  const e = document.createElement("div");
  e.classList.add("node-engine-container"), n.appendChild(e);
  const t = document.createElement("div");
  t.classList.add("node-engine-content"), e.appendChild(t);
  const i = new da(), s = new ha(
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
function fa(n, e) {
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
class zs {
  constructor() {
    this.events = [], this.nextToken = 1, this.running = !1, this.rafId = null, this.t0 = 0, this.loop = () => {
      if (!this.running) return;
      const e = performance.now();
      for (; this.events.length && this.events[0].due <= e; ) {
        const t = this.events.shift();
        t.cancelled || t.cb();
      }
      this.events.length ? this.rafId = requestAnimationFrame(this.loop) : this.stop();
    };
  }
  // time at start()
  /* --- EventScheduler API --- */
  start() {
    this.running || (this.running = !0, this.t0 = performance.now(), this.loop());
  }
  stop() {
    this.running && (this.running = !1, this.rafId !== null && (cancelAnimationFrame(this.rafId), this.rafId = null));
  }
  scheduleEvent(e) {
    this.running || this.start();
    const t = this.nextToken++, i = {
      due: this.t0 + e.offsetMsec,
      cb: e.triggerEventFunc,
      token: t,
      cancelled: !1
    };
    this.insertEvent(i);
    const s = e.signal;
    if (s) {
      const r = () => {
        this.cancel(t), s.removeEventListener("abort", r);
      };
      s.addEventListener("abort", r, { once: !0 });
    }
    return t;
  }
  cancel(e) {
    const t = this.events.findIndex((i) => i.token === e);
    t !== -1 && (this.events[t].cancelled = !0);
  }
  clearAll() {
    this.events = [];
  }
  /* --- Helpers --- */
  /** Maintain events sorted by `due` (O(N) insert; sufficient for small queues). */
  insertEvent(e) {
    const t = this.events.findIndex((i) => i.due > e.due);
    t === -1 ? this.events.push(e) : this.events.splice(t, 0, e);
  }
}
class ga {
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
function Hs(n) {
  if (isNaN(n.getTime()))
    throw new Error(`Invalid Date object: ${n}`);
  return n.toISOString();
}
class ma {
  constructor(e, t) {
    this.startTime = 0, this.prepared = !1, this.terminated = !1, this.abortController = new AbortController(), this.boardView = t, this.nodeParameters = e, this.mainScheduler = new zs();
  }
  async prepare() {
    this.boardView.reset();
    let e = [];
    for (const t of this.nodeParameters.cards)
      e.push(this.boardView.placeCardHidden(t));
    await Promise.all(e);
    for (const t of this.nodeParameters.cards)
      this.mainScheduler.scheduleEvent(
        {
          offsetMsec: t.card_timespan.start_time_msec,
          triggerEventFunc: () => {
            this.boardView.showCard(t.card_id);
          }
        }
      ), t.card_timespan.end_time_msec !== null && this.mainScheduler.scheduleEvent(
        {
          offsetMsec: t.card_timespan.end_time_msec,
          triggerEventFunc: () => {
            this.boardView.hideCard(t.card_id);
          },
          signal: this.abortController.signal
        }
      );
    for (const t of this.nodeParameters.sensors)
      this.boardView.placeSensorUnarmed(
        t,
        (i) => this.reportSensorFired(i)
      ), this.mainScheduler.scheduleEvent(
        {
          offsetMsec: t.sensor_timespan.start_time_msec,
          triggerEventFunc: () => {
            this.boardView.armSensor(t.sensor_id);
          },
          signal: this.abortController.signal
        }
      ), t.sensor_timespan.end_time_msec !== null && this.mainScheduler.scheduleEvent(
        {
          offsetMsec: t.sensor_timespan.end_time_msec,
          triggerEventFunc: () => {
            this.boardView.disarmSensor(t.sensor_id);
          },
          signal: this.abortController.signal
        }
      );
    for (const t of this.nodeParameters.effects) {
      const i = new ga(this.boardView);
      this.mainScheduler.scheduleEvent(
        {
          offsetMsec: t.effect_timespan.start_time_msec,
          triggerEventFunc: () => {
            i.start();
          },
          signal: this.abortController.signal
        }
      ), t.effect_timespan.end_time_msec !== null && this.mainScheduler.scheduleEvent(
        {
          offsetMsec: t.effect_timespan.end_time_msec,
          triggerEventFunc: () => {
            i.stop();
          },
          signal: this.abortController.signal
        }
      );
    }
    this.prepared = !0;
  }
  async run() {
    if (this.prepared || await this.prepare(), this.startTime > 0)
      throw new Error("NodePlay already started");
    this.startTime = Math.max(0, performance.now()), this.boardView.setState(!0, !0);
    const e = new Promise(
      (a, h) => this.resolvePlay = a
    ), t = /* @__PURE__ */ new Date();
    this.mainScheduler.start();
    const i = await e, s = /* @__PURE__ */ new Date(), [r, c] = i;
    return this.boardView.reset(), {
      action: r,
      runtime_metrics: this.getRuntimeMetrics(),
      timestamp_node_started: Hs(t),
      timestamp_node_completed: Hs(s)
    };
  }
  reportSensorFired(e) {
    if (this.terminated) return;
    this.terminated = !0, this.abortController.abort(), this.boardView.reset();
    const t = this.getReinforcer(e), i = new zs();
    let s = 0, r = [];
    for (const c of t.reinforcer_cards)
      r.push(this.boardView.placeCardHidden(c));
    Promise.all(r).then(
      () => {
        for (const c of t.reinforcer_cards)
          if (i.scheduleEvent(
            {
              offsetMsec: c.card_timespan.start_time_msec,
              triggerEventFunc: () => {
                this.boardView.showCard(c.card_id);
              }
            }
          ), c.card_timespan.end_time_msec !== null)
            i.scheduleEvent(
              {
                offsetMsec: c.card_timespan.end_time_msec,
                triggerEventFunc: () => {
                  this.boardView.hideCard(c.card_id);
                }
              }
            ), c.card_timespan.end_time_msec > s && (s = c.card_timespan.end_time_msec);
          else
            throw new Error(`ReinforcerCard must have an end time: ${c.card_id} `);
        i.scheduleEvent(
          {
            offsetMsec: s,
            triggerEventFunc: () => {
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
    for (const i of this.nodeParameters.reinforcer_maps)
      if (i.sensor_id === t)
        return fa(i);
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
class wa {
  constructor() {
    this.nodePlays = /* @__PURE__ */ new Map();
    const { shellUI: e, boardViewsUI: t } = pa();
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
      const t = crypto.randomUUID(), i = this.boardViewsUI.createBoardView(t, e.board), s = new ma(
        e,
        i
      );
      return await s.prepare(), this.nodePlays.set(t, s), t;
    } catch (t) {
      throw this.showErrorMessageOverlay(t), new Error("NodePlayer preparation failed: " + t.message);
    }
  }
  async play(e) {
    try {
      const t = this.nodePlays.get(e);
      if (!t)
        throw new Error(`NodePlay ${e} does not exist. `);
      this.boardViewsUI.setActiveBoard(e);
      const i = await t.run();
      return this.boardViewsUI.destroyBoardView(e), this.nodePlays.delete(e), i;
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
function ba(n, e) {
  let t = 0;
  for (let i = 0; i < n.length; i++) {
    const s = n[i];
    if (s.event_type !== "NodeResultEvent")
      continue;
    const c = s.event_payload.action;
    for (let a = 0; a < e.length; a++) {
      const h = e[a];
      if (h.bonus_rule_type === "ConstantBonusRule") {
        const u = h.bonus_rule_parameters;
        u.sensor_id === c.sensor_id && (t += Number(u.bonus_amount_usd));
      }
    }
  }
  return t = Math.max(0, t), t = Math.round(t * 100) / 100, t;
}
function Pt() {
  return crypto.randomUUID();
}
function Dt() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
async function xa(n, e = null, t = []) {
  let i = t;
  e || (e = (A) => {
  });
  function s() {
    if (document.visibilityState === "hidden") {
      const A = {
        event_id: Pt(),
        event_timestamp: Dt(),
        event_type: "LeaveEvent",
        event_payload: {}
      };
      i.push(A), e(A);
    } else if (document.visibilityState === "visible") {
      const A = {
        event_id: Pt(),
        event_timestamp: Dt(),
        event_type: "ReturnEvent",
        event_payload: {}
      };
      i.push(A), e(A);
    }
  }
  document.addEventListener("visibilitychange", s);
  const r = {
    event_id: Pt(),
    event_timestamp: Dt(),
    event_type: "StartEvent",
    event_payload: {}
  };
  i.push(r), e(r);
  const c = n.nodes;
  let a = new wa();
  for (let A = 0; A < c.length; A++) {
    const y = c[A], z = await a.prepare(y.node_parameters);
    let I = await a.play(z);
    a.setProgressBar((A + 1) / c.length * 100);
    const H = {
      event_id: Pt(),
      event_timestamp: Dt(),
      event_type: "NodeResultEvent",
      event_payload: {
        node_id: y.node_id,
        timestamp_start: I.timestamp_node_started,
        timestamp_end: I.timestamp_node_completed,
        node_execution_index: A,
        action: I.action,
        runtime_metrics: I.runtime_metrics
      }
    };
    i.push(H), e(H);
  }
  const h = ba(
    i,
    n.bonus_rules
  );
  let u = "";
  if (h > 0 && (u = `Bonus: ${h} USD (pending validation)`), await a.playEndScreen(
    u
  ), u !== "") {
    const A = {
      event_id: Pt(),
      event_timestamp: Dt(),
      event_type: "BonusDisclosureEvent",
      event_payload: {
        bonus_amount_usd: h.toFixed(2)
      }
    };
    i.push(A), e(A);
  }
  const f = {
    event_id: Pt(),
    event_timestamp: Dt(),
    event_type: "EndEvent",
    event_payload: {}
  };
  return i.push(f), e(f), document.removeEventListener("visibilitychange", s), a.showConsoleMessageOverlay(
    "Events",
    i
  ), i;
}
export {
  xa as play
};
