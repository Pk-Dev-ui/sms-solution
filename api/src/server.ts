import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, "data");

// Helper to load JSON
function loadJson(file: string) {
  const filePath = path.join(dataDir, file);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Helper to save JSON
function saveJson(file: string, data: any) {
  const filePath = path.join(dataDir, file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// GET all tasks
app.get("/api/tasks", (req, res) => {
  const tasks = loadJson("schedule.json");
  res.json(tasks);
});

// Update a task
app.put("/api/tasks/:id", (req, res) => {
  const id = req.params.id;
  const tasks = loadJson("schedule.json");

  const index = tasks.findIndex((t: any) => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Task not found" });

  tasks[index] = { ...tasks[index], ...req.body };
  saveJson("schedule.json", tasks);

  // Add audit entry
  const audit = loadJson("audit.json");
  audit.push({
    id,
    timestamp: new Date().toISOString(),
    change: req.body
  });
  saveJson("audit.json", audit);

  res.json({ success: true });
});

// GET audit log
app.get("/api/audit", (req, res) => {
  const audit = loadJson("audit.json");
  res.json(audit);
});

// GET stakeholder groups
app.get("/api/stakeholders", (req, res) => {
  const groups = loadJson("stakeholderGroups.json");
  res.json(groups);
});

// Render requires listening on process.env.PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
