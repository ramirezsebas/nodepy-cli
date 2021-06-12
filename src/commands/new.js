import chalk from "chalk";

import Listr from "listr";
import path from "path";
import inquirer from "inquirer";
import fs from "fs";
import execa from "execa";

import { constants } from "fs";
import { projectInstall, install } from "pkg-install";
import { errorHandle } from "../helpers/error_handle.js";
import {
  db_conexion_mongoose,
  db_conexion_sequelize,
  db_seq_bolierplate_commonjs,
  db_seq_bolierplate_esm,
} from "../helpers/boilerplate_db.js";
import { copy, fileExists } from "../helpers/file_helper.js";

export const new_command = async (currentPath, projectName) => {
  // Create final path of project where template will be copied
  let finalPathProject = path.resolve(currentPath, projectName);

  //Ask if they want to initialize a git repository
  let isGitInit = await inquirer.prompt([
    {
      type: "confirm",
      message: "Would you like to initialize a git repository?",
      name: "gitInit",
      default: true,
    },
  ]);

  const { gitInit } = isGitInit;

  //Ask the Project Type
  let projectTypeAnswer = await inquirer.prompt([
    {
      type: "list",
      name: "typeProject",
      message: "What type will you be using?",
      choices: ["CommonJS", "ESM"],
      default: "CommonJS",
    },
  ]);

  const { typeProject } = projectTypeAnswer;

  //Get the template's path
  const currentFilePath = new URL(import.meta.url).pathname;

  let templatePath = path.join(
    process.platform === "win32"
      ? currentFilePath.substring(1)
      : currentFilePath,
    "../../../templates/javascript",
    typeProject
  );

  //Check if the template file exists
  await verifFile(templatePath);

  // Pick prefered Database
  const selectedDb = await inquirer.prompt([
    {
      type: "list",
      name: "db",
      message: "What Database do you prefer?",
      choices: [
        "Postgres",
        "Mysql",
        "Mongodb",
        "Mariadb",
        "Sqlite",
        "Sql Server",
      ],
      default: "Postgres",
    },
  ]);

  //Excecute sequentially each task
  await executeTasks(
    projectName,
    finalPathProject,
    templatePath,
    selectedDb,
    gitInit
  );

  //Confirm the creation of a New Project
  console.log(
    `%s The Project was Created Successfully
      - Project Name: ${projectName}
      - Type: ${typeProject}
      - Database: ${selectedDb.db}
      - Git Repository Initialized: ${gitInit}
    %s
    cd ${projectName}
    `,
    chalk.green.bold("DONE: "),
    chalk.green.bold("Na'ape nde Proyecto")
  );
};

const initializeGit = async (path) => {
  try {
    const { stdout } = await execa(`git`, ["init"], {
      preferLocal: true,
      cwd: path,
    });
    console.log(stdout);
  } catch (error) {
    errorHandle("Error while trying to initialize with Git", error);
  }
};

async function executeTasks(
  projectName,
  finalPathProject,
  copyTemplatePath,
  selectedDb,
  isGitInit,
  projectTypeAnswer
) {
  try {
    let taskObjs = [
      {
        title: `Creating Structure for ${projectName}`,
        task: () => copy_project_structure(finalPathProject, copyTemplatePath),
      },
      {
        title: "Renaming Project in Package.json",
        task: () => {
          //Rename Package.json -> name with project name
          let pkgJsonPath = path.resolve(finalPathProject, "package.json");

          modifyPackageJson(pkgJsonPath, projectName);
        },
      },
      {
        title: "Installing all the General Dependencies.",
        task: () =>
          projectInstall({
            cwd: finalPathProject,
          }),
      },
      {
        title: "Installing all the Dependencies for the Selected Database.",
        task: () => db_choice(selectedDb.db, finalPathProject),
      },
      {
        title: `Creating Conexion with Database for ${selectedDb.db}`,
        task: () =>
          createDatabaseConexion(
            finalPathProject,
            projectTypeAnswer,
            selectedDb
          ),
      },
    ];

    if (isGitInit) {
      taskObjs.push({
        title: `Initializing a Git Repository`,
        task: () => initializeGit(finalPathProject),
      });
    }

    const tasks = new Listr(taskObjs);

    await tasks.run();
  } catch (error) {
    //Modificar por que si se crea
    errorHandle(`Could'nt create the project ${projectName}`, error);
  }
}

