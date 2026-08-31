export type SmsRole = "SMS Administrator" | "Schedule Manager" | "Stakeholder" | "Read-Only Viewer";

export interface UserContext {
  email: string;
  name?: string;
  roles: SmsRole[];
  oid?: string;
}

export function getBearerToken(req: any): string {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) throw Object.assign(new Error("Missing bearer token"), { statusCode: 401 });
  return token;
}

export function getUserContext(req: any): UserContext {
  const email = req.headers["x-ms-client-principal-name"] || req.headers["x-user-email"] || "unknown@tenant";
  const roleHeader = req.headers["x-sms-roles"] || "Stakeholder";
  return { email, roles: roleHeader.split(",").map((r: string) => r.trim()) };
}

export function requireRole(user: UserContext, allowed: SmsRole[]) {
  if (!user.roles.some(role => allowed.includes(role))) {
    throw Object.assign(new Error("Forbidden: insufficient SMS role"), { statusCode: 403 });
  }
}
