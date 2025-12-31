function findPaths(
  fromKey: string,
  endKey: string,
  graph: Map<string, string[]>,
  cache: Map<string, number>,
) {
  if (fromKey === endKey) {
    return 1;
  }
  if (cache.has(fromKey)) {
    return cache.get(fromKey)!;
  }

  const to = graph.get(fromKey) ?? [];

  // initially set cache to 0 to use for infinite loop detection
  cache.set(fromKey, 0);

  let totalPathCount = 0;
  for (const toKey of to) {
    totalPathCount += findPaths(toKey, endKey, graph, cache);
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

  const fft_out = findPaths("fft", "out", graph, new Map());
  const dac_out = findPaths("dac", "out", graph, new Map());
  const fft_dac = findPaths("fft", "dac", graph, new Map());
  const dac_fft = findPaths("dac", "fft", graph, new Map());
  const svr_fft = findPaths("svr", "fft", graph, new Map());
  const svr_dac = findPaths("svr", "dac", graph, new Map());

  const svr_fft_dac_out = svr_fft * fft_dac * dac_out;
  const svr_dac_fft_out = svr_dac * dac_fft * fft_out;
  return svr_fft_dac_out + svr_dac_fft_out;
}

if (import.meta.main) {
  console.time("Time taken");
  console.log("Answer:", puzzle());
  console.timeEnd("Time taken");
}
