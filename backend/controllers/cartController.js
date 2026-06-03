import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";

// add to user cart
const addToCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    const food = await foodModel.findById(req.body.itemId);

    if (!food) {
      return res.json({
        success: false,
        message: "Food not found",
      });
    }
    if (
      user.cartRestaurantId &&
      user.cartRestaurantId.toString() !== food.restaurantId.toString()
    ) {
      await userModel.findByIdAndUpdate(req.body.userId, {
        cartData: {},
        cartRestaurantId: food.restaurantId,
      });

      const newCart = {
        [req.body.itemId]: 1,
      };

      await userModel.findByIdAndUpdate(req.body.userId, {
        cartData: newCart,
        cartRestaurantId: food.restaurantId,
      });

      return res.json({
        success: true,
        cartReplaced: true,
        message: "Previous cart removed. New item added.",
      });
    }

    let cartData = user.cartData;

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, {
      cartData,
      cartRestaurantId: food.restaurantId,
    });

    res.json({
      success: true,
      message: "Added To Cart",
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: "Error",
    });
  }
};

// remove food from user cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = userData.cartData;

    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }

    const hasItems = Object.values(cartData).some((qty) => qty > 0);

    await userModel.findByIdAndUpdate(req.body.userId, {
      cartData,
      cartRestaurantId: hasItems ? userData.cartRestaurantId : null,
    });

    res.json({
      success: true,
      message: "Removed From Cart",
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: "Error",
    });
  }
};

// get user cart
const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    res.json({ success: true, cartData: cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addToCart, removeFromCart, getCart };
