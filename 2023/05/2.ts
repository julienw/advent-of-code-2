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
  const seeds: Array<{ start: number; end: number }> = []; // start included, end excluded
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
        seeds.push({ start, end: start + length });
      }
    } else if (/ map:$/.test(line)) {
      const [source, , destination] = line
        .slice(0, line.lastIndexOf(" map:"))
        .split("-");
      currentMap = [];
      maps[source] = { source, destination, disruptionMaps: currentMap };

      readingMap = true;
    } else if (line.trim() === "") {
      if (currentMap) currentMap.sort((a, b) => a.sourceStart - b.sourceStart);
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

  let currentRanges = seeds;
  let currentType = "seed";

  while (currentType in maps) {
    console.log("============", currentType);
    const newRanges = [];
    const map = maps[currentType];

    for (const { start, end } of currentRanges) {
      console.log("==== range", start, end);
      let lastEnd = start;
      for (
        const {
          sourceStart,
          destinationStart,
          rangeLength,
        } of map.disruptionMaps
      ) {
        console.log(
          "considering map",
          sourceStart,
          destinationStart,
          rangeLength,
        );
        if (sourceStart + rangeLength < start) {
          console.log("=> continue");
          continue;
        }
        if (sourceStart >= end) {
          console.log("=> break");
          break;
        }
        console.log("=> keep");

        if (lastEnd < sourceStart) {
          console.log("lastEnd", lastEnd, "< sourceStart", sourceStart);
          console.log("=> hole since last range, push", lastEnd, sourceStart);
          newRanges.push({ start: lastEnd, end: sourceStart });
        }

        const diff = destinationStart - sourceStart;
        const newStart = Math.max(start, sourceStart);
        const newEnd = Math.min(end, sourceStart + rangeLength);
        console.log(
          "=> translation push",
          newStart,
          newEnd,
          "=>",
          newStart + diff,
          newEnd + diff,
        );
        newRanges.push({ start: newStart + diff, end: newEnd + diff });
        lastEnd = sourceStart + rangeLength;
      }
      if (lastEnd < end) {
        console.log("=> missing range at the end, push", lastEnd, end);
        newRanges.push({ start: lastEnd, end: end });
      }
    }

    currentRanges = newRanges;
    currentType = map.destination;
    //break; // TODO
  }

  console.log(currentRanges);
  const min = Math.min(...currentRanges.map((range) => range.start));
  console.log("====>", min);
}

run();
