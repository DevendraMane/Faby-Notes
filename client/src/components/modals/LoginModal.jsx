import Modal from "react-modal";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import ResendVerification from "./ResendVerification";
import { useAuth } from "../../store/Auth";

// Set the app element for accessibility
Modal.setAppElement("#root");

const LogInModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");

  const navigate = useNavigate();

  const { storeTokenToLocalStrorage, API } = useAuth();

  // Custom styles for the modal
  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "16px",
      padding: "32px",
      maxWidth: "460px",
      width: "90%",
      border: "none",
      backgroundColor: "#fff",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      zIndex: 1000,
    },
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const res_data = await response.json();

      if (response.ok) {
        // Store token to local storage
        storeTokenToLocalStrorage(res_data.token);
        toast.success("Login successful ✅");
        setFormData({
          email: "",
          password: "",
        });
        navigate("/");
        onClose();
      } else {
        // Check if email is not verified
        if (res_data.emailVerified === false) {
          toast.error("Please verify your email before logging in");
          setUnverifiedEmail(formData.email);
          setShowResendVerification(true);
        } else {
          toast.error(
            res_data.extraDetails ? res_data.extraDetails : res_data.message
          );
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const handleGoogleSignUp = () => {
    // Redirect to the Google OAuth route
    window.location.href = `${API}/api/auth/google`;
  };

  const handleResendVerification = async () => {
    try {
      const response = await fetch(`${API}/api/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: unverifiedEmail || formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Verification email resent successfully!");
        setShowResendVerification(false);
      } else {
        toast.error(data.message || "Failed to resend verification email");
      }
    } catch (error) {
      console.error("Error resending verification:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customModalStyles}
      contentLabel="Log In Modal"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2>Log In</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {showResendVerification ? (
          <div className="verification-reminder">
            <h3>Email Verification Required</h3>
            <p>
              Your email address needs to be verified before you can log in.
              Please check your inbox for the verification email.
            </p>
            <p>
              If you haven't received the email, you can request a new one by
              clicking the button below.
            </p>
            <button
              className="resend-verification-button"
              onClick={handleResendVerification}
            >
              Resend Verification Email
            </button>
            <button
              className="back-to-login-button"
              onClick={() => setShowResendVerification(false)}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            <div className="google-signup" onClick={handleGoogleSignUp}>
              <img src="/images/google.png" alt="Google" />
              <span>Log In with Google</span>
            </div>

            <div className="divider">
              <span>OR</span>
            </div>

            <form className="registration-form" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Login In..." : "Login"}
              </button>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
};

export default LogInModal;
