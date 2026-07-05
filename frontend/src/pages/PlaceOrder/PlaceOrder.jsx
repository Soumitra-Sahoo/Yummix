import React, { useEffect, useState, useContext } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

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

  const BASE_DELIVERY_FEE = 17;
  const PER_KM_DELIVERY_RATE = 4;
  const FREE_KM_THRESHOLD = 2;

  const calcDeliveryFee = (userLocation, restaurant) => {
    if (!userLocation?.lat || !restaurant?.location?.lat) {
      return BASE_DELIVERY_FEE;
    }
    const distKm = haversineKm(
      userLocation.lat,
      userLocation.lng,
      restaurant.location.lat,
      restaurant.location.lng,
    );
    const extraKm = Math.max(0, distKm - FREE_KM_THRESHOLD);
    return Math.round(BASE_DELIVERY_FEE + extraKm * PER_KM_DELIVERY_RATE);
  };


const PlaceOrder = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    phone: "",
  });

  const [customerLocation, setCustomerLocation] = useState({
    lat: null,
    lng: null,
  });

  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [placing, setPlacing] = useState(false);

  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    url,
    discount,
    setDiscount,
    couponCode,
    setCouponCode,
    userLocation,
    restaurants,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const subtotal = getTotalCartAmount();
  const cartFoodId = Object.keys(cartItems).find((id) => cartItems[id] > 0);

  const cartFood = food_list.find((f) => f._id === cartFoodId);

  const cartRestaurant = restaurants.find(
    (r) => r._id === cartFood?.restaurantId,
  );

  const deliveryFee =
    subtotal === 0 ? 0 : calcDeliveryFee(customerLocation, cartRestaurant);

  const onChangeHandler = (e) =>
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  useEffect(() => {
  if (userLocation?.lat && !customerLocation.lat) {
    setCustomerLocation(userLocation);
  }
}, [userLocation, customerLocation.lat]);

  const fetchLocation = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude: lat, longitude: lon } = position.coords;
          setCustomerLocation({ lat, lng: lon });
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
          );
          const a = res.data.address;
          setData((prev) => ({
            ...prev,
            street: a.road || a.suburb || "",
            city: a.city || a.town || a.village || "",
            state: a.state || "",
            country: a.country || "",
            pincode: a.postcode || "",
          }));
          toast.success("Location fetched!");
        } catch {
          toast.error("Failed to fetch address");
        }
      },
      () => toast.error("Location permission denied"),
    );
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);

    const orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({ ...item, quantity: cartItems[item._id] });
      }
    });

    const orderData = {
      address: data,
      items: orderItems,
      amount: subtotal - discount + deliveryFee,
      couponCode,
      customerLocation,
    };

    try {
      if (paymentMethod === "cod") {
        const response = await axios.post(
          `${url}/api/order/place-cod`,
          orderData,
          { headers: { token } },
        );
        if (response.data.success) {
          toast.success(
            "🎉 Order placed! Pay ₹" +
              (subtotal - discount + deliveryFee).toFixed(2) +
              " on delivery.",
          );
          setDiscount(0);
          setCouponCode("");
          navigate("/myorders");
        } else {
          toast.error(response.data.message || "Something went wrong");
        }
      } else {
        const response = await axios.post(`${url}/api/order/place`, orderData, {
          headers: { token },
        });
        if (response.data.success) {
          setDiscount(0);
          setCouponCode("");
          window.location.replace(response.data.session_url);
        } else {
          toast.error(response.data.message || "Something went wrong");
        }
      }
    } catch {
      toast.error("Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please sign in to place an order");
      navigate("/cart");
    } else if (subtotal === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <button type="button" className="location-btn" onClick={fetchLocation}>
          📍 Use Current Location
        </button>

        <div className="multi-field">
          <input
            type="text" 
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            placeholder="First name"
            required
          />
          <input
            type="text"
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            placeholder="Last name"
            required
          />
        </div>
        <input
          type="email"
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          placeholder="Email address"
          required
        />
        <input
          type="text"
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          placeholder="Street"
          required
        />
        <div className="multi-field">
          <input
            type="text"
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            placeholder="City"
            required
          />
          <input
            type="text"
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            placeholder="State"
            required
          />
        </div>
        <div className="multi-field">
          <input
            type="text"
            name="pincode"
            onChange={onChangeHandler}
            value={data.pincode}
            placeholder="Pin code"
            required
          />
          <input
            type="text"
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            placeholder="Country"
            required
          />
        </div>
        <input
          type="text"
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          placeholder="Phone"
          required
        />

        {customerLocation.lat && (
          <p className="location-saved">
            ✅ Location saved for delivery tracking
          </p>
        )}

        <p className="title" style={{ marginTop: 24 }}>
          Payment Method
        </p>
        <div className="payment-methods">
          <label
            className={`payment-option ${paymentMethod === "stripe" ? "selected" : ""}`}
            onClick={() => setPaymentMethod("stripe")}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="stripe"
              checked={paymentMethod === "stripe"}
              onChange={() => setPaymentMethod("stripe")}
            />
            <div className="payment-option-content">
              <span className="payment-icon">💳</span>
              <div>
                <p className="payment-label">Pay Online</p>
                <p className="payment-sub">
                  Credit / Debit card, UPI, Net Banking
                </p>
              </div>
            </div>
          </label>

          <label
            className={`payment-option ${paymentMethod === "cod" ? "selected" : ""}`}
            onClick={() => setPaymentMethod("cod")}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            <div className="payment-option-content">
              <span className="payment-icon">💵</span>
              <div>
                <p className="payment-label">Cash on Delivery</p>
                <p className="payment-sub">
                  Pay in cash when your order arrives
                </p>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* ── RIGHT: Order Summary ── */}
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Order Summary</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{subtotal.toFixed(2)}</p>
            </div>
            <br />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{deliveryFee}</p>
            </div>
            {discount > 0 && (
              <>
                <hr />
                <div className="cart-total-details">
                  <p>Discount (15%)</p>
                  <p style={{ color: "#16a34a" }}>-₹{discount.toFixed(2)}</p>
                </div>
              </>
            )}
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{(subtotal - discount + deliveryFee).toFixed(2)}</b>
            </div>
            {cartRestaurant?.location?.lat && customerLocation?.lat && (
              <p
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  marginTop: 6,
                }}
              >
                Based on distance from {cartRestaurant.restaurantName}
              </p>
            )}

            {!cartRestaurant?.location?.lat && (
              <p
                style={{
                  fontSize: 11,
                  color: "#f59e0b",
                  marginTop: 6,
                }}
              >
                ⚠ Restaurant location not set — flat fee applied
              </p>
            )}
          </div>
        </div>

        {/* Payment badge */}
        <div className={`payment-badge ${paymentMethod}`}>
          {paymentMethod === "cod"
            ? "💵 Cash on Delivery"
            : "💳 Pay Securely Online"}
        </div>

        <button className="place-order-submit" type="submit" disabled={placing}>
          {placing
            ? "Placing Order..."
            : paymentMethod === "cod"
              ? "Place Order (COD)"
              : "Proceed to Payment"}
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;
