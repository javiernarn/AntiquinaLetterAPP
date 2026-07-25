import { Routes, Route } from "react-router-dom";
import ProposalPage from "./pages/Proposal/ProposalPage.jsx";
import AdminLogin from "./pages/Admin/AdminLogin.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import ProtectedRoute from "./components/Shared/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ProposalPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<ProposalPage />} />
    </Routes>
  );
}
