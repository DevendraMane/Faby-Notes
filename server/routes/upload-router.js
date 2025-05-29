import express from "express";
import uploadController from "../controllers/upload-controller.js";

export const uploadRouter = express.Router();

// here upload is a multer middleware
uploadRouter
  .route("/form")
  .post(uploadController.upload.single("file"), uploadController.saveUploads);
