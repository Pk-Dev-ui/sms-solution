import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { updateScheduleTask } from "../../shared/scheduleWorkbookService";
import { getBearerToken, getUserContext, requireRole } from "../../shared/authMiddleware";
import { taskUpdateSchema } from "../../shared/validationSchemas";
import { trackException } from "../../shared/telemetryService";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const token = getBearerToken(req);
    const user = getUserContext(req);
    requireRole(user, ["SMS Administrator", "Schedule Manager"]);
    const taskId = context.bindingData.taskId;
    const payload = taskUpdateSchema.parse({ ...req.body, TaskID: taskId });
    const result = await updateScheduleTask(token, taskId, payload, user);
    context.res = { status: 200, body: result };
  } catch (error: any) {
    trackException(error, { functionName: "UpdateScheduleTask" });
    context.res = { status: error.statusCode || 400, body: { error: error.message } };
  }
};

export default httpTrigger;
