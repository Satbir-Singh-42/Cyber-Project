import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Key, 
  Fish, 
  Network, 
  Keyboard, 
  FilePen, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface ScanResult {
  id: string;
  type: string;
  target: string;
  result: string;
  score: number | null;
  timestamp: string;
}

export default function Dashboard() {
  const { data: scanResults = [] } = useQuery<ScanResult[]>({
    queryKey: ['/api/security/scan-history'],
  });

  const recentScans = scanResults.slice(0, 5);
  const totalScans = scanResults.length;
  const todayScans = scanResults.filter((scan) => {
    const scanDate = new Date(scan.timestamp);
    const today = new Date();
    return scanDate.toDateString() === today.toDateString();
  }).length;

  const securityTools = [
    {
      title: 'Password Analyzer',
      description: 'Check password strength and security criteria',
      icon: Key,
      path: '/password-analyzer',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Phishing Detector', 
      description: 'Analyze URLs for malicious patterns',
      icon: Fish,
      path: '/phishing-detector',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10'
    },
    {
      title: 'Port Scanner',
      description: 'Scan network ports and services',
      icon: Network, 
      path: '/port-scanner',
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10'
    },
    {
      title: 'Keylogger Detector',
      description: 'Monitor for suspicious processes',
      icon: Keyboard,
      path: '/keylogger-detector', 
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10'
    },
    {
      title: 'File Integrity Monitor',
      description: 'Track file system changes',
      icon: FilePen,
      path: '/file-integrity',
      color: 'text-chart-5', 
      bgColor: 'bg-chart-5/10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive cybersecurity toolkit for threat detection and system analysis
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Scans</p>
                <p className="text-3xl font-bold" data-testid="text-total-scans">{totalScans}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Scans</p>
                <p className="text-3xl font-bold" data-testid="text-today-scans">{todayScans}</p>
              </div>
              <Clock className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Status</p>
                <p className="text-3xl font-bold text-accent">Secure</p>
              </div>
              <Shield className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Tools Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Security Analysis Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {securityTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.path} href={tool.path}>
                  <div className="p-3 sm:p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${tool.bgColor}`}>
                        <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${tool.color}`} />
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold mb-1">{tool.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Scan Activity</CardTitle>
          <Link href="/history">
            <Button variant="outline" size="sm">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentScans.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No recent scans</h3>
              <p>Start by running a security analysis with one of the tools above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentScans.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg overflow-hidden"
                >
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary" className="capitalize">
                      {scan.type.replace('_', ' ')}
                    </Badge>
                    <span className="font-medium">{scan.target}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(scan.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Security Best Practices</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Regular Security Checks:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Run password analysis on critical accounts</li>
                <li>• Scan network ports weekly</li>
                <li>• Monitor file integrity on sensitive directories</li>
                <li>• Check for keyloggers regularly</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Threat Prevention:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Verify all URLs before clicking</li>
                <li>• Use strong, unique passwords</li>
                <li>• Keep systems and software updated</li>
                <li>• Enable two-factor authentication</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
