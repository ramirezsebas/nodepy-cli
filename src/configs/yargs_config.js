import yargs from "yargs";

const yargsArguments = yargs
  .usage("Usage: $0 <command> [options]")
  .command("new", "Initialize a New Project")
  .example("$0 new project1", "Create a New Project")
  .help("h")
  .alias("h", "help").argv;

export {
  yargsArguments
}