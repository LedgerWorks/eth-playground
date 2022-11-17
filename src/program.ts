/* eslint-disable arrow-body-style */
import { program } from "commander";
import commands from "./commands";

program
  .name("avalanche-playground")
  .description("CLI wrapper around with avalanche")
  .version("0.0.1");

commands.forEach((command) => command.register());

program.parseAsync().then(() => {});
