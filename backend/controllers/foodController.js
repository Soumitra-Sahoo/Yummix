import foodModel from "../models/foodModel.js";
import { v2 as cloudinary } from 'cloudinary';

// list all foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// add food
const addFood = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Image file is required" });

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.file.path,             
      imagePublicId: req.file.filename, 
    });

    await food.save();
    res.status(200).json({ success: true, message: "Food added successfully", data: food });
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

// remove food
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) return res.status(404).json({ success: false, message: "Food not found" });

    // Delete image from Cloudinary using stored public_id
    if (food.imagePublicId) {
      await cloudinary.uploader.destroy(food.imagePublicId);
    }

    await foodModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.error("Error removing food:", error);
    res.status(500).json({ success: false, message: "Error removing food" });
  }
};

export { listFood, addFood, removeFood };
