import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Network, Play, Zap } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface OpenPort {
  port: number;
  state: 'open' | 'closed' | 'filtered';
  service: string;
  version?: string;
  banner?: string;
}

interface PortScanResult {
  target: string;
  totalPorts: number;
  openPorts: OpenPort[];
  scanDuration: number;
  timestamp: string;
}

export function PortScanner() {
  const [target, setTarget] = useState('');
  const [portRange, setPortRange] = useState('1-1000');
  const [scanResult, setScanResult] = useState<PortScanResult | null>(null);
  const { toast } = useToast();

  const scanPortsMutation = useMutation({
    mutationFn: async ({ target, portRange }: { target: string; portRange: string }) => {
      const response = await apiRequest('POST', '/api/security/port-scan', { target, portRange });
      return response.json();
    },
    onSuccess: (data) => {
      setScanResult(data);
      toast({
        title: "Scan Complete",
        description: `Found ${data.openPorts.length} open ports on ${data.target}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Scan Failed",
        description: error.message || "Failed to scan ports",
        variant: "destructive",
      });
    },
  });

  const quickScanMutation = useMutation({
    mutationFn: async (target: string) => {
      const response = await apiRequest('POST', '/api/security/port-scan-quick', { target });
      return response.json();
    },
    onSuccess: (data) => {
      setScanResult(data);
      toast({
        title: "Quick Scan Complete",
        description: `Found ${data.openPorts.length} open ports on ${data.target}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Quick Scan Failed",
        description: error.message || "Failed to perform quick scan",
        variant: "destructive",
      });
    },
  });

  const handleFullScan = () => {
    if (target.trim()) {
      scanPortsMutation.mutate({ target: target.trim(), portRange });
    }
  };

  const handleQuickScan = () => {
    if (target.trim()) {
      quickScanMutation.mutate(target.trim());
    }
  };

  const isScanning = scanPortsMutation.isPending || quickScanMutation.isPending;

  return (
    <Card className="bg-card border border-border">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
            <Network className="text-chart-3 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Port Scanner</h3>
            <p className="text-sm text-muted-foreground">Scan network ports and identify running services</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="target-input" className="block text-sm font-medium mb-2">
                Target IP/Domain
              </Label>
              <Input
                id="target-input"
                type="text"
                placeholder="192.168.1.1 or example.com"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full font-mono text-sm"
                data-testid="input-target"
              />
            </div>
            <div>
              <Label htmlFor="port-range-input" className="block text-sm font-medium mb-2">
                Port Range
              </Label>
              <Input
                id="port-range-input"
                type="text"
                placeholder="1-1000 or 80,443,8080"
                value={portRange}
                onChange={(e) => setPortRange(e.target.value)}
                className="w-full font-mono text-sm"
                data-testid="input-port-range"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleFullScan}
              disabled={!target.trim() || isScanning}
              className="flex-1"
              data-testid="button-full-scan"
            >
              <Play className="mr-2 h-4 w-4" />
              {scanPortsMutation.isPending ? "Scanning..." : "Start Scan"}
            </Button>
            <Button
              variant="secondary"
              onClick={handleQuickScan}
              disabled={!target.trim() || isScanning}
              data-testid="button-quick-scan"
            >
              <Zap className="mr-2 h-4 w-4" />
              {quickScanMutation.isPending ? "Scanning..." : "Quick Scan"}
            </Button>
          </div>

          {scanResult && (
            <>
              {/* Scan Results */}
              <div className="bg-secondary rounded-lg">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center">
                      Open Ports Found
                    </h4>
                    <Badge className="bg-chart-3/20 text-chart-3" data-testid="text-open-ports-count">
                      {scanResult.openPorts.length} Active
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Scanned {scanResult.totalPorts} ports on {scanResult.target} in {scanResult.scanDuration}ms
                  </p>
                </div>
                <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                  {scanResult.openPorts.length > 0 ? (
                    scanResult.openPorts.map((port) => (
                      <div key={port.port} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="font-mono text-chart-3 border-chart-3">
                            {port.port}
                          </Badge>
                          <span>{port.service}</span>
                        </div>
                        <div className="text-right">
                          {port.banner && (
                            <div className="text-accent text-xs">{port.banner}</div>
                          )}
                          {port.version && (
                            <div className="text-muted-foreground text-xs">{port.version}</div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      No open ports found in the specified range
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {isScanning && (
            <div className="bg-secondary p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-chart-3"></div>
                <span className="text-sm">
                  {quickScanMutation.isPending ? "Quick scanning common ports..." : "Scanning ports..."}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
