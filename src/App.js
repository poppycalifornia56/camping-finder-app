import React, { useState, useEffect } from "react";
import "./styles/App.css";
import NavBar from "./components/NavBar";
import SearchBar from "./components/SearchBar";
import CampingMap from "./components/CampingMap";
import CampSiteList from "./components/CampSiteList";
import CampSiteDetails from "./components/CampSiteDetails";
import {
  getCampSites,
  getCampSiteById,
  searchCampSites,
} from "./services/campSiteService";

function App() {
  const [campSites, setCampSites] = useState([]);
  const [selectedCampSite, setSelectedCampSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCampSites();
  }, []);

  const fetchCampSites = async () => {
    try {
      setLoading(true);
      const data = await getCampSites();
      setCampSites(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch camping sites");
      setLoading(false);
      console.error(err);
    }
  };

  const handleCampSiteSelect = async (id) => {
    try {
      const campSite = await getCampSiteById(id);
      setSelectedCampSite(campSite);
    } catch (err) {
      console.error("Error fetching camp site details:", err);
    }
  };

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      const results = await searchCampSites(query);
      setCampSites(results);
      setLoading(false);
    } catch (err) {
      setError("Search failed");
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="app">
      <NavBar />
      <div className="app-container">
        <SearchBar onSearch={handleSearch} />

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading camping sites...</div>
        ) : (
          <div className="main-content">
            <CampingMap
              campSites={campSites}
              onCampSiteSelect={handleCampSiteSelect}
            />

            {selectedCampSite && (
              <CampSiteDetails
                campSite={selectedCampSite}
                onClose={() => setSelectedCampSite(null)}
              />
            )}

            <CampSiteList
              campSites={campSites}
              onCampSiteSelect={handleCampSiteSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
