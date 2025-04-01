
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  PlusCircle,
  FolderOpenDot,
  MoreVertical,
  CalendarClock,
  Users,
  Folder,
  LayoutGrid,
  Check,
  Clock,
  AlertTriangle,
  ChevronRight,
  Pencil,
  Trash2
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Exemplo de dados de projetos
const initialProjects = [
  {
    id: "proj-1",
    name: "Automação da Linha de Produção",
    description: "Implementação de sistemas de automação para aumentar a eficiência da linha de produção principal.",
    createdAt: "2023-05-15",
    dueDate: "2023-12-30",
    members: ["João Silva", "Maria Santos", "Carlos Oliveira"],
    tasksTotal: 24,
    tasksCompleted: 10,
    status: "Em Andamento"
  },
  {
    id: "proj-2",
    name: "Certificação ISO 9001",
    description: "Preparação e documentação para auditoria de certificação ISO 9001.",
    createdAt: "2023-06-01",
    dueDate: "2023-10-15",
    members: ["Ana Costa", "Pedro Alves"],
    tasksTotal: 18,
    tasksCompleted: 15,
    status: "Em Andamento"
  },
  {
    id: "proj-3",
    name: "Treinamento de Segurança",
    description: "Programa de treinamentos em segurança do trabalho para todos os funcionários.",
    createdAt: "2023-04-10",
    dueDate: "2023-07-20",
    members: ["Carlos Oliveira", "Ana Costa"],
    tasksTotal: 12,
    tasksCompleted: 12,
    status: "Concluído"
  }
];

