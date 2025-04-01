
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Kanban from "./pages/Kanban";
import Tarefas from "./pages/Tarefas";
import Usuarios from "./pages/Usuarios";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            {isLoggedIn && <Navbar />}
            <div className="flex-1">
              <Routes>
                <Route path="/login" element={<Login />} />
                
                {/* Rotas protegidas */}
                <Route 
                  path="/" 
                  element={
                    isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/kanban" 
                  element={
                    <ProtectedRoute>
                      <Kanban />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/tarefas" 
                  element={
                    <ProtectedRoute>
                      <Tarefas />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/usuarios" 
                  element={
                    <ProtectedRoute>
                      <Usuarios />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Rota para página não encontrada */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
