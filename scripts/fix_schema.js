
const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

async function migrate() {
    const queryInterface = sequelize.getQueryInterface();

    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        // 1. Describe tables to check existing columns
        const usersTable = await queryInterface.describeTable('Users');
        const contentsTable = await queryInterface.describeTable('Contents');

        // 2. Fix Users table: Add fullName if missing
        if (!usersTable.fullName) {
            console.log('Adding fullName to Users table...');
            await queryInterface.addColumn('Users', 'fullName', {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'NSM User' // Default value required for existing rows
            });
            console.log('✅ fullName column added.');
        } else {
            console.log('✓ fullName column already exists in Users.');
        }

        // 3. Fix Contents table: Add year if missing
        if (!contentsTable.year) {
            console.log('Adding year to Contents table...');
            await queryInterface.addColumn('Contents', 'year', {
                type: Sequelize.INTEGER,
                allowNull: true
            });
            console.log('✅ year column added.');
        } else {
            console.log('✓ year column already exists in Contents.');
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await sequelize.close();
    }
}

migrate();
