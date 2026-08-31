import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

export default function Login() {
  const { instance } = useMsal();
  return (
    <main className="loginShell">
      <header className="blueHeader"><img src="/sms-logo.png" alt="SMS logo" /><h1>Schedule Management System (SMS)</h1></header>
      <section className="loginCard" aria-label="SMS secure login">
        <h2>Secure Login</h2>
        <label>Email<input type="email" placeholder="name@company.com" autoComplete="username" /></label>
        <label>Password<input type="password" placeholder="••••••••" autoComplete="current-password" /></label>
        <label className="checkRow"><input type="checkbox" /> Remember this device</label>
        <a href="#" aria-label="Forgot password">Forgot password?</a>
        <button onClick={() => instance.loginRedirect(loginRequest)}>Sign In</button>
        <p className="mfaNote">Optional MFA: verification code or authenticator approval may be required by tenant policy.</p>
        <small>Authentication Provider: Microsoft Entra ID</small>
      </section>
      <footer>Environment: Production | Tenant: Organization Microsoft 365 Tenant | Application: SMS Enterprise Portal</footer>
    </main>
  );
}
