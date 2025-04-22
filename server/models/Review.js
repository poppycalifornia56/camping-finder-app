const mongoose = require("mongoose");

class Review {
  constructor() {
    this.schema = new mongoose.Schema({
      title: {
        type: String,
        trim: true,
        required: [true, "Please add a title for the review"],
        maxlength: 100,
      },
      text: {
        type: String,
        required: [true, "Please add review text"],
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "Please add a rating between 1 and 5"],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      campsite: {
        type: mongoose.Schema.ObjectId,
        ref: "Campsite",
        required: true,
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
    });

    // Prevent user from submitting more than one review per campsite
    this.schema.index({ campsite: 1, user: 1 }, { unique: true });

    // Static method to get average rating and save
    this.schema.statics.getAverageRating = async function (campsiteId) {
      const obj = await this.aggregate([
        {
          $match: { campsite: campsiteId },
        },
        {
          $group: {
            _id: "$campsite",
            averageRating: { $avg: "$rating" },
          },
        },
      ]);

      try {
        await mongoose.model("Campsite").findByIdAndUpdate(campsiteId, {
          averageRating: obj[0] ? obj[0].averageRating : 0,
        });
      } catch (err) {
        console.error(err);
      }
    };

    // Call getAverageRating after save
    this.schema.post("save", function () {
      this.constructor.getAverageRating(this.campsite);
    });

    // Call getAverageRating before remove
    this.schema.pre("remove", function () {
      this.constructor.getAverageRating(this.campsite);
    });

    this.model = mongoose.model("Review", this.schema);
  }

  async getAll(campsiteId = null) {
    if (campsiteId) {
      return await this.model.find({ campsite: campsiteId });
    }
    return await this.model.find();
  }

  async create(reviewData) {
    return await this.model.create(reviewData);
  }

  async findById(id) {
    return await this.model.findById(id);
  }

  async update(id, reviewData) {
    return await this.model.findByIdAndUpdate(id, reviewData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    const review = await this.model.findById(id);
    if (review) {
      await review.remove();
      return true;
    }
    return false;
  }
}

module.exports = Review;
