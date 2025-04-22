// server/app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Add this line

// Import models
const User = require("./models/User");
const Campsite = require("./models/Campsite");
const Review = require("./models/Review");
const Reservation = require("./models/Reservation");

// Import services
const CampsiteService = require("./services/CampsiteService");
const UserService = require("./services/UserService");
const ReservationService = require("./services/ReservationService");

// Create instances
const userModel = new User();
const campsiteModel = new Campsite();
const reviewModel = new Review();
const reservationModel = new Reservation();

const campsiteService = new CampsiteService(campsiteModel);
const userService = new UserService(userModel);
const reservationService = new ReservationService(
  reservationModel,
  campsiteModel
);

// Import route modules
const campsiteRoutes = require("./routes/campsites")(campsiteService);
const userRoutes = require("./routes/users")(userService);
const reservationRoutes = require("./routes/reservations")(reservationService);

// Create Express app
const app = express();

// Enable CORS
app.use(cors()); // Add this line

// Body parser middleware
app.use(express.json());

// Mount routers
app.use("/api/v1/campsites", campsiteRoutes);
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/reservations", reservationRoutes);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/camping-finder", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
