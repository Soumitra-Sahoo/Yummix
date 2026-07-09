import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import Stripe from "stripe";
import { attemptRefund } from "../services/refundService.js";
import { assignRiderToOrder } from "../services/riderAssignmentService.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const CURRENCY = "inr";
const BASE_DELIVERY = 17;
const PER_KM_RATE = 4;
const FREE_KM = 2;
const FRONTEND_URL = process.env.FRONTEND_URL || "https://yummix-frontend.vercel.app";

const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const calcDeliveryFee = (customerLoc, restaurantLoc) => {
  if (
    customerLoc?.lat == null ||
    customerLoc?.lng == null ||
    restaurantLoc?.lat == null ||
    restaurantLoc?.lng == null
  ) {
    return BASE_DELIVERY;
  }
  const dist = haversineKm(
    customerLoc.lat,
    customerLoc.lng,
    restaurantLoc.lat,
    restaurantLoc.lng,
  );

  const extraKm = Math.max(0, dist - FREE_KM);

  return Math.round(BASE_DELIVERY + extraKm * PER_KM_RATE);
};

const triggerRiderAssignment = async (orderId, customerLocation) => {
   if (customerLocation?.lat != null &&    customerLocation?.lng != null  ){
    await assignRiderToOrder(
      orderId,
      customerLocation.lat,
      customerLocation.lng,
    );
  } else {
    await orderModel.findByIdAndUpdate(orderId, {
      isQueued: true,
      status: "Waiting for Rider",
    });
  }
};

const placeOrder = async (req, res) => {
  try {
    const { items, userId, address, couponCode, customerLocation } = req.body;

    if (!items || items.length === 0)
      return res.json({ success: false, message: "Cart is empty" });

    const firstFood = await foodModel
      .findById(items[0]._id)
      .populate("restaurantId", "location");
    if (!firstFood)
      return res.json({ success: false, message: "Food item not found" });

    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    if (subtotal <= 0)
      return res.json({ success: false, message: "Invalid cart total" });

    const restaurantLocation = firstFood.restaurantId?.location;
    const deliveryFee = calcDeliveryFee(customerLocation, restaurantLocation);

    let discount = 0;
    if (couponCode?.toUpperCase() === "FIRST15") {
      if (user.hasUsedFirstCoupon)
        return res.json({ success: false, message: "FIRST15 already used" });
      discount = subtotal * 0.15;
    }

    const finalAmount = subtotal - discount + deliveryFee;

    const newOrder = new orderModel({
      userId,
      restaurantId: firstFood.restaurantId._id || firstFood.restaurantId,
      items,
      amount: finalAmount,
      address,
      couponCode: couponCode ? couponCode.toUpperCase() : "",
      payment: false,
      paymentMethod: "stripe",
      customerLocation: customerLocation || { lat: null, lng: null },
      deliveryFee,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, {
      cartData: {},
      cartRestaurantId: null,
    });

    const discountRatio = discount > 0 ? discount / subtotal : 0;
    const line_items = items.map((item) => ({
      price_data: {
        currency: CURRENCY,
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * (1 - discountRatio) * 100),
      },
      quantity: item.quantity,
    }));
    line_items.push({
      price_data: {
        currency: CURRENCY,
        product_data: { name: "Delivery Charge" },
        unit_amount: deliveryFee * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });
    await orderModel.findByIdAndUpdate(newOrder._id, { stripeSessionId: session.id });
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("placeOrder:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const placeOrderCOD = async (req, res) => {
  try {
    const { items, userId, address, couponCode, customerLocation } = req.body;

    if (!items || items.length === 0)
      return res.json({ success: false, message: "Cart is empty" });

    const firstFood = await foodModel
      .findById(items[0]._id)
      .populate("restaurantId", "location");
    if (!firstFood)
      return res.json({ success: false, message: "Food item not found" });

    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    if (subtotal <= 0)
      return res.json({ success: false, message: "Invalid cart total" });

    const restaurantLocation = firstFood.restaurantId?.location;
    const deliveryFee = calcDeliveryFee(customerLocation, restaurantLocation);

    let discount = 0;
    if (couponCode?.toUpperCase() === "FIRST15") {
      if (user.hasUsedFirstCoupon)
        return res.json({ success: false, message: "FIRST15 already used" });
      discount = subtotal * 0.15;
    }

    const finalAmount = subtotal - discount + deliveryFee;

    const newOrder = new orderModel({
      userId,
      restaurantId: firstFood.restaurantId._id || firstFood.restaurantId,
      items,
      amount: finalAmount,
      address,
      couponCode: couponCode ? couponCode.toUpperCase() : "",
      payment: false,
      paymentMethod: "cod",
      customerLocation: customerLocation || { lat: null, lng: null },
      deliveryFee,
    });

    await newOrder.save();
    if (couponCode?.toUpperCase() === "FIRST15") {
      await userModel.findByIdAndUpdate(userId, { hasUsedFirstCoupon: true });
    }
    await userModel.findByIdAndUpdate(userId, {
      cartData: {},
      cartRestaurantId: null,
    });
    res.json({
      success: true,
      message: "Order placed successfully! Pay on delivery.",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("placeOrderCOD:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      const order = await orderModel.findById(orderId);
      if (!order) return res.json({ success: false, message: "Order not found" });

      let paymentIntentId = order.stripePaymentIntentId;
      if (!paymentIntentId && order.stripeSessionId) {
        const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
        paymentIntentId = session.payment_intent;
      }
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        stripePaymentIntentId: paymentIntentId || null,
      });
      if (order.couponCode === "FIRST15") {
        await userModel.findByIdAndUpdate(order.userId, { hasUsedFirstCoupon: true });
      }
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.error("verifyOrder:", error);
    res.json({ success: false, message: "Not Verified" });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.body.userId })
      .populate("riderId", "name phone vehicleNumber profileImage");
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (["Cancelled", "Rejected"].includes(status)) {
      return res.json({
        success: false,
        message: "Use the dedicated cancel endpoint for this",
      });
    }

    const update = status === "Delivered"
        ? {
            status,
            deliveredAt: new Date(),
            payment: true,
          }
        : {
            status,
          };

    await orderModel.findByIdAndUpdate(orderId, update);

    res.json({
      success: true,
      message: "Status Updated",
    });
  } catch (error) {
    console.error("updateStatus:", error);
    res.json({
      success: false,
      message: "Error",
    });
  }
};

const restaurantOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ restaurantId: req.restaurantId })
      .populate("riderId", "name phone vehicleNumber profileImage");
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const RESTAURANT_TRANSITIONS = {
  "Order Placed": ["Confirmed", "Rejected"],
  "Confirmed": ["Preparing Food", "Rejected"],
  "Preparing Food": ["Ready for Pickup"],
};

