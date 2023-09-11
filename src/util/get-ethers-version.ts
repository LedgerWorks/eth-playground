/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageLock = require("../../package-lock.json");

export default (): string => {
  try {
    if (packageLock.dependencies?.ethers?.version) {
      return packageLock.dependencies.ethers.version;
    }
    if (packageLock.packages) {
      const ourPackages = Object.values(packageLock.packages).find(
        (p: any) => p.name === "eth-playground"
      ) as any;
      if (ourPackages?.dependencies?.ethers) {
        return ourPackages.dependencies.ethers;
      }
    }
  } catch (e) {
    console.warn(e);
  }
  console.warn("Unable to get ethers version");
  return "unknown";
};
