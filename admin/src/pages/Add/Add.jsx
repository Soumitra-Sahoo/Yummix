import React, { useState } from "react";
import "./Add.css";
import { assets, url } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Add = () => {
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Biriyani",
  });

  const [image, setImage] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);
    const response = await axios.post(`${url}/api/food/add`, formData, {
      headers: {
        token: localStorage.getItem("restaurantToken"),
      },
    });
    if (response.data.success) {
      toast.success(response.data.message);
      setData({
        name: "",
        description: "",
        price: "",
        category: "Biriyani",
      });
      setImage(false);
    } else {
      toast.error(response.data.message);
    }
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  return (
    <div className="add-page">
      {/* PAGE HEADER */}
      <div className="add-page-header">
        <br />
        <h2>Add New Food</h2>
        <p>Create and publish food items for customers</p>
      </div>

      {/* MAIN CONTAINER */}
      <div className="add-container">
        {/* LEFT FORM */}
        <div className="add">
          <form className="flex-col" onSubmit={onSubmitHandler}>
            <div className="add-img-upload flex-col">
              <p>Upload image</p>

              <label htmlFor="image">
                <img
                  src={!image ? assets.upload_area : URL.createObjectURL(image)}
                  alt=""
                />
              </label>

              <input
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
                type="file"
                id="image"
                hidden
                required
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
                placeholder="Enter Product description..."
                required
              />
            </div>

            <div className="add-category-price">
              <div className="add-category flex-col">
                <p>Product category</p>

                <select name="category" onChange={onChangeHandler}>
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
                />
              </div>
            </div>

            <button type="submit" className="add-btn">
              Save Food Item
            </button>
          </form>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="preview-section">
          <h2>Live Preview</h2>

          <div className="food-preview-card">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
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
