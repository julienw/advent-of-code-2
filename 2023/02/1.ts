import readline from "node:readline";
import process from "node:process";
import { parseArgs } from "jsr:@std/cli/parse-args";
async function* processLineByLine() {
  const rl = readline.createInterface({
    input: process.stdin,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  yield* rl;
}

type CubeColor = "green" | "blue" | "red";

async function run() {
  const args = parseArgs(Deno.args);
  if (
    args.red === undefined ||
    args.green === undefined ||
    args.blue === undefined
  ) {
    console.log("run with --red --green and --blue");
    return;
  }

  const lineIterator = processLineByLine();
  const input: Array<Array<{ blue: number; red: number; green: number }>> = [];
  for await (const line of lineIterator) {
    const sets = line.slice(line.indexOf(":") + 1).split(";");
    const parsedSets = [];
    for (const set of sets) {
      const cubes = set.split(",");
      const parsedSet = { blue: 0, red: 0, green: 0 };
      for (const cube of cubes) {
        const [number, type] = cube.trim().split(" ");
        parsedSet[type as CubeColor] = Number(number);
      }
      parsedSets.push(parsedSet);
    }
    input.push(parsedSets);
  }

  if (!input.length) {
    throw new Error("Please give me some input!");
  }

  console.log(input);

  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    const game = input[i];
    const isPossible = game.every(
      (set) =>
        set.green <= args.green && set.red <= args.red && set.blue <= args.blue,
    );

    if (isPossible) {
      sum += i + 1;
    }
  }

  console.log(sum);
}

run();
