import React from "react";

function CampSiteDetails({ campSite, onClose }) {
  if (!campSite) return null;

  return (
    <div className="camp-site-details">
      <div className="details-header">
        <h2>{campSite.name}</h2>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <div
        className="status-badge"
        style={{
          backgroundColor: campSite.isPermitted ? "#4CAF50" : "#F44336",
          color: "white",
          padding: "5px 10px",
          borderRadius: "4px",
          display: "inline-block",
          marginBottom: "10px",
        }}
      >
        {campSite.isPermitted ? "Camping Permitted" : "No Camping Allowed"}
      </div>

      <p>{campSite.description}</p>

      <div className="details-grid">
        <div className="details-item">
          <h4>Coordinates</h4>
          <p>
            {campSite.coordinates[0]}, {campSite.coordinates[1]}
          </p>
        </div>

        <div className="details-item">
          <h4>Maximum Stay</h4>
          <p>{campSite.maxStay}</p>
        </div>

        <div className="details-item">
          <h4>Fee</h4>
          <p>{campSite.fee}</p>
        </div>
      </div>

      <div className="amenities-section">
        <h3>Amenities</h3>
        <ul>
          {campSite.amenities.map((amenity, index) => (
            <li key={index}>{amenity}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CampSiteDetails;
