const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Import User for association

const Transaction = sequelize.define('Transaction', {
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'INR'
    },
    type: {
        type: DataTypes.ENUM('donation', 'membership_fee', 'event_registration', 'other'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('completed', 'pending', 'failed'),
        defaultValue: 'pending'
    },
    transactionDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    paymentId: {
        type: DataTypes.STRING, // e.g., Stripe Charge ID
        allowNull: true
    },
    paymentMethod: {
        type: DataTypes.STRING, // e.g., 'card', 'upi'
        allowNull: true
    }
}, {
    timestamps: true
});

// Define Association
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });

module.exports = Transaction;
