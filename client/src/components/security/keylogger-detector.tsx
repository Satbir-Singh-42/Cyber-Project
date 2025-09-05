import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Keyboard, Search, Shield, Eye, AlertTriangle, Trash2, RefreshCw, Clock, CheckCircle, XCircle } from 'lucide-react';
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
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [terminatingPid, setTerminatingPid] = useState<number | null>(null);
  const { toast } = useToast();

  const scanMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/security/keylogger-scan', {});
      return response.json();
    },
    onSuccess: (data) => {
      setScanResult(data);
      toast({
        title: "Scan Complete",
        description: `Scanned ${data.processesScanned} processes. Found ${data.suspiciousProcesses.length} suspicious activities.`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to scan for keyloggers:', error);
      toast({
        title: "Scan Failed",
        description: "Unable to scan for keyloggers. Please try again.",
        variant: "destructive",
      });
    },
  });

  const terminateProcessMutation = useMutation({
    mutationFn: async (pid: number) => {
      setTerminatingPid(pid);
      const response = await apiRequest('POST', '/api/security/terminate-process', { pid });
      return response.json();
    },
    onSuccess: (data, variables) => {
      setTerminatingPid(null);
      if (data.success) {
        toast({
          title: "Process Terminated",
          description: `Successfully terminated process PID ${variables}`,
        });
        // Refresh scan results
        scanMutation.mutate();
      } else {
        toast({
          title: "Termination Failed",
          description: `Process PID ${variables} could not be terminated. It may have already ended or requires elevated permissions.`,
          variant: "destructive",
        });
      }
    },
    onError: (error: any, variables) => {
      setTerminatingPid(null);
      console.error('Failed to terminate process:', error);
      toast({
        title: "Termination Error",
        description: `Failed to terminate process PID ${variables}. Please check system permissions.`,
        variant: "destructive",
      });
    },
  });

  // Auto-refresh functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh && !scanMutation.isPending) {
      interval = setInterval(() => {
        scanMutation.mutate();
      }, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, scanMutation]);

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
          {/* Scan Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => scanMutation.mutate()}
              disabled={scanMutation.isPending}
              className="flex-1 bg-chart-4 hover:bg-chart-4/90 text-primary-foreground"
              data-testid="button-scan-keyloggers"
            >
              {scanMutation.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Scan for Keyloggers
                </>
              )}
            </Button>
            
            <div className="flex items-center space-x-2 px-3 py-2 border rounded-lg">
              <Switch
                id="auto-refresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
                disabled={scanMutation.isPending}
              />
              <Label htmlFor="auto-refresh" className="text-sm cursor-pointer">
                Auto-refresh
              </Label>
              <Clock className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>

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

              {/* Clean System Message */}
              {scanResult.suspiciousProcesses.length === 0 && scanResult.riskLevel === 'low' && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-accent">System Clean</p>
                      <p className="text-xs text-muted-foreground">No suspicious keylogging activity detected</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Suspicious Processes */}
              {scanResult.suspiciousProcesses.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="p-4 border-b border-destructive/20">
                    <h4 className="font-medium flex items-center text-destructive">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Suspicious Processes
                    </h4>
                  </div>
                  <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                    {scanResult.suspiciousProcesses.map((process) => (
                      <div key={process.pid} className="p-4 bg-background/50 rounded-lg border border-destructive/20">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="font-mono text-xs">
                              PID {process.pid}
                            </Badge>
                            <span className={`text-sm font-bold ${getProcessRiskColor(process.riskScore)}`}>
                              Risk: {process.riskScore}%
                            </span>
                          </div>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                disabled={terminatingPid === process.pid}
                                data-testid={`button-terminate-${process.pid}`}
                              >
                                {terminatingPid === process.pid ? (
                                  <RefreshCw className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3 w-3" />
                                )}
                                {terminatingPid === process.pid ? 'Terminating...' : 'Terminate'}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Terminate Process?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to terminate process <strong>{process.name}</strong> (PID {process.pid})?
                                  This action cannot be undone and may affect system stability if this is a legitimate process.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => terminateProcessMutation.mutate(process.pid)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Terminate Process
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs text-muted-foreground">Process Name:</span>
                            <p className="font-medium text-sm break-words">{process.name}</p>
                          </div>
                          
                          <div>
                            <span className="text-xs text-muted-foreground">Command Line:</span>
                            <p className="text-xs font-mono bg-muted/50 p-2 rounded mt-1 break-all max-h-20 overflow-y-auto">
                              {process.command}
                            </p>
                          </div>
                          
                          {(process.cpuUsage || process.memoryUsage) && (
                            <div className="flex gap-4 text-xs">
                              {process.cpuUsage && (
                                <div>
                                  <span className="text-muted-foreground">CPU:</span>
                                  <span className="ml-1 font-mono">{process.cpuUsage}%</span>
                                </div>
                              )}
                              {process.memoryUsage && (
                                <div>
                                  <span className="text-muted-foreground">Memory:</span>
                                  <span className="ml-1 font-mono">{process.memoryUsage}%</span>
                                </div>
                              )}
                              {process.user && (
                                <div>
                                  <span className="text-muted-foreground">User:</span>
                                  <span className="ml-1 font-mono">{process.user}</span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div>
                            <span className="text-xs text-muted-foreground">Risk Factors:</span>
                            <div className="text-xs text-destructive space-y-1 mt-1">
                              {process.reasons.map((reason, index) => (
                                <div key={index} className="flex items-start gap-1">
                                  <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                  <span>{reason}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
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
            <div className="bg-secondary p-4 rounded-lg border-l-4 border-chart-4">
              <div className="flex items-center space-x-3">
                <RefreshCw className="h-5 w-5 animate-spin text-chart-4" />
                <div>
                  <p className="text-sm font-medium">Scanning system processes...</p>
                  <p className="text-xs text-muted-foreground">Analyzing running processes for suspicious keylogging activity</p>
                </div>
              </div>
            </div>
          )}

          {scanMutation.isError && (
            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <XCircle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-sm font-medium text-destructive">Scan Failed</p>
                  <p className="text-xs text-muted-foreground">Unable to scan for keyloggers. Please check system permissions and try again.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
