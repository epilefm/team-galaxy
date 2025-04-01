
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "./components/theme-provider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Tarefas from './pages/Tarefas';
import Kanban from './pages/Kanban';
import Usuarios from './pages/Usuarios';
import Projects from './pages/Projects';
import SiteLayout from './components/SiteLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Criar a instância do cliente de query
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<SiteLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tarefas" element={<Tarefas />} />
                <Route path="/kanban" element={<Kanban />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/projects" element={<Projects />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
