// Services related to provider operations
const Provider = require("../models/provider");
const ProviderAppointmentSettings = require("../models/providerAppointmentSettings");
const ProviderWorkingHours = require("../models/providerWorkingHours");

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

// get provider appointment settings
const getProviderAppointmentSettingsService = async (providerId) => {
  try {
    const settings = await ProviderAppointmentSettings.findOne({
      where: { provider_id: providerId },
    });
    if (!settings) {
      throw new Error("Provider appointment settings not found");
    }
    return settings;
  } catch (error) {
    console.error(
      "Error in getProviderAppointmentSettingsService:",
      error.message || error
    );
    throw error;
  }
};

// Create provide working hours
const createProviderWorkingHoursService = async (workingHoursData) => {
  try {
    const newWorkingHours = await ProviderWorkingHours.create(workingHoursData);
    return newWorkingHours;
  } catch (error) {
    console.error(
      "Error in createProviderWorkingHoursService:",
      error.message || error
    );
    throw error;
  }
};

// update provider working hours
const updateProviderWorkingHoursService = async (
  working_hours_id,
  updateData
) => {
  try {
    const [updated] = await ProviderWorkingHours.update(updateData, {
      where: { working_hours_id: working_hours_id },
    });
    if (updated) {
      const updatedWorkingHours = await ProviderWorkingHours.findOne({
        where: { working_hours_id: working_hours_id },
      });
      return updatedWorkingHours;
    }
    throw new Error("Provider working hours not found");
  } catch (error) {
    console.error(
      "Error in updateProviderWorkingHoursService:",
      error.message || error
    );
    throw error;
  }
};

// get provider working hours
const getProviderWorkingHoursService = async (providerId) => {
  try {
    const workingHours = await ProviderWorkingHours.findOne({
      where: { provider_id: providerId },
    });
    if (!workingHours) {
      throw new Error("Provider working hours not found");
    }
    return workingHours;
  } catch (error) {
    console.error(
      "Error in getProviderWorkingHoursService:",
      error.message || error
    );
    throw error;
  }
};

// Delete provider working hours
const deleteProviderWorkingHoursService = async (working_hours_id) => {
  try {
    const deleted = await ProviderWorkingHours.destroy({
      where: { working_hours_id: working_hours_id },
    });
    if (!deleted) {
      throw new Error("Provider working hours not found");
    }
    return { message: "Provider working hours deleted successfully" };
  } catch (error) {
    console.error(
      "Error in deleteProviderWorkingHoursService:",
      error.message || error
    );
    throw error;
  }
};

module.exports = {
  getProviderByIdService,
  createProviderService,
  createProviderAppointmentSettingsService,
  getProviderWorkingHoursService,
  updateProviderService,
  getProviderAppointmentSettingsService,
  deleteProviderWorkingHoursService,
};
