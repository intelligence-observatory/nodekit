class va {
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
function ya(r) {
  return {
    event_type: "BrowserContextSampledEvent",
    t: r.now(),
    user_agent: navigator.userAgent,
    timestamp_client: (/* @__PURE__ */ new Date()).toISOString(),
    device_pixel_ratio: window.devicePixelRatio,
    display: {
      width_px: screen.width,
      height_px: screen.height
    },
    viewport: {
      width_px: window.innerWidth,
      height_px: window.innerHeight
    }
  };
}
var ka = "2.0.4", Mi = 500, bs = "user-agent", Qt = "", Es = "?", ar = "function", At = "undefined", Jt = "object", Di = "string", Ne = "browser", dt = "cpu", st = "device", Ye = "engine", He = "os", Kt = "result", k = "name", m = "type", v = "vendor", S = "version", Pe = "architecture", In = "major", b = "model", Cn = "console", Y = "mobile", de = "tablet", ke = "smarttv", nt = "wearable", Yn = "xr", Ln = "embedded", gn = "inapp", Gi = "brands", Dt = "formFactors", Wi = "fullVersionList", Zt = "platform", Xi = "platformVersion", fr = "bitness", Ct = "sec-ch-ua", Sa = Ct + "-full-version-list", _a = Ct + "-arch", xa = Ct + "-" + fr, Ta = Ct + "-form-factors", Ra = Ct + "-" + Y, Aa = Ct + "-" + b, Vo = Ct + "-" + Zt, Ca = Vo + "-version", Fo = [Gi, Wi, Y, b, Zt, Xi, Pe, Dt, fr], Kn = "Amazon", Xt = "Apple", vs = "ASUS", ys = "BlackBerry", Mt = "Google", ks = "Huawei", Ar = "Lenovo", Ss = "Honor", Zn = "LG", Cr = "Microsoft", Lr = "Motorola", Or = "Nvidia", _s = "OnePlus", Ir = "OPPO", mn = "Samsung", xs = "Sharp", wn = "Sony", Nr = "Xiaomi", Pr = "Zebra", Ts = "Chrome", Rs = "Chromium", Tt = "Chromecast", ir = "Edge", bn = "Firefox", En = "Opera", $r = "Facebook", As = "Sogou", Yt = "Mobile ", vn = " Browser", Bi = "Windows", La = typeof window !== At, $e = La && window.navigator ? window.navigator : void 0, Rt = $e && $e.userAgentData ? $e.userAgentData : void 0, Oa = function(r, e) {
  var t = {}, n = e;
  if (!lr(e)) {
    n = {};
    for (var i in e)
      for (var o in e[i])
        n[o] = e[i][o].concat(n[o] ? n[o] : []);
  }
  for (var s in r)
    t[s] = n[s] && n[s].length % 2 === 0 ? n[s].concat(r[s]) : r[s];
  return t;
}, pr = function(r) {
  for (var e = {}, t = 0; t < r.length; t++)
    e[r[t].toUpperCase()] = r[t];
  return e;
}, Ui = function(r, e) {
  if (typeof r === Jt && r.length > 0) {
    for (var t in r)
      if (ft(e) == ft(r[t])) return !0;
    return !1;
  }
  return tn(r) ? ft(e) == ft(r) : !1;
}, lr = function(r, e) {
  for (var t in r)
    return /^(browser|cpu|device|engine|os)$/.test(t) || (e ? lr(r[t]) : !1);
}, tn = function(r) {
  return typeof r === Di;
}, Mr = function(r) {
  if (r) {
    for (var e = [], t = en(/\\?\"/g, r).split(","), n = 0; n < t.length; n++)
      if (t[n].indexOf(";") > -1) {
        var i = cr(t[n]).split(";v=");
        e[n] = { brand: i[0], version: i[1] };
      } else
        e[n] = cr(t[n]);
    return e;
  }
}, ft = function(r) {
  return tn(r) ? r.toLowerCase() : r;
}, Dr = function(r) {
  return tn(r) ? en(/[^\d\.]/g, r).split(".")[0] : void 0;
}, pt = function(r) {
  for (var e in r) {
    var t = r[e];
    typeof t == Jt && t.length == 2 ? this[t[0]] = t[1] : this[t] = void 0;
  }
  return this;
}, en = function(r, e) {
  return tn(e) ? e.replace(r, Qt) : e;
}, yn = function(r) {
  return en(/\\?\"/g, r);
}, cr = function(r, e) {
  if (tn(r))
    return r = en(/^\s\s*/, r), typeof e === At ? r : r.substring(0, Mi);
}, Br = function(r, e) {
  if (!(!r || !e))
    for (var t = 0, n, i, o, s, a, l; t < e.length && !a; ) {
      var c = e[t], u = e[t + 1];
      for (n = i = 0; n < c.length && !a && c[n]; )
        if (a = c[n++].exec(r), a)
          for (o = 0; o < u.length; o++)
            l = a[++i], s = u[o], typeof s === Jt && s.length > 0 ? s.length === 2 ? typeof s[1] == ar ? this[s[0]] = s[1].call(this, l) : this[s[0]] = s[1] : s.length >= 3 && (typeof s[1] === ar && !(s[1].exec && s[1].test) ? s.length > 3 ? this[s[0]] = l ? s[1].apply(this, s.slice(2)) : void 0 : this[s[0]] = l ? s[1].call(this, l, s[2]) : void 0 : s.length == 3 ? this[s[0]] = l ? l.replace(s[1], s[2]) : void 0 : s.length == 4 ? this[s[0]] = l ? s[3].call(this, l.replace(s[1], s[2])) : void 0 : s.length > 4 && (this[s[0]] = l ? s[3].apply(this, [l.replace(s[1], s[2])].concat(s.slice(4))) : void 0)) : this[s] = l || void 0;
      t += 2;
    }
}, it = function(r, e) {
  for (var t in e)
    if (typeof e[t] === Jt && e[t].length > 0) {
      for (var n = 0; n < e[t].length; n++)
        if (Ui(e[t][n], r))
          return t === Es ? void 0 : t;
    } else if (Ui(e[t], r))
      return t === Es ? void 0 : t;
  return e.hasOwnProperty("*") ? e["*"] : r;
}, Cs = {
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
}, Ls = {
  embedded: "Automotive",
  mobile: "Mobile",
  tablet: ["Tablet", "EInk"],
  smarttv: "TV",
  wearable: "Watch",
  xr: ["VR", "XR"],
  "?": ["Desktop", "Unknown"],
  "*": void 0
}, Ia = {
  Chrome: "Google Chrome",
  Edge: "Microsoft Edge",
  "Edge WebView2": "Microsoft Edge WebView2",
  "Chrome WebView": "Android WebView",
  "Chrome Headless": "HeadlessChrome",
  "Huawei Browser": "HuaweiBrowser",
  "MIUI Browser": "Miui Browser",
  "Opera Mobi": "OperaMobile",
  Yandex: "YaBrowser"
}, Os = {
  browser: [
    [
      // Most common regardless engine
      /\b(?:crmo|crios)\/([\w\.]+)/i
      // Chrome for Android/iOS
    ],
    [S, [k, Yt + "Chrome"]],
    [
      /webview.+edge\/([\w\.]+)/i
      // Microsoft Edge
    ],
    [S, [k, ir + " WebView"]],
    [
      /edg(?:e|ios|a)?\/([\w\.]+)/i
    ],
    [S, [k, "Edge"]],
    [
      // Presto based
      /(opera mini)\/([-\w\.]+)/i,
      // Opera Mini
      /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
      // Opera Mobi/Tablet
      /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i
      // Opera
    ],
    [k, S],
    [
      /opios[\/ ]+([\w\.]+)/i
      // Opera mini on iphone >= 8.0
    ],
    [S, [k, En + " Mini"]],
    [
      /\bop(?:rg)?x\/([\w\.]+)/i
      // Opera GX
    ],
    [S, [k, En + " GX"]],
    [
      /\bopr\/([\w\.]+)/i
      // Opera Webkit
    ],
    [S, [k, En]],
    [
      // Mixed
      /\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i
      // Baidu
    ],
    [S, [k, "Baidu"]],
    [
      /\b(?:mxbrowser|mxios|myie2)\/?([-\w\.]*)\b/i
      // Maxthon
    ],
    [S, [k, "Maxthon"]],
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
    [k, S],
    [
      /quark(?:pc)?\/([-\w\.]+)/i
      // Quark
    ],
    [S, [k, "Quark"]],
    [
      /\bddg\/([\w\.]+)/i
      // DuckDuckGo
    ],
    [S, [k, "DuckDuckGo"]],
    [
      /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i
      // UCBrowser
    ],
    [S, [k, "UCBrowser"]],
    [
      /microm.+\bqbcore\/([\w\.]+)/i,
      // WeChat Desktop for Windows Built-in Browser
      /\bqbcore\/([\w\.]+).+microm/i,
      /micromessenger\/([\w\.]+)/i
      // WeChat
    ],
    [S, [k, "WeChat"]],
    [
      /konqueror\/([\w\.]+)/i
      // Konqueror
    ],
    [S, [k, "Konqueror"]],
    [
      /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i
      // IE11
    ],
    [S, [k, "IE"]],
    [
      /ya(?:search)?browser\/([\w\.]+)/i
      // Yandex
    ],
    [S, [k, "Yandex"]],
    [
      /slbrowser\/([\w\.]+)/i
      // Smart Lenovo Browser
    ],
    [S, [k, "Smart " + Ar + vn]],
    [
      /(avast|avg)\/([\w\.]+)/i
      // Avast/AVG Secure Browser
    ],
    [[k, /(.+)/, "$1 Secure" + vn], S],
    [
      /\bfocus\/([\w\.]+)/i
      // Firefox Focus
    ],
    [S, [k, bn + " Focus"]],
    [
      /\bopt\/([\w\.]+)/i
      // Opera Touch
    ],
    [S, [k, En + " Touch"]],
    [
      /coc_coc\w+\/([\w\.]+)/i
      // Coc Coc Browser
    ],
    [S, [k, "Coc Coc"]],
    [
      /dolfin\/([\w\.]+)/i
      // Dolphin
    ],
    [S, [k, "Dolphin"]],
    [
      /coast\/([\w\.]+)/i
      // Opera Coast
    ],
    [S, [k, En + " Coast"]],
    [
      /miuibrowser\/([\w\.]+)/i
      // MIUI Browser
    ],
    [S, [k, "MIUI" + vn]],
    [
      /fxios\/([\w\.-]+)/i
      // Firefox for iOS
    ],
    [S, [k, Yt + bn]],
    [
      /\bqihoobrowser\/?([\w\.]*)/i
      // 360
    ],
    [S, [k, "360"]],
    [
      /\b(qq)\/([\w\.]+)/i
      // QQ
    ],
    [[k, /(.+)/, "$1Browser"], S],
    [
      /(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i
    ],
    [[k, /(.+)/, "$1" + vn], S],
    [
      // Oculus/Sailfish/HuaweiBrowser/VivoBrowser/PicoBrowser
      /samsungbrowser\/([\w\.]+)/i
      // Samsung Internet
    ],
    [S, [k, mn + " Internet"]],
    [
      /metasr[\/ ]?([\d\.]+)/i
      // Sogou Explorer
    ],
    [S, [k, As + " Explorer"]],
    [
      /(sogou)mo\w+\/([\d\.]+)/i
      // Sogou Mobile
    ],
    [[k, As + " Mobile"], S],
    [
      /(electron)\/([\w\.]+) safari/i,
      // Electron-based App
      /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
      // Tesla
      /m?(qqbrowser|2345(?=browser|chrome|explorer))\w*[\/ ]?v?([\w\.]+)/i
      // QQ/2345
    ],
    [k, S],
    [
      /(lbbrowser|rekonq)/i
      // LieBao Browser/Rekonq
    ],
    [k],
    [
      /ome\/([\w\.]+) \w* ?(iron) saf/i,
      // Iron
      /ome\/([\w\.]+).+qihu (360)[es]e/i
      // 360
    ],
    [S, k],
    [
      // WebView
      /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i
      // Facebook App for iOS & Android
    ],
    [[k, $r], S, [m, gn]],
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
    [k, S, [m, gn]],
    [
      /\bgsa\/([\w\.]+) .*safari\//i
      // Google Search Appliance on iOS
    ],
    [S, [k, "GSA"], [m, gn]],
    [
      /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i
      // TikTok
    ],
    [S, [k, "TikTok"], [m, gn]],
    [
      /\[(linkedin)app\]/i
      // LinkedIn App for iOS & Android
    ],
    [k, [m, gn]],
    [
      /(chromium)[\/ ]([-\w\.]+)/i
      // Chromium
    ],
    [k, S],
    [
      /headlesschrome(?:\/([\w\.]+)| )/i
      // Chrome Headless
    ],
    [S, [k, Ts + " Headless"]],
    [
      /wv\).+chrome\/([\w\.]+).+edgw\//i
      // Edge WebView2
    ],
    [S, [k, ir + " WebView2"]],
    [
      / wv\).+(chrome)\/([\w\.]+)/i
      // Chrome WebView
    ],
    [[k, Ts + " WebView"], S],
    [
      /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
      // Android Browser
    ],
    [S, [k, "Android" + vn]],
    [
      /chrome\/([\w\.]+) mobile/i
      // Chrome Mobile
    ],
    [S, [k, Yt + "Chrome"]],
    [
      /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
      // Chrome/OmniWeb/Arora/Tizen/Nokia
    ],
    [k, S],
    [
      /version\/([\w\.\,]+) .*mobile(?:\/\w+ | ?)safari/i
      // Safari Mobile
    ],
    [S, [k, Yt + "Safari"]],
    [
      /iphone .*mobile(?:\/\w+ | ?)safari/i
    ],
    [[k, Yt + "Safari"]],
    [
      /version\/([\w\.\,]+) .*(safari)/i
      // Safari
    ],
    [S, k],
    [
      /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i
      // Safari < 3.0
    ],
    [k, [S, "1"]],
    [
      /(webkit|khtml)\/([\w\.]+)/i
    ],
    [k, S],
    [
      // Gecko based
      /(?:mobile|tablet);.*(firefox)\/([\w\.-]+)/i
      // Firefox Mobile
    ],
    [[k, Yt + bn], S],
    [
      /(navigator|netscape\d?)\/([-\w\.]+)/i
      // Netscape
    ],
    [[k, "Netscape"], S],
    [
      /(wolvic|librewolf)\/([\w\.]+)/i
      // Wolvic/LibreWolf
    ],
    [k, S],
    [
      /mobile vr; rv:([\w\.]+)\).+firefox/i
      // Firefox Reality
    ],
    [S, [k, bn + " Reality"]],
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
    [k, [S, /_/g, "."]],
    [
      /(cobalt)\/([\w\.]+)/i
      // Cobalt
    ],
    [k, [S, /[^\d\.]+./, Qt]]
  ],
  cpu: [
    [
      /\b((amd|x|x86[-_]?|wow|win)64)\b/i
      // AMD64 (x64)
    ],
    [[Pe, "amd64"]],
    [
      /(ia32(?=;))/i,
      // IA32 (quicktime)
      /\b((i[346]|x)86)(pc)?\b/i
      // IA32 (x86)
    ],
    [[Pe, "ia32"]],
    [
      /\b(aarch64|arm(v?[89]e?l?|_?64))\b/i
      // ARM64
    ],
    [[Pe, "arm64"]],
    [
      /\b(arm(v[67])?ht?n?[fl]p?)\b/i
      // ARMHF
    ],
    [[Pe, "armhf"]],
    [
      // PocketPC mistakenly identified as PowerPC
      /( (ce|mobile); ppc;|\/[\w\.]+arm\b)/i
    ],
    [[Pe, "arm"]],
    [
      /((ppc|powerpc)(64)?)( mac|;|\))/i
      // PowerPC
    ],
    [[Pe, /ower/, Qt, ft]],
    [
      / sun4\w[;\)]/i
      // SPARC
    ],
    [[Pe, "sparc"]],
    [
      /\b(avr32|ia64(?=;)|68k(?=\))|\barm(?=v([1-7]|[5-7]1)l?|;|eabi)|(irix|mips|sparc)(64)?\b|pa-risc)/i
      // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
    ],
    [[Pe, ft]]
  ],
  device: [
    [
      //////////////////////////
      // MOBILES & TABLETS
      /////////////////////////
      // Samsung
      /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
    ],
    [b, [v, mn], [m, de]],
    [
      /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
      /samsung[- ]((?!sm-[lr]|browser)[-\w]+)/i,
      /sec-(sgh\w+)/i
    ],
    [b, [v, mn], [m, Y]],
    [
      // Apple
      /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i
      // iPod/iPhone
    ],
    [b, [v, Xt], [m, Y]],
    [
      /\((ipad);[-\w\),; ]+apple/i,
      // iPad
      /applecoremedia\/[\w\.]+ \((ipad)/i,
      /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
    ],
    [b, [v, Xt], [m, de]],
    [
      /(macintosh);/i
    ],
    [b, [v, Xt]],
    [
      // Sharp
      /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
    ],
    [b, [v, xs], [m, Y]],
    [
      // Honor
      /\b((?:brt|eln|hey2?|gdi|jdn)-a?[lnw]09|(?:ag[rm]3?|jdn2|kob2)-a?[lw]0[09]hn)(?: bui|\)|;)/i
    ],
    [b, [v, Ss], [m, de]],
    [
      /honor([-\w ]+)[;\)]/i
    ],
    [b, [v, Ss], [m, Y]],
    [
      // Huawei
      /\b((?:ag[rs][2356]?k?|bah[234]?|bg[2o]|bt[kv]|cmr|cpn|db[ry]2?|jdn2|got|kob2?k?|mon|pce|scm|sht?|[tw]gr|vrd)-[ad]?[lw][0125][09]b?|605hw|bg2-u03|(?:gem|fdr|m2|ple|t1)-[7a]0[1-4][lu]|t1-a2[13][lw]|mediapad[\w\. ]*(?= bui|\)))\b(?!.+d\/s)/i
    ],
    [b, [v, ks], [m, de]],
    [
      /(?:huawei)([-\w ]+)[;\)]/i,
      /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
    ],
    [b, [v, ks], [m, Y]],
    [
      // Xiaomi
      /oid[^\)]+; (2[\dbc]{4}(182|283|rp\w{2})[cgl]|m2105k81a?c)(?: bui|\))/i,
      /\b((?:red)?mi[-_ ]?pad[\w- ]*)(?: bui|\))/i
      // Mi Pad tablets
    ],
    [[b, /_/g, " "], [v, Nr], [m, de]],
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
    [[b, /_/g, " "], [v, Nr], [m, Y]],
    [
      // OnePlus
      /droid.+; (cph2[3-6]\d[13579]|((gm|hd)19|(ac|be|in|kb)20|(d[en]|eb|le|mt)21|ne22)[0-2]\d|p[g-k]\w[1m]10)\b/i,
      /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
    ],
    [b, [v, _s], [m, Y]],
    [
      // OPPO
      /; (\w+) bui.+ oppo/i,
      /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
    ],
    [b, [v, Ir], [m, Y]],
    [
      /\b(opd2(\d{3}a?))(?: bui|\))/i
    ],
    [b, [v, it, { OnePlus: ["203", "304", "403", "404", "413", "415"], "*": Ir }], [m, de]],
    [
      // BLU
      /(vivo (5r?|6|8l?|go|one|s|x[il]?[2-4]?)[\w\+ ]*)(?: bui|\))/i
      // Vivo series
    ],
    [b, [v, "BLU"], [m, Y]],
    [
      // Vivo
      /; vivo (\w+)(?: bui|\))/i,
      /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
    ],
    [b, [v, "Vivo"], [m, Y]],
    [
      // Realme
      /\b(rmx[1-3]\d{3})(?: bui|;|\))/i
    ],
    [b, [v, "Realme"], [m, Y]],
    [
      // Lenovo
      /(ideatab[-\w ]+|602lv|d-42a|a101lv|a2109a|a3500-hv|s[56]000|pb-6505[my]|tb-?x?\d{3,4}(?:f[cu]|xu|[av])|yt\d?-[jx]?\d+[lfmx])( bui|;|\)|\/)/i,
      /lenovo ?(b[68]0[08]0-?[hf]?|tab(?:[\w- ]+?)|tb[\w-]{6,7})( bui|;|\)|\/)/i
    ],
    [b, [v, Ar], [m, de]],
    [
      /lenovo[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i
    ],
    [b, [v, Ar], [m, Y]],
    [
      // Motorola
      /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
      /\bmot(?:orola)?[- ]([\w\s]+)(\)| bui)/i,
      /((?:moto(?! 360)[-\w\(\) ]+|xt\d{3,4}[cgkosw\+]?[-\d]*|nexus 6)(?= bui|\)))/i
    ],
    [b, [v, Lr], [m, Y]],
    [
      /\b(mz60\d|xoom[2 ]{0,2}) build\//i
    ],
    [b, [v, Lr], [m, de]],
    [
      // LG
      /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
    ],
    [b, [v, Zn], [m, de]],
    [
      /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
      /\blg[-e;\/ ]+(?!.*(?:browser|netcast|android tv|watch|webos))(\w+)/i,
      /\blg-?([\d\w]+) bui/i
    ],
    [b, [v, Zn], [m, Y]],
    [
      // Nokia
      /(nokia) (t[12][01])/i
    ],
    [v, b, [m, de]],
    [
      /(?:maemo|nokia).*(n900|lumia \d+|rm-\d+)/i,
      /nokia[-_ ]?(([-\w\. ]*))/i
    ],
    [[b, /_/g, " "], [m, Y], [v, "Nokia"]],
    [
      // Google
      /(pixel (c|tablet))\b/i
      // Google Pixel C/Tablet
    ],
    [b, [v, Mt], [m, de]],
    [
      // Google Pixel
      /droid.+;(?: google)? (g(01[13]a|020[aem]|025[jn]|1b60|1f8f|2ybb|4s1m|576d|5nz6|8hhn|8vou|a02099|c15s|d1yq|e2ae|ec77|gh2x|kv4x|p4bc|pj41|r83y|tt9q|ur25|wvk6)|pixel[\d ]*a?( pro)?( xl)?( fold)?( \(5g\))?)( bui|\))/i
    ],
    [b, [v, Mt], [m, Y]],
    [
      /(google) (pixelbook( go)?)/i
    ],
    [v, b],
    [
      // Sony
      /droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-\w\w\d\d)(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
    ],
    [b, [v, wn], [m, Y]],
    [
      /sony tablet [ps]/i,
      /\b(?:sony)?sgp\w+(?: bui|\))/i
    ],
    [[b, "Xperia Tablet"], [v, wn], [m, de]],
    [
      // Amazon
      /(alexa)webm/i,
      /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,
      // Kindle Fire without Silk / Echo Show
      /(kf[a-z]+)( bui|\)).+silk\//i
      // Kindle Fire HD
    ],
    [b, [v, Kn], [m, de]],
    [
      /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
      // Fire Phone
    ],
    [[b, /(.+)/g, "Fire Phone $1"], [v, Kn], [m, Y]],
    [
      // BlackBerry
      /(playbook);[-\w\),; ]+(rim)/i
      // BlackBerry PlayBook
    ],
    [b, v, [m, de]],
    [
      /\b((?:bb[a-f]|st[hv])100-\d)/i,
      /\(bb10; (\w+)/i
      // BlackBerry 10
    ],
    [b, [v, ys], [m, Y]],
    [
      // Asus
      /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
    ],
    [b, [v, vs], [m, de]],
    [
      / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
    ],
    [b, [v, vs], [m, Y]],
    [
      // HTC
      /(nexus 9)/i
      // HTC Nexus 9
    ],
    [b, [v, "HTC"], [m, de]],
    [
      /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
      // HTC
      // ZTE
      /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
      /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i
      // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
    ],
    [v, [b, /_/g, " "], [m, Y]],
    [
      // TCL
      /tcl (xess p17aa)/i,
      /droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])(_\w(\w|\w\w))?(\)| bui)/i
    ],
    [b, [v, "TCL"], [m, de]],
    [
      /droid [\w\.]+; (418(?:7d|8v)|5087z|5102l|61(?:02[dh]|25[adfh]|27[ai]|56[dh]|59k|65[ah])|a509dl|t(?:43(?:0w|1[adepqu])|50(?:6d|7[adju])|6(?:09dl|10k|12b|71[efho]|76[hjk])|7(?:66[ahju]|67[hw]|7[045][bh]|71[hk]|73o|76[ho]|79w|81[hks]?|82h|90[bhsy]|99b)|810[hs]))(_\w(\w|\w\w))?(\)| bui)/i
    ],
    [b, [v, "TCL"], [m, Y]],
    [
      // itel
      /(itel) ((\w+))/i
    ],
    [[v, ft], b, [m, it, { tablet: ["p10001l", "w7001"], "*": "mobile" }]],
    [
      // Acer
      /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
    ],
    [b, [v, "Acer"], [m, de]],
    [
      // Meizu
      /droid.+; (m[1-5] note) bui/i,
      /\bmz-([-\w]{2,})/i
    ],
    [b, [v, "Meizu"], [m, Y]],
    [
      // Ulefone
      /; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i
    ],
    [b, [v, "Ulefone"], [m, Y]],
    [
      // Energizer
      /; (energy ?\w+)(?: bui|\))/i,
      /; energizer ([\w ]+)(?: bui|\))/i
    ],
    [b, [v, "Energizer"], [m, Y]],
    [
      // Cat
      /; cat (b35);/i,
      /; (b15q?|s22 flip|s48c|s62 pro)(?: bui|\))/i
    ],
    [b, [v, "Cat"], [m, Y]],
    [
      // Smartfren
      /((?:new )?andromax[\w- ]+)(?: bui|\))/i
    ],
    [b, [v, "Smartfren"], [m, Y]],
    [
      // Nothing
      /droid.+; (a(in)?(0(15|59|6[35])|142)p?)/i
    ],
    [b, [v, "Nothing"], [m, Y]],
    [
      // Archos
      /; (x67 5g|tikeasy \w+|ac[1789]\d\w+)( b|\))/i,
      /archos ?(5|gamepad2?|([\w ]*[t1789]|hello) ?\d+[\w ]*)( b|\))/i
    ],
    [b, [v, "Archos"], [m, de]],
    [
      /archos ([\w ]+)( b|\))/i,
      /; (ac[3-6]\d\w{2,8})( b|\))/i
    ],
    [b, [v, "Archos"], [m, Y]],
    [
      // HMD
      /; (n159v)/i
    ],
    [b, [v, "HMD"], [m, Y]],
    [
      // MIXED
      /(imo) (tab \w+)/i,
      // IMO
      /(infinix|tecno) (x1101b?|p904|dp(7c|8d|10a)( pro)?|p70[1-3]a?|p904|t1101)/i
      // Infinix XPad / Tecno
    ],
    [v, b, [m, de]],
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
    [v, b, [m, Y]],
    [
      /(kobo)\s(ereader|touch)/i,
      // Kobo
      /(hp).+(touchpad(?!.+tablet)|tablet)/i,
      // HP TouchPad
      /(kindle)\/([\w\.]+)/i
      // Kindle
    ],
    [v, b, [m, de]],
    [
      /(surface duo)/i
      // Surface Duo
    ],
    [b, [v, Cr], [m, de]],
    [
      /droid [\d\.]+; (fp\du?)(?: b|\))/i
      // Fairphone
    ],
    [b, [v, "Fairphone"], [m, Y]],
    [
      /((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i
      // Nvidia Tablets
    ],
    [b, [v, Or], [m, de]],
    [
      /(sprint) (\w+)/i
      // Sprint Phones
    ],
    [v, b, [m, Y]],
    [
      /(kin\.[onetw]{3})/i
      // Microsoft Kin
    ],
    [[b, /\./g, " "], [v, Cr], [m, Y]],
    [
      /droid.+; ([c6]+|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
      // Zebra
    ],
    [b, [v, Pr], [m, de]],
    [
      /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
    ],
    [b, [v, Pr], [m, Y]],
    [
      ///////////////////
      // SMARTTVS
      ///////////////////
      /smart-tv.+(samsung)/i
      // Samsung
    ],
    [v, [m, ke]],
    [
      /hbbtv.+maple;(\d+)/i
    ],
    [[b, /^/, "SmartTV"], [v, mn], [m, ke]],
    [
      /(vizio)(?: |.+model\/)(\w+-\w+)/i,
      // Vizio
      /tcast.+(lg)e?. ([-\w]+)/i
      // LG SmartTV
    ],
    [v, b, [m, ke]],
    [
      /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i
    ],
    [[v, Zn], [m, ke]],
    [
      /(apple) ?tv/i
      // Apple TV
    ],
    [v, [b, Xt + " TV"], [m, ke]],
    [
      /crkey.*devicetype\/chromecast/i
      // Google Chromecast Third Generation
    ],
    [[b, Tt + " Third Generation"], [v, Mt], [m, ke]],
    [
      /crkey.*devicetype\/([^/]*)/i
      // Google Chromecast with specific device type
    ],
    [[b, /^/, "Chromecast "], [v, Mt], [m, ke]],
    [
      /fuchsia.*crkey/i
      // Google Chromecast Nest Hub
    ],
    [[b, Tt + " Nest Hub"], [v, Mt], [m, ke]],
    [
      /crkey/i
      // Google Chromecast, Linux-based or unknown
    ],
    [[b, Tt], [v, Mt], [m, ke]],
    [
      /(portaltv)/i
      // Facebook Portal TV
    ],
    [b, [v, $r], [m, ke]],
    [
      /droid.+aft(\w+)( bui|\))/i
      // Fire TV
    ],
    [b, [v, Kn], [m, ke]],
    [
      /(shield \w+ tv)/i
      // Nvidia Shield TV
    ],
    [b, [v, Or], [m, ke]],
    [
      /\(dtv[\);].+(aquos)/i,
      /(aquos-tv[\w ]+)\)/i
      // Sharp
    ],
    [b, [v, xs], [m, ke]],
    [
      /(bravia[\w ]+)( bui|\))/i
      // Sony
    ],
    [b, [v, wn], [m, ke]],
    [
      /(mi(tv|box)-?\w+) bui/i
      // Xiaomi
    ],
    [b, [v, Nr], [m, ke]],
    [
      /Hbbtv.*(technisat) (.*);/i
      // TechniSAT
    ],
    [v, b, [m, ke]],
    [
      /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
      // Roku
      /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i
      // HbbTV devices
    ],
    [[v, /.+\/(\w+)/, "$1", it, { LG: "lge" }], [b, cr], [m, ke]],
    [
      // SmartTV from Unidentified Vendors
      /droid.+; ([\w- ]+) (?:android tv|smart[- ]?tv)/i
    ],
    [b, [m, ke]],
    [
      /\b(android tv|smart[- ]?tv|opera tv|tv; rv:|large screen[\w ]+safari)\b/i
    ],
    [[m, ke]],
    [
      ///////////////////
      // CONSOLES
      ///////////////////
      /(playstation \w+)/i
      // Playstation
    ],
    [b, [v, wn], [m, Cn]],
    [
      /\b(xbox(?: one)?(?!; xbox))[\); ]/i
      // Microsoft Xbox
    ],
    [b, [v, Cr], [m, Cn]],
    [
      /(ouya)/i,
      // Ouya
      /(nintendo) (\w+)/i,
      // Nintendo
      /(retroid) (pocket ([^\)]+))/i
      // Retroid Pocket
    ],
    [v, b, [m, Cn]],
    [
      /droid.+; (shield)( bui|\))/i
      // Nvidia Portable
    ],
    [b, [v, Or], [m, Cn]],
    [
      ///////////////////
      // WEARABLES
      ///////////////////
      /\b(sm-[lr]\d\d[0156][fnuw]?s?|gear live)\b/i
      // Samsung Galaxy Watch
    ],
    [b, [v, mn], [m, nt]],
    [
      /((pebble))app/i,
      // Pebble
      /(asus|google|lg|oppo) ((pixel |zen)?watch[\w ]*)( bui|\))/i
      // Asus ZenWatch / LG Watch / Pixel Watch
    ],
    [v, b, [m, nt]],
    [
      /(ow(?:19|20)?we?[1-3]{1,3})/i
      // Oppo Watch
    ],
    [b, [v, Ir], [m, nt]],
    [
      /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i
      // Apple Watch
    ],
    [b, [v, Xt], [m, nt]],
    [
      /(opwwe\d{3})/i
      // OnePlus Watch
    ],
    [b, [v, _s], [m, nt]],
    [
      /(moto 360)/i
      // Motorola 360
    ],
    [b, [v, Lr], [m, nt]],
    [
      /(smartwatch 3)/i
      // Sony SmartWatch
    ],
    [b, [v, wn], [m, nt]],
    [
      /(g watch r)/i
      // LG G Watch R
    ],
    [b, [v, Zn], [m, nt]],
    [
      /droid.+; (wt63?0{2,3})\)/i
    ],
    [b, [v, Pr], [m, nt]],
    [
      ///////////////////
      // XR
      ///////////////////
      /droid.+; (glass) \d/i
      // Google Glass
    ],
    [b, [v, Mt], [m, Yn]],
    [
      /(pico) (4|neo3(?: link|pro)?)/i
      // Pico
    ],
    [v, b, [m, Yn]],
    [
      /(quest( \d| pro)?s?).+vr/i
      // Meta Quest
    ],
    [b, [v, $r], [m, Yn]],
    [
      /mobile vr; rv.+firefox/i
      // Unidentifiable VR device using Firefox Reality / Wolvic
    ],
    [[m, Yn]],
    [
      ///////////////////
      // EMBEDDED
      ///////////////////
      /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i
      // Tesla
    ],
    [v, [m, Ln]],
    [
      /(aeobc)\b/i
      // Echo Dot
    ],
    [b, [v, Kn], [m, Ln]],
    [
      /(homepod).+mac os/i
      // Apple HomePod
    ],
    [b, [v, Xt], [m, Ln]],
    [
      /windows iot/i
      // Unidentifiable embedded device using Windows IoT
    ],
    [[m, Ln]],
    [
      ////////////////////
      // MIXED (GENERIC)
      ///////////////////
      /droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+?(mobile|vr|\d) safari/i
    ],
    [b, [m, it, { mobile: "Mobile", xr: "VR", "*": de }]],
    [
      /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i
      // Unidentifiable Tablet
    ],
    [[m, de]],
    [
      /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i
      // Unidentifiable Mobile
    ],
    [[m, Y]],
    [
      /droid .+?; ([\w\. -]+)( bui|\))/i
      // Generic Android Device
    ],
    [b, [v, "Generic"]]
  ],
  engine: [
    [
      /windows.+ edge\/([\w\.]+)/i
      // EdgeHTML
    ],
    [S, [k, ir + "HTML"]],
    [
      /(arkweb)\/([\w\.]+)/i
      // ArkWeb
    ],
    [k, S],
    [
      /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i
      // Blink
    ],
    [S, [k, "Blink"]],
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
    [k, S],
    [
      /ladybird\//i
    ],
    [[k, "LibWeb"]],
    [
      /rv\:([\w\.]{1,9})\b.+(gecko)/i
      // Gecko
    ],
    [S, k]
  ],
  os: [
    [
      // Windows
      /(windows nt) (6\.[23]); arm/i
      // Windows RT
    ],
    [[k, /N/, "R"], [S, it, Cs]],
    [
      /(windows (?:phone|mobile|iot))(?: os)?[\/ ]?([\d\.]*( se)?)/i,
      // Windows IoT/Mobile/Phone
      // Windows NT/3.1/95/98/ME/2000/XP/Vista/7/8/8.1/10/11
      /(windows)[\/ ](1[01]|2000|3\.1|7|8(\.1)?|9[58]|me|server 20\d\d( r2)?|vista|xp)/i
    ],
    [k, S],
    [
      /windows nt ?([\d\.\)]*)(?!.+xbox)/i,
      /\bwin(?=3| ?9|n)(?:nt| 9x )?([\d\.;]*)/i
    ],
    [[S, /(;|\))/g, "", it, Cs], [k, Bi]],
    [
      /(windows ce)\/?([\d\.]*)/i
      // Windows CE
    ],
    [k, S],
    [
      // iOS/macOS
      /[adehimnop]{4,7}\b(?:.*os ([\w]+) like mac|; opera)/i,
      // iOS
      /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
      /cfnetwork\/.+darwin/i
    ],
    [[S, /_/g, "."], [k, "iOS"]],
    [
      /(mac os x) ?([\w\. ]*)/i,
      /(macintosh|mac_powerpc\b)(?!.+(haiku|morphos))/i
      // Mac OS
    ],
    [[k, "macOS"], [S, /_/g, "."]],
    [
      // Google Chromecast
      /android ([\d\.]+).*crkey/i
      // Google Chromecast, Android-based
    ],
    [S, [k, Tt + " Android"]],
    [
      /fuchsia.*crkey\/([\d\.]+)/i
      // Google Chromecast, Fuchsia-based
    ],
    [S, [k, Tt + " Fuchsia"]],
    [
      /crkey\/([\d\.]+).*devicetype\/smartspeaker/i
      // Google Chromecast, Linux-based Smart Speaker
    ],
    [S, [k, Tt + " SmartSpeaker"]],
    [
      /linux.*crkey\/([\d\.]+)/i
      // Google Chromecast, Legacy Linux-based
    ],
    [S, [k, Tt + " Linux"]],
    [
      /crkey\/([\d\.]+)/i
      // Google Chromecast, unknown
    ],
    [S, [k, Tt]],
    [
      // Mobile OSes
      /droid ([\w\.]+)\b.+(android[- ]x86)/i
      // Android-x86
    ],
    [S, k],
    [
      /(ubuntu) ([\w\.]+) like android/i
      // Ubuntu Touch
    ],
    [[k, /(.+)/, "$1 Touch"], S],
    [
      /(harmonyos)[\/ ]?([\d\.]*)/i,
      // HarmonyOS
      // Android/Blackberry/WebOS/QNX/Bada/RIM/KaiOS/Maemo/MeeGo/S40/Sailfish OS/OpenHarmony/Tizen
      /(android|bada|blackberry|kaios|maemo|meego|openharmony|qnx|rim tablet os|sailfish|series40|symbian|tizen)\w*[-\/\.; ]?([\d\.]*)/i
    ],
    [k, S],
    [
      /\(bb(10);/i
      // BlackBerry 10
    ],
    [S, [k, ys]],
    [
      /(?:symbian ?os|symbos|s60(?=;)|series ?60)[-\/ ]?([\w\.]*)/i
      // Symbian
    ],
    [S, [k, "Symbian"]],
    [
      /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
      // Firefox OS
    ],
    [S, [k, bn + " OS"]],
    [
      /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i,
      // WebOS
      /webos(?:[ \/]?|\.tv-20(?=2[2-9]))(\d[\d\.]*)/i
    ],
    [S, [k, "webOS"]],
    [
      /web0s;.+?(?:chr[o0]me|safari)\/(\d+)/i
      // https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine
    ],
    [[S, it, { 25: "120", 24: "108", 23: "94", 22: "87", 6: "79", 5: "68", 4: "53", 3: "38", 2: "538", 1: "537", "*": "TV" }], [k, "webOS"]],
    [
      /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i
      // watchOS
    ],
    [S, [k, "watchOS"]],
    [
      // Google ChromeOS
      /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i
      // Chromium OS
    ],
    [[k, "Chrome OS"], S],
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
    [k, S],
    [
      /(sunos) ?([\d\.]*)/i
      // Solaris
    ],
    [[k, "Solaris"], S],
    [
      /\b(beos|os\/2|amigaos|openvms|hp-ux|serenityos)/i,
      // BeOS/OS2/AmigaOS/OpenVMS/HP-UX/SerenityOS
      /(unix) ?([\w\.]*)/i
      // UNIX
    ],
    [k, S]
  ]
}, Qn = (function() {
  var r = { init: {}, isIgnore: {}, isIgnoreRgx: {}, toString: {} };
  return pt.call(r.init, [
    [Ne, [k, S, In, m]],
    [dt, [Pe]],
    [st, [m, b, v]],
    [Ye, [k, S]],
    [He, [k, S]]
  ]), pt.call(r.isIgnore, [
    [Ne, [S, In]],
    [Ye, [S]],
    [He, [S]]
  ]), pt.call(r.isIgnoreRgx, [
    [Ne, / ?browser$/i],
    [He, / ?os$/i]
  ]), pt.call(r.toString, [
    [Ne, [k, S]],
    [dt, [Pe]],
    [st, [v, b]],
    [Ye, [k, S]],
    [He, [k, S]]
  ]), r;
})(), Na = function(r, e) {
  var t = Qn.init[e], n = Qn.isIgnore[e] || 0, i = Qn.isIgnoreRgx[e] || 0, o = Qn.toString[e] || 0;
  function s() {
    pt.call(this, t);
  }
  return s.prototype.getItem = function() {
    return r;
  }, s.prototype.withClientHints = function() {
    return Rt ? Rt.getHighEntropyValues(Fo).then(function(a) {
      return r.setCH(new Ho(a, !1)).parseCH().get();
    }) : r.parseCH().get();
  }, s.prototype.withFeatureCheck = function() {
    return r.detectFeature().get();
  }, e != Kt && (s.prototype.is = function(a) {
    var l = !1;
    for (var c in this)
      if (this.hasOwnProperty(c) && !Ui(n, c) && ft(i ? en(i, this[c]) : this[c]) == ft(i ? en(i, a) : a)) {
        if (l = !0, a != At) break;
      } else if (a == At && l) {
        l = !l;
        break;
      }
    return l;
  }, s.prototype.toString = function() {
    var a = Qt;
    for (var l in o)
      typeof this[o[l]] !== At && (a += (a ? " " : Qt) + this[o[l]]);
    return a || At;
  }), Rt || (s.prototype.then = function(a) {
    var l = this, c = function() {
      for (var p in l)
        l.hasOwnProperty(p) && (this[p] = l[p]);
    };
    c.prototype = {
      is: s.prototype.is,
      toString: s.prototype.toString
    };
    var u = new c();
    return a(u), u;
  }), new s();
};
function Ho(r, e) {
  if (r = r || {}, pt.call(this, Fo), e)
    pt.call(this, [
      [Gi, Mr(r[Ct])],
      [Wi, Mr(r[Sa])],
      [Y, /\?1/.test(r[Ra])],
      [b, yn(r[Aa])],
      [Zt, yn(r[Vo])],
      [Xi, yn(r[Ca])],
      [Pe, yn(r[_a])],
      [Dt, Mr(r[Ta])],
      [fr, yn(r[xa])]
    ]);
  else
    for (var t in r)
      this.hasOwnProperty(t) && typeof r[t] !== At && (this[t] = r[t]);
}
function Is(r, e, t, n) {
  return this.get = function(i) {
    return i ? this.data.hasOwnProperty(i) ? this.data[i] : void 0 : this.data;
  }, this.set = function(i, o) {
    return this.data[i] = o, this;
  }, this.setCH = function(i) {
    return this.uaCH = i, this;
  }, this.detectFeature = function() {
    if ($e && $e.userAgent == this.ua)
      switch (this.itemType) {
        case Ne:
          $e.brave && typeof $e.brave.isBrave == ar && this.set(k, "Brave");
          break;
        case st:
          !this.get(m) && Rt && Rt[Y] && this.set(m, Y), this.get(b) == "Macintosh" && $e && typeof $e.standalone !== At && $e.maxTouchPoints && $e.maxTouchPoints > 2 && this.set(b, "iPad").set(m, de);
          break;
        case He:
          !this.get(k) && Rt && Rt[Zt] && this.set(k, Rt[Zt]);
          break;
        case Kt:
          var i = this.data, o = function(s) {
            return i[s].getItem().detectFeature().get();
          };
          this.set(Ne, o(Ne)).set(dt, o(dt)).set(st, o(st)).set(Ye, o(Ye)).set(He, o(He));
      }
    return this;
  }, this.parseUA = function() {
    return this.itemType != Kt && Br.call(this.data, this.ua, this.rgxMap), this.itemType == Ne && this.set(In, Dr(this.get(S))), this;
  }, this.parseCH = function() {
    var i = this.uaCH, o = this.rgxMap;
    switch (this.itemType) {
      case Ne:
      case Ye:
        var s = i[Wi] || i[Gi], a;
        if (s)
          for (var l in s) {
            var c = s[l].brand || s[l], u = s[l].version;
            this.itemType == Ne && !/not.a.brand/i.test(c) && (!a || /Chrom/.test(a) && c != Rs || a == ir && /WebView2/.test(c)) && (c = it(c, Ia), a = this.get(k), a && !/Chrom/.test(a) && /Chrom/.test(c) || this.set(k, c).set(S, u).set(In, Dr(u)), a = c), this.itemType == Ye && c == Rs && this.set(S, u);
          }
        break;
      case dt:
        var p = i[Pe];
        p && (p && i[fr] == "64" && (p += "64"), Br.call(this.data, p + ";", o));
        break;
      case st:
        if (i[Y] && this.set(m, Y), i[b] && (this.set(b, i[b]), !this.get(m) || !this.get(v))) {
          var f = {};
          Br.call(f, "droid 9; " + i[b] + ")", o), !this.get(m) && f.type && this.set(m, f.type), !this.get(v) && f.vendor && this.set(v, f.vendor);
        }
        if (i[Dt]) {
          var E;
          if (typeof i[Dt] != "string")
            for (var R = 0; !E && R < i[Dt].length; )
              E = it(i[Dt][R++], Ls);
          else
            E = it(i[Dt], Ls);
          this.set(m, E);
        }
        break;
      case He:
        var w = i[Zt];
        if (w) {
          var N = i[Xi];
          w == Bi && (N = parseInt(Dr(N), 10) >= 13 ? "11" : "10"), this.set(k, w).set(S, N);
        }
        this.get(k) == Bi && i[b] == "Xbox" && this.set(k, "Xbox").set(S, void 0);
        break;
      case Kt:
        var j = this.data, J = function(Q) {
          return j[Q].getItem().setCH(i).parseCH().get();
        };
        this.set(Ne, J(Ne)).set(dt, J(dt)).set(st, J(st)).set(Ye, J(Ye)).set(He, J(He));
    }
    return this;
  }, pt.call(this, [
    ["itemType", r],
    ["ua", e],
    ["uaCH", n],
    ["rgxMap", t],
    ["data", Na(this, r)]
  ]), this;
}
function wt(r, e, t) {
  if (typeof r === Jt ? (lr(r, !0) ? (typeof e === Jt && (t = e), e = r) : (t = r, e = void 0), r = void 0) : typeof r === Di && !lr(e, !0) && (t = e, e = void 0), t && typeof t.append === ar) {
    var n = {};
    t.forEach(function(l, c) {
      n[c] = l;
    }), t = n;
  }
  if (!(this instanceof wt))
    return new wt(r, e, t).getResult();
  var i = typeof r === Di ? r : (
    // Passed user-agent string
    t && t[bs] ? t[bs] : (
      // User-Agent from passed headers
      $e && $e.userAgent ? $e.userAgent : (
        // navigator.userAgent
        Qt
      )
    )
  ), o = new Ho(t, !0), s = e ? Oa(Os, e) : Os, a = function(l) {
    return l == Kt ? function() {
      return new Is(l, i, s, o).set("ua", i).set(Ne, this.getBrowser()).set(dt, this.getCPU()).set(st, this.getDevice()).set(Ye, this.getEngine()).set(He, this.getOS()).get();
    } : function() {
      return new Is(l, i, s[l], o).parseUA().get();
    };
  };
  return pt.call(this, [
    ["getBrowser", a(Ne)],
    ["getCPU", a(dt)],
    ["getDevice", a(st)],
    ["getEngine", a(Ye)],
    ["getOS", a(He)],
    ["getResult", a(Kt)],
    ["getUA", function() {
      return i;
    }],
    ["setUA", function(l) {
      return tn(l) && (i = l.length > Mi ? cr(l, Mi) : l), this;
    }]
  ]).setUA(i), this;
}
wt.VERSION = ka;
wt.BROWSER = pr([k, S, In, m]);
wt.CPU = pr([Pe]);
wt.DEVICE = pr([b, v, m, Cn, Y, ke, de, nt, Ln]);
wt.ENGINE = wt.OS = pr([k, S]);
function Pa() {
  return !new wt().getDevice().type;
}
function $a() {
  const r = document.createElement("div");
  r.classList.add("nodekit-container"), document.body.appendChild(r);
  const e = document.createElement("div");
  return e.classList.add("nodekit-content"), r.appendChild(e), e;
}
class Ma {
  resolveAssetUrl(e) {
    if (e.locator.locator_type == "URL")
      return e.locator.url;
    if (e.locator.locator_type == "RelativePath") {
      let t = document.baseURI;
      const i = e.locator.relative_path.replace(/\\/g, "/").split("/").map((o) => encodeURIComponent(o)).join("/");
      return new URL(i, t).toString();
    }
    throw new Error("Unsupported locator for the browser environment. Found:" + JSON.stringify(e));
  }
  async getImageElement(e) {
    let t = this.resolveAssetUrl(e), n = new Image();
    return n.src = t, new Promise(
      (i, o) => {
        n.onload = () => i(n), n.onerror = (s) => o(s);
      }
    );
  }
  async getVideoElement(e) {
    let t = this.resolveAssetUrl(e), n = document.createElement("video");
    n.controls = !1;
    let i = new Promise((o, s) => {
      n.oncanplaythrough = () => {
        o(n);
      }, n.onerror = (a) => s(a);
    });
    return n.src = t, n.load(), i;
  }
}
class qe {
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
  _registerEventListener(e, t, n, i) {
    e.addEventListener(t, n, i), this._listenerRegistry.push({ type: t, handler: n, options: i });
  }
  _findChildrenComponents() {
    const e = [];
    for (const t of Object.keys(this)) {
      const n = this[t];
      n instanceof qe ? e.push(n) : Array.isArray(n) && n.every((i) => i instanceof qe) && e.push(...n);
    }
    return e;
  }
  removeAllEventListeners() {
    for (const { type: e, handler: t, options: n } of this._listenerRegistry)
      this.root.removeEventListener(e, t, n);
    this._listenerRegistry = [];
    for (const e of this._findChildrenComponents())
      e.removeAllEventListeners();
  }
}
class Da extends qe {
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
class Ba extends qe {
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
class gr extends qe {
  constructor(e) {
    super(), this.root = document.createElement("div"), this.root.classList.add("overlay"), this.root.id = e;
  }
  setVisibility(e) {
    e ? this.root.classList.add("overlay--visible-state") : this.root.classList.remove("overlay--visible-state");
  }
}
class Ua extends qe {
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
class za extends gr {
  constructor() {
    super("session-connecting-overlay"), this.displayTimeout = null;
    const e = document.createElement("div");
    e.classList.add("connecting-message-box"), this.root.appendChild(e), this.spinner = new Ua(), this.spinner.mount(e);
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
function Va(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var Ur, Ns;
function Fa() {
  if (Ns) return Ur;
  Ns = 1;
  function r(h) {
    return h instanceof Map ? h.clear = h.delete = h.set = function() {
      throw new Error("map is read-only");
    } : h instanceof Set && (h.add = h.clear = h.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(h), Object.getOwnPropertyNames(h).forEach((g) => {
      const x = h[g], G = typeof x;
      (G === "object" || G === "function") && !Object.isFrozen(x) && r(x);
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
  function n(h, ...g) {
    const x = /* @__PURE__ */ Object.create(null);
    for (const G in h)
      x[G] = h[G];
    return g.forEach(function(G) {
      for (const be in G)
        x[be] = G[be];
    }), /** @type {T} */
    x;
  }
  const i = "</span>", o = (h) => !!h.scope, s = (h, { prefix: g }) => {
    if (h.startsWith("language:"))
      return h.replace("language:", "language-");
    if (h.includes(".")) {
      const x = h.split(".");
      return [
        `${g}${x.shift()}`,
        ...x.map((G, be) => `${G}${"_".repeat(be + 1)}`)
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
    constructor(g, x) {
      this.buffer = "", this.classPrefix = x.classPrefix, g.walk(this);
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
      const x = s(
        g.scope,
        { prefix: this.classPrefix }
      );
      this.span(x);
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
  const l = (h = {}) => {
    const g = { children: [] };
    return Object.assign(g, h), g;
  };
  class c {
    constructor() {
      this.rootNode = l(), this.stack = [this.rootNode];
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
      const x = l({ scope: g });
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
    walk(g) {
      return this.constructor._walk(g, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(g, x) {
      return typeof x == "string" ? g.addText(x) : x.children && (g.openNode(x), x.children.forEach((G) => this._walk(g, G)), g.closeNode(x)), g;
    }
    /**
     * @param {Node} node
     */
    static _collapse(g) {
      typeof g != "string" && g.children && (g.children.every((x) => typeof x == "string") ? g.children = [g.children.join("")] : g.children.forEach((x) => {
        c._collapse(x);
      }));
    }
  }
  class u extends c {
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
    __addSublanguage(g, x) {
      const G = g.root;
      x && (G.scope = `language:${x}`), this.add(G);
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
  function f(h) {
    return w("(?=", h, ")");
  }
  function E(h) {
    return w("(?:", h, ")*");
  }
  function R(h) {
    return w("(?:", h, ")?");
  }
  function w(...h) {
    return h.map((x) => p(x)).join("");
  }
  function N(h) {
    const g = h[h.length - 1];
    return typeof g == "object" && g.constructor === Object ? (h.splice(h.length - 1, 1), g) : {};
  }
  function j(...h) {
    return "(" + (N(h).capture ? "" : "?:") + h.map((G) => p(G)).join("|") + ")";
  }
  function J(h) {
    return new RegExp(h.toString() + "|").exec("").length - 1;
  }
  function Q(h, g) {
    const x = h && h.exec(g);
    return x && x.index === 0;
  }
  const ee = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function he(h, { joinWith: g }) {
    let x = 0;
    return h.map((G) => {
      x += 1;
      const be = x;
      let we = p(G), I = "";
      for (; we.length > 0; ) {
        const O = ee.exec(we);
        if (!O) {
          I += we;
          break;
        }
        I += we.substring(0, O.index), we = we.substring(O.index + O[0].length), O[0][0] === "\\" && O[1] ? I += "\\" + String(Number(O[1]) + be) : (I += O[0], O[0] === "(" && x++);
      }
      return I;
    }).map((G) => `(${G})`).join(g);
  }
  const ne = /\b\B/, oe = "[a-zA-Z]\\w*", F = "[a-zA-Z_]\\w*", Ve = "\\b\\d+(\\.\\d+)?", Qe = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", Ee = "\\b(0b[01]+)", ot = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", at = (h = {}) => {
    const g = /^#![ ]*\//;
    return h.binary && (h.begin = w(
      g,
      /.*\b/,
      h.binary,
      /\b.*/
    )), n({
      scope: "meta",
      begin: g,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (x, G) => {
        x.index !== 0 && G.ignoreMatch();
      }
    }, h);
  }, A = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, T = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [A]
  }, z = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [A]
  }, P = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, M = function(h, g, x = {}) {
    const G = n(
      {
        scope: "comment",
        begin: h,
        end: g,
        contains: []
      },
      x
    );
    G.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const be = j(
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
    return G.contains.push(
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
        begin: w(
          /[ ]+/,
          // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
          "(",
          be,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), G;
  }, $ = M("//", "$"), q = M("/\\*", "\\*/"), V = M("#", "$"), K = {
    scope: "number",
    begin: Ve,
    relevance: 0
  }, W = {
    scope: "number",
    begin: Qe,
    relevance: 0
  }, ye = {
    scope: "number",
    begin: Ee,
    relevance: 0
  }, X = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      A,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [A]
      }
    ]
  }, Me = {
    scope: "title",
    begin: oe,
    relevance: 0
  }, rn = {
    scope: "title",
    begin: F,
    relevance: 0
  }, Mn = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + F,
    relevance: 0
  };
  var Lt = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: T,
    BACKSLASH_ESCAPE: A,
    BINARY_NUMBER_MODE: ye,
    BINARY_NUMBER_RE: Ee,
    COMMENT: M,
    C_BLOCK_COMMENT_MODE: q,
    C_LINE_COMMENT_MODE: $,
    C_NUMBER_MODE: W,
    C_NUMBER_RE: Qe,
    END_SAME_AS_BEGIN: function(h) {
      return Object.assign(
        h,
        {
          /** @type {ModeCallback} */
          "on:begin": (g, x) => {
            x.data._beginMatch = g[1];
          },
          /** @type {ModeCallback} */
          "on:end": (g, x) => {
            x.data._beginMatch !== g[1] && x.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: V,
    IDENT_RE: oe,
    MATCH_NOTHING_RE: ne,
    METHOD_GUARD: Mn,
    NUMBER_MODE: K,
    NUMBER_RE: Ve,
    PHRASAL_WORDS_MODE: P,
    QUOTE_STRING_MODE: z,
    REGEXP_MODE: X,
    RE_STARTERS_RE: ot,
    SHEBANG: at,
    TITLE_MODE: Me,
    UNDERSCORE_IDENT_RE: F,
    UNDERSCORE_TITLE_MODE: rn
  });
  function Bn(h, g) {
    h.input[h.index - 1] === "." && g.ignoreMatch();
  }
  function Et(h, g) {
    h.className !== void 0 && (h.scope = h.className, delete h.className);
  }
  function zt(h, g) {
    g && h.beginKeywords && (h.begin = "\\b(" + h.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", h.__beforeBegin = Bn, h.keywords = h.keywords || h.beginKeywords, delete h.beginKeywords, h.relevance === void 0 && (h.relevance = 0));
  }
  function lt(h, g) {
    Array.isArray(h.illegal) && (h.illegal = j(...h.illegal));
  }
  function sn(h, g) {
    if (h.match) {
      if (h.begin || h.end) throw new Error("begin & end are not supported with match");
      h.begin = h.match, delete h.match;
    }
  }
  function on(h, g) {
    h.relevance === void 0 && (h.relevance = 1);
  }
  const vt = (h, g) => {
    if (!h.beforeMatch) return;
    if (h.starts) throw new Error("beforeMatch cannot be used with starts");
    const x = Object.assign({}, h);
    Object.keys(h).forEach((G) => {
      delete h[G];
    }), h.keywords = x.keywords, h.begin = w(x.beforeMatch, f(x.begin)), h.starts = {
      relevance: 0,
      contains: [
        Object.assign(x, { endsParent: !0 })
      ]
    }, h.relevance = 0, delete x.beforeMatch;
  }, Vt = [
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
  function an(h, g, x = Ft) {
    const G = /* @__PURE__ */ Object.create(null);
    return typeof h == "string" ? be(x, h.split(" ")) : Array.isArray(h) ? be(x, h) : Object.keys(h).forEach(function(we) {
      Object.assign(
        G,
        an(h[we], g, we)
      );
    }), G;
    function be(we, I) {
      g && (I = I.map((O) => O.toLowerCase())), I.forEach(function(O) {
        const H = O.split("|");
        G[H[0]] = [we, Un(H[0], H[1])];
      });
    }
  }
  function Un(h, g) {
    return g ? Number(g) : Sr(h) ? 0 : 1;
  }
  function Sr(h) {
    return Vt.includes(h.toLowerCase());
  }
  const Ht = {}, De = (h) => {
    console.error(h);
  }, ct = (h, ...g) => {
    console.log(`WARN: ${h}`, ...g);
  }, Be = (h, g) => {
    Ht[`${h}/${g}`] || (console.log(`Deprecated as of ${h}. ${g}`), Ht[`${h}/${g}`] = !0);
  }, Ot = new Error();
  function ln(h, g, { key: x }) {
    let G = 0;
    const be = h[x], we = {}, I = {};
    for (let O = 1; O <= g.length; O++)
      I[O + G] = be[O], we[O + G] = !0, G += J(g[O - 1]);
    h[x] = I, h[x]._emit = we, h[x]._multi = !0;
  }
  function zn(h) {
    if (Array.isArray(h.begin)) {
      if (h.skip || h.excludeBegin || h.returnBegin)
        throw De("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Ot;
      if (typeof h.beginScope != "object" || h.beginScope === null)
        throw De("beginScope must be object"), Ot;
      ln(h, h.begin, { key: "beginScope" }), h.begin = he(h.begin, { joinWith: "" });
    }
  }
  function cn(h) {
    if (Array.isArray(h.end)) {
      if (h.skip || h.excludeEnd || h.returnEnd)
        throw De("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Ot;
      if (typeof h.endScope != "object" || h.endScope === null)
        throw De("endScope must be object"), Ot;
      ln(h, h.end, { key: "endScope" }), h.end = he(h.end, { joinWith: "" });
    }
  }
  function Vn(h) {
    h.scope && typeof h.scope == "object" && h.scope !== null && (h.beginScope = h.scope, delete h.scope);
  }
  function qt(h) {
    Vn(h), typeof h.beginScope == "string" && (h.beginScope = { _wrap: h.beginScope }), typeof h.endScope == "string" && (h.endScope = { _wrap: h.endScope }), zn(h), cn(h);
  }
  function jt(h) {
    function g(I, O) {
      return new RegExp(
        p(I),
        "m" + (h.case_insensitive ? "i" : "") + (h.unicodeRegex ? "u" : "") + (O ? "g" : "")
      );
    }
    class x {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(O, H) {
        H.position = this.position++, this.matchIndexes[this.matchAt] = H, this.regexes.push([H, O]), this.matchAt += J(O) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const O = this.regexes.map((H) => H[1]);
        this.matcherRe = g(he(O, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(O) {
        this.matcherRe.lastIndex = this.lastIndex;
        const H = this.matcherRe.exec(O);
        if (!H)
          return null;
        const le = H.findIndex((_t, Gt) => Gt > 0 && _t !== void 0), fe = this.matchIndexes[le];
        return H.splice(0, le), Object.assign(H, fe);
      }
    }
    class G {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(O) {
        if (this.multiRegexes[O]) return this.multiRegexes[O];
        const H = new x();
        return this.rules.slice(O).forEach(([le, fe]) => H.addRule(le, fe)), H.compile(), this.multiRegexes[O] = H, H;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(O, H) {
        this.rules.push([O, H]), H.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(O) {
        const H = this.getMatcher(this.regexIndex);
        H.lastIndex = this.lastIndex;
        let le = H.exec(O);
        if (this.resumingScanAtSamePosition() && !(le && le.index === this.lastIndex)) {
          const fe = this.getMatcher(0);
          fe.lastIndex = this.lastIndex + 1, le = fe.exec(O);
        }
        return le && (this.regexIndex += le.position + 1, this.regexIndex === this.count && this.considerAll()), le;
      }
    }
    function be(I) {
      const O = new G();
      return I.contains.forEach((H) => O.addRule(H.begin, { rule: H, type: "begin" })), I.terminatorEnd && O.addRule(I.terminatorEnd, { type: "end" }), I.illegal && O.addRule(I.illegal, { type: "illegal" }), O;
    }
    function we(I, O) {
      const H = (
        /** @type CompiledMode */
        I
      );
      if (I.isCompiled) return H;
      [
        Et,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        sn,
        qt,
        vt
      ].forEach((fe) => fe(I, O)), h.compilerExtensions.forEach((fe) => fe(I, O)), I.__beforeBegin = null, [
        zt,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        lt,
        // default to 1 relevance if not specified
        on
      ].forEach((fe) => fe(I, O)), I.isCompiled = !0;
      let le = null;
      return typeof I.keywords == "object" && I.keywords.$pattern && (I.keywords = Object.assign({}, I.keywords), le = I.keywords.$pattern, delete I.keywords.$pattern), le = le || /\w+/, I.keywords && (I.keywords = an(I.keywords, h.case_insensitive)), H.keywordPatternRe = g(le, !0), O && (I.begin || (I.begin = /\B|\b/), H.beginRe = g(H.begin), !I.end && !I.endsWithParent && (I.end = /\B|\b/), I.end && (H.endRe = g(H.end)), H.terminatorEnd = p(H.end) || "", I.endsWithParent && O.terminatorEnd && (H.terminatorEnd += (I.end ? "|" : "") + O.terminatorEnd)), I.illegal && (H.illegalRe = g(
        /** @type {RegExp | string} */
        I.illegal
      )), I.contains || (I.contains = []), I.contains = [].concat(...I.contains.map(function(fe) {
        return yt(fe === "self" ? I : fe);
      })), I.contains.forEach(function(fe) {
        we(
          /** @type Mode */
          fe,
          H
        );
      }), I.starts && we(I.starts, O), H.matcher = be(H), H;
    }
    if (h.compilerExtensions || (h.compilerExtensions = []), h.contains && h.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return h.classNameAliases = n(h.classNameAliases || {}), we(
      /** @type Mode */
      h
    );
  }
  function Fe(h) {
    return h ? h.endsWithParent || Fe(h.starts) : !1;
  }
  function yt(h) {
    return h.variants && !h.cachedVariants && (h.cachedVariants = h.variants.map(function(g) {
      return n(h, { variants: null }, g);
    })), h.cachedVariants ? h.cachedVariants : Fe(h) ? n(h, { starts: h.starts ? n(h.starts) : null }) : Object.isFrozen(h) ? n(h) : h;
  }
  var un = "11.11.1";
  class hn extends Error {
    constructor(g, x) {
      super(g), this.name = "HTMLInjectionError", this.html = x;
    }
  }
  const dn = t, It = n, Nt = Symbol("nomatch"), _r = 7, kt = function(h) {
    const g = /* @__PURE__ */ Object.create(null), x = /* @__PURE__ */ Object.create(null), G = [];
    let be = !0;
    const we = "Could not find the language '{}', did you forget to load/include a language module?", I = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let O = {
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
    function H(y) {
      return O.noHighlightRe.test(y);
    }
    function le(y) {
      let B = y.className + " ";
      B += y.parentNode ? y.parentNode.className : "";
      const re = O.languageDetectRe.exec(B);
      if (re) {
        const ge = L(re[1]);
        return ge || (ct(we.replace("{}", re[1])), ct("Falling back to no-highlight mode for this block.", y)), ge ? re[1] : "no-highlight";
      }
      return B.split(/\s+/).find((ge) => H(ge) || L(ge));
    }
    function fe(y, B, re) {
      let ge = "", _e = "";
      typeof B == "object" ? (ge = y, re = B.ignoreIllegals, _e = B.language) : (Be("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Be("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), _e = y, ge = B), re === void 0 && (re = !0);
      const We = {
        code: ge,
        language: _e
      };
      Je("before:highlight", We);
      const xt = We.result ? We.result : _t(We.language, We.code, re);
      return xt.code = We.code, Je("after:highlight", xt), xt;
    }
    function _t(y, B, re, ge) {
      const _e = /* @__PURE__ */ Object.create(null);
      function We(C, U) {
        return C.keywords[U];
      }
      function xt() {
        if (!Z.keywords) {
          xe.addText(me);
          return;
        }
        let C = 0;
        Z.keywordPatternRe.lastIndex = 0;
        let U = Z.keywordPatternRe.exec(me), te = "";
        for (; U; ) {
          te += me.substring(C, U.index);
          const ce = tt.case_insensitive ? U[0].toLowerCase() : U[0], Re = We(Z, ce);
          if (Re) {
            const [ut, ba] = Re;
            if (xe.addText(te), te = "", _e[ce] = (_e[ce] || 0) + 1, _e[ce] <= _r && (Xn += ba), ut.startsWith("_"))
              te += U[0];
            else {
              const Ea = tt.classNameAliases[ut] || ut;
              et(U[0], Ea);
            }
          } else
            te += U[0];
          C = Z.keywordPatternRe.lastIndex, U = Z.keywordPatternRe.exec(me);
        }
        te += me.substring(C), xe.addText(te);
      }
      function Gn() {
        if (me === "") return;
        let C = null;
        if (typeof Z.subLanguage == "string") {
          if (!g[Z.subLanguage]) {
            xe.addText(me);
            return;
          }
          C = _t(Z.subLanguage, me, !0, ws[Z.subLanguage]), ws[Z.subLanguage] = /** @type {CompiledMode} */
          C._top;
        } else
          C = Pt(me, Z.subLanguage.length ? Z.subLanguage : null);
        Z.relevance > 0 && (Xn += C.relevance), xe.__addSublanguage(C._emitter, C.language);
      }
      function ze() {
        Z.subLanguage != null ? Gn() : xt(), me = "";
      }
      function et(C, U) {
        C !== "" && (xe.startScope(U), xe.addText(C), xe.endScope());
      }
      function fs(C, U) {
        let te = 1;
        const ce = U.length - 1;
        for (; te <= ce; ) {
          if (!C._emit[te]) {
            te++;
            continue;
          }
          const Re = tt.classNameAliases[C[te]] || C[te], ut = U[te];
          Re ? et(ut, Re) : (me = ut, xt(), me = ""), te++;
        }
      }
      function ps(C, U) {
        return C.scope && typeof C.scope == "string" && xe.openNode(tt.classNameAliases[C.scope] || C.scope), C.beginScope && (C.beginScope._wrap ? (et(me, tt.classNameAliases[C.beginScope._wrap] || C.beginScope._wrap), me = "") : C.beginScope._multi && (fs(C.beginScope, U), me = "")), Z = Object.create(C, { parent: { value: Z } }), Z;
      }
      function gs(C, U, te) {
        let ce = Q(C.endRe, te);
        if (ce) {
          if (C["on:end"]) {
            const Re = new e(C);
            C["on:end"](U, Re), Re.isMatchIgnored && (ce = !1);
          }
          if (ce) {
            for (; C.endsParent && C.parent; )
              C = C.parent;
            return C;
          }
        }
        if (C.endsWithParent)
          return gs(C.parent, U, te);
      }
      function fa(C) {
        return Z.matcher.regexIndex === 0 ? (me += C[0], 1) : (Rr = !0, 0);
      }
      function pa(C) {
        const U = C[0], te = C.rule, ce = new e(te), Re = [te.__beforeBegin, te["on:begin"]];
        for (const ut of Re)
          if (ut && (ut(C, ce), ce.isMatchIgnored))
            return fa(U);
        return te.skip ? me += U : (te.excludeBegin && (me += U), ze(), !te.returnBegin && !te.excludeBegin && (me = U)), ps(te, C), te.returnBegin ? 0 : U.length;
      }
      function ga(C) {
        const U = C[0], te = B.substring(C.index), ce = gs(Z, C, te);
        if (!ce)
          return Nt;
        const Re = Z;
        Z.endScope && Z.endScope._wrap ? (ze(), et(U, Z.endScope._wrap)) : Z.endScope && Z.endScope._multi ? (ze(), fs(Z.endScope, C)) : Re.skip ? me += U : (Re.returnEnd || Re.excludeEnd || (me += U), ze(), Re.excludeEnd && (me = U));
        do
          Z.scope && xe.closeNode(), !Z.skip && !Z.subLanguage && (Xn += Z.relevance), Z = Z.parent;
        while (Z !== ce.parent);
        return ce.starts && ps(ce.starts, C), Re.returnEnd ? 0 : U.length;
      }
      function ma() {
        const C = [];
        for (let U = Z; U !== tt; U = U.parent)
          U.scope && C.unshift(U.scope);
        C.forEach((U) => xe.openNode(U));
      }
      let Wn = {};
      function ms(C, U) {
        const te = U && U[0];
        if (me += C, te == null)
          return ze(), 0;
        if (Wn.type === "begin" && U.type === "end" && Wn.index === U.index && te === "") {
          if (me += B.slice(U.index, U.index + 1), !be) {
            const ce = new Error(`0 width match regex (${y})`);
            throw ce.languageName = y, ce.badRule = Wn.rule, ce;
          }
          return 1;
        }
        if (Wn = U, U.type === "begin")
          return pa(U);
        if (U.type === "illegal" && !re) {
          const ce = new Error('Illegal lexeme "' + te + '" for mode "' + (Z.scope || "<unnamed>") + '"');
          throw ce.mode = Z, ce;
        } else if (U.type === "end") {
          const ce = ga(U);
          if (ce !== Nt)
            return ce;
        }
        if (U.type === "illegal" && te === "")
          return me += `
`, 1;
        if (Tr > 1e5 && Tr > U.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return me += te, te.length;
      }
      const tt = L(y);
      if (!tt)
        throw De(we.replace("{}", y)), new Error('Unknown language: "' + y + '"');
      const wa = jt(tt);
      let xr = "", Z = ge || wa;
      const ws = {}, xe = new O.__emitter(O);
      ma();
      let me = "", Xn = 0, $t = 0, Tr = 0, Rr = !1;
      try {
        if (tt.__emitTokens)
          tt.__emitTokens(B, xe);
        else {
          for (Z.matcher.considerAll(); ; ) {
            Tr++, Rr ? Rr = !1 : Z.matcher.considerAll(), Z.matcher.lastIndex = $t;
            const C = Z.matcher.exec(B);
            if (!C) break;
            const U = B.substring($t, C.index), te = ms(U, C);
            $t = C.index + te;
          }
          ms(B.substring($t));
        }
        return xe.finalize(), xr = xe.toHTML(), {
          language: y,
          value: xr,
          relevance: Xn,
          illegal: !1,
          _emitter: xe,
          _top: Z
        };
      } catch (C) {
        if (C.message && C.message.includes("Illegal"))
          return {
            language: y,
            value: dn(B),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: C.message,
              index: $t,
              context: B.slice($t - 100, $t + 100),
              mode: C.mode,
              resultSoFar: xr
            },
            _emitter: xe
          };
        if (be)
          return {
            language: y,
            value: dn(B),
            illegal: !1,
            relevance: 0,
            errorRaised: C,
            _emitter: xe,
            _top: Z
          };
        throw C;
      }
    }
    function Gt(y) {
      const B = {
        value: dn(y),
        illegal: !1,
        relevance: 0,
        _top: I,
        _emitter: new O.__emitter(O)
      };
      return B._emitter.addText(y), B;
    }
    function Pt(y, B) {
      B = B || O.languages || Object.keys(g);
      const re = Gt(y), ge = B.filter(L).filter(Se).map(
        (ze) => _t(ze, y, !1)
      );
      ge.unshift(re);
      const _e = ge.sort((ze, et) => {
        if (ze.relevance !== et.relevance) return et.relevance - ze.relevance;
        if (ze.language && et.language) {
          if (L(ze.language).supersetOf === et.language)
            return 1;
          if (L(et.language).supersetOf === ze.language)
            return -1;
        }
        return 0;
      }), [We, xt] = _e, Gn = We;
      return Gn.secondBest = xt, Gn;
    }
    function Fn(y, B, re) {
      const ge = B && x[B] || re;
      y.classList.add("hljs"), y.classList.add(`language-${ge}`);
    }
    function Ue(y) {
      let B = null;
      const re = le(y);
      if (H(re)) return;
      if (Je(
        "before:highlightElement",
        { el: y, language: re }
      ), y.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", y);
        return;
      }
      if (y.children.length > 0 && (O.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(y)), O.throwUnescapedHTML))
        throw new hn(
          "One of your code blocks includes unescaped HTML.",
          y.innerHTML
        );
      B = y;
      const ge = B.textContent, _e = re ? fe(ge, { language: re, ignoreIllegals: !0 }) : Pt(ge);
      y.innerHTML = _e.value, y.dataset.highlighted = "yes", Fn(y, re, _e.language), y.result = {
        language: _e.language,
        // TODO: remove with version 11.0
        re: _e.relevance,
        relevance: _e.relevance
      }, _e.secondBest && (y.secondBest = {
        language: _e.secondBest.language,
        relevance: _e.secondBest.relevance
      }), Je("after:highlightElement", { el: y, result: _e, text: ge });
    }
    function Hn(y) {
      O = It(O, y);
    }
    const qn = () => {
      Wt(), Be("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function jn() {
      Wt(), Be("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let fn = !1;
    function Wt() {
      function y() {
        Wt();
      }
      if (document.readyState === "loading") {
        fn || window.addEventListener("DOMContentLoaded", y, !1), fn = !0;
        return;
      }
      document.querySelectorAll(O.cssSelector).forEach(Ue);
    }
    function D(y, B) {
      let re = null;
      try {
        re = B(h);
      } catch (ge) {
        if (De("Language definition for '{}' could not be registered.".replace("{}", y)), be)
          De(ge);
        else
          throw ge;
        re = I;
      }
      re.name || (re.name = y), g[y] = re, re.rawDefinition = B.bind(null, h), re.aliases && pe(re.aliases, { languageName: y });
    }
    function d(y) {
      delete g[y];
      for (const B of Object.keys(x))
        x[B] === y && delete x[B];
    }
    function _() {
      return Object.keys(g);
    }
    function L(y) {
      return y = (y || "").toLowerCase(), g[y] || g[x[y]];
    }
    function pe(y, { languageName: B }) {
      typeof y == "string" && (y = [y]), y.forEach((re) => {
        x[re.toLowerCase()] = B;
      });
    }
    function Se(y) {
      const B = L(y);
      return B && !B.disableAutodetect;
    }
    function ve(y) {
      y["before:highlightBlock"] && !y["before:highlightElement"] && (y["before:highlightElement"] = (B) => {
        y["before:highlightBlock"](
          Object.assign({ block: B.el }, B)
        );
      }), y["after:highlightBlock"] && !y["after:highlightElement"] && (y["after:highlightElement"] = (B) => {
        y["after:highlightBlock"](
          Object.assign({ block: B.el }, B)
        );
      });
    }
    function Te(y) {
      ve(y), G.push(y);
    }
    function Ge(y) {
      const B = G.indexOf(y);
      B !== -1 && G.splice(B, 1);
    }
    function Je(y, B) {
      const re = y;
      G.forEach(function(ge) {
        ge[re] && ge[re](B);
      });
    }
    function pn(y) {
      return Be("10.7.0", "highlightBlock will be removed entirely in v12.0"), Be("10.7.0", "Please use highlightElement now."), Ue(y);
    }
    Object.assign(h, {
      highlight: fe,
      highlightAuto: Pt,
      highlightAll: Wt,
      highlightElement: Ue,
      // TODO: Remove with v12 API
      highlightBlock: pn,
      configure: Hn,
      initHighlighting: qn,
      initHighlightingOnLoad: jn,
      registerLanguage: D,
      unregisterLanguage: d,
      listLanguages: _,
      getLanguage: L,
      registerAliases: pe,
      autoDetection: Se,
      inherit: It,
      addPlugin: Te,
      removePlugin: Ge
    }), h.debugMode = function() {
      be = !1;
    }, h.safeMode = function() {
      be = !0;
    }, h.versionString = un, h.regex = {
      concat: w,
      lookahead: f,
      either: j,
      optional: R,
      anyNumberOfTimes: E
    };
    for (const y in Lt)
      typeof Lt[y] == "object" && r(Lt[y]);
    return Object.assign(h, Lt), h;
  }, St = kt({});
  return St.newInstance = () => kt({}), Ur = St, St.HighlightJS = St, St.default = St, Ur;
}
var Ha = /* @__PURE__ */ Fa();
const qo = /* @__PURE__ */ Va(Ha);
function qa(r) {
  const e = {
    className: "attr",
    begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
    relevance: 1.01
  }, t = {
    match: /[{}[\],:]/,
    className: "punctuation",
    relevance: 0
  }, n = [
    "true",
    "false",
    "null"
  ], i = {
    scope: "literal",
    beginKeywords: n.join(" ")
  };
  return {
    name: "JSON",
    aliases: ["jsonc"],
    keywords: {
      literal: n
    },
    contains: [
      e,
      t,
      r.QUOTE_STRING_MODE,
      i,
      r.C_NUMBER_MODE,
      r.C_LINE_COMMENT_MODE,
      r.C_BLOCK_COMMENT_MODE
    ],
    illegal: "\\S"
  };
}
qo.registerLanguage("json", qa);
class ja extends qe {
  constructor() {
    super(), this.root = document.createElement("div"), this.root.classList.add("json-viewer"), this.jsonViewerContent = document.createElement("div"), this.jsonViewerContent.classList.add("json-viewer__content"), this.root.appendChild(this.jsonViewerContent);
  }
  displayAsJson(e) {
    this.clear();
    const t = document.createElement("pre");
    t.classList.add("json-viewer__pre"), t.textContent = JSON.stringify(e, null, 2), qo.highlightElement(t), t.style.backgroundColor = "transparent", this.jsonViewerContent.appendChild(t);
  }
  clear() {
  }
}
class Ga extends gr {
  constructor() {
    super("console-message-overlay");
    const e = document.createElement("div");
    e.classList.add("console-title-box"), this.root.appendChild(e), this.titleTextDiv = document.createElement("div"), this.titleTextDiv.classList.add("console-title-box__text"), e.appendChild(this.titleTextDiv), this.jsonViewer = new ja(), this.jsonViewer.mount(this.root);
    const t = new Wa();
    t.setCopyTarget(this.jsonViewer.root), t.mount(e);
  }
  displayMessage(e, t) {
    this.titleTextDiv.innerHTML = e, this.jsonViewer.displayAsJson(t), super.setVisibility(!0);
  }
  hide() {
    this.titleTextDiv.innerHTML = "", this.jsonViewer.clear(), super.setVisibility(!1);
  }
}
class Wa extends qe {
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
class Xa extends gr {
  constructor() {
    super("session-finished-overlay"), this.submitButton = new Ya(), this.submitButton.mount(this.root), this.messageBox = document.createElement("div"), this.messageBox.classList.add("debrief-message-box"), this.root.appendChild(this.messageBox), this.messageSpan = document.createElement("span"), this.messageSpan.classList.add("debrief-message-box__text"), this.messageBox.appendChild(this.messageSpan);
  }
  show(e, t) {
    e.length == 0 ? this.messageBox.style.visibility = "hidden" : this.messageBox.style.visibility = "visible", this.messageSpan.textContent = e, this.submitButton.attachClickListener(t), this.setVisibility(!0);
  }
  hide() {
    this.messageSpan.textContent = "", super.setVisibility(!1), this.submitButton.removeAllEventListeners();
  }
}
class Ya extends qe {
  constructor() {
    super();
    const e = document.createElement("button");
    e.classList.add("submit-button"), e.textContent = "Press to Submit", this.root = e;
  }
  attachClickListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class Ka extends gr {
  constructor() {
    super("session-started-overlay"), this.startButton = new Za(), this.startButton.mount(this.root);
  }
  show(e) {
    this.startButton.attachClickListener(e), this.setVisibility(!0);
  }
  hide() {
    super.setVisibility(!1), this.startButton.removeAllEventListeners();
  }
}
class Za extends qe {
  constructor() {
    super();
    const e = document.createElement("button");
    e.classList.add("start-button"), e.textContent = "Press to Start", this.root = e;
  }
  attachClickListener(e) {
    this._registerEventListener(this.root, "click", e);
  }
}
class Qa extends qe {
  constructor() {
    super(), this.root = document.createElement("div"), this.root.className = "shell-ui", this.progressBar = new Ba("cognition"), this.progressBar.mount(this.root), this.statusDot = new Da(), this.statusDot.mount(this.root), this.sessionConnectingOverlay = new za(), this.sessionConnectingOverlay.mount(this.root), this.overlayConsoleMessage = new Ga(), this.overlayConsoleMessage.mount(this.root), this.sessionFinishedOverlay = new Xa(), this.sessionFinishedOverlay.mount(this.root), this.sessionStartedOverlay = new Ka(), this.sessionStartedOverlay.mount(this.root);
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
    await new Promise((t, n) => {
      this.sessionStartedOverlay.show(
        () => {
          this.sessionStartedOverlay.hide(), t();
        }
      );
    });
  }
  async playEndScreen(e = "", t = 1e4) {
    let n = new Promise((o, s) => {
      this.sessionFinishedOverlay.show(
        e,
        () => {
          this.sessionFinishedOverlay.hide(), o();
        }
      );
    });
    await n;
    let i = new Promise((o, s) => {
      setTimeout(() => {
        this.sessionFinishedOverlay.hide(), o();
      }, t);
    });
    await Promise.race([n, i]);
  }
}
function Ja() {
  const r = document.createElement("div");
  return r.className = "board-views-ui", r;
}
class el {
  constructor(e, t) {
    this.subscriptions = [], this.target = e, this.clock = t, this.boardCoordinateSystem = this.getCoordinateSystem();
    const n = () => {
      this.boardCoordinateSystem = this.getCoordinateSystem();
    };
    window.addEventListener("resize", n);
    let i = !1, o = 0;
    const s = 30, a = (l) => {
      if (!this.clock.checkClockStarted()) {
        console.warn("PointerStream: clock has not started.");
        return;
      }
      i || (this.boardCoordinateSystem = this.getCoordinateSystem(), i = !0);
      let c;
      switch (l.type) {
        case "pointermove":
          if (l.timeStamp - o < 1e3 / s)
            return;
          c = "move", o = l.timeStamp;
          break;
        case "pointerdown":
          if (l.button !== 0)
            return;
          c = "down";
          break;
        case "pointerup":
          if (l.button !== 0)
            return;
          c = "up";
          break;
        default:
          return;
      }
      const { x: u, y: p } = this.boardCoordinateSystem.getBoardLocationFromPointerEvent(l), f = {
        sampleType: c,
        x: u,
        y: p,
        t: t.now()
      };
      this.subscriptions.forEach((E) => E(f));
    };
    this.target.addEventListener("pointermove", a), this.target.addEventListener("pointerdown", a), this.target.addEventListener("pointerup", a);
  }
  getCoordinateSystem() {
    return new jo(this.target);
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
class tl {
  constructor(e) {
    this.listeners = [], this.holdingKeys = /* @__PURE__ */ new Set(), this.handleKeyDown = (t) => {
      if (!this.clock.checkClockStarted()) {
        console.warn("KeyStream: clock has not started.");
        return;
      }
      if (this.holdingKeys.has(t.key) && t.repeat)
        return;
      this.holdingKeys.add(t.key);
      const n = {
        sampleType: "down",
        key: t.key,
        t: this.clock.now()
      };
      this.emit(n);
    }, this.handleKeyUp = (t) => {
      if (!this.clock.checkClockStarted()) {
        console.warn("KeyStream: clock has not started.");
        return;
      }
      this.holdingKeys.delete(t.key);
      const n = {
        sampleType: "up",
        key: t.key,
        t: this.clock.now()
      };
      this.emit(n);
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
class jo {
  constructor(e) {
    const { width: t, height: n, left: i, top: o } = e.getBoundingClientRect();
    this.boardWidthPx = t, this.boardHeightPx = n, this.boardLeftPx = i, this.boardTopPx = o;
  }
  getUnitPx() {
    return Math.min(this.boardWidthPx, this.boardHeightPx);
  }
  getBoardLocationPx(e, t, n, i) {
    const o = this.getUnitPx(), s = this.boardWidthPx / o, a = this.boardHeightPx / o, l = o * (e - n / 2 + s / 2), c = o * (-t - i / 2 + a / 2);
    return {
      leftPx: l,
      topPx: c
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
    let t = (e.clientX - this.boardLeftPx) / this.boardWidthPx - 0.5, n = -((e.clientY - this.boardTopPx) / this.boardHeightPx - 0.5);
    const i = 10;
    return t = parseFloat(t.toFixed(i)), n = parseFloat(n.toFixed(i)), {
      x: t,
      y: n
    };
  }
}
class nl {
  constructor(e, t) {
    this.root = document.createElement("div"), this.root.className = "board-view", this.root.style.backgroundColor = e, document.body.style.backgroundColor = e, this.clock = t, this.pointerStream = new el(this.root, this.clock), this.keyStream = new tl(this.clock), this.setBoardState(!1, !1);
  }
  getCoordinateSystem() {
    return new jo(this.root);
  }
  setBoardState(e, t) {
    e ? this.root.style.opacity = "1" : this.root.style.opacity = "0", t ? (this.root.removeAttribute("disabled"), this.root.style.pointerEvents = "", this.root.style.userSelect = "", this.root.style.opacity = "") : (this.root.setAttribute("disabled", "true"), this.root.style.pointerEvents = "none", this.root.style.userSelect = "none");
  }
}
function Yi(r, e) {
  const t = document.createElement("div");
  t.classList.add("board-region");
  const { leftPx: n, topPx: i } = e.getBoardLocationPx(
    r.x,
    r.y,
    r.w,
    r.h
  ), { widthPx: o, heightPx: s } = e.getBoardRectanglePx(
    r.w,
    r.h
  );
  switch (t.style.left = `${n}px`, t.style.top = `${i}px`, t.style.width = `${o}px`, t.style.height = `${s}px`, r.mask) {
    case "ellipse":
      t.style.borderRadius = "50%";
      break;
    case "rectangle":
      break;
    default:
      const a = r.mask;
      console.warn(`Found unsupported Region.mask ${a}. Region: ${JSON.stringify(r)}`);
      break;
  }
  return typeof r.z_index == "number" && (t.style.zIndex = r.z_index.toString()), t;
}
class rl {
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
    }, n = this.events.findIndex((i) => i.triggerTimeMsec > t.triggerTimeMsec);
    n === -1 ? this.events.push(t) : this.events.splice(n, 0, t);
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
class Go {
  constructor(e, t) {
    this.card = e, this.root = t;
  }
  onStart() {
  }
  onDestroy() {
  }
}
class Ki extends Go {
  constructor(e, t) {
    const n = Yi(e.region, t);
    super(e, n), this.boardCoords = t;
  }
  setHoverState(e) {
    e ? this.root.classList.add("card--hovered") : this.root.classList.remove("card--hovered");
  }
  setSelectedState(e) {
    e ? this.root.classList.add("card--selected") : this.root.classList.remove("card--selected");
  }
  setOpacity(e) {
    this.root.style.opacity = `${Math.min(1, Math.max(0, e)) * 100}%`;
  }
  checkPointInCard(e, t) {
    const n = this.card.region;
    switch (n.mask) {
      case "rectangle":
        const i = n.x - n.w / 2, o = n.x + n.w / 2, s = n.y + n.h / 2, a = n.y - n.h / 2;
        return e >= i && e <= o && t >= a && t <= s;
      case "ellipse":
        const l = n.w / 2, c = n.h / 2, u = e - n.x, p = t - n.y;
        return u * u / (l * l) + p * p / (c * c) <= 1;
      default:
        throw new Error(`Unknown mask: ${n.mask}`);
    }
  }
}
class il extends Go {
  constructor(e, t) {
    const n = document.createElement("div");
    super(e, n), this.childViews = t;
    for (let [i, o] of Object.entries(this.childViews))
      this.root.appendChild(o.root);
  }
  async prepare(e) {
  }
  onStart() {
    for (let e of Object.values(this.childViews))
      e.onStart();
  }
  onDestroy() {
    for (let e of Object.values(this.childViews))
      e.onDestroy();
  }
  setHoverState(e) {
    for (const t of Object.values(this.childViews))
      t.setHoverState(e);
  }
  setSelectedState(e) {
    for (const t of Object.values(this.childViews))
      t.setSelectedState(e);
  }
  setOpacity(e) {
    for (const t of Object.values(this.childViews))
      t.setOpacity(e);
  }
  checkPointInCard(e, t) {
    for (const n of Object.values(this.childViews))
      if (n.checkPointInCard(e, t))
        return !0;
    return !1;
  }
}
class sl extends Ki {
  async prepare(e) {
    this.imageContainer = document.createElement("div"), this.imageContainer.classList.add("image-card"), this.root.appendChild(this.imageContainer), this.image = await e.getImageElement(
      this.card.image
    ), this.image.classList.add("image-card__content"), this.image.draggable = !1, this.imageContainer.appendChild(this.image);
  }
}
class ol extends Ki {
  async prepare(e) {
    this.videoContainer = document.createElement("div"), this.videoContainer.classList.add("video-card"), this.root.appendChild(this.videoContainer), this.video = await e.getVideoElement(
      this.card.video
    ), this.video.classList.add("video-card__content"), this.videoContainer.appendChild(this.video), this.video.muted = !0, this.video.loop = this.card.loop, this.video.draggable = !0;
  }
  onStart() {
    if (!this.video)
      throw new Error("Video not initialized. Did you forget to call load()?");
    let e = new Promise((i, o) => {
      setTimeout(() => {
        o(new Error("Video failed to play within 4 frames!"));
      }, 66);
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
  onDestroy() {
    this.video && (this.video.removeAttribute("src"), this.video.load());
  }
}
function Zi() {
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
var Ut = Zi();
function Wo(r) {
  Ut = r;
}
var On = { exec: () => null };
function ae(r, e = "") {
  let t = typeof r == "string" ? r : r.source;
  const n = {
    replace: (i, o) => {
      let s = typeof o == "string" ? o : o.source;
      return s = s.replace(Ce.caret, "$1"), t = t.replace(i, s), n;
    },
    getRegex: () => new RegExp(t, e)
  };
  return n;
}
var Ce = {
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
  listItemRegex: (r) => new RegExp(`^( {0,3}${r})((?:[	 ][^\\n]*)?(?:\\n|$))`),
  nextBulletRegex: (r) => new RegExp(`^ {0,${Math.min(3, r - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
  hrRegex: (r) => new RegExp(`^ {0,${Math.min(3, r - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
  fencesBeginRegex: (r) => new RegExp(`^ {0,${Math.min(3, r - 1)}}(?:\`\`\`|~~~)`),
  headingBeginRegex: (r) => new RegExp(`^ {0,${Math.min(3, r - 1)}}#`),
  htmlBeginRegex: (r) => new RegExp(`^ {0,${Math.min(3, r - 1)}}<(?:[a-z].*>|!--)`, "i")
}, al = /^(?:[ \t]*(?:\n|$))+/, ll = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, cl = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Pn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, ul = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Qi = /(?:[*+-]|\d{1,9}[.)])/, Xo = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Yo = ae(Xo).replace(/bull/g, Qi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), hl = ae(Xo).replace(/bull/g, Qi).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Ji = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, dl = /^[^\n]+/, es = /(?!\s*\])(?:\\.|[^\[\]\\])+/, fl = ae(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", es).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), pl = ae(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Qi).getRegex(), mr = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", ts = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, gl = ae(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", ts).replace("tag", mr).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Ko = ae(Ji).replace("hr", Pn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", mr).getRegex(), ml = ae(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Ko).getRegex(), ns = {
  blockquote: ml,
  code: ll,
  def: fl,
  fences: cl,
  heading: ul,
  hr: Pn,
  html: gl,
  lheading: Yo,
  list: pl,
  newline: al,
  paragraph: Ko,
  table: On,
  text: dl
}, Ps = ae(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", Pn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", mr).getRegex(), wl = {
  ...ns,
  lheading: hl,
  table: Ps,
  paragraph: ae(Ji).replace("hr", Pn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Ps).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", mr).getRegex()
}, bl = {
  ...ns,
  html: ae(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", ts).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: On,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: ae(Ji).replace("hr", Pn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Yo).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, El = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, vl = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Zo = /^( {2,}|\\)\n(?!\s*$)/, yl = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, wr = /[\p{P}\p{S}]/u, rs = /[\s\p{P}\p{S}]/u, Qo = /[^\s\p{P}\p{S}]/u, kl = ae(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, rs).getRegex(), Jo = /(?!~)[\p{P}\p{S}]/u, Sl = /(?!~)[\s\p{P}\p{S}]/u, _l = /(?:[^\s\p{P}\p{S}]|~)/u, xl = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, ea = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Tl = ae(ea, "u").replace(/punct/g, wr).getRegex(), Rl = ae(ea, "u").replace(/punct/g, Jo).getRegex(), ta = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Al = ae(ta, "gu").replace(/notPunctSpace/g, Qo).replace(/punctSpace/g, rs).replace(/punct/g, wr).getRegex(), Cl = ae(ta, "gu").replace(/notPunctSpace/g, _l).replace(/punctSpace/g, Sl).replace(/punct/g, Jo).getRegex(), Ll = ae(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, Qo).replace(/punctSpace/g, rs).replace(/punct/g, wr).getRegex(), Ol = ae(/\\(punct)/, "gu").replace(/punct/g, wr).getRegex(), Il = ae(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Nl = ae(ts).replace("(?:-->|$)", "-->").getRegex(), Pl = ae(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", Nl).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), ur = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, $l = ae(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", ur).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), na = ae(/^!?\[(label)\]\[(ref)\]/).replace("label", ur).replace("ref", es).getRegex(), ra = ae(/^!?\[(ref)\](?:\[\])?/).replace("ref", es).getRegex(), Ml = ae("reflink|nolink(?!\\()", "g").replace("reflink", na).replace("nolink", ra).getRegex(), is = {
  _backpedal: On,
  // only used for GFM url
  anyPunctuation: Ol,
  autolink: Il,
  blockSkip: xl,
  br: Zo,
  code: vl,
  del: On,
  emStrongLDelim: Tl,
  emStrongRDelimAst: Al,
  emStrongRDelimUnd: Ll,
  escape: El,
  link: $l,
  nolink: ra,
  punctuation: kl,
  reflink: na,
  reflinkSearch: Ml,
  tag: Pl,
  text: yl,
  url: On
}, Dl = {
  ...is,
  link: ae(/^!?\[(label)\]\((.*?)\)/).replace("label", ur).getRegex(),
  reflink: ae(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", ur).getRegex()
}, zi = {
  ...is,
  emStrongRDelimAst: Cl,
  emStrongLDelim: Rl,
  url: ae(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, Bl = {
  ...zi,
  br: ae(Zo).replace("{2,}", "*").getRegex(),
  text: ae(zi.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Jn = {
  normal: ns,
  gfm: wl,
  pedantic: bl
}, kn = {
  normal: is,
  gfm: zi,
  breaks: Bl,
  pedantic: Dl
}, Ul = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, $s = (r) => Ul[r];
function rt(r, e) {
  if (e) {
    if (Ce.escapeTest.test(r))
      return r.replace(Ce.escapeReplace, $s);
  } else if (Ce.escapeTestNoEncode.test(r))
    return r.replace(Ce.escapeReplaceNoEncode, $s);
  return r;
}
function Ms(r) {
  try {
    r = encodeURI(r).replace(Ce.percentDecode, "%");
  } catch {
    return null;
  }
  return r;
}
function Ds(r, e) {
  const t = r.replace(Ce.findPipe, (o, s, a) => {
    let l = !1, c = s;
    for (; --c >= 0 && a[c] === "\\"; ) l = !l;
    return l ? "|" : " |";
  }), n = t.split(Ce.splitPipe);
  let i = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e)
    if (n.length > e)
      n.splice(e);
    else
      for (; n.length < e; ) n.push("");
  for (; i < n.length; i++)
    n[i] = n[i].trim().replace(Ce.slashPipe, "|");
  return n;
}
function Sn(r, e, t) {
  const n = r.length;
  if (n === 0)
    return "";
  let i = 0;
  for (; i < n && r.charAt(n - i - 1) === e; )
    i++;
  return r.slice(0, n - i);
}
function zl(r, e) {
  if (r.indexOf(e[1]) === -1)
    return -1;
  let t = 0;
  for (let n = 0; n < r.length; n++)
    if (r[n] === "\\")
      n++;
    else if (r[n] === e[0])
      t++;
    else if (r[n] === e[1] && (t--, t < 0))
      return n;
  return t > 0 ? -2 : -1;
}
function Bs(r, e, t, n, i) {
  const o = e.href, s = e.title || null, a = r[1].replace(i.other.outputLinkReplace, "$1");
  n.state.inLink = !0;
  const l = {
    type: r[0].charAt(0) === "!" ? "image" : "link",
    raw: t,
    href: o,
    title: s,
    text: a,
    tokens: n.inlineTokens(a)
  };
  return n.state.inLink = !1, l;
}
function Vl(r, e, t) {
  const n = r.match(t.other.indentCodeCompensation);
  if (n === null)
    return e;
  const i = n[1];
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
var hr = class {
  options;
  rules;
  // set by the lexer
  lexer;
  // set by the lexer
  constructor(r) {
    this.options = r || Ut;
  }
  space(r) {
    const e = this.rules.block.newline.exec(r);
    if (e && e[0].length > 0)
      return {
        type: "space",
        raw: e[0]
      };
  }
  code(r) {
    const e = this.rules.block.code.exec(r);
    if (e) {
      const t = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return {
        type: "code",
        raw: e[0],
        codeBlockStyle: "indented",
        text: this.options.pedantic ? t : Sn(t, `
`)
      };
    }
  }
  fences(r) {
    const e = this.rules.block.fences.exec(r);
    if (e) {
      const t = e[0], n = Vl(t, e[3] || "", this.rules);
      return {
        type: "code",
        raw: t,
        lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2],
        text: n
      };
    }
  }
  heading(r) {
    const e = this.rules.block.heading.exec(r);
    if (e) {
      let t = e[2].trim();
      if (this.rules.other.endingHash.test(t)) {
        const n = Sn(t, "#");
        (this.options.pedantic || !n || this.rules.other.endingSpaceChar.test(n)) && (t = n.trim());
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
  hr(r) {
    const e = this.rules.block.hr.exec(r);
    if (e)
      return {
        type: "hr",
        raw: Sn(e[0], `
`)
      };
  }
  blockquote(r) {
    const e = this.rules.block.blockquote.exec(r);
    if (e) {
      let t = Sn(e[0], `
`).split(`
`), n = "", i = "";
      const o = [];
      for (; t.length > 0; ) {
        let s = !1;
        const a = [];
        let l;
        for (l = 0; l < t.length; l++)
          if (this.rules.other.blockquoteStart.test(t[l]))
            a.push(t[l]), s = !0;
          else if (!s)
            a.push(t[l]);
          else
            break;
        t = t.slice(l);
        const c = a.join(`
`), u = c.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        n = n ? `${n}
${c}` : c, i = i ? `${i}
${u}` : u;
        const p = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(u, o, !0), this.lexer.state.top = p, t.length === 0)
          break;
        const f = o.at(-1);
        if (f?.type === "code")
          break;
        if (f?.type === "blockquote") {
          const E = f, R = E.raw + `
` + t.join(`
`), w = this.blockquote(R);
          o[o.length - 1] = w, n = n.substring(0, n.length - E.raw.length) + w.raw, i = i.substring(0, i.length - E.text.length) + w.text;
          break;
        } else if (f?.type === "list") {
          const E = f, R = E.raw + `
` + t.join(`
`), w = this.list(R);
          o[o.length - 1] = w, n = n.substring(0, n.length - f.raw.length) + w.raw, i = i.substring(0, i.length - E.raw.length) + w.raw, t = R.substring(o.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return {
        type: "blockquote",
        raw: n,
        tokens: o,
        text: i
      };
    }
  }
  list(r) {
    let e = this.rules.block.list.exec(r);
    if (e) {
      let t = e[1].trim();
      const n = t.length > 1, i = {
        type: "list",
        raw: "",
        ordered: n,
        start: n ? +t.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      t = n ? `\\d{1,9}\\${t.slice(-1)}` : `\\${t}`, this.options.pedantic && (t = n ? t : "[*+-]");
      const o = this.rules.other.listItemRegex(t);
      let s = !1;
      for (; r; ) {
        let l = !1, c = "", u = "";
        if (!(e = o.exec(r)) || this.rules.block.hr.test(r))
          break;
        c = e[0], r = r.substring(c.length);
        let p = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (j) => " ".repeat(3 * j.length)), f = r.split(`
`, 1)[0], E = !p.trim(), R = 0;
        if (this.options.pedantic ? (R = 2, u = p.trimStart()) : E ? R = e[1].length + 1 : (R = e[2].search(this.rules.other.nonSpaceChar), R = R > 4 ? 1 : R, u = p.slice(R), R += e[1].length), E && this.rules.other.blankLine.test(f) && (c += f + `
`, r = r.substring(f.length + 1), l = !0), !l) {
          const j = this.rules.other.nextBulletRegex(R), J = this.rules.other.hrRegex(R), Q = this.rules.other.fencesBeginRegex(R), ee = this.rules.other.headingBeginRegex(R), he = this.rules.other.htmlBeginRegex(R);
          for (; r; ) {
            const ne = r.split(`
`, 1)[0];
            let oe;
            if (f = ne, this.options.pedantic ? (f = f.replace(this.rules.other.listReplaceNesting, "  "), oe = f) : oe = f.replace(this.rules.other.tabCharGlobal, "    "), Q.test(f) || ee.test(f) || he.test(f) || j.test(f) || J.test(f))
              break;
            if (oe.search(this.rules.other.nonSpaceChar) >= R || !f.trim())
              u += `
` + oe.slice(R);
            else {
              if (E || p.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || Q.test(p) || ee.test(p) || J.test(p))
                break;
              u += `
` + f;
            }
            !E && !f.trim() && (E = !0), c += ne + `
`, r = r.substring(ne.length + 1), p = oe.slice(R);
          }
        }
        i.loose || (s ? i.loose = !0 : this.rules.other.doubleBlankLine.test(c) && (s = !0));
        let w = null, N;
        this.options.gfm && (w = this.rules.other.listIsTask.exec(u), w && (N = w[0] !== "[ ] ", u = u.replace(this.rules.other.listReplaceTask, ""))), i.items.push({
          type: "list_item",
          raw: c,
          task: !!w,
          checked: N,
          loose: !1,
          text: u,
          tokens: []
        }), i.raw += c;
      }
      const a = i.items.at(-1);
      if (a)
        a.raw = a.raw.trimEnd(), a.text = a.text.trimEnd();
      else
        return;
      i.raw = i.raw.trimEnd();
      for (let l = 0; l < i.items.length; l++)
        if (this.lexer.state.top = !1, i.items[l].tokens = this.lexer.blockTokens(i.items[l].text, []), !i.loose) {
          const c = i.items[l].tokens.filter((p) => p.type === "space"), u = c.length > 0 && c.some((p) => this.rules.other.anyLine.test(p.raw));
          i.loose = u;
        }
      if (i.loose)
        for (let l = 0; l < i.items.length; l++)
          i.items[l].loose = !0;
      return i;
    }
  }
  html(r) {
    const e = this.rules.block.html.exec(r);
    if (e)
      return {
        type: "html",
        block: !0,
        raw: e[0],
        pre: e[1] === "pre" || e[1] === "script" || e[1] === "style",
        text: e[0]
      };
  }
  def(r) {
    const e = this.rules.block.def.exec(r);
    if (e) {
      const t = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), n = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return {
        type: "def",
        tag: t,
        raw: e[0],
        href: n,
        title: i
      };
    }
  }
  table(r) {
    const e = this.rules.block.table.exec(r);
    if (!e || !this.rules.other.tableDelimiter.test(e[2]))
      return;
    const t = Ds(e[1]), n = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], o = {
      type: "table",
      raw: e[0],
      header: [],
      align: [],
      rows: []
    };
    if (t.length === n.length) {
      for (const s of n)
        this.rules.other.tableAlignRight.test(s) ? o.align.push("right") : this.rules.other.tableAlignCenter.test(s) ? o.align.push("center") : this.rules.other.tableAlignLeft.test(s) ? o.align.push("left") : o.align.push(null);
      for (let s = 0; s < t.length; s++)
        o.header.push({
          text: t[s],
          tokens: this.lexer.inline(t[s]),
          header: !0,
          align: o.align[s]
        });
      for (const s of i)
        o.rows.push(Ds(s, o.header.length).map((a, l) => ({
          text: a,
          tokens: this.lexer.inline(a),
          header: !1,
          align: o.align[l]
        })));
      return o;
    }
  }
  lheading(r) {
    const e = this.rules.block.lheading.exec(r);
    if (e)
      return {
        type: "heading",
        raw: e[0],
        depth: e[2].charAt(0) === "=" ? 1 : 2,
        text: e[1],
        tokens: this.lexer.inline(e[1])
      };
  }
  paragraph(r) {
    const e = this.rules.block.paragraph.exec(r);
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
  text(r) {
    const e = this.rules.block.text.exec(r);
    if (e)
      return {
        type: "text",
        raw: e[0],
        text: e[0],
        tokens: this.lexer.inline(e[0])
      };
  }
  escape(r) {
    const e = this.rules.inline.escape.exec(r);
    if (e)
      return {
        type: "escape",
        raw: e[0],
        text: e[1]
      };
  }
  tag(r) {
    const e = this.rules.inline.tag.exec(r);
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
  link(r) {
    const e = this.rules.inline.link.exec(r);
    if (e) {
      const t = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(t)) {
        if (!this.rules.other.endAngleBracket.test(t))
          return;
        const o = Sn(t.slice(0, -1), "\\");
        if ((t.length - o.length) % 2 === 0)
          return;
      } else {
        const o = zl(e[2], "()");
        if (o === -2)
          return;
        if (o > -1) {
          const a = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + o;
          e[2] = e[2].substring(0, o), e[0] = e[0].substring(0, a).trim(), e[3] = "";
        }
      }
      let n = e[2], i = "";
      if (this.options.pedantic) {
        const o = this.rules.other.pedanticHrefTitle.exec(n);
        o && (n = o[1], i = o[3]);
      } else
        i = e[3] ? e[3].slice(1, -1) : "";
      return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(t) ? n = n.slice(1) : n = n.slice(1, -1)), Bs(e, {
        href: n && n.replace(this.rules.inline.anyPunctuation, "$1"),
        title: i && i.replace(this.rules.inline.anyPunctuation, "$1")
      }, e[0], this.lexer, this.rules);
    }
  }
  reflink(r, e) {
    let t;
    if ((t = this.rules.inline.reflink.exec(r)) || (t = this.rules.inline.nolink.exec(r))) {
      const n = (t[2] || t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i = e[n.toLowerCase()];
      if (!i) {
        const o = t[0].charAt(0);
        return {
          type: "text",
          raw: o,
          text: o
        };
      }
      return Bs(t, i, t[0], this.lexer, this.rules);
    }
  }
  emStrong(r, e, t = "") {
    let n = this.rules.inline.emStrongLDelim.exec(r);
    if (!n || n[3] && t.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(n[1] || n[2] || "") || !t || this.rules.inline.punctuation.exec(t)) {
      const o = [...n[0]].length - 1;
      let s, a, l = o, c = 0;
      const u = n[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (u.lastIndex = 0, e = e.slice(-1 * r.length + o); (n = u.exec(e)) != null; ) {
        if (s = n[1] || n[2] || n[3] || n[4] || n[5] || n[6], !s) continue;
        if (a = [...s].length, n[3] || n[4]) {
          l += a;
          continue;
        } else if ((n[5] || n[6]) && o % 3 && !((o + a) % 3)) {
          c += a;
          continue;
        }
        if (l -= a, l > 0) continue;
        a = Math.min(a, a + l + c);
        const p = [...n[0]][0].length, f = r.slice(0, o + n.index + p + a);
        if (Math.min(o, a) % 2) {
          const R = f.slice(1, -1);
          return {
            type: "em",
            raw: f,
            text: R,
            tokens: this.lexer.inlineTokens(R)
          };
        }
        const E = f.slice(2, -2);
        return {
          type: "strong",
          raw: f,
          text: E,
          tokens: this.lexer.inlineTokens(E)
        };
      }
    }
  }
  codespan(r) {
    const e = this.rules.inline.code.exec(r);
    if (e) {
      let t = e[2].replace(this.rules.other.newLineCharGlobal, " ");
      const n = this.rules.other.nonSpaceChar.test(t), i = this.rules.other.startingSpaceChar.test(t) && this.rules.other.endingSpaceChar.test(t);
      return n && i && (t = t.substring(1, t.length - 1)), {
        type: "codespan",
        raw: e[0],
        text: t
      };
    }
  }
  br(r) {
    const e = this.rules.inline.br.exec(r);
    if (e)
      return {
        type: "br",
        raw: e[0]
      };
  }
  del(r) {
    const e = this.rules.inline.del.exec(r);
    if (e)
      return {
        type: "del",
        raw: e[0],
        text: e[2],
        tokens: this.lexer.inlineTokens(e[2])
      };
  }
  autolink(r) {
    const e = this.rules.inline.autolink.exec(r);
    if (e) {
      let t, n;
      return e[2] === "@" ? (t = e[1], n = "mailto:" + t) : (t = e[1], n = t), {
        type: "link",
        raw: e[0],
        text: t,
        href: n,
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
  url(r) {
    let e;
    if (e = this.rules.inline.url.exec(r)) {
      let t, n;
      if (e[2] === "@")
        t = e[0], n = "mailto:" + t;
      else {
        let i;
        do
          i = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (i !== e[0]);
        t = e[0], e[1] === "www." ? n = "http://" + e[0] : n = e[0];
      }
      return {
        type: "link",
        raw: e[0],
        text: t,
        href: n,
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
  inlineText(r) {
    const e = this.rules.inline.text.exec(r);
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
}, gt = class Vi {
  tokens;
  options;
  state;
  tokenizer;
  inlineQueue;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Ut, this.options.tokenizer = this.options.tokenizer || new hr(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const t = {
      other: Ce,
      block: Jn.normal,
      inline: kn.normal
    };
    this.options.pedantic ? (t.block = Jn.pedantic, t.inline = kn.pedantic) : this.options.gfm && (t.block = Jn.gfm, this.options.breaks ? t.inline = kn.breaks : t.inline = kn.gfm), this.tokenizer.rules = t;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: Jn,
      inline: kn
    };
  }
  /**
   * Static Lex Method
   */
  static lex(e, t) {
    return new Vi(t).lex(e);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(e, t) {
    return new Vi(t).inlineTokens(e);
  }
  /**
   * Preprocessing
   */
  lex(e) {
    e = e.replace(Ce.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      const n = this.inlineQueue[t];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], n = !1) {
    for (this.options.pedantic && (e = e.replace(Ce.tabCharGlobal, "    ").replace(Ce.spaceLine, "")); e; ) {
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
        let l;
        this.options.extensions.startBlock.forEach((c) => {
          l = c.call({ lexer: this }, a), typeof l == "number" && l >= 0 && (s = Math.min(s, l));
        }), s < 1 / 0 && s >= 0 && (o = e.substring(0, s + 1));
      }
      if (this.state.top && (i = this.tokenizer.paragraph(o))) {
        const s = t.at(-1);
        n && s?.type === "paragraph" ? (s.raw += `
` + i.raw, s.text += `
` + i.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(i), n = o.length !== e.length, e = e.substring(i.raw.length);
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
    let n = e, i = null;
    if (this.tokens.links) {
      const a = Object.keys(this.tokens.links);
      if (a.length > 0)
        for (; (i = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null; )
          a.includes(i[0].slice(i[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, i.index) + "[" + "a".repeat(i[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (i = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null; )
      n = n.slice(0, i.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (i = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; )
      n = n.slice(0, i.index) + "[" + "a".repeat(i[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    let o = !1, s = "";
    for (; e; ) {
      o || (s = ""), o = !1;
      let a;
      if (this.options.extensions?.inline?.some((c) => (a = c.call({ lexer: this }, e, t)) ? (e = e.substring(a.raw.length), t.push(a), !0) : !1))
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
        const c = t.at(-1);
        a.type === "text" && c?.type === "text" ? (c.raw += a.raw, c.text += a.text) : t.push(a);
        continue;
      }
      if (a = this.tokenizer.emStrong(e, n, s)) {
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
      let l = e;
      if (this.options.extensions?.startInline) {
        let c = 1 / 0;
        const u = e.slice(1);
        let p;
        this.options.extensions.startInline.forEach((f) => {
          p = f.call({ lexer: this }, u), typeof p == "number" && p >= 0 && (c = Math.min(c, p));
        }), c < 1 / 0 && c >= 0 && (l = e.substring(0, c + 1));
      }
      if (a = this.tokenizer.inlineText(l)) {
        e = e.substring(a.raw.length), a.raw.slice(-1) !== "_" && (s = a.raw.slice(-1)), o = !0;
        const c = t.at(-1);
        c?.type === "text" ? (c.raw += a.raw, c.text += a.text) : t.push(a);
        continue;
      }
      if (e) {
        const c = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(c);
          break;
        } else
          throw new Error(c);
      }
    }
    return t;
  }
}, dr = class {
  options;
  parser;
  // set by the parser
  constructor(r) {
    this.options = r || Ut;
  }
  space(r) {
    return "";
  }
  code({ text: r, lang: e, escaped: t }) {
    const n = (e || "").match(Ce.notSpaceStart)?.[0], i = r.replace(Ce.endingNewline, "") + `
`;
    return n ? '<pre><code class="language-' + rt(n) + '">' + (t ? i : rt(i, !0)) + `</code></pre>
` : "<pre><code>" + (t ? i : rt(i, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: r }) {
    return `<blockquote>
${this.parser.parse(r)}</blockquote>
`;
  }
  html({ text: r }) {
    return r;
  }
  heading({ tokens: r, depth: e }) {
    return `<h${e}>${this.parser.parseInline(r)}</h${e}>
`;
  }
  hr(r) {
    return `<hr>
`;
  }
  list(r) {
    const e = r.ordered, t = r.start;
    let n = "";
    for (let s = 0; s < r.items.length; s++) {
      const a = r.items[s];
      n += this.listitem(a);
    }
    const i = e ? "ol" : "ul", o = e && t !== 1 ? ' start="' + t + '"' : "";
    return "<" + i + o + `>
` + n + "</" + i + `>
`;
  }
  listitem(r) {
    let e = "";
    if (r.task) {
      const t = this.checkbox({ checked: !!r.checked });
      r.loose ? r.tokens[0]?.type === "paragraph" ? (r.tokens[0].text = t + " " + r.tokens[0].text, r.tokens[0].tokens && r.tokens[0].tokens.length > 0 && r.tokens[0].tokens[0].type === "text" && (r.tokens[0].tokens[0].text = t + " " + rt(r.tokens[0].tokens[0].text), r.tokens[0].tokens[0].escaped = !0)) : r.tokens.unshift({
        type: "text",
        raw: t + " ",
        text: t + " ",
        escaped: !0
      }) : e += t + " ";
    }
    return e += this.parser.parse(r.tokens, !!r.loose), `<li>${e}</li>
`;
  }
  checkbox({ checked: r }) {
    return "<input " + (r ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: r }) {
    return `<p>${this.parser.parseInline(r)}</p>
`;
  }
  table(r) {
    let e = "", t = "";
    for (let i = 0; i < r.header.length; i++)
      t += this.tablecell(r.header[i]);
    e += this.tablerow({ text: t });
    let n = "";
    for (let i = 0; i < r.rows.length; i++) {
      const o = r.rows[i];
      t = "";
      for (let s = 0; s < o.length; s++)
        t += this.tablecell(o[s]);
      n += this.tablerow({ text: t });
    }
    return n && (n = `<tbody>${n}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + n + `</table>
`;
  }
  tablerow({ text: r }) {
    return `<tr>
${r}</tr>
`;
  }
  tablecell(r) {
    const e = this.parser.parseInline(r.tokens), t = r.header ? "th" : "td";
    return (r.align ? `<${t} align="${r.align}">` : `<${t}>`) + e + `</${t}>
`;
  }
  /**
   * span level renderer
   */
  strong({ tokens: r }) {
    return `<strong>${this.parser.parseInline(r)}</strong>`;
  }
  em({ tokens: r }) {
    return `<em>${this.parser.parseInline(r)}</em>`;
  }
  codespan({ text: r }) {
    return `<code>${rt(r, !0)}</code>`;
  }
  br(r) {
    return "<br>";
  }
  del({ tokens: r }) {
    return `<del>${this.parser.parseInline(r)}</del>`;
  }
  link({ href: r, title: e, tokens: t }) {
    const n = this.parser.parseInline(t), i = Ms(r);
    if (i === null)
      return n;
    r = i;
    let o = '<a href="' + r + '"';
    return e && (o += ' title="' + rt(e) + '"'), o += ">" + n + "</a>", o;
  }
  image({ href: r, title: e, text: t, tokens: n }) {
    n && (t = this.parser.parseInline(n, this.parser.textRenderer));
    const i = Ms(r);
    if (i === null)
      return rt(t);
    r = i;
    let o = `<img src="${r}" alt="${t}"`;
    return e && (o += ` title="${rt(e)}"`), o += ">", o;
  }
  text(r) {
    return "tokens" in r && r.tokens ? this.parser.parseInline(r.tokens) : "escaped" in r && r.escaped ? r.text : rt(r.text);
  }
}, ss = class {
  // no need for block level renderers
  strong({ text: r }) {
    return r;
  }
  em({ text: r }) {
    return r;
  }
  codespan({ text: r }) {
    return r;
  }
  del({ text: r }) {
    return r;
  }
  html({ text: r }) {
    return r;
  }
  text({ text: r }) {
    return r;
  }
  link({ text: r }) {
    return "" + r;
  }
  image({ text: r }) {
    return "" + r;
  }
  br() {
    return "";
  }
}, mt = class Fi {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || Ut, this.options.renderer = this.options.renderer || new dr(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new ss();
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
    let n = "";
    for (let i = 0; i < e.length; i++) {
      const o = e[i];
      if (this.options.extensions?.renderers?.[o.type]) {
        const a = o, l = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (l !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(a.type)) {
          n += l || "";
          continue;
        }
      }
      const s = o;
      switch (s.type) {
        case "space": {
          n += this.renderer.space(s);
          continue;
        }
        case "hr": {
          n += this.renderer.hr(s);
          continue;
        }
        case "heading": {
          n += this.renderer.heading(s);
          continue;
        }
        case "code": {
          n += this.renderer.code(s);
          continue;
        }
        case "table": {
          n += this.renderer.table(s);
          continue;
        }
        case "blockquote": {
          n += this.renderer.blockquote(s);
          continue;
        }
        case "list": {
          n += this.renderer.list(s);
          continue;
        }
        case "html": {
          n += this.renderer.html(s);
          continue;
        }
        case "paragraph": {
          n += this.renderer.paragraph(s);
          continue;
        }
        case "text": {
          let a = s, l = this.renderer.text(a);
          for (; i + 1 < e.length && e[i + 1].type === "text"; )
            a = e[++i], l += `
` + this.renderer.text(a);
          t ? n += this.renderer.paragraph({
            type: "paragraph",
            raw: l,
            text: l,
            tokens: [{ type: "text", raw: l, text: l, escaped: !0 }]
          }) : n += l;
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
    return n;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(e, t = this.renderer) {
    let n = "";
    for (let i = 0; i < e.length; i++) {
      const o = e[i];
      if (this.options.extensions?.renderers?.[o.type]) {
        const a = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (a !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(o.type)) {
          n += a || "";
          continue;
        }
      }
      const s = o;
      switch (s.type) {
        case "escape": {
          n += t.text(s);
          break;
        }
        case "html": {
          n += t.html(s);
          break;
        }
        case "link": {
          n += t.link(s);
          break;
        }
        case "image": {
          n += t.image(s);
          break;
        }
        case "strong": {
          n += t.strong(s);
          break;
        }
        case "em": {
          n += t.em(s);
          break;
        }
        case "codespan": {
          n += t.codespan(s);
          break;
        }
        case "br": {
          n += t.br(s);
          break;
        }
        case "del": {
          n += t.del(s);
          break;
        }
        case "text": {
          n += t.text(s);
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
    return n;
  }
}, sr = class {
  options;
  block;
  constructor(r) {
    this.options = r || Ut;
  }
  static passThroughHooks = /* @__PURE__ */ new Set([
    "preprocess",
    "postprocess",
    "processAllTokens"
  ]);
  /**
   * Process markdown before marked
   */
  preprocess(r) {
    return r;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(r) {
    return r;
  }
  /**
   * Process all tokens before walk tokens
   */
  processAllTokens(r) {
    return r;
  }
  /**
   * Provide function to tokenize markdown
   */
  provideLexer() {
    return this.block ? gt.lex : gt.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? mt.parse : mt.parseInline;
  }
}, Fl = class {
  defaults = Zi();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = mt;
  Renderer = dr;
  TextRenderer = ss;
  Lexer = gt;
  Tokenizer = hr;
  Hooks = sr;
  constructor(...r) {
    this.use(...r);
  }
  /**
   * Run callback for every token
   */
  walkTokens(r, e) {
    let t = [];
    for (const n of r)
      switch (t = t.concat(e.call(this, n)), n.type) {
        case "table": {
          const i = n;
          for (const o of i.header)
            t = t.concat(this.walkTokens(o.tokens, e));
          for (const o of i.rows)
            for (const s of o)
              t = t.concat(this.walkTokens(s.tokens, e));
          break;
        }
        case "list": {
          const i = n;
          t = t.concat(this.walkTokens(i.items, e));
          break;
        }
        default: {
          const i = n;
          this.defaults.extensions?.childTokens?.[i.type] ? this.defaults.extensions.childTokens[i.type].forEach((o) => {
            const s = i[o].flat(1 / 0);
            t = t.concat(this.walkTokens(s, e));
          }) : i.tokens && (t = t.concat(this.walkTokens(i.tokens, e)));
        }
      }
    return t;
  }
  use(...r) {
    const e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return r.forEach((t) => {
      const n = { ...t };
      if (n.async = this.defaults.async || n.async || !1, t.extensions && (t.extensions.forEach((i) => {
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
      }), n.extensions = e), t.renderer) {
        const i = this.defaults.renderer || new dr(this.defaults);
        for (const o in t.renderer) {
          if (!(o in i))
            throw new Error(`renderer '${o}' does not exist`);
          if (["options", "parser"].includes(o))
            continue;
          const s = o, a = t.renderer[s], l = i[s];
          i[s] = (...c) => {
            let u = a.apply(i, c);
            return u === !1 && (u = l.apply(i, c)), u || "";
          };
        }
        n.renderer = i;
      }
      if (t.tokenizer) {
        const i = this.defaults.tokenizer || new hr(this.defaults);
        for (const o in t.tokenizer) {
          if (!(o in i))
            throw new Error(`tokenizer '${o}' does not exist`);
          if (["options", "rules", "lexer"].includes(o))
            continue;
          const s = o, a = t.tokenizer[s], l = i[s];
          i[s] = (...c) => {
            let u = a.apply(i, c);
            return u === !1 && (u = l.apply(i, c)), u;
          };
        }
        n.tokenizer = i;
      }
      if (t.hooks) {
        const i = this.defaults.hooks || new sr();
        for (const o in t.hooks) {
          if (!(o in i))
            throw new Error(`hook '${o}' does not exist`);
          if (["options", "block"].includes(o))
            continue;
          const s = o, a = t.hooks[s], l = i[s];
          sr.passThroughHooks.has(o) ? i[s] = (c) => {
            if (this.defaults.async)
              return Promise.resolve(a.call(i, c)).then((p) => l.call(i, p));
            const u = a.call(i, c);
            return l.call(i, u);
          } : i[s] = (...c) => {
            let u = a.apply(i, c);
            return u === !1 && (u = l.apply(i, c)), u;
          };
        }
        n.hooks = i;
      }
      if (t.walkTokens) {
        const i = this.defaults.walkTokens, o = t.walkTokens;
        n.walkTokens = function(s) {
          let a = [];
          return a.push(o.call(this, s)), i && (a = a.concat(i.call(this, s))), a;
        };
      }
      this.defaults = { ...this.defaults, ...n };
    }), this;
  }
  setOptions(r) {
    return this.defaults = { ...this.defaults, ...r }, this;
  }
  lexer(r, e) {
    return gt.lex(r, e ?? this.defaults);
  }
  parser(r, e) {
    return mt.parse(r, e ?? this.defaults);
  }
  parseMarkdown(r) {
    return (t, n) => {
      const i = { ...n }, o = { ...this.defaults, ...i }, s = this.onError(!!o.silent, !!o.async);
      if (this.defaults.async === !0 && i.async === !1)
        return s(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null)
        return s(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string")
        return s(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      o.hooks && (o.hooks.options = o, o.hooks.block = r);
      const a = o.hooks ? o.hooks.provideLexer() : r ? gt.lex : gt.lexInline, l = o.hooks ? o.hooks.provideParser() : r ? mt.parse : mt.parseInline;
      if (o.async)
        return Promise.resolve(o.hooks ? o.hooks.preprocess(t) : t).then((c) => a(c, o)).then((c) => o.hooks ? o.hooks.processAllTokens(c) : c).then((c) => o.walkTokens ? Promise.all(this.walkTokens(c, o.walkTokens)).then(() => c) : c).then((c) => l(c, o)).then((c) => o.hooks ? o.hooks.postprocess(c) : c).catch(s);
      try {
        o.hooks && (t = o.hooks.preprocess(t));
        let c = a(t, o);
        o.hooks && (c = o.hooks.processAllTokens(c)), o.walkTokens && this.walkTokens(c, o.walkTokens);
        let u = l(c, o);
        return o.hooks && (u = o.hooks.postprocess(u)), u;
      } catch (c) {
        return s(c);
      }
    };
  }
  onError(r, e) {
    return (t) => {
      if (t.message += `
Please report this to https://github.com/markedjs/marked.`, r) {
        const n = "<p>An error occurred:</p><pre>" + rt(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(n) : n;
      }
      if (e)
        return Promise.reject(t);
      throw t;
    };
  }
}, Bt = new Fl();
function ue(r, e) {
  return Bt.parse(r, e);
}
ue.options = ue.setOptions = function(r) {
  return Bt.setOptions(r), ue.defaults = Bt.defaults, Wo(ue.defaults), ue;
};
ue.getDefaults = Zi;
ue.defaults = Ut;
ue.use = function(...r) {
  return Bt.use(...r), ue.defaults = Bt.defaults, Wo(ue.defaults), ue;
};
ue.walkTokens = function(r, e) {
  return Bt.walkTokens(r, e);
};
ue.parseInline = Bt.parseInline;
ue.Parser = mt;
ue.parser = mt.parse;
ue.Renderer = dr;
ue.TextRenderer = ss;
ue.Lexer = gt;
ue.lexer = gt.lex;
ue.Tokenizer = hr;
ue.Hooks = sr;
ue.parse = ue;
ue.options;
ue.setOptions;
ue.use;
ue.walkTokens;
ue.parseInline;
mt.parse;
gt.lex;
/*! @license DOMPurify 3.2.6 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.6/LICENSE */
const {
  entries: ia,
  setPrototypeOf: Us,
  isFrozen: Hl,
  getPrototypeOf: ql,
  getOwnPropertyDescriptor: jl
} = Object;
let {
  freeze: Le,
  seal: je,
  create: sa
} = Object, {
  apply: Hi,
  construct: qi
} = typeof Reflect < "u" && Reflect;
Le || (Le = function(e) {
  return e;
});
je || (je = function(e) {
  return e;
});
Hi || (Hi = function(e, t, n) {
  return e.apply(t, n);
});
qi || (qi = function(e, t) {
  return new e(...t);
});
const er = Oe(Array.prototype.forEach), Gl = Oe(Array.prototype.lastIndexOf), zs = Oe(Array.prototype.pop), _n = Oe(Array.prototype.push), Wl = Oe(Array.prototype.splice), or = Oe(String.prototype.toLowerCase), zr = Oe(String.prototype.toString), Vs = Oe(String.prototype.match), xn = Oe(String.prototype.replace), Xl = Oe(String.prototype.indexOf), Yl = Oe(String.prototype.trim), Xe = Oe(Object.prototype.hasOwnProperty), Ae = Oe(RegExp.prototype.test), Tn = Kl(TypeError);
function Oe(r) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
      n[i - 1] = arguments[i];
    return Hi(r, e, n);
  };
}
function Kl(r) {
  return function() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
      t[n] = arguments[n];
    return qi(r, t);
  };
}
function ie(r, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : or;
  Us && Us(r, null);
  let n = e.length;
  for (; n--; ) {
    let i = e[n];
    if (typeof i == "string") {
      const o = t(i);
      o !== i && (Hl(e) || (e[n] = o), i = o);
    }
    r[i] = !0;
  }
  return r;
}
function Zl(r) {
  for (let e = 0; e < r.length; e++)
    Xe(r, e) || (r[e] = null);
  return r;
}
function ht(r) {
  const e = sa(null);
  for (const [t, n] of ia(r))
    Xe(r, t) && (Array.isArray(n) ? e[t] = Zl(n) : n && typeof n == "object" && n.constructor === Object ? e[t] = ht(n) : e[t] = n);
  return e;
}
function Rn(r, e) {
  for (; r !== null; ) {
    const n = jl(r, e);
    if (n) {
      if (n.get)
        return Oe(n.get);
      if (typeof n.value == "function")
        return Oe(n.value);
    }
    r = ql(r);
  }
  function t() {
    return null;
  }
  return t;
}
const Fs = Le(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), Vr = Le(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), Fr = Le(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Ql = Le(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Hr = Le(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Jl = Le(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Hs = Le(["#text"]), qs = Le(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), qr = Le(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), js = Le(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), tr = Le(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), ec = je(/\{\{[\w\W]*|[\w\W]*\}\}/gm), tc = je(/<%[\w\W]*|[\w\W]*%>/gm), nc = je(/\$\{[\w\W]*/gm), rc = je(/^data-[\-\w.\u00B7-\uFFFF]+$/), ic = je(/^aria-[\-\w]+$/), oa = je(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), sc = je(/^(?:\w+script|data):/i), oc = je(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), aa = je(/^html$/i), ac = je(/^[a-z][.\w]*(-[.\w]+)+$/i);
var Gs = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: ic,
  ATTR_WHITESPACE: oc,
  CUSTOM_ELEMENT: ac,
  DATA_ATTR: rc,
  DOCTYPE_NAME: aa,
  ERB_EXPR: tc,
  IS_ALLOWED_URI: oa,
  IS_SCRIPT_OR_DATA: sc,
  MUSTACHE_EXPR: ec,
  TMPLIT_EXPR: nc
});
const An = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, lc = function() {
  return typeof window > "u" ? null : window;
}, cc = function(e, t) {
  if (typeof e != "object" || typeof e.createPolicy != "function")
    return null;
  let n = null;
  const i = "data-tt-policy-suffix";
  t && t.hasAttribute(i) && (n = t.getAttribute(i));
  const o = "dompurify" + (n ? "#" + n : "");
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
}, Ws = function() {
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
function la() {
  let r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : lc();
  const e = (D) => la(D);
  if (e.version = "3.2.6", e.removed = [], !r || !r.document || r.document.nodeType !== An.document || !r.Element)
    return e.isSupported = !1, e;
  let {
    document: t
  } = r;
  const n = t, i = n.currentScript, {
    DocumentFragment: o,
    HTMLTemplateElement: s,
    Node: a,
    Element: l,
    NodeFilter: c,
    NamedNodeMap: u = r.NamedNodeMap || r.MozNamedAttrMap,
    HTMLFormElement: p,
    DOMParser: f,
    trustedTypes: E
  } = r, R = l.prototype, w = Rn(R, "cloneNode"), N = Rn(R, "remove"), j = Rn(R, "nextSibling"), J = Rn(R, "childNodes"), Q = Rn(R, "parentNode");
  if (typeof s == "function") {
    const D = t.createElement("template");
    D.content && D.content.ownerDocument && (t = D.content.ownerDocument);
  }
  let ee, he = "";
  const {
    implementation: ne,
    createNodeIterator: oe,
    createDocumentFragment: F,
    getElementsByTagName: Ve
  } = t, {
    importNode: Qe
  } = n;
  let Ee = Ws();
  e.isSupported = typeof ia == "function" && typeof Q == "function" && ne && ne.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: ot,
    ERB_EXPR: at,
    TMPLIT_EXPR: A,
    DATA_ATTR: T,
    ARIA_ATTR: z,
    IS_SCRIPT_OR_DATA: P,
    ATTR_WHITESPACE: M,
    CUSTOM_ELEMENT: $
  } = Gs;
  let {
    IS_ALLOWED_URI: q
  } = Gs, V = null;
  const K = ie({}, [...Fs, ...Vr, ...Fr, ...Hr, ...Hs]);
  let W = null;
  const ye = ie({}, [...qs, ...qr, ...js, ...tr]);
  let X = Object.seal(sa(null, {
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
  })), Me = null, rn = null, Mn = !0, Dn = !0, Lt = !1, Bn = !0, Et = !1, zt = !0, lt = !1, sn = !1, on = !1, vt = !1, Vt = !1, Ft = !1, an = !0, Un = !1;
  const Sr = "user-content-";
  let Ht = !0, De = !1, ct = {}, Be = null;
  const Ot = ie({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let ln = null;
  const zn = ie({}, ["audio", "video", "img", "source", "image", "track"]);
  let cn = null;
  const Vn = ie({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), qt = "http://www.w3.org/1998/Math/MathML", jt = "http://www.w3.org/2000/svg", Fe = "http://www.w3.org/1999/xhtml";
  let yt = Fe, un = !1, hn = null;
  const dn = ie({}, [qt, jt, Fe], zr);
  let It = ie({}, ["mi", "mo", "mn", "ms", "mtext"]), Nt = ie({}, ["annotation-xml"]);
  const _r = ie({}, ["title", "style", "font", "a", "script"]);
  let kt = null;
  const St = ["application/xhtml+xml", "text/html"], h = "text/html";
  let g = null, x = null;
  const G = t.createElement("form"), be = function(d) {
    return d instanceof RegExp || d instanceof Function;
  }, we = function() {
    let d = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(x && x === d)) {
      if ((!d || typeof d != "object") && (d = {}), d = ht(d), kt = // eslint-disable-next-line unicorn/prefer-includes
      St.indexOf(d.PARSER_MEDIA_TYPE) === -1 ? h : d.PARSER_MEDIA_TYPE, g = kt === "application/xhtml+xml" ? zr : or, V = Xe(d, "ALLOWED_TAGS") ? ie({}, d.ALLOWED_TAGS, g) : K, W = Xe(d, "ALLOWED_ATTR") ? ie({}, d.ALLOWED_ATTR, g) : ye, hn = Xe(d, "ALLOWED_NAMESPACES") ? ie({}, d.ALLOWED_NAMESPACES, zr) : dn, cn = Xe(d, "ADD_URI_SAFE_ATTR") ? ie(ht(Vn), d.ADD_URI_SAFE_ATTR, g) : Vn, ln = Xe(d, "ADD_DATA_URI_TAGS") ? ie(ht(zn), d.ADD_DATA_URI_TAGS, g) : zn, Be = Xe(d, "FORBID_CONTENTS") ? ie({}, d.FORBID_CONTENTS, g) : Ot, Me = Xe(d, "FORBID_TAGS") ? ie({}, d.FORBID_TAGS, g) : ht({}), rn = Xe(d, "FORBID_ATTR") ? ie({}, d.FORBID_ATTR, g) : ht({}), ct = Xe(d, "USE_PROFILES") ? d.USE_PROFILES : !1, Mn = d.ALLOW_ARIA_ATTR !== !1, Dn = d.ALLOW_DATA_ATTR !== !1, Lt = d.ALLOW_UNKNOWN_PROTOCOLS || !1, Bn = d.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Et = d.SAFE_FOR_TEMPLATES || !1, zt = d.SAFE_FOR_XML !== !1, lt = d.WHOLE_DOCUMENT || !1, vt = d.RETURN_DOM || !1, Vt = d.RETURN_DOM_FRAGMENT || !1, Ft = d.RETURN_TRUSTED_TYPE || !1, on = d.FORCE_BODY || !1, an = d.SANITIZE_DOM !== !1, Un = d.SANITIZE_NAMED_PROPS || !1, Ht = d.KEEP_CONTENT !== !1, De = d.IN_PLACE || !1, q = d.ALLOWED_URI_REGEXP || oa, yt = d.NAMESPACE || Fe, It = d.MATHML_TEXT_INTEGRATION_POINTS || It, Nt = d.HTML_INTEGRATION_POINTS || Nt, X = d.CUSTOM_ELEMENT_HANDLING || {}, d.CUSTOM_ELEMENT_HANDLING && be(d.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (X.tagNameCheck = d.CUSTOM_ELEMENT_HANDLING.tagNameCheck), d.CUSTOM_ELEMENT_HANDLING && be(d.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (X.attributeNameCheck = d.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), d.CUSTOM_ELEMENT_HANDLING && typeof d.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (X.allowCustomizedBuiltInElements = d.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), Et && (Dn = !1), Vt && (vt = !0), ct && (V = ie({}, Hs), W = [], ct.html === !0 && (ie(V, Fs), ie(W, qs)), ct.svg === !0 && (ie(V, Vr), ie(W, qr), ie(W, tr)), ct.svgFilters === !0 && (ie(V, Fr), ie(W, qr), ie(W, tr)), ct.mathMl === !0 && (ie(V, Hr), ie(W, js), ie(W, tr))), d.ADD_TAGS && (V === K && (V = ht(V)), ie(V, d.ADD_TAGS, g)), d.ADD_ATTR && (W === ye && (W = ht(W)), ie(W, d.ADD_ATTR, g)), d.ADD_URI_SAFE_ATTR && ie(cn, d.ADD_URI_SAFE_ATTR, g), d.FORBID_CONTENTS && (Be === Ot && (Be = ht(Be)), ie(Be, d.FORBID_CONTENTS, g)), Ht && (V["#text"] = !0), lt && ie(V, ["html", "head", "body"]), V.table && (ie(V, ["tbody"]), delete Me.tbody), d.TRUSTED_TYPES_POLICY) {
        if (typeof d.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw Tn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof d.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw Tn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        ee = d.TRUSTED_TYPES_POLICY, he = ee.createHTML("");
      } else
        ee === void 0 && (ee = cc(E, i)), ee !== null && typeof he == "string" && (he = ee.createHTML(""));
      Le && Le(d), x = d;
    }
  }, I = ie({}, [...Vr, ...Fr, ...Ql]), O = ie({}, [...Hr, ...Jl]), H = function(d) {
    let _ = Q(d);
    (!_ || !_.tagName) && (_ = {
      namespaceURI: yt,
      tagName: "template"
    });
    const L = or(d.tagName), pe = or(_.tagName);
    return hn[d.namespaceURI] ? d.namespaceURI === jt ? _.namespaceURI === Fe ? L === "svg" : _.namespaceURI === qt ? L === "svg" && (pe === "annotation-xml" || It[pe]) : !!I[L] : d.namespaceURI === qt ? _.namespaceURI === Fe ? L === "math" : _.namespaceURI === jt ? L === "math" && Nt[pe] : !!O[L] : d.namespaceURI === Fe ? _.namespaceURI === jt && !Nt[pe] || _.namespaceURI === qt && !It[pe] ? !1 : !O[L] && (_r[L] || !I[L]) : !!(kt === "application/xhtml+xml" && hn[d.namespaceURI]) : !1;
  }, le = function(d) {
    _n(e.removed, {
      element: d
    });
    try {
      Q(d).removeChild(d);
    } catch {
      N(d);
    }
  }, fe = function(d, _) {
    try {
      _n(e.removed, {
        attribute: _.getAttributeNode(d),
        from: _
      });
    } catch {
      _n(e.removed, {
        attribute: null,
        from: _
      });
    }
    if (_.removeAttribute(d), d === "is")
      if (vt || Vt)
        try {
          le(_);
        } catch {
        }
      else
        try {
          _.setAttribute(d, "");
        } catch {
        }
  }, _t = function(d) {
    let _ = null, L = null;
    if (on)
      d = "<remove></remove>" + d;
    else {
      const ve = Vs(d, /^[\r\n\t ]+/);
      L = ve && ve[0];
    }
    kt === "application/xhtml+xml" && yt === Fe && (d = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + d + "</body></html>");
    const pe = ee ? ee.createHTML(d) : d;
    if (yt === Fe)
      try {
        _ = new f().parseFromString(pe, kt);
      } catch {
      }
    if (!_ || !_.documentElement) {
      _ = ne.createDocument(yt, "template", null);
      try {
        _.documentElement.innerHTML = un ? he : pe;
      } catch {
      }
    }
    const Se = _.body || _.documentElement;
    return d && L && Se.insertBefore(t.createTextNode(L), Se.childNodes[0] || null), yt === Fe ? Ve.call(_, lt ? "html" : "body")[0] : lt ? _.documentElement : Se;
  }, Gt = function(d) {
    return oe.call(
      d.ownerDocument || d,
      d,
      // eslint-disable-next-line no-bitwise
      c.SHOW_ELEMENT | c.SHOW_COMMENT | c.SHOW_TEXT | c.SHOW_PROCESSING_INSTRUCTION | c.SHOW_CDATA_SECTION,
      null
    );
  }, Pt = function(d) {
    return d instanceof p && (typeof d.nodeName != "string" || typeof d.textContent != "string" || typeof d.removeChild != "function" || !(d.attributes instanceof u) || typeof d.removeAttribute != "function" || typeof d.setAttribute != "function" || typeof d.namespaceURI != "string" || typeof d.insertBefore != "function" || typeof d.hasChildNodes != "function");
  }, Fn = function(d) {
    return typeof a == "function" && d instanceof a;
  };
  function Ue(D, d, _) {
    er(D, (L) => {
      L.call(e, d, _, x);
    });
  }
  const Hn = function(d) {
    let _ = null;
    if (Ue(Ee.beforeSanitizeElements, d, null), Pt(d))
      return le(d), !0;
    const L = g(d.nodeName);
    if (Ue(Ee.uponSanitizeElement, d, {
      tagName: L,
      allowedTags: V
    }), zt && d.hasChildNodes() && !Fn(d.firstElementChild) && Ae(/<[/\w!]/g, d.innerHTML) && Ae(/<[/\w!]/g, d.textContent) || d.nodeType === An.progressingInstruction || zt && d.nodeType === An.comment && Ae(/<[/\w]/g, d.data))
      return le(d), !0;
    if (!V[L] || Me[L]) {
      if (!Me[L] && jn(L) && (X.tagNameCheck instanceof RegExp && Ae(X.tagNameCheck, L) || X.tagNameCheck instanceof Function && X.tagNameCheck(L)))
        return !1;
      if (Ht && !Be[L]) {
        const pe = Q(d) || d.parentNode, Se = J(d) || d.childNodes;
        if (Se && pe) {
          const ve = Se.length;
          for (let Te = ve - 1; Te >= 0; --Te) {
            const Ge = w(Se[Te], !0);
            Ge.__removalCount = (d.__removalCount || 0) + 1, pe.insertBefore(Ge, j(d));
          }
        }
      }
      return le(d), !0;
    }
    return d instanceof l && !H(d) || (L === "noscript" || L === "noembed" || L === "noframes") && Ae(/<\/no(script|embed|frames)/i, d.innerHTML) ? (le(d), !0) : (Et && d.nodeType === An.text && (_ = d.textContent, er([ot, at, A], (pe) => {
      _ = xn(_, pe, " ");
    }), d.textContent !== _ && (_n(e.removed, {
      element: d.cloneNode()
    }), d.textContent = _)), Ue(Ee.afterSanitizeElements, d, null), !1);
  }, qn = function(d, _, L) {
    if (an && (_ === "id" || _ === "name") && (L in t || L in G))
      return !1;
    if (!(Dn && !rn[_] && Ae(T, _))) {
      if (!(Mn && Ae(z, _))) {
        if (!W[_] || rn[_]) {
          if (
            // First condition does a very basic check if a) it's basically a valid custom element tagname AND
            // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
            !(jn(d) && (X.tagNameCheck instanceof RegExp && Ae(X.tagNameCheck, d) || X.tagNameCheck instanceof Function && X.tagNameCheck(d)) && (X.attributeNameCheck instanceof RegExp && Ae(X.attributeNameCheck, _) || X.attributeNameCheck instanceof Function && X.attributeNameCheck(_)) || // Alternative, second condition checks if it's an `is`-attribute, AND
            // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            _ === "is" && X.allowCustomizedBuiltInElements && (X.tagNameCheck instanceof RegExp && Ae(X.tagNameCheck, L) || X.tagNameCheck instanceof Function && X.tagNameCheck(L)))
          ) return !1;
        } else if (!cn[_]) {
          if (!Ae(q, xn(L, M, ""))) {
            if (!((_ === "src" || _ === "xlink:href" || _ === "href") && d !== "script" && Xl(L, "data:") === 0 && ln[d])) {
              if (!(Lt && !Ae(P, xn(L, M, "")))) {
                if (L)
                  return !1;
              }
            }
          }
        }
      }
    }
    return !0;
  }, jn = function(d) {
    return d !== "annotation-xml" && Vs(d, $);
  }, fn = function(d) {
    Ue(Ee.beforeSanitizeAttributes, d, null);
    const {
      attributes: _
    } = d;
    if (!_ || Pt(d))
      return;
    const L = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: W,
      forceKeepAttr: void 0
    };
    let pe = _.length;
    for (; pe--; ) {
      const Se = _[pe], {
        name: ve,
        namespaceURI: Te,
        value: Ge
      } = Se, Je = g(ve), pn = Ge;
      let y = ve === "value" ? pn : Yl(pn);
      if (L.attrName = Je, L.attrValue = y, L.keepAttr = !0, L.forceKeepAttr = void 0, Ue(Ee.uponSanitizeAttribute, d, L), y = L.attrValue, Un && (Je === "id" || Je === "name") && (fe(ve, d), y = Sr + y), zt && Ae(/((--!?|])>)|<\/(style|title)/i, y)) {
        fe(ve, d);
        continue;
      }
      if (L.forceKeepAttr)
        continue;
      if (!L.keepAttr) {
        fe(ve, d);
        continue;
      }
      if (!Bn && Ae(/\/>/i, y)) {
        fe(ve, d);
        continue;
      }
      Et && er([ot, at, A], (re) => {
        y = xn(y, re, " ");
      });
      const B = g(d.nodeName);
      if (!qn(B, Je, y)) {
        fe(ve, d);
        continue;
      }
      if (ee && typeof E == "object" && typeof E.getAttributeType == "function" && !Te)
        switch (E.getAttributeType(B, Je)) {
          case "TrustedHTML": {
            y = ee.createHTML(y);
            break;
          }
          case "TrustedScriptURL": {
            y = ee.createScriptURL(y);
            break;
          }
        }
      if (y !== pn)
        try {
          Te ? d.setAttributeNS(Te, ve, y) : d.setAttribute(ve, y), Pt(d) ? le(d) : zs(e.removed);
        } catch {
          fe(ve, d);
        }
    }
    Ue(Ee.afterSanitizeAttributes, d, null);
  }, Wt = function D(d) {
    let _ = null;
    const L = Gt(d);
    for (Ue(Ee.beforeSanitizeShadowDOM, d, null); _ = L.nextNode(); )
      Ue(Ee.uponSanitizeShadowNode, _, null), Hn(_), fn(_), _.content instanceof o && D(_.content);
    Ue(Ee.afterSanitizeShadowDOM, d, null);
  };
  return e.sanitize = function(D) {
    let d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ = null, L = null, pe = null, Se = null;
    if (un = !D, un && (D = "<!-->"), typeof D != "string" && !Fn(D))
      if (typeof D.toString == "function") {
        if (D = D.toString(), typeof D != "string")
          throw Tn("dirty is not a string, aborting");
      } else
        throw Tn("toString is not a function");
    if (!e.isSupported)
      return D;
    if (sn || we(d), e.removed = [], typeof D == "string" && (De = !1), De) {
      if (D.nodeName) {
        const Ge = g(D.nodeName);
        if (!V[Ge] || Me[Ge])
          throw Tn("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (D instanceof a)
      _ = _t("<!---->"), L = _.ownerDocument.importNode(D, !0), L.nodeType === An.element && L.nodeName === "BODY" || L.nodeName === "HTML" ? _ = L : _.appendChild(L);
    else {
      if (!vt && !Et && !lt && // eslint-disable-next-line unicorn/prefer-includes
      D.indexOf("<") === -1)
        return ee && Ft ? ee.createHTML(D) : D;
      if (_ = _t(D), !_)
        return vt ? null : Ft ? he : "";
    }
    _ && on && le(_.firstChild);
    const ve = Gt(De ? D : _);
    for (; pe = ve.nextNode(); )
      Hn(pe), fn(pe), pe.content instanceof o && Wt(pe.content);
    if (De)
      return D;
    if (vt) {
      if (Vt)
        for (Se = F.call(_.ownerDocument); _.firstChild; )
          Se.appendChild(_.firstChild);
      else
        Se = _;
      return (W.shadowroot || W.shadowrootmode) && (Se = Qe.call(n, Se, !0)), Se;
    }
    let Te = lt ? _.outerHTML : _.innerHTML;
    return lt && V["!doctype"] && _.ownerDocument && _.ownerDocument.doctype && _.ownerDocument.doctype.name && Ae(aa, _.ownerDocument.doctype.name) && (Te = "<!DOCTYPE " + _.ownerDocument.doctype.name + `>
` + Te), Et && er([ot, at, A], (Ge) => {
      Te = xn(Te, Ge, " ");
    }), ee && Ft ? ee.createHTML(Te) : Te;
  }, e.setConfig = function() {
    let D = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    we(D), sn = !0;
  }, e.clearConfig = function() {
    x = null, sn = !1;
  }, e.isValidAttribute = function(D, d, _) {
    x || we({});
    const L = g(D), pe = g(d);
    return qn(L, pe, _);
  }, e.addHook = function(D, d) {
    typeof d == "function" && _n(Ee[D], d);
  }, e.removeHook = function(D, d) {
    if (d !== void 0) {
      const _ = Gl(Ee[D], d);
      return _ === -1 ? void 0 : Wl(Ee[D], _, 1)[0];
    }
    return zs(Ee[D]);
  }, e.removeHooks = function(D) {
    Ee[D] = [];
  }, e.removeAllHooks = function() {
    Ee = Ws();
  }, e;
}
var Xs = la();
function uc(r, e) {
  const t = document.createElement("div");
  switch (t.classList.add("text-content"), t.style.color = r.textColor, t.style.textAlign = r.justificationHorizontal, r.justificationVertical) {
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
      throw new Error(`Unknown vertical justification: ${r.justificationVertical}`);
  }
  t.style.fontSize = e(r.fontSize);
  let n = ue.parse(r.text);
  return n instanceof Promise ? n.then((i) => {
    t.innerHTML = Xs.sanitize(i);
  }) : t.innerHTML = Xs.sanitize(n), t;
}
function hc(r, e, t) {
  switch (t.mask) {
    case "rectangle":
      const n = t.x - t.w / 2, i = t.x + t.w / 2, o = t.y + t.h / 2, s = t.y - t.h / 2;
      return r >= n && r <= i && e >= s && e <= o;
    case "ellipse":
      const a = t.w / 2, l = t.h / 2, c = r - t.x, u = e - t.y;
      return c * c / (a * a) + u * u / (l * l) <= 1;
    default:
      throw new Error(`Unknown mask: ${t.mask}`);
  }
}
class dc {
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
class fc extends Ki {
  async prepare() {
    this.textContainer = document.createElement("div"), this.textContainer.classList.add("text-card"), this.root.style.borderRadius = "8px", this.root.appendChild(this.textContainer), this.textContainer.style.backgroundColor = this.card.background_color;
    const e = {
      text: this.card.text,
      textColor: this.card.text_color,
      fontSize: this.card.font_size,
      justificationHorizontal: this.card.justification_horizontal,
      justificationVertical: this.card.justification_vertical
    }, t = uc(
      e,
      (n) => this.boardCoords.getSizePx(n) + "px"
    );
    this.textContainer.appendChild(t);
  }
}
async function Nn(r, e, t) {
  const n = e.getCoordinateSystem();
  let i = null;
  switch (r.card_type) {
    case "ImageCard":
      i = new sl(
        r,
        n
      );
      break;
    case "VideoCard":
      i = new ol(
        r,
        n
      );
      break;
    case "TextCard":
      i = new fc(
        r,
        n
      );
      break;
    case "CompositeCard":
      const o = Object.entries(r.children).map(
        async ([c, u]) => {
          const p = await Nn(
            u,
            e,
            t
          );
          return [c, p];
        }
      ), s = await Promise.all(o), a = Object.fromEntries(s);
      i = new il(
        r,
        a
      );
      break;
    default:
      const l = r;
      throw new Error(`Unsupported Card type: ${JSON.stringify(l)}`);
  }
  return e.root.appendChild(i.root), await i.prepare(t), i;
}
class bt {
  constructor(e, t, n) {
    this.subscriptions = [], this.params = {
      sensor: e,
      boardView: t,
      assetManager: n
    };
  }
  async prepare() {
  }
  start() {
  }
  emit(e) {
    this.subscriptions.forEach((t) => t(e));
  }
  subscribe(e) {
    this.subscriptions.push(e);
  }
}
class pc extends bt {
  async prepare() {
    const e = new gc(
      this.params.sensor,
      this.params.boardView.getCoordinateSystem()
    );
    this.params.boardView.root.appendChild(e.root);
    const t = (n) => {
      const i = {
        t: this.params.boardView.clock.now(),
        action_type: "SliderAction",
        bin_index: n.binIndex
      };
      this.emit(i);
    };
    e.subscribeToSlider(t);
  }
}
class gc {
  constructor(e, t) {
    this.pendingThumbPosition = null, this.rafId = null, this.frameRequested = !1, this.currentBinIndex = null, this.subscribers = /* @__PURE__ */ new Set(), this.isDraggingThumb = !1, this.onPointerDownThumb = (n) => {
      n.preventDefault(), this.isDraggingThumb = !0, this.setThumbVisualState("dragging"), n.target.setPointerCapture(n.pointerId);
    }, this.onPointerUpDocument = (n) => {
      if (this.isDraggingThumb) {
        n.preventDefault(), this.isDraggingThumb = !1;
        const i = this.calculateNearestBin(n);
        this.currentBinIndex = i, this.scheduleThumbMove(i), this.setThumbVisualState("committed"), n.target.releasePointerCapture(n.pointerId), this.emitSliderValue();
      }
    }, this.onPointerMoveDocument = (n) => {
      if (!this.isDraggingThumb) return;
      n.preventDefault();
      const i = this.calculateNearestBin(n);
      this.currentBinIndex = i, this.scheduleThumbMove(i);
    }, this.onClickTrack = (n) => {
      n.preventDefault();
      const i = this.calculateNearestBin(n);
      this.currentBinIndex = i, this.scheduleThumbMove(i), this.isDraggingThumb ? (this.isDraggingThumb = !1, n.target.releasePointerCapture(n.pointerId), this.setThumbVisualState("committed")) : (this.isDraggingThumb = !0, this.setThumbVisualState("dragging"), n.target.setPointerCapture(n.pointerId));
    }, this.root = Yi(e.region, t), this.boardCoords = t, this.sensor = e, this.sliderContainer = document.createElement("div"), this.sliderContainer.classList.add("slider-card"), this.sliderTrack = document.createElement("div"), this.sliderTrack.classList.add("slider-card__track"), this.sliderContainer.appendChild(this.sliderTrack), this.sliderThumb = document.createElement("div"), this.sliderThumb.classList.add("slider-card__thumb"), this.sliderContainer.appendChild(this.sliderThumb), e.orientation === "horizontal" ? (this.sliderTrack.classList.add("slider-card__track--horizontal"), this.sliderThumb.classList.add("slider-card__thumb--horizontal")) : (this.sliderTrack.classList.add("slider-card__track--vertical"), this.sliderThumb.classList.add("slider-card__thumb--vertical")), this.root.appendChild(this.sliderContainer), this.binIndexToProportion = (n) => e.num_bins <= 1 ? 0 : n / (e.num_bins - 1), this.renderTicks(), this.setThumbVisualState("uncommitted"), this.scheduleThumbMove(e.initial_bin_index), this.sliderTrack.addEventListener("pointerdown", this.onClickTrack), this.sliderThumb.addEventListener("pointerdown", this.onPointerDownThumb), document.addEventListener("pointermove", this.onPointerMoveDocument), document.addEventListener("pointerup", this.onPointerUpDocument);
  }
  renderTicks() {
    const e = this.sensor;
    if (!e.show_bin_markers) return;
    this.sliderTrack.querySelectorAll(".slider-card__track-tick").forEach((c) => c.remove());
    const t = e.num_bins, n = document.createDocumentFragment(), i = e.orientation === "horizontal", o = Math.max(1, i ? this.boardCoords.getSizePx(e.region.w) : this.boardCoords.getSizePx(e.region.h)), s = 8, a = Math.max(0, s / 2), l = Math.max(0, o - s);
    for (let c = 0; c < t; c++) {
      if (c === 0 || c === t - 1) continue;
      const p = (a + c * l / (t - 1)) / o * 100, f = document.createElement("div");
      f.classList.add("slider-card__track-tick"), f.style.pointerEvents = "none";
      const E = "75%";
      e.orientation === "horizontal" ? (f.style.width = "1px", f.style.height = E, f.style.left = `${p}%`, f.style.top = "50%", f.style.transform = "translate(-50%, -50%)") : (f.style.width = E, f.style.height = "1px", f.style.top = `${p}%`, f.style.left = "50%", f.style.transform = "translate(-50%, -50%)"), n.appendChild(f);
    }
    this.sliderTrack.appendChild(n);
  }
  // Rendering functions
  setThumbVisualState(e) {
    const t = "slider-card__thumb--active", n = "slider-card__thumb--uncommitted";
    switch (e) {
      case "dragging":
        this.sliderThumb.classList.add(t), this.sliderThumb.classList.remove(n);
        return;
      case "committed":
        this.sliderThumb.classList.remove(t), this.sliderThumb.classList.remove(n);
        return;
      case "uncommitted":
        this.sliderThumb.classList.remove(t), this.sliderThumb.classList.add(n);
        return;
      default:
        return;
    }
  }
  scheduleThumbMove(e) {
    const t = this.binIndexToProportion(e);
    this.pendingThumbPosition = Math.max(0, Math.min(1, t)), this.frameRequested || (this.frameRequested = !0, this.rafId = requestAnimationFrame(() => {
      this.frameRequested = !1, this.flushThumbVisualUpdate();
    }));
  }
  flushThumbVisualUpdate() {
    if (this.pendingThumbPosition == null)
      return;
    const e = this.sliderThumb.getBoundingClientRect(), t = this.sliderContainer.getBoundingClientRect();
    if (this.sensor.orientation === "horizontal") {
      const n = this.pendingThumbPosition * (t.width - e.width);
      this.sliderThumb.style.left = `${n}px`;
    } else {
      const n = t.height - e.height - this.pendingThumbPosition * (t.height - e.height);
      this.sliderThumb.style.top = `${n}px`;
    }
    this.pendingThumbPosition = null;
  }
  calculateNearestBin(e) {
    if (this.sensor.num_bins <= 1) return 0;
    const t = this.sliderTrack.getBoundingClientRect();
    let n;
    switch (this.sensor.orientation) {
      case "horizontal":
        n = (e.clientX - t.left) / t.width;
        break;
      case "vertical":
        n = 1 - (e.clientY - t.top) / t.height;
        break;
      default:
        const a = this.sensor.orientation;
        throw new Error(`Unsupported SliderSensor.orientation found ${JSON.stringify(a)}`);
    }
    n = Math.max(0, Math.min(1, n));
    const i = n * (this.sensor.num_bins - 1);
    return Math.round(i);
  }
  onDestroy() {
    this.rafId !== null && (cancelAnimationFrame(this.rafId), this.rafId = null, this.frameRequested = !1, this.pendingThumbPosition = null), this.sliderTrack.removeEventListener("pointerdown", this.onClickTrack);
  }
  emitSliderValue() {
    if (this.currentBinIndex == null) return;
    const e = this.currentBinIndex, t = {
      sliderNormalizedPosition: e / (this.sensor.num_bins - 1),
      binIndex: e,
      domTimestamp: performance.now()
    };
    for (let n of this.subscribers)
      n(t);
  }
  subscribeToSlider(e) {
    this.subscribers.add(e);
  }
}
class mc extends bt {
  async prepare() {
    const e = new wc(
      this.params.sensor,
      this.params.boardView.getCoordinateSystem()
    );
    this.params.boardView.root.appendChild(e.root);
    const t = (n) => {
      const i = {
        action_type: "FreeTextEntryAction",
        text: n,
        t: this.params.boardView.clock.now()
      };
      this.emit(i);
    };
    e.subscribe(t);
  }
}
class wc {
  constructor(e, t) {
    this.root = Yi(e.region, t);
    const n = document.createElement("div");
    n.classList.add("free-text-entry");
    const i = document.createElement("textarea");
    i.classList.add("free-text-entry__input"), i.spellcheck = !1, i.placeholder = e.prompt ?? "", i.style.fontSize = t.getSizePx(e.font_size) + "px", i.maxLength = e.max_length ?? 1e4;
    const o = document.createElement("div");
    o.classList.add("free-text-entry__gutter");
    const s = "Done", a = "", l = document.createElement("button");
    l.classList.add("free-text-entry__submit"), l.textContent = a, l.disabled = e.min_length > 0, o.appendChild(l), n.appendChild(i), n.appendChild(o), this.root.appendChild(n);
    const c = () => {
      const u = i.value.trim().length >= e.min_length;
      l.textContent = u ? s : a, u ? (l.classList.add("submittable"), l.disabled = !1) : (l.classList.remove("submittable"), l.disabled = !0);
    };
    i.addEventListener("input", () => {
      c();
    }), this.textAreaElement = i, this.doneButton = l, c();
  }
  subscribe(e) {
    this.doneButton.addEventListener("click", () => {
      const t = this.textAreaElement.value;
      e(t), this.doneButton.textContent = "✓";
    });
  }
}
class bc extends bt {
  async prepare() {
    const e = this.params.sensor.keys, t = (n) => {
      if (n.sampleType !== "down" || !e.has(n.key))
        return;
      const i = {
        t: n.t,
        action_type: "KeyAction",
        key: n.key
      };
      this.emit(i);
    };
    this.params.boardView.keyStream.subscribe(
      t
    );
  }
}
class Ec extends bt {
  async prepare() {
    const e = this.params.sensor.region, t = (n) => {
      if (n.sampleType !== "down")
        return;
      if (hc(
        n.x,
        n.y,
        e
      )) {
        const o = {
          t: n.t,
          action_type: "ClickAction",
          x: n.x,
          y: n.y
        };
        this.emit(o);
        return;
      }
    };
    this.params.boardView.pointerStream.subscribe(t);
  }
}
class vc extends bt {
  start() {
    setTimeout(
      () => {
        const e = {
          action_type: "WaitAction",
          t: this.params.boardView.clock.now()
        };
        this.emit(e);
      },
      this.params.sensor.duration_msec
    );
  }
}
class yc extends bt {
  async prepare() {
    const e = {};
    let t = [];
    for (const [o, s] of Object.entries(this.params.sensor.choices))
      e[o] = await Nn(s, this.params.boardView, this.params.assetManager), t.push(o);
    t.sort();
    let n = null;
    const i = (o) => {
      let s = null, a = !1;
      for (const l of t) {
        const c = e[l];
        if (!c.checkPointInCard(
          o.x,
          o.y
        )) {
          c.setHoverState(!1);
          continue;
        }
        if (o.sampleType === "down") {
          c.setSelectedState(!0), c.setHoverState(!1), s = l, n = l, a = !0;
          const p = {
            action_type: "SelectAction",
            t: this.params.boardView.clock.now(),
            selection: l
          };
          this.emit(p);
        }
        n !== l && c.setHoverState(!0);
      }
      if (a)
        for (const l of t) {
          if (l === s) continue;
          e[l].setSelectedState(!1);
        }
    };
    this.params.boardView.pointerStream.subscribe(i);
  }
}
class kc extends bt {
  async prepare() {
    const e = this.params.sensor.min_selections, t = this.params.sensor.max_selections ?? Object.keys(this.params.sensor.choices).length, n = /* @__PURE__ */ new Set(), i = {};
    let o = [];
    for (const [f, E] of Object.entries(this.params.sensor.choices))
      i[f] = await Nn(
        E,
        this.params.boardView,
        this.params.assetManager
      ), o.push(f);
    o.sort();
    const s = await Nn(
      this.params.sensor.confirm_button,
      this.params.boardView,
      this.params.assetManager
    );
    s.setOpacity(0.1);
    let a = !1, l = !1;
    const c = () => {
      const f = n.size >= t;
      for (const E of o) {
        const R = i[E], w = n.has(E);
        R.setSelectedState(w), f && !w ? R.setOpacity(0.25) : R.setOpacity(1);
      }
    }, u = () => {
      const f = {
        action_type: "MultiSelectAction",
        t: this.params.boardView.clock.now(),
        selections: Array.from(n)
      };
      this.emit(f);
    }, p = (f) => {
      if (l)
        return;
      const E = n.size >= t;
      let R = !1;
      for (const w of o) {
        const N = i[w];
        if (!N.checkPointInCard(
          f.x,
          f.y
        )) {
          N.setHoverState(!1);
          continue;
        }
        const J = n.has(w);
        E && !J ? N.setHoverState(!1) : N.setHoverState(!0), f.sampleType === "down" && (J ? (n.delete(w), R = !0) : n.size < t && (n.add(w), R = !0));
      }
      R && (c(), a = n.size >= e), a ? (s.setOpacity(1), s.checkPointInCard(
        f.x,
        f.y
      ) ? (s.setHoverState(!0), f.sampleType === "down" && (u(), l = !0, s.setOpacity(0.5), s.setSelectedState(!0))) : s.setHoverState(!1)) : s.setOpacity(0.1);
    };
    this.params.boardView.pointerStream.subscribe(p);
  }
}
class Sc extends bt {
  constructor() {
    super(...arguments), this.childBindings = {};
  }
  async prepare() {
    let e = {};
    for (const [t, n] of Object.entries(this.params.sensor.children))
      e[t] = null, this.childBindings[t] = await os(
        n,
        this.params.boardView,
        this.params.assetManager
      ), this.childBindings[t].subscribe(
        (i) => {
          e[t] = i;
          let o = this.checkValid(e);
          o !== null && this.emit(o);
        }
      );
  }
  checkValid(e) {
    let t = {};
    for (const n of Object.keys(e)) {
      const i = n;
      if (e[i] === null)
        return null;
      t[i] = e[i];
    }
    return {
      action_type: "ProductAction",
      child_actions: t,
      t: this.params.boardView.clock.now()
    };
  }
  start() {
    for (const [e, t] of Object.entries(this.childBindings))
      t.start();
  }
}
class _c extends bt {
  constructor() {
    super(...arguments), this.childBindings = {};
  }
  async prepare() {
    for (const [e, t] of Object.entries(this.params.sensor.children))
      this.childBindings[e] = await os(
        t,
        this.params.boardView,
        this.params.assetManager
      ), this.childBindings[e].subscribe(
        (n) => {
          const i = {
            action_type: "SumAction",
            child_id: e,
            child_action: n,
            t: this.params.boardView.clock.now()
          };
          this.emit(i);
        }
      );
  }
  start() {
    for (const [e, t] of Object.entries(this.childBindings))
      t.start();
  }
}
async function os(r, e, t) {
  let n = null;
  switch (r.sensor_type) {
    case "WaitSensor": {
      n = new vc(
        r,
        e,
        t
      );
      break;
    }
    case "KeySensor": {
      n = new bc(
        r,
        e,
        t
      );
      break;
    }
    case "ClickSensor": {
      n = new Ec(
        r,
        e,
        t
      );
      break;
    }
    case "SliderSensor": {
      n = new pc(
        r,
        e,
        t
      );
      break;
    }
    case "FreeTextEntrySensor": {
      n = new mc(
        r,
        e,
        t
      );
      break;
    }
    case "SelectSensor": {
      n = new yc(
        r,
        e,
        t
      );
      break;
    }
    case "MultiSelectSensor": {
      n = new kc(
        r,
        e,
        t
      );
      break;
    }
    case "ProductSensor": {
      n = new Sc(
        r,
        e,
        t
      );
      break;
    }
    case "SumSensor": {
      n = new _c(
        r,
        e,
        t
      );
      break;
    }
    default: {
      const i = r;
      throw new Error(`Unknown Sensor provided: ${JSON.stringify(i)}`);
    }
  }
  return await n.prepare(), n;
}
class xc {
  constructor(e, t, n) {
    this.prepared = !1, this.started = !1, this.deferredAction = new dc(), this.boardView = new nl(e.board_color, n), this.root = this.boardView.root, this.node = e, this.scheduler = new rl(), this.assetManager = t;
  }
  async prepare() {
    const e = await Nn(
      this.node.stimulus,
      this.boardView,
      this.assetManager
    );
    this.scheduler.scheduleEvent(
      {
        triggerTimeMsec: 0,
        triggerFunc: () => {
          e.onStart();
        }
      }
    ), this.scheduler.scheduleOnStop(
      () => {
        e.onDestroy();
      }
    );
    const t = await os(
      this.node.sensor,
      this.boardView,
      this.assetManager
    );
    t.subscribe(
      (n) => {
        this.deferredAction.resolve(n);
      }
    ), this.scheduler.scheduleEvent(
      {
        triggerTimeMsec: 0,
        triggerFunc: () => {
          t.start();
        }
      }
    ), this.node.hide_pointer && (this.boardView.root.style.cursor = "none"), this.prepared = !0;
  }
  async run() {
    if (this.prepared || (console.warn("Running a NodePlay without preparing it first!"), await this.prepare()), this.started)
      throw new Error("NodePlay already started");
    this.boardView.setBoardState(!0, !0);
    const e = this.boardView.clock.now();
    this.started = !0, this.scheduler.start();
    const t = await this.deferredAction.promise;
    this.scheduler.stop();
    const n = this.boardView.clock.now();
    return {
      tStart: e,
      tEnd: n,
      action: t
    };
  }
}
const nr = "0.1.0";
var rr = { exports: {} }, jr, Ys;
function br() {
  if (Ys) return jr;
  Ys = 1;
  const r = "2.0.0", e = 256, t = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
  9007199254740991, n = 16, i = e - 6;
  return jr = {
    MAX_LENGTH: e,
    MAX_SAFE_COMPONENT_LENGTH: n,
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
    SEMVER_SPEC_VERSION: r,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  }, jr;
}
var Gr, Ks;
function Er() {
  return Ks || (Ks = 1, Gr = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
  }), Gr;
}
var Zs;
function $n() {
  return Zs || (Zs = 1, (function(r, e) {
    const {
      MAX_SAFE_COMPONENT_LENGTH: t,
      MAX_SAFE_BUILD_LENGTH: n,
      MAX_LENGTH: i
    } = br(), o = Er();
    e = r.exports = {};
    const s = e.re = [], a = e.safeRe = [], l = e.src = [], c = e.safeSrc = [], u = e.t = {};
    let p = 0;
    const f = "[a-zA-Z0-9-]", E = [
      ["\\s", 1],
      ["\\d", i],
      [f, n]
    ], R = (N) => {
      for (const [j, J] of E)
        N = N.split(`${j}*`).join(`${j}{0,${J}}`).split(`${j}+`).join(`${j}{1,${J}}`);
      return N;
    }, w = (N, j, J) => {
      const Q = R(j), ee = p++;
      o(N, ee, j), u[N] = ee, l[ee] = j, c[ee] = Q, s[ee] = new RegExp(j, J ? "g" : void 0), a[ee] = new RegExp(Q, J ? "g" : void 0);
    };
    w("NUMERICIDENTIFIER", "0|[1-9]\\d*"), w("NUMERICIDENTIFIERLOOSE", "\\d+"), w("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${f}*`), w("MAINVERSION", `(${l[u.NUMERICIDENTIFIER]})\\.(${l[u.NUMERICIDENTIFIER]})\\.(${l[u.NUMERICIDENTIFIER]})`), w("MAINVERSIONLOOSE", `(${l[u.NUMERICIDENTIFIERLOOSE]})\\.(${l[u.NUMERICIDENTIFIERLOOSE]})\\.(${l[u.NUMERICIDENTIFIERLOOSE]})`), w("PRERELEASEIDENTIFIER", `(?:${l[u.NONNUMERICIDENTIFIER]}|${l[u.NUMERICIDENTIFIER]})`), w("PRERELEASEIDENTIFIERLOOSE", `(?:${l[u.NONNUMERICIDENTIFIER]}|${l[u.NUMERICIDENTIFIERLOOSE]})`), w("PRERELEASE", `(?:-(${l[u.PRERELEASEIDENTIFIER]}(?:\\.${l[u.PRERELEASEIDENTIFIER]})*))`), w("PRERELEASELOOSE", `(?:-?(${l[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[u.PRERELEASEIDENTIFIERLOOSE]})*))`), w("BUILDIDENTIFIER", `${f}+`), w("BUILD", `(?:\\+(${l[u.BUILDIDENTIFIER]}(?:\\.${l[u.BUILDIDENTIFIER]})*))`), w("FULLPLAIN", `v?${l[u.MAINVERSION]}${l[u.PRERELEASE]}?${l[u.BUILD]}?`), w("FULL", `^${l[u.FULLPLAIN]}$`), w("LOOSEPLAIN", `[v=\\s]*${l[u.MAINVERSIONLOOSE]}${l[u.PRERELEASELOOSE]}?${l[u.BUILD]}?`), w("LOOSE", `^${l[u.LOOSEPLAIN]}$`), w("GTLT", "((?:<|>)?=?)"), w("XRANGEIDENTIFIERLOOSE", `${l[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), w("XRANGEIDENTIFIER", `${l[u.NUMERICIDENTIFIER]}|x|X|\\*`), w("XRANGEPLAIN", `[v=\\s]*(${l[u.XRANGEIDENTIFIER]})(?:\\.(${l[u.XRANGEIDENTIFIER]})(?:\\.(${l[u.XRANGEIDENTIFIER]})(?:${l[u.PRERELEASE]})?${l[u.BUILD]}?)?)?`), w("XRANGEPLAINLOOSE", `[v=\\s]*(${l[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[u.XRANGEIDENTIFIERLOOSE]})(?:${l[u.PRERELEASELOOSE]})?${l[u.BUILD]}?)?)?`), w("XRANGE", `^${l[u.GTLT]}\\s*${l[u.XRANGEPLAIN]}$`), w("XRANGELOOSE", `^${l[u.GTLT]}\\s*${l[u.XRANGEPLAINLOOSE]}$`), w("COERCEPLAIN", `(^|[^\\d])(\\d{1,${t}})(?:\\.(\\d{1,${t}}))?(?:\\.(\\d{1,${t}}))?`), w("COERCE", `${l[u.COERCEPLAIN]}(?:$|[^\\d])`), w("COERCEFULL", l[u.COERCEPLAIN] + `(?:${l[u.PRERELEASE]})?(?:${l[u.BUILD]})?(?:$|[^\\d])`), w("COERCERTL", l[u.COERCE], !0), w("COERCERTLFULL", l[u.COERCEFULL], !0), w("LONETILDE", "(?:~>?)"), w("TILDETRIM", `(\\s*)${l[u.LONETILDE]}\\s+`, !0), e.tildeTrimReplace = "$1~", w("TILDE", `^${l[u.LONETILDE]}${l[u.XRANGEPLAIN]}$`), w("TILDELOOSE", `^${l[u.LONETILDE]}${l[u.XRANGEPLAINLOOSE]}$`), w("LONECARET", "(?:\\^)"), w("CARETTRIM", `(\\s*)${l[u.LONECARET]}\\s+`, !0), e.caretTrimReplace = "$1^", w("CARET", `^${l[u.LONECARET]}${l[u.XRANGEPLAIN]}$`), w("CARETLOOSE", `^${l[u.LONECARET]}${l[u.XRANGEPLAINLOOSE]}$`), w("COMPARATORLOOSE", `^${l[u.GTLT]}\\s*(${l[u.LOOSEPLAIN]})$|^$`), w("COMPARATOR", `^${l[u.GTLT]}\\s*(${l[u.FULLPLAIN]})$|^$`), w("COMPARATORTRIM", `(\\s*)${l[u.GTLT]}\\s*(${l[u.LOOSEPLAIN]}|${l[u.XRANGEPLAIN]})`, !0), e.comparatorTrimReplace = "$1$2$3", w("HYPHENRANGE", `^\\s*(${l[u.XRANGEPLAIN]})\\s+-\\s+(${l[u.XRANGEPLAIN]})\\s*$`), w("HYPHENRANGELOOSE", `^\\s*(${l[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[u.XRANGEPLAINLOOSE]})\\s*$`), w("STAR", "(<|>)?=?\\s*\\*"), w("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), w("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  })(rr, rr.exports)), rr.exports;
}
var Wr, Qs;
function as() {
  if (Qs) return Wr;
  Qs = 1;
  const r = Object.freeze({ loose: !0 }), e = Object.freeze({});
  return Wr = (n) => n ? typeof n != "object" ? r : n : e, Wr;
}
var Xr, Js;
function ca() {
  if (Js) return Xr;
  Js = 1;
  const r = /^[0-9]+$/, e = (n, i) => {
    const o = r.test(n), s = r.test(i);
    return o && s && (n = +n, i = +i), n === i ? 0 : o && !s ? -1 : s && !o ? 1 : n < i ? -1 : 1;
  };
  return Xr = {
    compareIdentifiers: e,
    rcompareIdentifiers: (n, i) => e(i, n)
  }, Xr;
}
var Yr, eo;
function Ie() {
  if (eo) return Yr;
  eo = 1;
  const r = Er(), { MAX_LENGTH: e, MAX_SAFE_INTEGER: t } = br(), { safeRe: n, t: i } = $n(), o = as(), { compareIdentifiers: s } = ca();
  class a {
    constructor(c, u) {
      if (u = o(u), c instanceof a) {
        if (c.loose === !!u.loose && c.includePrerelease === !!u.includePrerelease)
          return c;
        c = c.version;
      } else if (typeof c != "string")
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof c}".`);
      if (c.length > e)
        throw new TypeError(
          `version is longer than ${e} characters`
        );
      r("SemVer", c, u), this.options = u, this.loose = !!u.loose, this.includePrerelease = !!u.includePrerelease;
      const p = c.trim().match(u.loose ? n[i.LOOSE] : n[i.FULL]);
      if (!p)
        throw new TypeError(`Invalid Version: ${c}`);
      if (this.raw = c, this.major = +p[1], this.minor = +p[2], this.patch = +p[3], this.major > t || this.major < 0)
        throw new TypeError("Invalid major version");
      if (this.minor > t || this.minor < 0)
        throw new TypeError("Invalid minor version");
      if (this.patch > t || this.patch < 0)
        throw new TypeError("Invalid patch version");
      p[4] ? this.prerelease = p[4].split(".").map((f) => {
        if (/^[0-9]+$/.test(f)) {
          const E = +f;
          if (E >= 0 && E < t)
            return E;
        }
        return f;
      }) : this.prerelease = [], this.build = p[5] ? p[5].split(".") : [], this.format();
    }
    format() {
      return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
    }
    toString() {
      return this.version;
    }
    compare(c) {
      if (r("SemVer.compare", this.version, this.options, c), !(c instanceof a)) {
        if (typeof c == "string" && c === this.version)
          return 0;
        c = new a(c, this.options);
      }
      return c.version === this.version ? 0 : this.compareMain(c) || this.comparePre(c);
    }
    compareMain(c) {
      return c instanceof a || (c = new a(c, this.options)), s(this.major, c.major) || s(this.minor, c.minor) || s(this.patch, c.patch);
    }
    comparePre(c) {
      if (c instanceof a || (c = new a(c, this.options)), this.prerelease.length && !c.prerelease.length)
        return -1;
      if (!this.prerelease.length && c.prerelease.length)
        return 1;
      if (!this.prerelease.length && !c.prerelease.length)
        return 0;
      let u = 0;
      do {
        const p = this.prerelease[u], f = c.prerelease[u];
        if (r("prerelease compare", u, p, f), p === void 0 && f === void 0)
          return 0;
        if (f === void 0)
          return 1;
        if (p === void 0)
          return -1;
        if (p === f)
          continue;
        return s(p, f);
      } while (++u);
    }
    compareBuild(c) {
      c instanceof a || (c = new a(c, this.options));
      let u = 0;
      do {
        const p = this.build[u], f = c.build[u];
        if (r("build compare", u, p, f), p === void 0 && f === void 0)
          return 0;
        if (f === void 0)
          return 1;
        if (p === void 0)
          return -1;
        if (p === f)
          continue;
        return s(p, f);
      } while (++u);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(c, u, p) {
      if (c.startsWith("pre")) {
        if (!u && p === !1)
          throw new Error("invalid increment argument: identifier is empty");
        if (u) {
          const f = `-${u}`.match(this.options.loose ? n[i.PRERELEASELOOSE] : n[i.PRERELEASE]);
          if (!f || f[1] !== u)
            throw new Error(`invalid identifier: ${u}`);
        }
      }
      switch (c) {
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
          const f = Number(p) ? 1 : 0;
          if (this.prerelease.length === 0)
            this.prerelease = [f];
          else {
            let E = this.prerelease.length;
            for (; --E >= 0; )
              typeof this.prerelease[E] == "number" && (this.prerelease[E]++, E = -2);
            if (E === -1) {
              if (u === this.prerelease.join(".") && p === !1)
                throw new Error("invalid increment argument: identifier already exists");
              this.prerelease.push(f);
            }
          }
          if (u) {
            let E = [u, f];
            p === !1 && (E = [u]), s(this.prerelease[0], u) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = E) : this.prerelease = E;
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${c}`);
      }
      return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
    }
  }
  return Yr = a, Yr;
}
var Kr, to;
function nn() {
  if (to) return Kr;
  to = 1;
  const r = Ie();
  return Kr = (t, n, i = !1) => {
    if (t instanceof r)
      return t;
    try {
      return new r(t, n);
    } catch (o) {
      if (!i)
        return null;
      throw o;
    }
  }, Kr;
}
var Zr, no;
function Tc() {
  if (no) return Zr;
  no = 1;
  const r = nn();
  return Zr = (t, n) => {
    const i = r(t, n);
    return i ? i.version : null;
  }, Zr;
}
var Qr, ro;
function Rc() {
  if (ro) return Qr;
  ro = 1;
  const r = nn();
  return Qr = (t, n) => {
    const i = r(t.trim().replace(/^[=v]+/, ""), n);
    return i ? i.version : null;
  }, Qr;
}
var Jr, io;
function Ac() {
  if (io) return Jr;
  io = 1;
  const r = Ie();
  return Jr = (t, n, i, o, s) => {
    typeof i == "string" && (s = o, o = i, i = void 0);
    try {
      return new r(
        t instanceof r ? t.version : t,
        i
      ).inc(n, o, s).version;
    } catch {
      return null;
    }
  }, Jr;
}
var ei, so;
function Cc() {
  if (so) return ei;
  so = 1;
  const r = nn();
  return ei = (t, n) => {
    const i = r(t, null, !0), o = r(n, null, !0), s = i.compare(o);
    if (s === 0)
      return null;
    const a = s > 0, l = a ? i : o, c = a ? o : i, u = !!l.prerelease.length;
    if (!!c.prerelease.length && !u) {
      if (!c.patch && !c.minor)
        return "major";
      if (c.compareMain(l) === 0)
        return c.minor && !c.patch ? "minor" : "patch";
    }
    const f = u ? "pre" : "";
    return i.major !== o.major ? f + "major" : i.minor !== o.minor ? f + "minor" : i.patch !== o.patch ? f + "patch" : "prerelease";
  }, ei;
}
var ti, oo;
function Lc() {
  if (oo) return ti;
  oo = 1;
  const r = Ie();
  return ti = (t, n) => new r(t, n).major, ti;
}
var ni, ao;
function Oc() {
  if (ao) return ni;
  ao = 1;
  const r = Ie();
  return ni = (t, n) => new r(t, n).minor, ni;
}
var ri, lo;
function Ic() {
  if (lo) return ri;
  lo = 1;
  const r = Ie();
  return ri = (t, n) => new r(t, n).patch, ri;
}
var ii, co;
function Nc() {
  if (co) return ii;
  co = 1;
  const r = nn();
  return ii = (t, n) => {
    const i = r(t, n);
    return i && i.prerelease.length ? i.prerelease : null;
  }, ii;
}
var si, uo;
function Ke() {
  if (uo) return si;
  uo = 1;
  const r = Ie();
  return si = (t, n, i) => new r(t, i).compare(new r(n, i)), si;
}
var oi, ho;
function Pc() {
  if (ho) return oi;
  ho = 1;
  const r = Ke();
  return oi = (t, n, i) => r(n, t, i), oi;
}
var ai, fo;
function $c() {
  if (fo) return ai;
  fo = 1;
  const r = Ke();
  return ai = (t, n) => r(t, n, !0), ai;
}
var li, po;
function ls() {
  if (po) return li;
  po = 1;
  const r = Ie();
  return li = (t, n, i) => {
    const o = new r(t, i), s = new r(n, i);
    return o.compare(s) || o.compareBuild(s);
  }, li;
}
var ci, go;
function Mc() {
  if (go) return ci;
  go = 1;
  const r = ls();
  return ci = (t, n) => t.sort((i, o) => r(i, o, n)), ci;
}
var ui, mo;
function Dc() {
  if (mo) return ui;
  mo = 1;
  const r = ls();
  return ui = (t, n) => t.sort((i, o) => r(o, i, n)), ui;
}
var hi, wo;
function vr() {
  if (wo) return hi;
  wo = 1;
  const r = Ke();
  return hi = (t, n, i) => r(t, n, i) > 0, hi;
}
var di, bo;
function cs() {
  if (bo) return di;
  bo = 1;
  const r = Ke();
  return di = (t, n, i) => r(t, n, i) < 0, di;
}
var fi, Eo;
function ua() {
  if (Eo) return fi;
  Eo = 1;
  const r = Ke();
  return fi = (t, n, i) => r(t, n, i) === 0, fi;
}
var pi, vo;
function ha() {
  if (vo) return pi;
  vo = 1;
  const r = Ke();
  return pi = (t, n, i) => r(t, n, i) !== 0, pi;
}
var gi, yo;
function us() {
  if (yo) return gi;
  yo = 1;
  const r = Ke();
  return gi = (t, n, i) => r(t, n, i) >= 0, gi;
}
var mi, ko;
function hs() {
  if (ko) return mi;
  ko = 1;
  const r = Ke();
  return mi = (t, n, i) => r(t, n, i) <= 0, mi;
}
var wi, So;
function da() {
  if (So) return wi;
  So = 1;
  const r = ua(), e = ha(), t = vr(), n = us(), i = cs(), o = hs();
  return wi = (a, l, c, u) => {
    switch (l) {
      case "===":
        return typeof a == "object" && (a = a.version), typeof c == "object" && (c = c.version), a === c;
      case "!==":
        return typeof a == "object" && (a = a.version), typeof c == "object" && (c = c.version), a !== c;
      case "":
      case "=":
      case "==":
        return r(a, c, u);
      case "!=":
        return e(a, c, u);
      case ">":
        return t(a, c, u);
      case ">=":
        return n(a, c, u);
      case "<":
        return i(a, c, u);
      case "<=":
        return o(a, c, u);
      default:
        throw new TypeError(`Invalid operator: ${l}`);
    }
  }, wi;
}
var bi, _o;
function Bc() {
  if (_o) return bi;
  _o = 1;
  const r = Ie(), e = nn(), { safeRe: t, t: n } = $n();
  return bi = (o, s) => {
    if (o instanceof r)
      return o;
    if (typeof o == "number" && (o = String(o)), typeof o != "string")
      return null;
    s = s || {};
    let a = null;
    if (!s.rtl)
      a = o.match(s.includePrerelease ? t[n.COERCEFULL] : t[n.COERCE]);
    else {
      const E = s.includePrerelease ? t[n.COERCERTLFULL] : t[n.COERCERTL];
      let R;
      for (; (R = E.exec(o)) && (!a || a.index + a[0].length !== o.length); )
        (!a || R.index + R[0].length !== a.index + a[0].length) && (a = R), E.lastIndex = R.index + R[1].length + R[2].length;
      E.lastIndex = -1;
    }
    if (a === null)
      return null;
    const l = a[2], c = a[3] || "0", u = a[4] || "0", p = s.includePrerelease && a[5] ? `-${a[5]}` : "", f = s.includePrerelease && a[6] ? `+${a[6]}` : "";
    return e(`${l}.${c}.${u}${p}${f}`, s);
  }, bi;
}
var Ei, xo;
function Uc() {
  if (xo) return Ei;
  xo = 1;
  class r {
    constructor() {
      this.max = 1e3, this.map = /* @__PURE__ */ new Map();
    }
    get(t) {
      const n = this.map.get(t);
      if (n !== void 0)
        return this.map.delete(t), this.map.set(t, n), n;
    }
    delete(t) {
      return this.map.delete(t);
    }
    set(t, n) {
      if (!this.delete(t) && n !== void 0) {
        if (this.map.size >= this.max) {
          const o = this.map.keys().next().value;
          this.delete(o);
        }
        this.map.set(t, n);
      }
      return this;
    }
  }
  return Ei = r, Ei;
}
var vi, To;
function Ze() {
  if (To) return vi;
  To = 1;
  const r = /\s+/g;
  class e {
    constructor(T, z) {
      if (z = i(z), T instanceof e)
        return T.loose === !!z.loose && T.includePrerelease === !!z.includePrerelease ? T : new e(T.raw, z);
      if (T instanceof o)
        return this.raw = T.value, this.set = [[T]], this.formatted = void 0, this;
      if (this.options = z, this.loose = !!z.loose, this.includePrerelease = !!z.includePrerelease, this.raw = T.trim().replace(r, " "), this.set = this.raw.split("||").map((P) => this.parseRange(P.trim())).filter((P) => P.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const P = this.set[0];
        if (this.set = this.set.filter((M) => !w(M[0])), this.set.length === 0)
          this.set = [P];
        else if (this.set.length > 1) {
          for (const M of this.set)
            if (M.length === 1 && N(M[0])) {
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
        for (let T = 0; T < this.set.length; T++) {
          T > 0 && (this.formatted += "||");
          const z = this.set[T];
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
    parseRange(T) {
      const P = ((this.options.includePrerelease && E) | (this.options.loose && R)) + ":" + T, M = n.get(P);
      if (M)
        return M;
      const $ = this.options.loose, q = $ ? l[c.HYPHENRANGELOOSE] : l[c.HYPHENRANGE];
      T = T.replace(q, ot(this.options.includePrerelease)), s("hyphen replace", T), T = T.replace(l[c.COMPARATORTRIM], u), s("comparator trim", T), T = T.replace(l[c.TILDETRIM], p), s("tilde trim", T), T = T.replace(l[c.CARETTRIM], f), s("caret trim", T);
      let V = T.split(" ").map((X) => J(X, this.options)).join(" ").split(/\s+/).map((X) => Ee(X, this.options));
      $ && (V = V.filter((X) => (s("loose invalid filter", X, this.options), !!X.match(l[c.COMPARATORLOOSE])))), s("range list", V);
      const K = /* @__PURE__ */ new Map(), W = V.map((X) => new o(X, this.options));
      for (const X of W) {
        if (w(X))
          return [X];
        K.set(X.value, X);
      }
      K.size > 1 && K.has("") && K.delete("");
      const ye = [...K.values()];
      return n.set(P, ye), ye;
    }
    intersects(T, z) {
      if (!(T instanceof e))
        throw new TypeError("a Range is required");
      return this.set.some((P) => j(P, z) && T.set.some((M) => j(M, z) && P.every(($) => M.every((q) => $.intersects(q, z)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(T) {
      if (!T)
        return !1;
      if (typeof T == "string")
        try {
          T = new a(T, this.options);
        } catch {
          return !1;
        }
      for (let z = 0; z < this.set.length; z++)
        if (at(this.set[z], T, this.options))
          return !0;
      return !1;
    }
  }
  vi = e;
  const t = Uc(), n = new t(), i = as(), o = yr(), s = Er(), a = Ie(), {
    safeRe: l,
    t: c,
    comparatorTrimReplace: u,
    tildeTrimReplace: p,
    caretTrimReplace: f
  } = $n(), { FLAG_INCLUDE_PRERELEASE: E, FLAG_LOOSE: R } = br(), w = (A) => A.value === "<0.0.0-0", N = (A) => A.value === "", j = (A, T) => {
    let z = !0;
    const P = A.slice();
    let M = P.pop();
    for (; z && P.length; )
      z = P.every(($) => M.intersects($, T)), M = P.pop();
    return z;
  }, J = (A, T) => (s("comp", A, T), A = ne(A, T), s("caret", A), A = ee(A, T), s("tildes", A), A = F(A, T), s("xrange", A), A = Qe(A, T), s("stars", A), A), Q = (A) => !A || A.toLowerCase() === "x" || A === "*", ee = (A, T) => A.trim().split(/\s+/).map((z) => he(z, T)).join(" "), he = (A, T) => {
    const z = T.loose ? l[c.TILDELOOSE] : l[c.TILDE];
    return A.replace(z, (P, M, $, q, V) => {
      s("tilde", A, P, M, $, q, V);
      let K;
      return Q(M) ? K = "" : Q($) ? K = `>=${M}.0.0 <${+M + 1}.0.0-0` : Q(q) ? K = `>=${M}.${$}.0 <${M}.${+$ + 1}.0-0` : V ? (s("replaceTilde pr", V), K = `>=${M}.${$}.${q}-${V} <${M}.${+$ + 1}.0-0`) : K = `>=${M}.${$}.${q} <${M}.${+$ + 1}.0-0`, s("tilde return", K), K;
    });
  }, ne = (A, T) => A.trim().split(/\s+/).map((z) => oe(z, T)).join(" "), oe = (A, T) => {
    s("caret", A, T);
    const z = T.loose ? l[c.CARETLOOSE] : l[c.CARET], P = T.includePrerelease ? "-0" : "";
    return A.replace(z, (M, $, q, V, K) => {
      s("caret", A, M, $, q, V, K);
      let W;
      return Q($) ? W = "" : Q(q) ? W = `>=${$}.0.0${P} <${+$ + 1}.0.0-0` : Q(V) ? $ === "0" ? W = `>=${$}.${q}.0${P} <${$}.${+q + 1}.0-0` : W = `>=${$}.${q}.0${P} <${+$ + 1}.0.0-0` : K ? (s("replaceCaret pr", K), $ === "0" ? q === "0" ? W = `>=${$}.${q}.${V}-${K} <${$}.${q}.${+V + 1}-0` : W = `>=${$}.${q}.${V}-${K} <${$}.${+q + 1}.0-0` : W = `>=${$}.${q}.${V}-${K} <${+$ + 1}.0.0-0`) : (s("no pr"), $ === "0" ? q === "0" ? W = `>=${$}.${q}.${V}${P} <${$}.${q}.${+V + 1}-0` : W = `>=${$}.${q}.${V}${P} <${$}.${+q + 1}.0-0` : W = `>=${$}.${q}.${V} <${+$ + 1}.0.0-0`), s("caret return", W), W;
    });
  }, F = (A, T) => (s("replaceXRanges", A, T), A.split(/\s+/).map((z) => Ve(z, T)).join(" ")), Ve = (A, T) => {
    A = A.trim();
    const z = T.loose ? l[c.XRANGELOOSE] : l[c.XRANGE];
    return A.replace(z, (P, M, $, q, V, K) => {
      s("xRange", A, P, M, $, q, V, K);
      const W = Q($), ye = W || Q(q), X = ye || Q(V), Me = X;
      return M === "=" && Me && (M = ""), K = T.includePrerelease ? "-0" : "", W ? M === ">" || M === "<" ? P = "<0.0.0-0" : P = "*" : M && Me ? (ye && (q = 0), V = 0, M === ">" ? (M = ">=", ye ? ($ = +$ + 1, q = 0, V = 0) : (q = +q + 1, V = 0)) : M === "<=" && (M = "<", ye ? $ = +$ + 1 : q = +q + 1), M === "<" && (K = "-0"), P = `${M + $}.${q}.${V}${K}`) : ye ? P = `>=${$}.0.0${K} <${+$ + 1}.0.0-0` : X && (P = `>=${$}.${q}.0${K} <${$}.${+q + 1}.0-0`), s("xRange return", P), P;
    });
  }, Qe = (A, T) => (s("replaceStars", A, T), A.trim().replace(l[c.STAR], "")), Ee = (A, T) => (s("replaceGTE0", A, T), A.trim().replace(l[T.includePrerelease ? c.GTE0PRE : c.GTE0], "")), ot = (A) => (T, z, P, M, $, q, V, K, W, ye, X, Me) => (Q(P) ? z = "" : Q(M) ? z = `>=${P}.0.0${A ? "-0" : ""}` : Q($) ? z = `>=${P}.${M}.0${A ? "-0" : ""}` : q ? z = `>=${z}` : z = `>=${z}${A ? "-0" : ""}`, Q(W) ? K = "" : Q(ye) ? K = `<${+W + 1}.0.0-0` : Q(X) ? K = `<${W}.${+ye + 1}.0-0` : Me ? K = `<=${W}.${ye}.${X}-${Me}` : A ? K = `<${W}.${ye}.${+X + 1}-0` : K = `<=${K}`, `${z} ${K}`.trim()), at = (A, T, z) => {
    for (let P = 0; P < A.length; P++)
      if (!A[P].test(T))
        return !1;
    if (T.prerelease.length && !z.includePrerelease) {
      for (let P = 0; P < A.length; P++)
        if (s(A[P].semver), A[P].semver !== o.ANY && A[P].semver.prerelease.length > 0) {
          const M = A[P].semver;
          if (M.major === T.major && M.minor === T.minor && M.patch === T.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return vi;
}
var yi, Ro;
function yr() {
  if (Ro) return yi;
  Ro = 1;
  const r = Symbol("SemVer ANY");
  class e {
    static get ANY() {
      return r;
    }
    constructor(u, p) {
      if (p = t(p), u instanceof e) {
        if (u.loose === !!p.loose)
          return u;
        u = u.value;
      }
      u = u.trim().split(/\s+/).join(" "), s("comparator", u, p), this.options = p, this.loose = !!p.loose, this.parse(u), this.semver === r ? this.value = "" : this.value = this.operator + this.semver.version, s("comp", this);
    }
    parse(u) {
      const p = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], f = u.match(p);
      if (!f)
        throw new TypeError(`Invalid comparator: ${u}`);
      this.operator = f[1] !== void 0 ? f[1] : "", this.operator === "=" && (this.operator = ""), f[2] ? this.semver = new a(f[2], this.options.loose) : this.semver = r;
    }
    toString() {
      return this.value;
    }
    test(u) {
      if (s("Comparator.test", u, this.options.loose), this.semver === r || u === r)
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
      return this.operator === "" ? this.value === "" ? !0 : new l(u.value, p).test(this.value) : u.operator === "" ? u.value === "" ? !0 : new l(this.value, p).test(u.semver) : (p = t(p), p.includePrerelease && (this.value === "<0.0.0-0" || u.value === "<0.0.0-0") || !p.includePrerelease && (this.value.startsWith("<0.0.0") || u.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && u.operator.startsWith(">") || this.operator.startsWith("<") && u.operator.startsWith("<") || this.semver.version === u.semver.version && this.operator.includes("=") && u.operator.includes("=") || o(this.semver, "<", u.semver, p) && this.operator.startsWith(">") && u.operator.startsWith("<") || o(this.semver, ">", u.semver, p) && this.operator.startsWith("<") && u.operator.startsWith(">")));
    }
  }
  yi = e;
  const t = as(), { safeRe: n, t: i } = $n(), o = da(), s = Er(), a = Ie(), l = Ze();
  return yi;
}
var ki, Ao;
function kr() {
  if (Ao) return ki;
  Ao = 1;
  const r = Ze();
  return ki = (t, n, i) => {
    try {
      n = new r(n, i);
    } catch {
      return !1;
    }
    return n.test(t);
  }, ki;
}
var Si, Co;
function zc() {
  if (Co) return Si;
  Co = 1;
  const r = Ze();
  return Si = (t, n) => new r(t, n).set.map((i) => i.map((o) => o.value).join(" ").trim().split(" ")), Si;
}
var _i, Lo;
function Vc() {
  if (Lo) return _i;
  Lo = 1;
  const r = Ie(), e = Ze();
  return _i = (n, i, o) => {
    let s = null, a = null, l = null;
    try {
      l = new e(i, o);
    } catch {
      return null;
    }
    return n.forEach((c) => {
      l.test(c) && (!s || a.compare(c) === -1) && (s = c, a = new r(s, o));
    }), s;
  }, _i;
}
var xi, Oo;
function Fc() {
  if (Oo) return xi;
  Oo = 1;
  const r = Ie(), e = Ze();
  return xi = (n, i, o) => {
    let s = null, a = null, l = null;
    try {
      l = new e(i, o);
    } catch {
      return null;
    }
    return n.forEach((c) => {
      l.test(c) && (!s || a.compare(c) === 1) && (s = c, a = new r(s, o));
    }), s;
  }, xi;
}
var Ti, Io;
function Hc() {
  if (Io) return Ti;
  Io = 1;
  const r = Ie(), e = Ze(), t = vr();
  return Ti = (i, o) => {
    i = new e(i, o);
    let s = new r("0.0.0");
    if (i.test(s) || (s = new r("0.0.0-0"), i.test(s)))
      return s;
    s = null;
    for (let a = 0; a < i.set.length; ++a) {
      const l = i.set[a];
      let c = null;
      l.forEach((u) => {
        const p = new r(u.semver.version);
        switch (u.operator) {
          case ">":
            p.prerelease.length === 0 ? p.patch++ : p.prerelease.push(0), p.raw = p.format();
          /* fallthrough */
          case "":
          case ">=":
            (!c || t(p, c)) && (c = p);
            break;
          case "<":
          case "<=":
            break;
          /* istanbul ignore next */
          default:
            throw new Error(`Unexpected operation: ${u.operator}`);
        }
      }), c && (!s || t(s, c)) && (s = c);
    }
    return s && i.test(s) ? s : null;
  }, Ti;
}
var Ri, No;
function qc() {
  if (No) return Ri;
  No = 1;
  const r = Ze();
  return Ri = (t, n) => {
    try {
      return new r(t, n).range || "*";
    } catch {
      return null;
    }
  }, Ri;
}
var Ai, Po;
function ds() {
  if (Po) return Ai;
  Po = 1;
  const r = Ie(), e = yr(), { ANY: t } = e, n = Ze(), i = kr(), o = vr(), s = cs(), a = hs(), l = us();
  return Ai = (u, p, f, E) => {
    u = new r(u, E), p = new n(p, E);
    let R, w, N, j, J;
    switch (f) {
      case ">":
        R = o, w = a, N = s, j = ">", J = ">=";
        break;
      case "<":
        R = s, w = l, N = o, j = "<", J = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (i(u, p, E))
      return !1;
    for (let Q = 0; Q < p.set.length; ++Q) {
      const ee = p.set[Q];
      let he = null, ne = null;
      if (ee.forEach((oe) => {
        oe.semver === t && (oe = new e(">=0.0.0")), he = he || oe, ne = ne || oe, R(oe.semver, he.semver, E) ? he = oe : N(oe.semver, ne.semver, E) && (ne = oe);
      }), he.operator === j || he.operator === J || (!ne.operator || ne.operator === j) && w(u, ne.semver))
        return !1;
      if (ne.operator === J && N(u, ne.semver))
        return !1;
    }
    return !0;
  }, Ai;
}
var Ci, $o;
function jc() {
  if ($o) return Ci;
  $o = 1;
  const r = ds();
  return Ci = (t, n, i) => r(t, n, ">", i), Ci;
}
var Li, Mo;
function Gc() {
  if (Mo) return Li;
  Mo = 1;
  const r = ds();
  return Li = (t, n, i) => r(t, n, "<", i), Li;
}
var Oi, Do;
function Wc() {
  if (Do) return Oi;
  Do = 1;
  const r = Ze();
  return Oi = (t, n, i) => (t = new r(t, i), n = new r(n, i), t.intersects(n, i)), Oi;
}
var Ii, Bo;
function Xc() {
  if (Bo) return Ii;
  Bo = 1;
  const r = kr(), e = Ke();
  return Ii = (t, n, i) => {
    const o = [];
    let s = null, a = null;
    const l = t.sort((f, E) => e(f, E, i));
    for (const f of l)
      r(f, n, i) ? (a = f, s || (s = f)) : (a && o.push([s, a]), a = null, s = null);
    s && o.push([s, null]);
    const c = [];
    for (const [f, E] of o)
      f === E ? c.push(f) : !E && f === l[0] ? c.push("*") : E ? f === l[0] ? c.push(`<=${E}`) : c.push(`${f} - ${E}`) : c.push(`>=${f}`);
    const u = c.join(" || "), p = typeof n.raw == "string" ? n.raw : String(n);
    return u.length < p.length ? u : n;
  }, Ii;
}
var Ni, Uo;
function Yc() {
  if (Uo) return Ni;
  Uo = 1;
  const r = Ze(), e = yr(), { ANY: t } = e, n = kr(), i = Ke(), o = (p, f, E = {}) => {
    if (p === f)
      return !0;
    p = new r(p, E), f = new r(f, E);
    let R = !1;
    e: for (const w of p.set) {
      for (const N of f.set) {
        const j = l(w, N, E);
        if (R = R || j !== null, j)
          continue e;
      }
      if (R)
        return !1;
    }
    return !0;
  }, s = [new e(">=0.0.0-0")], a = [new e(">=0.0.0")], l = (p, f, E) => {
    if (p === f)
      return !0;
    if (p.length === 1 && p[0].semver === t) {
      if (f.length === 1 && f[0].semver === t)
        return !0;
      E.includePrerelease ? p = s : p = a;
    }
    if (f.length === 1 && f[0].semver === t) {
      if (E.includePrerelease)
        return !0;
      f = a;
    }
    const R = /* @__PURE__ */ new Set();
    let w, N;
    for (const F of p)
      F.operator === ">" || F.operator === ">=" ? w = c(w, F, E) : F.operator === "<" || F.operator === "<=" ? N = u(N, F, E) : R.add(F.semver);
    if (R.size > 1)
      return null;
    let j;
    if (w && N) {
      if (j = i(w.semver, N.semver, E), j > 0)
        return null;
      if (j === 0 && (w.operator !== ">=" || N.operator !== "<="))
        return null;
    }
    for (const F of R) {
      if (w && !n(F, String(w), E) || N && !n(F, String(N), E))
        return null;
      for (const Ve of f)
        if (!n(F, String(Ve), E))
          return !1;
      return !0;
    }
    let J, Q, ee, he, ne = N && !E.includePrerelease && N.semver.prerelease.length ? N.semver : !1, oe = w && !E.includePrerelease && w.semver.prerelease.length ? w.semver : !1;
    ne && ne.prerelease.length === 1 && N.operator === "<" && ne.prerelease[0] === 0 && (ne = !1);
    for (const F of f) {
      if (he = he || F.operator === ">" || F.operator === ">=", ee = ee || F.operator === "<" || F.operator === "<=", w) {
        if (oe && F.semver.prerelease && F.semver.prerelease.length && F.semver.major === oe.major && F.semver.minor === oe.minor && F.semver.patch === oe.patch && (oe = !1), F.operator === ">" || F.operator === ">=") {
          if (J = c(w, F, E), J === F && J !== w)
            return !1;
        } else if (w.operator === ">=" && !n(w.semver, String(F), E))
          return !1;
      }
      if (N) {
        if (ne && F.semver.prerelease && F.semver.prerelease.length && F.semver.major === ne.major && F.semver.minor === ne.minor && F.semver.patch === ne.patch && (ne = !1), F.operator === "<" || F.operator === "<=") {
          if (Q = u(N, F, E), Q === F && Q !== N)
            return !1;
        } else if (N.operator === "<=" && !n(N.semver, String(F), E))
          return !1;
      }
      if (!F.operator && (N || w) && j !== 0)
        return !1;
    }
    return !(w && ee && !N && j !== 0 || N && he && !w && j !== 0 || oe || ne);
  }, c = (p, f, E) => {
    if (!p)
      return f;
    const R = i(p.semver, f.semver, E);
    return R > 0 ? p : R < 0 || f.operator === ">" && p.operator === ">=" ? f : p;
  }, u = (p, f, E) => {
    if (!p)
      return f;
    const R = i(p.semver, f.semver, E);
    return R < 0 ? p : R > 0 || f.operator === "<" && p.operator === "<=" ? f : p;
  };
  return Ni = o, Ni;
}
var Pi, zo;
function Kc() {
  if (zo) return Pi;
  zo = 1;
  const r = $n(), e = br(), t = Ie(), n = ca(), i = nn(), o = Tc(), s = Rc(), a = Ac(), l = Cc(), c = Lc(), u = Oc(), p = Ic(), f = Nc(), E = Ke(), R = Pc(), w = $c(), N = ls(), j = Mc(), J = Dc(), Q = vr(), ee = cs(), he = ua(), ne = ha(), oe = us(), F = hs(), Ve = da(), Qe = Bc(), Ee = yr(), ot = Ze(), at = kr(), A = zc(), T = Vc(), z = Fc(), P = Hc(), M = qc(), $ = ds(), q = jc(), V = Gc(), K = Wc(), W = Xc(), ye = Yc();
  return Pi = {
    parse: i,
    valid: o,
    clean: s,
    inc: a,
    diff: l,
    major: c,
    minor: u,
    patch: p,
    prerelease: f,
    compare: E,
    rcompare: R,
    compareLoose: w,
    compareBuild: N,
    sort: j,
    rsort: J,
    gt: Q,
    lt: ee,
    eq: he,
    neq: ne,
    gte: oe,
    lte: F,
    cmp: Ve,
    coerce: Qe,
    Comparator: Ee,
    Range: ot,
    satisfies: at,
    toComparators: A,
    maxSatisfying: T,
    minSatisfying: z,
    minVersion: P,
    validRange: M,
    outside: $,
    gtr: q,
    ltr: V,
    intersects: K,
    simplifyRange: W,
    subset: ye,
    SemVer: t,
    re: r.re,
    src: r.src,
    tokens: r.t,
    SEMVER_SPEC_VERSION: e.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: e.RELEASE_TYPES,
    compareIdentifiers: n.compareIdentifiers,
    rcompareIdentifiers: n.rcompareIdentifiers
  }, Pi;
}
var $i = Kc();
class Zc {
  constructor(e) {
    this.onEventCallback = e, this.events = [];
  }
  push(e) {
    this.events.push(e), this.onEventCallback(e);
  }
}
function se(r, e) {
  switch (r.op) {
    // =====================
    // Root
    // =====================
    case "reg": {
      if (!(r.id in e.graphRegisters))
        throw new Error(`Graph Register '${r.id}' not found`);
      return e.graphRegisters[r.id];
    }
    case "local": {
      if (!(r.name in e.localVariables))
        throw new Error(`Local variable '${r.name}' not found`);
      return e.localVariables[r.name];
    }
    case "la":
      return e.lastAction;
    case "gli": {
      const t = se(
        r.list,
        e
      );
      if (!Array.isArray(t))
        throw new Error(`gli: list must be array, got '${typeof t}'`);
      const n = se(
        r.index,
        e
      );
      if (typeof n != "number")
        throw new Error(`gli: index must be number, got '${typeof n}'`);
      if (n < 0 || n >= t.length)
        throw new Error(`gli: index out of bounds, got index ${n} for list of length ${t.length}`);
      return t[n];
    }
    case "gdv": {
      const t = se(
        r.dict,
        e
      );
      if (typeof t != "object" || t === null || Array.isArray(t))
        throw new Error(`gdv: dict must be object, got '${typeof t}'`);
      const n = se(
        r.key,
        e
      );
      if (typeof n != "string")
        throw new Error(`gdv: key must be string, got '${typeof n}'`);
      if (!(n in t))
        throw new Error(`gdv: key '${n}' not found in dict`);
      return t[n];
    }
    case "lit":
      return r.value;
    // =====================
    // Conditional
    // =====================
    case "if":
      return se(
        r.cond,
        e
      ) ? se(
        r.then,
        e
      ) : se(
        r.otherwise,
        e
      );
    // =====================
    // Boolean logic
    // =====================
    case "not":
      return !se(
        r.operand,
        e
      );
    case "and": {
      for (const t of r.args) {
        const n = se(
          t,
          e
        );
        if (typeof n != "boolean")
          throw new Error(`and: all args must be boolean, got '${typeof n}'`);
        if (!n) return !1;
      }
      return !0;
    }
    case "or": {
      for (const t of r.args) {
        const n = se(t, e);
        if (typeof n != "boolean")
          throw new Error(`or: all args must be boolean, got '${typeof n}'`);
        if (n) return !0;
      }
      return !1;
    }
    // =====================
    // Comparators
    // =====================
    case "eq": {
      const t = se(
        r.lhs,
        e
      ), n = se(
        r.rhs,
        e
      );
      return t === n;
    }
    case "ne": {
      const t = se(
        r.lhs,
        e
      ), n = se(
        r.rhs,
        e
      );
      return t !== n;
    }
    case "gt":
    case "ge":
    case "lt":
    case "le": {
      const t = se(
        r.lhs,
        e
      ), n = se(
        r.rhs,
        e
      );
      if (typeof t != typeof n)
        throw new Error(
          `${r.op}: lhs and rhs must have same type, got '${typeof t}' and '${typeof n}'`
        );
      if (typeof t != "number" && typeof t != "string")
        throw new Error(
          `${r.op}: only number or string comparison supported, got '${typeof t}'`
        );
      switch (r.op) {
        case "gt":
          return t > n;
        case "ge":
          return t >= n;
        case "lt":
          return t < n;
        case "le":
          return t <= n;
        default:
          const i = r;
          throw new Error(`Unsupported comparator op: ${i.op}`);
      }
    }
    // =====================
    // Arithmetic
    // =====================
    case "add":
    case "sub":
    case "mul":
    case "div": {
      const t = se(
        r.lhs,
        e
      ), n = se(
        r.rhs,
        e
      );
      if (typeof t != "number" || typeof n != "number")
        throw new Error(
          `${r.op}: operands must be numbers, got '${typeof t}' and '${typeof n}'`
        );
      switch (r.op) {
        case "add":
          return t + n;
        case "sub":
          return t - n;
        case "mul":
          return t * n;
        case "div":
          if (n === 0)
            throw new Error("div: division by zero");
          return t / n;
        default:
          const i = r;
          throw new Error(`Unsupported arithmetic op: ${i.op}`);
      }
    }
    // =====================
    // Array ops
    // =====================
    case "append": {
      const t = se(
        r.array,
        e
      );
      if (!Array.isArray(t))
        throw new Error(`append: array must be array, got '${typeof t}'`);
      const n = se(
        r.value,
        e
      );
      return [...t, n];
    }
    case "concat": {
      const t = se(
        r.array,
        e
      );
      if (!Array.isArray(t))
        throw new Error(`concat: array must be array, got '${typeof t}'`);
      const n = se(
        r.value,
        e
      );
      if (!Array.isArray(n))
        throw new Error(`concat: value must be array, got '${typeof n}'`);
      return [...t, ...n];
    }
    case "slice": {
      const t = se(
        r.array,
        e
      );
      if (!Array.isArray(t))
        throw new Error(`slice: array must be array, got '${typeof t}'`);
      const n = se(
        r.start,
        e
      );
      if (typeof n != "number")
        throw new Error(`slice: start must be number, got '${typeof n}'`);
      let i;
      if (r.end !== null) {
        const o = se(
          r.end,
          e
        );
        if (typeof o != "number")
          throw new Error(`slice: end must be number, got '${typeof o}'`);
        i = o;
      }
      return t.slice(n, i);
    }
    case "map": {
      const t = se(
        r.array,
        e
      );
      if (!Array.isArray(t))
        throw new Error(`map: array must be array, got '${typeof t}'`);
      const n = r.cur, i = e.localVariables;
      return t.map((o) => se(
        r.func,
        {
          ...e,
          localVariables: {
            ...i,
            [n]: o
          }
        }
      ));
    }
    case "filter": {
      const t = se(
        r.array,
        e
      );
      if (!Array.isArray(t))
        throw new Error(`filter: array must be array, got '${typeof t}'`);
      const n = r.cur, i = e.localVariables, o = [];
      for (const s of t) {
        const a = se(
          r.predicate,
          {
            ...e,
            localVariables: {
              ...i,
              [n]: s
            }
          }
        );
        if (typeof a != "boolean")
          throw new Error(
            `filter: predicate must be boolean, got '${typeof a}'`
          );
        a && o.push(s);
      }
      return o;
    }
    case "fold": {
      const t = se(
        r.array,
        e
      );
      if (!Array.isArray(t))
        throw new Error(`fold: array must be array, got '${typeof t}'`);
      let n = se(
        r.init,
        e
      );
      const i = r.acc, o = r.cur, s = e.localVariables;
      for (const a of t)
        n = se(
          r.func,
          {
            ...e,
            localVariables: {
              ...s,
              [i]: n,
              [o]: a
            }
          }
        );
      return n;
    }
    default: {
      const t = r;
      throw new Error(`Unsupported expression op: ${t.op}`);
    }
  }
}
function ji(r) {
  const { transition: e, registers: t, lastAction: n } = r;
  switch (e.transition_type) {
    case "Go": {
      const o = {};
      for (const [s, a] of Object.entries(e.register_updates))
        o[s] = se(
          a,
          {
            graphRegisters: t,
            localVariables: {},
            lastAction: n
          }
        );
      return {
        nextNodeId: e.to,
        registerUpdates: o
      };
    }
    case "Branch": {
      for (const { when: o, then: s } of e.cases)
        if (se(
          o,
          {
            graphRegisters: t,
            localVariables: {},
            lastAction: n
          }
        ))
          return ji({
            transition: s,
            registers: t,
            lastAction: n
          });
      return ji({
        transition: e.otherwise,
        registers: t,
        lastAction: n
      });
    }
    case "End":
      return {
        nextNodeId: null,
        registerUpdates: {}
      };
    default:
      const i = e;
      throw new Error(`Unhandled transition: ${JSON.stringify(i)}`);
  }
}
async function Qc(r, e = (n) => {
}, t = !1) {
  const n = new va();
  n.start();
  const i = new Zc(e), o = $a(), s = new Qa();
  o.appendChild(s.root);
  const a = Ja();
  if (o.appendChild(a), $i.gt(r.nodekit_version, nr) || $i.major(r.nodekit_version) !== $i.major(nr))
    throw new Error(`Incompatible NodeKit version requested: ${r.nodekit_version}, Runtime version: ${nr}`);
  if (!Pa()) {
    const N = new Error("Unsupported device for NodeKit. Please use a desktop browser.");
    throw s.showErrorOverlay(N), N;
  }
  s.showSessionConnectingOverlay();
  const l = new Ma();
  s.hideSessionConnectingOverlay(), t || await s.playStartScreen();
  const c = {
    event_type: "TraceStartedEvent",
    t: 0
  };
  i.push(c);
  function u() {
    if (document.visibilityState === "hidden") {
      const N = {
        event_type: "PageSuspendedEvent",
        t: n.now()
      };
      i.push(N);
    } else if (document.visibilityState === "visible") {
      const N = {
        event_type: "PageResumedEvent",
        t: n.now()
      };
      i.push(N);
    }
  }
  document.addEventListener("visibilitychange", u);
  const p = ya(n);
  i.push(p);
  const f = r.nodes;
  let E = r.start;
  for (; ; ) {
    const N = f[E], j = new xc(
      N,
      l,
      n
    );
    a.appendChild(j.root), await j.prepare();
    let J = await j.run();
    const Q = {
      event_type: "NodeStartedEvent",
      t: J.tStart,
      node_id: E
    };
    i.push(Q);
    const ee = {
      event_type: "ActionTakenEvent",
      node_id: E,
      action: J.action,
      t: J.action.t
    };
    i.push(ee);
    const he = {
      event_type: "NodeEndedEvent",
      t: J.tEnd,
      node_id: E
    };
    for (i.push(he); a.firstChild; )
      a.removeChild(a.firstChild);
    if (!(E in r.transitions)) {
      console.log("No transitions found; Graph finished");
      break;
    }
    let ne = null;
    const oe = r.transitions[E], F = ji(
      {
        transition: oe,
        registers: r.registers,
        lastAction: J.action
      }
    );
    if (ne = F.nextNodeId, ne === null)
      break;
    E = ne;
    for (const [Ve, Qe] of Object.entries(F.registerUpdates))
      r.registers[Ve] = Qe;
    console.warn("registers updated", r.registers);
  }
  const R = {
    event_type: "TraceEndedEvent",
    t: n.now()
  };
  i.push(R), document.removeEventListener("visibilitychange", u);
  const w = {
    nodekit_version: nr,
    events: i.events
  };
  return await s.playEndScreen(), s.showConsoleMessageOverlay(
    "Trace",
    w
  ), w;
}
export {
  Qc as play
};
