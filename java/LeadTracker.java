import java.io.PrintStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public final class LeadTracker {
    private final List<Lead> leads = new ArrayList<>();
    private final Scanner input;
    private final PrintStream output;

    LeadTracker(Scanner input, PrintStream output) {
        this.input = input;
        this.output = output;
    }

    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            new LeadTracker(input, System.out).run();
        }
    }

    public void run() {
        output.println("Simple Lead Tracker");
        while (true) {
            output.println("\n1. Add a lead\n2. View all leads\n3. Exit");
            String choice = readLine("Choose an option: ");
            if (choice == null) {
                output.println("Input ended. Goodbye.");
                return;
            }

            switch (choice.strip()) {
                case "1":
                    if (!addLead()) {
                        output.println("Input ended. Lead was not added. Goodbye.");
                        return;
                    }
                    break;
                case "2":
                    viewLeads();
                    break;
                case "3":
                    output.println("Goodbye.");
                    return;
                default:
                    output.println("Invalid option. Please enter 1, 2 or 3.");
            }
        }
    }

    private String readLine(String prompt) {
        output.print(prompt);
        if (!input.hasNextLine()) {
            output.println();
            return null;
        }
        return input.nextLine();
    }

    private boolean addLead() {
        String name = readLine("Name: ");
        if (name == null) {
            return false;
        }
        String email = readLine("Email: ");
        if (email == null) {
            return false;
        }
        String scoreInput = readLine("Score (0-100): ");
        if (scoreInput == null) {
            return false;
        }

        try {
            int score = Integer.parseInt(scoreInput.strip());
            Lead lead = new Lead(name, email, score);
            leads.add(lead);
            output.println("Lead added successfully.");
        } catch (NumberFormatException exception) {
            output.println("Invalid lead: Score must be a whole number between 0 and 100.");
        } catch (IllegalArgumentException exception) {
            output.println("Invalid lead: " + exception.getMessage());
        }
        return true;
    }

    private void viewLeads() {
        if (leads.isEmpty()) {
            output.println("No leads yet. Choose option 1 to add your first lead.");
            return;
        }
        for (int index = 0; index < leads.size(); index++) {
            Lead lead = leads.get(index);
            output.printf("%nLead %d%nName: %s%nEmail: %s%nScore: %d%nPriority: %s%n",
                    index + 1, lead.getName(), lead.getEmail(),
                    lead.getScore(), lead.calculatePriority());
        }
    }
}
