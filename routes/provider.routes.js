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
  getActiveProviders,
  updateProviderSettings
} = require("../controllers/providerController");
const {
  getAvailableTimeSlots,
  generateTimeSlots,
} = require("../controllers/timeSlot.controller");

// GET api/providers/active
// Get active providers
// tested and working
router.get('/active',getActiveProviders)


// GET api/providers/urgent-available
// Get the active providers available for urgent consultation
router.get('/urgent-available',getAvailableProvidersForUrgent)
// GET api/providers/:providerId
// Get provider details by provider ID
// tested and working
router.get("/:providerId", getProviderById);

// POST api/providers
// Create a new provider
// tested and working
router.post("/", createProvider);

// PUT api/providers/:providerId
// Update provider details
// tested and working
router.put("/:providerId", updateProvider);

// PUT api/providers/:providerId/settings
// Update Provider Settings
// tested and working
router.put('/:providerId/settings',updateProviderSettings)

// GET api/providers/:providerId/settings
// Get provider appointment settings
// tested and working
router.get("/:providerId/settings", getProviderAppointmentSettings);

// Time Slot Routes
// GET api/providers/:providerId/timeslots
// get the available time slots for a specific  provider
// tested and working
router.get("/:providerId/timeslots", getAvailableTimeSlots);

// POST api/providers/:providerId/generate-timeslots
// Generate time slots for a specific provider
// tested and working
router.post("/:providerId/generate-timeslots", generateTimeSlots);

// GET api/providers/:providerId/working-hours
// Get provider working hours
// tested and working
router.get('/:providerId/working-hours',getProviderWorkingHours)

// PATCH api/providers/:providerId/toggle-status
// Update provider active status
// tested and working
router.patch('/:providerId/toggle-status',toggleProviderStatus)


module.exports = router