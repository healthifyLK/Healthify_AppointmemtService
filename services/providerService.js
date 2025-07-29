// Services related to provider operations
const Provider = require("../models/provider");
const ProviderAppointmentSettings = require("../models/providerAppointmentSettings");

// Get provider details by provider ID
const getProviderByIdService = async (providerId) => {
  try {
    const provider = await Provider.findOne({
      where: { provider_id: providerId },
    });
    if (!provider) {
      throw new Error("Provider not found");
    }
    return provider;
  } catch (error) {
    console.error("Error in getProviderByIdService:", error.message || error);
    throw error;
  }
};

// Create Provider
// Additional provider-related services can be added here
const createProviderService = async (providerData) => {
  try {
    const newProvider = await Provider.create(providerData);

    // Create default appointment settings for the new provider
    await createProviderAppointmentSettingsService({
      provider_id: newProvider.provider_id,
      chatDuration: 15, // Default duration in minutes
      videoDuration: 30, // Default duration in minutes
    });
    return newProvider;
  } catch (error) {
    console.error("Error in createProviderService:", error.message || error);
    throw error;
  }
};

// Update Provider
const updateProviderService = async (providerId, updateData) => {
  try {
    const [updated] = await Provider.update(updateData, {
      where: { provider_id: providerId },
    });
    if (updated) {
      const updatedProvider = await Provider.findOne({
        where: { provider_id: providerId },
      });
      return updatedProvider;
    }
    throw new Error("Provider not found");
  } catch (error) {
    console.error("Error in updateProviderService:", error.message || error);
    throw error;
  }
};
// Create provider appointment settings
const createProviderAppointmentSettingsService = async (settingsData) => {
  try {
    const newSettings = await ProviderAppointmentSettings.create(settingsData);
    return newSettings;
  } catch (error) {
    console.error(
      "Error in createProviderAppointmentSettingsService:",
      error.message || error
    );
    throw error;
  }
};

module.exports = {
  getProviderByIdService,
  createProviderService,
  createProviderAppointmentSettingsService,
  updateProviderService,
};
