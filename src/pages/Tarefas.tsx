
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  ClipboardList, 
  Search, 
  MoreVertical, 
  Filter, 
  Calendar, 
  User, 
  Eye, 
  Pencil, 
  Trash2,
  ArrowUpDown,
  BarChart4,
  AlertTriangle,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

// Dados de exemplo
const initialTasks = [
  {
    id: "task-1",
    title: "Manutenção preventiva da linha 1",
    description: "Realizar inspeção e manutenção preventiva de rotina na linha de produção 1",
    priority: "medium",
    department: "Manutenção",
    assignee: "João Silva",
    dueDate: "2023-07-30",
    createdAt: "2023-07-15",
    status: "Pendente",
  },
  {
    id: "task-2",
    title: "Auditoria de qualidade",
    description: "Conduzir auditoria de qualidade no processo de produção conforme procedimentos ISO",
    priority: "high",
    department: "Qualidade",
    assignee: "Maria Santos",
    dueDate: "2023-07-25",
    createdAt: "2023-07-10",
    status: "Em Andamento",
  },
  {
    id: "task-3",
    title: "Implementar novo sistema de monitoramento",
    description: "Instalar e configurar o novo sistema de monitoramento em tempo real para a linha de produção",
    priority: "high",
    department: "Inovação",
    assignee: "Carlos Oliveira",
    dueDate: "2023-08-15",
    createdAt: "2023-07-05",
    status: "Concluído",
  },
  {
    id: "task-4",
    title: "Treinamento de segurança",
    description: "Conduzir treinamento de segurança para novos funcionários da produção",
    priority: "medium",
    department: "Produção",
    assignee: "Ana Costa",
    dueDate: "2023-07-28",
    createdAt: "2023-07-12",
    status: "Em Andamento",
  },
  {
    id: "task-5",
    title: "Revisar procedimentos de manutenção",
    description: "Atualizar documentação de procedimentos de manutenção preventiva e corretiva",
    priority: "low",
    department: "Manutenção",
    assignee: "Pedro Alves",
    dueDate: "2023-08-10",
    createdAt: "2023-07-20",
    status: "Pendente",
  },
];

const Tarefas = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortField, setSortField] = useState("dueDate");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState({
    title: "",
    description: "",
    priority: "",
    department: "",
    assignee: "",
    dueDate: "",
    status: "",
  });

  const { toast } = useToast();

  // Filtros combinados
  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((task) => !departmentFilter || task.department === departmentFilter)
    .filter((task) => !statusFilter || task.status === statusFilter)
    .filter((task) => !priorityFilter || task.priority === priorityFilter)
    .sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setEditingTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      department: task.department,
      assignee: task.assignee,
      dueDate: task.dueDate,
      status: task.status,
    });
    setIsEditOpen(true);
  };

  const handleConfirmEdit = () => {
    if (!editingTask.title) {
      toast({
        title: "Erro",
        description: "O título da tarefa é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setTasks(
      tasks.map((task) =>
        task.id === selectedTask.id ? { ...task, ...editingTask } : task
      )
    );

    toast({
      title: "Tarefa atualizada",
      description: "A tarefa foi atualizada com sucesso",
    });

    setIsEditOpen(false);
  };

  const handleDeleteTask = (task) => {
    setSelectedTask(task);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    setTasks(tasks.filter((task) => task.id !== selectedTask.id));
    
    toast({
      title: "Tarefa excluída",
      description: "A tarefa foi excluída com sucesso",
      variant: "destructive",
    });
    
    setIsDeleteOpen(false);
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500">Alta</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Média</Badge>;
      case "low":
        return <Badge className="bg-green-500">Baixa</Badge>;
      default:
        return null;
    }
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
          <ClipboardList className="h-6 w-6 mr-2" />
          Lista de Tarefas
        </h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Filtros e Pesquisa</CardTitle>
          <CardDescription>Encontre tarefas específicas usando os filtros abaixo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar tarefas..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Manutenção">Manutenção</SelectItem>
                <SelectItem value="Qualidade">Qualidade</SelectItem>
                <SelectItem value="Produção">Produção</SelectItem>
                <SelectItem value="Inovação">Inovação</SelectItem>
                <SelectItem value="Administração">Administração</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="border rounded-md shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("title")}
                  className="flex items-center"
                >
                  Título
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("status")}
                  className="flex items-center"
                >
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("priority")}
                  className="flex items-center"
                >
                  Prioridade
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("department")}
                  className="flex items-center"
                >
                  Departamento
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("assignee")}
                  className="flex items-center"
                >
                  Responsável
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("dueDate")}
                  className="flex items-center"
                >
                  Data Limite
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  Nenhuma tarefa encontrada com os filtros atuais.
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center w-fit gap-1">
                      <BarChart4 className="h-3 w-3" />
                      {task.department}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {task.assignee}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {task.dueDate}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewTask(task)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Ver Detalhes</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditTask(task)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteTask(task)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modais - Detalhes, Edição, Exclusão */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Detalhes da Tarefa</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedTask.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {getStatusBadge(selectedTask.status)}
                  {getPriorityBadge(selectedTask.priority)}
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-md text-sm">
                {selectedTask.description}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Departamento</p>
                  <div className="flex items-center gap-1 mt-1">
                    <BarChart4 className="h-4 w-4 text-muted-foreground" />
                    {selectedTask.department}
                  </div>
                </div>
                <div>
                  <p className="font-semibold">Responsável</p>
                  <div className="flex items-center gap-1 mt-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {selectedTask.assignee}
                  </div>
                </div>
                <div>
                  <p className="font-semibold">Data de Criação</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {selectedTask.createdAt}
                  </div>
                </div>
                <div>
                  <p className="font-semibold">Data Limite</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {selectedTask.dueDate}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Fechar
                </Button>
                <Button onClick={() => {
                  setIsDetailsOpen(false);
                  handleEditTask(selectedTask);
                }}>
                  Editar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Tarefa</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias e salve para atualizar a tarefa.
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Título</Label>
                <Input
                  id="edit-title"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingTask.status}
                    onValueChange={(value) =>
                      setEditingTask({ ...editingTask, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                      <SelectItem value="Concluído">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-priority">Prioridade</Label>
                  <Select
                    value={editingTask.priority}
                    onValueChange={(value) =>
                      setEditingTask({ ...editingTask, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-department">Departamento</Label>
                  <Select
                    value={editingTask.department}
                    onValueChange={(value) =>
                      setEditingTask({ ...editingTask, department: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manutenção">Manutenção</SelectItem>
                      <SelectItem value="Qualidade">Qualidade</SelectItem>
                      <SelectItem value="Produção">Produção</SelectItem>
                      <SelectItem value="Inovação">Inovação</SelectItem>
                      <SelectItem value="Administração">Administração</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-assignee">Responsável</Label>
                  <Input
                    id="edit-assignee"
                    value={editingTask.assignee}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, assignee: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-dueDate">Data Limite</Label>
                <Input
                  id="edit-dueDate"
                  type="date"
                  value={editingTask.dueDate}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, dueDate: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmEdit}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="py-4">
              <p className="font-semibold">{selectedTask.title}</p>
              <p className="text-sm text-muted-foreground">
                {selectedTask.department} - {selectedTask.assignee}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tarefas;
