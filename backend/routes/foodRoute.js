import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  addFood,
  listFood,
  removeFood,
  restaurantFoods,
  updateFood,
  getRestaurantFoods
} from "../controllers/foodController.js";
import upload from "../config/cloudinary.js";
import restaurantAuth from "../middleware/restaurantAuth.js";

const foodRouter = express.Router();

foodRouter.get("/list", listFood);
const uploadMiddleware = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Upload Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
    next();
  });
};

foodRouter.post("/add", restaurantAuth, uploadMiddleware, addFood);
foodRouter.post("/remove", restaurantAuth, removeFood);
foodRouter.get("/restaurant-foods", restaurantAuth, restaurantFoods);
foodRouter.post("/update", restaurantAuth, updateFood);
foodRouter.get("/restaurant/:restaurantId", getRestaurantFoods);

export default foodRouter;
