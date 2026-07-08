import React, { useContext, useEffect, useState } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext.jsx";

const Orders = () => {
  const { url, authHeader } = useContext(AdminContext);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`, authHeader());
      if (response.data.success) setOrders(response.data.data.slice().reverse());
    } catch {
      toast.error("Failed to load orders");
    }
  };

  const retryAssignment = async (orderId) => {
    try {
      const response = await axios.post(`${url}/api/admin/retry-assignment`, { orderId }, authHeader());
      if (response.data.success) {
        toast.success("Retry triggered");
        fetchOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error("Failed to retry");
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Cancel and refund this order?")) return;
    try {
      const response = await axios.post(`${url}/api/admin/cancel-order`, { orderId }, authHeader());
      if (response.data.success) {
        toast.success("Order cancelled");
        fetchOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error("Failed to cancel order");
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
    }, []);

  return (
    <div className="admin-orders-page">
      <h2>All Orders</h2>
      <div className="admin-order-table">
        {orders.map((order) => (
          <div key={order._id} className="admin-order-row">
            <div className="admin-order-info">
              <h4>{order.items?.map((item) => `${item.name} x ${item.quantity}`).join(", ")}</h4>
              <p>{order.address?.firstName} {order.address?.lastName} · ₹{order.amount?.toFixed(2)}</p>
              <span className="status-pill">{order.status}</span>
              {order.refunded && <span className="status-pill refunded">Refunded</span>}
              {order.refundFailed && <span className="status-pill refund-failed">Refund Failed</span>}
            </div>
            <div className="row-actions">
              {order.status === "Waiting for Rider" && (
                <button className="retry-btn" onClick={() => retryAssignment(order._id)}>Retry Rider Search</button>
              )}
              {!["Delivered", "Cancelled", "Rejected"].includes(order.status) && (
                <button className="cancel-btn" onClick={() => cancelOrder(order._id)}>Cancel & Refund</button>
              )}
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="empty-state">No orders found</p>}
      </div>
    </div>
  );
};

export default Orders;