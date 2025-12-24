export function puzzle() {
  const input = Deno.readTextFileSync("day3/input.txt");
  const lines = input.split("\n").slice(0, -1);

  let totalJolts = 0;
  for (const bank of lines) {
    const batts = bank.split("").map(Number);
    const maxFirstDigit = Math.max(...batts.slice(0, -1));
    const firstDigitPos = batts.indexOf(maxFirstDigit);
    const maxSecondDigit = Math.max(...batts.slice(firstDigitPos + 1));

    const jolts = maxFirstDigit * 10 + maxSecondDigit;
    totalJolts += jolts;
  }

  return totalJolts;
}

if (import.meta.main) {
  console.time("Time taken");
  console.log("Answer:", puzzle());
  console.timeEnd("Time taken");
}
