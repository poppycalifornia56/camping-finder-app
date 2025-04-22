import React from "react";

function CampSiteList({ campSites, onCampSiteSelect }) {
  return (
    <div className="camp-site-list">
      <h2>Available Camping Sites</h2>
      <div className="list-container">
        {campSites.map((site) => (
          <div
            key={site.id}
            className={`camp-site-item ${
              site.isPermitted ? "permitted" : "not-permitted"
            }`}
            onClick={() => onCampSiteSelect(site.id)}
          >
            <h3>{site.name}</h3>
            <p className="status">
              {site.isPermitted
                ? "✓ Camping Permitted"
                : "✗ Not Permitted for Camping"}
            </p>
            <p className="amenities">
              <strong>Amenities:</strong> {site.amenities.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CampSiteList;
