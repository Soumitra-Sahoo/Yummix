import foodModel from "../models/foodModel.js";
import { v2 as cloudinary } from "cloudinary";

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }
    if (!req.body.name || !req.body.description || !req.body.price || !req.body.category) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const food = new foodModel({
      restaurantId: req.restaurantId,
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
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

const updateFood = async (req, res) => {
  try {
    const food = await foodModel.findOne({ _id: req.body.id, restaurantId: req.restaurantId });
    if (!food) return res.json({ success: false, message: "Food not found" });

    food.name = req.body.name;
    food.description = req.body.description;
    food.price = Number(req.body.price);
    food.category = req.body.category;
    await food.save();

    res.json({ success: true, message: "Food Updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findOne({ _id: req.body.id, restaurantId: req.restaurantId });
    if (!food) return res.json({ success: false, message: "Food not found" });

    if (food.imagePublicId) await cloudinary.uploader.destroy(food.imagePublicId);
    await foodModel.findByIdAndDelete(food._id);

    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const restaurantFoods = async (req, res) => {
  try {
    const foods = await foodModel.find({ restaurantId: req.restaurantId });
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const getRestaurantFoods = async (req, res) => {
  try {
    const foods = await foodModel
      .find({ restaurantId: req.params.restaurantId })
      .populate("restaurantId", "restaurantName address image isApproved");
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

export { listFood, addFood, removeFood, restaurantFoods, updateFood, getRestaurantFoods };
