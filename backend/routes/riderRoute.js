import express from "express";
import riderAuth from "../middleware/riderAuth.js";
import upload    from "../config/cloudinary.js";
import {
  registerRider, loginRider,
  getRiderProfile, updateRiderProfile,
  changePassword, toggleOnlineStatus, updateLocation,
} from "../controllers/riderController.js";

const riderRouter = express.Router();

// Multi-file upload middleware for registration
const uploadDocs = upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "aadhaarImage", maxCount: 1 },
  { name: "licenseImage", maxCount: 1 },
]);

const handleUpload = (req, res, next) => {
  uploadDocs(req, res, (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    next();
  });
};

riderRouter.post("/register",         handleUpload, registerRider);
riderRouter.post("/login",            loginRider);
riderRouter.get("/profile",           riderAuth, getRiderProfile);
riderRouter.post("/profile/update",   riderAuth, updateRiderProfile);
riderRouter.post("/change-password",  riderAuth, changePassword);
riderRouter.post("/toggle-online",    riderAuth, toggleOnlineStatus);
riderRouter.post("/update-location",  riderAuth, updateLocation);

export default riderRouter;