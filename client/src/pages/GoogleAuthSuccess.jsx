import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../store/Auth";
import { toast } from "react-toastify";

const GoogleAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { storeTokenToLocalStrorage } = useAuth();

  useEffect(() => {
    const handleGoogleAuthSuccess = async () => {
      if (token) {
        // Store the token
        storeTokenToLocalStrorage(token);

        // Show success message
        toast.success("Successfully logged in with Google!");

        // Redirect to home page
        navigate("/");
      } else {
        // Handle error
        toast.error("Google authentication failed");
        navigate("/login");
      }
    };

    handleGoogleAuthSuccess();
  }, [token, storeTokenToLocalStrorage, navigate]);

  return (
    <div className="google-auth-success">
      <div className="loading-spinner"></div>
      <p>Completing your Google sign-in...</p>
    </div>
  );
};

export default GoogleAuthSuccess;
