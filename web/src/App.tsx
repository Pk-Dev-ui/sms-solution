const LOCAL_BYPASS = false; // set to true to skip MSAL login

export default function App() {
  if (LOCAL_BYPASS) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Running in Local Bypass Mode</h2>
        <p>No MSAL login required.</p>
      </div>
    );
  }

  return <TestLogin />;
}
