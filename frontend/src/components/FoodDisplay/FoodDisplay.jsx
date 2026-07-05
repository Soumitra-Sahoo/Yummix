import React, { useContext } from "react";
import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";
import { StoreContext } from "../../Context/StoreContext";
import placeholder from "../../assets/placeholder.webp";

const FoodDisplay = ({ category, searchQuery, foods, restaurantName }) => {
  const { food_list, restaurants } = useContext(StoreContext);

  const displayFoods = foods || food_list;
  const query = (searchQuery || "").toLowerCase().trim();

  const filteredFood = displayFoods
    .map((item) => {
      if (!query) return { ...item, priority: 1 };

      const name = item.name.toLowerCase();
      const cat = item.category.toLowerCase();

      let priority = 0;

      if (cat.includes(query)) priority = 3;
      else if (name.startsWith(query)) priority = 2;
      else if (name.includes(query)) priority = 1;

      return { ...item, priority };
    })
    .filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      return item.priority > 0 && matchesCategory;
    })
    .sort((a, b) => b.priority - a.priority);

  const relatedItems = !query
    ? []
    : displayFoods.filter((item) =>
        item.category.toLowerCase().includes(query),
      );

  const fallbackItems = food_list;

  const renderFoodItem = (item) => {
    const restaurant = restaurants.find((r) => r._id === item.restaurantId);

    return (
      <FoodItem
        key={item._id}
        id={item._id}
        image={item.image || placeholder}
        name={item.name}
        desc={item.description}
        price={item.price}
        restaurantName={restaurant?.restaurantName}
        prepTime={item.prepTime}
        spiceLevel={item.spiceLevel}
        tags={item.tags}
        avgRating={item.avgRating || 0}
        ratingCount={item.ratingCount || 0}
      />
    );
  };

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
          filteredFood.map(renderFoodItem)
        ) : relatedItems.length > 0 ? (
          relatedItems.map(renderFoodItem)
        ) : (
          <>
            <div className="food-display-message">
              No items found. Try a different item.
              <br />
              <span>Showing all menu items instead.</span>
            </div>
            {fallbackItems.map(renderFoodItem)}
          </>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
