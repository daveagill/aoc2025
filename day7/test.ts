import { assertEquals } from "jsr:@std/assert";
import { puzzle as part1 } from "./part1.ts";
import { puzzle as part2 } from "./part2.ts";

Deno.test("part1", () => {
  assertEquals(part1(), 1642);
});

Deno.test("part2", () => {
  assertEquals(part2(), 47274292756692);
});
