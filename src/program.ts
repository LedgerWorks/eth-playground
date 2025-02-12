/* eslint-disable arrow-body-style */
import { program } from "commander";
import commands from "./commands";

program
  .name("eth-playground")
  .description("CLI wrapper around ethereum virtual machine (EVM) chains")
  .version("0.0.1");

commands.forEach((command) => command.register());

program.parseAsync().then(() => {});
