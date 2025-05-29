import express from "express";
export const branchRouter = express.Router();

import branchControllers from "../controllers/branch-controller.js";

// Get all branches
branchRouter.route("/").get(branchControllers.getAllBranches);

// !No need for this code:
// Get branches by stream ID
// branchRouter
//   .route("/stream/:streamId")
//   .get(branchControllers.getBranchesByStream);

// Get branches by stream name
branchRouter
  .route("/stream-name/:streamName")
  .get(branchControllers.getBranchesByStreamName);

// Get branch by slug
branchRouter.route("/slug/:slug").get(branchControllers.getBranchBySlug);
