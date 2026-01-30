const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Content = sequelize.define('Content', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    section: {
        type: DataTypes.STRING,
        defaultValue: 'home'
    },
    isVisible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

module.exports = Content;
