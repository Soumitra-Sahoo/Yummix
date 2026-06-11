import React, { useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const [data, setData] = useState({
    firstName: "", lastName: "", email: "",
    street: "", city: "", state: "",
    pincode: "", country: "", phone: "",
  });

  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    url,
    discount,
    couponCode,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const onChangeHandler = (e) =>
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude: lat, longitude: lon } = position.coords;
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const a = res.data.address;
          setData((prev) => ({
            ...prev,
            street:  a.road || a.suburb || "",
            city:    a.city || a.town || a.village || "",
            state:   a.state || "",
            country: a.country || "",
            pincode: a.postcode || "",
          }));
          toast.success("Location fetched");
        } catch {
          toast.error("Failed to fetch address");
        }
      },
      () => toast.error("Location permission denied")
    );
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    const orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({ ...item, quantity: cartItems[item._id] });
      }
    });

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() - discount + 17,
      couponCode,
    };

    const response = await axios.post(`${url}/api/order/place`, orderData, {
      headers: { token },
    });

    if (response.data.success) {
      window.location.replace(response.data.session_url);
    } else {
      toast.error(response.data.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please sign in to place an order");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  const subtotal = getTotalCartAmount();

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Shipping Information</p>
        <button type="button" className="location-btn" onClick={fetchLocation}>
          Use Current Location
        </button>
        <div className="multi-field">
          <input type="text" name="firstName" onChange={onChangeHandler} value={data.firstName} placeholder="First name" required />
          <input type="text" name="lastName"  onChange={onChangeHandler} value={data.lastName}  placeholder="Last name"  required />
        </div>
        <input type="email" name="email"   onChange={onChangeHandler} value={data.email}   placeholder="Email address" required />
        <input type="text"  name="street"  onChange={onChangeHandler} value={data.street}  placeholder="Street"        required />
        <div className="multi-field">
          <input type="text" name="city"  onChange={onChangeHandler} value={data.city}  placeholder="City"  required />
          <input type="text" name="state" onChange={onChangeHandler} value={data.state} placeholder="State" required />
        </div>
        <div className="multi-field">
          <input type="text" name="pincode" onChange={onChangeHandler} value={data.pincode} placeholder="Pin code" required />
          <input type="text" name="country" onChange={onChangeHandler} value={data.country} placeholder="Country"  required />
        </div>
        <input type="text" name="phone" onChange={onChangeHandler} value={data.phone} placeholder="Phone" required />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{subtotal}</p>
            </div>
            <br />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{subtotal === 0 ? 0 : 17}</p>
            </div>
            {discount > 0 && (
              <>
                <hr />
                <div className="cart-total-details">
                  <p>Discount</p>
                  <p>-₹{discount.toFixed(2)}</p>
                </div>
              </>
            )}
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{subtotal === 0 ? 0 : (subtotal - discount + 17).toFixed(2)}</b>
            </div>
          </div>
        </div>
        <button className="place-order-submit" type="submit">
          Confirm & Pay
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;
