import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar } from "../components/admin/exports";

const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  return (
    <div className="flex bg-[#F8FAFC] font-sans text-slate-800" style={{ height: '100dvh', overflow: 'hidden' }}>
      
      {/* Background Ambient Glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#F0F9FF]/50 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* The Collapsible Sidebar */}
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        onCloseMobile={() => setIsMobileOpen(false)} 
        onHoverChange={setIsSidebarHovered}
      />

      {/* Main Content Area - Adjusts margin based on Sidebar hover state */}
      <div className={`flex-1 flex flex-col relative z-10 min-w-0 h-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isSidebarHovered ? 'lg:ml-64' : 'lg:ml-20'}`}>
        
        {/* Floating Navbar */}
        <div className="flex-none z-30">
          <Navbar onToggleSidebar={() => setIsMobileOpen(true)} />
        </div>

        {/* Scrollable Main Content - Added pb-20 on mobile to prevent content from hiding behind the bottom nav */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pb-24 lg:pb-8">
          <Outlet />
        </main>
        
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 0px; display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default AdminLayout;