import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Fix: Ensure login request sends JSON format correctly
export async function loginUser(email: string, password: string) {
  try {
    const response = await api.post("/auth/login", {
      email,   // Ensure field names match FastAPI schema
      password,
    });

    const token = response.data.token; // Ensure the key matches backend response

    if (!token) throw new Error("Invalid response: Token missing");

    localStorage.setItem("token", token); // Store token in localStorage

    // ✅ Automatically attach token to all future requests
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Login failed");
  }
}

// ✅ Fetch protected data using stored token
export async function fetchProtectedData() {
    const token = localStorage.getItem("token");
  
    if (!token) {
      throw new Error("No token found, please log in.");
    }
  
    try {
      const response = await api.get("/protected",{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log("🔍 Full API Response:", response); // Log full response
      console.log("🔍 Response Data:", response.data); // Log only the data
  
      return response.data; // Ensure data is returned correctly
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized - Please log in again.");
      }
      throw new Error("Failed to fetch data");
    }
  }

export async function signUp(first_name: string,last_name: string, email: string, password: string){

  try{
    const response = await api.post("/auth/signup",{
      first_name,
      last_name,
      email,
      password
    });
    return response.data
  }catch(error: any){
    throw new Error(error.response?.data?.detail || "Sign Up failed");
  }
}

export async function fetchOptimizedPrompt(prompt: string): Promise<string> {
  try {
    const response = await api.post("/chat", { prompt: String(prompt) });

    if (!response.data.response) {
      throw new Error("Invalid response from AI.");
    }

    return response.data.response; // ✅ Return the optimized prompt
  } catch (error: any) {
    console.error("API Error:", error);
    return "Error: Unable to generate prompt.";
  }
}


  