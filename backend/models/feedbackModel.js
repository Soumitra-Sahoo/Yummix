import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["feedback", "partner"], required: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    rating: { type: Number },
    restaurant: { type: String },
    city: { type: String },
    message: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.feedback || mongoose.model("feedback", feedbackSchema);