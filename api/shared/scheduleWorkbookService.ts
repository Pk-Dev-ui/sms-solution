import { graphClient } from "./graphClient";
import { withGraphRetry } from "./retryPolicy";
import { writeAuditEvent } from "./auditService";
import { alertAdministrators } from "./telemetryService";

const SITE_ID = process.env.SHAREPOINT_SITE_ID!;
const DRIVE_ITEM_ID = process.env.SCHEDULE_WORKBOOK_ITEM_ID!;
const TABLE_NAME = process.env.SCHEDULE_TABLE_NAME || "ScheduleTasks";
const APPROVED_UPDATE_FIELDS = ["StartDate", "FinishDate", "Duration", "PercentComplete", "Notes", "RiskIssue", "Status", "LastUpdatedBy", "LastUpdatedDate"];

export async function readScheduleTasks(token: string) {
  const client = graphClient(token);
  const rows = await withGraphRetry(() => client.api(`/sites/${SITE_ID}/drive/items/${DRIVE_ITEM_ID}/workbook/tables/${TABLE_NAME}/rows`).get());
  return rows.value.map((row: any) => mapRow(row.values[0]));
}

export async function updateScheduleTask(token: string, taskId: string, requested: any, userContext: any) {
  validateRequest(taskId, requested, userContext);
  const approved = filterApprovedFields(requested);
  const client = graphClient(token);
  const session = await withGraphRetry(() => client.api(`/sites/${SITE_ID}/drive/items/${DRIVE_ITEM_ID}/workbook/createSession`).post({ persistChanges: true }));
  try {
    const rows = await withGraphRetry(() => client.api(`/sites/${SITE_ID}/drive/items/${DRIVE_ITEM_ID}/workbook/tables/${TABLE_NAME}/rows`).header("workbook-session-id", session.id).get());
    const index = rows.value.findIndex((r: any) => r.values[0][0] === taskId);
    if (index < 0) throw new Error("Task not found");
    const current = mapRow(rows.value[index].values[0]);
    validateConcurrency(current, requested);
    const next = { ...current, ...approved, LastUpdatedBy: userContext.email, LastUpdatedDate: new Date().toISOString() };
    await withGraphRetry(() => client.api(`/sites/${SITE_ID}/drive/items/${DRIVE_ITEM_ID}/workbook/tables/${TABLE_NAME}/rows/itemAt(index=${index})`).header("workbook-session-id", session.id).patch({ values: [toRowValues(next)] }));
    await writeAuditEvent({ eventType: "TaskUpdated", taskId, userEmail: userContext.email, oldValue: current, newValue: next, result: "Updated", source: "WorkbookUpdate" });
    return { taskId, status: "updated" };
  } catch (error: any) {
    await alertAdministrators("SMS workbook update failure", { taskId, error: error.message, source: "WorkbookUpdate" });
    throw error;
  } finally {
    await withGraphRetry(() => client.api(`/sites/${SITE_ID}/drive/items/${DRIVE_ITEM_ID}/workbook/closeSession`).header("workbook-session-id", session.id).post({}));
  }
}

function filterApprovedFields(input: any) {
  return Object.fromEntries(Object.entries(input).filter(([key]) => APPROVED_UPDATE_FIELDS.includes(key)));
}

function validateRequest(taskId: string, input: any, userContext: any) {
  if (!taskId) throw new Error("Missing task ID");
  if (!userContext?.email) throw new Error("Missing user context");
  if (input.FinishDate && input.StartDate && new Date(input.FinishDate) < new Date(input.StartDate)) throw new Error("Finish date cannot be before start date");
  if (input.PercentComplete !== undefined) { const pc = Number(input.PercentComplete); if (!Number.isFinite(pc) || pc < 0 || pc > 100) throw new Error("Percent complete must be between 0 and 100"); }
}

function validateConcurrency(current: any, requested: any) {
  if (requested.ExpectedLastUpdatedDate && requested.ExpectedLastUpdatedDate !== current.LastUpdatedDate) throw new Error("Conflict detected: task changed since user viewed it");
}

function mapRow(v: any[]) {
  return { TaskID: v[0], TaskName: v[1], StartDate: v[2], FinishDate: v[3], Duration: v[4], PercentComplete: v[5], Resource: v[6], Notes: v[7], RiskIssue: v[8], Status: v[9], LastUpdatedBy: v[10], LastUpdatedDate: v[11] };
}

function toRowValues(t: any) {
  return [t.TaskID, t.TaskName, t.StartDate, t.FinishDate, t.Duration, t.PercentComplete, t.Resource, t.Notes, t.RiskIssue, t.Status || "Updated", t.LastUpdatedBy, t.LastUpdatedDate];
}
