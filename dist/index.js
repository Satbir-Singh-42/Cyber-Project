// server/index.ts
import express2 from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

// server/routes.ts
import { createServer } from "http";
import { body, validationResult } from "express-validator";

// server/services/password-service.ts
var COMMON_PASSWORDS = [
  "password",
  "123456",
  "123456789",
  "qwerty",
  "abc123",
  "monkey",
  "letmein",
  "dragon",
  "111111",
  "baseball",
  "iloveyou",
  "trustno1",
  "sunshine",
  "master",
  "welcome",
  "shadow",
  "ashley",
  "football",
  "jesus",
  "michael",
  "ninja",
  "mustang",
  "password1",
  "admin",
  "password123",
  "12345678",
  "qwerty123",
  "password!",
  "welcome123",
  "password2024",
  "123qwe",
  "qwertyuiop",
  "zxcvbnm",
  "asdfghjkl",
  "passw0rd",
  "p@ssword",
  "secret",
  "login",
  "root",
  "toor",
  "guest",
  "user",
  "test",
  "demo",
  "temp",
  "changeme",
  "default"
];
var DICTIONARY_WORDS = [
  "love",
  "hate",
  "life",
  "death",
  "fire",
  "water",
  "earth",
  "wind",
  "happy",
  "sad",
  "angry",
  "peace",
  "war",
  "light",
  "dark",
  "good",
  "evil",
  "fast",
  "slow",
  "big",
  "small",
  "hot",
  "cold",
  "sweet",
  "bitter",
  "strong",
  "weak",
  "rich",
  "poor",
  "young",
  "old"
];
var PasswordService = class {
  analyzePassword(password) {
    const criteria = this.checkCriteria(password);
    const entropy = this.calculateEntropy(password);
    const score = this.calculateScore(password, criteria, entropy);
    const strength = this.getStrengthLevel(score);
    const suggestions = this.generateSuggestions(password, criteria);
    const crackTime = this.estimateCrackTime(entropy);
    return {
      score,
      strength,
      criteria,
      entropy,
      suggestions,
      crackTime
    };
  }
  checkCriteria(password) {
    return {
      length: password.length >= 8,
      specialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      numbers: /\d/.test(password),
      upperCase: /[A-Z]/.test(password),
      lowerCase: /[a-z]/.test(password),
      noDictionaryWords: !this.containsDictionaryWords(password.toLowerCase())
    };
  }
  containsDictionaryWords(password) {
    const lowerPassword = password.toLowerCase();
    return COMMON_PASSWORDS.some((common) => lowerPassword.includes(common)) || DICTIONARY_WORDS.some((word) => lowerPassword.includes(word));
  }
  calculateEntropy(password) {
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/\d/.test(password)) charsetSize += 10;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) charsetSize += 32;
    return Math.log2(Math.pow(charsetSize, password.length));
  }
  calculateScore(password, criteria, entropy) {
    let score = 0;
    if (password.length >= 12) score += 25;
    else if (password.length >= 8) score += 15;
    else if (password.length >= 6) score += 10;
    if (criteria.upperCase) score += 10;
    if (criteria.lowerCase) score += 10;
    if (criteria.numbers) score += 10;
    if (criteria.specialChars) score += 15;
    if (!criteria.noDictionaryWords) score -= 20;
    if (entropy >= 60) score += 20;
    else if (entropy >= 50) score += 15;
    else if (entropy >= 40) score += 10;
    if (this.hasRepeatingPatterns(password)) score -= 10;
    return Math.max(0, Math.min(100, score));
  }
  hasRepeatingPatterns(password) {
    const repeatedChars = /(.)\1{2,}/.test(password);
    const sequential = /(012|123|234|345|456|567|678|789|890|901|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|zyx|yxw|xwv|wvu|vut|uts|tsr|srq|rqp|qpo|pon|onm|nml|mlk|lkj|kji|jih|ihg|hgf|gfe|fed|edc|dcb|cba)/i.test(password);
    const keyboardPatterns = /(qwer|wert|erty|rtyu|tyui|yuio|uiop|asdf|sdfg|dfgh|fghj|ghjk|hjkl|zxcv|xcvb|cvbn|vbnm|qaz|wsx|edc|rfv|tgb|yhn|ujm|1qaz|2wsx|3edc|4rfv|5tgb|6yhn|7ujm|8ik|9ol|0p)/i.test(password);
    const alternating = /^(.)(.)\1\2/.test(password) || /^(.)(.)(.)\1\2\3/.test(password);
    return repeatedChars || sequential || keyboardPatterns || alternating;
  }
  getStrengthLevel(score) {
    if (score >= 80) return "very-strong";
    if (score >= 60) return "strong";
    if (score >= 40) return "medium";
    if (score >= 20) return "weak";
    return "very-weak";
  }
  generateSuggestions(password, criteria) {
    const suggestions = [];
    if (!criteria.length) {
      suggestions.push("Use at least 8 characters (12+ recommended)");
    }
    if (!criteria.upperCase) {
      suggestions.push("Add uppercase letters (A-Z)");
    }
    if (!criteria.lowerCase) {
      suggestions.push("Add lowercase letters (a-z)");
    }
    if (!criteria.numbers) {
      suggestions.push("Include numbers (0-9)");
    }
    if (!criteria.specialChars) {
      suggestions.push("Add special characters (!@#$%^&*)");
    }
    if (!criteria.noDictionaryWords) {
      suggestions.push("Avoid common words and phrases");
    }
    if (password.length < 12) {
      suggestions.push("Consider using a longer passphrase");
    }
    if (this.hasRepeatingPatterns(password)) {
      suggestions.push("Avoid repetitive patterns and sequences");
    }
    return suggestions;
  }
  estimateCrackTime(entropy) {
    const attempts = Math.pow(2, entropy) / 2;
    const scenarios = {
      basic: 1e3,
      // Basic online attack
      moderate: 1e6,
      // Offline attack with consumer hardware
      advanced: 1e12,
      // Dedicated cracking rig
      quantum: 1e15
      // Future quantum computing threat
    };
    const scenario = scenarios.advanced;
    const seconds = attempts / scenario;
    if (seconds < 1) return "Instantly";
    if (seconds < 60) return `${Math.ceil(seconds)} seconds`;
    if (seconds < 3600) return `${Math.ceil(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.ceil(seconds / 3600)} hours`;
    if (seconds < 2592e3) return `${Math.ceil(seconds / 86400)} days`;
    if (seconds < 31536e3) return `${Math.ceil(seconds / 2592e3)} months`;
    if (seconds < 31536e5) return `${Math.ceil(seconds / 31536e3)} years`;
    return "Centuries";
  }
};

