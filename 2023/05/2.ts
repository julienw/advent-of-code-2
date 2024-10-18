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

type Source = string;
type Destination = string;
type DisruptionMap = {
  sourceStart: number;
  destinationStart: number;
  rangeLength: number;
};

function getNextFromMaps(val: number, maps: DisruptionMap[]): number {
  const relevantMap = maps.find(
    ({ sourceStart, rangeLength }) =>
      val >= sourceStart && val < sourceStart + rangeLength,
  );

  if (!relevantMap) {
    return val;
  }

  const { destinationStart, sourceStart } = relevantMap;

  const result = destinationStart + val - sourceStart;
  return result;
}

async function run() {
  const lineIterator = processLineByLine();
  const seeds: Array<{ start: number; length: number }> = [];
  const maps: Record<
    Source,
    {
      source: Source;
      destination: Destination;
      disruptionMaps: DisruptionMap[];
    }
  > = {};

  let readingMap = false;
  let currentMap: null | DisruptionMap[] = null;

  for await (const line of lineIterator) {
    if (/^seeds:/.test(line)) {
      const pairs = line
        .slice(line.indexOf(":") + 1)
        .trim()
        .split(" ")
        .map((s) => Number(s));
      while (pairs.length) {
        const [start, length] = pairs.splice(0, 2);
        seeds.push({ start, length });
      }
    } else if (/ map:$/.test(line)) {
      const [source, , destination] = line
        .slice(0, line.lastIndexOf(" map:"))
        .split("-");
      currentMap = [];
      maps[source] = { source, destination, disruptionMaps: currentMap };

      readingMap = true;
    } else if (line.trim() === "") {
      readingMap = false;
      currentMap = null;
    } else if (readingMap) {
      if (currentMap === null) {
        console.error(
          `Couldn't read line ${line} because the current map is null, oops.`,
        );
        continue;
      }
      const [destinationStart, sourceStart, rangeLength] = line
        .split(" ")
        .map((s) => Number(s));
      currentMap.push({ sourceStart, destinationStart, rangeLength });
    } else {
      console.error(`Error, couldn't make sense of line ${line}`);
    }
  }
  currentMap = null;

  console.log(seeds);
  console.log(maps);

  let minResult = +Infinity;
  for (const { start, length } of seeds) {
    console.log(start, length);
    for (let seed = start; seed < start + length; seed++) {
      let currentType = "seed";
      let current = seed;
      while (currentType in maps) {
        //console.log(currentType, current);
        const map = maps[currentType];
        current = getNextFromMaps(current, map.disruptionMaps);
        currentType = map.destination;
      }
      if (current < minResult) minResult = current;
    }
  }

  console.log("=>", minResult);
}

run();
