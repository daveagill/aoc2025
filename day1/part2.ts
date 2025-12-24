export function puzzle() {
  const lines = Deno.readTextFileSync("day1/input.txt").trim().split("\n");

  const deltas = lines.map(rot => {
    const dir = rot.charAt(0);
    const amount = Number(rot.substring(1, rot.length));
    return dir === "R" ? amount : -amount;
  });

  let numZeroes = 0;
  let dial = 50;
  for (let i = 0; i < deltas.length; ++i) {
    const wholeCycles = Math.floor(Math.abs(deltas[i]) / 100);
    const remainder = deltas[i] - wholeCycles * 100 * Math.sign(deltas[i]);
    const dialOrig = dial;
    dial += remainder;
    numZeroes += wholeCycles;
    if (dial < 0) { dial = 100-(-dial % 100); if (dialOrig > 0) { numZeroes++; } }
    if (dial > 99) { dial %= 100; if (dial > 0) { numZeroes++; } }
    if (dial == 0 && dialOrig != 0) { ++numZeroes; }
  }

  return numZeroes;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", puzzle());
    console.timeEnd("Time taken");
}

