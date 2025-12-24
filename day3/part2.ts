export function puzzle() {
  const input = Deno.readTextFileSync("day3/input.txt");
  const lines = input.split("\n").slice(0, -1);

  let totalJolts = 0;
  for (const bank of lines) {
    const batts = bank.split("").map(Number);

    let jolts = 0;
    let start = 0;
    for (let index = 12 - 1; index >= 0; --index) {
      const searchRange = batts.slice(start, batts.length - index);
      const maxDigit = Math.max(...searchRange);
      const maxDigitPos = searchRange.indexOf(maxDigit);

      start += maxDigitPos + 1;
      jolts = jolts + Math.pow(10, index) * maxDigit;
    }

    totalJolts += jolts;
  }

  return totalJolts;
}

if (import.meta.main) {
  console.time("Time taken");
  console.log("Answer:", puzzle());
  console.timeEnd("Time taken");
}
