type Vec3 = { x: number; y: number; z: number };

function distanceSquared(p1: Vec3, p2: Vec3) {
  return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y) +
    (p1.z - p2.z) * (p1.z - p2.z);
}

type DistancePair = {
  p1: number;
  p2: number;
  dist: number;
};

export function puzzle() {
  const input = Deno.readTextFileSync("day8/input.txt");
  const lines = input.trim().split("\n");
  const points = lines.map((line) => {
    const values = line.split(",").map(Number);
    return { x: values[0], y: values[1], z: values[2] } as Vec3;
  });

  // determine pair distances
  const pairs = [] as DistancePair[];
  for (let i = 0; i < points.length; ++i) {
    for (let j = i + 1; j < points.length; ++j) {
      const p1 = points[i];
      const p2 = points[j];
      const dist = distanceSquared(p1, p2);
      pairs.push({ p1: i, p2: j, dist });
    }
  }

  // determine N-closest pairs
  const limit = 1000;
  pairs.sort((a, b) => a.dist - b.dist);
  const closestPairs = pairs.slice(0, limit);

  // build point graph
  const graph = new Map<number, number[]>();
  for (const pair of closestPairs) {
    if (!graph.has(pair.p1)) {
      graph.set(pair.p1, []);
    }
    if (!graph.has(pair.p2)) {
      graph.set(pair.p2, []);
    }
    graph.get(pair.p1)!.push(pair.p2);
    graph.get(pair.p2)!.push(pair.p1);
  }

  // walk graph to find disconnected sub-graphs (circuits)
  const seen = new Set<number>();
  const circuits = [] as number[][];
  for (const point of graph.keys()) {
    if (seen.has(point)) continue;

    const circuit = [];

    const openList = [point];
    while (openList.length > 0) {
      const next = openList.pop()!;
      if (seen.has(next)) continue;
      seen.add(next);
      circuit.push(next);
      openList.push(...graph.get(next)!);
    }

    circuits.push(circuit);
  }

  // find 3 longest circuits
  circuits.sort((a, b) => b.length - a.length);
  const longestCircuits = circuits.slice(0, 3);

  return longestCircuits.map((c) => c.length).reduce((sum, v) => sum * v);
}

if (import.meta.main) {
  console.time("Time taken");
  console.log("Answer:", puzzle());
  console.timeEnd("Time taken");
}
