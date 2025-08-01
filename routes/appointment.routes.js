const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointmentsForPatient,
  getAppointmentsForProvider,
  getAllAppointments,
  cancelAppointment,
  updateAppointment,
  updateAppointmentStatus,
} = require("../controllers/appointment.controller");

const {
  createTimeSlot,
  getAvailableTimeSlots
} = require("../controllers/timeSlot.controller");

// GET api/appointments
// Get all appointments
// tested and working
router.get("/", getAllAppointments);
// POST api/appointments
// Create a new appointment
// tested and working
router.post("/", createAppointment);

// GET api/appointments/patient/:patientId
// Get all appointments for a patient
// tested and working
router.get("/patient/:patientId", getAppointmentsForPatient);

// GET api/appointments/provider/:providerId
// Get all appointments for a provider
// tested and working
router.get("/provider/:providerId", getAppointmentsForProvider);

// PUT api/appointments/:appointmentId/cancel
// Cancel an appointment
// tested and working
router.put("/:appointmentId/cancel", cancelAppointment);

// PUT api/appointments/:appointmentId
// Update an appointment
router.put("/:appointmentId", updateAppointment);

// PUT api/appointments/:appointmentId/status
// Update appointment status
router.patch("/:appointmentId/status", updateAppointmentStatus);




module.exports = router;
