import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "restaurant", required: true },
  name:         { type: String, required: true },
  description:  { type: String, required: true },
  price:        { type: Number, required: true },
  image:        { type: String, required: true },
  imagePublicId:{ type: String, default: "" },
  category: {
    type: String,
    required: true,
    enum: [
      "Biriyani","Rolls","Deserts","Sandwich","Cake",
      "Pure Veg","Pasta","Noodles","Pizza","Snacks",
      "Beverages","Breakfast","Chinese","Thali","Others"
    ],
  },
  prepTime:    { type: Number,  default: null },
  spiceLevel:  { type: String,  enum: ["Mild","Medium","Hot","Extra Hot"], default: "Medium" },
  tags:        { type: [String], default: [] },
  isAvailable: { type: Boolean, default: true },
  avgRating:   { type: Number,  default: 0 },
  ratingCount: { type: Number,  default: 0 },
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);
export default foodModel;
