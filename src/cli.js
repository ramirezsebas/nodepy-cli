import inquirer from "inquirer";

import { yargsArguments } from "./config/yargs_config.js";

import { createProject } from "./index.js";

const yargsCommand = async () => {
  //Obtenemos el comando
  let comando = yargsArguments._[0];
  let currentPath = process.cwd();

  switch (comando) {
    case "new":
      if (yargsArguments._[1]) {
        let nombreProyecto = yargsArguments._[1];
        try {
          //El usuario selecciona el type del proyecto
          let respuestaType = await inquirer.prompt([
            {
              type: "list",
              name: "type",
              message: "Que Tipo de Proyecto Usaras?",
              choices: ["COMMONJS", "ESM"],
              default: "COMMONJS",
            },
          ]);
          //Creamos la estructura del proyecto
          await createProject(
            nombreProyecto,
            currentPath,
            respuestaType.type.toLowerCase()
          );
        } catch (error) {
          console.log(error);
        }
      }

      break;
    case "add":
      //Todo Implementar para agregar rutas, servicios y modelos
      break;

    default:
  }
};

export const cli = async () => {
  yargsCommand();
};
