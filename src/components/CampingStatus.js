import React from "react";

function CampingStatus({ campingStatus, isLoading }) {
  if (isLoading) {
    return (
      <div className="camping-status loading">
        <h2>Checking camping regulations...</h2>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!campingStatus) {
    return null;
  }

  const getStatusClass = () => {
    if (campingStatus.isPermitted === true) return "permitted";
    if (campingStatus.isPermitted === false) return "not-permitted";
    if (campingStatus.isPermitted === "maybe") return "maybe-permitted";
    return "unknown";
  };

  const getStatusText = () => {
    if (campingStatus.isPermitted === true) return "Camping Allowed";
    if (campingStatus.isPermitted === false) return "Camping Not Allowed";
    if (campingStatus.isPermitted === "maybe")
      return "Camping Potentially Allowed with Restrictions";
    return "Camping Status Unknown";
  };

  return (
    <div className={`camping-status ${getStatusClass()}`}>
      <h2>{getStatusText()}</h2>

      <div className="status-details">
        {campingStatus.country && (
          <p>
            <strong>Country:</strong> {campingStatus.country}
          </p>
        )}

        {campingStatus.siteName && (
          <p>
            <strong>Nearest Site:</strong> {campingStatus.siteName} (
            {campingStatus.distance} km away)
          </p>
        )}

        {campingStatus.permitType && (
          <p>
            <strong>Regulation Type:</strong> {campingStatus.permitType}
          </p>
        )}

        {campingStatus.description && (
          <p>
            <strong>Details:</strong> {campingStatus.description}
          </p>
        )}
      </div>

      <div className="status-disclaimer">
        <p>
          This information is based on general regulations and may not reflect
          local rules or recent changes. Always verify with official sources.
        </p>
      </div>
    </div>
  );
}

export default CampingStatus;
