import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import authMiddleware from "../middleware/auth.js";
import restaurantAuth from "../middleware/restaurantAuth.js";
import {
  placeOrder,
  placeOrderCOD,
  verifyOrder,
  listOrders,
  userOrders,
  updateStatus,
  restaurantOrders,
  updateRestaurantOrderStatus,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/place-cod", authMiddleware, placeOrderCOD);
orderRouter.post("/verify", verifyOrder);
orderRouter.get("/list", adminAuth, listOrders);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.get("/restaurant-orders", restaurantAuth, restaurantOrders);
orderRouter.post(
  "/restaurant-status",
  restaurantAuth,
  updateRestaurantOrderStatus,
);

export default orderRouter;
