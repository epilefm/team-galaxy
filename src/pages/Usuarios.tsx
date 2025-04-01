
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Search, 
  Plus, 
  MoreVertical, 
  ShieldCheck, 
  ShieldAlert, 
  Pencil, 
  Trash2, 
  UserCheck, 
  UserPlus,
  Mail,
  BarChart4,
  Key,
  Eye,
  EyeOff
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Dados de exemplo
const initialUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    department: "Administração",
    role: "admin",
    status: "active",
    password: "admin123"  // Normalmente, armazenaríamos apenas hashes, não senhas em texto plano
  },
  {
    id: "2",
    name: "João Silva",
    email: "joao.silva@example.com",
    department: "Manutenção",
    role: "user",
    status: "active",
    password: "joao123"
  },
  {
    id: "3",
    name: "Maria Santos",
    email: "maria.santos@example.com",
    department: "Qualidade",
    role: "user",
    status: "active",
    password: "maria123"
  },
  {
    id: "4",
    name: "Carlos Oliveira",
    email: "carlos.oliveira@example.com",
    department: "Inovação",
    role: "admin",
    status: "active",
    password: "carlos123"
  },
  {
    id: "5",
    name: "Ana Costa",
    email: "ana.costa@example.com",
    department: "Produção",
    role: "user",
    status: "inactive",
    password: "ana123"
  },
  {
    id: "6",
    name: "Pedro Alves",
    email: "pedro.alves@example.com",
    department: "Manutenção",
    role: "user",
    status: "active",
    password: "pedro123"
  },
];

