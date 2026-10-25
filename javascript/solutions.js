"use strict";

// Problem 1: First non-repeating character
function firstNonRepeatingChar(text) {
  if (typeof text !== "string") {
    throw new TypeError("text must be a string");
  }

  const frequencies = new Map();
  for (const character of text) {
    const key = character.toLowerCase();
    frequencies.set(key, (frequencies.get(key) || 0) + 1);
  }
  for (const character of text) {
    if (frequencies.get(character.toLowerCase()) === 1) {
      return character;
    }
  }
  return null;
}

// Problem 2: Find two numbers that add up to a target
function findTwoSum(numbers, target) {
  if (
    !Array.isArray(numbers) ||
    !numbers.every(Number.isSafeInteger) ||
    !Number.isSafeInteger(target)
  ) {
    throw new TypeError("numbers and target must contain only safe integers");
  }

  const seen = new Map();
  for (let index = 0; index < numbers.length; index++) {
    const complement = target - numbers[index];
    if (seen.has(complement)) {
      return [seen.get(complement), index];
    }
    seen.set(numbers[index], index);
  }
  return null;
}

// Problem 3: Count leads by status
function countLeadsByStatus(leads) {
  if (!Array.isArray(leads)) {
    throw new TypeError("leads must be an array");
  }

  const counts = new Map();
  for (const lead of leads) {
    if (
      lead === null ||
      typeof lead !== "object" ||
      typeof lead.status !== "string"
    ) {
      throw new TypeError("each lead must be an object with a string status");
    }
    counts.set(lead.status, (counts.get(lead.status) || 0) + 1);
  }
  return Object.fromEntries(counts);
}

// Test Cases
module.exports = { firstNonRepeatingChar, findTwoSum, countLeadsByStatus };

if (require.main === module) {
  const test = require("node:test");
  const assert = require("node:assert/strict");

  const characterCases = [
    ["aabbcdd", "c"],
    ["swiss", "w"],
    ["aabb", null],
    ["", null],
    ["AaB", "B"],
    ["aAbCbc", null],
    ["aA bB", " "],
    ["aA!bB", "!"],
  ];
  for (const [input, expected] of characterCases) {
    test(`firstNonRepeatingChar: ${JSON.stringify(input)}`, () => {
      assert.equal(firstNonRepeatingChar(input), expected);
    });
  }
  test("firstNonRepeatingChar rejects non-string input", () => {
    for (const input of [null, undefined, 42, []]) {
      assert.throws(() => firstNonRepeatingChar(input), TypeError);
    }
  });

  const twoSumCases = [
    [[2, 7, 11, 15], 9, [0, 1]],
    [[3, 2, 4], 6, [1, 2]],
    [[3, 3], 6, [0, 1]],
    [[1, 2, 3], 10, null],
    [[], 0, null],
    [[3], 6, null],
    [[-3, 4, 3, 90], 0, [0, 2]],
    [[0, 0], 0, [0, 1]],
  ];
  for (const [numbers, target, expected] of twoSumCases) {
    test(`findTwoSum: ${JSON.stringify(numbers)}, target ${target}`, () => {
      assert.deepEqual(findTwoSum(numbers, target), expected);
    });
  }
  test("findTwoSum accepts any valid pair and preserves the input", () => {
    const numbers = Object.freeze([1, 4, 2, 3]);
    const pair = findTwoSum(numbers, 5);
    assert.notEqual(pair, null);
    assert.notEqual(pair[0], pair[1]);
    assert.equal(numbers[pair[0]] + numbers[pair[1]], 5);
    assert.deepEqual(numbers, [1, 4, 2, 3]);
  });
  test("findTwoSum rejects invalid arrays, elements and targets", () => {
    for (const numbers of [
      null,
      "123",
      [1, 2.5],
      [1, "2"],
      [NaN],
      [Infinity],
      [2 ** 53],
    ]) {
      assert.throws(() => findTwoSum(numbers, 3), TypeError);
    }
    for (const target of [null, "3", 3.5, NaN, Infinity, 2 ** 53]) {
      assert.throws(() => findTwoSum([1, 2], target), TypeError);
    }
  });

  test("countLeadsByStatus matches the assessment example", () => {
    const leads = [
      { name: "Alice", status: "NEW" },
      { name: "Bob", status: "CONTACTED" },
      { name: "Charlie", status: "NEW" },
      { name: "David", status: "QUALIFIED" },
    ];
    assert.deepEqual(countLeadsByStatus(leads), {
      NEW: 2,
      CONTACTED: 1,
      QUALIFIED: 1,
    });
  });
  test("countLeadsByStatus returns an empty object for empty input", () => {
    assert.deepEqual(countLeadsByStatus([]), {});
  });
  test("countLeadsByStatus handles new statuses without modifying its input", () => {
    const leads = Object.freeze([
      Object.freeze({ name: "Alice", status: "FOLLOW_UP" }),
      Object.freeze({ name: "Bob", status: "FOLLOW_UP" }),
      Object.freeze({ name: "Charlie", status: "WON" }),
    ]);
    const before = JSON.stringify(leads);
    assert.deepEqual(countLeadsByStatus(leads), { FOLLOW_UP: 2, WON: 1 });
    assert.equal(JSON.stringify(leads), before);
  });
  test("countLeadsByStatus treats statuses as exact, case-sensitive strings", () => {
    assert.deepEqual(
      countLeadsByStatus([
        { name: "Alice", status: "NEW" },
        { name: "Bob", status: "new" },
      ]),
      { NEW: 1, new: 1 },
    );
  });
  test("countLeadsByStatus counts statuses that match object property names", () => {
    const result = countLeadsByStatus([
      { name: "Alice", status: "__proto__" },
      { name: "Bob", status: "constructor" },
      { name: "Charlie", status: "__proto__" },
      { name: "David", status: "toString" },
    ]);
    assert.deepEqual(
      result,
      JSON.parse('{"__proto__":2,"constructor":1,"toString":1}'),
    );
    assert.equal(Object.getPrototypeOf(result), Object.prototype);
  });
  test("countLeadsByStatus rejects malformed input", () => {
    for (const input of [null, {}, [null], [{}], [{ status: 5 }]]) {
      assert.throws(() => countLeadsByStatus(input), TypeError);
    }
  });
}
