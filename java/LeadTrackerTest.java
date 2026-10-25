import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public final class LeadTrackerTest {
    private static int checks = 0;

    public static void main(String[] args) {
        int[] scores = {0, 49, 50, 79, 80, 100};
        String[] priorities = {"COLD", "COLD", "WARM", "WARM", "HOT", "HOT"};
        for (int index = 0; index < scores.length; index++) {
            Lead lead = new Lead("Alice", "alice@example.com", scores[index]);
            equal(lead.calculatePriority(), priorities[index]);
            equal(lead.getScore(), scores[index]);
        }

        Lead trimmed = new Lead("  Alice Smith  ", "  alice@example.com  ", 80);
        equal(trimmed.getName(), "Alice Smith");
        equal(trimmed.getEmail(), "alice@example.com");
        for (String invalid : new String[] {null, "", " \t "}) {
            rejects(() -> new Lead(invalid, "alice@example.com", 80), "Name must not be empty.");
            rejects(() -> new Lead("Alice", invalid, 80), "Email must not be empty.");
        }
        for (int invalid : new int[] {-1, 101, Integer.MIN_VALUE, Integer.MAX_VALUE}) {
            rejects(() -> new Lead("Alice", "alice@example.com", invalid),
                    "Score must be between 0 and 100.");
        }

        contains(run("2\n3\n"), "No leads yet.");
        String multiple = run("1\nAlice Smith\nalice@example.com\n80\n"
                + "1\nBob\nbob@example.com\n50\n"
                + "1\nCharlie\ncharlie@example.com\n49\n2\n3\n");
        contains(multiple, "Name: Alice Smith\nEmail: alice@example.com\nScore: 80\nPriority: HOT");
        contains(multiple, "Name: Bob\nEmail: bob@example.com\nScore: 50\nPriority: WARM");
        contains(multiple, "Name: Charlie\nEmail: charlie@example.com\nScore: 49\nPriority: COLD");
        contains(multiple, "Lead 3");

        for (String invalid : new String[] {"-1", "101", "abc", "50.5", "", "2147483648"}) {
            String result = run("1\nAlice\nalice@example.com\n" + invalid + "\n2\n3\n");
            contains(result, "Invalid lead:");
            contains(result, "No leads yet.");
            excludes(result, "Lead added successfully.");
        }
        String blankName = run("1\n  \nalice@example.com\n50\n2\n3\n");
        contains(blankName, "Name must not be empty.");
        contains(blankName, "No leads yet.");
        String blankEmail = run("1\nAlice\n  \n50\n2\n3\n");
        contains(blankEmail, "Email must not be empty.");
        contains(blankEmail, "No leads yet.");
        contains(run("oops\n0\n3\n"), "Invalid option.");
        contains(run(" 1 \n Alice \n alice@example.com \n 80 \n2\n3\n"), "Priority: HOT");

        String recovery = run("1\nAlice\nalice@example.com\nwrong\n"
                + "1\nBob\nbob@example.com\n100\n2\n3\n");
        contains(recovery, "Invalid lead:");
        contains(recovery, "Lead 1\nName: Bob");
        excludes(recovery, "Lead 2");
        contains(run(""), "Input ended. Goodbye.");
        for (String partial : new String[] {"1\n", "1\nAlice\n", "1\nAlice\nalice@example.com\n"}) {
            String result = run(partial);
            contains(result, "Input ended. Lead was not added.");
            excludes(result, "Lead added successfully.");
        }
        contains(run("3\n"), "Goodbye.");
        System.out.println("Java tests passed: " + checks + " checks.");
    }

    private static String run(String input) {
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        try (Scanner scanner = new Scanner(input);
             PrintStream output = new PrintStream(bytes, true, StandardCharsets.UTF_8)) {
            new LeadTracker(scanner, output).run();
        }
        return bytes.toString(StandardCharsets.UTF_8).replace("\r\n", "\n");
    }

    private static void equal(Object actual, Object expected) {
        checks++;
        if (!expected.equals(actual)) {
            throw new AssertionError("Expected " + expected + ", got " + actual);
        }
    }

    private static void contains(String output, String expected) {
        checks++;
        if (!output.contains(expected)) {
            throw new AssertionError("Expected output to contain: " + expected + "\n" + output);
        }
    }

    private static void excludes(String output, String unexpected) {
        checks++;
        if (output.contains(unexpected)) {
            throw new AssertionError("Unexpected output: " + unexpected + "\n" + output);
        }
    }

    private static void rejects(Runnable operation, String message) {
        checks++;
        try {
            operation.run();
        } catch (IllegalArgumentException exception) {
            if (!message.equals(exception.getMessage())) {
                throw new AssertionError("Unexpected validation message: " + exception.getMessage());
            }
            return;
        }
        throw new AssertionError("Expected invalid input to be rejected.");
    }
}
