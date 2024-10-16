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
  const matchingNumbers = [];
  for await (const line of lineIterator) {
    const usefulLine = line.slice(line.indexOf(":") + 1);
    const [winningLine, pointsLine] = usefulLine
      .split("|")
      .map((s) => s.trim());
    const winningSet = new Set(
      winningLine
        .split(" ")
        .filter((s) => s)
        .map((s) => Number(s)),
    );
    const pointsNumbers = pointsLine
      .split(" ")
      .filter((s) => s)
      .map((s) => Number(s));
    const winningNumbers = pointsNumbers.filter((n) => winningSet.has(n));
    const howMany = winningNumbers.length;
    matchingNumbers.push(howMany);
  }

  const scores = new Uint32Array(matchingNumbers.length).fill(1);
  for (let i = 0; i < matchingNumbers.length; i++) {
    const winning = matchingNumbers[i];
    for (let j = i + 1; j <= i + winning; j++) {
      scores[j] += scores[i];
    }
  }

  const sum = scores.reduce((acc, val) => acc + val);
  console.log(sum);
}

run();
