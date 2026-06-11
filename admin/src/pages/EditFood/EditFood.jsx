import React, { useEffect, useState } from "react";
import "./EditFood.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { url } from "../../assets/assets";

const CATEGORIES = [
  "Biriyani", "Rolls", "Deserts", "Sandwich", "Cake",
  "Pure Veg", "Pasta", "Noodles", "Pizza", "Snacks",
  "Beverages", "Breakfast", "Chinese", "Thali", "Others"
];

const TAG_OPTIONS = ["Bestseller", "New", "Veg", "Non-Veg", "Spicy", "Chef's Special"];

const EditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "", description: "", category: "", price: "",
    image: "", prepTime: "", spiceLevel: "Medium",
    tags: [], isAvailable: true,
  });

  const fetchFood = async () => {
    try {
      const response = await axios.get(`${url}/api/food/restaurant-foods`, {
        headers: { token: localStorage.getItem("restaurantToken") },
      });
      if (response.data.success) {
        const item = response.data.data.find((f) => f._id === id);
        if (item) setData({ ...item, tags: item.tags || [] });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading food item");
    }
  };

  const onChangeHandler = (e) =>
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleTag = (tag) =>
    setData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));

  const updateFood = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${url}/api/food/update`,
        {
          id, name: data.name, description: data.description,
          category: data.category, price: data.price,
          prepTime: data.prepTime, spiceLevel: data.spiceLevel,
          tags: JSON.stringify(data.tags), isAvailable: data.isAvailable,
        },
        { headers: { token: localStorage.getItem("restaurantToken") } }
      );
      if (response.data.success) {
        toast.success("Food Updated Successfully");
        navigate("/list");
      } else {
        toast.error("Update Failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => { fetchFood(); }, []);

  return (
    <div className="edit-food">
      <div className="edit-food-container">
        <div className="edit-header">
          <div>
            <h2>Edit Food Item</h2>
            <p>Update food details easily</p>
          </div>
          <button className="back-btn" onClick={() => navigate("/list")}>← Back</button>
        </div>

        <form className="edit-food-form" onSubmit={updateFood}>
          <div className="image-preview-section">
            <img src={data.image} alt={data.name} />
          </div>

          <div className="form-group">
            <label>Food Name</label>
            <input type="text" name="name" value={data.name}
              onChange={onChangeHandler} placeholder="Food name" required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={data.description}
              onChange={onChangeHandler} placeholder="Food description" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={data.category} onChange={onChangeHandler}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input type="number" name="price" value={data.price}
                onChange={onChangeHandler} placeholder="Price" required min="1" />
            </div>
            <div className="form-group">
              <label>Prep Time (mins)</label>
              <input type="number" name="prepTime" value={data.prepTime}
                onChange={onChangeHandler} placeholder="e.g. 20" min="1" />
            </div>
          </div>

          <div className="form-group">
            <label>Spice Level</label>
            <div className="spice-selector">
              {["Mild", "Medium", "Hot", "Extra Hot"].map((level) => (
                <button key={level} type="button"
                  className={`spice-btn spice-${level.toLowerCase().replace(" ", "-")} ${data.spiceLevel === level ? "active" : ""}`}
                  onClick={() => setData((p) => ({ ...p, spiceLevel: level }))}>
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tags-row">
              {TAG_OPTIONS.map((tag) => (
                <button key={tag} type="button"
                  className={`tag-btn ${data.tags.includes(tag) ? "active" : ""}`}
                  onClick={() => toggleTag(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Availability</label>
            <div className="toggle-row">
              <div className={`toggle-switch ${data.isAvailable ? "on" : "off"}`}
                onClick={() => setData((p) => ({ ...p, isAvailable: !p.isAvailable }))}>
                <div className="toggle-thumb" />
              </div>
              <span className={data.isAvailable ? "avail-on" : "avail-off"}>
                {data.isAvailable ? "Available to customers" : "Hidden from customers"}
              </span>
            </div>
          </div>

          <button type="submit" className="update-btn">Update Food</button>
        </form>
      </div>
    </div>
  );
};

export default EditFood;
