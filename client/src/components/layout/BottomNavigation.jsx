"use client";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../store/Auth";

const BottomNavigation = () => {
  const location = useLocation();
  const { user, isLoggedIn } = useAuth();

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: "🏠",
      path: "/",
    },
    {
      id: "ai",
      label: "Ask AI",
      icon: "🤖",
      path: "/ai-assistant",
    },
    {
      id: "bookmarks",
      label: "Bookmarks",
      icon: "📚",
      path: "/user/bookmarks",
    },
    // {
    //   id: "books",
    //   label: "Books",
    //   icon: "📖",
    //   path: "/books",
    // },
    {
      id: "profile",
      label: "Profile",
      icon: isLoggedIn ? (
        <img
          src={user?.profileImage || "/images/user-image.png"}
          alt="Profile"
          className="profile-nav-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/user-image.png";
          }}
        />
      ) : (
        "👤"
      ),
      path: isLoggedIn ? "user/edit" : "/login",
    },
  ];

  return (
    <nav className="bottom-navigation">
      {navItems.map((item) => (
        <Link
          key={item.id}
          to={item.path}
          className={`bottom-nav-item ${
            location.pathname === item.path ? "active" : ""
          }`}
        >
          <div className="bottom-nav-icon">
            {typeof item.icon === "string" ? item.icon : item.icon}
          </div>
          <span className="bottom-nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNavigation;
