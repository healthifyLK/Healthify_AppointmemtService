const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Provider = require("./provider");

// Define the appointment settings model for providers
const ProviderAppointmentSettings = sequelize.define(
  "ProviderAppointmentSettings",
  {
    setting_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    chatDuration: {
      type: DataTypes.INTEGER,
      defaultValue: 15, // Default chat duration in minutes
      allowNull: false,
    },
    videoDuration: {
      type: DataTypes.INTEGER,
      defaultValue: 30, // Default video consultation duration in minutes
      allowNull: false,
    },
    homeVisitDuration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "provider_appointment_settings",
    timestamps: false,
  }
);

// Associate ProviderAppointmentSettings with Provider
Provider.hasMany(ProviderAppointmentSettings, {
  foreignKey: "provider_id",
  as: "appointmentSettings",
});
ProviderAppointmentSettings.belongsTo(Provider, {
  foreignKey: "provider_id",
});

// Export the ProviderAppointmentSettings model
module.exports = ProviderAppointmentSettings;
