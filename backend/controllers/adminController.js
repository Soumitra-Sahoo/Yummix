import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import foodModel from "../models/foodModel.js";
import restaurantModel from "../models/restaurantModel.js";

// ================= ADMIN LOGIN =================

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid Password",
      });
    }

    // if (!user.isAdmin) {
    //   return res.json({
    //     success: false,
    //     message: "You are not Admin",
    //   });
    // }

    const token = jwt.sign(
      {
        id: user._id,
        role: "admin",
      },
      process.env.JWT_SECRET,
    );

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: "Error",
    });
  }
};

// ================= DASHBOARD =================

const getDashboardData = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    const foods = await foodModel.find({});
    const users = await userModel.find({});

    // TOTAL REVENUE
    const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);

    // RECENT ORDERS
    const recentOrders = orders.slice().reverse().slice(0, 5);

    // MONTHLY REVENUE
    const monthlyData = {};

    orders.forEach((order) => {
      const date = new Date(order.date);

      const month = date.toLocaleString("default", {
        month: "short",
      });

      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }

      monthlyData[month] += order.amount;
    });

    const monthlyRevenue = Object.keys(monthlyData).map((month) => ({
      month,
      revenue: monthlyData[month],
    }));

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
    console.log(error);

    res.json({
      success: false,
      message: "Dashboard Error",
    });
  }
};

const getRestaurantDashboard = async (req, res) => {
  try {
    const orders = await orderModel.find({
      restaurantId: req.restaurantId,
    });

    const foods = await foodModel.find({
      restaurantId: req.restaurantId,
    });

    const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);

    const monthlyData = {};

    orders.forEach((order) => {
      const month = new Date(order.date).toLocaleString("default", {
        month: "short",
      });

      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }

      monthlyData[month] += order.amount;
    });

    const monthlyRevenue = Object.keys(monthlyData).map((month) => ({
      month,
      revenue: monthlyData[month],
    }));
    const deliveredOrders = orders.filter(
      (order) => order.status === "Delivered",
    ).length;
    const pendingOrders = orders.filter(
      (order) => order.status !== "Delivered",
    ).length;

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders: orders.length,
        totalFoods: foods.length,
        deliveredOrders,
        pendingOrders,
        recentOrders: orders.slice().reverse().slice(0, 5),
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: "Dashboard Error",
    });
  }
};

export { adminLogin, getDashboardData, getRestaurantDashboard };
