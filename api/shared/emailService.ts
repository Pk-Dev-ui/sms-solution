import { graphClient } from "./graphClient";
import { withGraphRetry } from "./retryPolicy";

export async function sendReminderEmail(token: string, to: string[], task: any) {
  const client = graphClient(token);
  const message = {
    subject: `SMS Task Update Required: ${task.TaskName}`,
    body: {
      contentType: "HTML",
      content: `<p>Please review and update the following SMS task.</p><p><b>Task:</b> ${task.TaskName}</p><p><b>Current Finish:</b> ${task.FinishDate}</p><p><b>Current Percent Complete:</b> ${task.PercentComplete ?? 0}%</p><p>Please confirm or update the finish date, duration, percent complete, notes, risks, and issues through the secure SMS response link.</p><p><b>Notes / Risks / Issues:</b> ${task.Notes || "None"}</p>`
    },
    toRecipients: to.map(address => ({ emailAddress: { address } }))
  };
  await withGraphRetry(() => client.api("/me/sendMail").post({ message, saveToSentItems: true }));
  return { sent: true, recipients: to.length };
}
