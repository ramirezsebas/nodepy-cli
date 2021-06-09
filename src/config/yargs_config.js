import yargs from "yargs";

export const yargsArguments = yargs
  .usage("Usage: $0 <command> [options]")
  .command("init", "Inicializa un nuevo proyecto")
  .example("$0 init -p src/", "Se ha creado un nuevo proyecto")
  .alias("p", "Ubicacion del Nuevo Proyecto")
  .describe("p", "Cargar una Ruta")
  .help("h")
  .alias("h", "help").argv;
