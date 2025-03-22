import { Suspense, lazy, useEffect } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

// Lazy load auth components for better performance
const LoginPage = lazy(() => import("./components/auth/LoginPage"));
const RegisterPage = lazy(() => import("./components/auth/RegisterPage"));

function App() {
  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem("idms_token");
    console.log("Authentication check - token exists:", !!token);
    return token !== null;
  };

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const authenticated = isAuthenticated();
    console.log("Protected route - authenticated:", authenticated);
    if (!authenticated) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  // Log authentication status on app load
  useEffect(() => {
    console.log("App loaded, authentication status:", isAuthenticated());
  }, []);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      }
    >
      <>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Add a catch-all route that redirects to home */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
