import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import riderModel from "../models/riderModel.js";
import { processQueuedOrders } from "../services/riderAssignmentService.js";

const createRiderToken = (id) =>
  jwt.sign({ id, role: "rider" }, process.env.JWT_SECRET);

const registerRider = async (req, res) => {
  try {
    const { name, email, password, phone, vehicleType, vehicleNumber } = req.body;

    if (!name || !email || !password || !phone || !vehicleNumber) {
      return res.json({ success: false, message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    const exists = await riderModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Email already registered" });
    }

    const phoneExists = await riderModel.findOne({ phone });
    if (phoneExists) {
      return res.json({ success: false, message: "Phone already registered" });
    }

    const profileImage    = req.files?.profileImage?.[0]?.path || "";
    const profilePublicId = req.files?.profileImage?.[0]?.filename || "";
    const aadhaarImage    = req.files?.aadhaarImage?.[0]?.path || "";
    const aadhaarPublicId = req.files?.aadhaarImage?.[0]?.filename || "";
    const licenseImage    = req.files?.licenseImage?.[0]?.path || "";
    const licensePublicId = req.files?.licenseImage?.[0]?.filename || "";

    if (!profileImage || !aadhaarImage || !licenseImage) {
      return res.json({
        success: false,
        message: "Profile photo, Aadhaar and Driving License are required",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const rider = await riderModel.create({
      name, email, password: hashedPassword,
      phone, vehicleType, vehicleNumber,
      profileImage, profileImagePublicId: profilePublicId,
      aadhaarImage, aadhaarPublicId,
      licenseImage, licensePublicId,
      verificationStatus: "pending",
    });

    res.json({
      success: true,
      message: "Registration submitted. Awaiting admin approval.",
      riderId: rider._id,
    });
  } catch (error) {
    console.error("registerRider:", error);
    res.json({ success: false, message: "Registration failed" });
  }
};

const loginRider = async (req, res) => {
  try {
    const { email, password } = req.body;

    const rider = await riderModel.findOne({ email });
    if (!rider) {
      return res.json({ success: false, message: "Rider not found" });
    }

    const isMatch = await bcrypt.compare(password, rider.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    if (rider.verificationStatus === "pending") {
      return res.json({ success: false, message: "Account pending admin approval" });
    }
    if (rider.verificationStatus === "rejected") {
      return res.json({ success: false, message: "Account rejected. Contact support." });
    }

    const token = createRiderToken(rider._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error("loginRider:", error);
    res.json({ success: false, message: "Login failed" });
  }
};

const getRiderProfile = async (req, res) => {
  try {
    const rider = await riderModel
      .findById(req.riderId)
      .select("-password");
    if (!rider) return res.json({ success: false, message: "Rider not found" });
    res.json({ success: true, data: rider });
  } catch (error) {
    console.error("getRiderProfile:", error);
    res.json({ success: false, message: "Error" });
  }
};

const updateRiderProfile = async (req, res) => {
  try {
    const { name, phone, vehicleType, vehicleNumber } = req.body;

    await riderModel.findByIdAndUpdate(req.riderId, {
      name, phone, vehicleType, vehicleNumber,
    });

    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.error("updateRiderProfile:", error);
    res.json({ success: false, message: "Update failed" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.json({ success: false, message: "Both fields required" });
    }
    if (newPassword.length < 6) {
      return res.json({ success: false, message: "New password must be at least 6 characters" });
    }

    const rider = await riderModel.findById(req.riderId);
    const isMatch = await bcrypt.compare(currentPassword, rider.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await riderModel.findByIdAndUpdate(req.riderId, { password: hashedPassword });

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("changePassword:", error);
    res.json({ success: false, message: "Error" });
  }
};

const toggleOnlineStatus = async (req, res) => {
  try {
    const rider = await riderModel.findById(req.riderId);
    const newStatus = !rider.isOnline;

    if (!newStatus && rider.currentOrderId) {
      return res.json({
        success: false,
        message: "You have an active delivery — finish it before going offline",
      });
    }

    await riderModel.findByIdAndUpdate(req.riderId, {
      isOnline: newStatus,
      isAvailable: newStatus ? true : false,
    });

    if (newStatus) {
      processQueuedOrders().catch((e) => console.error("processQueuedOrders:", e));
    }
    res.json({
      success: true,
      isOnline: newStatus,
      message: newStatus ? "You are now online" : "You are now offline",
    });
  } catch (error) {
    console.error("toggleOnlineStatus:", error);
    res.json({ success: false, message: "Error" });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng) {
      return res.json({ success: false, message: "lat and lng required" });
    }

    await riderModel.findByIdAndUpdate(req.riderId, {
      location: { lat, lng, updatedAt: new Date() },
    });

    res.json({ success: true, message: "Location updated" });
  } catch (error) {
    console.error("updateLocation:", error);
    res.json({ success: false, message: "Error" });
  }
};

export {
  registerRider, loginRider,
  getRiderProfile, updateRiderProfile,
  changePassword, toggleOnlineStatus, updateLocation,
};