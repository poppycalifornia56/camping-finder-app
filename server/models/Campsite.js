const mongoose = require("mongoose");

class Campsite {
  constructor() {
    this.schema = new mongoose.Schema(
      {
        name: {
          type: String,
          required: [true, "Please add a name"],
          unique: true,
          trim: true,
          maxlength: [50, "Name cannot be more than 50 characters"],
        },
        description: {
          type: String,
          required: [true, "Please add a description"],
          maxlength: [500, "Description cannot be more than 500 characters"],
        },
        website: String,
        phone: String,
        email: String,
        address: {
          type: String,
          required: [true, "Please add an address"],
        },
        location: {
          // GeoJSON Point
          type: {
            type: String,
            enum: ["Point"],
          },
          coordinates: {
            type: [Number],
            index: "2dsphere",
          },
          formattedAddress: String,
          street: String,
          city: String,
          state: String,
          zipcode: String,
          country: String,
        },
        facilities: {
          type: [String],
          required: true,
          enum: [
            "Electric Hookups",
            "Water Hookups",
            "Sewer Hookups",
            "WiFi",
            "Laundry",
            "Restrooms",
            "Showers",
            "Pool",
            "Fishing",
            "Hiking",
            "Playground",
          ],
        },
        averageRating: {
          type: Number,
          min: [1, "Rating must be at least 1"],
          max: [5, "Rating cannot be more than 5"],
        },
        averageCost: Number,
        photo: {
          type: String,
          default: "no-photo.jpg",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
      },
      {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
      }
    );

    // Reverse populate with virtuals
    this.schema.virtual("reviews", {
      ref: "Review",
      localField: "_id",
      foreignField: "campsite",
      justOne: false,
    });

    this.model = mongoose.model("Campsite", this.schema);
  }

  async getAll(query = {}) {
    return await this.model.find(query).populate("reviews");
  }

  async create(campsiteData) {
    return await this.model.create(campsiteData);
  }

  async findById(id) {
    return await this.model.findById(id).populate("reviews");
  }

  async update(id, campsiteData) {
    return await this.model.findByIdAndUpdate(id, campsiteData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async getWithinRadius(longitude, latitude, radius) {
    // Convert radius from km to meters (radius of Earth is 6378.1 km)
    const radiusInKm = radius / 6378.1;

    return await this.model.find({
      location: {
        $geoWithin: { $centerSphere: [[longitude, latitude], radiusInKm] },
      },
    });
  }
}

module.exports = Campsite;
