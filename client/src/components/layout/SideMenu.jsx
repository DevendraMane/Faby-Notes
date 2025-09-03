"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../store/Auth";
import { Link, useNavigate } from "react-router-dom";

export const SideMenu = ({ onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoggedIn } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    // Listen for sidebar toggle event from header (only for desktop)
    const handleToggleSidebar = () => {
      if (!isMobile) {
        toggleSidebar();
      }
    };

    document.addEventListener("toggleSidebar", handleToggleSidebar);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      document.removeEventListener("toggleSidebar", handleToggleSidebar);
    };
  }, [isMobile]);

  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  const handleUploadForm = () => {
    navigate(`/upload/form`);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleUserProfileEdit = () => {
    navigate(`user/edit`);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleNavClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  return (
    <>
      <div
        className={`sidemenu ${collapsed ? "sidemenu-collapsed" : ""} ${
          isMobile && isOpen ? "sidemenu-mobile-open" : ""
        }`}
      >
        <div className="sidemenu-header">
          <div className="sidemenu-user">
            <div className="sidemenu-avatar">
              <img
                src={user?.profileImage || "/images/user-image.png"}
                alt="User avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/user-image.png";
                }}
              />
            </div>
            {(!collapsed || isMobile) && (
              <>
                <div className="sidemenu-user-info">
                  {isLoggedIn ? (
                    <>
                      <h3>{user?.username || "User"}</h3>
                      <p>{user?.role || "Student"}</p>
                    </>
                  ) : (
                    <>
                      <h3>Guest User</h3>
                      <p>Not logged in</p>
                    </>
                  )}
                </div>
                <div className="edit-user" onClick={handleUserProfileEdit}>
                  <img src="/images/edit_profile.png" alt="edit-profile" />
                </div>
              </>
            )}
          </div>

          {(!collapsed || isMobile) && isLoggedIn && isTeacher && (
            <div className="sidemenu-stats">
              <div className="stat-item">
                <span className="stat-number">{user.followers || 0}</span>
                <span className="stat-label">followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{user.likesCount || 0}</span>
                <span className="stat-label">likes</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{user.uploads || 0}</span>
                <span className="stat-label">uploads</span>
              </div>
            </div>
          )}

          {(!collapsed || isMobile) && isLoggedIn && isTeacher && (
            <button className="contribute-btn" onClick={handleUploadForm}>
              + Upload
            </button>
          )}
        </div>

        <div className="sidemenu-content">
          <ul className="sidemenu-nav">
            <li className="sidemenu-nav-item">
              <Link
                to="/"
                className="sidemenu-nav-link"
                onClick={handleNavClick}
              >
                <i className="icon-home">🏠</i>
                {(!collapsed || isMobile) && (
                  <span className="nav-text">Home</span>
                )}
              </Link>
            </li>
            <li className="sidemenu-nav-item">
              <Link
                to="/ai-assistant"
                className="sidemenu-nav-link"
                onClick={handleNavClick}
              >
                <i className="icon-chats">🤖</i>
                {(!collapsed || isMobile) && (
                  <span className="nav-text">AI</span>
                )}
              </Link>
            </li>
            <li className="sidemenu-nav-item">
              <Link
                to="/Bookmarks"
                className="sidemenu-nav-link"
                onClick={handleNavClick}
              >
                <i className="icon-library">📚</i>
                {(!collapsed || isMobile) && (
                  <span className="nav-text">Bookmarks</span>
                )}
              </Link>
            </li>
            <li className="sidemenu-nav-item">
              <Link
                to="/books"
                className="sidemenu-nav-link"
                onClick={handleNavClick}
              >
                <i className="icon-books">📖</i>
                {(!collapsed || isMobile) && (
                  <span className="nav-text">Books</span>
                )}
              </Link>
            </li>
          </ul>
          <img
            className="under-construction"
            src="/images/under_construction1.png"
            alt="UC"
          />
        </div>

        {!isMobile && (
          <button className="sidemenu-toggle" onClick={toggleSidebar}>
            {collapsed ? "➡️" : "⬅️"}
          </button>
        )}
      </div>

      {isMobile &&
        isOpen &&
        createPortal(
          <div
            className="sidemenu-overlay"
            onClick={() => setIsOpen(false)}
          ></div>,
          document.body
        )}
    </>
  );
};
