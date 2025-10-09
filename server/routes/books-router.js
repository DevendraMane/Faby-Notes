import express from "express";
import booksController from "../controllers/books-controller.js";
export const booksRouter = express.Router();

booksRouter.route(`/:streamName`).get(booksController.getBooks);
