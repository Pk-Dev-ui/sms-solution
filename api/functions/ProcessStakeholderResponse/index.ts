import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { updateScheduleTask } from "../../shared/scheduleWorkbookService";
import { getBearerToken, getUserContext, requireRole } from "../../shared/authMiddleware";
import { stakeholderResponseSchema } from "../../shared/validationSchemas";
import { trackException } from "../../shared/telemetryService";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const token = getBearerToken(req);
    const user = getUserContext(req);
    requireRole(user, ["SMS Administrator", "Schedule Manager", "Stakeholder"]);
    const response = stakeholderResponseSchema.parse(req.body);
    const updatedTask = { TaskID: response.taskId, StartDate: response.proposedStartDate, FinishDate: response.proposedFinishDate, Duration: response.proposedDuration, PercentComplete: response.proposedPercentComplete, Notes: response.notes, RiskIssue: response.riskIssue, Status: "Stakeholder Updated", ExpectedLastUpdatedDate: req.body.ExpectedLastUpdatedDate };
    const result = await updateScheduleTask(token, response.taskId, updatedTask, user);
    context.res = { status: 200, body: result };
  } catch (error: any) {
    trackException(error, { functionName: "ProcessStakeholderResponse" });
    context.res = { status: error.statusCode || 400, body: { error: error.message } };
  }
};

export default httpTrigger;
