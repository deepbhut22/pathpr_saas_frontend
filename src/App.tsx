
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import Login from "./pages/Login";
import FirmPage from "./pages/FirmPage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Questionnaire from "./pages/Questionnaire";
import ConstultantPage from "./pages/ConsltantPage";
import ConsultantSettings from "./components/consultants/ConsultantSettings";
import { useEffect } from "react";
import GenericPopUp from "./components/PopUp/GenericPopUp";
import ProfileCompletionPopup from "./components/PopUp/ProfileCompletionPopup";
import FirmInfo from "./pages/FirmInfo";
import FirmSettings from "./pages/FirmSettings";
import ClientSuccessPage from "./pages/ClientSuccessPage";
// import './App.css';
const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { initializeApp, updateIsProfileComletionPopupOpen } = useAuthStore();

  const isProfileComletionPopupOpen = useAuthStore((state) => state.isProfileComletionPopupOpen);

  useEffect(() => {
    initializeApp();
  }, []);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>
    {children}
    <ProfileCompletionPopup isOpen={isProfileComletionPopupOpen} onClose={() => updateIsProfileComletionPopupOpen(false)} />
  </>;
};

// Public Route component (redirect if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, firm } = useAuthStore();
  
  if (isAuthenticated && firm) {
    return <Navigate to={`/${firm.slug}`} replace />;
  }
  
  return <>{children}</>;
};

const App = () => {


  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/:firmSlug" 
              element={
                <ProtectedRoute>
                  <FirmPage />
                </ProtectedRoute>
              } 
            />
              <Route
                path="/:firmSlug/consultants"
                element={
                  <ProtectedRoute>
                    <ConstultantPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/:firmSlug/consultant-profile"
                element={
                  <ProtectedRoute>
                    <ConsultantSettings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/:firmSlug/firm-settings"
                element={
                  <ProtectedRoute>
                    <FirmSettings />
                  </ProtectedRoute>
                }
              />
              
            <Route path="/:slug/data-form/:step?/:token" element={<Questionnaire />} />

            <Route path="/:slug/firm-info/:token" element={<FirmInfo />} />

            <Route path="/:slug/client-success" element={<ClientSuccessPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </QueryClientProvider>
    </>
);
}

export default App;
