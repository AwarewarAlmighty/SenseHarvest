import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";

import Home from "./components/home";
import Login from "./pages/login";
import Register from "./pages/register";

import { AuthProvider, useAuth } from "./context/AuthContext";

import routes from "tempo-routes";

/**
 * ProtectedRoute Component
 * Guards routes that require authentication.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth(); // <--- Get isLoading from useAuth()

  // <--- IMPORTANT: Add this check
  if (isLoading) {
    return <p>Loading authentication...</p>; // Or a spinner component
  }

  if (!isAuthenticated) {
    // If not authenticated and loading is complete, redirect to the login page.
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {/* Wrap your entire application's routes with AuthProvider */}
      <AuthProvider>
        <Routes>
          {/* Public Route: Login Page */}
          <Route path="/login" element={<Login />} />

          {/* New Public Route: Register Page */}
          <Route path="/register" element={<Register />} />

          {/* Protected Route: Home Page (Dashboard) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Dynamic routes from 'tempo-routes'. Decide if these need protection. */}
          {/* If they should be protected:
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="*" element={<ProtectedRoute>{useRoutes(routes)}</ProtectedRoute>} />
          )}
          Otherwise, keep as is: */}
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </Routes>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
