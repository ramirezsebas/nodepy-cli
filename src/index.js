import chalk from "chalk";
import ncp from "ncp";
import path from "path";
import { access, constants } from "fs";
import { promisify } from "util";
import Listr from "listr";
import { projectInstall, install } from "pkg-install";
import inquirer from "inquirer";
import ora from "ora";

const fileExists = promisify(access);
const copy = promisify(ncp);

export const createProject = async (nombreProyecto, pathProject, type) => {
  //Obtenemos la ruta del template
  const currentUrl = new URL(import.meta.url).pathname;

  let copyTemplatePath = path.join(
    process.platform === "win32" ? currentUrl.substring(1) : currentUrl,
    "../../templates/javascript",
    type
  );

  let finalPathProject = path.resolve(pathProject, nombreProyecto);

  try {
    //Verificamos si existe la ruta
    await verifTemplate(copyTemplatePath);

    const selectDb = await inquirer.prompt([
      {
        type: "list",
        name: "db",
        message: "Que Base de Datos deseas utilizar?",
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

    const tasks = new Listr([
      {
        title: "Copiar la Estructura del Proyecto.",
        task: () => copy_project_structure(finalPathProject, copyTemplatePath),
      },
      {
        title: "Instalar Todas las Dependencias Generales.",
        task: () =>
          projectInstall({
            cwd: finalPathProject,
          }),
      },
      {
        title: "Instalar las Dependencias de la Base de Datos Seleccionado.",
        task: () => db_choice(selectDb.db),
      },
    ]);

    await tasks.run();

    console.log(
      `%s Se ha creado el Proyecto ${nombreProyecto}`,
      chalk.green.bold("DONE")
    );
  } catch (error) {
    console.error(error);
  }
};

const db_choice = async (db) => {
  const dbDependencies = {
    sequelize: "^6.6.2",
  };
  switch (db.toLowerCase()) {
    case "postgres":
      await install({
        ...dbDependencies,
        pg: "^8.6.0",
        "pg-hstore": "^2.3.3",
      });

      break;

    case "mysql":
      await install({
        ...dbDependencies,
        mysql2: "^2.2.5",
      });

      break;

    case "mariadb":
      await install({
        ...dbDependencies,
        mariadb: "^2.5.3",
      });

      break;

    case "sqlite":
      await install({
        ...dbDependencies,
        sqlite3: "^5.0.2",
      });

      break;

    case "sql server":
      await install({
        ...dbDependencies,
        tedious: "^11.0.9",
      });

      break;
    case "mongodb":
      await install({
        mongodb: "^3.6.9",
        mongoose: "^5.12.13",
      });

      break;

    default:
      break;
  }
};

async function verifTemplate(copyTemplatePath) {
  try {
    console.log(copyTemplatePath);
    await fileExists(copyTemplatePath, constants.R_OK);
  } catch (error) {
    console.error(
      `%s NO existe el Template ${copyTemplatePath}`,
      chalk.red.bold("ERROR")
    );
    process.exit(1);
  }
}

const copy_project_structure = async (pathProject, templatePathProject) => {
  //Usamos para copiar
  return copy(templatePathProject, pathProject, {
    clobber: false,
  });
};
