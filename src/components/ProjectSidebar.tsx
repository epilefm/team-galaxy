
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PanelLeftOpen,
  PanelLeftClose,
  Home,
  LayoutDashboard,
  ClipboardList,
  Users,
  Settings,
  PlusCircle,
  FolderOpenDot,
  Folder,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Projetos simulados - em uma aplicação real, isso viria de uma API ou context
const initialProjects = [
  { id: "proj-1", name: "Automação da Linha de Produção" },
  { id: "proj-2", name: "Certificação ISO 9001" },
  { id: "proj-3", name: "Treinamento de Segurança" }
];

const ProjectSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [projects, setProjects] = useState(initialProjects);
  const [projectsOpen, setProjectsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Detecta se a tela é mobile para auto-colapsar a sidebar
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isProjectActive = (projectId) => {
    return location.search.includes(`project=${projectId}`);
  };

  return (
    <div className={cn(
      "transition-all duration-300 flex flex-col fixed left-0 top-0 h-screen bg-white border-r z-40 max-h-screen pt-16",
      isOpen ? "w-64" : "w-0 -translate-x-full md:translate-x-0 md:w-16"
    )}>
      <div className="p-2 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 py-2">
          <Button
            variant={isActive("/") ? "secondary" : "ghost"}
            className={cn("w-full justify-start", !isOpen && "justify-center px-0")}
            onClick={() => handleNavigate("/")}
          >
            <Home className="h-4 w-4 mr-2" />
            {isOpen && <span>Início</span>}
          </Button>
          
          <Button
            variant={isActive("/dashboard") ? "secondary" : "ghost"}
            className={cn("w-full justify-start", !isOpen && "justify-center px-0")}
            onClick={() => handleNavigate("/dashboard")}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            {isOpen && <span>Dashboard</span>}
          </Button>
          
          <Button
            variant={isActive("/tarefas") ? "secondary" : "ghost"}
            className={cn("w-full justify-start", !isOpen && "justify-center px-0")}
            onClick={() => handleNavigate("/tarefas")}
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            {isOpen && <span>Tarefas</span>}
          </Button>
          
          <Button
            variant={isActive("/kanban") && !location.search ? "secondary" : "ghost"}
            className={cn("w-full justify-start", !isOpen && "justify-center px-0")}
            onClick={() => handleNavigate("/kanban")}
          >
            <FolderOpenDot className="h-4 w-4 mr-2" />
            {isOpen && <span>Kanban</span>}
          </Button>
          
          <Button
            variant={isActive("/usuarios") ? "secondary" : "ghost"}
            className={cn("w-full justify-start", !isOpen && "justify-center px-0")}
            onClick={() => handleNavigate("/usuarios")}
          >
            <Users className="h-4 w-4 mr-2" />
            {isOpen && <span>Usuários</span>}
          </Button>
        </div>

        <Separator className="my-4" />
        
        {isOpen ? (
          <Collapsible
            open={projectsOpen}
            onOpenChange={setProjectsOpen}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="px-0">
                  {projectsOpen ? (
                    <ChevronDown className="h-4 w-4 mr-1" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1" />
                  )}
                  <span>Projetos</span>
                </Button>
              </CollapsibleTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleNavigate("/projects")}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            <CollapsibleContent className="space-y-1">
              {projects.map((project) => (
                <Button
                  key={project.id}
                  variant={isProjectActive(project.id) ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start pl-6 text-sm"
                  onClick={() => handleNavigate(`/kanban?project=${project.id}`)}
                >
                  <Folder className="h-3.5 w-3.5 mr-2" />
                  <span className="truncate">{project.name}</span>
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start pl-6 text-sm text-blue-600 hover:text-blue-800"
                onClick={() => handleNavigate("/projects")}
              >
                <span>Ver todos os projetos</span>
              </Button>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-8"
            onClick={() => handleNavigate("/projects")}
          >
            <Folder className="h-4 w-4" />
          </Button>
        )}
      </ScrollArea>
      
      <div className={cn("p-4", !isOpen && "px-0")}>
        <Button
          variant="ghost"
          size="sm"
          className={cn("w-full justify-start", !isOpen && "justify-center")}
          onClick={() => handleNavigate("/configuracoes")}
        >
          <Settings className="h-4 w-4 mr-2" />
          {isOpen && <span>Configurações</span>}
        </Button>
      </div>
    </div>
  );
};

export default ProjectSidebar;
