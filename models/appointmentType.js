const {DataTypes} = require('sequelize');
const sequeslize = require('../config/sequelize');

// Define the AppointmentType model
const AppointmentType = sequeslize.define('AppointmentType', {
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
    },
    
},{
    tableName: 'appointment_types',
    timestamps: false
});

module.exports = AppointmentType;
