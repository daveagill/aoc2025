type Op = "+" | "*";

export function puzzle() {
  const input = Deno.readTextFileSync("day6/input.txt");
  const lines = input.trim().split("\n");
  const terms = lines.slice(0, -1);
  const operators = lines.slice(-1)[0].trim().split(/\s+/g) as Op[];

  const termGroups = [[]] as number[][];
  for (let col = 0; col < terms[0].length; ++col) {
    let number = 0;
    let isBlankCol = true;

    for (const row of terms) {
      const digit = row[col];
      if (digit === " ") continue;
      number = number * 10 + Number(digit);
      isBlankCol = false;
    }

    const termGroup = termGroups[termGroups.length - 1];
    if (isBlankCol && termGroup.length > 0) {
      termGroups.push([]);
    } else {
      termGroup.push(number);
    }
  }

  let grandTotal = 0;
  for (let i = 0; i < operators.length; ++i) {
    if (operators[i] === "+") {
      grandTotal += termGroups[i].reduce((result, term) => result + term, 0);
    } else {
      grandTotal += termGroups[i].reduce((result, term) => result * term, 1);
    }
  }

  return grandTotal;
}

if (import.meta.main) {
  console.time("Time taken");
  console.log("Answer:", puzzle());
  console.timeEnd("Time taken");
}
