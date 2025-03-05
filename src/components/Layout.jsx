import React from "react";
import { useLocation } from "react-router-dom";
import TopNav from "./navigation/TopNav";
import SideNav from "./navigation/SideNav";

function Layout({ children, isDarkMode, onThemeToggle }) {
  const location = useLocation();
  const hideNav = location.pathname === "/login"; // Hide sidebar and top nav on login page

  return (
    <div className="flex h-screen">
      {/* Sidebar (Hidden on login page) */}
      {!hideNav && <SideNav />}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation (Hidden on login page) */}
        {!hideNav && <TopNav isDarkMode={isDarkMode} onThemeToggle={onThemeToggle} />}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="mt-24">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
