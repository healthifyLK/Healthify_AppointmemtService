// Controllers for appointment-related routes
const {
  createAppointmentService,
  getActiveProvidersService,
  getAppointmentsForPatientService,
  getAppointmentsForProviderService,
  getAllAppointmentsService,
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
    const appointment = await createAppointmentService(appointmentData);
    res.status(201).json(appointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET api/appointments/active-providers
// Get all active providers
const getActiveProviders = async (req, res) => {
  try {
    const providers = await getActiveProvidersService();
    res.status(200).json(providers);
  } catch (error) {
    console.error("Error fetching active providers:", error);
    res.status(500).json({ error: "Internal server error" });
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

module.exports = {
  createAppointment,
  getActiveProviders,
  getAppointmentsForPatient,
  getAppointmentsForProvider,
  getAllAppointments
};
