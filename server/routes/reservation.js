const express = require("express");
const router = express.Router();

module.exports = (reservationService) => {
  // Create reservation
  router.post("/:campsiteId", async (req, res) => {
    try {
      const reservation = await reservationService.createReservation(
        req.user.id,
        req.params.campsiteId,
        req.body
      );

      res.status(201).json({ success: true, data: reservation });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Get user reservations
  router.get("/my-reservations", async (req, res) => {
    try {
      const reservations = await reservationService.getUserReservations(
        req.user.id
      );
      res.status(200).json({ success: true, data: reservations });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Get single reservation
  router.get("/:id", async (req, res) => {
    try {
      const reservation = await reservationService.getReservationById(
        req.params.id,
        req.user.id
      );
      res.status(200).json({ success: true, data: reservation });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Cancel reservation
  router.put("/:id/cancel", async (req, res) => {
    try {
      const reservation = await reservationService.cancelReservation(
        req.params.id,
        req.user.id
      );
      res.status(200).json({ success: true, data: reservation });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  return router;
};
