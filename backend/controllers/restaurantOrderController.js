import orderModel from "../models/orderModel.js";

const getRestaurantOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ restaurantId: req.restaurantId });
    res.json({ success: true, data: orders.slice().reverse() });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};

export { getRestaurantOrders };
