import chalk from "chalk";

export const errorHandle = (message) => {
  console.log("%s", chalk.red.bold(message));
  process.exit(1);
};
