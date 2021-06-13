import { access, readFile, writeFile, constants } from "fs";
import { promisify } from "util";
import ncp from "ncp";
import { errorHandle } from "./error_handle";

export const fileExists = promisify(access);

export const copy = promisify(ncp);

export const copyFile = async (destinationPath, srcPath) => {
  try {
    return copy(srcPath, destinationPath, {
      clobber: false,
    });
  } catch (error) {
    errorHandle(`ERROR: File ${srcPath} could'nt be copied`, error);
  }
};

export const verifFile = async (templatePath) => {
  try {
    await fileExists(templatePath, constants.R_OK);
  } catch (error) {
    errorHandle(`ERROR: File ${templatePath} doesn't Exist`, error);
  }
};

export const fileReplaceText = (file, context, replaceContext) => {
  try {
    readFile(file, "utf-8", function (err, data) {
      if (err) errorHandle(`Could'nt read the file ${file}`);
      let newFile = data.replace(context, replaceContext);
      writeFile(file, newFile, "utf-8", (err) => {
        if (err)
          errorHandle(`%s`, chalk.red.bold(`Could'nt write the file ${file}`));
      });
    });
  } catch (error) {
    errorHandle(`Error Modifing file ${file}`, error);
  }
};
