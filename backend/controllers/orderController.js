import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// config variables
const currency = "inr";
const deliveryCharge = 17;
const frontend_URL = "http://localhost:5173";

// Placing User Order for Frontend
const placeOrder = async (req, res) => {
  try {
    const firstFood = await foodModel.findById(req.body.items[0]._id);
const user = await userModel.findById(req.body.userId);

let finalAmount = req.body.amount;

if (
  req.body.couponCode &&
  req.body.couponCode.toUpperCase() === "FIRST15"
) {
  if (user.hasUsedFirstCoupon) {
    return res.json({
      success: false,
      message: "FIRST15 already used",
    });
  }

  const subtotal = req.body.items.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const discount = subtotal * 0.15;

  finalAmount = subtotal - discount + 17;
}

    const newOrder = new orderModel({
      userId: req.body.userId,
      restaurantId: firstFood.restaurantId,
      items: req.body.items,
      amount: finalAmount,
      address: req.body.address,
      couponCode: req.body.couponCode || "",
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, {
      cartData: {},
      cartRestaurantId: null,
    });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      success_url: `http://localhost:5173/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `http://localhost:5173/verify?success=false&orderId=${newOrder._id}`,
      line_items: line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Listing Order for Admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// User Orders for Frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    if (req.body.status === "Delivered") {
      await orderModel.findByIdAndUpdate(req.body.orderId, {
        status: req.body.status,
        deliveredAt: new Date(),
      });
    } else {
      await orderModel.findByIdAndUpdate(req.body.orderId, {
        status: req.body.status,
      });
    }
    res.json({
      success: true,
      message: "Status Updated",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error",
    });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      const order = await orderModel.findById(orderId);

  if (order.couponCode === "FIRST15") {
    await userModel.findByIdAndUpdate(
      order.userId,
      {
        hasUsedFirstCoupon: true,
      }
    );
  }
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    res.json({ success: false, message: "Not  Verified" });
  }
};

const restaurantOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({
      restaurantId: req.restaurantId,
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: "Error",
    });
  }
};

const updateRestaurantOrderStatus = async (req, res) => {
  try {
    const order = await orderModel.findOne({
      _id: req.body.orderId,
      restaurantId: req.restaurantId,
    });

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    if (req.body.status === "Delivered") {
      order.status = req.body.status;
      order.deliveredAt = new Date();
    } else {
      order.status = req.body.status;
    }

    await order.save();

    res.json({
      success: true,
      message: "Status Updated",
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: "Error",
    });
  }
};

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, restaurantOrders, updateRestaurantOrderStatus };
