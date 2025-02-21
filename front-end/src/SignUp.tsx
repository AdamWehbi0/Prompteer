import { useState } from "react";
import { signUp } from "./Api";

function SignUp() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  async function handleSignUp() {
    try {
      await signUp(firstName, lastName, email, password);
      alert("User Signed Up Successfully!");
      setError(null);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
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
      <button onClick={handleSignUp}>Sign Up</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default SignUp;
