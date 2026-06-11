import ratingModel from "../models/ratingModel.js";
import foodModel   from "../models/foodModel.js";
import orderModel  from "../models/orderModel.js";

const submitRating = async (req, res) => {
  try {
    const { foodId, orderId, stars, userId } = req.body;

    if (!foodId || !orderId || !stars) {
      return res.json({ success: false, message: "foodId, orderId and stars are required" });
    }
    if (stars < 1 || stars > 5) {
      return res.json({ success: false, message: "Stars must be between 1 and 5" });
    }

    const order = await orderModel.findOne({
      _id: orderId,
      userId: userId.toString(),
      status: "Delivered",
    });
    if (!order) {
      return res.json({ success: false, message: "Order not found or not yet delivered" });
    }

    const itemInOrder = order.items.find(
      (item) => item._id?.toString() === foodId || item.id?.toString() === foodId
    );
    if (!itemInOrder) {
      return res.json({ success: false, message: "Food item not found in this order" });
    }

    await ratingModel.findOneAndUpdate(
      { userId, foodId, orderId },
      { stars },
      { upsert: true, new: true }
    );

    const allRatings = await ratingModel.find({ foodId });
    const avgRating  = allRatings.reduce((sum, r) => sum + r.stars, 0) / allRatings.length;

    await foodModel.findByIdAndUpdate(foodId, {
      avgRating:   Math.round(avgRating * 10) / 10,
      ratingCount: allRatings.length,
    });

    res.json({
      success: true,
      message: "Rating submitted",
      avgRating,
      ratingCount: allRatings.length,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.json({ success: false, message: "You already rated this item" });
    }
    console.error("submitRating error:", error);
    res.json({ success: false, message: "Error submitting rating" });
  }
};


const getOrderRatings = async (req, res) => {
  try {
    const { userId } = req.body;
    const { orderId } = req.params;

    const ratings = await ratingModel.find({ userId, orderId });

    const map = {};
    ratings.forEach((r) => { map[r.foodId.toString()] = r.stars; });

    res.json({ success: true, data: map });
  } catch (error) {
    console.error("getOrderRatings error:", error);
    res.json({ success: false, message: "Error" });
  }
};

export { submitRating, getOrderRatings };
