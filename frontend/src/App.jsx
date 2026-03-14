// frontend/src/App.jsx
import { useEffect } from 'react';
import { Routes, Route, Outlet, useLocation } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";

// Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import TeamPage from "./pages/TeamPage";
import SpeakersPage from "./pages/SpeakersPage";
import EventsPage from "./pages/EventsPage";

// Admin pages
import LoginPage from './pages/admin/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './layouts/AdminLayout';
import ManageEvents from './pages/admin/ManageEvents';
import AddEvent from './pages/admin/AddEvent';
import ManageApplicants from './pages/admin/ManageApplicants';

// Protected Route Component (Make sure this path is correct for your project)
import ProtectedRoute from './components/admin/ProtectedRoute';

// --- HELPER COMPONENT: Scrolls to top on route change ---
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Snaps to top instantly without smooth scrolling visual glitch
    });
  }, [pathname]);

  return null;
};

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
};

function App() {
  return (
    <>
      {/* ScrollToTop helper ensures every new page starts at the top */}
      <ScrollToTop />

      {/* Main Routing */}
      <Routes>
        
        {/* --- PUBLIC ROUTES --- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/speakers" element={<SpeakersPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/events" element={<EventsPage />} />
        </Route>

        {/* --- ADMIN LOGIN --- */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* --- PROTECTED ADMIN ROUTES --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="add-event" element={<AddEvent />} />
            <Route path="applicants" element={<ManageApplicants />} />
          </Route>
        </Route>
        
      </Routes>
    </>
  );
}

export default App;