import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../store/Auth";
import Loader from "../components/Loader";

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { API } = useAuth();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form validation checks
  const isPasswordValid = () => {
    return formData.newPassword.length >= 6;
  };

  const doPasswordsMatch = () => {
    return (
      formData.newPassword === formData.confirmPassword &&
      formData.newPassword.length > 0
    );
  };

  const isFormValid = isPasswordValid() && doPasswordsMatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please fill all fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.resetBox}>
        <h2 style={styles.title}>Reset Password</h2>
        <p style={styles.subtitle}>Enter your new password below</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>New Password</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password (min 6 characters)"
                required
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.toggleButton}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formData.newPassword && !isPasswordValid() && (
              <small style={styles.error}>
                Password must be at least 6 characters
              </small>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.toggleButton}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formData.confirmPassword && !doPasswordsMatch() && (
              <small style={styles.error}>Passwords do not match</small>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            style={{
              ...styles.submitButton,
              ...(isSubmitting || !isFormValid
                ? styles.submitButtonDisabled
                : {}),
            }}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p style={styles.backLink}>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            Back to Home
          </a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "var(--bg-color, #ffffff)",
    padding: "20px",
    marginTop: "60px",
  },
  resetBox: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "500px",
    width: "100%",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    textAlign: "center",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#333",
  },
  passwordWrapper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    overflow: "hidden",
  },
  input: {
    flex: 1,
    padding: "12px",
    border: "none",
    backgroundColor: "transparent",
    fontSize: "16px",
    outline: "none",
  },
  toggleButton: {
    background: "none",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    color: "#666",
    transition: "color 0.2s",
  },
  error: {
    fontSize: "12px",
    color: "red",
  },
  submitButton: {
    padding: "12px",
    backgroundColor: "#22b1ee",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    transition: "background-color 0.2s",
    marginTop: "10px",
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
    opacity: 0.6,
  },
  backLink: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
  },
  "backLink a": {
    color: "#22b1ee",
    textDecoration: "none",
    cursor: "pointer",
  },
};
