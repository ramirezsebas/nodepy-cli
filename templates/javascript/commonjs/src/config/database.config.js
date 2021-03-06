const { Sequelize } = require('sequelize');
// const mongoose = require("mongoose");

const environments = require("./environments.config.js");
class Database {
    static sequelize = new Sequelize(environments.databaseName, environments.databaseUser, environments.databasePassword, {
        host: environments.host,
        dialect: "postgres",
    });
     
    static async connectDatabase() {
        try {
            await Database.sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }
}

module.exports = Database;