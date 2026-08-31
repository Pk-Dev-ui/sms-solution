import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { readScheduleTasks } from "../../shared/scheduleWorkbookService";
import { sendReminderEmail } from "../../shared/emailService";
import { getBearerToken, getUserContext, requireRole } from "../../shared/authMiddleware";
import { writeAuditEvent } from "../../shared/auditService";
import { trackException, alertAdministrators } from "../../shared/telemetryService";
import { resolveGroupEmails } from "../../shared/stakeholderGroupService";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const token = getBearerToken(req);
    const user = getUserContext(req);
    requireRole(user, ["SMS Administrator", "Schedule Manager"]);
    const tasks = await readScheduleTasks(token);
    const targetTaskId = req.body?.taskId;
    const targetTasks = targetTaskId ? tasks.filter((t: any) => t.TaskID === targetTaskId) : tasks.filter((t: any) => t.Status !== "Closed");
    let sent = 0;
    for (const task of targetTasks) {
      const recipients = await resolveRecipients(token, task.Resource);
      if (!recipients.length) {
        await alertAdministrators("SMS reminder skipped because no recipients were configured", { taskId: task.TaskID, resource: task.Resource });
        continue;
      }
      await sendReminderEmail(token, recipients, task);
      sent++;
      await writeAuditEvent({ eventType: "ReminderSent", taskId: task.TaskID, userEmail: user.email, newValue: { recipients }, result: "Sent", source: "ManualOrScheduledReminder" });
    }
    context.res = { status: 200, body: { sent, evaluated: targetTasks.length } };
  } catch (error: any) {
    trackException(error, { functionName: "SendReminderEmails" });
    context.res = { status: error.statusCode || 500, body: { error: error.message } };
  }
};

async function resolveRecipients(token: string, resource: string) {
  return resolveGroupEmails(token, resource);
}

export default httpTrigger;
