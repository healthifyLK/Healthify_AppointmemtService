const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

// Define the Local Provider Model for the database

const Provider = sequelize.define('Provider', {
    provider_id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    maxDailyAppointments: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    appointmentFee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    rating:{
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    homeVisitLimit:{
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    tableName: 'providers',
    timestamps: false,
    
})

// Export the Provider model
module.exports = Provider;