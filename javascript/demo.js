"use strict";

const { spawnSync } = require("node:child_process");
const path = require("node:path");
const { isDeepStrictEqual } = require("node:util");
const {
  firstNonRepeatingChar,
  findTwoSum,
  countLeadsByStatus,
} = require("./solutions.js");

const sampleLeads = [
  { name: "Alice", status: "NEW" },
  { name: "Bob", status: "CONTACTED" },
  { name: "Charlie", status: "NEW" },
  { name: "David", status: "QUALIFIED" },
];

const examples = [
  [firstNonRepeatingChar, ["aabbcdd"], "c"],
  [firstNonRepeatingChar, ["AaB"], "B"],
  [firstNonRepeatingChar, ["aA bB"], " "],
  [firstNonRepeatingChar, ["aabb"], null],
  [findTwoSum, [[2, 7, 11, 15], 9], [0, 1]],
  [findTwoSum, [[3, 3], 6], [0, 1]],
  [findTwoSum, [[1, 2, 3], 10], null],
  [countLeadsByStatus, [sampleLeads], { NEW: 2, CONTACTED: 1, QUALIFIED: 1 }],
  [countLeadsByStatus, [[]], {}],
  [countLeadsByStatus, [[
    { name: "Alice", status: "FOLLOW_UP" },
    { name: "Bob", status: "FOLLOW_UP" },
    { name: "Charlie", status: "WON" },
  ]], { FOLLOW_UP: 2, WON: 1 }],
];

console.log("JAVASCRIPT EXAMPLES\n");
console.log('Strings are quoted so a space appears as " " rather than looking empty.\n');
let demoFailures = 0;

for (const [solution, args, expected] of examples) {
  console.log(solution.name);
  console.log("Input:    " + args.map((argument) => JSON.stringify(argument)).join(", "));
  console.log("Expected: " + JSON.stringify(expected));
  try {
    const actual = solution(...args);
    const passed = isDeepStrictEqual(actual, expected);
    console.log("Actual:   " + JSON.stringify(actual));
    console.log("Result:   " + (passed ? "PASS" : "FAIL"));
    if (!passed) demoFailures++;
  } catch (error) {
    console.log("Actual:   " + error.name + ": " + error.message);
    console.log("Result:   FAIL");
    demoFailures++;
  }
  console.log();
}

console.log(`Examples: ${examples.length - demoFailures}/${examples.length} passed.\n`);
console.log("FULL AUTOMATED TEST SUITE\n");
const result = spawnSync(
  process.execPath,
  ["--test", path.join(__dirname, "solutions.js")],
  { stdio: "inherit" },
);
if (result.error) {
  console.error("Could not run the test suite: " + result.error.message);
}
process.exitCode = demoFailures > 0 ? 1 : (result.status ?? 1);
