import { assertEquals } from "jsr:@std/assert";
import { puzzle as part1 } from "./part1.ts";

Deno.test("part1", () => {
  assertEquals(part1(), 531);
});
