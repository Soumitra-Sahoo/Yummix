import React, { useState } from "react";
import "./Feedback.css";

const Feedback = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your feedback! 🙌");

    setForm({
      name: "",
      email: "",
      rating: "",
      message: ""
    });
  };

  return (
    <div className="feedback">

      {/* HERO */}
      <div className="feedback-hero">
        <h1>We Value Your Feedback</h1>
        <p>Help us improve your experience with Yummix.</p>
      </div>

      {/* FORM */}
      <div className="feedback-form">
        <h2>Share Your Experience</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Rating */}
          <select
            name="rating"
            value={form.rating}
            onChange={handleChange}
            required
          >
            <option value="">Rate us</option>
            <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
            <option value="4">⭐⭐⭐⭐ Good</option>
            <option value="3">⭐⭐⭐ Average</option>
            <option value="2">⭐⭐ Poor</option>
            <option value="1">⭐ Very Bad</option>
          </select>

          <textarea
            name="message"
            placeholder="Write your feedback..."
            value={form.message}
            onChange={handleChange}
            required
          />

          <button type="submit">Submit Feedback</button>
        </form>
      </div>

    </div>
  );
};

export default Feedback;