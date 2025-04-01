
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from "recharts";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertCircle, BarChart4, PieChart as PieChartIcon, LineChart as LineChartIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tab, setTab] = useState("overview");
  const navigate = useNavigate();
  
  // Dados simulados para os gráficos
  const statusData = [
    { name: "Concluído", value: 12, color: "#22c55e" },
    { name: "Em Andamento", value: 18, color: "#3b82f6" },
    { name: "Pendente", value: 8, color: "#f59e0b" },
    { name: "Atrasado", value: 5, color: "#ef4444" },
  ];

  const departmentData = [
    { name: "Manutenção", total: 12 },
    { name: "Qualidade", total: 8 },
    { name: "Produção", total: 16 },
    { name: "Inovação", total: 9 },
    { name: "Administração", total: 5 },
  ];

  const progressData = [
    { name: "Jan", total: 5 },
    { name: "Fev", total: 12 },
    { name: "Mar", total: 18 },
    { name: "Abr", total: 25 },
    { name: "Mai", total: 32 },
    { name: "Jun", total: 45 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Concluído":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "Em Andamento":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "Pendente":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "Atrasado":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const totalTasks = statusData.reduce((acc, item) => acc + item.value, 0);
  const completedTasks = statusData.find(item => item.name === "Concluído")?.value || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleStatusCardClick = (status) => {
    navigate(`/tarefas?status=${status}`);
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card 
          className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-slate-50"
          onClick={() => handleStatusCardClick("all")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <BarChart4 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              Todas as tarefas do sistema
            </p>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-green-50"
          onClick={() => handleStatusCardClick("Concluído")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {completionRate}% do total de tarefas
            </p>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-blue-50"
          onClick={() => handleStatusCardClick("Em Andamento")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusData.find(item => item.name === "Em Andamento")?.value || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Tarefas em execução no momento
            </p>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-red-50"
          onClick={() => handleStatusCardClick("Atrasado")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Atrasadas</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {statusData.find(item => item.name === "Atrasado")?.value || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Atenção: requerem ação imediata
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" value={tab} onValueChange={setTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="overview" className="flex items-center">
            <PieChartIcon className="h-4 w-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center">
            <BarChart4 className="h-4 w-4 mr-2" />
            Departamentos
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center">
            <LineChartIcon className="h-4 w-4 mr-2" />
            Progresso
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status das Tarefas</CardTitle>
              <CardDescription>
                Distribuição de tarefas por status
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {statusData.map((status) => (
                  <div 
                    key={status.name} 
                    className="flex items-center p-2 border rounded-md cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-slate-50 hover:scale-105"
                    onClick={() => handleStatusCardClick(status.name)}
                  >
                    {getStatusIcon(status.name)}
                    <div className="ml-2">
                      <div className="text-sm font-medium">{status.name}</div>
                      <div className="text-xs text-muted-foreground">{status.value} tarefas</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tarefas por Departamento</CardTitle>
              <CardDescription>
                Distribuição de tarefas entre departamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#3b82f6" name="Número de Tarefas">
                      <LabelList dataKey="total" position="inside" fill="#ffffff" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progresso ao Longo do Tempo</CardTitle>
              <CardDescription>
                Evolução das tarefas concluídas
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#3b82f6" name="Tarefas Concluídas" activeDot={{ r: 8 }}>
                      <LabelList dataKey="total" position="top" />
                    </Line>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
