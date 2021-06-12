export const db_seq_bolierplate_commonjs = () => {
  return `
const {
  bdName,
  bd,
  userBd,
  passswordBd,
  host
} = require("../config/env_variables.js");

const sequelize = require("sequelize") 
const sequelize = new Sequelize(bdName, userBd, passswordBd, {
    host: host,
    dialect: bd,
  });


Object.freeze(sequelize);
module.exports = sequelize;
`;
};

export const db_seq_bolierplate_esm = () => {
  return `
import {
  bdName,
  bd,
  userBd,
  passswordBd,
  host
} from "../config/env_variables.js";

import sequelize from 'sequelize';

const sequelize = new Sequelize(bdName, userBd, passswordBd, {
    host: host,
    dialect: bd,
  });


Object.freeze(sequelize);
  
export default sequelize;
`;
};

export const db_conexion_sequelize = () => {
  let dbAuth = `
databaseConex() {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
}
`;
  return dbAuth;
};

export const db_mongoose_bolierplate_commonjs = () => {
  let dc_con = `
import { mongoDB } from "../config/env_variables.js";

  const mongoose = require("mongoose");
const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB, {
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
import { mongoDB } from "../config/env_variables.js";
import mongoose from "mongoose";

export const dbConnect = async () => {
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
`;
  return dc_con;
};

export const db_conexion_mongoose = () => {
  let dbAuth = `
databaseConex() {
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
