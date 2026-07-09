import React, { useContext } from "react";
import "./ExploreMenu.css";
import { StoreContext } from "../../Context/StoreContext";

const ExploreMenu = ({ category, setCategory }) => {
  const { menu_list } = useContext(StoreContext);

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Discover Delicious Options Today</h1>
      <p className="explore-menu-text">
        Browse, choose, and order your favorite meal in just one tap!
      </p>

      <div className="explore-menu-list">
        <div
          className="explore-menu-list-item"
          onClick={() => setCategory("All")}
        >
          <div className={`all-icon ${category === "All" ? "active" : ""}`}>
            🍽
          </div>
          <p>All</p>
        </div>

        {menu_list.map((item, index) => (
          <div
            key={index}
            className="explore-menu-list-item"
            onClick={() =>
              setCategory((prev) =>
                prev === item.menu_name ? "All" : item.menu_name
              )
            }
          >
            <img
              src={item.menu_image}
              className={category === item.menu_name ? "active" : ""}
              alt={item.menu_name}
            />
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
