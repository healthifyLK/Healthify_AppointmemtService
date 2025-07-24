const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

// Define the AppointmentStatus Model
const AppointmentStatus = sequelize.define('AppointmentStatus', {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
},{
    tableName: 'appointment_statuses',
    timestamps: false
})

module.exports = AppointmentStatus;