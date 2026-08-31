import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_ENTRA_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_ENTRA_TENANT_ID}`,
    redirectUri: import.meta.env.VITE_REDIRECT_URI || window.location.origin,
    postLogoutRedirectUri: import.meta.env.VITE_REDIRECT_URI || window.location.origin
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  },
  system: {
    loggerOptions: {
      loggerCallback: (_level: LogLevel, message: string) => console.log(message),
      logLevel: LogLevel.Warning,
      piiLoggingEnabled: false
    }
  }
};

export const loginRequest = {
  scopes: ["User.Read", "Files.ReadWrite", "Mail.Send"]
};
