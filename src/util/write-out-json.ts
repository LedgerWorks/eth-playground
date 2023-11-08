import { join } from "path";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import getEthersVersion from "./get-ethers-version";

export default (actionName: string, body: object, fileName?: string, consoleLog = false): void => {
  const outDir = join(__dirname, "..", "out");
  const actionOutDir = join(outDir, actionName);
  const outFile = join(actionOutDir, fileName || `${new Date().toISOString()}.json`);
  const json = JSON.stringify({ ...body, "ethers-version": getEthersVersion() }, null, 2);

  if (!existsSync(outDir)) {
    mkdirSync(outDir);
  }
  if (!existsSync(actionOutDir)) {
    mkdirSync(actionOutDir);
  }

  writeFileSync(outFile, json);
  if (consoleLog) {
    console.log(`${actionName} completed:`);
    console.log(json);
  }
};
