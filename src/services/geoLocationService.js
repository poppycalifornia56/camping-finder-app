/* export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          reject(new Error("Unable to retrieve your location"));
        }
      );
    }
  });
};
 */
// src/services/geolocationService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          reject(new Error("Unable to retrieve your location"));
        }
      );
    }
  });
};

// New method to work with backend
export const findCampsitesNearLocation = async (lat, lng, distance = 10) => {
  try {
    // This assumes you'll create an endpoint that accepts lat/lng directly
    const response = await axios.get(`${API_URL}/campsites/nearby`, {
      params: { lat, lng, distance },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error finding nearby campsites:", error);
    throw error;
  }
};
