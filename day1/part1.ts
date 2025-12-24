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
    dial += deltas[i];
    if (dial < 0) { dial = 100-(-dial % 100); }
    if (dial > 99) { dial %= 100; }
    if (dial == 0) { ++numZeroes; }
  }

  return numZeroes;
}

if (import.meta.main) {
    console.time("Time taken");
    console.log("Answer:", puzzle());
    console.timeEnd("Time taken");
}