// server/services/phishing-service.ts
import { URL } from "url";
var SUSPICIOUS_KEYWORDS = [
  "paypal",
  "amazon",
  "netflix",
  "microsoft",
  "google",
  "apple",
  "facebook",
  "secure",
  "verify",
  "update",
  "suspended",
  "confirm",
  "urgent",
  "click",
  "winner",
  "congratulations",
  "prize",
  "offer",
  "limited",
  "act-now",
  "banking",
  "account",
  "login",
  "signin",
  "verification",
  "auth",
  "security",
  "alert",
  "warning",
  "notice",
  "expired",
  "renewal",
  "billing",
  "payment",
  "refund",
  "claim",
  "validate",
  "activate",
  "unlock",
  "restore",
  "recover",
  "support",
  "service",
  "helpdesk",
  "customer",
  "team",
  "department",
  "cryptocurrency",
  "bitcoin",
  "ethereum",
  "wallet",
  "trading",
  "investment"
];
var SHORT_URL_DOMAINS = [
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "goo.gl",
  "ow.ly",
  "is.gd",
  "buff.ly",
  "s.id",
  "v.gd",
  "x.co",
  "short.link",
  "rebrand.ly",
  "cut.ly"
];
var SUSPICIOUS_TLDS = [
  "tk",
  "ml",
  "ga",
  "cf",
  "gq",
  "pw",
  "cc",
  "top",
  "work",
  "club",
  "live",
  "online",
  "site",
  "website",
  "space",
  "tech",
  "store",
  "fun",
  "xyz",
  "icu",
  "buzz",
  "link",
  "click",
  "download",
  "racing",
  "stream"
];
var BRAND_KEYWORDS = [
  "paypal",
  "amazon",
  "netflix",
  "microsoft",
  "google",
  "apple",
  "facebook",
  "instagram",
  "twitter",
  "linkedin",
  "github",
  "dropbox",
  "icloud",
  "gmail",
  "outlook",
  "chase",
  "bankofamerica",
  "wellsfargo",
  "coinbase",
  "binance",
  "stripe",
  "ebay",
  "walmart",
  "target"
];
var LEGITIMATE_DOMAINS = [
  // Search & Tech Giants
  "google.com",
  "youtube.com",
  "microsoft.com",
  "apple.com",
  "amazon.com",
  // Social Media
  "facebook.com",
  "twitter.com",
  "instagram.com",
  "linkedin.com",
  "reddit.com",
  "tiktok.com",
  "snapchat.com",
  "pinterest.com",
  "whatsapp.com",
  // Developer Platforms
  "github.com",
  "gitlab.com",
  "stackoverflow.com",
  "npmjs.com",
  "pypi.org",
  // Financial & Shopping
  "paypal.com",
  "stripe.com",
  "ebay.com",
  "walmart.com",
  "target.com",
  "bestbuy.com",
  "shopify.com",
  "etsy.com",
  // Banking
  "chase.com",
  "bankofamerica.com",
  "wellsfargo.com",
  "citi.com",
  "capitalone.com",
  "usbank.com",
  // Cloud & Services
  "dropbox.com",
  "office365.com",
  "outlook.com",
  "icloud.com",
  "drive.google.com",
  "onedrive.com",
  // Communication & Email
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "protonmail.com",
  "zoho.com",
  // Streaming & Entertainment
  "netflix.com",
  "spotify.com",
  "hulu.com",
  "twitch.tv",
  "disney.com",
  "primevideo.com",
  // News & Media
  "cnn.com",
  "bbc.com",
  "nytimes.com",
  "wikipedia.org",
  "medium.com",
  // E-commerce & Marketplaces
  "aliexpress.com",
  "alibaba.com",
  "wish.com",
  "wayfair.com",
  // Crypto & Finance
  "coinbase.com",
  "binance.com",
  "kraken.com",
  "blockchain.com",
  // Government & Education
  "irs.gov",
  "usa.gov",
  "gov.uk",
  "mit.edu",
  "stanford.edu",
  // Security & Services
  "adobe.com",
  "zoom.us",
  "slack.com",
  "discord.com",
  "notion.so",
  "canva.com",
  // Design & Productivity
  "figma.com",
  "sketch.com",
  "invision.com",
  "miro.com",
  "trello.com",
  "asana.com",
  "monday.com",
  "airtable.com",
  "clickup.com"
];
var TYPOSQUATTING_PATTERNS = {
  // Search & Tech
  "google.com": ["gooogle.com", "googgle.com", "gogle.com", "googel.com", "g00gle.com", "googlr.com", "goog1e.com"],
  "youtube.com": ["toutube.com", "youtub.com", "yotube.com", "youtuube.com", "youtobe.com", "youtbe.com", "youtubr.com"],
  "microsoft.com": ["micros0ft.com", "microsof.com", "mlcrosoft.com", "micosoft.com", "microsfot.com"],
  "apple.com": ["appie.com", "appl3.com", "aple.com", "applle.com", "apppe.com"],
  "amazon.com": ["amazom.com", "amaz0n.com", "amazan.com", "amazoon.com", "arnaz0n.com", "arnazon.com"],
  // Social Media
  "facebook.com": ["faceboook.com", "facebok.com", "faceb00k.com", "fecebook.com", "faceboook.com", "facebk.com"],
  "twitter.com": ["twiter.com", "twtter.com", "twitt3r.com", "twitterr.com", "twiiter.com"],
  "instagram.com": ["instagrarn.com", "instgram.com", "instagran.com", "inst4gram.com", "instagramm.com"],
  "linkedin.com": ["linkedln.com", "linkdin.com", "linkedim.com", "linkeldin.com", "linkedln.com"],
  "tiktok.com": ["tiktoc.com", "tikttok.com", "tiktokk.com", "tlktok.com"],
  // Developer
  "github.com": ["githup.com", "githb.com", "guthub.com", "githib.com", "gathub.com", "githhub.com"],
  "stackoverflow.com": ["stackoverfiow.com", "stackoverflow.co", "stackoverfow.com", "stackoverflw.com"],
  // Financial
  "paypal.com": ["paypai.com", "paypa1.com", "payppal.com", "paypa.com", "paypai.com", "paypaI.com"],
  "stripe.com": ["strpe.com", "strlpe.com", "stripee.com", "str1pe.com"],
  // Banking
  "chase.com": ["chas3.com", "chasse.com", "chace.com", "cbase.com"],
  "bankofamerica.com": ["bankofamercia.com", "bankofamerlca.com", "bankofamerica.co"],
  // Cloud
  "dropbox.com": ["dropb0x.com", "drophox.com", "dropbx.com", "dropp-box.com"],
  "icloud.com": ["icl0ud.com", "iclould.com", "iclaud.com", "icIoud.com"],
  // Email
  "gmail.com": ["gmai1.com", "gmial.com", "grnail.com", "gmai.com", "gmaill.com"],
  "outlook.com": ["out1ook.com", "outlok.com", "outlookk.com", "0utlook.com"],
  // Streaming
  "netflix.com": ["netfl1x.com", "netfllx.com", "netfiix.com", "netflex.com", "netflx.com"],
  "spotify.com": ["spotlfy.com", "spot1fy.com", "spotfy.com", "spotifyy.com"],
  // Crypto
  "coinbase.com": ["c0inbase.com", "coinbasse.com", "coinbas3.com", "colnbase.com"],
  "binance.com": ["blnance.com", "binanse.com", "binannce.com", "binnance.com"],
  // Design & Productivity
  "figma.com": ["figmo.com", "flgma.com", "figm.com", "figmaa.com", "fiqma.com", "figna.com"],
  "slack.com": ["slak.com", "sIack.com", "slck.com", "s1ack.com", "slackk.com"],
  "zoom.us": ["zo0m.us", "zoom.com", "z00m.us", "zom.us", "zooom.us"],
  "discord.com": ["discrod.com", "dlscord.com", "disc0rd.com", "disord.com", "discordd.com"],
  "notion.so": ["notion.com", "notlon.so", "noti0n.so", "notionn.so"],
  "trello.com": ["trelo.com", "trel1o.com", "tre11o.com", "trello.co"],
  "canva.com": ["canv.com", "canva.co", "canvva.com", "cana.com"]
};
var PhishingService = class {
  async analyzeUrl(urlString) {
    try {
      const url = new URL(urlString);
      const indicators = this.checkIndicators(url, urlString);
      const score = this.calculateRiskScore(indicators, url.hostname, urlString);
      const risk = this.getRiskLevel(score);
      const details = this.generateDetails(indicators);
      const recommendations = this.generateRecommendations(indicators, risk);
      return {
        score,
        risk,
        indicators,
        details,
        recommendations,
        metadata: {
          hostname: url.hostname,
          tld: url.hostname.split(".").pop() || "unknown",
          analyzedAt: (/* @__PURE__ */ new Date()).toISOString(),
          urlLength: urlString.length,
          subdomainCount: this.calculateSubdomainCount(url.hostname)
        }
      };
    } catch {
      return this.invalidUrlResponse();
    }
  }
  calculateSubdomainCount(hostname) {
    const parts = hostname.toLowerCase().split(".");
    if (parts.length <= 1) {
      return 0;
    }
    const multiLevelTLDs = ["co.uk", "com.au", "co.jp", "co.nz", "co.za", "com.br", "com.cn"];
    if (parts.length >= 3) {
      const lastTwo = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
      if (multiLevelTLDs.includes(lastTwo)) {
        return Math.max(0, parts.length - 3);
      }
    }
    return Math.max(0, parts.length - 2);
  }
  checkIndicators(url, fullUrl) {
    const hostname = url.hostname.toLowerCase();
    return {
      ipBasedUrl: this.isIpBasedUrl(hostname),
      suspiciousSubdomains: this.hasSuspiciousSubdomains(hostname),
      shortUrl: this.isShortUrl(hostname),
      suspiciousKeywords: this.containsSuspiciousKeywords(hostname),
      missingHttps: url.protocol !== "https:",
      domainAge: this.estimateDomainAge(hostname),
      homoglyphDetected: this.hasHomographAttack(hostname) || this.isTyposquatting(hostname),
      excessiveRedirects: this.hasExcessiveRedirects(url.href),
      suspiciousPort: this.hasSuspiciousPort(url.port),
      suspiciousTLD: this.hasSuspiciousTLD(hostname),
      excessiveLength: fullUrl.length > 200,
      containsAtSymbol: fullUrl.includes("@"),
      suspiciousSpecialChars: this.hasSuspiciousSpecialChars(fullUrl),
      randomStringPattern: this.hasRandomStringPattern(hostname),
      misleadingPath: this.hasMisleadingPath(url),
      brandImpersonation: this.detectBrandImpersonation(hostname),
      hexEncoding: this.hasHexEncoding(fullUrl),
      dataUri: url.protocol === "data:"
    };
  }
  isIpBasedUrl(hostname) {
    const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^(?:[a-fA-F0-9:]+:+)+[a-fA-F0-9]+$/;
    return ipv4Regex.test(hostname) || ipv6Regex.test(hostname);
  }
  hasSuspiciousSubdomains(hostname) {
    const parts = hostname.split(".");
    if (parts.length > 4) return true;
    const suspiciousPatterns = [
      /\d{4,}/,
      // Long numeric patterns
      /[a-z]{15,}/,
      // Random long strings
      /-{2,}/,
      // Repeated hyphens
      /(secure|verify){2,}/
    ];
    return parts.some((p) => suspiciousPatterns.some((pat) => pat.test(p)));
  }
  isShortUrl(hostname) {
    return SHORT_URL_DOMAINS.includes(hostname);
  }
  getRegistrableDomain(hostname) {
    const parts = hostname.toLowerCase().split(".");
    const multiLevelTLDs = ["co.uk", "com.au", "co.jp", "co.nz", "co.za", "com.br", "com.cn"];
    if (parts.length >= 3) {
      const lastTwo = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
      if (multiLevelTLDs.includes(lastTwo)) {
        return parts.slice(-3).join(".");
      }
    }
    if (parts.length >= 2) {
      return parts.slice(-2).join(".");
    }
    return hostname;
  }
  isLegitimateOrSubdomain(hostname) {
    const lower = hostname.toLowerCase();
    const registrable = this.getRegistrableDomain(lower);
    return LEGITIMATE_DOMAINS.includes(lower) || LEGITIMATE_DOMAINS.includes(registrable) || LEGITIMATE_DOMAINS.some((legitDomain) => lower.endsWith("." + legitDomain));
  }
  containsSuspiciousKeywords(hostname) {
    if (this.isLegitimateOrSubdomain(hostname)) {
      return false;
    }
    const lower = hostname.toLowerCase();
    return SUSPICIOUS_KEYWORDS.some((kw) => lower.includes(kw));
  }
  countSuspiciousKeywords(hostname) {
    if (this.isLegitimateOrSubdomain(hostname)) {
      return 0;
    }
    const lower = hostname.toLowerCase();
    return SUSPICIOUS_KEYWORDS.filter((kw) => lower.includes(kw)).length;
  }
  estimateDomainAge(hostname) {
    if (this.isLegitimateOrSubdomain(hostname)) {
      return "established";
    }
    const tld = hostname.split(".").pop() || "";
    if (["tk", "ml", "ga", "cf", "gq"].includes(tld)) return "new";
    return "unknown";
  }
  hasHomographAttack(hostname) {
    const unicodePatterns = /[\u0400-\u04FF\u0370-\u03FF\uFF00-\uFFEF]/;
    const idnPattern = /xn--/;
    return unicodePatterns.test(hostname) || idnPattern.test(hostname);
  }
  isTyposquatting(hostname) {
    const lower = hostname.toLowerCase();
    const registrable = this.getRegistrableDomain(lower);
    if (this.isLegitimateOrSubdomain(lower)) {
      return false;
    }
    for (const [legitimate, typos] of Object.entries(TYPOSQUATTING_PATTERNS)) {
      if (typos.includes(lower) || typos.includes(registrable)) {
        return true;
      }
    }
    for (const legitimateDomain of LEGITIMATE_DOMAINS) {
      const distance = this.calculateLevenshteinDistance(registrable, legitimateDomain);
      if (distance <= 2 && registrable !== legitimateDomain) {
        return true;
      }
    }
    return false;
  }
  calculateLevenshteinDistance(str1, str2) {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            // substitution
            matrix[i][j - 1] + 1,
            // insertion
            matrix[i - 1][j] + 1
            // deletion
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  }
  hasExcessiveRedirects(url) {
    return (url.match(/http/g) || []).length > 1;
  }
  hasSuspiciousPort(port) {
    if (!port) return false;
    const portNum = parseInt(port);
    const suspiciousPorts = [8080, 8e3, 3e3, 5e3, 9e3, 8443, 8888, 9999, 4444, 1337];
    return suspiciousPorts.includes(portNum) || portNum > 49152;
  }
  hasSuspiciousTLD(hostname) {
    const tld = hostname.split(".").pop() || "";
    return SUSPICIOUS_TLDS.includes(tld.toLowerCase());
  }
  hasSuspiciousSpecialChars(url) {
    const suspiciousPatterns = [
      /%(?:[0-9a-fA-F]{2}){5,}/,
      // Excessive URL encoding
      /\.\./,
      // Directory traversal
      /[<>'"]/,
      // Script injection attempts
      /javascript:/i,
      // JavaScript protocol
      /vbscript:/i,
      // VBScript protocol
      /file:/i
      // File protocol
    ];
    return suspiciousPatterns.some((pattern) => pattern.test(url));
  }
  hasRandomStringPattern(hostname) {
    if (this.isLegitimateOrSubdomain(hostname)) {
      return false;
    }
    const parts = hostname.split(".");
    const mainDomain = parts.length > 1 ? parts[parts.length - 2] : parts[0];
    const consonantVowelRatio = this.calculateConsonantVowelRatio(mainDomain);
    const hasExcessiveDigits = /\d{4,}/.test(mainDomain);
    const hasExcessiveHyphens = /-{2,}/.test(mainDomain) || (mainDomain.match(/-/g) || []).length > 3;
    const isAllRandom = mainDomain.length > 8 && /^[a-z]{15,}$/i.test(mainDomain) && consonantVowelRatio > 4;
    return hasExcessiveDigits || hasExcessiveHyphens || isAllRandom;
  }
  calculateConsonantVowelRatio(str) {
    const consonants = str.match(/[bcdfghjklmnpqrstvwxyz]/gi) || [];
    const vowels = str.match(/[aeiou]/gi) || [];
    if (vowels.length === 0) return 10;
    return consonants.length / vowels.length;
  }
  hasMisleadingPath(url) {
    const path3 = url.pathname.toLowerCase();
    const misleadingPatterns = [
      /login/i,
      /signin/i,
      /account/i,
      /verify/i,
      /secure/i,
      /update/i,
      /banking/i,
      /wallet/i
    ];
    if (!this.isLegitimateOrSubdomain(url.hostname)) {
      return misleadingPatterns.some((pattern) => pattern.test(path3));
    }
    return false;
  }
  detectBrandImpersonation(hostname) {
    if (this.isLegitimateOrSubdomain(hostname)) {
      return false;
    }
    const registrable = this.getRegistrableDomain(hostname);
    for (const brand of BRAND_KEYWORDS) {
      if (registrable.includes(brand) && !this.isLegitimateOrSubdomain(registrable)) {
        const legitDomain = LEGITIMATE_DOMAINS.find((d) => d.includes(brand));
        if (legitDomain && registrable !== legitDomain && !registrable.endsWith("." + legitDomain)) {
          return true;
        }
      }
    }
    return false;
  }
  hasHexEncoding(url) {
    const hexPattern = /%[0-9a-fA-F]{2}/g;
    const matches = url.match(hexPattern) || [];
    return matches.length > 10;
  }
  calculateRiskScore(indicators, hostname, fullUrl) {
    let score = 0;
    const weights = {
      ipBasedUrl: 35,
      suspiciousSubdomains: 25,
      shortUrl: 15,
      suspiciousKeywords: 25,
      missingHttps: 15,
      homoglyphDetected: 80,
      // CRITICAL: Typosquatting impersonates legitimate sites
      excessiveRedirects: 20,
      suspiciousPort: 25,
      suspiciousTLD: 30,
      excessiveLength: 20,
      containsAtSymbol: 40,
      // High risk - often used to hide real domain
      suspiciousSpecialChars: 35,
      randomStringPattern: 30,
      misleadingPath: 25,
      brandImpersonation: 75,
      // CRITICAL: Deliberate brand impersonation
      hexEncoding: 30,
      dataUri: 50,
      // High risk - data URIs can hide malicious content
      newDomain: 20,
      mediumDomain: 5,
      establishedDomain: -50
      // Strong negative for verified legitimate domains
    };
    if (indicators.brandImpersonation) score += weights.brandImpersonation;
    if (indicators.homoglyphDetected) score += weights.homoglyphDetected;
    if (indicators.dataUri) score += weights.dataUri;
    if (indicators.containsAtSymbol) score += weights.containsAtSymbol;
    if (indicators.suspiciousSpecialChars) score += weights.suspiciousSpecialChars;
    if (indicators.ipBasedUrl) score += weights.ipBasedUrl;
    if (indicators.suspiciousTLD) score += weights.suspiciousTLD;
    if (indicators.hexEncoding) score += weights.hexEncoding;
    if (indicators.randomStringPattern) score += weights.randomStringPattern;
    if (indicators.suspiciousSubdomains) score += weights.suspiciousSubdomains;
    if (indicators.suspiciousKeywords) score += weights.suspiciousKeywords;
    if (indicators.misleadingPath) score += weights.misleadingPath;
    if (indicators.suspiciousPort) score += weights.suspiciousPort;
    if (indicators.excessiveRedirects) score += weights.excessiveRedirects;
    if (indicators.excessiveLength) score += weights.excessiveLength;
    if (indicators.shortUrl) score += weights.shortUrl;
    if (indicators.missingHttps) score += weights.missingHttps;
    if (indicators.domainAge === "new") score += weights.newDomain;
    if (indicators.domainAge === "medium") score += weights.mediumDomain;
    if (indicators.domainAge === "established") score += weights.establishedDomain;
    let suspiciousCount = 0;
    if (indicators.ipBasedUrl) suspiciousCount++;
    if (indicators.suspiciousSubdomains) suspiciousCount++;
    if (indicators.shortUrl) suspiciousCount++;
    if (indicators.suspiciousKeywords) suspiciousCount++;
    if (indicators.missingHttps) suspiciousCount++;
    if (indicators.excessiveRedirects) suspiciousCount++;
    if (indicators.suspiciousPort) suspiciousCount++;
    if (indicators.suspiciousTLD) suspiciousCount++;
    if (indicators.randomStringPattern) suspiciousCount++;
    if (indicators.misleadingPath) suspiciousCount++;
    if (indicators.hexEncoding) suspiciousCount++;
    if (suspiciousCount >= 5) {
      score += 30;
    } else if (suspiciousCount >= 3) {
      score += 20;
    } else if (suspiciousCount >= 2) {
      score += 10;
    }
    const keywordCount = this.countSuspiciousKeywords(hostname);
    if (keywordCount >= 3) {
      score += 25;
    } else if (keywordCount >= 2) {
      score += 15;
    }
    return Math.min(100, Math.max(0, score));
  }
  getRiskLevel(score) {
    if (score >= 80) return "critical";
    if (score >= 60) return "high";
    if (score >= 40) return "medium";
    return "low";
  }
  generateDetails(indicators) {
    const map = {
      ipBasedUrl: "URL uses IP address instead of a domain name",
      suspiciousSubdomains: "Suspicious subdomain pattern detected",
      shortUrl: "URL shortening service detected",
      suspiciousKeywords: "Contains phishing-related keywords",
      missingHttps: "Connection is not encrypted (no HTTPS)",
      homoglyphDetected: "\u26A0\uFE0F Typosquatting or lookalike domain detected - may impersonate a legitimate site",
      excessiveRedirects: "Multiple redirects detected in URL",
      suspiciousPort: "Non-standard or high port usage detected",
      suspiciousTLD: "Domain uses a high-risk or commonly abused top-level domain",
      excessiveLength: "URL is excessively long (often used to hide suspicious content)",
      containsAtSymbol: "\u26A0\uFE0F URL contains @ symbol - may hide the real destination domain",
      suspiciousSpecialChars: "Contains suspicious special characters or encoding patterns",
      randomStringPattern: "Domain name appears randomly generated",
      misleadingPath: "URL path contains misleading security-related terms",
      brandImpersonation: "\u26A0\uFE0F CRITICAL: Domain appears to impersonate a well-known brand",
      hexEncoding: "Excessive hexadecimal encoding detected - may hide malicious content",
      dataUri: "\u26A0\uFE0F Data URI detected - can embed malicious content directly"
    };
    const details = Object.entries(indicators).filter(([k, v]) => v === true && map[k]).map(([k]) => map[k]);
    if (indicators.domainAge === "new")
      details.push("Domain likely newly registered");
    else if (indicators.domainAge === "established")
      details.push("Domain appears established and trustworthy");
    return details.length ? details : ["No significant phishing indicators detected"];
  }
  generateRecommendations(indicators, risk) {
    const recs = [];
    if (indicators.brandImpersonation || indicators.dataUri) {
      recs.push(
        "\u26D4 DO NOT visit or interact with this URL - high risk of credential theft",
        "Do not enter any personal or financial information",
        "Report this URL to your IT security team immediately"
      );
      return recs;
    }
    if (["critical", "high"].includes(risk)) {
      recs.push(
        "Avoid entering personal or financial information",
        "Do not click or forward this link",
        "Verify the sender's identity through a separate channel"
      );
      if (indicators.homoglyphDetected) {
        recs.push("This appears to be a lookalike domain - verify the correct spelling");
      }
      if (indicators.containsAtSymbol) {
        recs.push("URL contains @ symbol - the actual destination may differ from what appears");
      }
      recs.push("Report this URL to your security or IT team");
    }
    if (indicators.missingHttps)
      recs.push("Only use websites with HTTPS encryption.");
    if (indicators.shortUrl)
      recs.push("Expand shortened links before visiting.");
    if (indicators.suspiciousKeywords)
      recs.push("Be wary of urgent or fear-inducing language.");
    if (indicators.homoglyphDetected)
      recs.push("Double-check for lookalike domains (e.g., g00gle.com).");
    if (risk === "low")
      recs.push("Keep security software updated.", "Continue practicing link hygiene.");
    return Array.from(new Set(recs));
  }
  invalidUrlResponse() {
    return {
      score: 100,
      risk: "critical",
      indicators: {
        ipBasedUrl: false,
        suspiciousSubdomains: false,
        shortUrl: false,
        suspiciousKeywords: false,
        missingHttps: true,
        domainAge: "unknown",
        homoglyphDetected: false,
        excessiveRedirects: false,
        suspiciousPort: false,
        suspiciousTLD: false,
        excessiveLength: false,
        containsAtSymbol: false,
        suspiciousSpecialChars: false,
        randomStringPattern: false,
        misleadingPath: false,
        brandImpersonation: false,
        hexEncoding: false,
        dataUri: false
      },
      details: ["Invalid or malformed URL format."],
      recommendations: ["Verify the URL format and try again."],
      metadata: {
        hostname: "N/A",
        tld: "N/A",
        analyzedAt: (/* @__PURE__ */ new Date()).toISOString(),
        urlLength: 0,
        subdomainCount: 0
      }
    };
  }
};

// server/services/port-service.ts
import { Socket } from "net";
var COMMON_SERVICES = {
  21: "FTP",
  22: "SSH",
  23: "Telnet",
  25: "SMTP",
  53: "DNS",
  80: "HTTP",
  110: "POP3",
  135: "RPC Endpoint Mapper",
  139: "NetBIOS",
  143: "IMAP",
  161: "SNMP",
  389: "LDAP",
  443: "HTTPS",
  445: "SMB",
  993: "IMAPS",
  995: "POP3S",
  1433: "MSSQL",
  1521: "Oracle",
  2049: "NFS",
  3306: "MySQL",
  3389: "RDP",
  5432: "PostgreSQL",
  5800: "VNC HTTP",
  5900: "VNC",
  6379: "Redis",
  8080: "HTTP-Alt",
  8443: "HTTPS-Alt",
  9200: "Elasticsearch",
  11211: "Memcached",
  27017: "MongoDB",
  50070: "Hadoop"
};
var PortService = class {
  MAX_SCAN_DURATION = 1e4;
  // 10 seconds max
  DEFAULT_PORT_TIMEOUT = 1e3;
  // 1 second per port (reduced from 2)
  async scanPorts(target, portRange = "1-1000", maxDuration) {
    const startTime = Date.now();
    const scanDeadline = startTime + (maxDuration || this.MAX_SCAN_DURATION);
    const ports = this.parsePortRange(portRange);
    const openPorts = [];
    if (!this.isValidTarget(target)) {
      throw new Error("Invalid target address");
    }
    if (this.isPrivateOrLocalhost(target)) {
      console.warn(`Scanning private/localhost target: ${target}`);
    }
    const concurrencyLimit = Math.min(50, Math.max(10, Math.floor(ports.length / 10)));
    const chunks = this.chunkArray(ports, concurrencyLimit);
    for (const chunk of chunks) {
      if (Date.now() >= scanDeadline) {
        console.warn(`Scan timeout reached after ${Date.now() - startTime}ms`);
        break;
      }
      const promises = chunk.map((port) => this.scanPort(target, port, this.DEFAULT_PORT_TIMEOUT));
      const results = await Promise.allSettled(promises);
      results.forEach((result, index2) => {
        if (result.status === "fulfilled" && result.value) {
          openPorts.push(result.value);
        }
      });
      if (chunks.indexOf(chunk) < chunks.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }
    this.analyzePortSecurity(openPorts);
    const scanDuration = Date.now() - startTime;
    return {
      target,
      totalPorts: ports.length,
      openPorts: openPorts.sort((a, b) => a.port - b.port),
      scanDuration,
      timestamp: /* @__PURE__ */ new Date()
    };
  }
  parsePortRange(portRange) {
    const ports = [];
    if (portRange.includes(",")) {
      const portList = portRange.split(",");
      for (const port of portList) {
        const portNum = parseInt(port.trim());
        if (portNum >= 1 && portNum <= 65535) {
          ports.push(portNum);
        }
      }
    } else if (portRange.includes("-")) {
      const [start, end] = portRange.split("-");
      const startPort = parseInt(start.trim());
      const endPort = parseInt(end.trim());
      if (startPort >= 1 && endPort <= 65535 && startPort <= endPort) {
        for (let port = startPort; port <= endPort; port++) {
          ports.push(port);
        }
      }
    } else {
      const portNum = parseInt(portRange.trim());
      if (portNum >= 1 && portNum <= 65535) {
        ports.push(portNum);
      }
    }
    return ports;
  }
  isValidTarget(target) {
    const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    const hostnameRegex = /^[a-zA-Z0-9.-]+$/;
    return ipv4Regex.test(target) || hostnameRegex.test(target);
  }
  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
  async scanPort(target, port, timeout = 1e3) {
    return new Promise((resolve) => {
      const socket = new Socket();
      socket.setTimeout(timeout);
      socket.on("connect", async () => {
        socket.destroy();
        resolve({
          port,
          state: "open",
          service: COMMON_SERVICES[port] || "Unknown"
        });
      });
      socket.on("timeout", () => {
        socket.destroy();
        resolve(null);
      });
      socket.on("error", () => {
        socket.destroy();
        resolve(null);
      });
      socket.connect(port, target);
    });
  }
  async getBanner(target, port) {
    return new Promise((resolve) => {
      const socket = new Socket();
      let banner = "";
      socket.setTimeout(3e3);
      socket.on("connect", () => {
        const probe = this.getServiceProbe(port);
        if (probe) {
          socket.write(probe);
        }
      });
      socket.on("data", (data) => {
        banner += data.toString().trim();
        socket.destroy();
        resolve(banner || void 0);
      });
      socket.on("timeout", () => {
        socket.destroy();
        resolve(banner || void 0);
      });
      socket.on("error", () => {
        socket.destroy();
        resolve(void 0);
      });
      socket.connect(port, target);
    });
  }
  getServiceProbe(port) {
    switch (port) {
      case 21:
        return "HELP\r\n";
      case 22:
        return "SSH-2.0-Scanner\r\n";
      case 25:
        return "EHLO scanner\r\n";
      case 80:
      // HTTP
      case 8080:
        return "GET / HTTP/1.0\r\n\r\n";
      case 443:
      // HTTPS
      case 8443:
        return "GET / HTTP/1.0\r\n\r\n";
      case 110:
        return "USER scanner\r\n";
      case 143:
        return "A001 CAPABILITY\r\n";
      default:
        return null;
    }
  }
  getCommonPorts() {
    return [21, 22, 23, 25, 53, 80, 110, 135, 139, 143, 161, 389, 443, 445, 993, 995, 1433, 1521, 2049, 3306, 3389, 5432, 5800, 5900, 6379, 8080, 8443, 9200, 11211, 27017, 50070];
  }
  isPrivateOrLocalhost(target) {
    const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (ipv4Regex.test(target)) {
      const parts = target.split(".").map(Number);
      return parts[0] === 10 || parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31 || parts[0] === 192 && parts[1] === 168 || parts[0] === 127 || // Localhost
      parts[0] === 169 && parts[1] === 254;
    }
    return target === "localhost" || target.endsWith(".local");
  }
  analyzePortSecurity(openPorts) {
    openPorts.forEach((port) => {
      const dangerousPorts = [21, 23, 135, 139, 445, 1433, 3306, 3389, 5432, 5900];
      if (dangerousPorts.includes(port.port)) {
        port.version = (port.version || "") + " [HIGH RISK]";
      }
      if (port.port === 22 && port.banner?.includes("SSH-1")) {
        port.version = (port.version || "") + " [VULNERABLE SSH VERSION]";
      }
      if (port.port === 21 && port.banner?.toLowerCase().includes("anonymous")) {
        port.version = (port.version || "") + " [ANONYMOUS FTP]";
      }
    });
  }
  async quickScan(target) {
    const commonPorts = this.getCommonPorts();
    return this.scanPorts(target, commonPorts.join(","), 5e3);
  }
};

// server/services/keylogger-service.ts
import { exec } from "child_process";
import { promisify } from "util";
var execAsync = promisify(exec);
var SUSPICIOUS_KEYWORDS2 = [
  "keylog",
  "keystroke",
  "capture",
  "hook",
  "monitor",
  "record",
  "spy",
  "stealth",
  "hidden",
  "invisible",
  "backdoor",
  "trojan",
  "rat",
  "remote",
  "access",
  "screen",
  "capture",
  "logger",
  "dump",
  "harvest",
  "steal",
  "inject",
  "payload",
  "shell",
  "reverse",
  "bind",
  "tunnel",
  "persistence",
  "privilege",
  "escalation",
  "bypass",
  "evasion",
  "rootkit",
  "malware"
];
var SUSPICIOUS_PROCESSES = [
  "keylogger",
  "spyware",
  "malware",
  "rootkit",
  "backdoor",
  "remote_access",
  "rat",
  "trojan",
  "virus",
  "worm"
];
var LEGITIMATE_PROCESSES = [
  "explorer.exe",
  "chrome.exe",
  "firefox.exe",
  "notepad.exe",
  "code.exe",
  "powershell.exe",
  "cmd.exe",
  "taskmgr.exe",
  "winlogon.exe",
  "csrss.exe",
  "lsass.exe",
  "services.exe",
  "svchost.exe",
  "dwm.exe",
  "conhost.exe",
  "RuntimeBroker.exe",
  "dllhost.exe",
  "SearchIndexer.exe",
  "audiodg.exe",
  "wininit.exe",
  "spoolsv.exe",
  "WmiPrvSE.exe",
  "MsMpEng.exe",
  "SecurityHealthService.exe",
  "node.exe",
  "python.exe",
  "java.exe",
  "msedge.exe",
  "opera.exe",
  "safari.exe",
  "teams.exe",
  "slack.exe",
  "discord.exe",
  "zoom.exe"
];
var KeyloggerService = class {
  async detectKeyloggers() {
    const processes = await this.getRunningProcesses();
    const suspiciousProcesses = [];
    for (const process2 of processes) {
      const analysis = this.analyzeProcess(process2);
      if (analysis.riskScore > 30) {
        suspiciousProcesses.push(analysis);
      }
    }
    const riskLevel = this.calculateOverallRisk(suspiciousProcesses);
    const recommendations = this.generateRecommendations(suspiciousProcesses, riskLevel);
    return {
      processesScanned: processes.length,
      suspiciousProcesses: suspiciousProcesses.sort((a, b) => b.riskScore - a.riskScore),
      riskLevel,
      recommendations,
      timestamp: /* @__PURE__ */ new Date()
    };
  }
  async getRunningProcesses() {
    try {
      let command;
      const platform = process.platform;
      if (platform === "win32") {
        command = "wmic process get Name,ProcessId,CommandLine,PageFileUsage,WorkingSetSize /format:csv";
      } else if (platform === "darwin" || platform === "linux") {
        command = "ps aux";
      } else {
        throw new Error("Unsupported platform for process monitoring");
      }
      const { stdout } = await execAsync(command);
      return this.parseProcessOutput(stdout, platform);
    } catch (error) {
      console.error("Error getting processes:", error);
      return [];
    }
  }
  parseProcessOutput(output, platform) {
    const processes = [];
    const lines = output.split("\n").filter((line) => line.trim());
    if (platform === "win32") {
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(",");
        if (parts.length >= 4 && parts[1] && parts[2]) {
          processes.push({
            pid: parseInt(parts[2]) || 0,
            name: parts[1].trim(),
            command: parts[0] || "",
            memoryUsage: parseInt(parts[4]) || 0,
            user: "unknown"
          });
        }
      }
    } else {
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].trim().split(/\s+/);
        if (parts.length >= 11) {
          processes.push({
            pid: parseInt(parts[1]) || 0,
            name: parts[10] || "unknown",
            command: parts.slice(10).join(" "),
            cpuUsage: parseFloat(parts[2]) || 0,
            memoryUsage: parseFloat(parts[3]) || 0,
            user: parts[0]
          });
        }
      }
    }
    return processes;
  }
  analyzeProcess(process2) {
    let riskScore = 0;
    const reasons = [];
    const processName = process2.name.toLowerCase();
    const command = process2.command.toLowerCase();
    for (const keyword of SUSPICIOUS_KEYWORDS2) {
      if (processName.includes(keyword) || command.includes(keyword)) {
        riskScore += 25;
        reasons.push(`Contains suspicious keyword: ${keyword}`);
      }
    }
    for (const suspiciousName of SUSPICIOUS_PROCESSES) {
      if (processName.includes(suspiciousName)) {
        riskScore += 40;
        reasons.push(`Matches known suspicious process pattern: ${suspiciousName}`);
      }
    }
    if (this.looksLikeSystemProcess(processName) && !this.isLegitimateSystemProcess(processName)) {
      riskScore += 20;
      reasons.push("Mimics system process name");
    }
    if (processName.endsWith(".tmp") || processName.endsWith(".dll") || processName.includes("temp") || processName.includes("cache")) {
      riskScore += 15;
      reasons.push("Unusual process location or extension");
    }
    if (!command.includes("\\") && !command.includes("/") && command.length > 0) {
      riskScore += 10;
      reasons.push("Process running without full path");
    }
    if (process2.cpuUsage > 50) {
      riskScore += 10;
      reasons.push("High CPU usage");
    }
    if (this.hasRandomName(processName)) {
      riskScore += 15;
      reasons.push("Random or obfuscated process name");
    }
    return {
      pid: process2.pid,
      name: process2.name,
      command: process2.command,
      riskScore,
      reasons,
      user: process2.user,
      cpuUsage: process2.cpuUsage,
      memoryUsage: process2.memoryUsage
    };
  }
  looksLikeSystemProcess(name) {
    const systemPatterns = [
      /^sys/,
      /^win/,
      /^microsoft/,
      /^windows/,
      /^service/,
      /\.exe$/,
      /^lsass/,
      /^csrss/,
      /^winlogon/
    ];
    return systemPatterns.some((pattern) => pattern.test(name));
  }
  isLegitimateSystemProcess(name) {
    return LEGITIMATE_PROCESSES.some(
      (legit) => name.toLowerCase().includes(legit.toLowerCase())
    );
  }
  hasRandomName(name) {
    const randomPatterns = [
      /^[a-z]{8,}\.exe$/,
      // Long random lowercase
      /^[A-Z]{5,}\.exe$/,
      // Long random uppercase
      /^[a-zA-Z0-9]{12,}\.exe$/,
      // Very long alphanumeric
      /^[a-f0-9]{8,}\.exe$/,
      // Hex-like names
      /^[0-9]{6,}\.exe$/,
      // All numbers
      /^[a-zA-Z]{2}[0-9]{4,}\.exe$/,
      // Mixed patterns
      /^tmp[a-zA-Z0-9]+\.exe$/
      // Temp file patterns
    ];
    const entropy = this.calculateStringEntropy(name.replace(/\.[^.]*$/, ""));
    return randomPatterns.some((pattern) => pattern.test(name)) || entropy > 4.2;
  }
  calculateStringEntropy(str) {
    const freq = {};
    for (const char of str) {
      freq[char] = (freq[char] || 0) + 1;
    }
    let entropy = 0;
    const len = str.length;
    for (const count of Object.values(freq)) {
      const p = count / len;
      entropy -= p * Math.log2(p);
    }
    return entropy;
  }
  calculateOverallRisk(suspiciousProcesses) {
    if (suspiciousProcesses.length === 0) return "low";
    const maxRiskScore = Math.max(...suspiciousProcesses.map((p) => p.riskScore));
    const totalRiskScore = suspiciousProcesses.reduce((sum, p) => sum + p.riskScore, 0);
    if (maxRiskScore >= 80 || totalRiskScore >= 150) return "critical";
    if (maxRiskScore >= 60 || totalRiskScore >= 100) return "high";
    if (maxRiskScore >= 40 || totalRiskScore >= 60) return "medium";
    return "low";
  }
  generateRecommendations(suspiciousProcesses, riskLevel) {
    const recommendations = [];
    if (riskLevel === "critical") {
      recommendations.push("URGENT: Immediately terminate suspicious processes");
      recommendations.push("Disconnect from network to prevent data exfiltration");
      recommendations.push("Run full system antivirus scan");
      recommendations.push("Contact your security team immediately");
    }
    if (riskLevel === "high") {
      recommendations.push("Investigate suspicious processes immediately");
      recommendations.push("Consider isolating the system");
      recommendations.push("Run comprehensive malware scan");
    }
    if (suspiciousProcesses.length > 0) {
      recommendations.push("Monitor process activity closely");
      recommendations.push("Check process digital signatures");
      recommendations.push("Verify process locations and origins");
    }
    recommendations.push("Keep antivirus software updated");
    recommendations.push("Enable real-time protection");
    recommendations.push("Regularly monitor running processes");
    recommendations.push("Use application whitelisting if possible");
    return recommendations;
  }
  async terminateProcess(pid) {
    try {
      const command = process.platform === "win32" ? `taskkill /F /PID ${pid}` : `kill -9 ${pid}`;
      await execAsync(command);
      return true;
    } catch (error) {
      console.error("Error terminating process:", error);
      return false;
    }
  }
};

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var scanResults = pgTable("scan_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull(),
  // 'password', 'phishing', 'port', 'keylogger'
  target: text("target").notNull(),
  result: text("result").notNull(),
  // JSON string
  score: integer("score"),
  userId: varchar("user_id"),
  // Optional - null for guest scans
  timestamp: timestamp("timestamp").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  name: true,
  password: true
});
var signupRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
var loginRequestSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required")
});
var insertScanResultSchema = createInsertSchema(scanResults).pick({
  type: true,
  target: true,
  result: true,
  score: true,
  userId: true
});
var passwordAnalysisRequestSchema = z.object({
  password: z.string().min(1)
});
var phishingAnalysisRequestSchema = z.object({
  url: z.string().url()
});
var portScanRequestSchema = z.object({
  target: z.string().min(1),
  portRange: z.string().optional().default("1-1000")
});

