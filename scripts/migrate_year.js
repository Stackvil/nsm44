const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

async function migrate() {
    try {
        console.log('Checking for year column in Contents table...');

        // This is a raw query to check and add the column if it doesn't exist.
        // It works for SQLite. For MySQL the syntax might vary slightly but usually ADD COLUMN is standard.
        // Since we are using Sequelize, we can also use queryInterface but that requires more setup.
        // Simple raw query is often easiest for a quick patch.

        try {
            await sequelize.query("ALTER TABLE Contents ADD COLUMN year INTEGER DEFAULT NULL;");
            console.log('Successfully added year column.');
        } catch (error) {
            // If error is "duplicate column name" or similar, we can ignore it.
            if (error.original && (error.original.code === 'ER_DUP_FIELDNAME' || error.message.includes('duplicate column name'))) {
                console.log('Column "year" already exists.');
            } else {
                console.warn('Note: Migration command might have failed if column exists. Error:', error.message);
            }
        }

        console.log('Migration check complete.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        process.exit();
    }
}

migrate();
