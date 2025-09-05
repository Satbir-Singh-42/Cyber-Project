import { URL } from 'url';

export interface PhishingAnalysis {
  score: number;
  risk: 'low' | 'medium' | 'high' | 'critical';
  indicators: {
    ipBasedUrl: boolean;
    suspiciousSubdomains: boolean;
    shortUrl: boolean;
    suspiciousKeywords: boolean;
    missingHttps: boolean;
    domainAge: 'new' | 'medium' | 'established' | 'unknown';
  };
  details: string[];
  recommendations: string[];
}

const SUSPICIOUS_KEYWORDS = [
  'paypal', 'amazon', 'netflix', 'microsoft', 'google', 'apple', 'facebook',
  'secure', 'verify', 'update', 'suspended', 'confirm', 'urgent', 'click',
  'winner', 'congratulations', 'prize', 'offer', 'limited', 'act-now',
  'banking', 'account', 'login', 'signin', 'verification', 'auth', 'security',
  'alert', 'warning', 'notice', 'expired', 'renewal', 'billing', 'payment',
  'refund', 'claim', 'validate', 'activate', 'unlock', 'restore', 'recover',
  'support', 'service', 'helpdesk', 'customer', 'team', 'department',
  'cryptocurrency', 'bitcoin', 'ethereum', 'wallet', 'trading', 'investment'
];

const SHORT_URL_DOMAINS = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 
  'buff.ly', 's.id', 'v.gd', 'x.co', 'short.link'
];

const LEGITIMATE_DOMAINS = [
  'google.com', 'youtube.com', 'facebook.com', 'amazon.com', 'microsoft.com',
  'apple.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'github.com',
  'stackoverflow.com', 'reddit.com', 'wikipedia.org', 'paypal.com', 'ebay.com'
];

export class PhishingService {
  analyzeUrl(urlString: string): PhishingAnalysis {
    try {
      const url = new URL(urlString);
      const indicators = this.checkIndicators(url);
      const score = this.calculateRiskScore(indicators, url);
      const risk = this.getRiskLevel(score);
      const details = this.generateDetails(indicators, url);
      const recommendations = this.generateRecommendations(indicators, risk);

      return {
        score,
        risk,
        indicators,
        details,
        recommendations
      };
    } catch (error) {
      return {
        score: 100,
        risk: 'critical',
        indicators: {
          ipBasedUrl: false,
          suspiciousSubdomains: false,
          shortUrl: false,
          suspiciousKeywords: false,
          missingHttps: true,
          domainAge: 'unknown'
        },
        details: ['Invalid URL format'],
        recommendations: ['Verify the URL format and try again']
      };
    }
  }

  private checkIndicators(url: URL) {
    return {
      ipBasedUrl: this.isIpBasedUrl(url.hostname),
      suspiciousSubdomains: this.hasSuspiciousSubdomains(url.hostname),
      shortUrl: this.isShortUrl(url.hostname),
      suspiciousKeywords: this.containsSuspiciousKeywords(url.href),
      missingHttps: url.protocol !== 'https:',
      domainAge: this.estimateDomainAge(url.hostname)
    };
  }

  private isIpBasedUrl(hostname: string): boolean {
    const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(hostname) || ipv6Regex.test(hostname);
  }

  private hasSuspiciousSubdomains(hostname: string): boolean {
    const parts = hostname.split('.');
    
    // More than 3 subdomains is suspicious
    if (parts.length > 4) return true;
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /\d{4,}/, // Long numbers
      /[a-z]{15,}/, // Very long random strings
      /-{2,}/, // Multiple hyphens
      /secure.*secure/, // Repeated "secure"
      /verify.*verify/, // Repeated "verify"
    ];
    
