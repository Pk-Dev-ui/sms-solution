import { graphClient } from "./graphClient";
import { withGraphRetry } from "./retryPolicy";

export interface StakeholderGroup {
  groupId: string;
  groupName: string;
  members: string[];
  primaryNotificationEmails: string[];
  escalationEmails: string[];
  defaultReminderTemplate?: string;
  active: boolean;
}

const SITE_ID = process.env.SHAREPOINT_SITE_ID!;
const STAKEHOLDER_GROUP_LIST_ID = process.env.STAKEHOLDER_GROUP_LIST_ID!;

export async function getStakeholderGroups(token: string): Promise<StakeholderGroup[]> {
  if (!token) throw new Error("Missing Microsoft Graph token for stakeholder group lookup");
  const client = graphClient(token);
  const response = await withGraphRetry(() => client.api(`/sites/${SITE_ID}/lists/${STAKEHOLDER_GROUP_LIST_ID}/items?expand=fields`).get());
  return response.value.map((item: any) => ({
    groupId: item.fields.GroupId || item.id,
    groupName: item.fields.GroupName,
    members: parseListValue(item.fields.Members),
    primaryNotificationEmails: parseListValue(item.fields.PrimaryNotificationEmails),
    escalationEmails: parseListValue(item.fields.EscalationEmails),
    defaultReminderTemplate: item.fields.DefaultReminderTemplate,
    active: item.fields.Active === true || item.fields.Active === "true"
  }));
}

export async function saveStakeholderGroup(token: string, group: StakeholderGroup): Promise<StakeholderGroup> {
  if (!token) throw new Error("Missing Microsoft Graph token for stakeholder group save");
  const client = graphClient(token);
  const existing = await findGroupItem(client, group.groupId);
  const fields = {
    GroupId: group.groupId,
    GroupName: group.groupName,
    Members: group.members.join(";"),
    PrimaryNotificationEmails: group.primaryNotificationEmails.join(";"),
    EscalationEmails: group.escalationEmails.join(";"),
    DefaultReminderTemplate: group.defaultReminderTemplate || "",
    Active: group.active
  };
  if (existing) {
    await withGraphRetry(() => client.api(`/sites/${SITE_ID}/lists/${STAKEHOLDER_GROUP_LIST_ID}/items/${existing.id}/fields`).patch(fields));
  } else {
    await withGraphRetry(() => client.api(`/sites/${SITE_ID}/lists/${STAKEHOLDER_GROUP_LIST_ID}/items`).post({ fields }));
  }
  return group;
}

export async function resolveGroupEmails(token: string, resource: string): Promise<string[]> {
  const groups = await getStakeholderGroups(token);
  const group = groups.find(g => g.groupName === resource && g.active);
  return group ? [...group.primaryNotificationEmails, ...group.escalationEmails] : [];
}

async function findGroupItem(client: any, groupId: string) {
  const response = await withGraphRetry(() => client.api(`/sites/${SITE_ID}/lists/${STAKEHOLDER_GROUP_LIST_ID}/items?expand=fields`).get());
  return response.value.find((item: any) => item.fields.GroupId === groupId);
}

function parseListValue(value: string | string[] | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.split(";").map(v => v.trim()).filter(Boolean);
}
