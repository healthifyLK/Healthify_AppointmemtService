const TimeSlot = require("../models/timeSlot");
const { Op, DATE } = require("sequelize");
const ProviderWorkingHours = require("../models/providerWorkingHours");
const ProviderAppointmentSettings = require("../models/providerAppointmentSettings");

// Create a time slot
const createTimeSlotService = async (timeSlotData) => {
  const { provider_id, start_time, end_time, is_booked, appointment_type_id } =
    timeSlotData;

  try {
    // Validate time slot data
    if (!start_time || !end_time) {
      throw new Error("Start time and end time are required.");
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
      appointment_type_id,
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
  date,
  appointmentTypeId
) => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await TimeSlot.findAll({
      where: {
        provider_id: provider_id,
        appointment_type_id: appointmentTypeId,
        is_booked: false,
        start_time: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      order: [["start_time", "ASC"]],
    });
  } catch (error) {
    console.error(
      "Error in getting avialble Time Slots",
      error.message || error
    );
    throw error;
  }
};

// update Time SLot
const updateTimeSlotService = async (time_slot_id, timeSlotData) => {
  const [updatedCount] = await TimeSlot.update(timeSlotData, {
    where: { time_slot_id },
  });
  if (updatedCount === 0) {
    throw new Error("Time slot not found");
  }
  return await TimeSlot.findByPk(time_slot_id);
};
// Book a time slot
const bookTimeSlotService = async (time_slot_id) => {
  return await updateTimeSlotService(time_slot_id, { is_booked: true });
};

// release a booked time slot
const releaseTimeSlotService = async (time_slot_id) => {
  return await updateTimeSlotService(time_slot_id, { is_booked: false });
};

// detele a time slot
const deleteTimeSlotService = async (time_slot_id) => {
  try {
    const timeSlot = await TimeSlot.findByPk(time_slot_id);
    if (!timeSlot) {
      throw new Error("Time slot not found");
    }

    await timeSlot.destroy();
    return { message: "Time slot deleted successfully" };
  } catch (error) {
    console.error("Error in deleteTimeSlotService:", error.message || error);
    throw error; // Propagate the error to the controller
  }
};

// get time slot by ID
const getTimeSlotByIdService = async (time_slot_id) => {
  try {
    const timeSlot = await TimeSlot.findByPk(time_slot_id);
    if (!timeSlot) {
      throw new Error("Time slot not found");
    }
    return timeSlot;
  } catch (error) {
    console.error("Error in getTimeSlotByIdService:", error.message || error);
    throw error; // Propagate the error to the controller
  }
};

// Atomic check and book operation to prevent race conditions (duplicate bookings)
const checkAndBookTimeSlot = async (timeSlotId, transaction = null) => {
  const transactionInstance = transaction || (await sequelize.transaction());
  const shouldCommit = !transaction;

  try {
    // Use lock to prevent concurrent modifications
    const timeSlot = await TimeSlot.findByPk(timeSlotId, {
      lock: true,
      transaction: transactionInstance,
    });

    if (!timeSlot) {
      throw new Error("Time slot not found");
    }

    if (timeSlot.is_booked) {
      return false; // Already booked
    }

    // Book the time slot
    await timeSlot.update(
      { is_booked: true },
      { transaction: transactionInstance }
    );

    if (shouldCommit) {
      await transactionInstance.commit();
    }

    return true; // Successfully booked
  } catch (error) {
    if (shouldCommit) {
      await transactionInstance.rollback();
    }
    console.error("Error in checkAndBookTimeSlot:", error);
    return false;
  }
};

// Create urgent time slots
const createUrgentTimeSlot = async (providerId, appointmentType, duration) => {
  try {
    const now = new Date();
    const endTime = new Date(now.getTime() + duration * 60000);

    return await createTimeSlot({
      provider_id: providerId,
      start_time: now,
      end_time: endTime,
      appointment_type_id: appointmentType.id,
      is_booked: true,
    });
  } catch (error) {
    console.error("Error Creating Urgent Time Slots", error.message || error);
    throw error;
  }
};

// Check for conflicts before creating urgent timeslots
const createUrgentTimeSlotWithConflictCheck = async (
  providerId,
  appointmentType,
  duration,
  transaction = null
) => {
  const transactionInstance = transaction || (await sequelize.transaction());
  const shouldCommit = !transaction;
  const now = new Date();
  const endTime = new Date(now.getTime() + duration * 60000);

  try {
    // Check if provider has any overlapping appointments
    const conflicts = await checkProviderAvailabilityService(
      providerId,
      now,
      endTime,
      transactionInstance
    );

    if (conflicts.length > 0) {
      // Provider has conflicting appointments
      return null;
    }

    // Create urgent time slot
    const timeSlot = await TimeSlot.create(
      {
        provider_id: providerId,
        start_time: now,
        end_time: endTime,
        appointment_type_id: appointmentType.id,
        is_booked: true,
      },
      { transaction: transactionInstance }
    );

    if (shouldCommit) {
      await transactionInstance.commit();
    }

    return timeSlot;
  } catch (error) {
    if (shouldCommit) {
      await transactionInstance.rollback();
    }
    console.error("Error creating urgent time slot:", error);
    return null;
  }
};

// Check if provider is available during the specified time range
const checkProviderAvailabilityService = async (
  providerId,
  startTime,
  endTime,
  transaction = null
) => {
  const transactionOptions = transaction ? { transaction } : {};

  const start = new Date(startTime);
  const end = new Date(endTime);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error(`Invalid startTime or endTime: ${startTime}, ${endTime}`);
  }

  // Check for overlapping booked time slots
  const overlappingSlots = await TimeSlot.findAll({
    where: {
      provider_id:providerId,
      is_booked: true,
      // Check for overlap: new appointment overlaps if it starts before existing ends and ends after existing starts
      [Op.and]: [
        {
          start_time: {
            [Op.lt]: end, // Existing starts before new ends
          },
        },
        {
          end_time: {
            [Op.gt]: start, // Existing ends after new starts
          },
        },
      ],
    },
    ...transactionOptions,
  });

  return overlappingSlots;
};

