// pages/login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Import useAuth hook

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); // Get the login function from context

  const handleSubmit = async (event) => {
    event.preventDefault();

    // In a real application, you would send these credentials to your Express.js backend
    // and receive a token (e.g., JWT) upon successful authentication.
    console.log("Attempting login with:", { username, password });

    try {
      // Example: Replace with actual API call to your Express.js backend
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password }),
      // });
      // const data = await response.json();

      // For demonstration, simulate a successful login after a short delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // If login is successful (e.g., you get a token from your backend)
      const mockToken = `mock-jwt-token-for-${username}`; // Replace with actual token from backend
      login(mockToken); // Call the login function from AuthContext
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login error (e.g., display error message to user)
      alert("Login failed. Please check your credentials."); // Use a custom modal in production!
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
              htmlFor="username"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
