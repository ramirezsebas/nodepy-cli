import chalk from "chalk";
import { yargsArguments } from "./configs/yargs_config.js";
import { isValidCommand } from "./helpers/valid_command.js";
import { Project } from "./models/project.js";
import { newCommand } from "./commands/new/new_command.js";

export const cli = () => {
    //Get User Input
    let userInput = yargsArguments._;

    const command = userInput[0];
    if (command && !isValidCommand(command)) {
        console.log(
            `%s`,
            chalk.red.bold(
                `The Command ("${command}") is Invalid. For a List of available options run nodepy -h`
            )
        );
        return;
    }


    //Create a New Project
    const newProject = Project();

    //TODO:Verify if Project already exists


    //New Command - Create a new project
    if (command === "new" || command === "n") {
        const inputProjectName = userInput[1];
        newProject.setProjectName(inputProjectName);
        newCommand(newProject)
        return;
    }

    //TODO:Add Command
    if (command === "add" || command === "a") {

    }

    console.log(
        `%s`,
        chalk.yellow.bold(
            `Please Insert a Command. For a List of available options run nodepy -h`
        )
    );
}