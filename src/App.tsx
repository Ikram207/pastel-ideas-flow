import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import IdeasList from "./pages/IdeasList";
import IdeaDetail from "./pages/IdeaDetail";
import IdeaFormPage from "./pages/IdeaFormPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { HelmetProvider } from "react-helmet-async";
import { IdeasProvider } from "./context/IdeasContext";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <IdeasProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/ideas" element={<IdeasList />} />
                <Route path="/ideas/new" element={<IdeaFormPage mode="create" />} />
                <Route path="/ideas/:id" element={<IdeaDetail />} />
                <Route path="/ideas/:id/edit" element={<IdeaFormPage mode="edit" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </IdeasProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
