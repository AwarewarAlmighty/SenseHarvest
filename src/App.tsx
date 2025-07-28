import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import Login from "./pages/login";
import { AuthProvider, useAuth } from "./context/AuthContext";

/**
 * ProtectedRoute Component
 * This component acts as a guard for routes that require authentication.
 * If the user is not authenticated, it redirects them to the login page.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth(); // Get authentication status from context

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page.
    // 'replace' prop ensures the login page replaces the current entry in history.
    return <Navigate to="/login" replace />;
  }
  // If authenticated, render the children (the protected component, e.g., Home)
  return <>{children}</>;
};

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {/*
        Wrap your entire application's routes with AuthProvider.
        This makes the authentication state and functions available to all components
        within the <Routes> tree.
      */}
      <AuthProvider>
        <Routes>
          {/*
            Public Route: Login Page
            This route is accessible to everyone, whether logged in or not.
            It's where users will go to authenticate.
          */}
          <Route path="/login" element={<Login />} />

          {/*
            Protected Route: Home Page (Dashboard)
            This route is wrapped by ProtectedRoute.
            Only authenticated users can access the Home component.
          */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/*
            Your existing dynamic routes from 'tempo-routes'.
            You need to decide if these should also be protected or public.
            If they should be protected, wrap useRoutes(routes) within ProtectedRoute.
            Example (if protected):
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="*" element={<ProtectedRoute>{useRoutes(routes)}</ProtectedRoute>} />
            )}
            Or just keep it as is if they are intended to be public, or if tempo-routes handles its own auth.
          */}
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </Routes>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
