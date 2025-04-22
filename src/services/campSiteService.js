/* import { sampleCampSites } from "../data/sampleCampSites";

export const getCampSites = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleCampSites);
    }, 500);
  });
};

export const getCampSiteById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const campSite = sampleCampSites.find((site) => site.id === parseInt(id));
      if (campSite) {
        resolve(campSite);
      } else {
        reject(new Error("Camp site not found"));
      }
    }, 300);
  });
};

export const searchCampSites = async (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredSites = sampleCampSites.filter(
        (site) =>
          site.name.toLowerCase().includes(query.toLowerCase()) ||
          site.description.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filteredSites);
    }, 300);
  });
};
 */

// src/services/campSiteService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

export const getCampSites = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/campsites`, {
      params: filters,
    });
    return response.data.data; // Extract data from the API response
  } catch (error) {
    console.error("Error fetching campsites:", error);
    throw error;
  }
};

export const getCampSiteById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/campsites/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching campsite with id ${id}:`, error);
    throw new Error("Camp site not found");
  }
};

export const searchCampSites = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/campsites`, {
      params: { search: query },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error searching campsites:", error);
    throw error;
  }
};

// Add these new methods for CRUD operations
export const createCampSite = async (campSiteData) => {
  try {
    const response = await axios.post(`${API_URL}/campsites`, campSiteData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating campsite:", error);
    throw error;
  }
};

export const updateCampSite = async (id, campSiteData) => {
  try {
    const response = await axios.put(
      `${API_URL}/campsites/${id}`,
      campSiteData
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error updating campsite with id ${id}:`, error);
    throw error;
  }
};

export const deleteCampSite = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/campsites/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting campsite with id ${id}:`, error);
    throw error;
  }
};

export const findNearbyCampSites = async (zipcode, distance) => {
  try {
    const response = await axios.get(
      `${API_URL}/campsites/radius/${zipcode}/${distance}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error finding nearby campsites:", error);
    throw error;
  }
};
