import express from "express";
import { submitFeedback, submitPartnerRequest } from "../controllers/feedbackController.js";

const feedbackRouter = express.Router();
feedbackRouter.post("/feedback", submitFeedback);
feedbackRouter.post("/partner", submitPartnerRequest);
export default feedbackRouter;