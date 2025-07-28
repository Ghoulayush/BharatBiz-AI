// // import { Toaster } from "@/components/ui/toaster";
// // import { Toaster as Sonner } from "@/components/ui/sonner";
// // import { TooltipProvider } from "@/components/ui/tooltip";
// // import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// // import { BrowserRouter, Routes, Route } from "react-router-dom";

// // import Index from "./pages/Index";
// // import Chat from "./pages/Chat";
// // import Dashboard from "./pages/Dashboard";
// // import InventoryManager from "./pages/InventoryManager";
// // import BusinessCoordinator from "./pages/BusinessCoordinator";
// // import NotFound from "./pages/NotFound";
// // import Login from "./pages/Login"; // ✅ import stays

// // const queryClient = new QueryClient();

// // const App = () => (
// //   <QueryClientProvider client={queryClient}>
// //     <TooltipProvider>
// //       <Toaster />
// //       <Sonner />
// //       <BrowserRouter>
// //         <Routes>
// //           <Route path="/" element={<Index />} />
// //           <Route path="/chat" element={<Chat />} />
// //           <Route path="/dashboard" element={<Dashboard />} />
// //           <Route path="/inventory-manager" element={<InventoryManager />} />
// //           <Route path="/business-coordinator" element={<BusinessCoordinator />} />
// //           <Route path="/login" element={<Login />} /> {/* ✅ Added login route */}
// //           <Route path="*" element={<NotFound />} />
// //         </Routes>
// //       </BrowserRouter>
// //     </TooltipProvider>
// //   </QueryClientProvider>
// // );

// // export default App;


import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Index from "./pages/Index";
import Chat from "./pages/Chat";

import InventoryManager from "./pages/InventoryManager";
import BusinessCoordinator from "./pages/BusinessCoordinator";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";




const queryClient = new QueryClient();

const App = () => {
  const [token, setToken] = useState(null);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/inventory-manager" element={<InventoryManager />} />
            <Route path="/business-coordinator" element={<BusinessCoordinator />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;



