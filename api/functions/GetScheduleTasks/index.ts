import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { readScheduleTasks } from "../../shared/scheduleWorkbookService";
import { getBearerToken, getUserContext, requireRole } from "../../shared/authMiddleware";
import { trackException } from "../../shared/telemetryService";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const token = getBearerToken(req);
    const user = getUserContext(req);
    requireRole(user, ["SMS Administrator", "Schedule Manager", "Stakeholder", "Read-Only Viewer"]);
    const tasks = await readScheduleTasks(token);
    context.res = { status: 200, body: tasks };
  } catch (error: any) {
    trackException(error, { functionName: "GetScheduleTasks" });
    context.res = { status: error.statusCode || 500, body: { error: error.message } };
  }
};

export default httpTrigger;
