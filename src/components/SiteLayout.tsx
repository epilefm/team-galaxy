
import React from "react";
import { Outlet, Link } from "react-router-dom";
import ProjectSidebar from "./ProjectSidebar";
import Navbar from "./Navbar";
import { useToast } from "@/components/ui/use-toast";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SiteLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    
    toast({
      title: "Sessão encerrada",
      description: "Você foi desconectado com sucesso.",
    });
    
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="ml-auto text-muted-foreground hover:text-primary"
          title="Sair"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </Navbar>
      <div className="flex">
        <ProjectSidebar />
        <main className="flex-1 ml-0 md:ml-16 pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SiteLayout;
