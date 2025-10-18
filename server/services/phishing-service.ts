import { URL } from "url";

export interface PhishingAnalysis {
  score: number;
  risk: "low" | "medium" | "high" | "critical";
  indicators: {
    ipBasedUrl: boolean;
    suspiciousSubdomains: boolean;
    shortUrl: boolean;
    suspiciousKeywords: boolean;
    missingHttps: boolean;
    domainAge: "new" | "medium" | "established" | "unknown";
    homoglyphDetected: boolean;
    excessiveRedirects: boolean;
    suspiciousPort: boolean;
    suspiciousTLD: boolean;
    excessiveLength: boolean;
    containsAtSymbol: boolean;
    suspiciousSpecialChars: boolean;
    randomStringPattern: boolean;
    misleadingPath: boolean;
    brandImpersonation: boolean;
    hexEncoding: boolean;
    dataUri: boolean;
  };
  details: string[];
  recommendations: string[];
  metadata: {
    hostname: string;
    tld: string;
    analyzedAt: string;
    urlLength: number;
    subdomainCount: number;
  };
}

const SUSPICIOUS_KEYWORDS = [
  "paypal", "amazon", "netflix", "microsoft", "google", "apple", "facebook",
  "secure", "verify", "update", "suspended", "confirm", "urgent", "click",
  "winner", "congratulations", "prize", "offer", "limited", "act-now",
  "banking", "account", "login", "signin", "verification", "auth", "security",
  "alert", "warning", "notice", "expired", "renewal", "billing", "payment",
  "refund", "claim", "validate", "activate", "unlock", "restore", "recover",
  "support", "service", "helpdesk", "customer", "team", "department",
  "cryptocurrency", "bitcoin", "ethereum", "wallet", "trading", "investment"
];

const SHORT_URL_DOMAINS = [
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd",
  "buff.ly", "s.id", "v.gd", "x.co", "short.link", "rebrand.ly", "cut.ly"
];

const SUSPICIOUS_TLDS = [
  "tk", "ml", "ga", "cf", "gq", "pw", "cc", "top", "work", "club", 
  "live", "online", "site", "website", "space", "tech", "store", "fun",
  "xyz", "icu", "buzz", "link", "click", "download", "racing", "stream"
];

const BRAND_KEYWORDS = [
  "paypal", "amazon", "netflix", "microsoft", "google", "apple", "facebook",
  "instagram", "twitter", "linkedin", "github", "dropbox", "icloud", 
  "gmail", "outlook", "chase", "bankofamerica", "wellsfargo", "coinbase",
  "binance", "stripe", "ebay", "walmart", "target"
];

const LEGITIMATE_DOMAINS = [
  // Search & Tech Giants
  "google.com", "youtube.com", "microsoft.com", "apple.com", "amazon.com",
  // Social Media
  "facebook.com", "twitter.com", "instagram.com", "linkedin.com", "reddit.com", "tiktok.com", "snapchat.com", "pinterest.com", "whatsapp.com",
  // Developer Platforms
  "github.com", "gitlab.com", "stackoverflow.com", "npmjs.com", "pypi.org",
  // Financial & Shopping
  "paypal.com", "stripe.com", "ebay.com", "walmart.com", "target.com", "bestbuy.com", "shopify.com", "etsy.com",
  // Banking
  "chase.com", "bankofamerica.com", "wellsfargo.com", "citi.com", "capitalone.com", "usbank.com",
  // Cloud & Services
  "dropbox.com", "office365.com", "outlook.com", "icloud.com", "drive.google.com", "onedrive.com",
  // Communication & Email
  "gmail.com", "yahoo.com", "hotmail.com", "protonmail.com", "zoho.com",
  // Streaming & Entertainment
  "netflix.com", "spotify.com", "hulu.com", "twitch.tv", "disney.com", "primevideo.com",
  // News & Media
  "cnn.com", "bbc.com", "nytimes.com", "wikipedia.org", "medium.com",
  // E-commerce & Marketplaces
  "aliexpress.com", "alibaba.com", "wish.com", "wayfair.com",
  // Crypto & Finance
  "coinbase.com", "binance.com", "kraken.com", "blockchain.com",
  // Government & Education
  "irs.gov", "usa.gov", "gov.uk", "mit.edu", "stanford.edu",
  // Security & Services
  "adobe.com", "zoom.us", "slack.com", "discord.com", "notion.so", "canva.com",
  // Design & Productivity
  "figma.com", "sketch.com", "invision.com", "miro.com", "trello.com", "asana.com", "monday.com", "airtable.com", "clickup.com"
];

