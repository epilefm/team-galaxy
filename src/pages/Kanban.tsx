
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Clock, 
  Calendar, 
  Users,
  BarChart4, 
  AlertTriangle,
  CheckCircle,
  ClipboardList,
  PlusCircle,
  X
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format, isAfter, isBefore, parseISO, differenceInDays, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

const initialData = {
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Manutenção preventiva da linha 1",
      description: "Realizar inspeção e manutenção preventiva de rotina na linha de produção 1",
      priority: "medium",
      departments: ["Manutenção"],
      assignees: ["João Silva"],
      dueDate: "2023-07-30",
      createdAt: "2023-07-15",
    },
    "task-2": {
      id: "task-2",
      title: "Auditoria de qualidade",
      description: "Conduzir auditoria de qualidade no processo de produção conforme procedimentos ISO",
      priority: "high",
      departments: ["Qualidade"],
      assignees: ["Maria Santos", "Carlos Pereira"],
      dueDate: "2023-07-25",
      createdAt: "2023-07-10",
    },
    "task-3": {
      id: "task-3",
      title: "Implementar novo sistema de monitoramento",
      description: "Instalar e configurar o novo sistema de monitoramento em tempo real para a linha de produção",
      priority: "high",
      departments: ["Inovação", "TI"],
      assignees: ["Carlos Oliveira"],
      dueDate: "2023-08-15",
      createdAt: "2023-07-05",
    },
    "task-4": {
      id: "task-4",
      title: "Treinamento de segurança",
      description: "Conduzir treinamento de segurança para novos funcionários da produção",
      priority: "medium",
      departments: ["Produção", "RH"],
      assignees: ["Ana Costa"],
      dueDate: "2023-07-28",
      createdAt: "2023-07-12",
    },
    "task-5": {
      id: "task-5",
      title: "Revisar procedimentos de manutenção",
      description: "Atualizar documentação de procedimentos de manutenção preventiva e corretiva",
      priority: "low",
      departments: ["Manutenção"],
      assignees: ["Pedro Alves"],
      dueDate: "2023-08-10",
      createdAt: "2023-07-20",
    },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "Pendente",
      taskIds: ["task-1", "task-5"],
    },
    "column-2": {
      id: "column-2",
      title: "Em Andamento",
      taskIds: ["task-2", "task-4"],
    },
    "column-3": {
      id: "column-3",
      title: "Concluído",
      taskIds: ["task-3"],
    },
  },
  // Facilita a reordenação das colunas
  columnOrder: ["column-1", "column-2", "column-3"],
};

// Lista de departamentos disponíveis
const departmentOptions = [
  "Manutenção",
  "Qualidade",
  "Produção",
  "Inovação",
  "TI",
  "RH",
  "Administração",
  "Logística",
  "Financeiro",
  "Comercial"
];

