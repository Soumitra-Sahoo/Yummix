import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";

const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    if (!itemId) return res.json({ success: false, message: "Item ID missing" });

    const [user, food] = await Promise.all([
      userModel.findById(userId),
      foodModel.findById(itemId),
    ]);

    if (!user) return res.json({ success: false, message: "User not found" });
    if (!food) return res.json({ success: false, message: "Food not found" });

    // If food has no restaurantId (legacy doc), skip restaurant check
    const foodRestaurantId = food.restaurantId?.toString();
    const cartRestaurantId = user.cartRestaurantId?.toString();

    if (foodRestaurantId && cartRestaurantId && cartRestaurantId !== foodRestaurantId) {
      // Different restaurant — clear old cart, start fresh
      await userModel.findByIdAndUpdate(userId, {
        cartData: { [itemId]: 1 },
        cartRestaurantId: food.restaurantId,
      });
      return res.json({
        success: true,
        cartReplaced: true,
        message: "Previous cart removed. New item added.",
      });
    }

    const cartData = { ...(user.cartData || {}) };
    cartData[itemId] = (cartData[itemId] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, {
      cartData,
      cartRestaurantId: food.restaurantId || user.cartRestaurantId,
    });

    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.error("addToCart error:", error);
    res.json({ success: false, message: error.message || "Error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    const userData = await userModel.findById(userId);
    if (!userData) return res.json({ success: false, message: "User not found" });

    const cartData = { ...(userData.cartData || {}) };
    if (cartData[itemId] > 0) cartData[itemId] -= 1;

    const hasItems = Object.values(cartData).some((qty) => qty > 0);

    await userModel.findByIdAndUpdate(userId, {
      cartData,
      cartRestaurantId: hasItems ? userData.cartRestaurantId : null,
    });

    res.json({ success: true, message: "Removed From Cart" });
  } catch (error) {
    console.error("removeFromCart error:", error);
    res.json({ success: false, message: error.message || "Error" });
  }
};

const getCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    if (!userData) return res.json({ success: false, message: "User not found" });
    res.json({ success: true, cartData: userData.cartData });
  } catch (error) {
    console.error("getCart error:", error);
    res.json({ success: false, message: error.message || "Error" });
  }
};

export { addToCart, removeFromCart, getCart };
