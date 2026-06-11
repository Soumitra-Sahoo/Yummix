import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const CURRENCY = "inr";
const DELIVERY_CHARGE = 17;
const FRONTEND_URL = "https://yummix-frontend.vercel.app";

const placeOrder = async (req, res) => {
  try {
    const { items, userId, address, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    const firstFood = await foodModel.findById(items[0]._id);
    if (!firstFood) {
      return res.json({ success: false, message: "Food item not found" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    if (subtotal <= 0) {
      return res.json({ success: false, message: "Invalid cart total" });
    }

    let discount = 0;
    if (couponCode?.toUpperCase() === "FIRST15") {
      if (user.hasUsedFirstCoupon) {
        return res.json({ success: false, message: "FIRST15 already used" });
      }
      discount = subtotal * 0.15;
    }

    const finalAmount = subtotal - discount + DELIVERY_CHARGE;

    const newOrder = new orderModel({
      userId,
      restaurantId: firstFood.restaurantId,
      items,
      amount: finalAmount,
      address,
      couponCode: couponCode || "",
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, {
      cartData: {},
      cartRestaurantId: null,
    });

    // Build Stripe line items using the CURRENCY constant
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
        unit_amount: DELIVERY_CHARGE * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("placeOrder error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const validateCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;
    const user = await userModel.findById(req.body.userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (couponCode?.toUpperCase() === "FIRST15") {
      if (user.hasUsedFirstCoupon) {
        return res.json({
          success: false,
          message: "FIRST15 already used",
        });
      }

      return res.json({
        success: true,
        message: "Coupon valid",
      });
    }

    return res.json({
      success: false,
      message: "Invalid coupon",
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error validating coupon",
    });
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
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const update =
      req.body.status === "Delivered"
        ? { status: req.body.status, deliveredAt: new Date() }
        : { status: req.body.status };
    await orderModel.findByIdAndUpdate(req.body.orderId, update);
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      const order = await orderModel.findById(orderId);
      if (order?.couponCode === "FIRST15") {
        await userModel.findByIdAndUpdate(order.userId, {
          hasUsedFirstCoupon: true,
        });
      }
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Not Verified" });
  }
};

const restaurantOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ restaurantId: req.restaurantId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const updateRestaurantOrderStatus = async (req, res) => {
  try {
    const order = await orderModel.findOne({
      _id: req.body.orderId,
      restaurantId: req.restaurantId,
    });
    if (!order) return res.json({ success: false, message: "Order not found" });

    order.status = req.body.status;
    if (req.body.status === "Delivered") order.deliveredAt = new Date();
    await order.save();

    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

export {
  placeOrder,
  validateCoupon,
  listOrders,
  userOrders,
  updateStatus,
  verifyOrder,
  restaurantOrders,
  updateRestaurantOrderStatus,
};
