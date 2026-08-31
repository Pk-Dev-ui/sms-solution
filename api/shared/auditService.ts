import { trackEvent } from "./telemetryService";

export async function writeAuditEvent(event: { eventType: string; taskId?: string; userEmail: string; oldValue?: any; newValue?: any; result: string; source: string; }) {
  const audit = { ...event, timestamp: new Date().toISOString() };
  trackEvent("SmsAuditEvent", audit);
  // Production: persist audit to Dataverse, SharePoint List, Azure Table, or Log Analytics with immutable retention policy.
  return audit;
}
