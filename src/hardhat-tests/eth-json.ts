import { getBigInt } from "ethers";

/**
 * The legacy way to serialize BigNumber values in ethers 5.x or lower
 */
type BigNumberHexContainer = {
  type: string;
  hex: string;
};

/**
 * Does the provided value look like a BigNumber container
 * I.e., JSON with a "BigNumber" type and hex field?); if so,
 * narrow the type on the value to a BigNumberHexContainer type.
 * @param value The value to inspect
 * @returns True if the value looks like a BigNumberHexContainer; false otherwise
 */
function isBigNumberHexContainer(value: unknown): value is BigNumberHexContainer {
  return (
    value instanceof Object &&
    "type" in value &&
    (value as { type: string }).type === "BigNumber" &&
    "hex" in value
  );
}

const bigIntLikePattern = /^-?\d+$/;
function isBigIntLike(value: unknown): value is string {
  return typeof value === "string" && bigIntLikePattern.test(value);
}

/**
 * A custom JSON reviver to allow automatically converting JSON objects including bigints into
 * actual bigint objects. This method handles both:
 * * legacy ethers format; an object with a "hex" property
 * * v6+ format for bigints which is just a string that looks like a bigint
 * @param _ The JSON key (currently unused hence the underscore name)
 * @param value The JSON value
 * @returns The value as-is if it doesn't look like a bigint; the value transformed into a bigint if it does
 *  look like a bigint
 */
export function ethJsonReviver(_: unknown, value: unknown) {
  if (isBigNumberHexContainer(value)) return getBigInt(value.hex);
  if (isBigIntLike(value)) return getBigInt(value);
  return value;
}

/**
 * A custom JSON replacer to allow automatically converting objects including bigints into
 * actual stringified JSON
 * @param _ The object key (currently unused hence the underscore name)
 * @param value The object value
 * @returns The value as-is if it isn't a bigint; the value stringified if it is a bigint
 */
export function ethJsonReplacer(_: string, value: unknown) {
  return typeof value === "bigint" ? `${value}` : value;
}

/**
 * Convert a JSON string to an Eth object. This isn't as
 * simple as JSON.parse because Eth uses bigints heavily. Bigints should be converted
 * from their object form so they can be mathed and numeric values
 * can be extracted
 * @param json The JSON string representing an Eth object
 */
export function parseEthJson<T>(json: string): T {
  return JSON.parse(json, ethJsonReviver) as T;
}

/**
 * Convert an Eth object into a string. This isn't as
 * simple as JSON.parse because bigints should be converted
 * into strings
 * @param obj An object to serialize
 */
export function stringifyEthJson<T>(obj: T): string {
  return JSON.stringify(obj, ethJsonReplacer);
}
