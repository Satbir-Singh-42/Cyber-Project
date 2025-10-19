import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Shield, 
  Key, 
  Fish, 
  Network, 
  Keyboard, 
  Home,
  ChevronLeft,
  ChevronRight,
  X,
  Code
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
    icon: Code,
    label: "Developers",
    path: "/developers",
    description: "Meet the team behind this toolkit"
  }
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: (collapsed: boolean) => void;
}

export function Sidebar({ isOpen, onClose, onToggle }: SidebarProps) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div className={cn(
        "bg-card border-r border-border flex flex-col transition-all duration-300",
        // Desktop sidebar - fixed position
        "hidden lg:flex fixed left-0 top-0 h-full z-30",
        collapsed ? "w-16" : "w-64"
      )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newCollapsed = !collapsed;
              setCollapsed(newCollapsed);
              onToggle?.(newCollapsed);
            }}
            className="p-1 h-8 w-8"
            data-testid="button-toggle-sidebar"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <div
                className={cn(
                  "flex items-center rounded-lg cursor-pointer transition-colors",
                  "hover:bg-secondary/80",
                  collapsed ? "justify-center px-2 py-3" : "space-x-3 px-3 py-2.5",
                  isActive ? "bg-primary text-primary-foreground" : "text-foreground"
                )}
                data-testid={`nav-${item.path.replace(/\//g, '-') || 'home'}`}
              >
                <Icon className={cn(
                  collapsed ? "h-6 w-6" : "h-5 w-5 min-w-[20px]"
                )} />
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

    </div>
    
    {/* Mobile sidebar */}
    {isOpen && (
      <div className="fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col lg:hidden shadow-xl">
        {/* Mobile header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">CyberSec</h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Security Toolkit</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1.5 h-9 w-9 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              data-testid="button-close-mobile-sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Items */}
        <nav className="flex-1 p-4 sm:p-5 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={cn(
                    "flex items-center space-x-3 sm:space-x-4 px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg cursor-pointer transition-colors",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    isActive 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-900 dark:text-white"
                  )}
                  onClick={onClose}
                  data-testid={`nav-mobile-${item.path.replace(/\//g, '-') || 'home'}`}
                >
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7 min-w-[24px] sm:min-w-[28px]" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm sm:text-base">{item.label}</div>
                    <div className={cn(
                      "text-xs sm:text-sm truncate",
                      isActive 
                        ? "text-blue-100" 
                        : "text-gray-600 dark:text-gray-400"
                    )}>
                      {item.description}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

      </div>
    )}
    </>
  );
}