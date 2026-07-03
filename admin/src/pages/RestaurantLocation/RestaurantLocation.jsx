import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { url } from "../../assets/assets";

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Click-on-map to place marker
const MapClickHandler = ({ onPick }) => {
  useMapEvents({ click: (e) => onPick(e.latlng) });
  return null;
};

const RestaurantLocation = () => {
  const [position, setPosition] = useState(null); // { lat, lng }
  const [saving, setSaving] = useState(false);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India default

  // Load existing saved location
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${url}/api/restaurant/profile`, {
          headers: { token: localStorage.getItem("restaurantToken") },
        });
        if (res.data.success && res.data.data.location?.lat) {
          const { lat, lng } = res.data.data.location;
          setPosition({ lat, lng });
          setMapCenter([lat, lng]);
        }
      } catch {
        /* ignore */
      }
    };
    load();
  }, []);

  // Use browser GPS
  const useMyLocation = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(loc);
        setMapCenter([loc.lat, loc.lng]);
        toast.success("Location pinned!");
      },
      () => toast.error("Permission denied"),
    );
  };

  const handleSave = async () => {
    if (!position) return toast.error("Please pin your location first");
    setSaving(true);
    try {
      const res = await axios.post(
        `${url}/api/restaurant/location/update`,
        position,
        { headers: { token: localStorage.getItem("restaurantToken") } },
      );
      if (res.data.success) toast.success("Restaurant location saved!");
      else toast.error(res.data.message);
    } catch {
      toast.error("Failed to save location");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        padding: "32px 36px",
        background: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1a1a2e" }}>
          Restaurant Location
        </h2>
        <p style={{ color: "#9ca3af", fontSize: 14, marginTop: 4 }}>
          Pin your exact location so customers within 30km can find you and
          riders can be assigned accurately.
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <button
          onClick={useMyLocation}
          style={{
            padding: "10px 20px",
            background: "#1a1a2e",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          📍 Use My Current Location
        </button>
        <button
          onClick={handleSave}
          disabled={saving || !position}
          style={{
            padding: "10px 20px",
            background: "#f9c400",
            color: "#1a1a2e",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            opacity: saving || !position ? 0.6 : 1,
          }}
        >
          {saving ? "Saving..." : "Save Location"}
        </button>
      </div>

      {position && (
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>
          📌 Pinned: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
          &nbsp;— or click anywhere on the map to adjust
        </p>
      )}

      {/* Map */}
      <div
        style={{
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid #f3f4f6",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}
      >
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: 450, width: "100%" }}
          key={mapCenter.toString()}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://openstreetmap.org">OpenStreetMap</a>'
          />
          <MapClickHandler
            onPick={(latlng) =>
              setPosition({ lat: latlng.lat, lng: latlng.lng })
            }
          />
          {position && <Marker position={[position.lat, position.lng]} />}
        </MapContainer>
      </div>

      <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 12 }}>
        Tip: Click anywhere on the map to move the pin to the exact location of
        your restaurant.
      </p>
    </div>
  );
};

export default RestaurantLocation;
