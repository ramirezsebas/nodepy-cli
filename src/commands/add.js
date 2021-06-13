import path from "path";
import fs from "fs";
import { errorHandle } from "../helpers/error_handle";

export const add_model_command = (
  currentPath,
  modelName,
  type,
  isSequelize
) => {
  //Navigate to models directory
  let modelsDirectory = path.resolve(currentPath, "src/models");

  //All models should be in singular
  let newModelName = "";
  if (modelName.endsWith("s"))
    newModelName = modelName.substring(0, modelName.length - 1);

  let model = decideModelStructure(type, isSequelize, modelName, newModelName);

  fs.writeFile(
    path.resolve(modelsDirectory, `${modelName}.model.js`),
    model,
    (err) => {
      if (err) errorHandle("Error", err);
      console.log("as");
    }
  );
  return;
};

function decideModelStructure(type, isSequelize, modelName, newModelName) {
  let model = "";
  if (type === "ESM" && isSequelize) {
    model = `
import { DataTypes } from "sequelize";
import databaseDriver from "../database/database_driver.js";
const ${
      modelName.charAt(0).toUpperCase() + modelName.slice(1)
    } = databaseDriver.define(
  "${newModelName ? newModelName : modelName + "s"}",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
export default ${modelName.charAt(0).toUpperCase() + modelName.slice(1)};
`;
  } else if (type === "ESM" && !isSequelize) {
    model = `
import { Schema, model } from "mongoose";

const ${modelName + "Schema"} = Schema({
  id: {
    type: Integer,
  },
});

export default model(${modelName},${modelName + "Schema"});
`;
  } else if (type === "CommonJS" && isSequelize) {
    model = `
const { DataTypes } = require("sequelize");
const databaseDriver = require("../database/database_driver.js");

const ${
      modelName.charAt(0).toUpperCase() + modelName.slice(1)
    } = databaseDriver.define(
  "${newModelName ? newModelName : modelName + "s"}",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
      
module.exports = ${modelName.charAt(0).toUpperCase() + modelName.slice(1)};
`;
  } else if (type === "CommonJS" && !isSequelize) {
    model = `
const { Schema, model } = require("mongoose");
const ${modelName + "Schema"} = Schema({
  id: {
    type: Integer,
  },
});

module.exports = model(${modelName},${modelName + "Schema"});
`;
  }
  return model;
}
