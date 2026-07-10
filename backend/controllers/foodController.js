import foodModel from "../models/foodModel.js";
import { v2 as cloudinary } from "cloudinary";
import { getCache, setCache, deleteCache } from "../utils/cacheHelper.js";

const listFood = async (req, res) => {
  try {
    const cacheKey = "food:list";
    const cached = await getCache(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: cached,
      });
    }

    const foods = await foodModel.find({
      isAvailable: true,
    });

    await setCache(cacheKey, foods);

    res.json({
      success: true,
      data: foods,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error",
    });
  }
};

const addFood = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "Image file is required" });
    if (!req.body.name || !req.body.description || !req.body.price || !req.body.category)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const food = new foodModel({
      restaurantId: req.restaurantId,
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      image: req.file.path,
      imagePublicId: req.file.filename,
      prepTime: req.body.prepTime ? Number(req.body.prepTime) : null,
      spiceLevel: req.body.spiceLevel || "Medium",
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      isAvailable: req.body.isAvailable === "false" ? false : true,
    });

    await food.save();
    await deleteCache(`restaurant:menu:${req.restaurantId}`);
    await deleteCache("food:list");
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
    if (req.body.prepTime !== undefined) food.prepTime = Number(req.body.prepTime) || null;
    if (req.body.spiceLevel) food.spiceLevel = req.body.spiceLevel;
    if (req.body.tags) food.tags = JSON.parse(req.body.tags);
    if (req.body.isAvailable !== undefined) food.isAvailable = req.body.isAvailable === true || req.body.isAvailable === "true";

    await food.save();
    await deleteCache(`restaurant:menu:${req.restaurantId}`);
    await deleteCache("food:list");
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
    await deleteCache(`restaurant:menu:${req.restaurantId}`);
    await deleteCache("food:list");
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
    const { restaurantId } = req.params;
    const cacheKey = `restaurant:menu:${restaurantId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    const foods = await foodModel
      .find({
        restaurantId,
        isAvailable: true,
      })
      .populate(
        "restaurantId",
        "restaurantName address image isApproved"
      );

    await setCache(cacheKey, foods);
    res.json({
      success: true,
      data: foods,
      cached: false,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error",
    });
  }
};

export { listFood, addFood, removeFood, restaurantFoods, updateFood, getRestaurantFoods };