const Usuarios = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userPassword, setUserPassword] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    department: "Produção",
    role: "user",
    status: "active",
    password: "",
  });

  const { toast } = useToast();

  // Simula um usuário logado (em um app real, isso viria de um contexto de autenticação)
  const loggedUser = { email: "admin@example.com", role: "admin" };
  const isAdmin = loggedUser.role === "admin";

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Erro",
        description: "Nome, email e senha são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Validação simples de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email válido",
        variant: "destructive",
      });
      return;
    }

    // Verificar se o email já existe
    if (users.some(user => user.email === newUser.email)) {
      toast({
        title: "Erro",
        description: "Este email já está cadastrado",
        variant: "destructive",
      });
      return;
    }

    const user = {
      id: `${Date.now()}`,
      ...newUser,
    };

    setUsers([...users, user]);
    
    toast({
      title: "Usuário adicionado",
      description: "O usuário foi adicionado com sucesso",
    });
    
    setNewUser({
      name: "",
      email: "",
      department: "Produção",
      role: "user",
      status: "active",
      password: "",
    });
    setIsAddUserOpen(false);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role,
      status: user.status,
      password: user.password,
    });
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Validação simples de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email válido",
        variant: "destructive",
      });
      return;
    }

    // Verificar se o email já existe em outros usuários
    if (users.some(user => user.email === newUser.email && user.id !== selectedUser.id)) {
      toast({
        title: "Erro",
        description: "Este email já está em uso por outro usuário",
        variant: "destructive",
      });
      return;
    }

    setUsers(
      users.map((user) =>
        user.id === selectedUser.id ? { ...user, ...newUser } : user
      )
    );
    
    toast({
      title: "Usuário atualizado",
      description: "O usuário foi atualizado com sucesso",
    });
    
    setIsEditUserOpen(false);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setIsDeleteUserOpen(true);
  };

  const handleConfirmDelete = () => {
    // Verificar se é o último administrador
    const adminCount = users.filter(user => user.role === "admin").length;
    if (adminCount <= 1 && selectedUser.role === "admin") {
      toast({
        title: "Operação não permitida",
        description: "Não é possível excluir o último administrador",
        variant: "destructive",
      });
      setIsDeleteUserOpen(false);
      return;
    }

    setUsers(users.filter((user) => user.id !== selectedUser.id));
    
    toast({
      title: "Usuário excluído",
      description: "O usuário foi excluído com sucesso",
      variant: "destructive",
    });
    
    setIsDeleteUserOpen(false);
  };

  const handleViewPassword = (user) => {
    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem gerenciar senhas",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedUser(user);
    setUserPassword(user.password);
    setNewPassword("");
    setPasswordVisible(false);
    setIsPasswordDialogOpen(true);
  };

  const handleUpdatePassword = () => {
    if (!newPassword.trim()) {
      toast({
        title: "Erro",
        description: "A nova senha não pode estar vazia",
        variant: "destructive",
      });
      return;
    }

    // Atualiza a senha do usuário selecionado
    setUsers(
      users.map((user) =>
        user.id === selectedUser.id ? { ...user, password: newPassword } : user
      )
    );

    toast({
      title: "Senha atualizada",
      description: "A senha foi atualizada com sucesso",
    });

    setIsPasswordDialogOpen(false);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-purple-600 hover:bg-purple-700 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Admin
          </Badge>
        );
      case "user":
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1">
            <UserCheck className="h-3 w-3" />
            Usuário
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Ativo</Badge>;
      case "inactive":
        return <Badge variant="outline" className="text-gray-500 border-gray-500">Inativo</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Users className="h-6 w-6 mr-2" />
          Gerenciamento de Usuários
        </h1>
        <Button onClick={() => setIsAddUserOpen(true)} className="flex items-center gap-1">
          <UserPlus className="h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Pesquisar</CardTitle>
          <CardDescription>
            Encontre usuários pelo nome, email ou departamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar usuários..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="border rounded-md shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Nome</TableHead>
              <TableHead className="w-[250px]">Email</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center w-fit gap-1">
                      <BarChart4 className="h-3 w-3" />
                      {user.department}
                    </Badge>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        {isAdmin && (
                          <DropdownMenuItem onClick={() => handleViewPassword(user)}>
                            <Key className="mr-2 h-4 w-4" />
                            <span>Gerenciar Senha</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600"
                          disabled={user.email === "admin@example.com"}
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

      {/* Modais */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar um novo usuário no sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Nome completo do usuário"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Digite a senha"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Departamento</Label>
              <Select
                value={newUser.department}
                onValueChange={(value) => setNewUser({ ...newUser, department: value })}
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
              <Label htmlFor="role">Função</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="user">Usuário</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newUser.status}
                onValueChange={(value) => setNewUser({ ...newUser, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddUser}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário selecionado.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nome Completo</Label>
                <Input
                  id="edit-name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  disabled={selectedUser.email === "admin@example.com"}
                />
                {selectedUser.email === "admin@example.com" && (
                  <p className="text-xs text-muted-foreground">
                    O email do usuário administrador principal não pode ser alterado.
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-department">Departamento</Label>
                <Select
                  value={newUser.department}
                  onValueChange={(value) => setNewUser({ ...newUser, department: value })}
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
                <Label htmlFor="edit-role">Função</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                  disabled={selectedUser.email === "admin@example.com"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="user">Usuário</SelectItem>
                  </SelectContent>
                </Select>
                {selectedUser.email === "admin@example.com" && (
                  <p className="text-xs text-muted-foreground">
                    A função do usuário administrador principal não pode ser alterada.
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={newUser.status}
                  onValueChange={(value) => setNewUser({ ...newUser, status: value })}
                  disabled={selectedUser.email === "admin@example.com"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                {selectedUser.email === "admin@example.com" && (
                  <p className="text-xs text-muted-foreground">
                    O status do usuário administrador principal não pode ser alterado.
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateUser}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Gerenciar Senha</DialogTitle>
            <DialogDescription>
              {selectedUser && `Visualize ou altere a senha de ${selectedUser.name}`}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Senha Atual</Label>
                <div className="relative">
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    value={userPassword}
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Nova Senha</Label>
                <div className="relative">
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Digite a nova senha"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdatePassword}>Atualizar Senha</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <p className="font-semibold">{selectedUser.name}</p>
              <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              <div className="mt-2 flex gap-2">
                {getRoleBadge(selectedUser.role)}
                {getStatusBadge(selectedUser.status)}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteUserOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Usuarios;
