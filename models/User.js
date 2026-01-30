const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('super_admin', 'admin', 'rep_admin', 'user'),
        defaultValue: 'user'
    }
});

User.beforeCreate(async (user) => {
    if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
    }
});

module.exports = User;
