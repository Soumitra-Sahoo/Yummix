import React, { useEffect, useState } from "react";
import "./EditFood.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { url } from "../../assets/assets";

const EditFood = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    image: "",
  });

  const fetchFood = async () => {
    try {
      const response = await axios.get(`${url}/api/food/restaurant-foods`, {
        headers: {
          token: localStorage.getItem("restaurantToken"),
        },
      });

      if (response.data.success) {
        const foodItem = response.data.data.find((item) => item._id === id);

        if (foodItem) {
          setData(foodItem);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error loading food item");
    }
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateFood = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${url}/api/food/update`,
        {
          id,
          name: data.name,
          description: data.description,
          category: data.category,
          price: data.price,
        },
        {
          headers: {
            token: localStorage.getItem("restaurantToken"),
          },
        },
      );

      if (response.data.success) {
        toast.success("Food Updated Successfully");

        navigate("/list");
      } else {
        toast.error("Update Failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchFood();
  }, []);

  return (
    <div className="edit-food">
      <div className="edit-food-container">
        <div className="edit-header">
          <div>
            <h2>Edit Food Item</h2>
            <p>Update food details easily</p>
          </div>

          <button className="back-btn" onClick={() => navigate("/list")}>
            Back
          </button>
        </div>

        <form className="edit-food-form" onSubmit={updateFood}>
          <div className="image-preview-section">
            <img src={data.image} alt="" />
          </div>

          <div className="form-group">
            <label>Food Name</label>

            <input
              type="text"
              name="name"
              value={data.name}
              onChange={onChangeHandler}
              placeholder="Enter food name"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={data.description}
              onChange={onChangeHandler}
              placeholder="Enter food description"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>

              <select
                name="category"
                value={data.category}
                onChange={onChangeHandler}
              >
                <option value="Salad">Salad</option>
                <option value="Rolls">Rolls</option>
                <option value="Deserts">Deserts</option>
                <option value="Sandwich">Sandwich</option>
                <option value="Cake">Cake</option>
                <option value="Pure Veg">Pure Veg</option>
                <option value="Pasta">Pasta</option>
                <option value="Noodles">Noodles</option>
                <option value="Biriyani">Biriyani</option>
              </select>
            </div>

            <div className="form-group">
              <label>Price</label>

              <input
                type="number"
                name="price"
                value={data.price}
                onChange={onChangeHandler}
                placeholder="₹ Price"
                required
              />
            </div>
          </div>

          <button type="submit" className="update-btn">
            Update Food
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditFood;
