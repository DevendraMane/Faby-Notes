import Modal from "react-modal";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/Auth";
import toast from "react-hot-toast";

Modal.setAppElement("#root");

const RegistrationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    cnfpassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const { storeTokenToLocalStrorage, API } = useAuth();

  // Form validation checks
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isUsernameValid = () => {
    return formData.username.length >= 3 && formData.username.length <= 50;
  };

  const isPasswordValid = () => {
    return formData.password.length >= 6;
  };

  const doPasswordsMatch = () => {
    return (
      formData.password === formData.cnfpassword && formData.password.length > 0
    );
  };

  const isFormValid =
    isUsernameValid() &&
    isEmailValid(formData.email) &&
    isPasswordValid() &&
    doPasswordsMatch();

  // Reset form data when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        username: "",
        email: "",
        password: "",
        cnfpassword: "",
      });
    }
  }, [isOpen]);

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
      maxHeight: "85vh",
      border: "none",
      backgroundColor: "#fff",
      overflow: "auto",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      zIndex: 1000,
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const res_data = await response.json();

      //? for cleaning the form after successfully posting the data
      if (response.ok) {
        // ***** FOR STORING TOKEN TO LOCAL STORAGE ***** //

        // ?function for storing data to local storage
        storeTokenToLocalStrorage(res_data.token);

        toast.success(`Verification email sent ✅`);

        setFormData({
          username: "",
          email: "",
          password: "",
          cnfpassword: "",
        });
      } else {
        // ?we are getting these errors from the error-middleware.js of server(Zod)
        toast.error(
          res_data.extraDetails ? res_data.extraDetails : res_data.message,
        );

        // alert("not valid registration");
      }
    } catch (error) {
      console.log(error);
    }
    // ?for Navigating the user to the page that you want
    navigate("/");
    // Close the modal after submission
    handleCloseModal();
  };

  const handleGoogleSignUp = () => {
    // Redirect to the Google OAuth route
    window.location.href = `${API}/api/auth/google`;
  };

  // Handle closing with a clean approach
  const handleCloseModal = () => {
    // Ensure we're calling onClose properly
    if (typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      style={customModalStyles}
      contentLabel="Sign Up Modal"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      shouldReturnFocusAfterClose={true}
      shouldFocusAfterRender={true}
      preventScroll={true}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2>Sign Up</h2>
          <button className="close-button" onClick={handleCloseModal}>
            ×
          </button>
        </div>

        <div className="google-signup" onClick={handleGoogleSignUp}>
          <img src="/images/google.png" alt="Google" />
          <span>Sign up with Google</span>
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        <form className="registration-form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="username">Your Name</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your name (3-50 characters)"
              required
            />
            {formData.username && !isUsernameValid() && (
              <small style={{ color: "red" }}>
                Username must be 3-50 characters long
              </small>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
            {formData.email && !isEmailValid(formData.email) && (
              <small style={{ color: "red" }}>Please enter a valid email</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password (min 6 characters)"
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

          <div className="form-group">
            <label htmlFor="cnfpassword">Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="cnfpassword"
                name="cnfpassword"
                value={formData.cnfpassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formData.cnfpassword && !doPasswordsMatch() && (
              <small style={{ color: "red" }}>Passwords do not match</small>
            )}
          </div>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        <div className="modal-note">
          <p>
            <strong>Note for Teachers:</strong> Please register with your
            college email ID (ftccoe.ac.in domain) to gain teacher access.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default RegistrationModal;
