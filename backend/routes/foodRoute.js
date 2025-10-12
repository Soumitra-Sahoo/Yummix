import express from 'express';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';
import upload from '../config/cloudinary.js';

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

foodRouter.post("/add", uploadMiddleware, addFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;