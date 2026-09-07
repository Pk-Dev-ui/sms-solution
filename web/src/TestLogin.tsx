import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";

export default function TestLogin() {
  const { instance, accounts } = useMsal();

  const login = () => {
    instance.loginPopup(loginRequest).catch(console.error);
  };

  if (account) {
    instance.acquireTokenSilent(loginRequest).then(token => {
      console.log("Access Token:", token.accessToken);
    }).catch(err => {
      console.error("Silent token error:", err);
    });
  }


  const logout = () => {
    instance.logoutPopup().catch(console.error);
  };

  const account = accounts[0];

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>MSAL Local Test</h2>

      {!account && (
        <>
          <p>You are not logged in.</p>
          <button onClick={login}>Login</button>
        </>
      )}

      {account && (
        <>
          <p>Logged in as: {account.username}</p>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
}
