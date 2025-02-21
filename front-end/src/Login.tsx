import { useState } from "react";
import { loginUser, fetchProtectedData } from "./Api";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleLogin() {
    try {
      await loginUser(email, password);
      alert("Login Successful!");
      setError(null);
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleFetchProtected() {
    try {
      const data = await fetchProtectedData();
      setMessage(data.message || "No message in response");
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Protected Data</h2>
      <button onClick={handleFetchProtected}>Fetch Protected Data</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
