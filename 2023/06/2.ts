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

  const input = [];
  for await (const line of lineIterator) {
    const reResult = line.matchAll(/\d+/g);
    const allDigits = [...reResult].map((r) => r[0]);
    input.push(Number(allDigits.join("")));
  }
  const [duration, record] = input;

  let wins = 0;

  for (let i = 0; i < duration; i++) {
    const result = (duration - i) * i;
    if (result > record) wins++;
  }

  console.log("=>", wins);
}

run();
