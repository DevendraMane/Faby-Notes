"use client";

import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import RegistrationModal from "../modals/RegistrationModal";
import LoginModal from "../modals/LoginModal";
import FeedBackModal from "../modals/FeedBack";
import { useAuth } from "../../store/Auth";
import { toast } from "react-toastify";
import SearchBar from "../ui/SearchBar";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isLogInModalOpen, setIsLogInModalOpen] = useState(false);
  const [isFeedBackModalOpen, setIsFeedBackModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);
  const { isLoggedIn, logoutUser, user } = useAuth();

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Listen for custom event to open login modal
  useEffect(() => {
    const handleOpenLoginModal = () => {
      setIsLogInModalOpen(true);
      navigate("/login");
    };

    document.addEventListener("open-login-modal", handleOpenLoginModal);
    return () => {
      document.removeEventListener("open-login-modal", handleOpenLoginModal);
    };
  }, [navigate]);

  // Check route and open appropriate modal
  useEffect(() => {
    if (location.pathname === "/feedback" && !isFeedBackModalOpen) {
      if (isLoggedIn) {
        setTimeout(() => {
          setIsFeedBackModalOpen(true);
        }, 0);
      } else {
        toast.error("Please log in to submit feedback");
        setTimeout(() => {
          navigate("/login");
        }, 0);
      }
    } else if (location.pathname !== "/feedback" && isFeedBackModalOpen) {
      setIsFeedBackModalOpen(false);
    }

    if (location.pathname === "/register" && !isRegistrationModalOpen) {
      if (!isLoggedIn) {
        setTimeout(() => {
          setIsRegistrationModalOpen(true);
        }, 0);
      } else {
        navigate("/");
      }
    } else if (location.pathname !== "/register" && isRegistrationModalOpen) {
      setIsRegistrationModalOpen(false);
    }

    if (location.pathname === "/login" && !isLogInModalOpen) {
      if (!isLoggedIn) {
        setTimeout(() => {
          setIsLogInModalOpen(true);
        }, 0);
      } else {
        navigate("/");
      }
    } else if (location.pathname !== "/login" && isLogInModalOpen) {
      setIsLogInModalOpen(false);
    }
  }, [
    location.pathname,
    isFeedBackModalOpen,
    isRegistrationModalOpen,
    isLogInModalOpen,
    isLoggedIn,
    navigate,
  ]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  const handleMenuItemClick = (action) => {
    setMobileMenuOpen(false);
    action();
  };

  // Modal functions for Registration
  const openRegistrationModal = () => {
    setIsRegistrationModalOpen(true);
    setTimeout(() => {
      navigate("/register");
    }, 0);
  };

  const closeRegistrationModal = () => {
    setIsRegistrationModalOpen(false);
    setTimeout(() => {
      if (location.pathname === "/register") {
        navigate("/");
      }
    }, 0);
  };

  // Modal functions for Login
  const openLogInModal = () => {
    setIsLogInModalOpen(true);
    setTimeout(() => {
      navigate("/login");
    }, 0);
  };

  const closeLogInModal = () => {
    setIsLogInModalOpen(false);
    setTimeout(() => {
      if (location.pathname === "/login") {
        navigate("/");
      }
    }, 0);
  };

  // Modal functions for Feedback
  const openFeedBackModal = () => {
    if (!isLoggedIn) {
      toast.error("Please log in to submit feedback");
      openLogInModal();
      return;
    }

    setIsFeedBackModalOpen(true);
    setTimeout(() => {
      navigate("/feedback");
    }, 0);
  };

  const closeFeedBackModal = () => {
    setIsFeedBackModalOpen(false);
    setTimeout(() => {
      if (location.pathname === "/feedback") {
        navigate("/");
      }
    }, 0);
  };

  const handleAiAssistant = () => {
    navigate(`/ai-assistant`);
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="header-left">
          {isMobile && (
            <div className="mobile-menu-container" ref={dropdownRef}>
              <div className="hamburger" onClick={toggleMobileMenu}>
                <img src="/images/hamburger.png" alt="Menu" />
              </div>

              {mobileMenuOpen && (
                <div className="mobile-dropdown-menu">
                  {isLoggedIn && isTeacher && (
                    <button
                      className="mobile-menu-item"
                      onClick={() =>
                        handleMenuItemClick(() => navigate("/upload/form"))
                      }
                    >
                      + Upload
                    </button>
                  )}
                  <button
                    className="mobile-menu-item"
                    onClick={() => handleMenuItemClick(openFeedBackModal)}
                  >
                    Feedback
                  </button>

                  {!isLoggedIn ? (
                    <>
                      <button
                        className="mobile-menu-item"
                        onClick={() =>
                          handleMenuItemClick(openRegistrationModal)
                        }
                      >
                        Register
                      </button>
                      <button
                        className="mobile-menu-item"
                        onClick={() => handleMenuItemClick(openLogInModal)}
                      >
                        Log In
                      </button>
                    </>
                  ) : (
                    <button
                      className="mobile-menu-item logout"
                      onClick={() => handleMenuItemClick(logoutUser)}
                    >
                      Logout
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {!isMobile && (
            <div className="hamburger" onClick={toggleMobileMenu}>
              <img src="/images/hamburger.png" alt="Menu" />
            </div>
          )}

          <div className="logo">
            <img src="/images/faby-logo.png" alt="FN" />
          </div>

          <div className="brand-name">
            <NavLink className="nav-link" to="/">
              Faby Notes
            </NavLink>
          </div>
        </div>

        {!isMobile && <SearchBar />}

        <nav className={`header-nav ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <ul>
            {!isMobile && (
              <>
                <li>
                  <button className="nav-button" onClick={openFeedBackModal}>
                    Feedback
                  </button>
                </li>
                <li>
                  <button className="nav-button" onClick={handleAiAssistant}>
                    AI Assistant
                  </button>
                </li>

                {isLoggedIn && (
                  <li>
                    <button className="logout-btn" onClick={logoutUser}>
                      Logout
                    </button>
                  </li>
                )}

                {!isLoggedIn && (
                  <>
                    <li>
                      <button
                        className="nav-button"
                        onClick={openRegistrationModal}
                      >
                        Register
                      </button>
                    </li>
                    <li>
                      <button className="nav-button" onClick={openLogInModal}>
                        Log In
                      </button>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </nav>
      </div>

      {isMobile && (
        <div className="mobile-search-container">
          <SearchBar />
        </div>
      )}

      {/* Pass Modal State and Handlers as Props */}
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={closeRegistrationModal}
      />

      <LoginModal isOpen={isLogInModalOpen} onClose={closeLogInModal} />

      <FeedBackModal
        isOpen={isFeedBackModalOpen}
        onClose={closeFeedBackModal}
      />
    </header>
  );
};