    return parts.some(part => 
      suspiciousPatterns.some(pattern => pattern.test(part))
    );
  }

  private isShortUrl(hostname: string): boolean {
    return SHORT_URL_DOMAINS.includes(hostname.toLowerCase());
  }

  private containsSuspiciousKeywords(url: string): boolean {
    const lowerUrl = url.toLowerCase();
    return SUSPICIOUS_KEYWORDS.some(keyword => lowerUrl.includes(keyword));
  }

  private estimateDomainAge(hostname: string): PhishingAnalysis['indicators']['domainAge'] {
    // Simplified domain age estimation based on known domains
    if (LEGITIMATE_DOMAINS.includes(hostname.toLowerCase())) {
      return 'established';
    }
    
    // Very simple heuristic - in real implementation, you'd query WHOIS data
    const tld = hostname.split('.').pop()?.toLowerCase();
    if (tld === 'tk' || tld === 'ml' || tld === 'ga' || tld === 'cf') {
      return 'new'; // Free TLDs often used by malicious sites
    }
    
    return 'unknown';
  }

  private calculateRiskScore(indicators: PhishingAnalysis['indicators'], url: URL): number {
    let score = 0;

    if (indicators.ipBasedUrl) score += 30;
    if (indicators.suspiciousSubdomains) score += 25;
    if (indicators.shortUrl) score += 20;
    if (indicators.suspiciousKeywords) score += 20;
    if (indicators.missingHttps) score += 15;
    
    switch (indicators.domainAge) {
      case 'new': score += 25; break;
      case 'medium': score += 10; break;
      case 'established': score -= 20; break;
    }

    // Additional checks
    if (this.hasHomographAttack(url.hostname)) score += 30;
    if (this.hasExcessiveRedirects(url.href)) score += 15;
    if (this.hasSuspiciousPort(url.port)) score += 20;

    return Math.max(0, Math.min(100, score));
  }

  private hasHomographAttack(hostname: string): boolean {
    // Check for mixed scripts or confusing characters
    const cyrillicPattern = /[а-я]/i; // Cyrillic letters
    const greekPattern = /[α-ω]/i; // Greek letters  
    const fullwidthPattern = /[ａ-ｚ]/i; // Fullwidth Latin
    
    // Check for confusing character combinations in domain
    const confusingChars = /[0oOQ1lI5sS2zZ6G9gq]/;
    const hasConfusing = confusingChars.test(hostname) && hostname.length > 3;
    
    // Check for IDN (Internationalized Domain Name) encoding
    const idnPattern = /xn--/;
    
    // Look for suspicious Unicode substitutions
    const suspiciousUnicode = cyrillicPattern.test(hostname) || 
                             greekPattern.test(hostname) || 
                             fullwidthPattern.test(hostname);
    
    return suspiciousUnicode || (hasConfusing && idnPattern.test(hostname));
  }

  private hasExcessiveRedirects(url: string): boolean {
    // Simple check for multiple redirects in URL
    return (url.match(/http/g) || []).length > 1;
  }

  private hasSuspiciousPort(port: string): boolean {
    if (!port) return false;
    const portNum = parseInt(port);
    // Common non-standard ports that could indicate suspicious activity
    const suspiciousPorts = [8080, 8000, 3000, 5000, 9000, 8443, 8888, 9999, 4444, 31337, 1337, 8008];
    // Very high ports that might be used to avoid detection
    const highPort = portNum > 49152;
    return suspiciousPorts.includes(portNum) || highPort;
  }

  private getRiskLevel(score: number): PhishingAnalysis['risk'] {
    if (score >= 70) return 'critical';
    if (score >= 50) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
  }

  private generateDetails(indicators: PhishingAnalysis['indicators'], url: URL): string[] {
    const details: string[] = [];

    if (indicators.ipBasedUrl) {
      details.push('URL uses IP address instead of domain name');
    }
    if (indicators.suspiciousSubdomains) {
      details.push('Domain has suspicious subdomain patterns');
    }
    if (indicators.shortUrl) {
      details.push('URL uses a URL shortening service');
    }
    if (indicators.suspiciousKeywords) {
      details.push('URL contains suspicious keywords often used in phishing');
    }
    if (indicators.missingHttps) {
      details.push('Connection is not encrypted (HTTP instead of HTTPS)');
    }
    
    switch (indicators.domainAge) {
      case 'new':
        details.push('Domain appears to be newly registered');
        break;
      case 'established':
        details.push('Domain has an established online presence');
        break;
      case 'unknown':
        details.push('Unable to determine domain age');
        break;
    }

    if (details.length === 0) {
      details.push('No obvious phishing indicators detected');
    }

    return details;
  }

  private generateRecommendations(indicators: PhishingAnalysis['indicators'], risk: PhishingAnalysis['risk']): string[] {
    const recommendations: string[] = [];

    if (risk === 'critical' || risk === 'high') {
      recommendations.push('DO NOT enter personal information on this site');
      recommendations.push('Verify the legitimate website URL directly');
      recommendations.push('Report this URL to your security team');
    }

    if (indicators.missingHttps) {
      recommendations.push('Look for HTTPS encryption before entering sensitive data');
    }

    if (indicators.shortUrl) {
      recommendations.push('Expand shortened URLs to see the actual destination');
    }

    if (indicators.suspiciousKeywords) {
      recommendations.push('Be cautious of urgent language and requests for immediate action');
    }

    if (risk === 'low') {
      recommendations.push('Always verify URLs match the official website');
      recommendations.push('Keep your browser and security software updated');
    }

    return recommendations;
  }
}
