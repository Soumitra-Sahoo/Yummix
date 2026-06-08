import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  restaurantId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "restaurant",
  required: true,
},
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: {type: String, default: "Food Processing",},
  date: {type: Date,default: Date.now},
  payment: {type: Boolean, default: false},
  couponCode: {type: String, default: ""},
  deliveredAt: {type: Date, default: null, expires: 129600},
});
const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
