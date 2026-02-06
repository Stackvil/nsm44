const { Sequelize } = require('sequelize');
const path = require('path');
const config = require('./config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

let sequelize;

if (dbConfig.storage) {
    sequelize = new Sequelize({
        dialect: dbConfig.dialect,
        storage: dbConfig.storage,
        logging: false
    });
} else {
    sequelize = new Sequelize(
        dbConfig.database,
        dbConfig.username,
        dbConfig.password,
        {
            host: dbConfig.host,
            port: process.env.DB_PORT || 5432,
            dialect: dbConfig.dialect,
            logging: false,
            dialectOptions: dbConfig.dialectOptions
        }
    );
}

module.exports = sequelize;
