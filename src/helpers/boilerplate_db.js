export const db_seq_bolierplate_commonjs = (isTS) => {
  return `
const {
  bdName,
  bd,
  userBd,
  passswordBd,
  host
} = require("../config/environment.${isTS?'ts':'js'}");

const sequelize = require("sequelize") 
const sequelize = new Sequelize(bdName, userBd, passswordBd, {
    host: host,
    dialect: bd,
  });


module.exports = sequelize;
`;
};

export const db_seq_bolierplate_esm = (isTS) => {
  return `
import {
  bdName,
  bd,
  userBd,
  passswordBd,
  host
} from "../config/environment.${isTS?'ts':'js'}";

import sequelize from 'sequelize';

const database = new Sequelize(bdName, userBd, passswordBd, {
    host: host,
    dialect: bd,
  });

export default database;
`;
};

export const db_conexion_sequelize = () => {
  let dbAuth = `
  connectDatabase() {
    try {
      await database.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
}
`;
  return dbAuth;
};

export const db_mongoose_bolierplate_commonjs = (isTS) => {
  let dc_con = `
const { mongoDB } = require("../config/environment.${isTS?'ts':'js'}");

const mongoose = require("mongoose");
const dbConnect = async () => {
  try {
    await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Base de Datos Online");
  } catch (error) {
    console.log(error);
    throw new Error("Error Conexion to DB");
  }
};

module.exports = { dbConnect };
`;
  return dc_con;
};

export const db_mongoose_bolierplate_esm = () => {
  let dc_con = `
import { mongoDB } from "../config/environment.${isTS?'ts':'js'}";
import mongoose from "mongoose";

const database = async () => {
  try {
    await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Base de Datos Online");
  } catch (error) {
    console.log(error);
    throw new Error("Error Conexion to DB");
  }
}

export default database;
`;
  return dc_con;
};

export const db_conexion_mongoose = () => {
  let dbAuth = `
  connectDatabase() {
    try {
      await dbConnect();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
}
`;
  return dbAuth;
};
