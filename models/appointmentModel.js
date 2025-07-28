const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const AppointmentType = require("./appointmentType");
const AppointmentMode = require("./appointmentMode");
const Provider = require("./provider");
const TimeSlot = require("./timeSlot");

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
      allowNull: true,
    },
    consultationLog: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    appointmentCharge :{
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    additionalDetails :{
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
Appointment.belongsTo(TimeSlot, { foreignKey: "time_slot_id" });


module.exports = Appointment;
