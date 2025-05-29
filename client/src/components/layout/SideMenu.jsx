import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../store/Auth";
import { Link, useNavigate } from "react-router-dom";

export const SideMenu = ({ onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, isLoggedIn } = useAuth();

  const navigate = useNavigate();

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

  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  const handleUploadForm = () => {
    navigate(`/upload/form`);
  };

  const handleUserProfileEdit = () => {
    navigate(`user/edit`);
  };

  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  return (
    <>
      <div className={`sidemenu ${collapsed ? "sidemenu-collapsed" : ""}`}>
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
            {!collapsed && (
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

          {!collapsed && isLoggedIn && isTeacher && (
            <div className="sidemenu-stats">
              <div className="stat-item">
                <span className="stat-number">{user.followers}</span>
                <span className="stat-label">followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{user.likesCount}</span>
                <span className="stat-label">likes</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{user.uploads}</span>
                <span className="stat-label">uploads</span>
              </div>
            </div>
          )}

          {!collapsed && isLoggedIn && isTeacher && (
            <button className="contribute-btn" onClick={handleUploadForm}>
              + Upload
            </button>
          )}
        </div>

        <div className="sidemenu-content">
          <ul className="sidemenu-nav">
            <li className="sidemenu-nav-item">
              <Link to="/home" className="sidemenu-nav-link">
                <i className="icon-home">🏠</i>
                {!collapsed && <span className="nav-text">Home</span>}
              </Link>
            </li>
            <li className="sidemenu-nav-item">
              <a href="#" className="sidemenu-nav-link">
                <i className="icon-chats">🤖</i>
                {!collapsed && <span className="nav-text">AI</span>}
              </a>
            </li>
            {/* <li className="sidemenu-nav-item">
              <a href="#" className="sidemenu-nav-link dropdown">
                <i className="icon-recent">🕒</i>
                {!collapsed && (
                  <>
                    <span className="nav-text">Recent</span>
                    <i className="icon-dropdown">▼</i>
                  </>
                )}
              </a>
            </li> */}
            <li className="sidemenu-nav-item">
              <a href="#" className="sidemenu-nav-link">
                <i className="icon-library">📚</i>
                {!collapsed && <span className="nav-text">Bookmarks</span>}
              </a>
            </li>
            {/* <li className="sidemenu-nav-item">
              <a href="#" className="sidemenu-nav-link dropdown">
                <i className="icon-courses">🧑🏽‍🏫</i>
                {!collapsed && (
                  <>
                    <span className="nav-text">Courses</span>
                    <i className="icon-dropdown">▼</i>
                  </>
                )}
              </a>
            </li> */}
            <li className="sidemenu-nav-item">
              <a href="#" className="sidemenu-nav-link dropdown">
                <i className="icon-books">📖</i>
                {!collapsed && (
                  <>
                    <span className="nav-text">Books</span>
                  </>
                )}
              </a>
            </li>
            {/* <li className="sidemenu-nav-item">
              <a href="#" className="sidemenu-nav-link dropdown">
                <i className="icon-studylists">📋</i>
                {!collapsed && (
                  <>
                    <span className="nav-text">Studylists</span>
                    <i className="icon-dropdown">▼</i>
                  </>
                )}
              </a>
            </li> */}
          </ul>
        </div>
        <button className="sidemenu-toggle" onClick={toggleSidebar}>
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {isMobile &&
        !collapsed &&
        createPortal(
          <div className="sidemenu-overlay" onClick={toggleSidebar}></div>,
          document.body
        )}
    </>
  );
};
