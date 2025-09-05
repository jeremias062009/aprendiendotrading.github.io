import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function AdminLoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoginModalOpen, closeLoginModal, login } = useAdmin();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/admin/login", credentials);
      return response.json();
    },
    onSuccess: (data) => {
      login(data.admin);
      closeLoginModal();
      setEmail("");
      setPassword("");
      toast({
        title: "Bienvenido",
        description: "Has iniciado sesión como administrador.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Credenciales incorrectas. Verifica tu email y contraseña.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={closeLoginModal}>
      <DialogContent className="sm:max-w-md" data-testid="modal-admin-login">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Admin Login</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@email.com"
              required
              data-testid="input-admin-email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              required
              data-testid="input-admin-password"
            />
          </div>
          <div className="flex space-x-2">
            <Button
              type="submit"
              className="flex-1"
              disabled={loginMutation.isPending}
              data-testid="button-admin-submit"
            >
              {loginMutation.isPending ? "Iniciando..." : "Iniciar Sesión"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={closeLoginModal}
              className="flex-1"
              data-testid="button-admin-cancel"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
