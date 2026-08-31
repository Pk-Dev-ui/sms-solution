import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import Login from "./components/Login";
import TaskDashboard from "./components/TaskDashboard";

export default function App() {
  return (
    <>
      <UnauthenticatedTemplate>
        <Login />
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <TaskDashboard />
      </AuthenticatedTemplate>
    </>
  );
}
