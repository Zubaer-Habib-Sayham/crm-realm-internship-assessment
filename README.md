# CRM Realm Technical Assessment

Zubaer Habib Sayham

## 1. Run the Java application and test JavaScript

Use Java JDK 11 or newer and Node.js 18 or newer. Run the commands from this folder. No extra libraries need to be installed.

Start the Java application:

```sh
javac --release 11 -d out java/Lead.java java/LeadTracker.java java/LeadTrackerTest.java
java -cp out LeadTracker
```

Choose `1` to add a lead, `2` to view leads, or `3` to exit.

Run the JavaScript examples and tests:

```sh
node javascript/demo.js
```

This prints each example's input, expected answer, actual answer and result, then runs all automated tests.

## 2. Main idea behind each JavaScript solution

- **`firstNonRepeatingChar`:** Count characters without treating uppercase and lowercase differently. Read the original string again and return the first character counted once, keeping its original form.
- **`findTwoSum`:** For each number, check whether its required partner appeared earlier. Remember earlier numbers and their indices so the same element is never used twice.
- **`countLeadsByStatus`:** Count each status in a new object without changing the original leads. New status values are counted automatically.

To include statuses with zero leads, begin with a list of expected statuses set to zero, then count the leads and add any new statuses encountered.

## 3. Test cases

- **Java boundaries:** Scores `0` and `49` give COLD; `50` and `79` give WARM; `80` and `100` give HOT.
- **Java invalid input:** Empty names or emails, scores `-1` or `101`, and non-integer scores are rejected.
- **First character:** `"AaB"` returns `"B"`. `"aabb"` and an empty string return `null`.
- **Two sum:** `[3, 3]` with target `6` returns `[0, 1]`. `[3]` with target `6` returns `null`.
- **Status counts:** NEW, NEW, CONTACTED gives `{ NEW: 2, CONTACTED: 1 }`. An empty array gives `{}`.
- **PostgreSQL:** The six sample boundary scores give HOT 2, WARM 2 and COLD 2. An empty table gives zero for each group.

Run the Java tests after compiling with `java -cp out LeadTrackerTest`.

## 4. One decision and why

Spaces and punctuation count as characters because the brief does not ask to ignore them. For example, `"aA bB"` returns a space and `"aA!bB"` returns `"!"`.

## 5. One improvement

Add saving and loading from a file so leads remain available after the Java application closes. Currently, leads are kept only while the application is running.

## AI assistance

AI assistance included reviewing code efficiency and time complexity, and curating tests for typical cases, boundary values and invalid inputs.
