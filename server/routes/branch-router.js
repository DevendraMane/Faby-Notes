import express from "express";
export const branchRouter = express.Router();

import branchControllers from "../controllers/branch-controller.js";

branchRouter.route("/").get(branchControllers.getAllBranches);

branchRouter
  .route("/stream-name/:streamName")
  .get(branchControllers.getBranchesByStreamName);

branchRouter.route("/slug/:slug").get(branchControllers.getBranchBySlug);
