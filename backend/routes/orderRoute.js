import express from 'express';
import adminAuth from "../middleware/adminAuth.js";
import authMiddleware from '../middleware/auth.js';
import { listOrders,validateCoupon, placeOrder,updateStatus,userOrders, verifyOrder , restaurantOrders, updateRestaurantOrderStatus} from '../controllers/orderController.js';
import restaurantAuth from "../middleware/restaurantAuth.js";

const orderRouter = express.Router();

orderRouter.get("/list",adminAuth,listOrders);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/status",adminAuth,updateStatus);
orderRouter.post("/validate-coupon", authMiddleware, validateCoupon);
orderRouter.post("/verify",verifyOrder);
orderRouter.get("/restaurant-orders",restaurantAuth,restaurantOrders);
orderRouter.post("/restaurant-status", restaurantAuth, updateRestaurantOrderStatus);

export default orderRouter;