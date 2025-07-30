const express = require("express");
const router = express.Router();
const {
  getProviderById,
  createProvider,
  updateProvider,
  getProviderAppointmentSettings,
  toggleProviderStatus,
  getProviderWorkingHours,
  getAvailableProvidersForUrgent,
  getActiveProviders
} = require("../controllers/providerController");
const {
  getAvailableTimeSlots,
  generateTimeSlots,
} = require("../controllers/timeSlot.controller");

// GET api/providers/:providerId
// Get provider details by provider ID
router.get("/:providerId", getProviderById);

// GET api/providers/active
// Get active providers
router.get('/active',getActiveProviders)

// GET api/providers/urgent-available
// Get the active providers available for urgent consultation
router.get('/urgent-available',getAvailableProvidersForUrgent)

// POST api/providers
// Create a new provider
router.post("/", createProvider);

// PUT api/providers/:providerId
// Update provider details
router.put("/:providerId", updateProvider);

// GET api/providers/:providerId/settings
// Get provider appointment settings
router.get("/:providerId/settings", getProviderAppointmentSettings);

// Time Slot Routes
// GET api/providers/:providerId/timeslots
// get the available time slots for a specific  provider
router.get("/:providerId/timeslots", getAvailableTimeSlots);

// POST api/providers/:providerId/generate-timeslots
// Generate time slots for a specific provider
router.post("/:providerId/generate-timeslots", generateTimeSlots);

// GET api/providers/:providerId/working-hours
// Get provider working hours
router.get('/:providerId/working-hours',getProviderWorkingHours)

// PATCH api/providers/:providerId/toggle-status
// Update provider active status
router.patch('/:providerId/toggle-status',toggleProviderStatus)


module.exports = router