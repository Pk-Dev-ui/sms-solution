import { z } from "zod";

const percentCompleteSchema = z.union([z.number(), z.string()]).transform(value => Number(value)).refine(value => Number.isFinite(value) && value >= 0 && value <= 100, { message: "Percent complete must be between 0 and 100" });

export const taskUpdateSchema = z.object({
  TaskID: z.string().min(1),
  StartDate: z.string().optional(),
  FinishDate: z.string().optional(),
  Duration: z.union([z.string(), z.number()]).optional(),
  PercentComplete: percentCompleteSchema.optional(),
  Notes: z.string().max(4000).optional(),
  RiskIssue: z.enum(["None", "Risk", "Issue"]).optional(),
  Status: z.string().optional(),
  ExpectedLastUpdatedDate: z.string().optional()
}).refine(v => !(v.StartDate && v.FinishDate) || new Date(v.FinishDate) >= new Date(v.StartDate), { message: "Finish date cannot be before start date" });

export const stakeholderResponseSchema = z.object({
  taskId: z.string().min(1),
  proposedStartDate: z.string().optional(),
  proposedFinishDate: z.string().optional(),
  proposedDuration: z.union([z.string(), z.number()]).optional(),
  proposedPercentComplete: percentCompleteSchema.optional(),
  notes: z.string().max(4000).optional(),
  riskIssue: z.enum(["None", "Risk", "Issue"]).default("None")
});
