import express from "express";
import bookmarkController from "../controllers/bookmark-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
export const bookMarkRouter = express.Router();

bookMarkRouter
  .route("/:noteId")
  .post(authMiddleware, bookmarkController.saveBookmark);
bookMarkRouter
  .route(`/user-bookmarks`)
  .get(authMiddleware, bookmarkController.getBookmarks);
bookMarkRouter
  .route(`/user-bookmarks/remove-selected`)
  .delete(authMiddleware, bookmarkController.deleteBookmarks);
bookMarkRouter
  .route("/:noteId")
  .delete(authMiddleware, bookmarkController.deleteBookmark);
