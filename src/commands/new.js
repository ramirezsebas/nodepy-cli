import chalk from "chalk";
import ncp from "ncp";
import path from "path";
import { access, constants } from "fs";
import { promisify } from "util";
import Listr from "listr";
import { projectInstall, install } from "pkg-install";
import inquirer from "inquirer";
import fs from "fs";

import { errorHandle } from "../helpers/error_handle";

const fileExists = promisify(access);
const copy = promisify(ncp);

export const new_command = async (currentPath, projectName) => {
  //Ask the Project Type
  let projectTypeAnswer = await inquirer.prompt([
    {
      type: "list",
      name: "typeProject",
      message: "What type will you be using?",
      choices: ["COMMONJS", "ESM"],
      default: "COMMONJS",
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

  //Rename Package.json -> name with project name
  let pkgJsonPath = path.resolve(templatePath, "package.json");

  modifyPackageJson(pkgJsonPath, projectName);

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

  // Create final path of project where template will be copied
  let finalPathProject = path.resolve(currentPath, projectName);

  await executeTasks(projectName, finalPathProject, templatePath, selectedDb);

  console.log(
    `%s The Project was Created Successfully
      - Project Name: ${projectName} 
      - Type: ${typeProject}
      - Database: ${selectedDb.db}
    `,
    chalk.green.bold("DONE: ")
  );
};

async function executeTasks(
  projectName,
  finalPathProject,
  copyTemplatePath,
  selectedDb
) {
  try {
    const tasks = new Listr([
      {
        title: `Creating Structure for ${projectName}`,
        task: () => copy_project_structure(finalPathProject, copyTemplatePath),
      },
      {
        title: "Installing all the general Dependencies.",
        task: () =>
          projectInstall({
            cwd: finalPathProject,
          }),
      },
      {
        title: "Installing all the Dependencies for the Selected Database.",
        task: () => db_choice(selectedDb.db, finalPathProject),
      },
    ]);

    await tasks.run();
  } catch (error) {
    errorHandle(
      `%s`,
      chalk.red.bold(`Could'nt create the project ${projectName}`)
    );
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
    switch (db.toLowerCase()) {
      case "postgres":
        let a = await install(
          {
            ...dbDependencies,
            pg: "^8.6.0",
            "pg-hstore": "^2.3.3",
          },
          option
        );
        console.log(a);
        break;

      case "mysql":
        await install(
          {
            ...dbDependencies,
            mysql2: "^2.2.5",
          },
          option
        );

        break;

      case "mariadb":
        await install(
          {
            ...dbDependencies,
            mariadb: "^2.5.3",
          },
          option
        );

        break;

      case "sqlite":
        await install(
          {
            ...dbDependencies,
            sqlite3: "^5.0.2",
          },
          option
        );

        break;

      case "sql server":
        await install(
          {
            ...dbDependencies,
            tedious: "^11.0.9",
          },
          option
        );

        break;
      case "mongodb":
        await install(
          {
            mongodb: "^3.6.9",
            mongoose: "^5.12.13",
          },
          option
        );

        break;

      default:
        break;
    }
  } catch (error) {
    errorHandle(`%s`, chalk.red.bold(`Could'nt install database Dependency `));
  }
};

const copy_project_structure = async (pathProject, templatePathProject) => {
  //Usamos para copiar
  try {
    return copy(templatePathProject, pathProject, {
      clobber: false,
    });
  } catch (error) {
    errorHandle(`ERROR: File ${templatePathProject} could'nt be copied`);
  }
};

async function verifFile(copyTemplatePath) {
  try {
    await fileExists(copyTemplatePath, constants.R_OK);
  } catch (error) {
    errorHandle(`ERROR: File ${copyTemplatePath} doesn't Exist`);
  }
}

function modifyPackageJson(pkgJsonPath, projectName) {
  try {
    fs.readFile(pkgJsonPath, "utf-8", function (err, data) {
      if (err)
        errorHandle(
          `%s`,
          chalk.red.bold(`Could'nt read the file ${pkgJsonPath}`)
        );
      let newPkgJson = data.replace("my-node-project", projectName); // string
      fs.writeFile(pkgJsonPath, newPkgJson, "utf-8", (err) => {
        if (err)
          errorHandle(
            `%s`,
            chalk.red.bold(`Could'nt write the file ${pkgJsonPath}`)
          );
      });
    });
  } catch (error) {
    errorHandle(`%s`, chalk.red.bold(`Error Modifing file ${pkgJsonPath}`));
  }
}
