function toggleLights(lightState: string, buttons: number[]) {
  const lights = lightState.split("");
  for (const idx of buttons) {
    lights[idx] = lights[idx] === "." ? "#" : ".";
  }
  return lights.join("");
}

function bfs(targetState: string, buttons: number[][]) {
  const allEncounteredStates = new Set<string>();
  const lightStates = new Set<string>();
  let depth = 0;

  // start with all lights switched off
  lightStates.add(targetState.replace(/#/g, "."));

  while (true) {
    const lightStatesToAdvance = [...lightStates];
    lightStates.clear();

    for (const lights of lightStatesToAdvance) {
      if (targetState === lights) {
        return depth;
      }

      allEncounteredStates.add(lights);
      const nextStates = buttons.map((b) => toggleLights(lights, b));

      for (const next of nextStates) {
        if (!allEncounteredStates.has(next)) {
          lightStates.add(next);
        }
      }
    }

    ++depth;
  }
}

export function puzzle() {
  const input = Deno.readTextFileSync("day10/input.txt");
  const lines = input.trim().split("\n");

  let totalPresses = 0;
  for (const line of lines) {
    const parts = line.split(" ");
    const lights = parts[0].substring(1, parts[0].length - 1);
    const buttons = parts.slice(1, -1).map((b) =>
      b.substring(1, b.length - 1).split(",").map(Number)
    );

    const minPresses = bfs(lights, buttons);
    totalPresses += minPresses;
  }

  return totalPresses;
}

if (import.meta.main) {
  console.time("Time taken");
  console.log("Answer:", puzzle());
  console.timeEnd("Time taken");
}
