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

module.exports = {
  createTimeSlotService,
  getAvailableTimeSlotsService,
};
