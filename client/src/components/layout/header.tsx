import { Button } from "@/components/ui/button";
import { Download, Shield, User } from "lucide-react";

export function Header() {
  const handleExportReport = async () => {
    try {
      const response = await fetch('/api/security/export-report');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cybersec-report.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="text-primary-foreground text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CyberSec Toolkit</h1>
              <p className="text-sm text-muted-foreground">Comprehensive Security Analysis Suite</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="secondary" 
              onClick={handleExportReport}
              data-testid="button-export-report"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <User className="text-muted-foreground h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
