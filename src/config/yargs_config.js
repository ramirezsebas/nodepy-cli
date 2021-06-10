import yargs from "yargs";

export const yargsArguments = yargs
  .usage("Usage: $0 <command> [options]")
  .command("new", "Inicializa un nuevo proyecto")
  .example("$0 new project1", "Se ha creado un nuevo proyecto")
  .demandCommand(1)
  .help("h")
  .alias("h", "help").argv;
