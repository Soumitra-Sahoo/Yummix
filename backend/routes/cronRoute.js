import express from "express";
import { runAssignmentSweep } from "../controllers/cronController.js";

const cronRouter = express.Router();
cronRouter.get("/process-assignments", runAssignmentSweep);
export default cronRouter;