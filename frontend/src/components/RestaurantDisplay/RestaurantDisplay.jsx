import "./RestaurantDisplay.css";
import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import verify from "../../assets/verify.png";

const RestaurantDisplay = () => {
  const { restaurants } = useContext(StoreContext);

  const navigate = useNavigate();

  return (
    <div className="restaurant-display">
      <h2>Restaurants Near You</h2>
      <br />
      <div className="restaurant-grid">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="restaurant-card"
            onClick={() => navigate(`/restaurant/${restaurant._id}`)}
          >
            <img className="restaurant-image" src={restaurant.image} alt={restaurant.restaurantName} />
            <div className="restaurant-title">
              <h3>{restaurant.restaurantName}</h3>

              {restaurant.isApproved && (
                <img src={verify} alt="Verified" className="verified-badge" />
              )}
            </div>

            <p>{restaurant.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantDisplay;
