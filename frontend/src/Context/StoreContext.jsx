import { createContext, useEffect, useState } from "react";
import { menu_list } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const RADIUS_KM = 10;

const StoreContextProvider = ({ children }) => {
  const url = "https://yummix-backend.vercel.app";

  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [showQuickCheckout, setShowQuickCheckout] = useState(false);
  const [quickItem, setQuickItem] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");

  const getUserLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        filterNearbyRestaurants(loc, restaurants);
      },
      () => {
        setNearbyRestaurants(restaurants);
      },
    );
  };

  const filterNearbyRestaurants = (loc, allRestaurants) => {
    if (!loc) {
      setNearbyRestaurants(allRestaurants);
      return;
    }
    const nearby = allRestaurants.filter((r) => {
      if (!r.location?.lat || !r.location?.lng) return true;
      return (
        haversineKm(loc.lat, loc.lng, r.location.lat, r.location.lng) <=
        RADIUS_KM
      );
    });
    setNearbyRestaurants(nearby);
  };

  const addToCart = async (itemId) => {
    const addedFood = food_list.find((food) => food._id === itemId);
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
        { headers: { token } },
      );
      if (response.data.success) {
        if (response.data.cartReplaced) {
          toast.info("Previous cart cleared. New item added.");
          setCartItems({ [itemId]: 1 });
        }
        setShowQuickCheckout(false);
        setTimeout(() => setShowQuickCheckout(true), 10);
      } else {
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
        error.response?.data?.message || "Could not add item to cart",
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(
        `${url}/api/cart/remove`,
        { itemId },
        { headers: { token } },
      );
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
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data || []);
    } catch (error) {
      console.error("fetchFoodList:", error);
    }
  };

  const loadCartData = async (authToken) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token: authToken } },
      );
      if (response.data.success) setCartItems(response.data.cartData);
    } catch (error) {
      console.error("loadCartData:", error);
    }
  };

  const fetchUserProfile = async (authToken) => {
    try {
      const response = await axios.get(`${url}/api/user/profile`, {
        headers: {
          token: authToken,
        },
      });
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.log("Profile Error:", error);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`${url}/api/restaurant/list`);
      if (response.data.success) {
        setRestaurants(response.data.data);
        setNearbyRestaurants(response.data.data);
      }
    } catch (error) {
      console.error("fetchRestaurants:", error);
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
        await fetchUserProfile(storedToken);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (restaurants.length > 0) getUserLocation();
  }, [restaurants]);

  useEffect(() => {
    if (userLocation && restaurants.length > 0) {
      filterNearbyRestaurants(userLocation, restaurants);
    }
  }, [userLocation]);

  const contextValue = {
    url,
    food_list,
    restaurants,
    nearbyRestaurants,
    userLocation,
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
    user,
    setUser,
    fetchUserProfile,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
