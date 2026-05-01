import Modal from "react-modal";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../store/Auth";

Modal.setAppElement("#root");

const LogInModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordSubmitting, setForgotPasswordSubmitting] =
    useState(false);

  const navigate = useNavigate();

  const { storeTokenToLocalStrorage, API } = useAuth();

  // Form validation checks
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = () => {
    return formData.password.length >= 6;
  };

  const isFormValid = isEmailValid(formData.email) && isPasswordValid();

  // styles for the modal
  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "32px",
      padding: "32px",
      maxWidth: "460px",
      width: "90%",
      maxHeight: "80vh",
      border: "none",
      backgroundColor: "#fff",
      overflow: "auto",
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
            res_data.extraDetails ? res_data.extraDetails : res_data.message,
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

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!isEmailValid(forgotPasswordEmail)) {
      toast.error("Please enter a valid email");
      return;
    }

    setForgotPasswordSubmitting(true);

    try {
      const response = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset link sent to your email!");
        setForgotPasswordEmail("");
        setShowForgotPassword(false);
      } else {
        toast.error(data.message || "Failed to send password reset email");
      }
    } catch (error) {
      console.error("Error sending password reset:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setForgotPasswordSubmitting(false);
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

        {showForgotPassword ? (
          <div className="verification-reminder">
            <h3>Reset Password</h3>
            <p>Enter your email address to receive a password reset link.</p>

            <form onSubmit={handleForgotPassword} style={{ marginTop: "20px" }}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                {forgotPasswordEmail && !isEmailValid(forgotPasswordEmail) && (
                  <small style={{ color: "red" }}>
                    Please enter a valid email
                  </small>
                )}
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={
                  forgotPasswordSubmitting || !isEmailValid(forgotPasswordEmail)
                }
              >
                {forgotPasswordSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <button
              className="back-to-login-button"
              onClick={() => setShowForgotPassword(false)}
              style={{ marginTop: "10px" }}
            >
              Back to Login
            </button>
          </div>
        ) : showResendVerification ? (
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
                  placeholder="Enter your email"
                  required
                />
                {formData.email && !isEmailValid(formData.email) && (
                  <small style={{ color: "red" }}>
                    Please enter a valid email
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password (min 6 characters)"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {formData.password && !isPasswordValid() && (
                  <small style={{ color: "red" }}>
                    Password must be at least 6 characters
                  </small>
                )}
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? "Login In..." : "Login"}
              </button>

              <div style={{ textAlign: "center", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#22b1ee",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: "14px",
                  }}
                >
                  Forgot Password?
                </button>
              </div>
            </form>

            <div className="modal-note">
              <p>
                <strong>Note for Teachers:</strong> Please login with your
                college email ID (ftccoe.ac.in domain) to gain teacher access.
              </p>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default LogInModal;
