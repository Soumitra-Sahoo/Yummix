import React, { useEffect, useState } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets, url } from "../../assets/assets";

const RESTAURANT_TRANSITIONS = {
  "Order Placed": ["Order Placed", "Confirmed", "Rejected"],
  Confirmed: ["Confirmed", "Preparing Food", "Rejected"],
  "Preparing Food": ["Preparing Food", "Ready for Pickup"],
};

const STATUS_CLASS = {
  "Order Placed": "processing",
  Confirmed: "confirmed",
  "Preparing Food": "preparing",
  "Ready for Pickup": "ready",
  "Waiting for Rider": "waiting",
  "Rider Assigned": "assigned",
  "Picked Up": "picked",
  "Out for Delivery": "delivery",
  Delivered: "delivered",
  Cancelled: "cancelled",
  Rejected: "rejected",
};

const Order = () => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/restaurant-orders`, {
        headers: { token: localStorage.getItem("restaurantToken") },
      });
      if (response.data.success) {
        setOrders(response.data.data.slice().reverse());
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${url}/api/order/restaurant-status`,
        { orderId, status: event.target.value },
        { headers: { token: localStorage.getItem("restaurantToken") } },
      );
      if (response.data.success) {
        fetchAllOrders();
        toast.success("Status updated");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h2>Orders Management</h2>
        <p>Total Orders : {orders.length}</p>
      </div>

      <div className="orders-container">
        {orders.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#9ca3af",
            }}
          >
            <p style={{ fontSize: 48, marginBottom: 12 }}>📦</p>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e" }}>
              No orders yet
            </h3>
            <p style={{ fontSize: 14 }}>
              Orders from customers will appear here
            </p>
          </div>
        )}

        {orders.map((order, index) => {
          const isCOD = order.paymentMethod === "cod";
          const isPaid = order.payment;

          return (
            <div key={index} className="modern-order-card">
              {/* LEFT */}
              <div className="order-left">
                <div className="order-icon-box">
                  <img src={assets.parcel_icon} alt="" />
                </div>

                <div className="order-info">
                  <h3>
                    {order.items.map((item, i) =>
                      i === order.items.length - 1
                        ? `${item.name} x ${item.quantity}`
                        : `${item.name} x ${item.quantity}, `,
                    )}
                  </h3>

                  <div className="customer-info">
                    <h4>
                      {order.address?.firstName} {order.address?.lastName}
                    </h4>
                    <p>{order.address?.street}</p>
                    <p>
                      {order.address?.city}, {order.address?.state},{" "}
                      {order.address?.country}
                    </p>
                    <p>📞 {order.address?.phone}</p>
                  </div>

                  <div className="order-tags">
                    {isCOD ? (
                      <span
                        className={`tag ${isPaid ? "tag-paid" : "tag-cod"}`}
                      >
                        {isPaid ? "✅ COD Paid" : "💵 Cash on Delivery"}
                      </span>
                    ) : (
                      <span className="tag tag-paid">💳 Paid Online</span>
                    )}
                    {order.riderId && (
                      <span className="tag tag-rider">
                        🛵 {order.riderId?.name || "Rider Assigned"}
                      </span>
                    )}
                    {order.riderAssignmentFailed && (
                      <span className="tag tag-alert">
                        ⚠️ No rider found after 5 tries
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="order-right">
                <div className="order-stat">
                  <span>Items</span>
                  <h3>{order.items.length}</h3>
                </div>
                <div className="order-stat">
                  <span>Total</span>
                  <h3>₹{order.amount?.toFixed(2)}</h3>
                </div>

                <div
                  className={`status-badge ${STATUS_CLASS[order.status] || "processing"}`}
                >
                  <span className="status-dot" />
                  {RESTAURANT_TRANSITIONS[order.status] ? (
                    <select
                      onChange={(e) => statusHandler(e, order._id)}
                      value={order.status}
                    >
                      {RESTAURANT_TRANSITIONS[order.status].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="status-locked">{order.status}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Order;