// generate time slots for a provider
const generateTimeSlotsForProviderService = async (providerId, transaction) => {
  try {
    // get provider working hours
    const workingHours = await ProviderWorkingHours.findAll({
      where: { provider_id: providerId },
      transaction,
    });
    if (!workingHours || workingHours.length === 0) {
      throw new Error("Provider working hours not found");
    }

    // get provider appointment settings
    const appointmentSettings = await ProviderAppointmentSettings.findOne({
      where: { provider_id: providerId },
      transaction,
    });
    if (!appointmentSettings) {
      throw new Error("Provider appointment settings not found");
    }

    // Generate time slots based on working hours and appointment settings for next 7 days
    const today = new Date();
    const endDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days later

    const dayMap = {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
    };

    for (
      let date = new Date(today);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dayOfWeek = dayMap[date.getDay()];
      const dayHours = workingHours.find(
        (hours) => hours.dayOfWeek === dayOfWeek && hours.isAvailable
      );
      if (!dayHours) continue; // Skip if no working hours for this day

      console.log("DayHours:", dayHours);

      // Generate time slots for chat,video and home visit appointments
      await generateSlotsForDayService(
        providerId,
        new Date(date),
        dayHours.start_time,
        dayHours.end_time,
        appointmentSettings
      );
    }
  } catch (error) {
    console.error(
      "Error in generateTimeSlotsForProviderService:",
      error.message || error
    );
    throw error; // Propagate the error to the controller
  }
};

// generate time slots for day
const generateSlotsForDayService = async (
  providerId,
  date,
  startTime,
  endTime,
  settings
) => {
  const appointmentTypes = [
    { id: 1, type: "Chat-Consultation", duration: settings.chatDuration },
    { id: 2, type: "Video-Consultation", duration: settings.videoDuration },
    { id: 3, type: "Home-Visit", duration: settings.homeVisitDuration },
  ];

  for (const { id, type, duration } of appointmentTypes) {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const slotStart = new Date(date);
    slotStart.setHours(startHour, startMinute, 0, 0);

    const slotEnd = new Date(date);
    slotEnd.setHours(endHour, endMinute, 0, 0);

    let currentTime = new Date(slotStart);

    while (currentTime < slotEnd) {
      const slotEndTime = new Date(currentTime.getTime() + duration * 60000);

      const timeSlotData = {
        provider_id: providerId,
        start_time: new Date(currentTime),
        end_time: slotEndTime,
        appointment_type_id: id,
        is_booked: false,
      };

      if (slotEndTime <= slotEnd) {
        await createTimeSlotService(timeSlotData);
      }
      currentTime = new Date(currentTime.getTime() + duration * 60000);
    }
  }
};

module.exports = {
  createTimeSlotService,
  getAvailableTimeSlotsService,
  bookTimeSlotService,
  releaseTimeSlotService,
  getTimeSlotByIdService,
  deleteTimeSlotService,
  generateTimeSlotsForProviderService,
  checkAndBookTimeSlot,
  checkProviderAvailabilityService,
  updateTimeSlotService,
  createUrgentTimeSlot,
  createUrgentTimeSlotWithConflictCheck,
  generateSlotsForDayService,
};
