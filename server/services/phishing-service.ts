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
    googleSafeBrowsing?: boolean;
  };
  details: string[];
  recommendations: string[];
  metadata: {
    hostname: string;
    tld: string;
    analyzedAt: string;
    googleSafeBrowsingChecked?: boolean;
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
  "adobe.com", "zoom.us", "slack.com", "discord.com", "notion.so", "canva.com"
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
  "binance.com": ["blnance.com", "binanse.com", "binannce.com", "binnance.com"]
};

// Cache for Google Safe Browsing results (1 hour TTL)
interface CacheEntry {
  isThreat: boolean;
  timestamp: number;
}

export class PhishingService {
  private safeBrowsingCache: Map<string, CacheEntry> = new Map();
  private readonly CACHE_TTL = 60 * 60 * 1000; // 1 hour
  private readonly API_KEY = process.env.GOOGLE_API_KEY;

  async analyzeUrl(urlString: string): Promise<PhishingAnalysis> {
    try {
      const url = new URL(urlString);
      const indicators = this.checkIndicators(url);
      
      // Check Google Safe Browsing API if API key is available
      let googleSafeBrowsingThreat = false;
      let googleSafeBrowsingChecked = false;
      
      if (this.API_KEY) {
        const result = await this.checkGoogleSafeBrowsing(urlString);
        if (result.success) {
          googleSafeBrowsingThreat = result.isThreat;
          googleSafeBrowsingChecked = true;
          indicators.googleSafeBrowsing = googleSafeBrowsingThreat;
        }
      }

      const score = this.calculateRiskScore(indicators);
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
          googleSafeBrowsingChecked,
        },
      };
    } catch {
      return this.invalidUrlResponse();
    }
  }

  private async checkGoogleSafeBrowsing(url: string): Promise<{ success: boolean; isThreat: boolean }> {
    // Check cache first to minimize API calls
    const cached = this.safeBrowsingCache.get(url);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return { success: true, isThreat: cached.isThreat };
    }

    try {
      // Using Google Safe Browsing API v4
      const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${this.API_KEY}`;
      
      const requestBody = {
        client: {
          clientId: "cybersec-toolkit",
          clientVersion: "1.0.0"
        },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [
            { url: url }
          ]
        }
      };

      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        if (response.status === 400) {
          console.error(`Google Safe Browsing API error: Invalid API key or request format - ${errorText}`);
        } else if (response.status === 403) {
          console.error(`Google Safe Browsing API error: API key not authorized or API not enabled - ${errorText}`);
        } else if (response.status === 429) {
          console.error(`Google Safe Browsing API error: Rate limit exceeded - ${errorText}`);
        } else {
          console.error(`Google Safe Browsing API error: ${response.status} - ${errorText}`);
        }
        return { success: false, isThreat: false };
      }

      const data = await response.json();
      const isThreat = data.matches && data.matches.length > 0;
      
      // Cache the result
      this.safeBrowsingCache.set(url, {
        isThreat,
        timestamp: Date.now()
      });

      // Clean old cache entries to prevent memory bloat
      this.cleanCache();

      return { success: true, isThreat };
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('Google Safe Browsing check timed out after 5 seconds');
      } else if (error.message?.includes('fetch')) {
        console.error('Google Safe Browsing check failed: Network error -', error.message);
      } else {
        console.error('Google Safe Browsing check failed:', error.message || error);
      }
      return { success: false, isThreat: false };
    }
  }

  private cleanCache(): void {
    const now = Date.now();
    const entries = Array.from(this.safeBrowsingCache.entries());
    for (const [key, value] of entries) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.safeBrowsingCache.delete(key);
      }
    }
  }

  private checkIndicators(url: URL) {
    const hostname = url.hostname.toLowerCase();
    return {
      ipBasedUrl: this.isIpBasedUrl(hostname),
      suspiciousSubdomains: this.hasSuspiciousSubdomains(hostname),
      shortUrl: this.isShortUrl(hostname),
      suspiciousKeywords: this.containsSuspiciousKeywords(url.href),
      missingHttps: url.protocol !== "https:",
      domainAge: this.estimateDomainAge(hostname),
      homoglyphDetected: this.hasHomographAttack(hostname) || this.isTyposquatting(hostname),
      excessiveRedirects: this.hasExcessiveRedirects(url.href),
      suspiciousPort: this.hasSuspiciousPort(url.port),
      googleSafeBrowsing: false as boolean,
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

  private containsSuspiciousKeywords(url: string): boolean {
    const lower = url.toLowerCase();
    return SUSPICIOUS_KEYWORDS.some((kw) => lower.includes(kw));
  }

  private estimateDomainAge(hostname: string): PhishingAnalysis["indicators"]["domainAge"] {
    if (LEGITIMATE_DOMAINS.includes(hostname)) return "established";

    const tld = hostname.split(".").pop() || "";
    if (["tk", "ml", "ga", "cf", "gq"].includes(tld)) return "new";
    return "unknown";
  }

  private hasHomographAttack(hostname: string): boolean {
    const unicodePatterns = /[\u0400-\u04FF\u0370-\u03FF\uFF00-\uFFEF]/;
    const idnPattern = /xn--/;
    const mixedChars = /[0oOQ1lI5sS2zZ]/;
    return unicodePatterns.test(hostname) || idnPattern.test(hostname) || mixedChars.test(hostname);
  }

  private isTyposquatting(hostname: string): boolean {
    // Check if hostname is a known typosquatting variation
    for (const [legitimate, typos] of Object.entries(TYPOSQUATTING_PATTERNS)) {
      if (typos.includes(hostname)) {
        return true;
      }
    }

    // Check for Levenshtein distance (simple similarity check)
    for (const legitimateDomain of LEGITIMATE_DOMAINS) {
      if (this.calculateLevenshteinDistance(hostname, legitimateDomain) <= 2 && hostname !== legitimateDomain) {
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

  private calculateRiskScore(indicators: PhishingAnalysis["indicators"]): number {
    let score = 0;
    const weights = {
      googleSafeBrowsing: 50, // High weight for Google's verification
      ipBasedUrl: 25,
      suspiciousSubdomains: 20,
      shortUrl: 15,
      suspiciousKeywords: 20,
      missingHttps: 10,
      homoglyphDetected: 25,
      excessiveRedirects: 10,
      suspiciousPort: 15,
      newDomain: 25,
      mediumDomain: 10,
      establishedDomain: -20,
    };

    // Google Safe Browsing has highest priority
    if (indicators.googleSafeBrowsing) score += weights.googleSafeBrowsing;

    if (indicators.ipBasedUrl) score += weights.ipBasedUrl;
    if (indicators.suspiciousSubdomains) score += weights.suspiciousSubdomains;
    if (indicators.shortUrl) score += weights.shortUrl;
    if (indicators.suspiciousKeywords) score += weights.suspiciousKeywords;
    if (indicators.missingHttps) score += weights.missingHttps;
    if (indicators.homoglyphDetected) score += weights.homoglyphDetected;
    if (indicators.excessiveRedirects) score += weights.excessiveRedirects;
    if (indicators.suspiciousPort) score += weights.suspiciousPort;

    if (indicators.domainAge === "new") score += weights.newDomain;
    if (indicators.domainAge === "medium") score += weights.mediumDomain;
    if (indicators.domainAge === "established") score += weights.establishedDomain;

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
      googleSafeBrowsing: "⚠️ FLAGGED BY GOOGLE SAFE BROWSING as malicious or phishing site",
      ipBasedUrl: "URL uses IP address instead of a domain name",
      suspiciousSubdomains: "Suspicious subdomain pattern detected",
      shortUrl: "URL shortening service detected",
      suspiciousKeywords: "Contains phishing-related keywords",
      missingHttps: "Connection is not encrypted (no HTTPS)",
      homoglyphDetected: "⚠️ Typosquatting or lookalike domain detected - may impersonate a legitimate site",
      excessiveRedirects: "Multiple redirects detected in URL",
      suspiciousPort: "Non-standard or high port usage detected",
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

    if (indicators.googleSafeBrowsing) {
      recs.push(
        "⛔ DO NOT visit this URL - confirmed malicious by Google",
        "Do not enter any personal or financial information",
        "Report this URL to your IT security team immediately"
      );
    }

    if (["critical", "high"].includes(risk) && !indicators.googleSafeBrowsing) {
      recs.push(
        "Avoid entering personal or financial information.",
        "Do not click or forward this link.",
        "Report this URL to your security or IT team."
      );
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
      },
      details: ["Invalid or malformed URL format."],
      recommendations: ["Verify the URL format and try again."],
      metadata: {
        hostname: "N/A",
        tld: "N/A",
        analyzedAt: new Date().toISOString(),
      },
    };
  }
}
