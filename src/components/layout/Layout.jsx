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
import BackgroundCanvas from './BackgroundCanvas';

const Layout = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
 
  const activeSection = location.pathname.slice(1) || "home";
  const sideNavItems = [
    { icon: Home, text: "Home", id: "home" },
    { icon: Calculator, text: "Image", id: "image" },
    { icon: BinaryIcon, text: "Gallery", id: "gallery" },
    { icon: Activity, text: "Binary", id: "binary" },
    { icon: BookOpen, text: "Docs", id: "docs" },
    { icon: Settings, text: "Settings", id: "settings" },
  ];

  const handleNavigation = (id) => {
    navigate(id === "home" ? "/" : `/${id}`);
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <BackgroundCanvas>
        <div className="min-h-screen text-white">
          <div className="min-h-screen flex flex-col">
            <div className="p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </BackgroundCanvas>

      {/* UI Overlay - Fixed Elements */}
      <div className="fixed left-0 top-0 h-screen z-50">
        <Sidebar
          isSidebarCollapsed={isSidebarCollapsed}
          setSidebarCollapsed={setIsSidebarCollapsed}
          sideNavItems={sideNavItems}
          activeSection={activeSection}
          onNavigation={handleNavigation}
        />
      </div>
      
      <div 
        className="fixed top-0 right-0 left-0 z-40" 
        style={{ marginLeft: isSidebarCollapsed ? '5rem' : '16rem' }}
      >
        <Navbar />
      </div>
    </div>
  );
};

export default Layout;
