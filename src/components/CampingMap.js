import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getCurrentLocation } from "../services/geoLocationService";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons
const permittedIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const notPermittedIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedLocationIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to find user location and center map
function LocationFinder({ onLocationFound }) {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    getCurrentLocation()
      .then((location) => {
        const newPosition = [location.lat, location.lng];
        setPosition(newPosition);
        map.flyTo(newPosition, 12);
        onLocationFound(newPosition[0], newPosition[1]);
      })
      .catch((error) => {
        console.error("Error getting location:", error);
        // Default to central Europe if location access is denied
        const defaultPosition = [48.8566, 2.3522]; // Paris
        map.flyTo(defaultPosition, 5);
      });
  }, [map, onLocationFound]);

  return position === null ? null : (
    <Marker position={position} icon={userIcon}>
      <Popup>Your current location</Popup>
    </Marker>
  );
}

// Component to handle map clicks
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

function CampingMap({
  campSites,
  onCampSiteSelect,
  onCheckLocation,
  selectedLocation,
}) {
  // Center on Europe by default
  const defaultPosition = [48.8566, 2.3522]; // Paris

  return (
    <div className="map-container">
      <MapContainer
        center={defaultPosition}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationFinder onLocationFound={onCheckLocation} />
        <MapClickHandler onMapClick={onCheckLocation} />

        {selectedLocation && (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={selectedLocationIcon}
          >
            <Popup>Selected location for camping check</Popup>
          </Marker>
        )}

        {campSites.map((site) => (
          <Marker
            key={site.id}
            position={site.coordinates}
            icon={site.isPermitted ? permittedIcon : notPermittedIcon}
            eventHandlers={{
              click: () => {
                onCampSiteSelect(site.id);
              },
            }}
          >
            <Popup>
              <div>
                <h3>{site.name}</h3>
                <p>
                  <strong>Country:</strong> {site.country}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {site.isPermitted
                    ? "Camping Permitted"
                    : "No Camping Allowed"}
                </p>
                <p>
                  <strong>Type:</strong> {site.permitType}
                </p>
                <button onClick={() => onCampSiteSelect(site.id)}>
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="map-actions">
        <button
          className="check-camping-button"
          onClick={() => onCheckLocation()}
        >
          Can I Camp Here?
        </button>
        <p className="map-instructions">
          Click anywhere on the map to check if camping is allowed at that
          location.
        </p>
      </div>
    </div>
  );
}

export default CampingMap;
