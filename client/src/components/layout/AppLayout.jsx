"use client";

import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SideMenu } from "./SideMenu";
import { useState, useEffect } from "react";
import ChatBotButton from "./ChatBotButton";
import BottomNavigation from "./BottomNavigation";

export const AppLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Function to handle sidebar state changes
  const handleSidebarToggle = (isCollapsed) => {
    setSidebarCollapsed(isCollapsed);
  };

  return (
    <div className="app-container">
      <Header />
      <div className="main-container">
        <SideMenu onToggle={handleSidebarToggle} />
        <main
          className={`main-content ${
            sidebarCollapsed ? "content-expanded" : "content-with-sidebar"
          }`}
        >
          <Outlet />
        </main>
      </div>
      {!isMobile && <Footer />}
      <ChatBotButton />
      {isMobile && <BottomNavigation />}
    </div>
  );
};
