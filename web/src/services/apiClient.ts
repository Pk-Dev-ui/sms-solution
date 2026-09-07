
const API_BASE = import.meta.env.VITE_API_BASE;

// Fetch all tasks
export async function getTasks() {
  const res = await fetch(`${API_BASE}/api/tasks`);
  if (!res.ok) {
    throw new Error(`Failed to fetch tasks: ${res.status}`);
  }
  return res.json();
}

// Update a specific task
export async function updateTask(id: string, data: any) {
  const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error(`Failed to update task ${id}: ${res.status}`);
  }

  return res.json();
}

// Fetch audit history
export async function getAudit() {
  const res = await fetch(`${API_BASE}/api/audit`);
  if (!res.ok) {
    throw new Error(`Failed to fetch audit log: ${res.status}`);
  }
  return res.json();
}

// Fetch stakeholder list
export async function getStakeholders() {
  const res = await fetch(`${API_BASE}/api/stakeholders`);
  if (!res.ok) {
    throw new Error(`Failed to fetch stakeholders: ${res.status}`);
  }
  return res.json();
}

export async function sendManualReminder(instance: any, account: any, taskId: string) {
  const token = await instance.acquireTokenSilent({
    scopes: ["api://sms-solution/.default"],
    account
  });

  const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/reminder/${taskId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.accessToken}`
    }
  });

  if (!res.ok) throw new Error("Failed to send reminder");
  return res.json();
}


