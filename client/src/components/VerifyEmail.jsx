import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../store/Auth";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const { API } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus("invalid");
        return;
      }

      try {
        const response = await fetch(`${API}/api/auth/verify-email/${token}`);
        const data = await response.json();

        if (response.ok) {
          setVerificationStatus("success");
          toast.success("Email verified successfully!");
        } else {
          setVerificationStatus("failed");
          toast.error(data.message || "Verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setVerificationStatus("error");
        toast.error("An error occurred during verification");
      }
    };

    verifyEmail();
  }, [token, API]);

  const handleGoToLogin = () => {
    navigate("/login");
    // Assuming you have a function to open the login modal
    // You might need to pass this through context or props
    // document.dispatchEvent(new CustomEvent("open-login-modal"));
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case "verifying":
        return (
          <div className="verification-loading">
            <div className="spinner"></div>
            <p>Verifying your email...</p>
          </div>
        );
      case "success":
        return (
          <div className="verification-success">
            <div className="success-icon">✓</div>
            <h2>Email Verified Successfully!</h2>
            <p>
              Your email has been verified. You can now log in to your account.
            </p>
            <button onClick={handleGoToLogin} className="login-button">
              Log In
            </button>
          </div>
        );
      case "failed":
        return (
          <div className="verification-failed">
            <div className="failed-icon">✗</div>
            <h2>Verification Failed</h2>
            <p>The verification link is invalid or has expired.</p>
            <button
              onClick={handleResendVerification}
              className="resend-button"
            >
              Resend Verification Email
            </button>
          </div>
        );
      case "invalid":
        return (
          <div className="verification-invalid">
            <div className="failed-icon">!</div>
            <h2>Invalid Request</h2>
            <p>The verification link is missing or invalid.</p>
            <Link to="/" className="home-button">
              Go to Home
            </Link>
          </div>
        );
      case "error":
        return (
          <div className="verification-error">
            <div className="failed-icon">!</div>
            <h2>Something Went Wrong</h2>
            <p>
              An error occurred during verification. Please try again later.
            </p>
            <Link to="/" className="home-button">
              Go to Home
            </Link>
          </div>
        );
      default:
        return null;
    }
  };

  const handleResendVerification = () => {
    // Open a modal or redirect to a page where they can enter their email
    navigate("/resend-verification");
  };

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">{renderContent()}</div>
    </div>
  );
};

export default VerifyEmail;
