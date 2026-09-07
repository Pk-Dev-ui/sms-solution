const account = msalInstance.getActiveAccount() ?? null;

// If no account, skip login
if (!account) {
  console.log("Running in unauthenticated test mode");
}
