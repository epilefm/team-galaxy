import React, { useState } from "react";
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
      title: "Planejar estrutura do projeto",
      description: "Definir as principais tecnologias e bibliotecas a serem utilizadas.",
      priority: "high",
      department: "Desenvolvimento",
      assignee: "João",
      dueDate: "2024-07-10",
    },
    "task-2": {
      id: "task-2",
      title: "Configurar ambiente de desenvolvimento",
      description: "Instalar as dependências e configurar o ambiente para todos os desenvolvedores.",
      priority: "medium",
      department: "Infraestrutura",
      assignee: "Maria",
      dueDate: "2024-07-12",
    },
    "task-3": {
      id: "task-3",
      title: "Implementar autenticação de usuários",
      description: "Criar o sistema de login e registro de usuários com segurança.",
      priority: "high",
      department: "Desenvolvimento",
      assignee: "Carlos",
      dueDate: "2024-07-15",
    },
    "task-4": {
      id: "task-4",
      title: "Desenvolver interface do usuário",
      description: "Criar a interface principal do usuário com React e Tailwind CSS.",
      priority: "medium",
      department: "Design",
      assignee: "Ana",
      dueDate: "2024-07-18",
    },
    "task-5": {
      id: "task-5",
      title: "Testar funcionalidades básicas",
      description: "Realizar testes unitários e de integração nas principais funcionalidades.",
      priority: "medium",
      department: "Qualidade",
      assignee: "Lucas",
      dueDate: "2024-07-20",
    },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "A Fazer",
      taskIds: ["task-1", "task-2"],
    },
    "column-2": {
      id: "column-2",
      title: "Em Progresso",
      taskIds: ["task-3"],
    },
    "column-3": {
      id: "column-3",
      title: "Concluído",
      taskIds: ["task-4", "task-5"],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
};

const Kanban = () => {
  const [data, setData] = useState(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    department: "Produção",
    assignee: "",
    dueDate: new Date().toISOString().substring(0, 10),
  });
  const [editingTask, setEditingTask] = useState(null);
  const { toast } = useToast();

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newData);
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setData(newData);
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
    const newData = {
      ...data,
      tasks: { ...data.tasks },
      columns: { ...data.columns },
    };

    delete newData.tasks[taskId];

    for (const columnId in newData.columns) {
      newData.columns[columnId].taskIds = newData.columns[columnId].taskIds.filter(
        (id) => id !== taskId
      );
    }

    setData(newData);
    toast({
      title: "Tarefa excluída!",
      description: "A tarefa foi removida com sucesso.",
    });
  };

  const handleAddOrUpdateTask = () => {
    if (newTask.title.trim() === "" || newTask.description.trim() === "") {
      toast({
        title: "Erro!",
        description: "Título e descrição são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const taskId = editingTask ? editingTask.id : `task-${Date.now()}`;
    const updatedTask = {
      id: taskId,
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      department: newTask.department,
      assignee: newTask.assignee,
      dueDate: newTask.dueDate,
    };

    const newData = {
      ...data,
      tasks: {
        ...data.tasks,
        [taskId]: updatedTask,
      },
    };

    if (!editingTask) {
      const columnId = "column-1";
      newData.columns[columnId].taskIds = [
        taskId,
        ...newData.columns[columnId].taskIds,
      ];
    }

    setData(newData);
    setIsDialogOpen(false);
    setEditingTask(null);
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      department: "Produção",
      assignee: "",
      dueDate: new Date().toISOString().substring(0, 10),
    });

    toast({
      title: editingTask ? "Tarefa atualizada!" : "Tarefa adicionada!",
      description: "A tarefa foi salva com sucesso.",
    });
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Alta
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Média
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Baixa
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <ClipboardList className="h-3 w-3" />
            Normal
          </Badge>
        );
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
            <DialogDescription>
              {editingTask
                ? "Edite os campos da tarefa."
                : "Adicione uma nova tarefa ao quadro."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Título
              </Label>
              <Input
                type="text"
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Prioridade
              </Label>
              <Select
                onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                defaultValue={newTask.priority}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Departamento
              </Label>
              <Select
                onValueChange={(value) =>
                  setNewTask({ ...newTask, department: value })
                }
                defaultValue={newTask.department}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Produção">Produção</SelectItem>
                  <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Qualidade">Qualidade</SelectItem>
                  <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignee" className="text-right">
                Responsável
              </Label>
              <Input
                type="text"
                id="assignee"
                value={newTask.assignee}
                onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Data de Entrega
              </Label>
              <Input
                type="date"
                id="dueDate"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleAddOrUpdateTask}>
              {editingTask ? "Salvar Alterações" : "Adicionar Tarefa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Kanban;
