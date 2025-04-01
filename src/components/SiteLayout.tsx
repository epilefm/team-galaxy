
import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import ProjectSidebar from "./ProjectSidebar";
import { ChevronRight, ChevronDown } from "lucide-react";

const SiteLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para o dashboard quando a rota é /
    if (location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex">
      <ProjectSidebar />
      <div className="flex-1 pt-16 ml-0 md:ml-16">
        <main className="p-4">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </div>
  );
};

export default SiteLayout;
