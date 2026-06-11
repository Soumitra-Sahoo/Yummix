import express from "express";
import {adminLogin, getDashboardData, getRestaurantDashboard} from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";
import restaurantAuth from "../middleware/restaurantAuth.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/dashboard", adminAuth, getDashboardData);
adminRouter.get("/restaurant-dashboard",  restaurantAuth, getRestaurantDashboard);

export default adminRouter;