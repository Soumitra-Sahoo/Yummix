import React from "react";
import "./Delivery.css";
import { useNavigate } from "react-router-dom";

const Delivery = () => {
  const navigate = useNavigate();
  return (
    <div className="delivery">
      <div className="delivery-hero">
        <h1>Fast & Reliable Delivery</h1>
        <p>Hot meals delivered to your doorstep, anytime, anywhere.</p>
      </div>
      <div className="delivery-section">
        <h2>How Delivery Works</h2>
        <div className="steps">
          <div className="step"><h3>🛒 Place Order</h3><p>Select your favorite food and place your order easily.</p></div>
          <div className="step"><h3>👨‍🍳 Restaurant Prepares</h3><p>Restaurants prepare your food fresh and hygienically.</p></div>
          <div className="step"><h3>🚚 Delivered to You</h3><p>Our delivery partners bring it to your doorstep quickly.</p></div>
        </div>
      </div>
      <div className="delivery-features">
        <h2>Why Our Delivery is Best</h2>
        <div className="features-grid">
          <div className="feature-card"><h3>⚡ Super Fast</h3><p>Quick delivery within minutes.</p></div>
          <div className="feature-card"><h3>📍 Live Tracking</h3><p>Track your order in real-time.</p></div>
          <div className="feature-card"><h3>🛡 Safe Delivery</h3><p>Hygienic and contactless delivery.</p></div>
          <div className="feature-card"><h3>💰 Affordable</h3><p>Low delivery charges and great offers.</p></div>
        </div>
      </div>
      <div className="delivery-section">
        <h2>Delivery Areas</h2>
        <p>We currently serve multiple cities and are expanding rapidly. Stay tuned as we bring Yummix to your location!</p>
      </div>
      <div className="delivery-cta">
        <h2>Hungry? Let's get your food delivered!</h2>
        <button onClick={() => navigate("/")}>Order Now</button>
      </div>
    </div>
  );
};
export default Delivery;
