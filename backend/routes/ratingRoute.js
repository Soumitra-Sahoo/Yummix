import express from "express";
import authMiddleware from "../middleware/auth.js";
import { submitRating, getOrderRatings } from "../controllers/ratingController.js";

const ratingRouter = express.Router();

ratingRouter.post("/submit", authMiddleware, submitRating);
ratingRouter.post("/order/:orderId", authMiddleware, getOrderRatings);

export default ratingRouter;