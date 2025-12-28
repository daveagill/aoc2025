export function puzzle() {
  const input = Deno.readTextFileSync("day7/input.txt");
  const manifold = input.replace(/\n/g, "").split("");
  const width = input.indexOf("\n");
  const height = manifold.length / width;
  const Sx = input.indexOf("S");

  const getXY = (x: number, y: number) => {
    return manifold[x + y * width];
  };
  const setXY = (x: number, y: number, val: string) => {
    manifold[x + y * width] = val;
  };

  const simulate = (emitX: number, emitY: number) => {
    // find first collision
    while (getXY(emitX, emitY) === ".") {
      ++emitY;
      // test if tachyon exists the manifold
      if (emitY == height) {
        return;
      }
    }

    // test if we've already encountered this splitter and exit if so
    if (getXY(emitX, emitY) === "x") {
      return;
    }

    // mark the splitter as encountered
    setXY(emitX, emitY, "x");

    // simulate the split
    simulate(emitX - 1, emitY + 1);
    simulate(emitX + 1, emitY + 1);
  };

  simulate(Sx, 1);
  return manifold.filter((x) => x === "x").length;
}

if (import.meta.main) {
  console.time("Time taken");
  console.log("Answer:", puzzle());
  console.timeEnd("Time taken");
}
