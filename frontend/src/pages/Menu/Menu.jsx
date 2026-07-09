import React, { useState } from "react";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import RestaurantDisplay from "../../components/RestaurantDisplay/RestaurantDisplay";

const Menu = ({ searchQuery }) => {
  const [category, setCategory] = useState("All");

  const isSearching = searchQuery && searchQuery.trim() !== "";

  return (
    <>
      <ExploreMenu
        setCategory={setCategory}
        category={category}
      />
      {isSearching ? (
        <FoodDisplay
          category="All"
          searchQuery={searchQuery}
        />
      ) : category === "All" ? (
        <RestaurantDisplay />
      ) : (
        <FoodDisplay
          category={category}
          searchQuery={searchQuery}
        />
      )}
    </>
  );
};

export default Menu;