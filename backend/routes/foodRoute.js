import express from 'express';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';
import upload from '../config/cloudinary.js';

const foodRouter = express.Router();

foodRouter.get("/list", listFood);
foodRouter.post(
  "/add",
  (req, res, next) => {
    console.log("Incoming /add request body:", req.body);
    next();
  },
  upload.single('image'),
  (req, res, next) => {
    console.log("Uploaded image file:", req.file);
    next();
  },
  addFood
);
foodRouter.post("/remove", removeFood);

export default foodRouter;