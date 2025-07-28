// Business logic for appointment service
const Appointment = require("../models/appointmentModel");
const TimeSlot = require("../models/timeSlot");
const Provider = require("../models/provider");

// Get all apointments
const getAllAppointmentsService = async () => {
  try {
    const appointments = await Appointment.findAll({
      include: [Provider, TimeSlot],
    });
    return appointments;
  } catch (error) {
    console.error(
      "Error in getAllAppointmentsService:",
      error.message || error
    );
    throw error; // Propagate the error to the controller
  }
};
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
    if (mode.name === "Urgent") {
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

      // Check if the time slot is available for the provider
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

// Get all the active providers
const getActiveProvidersService = async () => {
  try {
    const providers = await Provider.findAll({
      where: { isActive: true },
    });
    return providers;
  } catch (error) {
    console.error("Error in getActiveProviders:", error.message || error);
    throw error; // Propagate the error to the controller
  }
};

// Get all the appointments for a patient
const getAppointmentsForPatientService = async (patientId) => {
  try {
    const appointments = await Appointment.findAll({
      where: { patient_id: patientId },
      order: [["scheduled_time", "DESC"]],
      include: [Provider, TimeSlot],
    });
    return appointments;
  } catch (error) {
    console.error(
      "Error in getAppointmentsForPatientService:",
      error.message || error
    );
    throw error; // Propagate the error to the controller
  }
};

// Get all appointments for a provider
const getAppointmentsForProviderService = async (providerId) => {
  try {
    const appointments = await Appointment.findAll({
      where: { provider_id: providerId },
      order: [["scheduled_time", "DESC"]],
      include: [Provider, TimeSlot],
    });
    return appointments;
  } catch (error) {
    console.error(
      "Error in getAppointmentsForProviderService:",
      error.message || error
    );
    throw error; // Propagate the error to the controller
  }
};

// get appointment
const getAppointmentService = async (appointmentId) => {
  try {
    const appointment = await Appointment.findOne({
      where: { appointment_id: appointmentId },
      include: [Provider, TimeSlot],
    });
    return appointment;
  } catch (error) {
    console.error("Error in getAppointmentService:", error.message || error);
    throw error; // Propagate the error to the controller
  }
};

// cancel appointment
const cancelAppointmentService = async (appointmentId) => {
  try {
    const appointment = await getAppointmentService(appointmentId);
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    // Free the time slot
    if (appointment.time_slot_id) {
      await timeSlotService.releaseTimeSlot(appointment.time_slot_id);
    }

    return await updateAppointmentService(appointmentId, {
      status: "Cancelled"
    });
  } catch (error) {
    console.error("Error in cancelAppointmentService:", error.message || error);
    throw error; // Propagate the error to the controller
  }
};

// update appointment
const updateAppointmentService = async (appointmentId, updatedAppointmentData) => {
  try {
    const appointment = await getAppointmentService(appointmentId);
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    // Update appointment details
    const updatedAppointment = await appointment.update(updatedAppointmentData);
    return updatedAppointment;
  } catch (error) {
    console.error("Error in updateAppointmentService:", error.message || error);
    throw error; // Propagate the error to the controller
  }
};

module.exports = {
  createAppointmentService,
  getActiveProvidersService,
  getAppointmentsForPatientService,
  getAppointmentsForProviderService,
  getAllAppointmentsService,
  getAppointmentService,
  cancelAppointmentService,
  updateAppointmentService,
};
