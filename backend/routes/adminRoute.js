import express from "express";

import {
    adminLogin,
    getDashboardData
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);

adminRouter.get("/dashboard", getDashboardData);

export default adminRouter;