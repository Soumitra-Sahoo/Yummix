import React, { useContext, useEffect, useState } from "react";
import "./Riders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext.jsx";

const Riders = () => {
  const { url, authHeader } = useContext(AdminContext);
  const [riders, setRiders] = useState([]);

  const fetchRiders = async () => {
    try {
      const response = await axios.get(`${url}/api/rider/pending`, authHeader());
      if (response.data.success) setRiders(response.data.data);
    } catch {
      toast.error("Failed to load riders");
    }
  };

  const approve = async (riderId) => {
    try {
      const response = await axios.post(`${url}/api/rider/approve`, { riderId }, authHeader());
      if (response.data.success) {
        toast.success("Rider approved");
        fetchRiders();
      }
    } catch {
      toast.error("Failed to approve");
    }
  };

  const reject = async (riderId) => {
    try {
      const response = await axios.post(`${url}/api/rider/reject`, { riderId }, authHeader());
      if (response.data.success) {
        toast.success("Rider rejected");
        fetchRiders();
      }
    } catch {
      toast.error("Failed to reject");
    }
  };

  useEffect(() => {
    fetchRiders();
    const interval = setInterval(fetchRiders, 5000);
  return () => clearInterval(interval);
  }, []);

  return (
    <div className="riders-page">
      <h2>Pending Rider Approvals</h2>
      <div className="rider-table">
        {riders.map((rider) => (
          <div key={rider._id} className="rider-row">
            <img src={rider.profileImage} alt={rider.name} />
            <div className="rider-info">
              <h4>{rider.name}</h4>
              <p>{rider.email} · {rider.phone}</p>
              <p>{rider.vehicleType} · {rider.vehicleNumber}</p>
            </div>
            <div className="rider-docs">
              <a href={rider.aadhaarImage} target="_blank" rel="noreferrer">Aadhaar</a>
              <a href={rider.licenseImage} target="_blank" rel="noreferrer">License</a>
            </div>
            <div className="row-actions">
              <button className="approve-btn" onClick={() => approve(rider._id)}>Approve</button>
              <button className="reject-btn" onClick={() => reject(rider._id)}>Reject</button>
            </div>
          </div>
        ))}
        {riders.length === 0 && <p className="empty-state">No pending riders</p>}
      </div>
    </div>
  );
};

export default Riders;