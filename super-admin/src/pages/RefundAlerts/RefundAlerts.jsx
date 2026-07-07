import React, { useContext, useEffect, useState } from "react";
import "./RefundAlerts.css";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext.jsx";

const RefundAlerts = () => {
  const { url, authHeader } = useContext(AdminContext);
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/refund-alerts`, authHeader());
      if (response.data.success) setAlerts(response.data.data);
    } catch {
      toast.error("Failed to load refund alerts");
    }
  };

  const resolve = async (alertId) => {
    try {
      const response = await axios.post(`${url}/api/admin/refund-alerts/resolve`, { alertId }, authHeader());
      if (response.data.success) {
        toast.success("Alert resolved");
        fetchAlerts();
      }
    } catch {
      toast.error("Failed to resolve alert");
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(() => {
    fetchRestaurants();
  }, 10000);

  return () => clearInterval(interval);
  }, []);

  return (
    <div className="refund-alerts-page">
      <h2>Refund Failure Alerts</h2>
      <div className="alert-table">
        {alerts.map((alert) => (
          <div key={alert._id} className="alert-row">
            <div className="alert-info">
              <p>{alert.message}</p>
              <span>Order #{alert.orderId?._id} · ₹{alert.orderId?.amount?.toFixed(2)}</span>
              <span>Retry count: {alert.orderId?.refundRetryCount}</span>
              {alert.orderId?.refundNeedsManualReview && <span className="manual-review">Needs manual review</span>}
            </div>
            <button className="resolve-btn" onClick={() => resolve(alert._id)}>Mark Resolved</button>
          </div>
        ))}
        {alerts.length === 0 && <p className="empty-state">No unresolved refund alerts</p>}
      </div>
    </div>
  );
};

export default RefundAlerts;