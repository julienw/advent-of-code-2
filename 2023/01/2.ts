import readline from "node:readline";
async function* processLineByLine() {
  const rl = readline.createInterface({
    input: process.stdin,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  yield* rl;
}

const digitsMap = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};
const digitsLetters = Object.keys(digitsMap);
const digitsLetterAsRe = digitsLetters.join("|");

function toDigit(digit) {
  if (digit in digitsMap) {
    return String(digitsMap[digit]);
  }

  return digit;
}

async function run() {
  const lineIterator = processLineByLine();
  const input = [];
  for await (const line of lineIterator) {
    input.push(line);
  }

  if (!input.length) {
    throw new Error("Please give me some input!");
  }

  let sum = 0;
  const startRe = new RegExp(`^.*?(\\d|${digitsLetterAsRe})`);
  const endRe = new RegExp(`^.*(\\d|${digitsLetterAsRe}).*?$`);
  for (const line of input) {
    const startResult = startRe.exec(line);
    const endResult = endRe.exec(line);
    if (!startResult || !endResult) {
      console.log(`Couldn't match a result on line ${line}`);
      return;
    }

    const digit1 = startResult[1];
    const digit2 = endResult[1];
    console.log(digit1, digit2);

    const number = Number(toDigit(digit1) + toDigit(digit2));
    sum += number;
  }

  console.log(sum);
}

run();
