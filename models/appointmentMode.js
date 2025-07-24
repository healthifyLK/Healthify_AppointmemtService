const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

// Define the AppointmentMode model
const AppointmentMode = sequelize.define('AppointmentMode', {
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
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'appointment_modes',
    timestamps: false
});

module.exports = AppointmentMode;
