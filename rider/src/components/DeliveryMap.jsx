import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Fix default Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const restaurantIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const customerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Auto-fit map to markers
const FitBounds = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds.length >= 2) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [bounds]);
  return null;
};

const DeliveryMap = ({
  restaurantLat,
  restaurantLng,
  customerLat,
  customerLng,
}) => {
  const hasRestaurant =
  restaurantLat != null && restaurantLng != null;

const hasCustomer =
  customerLat != null && customerLng != null;

  if (!hasRestaurant && !hasCustomer) {
    return (
      <div className="h-48 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-sm">
        📍 Location data not available
      </div>
    );
  }

  const center = hasRestaurant
    ? [restaurantLat, restaurantLng]
    : [customerLat, customerLng];

  const bounds = [];
  if (hasRestaurant) bounds.push([restaurantLat, restaurantLng]);
  if (hasCustomer) bounds.push([customerLat, customerLng]);

  return (
    <div className="h-64 rounded-xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://openstreetmap.org">OpenStreetMap</a>'
        />
        <FitBounds bounds={bounds} />

        {hasRestaurant && (
          <Marker
            position={[restaurantLat, restaurantLng]}
            icon={restaurantIcon}
          >
            <Popup>🍽 Restaurant</Popup>
          </Marker>
        )}
        {hasCustomer && (
          <Marker position={[customerLat, customerLng]} icon={customerIcon}>
            <Popup>🏠 Customer</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default DeliveryMap;
