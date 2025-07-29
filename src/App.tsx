import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./components/home";
import Login from "./pages/login";
import Register from "./pages/register";
import React from "react";

// Helper component for protected routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};


function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // If the auth state is still loading, you can show a global spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading Application...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }

      />
    </Routes>
  );
}

export default App;