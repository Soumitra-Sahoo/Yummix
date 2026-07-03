import React, { useContext } from "react";
import "./Profile.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, cartItems, setToken, setUser } = useContext(StoreContext);
  const navigate = useNavigate();

  const cartCount = Object.values(cartItems).reduce(
    (sum, qty) => sum + qty,
    0
  );

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="profile-page">

      <div className="profile-card">
        <div className="profile-avatar">
          {user?.name?.charAt(0)}
        </div>

        <h2>{user?.name}</h2>

        <p>{user?.email}</p>
      </div>

      <div className="profile-stats">

        <div className="stat-box">
          <h3>{cartCount}</h3>
          <span>Cart Items</span>
        </div>

        <div className="stat-box">
          <h3>{user?.hasUsedFirstCoupon ? "Used" : "Available"}</h3>
          <span>FIRST15 Coupon</span>
        </div>

      </div>

      <div className="profile-actions">

        <button
          className="profile-btn"
          onClick={() => navigate("/myorders")}
        >
          📦 My Orders
        </button>

        <button
          className="profile-btn logout-btn"
          onClick={logout}
        >
          🚪 Logout
        </button>

      </div>

    </div>
  );
};

export default Profile;