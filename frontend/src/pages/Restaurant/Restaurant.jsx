import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import "./Restaurant.css";
import verify from "../../assets/verify.png";
import { StoreContext } from "../../Context/StoreContext"; 

const Restaurant = () => {
  const { id } = useParams();
  const { url } = useContext(StoreContext);
  const [restaurantFoods, setRestaurantFoods] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  const fetchRestaurantFoods = async () => {
    try {
      const response = await axios.get(`${url}/api/food/restaurant/${id}`);
      if (response.data.success) {
        setRestaurantFoods(response.data.data);
        if (response.data.data.length > 0) {
          setRestaurant(response.data.data[0].restaurantId);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRestaurantFoods();
  }, [id]);

  return (
    <div className="restaurant-page">
      {restaurant && (
        <div className="restaurant-header">
          <div className="restaurant-name-box">
            <h1>{restaurant.restaurantName}</h1>
            {restaurant.isApproved && (
              <img src={verify} alt="Verified" className="restaurant-verified" />
            )}
          </div>
          <p>{restaurant.address}</p>
        </div>
      )}
      <FoodDisplay
        category="All"
        foods={restaurantFoods}
        restaurantName={restaurant?.restaurantName}
      />
    </div>
  );
};

export default Restaurant;
