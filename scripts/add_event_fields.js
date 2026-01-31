const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const queryInterface = sequelize.getQueryInterface();

async function addEventFields() {
    try {
        console.log('Adding eventDate column...');
        await queryInterface.addColumn('Contents', 'eventDate', {
            type: Sequelize.DATEONLY,
            allowNull: true
        });
        console.log('eventDate column added.');

        console.log('Adding batch column...');
        await queryInterface.addColumn('Contents', 'batch', {
            type: Sequelize.STRING,
            allowNull: true
        });
        console.log('batch column added.');

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        // We don't close the connection here because queryInterface uses the shared sequelize instance
        // But in a standalone script we might want to ensure the process exits
        process.exit();
    }
}

addEventFields();
