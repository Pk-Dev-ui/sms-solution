import { describe, expect, it } from "vitest";
import { taskUpdateSchema } from "../../api/shared/validationSchemas";

describe("taskUpdateSchema", () => {
  it("rejects finish dates before start dates", () => {
    expect(() => taskUpdateSchema.parse({ TaskID: "T1", StartDate: "2026-08-10", FinishDate: "2026-08-01" })).toThrow();
  });
  it("allows approved risk issue values", () => {
    const parsed = taskUpdateSchema.parse({ TaskID: "T1", RiskIssue: "Risk" });
    expect(parsed.RiskIssue).toBe("Risk");
  });
  it("accepts percent complete values from 0 to 100", () => {
    expect(taskUpdateSchema.parse({ TaskID: "T1", PercentComplete: 65 }).PercentComplete).toBe(65);
  });
  it("rejects percent complete values outside 0 to 100", () => {
    expect(() => taskUpdateSchema.parse({ TaskID: "T1", PercentComplete: 101 })).toThrow();
  });
});
