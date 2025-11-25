import Modal from "react-modal";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/Auth";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const RegistrationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    cnfpassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const { storeTokenToLocalStrorage, API } = useAuth();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    console.log(formData);
    // *or from here you can send data to the DB

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log("signUp Response❔:", response);

      const res_data = await response.json();
      console.log("response from server", res_data.message);

      //? for cleaning the form after successfully posting the data
      if (response.ok) {
        // ***** FOR STORING TOKEN TO LOCAL STORAGE ***** //

        // ?function for storing data to local storage
        storeTokenToLocalStrorage(res_data.token);

        toast(`varification email sent ✅`);

        setFormData({
          username: "",
          email: "",
          password: "",
          cnfpassword: "",
        });
      } else {
        // ?we are getting these errors from the error-middleware.js of server(Zod)
        toast.error(
          res_data.extraDetails ? res_data.extraDetails : res_data.message
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
              type="username"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cnfpassword">Confirm Password</label>
            <input
              type="password"
              id="cnfpassword"
              name="cnfpassword"
              value={formData.cnfpassword}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default RegistrationModal;
