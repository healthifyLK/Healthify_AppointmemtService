const {
  createTimeSlotService,
  getAvailableTimeSlotsService,
  checkProviderAvailabilityService,
} = require("../services/timeSlot.service");

// POST api/apointments/time-slots
// Create a new time slot
const createTimeSlot = async (req, res) => {
  const timeSlotData = req.body;
  const provider_id = req.user.id;

  try {
    const timeSlot = await createTimeSlotService({
      ...timeSlotData,
      provider_id,
    });
    res.status(201).json(timeSlot);
  } catch (error) {
    console.error("Error creating time slot:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET api/appointments/time-slots/available
// Get available time slots for a provider
const getAvailableTimeSlots = async (req, res) => {
  const { provider_id } = req.params;
  const { date, appointmentType } = req.query;
  if (!provider_id) {
    return res.status(400).json({ error: "Provider ID is required" });
  }
  if (!appointmentType || !date) {
    return res
      .status(400)
      .json({ message: "appointmentType and date are required" });
  }

  try {
    const timeSlots = await getAvailableTimeSlotsService(
      provider_id,
      date,
      appointmentType
    );
    res.status(200).json(timeSlots);
  } catch (error) {
    console.error("Error fetching available time slots:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Generate Time  Slots
const generateTimeSlots = async (req, res) => {
  try {
    const { providerId } = req.params;
    await generateTimeSlots(providerId);
    res.json({ message: "Time slots generated successfully" });
  } catch (error) {
    console.error("Error generating time slots:", error);
    res.status(500).json({ message: "Failed to generate time slots" });
  }
};

// Check for the Provider availability in specifiec time range
const checkProviderAvailability = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { startTime, endTime } = req.query;

    if (!startTime || !endTime) {
      return res
        .status(400)
        .json({ message: "startTime and endTime are required" });
    }

    const conflicts = await checkProviderAvailabilityService(
      providerId,
      new Date(startTime),
      new Date(endTime)
    );

    res.json({
      isAvailable: conflicts.length === 0,
      conflicts: conflicts,
    });
  } catch (error) {
    console.error("Error checking provider availability:", error);
    res.status(500).json({ message: "Failed to check provider availability" });
  }
};
module.exports = {
  createTimeSlot,
  getAvailableTimeSlots,
  generateTimeSlots,
};
