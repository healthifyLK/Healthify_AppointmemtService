// Business logic for appointment service
const { Appointment, TimeSlot } = require("../models");
// Create a new appointment
const createAppointmentService = async (appointmentData) => {
  try {
    const { patient_id, provider_id, type, mode, scheduled_time } =
      appointmentData;

    // Validate appointment data
    if (!patient_id || !provider_id || !type || !mode) {
      throw new Error("Missing required appointment data");
    }
    // Handle Urgent appointment scenario
    if (type.name === "Urgent") {
      // Create appointment
      const appointment = await Appointment.create({
        patient_id,
        provider_id,
        appointment_type_id: type.id,
        appointment_mode_id: mode.id,
        scheduled_time: new Date(),
        status: "Payment Pending",
      });

      return appointment;
    } else {
      if (!scheduled_time) {
        throw new Error(
          "Scheduled time is required for non-urgent appointments"
        );
      }

      // Check if the time slot is available
      const timeSlot = await TimeSlot.findOne({
        where: {
          provider_id,
          start_time: scheduled_time,
          is_booked: false,
        },
      });
      if (!timeSlot) {
        throw new Error("Time slot is not available");
      }
      //Mark the time slot as booked
      timeSlot.is_booked = true;
      await timeSlot.save();

      // Create appointment
      const appointment = await Appointment.create({
        patient_id,
        provider_id,
        appointment_type_id: type.id,
        appointment_mode_id: mode.id,
        scheduled_time: new Date(scheduled_time),
        status: "Booked",
      });
      return appointment;
    }
  } catch (error) {
    console.error("Error in createAppointmentService:", error.message || error);
    throw error; // Propagate the error to the controller
  }
};
