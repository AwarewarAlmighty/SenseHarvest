import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Make sure this path is correct relative to login.jsx

function Login() {
  const [email, setEmail] = useState(""); // Use email as per your backend auth route
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Clear any previous errors

    try {
      // IMPORTANT: Replace 'http://localhost:1234' with your actual backend URL
      // if it's deployed or running on a different port/domain.
      const response = await fetch("http://localhost:1234/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Send email and password to backend
      });

      const data = await response.json(); // Parse the JSON response from the backend

      if (response.ok) {
        // Check if the HTTP status code is in the 200-299 range
        login(data.token); // Call login function from AuthContext with the received JWT
        // The AuthContext's login function will handle the redirection to the home page ('/')
      } else {
        // If backend returns an error (e.g., 401 Unauthorized), display its message
        setError(
          data.message || "Login failed. Please check your credentials."
        );
        console.error("Login error from backend:", data.message);
      }
    } catch (err) {
      // Catch network errors or other issues during the fetch operation
      setError(
        "Could not connect to the server. Please check your network connection and server status."
      );
      console.error("Network or fetch error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full"
            >
              Sign In
            </button>
          </div>
        </form>
        {/* Optional: Add a link to a registration page if you create one */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
