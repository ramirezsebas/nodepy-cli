import chalk from "chalk";
import ncp from "ncp";
import path from "path";
import { access, constants } from "fs";
import { promisify } from "util";
import Listr from "listr";
import { projectInstall } from "pkg-install";

const fileExists = promisify(access);
const copy = promisify(ncp);

export const createProject = async (nombreProyecto, pathProject, type) => {
  //Obtenemos la ruta del template
  const currentUrl = new URL(import.meta.url).pathname;

  let copyTemplatePath = path.join(
    process.platform === "win32" ? currentUrl.substring(1) : currentUrl,
    "../../templates/javascript",
    type
  );

  let finalPathProject = path.resolve(pathProject, nombreProyecto);

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

    console.log(
      `%s Se ha creado el Proyecto ${nombreProyecto}`,
      chalk.green.bold("DONE")
    );
  } catch (error) {
    console.error(error);
  }
};

async function verifTemplate(copyTemplatePath) {
  try {
    console.log(copyTemplatePath);
    await fileExists(copyTemplatePath, constants.R_OK);
  } catch (error) {
    console.error(
      `%s NO existe el Template ${copyTemplatePath}`,
      chalk.red.bold("ERROR")
    );
    process.exit(1);
  }
}

const copy_project_structure = async (pathProject, templatePathProject) => {
  //Usamos para copiar
  return copy(templatePathProject, pathProject, {
    clobber: false,
  });
};
