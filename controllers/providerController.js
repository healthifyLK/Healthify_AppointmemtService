const {
  getProviderByIdService,
  createProviderService,
  createProviderAppointmentSettingsService,
  getProviderWorkingHoursService,
  updateProviderService,
  getProviderAppointmentSettingsService,
  deleteProviderWorkingHoursService,
  toggleProviderStatusService,
  updateProviderSettingsService,
  getAvailableProvidersForUrgentService,
  updateProviderWorkingHoursService,
  createProviderWorkingHoursService,
  getActiveProvidersService,
  updateProviderSettingsAndWorkingHoursService
} = require("../services/providerService");

// GET api/provider/:providerId
// Get provider details by provider ID
const getProviderById = async (req, res) => {
  const providerId = req.params.providerId;
  try {
    const provider = await getProviderByIdService(providerId);
    res.status(200).json(provider);
  } catch (error) {
    console.error("Error fetching provider details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET api/providers/active-providers
// get active providers
const getActiveProviders = async (req, res) => {
  try {
    const providers = await getActiveProvidersService();
    res.json(providers);
  } catch (error) {
    console.error("Error fetching active providers:", error);
    res.status(500).json({ message: "Failed to fetch active providers" });
  }
};

// POST api/provider
// Create a new provider
const createProvider = async (req, res) => {
  const providerData = req.body;
  try {
    const newProvider = await createProviderService(providerData);
    res.status(201).json(newProvider);
  } catch (error) {
    console.error("Error creating provider:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT api/provider/:providerId
// Update provider details
const updateProvider = async (req, res) => {
  const providerId = req.params.providerId;
  const updateData = req.body;
  try {
    const updatedProvider = await updateProviderService(providerId, updateData);
    res.status(200).json(updatedProvider);
  } catch (error) {
    console.error("Error updating provider:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT api/provider/
// Update Provider Settings
const updateProviderSettings = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { settings, workingHours } = req.body;

    await updateProviderSettingsAndWorkingHoursService(
      providerId,
      settings,
      workingHours
    );
    res.json({ message: "Provider settings updated successfully" });
  } catch (error) {
    console.error("Error updating provider settings:", error);
    res.status(500).json({ message: "Failed to update provider settings" });
  }
};

// GET api/provider/:providerId/settings
// Get provider appointment settings
const getProviderAppointmentSettings = async (req, res) => {
  const providerId = req.params.providerId;
  try {
    const settings = await getProviderAppointmentSettingsService(providerId);
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching provider appointment settings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Toggle Provider status
const toggleProviderStatus = async (req, res) => {
  try {
    const { providerId } = req.params;
    const provider = await toggleProviderStatusService(providerId);
    res.json(provider);
  } catch (error) {
    console.error("Error toggling provider status:", error);
    res.status(500).json({ message: "Failed to toggle provider status" });
  }
};

// Get provider working hours
const getProviderWorkingHours = async (req, res) => {
  try {
    const { providerId } = req.params;
    const workingHours = await getProviderWorkingHoursService(providerId);
    res.json(workingHours);
  } catch (error) {
    console.error("Error fetching provider working hours:", error);
    res.status(500).json({ message: "Failed to fetch provider working hours" });
  }
};

// Get available providers for urgent consultations
const getAvailableProvidersForUrgent = async (req, res) => {
  try {
    const { appointmentType, duration } = req.query;
    const providers = await getAvailableProvidersForUrgentService(
      appointmentType,
      parseInt(duration)
    );
    res.json(providers);
  } catch (error) {
    console.error("Error fetching available providers for urgent:", error);
    res.status(500).json({ message: "Failed to fetch available providers" });
  }
};
module.exports = {
  getProviderById,
  createProvider,
  updateProvider,
  getProviderAppointmentSettings,
  toggleProviderStatus,
  getProviderWorkingHours,
  getAvailableProvidersForUrgent,
  getActiveProviders,
  updateProviderSettings
};
