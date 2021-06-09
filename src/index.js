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

export const createProject = async (nombreProyecto, pathProject, type) => {
  // console.log(nombreProyecto);
  //Obtenemos la ruta del template
  let copyTemplatePath = path.resolve(
    new URL(import.meta.url).pathname,
    "../../templates/javascript",
    type
  );

  let finalPathProject = path.resolve(pathProject, nombreProyecto);
  console.log(finalPathProject);

  try {
    //Verificamos si existe la ruta
    await verifTemplate(copyTemplatePath);

    const tasks = new Listr([
      {
        title: "Copiar la Estructura del Proyecto.",
        task: () => copy_project_structure(finalPathProject, copyTemplatePath),
      },
      {
        title: "Instalar Todas las Dependencias.",
        task: () =>
          projectInstall({
            cwd: finalPathProject,
          }),
      },
    ]);

    await tasks.run();

    console.log("%s Project ready", chalk.green.bold("DONE"));
  } catch (error) {
    console.error(error);
  }
};

async function verifTemplate(copyTemplatePath) {
  try {
    await fileExists(copyTemplatePath, constants.R_OK);
  } catch (error) {
    console.error("%s NO existe el Template", chalk.red.bold("ERROR"));
    process.exit(1);
  }
}

const copy_project_structure = async (pathProject, templatePathProject) => {
  //Usamos para copiar
  return copy(templatePathProject, pathProject, {
    clobber: false,
  });
};
