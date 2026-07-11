import React, { useEffect, useState } from "react";
import "./List.css";
import { url } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SPICE_CONFIG = {
  "Mild":      { color: "#16a34a", bg: "#dcfce7" },
  "Medium":    { color: "#d97706", bg: "#fef9c3" },
  "Hot":       { color: "#ea580c", bg: "#ffedd5" },
  "Extra Hot": { color: "#dc2626", bg: "#fee2e2" },
};

const List = () => {
  const [list, setList]     = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/restaurant-foods`, {
        headers: { token: localStorage.getItem("restaurantToken") },
      });
      if (response.data.success) setList(response.data.data);
      else toast.error("Error fetching items");
    } catch (error) {
      console.error(error);
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(
        `${url}/api/food/remove`,
        { id: foodId },
        { headers: { token: localStorage.getItem("restaurantToken") } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else toast.error("Error");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleAvailability = async (item) => {
    try {
      const response = await axios.post(
        `${url}/api/food/update`,
        {
          id: item._id,
          name: item.name,
          description: item.description,
          category: item.category,
          price: item.price,
          isAvailable: !item.isAvailable,
          tags: JSON.stringify(item.tags || []),
          spiceLevel: item.spiceLevel,
          prepTime: item.prepTime,
        },
        { headers: { token: localStorage.getItem("restaurantToken") } }
      );
      if (response.data.success) {
        toast.success(`"${item.name}" marked as ${!item.isAvailable ? "Available" : "Unavailable"}`);
        fetchList();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update availability");
    }
  };

  useEffect(() => { fetchList(); }, []);

  const filteredList = list
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => {
      if (filter === "Available")   return item.isAvailable !== false;
      if (filter === "Unavailable") return item.isAvailable === false;
      return true;
    });

  const availableCount   = list.filter((i) => i.isAvailable !== false).length;
  const unavailableCount = list.filter((i) => i.isAvailable === false).length;

  return (
    <div className="list-page">
      <div className="list-header">
        <div>
          <h2>Food Inventory</h2>
          <p>{filteredList.length} of {list.length} items</p>
        </div>
        <div className="list-controls">
          <div className="filter-tabs">
            {["All", "Available", "Unavailable"].map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}>
                {f}
                <span className="filter-count">
                  {f === "All" ? list.length : f === "Available" ? availableCount : unavailableCount}
                </span>
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="modern-table">
        <div className="table-header">
          <b>Food</b>
          <b>Category</b>
          <b>Details</b>
          <b>Price</b>
          <b>Status</b>
          <b>Actions</b>
        </div>

        {filteredList.length === 0 ? (
          <div className="table-empty">No items found.</div>
        ) : (
          filteredList.map((item) => {
            const spice = SPICE_CONFIG[item.spiceLevel];
            return (
              <div key={item._id} className={`table-row ${item.isAvailable === false ? "row-unavailable" : ""}`}>
                <div className="food-cell">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h4>{item.name}</h4>
                    <p>
                      {item.description?.length > 30
                        ? item.description.substring(0, 30) + "..."
                        : item.description}
                    </p>
                    {item.tags && item.tags.length > 0 && (
                      <div className="item-tags">
                        {item.tags.map((t) => (
                          <span key={t} className="item-tag">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <span className="category-badge">{item.category}</span>
                </div>
                <div className="item-details">
                  {spice && (
                    <span
                      className="detail-chip"
                      style={{ color: spice.color, background: spice.bg }}
                    >
                      🌶 {item.spiceLevel}
                    </span>
                  )}
                  {item.prepTime && (
                    <span className="detail-chip detail-time">
                      ⏱ {item.prepTime}m
                    </span>
                  )}
                </div>
                <h3 className="price">₹{item.price?.toFixed(2)}</h3>
                <div>
                  <div
                    className={`avail-toggle ${item.isAvailable !== false ? "on" : "off"}`}
                    onClick={() => toggleAvailability(item)}
                    title="Click to toggle availability"
                  >
                    <div className="avail-thumb" />
                    <span>{item.isAvailable !== false ? "Live" : "Off"}</span>
                  </div>
                </div>
                <div className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/edit/${item._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      if (window.confirm(`Delete "${item.name}"?`)) removeFood(item._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default List;
