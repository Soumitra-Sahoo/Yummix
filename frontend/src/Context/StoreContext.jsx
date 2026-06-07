import { createContext, useEffect, useState } from "react";
import { menu_list } from "../assets/assets";
import axios from "axios";
export const StoreContext = createContext(null);
import { toast } from "react-toastify";

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

    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
    setQuickItem(addedFood);

    try {
      if (!token) {
        setShowQuickCheckout(true);
        return;
      }

      const response = await axios.post(
        url + "/api/cart/add",
        { itemId },
        {
          headers: { token },
        },
      );

      if (response.data.success) {
        if (response.data.cartReplaced) {
          toast.info("Previous cart cleared. New item added.");

          setCartItems({
            [itemId]: 1,
          });
        }

        setShowQuickCheckout(false);

        setTimeout(() => {
          setShowQuickCheckout(true);
        }, 10);
      } else {
        setCartItems((prev) => ({
          ...prev,
          [itemId]: Math.max((prev[itemId] || 1) - 1, 0),
        }));
        toast.error(response.data.message || "Could not add item to cart");
      }
    } catch (error) {
      console.log(error);
      setCartItems((prev) => ({
        ...prev,
        [itemId]: Math.max((prev[itemId] || 1) - 1, 0),
      }));
      toast.error("Could not add item to cart");
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } },
      );
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log("Error loading cart data:", error);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(url + "/api/restaurant/list");

      if (response.data.success) {
        setRestaurants(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      await fetchRestaurants();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
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
