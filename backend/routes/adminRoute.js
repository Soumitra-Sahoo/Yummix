import express from "express";
import {adminLogin, getDashboardData, getRestaurantDashboard,  getRefundAlerts,  resolveRefundAlert, retryRiderAssignment, adminCancelOrder} from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";
import restaurantAuth from "../middleware/restaurantAuth.js";

const adminRouter = express.Router();

adminRouter.get("/dashboard", adminAuth, getDashboardData);
adminRouter.get("/restaurant-dashboard",  restaurantAuth, getRestaurantDashboard);
adminRouter.get("/refund-alerts", adminAuth, getRefundAlerts);
adminRouter.post("/login", adminLogin);
adminRouter.post("/refund-alerts/resolve", adminAuth, resolveRefundAlert)
adminRouter.post("/retry-assignment", adminAuth, retryRiderAssignment);
adminRouter.post("/cancel-order", adminAuth, adminCancelOrder);;

export default adminRouter;