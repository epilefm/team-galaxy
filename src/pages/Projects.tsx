
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  PlusCircle, 
  Trash, 
  Edit, 
  Folder, 
  FolderOpen,
  Users, 
  Calendar, 
  AlertCircle,
  ChevronRightCircle,
  PanelRight,
  X as XIcon
} from "lucide-react";

// Schema de validação para projetos
const projectFormSchema = z.object({
  name: z.string().min(3, {
    message: "O nome do projeto deve ter pelo menos 3 caracteres.",
  }),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres.",
  }),
  startDate: z.string().min(1, {
    message: "A data de início é obrigatória.",
  }),
  endDate: z.string().min(1, {
    message: "A data de término é obrigatória.",
  }),
  status: z.string().min(1, {
    message: "O status é obrigatório.",
  }),
  team: z.array(z.string()).optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

// Mock de projetos (em um app real, viria da API ou context)
const mockProjects = [
  {
    id: "proj-1",
    name: "Automação da Linha de Produção",
    description: "Implementação de sistema automatizado para controle da linha de produção principal.",
    startDate: "2023-12-01",
    endDate: "2024-05-30",
    status: "em_andamento",
    progress: 35,
    tasksCount: 24,
    completedTasks: 8,
    team: ["user-1", "user-2", "user-3"]
  },
  {
    id: "proj-2",
    name: "Certificação ISO 9001",
    description: "Processo de documentação e preparação para auditoria de certificação ISO 9001.",
    startDate: "2024-02-15",
    endDate: "2024-08-15",
    status: "em_andamento",
    progress: 15,
    tasksCount: 32,
    completedTasks: 5,
    team: ["user-1", "user-4"]
  },
  {
    id: "proj-3",
    name: "Treinamento de Segurança",
    description: "Desenvolvimento de programa de treinamento para operação segura dos equipamentos.",
    startDate: "2023-11-10",
    endDate: "2024-01-30",
    status: "concluido",
    progress: 100,
    tasksCount: 12,
    completedTasks: 12,
    team: ["user-2", "user-5"]
  },
  {
    id: "proj-4",
    name: "Revisão de Processos Internos",
    description: "Avaliação e otimização dos processos administrativos internos.",
    startDate: "2024-01-05",
    endDate: "2024-04-15",
    status: "atrasado",
    progress: 40,
    tasksCount: 18,
    completedTasks: 7,
    team: ["user-3", "user-4", "user-5"]
  }
];

// Mock de usuários (em um app real, viria da API ou context)
const mockUsers = [
  { id: "user-1", name: "Ana Silva", role: "Gerente de Projetos" },
  { id: "user-2", name: "Carlos Oliveira", role: "Desenvolvedor" },
  { id: "user-3", name: "Mariana Santos", role: "Analista de Qualidade" },
  { id: "user-4", name: "Roberto Almeida", role: "Engenheiro" },
  { id: "user-5", name: "Juliana Costa", role: "Designer" }
];

