import React, { useContext, useEffect } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import "./QuickCheckout.css";

const QuickCheckout = () => {
  const navigate = useNavigate();

  const {
    showQuickCheckout,
    setShowQuickCheckout,
    quickItem,
    cartItems,
    food_list,
    getTotalCartAmount,
  } = useContext(StoreContext);

  useEffect(() => {
    if (showQuickCheckout) {
      const timer = setTimeout(() => {
        setShowQuickCheckout(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showQuickCheckout]);

  if (!showQuickCheckout || !quickItem) return null;

  return (
    <div className="quick-toast">
<div className="quick-items">

  {Object.entries(cartItems)
    .filter(([id, qty]) => qty > 0)
    .map(([id, qty]) => {

      const item = food_list.find(
        (food) => food._id === id
      );

      if (!item) return null;

      return (
        <p key={id}>
          {item.name} × {qty}
        </p>
      );
    })}

</div>
      <p>
        Total ₹{getTotalCartAmount()}
      </p>

      <button
        onClick={() => navigate("/cart")}
      >
        Quick Checkout
      </button>

    </div>
  );
};

export default QuickCheckout;