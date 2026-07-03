import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import restaurantModel from "../models/restaurantModel.js";

const createRestaurantToken = (id) =>
  jwt.sign({ id, role: "restaurant" }, process.env.JWT_SECRET);

const registerRestaurant = async (req, res) => {
  try {
    const { restaurantName, ownerName, email, password, phone, address } =
      req.body;

    const exists = await restaurantModel.findOne({ email });
    if (exists)
      return res.json({ success: false, message: "Restaurant already exists" });

    if (!validator.isEmail(email))
      return res.json({ success: false, message: "Invalid Email" });
    if (password.length < 6)
      return res.json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    if (!req.file)
      return res.json({
        success: false,
        message: "Restaurant image is required",
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const restaurant = await restaurantModel.create({
      restaurantName,
      ownerName,
      email,
      password: hashedPassword,
      phone,
      address,
      image: req.file.path,
      imagePublicId: req.file.filename,
      isApproved: false,
    });

    res.json({
      success: true,
      message: "Registration submitted. Awaiting approval.",
      restaurantId: restaurant._id,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Registration failed" });
  }
};

const loginRestaurant = async (req, res) => {
  try {
    const { restaurantName, phone, password } = req.body;
    const restaurant = await restaurantModel.findOne({ restaurantName, phone });

    if (!restaurant)
      return res.json({ success: false, message: "Restaurant not found" });

    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid credentials" });

    if (!restaurant.isApproved)
      return res.json({
        success: false,
        message: "Waiting for admin approval",
      });

    const token = createRestaurantToken(restaurant._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Login failed" });
  }
};

const getPendingRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantModel.find({ isApproved: false });
    res.json({ success: true, data: restaurants });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const listRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantModel.find({ isApproved: true });
    res.json({ success: true, data: restaurants });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const approveRestaurant = async (req, res) => {
  try {
    await restaurantModel.findByIdAndUpdate(req.body.restaurantId, {
      isApproved: true,
    });
    res.json({ success: true, message: "Restaurant approved" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Approval failed" });
  }
};

const getRestaurantProfile = async (req, res) => {
  try {
    const restaurant = await restaurantModel.findById(req.restaurantId);
    if (!restaurant) return res.json({ success: false, message: "Not found" });
    res.json({ success: true, data: restaurant });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const updateRestaurantProfile = async (req, res) => {
  try {
    await restaurantModel.findByIdAndUpdate(req.restaurantId, {
      restaurantName: req.body.restaurantName,
      ownerName: req.body.ownerName,
      phone: req.body.phone,
      address: req.body.address,
    });
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Update Failed" });
  }
};

const updateRestaurantLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng) {
      return res.json({ success: false, message: "lat and lng are required" });
    }
    await restaurantModel.findByIdAndUpdate(req.restaurantId, {
      location: { lat: parseFloat(lat), lng: parseFloat(lng) },
    });
    res.json({ success: true, message: "Location updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

export {
  registerRestaurant,
  loginRestaurant,
  getPendingRestaurants,
  approveRestaurant,
  getRestaurantProfile,
  updateRestaurantProfile,
  listRestaurants,
  updateRestaurantLocation,
};
