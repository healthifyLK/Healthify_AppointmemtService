const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getActiveProviders,
  getAppointmentsForPatient,
  getAppointmentsForProvider,
  getAllAppointments,
} = require("../controllers/appointment.controller");

// GET api/appointments
// Get all appointments
router.get("/", getAllAppointments);
// GET api/appointments/active-providers
// Get all active providers
router.get("/active-providers", getActiveProviders);
// POST api/appointments
// Create a new appointment
router.post("/", createAppointment);

// GET api/appointments/patient/:patientId
// Get all appointments for a patient
router.get("/patient/:patientId", getAppointmentsForPatient);

// GET api/appointments/provider/:providerId
// Get all appointments for a provider
router.get("/provider/:providerId", getAppointmentsForProvider);

module.exports = router;
