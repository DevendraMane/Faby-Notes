import express from "express";
import subjectsController from "../controllers/subjects-controller.js";
// import { authMiddleware } from "../middleware/auth-middleware.js";

export const subjectsRouter = express.Router();

subjectsRouter.route("/").get(subjectsController.getAllSubjectsData);
subjectsRouter.route("/:_id").put(subjectsController.updateSubject);
subjectsRouter
  .route("/:slug/:semesterNumber")
  .post(subjectsController.addSubject);
