import { Button } from "@/components/ui/button";
import { Shield, Menu, LogIn, LogOut, User } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, isAuthenticated, isGuest, logout, isLoggingOut } = useAuth();

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
            
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="hidden sm:flex items-center bg-primary/10 px-3 py-1 rounded-full">
                  <User className="mr-2 h-3 w-3 text-primary" />
                  <span className="text-xs font-medium text-primary">{user?.name}</span>
                </div>
                
                {/* Logout Button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hidden sm:flex"
                  onClick={logout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? "Signing Out..." : "Sign Out"}
                </Button>
                
                {/* Mobile logout button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="sm:hidden p-2"
                  onClick={logout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : isGuest ? (
              <>
                {/* Guest Mode Badge */}
                <div className="hidden sm:flex items-center bg-muted px-3 py-1 rounded-full">
                  <span className="text-xs font-medium text-muted-foreground">Guest Mode</span>
                </div>
                
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
                  <Button variant="ghost" size="sm" className="sm:hidden">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
              </>
            ) : null}
            
          </div>
        </div>
      </div>
    </header>
  );
}
