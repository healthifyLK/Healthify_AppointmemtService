const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const AppointmentType = require("./appointmentType");
const AppointmentMode = require("./appointmentMode");
const Provider = require("./provider");

// Define the Appointment Model
const Appointment = sequelize.define(
  "Appointment",
  {
    appointment_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    scheduled_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    consultationLog: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "Booked",
        "Completed",
        "Cancelled",
        "Confirmed",
        "In Progress",
        "Payment Pending"
      ),
      allowNull: false,
    },
  },
  {
    tableName: "appointments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Associations
Appointment.belongsTo(AppointmentType, { foreignKey: "appointment_type_id" });
Appointment.belongsTo(AppointmentMode, { foreignKey: "appointment_mode_id" });
Appointment.belongsTo(Provider, { foreignKey: "provider_id" });

module.exports = Appointment;
