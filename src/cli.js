import arg from "arg";
import inquirer from "inquirer";

//Procesamos los Argumentos
const processArguments = (argsInput) => {
  //Argumentos
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
  if (!options.init) {
    preguntas.push({
      type: "confirm",
      name: "init",
      message: "Deseas Inicializar un Nuevo Proyecto?",
    });
  }

  // if (!options.git) {
  //   preguntas.push({
  //     type: "confirm",
  //     name: "git",
  //     message: "Deseas Inicializar un Repositorio de Git?",
  //     default: false,
  //   });
  // }

  const respuesta = await inquirer.prompt(preguntas);

  const esInit =
    options.init && options.init.toLowerCase() === "init" ? true : false;

  return {
    ...options,
    init: esInit ? true : false || respuesta.init,
  };
};

export const cli = async (args) => {
  let op = processArguments(args);
  op = await missingArguments(op);

  console.log(op);
};
