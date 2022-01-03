import Sequelize from "sequelize";
// import mongoose from "mongoose";

import { environments } from './environment.config.js';
export class Database {
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
