import express from "express";
export const streamRouter = express.Router();

import streamcontrollers from "../controllers/stream-controller.js";

// ******  STREAM ROUTE  ****** //
streamRouter.route("/").get(streamcontrollers.streams);
// ------  STREAM ROUTE  ------ //
