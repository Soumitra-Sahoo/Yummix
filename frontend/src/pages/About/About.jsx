import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about">

      {/* HERO SECTION */}
      <div className="about-hero">
        <h1>About Yummix</h1>
        <p>Your favorite food, delivered fast & fresh.</p>
      </div>

      {/* STORY */}
      <div className="about-section">
        <h2>Our Story</h2>
        <p>
          Yummix was created with one simple goal — to make food ordering
          effortless and enjoyable. From local street food to premium restaurants,
          we bring everything to your fingertips.
        </p>
      </div>

      {/* MISSION */}
      <div className="about-section">
        <h2>Our Mission</h2>
        <p>
          We aim to connect people with the best food around them, ensuring
          quick delivery, great taste, and a seamless digital experience.
        </p>
      </div>

      {/* WHY CHOOSE US */}
      <div className="about-features">
        <h2>Why Choose Yummix?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <h3>⚡ Fast Delivery</h3>
            <p>Get your food delivered quickly and reliably.</p>
          </div>

          <div className="feature-card">
            <h3>🍽 Wide Variety</h3>
            <p>Explore hundreds of dishes from top restaurants.</p>
          </div>

          <div className="feature-card">
            <h3>📱 Easy Ordering</h3>
            <p>Simple and intuitive app for smooth ordering.</p>
          </div>

          <div className="feature-card">
            <h3>💳 Secure Payments</h3>
            <p>Multiple payment options with full security.</p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="about-stats">
        <div>
          <h2>10K+</h2>
          <p>Orders Delivered</p>
        </div>
        <div>
          <h2>500+</h2>
          <p>Restaurants</p>
        </div>
        <div>
          <h2>50K+</h2>
          <p>Happy Users</p>
        </div>
      </div>

      {/* CTA */}
      <div className="about-cta">
        <h2>Ready to explore delicious food?</h2>
        <button onClick={() => window.location.href = "/"}>
          Order Now
        </button>
      </div>

    </div>
  );
};

export default About;