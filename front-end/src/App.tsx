import { useState } from "react";
import { loginUser, fetchProtectedData } from "./Api";

function App() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function handleLogin() {
    try {
      await loginUser(username, password);
      alert("Login Successful!");
      setError(null); // Clear previous errors
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleFetchProtected() {
    console.log("Fetching protected data...");
  
    try {
      const data = await fetchProtectedData();
      console.log("🔍 API Response:", data); // Log what is returned
  
      if (!data || !data.message) {
        console.warn("⚠️ API Response is missing 'message' field!", data);
      }
  
      setMessage(data.message || "No message in response"); // Handle missing message
      setError(null);
    } catch (err: any) {
      console.error("❌ Error fetching protected data:", err.message);
      setError(err.message);
    }
  }
  

  return (
    <div>
      <h1>React + FastAPI JWT Authentication</h1>

      {/* Username Input */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Password Input */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Buttons */}
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleFetchProtected}>Fetch Protected Data</button>

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Success Message */}
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
