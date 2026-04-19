import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = () => {
  // This state controls the sidebar toggle for the whole app
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-[#F8F9FA] font-sans overflow-hidden">
      
      {/* 1. FIXED SIDEBAR */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* 2. RIGHT SIDE CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* FIXED HEADER */}
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* DYNAMIC PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F8F9FA]">
          {/* The <Outlet /> is a placeholder. 
            React Router will swap this out for UserRequest, AuditTrail, etc. 
            depending on the URL.
          */}
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
        
      </div>
    </div>
  );
};

export default DashboardLayout;