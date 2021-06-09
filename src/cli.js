import arg from "arg";
import inquirer from "inquirer";
import { initProject } from "./index.js";

//Procesamos los Argumentos
//Aca recibimos todos los argumentos que el desarollador pasa por el terminal
const processArguments = (argsInput) => {
  const args = arg(
    {},
    {
      argv: argsInput.slice(2),
    }
  );

  return {
    init: args._[0],
  };
};

//Manejamos parametro que no se paso.
const missingArguments = async (options) => {
  const preguntas = [];

  //Si se paso el init Para la inicializacion

  preguntas.push({
    type: "list",
    name: "init",
    choices: ["ESM", "COMMONJS"],
    default: "COMMONJS",
    message: "Con cual deseas iniciar un proyecto?",
  });

  // if (!options.git) {
  //   preguntas.push({
  //     type: "confirm",
  //     name: "git",
  //     message: "Deseas Inicializar un Repositorio de Git?",
  //     default: false,
  //   });
  // }

  const respuesta = await inquirer.prompt(preguntas);

  return {
    ...options,
    init: options.init || respuesta.init,
  };
};

export const cli = async (args) => {
  let op = processArguments(args);
  op = await missingArguments(op);
  console.log(op);
  await initProject(op);
  // console.log(op);
};
