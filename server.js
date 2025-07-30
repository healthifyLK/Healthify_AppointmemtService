const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const Appointment = require("./models/appointmentModel");
const AppointmentType = require("./models/appointmentType");
const AppointmentMode = require("./models/appointmentMode");
const Provider = require("./models/provider");
const TimeSlot = require("./models/timeSlot");
const sequelize = require("./config/sequelize");
const appointmentRoutes = require('./routes/appointment.routes')
const providerRoutes = require('./routes/provider.routes')

const PORT = process.env.PORT || 5003;

// Initialize EXPRESS APP
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan());

// Routes
app.use('/api/appointments',appointmentRoutes);
app.use('/api/providers',providerRoutes);

// Start   the server only if the database connection is successful
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    // sync the models with the database
    await sequelize.sync({ alter: true });
    console.log("Database models synced successfully");

    // Start the server
    app.listen(PORT, () => {
      console.log(`Appointment Service is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    process.exit(1);
  }
})();
