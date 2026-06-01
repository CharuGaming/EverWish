import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminEditor    from "./pages/AdminEditor";
import ClientPage     from "./pages/ClientPage";
import Storefront     from "./pages/Storefront";
import DemoPage       from "./pages/DemoPage";
import OrderForm      from "./pages/OrderForm";
import Login          from "./pages/Login";

// Static demo components (hardcoded siteData — the original demo at /)
import LockScreen    from "./components/LockScreen";
import Hero          from "./components/Hero";
import LoveMap       from "./components/LoveMap";
import Gallery       from "./components/Gallery";
import GiftBox       from "./components/GiftBox";
import Footer        from "./components/Footer";
import FloatingDecor from "./components/FloatingDecor";
import CursorTrail   from "./components/CursorTrail";
import MusicPlayer   from "./components/MusicPlayer";
import "./index.css";

// ── Static hardcoded demo (original site, route: /) ──────────────
function StaticDemo() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [playTrigger, setPlayTrigger] = useState(false);

  const handleUnlock = useCallback(() => setIsUnlocked(true), []);
  const handleUnlockImmediate = useCallback(() => setPlayTrigger(true), []);

  return (
    <div className="relative min-h-screen">
      <CursorTrail />
      <MusicPlayer isUnlocked={isUnlocked} playTrigger={playTrigger} />
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <LockScreen key="lock" onUnlock={handleUnlock} onUnlockImmediate={handleUnlockImmediate} />
        ) : (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }}>
            <FloatingDecor />
            <Hero />
            <GiftBox />
            <LoveMap />
            <Gallery />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Protected Route Wrapper ───────────────────────────────────────
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// ── App with Router ───────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public storefront — default landing page */}
        <Route path="/"                  element={<Storefront />} />

        {/* Static hardcoded demo (original) */}
        <Route path="/demo"                  element={<StaticDemo />} />

        {/* Template live previews — must come before /:siteId */}
        <Route path="/demo/:templateId"      element={<DemoPage />} />

        {/* Auth */}
        <Route path="/login"             element={<Login />} />

        {/* Admin portal */}
        <Route path="/admin"             element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/edit/:siteId" element={<ProtectedRoute><AdminEditor /></ProtectedRoute>} />

        {/* Order form — /order/:templateId */}
        <Route path="/order/:templateId"    element={<OrderForm />} />

        {/* Dynamic client celebration page — must stay last */}
        <Route path="/:siteId"           element={<ClientPage />} />

        {/* Fallback */}
        <Route path="*"                  element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
