"use client";

import { useState, useEffect } from "react";
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

  const { isLoggedIn, logoutUser } = useAuth();

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
        navigate("/home");
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
        navigate("/home");
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
    // Trigger sidebar toggle
    const event = new CustomEvent("toggleSidebar");
    document.dispatchEvent(event);
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
        navigate("/home");
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
        navigate("/home");
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
        navigate("/home");
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
          <div className="hamburger" onClick={toggleMobileMenu}>
            <img src="/images/hamburger.png" alt="Menu" />
          </div>

          <div className="logo">
            <img src="/images/faby-logo.png" alt="FN" />
          </div>

          <div className="brand-name">
            <NavLink className="nav-link" to="/home">
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
