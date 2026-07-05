import React, { useState } from "react";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import RestaurantDisplay from "../../components/RestaurantDisplay/RestaurantDisplay";

const Menu = () => {
  const [category, setCategory] = useState("All");

  return (
    <>
      <ExploreMenu setCategory={setCategory} category={category} />
      {category === "All" ? (
        <RestaurantDisplay />
      ) : (
        <FoodDisplay category={category} />
      )}
    </>
  );
};

export default Menu;