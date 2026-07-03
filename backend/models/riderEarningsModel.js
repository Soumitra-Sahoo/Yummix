import mongoose from "mongoose";

// One document per delivery — full earnings history
const riderEarningsSchema = new mongoose.Schema(
  {
    riderId:      { type: mongoose.Schema.Types.ObjectId, ref: "rider",  required: true },
    orderId:      { type: mongoose.Schema.Types.ObjectId, ref: "order",  required: true },
    distanceKm:   { type: Number, required: true }, 
    baseEarning:  { type: Number, required: true },
    bonusEarning: { type: Number, default: 0 }, 
    totalEarning: { type: Number, required: true },           
    deliveredAt:  { type: Date,   default: Date.now },
  },
  { timestamps: true }
);

const riderEarningsModel =
  mongoose.models.riderEarnings ||
  mongoose.model("riderEarnings", riderEarningsSchema);

export default riderEarningsModel;