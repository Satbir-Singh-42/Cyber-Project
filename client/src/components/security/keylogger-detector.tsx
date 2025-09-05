import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Keyboard, Search, Shield, Eye, AlertTriangle, Trash2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface SuspiciousProcess {
  pid: number;
  name: string;
  command: string;
  riskScore: number;
  reasons: string[];
  user?: string;
  cpuUsage?: number;
  memoryUsage?: number;
}

interface KeyloggerDetectionResult {
  processesScanned: number;
  suspiciousProcesses: SuspiciousProcess[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  timestamp: string;
}

export function KeyloggerDetector() {
  const [scanResult, setScanResult] = useState<KeyloggerDetectionResult | null>(null);

  const scanMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/security/keylogger-scan', {});
      return response.json();
    },
    onSuccess: (data) => {
      setScanResult(data);
    },
    onError: (error: any) => {
      console.error('Failed to scan for keyloggers:', error);
    },
  });

  const terminateProcessMutation = useMutation({
    mutationFn: async (pid: number) => {
      const response = await apiRequest('POST', '/api/security/terminate-process', { pid });
      return response.json();
    },
    onSuccess: (data, variables) => {
      if (data.success) {
        // Refresh scan results
        scanMutation.mutate();
      }
    },
    onError: (error: any) => {
      console.error('Failed to terminate process:', error);
    },
  });

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-accent/20 text-accent';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500';
      case 'high': return 'bg-orange-500/20 text-orange-500';
      case 'critical': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getProcessRiskColor = (score: number) => {
    if (score >= 80) return 'text-destructive';
    if (score >= 60) return 'text-orange-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  return (
    <Card className="bg-card border border-border">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
            <Keyboard className="text-chart-4 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Keylogger Detection</h3>
            <p className="text-sm text-muted-foreground">Monitor processes for suspicious keylogging activity</p>
          </div>
        </div>

        <div className="space-y-4">

          <Button
            onClick={() => scanMutation.mutate()}
            disabled={scanMutation.isPending}
            className="w-full bg-chart-4 hover:bg-chart-4/90 text-primary-foreground"
            data-testid="button-scan-keyloggers"
          >
            <Search className="mr-2 h-4 w-4" />
            {scanMutation.isPending ? "Scanning..." : "Scan for Keyloggers"}
          </Button>

          {scanResult && (
            <>
              {/* Detection Results */}
              <div className="bg-secondary rounded-lg">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      System Status
                    </h4>
                    <Badge className={getRiskColor(scanResult.riskLevel)}>
                      {scanResult.riskLevel === 'low' ? 'Clean' : 
                       scanResult.riskLevel.charAt(0).toUpperCase() + scanResult.riskLevel.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Processes Scanned</span>
                    <span className="font-mono" data-testid="text-processes-scanned">
                      {scanResult.processesScanned}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Suspicious Activity</span>
                    <span className={`font-mono ${scanResult.suspiciousProcesses.length > 0 ? 'text-destructive' : 'text-accent'}`}>
                      {scanResult.suspiciousProcesses.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Last Scan</span>
                    <span className="text-muted-foreground">
                      {new Date(scanResult.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Suspicious Processes */}
              {scanResult.suspiciousProcesses.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="p-4 border-b border-destructive/20">
                    <h4 className="font-medium flex items-center text-destructive">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Suspicious Processes
                    </h4>
                  </div>
                  <div className="p-4 space-y-3 max-h-48 overflow-y-auto">
                    {scanResult.suspiciousProcesses.map((process) => (
                      <div key={process.pid} className="flex items-start justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="outline" className="font-mono">
                              PID {process.pid}
                            </Badge>
                            <span className="font-medium truncate">{process.name}</span>
                            <span className={`text-sm font-bold ${getProcessRiskColor(process.riskScore)}`}>
                              {process.riskScore}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground font-mono truncate mb-2">
                            {process.command}
                          </p>
                          <div className="text-xs text-destructive">
                            {process.reasons.map((reason, index) => (
                              <div key={index}>• {reason}</div>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => terminateProcessMutation.mutate(process.pid)}
                          disabled={terminateProcessMutation.isPending}
                          data-testid={`button-terminate-${process.pid}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {scanResult.recommendations.length > 0 && (
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Recommendations
                  </h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {scanResult.recommendations.map((recommendation, index) => (
                      <p key={index}>• {recommendation}</p>
                    ))}
                  </div>
                </div>
              )}

            </>
          )}

          {scanMutation.isPending && (
            <div className="bg-secondary p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-chart-4"></div>
                <span className="text-sm">Scanning system processes for suspicious activity...</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
