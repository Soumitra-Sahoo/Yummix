import { createContext, useEffect, useState } from "react";
import { menu_list } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "https://yummix-backend.vercel.app";
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [showQuickCheckout, setShowQuickCheckout] = useState(false);
  const [quickItem, setQuickItem] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");

  const addToCart = async (itemId) => {
    const addedFood = food_list.find((food) => food._id === itemId);

    // Optimistic update
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    setQuickItem(addedFood);

    if (!token) {
      setShowQuickCheckout(true);
      return;
    }

    try {
      const response = await axios.post(
        `${url}/api/cart/add`,
        { itemId },
        { headers: { token } }
      );

      if (response.data.success) {
        if (response.data.cartReplaced) {
          toast.info("Previous cart cleared. New item added.");
          setCartItems({ [itemId]: 1 });
        }
        // Trigger quick checkout re-render
        setShowQuickCheckout(false);
        setTimeout(() => setShowQuickCheckout(true), 10);
      } else {
        // Rollback optimistic update
        setCartItems((prev) => ({
          ...prev,
          [itemId]: Math.max((prev[itemId] || 1) - 1, 0),
        }));
        toast.error(response.data.message || "Could not add item to cart");
      }
    } catch (error) {
      setCartItems((prev) => ({
        ...prev,
        [itemId]: Math.max((prev[itemId] || 1) - 1, 0),
      }));
      toast.error(
        error.response?.data?.message || error.message || "Could not add item to cart"
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
    }
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      if (cartItems[id] > 0) {
        const item = food_list.find((p) => p._id === id);
        if (item) total += item.price * cartItems[id];
      }
    }
    return total;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    setFoodList(response.data.data);
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token } });
      if (response.data.success) setCartItems(response.data.cartData);
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`${url}/api/restaurant/list`);
      if (response.data.success) setRestaurants(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      await fetchRestaurants();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    };
    loadData();
  }, []);

  const contextValue = {
    url,
    food_list,
    restaurants,
    menu_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    loadCartData,
    setCartItems,
    showQuickCheckout,
    setShowQuickCheckout,
    quickItem,
    setQuickItem,
    discount,
    setDiscount,
    couponCode,
    setCouponCode,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
