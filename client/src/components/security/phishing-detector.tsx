import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Fish, Search, Check, X, Info, AlertTriangle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface PhishingAnalysis {
  score: number;
  risk: 'low' | 'medium' | 'high' | 'critical';
  indicators: {
    ipBasedUrl: boolean;
    suspiciousSubdomains: boolean;
    shortUrl: boolean;
    suspiciousKeywords: boolean;
    missingHttps: boolean;
    domainAge: 'new' | 'medium' | 'established' | 'unknown';
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

export function PhishingDetector() {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState<PhishingAnalysis | null>(null);

  const analyzeUrlMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest('POST', '/api/security/phishing-analysis', { url });
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysis(data);
    },
    onError: (error: any) => {
      console.error('Failed to analyze URL:', error);
    },
  });

  const handleAnalyze = () => {
    if (url.trim()) {
      let urlToAnalyze = url.trim();
      // Add protocol if missing
      if (!urlToAnalyze.startsWith('http://') && !urlToAnalyze.startsWith('https://')) {
        urlToAnalyze = 'https://' + urlToAnalyze;
      }
      analyzeUrlMutation.mutate(urlToAnalyze);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-accent/20 text-accent';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500';
      case 'high': return 'bg-orange-500/20 text-orange-500';
      case 'critical': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <Check className="h-4 w-4" />;
      case 'medium': return <Info className="h-4 w-4" />;
      case 'high': 
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-card border border-border">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
            <Fish className="text-destructive text-lg sm:text-xl" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold">Phishing URL Detection</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Detect malicious URLs and phishing attempts</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="url-input" className="block text-sm font-medium mb-2">
              URL to Analyze
            </Label>
            <Input
              id="url-input"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full font-mono"
              data-testid="input-url"
            />
          </div>

          <Button 
            onClick={handleAnalyze}
            disabled={!url.trim() || analyzeUrlMutation.isPending}
            className="w-full"
            data-testid="button-analyze-url"
          >
            <Search className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{analyzeUrlMutation.isPending ? "Analyzing..." : "Analyze URL"}</span>
            <span className="sm:hidden">{analyzeUrlMutation.isPending ? "Analyzing..." : "Analyze"}</span>
          </Button>

          {analysis && (
            <>
              {/* Analysis Results */}
              <div className="bg-secondary p-3 sm:p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Security Assessment</h4>
                  <Badge className={`${getRiskColor(analysis.risk)} flex items-center space-x-1`}>
                    {getRiskIcon(analysis.risk)}
                    <span>{analysis.risk.charAt(0).toUpperCase() + analysis.risk.slice(1)} Risk</span>
                  </Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Risk Score</span>
                    <span className="font-mono" data-testid="text-risk-score">{analysis.score}/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Hostname</span>
                    <span className="font-mono text-xs truncate max-w-[200px]">{analysis.metadata.hostname}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>URL Length</span>
                    <span className="font-mono">{analysis.metadata.urlLength} chars</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Subdomain Count</span>
                    <span className="font-mono">{analysis.metadata.subdomainCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Domain Age</span>
                    <span className={analysis.indicators.domainAge === 'established' ? 'text-accent' : 'text-muted-foreground'}>
                      {analysis.indicators.domainAge}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Indicators Grid */}
              <div className="bg-secondary p-3 sm:p-4 rounded-lg">
                <h4 className="font-medium mb-3">Security Indicators</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>SSL/HTTPS</span>
                    {!analysis.indicators.missingHttps ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>IP Address</span>
                    {!analysis.indicators.ipBasedUrl ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Brand Impersonation</span>
                    {!analysis.indicators.brandImpersonation ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Typosquatting</span>
                    {!analysis.indicators.homoglyphDetected ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Suspicious TLD</span>
                    {!analysis.indicators.suspiciousTLD ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Suspicious Subdomains</span>
                    {!analysis.indicators.suspiciousSubdomains ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Suspicious Keywords</span>
                    {!analysis.indicators.suspiciousKeywords ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Short URL Service</span>
                    {!analysis.indicators.shortUrl ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>@ Symbol</span>
                    {!analysis.indicators.containsAtSymbol ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Special Characters</span>
                    {!analysis.indicators.suspiciousSpecialChars ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Random Pattern</span>
                    {!analysis.indicators.randomStringPattern ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Misleading Path</span>
                    {!analysis.indicators.misleadingPath ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data URI</span>
                    {!analysis.indicators.dataUri ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Excessive Redirects</span>
                    {!analysis.indicators.excessiveRedirects ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Suspicious Port</span>
                    {!analysis.indicators.suspiciousPort ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Excessive Length</span>
                    {!analysis.indicators.excessiveLength ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Hex Encoding</span>
                    {!analysis.indicators.hexEncoding ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </div>
              </div>

              {/* Detailed Analysis */}
              <div className="bg-muted p-3 sm:p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Info className="mr-2 h-4 w-4" />
                  Analysis Details
                </h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  {analysis.details.map((detail, index) => (
                    <p key={index}>• {detail}</p>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {analysis.recommendations.length > 0 && (
                <div className="bg-muted p-3 sm:p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Recommendations
                  </h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {analysis.recommendations.map((recommendation, index) => (
                      <p key={index}>• {recommendation}</p>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
