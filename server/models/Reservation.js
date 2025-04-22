const mongoose = require("mongoose");

class Reservation {
  constructor() {
    this.schema = new mongoose.Schema({
      startDate: {
        type: Date,
        required: [true, "Please provide a start date"],
      },
      endDate: {
        type: Date,
        required: [true, "Please provide an end date"],
      },
      numberOfPeople: {
        type: Number,
        required: [true, "Please specify the number of people"],
      },
      totalPrice: {
        type: Number,
        required: [true, "Total price is required"],
      },
      status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
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
      campsite: {
        type: mongoose.Schema.ObjectId,
        ref: "Campsite",
        required: true,
      },
    });

    // Validate that end date is after start date
    this.schema.pre("validate", function (next) {
      if (this.endDate <= this.startDate) {
        this.invalidate("endDate", "End date must be after start date");
      }
      next();
    });

    this.model = mongoose.model("Reservation", this.schema);
  }

  async create(reservationData) {
    return await this.model.create(reservationData);
  }

  async findById(id) {
    return await this.model
      .findById(id)
      .populate("user", "name email")
      .populate("campsite", "name location");
  }

  async getUserReservations(userId) {
    return await this.model
      .find({ user: userId })
      .populate("campsite", "name location photo");
  }

  async getCampsiteReservations(campsiteId) {
    return await this.model.find({ campsite: campsiteId, status: "confirmed" });
  }

  async updateStatus(id, status) {
    return await this.model.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async checkAvailability(campsiteId, startDate, endDate) {
    const overlappingReservations = await this.model.find({
      campsite: campsiteId,
      status: "confirmed",
      $or: [
        // Case 1: Start date falls within existing reservation
        {
          startDate: { $lte: startDate },
          endDate: { $gte: startDate },
        },
        // Case 2: End date falls within existing reservation
        {
          startDate: { $lte: endDate },
          endDate: { $gte: endDate },
        },
        // Case 3: New reservation completely contains an existing reservation
        {
          startDate: { $gte: startDate },
          endDate: { $lte: endDate },
        },
      ],
    });

    return overlappingReservations.length === 0;
  }
}

module.exports = Reservation;
