// server/services/CampsiteService.js
const Campsite = require("../models/Campsite");

class CampsiteService {
  async getAllCampsites(filters = {}) {
    // Convert filters to MongoDB query
    const query = this._buildQuery(filters);
    return await Campsite.find(query);
  }

  async getCampsiteById(id) {
    return await Campsite.findById(id);
  }

  async getNearbyCampsites(latitude, longitude, radius) {
    // Using MongoDB's geospatial query if your schema supports it
    return await Campsite.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: radius * 1000, // Convert km to meters
        },
      },
    });
  }

  async createCampsite(campsiteData) {
    const campsite = new Campsite(campsiteData);
    return await campsite.save();
  }

  async updateCampsite(id, campsiteData) {
    return await Campsite.findByIdAndUpdate(id, campsiteData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteCampsite(id) {
    return await Campsite.findByIdAndDelete(id);
  }

  _buildQuery(filters) {
    const query = {};

    if (filters.name) {
      query.name = { $regex: filters.name, $options: "i" };
    }

    if (filters.amenities) {
      const amenities = Array.isArray(filters.amenities)
        ? filters.amenities
        : [filters.amenities];
      query.amenities = { $all: amenities };
    }

    if (filters.minRating) {
      query.rating = { $gte: parseFloat(filters.minRating) };
    }

    // Add more filter handling as needed

    return query;
  }
}

module.exports = CampsiteService;