const CANCELLABLE_STATUSES = ["Order Placed", "Confirmed", "Preparing Food"];

const updateRestaurantOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await orderModel.findOne({ _id: orderId, restaurantId: req.restaurantId });
    if (!order) return res.json({ success: false, message: "Order not found" });

    const allowedNext = RESTAURANT_TRANSITIONS[order.status];
    if (!allowedNext || !allowedNext.includes(status)) {
      return res.json({ success: false, message: `Cannot move from "${order.status}" to "${status}"` });
    }
    order.status = status;
    if (status === "Rejected") {
      order.cancelledBy = "restaurant";
      order.cancelledAt = new Date();
      await attemptRefund(order);
    } else {
      await order.save();
    }

    if (status === "Ready for Pickup") {
      await triggerRiderAssignment(order._id, order.customerLocation);
    }

    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId, userId } = req.body;
    const order = await orderModel.findOne({ _id: orderId, userId });
    if (!order) return res.json({ success: false, message: "Order not found" });

    if (!CANCELLABLE_STATUSES.includes(order.status)) {
      return res.json({ success: false, message: "This order can no longer be cancelled" });
    }
    order.status = "Cancelled";
    order.cancelledAt = new Date();
    order.cancelledBy = "customer";
    const { refunded } = await attemptRefund(order);
    res.json({
      success: true,
      message: refunded
        ? "Your refund has been initiated successfully. The amount will be credited according to your bank or payment provider's processing time."
        : order.paymentMethod === "stripe" && order.payment
          ? "Your order has been cancelled. We're processing your refund. If there is a delay, our support team will assist you."
          : "Order cancelled",
    });
  } catch (error) {
    console.error("cancelOrder:", error);
    res.json({ success: false, message: "Error" });
  }
};

export {
  placeOrder, placeOrderCOD, verifyOrder, listOrders, userOrders,
  updateStatus, restaurantOrders, updateRestaurantOrderStatus, cancelOrder,
};
