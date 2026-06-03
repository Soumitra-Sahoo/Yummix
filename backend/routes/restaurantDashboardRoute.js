import express from "express";
import restaurantAuth from "../middleware/restaurantAuth.js";

import restaurantDashboard from "../controllers/restaurantDashboardController.js";

const router = express.Router();

router.get(
  "/dashboard",
  restaurantAuth,
  restaurantDashboard
);

export default router;