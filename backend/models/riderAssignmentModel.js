import mongoose from "mongoose";

// Tracks assignment attempts per order — for queue + timeout reassignment
const riderAssignmentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      required: true,
    },
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rider",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "timeout", "reassigned"],
      default: "pending",
    },
    assignedAt:  { type: Date, default: Date.now },
    respondedAt: { type: Date, default: null },
    timeoutAt:   { type: Date, default: null }, // assignedAt + 60s
  },
  { timestamps: true }
);

const riderAssignmentModel =
  mongoose.models.riderAssignment ||
  mongoose.model("riderAssignment", riderAssignmentSchema);

export default riderAssignmentModel;