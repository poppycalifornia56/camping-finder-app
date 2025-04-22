import { europeanCampSites } from "../data/europeanCampSites";

// Country-specific camping rules
const countryRules = {
  Germany:
    "Wild camping is generally prohibited. Use designated camping sites.",
  Switzerland:
    "Wild camping is generally prohibited below the tree line. Alpine camping may be allowed with restrictions.",
  UK: "Rules vary by region. Scotland allows wild camping under the Right to Roam. England and Wales have more restrictions.",
  Sweden:
    "Allowed under 'Allemansrätten' (Right to Roam) for 1-2 nights if not on private land or too close to dwellings.",
  Norway:
    "Allowed under 'allemannsretten' if at least 150m from houses/cabins and following Leave No Trace principles.",
  France:
    "Technically forbidden in many areas but often tolerated from dusk till dawn if practiced discreetly.",
  Spain:
    "Generally prohibited outside designated areas, with strict rules in national parks.",
  Italy:
    "Generally prohibited, especially in national parks and nature reserves.",
  Netherlands: "Wild camping is prohibited. Must use designated campsites.",
  default:
    "Rules not available for this location. Check with local authorities before camping.",
};

// Find the closest known camping site to provided coordinates
const findClosestCampSite = (lat, lng, maxDistance = 10) => {
  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  let closestSite = null;
  let minDistance = Infinity;

  europeanCampSites.forEach((site) => {
    const distance = calculateDistance(
      lat,
      lng,
      site.coordinates[0],
      site.coordinates[1]
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestSite = { ...site, distance };
    }
  });

  // Only return if within maxDistance km
  return minDistance <= maxDistance ? closestSite : null;
};

// Determine country based on coordinates
const determineCountry = async (lat, lng) => {
  try {
    // In a real app, you would use a reverse geocoding service
    // For MVP, we'll use a simplified approach with our dataset
    const closestSite = findClosestCampSite(lat, lng, 200);
    return closestSite ? closestSite.country : null;
  } catch (error) {
    console.error("Error determining country:", error);
    return null;
  }
};

// Check if camping is permitted at specific coordinates
export const checkCampingPermission = async (lat, lng) => {
  // For a real app, you would integrate with an official API
  // For MVP, we'll use our sample data and simplified logic

  // First check if location is near a known camping site
  const closestSite = findClosestCampSite(lat, lng);

  if (closestSite && closestSite.distance < 1) {
    // If very close to a known site, return that site's permissions
    return {
      isPermitted: closestSite.isPermitted,
      permitType: closestSite.permitType,
      siteName: closestSite.name,
      description: closestSite.description,
      distance: closestSite.distance.toFixed(2),
      country: closestSite.country,
    };
  }

  // Otherwise check country-level rules
  const country = await determineCountry(lat, lng);

  if (!country) {
    return {
      isPermitted: null,
      permitType: "Unknown Area",
      description: "Could not determine regulations for this location.",
      country: "Unknown",
    };
  }

  // Return country-specific rules
  const countryRule = countryRules[country] || countryRules.default;

  // Simplified permission check based on country
  let isPermitted = null;
  if (country === "Sweden" || country === "Norway" || country === "Scotland") {
    isPermitted = true;
  } else if (country === "France") {
    isPermitted = "maybe"; // Special case for France where it's technically forbidden but often tolerated
  } else {
    isPermitted = false;
  }

  return {
    isPermitted,
    permitType: "Country Regulation",
    description: countryRule,
    country,
  };
};
