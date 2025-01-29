import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Home,
  Calculator,
  BinaryIcon,
  Activity,
  BookOpen,
  Settings,
} from "lucide-react";
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useSidebar } from './SidebarContext';

const Layout = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  
  const activeSection = location.pathname.slice(1) || "home";

  const sideNavItems = [
    { icon: Home, text: "Home", id: "home" },
    { icon: Calculator, text: "Image", id: "image" },
    { icon: BinaryIcon, text: "Gif", id: "gif" },
    { icon: Activity, text: "Binary", id: "binary" },
    { icon: BookOpen, text: "Docs", id: "docs" },
    
    { icon: Settings, text: "Settings", id: "settings" },
  ];

  const handleNavigation = (id) => {
    navigate(id === "home" ? "/" : `/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-screen z-50">
        <Sidebar 
          isSidebarCollapsed={isSidebarCollapsed}
          setSidebarCollapsed={setIsSidebarCollapsed}
          sideNavItems={sideNavItems}
          activeSection={activeSection}
          onNavigation={handleNavigation}
        />
      </div>

      {/* Main content area with fixed navbar */}
      <div className={`${isSidebarCollapsed ? 'ml-20' : 'ml-64'} min-h-screen flex flex-col transition-all duration-300`}>
        {/* Fixed Navbar */}
        <div className="fixed top-0 right-0 left-0 z-40" style={{ marginLeft: isSidebarCollapsed ? '5rem' : '16rem' }}>
          <Navbar />
        </div>

        {/* Scrollable content with top padding for navbar */}
        <div className="mt-16 p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
