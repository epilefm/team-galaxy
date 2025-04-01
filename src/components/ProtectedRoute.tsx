
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoggedIn && location.pathname !== "/login") {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você precisa fazer login para acessar esta página.",
      });
    }
  }, [isLoggedIn, location.pathname, toast]);

  if (!isLoggedIn) {
    // Redireciona para a página de login, salvando o caminho atual
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
