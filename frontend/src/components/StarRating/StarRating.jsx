import React, {useId} from "react";
import "./StarRating.css";

const StarRating = ({ rating = 0, count, interactive = false, onRate, size = "md" }) => {
  const stars = [1, 2, 3, 4, 5];
  const uid = useId();

  const getFill = (star) => {
    if (rating >= star)            return "full";
    if (rating >= star - 0.5)      return "half";
    return "empty";
  };

  return (
    <div className={`star-rating star-${size} ${interactive ? "interactive" : ""}`}>
      {stars.map((star) => {
        const fill = getFill(star);
        return (
          <span
            key={star}
            className={`star star-${fill}`}
            onClick={() => interactive && onRate && onRate(star)}
            title={interactive ? `${star} star${star > 1 ? "s" : ""}` : undefined}
          >
            {fill === "full" && (
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            )}
            {fill === "half" && (
              <svg viewBox="0 0 20 20">
                <defs>
                  <linearGradient id={`half-${uid}-${star}`}>
                    <stop offset="50%" stopColor="currentColor"/>
                    <stop offset="50%" stopColor="#e5e7eb"/>
                  </linearGradient>
                </defs>
                <path
                  fill={`url(#half-${uid}-${star})`}
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            )}
            {fill === "empty" && (
              <svg viewBox="0 0 20 20" fill="#e5e7eb">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            )}
          </span>
        );
      })}
      {count !== undefined && (
        <span className="star-count">
          {rating > 0 ? rating.toFixed(1) : ""}
          {count > 0 ? ` (${count})` : " No ratings yet"}
        </span>
      )}
    </div>
  );
};

export default StarRating;
