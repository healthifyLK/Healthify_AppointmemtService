const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Provider = require("./provider");
const AppointmentType = require("./appointmentType");

// Define the TimeSlot model
const TimeSlot = sequelize.define(
  "TimeSlot",
  {
    time_slot_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_booked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "time_slots",
    timestamps: false,
  }
);

// Associate TimeSlot with Provider
TimeSlot.belongsTo(Provider, {
  foreignKey: "provider_id",
});
// Associate TimeSlot with AppointmentType
TimeSlot.belongsTo(AppointmentType, {
  foreignKey: "appointment_type_id",
});

module.exports = TimeSlot;
