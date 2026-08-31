import { useState } from "react";
import type { IPublicClientApplication, AccountInfo } from "@azure/msal-browser";
import { updateTask } from "../services/apiClient";

export default function TaskEditForm({ task, instance, account, onClose }: { task: any; instance: IPublicClientApplication; account: AccountInfo | null; onClose: () => void }) {
  const [form, setForm] = useState(task);
  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  async function save() {
    await updateTask(instance, account, form.TaskID, form);
    onClose();
  }

  return (
    <aside className="editPanel">
      <h2>Edit Task</h2>
      <label>Task ID<input value={form.TaskID} disabled /></label>
      <label>Task Name<input value={form.TaskName} onChange={e => set("TaskName", e.target.value)} /></label>
      <label>Resource<input value={form.Resource} onChange={e => set("Resource", e.target.value)} /></label>
      <label>Start Date<input type="date" value={form.StartDate} onChange={e => set("StartDate", e.target.value)} /></label>
      <label>Finish Date<input type="date" value={form.FinishDate} onChange={e => set("FinishDate", e.target.value)} /></label>
      <label>Duration<input value={form.Duration} onChange={e => set("Duration", e.target.value)} /></label>
      <label>Percent Complete<input type="number" min="0" max="100" value={form.PercentComplete || 0} onChange={e => set("PercentComplete", e.target.value)} /></label>
      <progress value={Number(form.PercentComplete || 0)} max="100" aria-label="Task percent complete" />
      <label>Notes<textarea value={form.Notes} onChange={e => set("Notes", e.target.value)} /></label>
      <label>Risk / Issue<select value={form.RiskIssue} onChange={e => set("RiskIssue", e.target.value)}><option>None</option><option>Risk</option><option>Issue</option></select></label>
      <button onClick={save}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </aside>
  );
}
