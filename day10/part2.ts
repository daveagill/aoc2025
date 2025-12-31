// This is my implementation of the idea described here:
// https://www.reddit.com/r/adventofcode/comments/1pk87hl/2025_day_10_part_2_bifurcate_your_way_to_victory/
//
// Like most people I found this one hard.
//
// I recognised it could be represented as a system of linear equations but that
// would mean writing a general linear equation solver like gaussian-jordan elimination
// which felt like too much work and using a library is 'cheating'
//
// I attempted to solve with bfs and dfs with aggressive pruning but all attempts were
// too slow.
//
// It's not really clear how Eric intended people to solve it.  Whether he thought
// everyone would just reach for the Z3 solver or would they discover the recursive solution.

function toggleLights(lightState: string, buttons: number[]) {
  const lights = lightState.split("");
  for (const idx of buttons) {
    lights[idx] = lights[idx] === "." ? "#" : ".";
  }
  return lights.join("");
}

function toJoltageValues(joltages: string) {
  return joltages.split(",").map(Number);
}

function calculateParity(joltageValues: number[]) {
  return joltageValues.map((n) => n % 2 === 0 ? "." : "#").join("");
}

function findButtonCombosForParity(parity: string, buttons: number[][]) {
  const emptyState = parity.split("").fill(".").join("");
  const numCombos = 1 << buttons.length; // 2 ^ length

  const results: number[][][] = [];

  for (let i = 0; i < numCombos; ++i) {
    let state = emptyState;
    for (let btnIdx = 0; btnIdx < buttons.length; ++btnIdx) {
      const mask = 1 << btnIdx;
      if ((i & mask) > 0) {
        state = toggleLights(state, buttons[btnIdx]);
      }
    }

    if (state === parity) { // it's a combo that arrives at the desired parity state
      const combo: number[][] = [];
      for (let btnIdx = 0; btnIdx < buttons.length; ++btnIdx) {
        const mask = 1 << btnIdx;
        if ((i & mask) > 0) {
          combo.push(buttons[btnIdx]);
        }
      }
      results.push(combo);
    }
  }

  return results;
}

function calculateRemainingJoltage(
  joltageValues: number[],
  buttonCombo: number[][],
) {
  const remainingJoltages = [...joltageValues];
  for (const button of buttonCombo) {
    for (const idx of button) {
      remainingJoltages[idx] = remainingJoltages[idx] - 1;
    }
  }
  return remainingJoltages;
}

function findOptimalPresses(targetJoltages: string, buttons: number[][]) {
  const cache = new Map<string, number>();

  const recurse = (joltages: string): number => {
    if (cache.has(joltages)) {
      return cache.get(joltages)!;
    }

    const joltageValues = toJoltageValues(joltages);

    if (joltageValues.some((j) => j < 0)) return Number.POSITIVE_INFINITY;
    if (joltageValues.every((j) => j === 0)) return 0;

    const parity = calculateParity(joltageValues);
    const buttonCombos = findButtonCombosForParity(parity, buttons);

    let minPresses = Number.POSITIVE_INFINITY;
    for (const combo of buttonCombos) {
      // because we've "subtracted the parity" the remaining joltage will have a parity of 0 (i.e. all even numbers)
      // being even means we can halve them and whatever the required press count we just remember to double it.
      const remainingJoltages = calculateRemainingJoltage(joltageValues, combo);
      const halfJoltages = remainingJoltages.map((j) => j / 2).join(",");
      const pressesRequiredForHalfJoltages = recurse(halfJoltages);
      // double the presses required to reach half joltage + the buttons we pressed in the combo
      const pressesRequired = 2 * pressesRequiredForHalfJoltages + combo.length;
      minPresses = Math.min(minPresses, pressesRequired);
    }

    cache.set(joltages, minPresses);
    return minPresses;
  };

  return recurse(targetJoltages);
}

export function puzzle() {
  const input = Deno.readTextFileSync("day10/input.txt");
  const lines = input.trim().split("\n");

  let totalPresses = 0;
  for (const line of lines) {
    const parts = line.split(" ");
    const joltagesPart = parts[parts.length - 1];
    const joltages = joltagesPart.substring(1, joltagesPart.length - 1);
    const buttons = parts.slice(1, -1).map((b) =>
      b.substring(1, b.length - 1).split(",").map(Number)
    );

    const minPresses = findOptimalPresses(joltages, buttons);
    totalPresses += minPresses;
  }

  return totalPresses;
}

if (import.meta.main) {
  console.time("Time taken");
  console.log("Answer:", puzzle());
  console.timeEnd("Time taken");
}
