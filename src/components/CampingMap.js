import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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

// Location finder component
function LocationMarker() {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    getCurrentLocation()
      .then((location) => {
        setPosition([location.lat, location.lng]);
        map.flyTo([location.lat, location.lng], 12);
      })
      .catch((error) => {
        console.error("Error getting location:", error);
      });
  }, [map]);

  return position === null ? null : (
    <Marker
      position={position}
      icon={
        new L.Icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        })
      }
    >
      <Popup>You are here</Popup>
    </Marker>
  );
}

function CampingMap({ campSites, onCampSiteSelect }) {
  const defaultPosition = [34.0522, -118.2437]; // Los Angeles as default

  return (
    <div style={{ height: "70vh", width: "100%" }}>
      <MapContainer
        center={defaultPosition}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
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
                  <strong>Status:</strong>{" "}
                  {site.isPermitted
                    ? "Camping Permitted"
                    : "No Camping Allowed"}
                </p>
                <p>
                  <strong>Amenities:</strong> {site.amenities.join(", ")}
                </p>
                <button onClick={() => onCampSiteSelect(site.id)}>
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default CampingMap;
