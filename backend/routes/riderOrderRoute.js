import express from "express";
import riderAuth from "../middleware/riderAuth.js";
import {
  getAssignedOrder,
  acceptDelivery,
  rejectDelivery,
  updateDeliveryStatus,
  getDeliveryHistory,
  getPendingAssignment,
} from "../controllers/riderOrderController.js";

const riderOrderRouter = express.Router();

riderOrderRouter.get("/assigned", riderAuth, getAssignedOrder);
riderOrderRouter.get("/pending-assignment",riderAuth, getPendingAssignment);
riderOrderRouter.post("/accept", riderAuth, acceptDelivery);
riderOrderRouter.post("/reject", riderAuth, rejectDelivery);
riderOrderRouter.post("/update-status", riderAuth, updateDeliveryStatus);
riderOrderRouter.get("/history", riderAuth, getDeliveryHistory);

export default riderOrderRouter;