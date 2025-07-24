const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');
const AppointmentType = require('./appointmentType');
const AppointmentStatus = require('./appointmentStatus');
const AppointmentMode = require('./appointmentMode');

// Define the Appointment Model
const Appointment = sequelize.define('Appointment', {
    appointment_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        autoIncrement: false
    },
    patient_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    provider_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    scheduled_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    appointment_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    consultationLog:{
        type: DataTypes.TEXT,
        allowNull: true
    }

},{
    tableName: 'appointments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

// Associations
Appointment.belongsTo(AppointmentType, { foreignKey: 'appointment_type_id' });
Appointment.belongsTo(AppointmentStatus, { foreignKey: 'appointment_status_id' });
Appointment.belongsTo(AppointmentMode, { foreignKey: 'appointment_mode_id' });

module.exports = Appointment;