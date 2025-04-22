const express = require("express");
const router = express.Router();

module.exports = (userService) => {
  // Register user
  router.post("/register", async (req, res) => {
    try {
      const user = await userService.register(req.body);

      // Create token
      const token = user.getSignedJwtToken();

      res.status(200).json({ success: true, token });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Login user
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate email & password
      if (!email || !password) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Please provide an email and password",
          });
      }

      const user = await userService.login(email, password);

      // Create token
      const token = user.getSignedJwtToken();

      res.status(200).json({ success: true, token });
    } catch (err) {
      res.status(401).json({ success: false, error: err.message });
    }
  });

  // Get current user
  router.get("/me", async (req, res) => {
    try {
      const user = await userService.getUserProfile(req.user.id);
      res.status(200).json({ success: true, data: user });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Update user details
  router.put("/me", async (req, res) => {
    try {
      const user = await userService.updateUserProfile(req.user.id, req.body);
      res.status(200).json({ success: true, data: user });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  return router;
};
