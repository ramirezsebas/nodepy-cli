import inquirer from "inquirer";
import chalk from "chalk";
import { yargsArguments } from "./config/yargs_config.js";
import path from "path";

import { errorHandle } from "./helpers/error_handle.js";
import NewCommand from "./commands/new_command.js";

export const cli = async () => {
  //Obtenemos los comandos
  let commands = yargsArguments._;

  //Guardar el directorio actual
  let currentPath = process.cwd();




  //Si los comandos no fueron insertados
  if (noArguments(commands)) {
    console.log(
      `%s
    - %s : Initialize a New Project in the Current Directory
    `,
      chalk.green.bold("Available Commands:"),
      chalk.green.bold("new (n)")
    );
    return;
  }

  try {
    //New Command
    if (commands[0] === "new" || commands[0] === "n") {
      let projectName = commands[1];

      //If project name isn't provided
      if (!commands[1]) {
        projectName = await inquirer.prompt([
          {
            type: "input",
            message: "What would be the name of your workspace and project?",
            name: "project",
          },
        ]);
        projectName = projectName.project;
      }

      let typeTemplate = await inquirer.prompt([
        {
          type: "list",
          message: "Which one do you want to work with?",
          name: "templateType",
          choices: [
            "Typescript",
            "Javascript",
          ]
        },
      ]); 

      const { templateType } = typeTemplate;

      let newCommand = new NewCommand(path.resolve(currentPath, projectName),projectName,templateType==='Typescript'?true:false);
      await newCommand.createProject();
      return;
    }

    // if (commands[0] === "add" || commands[0] === "a") {
    //   if (commands[1] === "model" || commands[1] === "m") {
    //     let modelInput = commands[2];
    //     if (!modelInput) {
    //       modelInput = await inquirer.prompt({
    //         type: "input",
    //         message: "What do you want to call your model?",
    //         name: "model",
    //       });
    //       modelInput = modelInput.model;
    //     }
    //     // "type": "commonjs"
    //     // "type": "module"

    //     // add_model_command(
    //     //   currentPath,
    //     //   modelInput,
    //     //   newCommand.projectType,
    //     //   newCommand.database === "Mongodb"
    //     // );
    //     return;
    //   }
    // }

    console.log(
      `%s`,
      chalk.red.bold(
        `The Command ("${commands[0]}") is Invalid. For a List of available options run nodepy -h`
      )
    );
  } catch (error) {
    errorHandle(error);
  }
};

const noArguments = (commands) => {
  return commands.length <= 0;
};
