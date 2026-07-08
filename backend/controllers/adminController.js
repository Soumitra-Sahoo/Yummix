import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import foodModel from "../models/foodModel.js";
import adminAlertModel from "../models/adminAlertModel.js";
import { assignRiderToOrder } from "../services/riderAssignmentService.js";
import { attemptRefund } from "../services/refundService.js";

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid Password" });

    if (!user.isAdmin) return res.json({ success: false, message: "Access denied. Not an admin." });

    const token = jwt.sign({ id: user._id, role: "admin" }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const [orders, foods, users] = await Promise.all([
      orderModel.find({}),
      foodModel.find({}),
      userModel.find({}),
    ]);

    const totalRevenue = orders.reduce((acc, o) => acc + o.amount, 0);
    const recentOrders = orders.slice().reverse().slice(0, 5);

    const monthlyData = {};
    orders.forEach((order) => {
      const month = new Date(order.date).toLocaleString("default", { month: "short" });
      monthlyData[month] = (monthlyData[month] || 0) + order.amount;
    });
    const monthlyRevenue = Object.entries(monthlyData).map(([month, revenue]) => ({ month, revenue }));

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders: orders.length,
        totalFoods: foods.length,
        totalUsers: users.length,
        recentOrders,
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Dashboard Error" });
  }
};

const getRestaurantDashboard = async (req, res) => {
  try {
    const [orders, foods] = await Promise.all([
      orderModel.find({ restaurantId: req.restaurantId }),
      foodModel.find({ restaurantId: req.restaurantId }),
    ]);

    const totalRevenue = orders.reduce((acc, o) => acc + o.amount, 0);

    const monthlyData = {};
    orders.forEach((order) => {
      const month = new Date(order.date).toLocaleString("default", { month: "short" });
      monthlyData[month] = (monthlyData[month] || 0) + order.amount;
    });
    const monthlyRevenue = Object.entries(monthlyData).map(([month, revenue]) => ({ month, revenue }));

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders: orders.length,
        totalFoods: foods.length,
        deliveredOrders: orders.filter((o) => o.status === "Delivered").length,
        pendingOrders: orders.filter((o) => o.status !== "Delivered").length,
        recentOrders: orders.slice().reverse().slice(0, 5),
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Dashboard Error" });
  }
};

const retryRiderAssignment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    if (order.status !== "Waiting for Rider") {
      return res.json({ success: false, message: `Cannot retry — order is currently "${order.status}"` });
    }
    if (order.customerLocation?.lat == null || order.customerLocation?.lng == null) {
      return res.json({ success: false, message: "Order has no delivery location on file" });
    }

    await assignRiderToOrder(order._id, order.customerLocation.lat, order.customerLocation.lng);
    res.json({ success: true, message: "Retry triggered" });
  } catch (error) {
    console.error("retryRiderAssignment:", error);
    res.json({ success: false, message: "Error" });
  }
};

const adminCancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    if (["Delivered", "Cancelled", "Rejected"].includes(order.status)) {
      return res.json({ success: false, message: `Order is already "${order.status}"` });
    }

    order.status = "Cancelled";
    order.cancelledAt = new Date();
    order.cancelledBy = "admin";
    await attemptRefund(order);

    res.json({ success: true, message: "Order cancelled" });
  } catch (error) {
    console.error("adminCancelOrder:", error);
    res.json({ success: false, message: "Error" });
  }
};

const getRefundAlerts = async (req, res) => {
  try {
    const alerts = await adminAlertModel
      .find({ type: "refund_failed", resolved: false })
      .populate("orderId", "amount status paymentMethod refundRetryCount refundNeedsManualReview")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: alerts });
  } catch (error) {
    console.error("getRefundAlerts:", error);
    res.json({ success: false, message: "Error" });
  }
};

const resolveRefundAlert = async (req, res) => {
  try {
    await adminAlertModel.findByIdAndUpdate(req.body.alertId, { resolved: true });
    res.json({ success: true, message: "Alert resolved" });
  } catch (error) {
    console.error("resolveRefundAlert:", error);
    res.json({ success: false, message: "Error" });
  }
};

export {
  adminLogin,
  getDashboardData,
  getRestaurantDashboard,
  retryRiderAssignment,
  adminCancelOrder,
  getRefundAlerts,
  resolveRefundAlert,
};