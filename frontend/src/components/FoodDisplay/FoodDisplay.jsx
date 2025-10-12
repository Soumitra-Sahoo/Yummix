import React, { useContext } from 'react';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem';
import { StoreContext } from '../../Context/StoreContext';
import placeholder from '../../assets/placeholder.webp'; // fallback image

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  return (
    <div className='food-display' id='food-display'>
      <h2>Hot Picks in Your Area</h2>
      <div className='food-display-list'>
        {food_list.map((item) => {
          if (category === "All" || category === item.category) {
            // Use full image URL from DB or fallback
            const imageUrl = item.image || placeholder;

            return (
              <FoodItem
                key={item._id}
                image={imageUrl}
                name={item.name}
                desc={item.description}
                price={item.price}
                id={item._id}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
