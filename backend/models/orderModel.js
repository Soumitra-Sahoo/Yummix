import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurant",
    required: true,
  },
  riderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "rider",
    default: null,
  },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: {
    type: String,
    enum: [
      "Order Placed",
      "Confirmed",
      "Preparing Food",
      "Ready for Pickup",
      "Waiting for Rider",
      "Rider Assigned",
      "Picked Up",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
      "Rejected",
    ],
    default: "Order Placed",
  },
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false },
  paymentMethod: { type: String, enum: ["stripe", "cod"], default: "stripe" },

  couponCode: { type: String, default: "" },
  deliveredAt: { type: Date, default: null },
  deliveryFee: { type: Number, default: 17 },
  customerLocation: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
  },
  isQueued: { type: Boolean, default: false },
  assignmentTries: { type: Number, default: 0 },
  stripeSessionId: { type: String, default: null },
  stripePaymentIntentId: { type: String, default: null },
  refunded: { type: Boolean, default: false },
  refundId: { type: String, default: null },
  refundedAt: { type: Date, default: null },
  refundFailed: { type: Boolean, default: false },
  cancelledBy: {
    type: String,
    enum: ["customer", "restaurant", "system", "admin", null],
    default: null,
  },
  cancelledAt: { type: Date, default: null },
  riderAssignmentFailed: { type: Boolean, default: false },
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
