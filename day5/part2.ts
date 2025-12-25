type Range = { s: number; e: number };

function overlaps(r1: Range, r2: Range) {
  if (r2.s > r1.e) return false;
  if (r2.e < r1.s) return false;
  return true;
}

function weld(r1: Range, r2: Range) {
  return { s: Math.min(r1.s, r2.s), e: Math.max(r1.e, r2.e) };
}

function insertRange(ranges: Range[], toInsert: Range) {
  for (const r of ranges) {
    if (overlaps(r, toInsert)) {
      const welded = weld(r, toInsert);
      r.s = welded.s;
      r.e = welded.e;
      return;
    }
  }
  ranges.push(toInsert);
}

function weldRanges(ranges: Range[]) {
  const welded = [] as Range[];

  for (const r of ranges) {
    insertRange(welded, r);
  }

  // keep re-welding ranges until we make no further progress
  if (welded.length < ranges.length) {
    return weldRanges(welded);
  }
  return welded;
}

export function puzzle() {
  const input = Deno.readTextFileSync("day5/input.txt").trim();
  const [freshRangesStr] = input.split("\n\n");
  const freshRanges = freshRangesStr.split("\n").map((r) => r.split("-")).map(
    (p) => ({ s: Number(p[0]), e: Number(p[1]) }),
  );

  const weldedRanges = weldRanges(freshRanges);
  console.log(weldedRanges);

  return weldedRanges.reduce((sum, r) => sum + (r.e - r.s) + 1, 0);
}

if (import.meta.main) {
  console.time("Time taken");
  console.log("Answer:", puzzle());
  console.timeEnd("Time taken");
}
