import React, { useContext, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const {
    cartItems, food_list, removeFromCart,
    getTotalCartAmount, discount, setDiscount,
    couponCode, setCouponCode,
  } = useContext(StoreContext);

  const navigate  = useNavigate();
  const subtotal  = getTotalCartAmount();

  useEffect(() => {
    if (couponCode.trim().toUpperCase() === "FIRST15" && discount > 0) {
      setDiscount(subtotal * 0.15);
    }
  }, [subtotal, couponCode, setDiscount]);

  const applyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "FIRST15") {
      if (discount > 0) return toast.info("Coupon already applied");
      setDiscount(subtotal * 0.15);
      toast.success("15% discount applied");
    } else {
      toast.error("Invalid coupon");
    }
  };

  const discountedTotal = subtotal === 0 ? 0 : (subtotal - discount + 17).toFixed(2);

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p><p>Title</p><p>Price</p>
          <p>Quantity</p><p>Total</p><p>Remove</p>
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
                <p className="cart-items-remove-icon cross" onClick={() => removeFromCart(item._id)}>X</p>
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
            <div className="cart-total-details"><p>Subtotal</p><p>₹{subtotal}</p></div>
            <br />
            <div className="cart-total-details"><p>Delivery Fee</p><p>₹{subtotal === 0 ? 0 : 17}</p></div>
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
          <button onClick={() => navigate("/order")}>PROCEED TO CHECKOUT</button>
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
                if (e.target.value.trim().toUpperCase() !== "FIRST15") setDiscount(0);
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