// server/routes.ts
var handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Validation errors:", errors.array());
    const errorMessages = errors.array().map((e) => e.msg).join(", ");
    return res.status(400).json({
      message: errorMessages || "Invalid input data",
      errors: errors.array()
    });
  }
  next();
};
async function registerRoutes(app2) {
  const passwordService = new PasswordService();
  const phishingService = new PhishingService();
  const portService = new PortService();
  const keyloggerService = new KeyloggerService();
  app2.post("/api/security/password-analysis", [
    body("password").isLength({ min: 1, max: 256 }).withMessage("Password must be between 1 and 256 characters").trim().escape(),
    handleValidationErrors
  ], async (req, res) => {
    try {
      const { password } = passwordAnalysisRequestSchema.parse(req.body);
      const analysis = passwordService.analyzePassword(password);
      res.json(analysis);
    } catch (error) {
      res.status(400).json({ message: "Invalid password input" });
    }
  });
  app2.post("/api/security/phishing-analysis", [
    body("url").isURL({ protocols: ["http", "https"], require_protocol: true }).withMessage("Must be a valid HTTP/HTTPS URL").isLength({ max: 2048 }).withMessage("URL must be less than 2048 characters").trim(),
    handleValidationErrors
  ], async (req, res) => {
    try {
      const { url } = phishingAnalysisRequestSchema.parse(req.body);
      const analysis = await phishingService.analyzeUrl(url);
      res.json(analysis);
    } catch (error) {
      res.status(400).json({ message: "Invalid URL input" });
    }
  });
  app2.post("/api/security/port-scan", [
    body("target").matches(/^([a-zA-Z0-9-._]+|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/).withMessage("Target must be a valid domain or IP address").isLength({ min: 1, max: 253 }).withMessage("Target must be between 1 and 253 characters").trim(),
    body("portRange").optional().matches(/^(\d{1,5}(-\d{1,5})?(,\d{1,5}(-\d{1,5})?)*)$|^\d{1,5}$/).withMessage("Port range must be valid (e.g., 80, 80-443, 80,443,8080)").isLength({ max: 100 }).withMessage("Port range must be less than 100 characters").trim(),
    handleValidationErrors
  ], async (req, res) => {
    try {
      const { target, portRange } = portScanRequestSchema.parse(req.body);
      const result = await portService.scanPorts(target, portRange);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Port scan failed" });
    }
  });
  app2.post("/api/security/port-scan-quick", [
    body("target").matches(/^([a-zA-Z0-9-._]+|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/).withMessage("Target must be a valid domain or IP address").isLength({ min: 1, max: 253 }).withMessage("Target must be between 1 and 253 characters").trim(),
    handleValidationErrors
  ], async (req, res) => {
    try {
      const { target } = req.body;
      const result = await portService.quickScan(target);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Quick scan failed" });
    }
  });
  app2.post("/api/security/keylogger-scan", async (req, res) => {
    try {
      const result = await keyloggerService.detectKeyloggers();
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/security/terminate-process", [
    body("pid").isInt({ min: 1, max: 999999 }).withMessage("Process ID must be a valid integer between 1 and 999999"),
    handleValidationErrors
  ], async (req, res) => {
    try {
      const { pid } = req.body;
      const success = await keyloggerService.terminateProcess(parseInt(pid));
      res.json({ success });
    } catch (error) {
      res.status(500).json({ message: "Process termination failed" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.set("trust proxy", 1);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      // Allow inline scripts for development
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
      // Allow WebSocket connections for Vite HMR
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      workerSrc: ["'self'", "blob:"]
      // Allow web workers
    }
  },
  crossOriginEmbedderPolicy: false
}));
var limiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: process.env.NODE_ENV === "development" ? 1e3 : 100,
  // More lenient in development
  message: {
    error: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.path.startsWith("/@") || req.path.startsWith("/node_modules") || req.path.endsWith(".js") || req.path.endsWith(".css") || req.path.endsWith(".map") || req.path.endsWith(".svg") || req.path.endsWith(".png") || req.path.endsWith(".jpg") || req.path.endsWith(".ico");
  }
});
var securityLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: process.env.NODE_ENV === "development" ? 200 : 20,
  // More lenient in development
  message: {
    error: "Too many security scan requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});
var speedLimiter = slowDown({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  delayAfter: 10,
  // Allow 10 requests per windowMs without delay
  delayMs: () => 500,
  // Add 500ms delay per request after delayAfter
  validate: { delayMs: false }
  // Disable deprecation warning
});
app.use("/api", limiter);
app.use("/api/security", securityLimiter);
app.use("/api/security", speedLimiter);
app.use(express2.json({ limit: "10mb" }));
app.use(express2.urlencoded({ extended: false, limit: "10mb" }));
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5000"
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Accept");
  res.header("Access-Control-Max-Age", "86400");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
    console.error("Server error:", err);
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
