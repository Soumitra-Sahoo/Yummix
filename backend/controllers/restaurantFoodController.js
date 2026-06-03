import foodModel from "../models/foodModel.js";

const getRestaurantFoods = async (req, res) => {
  try {
    const foods = await foodModel.find({
      restaurantId: req.restaurantId,
    });

    res.json({
      success: true,
      data: foods,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: "Error",
    });
  }
};

const deleteRestaurantFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.foodId);

    if (!food) {
      return res.json({
        success: false,
        message: "Food not found",
      });
    }

    if (
      food.restaurantId.toString() !==
      req.restaurantId.toString()
    ) {
      return res.json({
        success: false,
        message: "Unauthorized",
      });
    }

    await foodModel.findByIdAndDelete(req.body.foodId);

    res.json({
      success: true,
      message: "Food deleted",
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: "Delete failed",
    });
  }
};

export { getRestaurantFoods, deleteRestaurantFood };