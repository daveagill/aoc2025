export function puzzle() {
  const input = Deno.readTextFileSync("day7/input.txt");
  const manifold = input.replace(/\n/g, "").split("");
  const width = input.indexOf("\n");
  const height = manifold.length / width;
  const Sx = input.indexOf("S");

  const getXY = (x: number, y: number) => {
    return manifold[x + y * width];
  };

  const cache = new Map<number, number>();

  const simulate = (emitX: number, emitY: number): number => {
    // find first collision
    while (getXY(emitX, emitY) === ".") {
      ++emitY;
      // test if tachyon exists the manifold
      if (emitY == height) {
        return 1;
      }
    }

    // short circuit with the cache
    if (cache.has(emitX + emitY * width)) {
      return cache.get(emitX + emitY * width) as number;
    }

    // simulate the split
    const left = simulate(emitX - 1, emitY + 1);
    const right = simulate(emitX + 1, emitY + 1);
    const result = left + right;

    // cache the result
    cache.set(emitX + emitY * width, result);

    return result;
  };

  return simulate(Sx, 1);
}

if (import.meta.main) {
  console.time("Time taken");
  console.log("Answer:", puzzle());
  console.timeEnd("Time taken");
}
