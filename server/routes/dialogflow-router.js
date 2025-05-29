import express from "express";
import {
  detectIntent,
  getPredefinedQuestions,
} from "../controllers/dialogflow-controller.js";

const router = express.Router();

// Route to handle chat messages
router.post("/chat", detectIntent);

// Route to get predefined questions
router.get("/questions", getPredefinedQuestions);

export { router as dialogflowRouter };
