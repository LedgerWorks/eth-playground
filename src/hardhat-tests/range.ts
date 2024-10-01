/**
 * A helper to create an array of all numbers from start to end
 * E.g. Start=2, End=5 would result in [2,3,4,5]
 * @param start The first number in the range
 * @param stop The last number in the range
 * @param step How much to increment b
 */
export function range(start: bigint, stop: bigint, step: bigint) {
  const defaultedStep = typeof step === "undefined" ? BigInt(1) : step;
  if ((defaultedStep > 0 && start >= stop) || (defaultedStep < 0 && start <= stop)) {
    return [];
  }

  const result = [];
  for (let i = start; defaultedStep > 0 ? i < stop : i > stop; i += defaultedStep) {
    result.push(i);
  }

  return result;
}
