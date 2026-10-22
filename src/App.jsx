import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Starfield from "./components/Starfield";
import Landing from "./pages/Landing";
import ToolsDirectory from "./pages/ToolsDirectory";
import ToolDetail from "./pages/ToolDetail";
import Compare from "./pages/Compare";
import Quiz from "./pages/Quiz";
import Workflows from "./pages/Workflows";
import Dashboard from "./pages/Dashboard";
import News from "./pages/News";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import AdminPanel from "./pages/AdminPanel";
import { AdminRoute, ProtectedRoute, PublicOnlyRoute } from "./components/ProtectedRoute";

export default function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen">
      <Starfield />
      {!isAdminPage && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<PublicOnlyRoute><AuthPage mode="login" /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><AuthPage mode="register" /></PublicOnlyRoute>} />
          <Route path="/tools" element={<ToolsDirectory />} />
          <Route path="/tools/:slug" element={<ToolDetail />} />
          <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/workflows" element={<ProtectedRoute><Workflows /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/bookmarks" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/workflow" element={<ProtectedRoute><Workflows /></ProtectedRoute>} />
          <Route path="/admin/login" element={<AuthPage mode="admin" />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/admin/tools" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}
