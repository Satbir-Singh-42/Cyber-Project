import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Shield, 
  Key, 
  Fish, 
  Network, 
  Keyboard, 
  FilePen, 
  History, 
  Home,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SidebarItem {
  icon: any;
  label: string;
  path: string;
  description: string;
}

const sidebarItems: SidebarItem[] = [
  {
    icon: Home,
    label: "Dashboard",
    path: "/",
    description: "Overview & Quick Actions"
  },
  {
    icon: Key,
    label: "Password Analyzer",
    path: "/password-analyzer",
    description: "Check password strength & security"
  },
  {
    icon: Fish,
    label: "Phishing Detector",
    path: "/phishing-detector", 
    description: "Analyze URLs for phishing threats"
  },
  {
    icon: Network,
    label: "Port Scanner",
    path: "/port-scanner",
    description: "Scan network ports & services"
  },
  {
    icon: Keyboard,
    label: "Keylogger Detector",
    path: "/keylogger-detector",
    description: "Monitor for malicious processes"
  },
  {
    icon: FilePen,
    label: "File Integrity Monitor",
    path: "/file-integrity",
    description: "Track file system changes"
  },
  {
    icon: History,
    label: "Scan History",
    path: "/history",
    description: "View all security scan results"
  }
];

export function Sidebar() {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-card border-r border-border flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="text-primary-foreground text-lg" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">CyberSec</h1>
                <p className="text-xs text-muted-foreground">Security Toolkit</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 h-8 w-8"
            data-testid="button-toggle-sidebar"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <div
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors",
                  "hover:bg-secondary/80",
                  isActive ? "bg-primary text-primary-foreground" : "text-foreground"
                )}
                data-testid={`nav-${item.path.replace(/\//g, '-') || 'home'}`}
              >
                <Icon className={cn("h-4 w-4", !collapsed && "min-w-[16px]")} />
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className={cn(
                      "text-xs truncate",
                      isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      {item.description}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-border">
        <Link href="/settings">
          <div
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors",
              "hover:bg-secondary/80 text-foreground"
            )}
            data-testid="nav-settings"
          >
            <Settings className="h-4 w-4" />
            {!collapsed && (
              <div className="flex-1">
                <div className="font-medium text-sm">Settings</div>
                <div className="text-xs text-muted-foreground">Configure toolkit</div>
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}