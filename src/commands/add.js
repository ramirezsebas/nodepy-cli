import path from "path";
import fs from "fs";
import { errorHandle } from "../helpers/error_handle";

export const add_model_command = (currentPath, modelName) => {
  //Navigate to models directory
  let modelsDirectory = path.resolve(currentPath, "src/models");

  if (modelName.endsWith("s"))
    modelName = modelName.substring(0, modelName.length - 1);

  //Create model.model.js
  createModelFile(modelsDirectory, modelName);

  return;
};

const createModelFile = (modelsDirectory, modelName) => {
  fs.open(
    path.resolve(modelsDirectory, `${modelName}.model.js`),
    "w",
    (err) => {
      if (err) errorHandle(`Error Creating the Model ${modelName}`, err);
      console.log(`Successfully Created the Model ${modelName}`);
    }
  );
};
