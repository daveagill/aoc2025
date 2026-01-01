export function puzzle() {
  const input = Deno.readTextFileSync("day12/input.txt");

  const parts = input.trim().split("\n\n");
  const regions = parts[parts.length - 1].split("\n");
  const shapes = parts.slice(0, -1).map((s) => s.substring(3));

  const shapeAreas = shapes.map((s) =>
    s.split("").filter((c) => c === "#").length
  );

  let numPossible = 0;
  let numImpossible = 0;
  let numPotential = 0;
  for (const region of regions) {
    const [areaStr, shapeQuantitiesStr] = region.split(": ");
    const [w, h] = areaStr.split("x").map(Number);
    const shapeQuantities = shapeQuantitiesStr.split(" ").map(Number);

    // all shapes are max 3x3, if we can fit enough 3x3 grids then the case is trivially possible to solve
    const upperEstimateOfAreaRequired = 3 * 3 *
      shapeQuantities.reduce((sum, q) => sum + q);

    // if with perfect packing we still don't have enough space then the case is trivially impossible to solve
    let lowerEstimateOfAreaRequired = 0;
    for (let i = 0; i < shapeQuantities.length; ++i) {
      lowerEstimateOfAreaRequired += shapeQuantities[i] * shapeAreas[i];
    }

    if (upperEstimateOfAreaRequired <= w * h) {
      ++numPossible;
    } else if (lowerEstimateOfAreaRequired > w * h) {
      ++numImpossible;
    } else { // anything not classified by the above checks is "maybe" solveable
      ++numPotential;
    }
  }

  if (numPotential > 0) {
    console.error("Did not exhaust the list");
    return -1;
  }

  return numPossible;
}

if (import.meta.main) {
  console.time("Time taken");
  console.log("Answer:", puzzle());
  console.timeEnd("Time taken");
}
