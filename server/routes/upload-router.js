import express from "express";
import uploadController from "../controllers/upload-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

export const uploadRouter = express.Router();

// here upload is a multer middleware
uploadRouter
  .route("/form")
  .post(
    authMiddleware,
    uploadController.upload.single("file"),
    uploadController.saveUploads
  );