const Projects = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    dueDate: "",
    members: []
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [newMember, setNewMember] = useState("");
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleOpenProject = (projectId) => {
    // Na implementação final, este navegaria para o kanban específico do projeto
    toast({
      title: "Projeto aberto",
      description: `Abrindo projeto: ${projects.find(p => p.id === projectId)?.name}`,
    });
    navigate(`/kanban?project=${projectId}`);
  };

  const handleCreateProject = () => {
    if (!newProject.name) {
      toast({
        title: "Erro",
        description: "O nome do projeto é obrigatório",
        variant: "destructive",
      });
      return;
    }
    
    const projectId = `proj-${Date.now()}`;
    const createdProject = {
      id: projectId,
      ...newProject,
      createdAt: new Date().toISOString().substring(0, 10),
      tasksTotal: 0,
      tasksCompleted: 0,
      status: "Em Andamento"
    };
    
    setProjects([...projects, createdProject]);
    setNewProject({
      name: "",
      description: "",
      dueDate: "",
      members: []
    });
    
    setIsNewProjectDialogOpen(false);
    
    toast({
      title: "Projeto criado",
      description: "O projeto foi criado com sucesso"
    });
  };

  const handleEditProject = () => {
    if (!newProject.name) {
      toast({
        title: "Erro",
        description: "O nome do projeto é obrigatório",
        variant: "destructive",
      });
      return;
    }
    
    const updatedProjects = projects.map(project => 
      project.id === selectedProject.id ? { ...project, ...newProject } : project
    );
    
    setProjects(updatedProjects);
    setIsEditProjectDialogOpen(false);
    
    toast({
      title: "Projeto atualizado",
      description: "O projeto foi atualizado com sucesso"
    });
  };

  const handleDeleteProject = () => {
    const updatedProjects = projects.filter(project => project.id !== selectedProject.id);
    setProjects(updatedProjects);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Projeto excluído",
      description: "O projeto foi excluído com sucesso",
      variant: "destructive"
    });
  };

  const openEditDialog = (project) => {
    setSelectedProject(project);
    setNewProject({
      name: project.name,
      description: project.description,
      dueDate: project.dueDate,
      members: [...project.members]
    });
    setIsEditProjectDialogOpen(true);
  };

  const openDeleteDialog = (project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleAddMember = () => {
    if (newMember.trim() && !newProject.members.includes(newMember.trim())) {
      setNewProject({
        ...newProject,
        members: [...newProject.members, newMember.trim()]
      });
      setNewMember("");
    }
  };

  const handleRemoveMember = (member) => {
    setNewProject({
      ...newProject,
      members: newProject.members.filter(m => m !== member)
    });
  };

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return dateString || "Data não definida";
    }
  };

  const getProgressPercentage = (completed, total) => {
    if (!total) return 0;
    return Math.round((completed / total) * 100);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Concluído":
        return <Badge className="bg-green-500">Concluído</Badge>;
      case "Em Andamento":
        return <Badge className="bg-blue-500">Em Andamento</Badge>;
      case "Pendente":
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Folder className="mr-2 h-6 w-6" />
          Projetos
        </h1>
        
        <Button 
          onClick={() => {
            setNewProject({
              name: "",
              description: "",
              dueDate: "",
              members: []
            });
            setIsNewProjectDialogOpen(true);
          }}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Novo Projeto
        </Button>
      </div>
      
      {projects.length === 0 ? (
        <div className="text-center py-10">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 mb-4">
            <Folder className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Nenhum projeto criado</h2>
          <p className="text-muted-foreground mb-4">
            Comece criando seu primeiro projeto para organizar suas tarefas.
          </p>
          <Button 
            onClick={() => setIsNewProjectDialogOpen(true)}
            variant="outline" 
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Criar Projeto
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Card 
              key={project.id} 
              className={`transition-all duration-300 hover:shadow-md ${
                project.status === "Concluído" ? "bg-green-50" : "hover:border-blue-200"
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-start gap-2">
                    <FolderOpenDot className={`h-5 w-5 flex-shrink-0 ${
                      project.status === "Concluído" ? "text-green-500" : "text-blue-500"
                    }`} />
                    <CardTitle className="text-lg leading-tight">{project.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenProject(project.id)}>
                        <LayoutGrid className="h-4 w-4 mr-2" />
                        Abrir Kanban
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(project)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar Projeto
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => openDeleteDialog(project)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir Projeto
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  {getStatusBadge(project.status)}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarClock className="h-3 w-3 mr-1" />
                    <span>{formatDate(project.dueDate)}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {project.description}
                </p>
                
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                  <div 
                    className="h-1.5 rounded-full bg-blue-600 transition-all duration-500" 
                    style={{ width: `${getProgressPercentage(project.tasksCompleted, project.tasksTotal)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progresso</span>
                  <span>{project.tasksCompleted}/{project.tasksTotal} tarefas - {getProgressPercentage(project.tasksCompleted, project.tasksTotal)}%</span>
                </div>
                
                <div className="flex items-center mt-4 text-xs text-muted-foreground">
                  <Users className="h-3 w-3 mr-1" />
                  <span className="mr-1">Membros:</span>
                  <span className="font-medium truncate">
                    {project.members.length > 0 
                      ? project.members.slice(0, 2).join(", ") + (project.members.length > 2 ? ` +${project.members.length - 2}` : "") 
                      : "Nenhum membro"}
                  </span>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0">
                <Button 
                  variant="ghost" 
                  className="w-full justify-between text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  onClick={() => handleOpenProject(project.id)}
                >
                  <span>Ver quadro Kanban</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Modal de novo projeto */}
      <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Novo Projeto</DialogTitle>
            <DialogDescription>
              Crie um novo projeto para organizar suas tarefas e atividades.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Projeto</Label>
              <Input 
                id="name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                placeholder="Digite o nome do projeto"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Descreva os objetivos e escopo do projeto"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Data de Conclusão Prevista</Label>
              <Input 
                id="dueDate"
                type="date"
                value={newProject.dueDate}
                onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Membros do Projeto</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newProject.members.map((member, idx) => (
                  <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                    {member}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => handleRemoveMember(member)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                {newProject.members.length === 0 && (
                  <span className="text-sm text-muted-foreground">Nenhum membro adicionado</span>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Nome do membro"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleAddMember}
                  disabled={!newMember.trim()}
                  size="icon"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewProjectDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateProject}>
              Criar Projeto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de edição de projeto */}
      <Dialog open={isEditProjectDialogOpen} onOpenChange={setIsEditProjectDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Editar Projeto</DialogTitle>
            <DialogDescription>
              Atualize as informações do projeto.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nome do Projeto</Label>
              <Input 
                id="edit-name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea 
                id="edit-description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-dueDate">Data de Conclusão Prevista</Label>
              <Input 
                id="edit-dueDate"
                type="date"
                value={newProject.dueDate}
                onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Membros do Projeto</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newProject.members.map((member, idx) => (
                  <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                    {member}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => handleRemoveMember(member)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Nome do membro"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleAddMember}
                  disabled={!newMember.trim()}
                  size="icon"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProjectDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditProject}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de exclusão de projeto */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && (
            <div className="py-3">
              <p className="font-semibold">{selectedProject.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{selectedProject.description}</p>
              
              <div className="flex items-center gap-2 mt-3 text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>Criado em: {formatDate(selectedProject.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
                  <span className="text-amber-600">
                    {selectedProject.tasksTotal} tarefas serão removidas
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              Excluir Projeto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
