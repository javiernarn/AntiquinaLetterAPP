import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ProposalPage from "./pages/Proposal/ProposalPage.jsx";
import AdminLogin from "./pages/Admin/AdminLogin.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import ProtectedRoute from "./components/Shared/ProtectedRoute.jsx";

// iOS reads whatever <link rel="manifest"> is on the page at the moment
// you tap "Add to Home Screen", and uses that manifest's start_url — not
// the URL you were actually looking at. Since this is a single-page app
// with one index.html, we swap the manifest tag on route change so the
// admin pages point at a manifest whose start_url is /admin/login, while
// every other page keeps pointing at the normal manifest (start_url "/").
function useRouteManifest() {
  const location = useLocation();

  useEffect(() => {
    const link = document.querySelector('link[rel="manifest"]');
    if (!link) return;

    const isAdmin = location.pathname.startsWith("/admin");
    const href = isAdmin ? "/admin-manifest.webmanifest" : "/manifest.webmanifest";

    if (link.getAttribute("href") !== href) {
      link.setAttribute("href", href);
    }
  }, [location.pathname]);
}

export default function App() {
  useRouteManifest();

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
