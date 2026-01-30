const sequelize = require('../config/database');
const User = require('./User');
const Content = require('./Content');

const initDb = async () => {
    try {
        await sequelize.sync({ force: false }); // Schema updated with Content status/createdBy
        console.log('Database synced');
    } catch (error) {
        console.error('Database sync failed:', error);
    }
}

module.exports = {
    User,
    Content,
    initDb
};
