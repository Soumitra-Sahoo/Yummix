import { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import placeholder from "../../assets/placeholder.webp";
import StarRating from "../StarRating/StarRating";

const SPICE_CONFIG = {
  Mild: { icon: "🌿", color: "#16a34a", bg: "#dcfce7" },
  Medium: { icon: "🌶", color: "#d97706", bg: "#fef9c3" },
  Hot: { icon: "🌶🌶", color: "#ea580c", bg: "#ffedd5" },
  "Extra Hot": { icon: "🌶🌶🌶", color: "#dc2626", bg: "#fee2e2" },
};

const TAG_COLORS = {
  Bestseller: { color: "#92400e", bg: "#fef3c7" },
  New: { color: "#1e40af", bg: "#dbeafe" },
  Veg: { color: "#166534", bg: "#dcfce7" },
  "Non-Veg": { color: "#991b1b", bg: "#fee2e2" },
  Spicy: { color: "#9a3412", bg: "#ffedd5" },
  "Chef's Special": { color: "#6b21a8", bg: "#f3e8ff" },
};

const FoodItem = ({
  image,
  name,
  price,
  desc,
  id,
  restaurantName,
  prepTime,
  spiceLevel,
  tags,
  avgRating = 0,
  ratingCount = 0,
}) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
  const imageUrl = image || placeholder;
  const spice = spiceLevel && SPICE_CONFIG[spiceLevel];

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-image" src={imageUrl} alt={name} />
        {tags && tags.length > 0 && (
          <div className="food-item-tags">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="food-tag"
                style={{
                  color: TAG_COLORS[tag]?.color || "#374151",
                  background: TAG_COLORS[tag]?.bg || "#f3f4f6",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt="Add"
          />
        ) : (
          <div className="food-item-counter">
            <img
              src={assets.remove_icon_red}
              onClick={() => removeFromCart(id)}
              alt="Remove"
            />
            <p>{cartItems[id]}</p>
            <img
              src={assets.add_icon_green}
              onClick={() => addToCart(id)}
              alt="Add"
            />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <h3 className="food-item-name">{name}</h3>
        <div className="food-item-rating-row">
          <StarRating rating={avgRating} count={ratingCount} size="sm" />
        </div>
        {(prepTime || spice) && (
          <div className="food-item-meta">
            {prepTime && (
              <span className="meta-chip meta-time">⏱ {prepTime} min</span>
            )}
            {spice && (
              <span
                className="meta-chip meta-spice"
                style={{ color: spice.color, background: spice.bg }}
              >
                {spice.icon} {spiceLevel}
              </span>
            )}
          </div>
        )}
        <p className="food-item-desc">{desc}</p>
        {restaurantName && (
          <p className="food-restaurant-name">🍴 {restaurantName}</p>
        )}

        <p className="food-item-price">₹{price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
