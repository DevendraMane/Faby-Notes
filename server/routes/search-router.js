import express from "express";
import { searchNotes } from "../controllers/search-controller.js";

const notesSearchRouter = express.Router();

// Route to handle chat messages
notesSearchRouter.get("/notes", searchNotes);

export default notesSearchRouter;
