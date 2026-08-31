import { describe, expect, it } from "vitest";
import { sendReminderEmail } from "../../api/shared/emailService";

describe("Email reminder integration", () => {
  it("sends a reminder email through Microsoft Graph", async () => {
    const token = process.env.GRAPH_TEST_ACCESS_TOKEN;
    const recipient = process.env.TEST_REMINDER_RECIPIENT;

    if (!token) {
      throw new Error("GRAPH_TEST_ACCESS_TOKEN is required for email reminder integration tests");
    }

    if (!recipient) {
      throw new Error("TEST_REMINDER_RECIPIENT is required for email reminder integration tests");
    }

    const task = {
      TaskID: "TEST-001",
      TaskName: "Integration Test Reminder",
      FinishDate: "2026-09-15",
      PercentComplete: 50,
      Notes: "This is an integration test reminder."
    };

    const result = await sendReminderEmail(token, [recipient], task);

    expect(result.sent).toBe(true);
    expect(result.recipients).toBe(1);
  });
});
