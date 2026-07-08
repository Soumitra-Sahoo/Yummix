import mongoose from "mongoose";

const adminAlertSchema = new mongoose.Schema(
  {
    type:    { type: String, required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order", required: true },
    message: { type: String, required: true },
    resolved:{ type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.adminAlert || mongoose.model("adminAlert", adminAlertSchema);