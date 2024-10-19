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
    input.push([...reResult].map((r) => r[0]));
  }
  const [durations, records] = input;
  const races = [];
  for (let i = 0; i < durations.length; i++) {
    races.push({ duration: +durations[i], record: +records[i] });
  }

  const wins = races.map(({ duration, record }) => {
    let wins = 0;

    for (let i = 0; i < duration; i++) {
      const result = 3;
    }

    return wins;
  });
}

run();
