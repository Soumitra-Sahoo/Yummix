import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { submitFeedback, submitPartnerRequest, listSubmissions } from "../controllers/feedbackController.js";

const feedbackRouter = express.Router();
feedbackRouter.post("/feedback", submitFeedback);
feedbackRouter.post("/partner", submitPartnerRequest);
feedbackRouter.get("/list", adminAuth, listSubmissions);
export default feedbackRouter;