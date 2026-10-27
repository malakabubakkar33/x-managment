import React, { useState } from 'react';
import { ShopSidebar } from './ShopSidebar';
import { ShopTopBar } from './ShopTopBar';

interface ShopLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const ShopLayout: React.FC<ShopLayoutProps> = ({ title, children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <ShopSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        <ShopTopBar
          title={title}
          onOpenMobile={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
