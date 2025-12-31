function findPaths(
  fromKey: string,
  graph: Map<string, string[]>,
  cache: Map<string, number>,
) {
  if (fromKey === "out") return 1;
  if (cache.has(fromKey)) {
    return cache.get(fromKey)!;
  }

  const to = graph.get(fromKey)!;

  // initially set cache to 0 to use for infinite loop detection
  cache.set(fromKey, 0);

  let totalPathCount = 0;
  for (const toKey of to) {
    totalPathCount += findPaths(toKey, graph, cache);
  }

  cache.set(fromKey, totalPathCount);
  return totalPathCount;
}

export function puzzle() {
  const input = Deno.readTextFileSync("day11/input.txt");
  const lines = input.trim().split("\n");

  const graph = new Map<string, string[]>();
  for (const line of lines) {
    const [k, vs] = line.split(": ");
    const to = vs.split(" ");
    graph.set(k, to);
  }

  return findPaths("you", graph, new Map());
}

if (import.meta.main) {
  console.time("Time taken");
  console.log("Answer:", puzzle());
  console.timeEnd("Time taken");
}
