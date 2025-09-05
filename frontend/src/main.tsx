import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./index.css";
import Login from "./pages/Login";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";

const qc = new QueryClient();

function Protected({ children }: { children: React.ReactNode }) {
  const { loading, backendUser } = useAuth();
  if (loading) return <div className="p-6">Loading…</div>;
  if (!backendUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <Protected>
            <Groups />
          </Protected>
        }
      />
      <Route
        path="/groups/:id"
        element={
          <Protected>
            <GroupDetail />
          </Protected>
        }
      />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
