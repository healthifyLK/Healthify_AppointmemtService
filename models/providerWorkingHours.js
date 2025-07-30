const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');
const Provider = require('./provider');

// Define the working hours model for providers
const ProviderWorkingHours = sequelize.define('ProviderWorkingHours', {
    working_hours_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    dayOfWeek: {
        type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
        allowNull: false,
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
},{
    tableName: 'provider_working_hours',
    timestamps: false,
})

// Associate ProviderWorkingHours with Provider
Provider.hasMany(ProviderWorkingHours, {
    foreignKey: 'provider_id',
    as: 'workingHours',
});
ProviderWorkingHours.belongsTo(Provider, {
    foreignKey: 'provider_id',
});

module.exports = ProviderWorkingHours;