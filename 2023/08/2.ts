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

function* loop(iterable: Iterable<string>) {
  while (true) {
    for (const c of iterable) {
      switch (c) {
        case "L":
          yield "left";
          break;
        case "R":
          yield "right";
          break;
        default:
          throw new Error(`Unknown char ${c}`);
      }
    }
  }
}

async function run() {
  const lineIterator = processLineByLine();

  const nodes = {} as Record<
    string,
    { left: string; right: string; end: boolean }
  >;
  let instructions = "";
  for await (const line of lineIterator) {
    if (!instructions) {
      instructions = line;
      continue;
    }

    if (!line) {
      continue;
    }

    const matchResult = /^(?<name>\w+)\s*=\s*\((?<left>\w+),\s+(?<right>\w+)\)$/
      .exec(line);
    if (!matchResult) {
      throw new Error(`Couldn't match line: ${line}`);
    }

    const { name, left, right } = matchResult.groups as {
      name: string;
      left: string;
      right: string;
    };
    nodes[name] = { left, right, end: name.endsWith("Z") };
  }

  const currentNodes = Object.keys(nodes).filter((n) => n.at(-1) === "A");
  console.log(currentNodes);

  let steps = 0;
  for (const direction of loop(instructions)) {
    steps++;
    for (let i = 0; i < currentNodes.length; i++) {
      currentNodes[i] = nodes[currentNodes[i]][direction];
    }
    if (currentNodes.every((node) => nodes[node].end)) break;
  }

  console.log("=>", steps);
}

run();
