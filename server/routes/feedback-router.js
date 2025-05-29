import express from "express";
import { feedback } from "../controllers/feedback-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const feedbackRouter = express.Router();

// ******  FEEDBACK ROUTE  ****** //
// Protect the feedback route with auth middleware
feedbackRouter.route("/feedback").post(authMiddleware, feedback);
// ------  FEEDBACK ROUTE  ------ //

export default feedbackRouter;
