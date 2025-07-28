// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Define the shape of our authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check for a token in localStorage on initial load
    return localStorage.getItem("authToken") ? true : false;
  });
  const navigate = useNavigate();

  // Function to handle login
  const login = (token: string) => {
    localStorage.setItem("authToken", token); // Store the token
    setIsAuthenticated(true);
    navigate("/"); // Redirect to home after login
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem("authToken"); // Remove the token
    setIsAuthenticated(false);
    navigate("/login"); // Redirect to login after logout
  };

  // Provide the context value to children
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
