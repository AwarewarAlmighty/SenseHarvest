// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Define the shape of the user data
interface User {
  _id: string;
  email: string;
}

// Define the shape of our authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean; // <--- New: Add isLoading to the context type
}

// Create the context with a default (null) value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // <--- New: Initial loading state
  const navigate = useNavigate();

  // Function to handle login
  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    // Fetch user data from the /me endpoint
    fetch("http://localhost:3000/api/auth/me", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => {
        setUser(data);
        setIsAuthenticated(true);
        navigate("/");
    })
    .catch(err => {
        console.error("Failed to fetch user data:", err);
        logout();
    });
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUser(null);
    setIsLoading(false); // <--- New: Ensure loading is false after logout
    navigate("/login");
  };

  // useEffect to check for existing token on component mount (page reload)
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
        login(token);
    } else {
      // No token found, so not authenticated, and loading is complete
      setIsLoading(false); // <--- New: Set to false if no token
    }
  }, []);

  // Provide the context value to children
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, isLoading }}
    >
      {" "}
      {/* <--- New: Include isLoading */}
      {children}
    </AuthContext.Provider>
  );
};