const Kanban = () => {
  const [data, setData] = useState(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    departments: [],
    assignees: [],
    dueDate: new Date().toISOString().substring(0, 10),
  });
  
  const [newAssignee, setNewAssignee] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  
  const { toast } = useToast();
  const today = new Date();

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Se não tiver destino (arrastar para fora) ou o destino for o mesmo lugar, não faz nada
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = data.columns[source.droppableId];
    const destColumn = data.columns[destination.droppableId];

    // Reordenação na mesma coluna
    if (sourceColumn === destColumn) {
      const newTaskIds = Array.from(sourceColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
      };

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      });
      return;
    }

    // Movendo de uma coluna para outra
    const sourceTaskIds = Array.from(sourceColumn.taskIds);
    sourceTaskIds.splice(source.index, 1);
    const newSourceColumn = {
      ...sourceColumn,
      taskIds: sourceTaskIds,
    };

    const destTaskIds = Array.from(destColumn.taskIds);
    destTaskIds.splice(destination.index, 0, draggableId);
    const newDestColumn = {
      ...destColumn,
      taskIds: destTaskIds,
    };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestColumn.id]: newDestColumn,
      },
    });

    toast({
      title: "Tarefa movida",
      description: `A tarefa foi movida para ${destColumn.title}`,
    });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      departments: task.departments || [],
      assignees: task.assignees || [],
      dueDate: task.dueDate,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    // Cria uma cópia das tarefas sem a tarefa a ser excluída
    const newTasks = { ...data.tasks };
    delete newTasks[taskId];

    // Atualiza as colunas removendo o ID da tarefa
    const newColumns = { ...data.columns };
    for (const columnId in newColumns) {
      newColumns[columnId].taskIds = newColumns[columnId].taskIds.filter(
        (id) => id !== taskId
      );
    }

    setData({
      ...data,
      tasks: newTasks,
      columns: newColumns,
    });

    toast({
      title: "Tarefa excluída",
      description: "A tarefa foi excluída com sucesso",
      variant: "destructive",
    });
  };

  const handleAddAssignee = () => {
    if (newAssignee.trim()) {
      if (!newTask.assignees.includes(newAssignee.trim())) {
        setNewTask({
          ...newTask,
          assignees: [...newTask.assignees, newAssignee.trim()]
        });
      }
      setNewAssignee("");
    }
  };

  const handleRemoveAssignee = (assignee) => {
    setNewTask({
      ...newTask,
      assignees: newTask.assignees.filter(a => a !== assignee)
    });
  };

  const handleAddDepartment = () => {
    if (newDepartment && !newTask.departments.includes(newDepartment)) {
      setNewTask({
        ...newTask,
        departments: [...newTask.departments, newDepartment]
      });
      setNewDepartment("");
    }
  };

  const handleRemoveDepartment = (department) => {
    setNewTask({
      ...newTask,
      departments: newTask.departments.filter(d => d !== department)
    });
  };

  const handleAddOrUpdateTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Erro",
        description: "O título da tarefa é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (editingTask) {
      // Atualiza uma tarefa existente
      const updatedTasks = {
        ...data.tasks,
        [editingTask.id]: {
          ...data.tasks[editingTask.id],
          ...newTask,
        },
      };

      setData({
        ...data,
        tasks: updatedTasks,
      });

      toast({
        title: "Tarefa atualizada",
        description: "A tarefa foi atualizada com sucesso",
      });
    } else {
      // Cria uma nova tarefa
      const taskId = `task-${Date.now()}`;
      const newTaskWithId = {
        id: taskId,
        ...newTask,
        createdAt: new Date().toISOString().substring(0, 10),
      };

      // Adiciona a nova tarefa ao estado
      const updatedTasks = {
        ...data.tasks,
        [taskId]: newTaskWithId,
      };

      // Adiciona o ID da tarefa à primeira coluna (Pendente)
      const firstColumn = data.columns["column-1"];
      const updatedFirstColumn = {
        ...firstColumn,
        taskIds: [...firstColumn.taskIds, taskId],
      };

      setData({
        ...data,
        tasks: updatedTasks,
        columns: {
          ...data.columns,
          "column-1": updatedFirstColumn,
        },
      });

      toast({
        title: "Tarefa criada",
        description: "A nova tarefa foi criada com sucesso",
      });
    }

    // Limpa o formulário e fecha o modal
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      departments: [],
      assignees: [],
      dueDate: new Date().toISOString().substring(0, 10),
    });
    setEditingTask(null);
    setIsDialogOpen(false);
  };

  // Função para verificar o status do prazo
  const getDeadlineStatus = (dueDate) => {
    if (!dueDate || !isValid(parseISO(dueDate))) return "normal";
    
    const dueDateObj = parseISO(dueDate);
    const today = new Date();
    
    // Prazo já passou
    if (isBefore(dueDateObj, today)) {
      return "overdue";
    }
    
    // Prazo em até 3 dias
    const daysUntilDue = differenceInDays(dueDateObj, today);
    if (daysUntilDue <= 3) {
      return "approaching";
    }
    
    return "normal";
  };

  const getTaskCardClass = (task) => {
    const status = getDeadlineStatus(task.dueDate);
    
    let baseClasses = "mb-2 shadow transition-all duration-300 hover:shadow-md transform hover:-translate-y-1";
    
    switch (status) {
      case "overdue":
        return `${baseClasses} bg-red-50 border-red-300`;
      case "approaching":
        return `${baseClasses} bg-amber-50 border-amber-300`;
      default:
        return `${baseClasses}`;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500 animate-pulse">Alta</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Média</Badge>;
      case "low":
        return <Badge className="bg-green-500">Baixa</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "";
      const date = parseISO(dateString);
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quadro Kanban</h1>
        <Button onClick={() => {
          setEditingTask(null);
          setNewTask({
            title: "",
            description: "",
            priority: "medium",
            departments: [],
            assignees: [],
            dueDate: new Date().toISOString().substring(0, 10),
          });
          setIsDialogOpen(true);
        }} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

            return (
              <div key={columnId} className="flex flex-col">
                <div className="bg-muted rounded-t-md p-3 font-semibold flex items-center justify-between shadow-sm">
                  <h2 className="text-lg flex items-center">
                    {column.id === "column-1" && <ClipboardList className="w-5 h-5 mr-2 text-yellow-500" />}
                    {column.id === "column-2" && <Clock className="w-5 h-5 mr-2 text-blue-500" />}
                    {column.id === "column-3" && <CheckCircle className="w-5 h-5 mr-2 text-green-500" />}
                    {column.title}
                  </h2>
                  <Badge variant="outline" className="bg-white">{tasks.length}</Badge>
                </div>

                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-grow min-h-[500px] p-2 rounded-b-md transition-colors duration-300 ${
                        snapshot.isDraggingOver ? "bg-blue-50" : "bg-gray-50"
                      }`}
                    >
                      {tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={getTaskCardClass(task)}
                              onDoubleClick={() => handleEditTask(task)}
                            >
                              <CardHeader className="p-3 pb-0">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-base">{task.title}</CardTitle>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditTask(task);
                                      }}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 text-red-500 hover:text-red-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteTask(task.id);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="p-3">
                                <div className="mb-2 text-sm text-muted-foreground line-clamp-2">
                                  {task.description}
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2 text-xs">
                                  {getPriorityBadge(task.priority)}
                                  
                                  {getDeadlineStatus(task.dueDate) === "overdue" && (
                                    <Badge variant="outline" className="text-red-600 border-red-300 flex items-center gap-1 animate-pulse">
                                      <AlertTriangle className="h-3 w-3" />
                                      Atrasado
                                    </Badge>
                                  )}
                                  
                                  {getDeadlineStatus(task.dueDate) === "approaching" && (
                                    <Badge variant="outline" className="text-amber-600 border-amber-300 flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      Próximo
                                    </Badge>
                                  )}
                                  
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(task.dueDate)}
                                  </Badge>
                                </div>
                                
                                <div className="mt-3 flex flex-col gap-2">
                                  {task.departments && task.departments.length > 0 && (
                                    <div className="flex flex-wrap gap-1 items-center text-xs">
                                      <BarChart4 className="h-3 w-3 text-gray-500" />
                                      {task.departments.map((dept, idx) => (
                                        <Badge key={idx} variant="outline" className="bg-gray-50">
                                          {dept}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                  
                                  {task.assignees && task.assignees.length > 0 && (
                                    <div className="flex flex-wrap gap-1 items-center text-xs">
                                      <Users className="h-3 w-3 text-gray-500" />
                                      {task.assignees.map((assignee, idx) => (
                                        <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700">
                                          {assignee}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {tasks.length === 0 && (
                        <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-md text-gray-400 mt-2">
                          <p className="text-sm">Arraste tarefas para esta coluna</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Modal para criar/editar tarefa */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingTask ? "Editar Tarefa" : "Nova Tarefa"}
            </DialogTitle>
            <DialogDescription>
              {editingTask
                ? "Edite os detalhes da tarefa existente"
                : "Preencha os detalhes para criar uma nova tarefa"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                placeholder="Título da tarefa"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                placeholder="Descrição detalhada da tarefa"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                value={newTask.priority}
                onValueChange={(value) =>
                  setNewTask({ ...newTask, priority: value })
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

            <div className="grid gap-2">
              <Label>Departamentos</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newTask.departments.map((dept, idx) => (
                  <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                    {dept}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => handleRemoveDepartment(dept)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Select
                  value={newDepartment}
                  onValueChange={setNewDepartment}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecione o departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentOptions.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  onClick={handleAddDepartment}
                  disabled={!newDepartment}
                  size="icon"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Responsáveis</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newTask.assignees.map((assignee, idx) => (
                  <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                    {assignee}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => handleRemoveAssignee(assignee)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Nome do responsável"
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleAddAssignee}
                  disabled={!newAssignee.trim()}
                  size="icon"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dueDate">Data de Vencimento</Label>
              <Input
                id="dueDate"
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false);
                setEditingTask(null);
              }}
              className="transition-all duration-200"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAddOrUpdateTask}
              className="transition-all duration-200 bg-blue-600 hover:bg-blue-700"
            >
              {editingTask ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Kanban;
