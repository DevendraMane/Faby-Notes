import Feedback from "../models/feedback-model.js";
import User from "../models/user-model.js";

// ****** FEEDBACK CONTROLLER ****** //
export const feedback = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.body.message || req.body.message.trim() === "") {
      return res.status(400).json({ message: "Feedback message is required" });
    }

    const feedbackData = {
      username: user.username,
      email: user.email,
      message: req.body.message,
      role: user.role || "student",
      emailVerified: user.emailVerified,
      authProvider: user.authProvider,
    };

    await Feedback.create(feedbackData);
    return res.status(200).json({ message: "Feedback sent successfully 😄" });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// ------ FEEDBACK CONTROLLER ------ //
