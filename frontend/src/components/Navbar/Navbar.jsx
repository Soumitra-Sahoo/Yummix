import React, { useContext, useEffect, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";

const Navbar = ({ setShowLogin, setSearchQuery }) => {
  const [menu, setMenu] = useState("home");
  const [showSearch, setShowSearch] = useState(false);
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    const words = ["Biryani..", "Roll..", "Pizza..", "Cake...", "Pasta..."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typing = setInterval(() => {
      const currentWord = words[wordIndex];

      if (!isDeleting) {
        setPlaceholder(currentWord.substring(0, charIndex + 1));
        charIndex++;

        if (charIndex === currentWord.length) {
          isDeleting = true;
        }
      } else {
        setPlaceholder(currentWord.substring(0, charIndex - 1));
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
    }, 220);

    return () => clearInterval(typing);
  }, []);

  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img className="logo" src={assets.logo} alt="" />
      </Link>
      {!showSearch && (
        <ul className="navbar-menu">
          <Link
            to="/"
            onClick={() => setMenu("home")}
            className={`${menu === "home" ? "active" : ""}`}
          >
            Home
          </Link>
          <span
            onClick={() => {
              setMenu("menu");
              navigate("/");

              setTimeout(() => {
                document
                  .getElementById("explore-menu")
                  ?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className={`${menu === "menu" ? "active" : ""}`}
          >
            Menu
          </span>
          <span
            onClick={() => {
              setMenu("mob-app");
              navigate("/");

              setTimeout(() => {
                document
                  .getElementById("app-download")
                  ?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className={`${menu === "mob-app" ? "active" : ""}`}
          >
            Mobile App
          </span>
          <span
            onClick={() => {
              setMenu("contact");
              navigate("/");

              setTimeout(() => {
                document
                  .getElementById("footer")
                  ?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className={`${menu === "contact" ? "active" : ""}`}
          >
            Contact Us
          </span>
        </ul>
      )}
      <div className="navbar-right">
        {!showSearch && (
          <img
            src={assets.search_icon}
            alt=""
            onClick={() => setShowSearch(true)}
            style={{ cursor: "pointer" }}
          />
        )}

        {showSearch && (
          <div className="search-container">
            <input
              type="text"
              className="search-box-large"
              placeholder={`Search for ${placeholder}`}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);

                if (value.trim() === "") {
                  setShowSearch(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setShowSearch(false);
                }
              }}
            />

            <span
              className="close-btn"
              onClick={() => {
                setShowSearch(false);
                setSearchQuery("");
                navigate("/");
              }}
            >
              ✖
            </span>
          </div>
        )}
        <Link to="/cart" className="navbar-search-icon">
          <img src={assets.basket_icon} alt="" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="navbar-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                {" "}
                <img src={assets.bag_icon} alt="" /> <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                {" "}
                <img src={assets.logout_icon} alt="" /> <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
