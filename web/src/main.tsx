import React from "react";
import ReactDOM from "react-dom/client";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";
import App from "./App";
import "./styles.css";

const msalInstance = new PublicClientApplication(msalConfig);

// Guarantee account is never undefined
const activeAccount = msalInstance.getActiveAccount() ?? null;

msalInstance.addEventCallback((event) => {
  if (
    event.eventType === EventType.LOGIN_SUCCESS &&
    event.payload &&
    "account" in event.payload
  ) {
    msalInstance.setActiveAccount(event.payload.account);
  }
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App instance={msalInstance} account={activeAccount} />
    </MsalProvider>
  </React.StrictMode>
);
