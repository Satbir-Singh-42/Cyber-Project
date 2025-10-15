import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Key, 
  Fish, 
  Network, 
  Keyboard, 
  FilePen, 
  Shield, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';


export default function Dashboard() {
  const [systemStatus] = useState<'ready' | 'not-ready'>('ready');

  const getStatusDisplay = () => {
    if (systemStatus === 'ready') {
      return {
        text: 'Ready',
        textColor: 'text-green-500',
        iconColor: 'text-green-500'
      };
    } else {
      return {
        text: 'Not Ready',
        textColor: 'text-red-500', 
        iconColor: 'text-red-500'
      };
    }
  };

  const statusDisplay = getStatusDisplay();

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
        <h1 className="text-3xl font-bold tracking-tight">
          Cybersecurity Toolkit
        </h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive cybersecurity toolkit for threat detection and system analysis
        </p>
      </div>

      {/* System Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">System Status</p>
              <p className={`text-3xl font-bold ${statusDisplay.textColor}`} data-testid="text-system-status">
                {statusDisplay.text}
              </p>
            </div>
            <Shield className={`h-8 w-8 ${statusDisplay.iconColor}`} />
          </div>
        </CardContent>
      </Card>

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
