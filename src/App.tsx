import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Scan from "./pages/Scan.tsx";
import Manage from "./pages/Manage.tsx";
import Invite from "./pages/Invite.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          {/* الدعوة الأصلية — الصفحة الرئيسية */}
          <Route path="/" element={<Index />} />

          {/* رابط الدعوة الخاص بالضيف */}
          <Route path="/invite/:code" element={<Invite />} />

          {/* مسح QR */}
          <Route path="/scan/:token" element={<Scan />} />

          {/* إدارة المدعوين */}
          <Route path="/manage/:id" element={<Manage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
