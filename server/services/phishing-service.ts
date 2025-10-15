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
  };
  details: string[];
  recommendations: string[];
  metadata: {
    hostname: string;
    tld: string;
    analyzedAt: string;
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
  "google.com", "youtube.com", "facebook.com", "amazon.com", "microsoft.com",
  "apple.com", "twitter.com", "instagram.com", "linkedin.com", "github.com",
  "stackoverflow.com", "reddit.com", "wikipedia.org", "paypal.com", "ebay.com"
];

export class PhishingService {
  analyzeUrl(urlString: string): PhishingAnalysis {
    try {
      const url = new URL(urlString);
      const indicators = this.checkIndicators(url);
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
        },
      };
    } catch {
      return this.invalidUrlResponse();
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
      homoglyphDetected: this.hasHomographAttack(hostname),
      excessiveRedirects: this.hasExcessiveRedirects(url.href),
      suspiciousPort: this.hasSuspiciousPort(url.port),
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
      ipBasedUrl: "URL uses IP address instead of a domain name",
      suspiciousSubdomains: "Suspicious subdomain pattern detected",
      shortUrl: "URL shortening service detected",
      suspiciousKeywords: "Contains phishing-related keywords",
      missingHttps: "Connection is not encrypted (no HTTPS)",
      homoglyphDetected: "Potential homoglyph (lookalike character) attack",
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

    if (["critical", "high"].includes(risk)) {
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
