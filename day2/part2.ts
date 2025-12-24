function hasRepetition(n: number) {
  const s = String(n);

  for (let i = 2; i <= s.length; ++i) {
    if (s.length % i === 0) {
      const fragment = s.substring(0, s.length / i);
      const repeated = fragment.repeat(i);

      if (s === repeated) {
        return true;
      }
    }
  }

  return false;
}

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

    for (let i = start; i <= end; ++i) {
      if (hasRepetition(i)) {
        sumOfInvalids += i;
      }
    }
  }

  return sumOfInvalids;
}

if (import.meta.main) {
  console.time("Time taken");
  console.log("Answer:", puzzle());
  console.timeEnd("Time taken");
}
