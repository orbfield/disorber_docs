import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useSidebar } from './SidebarContext';
import BackgroundCanvas from './BackgroundCanvas';

const Layout = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useSidebar();
  const location = useLocation();
  const activeSection = location.pathname.slice(1) || "home";

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <BackgroundCanvas resetKey={location.pathname}>
        <div className="min-h-screen text-white">
          <div className={`min-h-screen flex flex-col ${isSidebarCollapsed ? "ml-16" : "ml-64"} pt-8 transition-[margin]`}>
            <div className="p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </BackgroundCanvas>

      {/* UI Overlay - Fixed Elements */}
      <div className="fixed left-0 top-0 h-screen z-40">
        <Sidebar
          isSidebarCollapsed={isSidebarCollapsed}
          setSidebarCollapsed={setIsSidebarCollapsed}
          activeSection={activeSection}
        />
      </div>
      
      <div className="fixed top-0 right-0 left-0 z-50">
        <Navbar />
      </div>
    </div>
  );
};

export default Layout;
