// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Define the shape of the user data stored in the JWT payload
interface DecodedToken {
  userId: string;
  username: string;
  email: string;
  role?: string;
  exp: number;
  iat: number;
}

// Define the shape of our authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  user: DecodedToken | null;
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
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // <--- New: Initial loading state
  const navigate = useNavigate();

  // Function to handle login
  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    const decodedUser = jwtDecode<DecodedToken>(token);
    setUser(decodedUser);
    setIsAuthenticated(true);
    // setIsLoading(false); // No need to set here, as this happens on explicit login action
    navigate("/");
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
      try {
        const decodedUser = jwtDecode<DecodedToken>(token);
        if (decodedUser.exp * 1000 < Date.now()) {
          console.log("JWT expired. Logging out.");
          logout(); // This will also set isLoading to false
        } else {
          setUser(decodedUser);
          setIsAuthenticated(true);
          console.log("User re-authenticated from localStorage.");
          setIsLoading(false); // <--- New: Set to false only when valid token is found
        }
      } catch (error) {
        console.error("Failed to decode token or token is invalid:", error);
        logout(); // This will also set isLoading to false
      }
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
