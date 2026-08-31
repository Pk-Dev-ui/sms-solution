import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { getTasks, sendManualReminder } from "../services/apiClient";
import TaskEditForm from "./TaskEditForm";

export default function TaskDashboard() {
  const { instance, accounts } = useMsal();
  const account = instance.getActiveAccount() || accounts[0] || null;
  const [tasks, setTasks] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => { if (account) getTasks(instance, account).then(setTasks); }, [instance, account]);

  return (
    <main className="dashboard">
      <header><h1>SMS Task Dashboard</h1></header>
      <table>
        <thead><tr><th>Task</th><th>Resource</th><th>Start</th><th>Finish</th><th>Percent Complete</th><th>Risk / Issue</th><th>Actions</th></tr></thead>
        <tbody>{tasks.map(t => (
          <tr key={t.TaskID}>
            <td>{t.TaskName}</td><td>{t.Resource}</td><td>{t.StartDate}</td><td>{t.FinishDate}</td>
            <td><progress value={Number(t.PercentComplete || 0)} max="100" aria-label={`Percent complete for ${t.TaskName}`} /> {Number(t.PercentComplete || 0)}%</td>
            <td>{t.RiskIssue}</td>
            <td><button onClick={() => setSelected(t)}>Edit</button><button onClick={() => sendManualReminder(instance, account, t.TaskID)}>Send Email</button></td>
          </tr>
        ))}</tbody>
      </table>
      {selected && <TaskEditForm task={selected} instance={instance} account={account} onClose={() => setSelected(null)} />}
    </main>
  );
}
