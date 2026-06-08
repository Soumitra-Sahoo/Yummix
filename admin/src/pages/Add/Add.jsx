import React, { useState } from "react";
import "./Add.css";
import { assets, url } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const INITIAL_DATA = {
  name: "",
  description: "",
  price: "",
  category: "Biriyani",
};

const Add = () => {
  const [data, setData] = useState(INITIAL_DATA);
  const [image, setImage] = useState(null);

  const onChangeHandler = (e) =>
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Please upload a food image");

    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, k === "price" ? Number(v) : v));
    formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData, {
        headers: { token: localStorage.getItem("restaurantToken") },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setData(INITIAL_DATA);
        setImage(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add food item");
    }
  };

  return (
    <div className="add-page">
      <div className="add-page-header">
        <br />
        <h2>Add New Food</h2>
        <p>Create and publish food items for customers</p>
      </div>
      <div className="add-container">
        <div className="add">
          <form className="flex-col" onSubmit={onSubmitHandler}>
            <div className="add-img-upload flex-col">
              <p>Upload image</p>
              <label htmlFor="image">
                <img
                  src={image ? URL.createObjectURL(image) : assets.upload_area}
                  alt="food preview"
                />
              </label>
              <input
                onChange={(e) => setImage(e.target.files[0] || null)}
                type="file"
                id="image"
                accept="image/*"
                hidden
              />
            </div>

            <div className="add-product-name flex-col">
              <p>Product name</p>
              <input
                name="name"
                onChange={onChangeHandler}
                value={data.name}
                type="text"
                placeholder="Menu name"
                required
              />
            </div>

            <div className="add-product-description flex-col">
              <p>Product Details</p>
              <textarea
                name="description"
                onChange={onChangeHandler}
                value={data.description}
                rows={4}
                placeholder="Enter product description..."
                required
              />
            </div>

            <div className="add-category-price">
              <div className="add-category flex-col">
                <p>Product category</p>
                <select name="category" value={data.category} onChange={onChangeHandler}>
                  <option value="Biriyani">Biriyani</option>
                  <option value="Rolls">Rolls</option>
                  <option value="Deserts">Deserts</option>
                  <option value="Sandwich">Sandwich</option>
                  <option value="Cake">Cake</option>
                  <option value="Pure Veg">Pure Veg</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Noodles">Noodles</option>
                </select>
              </div>

              <div className="add-price flex-col">
                <p>Product Price</p>
                <input
                  type="number"
                  name="price"
                  onChange={onChangeHandler}
                  value={data.price}
                  placeholder="₹99"
                  min="1"
                  required
                />
              </div>
            </div>

            <button type="submit" className="add-btn">
              Save Food Item
            </button>
          </form>
        </div>

        <div className="preview-section">
          <h2>Live Preview</h2>
          <div className="food-preview-card">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="preview"
            />
            <h3>{data.name || "Food Name"}</h3>
            <p className="preview-price">₹ {data.price || "99"}</p>
            <p className="preview-description">
              {data.description || "Spicy & tasty food description"}
            </p>
            <span className="preview-category">{data.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
