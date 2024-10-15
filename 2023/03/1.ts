import readline from "node:readline";
import process from "node:process";
async function* processLineByLine() {
  const rl = readline.createInterface({
    input: process.stdin,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  yield* rl;
}

async function run() {
  const lineIterator = processLineByLine();
  const numbers: Array<{
    value: number;
    y: number;
    start: number;
    end: number;
  }> = []; // start and end included
  const symbols: Array<Array<true>> = [];
  let x = 0;
  let y = 0;
  for await (const line of lineIterator) {
    symbols.push([]);
    let currentNumber = "";
    let start = null;
    for (let x = 0; x < line.length; x++) {
      const letter = line[x];
      const maybeDigit = Number(letter);
      if (Number.isNaN(maybeDigit)) {
        if (currentNumber) {
          numbers.push({
            value: Number(currentNumber),
            y,
            start: start!,
            end: x - 1,
          });
          currentNumber = "";
          start = null;
        }
        if (letter !== ".") {
          symbols[y][x] = true;
        }
      } else {
        const digit = maybeDigit;
        currentNumber += digit;
        if (start === null) {
          start = x;
        }
      }
    }
    if (currentNumber) {
      numbers.push({
        value: Number(currentNumber),
        y,
        start: start!,
        end: line.length - 1,
      });
    }
    y++;
  }

  if (!numbers.length) {
    throw new Error("Please give me some input!");
  }

  console.log(numbers);
  console.log(symbols);

  let sum = 0;
  number: for (const number of numbers) {
    for (let y = number.y - 1; y <= number.y + 1; y++) {
      for (let x = number.start - 1; x <= number.end + 1; x++) {
        if (symbols[y]?.[x]) {
          sum += number.value;
          continue number;
        }
      }
    }
    console.log("-", number);
  }
  console.log("=>", sum);
}

run();
