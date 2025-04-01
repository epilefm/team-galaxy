
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  User, 
  BarChart4, 
  AlertTriangle,
  CheckCircle,
  ClipboardList,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const initialData = {
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Manutenção preventiva da linha 1",
      description: "Realizar inspeção e manutenção preventiva de rotina na linha de produção 1",
      priority: "medium",
      department: "Manutenção",
      assignee: "João Silva",
      dueDate: "2023-07-30",
      createdAt: "2023-07-15",
    },
    "task-2": {
      id: "task-2",
      title: "Auditoria de qualidade",
      description: "Conduzir auditoria de qualidade no processo de produção conforme procedimentos ISO",
      priority: "high",
      department: "Qualidade",
      assignee: "Maria Santos",
      dueDate: "2023-07-25",
      createdAt: "2023-07-10",
    },
    "task-3": {
      id: "task-3",
      title: "Implementar novo sistema de monitoramento",
      description: "Instalar e configurar o novo sistema de monitoramento em tempo real para a linha de produção",
      priority: "high",
      department: "Inovação",
      assignee: "Carlos Oliveira",
      dueDate: "2023-08-15",
      createdAt: "2023-07-05",
    },
    "task-4": {
      id: "task-4",
      title: "Treinamento de segurança",
      description: "Conduzir treinamento de segurança para novos funcionários da produção",
      priority: "medium",
      department: "Produção",
      assignee: "Ana Costa",
      dueDate: "2023-07-28",
      createdAt: "2023-07-12",
    },
    "task-5": {
      id: "task-5",
      title: "Revisar procedimentos de manutenção",
      description: "Atualizar documentação de procedimentos de manutenção preventiva e corretiva",
      priority: "low",
      department: "Manutenção",
      assignee: "Pedro Alves",
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

const Kanban = () => {
  const [data, setData] = useState(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    department: "Produção",
    assignee: "",
    dueDate: new Date().toISOString().substring(0, 10),
  });
  
  const { toast } = useToast();

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
      department: task.department,
      assignee: task.assignee,
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
      department: "Produção",
      assignee: "",
      dueDate: new Date().toISOString().substring(0, 10),
    });
    setEditingTask(null);
    setIsDialogOpen(false);
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
            department: "Produção",
            assignee: "",
            dueDate: new Date().toISOString().substring(0, 10),
          });
          setIsDialogOpen(true);
        }} className="flex items-center gap-1">
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
                <div className="bg-muted rounded-t-md p-2 font-semibold flex items-center justify-between">
                  <h2 className="text-lg">{column.title}</h2>
                  <Badge variant="outline">{tasks.length}</Badge>
                </div>

                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-grow min-h-[500px] p-2 rounded-b-md ${
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
                              className={`mb-2 shadow ${
                                snapshot.isDragging ? "shadow-lg" : ""
                              }`}
                            >
                              <CardHeader className="p-3 pb-0">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-base">{task.title}</CardTitle>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => handleEditTask(task)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 text-red-500 hover:text-red-700"
                                      onClick={() => handleDeleteTask(task.id)}
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
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {task.assignee}
                                  </Badge>
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <BarChart4 className="h-3 w-3" />
                                    {task.department}
                                  </Badge>
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {task.dueDate}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
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
            <DialogTitle>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="department">Departamento</Label>
                <Select
                  value={newTask.department}
                  onValueChange={(value) =>
                    setNewTask({ ...newTask, department: value })
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="assignee">Responsável</Label>
                <Input
                  id="assignee"
                  value={newTask.assignee}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assignee: e.target.value })
                  }
                  placeholder="Nome do responsável"
                />
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
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false);
                setEditingTask(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddOrUpdateTask}>
              {editingTask ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Kanban;
