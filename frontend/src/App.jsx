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

//admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './layouts/AdminLayout';
import ManageEvents from './pages/admin/ManageEvents';

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
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/speakers" element={<SpeakersPage />} />
          <Route path="/team" element={<TeamPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="events" element={<ManageEvents />} />
    {/* Add other admin routes here later like /admin/events */}
</Route>
      </Routes>

      
    </>
  );
}

export default App;