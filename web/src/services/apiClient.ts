import axios from 'axios';
import type { IPublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { loginRequest } from '../authConfig';

const API_BASE = import.meta.env.VITE_SMS_API_BASE;

async function authHeader(instance: IPublicClientApplication, account: AccountInfo | null) {
  if (!account) throw new Error('No active account');
  const token = await instance.acquireTokenSilent({ ...loginRequest, account });
  return { Authorization: `Bearer ${token.accessToken}` };
}

export async function getTasks(instance: IPublicClientApplication, account: AccountInfo | null) {
  const response = await axios.get(`${API_BASE}/api/tasks`, { headers: await authHeader(instance, account) });
  return response.data;
}

export async function updateTask(instance: IPublicClientApplication, account: AccountInfo | null, taskId: string, payload: any) {
  const response = await axios.patch(`${API_BASE}/api/tasks/${taskId}`, payload, { headers: await authHeader(instance, account) });
  return response.data;
}

export async function sendManualReminder(instance: IPublicClientApplication, account: AccountInfo | null, taskId: string) {
  const response = await axios.post(`${API_BASE}/api/reminders/send`, { taskId, mode: 'manual' }, { headers: await authHeader(instance, account) });
  return response.data;
}
