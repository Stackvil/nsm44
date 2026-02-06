require('dotenv').config();

const hasDbConfig = process.env.DB_USERNAME && process.env.DB_NAME;

const dbConfig = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'postgres', // Default to postgres, change to 'mysql' if needed
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
};

module.exports = {
    development: hasDbConfig ? dbConfig : {
        dialect: 'sqlite',
        storage: './database.sqlite'
    },
    production: dbConfig
};
