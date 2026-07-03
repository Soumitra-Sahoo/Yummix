import express from "express";
import riderAuth from "../middleware/riderAuth.js";
import { getRiderDashboard } from "../controllers/riderDashboardController.js";

const riderDashboardRouter = express.Router();

riderDashboardRouter.get("/", riderAuth, getRiderDashboard);

export default riderDashboardRouter;
