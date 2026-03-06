import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CitizenPortal from "./pages/CitizenPortal";
import AdminDashboard from "./pages/AdminDashboard";
import PublicDashboard from "./pages/PublicDashboard";
import LoginPage from "./pages/LoginPage"; // new login page

function App() {
  // userRole: null means not logged in yet
  const [userRole, setUserRole] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Root redirects to login if not logged in */}
        <Route
          path="/"
          element={userRole ? <Navigate to={`/${userRole}`} /> : <Navigate to="/login" />}
        />

        {/* Login Page */}
        <Route path="/login" element={<LoginPage setUserRole={setUserRole} />} />

        {/* Citizen Portal */}
        <Route
          path="/citizen"
          element={userRole === "citizen" ? <CitizenPortal /> : <Navigate to="/login" />}
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={userRole === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
        />

        {/* Public Transparency Dashboard */}
        <Route path="/public" element={<PublicDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;