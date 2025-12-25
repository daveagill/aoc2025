export function puzzle() {
  const input = Deno.readTextFileSync("day5/input.txt").trim();
  const [freshRangesStr, ingredientsStr] = input.split("\n\n");
  const freshRanges = freshRangesStr.split("\n").map((r) => r.split("-")).map(
    (p) => ({ s: Number(p[0]), e: Number(p[1]) }),
  );
  const ingredients = ingredientsStr.split("\n").map(Number);

  let numFreshIngredients = 0;
  for (const ingredient of ingredients) {
    let isFresh = false;
    for (const range of freshRanges) {
      isFresh = range.s <= ingredient && ingredient <= range.e;
      if (isFresh) break;
    }

    if (isFresh) {
      ++numFreshIngredients;
    }
  }

  return numFreshIngredients;
}

if (import.meta.main) {
  console.time("Time taken");
  console.log("Answer:", puzzle());
  console.timeEnd("Time taken");
}
