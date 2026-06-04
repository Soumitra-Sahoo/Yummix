import React, { useEffect, useState } from "react";
import "./List.css";
import { url } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const List = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/restaurant-foods`, {
        headers: {
          token: localStorage.getItem("restaurantToken"),
        },
      });
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(
        `${url}/api/food/remove`,
        {
          id: foodId,
        },
        {
          headers: {
            token: localStorage.getItem("restaurantToken"),
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);

        fetchList();
      } else {
        toast.error("Error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // SEARCH FILTER
  const filteredList = list.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="list-page">
      {/* HEADER */}
      <div className="list-header">
        <div>
          <h2>Food Inventory</h2>
          <p>Total Items : {filteredList.length}</p>
        </div>

        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="modern-table">
        {/* TABLE HEADER */}
        <div className="table-header">
          <p>Food</p>
          <p>Category</p>
          <p>Price</p>
          <p>Action</p>
        </div>

        {/* TABLE BODY */}
        {filteredList.map((item, index) => (
          <div key={index} className="table-row">
            {/* FOOD */}
            <div className="food-cell">
              <img src={item.image} alt="" />

              <div>
                <h4>{item.name}</h4>

                <p>
                  {item.description.length > 15
                    ? item.description.substring(0, 15) + "..."
                    : item.description}
                </p>
              </div>
            </div>

            <div>
              <span className="category-badge">{item.category}</span>
            </div>
            <h3 className="price">₹{item.price.toFixed(2)}</h3>
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
                  if (window.confirm("Delete this food item?")) {
                    removeFood(item._id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