const db_choice = async (db, finalPathProject) => {
  const dbDependencies = {
    sequelize: "^6.6.2",
  };
  const option = {
    cwd: finalPathProject,
  };
  try {
    let dependency = null;
    switch (db.toLowerCase()) {
      case "postgres":
        dependency = await install(
          {
            ...dbDependencies,
            pg: "^8.6.0",
            "pg-hstore": "^2.3.3",
          },
          option
        );
        console.log(dependency);
        break;

      case "mysql":
        dependency = await install(
          {
            ...dbDependencies,
            mysql2: "^2.2.5",
          },
          option
        );

        console.log(dependency);
        break;

      case "mariadb":
        dependency = await install(
          {
            ...dbDependencies,
            mariadb: "^2.5.3",
          },
          option
        );

        console.log(dependency);
        break;

      case "sqlite":
        dependency = await install(
          {
            ...dbDependencies,
            sqlite3: "^5.0.2",
          },
          option
        );

        console.log(dependency);
        break;

      case "sql server":
        dependency = await install(
          {
            ...dbDependencies,
            tedious: "^11.0.9",
          },
          option
        );

        console.log(dependency);
        break;
      case "mongodb":
        dependency = await install(
          {
            mongodb: "^3.6.9",
            mongoose: "^5.12.13",
          },
          option
        );

        console.log(dependency);
        break;

      default:
        errorHandle(`Please Choose a Valid Database `);
        break;
    }
  } catch (error) {
    errorHandle(`Could'nt install database Dependency `, error);
  }
};

const copy_project_structure = async (pathProject, templatePathProject) => {
  try {
    return copy(templatePathProject, pathProject, {
      clobber: false,
    });
  } catch (error) {
    errorHandle(`ERROR: File ${templatePathProject} could'nt be copied`, error);
  }
};

async function verifFile(copyTemplatePath) {
  try {
    await fileExists(copyTemplatePath, constants.R_OK);
  } catch (error) {
    errorHandle(`ERROR: File ${copyTemplatePath} doesn't Exist`, error);
  }
}

function modifyPackageJson(pkgJsonPath, projectName) {
  try {
    fs.readFile(pkgJsonPath, "utf-8", function (err, data) {
      if (err) errorHandle(`Could'nt read the file ${pkgJsonPath}`);
      let newPkgJson = data.replace("my-node-project", projectName);
      fs.writeFile(pkgJsonPath, newPkgJson, "utf-8", (err) => {
        if (err)
          errorHandle(
            `%s`,
            chalk.red.bold(`Could'nt write the file ${pkgJsonPath}`)
          );
      });
    });
  } catch (error) {
    errorHandle(`Error Modifing file ${pkgJsonPath}`, error);
  }
}

const createDatabaseConexion = (
  finalPathProject,
  projectTypeAnswer,
  selectedDb
) => {
  //Go to databse driver
  let dbDriver = path.resolve(finalPathProject, "src/database");

  //Define the structure being used
  let context = db_seq_bolierplate_commonjs();
  if (projectTypeAnswer === "ESM") context = db_seq_bolierplate_esm();

  createDBDriverFile(dbDriver, context);

  try {
    let db_con = db_conexion_sequelize();
    if (selectedDb.db === "Mongodb") {
      db_con = db_conexion_mongoose();
      modifyEnv(finalPathProject);
      let config = path.resolve(
        finalPathProject,
        "src/config/env_variables.js"
      );
      fs.readFile(config, "utf-8", function (err, data) {
        if (err) errorHandle(`Could'nt read the file `);
        let newConfigFile = data.replace(
          "};",
          `
mongoDb: process.env.MONGODB
};
        `
        );
        fs.writeFile(config, newConfigFile, "utf-8", (err) => {
          if (err) errorHandle(`%s`, chalk.red.bold(`Could'nt write the file`));
        });
      });
    }
    let serverPath = path.resolve(finalPathProject, "src", "server.js");
    fs.readFile(serverPath, "utf-8", function (err, data) {
      if (err) errorHandle(`Could'nt read the file server.js`);
      let newServerFile = data.replace("databaseConex() {}", db_con);
      fs.writeFile(serverPath, newServerFile, "utf-8", (err) => {
        if (err)
          errorHandle(
            `%s`,
            chalk.red.bold(`Could'nt write the file server.js`)
          );
      });
    });
  } catch (error) {
    errorHandle(`Error Modifing file server.js}`, error);
  }
};

function modifyEnv(finalPathProject) {
  fs.appendFile(path.resolve(finalPathProject, ".env"), "\nMONGODB=", (err) => {
    if (err) errorHandle("Error", err);
  });
}

function createDBDriverFile(dbDriver, context) {
  fs.writeFile(path.resolve(dbDriver, "database_driver.js"), context, (err) => {
    if (err)
      errorHandle(`Could'nt create the Database Conexion in server.js`, err);
    console.log(
      `Successfully created the Database Conexion in server.js
%s
        `,
      chalk.yellow.bold(
        "Please fill in your .env to Successfully Establish a Conexion with your Database "
      )
    );
  });
}
