// Services related to provider operations
const sequelize = require("../config/sequelize");
const Provider = require("../models/provider");
const ProviderAppointmentSettings = require("../models/providerAppointmentSettings");
const ProviderWorkingHours = require("../models/providerWorkingHours");
const {
  checkProviderAvailabilityService,
  generateSlotsForDayService,
  generateTimeSlotsForProviderService,
} = require("./timeSlot.service");

// Get provider details by provider ID
const getProviderByIdService = async (providerId) => {
  try {
    const provider = await Provider.findOne({
      where: { provider_id: providerId },
      include: [
        { model: ProviderAppointmentSettings, as: "appointmentSettings" },
        { model: ProviderWorkingHours, as: "workingHours" },
      ],
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

// Get all the active providers
const getActiveProvidersService = async () => {
  try {
    const providers = await Provider.findAll({
      where: { isActive: true },
      include: [
        { model: ProviderAppointmentSettings, as: "appointmentSettings" },
        { model: ProviderWorkingHours, as: "workingHours" },
      ],
    });
    return providers;
  } catch (error) {
    console.error("Error in getActiveProviders:", error.message || error);
    throw error; // Propagate the error to the controller
  }
};

// Create Provider
// Additional provider-related services can be added here
const createProviderService = async (providerData) => {
  const transaction = await sequelize.transaction();
  try {
    const newProvider = await Provider.create(providerData, { transaction });
    console.log("new Provider", newProvider);

    const settingsData = {
      provider_id: newProvider.provider_id,
      chatDuration: 15, // Default duration in minutes
      videoDuration: 30,
    };

    // Create default appointment settings for the new provider
    await createProviderAppointmentSettingsService(settingsData, {
      transaction,
    });
    await transaction.commit();
    return newProvider;
  } catch (error) {
    await transaction.rollback();
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

// Toggle Provoider Status
const toggleProviderStatusService = async (providerId) => {
  console.log("ProviderId", providerId);

  const provider = await Provider.findOne({ provider_id: providerId });
  if (!provider) {
    throw new Error("Provider not found");
  }

  return await updateProviderService(providerId, {
    isActive: !provider.isActive,
  });
};
// Create provider appointment settings
const createProviderAppointmentSettingsService = async (
  settingsData,
  options = {}
) => {
  console.log("Settings Data:", settingsData);

  try {
    const newSettings = await ProviderAppointmentSettings.create(
      settingsData,
      options
    );
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

// Update Provider Settings
const updateProviderSettingsService = async (providerId, settingsData) => {
  const [updatedCount] = await ProviderSettings.update(settingsData, {
    where: { provider_id: providerId },
  });
  if (updatedCount === 0) {
    throw new Error("Provider settings not found");
  }
  return await ProviderSettings.findOne({ where: { provider_id: providerId } });
};

// Combined provider settings update function
const updateProviderSettingsAndWorkingHoursService = async (
  providerId,
  settings,
  workingHours
) => {
  const transaction = await sequelize.transaction();

  try {
    // 1️⃣ Update provider settings if provided
    if (settings) {
      await ProviderAppointmentSettings.update(settings, {
        where: { provider_id: providerId },
        transaction,
      });
    }

    // 2️⃣ Update working hours if provided
    if (workingHours && workingHours.length > 0) {
      // Delete existing working hours
      await ProviderWorkingHours.destroy({
        where: { provider_id: providerId },
        transaction,
      });

      // Add provider_id to each record
      const newWorkingHours = workingHours.map((hour) => ({
        ...hour,
        provider_id: providerId,
      }));

      // Bulk insert all working hours
      await ProviderWorkingHours.bulkCreate(newWorkingHours, { transaction });

      // Regenerate time slots based on working hours
      await generateTimeSlotsForProviderService(providerId, transaction);
    }

    // ✅ Commit if everything succeeds
    await transaction.commit();
    return {
      message: "Provider settings and working hours updated successfully",
    };
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating provider settings and working hours:", error);
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
    const workingHours = await ProviderWorkingHours.findAll({
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

// Get available providers for urgent consultations
const getAvailableProvidersForUrgentService = async (
  appointmentType,
  duration
) => {
  const activeProviders = await getActiveProvidersService();
  const availableProviders = [];

  for (const provider of activeProviders) {
    const now = new Date();
    const endTime = new Date(now.getTime() + duration * 60000);

    // Check if provider is available for the urgent time slot
    const conflicts = await checkProviderAvailabilityService(
      provider.provider_id,
      now,
      endTime
    );

    if (conflicts.length === 0) {
      availableProviders.push(provider);
    }
  }

  return availableProviders;
};

module.exports = {
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
  updateProviderSettingsAndWorkingHoursService,
};
