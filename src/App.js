import React, { useState, useEffect } from "react";
import "./styles/App.css";
import NavBar from "./components/NavBar";
import CampingMap from "./components/CampingMap";
import CampSiteDetails from "./components/CampSiteDetails";
import CampingStatus from "./components/CampingStatus";
import { europeanCampSites } from "./data/europeanCampSites";
import { checkCampingPermission } from "./services/campingRegulationsService";
import { getCurrentLocation } from "./services/geoLocationService";

function App() {
  const [campSites, setCampSites] = useState([]);
  const [selectedCampSite, setSelectedCampSite] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [campingStatus, setCampingStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Use European camping sites data
    setCampSites(europeanCampSites);
  }, []);

  const handleCampSiteSelect = (id) => {
    const campSite = campSites.find((site) => site.id === id);
    setSelectedCampSite(campSite);
  };

  const handleCheckLocation = async (lat, lng) => {
    try {
      setIsLoading(true);
      setCampingStatus(null);

      // If no coordinates provided, use current location
      if (!lat || !lng) {
        const location = await getCurrentLocation();
        lat = location.lat;
        lng = location.lng;
      }

      // Update selected location
      setSelectedLocation({ lat, lng });

      // Check if camping is permitted
      const permissionResult = await checkCampingPermission(lat, lng);
      setCampingStatus(permissionResult);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to check camping permissions");
      setIsLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="app">
      <NavBar />
      <div className="app-container">
        <div className="app-header">
          <h1>Can I Camp Here? - European Camping Finder</h1>
          <p>
            Check if camping is allowed at your current location or any spot in
            Europe
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="main-content">
          <div className="map-section">
            <CampingMap
              campSites={campSites}
              onCampSiteSelect={handleCampSiteSelect}
              onCheckLocation={handleCheckLocation}
              selectedLocation={selectedLocation}
            />
          </div>

          <div className="info-section">
            <CampingStatus
              campingStatus={campingStatus}
              isLoading={isLoading}
            />

            {selectedCampSite && (
              <CampSiteDetails
                campSite={selectedCampSite}
                onClose={() => setSelectedCampSite(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
