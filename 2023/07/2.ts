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

const cards = "J23456789TQKA";
const cardsToRank = Array.from(cards).reduce(
  (rank, val, i) => {
    rank[val] = i;
    return rank;
  },
  {} as Record<string, number>,
);

const handTypes = ["None", "Pair", "TwoPair", "Three", "Full", "Four", "Five"];
const handTypeOrder = handTypes.reduce(
  (rank, val, i) => {
    rank[val] = i;
    return rank;
  },
  {} as Record<string, number>,
);

type HandType = (typeof handTypes)[number];
function findTypeForHand(hand: string): HandType {
  const explodedHand = Object.groupBy(hand, (letter) => letter) as Record<
    string,
    string[]
  >;
  let gotThree = false;
  let gotTwo = false;
  const jokersCount = explodedHand["J"]?.length ?? 0;
  delete explodedHand["J"];

  for (const [, vals] of Object.entries(explodedHand)) {
    switch (vals.length) {
      case 5:
        return "Five";
      case 4:
        if (jokersCount > 0) return "Five";
        return "Four";
      case 3:
        if (jokersCount === 2) return "Five";
        if (jokersCount === 1) return "Four";
        if (gotTwo) return "Full";
        gotThree = true;
        break;
      case 2:
        if (jokersCount === 3) return "Five";
        if (jokersCount === 2) return "Four";
        if (gotThree) return "Full";
        if (gotTwo) return "TwoPair";
        if (jokersCount === 1) gotThree = true;
        else gotTwo = true;
        break;
      default:
    }
  }
  if (gotTwo) return "Pair";
  if (gotThree) return "Three";
  switch (jokersCount) {
    case 5:
      return "Five";
    case 4:
      return "Five";
    case 3:
      return "Four";
    case 2:
      return "Three";
    case 1:
      return "Pair";
  }
  return "None";
}

async function run() {
  const lineIterator = processLineByLine();

  const input = [];
  for await (const line of lineIterator) {
    const [hand, bid] = line.split(" ");
    const type = findTypeForHand(hand);
    input.push({ hand, type, bid: +bid });
  }
  console.log(input);

  input.sort((handA, handB) => {
    const handTypeDiff = handTypeOrder[handA.type] - handTypeOrder[handB.type];
    if (handTypeDiff !== 0) return handTypeDiff;

    for (let i = 0; i < 5; i++) {
      const letterDiff = cardsToRank[handA.hand[i]] -
        cardsToRank[handB.hand[i]];
      if (letterDiff !== 0) return letterDiff;
    }
    console.error(`No difference between handA ${handA} and handB ${handB}`);
    return 0;
  });

  console.log(input);

  const score = input.reduce((res, { bid }, i) => res + (i + 1) * bid, 0);
  console.log("=>", score);
}

run();
