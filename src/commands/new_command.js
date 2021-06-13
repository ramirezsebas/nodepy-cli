import execa from "execa";
import inquirer from "inquirer";
import path from "path";
import chalk from "chalk";
import Listr from "listr";
import fs from "fs";
import { projectInstall, install } from "pkg-install";

import {
  copyFile,
  fileReplaceText,
  verifFile,
} from "../helpers/file_helper.js";
import { Command } from "../classes/command.js";
import { errorHandle } from "../helpers/error_handle.js";
import {
  db_conexion_mongoose,
  db_conexion_sequelize,
  db_mongoose_bolierplate_commonjs,
  db_seq_bolierplate_commonjs,
  db_seq_bolierplate_esm,
} from "../helpers/boilerplate_db.js";

class NewCommand extends Command {
  constructor(projectPath = "", projectName = "") {
    super("new");
    this.projectName = projectName;
    this.projectPath = projectPath;

    //Default Type, Database, etc
    this.database = "Postgres";
    this.projectType = "CommonJS";
    this.isGitRepository = true;
    this.templatePath = path.join(
      process.platform === "win32"
        ? new URL(import.meta.url).pathname.substring(1)
        : new URL(import.meta.url).pathname,
      "../../../templates/javascript",
      this.projectType
    );
  }

  async createProject() {
    //Ask user if he wants to initialize a git repository
    let isGitInit = await inquirer.prompt([
      {
        type: "confirm",
        message: "Would you like to initialize a git repository?",
        name: "git",
        default: true,
      },
    ]);

    this.isGitRepository = isGitInit.git;

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

    this.projectType = projectTypeAnswer.typeProject;

    //Check if the template file exists
    await verifFile(this.templatePath);

    this.database = await this.selectDatabase();

    await this.tasksHandler();

    //Confirm the creation of a New Project
    console.log(
      `%s The Project was Created Successfully
      - Project Name: ${this.projectName}
      - Type: ${this.projectType}
      - Database: ${this.database}
      - Git Repository Initialized: ${this.isGitRepository}
    %s
    cd ${this.projectName}
    `,
      chalk.green.bold("DONE: "),
      chalk.green.bold("Na'ape nde Proyecto")
    );
  }

  async initializeGit() {
    try {
      const { stdout } = await execa(`git`, ["init"], {
        preferLocal: true,
        cwd: this.projectPath,
      });
      console.log(stdout);
    } catch (error) {
      errorHandle("Error while trying to initialize with Git", error);
    }
  }

  async selectDatabase() {
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
    return selectedDb.db;
  }

  async tasksHandler() {
    try {
      let taskObjs = [
        {
          title: `Creating Structure for ${this.projectName}`,
          task: () => copyFile(this.projectPath, this.templatePath),
        },
        {
          title: "Renaming Project in Package.json",
          task: () => {
            //Rename Package.json -> name with project name
            let pkgJsonPath = path.resolve(this.projectPath, "package.json");
            fileReplaceText(pkgJsonPath, "my-node-project", this.projectName);
          },
        },
        {
          title: "Installing all the General Dependencies.",
          task: () =>
            projectInstall({
              cwd: this.projectPath,
            }),
        },
        {
          title: `Installing All the Dependencies for the Selected Database.(${this.database})`,
          task: () => this.installDatabaseDependencies(),
        },
        {
          title: `Creating Conexion with Database.(${this.database})`,
          task: () => this.createDatabaseConexion(),
        },
      ];

      if (this.isGitRepository) {
        taskObjs.push({
          title: `Initializing a Git Repository`,
          task: () => this.initializeGit(),
        });
      }

      const tasks = new Listr(taskObjs);

      await tasks.run();
    } catch (error) {
      //Modificar por que si se crea
      errorHandle(`Could'nt create the project ${this.projectName}`, error);
    }
  }

  async installDatabaseDependencies() {
    const dbDependencies = {
      sequelize: "^6.6.2",
    };
    const option = {
      cwd: this.projectPath,
    };
    try {
      let dependency = null;
      switch (this.database.toLowerCase()) {
        case "postgres":
          dependency = await install(
            {
              ...dbDependencies,
              pg: "^8.6.0",
              "pg-hstore": "^2.3.3",
            },
            option
          );

          break;

        case "mysql":
          dependency = await install(
            {
              ...dbDependencies,
              mysql2: "^2.2.5",
            },
            option
          );

          break;

        case "mariadb":
          dependency = await install(
            {
              ...dbDependencies,
              mariadb: "^2.5.3",
            },
            option
          );

          break;

        case "sqlite":
          dependency = await install(
            {
              ...dbDependencies,
              sqlite3: "^5.0.2",
            },
            option
          );

          break;

        case "sql server":
          dependency = await install(
            {
              ...dbDependencies,
              tedious: "^11.0.9",
            },
            option
          );

          break;
        case "mongodb":
          dependency = await install(
            {
              mongodb: "^3.6.9",
              mongoose: "^5.12.13",
            },
            option
          );

          break;

        default:
          errorHandle(`Please Choose a Valid Database `);
          break;
      }
    } catch (error) {
      errorHandle(`Could'nt install Database Dependency `, error);
    }
  }

  createDatabaseConexion() {
    //Go to database driver
    let dbDriver = path.resolve(this.projectPath, "src/database");

    //Define the structure being used
    let context = db_seq_bolierplate_commonjs();
    if (this.projectType === "ESM") context = db_seq_bolierplate_esm();

    this.createDBDriverFile(dbDriver, context);

    try {
      let db_con = db_conexion_sequelize();
      if (this.database === "Mongodb") {
        db_con = db_conexion_mongoose();
        fs.appendFile(
          path.resolve(this.projectPath, ".env"),
          "\nMONGODB=",
          (err) => {
            if (err) errorHandle("Error", err);
          }
        );
        let config = path.resolve(
          this.projectPath,
          "src/config/env_variables.js"
        );

        fileReplaceText(
          config,
          "};",
          `
mongoDb: process.env.MONGODB
};
                `
        );
      }

      let serverPath = path.resolve(this.projectPath, "src", "server.js");
      fileReplaceText(serverPath, "databaseConex() {}", db_con);
    } catch (error) {
      errorHandle(`Error Modifing file server.js}`, error);
    }
  }

  createDBDriverFile(dbDriver, context) {
    fs.writeFile(
      path.resolve(dbDriver, "database_driver.js"),
      context,
      (err) => {
        if (err)
          errorHandle(
            `Could'nt create the Database Conexion in server.js`,
            err
          );
        console.log(
          `Successfully created the Database Conexion in server.js
  %s
          `,
          chalk.yellow.bold(
            "Please fill in your .env to Successfully Establish a Conexion with your Database "
          )
        );
      }
    );
  }
}

export default NewCommand;
