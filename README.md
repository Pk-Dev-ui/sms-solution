# Schedule Management System (SMS)

SMS is an enterprise schedule reminder and stakeholder update application implemented as a TypeScript monorepo with separate web and api workspaces.

## Repository Structure
- web: React + Vite front end
- api: Azure Functions API
- infrastructure: Bicep deployment assets
- tests: unit, integration, and UAT assets

## Build
1. Register the SMS front-end and API applications in Microsoft Entra ID.
2. Configure local, test, and production redirect URIs.
3. Create the protected SharePoint workbook table named ScheduleTasks.
4. Configure web/.env and api/local.settings.json for local development.
5. Run npm install from the repository root.
6. Run npm run typecheck, npm run lint, npm run test, and npm run build from the repository root.
7. Run npm run dev:web for the React app and npm run dev:api for the Azure Functions API.

## Required Microsoft Graph Permissions
- User.Read
- Files.ReadWrite or approved least-privilege equivalent
- Mail.Send

## Production Notes
Use managed identity or a secure token acquisition pattern for automation. Store production secrets in Azure Key Vault or approved secure configuration. Deploy the compiled web and API outputs separately through CI/CD.
