import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context and Hooks
import { useAuth } from "./context/AuthContext";

// Core Components
import Sidebar from "./components/Sidebar";
import { Spinner } from "./components/ui/Spinner";
import RFIDToastListener from "./components/RFIDToastListener.js";

// Page Components
import Dashboard from "./components/Dashboard";
import Inventory from "./pages/Inventory";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Login from "./pages/login";
import Register from "./pages/register";
import EmployeeLog from "./pages/EmployeeLog";
import AdminApproval from "./pages/AdminApproval";
import Employees from "./pages/Employees"; // Added from second snippet

/**
 * A helper component to protect routes that require authentication.
 * It checks the authentication status and displays a loading spinner
 * while the status is being determined. If the user is not authenticated,
 * it redirects them to the login page.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render if authenticated.
 * @returns {JSX.Element} The protected route or a redirect.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

/**
 * The main application component. It sets up the overall layout and routing.
 * @returns {JSX.Element} The rendered App component.
 */
console.log("VITE_API_URL from Netlify build:", import.meta.env.VITE_API_URL);
function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // Display a full-screen loader while the initial authentication check is in progress.
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* The sidebar is only shown for authenticated users */}
      {isAuthenticated && <Sidebar />}

      <main className="flex-1 overflow-y-auto">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            }
          />
           <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <Employees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/EmployeesLogs"
            element={
              <ProtectedRoute>
                <EmployeeLog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-approval"
            element={
              <ProtectedRoute>
                <AdminApproval />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Global components that listen for events or display notifications */}
        <RFIDToastListener />
        <ToastContainer position="top-right" autoClose={3000} />
      </main>
    </div>
  );
}

export default App;
