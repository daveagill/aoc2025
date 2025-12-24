export function puzzle() {
  const lines = Deno.readTextFileSync("day2/input.txt");
  const rangeStrs = lines.split(",").map((s) => s.trim());
  const ranges = rangeStrs.map((s) => {
    const pair = s.split("-");
    return { s: pair[0], e: pair[1] };
  });

  let sumOfInvalids = 0;
  for (const r of ranges) {
    const start = Number(r.s);
    const end = Number(r.e);
    let half = Number(r.s.substring(0, r.s.length / 2));

    let id = 0;
    while (id <= end) {
      id = Number(`${half}${half}`);
      if (id >= start && id <= end) {
        sumOfInvalids += id;
      }
      ++half;
    }
  }

  return sumOfInvalids;
}

if (import.meta.main) {
  console.time("Time taken");
  console.log("Answer:", puzzle());
  console.timeEnd("Time taken");
}
