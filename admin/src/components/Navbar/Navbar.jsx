import React, { useEffect, useState } from "react";
import "./Navbar.css";
import axios from "axios";
import { assets, url } from "../../assets/assets";

const Navbar = ({ setToken }) => {
  const [restaurant, setRestaurant] = useState(null);
  const logout = () => {
    localStorage.removeItem("restaurantToken");
    setToken("");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("restaurantToken");
        if (!token) return;

        const res = await axios.get(`${url}/api/restaurant/profile`, {
          headers: { token },
        });

        if (res.data?.success) setRestaurant(res.data.restaurant);
      } catch (err) {
        // silent
        console.error("Failed to load restaurant profile", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="" />
      <div className="navbar-right">
        <span className="restaurant-name">{restaurant?.restaurantName}</span>

        <img
          className="profile"
          src={restaurant?.image || assets.profile_image}
          alt=""
        />

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
