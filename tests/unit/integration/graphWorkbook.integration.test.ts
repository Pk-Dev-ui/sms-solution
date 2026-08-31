import { describe, expect, it } from "vitest";
import { readScheduleTasks } from "../../api/shared/scheduleWorkbookService";

describe("Graph workbook integration", () => {
  it("reads schedule tasks from the configured SharePoint workbook table", async () => {
    const token = process.env.GRAPH_TEST_ACCESS_TOKEN;

    if (!token) {
      throw new Error("GRAPH_TEST_ACCESS_TOKEN is required for workbook integration tests");
    }

    const tasks = await readScheduleTasks(token);

    expect(Array.isArray(tasks)).toBe(true);

    if (tasks.length > 0) {
      expect(tasks[0]).toHaveProperty("TaskID");
      expect(tasks[0]).toHaveProperty("TaskName");
      expect(tasks[0]).toHaveProperty("StartDate");
      expect(tasks[0]).toHaveProperty("FinishDate");
      expect(tasks[0]).toHaveProperty("PercentComplete");
      expect(tasks[0]).toHaveProperty("Resource");
    }
  });
});
