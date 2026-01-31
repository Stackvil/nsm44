
const sequelize = require('./config/database');
const Content = require('./models/Content');
const User = require('./models/User');

async function migrate() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // This will alter the table to match the model definition
        await Content.sync({ alter: true });
        console.log('Content table synced successfully.');

        await User.sync({ alter: true });
        console.log('User table synced successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

migrate();
