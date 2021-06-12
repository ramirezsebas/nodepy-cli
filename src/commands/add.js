import path from "path";
import fs from "fs";
import { errorHandle } from "../helpers/error_handle";

export const add_model_command = (currentPath, modelName) => {
  //Navigate to models directory
  let modelsDirectory = path.resolve(currentPath, "src/models");

  //All models should be in singular
  let newModelName = "";
  if (modelName.endsWith("s"))
    newModelName = modelName.substring(0, modelName.length - 1);

  let model = `
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
