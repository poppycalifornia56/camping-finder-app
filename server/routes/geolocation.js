// server/routes/geolocation.js
const express = require("express");
const router = express.Router();
const GeolocationService = require("../services/GeolocationService");
const geolocationService = new GeolocationService();

router.post("/distance", async (req, res) => {
  try {
    const { origin, destination } = req.body;
    const distance = await geolocationService.calculateDistance(
      origin,
      destination
    );
    res.json({ distance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
