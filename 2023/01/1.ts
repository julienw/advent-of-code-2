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

const lineIterator = processLineByLine();
const input = [];
for await (const line of lineIterator) {
  input.push(line);
}

if (!input.length) {
  throw new Error("Please give me some input!");
}

let sum = 0;
const startRe = /^.*?(\d)/;
const endRe = /^.*(\d).*?$/;
for (const line of input) {
  const startResult = startRe.exec(line);
  const endResult = endRe.exec(line);
  if (!startResult || !endResult) {
    console.log(`Couldn't match a result on line ${line}`);
    process.exit(1);
  }

  const digit1 = startResult[1];
  const digit2 = endResult[1];
  console.log(digit1, digit2);

  const number = Number(digit1 + digit2);
  sum += number;
}

console.log(sum);
