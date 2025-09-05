import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    console.log('Menu clicked, opening sidebar');
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    console.log('Closing sidebar');
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={handleSidebarClose}
        />
      )}
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={handleSidebarClose}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuClick={handleMenuClick} />
          <main className="flex-1 p-4 sm:p-6 overflow-x-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}