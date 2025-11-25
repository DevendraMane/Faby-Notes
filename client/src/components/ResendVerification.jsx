import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../store/Auth";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { API } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API}/api/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Verification email sent successfully!");
        setEmail("");
        // Redirect to home a time
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        toast.error(data.message || "Failed to send verification email");
      }
    } catch (error) {
      console.error("Error resending verification:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="resend-verification-container">
      <h2>Resend Verification Email</h2>
      <p>
        If you haven't received the verification email, you can request a new
        one by entering your email address below.
      </p>
      <form onSubmit={handleSubmit} className="resend-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email address"
          />
        </div>
        <button type="submit" className="resend-button" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Resend Verification Email"}
        </button>
      </form>
      <button className="back-button" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

export default ResendVerification;
