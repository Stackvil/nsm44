require('dotenv').config();

module.exports = {
    development: {
        dialect: 'sqlite',
        storage: './database.sqlite'
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'postgres', // or 'mysql'
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
};
