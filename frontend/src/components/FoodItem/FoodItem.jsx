import React, { useContext, useState } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import placeholder from '../../assets/placeholder.png'; // optional fallback

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dfgyxxs0g/image/upload/";

const FoodItem = ({ image, name, price, desc, id }) => {
  const [itemCount, setItemCount] = useState(0);
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  // Fix image URL
  const imageUrl = image
    ? image.startsWith('http')
      ? image
      : `${CLOUDINARY_BASE_URL}${image}`
    : placeholder;

  return (
    <div className='food-item'>
      <div className='food-item-img-container'>
        <img className='food-item-image' src={imageUrl} alt={name} />
        {!cartItems[id]
          ? <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="" />
          : <div className="food-item-counter">
              <img src={assets.remove_icon_red} onClick={() => removeFromCart(id)} alt="" />
              <p>{cartItems[id]}</p>
              <img src={assets.add_icon_green} onClick={() => addToCart(id)} alt="" />
            </div>
        }
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p> <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-desc">{desc}</p>
        <p className="food-item-price">₹{price}</p>
      </div>
    </div>
  );
}

export default FoodItem;
