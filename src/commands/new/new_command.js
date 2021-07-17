import inquirer from "inquirer";
import chalk from "chalk";
import path from "path";
import Listr from "listr";
import { projectInstall, install } from "pkg-install";

import {
    copyFile,
    fileReplaceText,
    verifFile,
} from "../../helpers/file_helper.js";

export const newCommand = async (project) => {
    try {
        await createProject(project);
    } catch (error) {
        console.error("Error Creating Project ", error);
    }
}

async function createProject(project) {
    if (!project.getProjectName()) {
        try {
            await createProjectName(project);
        } catch (error) {
            console.error("Error Creating Project and Workspace Name", error);
        }
    }

    //Directorio del Proyecto
    project.setProjectPath(path.resolve(process.cwd(), project.getProjectName()));


    //Inicializar GIT
    try {
        await initializeGit(project);
    } catch (error) {
        console.error("Error initializing Git", error);
    }


    try {
        //Ask the Project Type
        await createProjectType(project);
    } catch (error) {
        console.error("Error Setting Up the Project Type", error);
    }

    //Check if the template file exists
    project.setTemplatePath();
    try {
        await verifFile(project.getTemplatePath());
    } catch (error) {
        console.error("Error Verifying the Template File", error);
    }

    try {
        await selectDatabase(project);
    } catch (error) {
        console.error("Error Creating Database", error);
    }

    try {

        await tasksHandler(project);
    } catch (error) {
        console.error("Error Project", error);
    }

    //Confirm the creation of a New Project
    console.log(
        `%s The Project was Created Successfully
          - Project Name: ${project.getProjectName()}
          - Type: ${project.getProjectType()}
          - Database: ${project.getDatabase()}
          - Git Repository Initialized: ${project.getIsGitInit()}
        %s
        %s
        cd ${project.getProjectName()}
        npm run dev
        `,
        chalk.green.bold("DONE: "),
        chalk.green.bold("Na'ape nde Proyecto"),
        chalk.green.bold("Happy Coding!"),
    );

}

async function createProjectType(project) {
    let projectTypeAnswer = await inquirer.prompt([
        {
            type: "list",
            name: "typeProject",
            message: "What type will you be using?",
            choices: ["CommonJS", "ESM"],
            default: "CommonJS",
        },
    ]);

    project.setProjectType(projectTypeAnswer.typeProject.toLowerCase());
}

async function initializeGit(project) {
    let isGitInit = await inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to initialize a git repository?",
            name: "git",
            default: true,
        },
    ]);
    project.setIsGitInit(isGitInit.git);
}

async function createProjectName(project) {
    const newProject = await inquirer.prompt([
        {
            type: "input",
            message: "What would be the name of your Workspace and Project?",
            name: "projectName",
        },
    ]);
    project.setProjectName(newProject.projectName);
}

async function selectDatabase(project) {
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
    project.setDatabase(selectedDb.db);
}

async function tasksHandler(project) {

    let taskObjs = [
        {
            title: `Creating Structure for ${project.getProjectName()}`,
            task: async () => {
                try {
                    await copyFile(project.getProjectPath(), project.getTemplatePath());
                } catch (error) {
                    throw new Error(`Error Creating Structure for ${project.getProjectName()}: \n error`);
                }
            }
        },
        {
            title: "Renaming Project in Package.json",
            task: async () => {
                try {
                    //Rename Package.json -> name with project name
                    let pkgJsonPath = path.resolve(project.getProjectPath(), "package.json");
                    await fileReplaceText(pkgJsonPath, "my-node-project", project.getProjectName());

                } catch (error) {
                    throw new Error(`Error Renaming Project in Package.json: \n ${error}`)
                }

            },
        },
        {
            title: "Installing all the General Dependencies.",
            task: async () => {
                try {
                    await projectInstall({
                        cwd: project.getProjectPath(),
                    });
                } catch (error) {
                    throw new Error(`Installing all the General Dependencies: \n ${error}`);
                }
            }

        },
        {
            title: `Installing All the Dependencies for the Selected Database.(${project.getDatabase()})`,
            task: async () => {
                try {
                    await installDatabaseDependencies(project);
                } catch (error) {
                    throw new Error(`Error Installing All the Dependencies for the Selected Database.(${project.getDatabase()}) \n ${error}`);
                }
            }
        },
        {
            title: `Creating Conexion with Database.(${project.getDatabase()})`,
            task: async () => {

                if (project.getDatabase().toLowerCase() === "mongodb") {
                    changeToMoongoseDatabase(project);
                    return;
                }
                let databaseFile = path.resolve(project.getProjectPath(), "src/config/database.config.js");
                let db = project.getDatabase().toLowerCase();
                fileReplaceText(databaseFile, 'const mongoose = require("mongoose");', "");


                if (db !== "postgres") {
                    if (db = "sql server") {
                        fileReplaceText(databaseFile, "postgres", "mssql");
                        return;
                    }
                    fileReplaceText(databaseFile, "postgres", db);
                }
                console.log("REMEMBER TO ADD .env FILE FOR CONNECTING DATABASE!")



            }
        },
    ];

    if (project.getIsGitInit()) {
        taskObjs.push({
            title: `Initializing a Git Repository`,
            task: async () => {
                try {
                    await project.getIsGitInit()
                } catch (error) {
                    throw new Error(`Error Initializing a Git Repository: \n ${error}`);
                }

            },
        });
    }

    const tasks = new Listr(taskObjs);

    await tasks.run();

}

async function installDatabaseDependencies(project) {
    const dbDependencies = {
        sequelize: "^6.6.2",
    };
    const option = {
        cwd: project.getProjectPath(),
    };
    try {
        let dependency = null;
        switch (project.getDatabase().toLowerCase()) {
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

function changeToMoongoseDatabase(project) {
    let moongooseConnection = `await mongoose.connect(environments.mongoDb, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
          });`;

    let databaseFile = path.resolve(this.projectPath, "src/config/database.config.js");

    fileReplaceText(databaseFile, "await Database.sequelize.authenticate();", moongooseConnection);
    fileReplaceText(databaseFile, `    static sequelize = new Sequelize(environments.databaseName, environments.databaseUser, environments.databasePassword, {
            host: environments.host,
            dialect: "postgres",
        });
         `, "")
    fileReplaceText(databaseFile, `const { Sequelize } = require('sequelize');`, "");
    addMongoDbEnvironmentVariable(project);
}

function addMongoDbEnvironmentVariable(project) {
    let config = path.resolve(
        project.getProjectPath(),
        "src/config/environments.config.js"
    );

    let finalLine = "};";
    let addMongoLine = "mongoDb: process.env.MONGODB\n};"

    //     fileReplaceText(
    //         config,
    //         "};",
    //         `
    // mongoDb: process.env.MONGODB
    // };              `
    //     );
    fileReplaceText(
        config,
        finalLine,
        addMongoLine);
}

