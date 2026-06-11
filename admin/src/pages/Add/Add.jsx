import React, { useState } from "react";
import "./Add.css";
import { assets, url } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const CATEGORIES = [
  "Biriyani", "Rolls", "Deserts", "Sandwich", "Cake",
  "Pure Veg", "Pasta", "Noodles", "Pizza", "Snacks",
  "Beverages", "Breakfast", "Chinese", "Thali", "Others"
];

const INITIAL_DATA = {
  name: "", description: "", price: "",
  category: "Biriyani", prepTime: "",
  spiceLevel: "Medium", tags: [], isAvailable: true,
};

const TAG_OPTIONS = ["Bestseller", "New", "Veg", "Non-Veg", "Spicy", "Chef's Special"];

const Add = () => {
  const [data, setData] = useState(INITIAL_DATA);
  const [image, setImage] = useState(null);
  const [queue, setQueue] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const onChangeHandler = (e) =>
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleTag = (tag) =>
    setData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));

  const resetForm = () => { setData(INITIAL_DATA); setImage(null); };

  const addToQueue = () => {
    if (!data.name || !data.price || !image) {
      toast.error("Name, price and image are required");
      return;
    }
    setQueue((prev) => [
      ...prev,
      { ...data, imagePreview: URL.createObjectURL(image), imageFile: image },
    ]);
    toast.success(`"${data.name}" added to queue`);
    resetForm();
  };

  const removeFromQueue = (index) =>
    setQueue((prev) => prev.filter((_, i) => i !== index));

  const submitSingle = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Please upload a food image");
    await submitItem(data, image);
    resetForm();
  };

  const submitAll = async () => {
    if (queue.length === 0) return toast.error("Queue is empty");
    setSubmitting(true);
    let success = 0;
    for (const item of queue) {
      const ok = await submitItem(item, item.imageFile, true);
      if (ok) success++;
    }
    toast.success(`${success}/${queue.length} items saved successfully`);
    setQueue([]);
    setSubmitting(false);
  };

  const submitItem = async (itemData, imageFile, silent = false) => {
    try {
      const formData = new FormData();
      formData.append("name", itemData.name);
      formData.append("description", itemData.description);
      formData.append("price", Number(itemData.price));
      formData.append("category", itemData.category);
      formData.append("prepTime", itemData.prepTime);
      formData.append("spiceLevel", itemData.spiceLevel);
      formData.append("tags", JSON.stringify(itemData.tags));
      formData.append("isAvailable", itemData.isAvailable);
      formData.append("image", imageFile);

      const response = await axios.post(`${url}/api/food/add`, formData, {
        headers: { token: localStorage.getItem("restaurantToken") },
      });
      if (response.data.success) {
        if (!silent) toast.success(response.data.message);
        return true;
      } else {
        if (!silent) toast.error(response.data.message);
        return false;
      }
    } catch (err) {
      if (!silent) toast.error(err.response?.data?.message || "Failed to add item");
      return false;
    }
  };

  return (
    <div className="add-page">
      <div className="add-page-header">
        <h2>Add New Food</h2>
        <p>Fill in the details below and save or queue multiple items at once</p>
      </div>

      <div className="add-layout">
        <form className="add-form" onSubmit={submitSingle}>
          <div className="form-row-top">
            <div className="image-upload-box">
              <label htmlFor="image" className="image-label">
                <img
                  src={image ? URL.createObjectURL(image) : assets.upload_area}
                  alt="upload"
                  className={image ? "uploaded" : "placeholder"}
                />
                {!image && <span>Click to upload image</span>}
              </label>
              <input onChange={(e) => setImage(e.target.files[0] || null)}
                type="file" id="image" accept="image/*" hidden />
            </div>

            <div className="basic-info">
              <div className="field-group">
                <label>Food Name *</label>
                <input name="name" value={data.name} onChange={onChangeHandler}
                  type="text" placeholder="e.g. Chicken Biryani" required />
              </div>
              <div className="field-group">
                <label>Description</label>
                <textarea name="description" value={data.description}
                  onChange={onChangeHandler} rows={3}
                  placeholder="Describe the dish — ingredients, taste, portion..." />
              </div>
            </div>
          </div>

          <div className="form-row-3">
            <div className="field-group">
              <label>Category *</label>
              <select name="category" value={data.category} onChange={onChangeHandler}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label>Price (₹) *</label>
              <input type="number" name="price" value={data.price}
                onChange={onChangeHandler} placeholder="0" min="1" required />
            </div>
            <div className="field-group">
              <label>Prep Time (mins)</label>
              <input type="number" name="prepTime" value={data.prepTime}
                onChange={onChangeHandler} placeholder="e.g. 20" min="1" />
            </div>
          </div>

          <div className="form-row-2">
            <div className="field-group">
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
            <div className="field-group">
              <label>Availability</label>
              <div className="toggle-row">
                <div className={`toggle-switch ${data.isAvailable ? "on" : "off"}`}
                  onClick={() => setData((p) => ({ ...p, isAvailable: !p.isAvailable }))}>
                  <div className="toggle-thumb" />
                </div>
                <span className={data.isAvailable ? "avail-on" : "avail-off"}>
                  {data.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>
          </div>

          <div className="field-group">
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

          <div className="form-actions">
            <button type="submit" className="btn-save">Save Item</button>
            <button type="button" className="btn-queue" onClick={addToQueue}>+ Add to Queue</button>
            <button type="button" className="btn-reset" onClick={resetForm}>Reset</button>
          </div>
        </form>

        <div className="add-queue">
          <div className="queue-header">
            <div>
              <h3>Item Queue</h3>
              <p>{queue.length} item{queue.length !== 1 ? "s" : ""} ready to save</p>
            </div>
            {queue.length > 0 && (
              <button className="btn-submit-all" onClick={submitAll} disabled={submitting}>
                {submitting ? "Saving..." : `Save All (${queue.length})`}
              </button>
            )}
          </div>
          {queue.length === 0 ? (
            <div className="queue-empty">
              <p>Queue is empty</p>
              <span>Use "Add to Queue" to batch multiple items, then save them all at once.</span>
            </div>
          ) : (
            <div className="queue-list">
              {queue.map((item, i) => (
                <div key={i} className="queue-item">
                  <img src={item.imagePreview} alt={item.name} />
                  <div className="queue-item-info">
                    <h4>{item.name}</h4>
                    <p>₹{item.price} · {item.category}</p>
                    {item.tags.length > 0 && (
                      <div className="queue-tags">
                        {item.tags.map((t) => <span key={t}>{t}</span>)}
                      </div>
                    )}
                  </div>
                  <button className="queue-remove" onClick={() => removeFromQueue(i)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Add;
