import React from "react";
import "./Partner.css";

const Partner = () => {
  return (
    <div className="partner">
      <div className="partner-hero">
        <h1>Partner With Yummix</h1>
        <p>
          Join thousands of restaurants growing their business with Yummix.
        </p>
      </div>

      <div className="partner-section">
        <h2>Why Partner With Us?</h2>

        <div className="partner-features">
          <div className="feature-card">
            <h3>📈 Increase Sales</h3>
            <p>Reach more customers and grow your restaurant's revenue.</p>
          </div>

          <div className="feature-card">
            <h3>🚀 Fast Onboarding</h3>
            <p>Create your restaurant account and start selling quickly.</p>
          </div>

          <div className="feature-card">
            <h3>🛵 Reliable Delivery</h3>
            <p>Our rider network delivers orders efficiently to customers.</p>
          </div>

          <div className="feature-card">
            <h3>📊 Powerful Dashboard</h3>
            <p>
              Manage menu, orders, analytics, coupons and much more from one
              place.
            </p>
          </div>
        </div>
      </div>

      <div className="partner-cta">
        <h2>Ready to Join Yummix?</h2>

        <p>
          Register your restaurant, manage your menu, receive orders and track
          your business through the Yummix Restaurant Portal.
        </p>

        <a
          href="https://yummix-admin.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="partner-btn"
        >
          Register Your Restaurant →
        </a>
      </div>
    </div>
  );
};

export default Partner;