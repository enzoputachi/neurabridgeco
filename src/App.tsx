import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import ExpertsDirectory from "./pages/ExpertsDirectory";
import ExpertPage from "./pages/ExpertPage";
import InsightsPage from "./pages/InsightsPage";
import AuthPage from "./pages/AuthPage";
import ExpertDashboard from "./pages/ExpertDashboard";
import InvestorFeed from "./pages/InvestorFeed";
import MarketplacePage from "./pages/MarketplacePage";
import MarketplaceDetailPage from "./pages/MarketplaceDetailPage";
import MessagesPage from "./pages/MessagesPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import BookExpertPage from "./pages/BookExpertPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/experts" element={<ExpertsDirectory />} />
            <Route path="/expert/:id" element={<ExpertPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<ExpertDashboard />} />
            <Route path="/my-feed" element={<InvestorFeed />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/marketplace/:id" element={<MarketplaceDetailPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/profile" element={<ProfileSettingsPage />} />
            <Route path="/book/:id" element={<BookExpertPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
