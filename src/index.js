import chalk from "chalk";
import ncp from "ncp";
import path from "path";
import { access, constants } from "fs";
import { promisify } from "util";
import execa from "execa";
import Listr from "listr";
import { projectInstall } from "pkg-install";

const fileExists = promisify(access);
const copy = promisify(ncp);

const copy_project = async (options) => {
  //Usamos para copiar
  console.log(options);
  return copy(options.templatePath, options.projectPath, {
    clobber: false,
  });
};

//init -> Inicializamos un Proyecto.
export const initProject = async (options) => {
  let defaultType = "commonjs";
  //Si se pudo pasar el argumento init creamos un nuevo Proyecto.
  if (options.init) {
    //Definimos las nuevas opciones, agregando el origen del archivo
    const new_options = {
      ...options,
      projectPath: options.projectPath || process.cwd(),
      defaultType: options.defaultType || defaultType,
    };
    console.log(new_options);

    //Obtenemos la ruta actual
    const currentFileUrl = import.meta.url;

    let structurePath = "";

    switch (new_options.defaultType.toLowerCase()) {
      case "esm":
        structurePath = "../../templates/javascript/es6";
        break;
      case "commonjs":
        structurePath = "../../templates/javascript/commonjs";
        break;

      default:
        break;
    }

    const templatePath = path.resolve(
      new URL(currentFileUrl).pathname,
      structurePath
    );

    new_options["templatePath"] = templatePath;

    try {
      await fileExists(templatePath, constants.R_OK);
    } catch (error) {
      console.error("%s NO existe el Template", chalk.red.bold("ERROR"));
      process.exit(1);
    }

    const tasks = new Listr([
      {
        title: "Copiar la Estructura del Proyecto.",
        task: () => copy_project(new_options),
      },
      {
        title: "Instalar Todas las Dependencias.",
        task: () =>
          projectInstall({
            cwd: new_options.projectPath,
          }),
      },
    ]);

    await tasks.run();

    console.log("%s Project ready", chalk.green.bold("DONE"));
    return true;
  }
};
