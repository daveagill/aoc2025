type Op = "+" | "*";

export function puzzle() {
  const input = Deno.readTextFileSync("day6/input.txt");
  const lines = input.trim().split("\n");
  const terms = lines.slice(0, -1).map((row) =>
    row.trim().split(/\s+/g).map(Number)
  );
  const operators = lines.slice(-1)[0].trim().split(/\s+/g) as Op[];

  let grandTotal = 0;
  for (let i = 0; i < operators.length; ++i) {
    if (operators[i] === "+") {
      grandTotal += terms.reduce(
        (result, termGroup) => result + termGroup[i],
        0,
      );
    } else {
      grandTotal += terms.reduce(
        (result, termGroup) => result * termGroup[i],
        1,
      );
    }
  }

  return grandTotal;
}

if (import.meta.main) {
  console.time("Time taken");
  console.log("Answer:", puzzle());
  console.timeEnd("Time taken");
}
