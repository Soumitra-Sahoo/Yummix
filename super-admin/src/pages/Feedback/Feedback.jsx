import React, { useContext, useEffect, useState } from "react";
import "./Feedback.css";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext.jsx";

const Feedback = () => {
  const { url, authHeader } = useContext(AdminContext);
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`${url}/api/contact/list`, authHeader());
      if (response.data.success) setSubmissions(response.data.data);
    } catch {
      toast.error("Failed to load submissions");
    }
  };

  useEffect(() => {
    fetchSubmissions();
    const interval = setInterval(fetchSubmissions, 10000);
    return () => clearInterval(interval);
    }, []);

  const filtered = submissions.filter((s) => filter === "all" || s.type === filter);

  return (
    <div className="feedback-admin-page">
      <div className="page-header">
        <h2>Feedback & Partner Requests</h2>
        <div className="filter-tabs">
          {["all", "feedback", "partner"].map((f) => (
            <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>
      <div className="submission-table">
        {filtered.map((s) => (
          <div key={s._id} className="submission-row">
            <span className={`type-badge type-${s.type}`}>{s.type}</span>
            <div className="submission-info">
              <h4>{s.name}</h4>
              <p>{s.email} {s.phone && `· ${s.phone}`}</p>
              {s.restaurant && <p>Restaurant: {s.restaurant}</p>}
              {s.city && <p>City: {s.city}</p>}
              {s.rating && <p>Rating: {s.rating}</p>}
              <p>{s.message}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="empty-state">No submissions found</p>}
      </div>
    </div>
  );
};

export default Feedback;