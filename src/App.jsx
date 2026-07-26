import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/Shared/ProtectedRoute.jsx";
import Loader from "./components/Shared/Loader.jsx";

// Route-level code splitting: the public letter page (framer-motion,
// canvas-confetti, envelope/letter animations) and the admin dashboard
// (all the manager forms) are large and mutually exclusive — a visitor
// on "/" never needs the admin bundle, and vice versa. Without this,
// both HTML entry points shipped the exact same ~760kB bundle.
const ProposalPage = lazy(() => import("./pages/Proposal/ProposalPage.jsx"));
const AdminMainPage = lazy(() => import("./pages/Admin/AdminMainPage.jsx"));
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard.jsx"));

export default function App() {
  return (
    <Suspense fallback={<Loader label="Warming the wax seal…" />}>
      <Routes>
        <Route path="/" element={<ProposalPage />} />
        {/* /admin is now a 3s themed splash (like the OTA app's MainPage)
            that routes on to /admin/login or /admin/dashboard once we
            know whether someone's signed in. AdminLogin also sends people
            back through here after a successful sign-in. */}
        <Route path="/admin" element={<AdminMainPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<ProposalPage />} />
      </Routes>
    </Suspense>
  );
}
