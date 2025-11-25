import express from "express";
import {
  detectIntent,
  getPredefinedQuestions,
} from "../controllers/dialogflow-controller.js";

const router = express.Router();

router.post("/chat", detectIntent);

router.get("/questions", getPredefinedQuestions);

export { router as dialogflowRouter };
