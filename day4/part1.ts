export function puzzle() {
  const input = Deno.readTextFileSync("day4/input.txt").split("\n");
  const cells = input.join("").split("") as ("." | "@")[];
  const width = input[0].length;
  const height = cells.length / width;

  const getXY = (x: number, y: number) => {
    if (x < 0 || x >= width) return ".";
    if (y < 0 || y >= height) return ".";
    return cells[y * width + x];
  };

  const countAround = (x: number, y: number) => {
    let count = 0;
    for (let dy = -1; dy <= 1; ++dy) {
      for (let dx = -1; dx <= 1; ++dx) {
        if (dx == 0 && dy == 0) continue;
        if (getXY(x + dx, y + dy) === "@") {
          ++count;
        }
      }
    }
    return count;
  };

  let availablePapers = 0;
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const v = getXY(x, y);
      if (v === "@" && countAround(x, y) < 4) {
        ++availablePapers;
      }
    }
  }

  return availablePapers;
}

if (import.meta.main) {
  console.time("Time taken");
  console.log("Answer:", puzzle());
  console.timeEnd("Time taken");
}
