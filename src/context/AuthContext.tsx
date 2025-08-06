import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface User {
  _id:string;
  email: string;
  role: string;
  exp: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    setToken(token);
    try {
      const decoded: User = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        logout();
        return;
      }

      setUser(decoded);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Invalid token:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    setIsLoading(false);
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      login(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};