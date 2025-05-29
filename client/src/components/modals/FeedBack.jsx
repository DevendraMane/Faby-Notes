import Modal from "react-modal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/Auth";
import { toast } from "react-toastify";

// Set the app element for accessibility
Modal.setAppElement("#root");

const FeedBackModal = ({ isOpen, onClose }) => {
  const { user, isLoggedIn, API, authorizationToken } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!isLoggedIn) {
      toast.error("Please log in to submit feedback");
      onClose();
      navigate("/login");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("Please enter your feedback message");
      return;
    }

    setIsSubmitting(true);

    try {
      // Only send the message - the server will get user data from the token
      const feedbackData = {
        message: formData.message,
      };

      const response = await fetch(`${API}/api/form/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify(feedbackData),
      });

      // Check if response is OK before trying to parse JSON
      if (response.ok) {
        const data = await response.json();
        toast.success("Feedback submitted successfully!");
        setFormData({ message: "" });
        onClose();
        navigate("/home");
      } else {
        // Handle non-JSON responses
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          toast.error(errorData.message || "Failed to submit feedback");
        } else {
          // Handle HTML or other non-JSON responses
          toast.error(
            `Server error: ${response.status} ${response.statusText}`
          );
        }
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customModalStyles}
      contentLabel="Feedback Modal"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2>Submit Feedback</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="feedback-form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="message">Your Feedback</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              placeholder="Please share your thoughts, suggestions, or report any issues..."
              required
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default FeedBackModal;
