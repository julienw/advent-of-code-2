# Advent of code 

This is about [this fun contest](https://adventofcode.com/), happening every year in
December.

In this directory there's a directory for each year. The first year is 2023,
some previous years are present in a [previous repository](https://github.com/julienw/advent-of-code).

## Install dependencies

The code uses deno.

## How to run

All code takes input from the standard input. So if we want to use input from a
file, this is how we run it:

```
deno 2023/01/1.js < /path/to/input
```

If you want to run the input directly from the advent of code website, you can
use curl, for example:
```
curl -H 'Cookie: session=<session_id>' https://adventofcode.com/2019/day/3/input | deno 2023/01/1.js
```

