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

  const { isLoggedIn, logoutUser } = useAuth();

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
    // If the user is on the feedback page AND the feedback modal is not already open, then open it.
    if (location.pathname === "/feedback" && !isFeedBackModalOpen) {
      // Check if user is logged in before opening feedback modal
      if (isLoggedIn) {
        setTimeout(() => {
          setIsFeedBackModalOpen(true);
        }, 0);
      } else {
        // Redirect to login if trying to access feedback without being logged in
        toast.error("Please log in to submit feedback");
        setTimeout(() => {
          navigate("/login");
        }, 0);
      }
    } else if (location.pathname !== "/feedback" && isFeedBackModalOpen) {
      setIsFeedBackModalOpen(false);
    }

    // Handle registration route
    if (location.pathname === "/register" && !isRegistrationModalOpen) {
      // Only show registration if not logged in
      if (!isLoggedIn) {
        setTimeout(() => {
          setIsRegistrationModalOpen(true);
        }, 0);
      } else {
        // Redirect to home if already logged in
        navigate("/home");
      }
    } else if (location.pathname !== "/register" && isRegistrationModalOpen) {
      setIsRegistrationModalOpen(false);
    }

    // Handle login route
    if (location.pathname === "/login" && !isLogInModalOpen) {
      // Only show login if not logged in
      if (!isLoggedIn) {
        setTimeout(() => {
          setIsLogInModalOpen(true);
        }, 0);
      } else {
        // Redirect to home if already logged in
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

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

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
    <header>
      <div>
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

        <SearchBar />
        <nav className={mobileMenuOpen ? "mobile-open" : ""}>
          <ul>
            {/* Always show Feedback button, but it will check auth status when clicked */}
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
              <>
                <li>
                  <button className="logout-btn" onClick={logoutUser}>
                    Logout
                  </button>
                </li>
              </>
            )}

            {/* Conditionally render auth buttons based on login status */}
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
          </ul>
        </nav>
      </div>

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
