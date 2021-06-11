import chalk from "chalk";

export const errorHandle = (message, error) => {
  console.log(error);
  console.log("%s", chalk.red.bold(message));
  process.exit(1);
};
