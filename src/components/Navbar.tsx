
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  KanbanSquare, 
  ClipboardList, 
  Users, 
  LogOut, 
  Menu, 
  X,
  ChevronDown
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5 mr-2" /> },
    { path: "/kanban", label: "Kanban", icon: <KanbanSquare className="h-5 w-5 mr-2" /> },
    { path: "/tarefas", label: "Tarefas", icon: <ClipboardList className="h-5 w-5 mr-2" /> },
    { path: "/usuarios", label: "Usuários", icon: <Users className="h-5 w-5 mr-2" /> },
  ];

  // Componente para os links de navegação
  const NavLinks = ({ onClick = () => {} }) => (
    <>
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            location.pathname === item.path
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
          onClick={onClick}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center mr-4 font-semibold">
          <KanbanSquare className="h-6 w-6 mr-2 text-blue-600" />
          <span className="hidden md:inline-block">Task Manager Pro</span>
        </div>

        {!isMobile ? (
          <nav className="flex items-center space-x-2 lg:space-x-4 mx-6">
            <NavLinks />
          </nav>
        ) : (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[280px]">
              <div className="px-2 py-6 flex flex-col gap-4">
                <div className="flex items-center mb-4 px-2">
                  <KanbanSquare className="h-6 w-6 mr-2 text-blue-600" />
                  <span className="font-semibold">Task Manager Pro</span>
                </div>
                <nav className="flex flex-col space-y-2">
                  <NavLinks onClick={() => setOpen(false)} />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        )}

        <div className="flex-1" />

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block">{user.name}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Navbar;
