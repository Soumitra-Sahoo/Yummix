import React, { useState, useEffect } from "react";
import "./RatingModal.css";
import StarRating from "../StarRating/StarRating";
import axios from "axios";
import { toast } from "react-toastify";

const RatingModal = ({ order, url, token, onClose }) => {
  const [ratings, setRatings] = useState({});
  const [existing, setExisting] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const res = await axios.post(
          `${url}/api/rating/order/${order._id}`,
          {},
          { headers: { token } }
        );
        if (res.data.success) {
          setExisting(res.data.data);
          setRatings(res.data.data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchExisting();
  }, [order._id]);

  const handleStar = (foodId, stars) => {
    setRatings((prev) => ({ ...prev, [foodId]: stars }));
  };

  const handleSubmit = async () => {
    const entries = Object.entries(ratings);
    if (entries.length === 0) {
      toast.error("Please rate at least one item");
      return;
    }
    setSubmitting(true);
    let success = 0;
    for (const [foodId, stars] of entries) {
      try {
        const res = await axios.post(
          `${url}/api/rating/submit`,
          { foodId, orderId: order._id, stars },
          { headers: { token } }
        );
        if (res.data.success) success++;
        else toast.error(res.data.message);
      } catch (e) {
        console.error(e);
      }
    }
    setSubmitting(false);
    if (success > 0) {
      toast.success(`${success} rating${success > 1 ? "s" : ""} submitted!`);
      onClose();
    }
  };

   const uniqueItems = order.items.filter(
    (item, idx, arr) =>
      arr.findIndex((i) => (i._id || i.id) === (item._id || item.id)) === idx
  );

  return (
    <div className="rating-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="rating-modal">
        {/* Header */}
        <div className="rating-modal-header">
          <div>
            <h2>Rate Your Order</h2>
            <p>How was the food? Your feedback helps others.</p>
          </div>
          <button className="rating-close" onClick={onClose}>✕</button>
        </div>

        {/* Items */}
        <div className="rating-items">
          {uniqueItems.map((item) => {
            const foodId = item._id || item.id;
            const currentStars = ratings[foodId] || 0;
            const isAlreadyRated = !!existing[foodId];

            return (
              <div key={foodId} className="rating-item">
                <img src={item.image} alt={item.name} />
                <div className="rating-item-info">
                  <h4>{item.name}</h4>
                  <p>Qty: {item.quantity} · ₹{item.price}</p>
                  {isAlreadyRated && (
                    <span className="already-rated-badge">✓ Already rated — update below</span>
                  )}
                </div>
                <div className="rating-item-stars">
                  <StarRating
                    rating={currentStars}
                    interactive
                    size="lg"
                    onRate={(stars) => handleStar(foodId, stars)}
                  />
                  {currentStars > 0 && (
                    <span className="star-label">
                      {["","Poor","Fair","Good","Great","Excellent"][currentStars]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="rating-modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className="btn-submit-rating"
            onClick={handleSubmit}
            disabled={submitting || Object.keys(ratings).length === 0}
          >
            {submitting ? "Submitting..." : "Submit Ratings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
