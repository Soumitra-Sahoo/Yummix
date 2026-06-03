import foodModel from "../models/foodModel.js";
import orderModel from "../models/orderModel.js";

const restaurantDashboard = async (req, res) => {
  try {
    const foods = await foodModel.find({
      restaurantId: req.restaurantId,
    });

    const orders = await orderModel.find({
      restaurantId: req.restaurantId,
    });

    const revenue = orders.reduce(
      (acc, order) => acc + order.amount,
      0
    );

    res.json({
      success: true,
      data: {
        totalFoods: foods.length,
        totalOrders: orders.length,
        revenue,
        recentOrders: orders
          .slice()
          .reverse()
          .slice(0, 5),
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

export default restaurantDashboard;