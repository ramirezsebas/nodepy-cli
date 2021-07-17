import chalk from "chalk";
import { yargsArguments } from "./configs/yargs_config.js";
import { isValidCommand } from "./helpers/valid_command.js";
import { Project } from "./models/project.js";
import { newCommand } from "./commands/new/new_command.js";

export const cli = () => {
    //Obtener la entrada del usuario
    let userInput = yargsArguments._;

    const command = userInput[0];
    if (!isValidCommand(command)) {
        console.log(
            `%s`,
            chalk.red.bold(
                `The Command ("${command}") is Invalid. For a List of available options run nodepy -h`
            )
        );
    }


    //Crear un Nuevo Proyecto
    const newProject = Project();

    //Verify if Project already exists


    //New Command
    if (command === "new" || command === "n") {
        const inputProjectName = userInput[1];
        newProject.setProjectName(inputProjectName);
        newCommand(newProject)
        return;
    }

    //Add Command
    if (command === "add" || command === "a") {

    }

    console.log(
        `%s`,
        chalk.red.bold(
            `The Command ("${command}") is Invalid. For a List of available options run nodepy -h`
        )
    );
}