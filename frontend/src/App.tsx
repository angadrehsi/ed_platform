import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/Authcon";
import Landing from "./pages/landing";
import Auth from "./pages/auth";
import Dashboard from "./pages/Dashboard";
import Lesson from "./pages/lessons";
import About from "./pages/About";
import Terms from "./pages/Terms"
import Home from "./pages/home.tsx";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/about" element={<About />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/lessons/:id" element={
        <ProtectedRoute><Lesson /></ProtectedRoute>
      } />
    </Routes>
  );
}