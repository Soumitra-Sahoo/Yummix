import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: "user",  required: true },
    foodId:  { type: mongoose.Schema.Types.ObjectId, ref: "food",  required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order", required: true },
    stars:   { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

ratingSchema.index({ userId: 1, foodId: 1, orderId: 1 }, { unique: true });

const ratingModel =
  mongoose.models.rating || mongoose.model("rating", ratingSchema);

export default ratingModel;