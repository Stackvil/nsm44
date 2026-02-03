const sequelize = require('../config/database');
const User = require('./User');
const Content = require('./Content');
const Transaction = require('./Transaction');

const initDb = async () => {
    try {
        await sequelize.sync({ alter: true }); // Schema updated with Content status/createdBy
        console.log('Database synced');
    } catch (error) {
        console.error('Database sync failed:', error);
    }
}

module.exports = {
    User,
    Content,
    Transaction,
    initDb
};
