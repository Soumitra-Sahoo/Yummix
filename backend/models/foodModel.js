import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    restaurantId: {type: mongoose.Schema.Types.ObjectId, ref: "restaurant", required: true,
  },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true},
    image: { type: String, required: true },
    imagePublicId: {type: String, default: ""},
    category:{ type:String, required:true}
})

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);
export default foodModel;