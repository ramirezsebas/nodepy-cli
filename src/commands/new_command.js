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
  db_mongoose_bolierplate_esm,
  db_seq_bolierplate_commonjs,
  db_seq_bolierplate_esm,
} from "../helpers/boilerplate_db.js";

class NewCommand extends Command {
  constructor(projectPath = "", projectName = "",isTS = false) {
    super("new");
    this.projectName = projectName;
    this.projectPath = projectPath;

    //Default Type, Database, etc
    this.database = "Postgres";
    this.isGitRepository = true;
    this.projectType = '';

    this.isTS = isTS;
    
    this.templatePath = path.join(
      process.platform === "win32"
        ? new URL(import.meta.url).pathname.substring(1)
        : new URL(import.meta.url).pathname,
        !this.isTS?
      "../../../templates/javascript"
      :"../../../templates/typescript");
  }


  async getProjectType(){
    let projectTypeAnswer = await inquirer.prompt([
      {
        type: "list",
        name: "typeProject",
        message: "What type will you be using?",
        choices: ["Commonjs", "ESM"],
        default: "Commonjs",
      },
    ]);

    return  projectTypeAnswer.typeProject.toLowerCase();
    
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

    if(!this.isTS){
      this.projectType = await this.getProjectType();
      this.templatePath = path.join(this.templatePath,this.projectType);
    }


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
    //Accedemos a la ruta del archivo database.js
    let dbDriver = path.resolve(this.projectPath, "src/config");

    //Definimos si es ESM o CommonJS
    let context = '';
    if(this.projectType === "esm"){
      if(this.database === "Mongodb"){
        context = db_mongoose_bolierplate_esm();
      }else{
        context = db_seq_bolierplate_esm();
      }
    }else{
      if(this.database === "Mongodb"){
        context = db_mongoose_bolierplate_commonjs();
      }else{
        context = db_seq_bolierplate_commonjs();
      }
    }


    //Creamos el archivo de la base de datos
    this.createDBDriverFile(dbDriver, context);

    console.log(this);
    //Definimos el bd
    let dbContext='';
    if(this.database === "Mongodb"){
      dbContext = db_conexion_mongoose();
      fs.appendFile(
        path.resolve(this.projectPath, ".env"),
        "\nMONGODB=",
        (err) => {
          if (err) errorHandle("Error", err);
        }
      );
      let config = path.resolve(
        this.projectPath,
        `src/config/environment.${this.isTS?'ts':'js'}`
      );

      fileReplaceText(
        config,
        "};",
        `
mongoDb: process.env.MONGODB
};
              `
      );
    }else{
      dbContext = db_conexion_sequelize();
    }

    
    let serverPath = path.resolve(this.projectPath, "src/config", `server.${this.isTS?'ts':'js'}`);
    if(this.isTS){
      fileReplaceText(serverPath,"const database = ()=>{}",dbContext);
      return;
    }
    fileReplaceText(serverPath, "connectDatabase(){}", dbContext);
    
  }

  createDBDriverFile(dbDriver, context) {
    fs.writeFile(
      path.resolve(dbDriver, `database.${this.isTS?'ts':'js'}`),
      context,
      (err) => {
        if (err)
          errorHandle(
            `Could'nt create the Database Conexion in server.${this.isTS?'ts':'js'}`,
            err
          );
        console.log(
          `Successfully created the Database Conexion in server.${this.isTS?'ts':'js'}
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
