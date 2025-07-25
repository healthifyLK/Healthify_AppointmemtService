const {
  createTimeSlotService,
  getAvailableTimeSlotsService,
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
  const { start_date, end_date } = req.query;
  if (!provider_id) {
    return res.status(400).json({ error: "Provider ID is required" });
  }
  try {
    const timeSlots = await getAvailableTimeSlotsService(
      provider_id,
      start_date,
      end_date
    );
    res.status(200).json(timeSlots);
  } catch (error) {
    console.error("Error fetching available time slots:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  createTimeSlot,
  getAvailableTimeSlots,
};
