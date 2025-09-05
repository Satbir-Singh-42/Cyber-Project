import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Fish, Search, Check, X, Info, AlertTriangle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

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
  };
  details: string[];
  recommendations: string[];
}

export function PhishingDetector() {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState<PhishingAnalysis | null>(null);
  const { toast } = useToast();

  const analyzeUrlMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest('POST', '/api/security/phishing-analysis', { url });
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysis(data);
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze URL",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (url.trim()) {
      analyzeUrlMutation.mutate(url.trim());
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
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
            <Fish className="text-destructive text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Phishing URL Detection</h3>
            <p className="text-sm text-muted-foreground">Detect malicious URLs and phishing attempts</p>
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
            {analyzeUrlMutation.isPending ? "Analyzing..." : "Analyze URL"}
          </Button>

          {analysis && (
            <>
              {/* Analysis Results */}
              <div className="bg-secondary p-4 rounded-lg">
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
                    <span>IP-based URL</span>
                    {analysis.indicators.ipBasedUrl ? (
                      <X className="h-4 w-4 text-destructive" />
                    ) : (
                      <Check className="h-4 w-4 text-accent" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SSL Certificate</span>
                    {!analysis.indicators.missingHttps ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Domain Age</span>
                    <span className={analysis.indicators.domainAge === 'established' ? 'text-accent' : 'text-muted-foreground'}>
                      {analysis.indicators.domainAge}
                    </span>
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
                    <span>Short URL</span>
                    {!analysis.indicators.shortUrl ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </div>
              </div>

              {/* Detailed Analysis */}
              <div className="bg-muted p-4 rounded-lg">
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
                <div className="bg-muted p-4 rounded-lg">
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
