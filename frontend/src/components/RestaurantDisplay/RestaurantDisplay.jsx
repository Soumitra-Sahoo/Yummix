import "./RestaurantDisplay.css";
import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import verify from "../../assets/verify.png";

const RestaurantDisplay = () => {
  const { nearbyRestaurants, userLocation } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className="restaurant-display">
      <div className="restaurant-display-header">
        <h2>Restaurants Near You</h2>
      </div>

      {nearbyRestaurants.length === 0 ? (
        <div className="no-restaurants">
          <h3>No restaurants nearby</h3>
          <span>We're expanding! No restaurants found within 30km of your location.</span>
        </div>
      ) : (
        <div className="restaurant-grid">
          {nearbyRestaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="restaurant-card"
              onClick={() => navigate(`/restaurant/${restaurant._id}`)}
            >
              <img
                className="restaurant-image"
                src={restaurant.image}
                alt={restaurant.restaurantName}
              />
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
      )}
    </div>
  );
};

export default RestaurantDisplay;