// Common typosquatting variations
const TYPOSQUATTING_PATTERNS: Record<string, string[]> = {
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

export class PhishingService {
  async analyzeUrl(urlString: string): Promise<PhishingAnalysis> {
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
          analyzedAt: new Date().toISOString(),
          urlLength: urlString.length,
          subdomainCount: url.hostname.split(".").length - 2,
        },
      };
    } catch {
      return this.invalidUrlResponse();
    }
  }

  private checkIndicators(url: URL, fullUrl: string) {
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
      containsAtSymbol: fullUrl.includes('@'),
      suspiciousSpecialChars: this.hasSuspiciousSpecialChars(fullUrl),
      randomStringPattern: this.hasRandomStringPattern(hostname),
      misleadingPath: this.hasMisleadingPath(url),
      brandImpersonation: this.detectBrandImpersonation(hostname),
      hexEncoding: this.hasHexEncoding(fullUrl),
      dataUri: url.protocol === "data:",
    };
  }

  private isIpBasedUrl(hostname: string): boolean {
    const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^(?:[a-fA-F0-9:]+:+)+[a-fA-F0-9]+$/;
    return ipv4Regex.test(hostname) || ipv6Regex.test(hostname);
  }

  private hasSuspiciousSubdomains(hostname: string): boolean {
    const parts = hostname.split(".");
    if (parts.length > 4) return true;

    const suspiciousPatterns = [
      /\d{4,}/, // Long numeric patterns
      /[a-z]{15,}/, // Random long strings
      /-{2,}/, // Repeated hyphens
      /(secure|verify){2,}/,
    ];

    return parts.some((p) => suspiciousPatterns.some((pat) => pat.test(p)));
  }

  private isShortUrl(hostname: string): boolean {
    return SHORT_URL_DOMAINS.includes(hostname);
  }

  private getRegistrableDomain(hostname: string): string {
    // Extract the registrable domain (main domain + TLD)
    // Handles common multi-level TLDs like .co.uk, .com.au
    const parts = hostname.toLowerCase().split('.');
    
    // Handle multi-level TLDs
    const multiLevelTLDs = ['co.uk', 'com.au', 'co.jp', 'co.nz', 'co.za', 'com.br', 'com.cn'];
    
    if (parts.length >= 3) {
      const lastTwo = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
      if (multiLevelTLDs.includes(lastTwo)) {
        // Multi-level TLD: return domain.co.uk format
        return parts.slice(-3).join('.');
      }
    }
    
    // Standard TLD: return domain.com format
    if (parts.length >= 2) {
      return parts.slice(-2).join('.');
    }
    
    return hostname;
  }

  private isLegitimateOrSubdomain(hostname: string): boolean {
    const lower = hostname.toLowerCase();
    const registrable = this.getRegistrableDomain(lower);
    
    // Check if exact match or subdomain of legitimate domain
    return LEGITIMATE_DOMAINS.includes(lower) || 
           LEGITIMATE_DOMAINS.includes(registrable) ||
           LEGITIMATE_DOMAINS.some(legitDomain => lower.endsWith('.' + legitDomain));
  }

  private containsSuspiciousKeywords(hostname: string): boolean {
    // Only check hostname, not the full URL path
    // This prevents false positives from legitimate URLs with keywords in paths
    
    // Don't flag legitimate domains or their subdomains
    if (this.isLegitimateOrSubdomain(hostname)) {
      return false;
    }
    
    const lower = hostname.toLowerCase();
    
    // Check if suspicious keywords appear in the domain name itself
    return SUSPICIOUS_KEYWORDS.some((kw) => lower.includes(kw));
  }

  private countSuspiciousKeywords(hostname: string): number {
    // Don't flag legitimate domains or their subdomains
    if (this.isLegitimateOrSubdomain(hostname)) {
      return 0;
    }
    
    const lower = hostname.toLowerCase();
    return SUSPICIOUS_KEYWORDS.filter((kw) => lower.includes(kw)).length;
  }

  private estimateDomainAge(hostname: string): PhishingAnalysis["indicators"]["domainAge"] {
    // Check if legitimate domain or subdomain
    if (this.isLegitimateOrSubdomain(hostname)) {
      return "established";
    }

    const tld = hostname.split(".").pop() || "";
    if (["tk", "ml", "ga", "cf", "gq"].includes(tld)) return "new";
    return "unknown";
  }

  private hasHomographAttack(hostname: string): boolean {
    // Check for non-ASCII Unicode characters (Cyrillic, Greek, etc.)
    const unicodePatterns = /[\u0400-\u04FF\u0370-\u03FF\uFF00-\uFFEF]/;
    // Check for IDN (Internationalized Domain Name) encoded domains
    const idnPattern = /xn--/;
    return unicodePatterns.test(hostname) || idnPattern.test(hostname);
  }

  private isTyposquatting(hostname: string): boolean {
    const lower = hostname.toLowerCase();
    const registrable = this.getRegistrableDomain(lower);
    
    // If it's a legitimate domain or subdomain, it's not typosquatting
    if (this.isLegitimateOrSubdomain(lower)) {
      return false;
    }

    // Check if hostname or registrable domain is a known typosquatting variation
    for (const [legitimate, typos] of Object.entries(TYPOSQUATTING_PATTERNS)) {
      if (typos.includes(lower) || typos.includes(registrable)) {
        return true;
      }
    }

    // Check for Levenshtein distance (simple similarity check)
    // Only flag if similar to legitimate domain but not exact match
    for (const legitimateDomain of LEGITIMATE_DOMAINS) {
      const distance = this.calculateLevenshteinDistance(registrable, legitimateDomain);
      if (distance <= 2 && registrable !== legitimateDomain) {
        return true;
      }
    }

    return false;
  }

  private calculateLevenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

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
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  private hasExcessiveRedirects(url: string): boolean {
    return (url.match(/http/g) || []).length > 1;
  }

  private hasSuspiciousPort(port: string): boolean {
    if (!port) return false;
    const portNum = parseInt(port);
    const suspiciousPorts = [8080, 8000, 3000, 5000, 9000, 8443, 8888, 9999, 4444, 1337];
    return suspiciousPorts.includes(portNum) || portNum > 49152;
  }

  private hasSuspiciousTLD(hostname: string): boolean {
    const tld = hostname.split(".").pop() || "";
    return SUSPICIOUS_TLDS.includes(tld.toLowerCase());
  }

  private hasSuspiciousSpecialChars(url: string): boolean {
    const suspiciousPatterns = [
      /%(?:[0-9a-fA-F]{2}){5,}/, // Excessive URL encoding
      /\.\./,                     // Directory traversal
      /[<>'"]/,                   // Script injection attempts
      /javascript:/i,             // JavaScript protocol
      /vbscript:/i,               // VBScript protocol
      /file:/i,                   // File protocol
    ];
    return suspiciousPatterns.some(pattern => pattern.test(url));
  }

  private hasRandomStringPattern(hostname: string): boolean {
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

  private calculateConsonantVowelRatio(str: string): number {
    const consonants = str.match(/[bcdfghjklmnpqrstvwxyz]/gi) || [];
    const vowels = str.match(/[aeiou]/gi) || [];
    if (vowels.length === 0) return 10;
    return consonants.length / vowels.length;
  }

  private hasMisleadingPath(url: URL): boolean {
    const path = url.pathname.toLowerCase();
    const misleadingPatterns = [
      /login/i,
      /signin/i,
      /account/i,
      /verify/i,
      /secure/i,
      /update/i,
      /banking/i,
      /wallet/i,
    ];
    
    if (!this.isLegitimateOrSubdomain(url.hostname)) {
      return misleadingPatterns.some(pattern => pattern.test(path));
    }
    return false;
  }

  private detectBrandImpersonation(hostname: string): boolean {
    if (this.isLegitimateOrSubdomain(hostname)) {
      return false;
    }
    
    const registrable = this.getRegistrableDomain(hostname);
    
    for (const brand of BRAND_KEYWORDS) {
      if (registrable.includes(brand) && !this.isLegitimateOrSubdomain(registrable)) {
        const legitDomain = LEGITIMATE_DOMAINS.find(d => d.includes(brand));
        if (legitDomain && registrable !== legitDomain && !registrable.endsWith('.' + legitDomain)) {
          return true;
        }
      }
    }
    return false;
  }

  private hasHexEncoding(url: string): boolean {
    const hexPattern = /%[0-9a-fA-F]{2}/g;
    const matches = url.match(hexPattern) || [];
    return matches.length > 10;
  }

  private calculateRiskScore(indicators: PhishingAnalysis["indicators"], hostname: string, fullUrl: string): number {
    let score = 0;
    const weights = {
      ipBasedUrl: 35,
      suspiciousSubdomains: 25,
      shortUrl: 15,
      suspiciousKeywords: 25,
      missingHttps: 15,
      homoglyphDetected: 80, // CRITICAL: Typosquatting impersonates legitimate sites
      excessiveRedirects: 20,
      suspiciousPort: 25,
      suspiciousTLD: 30,
      excessiveLength: 20,
      containsAtSymbol: 40, // High risk - often used to hide real domain
      suspiciousSpecialChars: 35,
      randomStringPattern: 30,
      misleadingPath: 25,
      brandImpersonation: 75, // CRITICAL: Deliberate brand impersonation
      hexEncoding: 30,
      dataUri: 50, // High risk - data URIs can hide malicious content
      newDomain: 20,
      mediumDomain: 5,
      establishedDomain: -50, // Strong negative for verified legitimate domains
    };

    // Critical indicators - highest priority
    if (indicators.brandImpersonation) score += weights.brandImpersonation;
    if (indicators.homoglyphDetected) score += weights.homoglyphDetected;
    if (indicators.dataUri) score += weights.dataUri;
    if (indicators.containsAtSymbol) score += weights.containsAtSymbol;

    // High-risk indicators
    if (indicators.suspiciousSpecialChars) score += weights.suspiciousSpecialChars;
    if (indicators.ipBasedUrl) score += weights.ipBasedUrl;
    if (indicators.suspiciousTLD) score += weights.suspiciousTLD;
    if (indicators.hexEncoding) score += weights.hexEncoding;
    if (indicators.randomStringPattern) score += weights.randomStringPattern;

    // Medium-risk indicators
    if (indicators.suspiciousSubdomains) score += weights.suspiciousSubdomains;
    if (indicators.suspiciousKeywords) score += weights.suspiciousKeywords;
    if (indicators.misleadingPath) score += weights.misleadingPath;
    if (indicators.suspiciousPort) score += weights.suspiciousPort;
    if (indicators.excessiveRedirects) score += weights.excessiveRedirects;
    if (indicators.excessiveLength) score += weights.excessiveLength;

    // Lower-risk indicators
    if (indicators.shortUrl) score += weights.shortUrl;
    if (indicators.missingHttps) score += weights.missingHttps;

    // Domain age factors
    if (indicators.domainAge === "new") score += weights.newDomain;
    if (indicators.domainAge === "medium") score += weights.mediumDomain;
    if (indicators.domainAge === "established") score += weights.establishedDomain;

    // Combination penalties - multiple suspicious indicators increase risk exponentially
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

    // If multiple indicators present, add combination penalty
    if (suspiciousCount >= 5) {
      score += 30; // Critical risk when many indicators combine
    } else if (suspiciousCount >= 3) {
      score += 20; // High risk when multiple indicators combine
    } else if (suspiciousCount >= 2) {
      score += 10; // Medium-high risk for 2 indicators
    }

    // Extra penalty for multiple phishing keywords in domain name
    const keywordCount = this.countSuspiciousKeywords(hostname);
    if (keywordCount >= 3) {
      score += 25; // Multiple keywords = likely phishing
    } else if (keywordCount >= 2) {
      score += 15; // Two keywords = suspicious
    }

    return Math.min(100, Math.max(0, score));
  }

  private getRiskLevel(score: number): PhishingAnalysis["risk"] {
    if (score >= 80) return "critical";
    if (score >= 60) return "high";
    if (score >= 40) return "medium";
    return "low";
  }

  private generateDetails(indicators: PhishingAnalysis["indicators"]): string[] {
    const map: Record<string, string> = {
      ipBasedUrl: "URL uses IP address instead of a domain name",
      suspiciousSubdomains: "Suspicious subdomain pattern detected",
      shortUrl: "URL shortening service detected",
      suspiciousKeywords: "Contains phishing-related keywords",
      missingHttps: "Connection is not encrypted (no HTTPS)",
      homoglyphDetected: "⚠️ Typosquatting or lookalike domain detected - may impersonate a legitimate site",
      excessiveRedirects: "Multiple redirects detected in URL",
      suspiciousPort: "Non-standard or high port usage detected",
      suspiciousTLD: "Domain uses a high-risk or commonly abused top-level domain",
      excessiveLength: "URL is excessively long (often used to hide suspicious content)",
      containsAtSymbol: "⚠️ URL contains @ symbol - may hide the real destination domain",
      suspiciousSpecialChars: "Contains suspicious special characters or encoding patterns",
      randomStringPattern: "Domain name appears randomly generated",
      misleadingPath: "URL path contains misleading security-related terms",
      brandImpersonation: "⚠️ CRITICAL: Domain appears to impersonate a well-known brand",
      hexEncoding: "Excessive hexadecimal encoding detected - may hide malicious content",
      dataUri: "⚠️ Data URI detected - can embed malicious content directly",
    };

    const details = Object.entries(indicators)
      .filter(([k, v]) => v === true && map[k])
      .map(([k]) => map[k]);

    if (indicators.domainAge === "new")
      details.push("Domain likely newly registered");
    else if (indicators.domainAge === "established")
      details.push("Domain appears established and trustworthy");

    return details.length ? details : ["No significant phishing indicators detected"];
  }

  private generateRecommendations(
    indicators: PhishingAnalysis["indicators"],
    risk: PhishingAnalysis["risk"]
  ): string[] {
    const recs: string[] = [];

    if (indicators.brandImpersonation || indicators.dataUri) {
      recs.push(
        "⛔ DO NOT visit or interact with this URL - high risk of credential theft",
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

    return Array.from(new Set(recs)); // Deduplicate
  }

  private invalidUrlResponse(): PhishingAnalysis {
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
        dataUri: false,
      },
      details: ["Invalid or malformed URL format."],
      recommendations: ["Verify the URL format and try again."],
      metadata: {
        hostname: "N/A",
        tld: "N/A",
        analyzedAt: new Date().toISOString(),
        urlLength: 0,
        subdomainCount: 0,
      },
    };
  }
}
