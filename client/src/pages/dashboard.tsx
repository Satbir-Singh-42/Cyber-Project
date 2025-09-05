import { Header } from "@/components/layout/header";
import { PasswordAnalyzer } from "@/components/security/password-analyzer";
import { PhishingDetector } from "@/components/security/phishing-detector";
import { PortScanner } from "@/components/security/port-scanner";
import { KeyloggerDetector } from "@/components/security/keylogger-detector";
import { FileIntegrityMonitor } from "@/components/security/file-integrity-monitor";
import { Button } from "@/components/ui/button";
import { Download, Settings, History, HelpCircle } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Dashboard Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Security Analysis Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive cybersecurity tools for threat detection and analysis</p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PasswordAnalyzer />
          <PhishingDetector />
        </div>

        {/* Second Row of Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PortScanner />
          <KeyloggerDetector />
        </div>

        {/* File Integrity Monitor - Full Width */}
        <FileIntegrityMonitor />

        {/* Quick Actions */}
        <div className="mt-8 bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="secondary" 
              className="flex items-center justify-center space-x-2 p-4"
              data-testid="button-export-all"
            >
              <Download className="h-4 w-4" />
              <span className="text-sm">Export All Reports</span>
            </Button>
            <Button 
              variant="secondary" 
              className="flex items-center justify-center space-x-2 p-4"
              data-testid="button-settings"
            >
              <Settings className="h-4 w-4" />
              <span className="text-sm">Settings</span>
            </Button>
            <Button 
              variant="secondary" 
              className="flex items-center justify-center space-x-2 p-4"
              data-testid="button-history"
            >
              <History className="h-4 w-4" />
              <span className="text-sm">Scan History</span>
            </Button>
            <Button 
              variant="secondary" 
              className="flex items-center justify-center space-x-2 p-4"
              data-testid="button-help"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm">Help & Docs</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
