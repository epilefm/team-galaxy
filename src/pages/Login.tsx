
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de login - em um sistema real, isto conectaria a um backend
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulando credenciais válidas
      if (email === "admin@example.com" && password === "password") {
        // Armazenar dados do usuário no localStorage
        localStorage.setItem("user", JSON.stringify({ 
          id: "1", 
          name: "Admin User", 
          email: "admin@example.com",
          role: "admin",
          department: "Administração"
        }));
        localStorage.setItem("isLoggedIn", "true");
        
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo ao Task Manager Pro!",
        });
        
        navigate("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Falha no login",
          description: "Email ou senha incorretos. Use admin@example.com / password.",
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center font-bold">Task Manager Pro</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemplo@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-muted-foreground mt-2 w-full">
              Use email: admin@example.com / senha: password
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
