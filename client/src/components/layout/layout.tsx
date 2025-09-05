import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleMenuClick = () => {
    console.log('Menu clicked, opening sidebar');
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    console.log('Closing sidebar');
    setSidebarOpen(false);
  };

  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="h-screen bg-background text-foreground overflow-hidden">
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={handleSidebarClose}
        />
      )}
      
      <div className="flex h-full">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={handleSidebarClose}
          onToggle={handleSidebarToggle}
        />
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
          <Header onMenuClick={handleMenuClick} />
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}