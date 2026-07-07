import express from "express";
import riderAuth from "../middleware/riderAuth.js";
import upload    from "../config/cloudinary.js";
import adminAuth from "../middleware/adminAuth.js";
import {registerRider, loginRider,  getRiderProfile, updateRiderProfile, changePassword,
   toggleOnlineStatus, updateLocation,  getPendingRiders, approveRider, rejectRider
} from "../controllers/riderController.js";

const riderRouter = express.Router();

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
riderRouter.get("/pending", adminAuth, getPendingRiders);
riderRouter.post("/approve", adminAuth, approveRider);
riderRouter.post("/reject", adminAuth, rejectRider);

export default riderRouter;