import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SideMenu } from "./SideMenu";
// import { MainContent } from "./MainContent";
import { useState } from "react";
import ChatBotButton from "./ChatBotButton";

export const AppLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
      <Footer />
      <ChatBotButton />
    </div>
  );
};
