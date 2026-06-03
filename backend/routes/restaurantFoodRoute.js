import express from "express";
import restaurantAuth from "../middleware/restaurantAuth.js";

import {
  getRestaurantFoods,
  deleteRestaurantFood,
} from "../controllers/restaurantFoodController.js";

const restaurantFoodRouter = express.Router();

restaurantFoodRouter.get(
  "/my-foods",
  restaurantAuth,
  getRestaurantFoods
);

restaurantFoodRouter.post(
  "/delete-food",
  restaurantAuth,
  deleteRestaurantFood
);

export default restaurantFoodRouter;