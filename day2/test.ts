import { assertEquals } from "jsr:@std/assert";
import { puzzle as part1 } from "./part1.ts";
import { puzzle as part2 } from "./part2.ts";

Deno.test("part1", () => {
  assertEquals(part1(), 40398804950);
});

Deno.test("part2", () => {
  assertEquals(part2(), 65794984339);
});
