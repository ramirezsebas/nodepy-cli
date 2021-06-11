import inquirer from "inquirer";

import { yargsArguments } from "./config/yargs_config.js";

import { crearModelo, createProject } from "./index.js";

import { new_command } from "./commands/new.js";

import chalk from "chalk";

export const cli = async () => {
  let commands = yargsArguments._;

  let currentPath = process.cwd();

  //Si no se envia ningun comando
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

      new_command(currentPath, projectName);

      return;
    }

    console.log(
      `%s`,
      chalk.red.bold(
        `The Command ("${commands[0]}") is Invalid. For a List of available options run nodepy -h`
      )
    );
  } catch (error) {
    console.log(error);
  }
};

const noArguments = (commands) => {
  return commands.length <= 0;
};
