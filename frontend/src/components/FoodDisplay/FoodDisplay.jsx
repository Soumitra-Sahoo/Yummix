import React, { useContext } from "react";
import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";
import { StoreContext } from "../../Context/StoreContext";
import placeholder from "../../assets/placeholder.webp"; // fallback image

const FoodDisplay = ({ category, searchQuery, foods, restaurantName }) => {
  const { food_list, restaurants } = useContext(StoreContext);

  const displayFoods = foods || food_list;
  const query = (searchQuery || "").toLowerCase();

  //  Priority-based filtering
  const filteredFood = displayFoods
    .map((item) => {
      const name = item.name.toLowerCase();
      const categoryName = item.category.toLowerCase();
      let priority = 0;
      if (categoryName.includes(query)) {
        priority = 3;
      } else if (name.startsWith(query)) {
        priority = 2;
      } else if (name.includes(query)) {
        priority = 1;
      }

      return { ...item, priority };
    })
    .filter((item) => {
      const matchesCategory = category === "All" || item.category === category;

      return item.priority > 0 && matchesCategory;
    })
    .sort((a, b) => b.priority - a.priority);

  //  this for fallback UI
  const matchesMenu = food_list.some((item) =>
    item.category.toLowerCase().includes(query),
  );

  return (
    <div className="food-display" id="food-display">
      <h2>
        {searchQuery
          ? `Search Results for "${searchQuery}"`
          : restaurantName
            ? `Hot Picks from ${restaurantName}`
            : "Hot Picks in Your Area"}
      </h2>
      <div className="food-display-list">
        {filteredFood.length > 0 ? (
          filteredFood.map((item) => {
            const restaurant = restaurants.find(
              (r) => r._id === item.restaurantId,
            );
            const imageUrl = item.image || placeholder;

            return (
              <FoodItem
                key={item._id}
                image={imageUrl}
                name={item.name}
                desc={item.description}
                price={item.price}
                restaurantName={restaurant?.restaurantName}
                id={item._id}
              />
            );
          })
        ) : matchesMenu ? (
          <p>Showing items from related menu...</p>
        ) : (
          <p>Try our other items...</p>
          
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
