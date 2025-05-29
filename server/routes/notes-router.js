import express from "express";
import notesController from "../controllers/notes-controller.js";
export const notesRouter = express.Router();

notesRouter.route("/code/:subjectCode").get(notesController.getNotes);
