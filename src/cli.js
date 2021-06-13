import inquirer from "inquirer";
import chalk from "chalk";
import { yargsArguments } from "./config/yargs_config.js";
import path from "path";

import { errorHandle } from "./helpers/error_handle.js";
import NewCommand from "./commands/new_command.js";

export const cli = async () => {
  let commands = yargsArguments._;

  let currentPath = process.cwd();

  let newCommand = new NewCommand();

  //If no commands were used
  if (noArguments(commands)) {
    console.log(
      `%s
    - %s : Initialize a New Project in the Current Directory
    - %s : Add a new Schema
        - %s Creates a New Model in the models directory
    `,
      chalk.green.bold("Available Commands:"),
      chalk.green.bold("new (n)"),
      chalk.green.bold("add (a)"),
      chalk.green.bold("model (m)")
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

      newCommand.projectName = projectName;
      newCommand.projectPath = path.resolve(currentPath, projectName);
      await newCommand.createProject();
      return;
    }

    if (commands[0] === "add" || commands[0] === "a") {
      if (commands[1] === "model" || commands[1] === "m") {
        let modelInput = commands[2];
        if (!modelInput) {
          modelInput = await inquirer.prompt({
            type: "input",
            message: "What do you want to call your model?",
            name: "model",
          });
          modelInput = modelInput.model;
        }
        // "type": "commonjs"
        // "type": "module"

        // add_model_command(
        //   currentPath,
        //   modelInput,
        //   newCommand.projectType,
        //   newCommand.database === "Mongodb"
        // );
        return;
      }
    }

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
