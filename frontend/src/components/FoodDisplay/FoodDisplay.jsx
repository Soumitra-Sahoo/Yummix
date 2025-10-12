import React, { useContext } from 'react';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem';
import { StoreContext } from '../../Context/StoreContext';
import placeholder from '../../assets/placeholder.webp'; // fallback image

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dfgyxxs0g/image/upload/";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  return (
    <div className='food-display' id='food-display'>
      <h2>Hot Picks in Your Area</h2>
      <div className='food-display-list'>
        {food_list.map((item) => {
          if (category === "All" || category === item.category) {
            // Ensure image is a full URL or fallback
            const imageUrl = item.image
              ? item.image.startsWith('http')
                ? item.image
                : `${CLOUDINARY_BASE_URL}${item.image}`
              : placeholder;

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
