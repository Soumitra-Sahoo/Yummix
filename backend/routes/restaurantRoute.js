import express from "express";
import upload from "../config/cloudinary.js";
import adminAuth from "../middleware/adminAuth.js";
import restaurantAuth from "../middleware/restaurantAuth.js";
import {
  registerRestaurant,
  loginRestaurant,
  getPendingRestaurants,
  approveRestaurant,
  getRestaurantProfile,
  updateRestaurantProfile,
  listRestaurants
} from "../controllers/restaurantController.js";

const restaurantRouter = express.Router();

const uploadMiddleware = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    next();
  });
};

restaurantRouter.post("/register", uploadMiddleware, registerRestaurant);
restaurantRouter.post("/login", loginRestaurant);
restaurantRouter.get("/pending", adminAuth, getPendingRestaurants);
restaurantRouter.post("/approve", adminAuth, approveRestaurant);
restaurantRouter.get("/list", listRestaurants);
restaurantRouter.get("/profile", restaurantAuth, getRestaurantProfile);
restaurantRouter.post("/profile/update", restaurantAuth, updateRestaurantProfile);

export default restaurantRouter;
