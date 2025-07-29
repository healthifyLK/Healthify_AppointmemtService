const TimeSlot = require("../models/timeSlot");
const { Op } = require("sequelize");

// Create a time slot
const createTimeSlotService = async (timeSlotData) => {
  const { provider_id, start_time, end_time, is_booked } = timeSlotData;

  try {
    // Validate time slot data
    if (!start_time || !end_time) {
      throw new Error("Start timr and end time are required.");
    }

    if (new Date(start_time) >= new Date(end_time)) {
      throw new Error("Start time must be before end time.");
    }
    // Create the time slot

    const timeSlot = await TimeSlot.create({
      provider_id,
      start_time,
      end_time,
      is_booked,
    });
    return timeSlot;
  } catch (error) {
    console.error("Error in createTimeSlotService:", error.message || error);
    throw error;
  }
};

// Get available time slots for each provider
const getAvailableTimeSlotsService = async (
  provider_id,
  start_date,
  end_date
) => {
  try {
    const now = new Date();
    let lowerBound = now;
    if (start_date) {
      const start = new Date(start_date);
      if (start > now) {
        lowerBound = start;
      }
    }

    const whereClause = {
      provider_id,
      start_time: {
        [Op.gte]: lowerBound,
      },
      is_booked: false,
    };

    if (end_date) {
      const end = new Date(end_date);
      whereClause.start_time[Op.lte] = end;
    }

    const timeSlots = await TimeSlot.findAll({
      where: whereClause,
      order: [["start_time", "ASC"]],
      attributes: ["time_slot_id", "start_time", "end_time"],
    });
    return timeSlots;
  } catch (error) {
    console.error("Error fetching available time slots:", error);
    throw error;
  }
};
// Book a time slot
const bookTimeSlotService = async (timeSlotId) => {
  try {
    const timeSlot = await TimeSlot.findByPk(timeSlotId);
    if (!timeSlot || timeSlot.is_booked) {
      throw new Error("Time slot is not available");
    }

    // Mark the time slot as booked
    timeSlot.is_booked = true;
    await timeSlot.save();

    return timeSlot;
  } catch (error) {
    console.error("Error in bookTimeSlotService:", error.message || error);
    throw error; // Propagate the error to the controller
  }
};

// release a booked time slot
const releaseTimeSlotService = async (timeSlotId) => {
  try {
    const timeSlot = await TimeSlot.findByPk(timeSlotId);
    if (!timeSlot || !timeSlot.is_booked) {
      throw new Error("Time slot is not booked");
    }

    // Mark the time slot as available
    timeSlot.is_booked = false;
    await timeSlot.save();

    return timeSlot;
  } catch (error) {
    console.error("Error in releaseTimeSlotService:", error.message || error);
    throw error; // Propagate the error to the controller
  }
};

// generate time slots for a provider
const generateTimeSlotsForProvider = async (providerId, startDate, endDate) => {
  
}

module.exports = {
  createTimeSlotService,
  getAvailableTimeSlotsService,
  bookTimeSlotService,
  releaseTimeSlotService,
};
