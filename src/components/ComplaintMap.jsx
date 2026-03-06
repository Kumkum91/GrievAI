import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";

// Optional: custom marker icons by color
const markerColors = {
  default: "blue",
  english: "blue",
  hindi: "green",
  telugu: "orange",
};

// Function to create custom colored marker icon
const createIcon = (color = "blue") =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

export default function ComplaintMap({ complaints = [], location }) {
  const mapRef = useRef();

  // Optional: pan to latest complaint automatically
  useEffect(() => {
    if (mapRef.current && complaints.length > 0) {
      const latest = complaints[complaints.length - 1];
      mapRef.current.setView([latest.lat, latest.lng], 13);
    }
  }, [complaints]);

  return (
    <div style={{ height: "400px", marginTop: "40px" }}>
      <MapContainer
        center={location ? [location.lat, location.lng] : [25.4358, 81.8463]}
        zoom={13}
        style={{ height: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          attribution='© OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {complaints.map((c) => {
          // Determine marker color based on language if available
          let color = "default";
          if (c.language === "en-US") color = markerColors.english;
          else if (c.language === "hi-IN") color = markerColors.hindi;
          else if (c.language === "te-IN") color = markerColors.telugu;

          return (
            <Marker
              key={c.id}
              position={[c.lat, c.lng]}
              icon={createIcon(color)}
            >
              <Popup>
                <strong>Complaint:</strong> {c.text} <br />
                <em>Submitted at: {c.timestamp}</em>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}