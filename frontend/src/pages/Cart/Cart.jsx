import React, { useContext, useEffect, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// ✅ Issue 1 Fix: Dynamic delivery fee based on distance (haversine)
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

const calcDeliveryFee = (userLocation, nearestRestaurant) => {
  if (!userLocation?.lat || !nearestRestaurant?.location?.lat) {
    return BASE_DELIVERY_FEE;
  }
  const distKm = haversineKm(
    userLocation.lat,
    userLocation.lng,
    nearestRestaurant.location.lat,
    nearestRestaurant.location.lng,
  );
  const extraKm = Math.max(0, distKm - FREE_KM_THRESHOLD);
  return Math.round(BASE_DELIVERY_FEE + extraKm * PER_KM_DELIVERY_RATE);
};

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    discount,
    setDiscount,
    couponCode,
    setCouponCode,
    userLocation,
    nearbyRestaurants,
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
    subtotal === 0 ? 0 : calcDeliveryFee(userLocation, cartRestaurant);

  useEffect(() => {
    if (couponCode.trim().toUpperCase() === "FIRST15" && discount > 0) {
      setDiscount(subtotal * 0.15);
    }
  }, [subtotal, couponCode, setDiscount]);

  const applyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "FIRST15") {
      if (discount > 0) return toast.info("Coupon already applied");
      setDiscount(subtotal * 0.15);
      toast.success("15% discount applied!");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const discountedTotal =
    subtotal === 0 ? 0 : (subtotal - discount + deliveryFee).toFixed(2);

  const hasItems = food_list.some((item) => cartItems[item._id] > 0);

  if (!hasItems) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-card">
          <div className="cart-empty-icon">🛒</div>

          <h2>Your cart is feeling lonely</h2>

          <p>
            Discover delicious meals from nearby restaurants and start building
            your order.
          </p>

          <div className="cart-empty-features">
            <span>🍔 Fresh Food</span>
            <span>⚡ Fast Delivery</span>
            <span>🎁 Exclusive Offers</span>
          </div>

          <button
            className="cart-empty-btn"
            onClick={() => {
              document.body.classList.add("page-leaving");
              setTimeout(() => {
                navigate("/");
              }, 200);
            }}
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (!cartItems[item._id]) return null;
          return (
            <div key={item._id}>
              <div className="cart-items-title cart-items-item">
                <img src={item.image} alt={item.name} />
                <p>{item.name}</p>
                <p>₹{item.price.toFixed(2)}</p>
                <div>{cartItems[item._id]}</div>
                <p>₹{(item.price * cartItems[item._id]).toFixed(2)}</p>
                <p
                  className="cart-items-remove-icon cross"
                  onClick={() => removeFromCart(item._id)}
                >
                  X
                </p>
              </div>
              <hr />
            </div>
          );
        })}
      </div>

      <div className="cart-bottom">
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
              <div>
                <p>₹{deliveryFee}</p>
                {cartRestaurant?.location?.lat && userLocation?.lat && (
                  <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                    Based on distance from {cartRestaurant.restaurantName}
                  </p>
                )}
                {!cartRestaurant?.location?.lat && (
                  <p style={{ fontSize: 11, color: "#f59e0b", marginTop: 2 }}>
                    ⚠ Restaurant location not set — flat fee applied
                  </p>
                )}
              </div>
            </div>
            {discount > 0 && (
              <>
                <hr />
                <div className="cart-total-details">
                  <p>Discount (15%)</p>
                  <p>-₹{discount.toFixed(2)}</p>
                </div>
              </>
            )}
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{discountedTotal}</b>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="cart-promocode">
          <p>Apply Your Coupon Code</p>
          <div className="cart-promocode-input">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);
                if (e.target.value.trim().toUpperCase() !== "FIRST15") {
                  setDiscount(0);
                }
              }}
            />
            <button onClick={applyCoupon}>Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
