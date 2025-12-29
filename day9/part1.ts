type Vec2 = { x: number; y: number };

export function puzzle() {
  const input = Deno.readTextFileSync("day9/input.txt");
  const lines = input.trim().split("\n");
  const pairs = lines.map((line) => line.split(",").map(Number));
  const points = pairs.map(([x, y]) => ({ x, y }) as Vec2);

  let maxArea = 0;
  for (let i = 0; i < points.length; ++i) {
    for (let j = i + 1; j < points.length; ++j) {
      const p1 = points[i];
      const p2 = points[j];
      const width = Math.abs(p1.x - p2.x) + 1;
      const height = Math.abs(p1.y - p2.y) + 1;
      const area = width * height;
      maxArea = Math.max(maxArea, area);
    }
  }

  return maxArea;
}

if (import.meta.main) {
  console.time("Time taken");
  console.log("Answer:", puzzle());
  console.timeEnd("Time taken");
}