const getStatusText = (status: string) => {
  switch (status) {
    case "nao_iniciado": return "Não Iniciado";
    case "em_andamento": return "Em Andamento";
    case "concluido": return "Concluído";
    case "atrasado": return "Atrasado";
    default: return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "nao_iniciado": return "bg-gray-100 text-gray-800";
    case "em_andamento": return "bg-blue-100 text-blue-800";
    case "concluido": return "bg-green-100 text-green-800";
    case "atrasado": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const Projects = () => {
  const [projects, setProjects] = useState(mockProjects);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: "",
      status: "nao_iniciado",
      team: [],
    },
  });
  
  // Reset form when the dialog is closed
  useEffect(() => {
    if (!isNewProjectDialogOpen && !editingProjectId) {
      form.reset();
    }
  }, [isNewProjectDialogOpen, editingProjectId, form]);

  // Set form values when editing a project
  useEffect(() => {
    if (editingProjectId) {
      const projectToEdit = projects.find((p) => p.id === editingProjectId);
      if (projectToEdit) {
        form.reset({
          name: projectToEdit.name,
          description: projectToEdit.description,
          startDate: projectToEdit.startDate,
          endDate: projectToEdit.endDate,
          status: projectToEdit.status,
          team: projectToEdit.team,
        });
      }
    }
  }, [editingProjectId, projects, form]);

  const handleCreateProject = (values: ProjectFormValues) => {
    const newProject = {
      id: `proj-${projects.length + 1}`,
      name: values.name,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
      status: values.status,
      progress: 0,
      tasksCount: 0,
      completedTasks: 0,
      team: values.team || [],
    };

    setProjects([...projects, newProject]);
    toast({
      title: "Projeto criado",
      description: `O projeto ${values.name} foi criado com sucesso.`
    });
    setIsNewProjectDialogOpen(false);
  };

  const handleUpdateProject = (values: ProjectFormValues) => {
    if (editingProjectId) {
      setProjects(projects.map(project => 
        project.id === editingProjectId 
          ? { 
              ...project, 
              name: values.name,
              description: values.description,
              startDate: values.startDate,
              endDate: values.endDate,
              status: values.status,
              team: values.team || project.team
            } 
          : project
      ));
      
      toast({
        title: "Projeto atualizado",
        description: `O projeto ${values.name} foi atualizado com sucesso.`
      });
      
      setEditingProjectId(null);
      setIsNewProjectDialogOpen(false);
    }
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
    toast({
      title: "Projeto excluído",
      description: "O projeto foi excluído com sucesso.",
      variant: "destructive"
    });
    setConfirmDeleteId(null);
  };

  const openProjectKanban = (projectId: string) => {
    navigate(`/kanban?project=${projectId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os projetos da sua organização
          </p>
        </div>
        <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingProjectId(null);
              form.reset();
              setIsNewProjectDialogOpen(true);
            }}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Projeto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingProjectId ? "Editar Projeto" : "Criar Novo Projeto"}</DialogTitle>
              <DialogDescription>
                {editingProjectId 
                  ? "Atualize os detalhes do projeto existente." 
                  : "Preencha os detalhes para criar um novo projeto."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(editingProjectId ? handleUpdateProject : handleCreateProject)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Projeto</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome do projeto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input placeholder="Descreva o projeto brevemente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Início</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Término</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="nao_iniciado">Não Iniciado</SelectItem>
                          <SelectItem value="em_andamento">Em Andamento</SelectItem>
                          <SelectItem value="concluido">Concluído</SelectItem>
                          <SelectItem value="atrasado">Atrasado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="pt-4">
                  <Button onClick={() => {
                    setIsNewProjectDialogOpen(false);
                    setEditingProjectId(null);
                  }} type="button" variant="outline">
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingProjectId ? "Atualizar" : "Criar"} Projeto
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Dialog de confirmação de exclusão */}
        <Dialog open={!!confirmDeleteId} onOpenChange={(isOpen) => !isOpen && setConfirmDeleteId(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
              <Button
                type="button"
                variant="destructive"
                onClick={() => confirmDeleteId && handleDeleteProject(confirmDeleteId)}
              >
                Sim, excluir projeto
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-all">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl truncate" title={project.name}>
                  {project.name}
                </CardTitle>
                <Badge className={getStatusColor(project.status)}>
                  {getStatusText(project.status)}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2" title={project.description}>
                {project.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progresso:</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className={`h-full rounded-full ${
                      project.status === "concluido" 
                        ? "bg-green-500" 
                        : project.status === "atrasado" 
                          ? "bg-red-500" 
                          : "bg-blue-500"
                    }`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Início: {new Date(project.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Término: {new Date(project.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{project.team.length} membros</span>
              </div>

              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{project.completedTasks}/{project.tasksCount} tarefas concluídas</span>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <div>
                <Button variant="ghost" size="icon" onClick={() => {
                  setEditingProjectId(project.id);
                  setIsNewProjectDialogOpen(true);
                }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setConfirmDeleteId(project.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="secondary" onClick={() => openProjectKanban(project.id)}>
                <PanelRight className="h-4 w-4 mr-2" />
                Abrir Kanban
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Projects;
