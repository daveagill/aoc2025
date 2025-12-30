type Vec2 = { x: number; y: number };

// ----------------------
// This is my v2 solution that takes into account adjacent edges and internal cavities
//
// Discussion:
// https://www.reddit.com/r/adventofcode/comments/1pvjito/2025_day_9_part_2_why_did_almost_nobody_solve_the/
// Test datasets (this implementation passess all of them):
// https://jjeii.github.io/AdventOfCode/2025.html#day9p2
// ----------------------

// checks if the edge of the square is continuous
// which is to say no point along its length is outside the shape
// this assumes the points p1 and p2 are known to be inside
function isEdgeContinuous(p1: Vec2, p2: Vec2, points: Vec2[]) {
  const intersectionPoints: number[] = [];
  if (p1.x === p2.x) { // vertical edge
    const x = p1.x;
    const yMin = Math.min(p1.y, p2.y);
    const yMax = Math.max(p1.y, p2.y);

    intersectionPoints.push(p1.y, p2.y);
    let pLast = points[points.length - 1];
    for (const pNext of points) {
      if (pLast.y === pNext.y) { // horizontal segment
        const y = pNext.y;
        const xMin = Math.min(pLast.x, pNext.x);
        const xMax = Math.max(pLast.x, pNext.x);

        if (xMin <= x && xMax >= x && yMin < y && yMax > y) {
          intersectionPoints.push(y);
        }
      }
      pLast = pNext;
    }

    intersectionPoints.sort((a, b) => a - b);
    let prevIntersect = intersectionPoints[0];
    for (let i = 1; i < intersectionPoints.length; ++i) {
      const nextIntersect = intersectionPoints[i];
      if (nextIntersect - prevIntersect > 1) {
        if (
          !isInside(
            { x, y: Math.floor((nextIntersect + prevIntersect) / 2) },
            points,
          )
        ) {
          return false;
        }
      }
      prevIntersect = nextIntersect;
    }
  } else { // p1.y === p2.y // horizontal edge
    const y = p1.y;
    const xMin = Math.min(p1.x, p2.x);
    const xMax = Math.max(p1.x, p2.x);

    intersectionPoints.push(p1.x, p2.x);
    let pLast = points[points.length - 1];
    for (const pNext of points) {
      if (pLast.x === pNext.x) { // vertical segment
        const x = pNext.x;
        const yMin = Math.min(pLast.y, pNext.y);
        const yMax = Math.max(pLast.y, pNext.y);

        if (xMin < x && xMax > x && yMin <= y && yMax >= y) {
          intersectionPoints.push(x);
        }
      }
      pLast = pNext;
    }

    intersectionPoints.sort((a, b) => a - b);
    let prevIntersect = intersectionPoints[0];
    for (let i = 1; i < intersectionPoints.length; ++i) {
      const nextIntersect = intersectionPoints[i];
      if (nextIntersect - prevIntersect > 1) {
        if (
          !isInside(
            { x: Math.floor((nextIntersect + prevIntersect) / 2), y },
            points,
          )
        ) {
          return false;
        }
      }
      prevIntersect = nextIntersect;
    }
  }

  return true;
}

// find elbow points where the cell 'nestled' into the bend is outside the shape
function findCavityElbowPoints(points: Vec2[]) {
  const results: Vec2[] = [];
  let p1 = points[0];
  let p2 = points[1];
  for (let i = 2; i < points.length; ++i) {
    const p3 = points[i];

    // find elbow joints
    if (
      !((p1.x === p2.x && p2.x === p3.x) || (p1.y === p2.y && p2.y === p3.y))
    ) {
      // find the point 'nestled' by the elbow joints
      const x = p2.x + Math.sign(p3.x - p2.x) + Math.sign(p1.x - p2.x);
      const y = p2.y + Math.sign(p3.y - p2.y) + Math.sign(p1.y - p2.y);
      const concavePoint = { x, y };

      // confirm if the point is a cavity
      if (!isInside(concavePoint, points)) {
        results.push(concavePoint);
      }
    }

    p1 = p2;
    p2 = p3;
  }
  return results;
}

// checks if a box defined by p1,p2 contains any point in the list
function boxContainsPoint(p1: Vec2, p2: Vec2, points: Vec2[]) {
  const minX = Math.min(p1.x, p2.x);
  const maxX = Math.max(p1.x, p2.x);
  const minY = Math.min(p1.y, p2.y);
  const maxY = Math.max(p1.y, p2.y);

  for (const p of points) {
    if (minX < p.x && maxX > p.x && minY < p.y && maxY > p.y) {
      return true;
    }
  }
  return false;
}

// checks if a point is inside the shape defined by points
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

  const cavityPoints = findCavityElbowPoints(points);

  let maxArea = 0;
  for (let i = 0; i < points.length; ++i) {
    for (let j = i + 1; j < points.length; ++j) {
      const p1 = points[i];
      const p2 = points[j];
      const p3 = { x: p1.x, y: p2.y };
      const p4 = { x: p2.x, y: p1.y };

      if (
        isInside(p3, points) && isInside(p4, points) &&
        !boxContainsPoint(p1, p2, cavityPoints) &&
        isEdgeContinuous(p1, p4, points) && isEdgeContinuous(p4, p2, points) &&
        isEdgeContinuous(p2, p3, points) && isEdgeContinuous(p3, p1, points)
      ) {
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
