import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";
import RatingModal from "../../components/RatingModal/RatingModal";

const STATUS_COLOR = {
  "Food Processing": { color: "#d97706", bg: "#fef9c3", dot: "#f59e0b" },
  "Out for delivery": { color: "#2563eb", bg: "#eff6ff", dot: "#3b82f6" },
  "Delivered":        { color: "#16a34a", bg: "#dcfce7", dot: "#22c55e" },
};

const MyOrders = () => {
  const [data, setData]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [ratingOrder, setRatingOrder] = useState(null); // order being rated
  const { url, token }            = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      setData((response.data.data || []).reverse());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) fetchOrders(); }, [token]);

  if (loading) {
    return (
      <div className="my-orders">
        <h2>My Orders</h2>
        <div className="orders-loading">
          {[1,2,3].map((i) => <div key={i} className="order-skeleton" />)}
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
          <span>Your order history will appear here once you place an order.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders">
      <div className="my-orders-header">
        <h2>My Orders</h2>
        <p>{data.length} order{data.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="orders-list">
        {data.map((order, index) => {
          const statusStyle = STATUS_COLOR[order.status] || STATUS_COLOR["Food Processing"];
          const isDelivered = order.status === "Delivered";

          return (
            <div key={index} className="order-card">
              {/* Left: icon + items */}
              <div className="order-card-left">
                <div className="order-parcel-icon">
                  <img src={assets.parcel_icon} alt="order" />
                </div>
                <div className="order-card-info">
                  <p className="order-items-text">
                    {order.items.map((item, i) =>
                      i === order.items.length - 1
                        ? `${item.name} × ${item.quantity}`
                        : `${item.name} × ${item.quantity}, `
                    )}
                  </p>
                  <p className="order-meta">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    {" · "}
                    <span className="order-amount">₹{order.amount.toFixed(2)}</span>
                  </p>
                </div>
              </div>

              {/* Right: status + actions */}
              <div className="order-card-right">
                {/* Status badge */}
                <div
                  className="order-status-badge"
                  style={{ background: statusStyle.bg, color: statusStyle.color }}
                >
                  <span
                    className="status-dot"
                    style={{ background: statusStyle.dot }}
                  />
                  {order.status}
                </div>

                {/* Buttons */}
                <div className="order-actions">
                  <button className="btn-track" onClick={fetchOrders}>
                    Refresh
                  </button>
                  {isDelivered && (
                    <button
                      className="btn-rate"
                      onClick={() => setRatingOrder(order)}
                    >
                      ⭐ Rate Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rating Modal */}
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
