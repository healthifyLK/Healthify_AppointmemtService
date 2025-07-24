const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

// Define the TimeSlot model
const TimeSlot = sequelize.define('TimeSlot', {
    time_slot_id :{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        autoIncrement: false
    },
    start_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    is_booked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},{
    tableName: 'time_slots',
    timestamps: false,
    
})

module.exports = TimeSlot;