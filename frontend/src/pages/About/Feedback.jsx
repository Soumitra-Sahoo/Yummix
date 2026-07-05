import React, { useContext, useState } from "react";
import "./Feedback.css";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../Context/StoreContext";

const INITIAL = {
  name: "",
  email: "",
  rating: "",
  message: "",
};

const Feedback = () => {
  const [form, setForm] = useState(INITIAL);
  const { url } = useContext(StoreContext);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${url}/api/contact/feedback`,
        form
      );

      if (res.data.success) {
        toast.success("Thank you for your feedback! 🙌");
        setForm(INITIAL);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Feedback Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="feedback">
      <div className="feedback-hero">
        <h1>We Value Your Feedback</h1>
        <p>Help us improve your experience with Yummix.</p>
      </div>

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