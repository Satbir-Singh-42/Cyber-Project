import { Button } from "@/components/ui/button";
import { Download, Shield, User, Menu, LogIn } from "lucide-react";
import { Link } from "wouter";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
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
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden p-2"
              data-testid="button-mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Header title - responsive */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="text-primary-foreground text-base sm:text-lg" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-foreground">CyberSec Toolkit</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Comprehensive Security Analysis Suite</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-foreground">CyberSec</h1>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleExportReport}
              data-testid="button-export-report"
              className="hidden sm:flex"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            {/* Mobile export button */}
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleExportReport}
              data-testid="button-export-report-mobile"
              className="sm:hidden p-2"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            {/* Auth Buttons */}
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="hidden sm:flex">
                Sign Up
              </Button>
            </Link>
            
            {/* Mobile auth button */}
            <Link href="/login">
              <Button variant="ghost" size="sm" className="sm:hidden p-2">
                <LogIn className="h-4 w-4" />
              </Button>
            </Link>
            
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-muted rounded-full flex items-center justify-center">
              <User className="text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
