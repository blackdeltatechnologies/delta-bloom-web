import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { PageTransition } from "./components/PageTransition";
import { ChatBot } from "./components/ChatBot";
import { AuthProvider } from "./hooks/useAuth";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import SkyBackupAuth from "./pages/SkyBackupAuth";
import SkyBackupDashboard from "./pages/SkyBackupDashboard";
import SkyBackupAdmin from "./pages/SkyBackupAdmin";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/skybackup/auth" element={<PageTransition><SkyBackupAuth /></PageTransition>} />
        <Route path="/skybackup/dashboard" element={<PageTransition><SkyBackupDashboard /></PageTransition>} />
        <Route path="/skybackup/admin" element={<PageTransition><SkyBackupAdmin /></PageTransition>} />
        <Route path="/portfolio" element={<PageTransition><Portfolio /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <div className="flex-1">
              <AnimatedRoutes />
            </div>
            <Footer />
            <ChatBot />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
