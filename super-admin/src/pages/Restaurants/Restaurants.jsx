import React, { useContext, useEffect, useState } from "react";
import "./Restaurants.css";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext.jsx";

const getStatus = (r) => {
  if (r.rejected) return "Rejected";
  if (r.isApproved) return "Approved";
  return "Pending";
};

const Restaurants = () => {
  const { url, authHeader } = useContext(AdminContext);
  const [restaurants, setRestaurants] = useState([]);
  const [filter, setFilter] = useState("All");

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`${url}/api/restaurant/all`, authHeader());
      if (response.data.success) setRestaurants(response.data.data);
    } catch {
      toast.error("Failed to load restaurants");
    }
  };

  const approve = async (restaurantId) => {
    try {
      const response = await axios.post(`${url}/api/restaurant/approve`, { restaurantId }, authHeader());
      if (response.data.success) {
        toast.success("Restaurant approved");
        fetchRestaurants();
      }
    } catch {
      toast.error("Failed to approve");
    }
  };

  const reject = async (restaurantId) => {
    try {
      const response = await axios.post(`${url}/api/restaurant/reject`, { restaurantId }, authHeader());
      if (response.data.success) {
        toast.success("Restaurant rejected");
        fetchRestaurants();
      }
    } catch {
      toast.error("Failed to reject");
    }
  };

  useEffect(() => {
    fetchRestaurants();
    const interval = setInterval(() => {
    fetchRestaurants();
  }, 10000);

  return () => clearInterval(interval);
  }, []);

  const filtered = restaurants.filter((r) => filter === "All" || getStatus(r) === filter);

  return (
    <div className="restaurants-page">
      <div className="page-header">
        <h2>Restaurant Management</h2>
        <div className="filter-tabs">
          {["All", "Pending", "Approved", "Rejected"].map((f) => (
            <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>
      <div className="restaurant-table">
        {filtered.map((r) => (
          <div key={r._id} className="restaurant-row">
            <img src={r.image} alt={r.restaurantName} />
            <div className="restaurant-info">
              <h4>{r.restaurantName}</h4>
              <p>{r.ownerName} · {r.phone}</p>
              <p>{r.address}</p>
            </div>
            <span className={`status-badge status-${getStatus(r).toLowerCase()}`}>{getStatus(r)}</span>
            {getStatus(r) === "Pending" && (
              <div className="row-actions">
                <button className="approve-btn" onClick={() => approve(r._id)}>Approve</button>
                <button className="reject-btn" onClick={() => reject(r._id)}>Reject</button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="empty-state">No restaurants found</p>}
      </div>
    </div>
  );
};

export default Restaurants;