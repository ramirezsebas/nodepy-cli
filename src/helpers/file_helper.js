import { access } from "fs";
import { promisify } from "util";
import ncp from "ncp";

export const fileExists = promisify(access);
export const copy = promisify(ncp);
