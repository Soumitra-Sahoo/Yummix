import mongoose from "mongoose";

const riderSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:     { type: String, required: true },
    phone:        { type: String, required: true, unique: true, trim: true },
    vehicleType:  { type: String, enum: ["Bike", "Bicycle", "Scooter"], default: "Bike" },
    vehicleNumber:{ type: String, required: true, trim: true, uppercase: true },

    // Profile
    profileImage:    { type: String, default: "" },
    profileImagePublicId: { type: String, default: "" },

    // Documents (Cloudinary URLs)
    aadhaarImage:    { type: String, default: "" },
    aadhaarPublicId: { type: String, default: "" },
    licenseImage:    { type: String, default: "" },
    licensePublicId: { type: String, default: "" },

    // Verification
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // Availability
    isOnline:    { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true }, // false when on a delivery

    // Location (last known, updated by polling)
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
      updatedAt: { type: Date, default: null },
    },

    // Earnings
    totalEarnings:    { type: Number, default: 0 },
    lifetimeDeliveries: { type: Number, default: 0 },

    // Current delivery
    currentOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      default: null,
    },
  },
  { timestamps: true }
);

const riderModel =
  mongoose.models.rider || mongoose.model("rider", riderSchema);
export default riderModel;