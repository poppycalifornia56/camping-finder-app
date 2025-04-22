class ReservationService {
  constructor(reservationModel, campsiteModel) {
    this.reservationModel = reservationModel;
    this.campsiteModel = campsiteModel;
  }

  async createReservation(userId, campsiteId, reservationData) {
    // Check if campsite exists
    const campsite = await this.campsiteModel.findById(campsiteId);
    if (!campsite) {
      throw new Error("Campsite not found");
    }

    // Check if dates are available
    const isAvailable = await this.reservationModel.checkAvailability(
      campsiteId,
      new Date(reservationData.startDate),
      new Date(reservationData.endDate)
    );

    if (!isAvailable) {
      throw new Error("Campsite is not available for the selected dates");
    }

    // Calculate total price based on campsite cost and duration
    const startDate = new Date(reservationData.startDate);
    const endDate = new Date(reservationData.endDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    const totalPrice = (campsite.averageCost || 30) * days;

    // Create reservation
    const reservation = await this.reservationModel.create({
      ...reservationData,
      user: userId,
      campsite: campsiteId,
      totalPrice,
    });

    return reservation;
  }

  async getUserReservations(userId) {
    return await this.reservationModel.getUserReservations(userId);
  }

  async getReservationById(id, userId, req) {
    const reservation = await this.reservationModel.findById(id);

    if (!reservation) {
      throw new Error("Reservation not found");
    }

    // Check if user owns this reservation
    if (
      reservation.user._id.toString() !== userId &&
      req.user.role !== "admin"
    ) {
      throw new Error("Not authorized to view this reservation");
    }

    return reservation;
  }

  async cancelReservation(id, userId, req) {
    const reservation = await this.reservationModel.findById(id);

    if (!reservation) {
      throw new Error("Reservation not found");
    }

    // Check if user owns this reservation
    if (
      reservation.user._id.toString() !== userId &&
      req.user.role !== "admin"
    ) {
      throw new Error("Not authorized to cancel this reservation");
    }

    // Only pending or confirmed reservations can be cancelled
    if (reservation.status === "cancelled") {
      throw new Error("Reservation is already cancelled");
    }

    return await this.reservationModel.updateStatus(id, "cancelled");
  }
}

module.exports = ReservationService;
