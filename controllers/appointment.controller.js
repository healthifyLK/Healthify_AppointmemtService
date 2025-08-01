// Controllers for appointment-related routes
const {
  createAppointmentService,
  getAppointmentsForPatientService,
  getAppointmentsForProviderService,
  getAllAppointmentsService,
  getAppointmentService,
  cancelAppointmentService,
  updateAppointmentService,
  updateAppointmentStatusService,
} = require("../services/appointment.service");

// GET api/appointments
// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await getAllAppointmentsService();
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// POST api/appointments
// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;
    console.log('appointmentData',appointmentData);
    
    // Validate appointment data here if needed
    if (
      !appointmentData.provider_id ||
      !appointmentData.patient_id ||
      !appointmentData.appointmentType ||
      !appointmentData.appointmentMode
    ) {
      return res
        .status(400)
        .json({ error: "Missing required appointment data" });
    }
    const appointment = await createAppointmentService(appointmentData);
    res.status(201).json(appointment);
  } catch (error) {
    // Handle specific conflict errors
    if (error.message.includes("Time slot is already booked")) {
      return res.status(409).json({
        message: error.message,
        errorType: "TIME_SLOT_CONFLICT",
      });
    }

    if (
      error.message.includes("No available time slot for urgent appointment")
    ) {
      return res.status(409).json({
        message: error.message,
        errorType: "PROVIDER_UNAVAILABLE",
      });
    }

    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Failed to create appointment" });
  }
};

// GET api/appointments/patient/:patientId
// Get all appointments for a patient
const getAppointmentsForPatient = async (req, res) => {
  const patientId = req.params.patientId;
  try {
    const appointments = await getAppointmentsForPatientService(patientId);
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments for patient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET api/appointments/provider/:providerId
// Get all appointments for a provider
const getAppointmentsForProvider = async (req, res) => {
  const providerId = req.params.providerId;
  try {
    const appointments = await getAppointmentsForProviderService(providerId);
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments for provider:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT api/appointments/:appointmentId
// Update an appointment
const cancelAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  try {
    const cancelledAppointment = await cancelAppointmentService(appointmentId);
    res.status(200).json(cancelledAppointment);
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT api/appointments/:appointmentId
// Update an appointment
const updateAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  const updatedAppointmentData = req.body;
  try {
    const updatedAppointment = await updateAppointmentService(
      appointmentId,
      updatedAppointmentData
    );
    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PATCH api/appointments/:appointmentId/status
// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;
  try {
    const updatedAppointment = await updateAppointmentStatusService(
      appointmentId,
      status
    );
    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createAppointment,
  getAppointmentsForPatient,
  getAppointmentsForProvider,
  getAllAppointments,
  cancelAppointment,
  updateAppointment,
  updateAppointmentStatus,
};
