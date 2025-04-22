import { sampleCampSites } from "../data/sampleCampSites";

export const getCampSites = async () => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleCampSites);
    }, 500);
  });
};

export const getCampSiteById = async (id) => {
  // Simulate API call delay
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
  // Simulate API call delay
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
