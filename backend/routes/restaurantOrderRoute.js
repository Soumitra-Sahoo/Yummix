import express from "express";
import restaurantAuth from "../middleware/restaurantAuth.js";

import {
  getRestaurantOrders,
} from "../controllers/restaurantOrderController.js";

const restaurantOrderRouter = express.Router();

restaurantOrderRouter.get(
  "/my-orders",
  restaurantAuth,
  getRestaurantOrders
);

export default restaurantOrderRouter;