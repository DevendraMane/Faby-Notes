import express from "express";
import subjectsController from "../controllers/subjects-controller.js";
export const subjectsRouter = express.Router();

subjectsRouter.route("/").get(subjectsController.getAllSubjectsData);
