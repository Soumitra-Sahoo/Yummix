import React, { useState } from "react";
import "./Partner.css";
import { toast } from "react-toastify";

const INITIAL = { name: "", restaurant: "", phone: "", city: "", message: "" };

const Partner = () => {
  const [form, setForm] = useState(INITIAL);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Request Submitted! We will contact you soon.");
    setForm(INITIAL);
  };

  return (
    <div className="partner">
      <div className="partner-hero">
        <h1>Partner With Yummix</h1>
        <p>Grow your business by reaching thousands of customers.</p>
      </div>
      <div className="partner-section">
        <h2>Why Partner With Us?</h2>
        <div className="partner-features">
          <div className="feature-card"><h3>📈 Increase Sales</h3><p>Reach more customers and grow your revenue.</p></div>
          <div className="feature-card"><h3>🚀 Fast Onboarding</h3><p>Get started quickly with our simple process.</p></div>
          <div className="feature-card"><h3>📦 Reliable Delivery</h3><p>We handle logistics while you focus on food.</p></div>
          <div className="feature-card"><h3>💡 Marketing Support</h3><p>Promote your restaurant with our platform.</p></div>
        </div>
      </div>
      <div className="partner-form">
        <h2>Join Us Today</h2>
        <form onSubmit={handleSubmit}>
          <input type="text"  name="name"       placeholder="Your Name"           value={form.name}       onChange={handleChange} required />
          <input type="text"  name="restaurant" placeholder="Restaurant Name"     value={form.restaurant} onChange={handleChange} required />
          <input type="tel"   name="phone"      placeholder="Phone Number"        value={form.phone}      onChange={handleChange} required />
          <input type="text"  name="city"       placeholder="City"                value={form.city}       onChange={handleChange} required />
          <textarea           name="message"    placeholder="Tell us about your business..." value={form.message} onChange={handleChange} />
          <button type="submit">Submit Request</button>
        </form>
      </div>
    </div>
  );
};
export default Partner;
