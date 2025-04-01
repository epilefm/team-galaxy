
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
  X,
  ChevronDown,
  ChevronRight,
  ListChecks
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format, isAfter, isBefore, parseISO, differenceInDays, isValid, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
      subtasks: [],
      completedDate: null
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
      subtasks: [],
      completedDate: null
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
      subtasks: [],
      completedDate: "2023-08-10"
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
      subtasks: [],
      completedDate: null
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
      subtasks: [],
      completedDate: null
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
    subtasks: [],
    completedDate: null
  });
  
  const [newAssignee, setNewAssignee] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
  const [newSubtask, setNewSubtask] = useState({
    id: "",
    title: "",
    description: "",
    priority: "medium",
    assignees: [],
    dueDate: new Date().toISOString().substring(0, 10),
    status: "Pendente",
    completedDate: null
  });
  const [parentTaskId, setParentTaskId] = useState(null);
  const [editingSubtaskIndex, setEditingSubtaskIndex] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState({});
  
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

    // Se estiver movendo para a coluna "Concluído", atualizar a data de conclusão
    const updatedTasks = { ...data.tasks };
    if (destColumn.title === "Concluído" && !updatedTasks[draggableId].completedDate) {
      updatedTasks[draggableId] = {
        ...updatedTasks[draggableId],
        completedDate: new Date().toISOString().substring(0, 10)
      };
    }
    // Se estiver saindo da coluna "Concluído", remover a data de conclusão
    else if (sourceColumn.title === "Concluído" && destColumn.title !== "Concluído") {
      updatedTasks[draggableId] = {
        ...updatedTasks[draggableId],
        completedDate: null
      };
    }

    setData({
      ...data,
      tasks: updatedTasks,
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
      subtasks: task.subtasks || [],
      completedDate: task.completedDate
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
      subtasks: [],
      completedDate: null
    });
    setEditingTask(null);
    setIsDialogOpen(false);
  };

  const handleOpenSubtaskModal = (taskId, subtaskIndex = null) => {
    setParentTaskId(taskId);
    
    if (subtaskIndex !== null) {
      // Editando subtarefa existente
      const subtask = data.tasks[taskId].subtasks[subtaskIndex];
      setNewSubtask({
        ...subtask
      });
      setEditingSubtaskIndex(subtaskIndex);
    } else {
      // Nova subtarefa
      setNewSubtask({
        id: `subtask-${Date.now()}`,
        title: "",
        description: "",
        priority: "medium",
        assignees: [],
        dueDate: new Date().toISOString().substring(0, 10),
        status: "Pendente",
        completedDate: null
      });
      setEditingSubtaskIndex(null);
    }
    
    setIsSubtaskModalOpen(true);
  };

  const handleAddOrUpdateSubtask = () => {
    if (!newSubtask.title.trim()) {
      toast({
        title: "Erro",
        description: "O título da subtarefa é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const updatedTasks = { ...data.tasks };
    const parentTask = { ...updatedTasks[parentTaskId] };
    const subtasks = [...(parentTask.subtasks || [])];

    if (editingSubtaskIndex !== null) {
      // Atualizando subtarefa existente
      subtasks[editingSubtaskIndex] = newSubtask;
    } else {
      // Adicionando nova subtarefa
      subtasks.push(newSubtask);
    }

    parentTask.subtasks = subtasks;
    updatedTasks[parentTaskId] = parentTask;

    setData({
      ...data,
      tasks: updatedTasks
    });

    toast({
      title: editingSubtaskIndex !== null ? "Subtarefa atualizada" : "Subtarefa adicionada",
      description: editingSubtaskIndex !== null 
        ? "A subtarefa foi atualizada com sucesso" 
        : "A nova subtarefa foi adicionada com sucesso",
    });

    setIsSubtaskModalOpen(false);
  };

  const handleDeleteSubtask = (taskId, subtaskIndex) => {
    const updatedTasks = { ...data.tasks };
    const parentTask = { ...updatedTasks[taskId] };
    const subtasks = [...parentTask.subtasks];
    
    subtasks.splice(subtaskIndex, 1);
    parentTask.subtasks = subtasks;
    updatedTasks[taskId] = parentTask;

    setData({
      ...data,
      tasks: updatedTasks
    });

    toast({
      title: "Subtarefa excluída",
      description: "A subtarefa foi excluída com sucesso",
      variant: "destructive",
    });
  };

  const handleUpdateSubtaskStatus = (taskId, subtaskIndex, newStatus) => {
    const updatedTasks = { ...data.tasks };
    const parentTask = { ...updatedTasks[taskId] };
    const subtasks = [...parentTask.subtasks];
    
    subtasks[subtaskIndex] = {
      ...subtasks[subtaskIndex],
      status: newStatus,
      completedDate: newStatus === "Concluído" ? new Date().toISOString().substring(0, 10) : null
    };
    
    parentTask.subtasks = subtasks;
    updatedTasks[taskId] = parentTask;

    setData({
      ...data,
      tasks: updatedTasks
    });

    toast({
      title: "Status atualizado",
      description: `Status da subtarefa atualizado para ${newStatus}`,
    });
  };

  const toggleTaskExpanded = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // Função para verificar o status do prazo
  const getDeadlineStatus = (dueDate, completedDate = null) => {
    if (!dueDate || !isValid(parseISO(dueDate))) return "normal";
    
    const dueDateObj = parseISO(dueDate);
    const today = new Date();
    
    // Se a tarefa foi concluída
    if (completedDate) {
      const completedDateObj = parseISO(completedDate);
      
      // Concluída no prazo (antes ou no dia da data limite)
      if (isBefore(completedDateObj, addDays(dueDateObj, 1))) {
        return "completed-on-time";
      }
      
      // Concluída com até 3 dias de atraso
      const daysLate = differenceInDays(completedDateObj, dueDateObj);
      if (daysLate <= 3) {
        return "completed-slightly-late";
      }
      
      // Concluída com mais de 3 dias de atraso
      return "completed-late";
    }
    
    // Prazo já passou (não concluída)
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
    const status = getDeadlineStatus(task.dueDate, task.completedDate);
    
    let baseClasses = "mb-2 shadow transition-all duration-300 hover:shadow-md transform hover:-translate-y-1";
    
    switch (status) {
      case "completed-on-time":
        return `${baseClasses} bg-green-50 border-green-200`;
      case "completed-slightly-late":
        return `${baseClasses} bg-amber-50 border-amber-200`;
      case "completed-late":
        return `${baseClasses} bg-orange-50 border-orange-200`;
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
      case "urgent":
        return <Badge className="bg-purple-600 animate-pulse">Urgente</Badge>;
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

  const getSubtaskStatusBadge = (status) => {
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

  const countSubtasksCompleted = (subtasks) => {
    if (!subtasks || subtasks.length === 0) return "0/0";
    const completed = subtasks.filter(subtask => subtask.status === "Concluído").length;
    return `${completed}/${subtasks.length}`;
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
            subtasks: [],
            completedDate: null
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
                            <div>
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
                                  
                                  {task.subtasks && task.subtasks.length > 0 && (
                                    <div className="mb-2">
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="p-0 h-6 text-xs flex items-center text-muted-foreground hover:text-foreground"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleTaskExpanded(task.id);
                                        }}
                                      >
                                        {expandedTasks[task.id] ? <ChevronDown className="h-3 w-3 mr-1" /> : <ChevronRight className="h-3 w-3 mr-1" />}
                                        <ListChecks className="h-3 w-3 mr-1" /> 
                                        Subtarefas {countSubtasksCompleted(task.subtasks)}
                                      </Button>
                                      
                                      {expandedTasks[task.id] && (
                                        <div className="mt-2 pl-2 border-l-2 border-gray-200">
                                          {task.subtasks.map((subtask, idx) => (
                                            <div key={subtask.id} className="mb-1 pb-1 text-xs border-b border-gray-100 last:border-b-0">
                                              <div className="flex items-center justify-between">
                                                <div className="font-medium">{subtask.title}</div>
                                                <div className="flex gap-1">
                                                  {getSubtaskStatusBadge(subtask.status)}
                                                  <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-5 w-5"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleOpenSubtaskModal(task.id, idx);
                                                    }}
                                                  >
                                                    <Pencil className="h-3 w-3" />
                                                  </Button>
                                                  <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-5 w-5 text-red-500"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleDeleteSubtask(task.id, idx);
                                                    }}
                                                  >
                                                    <X className="h-3 w-3" />
                                                  </Button>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                          
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="mt-1 h-6 text-xs flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-0"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleOpenSubtaskModal(task.id);
                                            }}
                                          >
                                            <PlusCircle className="h-3 w-3 mr-1" /> 
                                            Adicionar subtarefa
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  <div className="flex flex-wrap gap-2 mt-2 text-xs">
                                    {getPriorityBadge(task.priority)}
                                    
                                    {getDeadlineStatus(task.dueDate, task.completedDate) === "overdue" && (
                                      <Badge variant="outline" className="text-red-600 border-red-300 flex items-center gap-1 animate-pulse">
                                        <AlertTriangle className="h-3 w-3" />
                                        Atrasado
                                      </Badge>
                                    )}
                                    
                                    {getDeadlineStatus(task.dueDate, task.completedDate) === "approaching" && (
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
                            </div>
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
                  <SelectItem value="urgent">Urgente</SelectItem>
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
            
            {editingTask && editingTask.subtasks && editingTask.subtasks.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <Label>Subtarefas</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => handleOpenSubtaskModal(editingTask.id)}
                  >
                    <PlusCircle className="h-3 w-3 mr-1" /> Adicionar subtarefa
                  </Button>
                </div>
                
                <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                  {editingTask.subtasks.map((subtask, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b last:border-b-0">
                      <div className="text-sm font-medium">{subtask.title}</div>
                      <div className="flex items-center gap-2">
                        {getSubtaskStatusBadge(subtask.status)}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => handleOpenSubtaskModal(editingTask.id, idx)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {editingTask && !editingTask.subtasks?.length && (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenSubtaskModal(editingTask.id)}
                className="flex items-center mt-2"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar subtarefas
              </Button>
            )}
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
      
      {/* Modal de subtarefas */}
      <Dialog open={isSubtaskModalOpen} onOpenChange={setIsSubtaskModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingSubtaskIndex !== null ? "Editar Subtarefa" : "Nova Subtarefa"}
            </DialogTitle>
            <DialogDescription>
              {editingSubtaskIndex !== null 
                ? "Edite os detalhes da subtarefa existente" 
                : "Preencha os detalhes para criar uma nova subtarefa"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subtask-title">Título</Label>
              <Input
                id="subtask-title"
                value={newSubtask.title}
                onChange={(e) => setNewSubtask({ ...newSubtask, title: e.target.value })}
                placeholder="Título da subtarefa"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="subtask-description">Descrição</Label>
              <Textarea
                id="subtask-description"
                value={newSubtask.description}
                onChange={(e) => setNewSubtask({ ...newSubtask, description: e.target.value })}
                placeholder="Descrição detalhada da subtarefa"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="subtask-priority">Prioridade</Label>
                <Select
                  value={newSubtask.priority}
                  onValueChange={(value) => setNewSubtask({ ...newSubtask, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgente</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="subtask-status">Status</Label>
                <Select
                  value={newSubtask.status}
                  onValueChange={(value) => setNewSubtask({ ...newSubtask, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="subtask-duedate">Data de Vencimento</Label>
              <Input
                id="subtask-duedate"
                type="date"
                value={newSubtask.dueDate}
                onChange={(e) => setNewSubtask({ ...newSubtask, dueDate: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubtaskModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddOrUpdateSubtask}>
              {editingSubtaskIndex !== null ? "Atualizar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Kanban;
