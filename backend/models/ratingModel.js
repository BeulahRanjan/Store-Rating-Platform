const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Rating = sequelize.define('Rating', {
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    store_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,  
        references: { model: 'stores', key: 'id' },
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: { model: 'users', key: 'id' },
    },
}, {
    tableName: 'ratings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    noPrimaryKey: false, 
});

module.exports = Rating;