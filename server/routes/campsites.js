const express = require("express");
const router = express.Router();
const CampsiteService = require("../services/CampsiteService");
const campsiteService = new CampsiteService();

module.exports = (campsiteService) => {
  // Get all campsites -
  /* router.get("/", async (req, res) => {
    try {
      const campsites = await campsiteService.getAllCampsites(req.query);
      res.status(200).json({ success: true, data: campsites });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }); */
  router.get("/", async (req, res) => {
    try {
      const filters = req.query;
      const campsites = await campsiteService.getAllCampsites(filters);
      res.json(campsites);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get campsite by ID -
  /* router.get("/:id", async (req, res) => {
    try {
      const campsite = await campsiteService.getCampsiteById(req.params.id);

      if (!campsite) {
        return res
          .status(404)
          .json({ success: false, error: "Campsite not found" });
      }

      res.status(200).json({ success: true, data: campsite });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }); */
  router.get("/:id", async (req, res) => {
    try {
      const campsite = await campsiteService.getCampsiteById(req.params.id);
      if (!campsite) {
        return res.status(404).json({ message: "Campsite not found" });
      }
      res.json(campsite);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create new campsite
  /* router.post("/", async (req, res) => {
    try {
      const campsite = await campsiteService.createCampsite(
        req.body,
        req.user.id
      );
      res.status(201).json({ success: true, data: campsite });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }); */
  router.post("/", async (req, res) => {
    try {
      const newCampsite = await campsiteService.createCampsite(req.body);
      res.status(201).json(newCampsite);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update campsite
  /* router.put("/:id", async (req, res) => {
    try {
      const campsite = await campsiteService.updateCampsite(
        req.params.id,
        req.body,
        req.user.id
      );

      if (!campsite) {
        return res
          .status(404)
          .json({ success: false, error: "Campsite not found" });
      }

      res.status(200).json({ success: true, data: campsite });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }); */
  router.put("/:id", async (req, res) => {
    try {
      const updatedCampsite = await campsiteService.updateCampsite(
        req.params.id,
        req.body
      );
      res.json(updatedCampsite);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete campsite
  /* router.delete("/:id", async (req, res) => {
    try {
      await campsiteService.deleteCampsite(req.params.id, req.user.id);
      res.status(200).json({ success: true, data: {} });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }); */

  router.delete("/:id", async (req, res) => {
    try {
      await campsiteService.deleteCampsite(req.params.id);
      res.json({ message: "Campsite deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get campsites within radius
  router.get("/radius/:zipcode/:distance", async (req, res) => {
    try {
      const lng = -118.2437;
      const lat = 34.0522;

      const campsites = await campsiteService.findCampsitesNearby(
        lng,
        lat,
        req.params.distance
      );

      res
        .status(200)
        .json({ success: true, count: campsites.length, data: campsites });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Get nearby campsites -
  /* router.get("/nearby", async (req, res) => {
    try {
      const { lat, lng, distance } = req.query;

      const campsites = await campsiteService.findCampsitesNearby(
        parseFloat(lng),
        parseFloat(lat),
        parseFloat(distance) || 10
      );

      res
        .status(200)
        .json({ success: true, count: campsites.length, data: campsites });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }); */
  router.get("/nearby", async (req, res) => {
    try {
      const { latitude, longitude, radius } = req.query;
      const campsites = await campsiteService.getNearbyCampsites(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(radius) || 50
      );
      res.json(campsites);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};
