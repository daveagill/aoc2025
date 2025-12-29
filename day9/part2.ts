type Vec2 = { x: number; y: number };

// this looks for any edges that intersect our box
// we are basically assuming that crossing a boundry means exiting the shape
// which is technically not necessarily true if edges are adjacent on the grid
function intersects(p1: Vec2, p2: Vec2, points: Vec2[]) {
  const xMin = Math.min(p1.x, p2.x);
  const xMax = Math.max(p1.x, p2.x);
  const yMin = Math.min(p1.y, p2.y);
  const yMax = Math.max(p1.y, p2.y);
  let pLast = points[points.length - 1];
  for (const pNext of points) {
    const pXMin = Math.min(pNext.x, pLast.x);
    const pXMax = Math.max(pNext.x, pLast.x);
    const pYMin = Math.min(pNext.y, pLast.y);
    const pYMax = Math.max(pNext.y, pLast.y);
    pLast = pNext;
    if (pXMax <= xMin || pXMin >= xMax) continue;
    if (pYMax <= yMin || pYMin >= yMax) continue;
    return true;
  }
  return false;
}

function isInside(p: Vec2, points: Vec2[]) {
  let intersectionCount = 0;
  let pLast = points[points.length - 1];
  for (const pNext of points) {
    if (pNext.x == pLast.x) { // is vertical
      const yMin = Math.min(pNext.y, pLast.y);
      const yMax = Math.max(pNext.y, pLast.y);
      // check if the point is actually on the horizontal (optimisation)
      if (p.x === pNext.x && yMin <= p.y && yMax >= p.y) {
        return true;
      }
      // note half open range below means we cannot detect intersections with yMax
      // the range is half-open to avoid double-counting since every yMax is another vertical span's yMin
      // We'll correct for that later when we check horizontals.
      if (pNext.x <= p.x && yMin <= p.y && yMax > p.y) {
        ++intersectionCount;
      }
    }
    if (pNext.y === pLast.y) { // is horizontal
      const xMin = Math.min(pNext.x, pLast.x);
      const xMax = Math.max(pNext.x, pLast.x);
      // here we check if the point is actually on a horizontal segment
      if (p.y === pNext.y && xMin <= p.x && xMax >= p.x) {
        return true;
      }
    }
    pLast = pNext;
  }
  return intersectionCount % 2 > 0;
}

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
      const center = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      if (!intersects(p1, p2, points) && isInside(center, points)) {
        const width = Math.abs(p1.x - p2.x) + 1;
        const height = Math.abs(p1.y - p2.y) + 1;
        const area = width * height;
        maxArea = Math.max(maxArea, area);
      }
    }
  }

  return maxArea;
}

if (import.meta.main) {
  console.time("Time taken");
  console.log("Answer:", puzzle());
  console.timeEnd("Time taken");
}
