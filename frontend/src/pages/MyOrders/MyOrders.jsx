import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";
import RatingModal from "../../components/RatingModal/RatingModal";

const STATUS_STEPS = [
  "Food Processing",
  "Preparing Food",
  "Waiting for Rider",
  "Rider Assigned",
  "Picked Up",
  "Out for Delivery",
  "Delivered",
];

const STATUS_COLOR = {
  "Food Processing": { color: "#d97706", bg: "#fef9c3", dot: "#f59e0b" },
  "Preparing Food": { color: "#ea580c", bg: "#ffedd5", dot: "#f97316" },
  "Waiting for Rider": { color: "#6b7280", bg: "#f3f4f6", dot: "#9ca3af" },
  "Rider Assigned": { color: "#2563eb", bg: "#eff6ff", dot: "#3b82f6" },
  "Picked Up": { color: "#7c3aed", bg: "#f5f3ff", dot: "#8b5cf6" },
  "Out for Delivery": { color: "#0891b2", bg: "#ecfeff", dot: "#06b6d4" },
  Delivered: { color: "#16a34a", bg: "#dcfce7", dot: "#22c55e" },
};

const MyOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingOrder, setRatingOrder] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { url, token } = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { token } },
      );
      setData((response.data.data || []).slice().reverse());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="my-orders">
        <h2>My Orders</h2>
        <div className="orders-loading">
          {[1, 2, 3].map((i) => (
            <div key={i} className="order-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="my-orders">
        <h2>My Orders</h2>
        <div className="orders-empty">
          <p>🍽</p>
          <h3>No orders yet</h3>
          <span>
            Your order history will appear here once you place an order.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders">
      <div className="my-orders-header">
        <h2>My Orders</h2>
        <p>
          {data.length} order{data.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="orders-list">
        {data.map((order, index) => {
          const statusStyle =
            STATUS_COLOR[order.status] || STATUS_COLOR["Food Processing"];
          const isDelivered = order.status === "Delivered";
          const isExpanded = expandedOrder === order._id;
          const stepIdx = STATUS_STEPS.indexOf(order.status);
          const rider = order.riderId;
          const isCOD = order.paymentMethod === "cod";

          return (
            <div key={index} className="order-card">
              {/* ── Top Row ── */}
              <div className="order-card-left">
                <div className="order-parcel-icon">
                  <img src={assets.parcel_icon} alt="order" />
                </div>
                <div className="order-card-info">
                  <p className="order-items-text">
                    {order.items.map((item, i) =>
                      i === order.items.length - 1
                        ? `${item.name} × ${item.quantity}`
                        : `${item.name} × ${item.quantity}, `,
                    )}
                  </p>
                  <p className="order-meta">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                    {" · "}
                    <span className="order-amount">
                      ₹{order.amount.toFixed(2)}
                    </span>
                    {" · "}
                    {/* ✅ COD / Paid badge */}
                    {isCOD ? (
                      <span
                        className={`payment-pill ${order.payment ? "paid" : "cod-pending"}`}
                      >
                        {order.payment ? "✅ COD Paid" : "💵 Pay on Delivery"}
                      </span>
                    ) : (
                      <span className="payment-pill paid">💳 Paid Online</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="order-card-right">
                <div
                  className="order-status-badge"
                  style={{
                    background: statusStyle.bg,
                    color: statusStyle.color,
                  }}
                >
                  <span
                    className="status-dot"
                    style={{ background: statusStyle.dot }}
                  />
                  {order.status}
                </div>

                <div className="order-actions">
                  <button
                    className="btn-track"
                    onClick={() => {
                      fetchOrders();
                      setExpandedOrder(isExpanded ? null : order._id);
                    }}
                  >
                    {isExpanded ? "Hide" : "Track"}
                  </button>
                  {isDelivered && (
                    <button
                      className="btn-rate"
                      onClick={() => setRatingOrder(order)}
                    >
                      ⭐ Rate
                    </button>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="order-expanded">
                  {isCOD && !order.payment && (
                    <div className="cod-banner">
                      💵 Please keep <strong>₹{order.amount.toFixed(2)}</strong>{" "}
                      ready to pay the delivery partner in cash.
                    </div>
                  )}

                  {/* Rider Info Card */}
                  {rider && (
                    <div className="rider-info-card">
                      <img
                        src={
                          rider.profileImage ||
                          `https://ui-avatars.com/api/?name=${rider.name}`
                        }
                        alt={rider.name}
                        className="rider-avatar"
                      />
                      <div className="rider-details">
                        <p className="rider-name">🛵 {rider.name}</p>
                        <p className="rider-vehicle">{rider.vehicleNumber}</p>
                      </div>
                      <a href={`tel:${rider.phone}`} className="rider-call-btn">
                        📞 Call
                      </a>
                    </div>
                  )}

                  {/* Status Timeline */}
                  <div className="order-timeline">
                    {STATUS_STEPS.map((step, i) => {
                      const isDone = i <= stepIdx;
                      const isCurrent = i === stepIdx;
                      return (
                        <div
                          key={step}
                          className={`timeline-step ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}
                        >
                          <div className="timeline-dot">
                            {isDone ? "✓" : ""}
                          </div>
                          <div className="timeline-line" />
                          <span className="timeline-label">{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {ratingOrder && (
        <RatingModal
          order={ratingOrder}
          url={url}
          token={token}
          onClose={() => setRatingOrder(null)}
        />
      )}
    </div>
  );
};

export default MyOrders;
