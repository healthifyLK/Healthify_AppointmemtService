// Business logic for appointment service
const sequelize = require("../config/sequelize");
const Appointment = require("../models/appointmentModel");
const TimeSlot = require("../models/timeSlot");
const Provider = require("../models/provider");
const {
  bookTimeSlot,
  releaseTimeSlot,
  createUrgentTimeSlot,
  checkAndBookTimeSlot,
  createUrgentTimeSlotWithConflictCheck,
  releaseTimeSlotService,
} = require("./timeSlot.service");

// Get all apointments
const getAllAppointmentsService = async () => {
  try {
    const appointments = await Appointment.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Provider,
          as: "provider",
        },
        {
          model: TimeSlot,
          as: "timeSlot",
        },
      ],
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
  const transaction = await sequelize.transaction();

  try {
    // Handle scheduled appointments with time slot conflict checking
    if (appointmentData.time_slot_id) {
      const isBooked = await checkAndBookTimeSlot(
        appointmentData.time_slot_id,
        transaction
      );
      if (!isBooked) {
        throw new Error("Time slot is already booked");
      }
    }

    // Handle urgent appointments with provider availability checking
    if (
      appointmentData.appointmentMode.name === "Urgent" &&
      !appointmentData.time_slot_id
    ) {
      const urgentSlot = await createUrgentTimeSlotWithConflictCheck(
        appointmentData.provider_id,
        appointmentData.appointmentType,
        appointmentData.duration,
        transaction
      );

      if (!urgentSlot) {
        throw new Error("No available time slot for urgent appointment");
      }

      

      appointmentData.time_slot_id = urgentSlot.time_slot_id;
      appointmentData.scheduled_time = urgentSlot.start_time;
    }
    appointmentData.status = "Booked";
    appointmentData.appointment_type_id = appointmentData.appointmentType.id
    appointmentData.appointment_mode_id = appointmentData.appointmentMode.id

    // Create the appointment
    const appointment = await Appointment.create(appointmentData, {
      transaction,
    });

    await transaction.commit();
    return await getAppointmentService(appointment.appointment_id);
  } catch (error) {
    await transaction.rollback();
    if (error.message === "Time slot is already booked") {
      throw new Error(
        "The selected time slot has been booked by another patient. Please choose a different time."
      );
    }
    if (error.message === "No available time slot for urgent appointment") {
      throw new Error(
        "The provider is currently unavailable for urgent consultations. Please try another provider or schedule for later."
      );
    }
    throw error;
  }
};

// Get all the appointments for a patient
const getAppointmentsForPatientService = async (patientId) => {
  try {
    const appointments = await Appointment.findAll({
      where: { patient_id: patientId },
      order: [["scheduled_time", "DESC"]],
      include: [
        {
          model: Provider,
          as: "provider",
        },
        {
          model: TimeSlot,
          as: "timeSlot",
        },
      ],
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
      include: [
        {
          model: TimeSlot,
          as: "timeSlot",
        },
      ],
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
      include: [
        {
          model: Provider,
          as: "provider",
        },
        {
          model: TimeSlot,
          as: "timeSlot",
        },
      ],
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
      await releaseTimeSlotService(appointment.time_slot_id);
    }

    return await updateAppointmentService(appointmentId, {
      status: "Cancelled",
    });
  } catch (error) {
    console.error("Error in cancelAppointmentService:", error.message || error);
    throw error; // Propagate the error to the controller
  }
};

// update appointment
const updateAppointmentService = async (
  appointmentId,
  updatedAppointmentData
) => {
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

// update appointment status
const updateAppointmentStatusService = async (appointmentId, status) => {
  return await updateAppointment(appointmentId, { status: status });
};

module.exports = {
  createAppointmentService,
  getAppointmentsForPatientService,
  getAppointmentsForProviderService,
  getAllAppointmentsService,
  getAppointmentService,
  cancelAppointmentService,
  updateAppointmentService,
  updateAppointmentStatusService,
};
