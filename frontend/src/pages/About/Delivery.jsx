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
          <div className="step">
            <h3>🛒 Place Order</h3>
            <p>Select your favorite food and place your order in seconds.</p>
          </div>

          <div className="step">
            <h3>👨‍🍳 Restaurant Prepares</h3>
            <p>Restaurants prepare your food fresh and hygienically.</p>
          </div>

          <div className="step">
            <h3>🛵 Delivered to You</h3>
            <p>Our verified delivery partners bring it safely to your doorstep.</p>
          </div>
        </div>
      </div>

      <div className="delivery-features">
        <h2>Why Choose Yummix Delivery?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <h3>⚡ Super Fast</h3>
            <p>Quick deliveries with optimized rider assignment.</p>
          </div>

          <div className="feature-card">
            <h3>📍 Live Tracking</h3>
            <p>Track your order in real-time from restaurant to doorstep.</p>
          </div>

          <div className="feature-card">
            <h3>🛡 Safe Delivery</h3>
            <p>Verified delivery partners and secure order handling.</p>
          </div>

          <div className="feature-card">
            <h3>💰 Affordable</h3>
            <p>Low delivery charges with exciting offers and discounts.</p>
          </div>
        </div>
      </div>

      <div className="delivery-section">
        <h2>Delivery Areas</h2>

        <p>
          We are expanding rapidly across multiple cities to serve more
          customers with reliable and timely deliveries.
        </p>
      </div>

      <div className="delivery-partner">
        <h2>Become a Delivery Partner</h2>

        <p>
          Earn money on your own schedule by delivering with Yummix. Register,
          manage deliveries and track your earnings from the Rider Portal.
        </p>

        <a
          href="https://rider-eta-rust.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="delivery-btn"
        >
          Join as Delivery Partner →
        </a>
      </div>

      <div className="delivery-cta">
        <h2>Hungry? Order your favourite food now!</h2>

        <button onClick={() => navigate("/")}>
          Order Now
        </button>
      </div>
    </div>
  );
};

export default Delivery;