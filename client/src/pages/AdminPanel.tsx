import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { BookOpen, Video, TrendingUp, Users, BookCheck, RefreshCw, Database } from "lucide-react";
import { Link } from "wouter";

export default function AdminPanel() {
  const { user, logout } = useAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateEbookOpen, setIsCreateEbookOpen] = useState(false);
  const [isCreateTutorialOpen, setIsCreateTutorialOpen] = useState(false);

  // Fetch admin stats
  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    refetchInterval: 30000,
  });

  // Fetch all content for management
  const { data: ebooks = [] } = useQuery<any[]>({
    queryKey: ["/api/ebooks"],
  });

  const { data: tutorials = [] } = useQuery<any[]>({
    queryKey: ["/api/tutorials"],
  });

  const { data: aiStrategies = [] } = useQuery<any[]>({
    queryKey: ["/api/ai-strategies"],
  });

  // eBook creation mutation
  const createEbookMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/admin/ebooks", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ebooks"] });
      setIsCreateEbookOpen(false);
      toast({ title: "eBook creado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al crear eBook", variant: "destructive" });
    },
  });

  // Tutorial creation mutation
  const createTutorialMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/admin/tutorials", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tutorials"] });
      setIsCreateTutorialOpen(false);
      toast({ title: "Tutorial creado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al crear tutorial", variant: "destructive" });
    },
  });

  // Delete mutations
  const deleteEbookMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/ebooks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ebooks"] });
      toast({ title: "eBook eliminado exitosamente" });
    },
  });

  const deleteTutorialMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/tutorials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tutorials"] });
      toast({ title: "Tutorial eliminado exitosamente" });
    },
  });

  const handleCreateEbook = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const ebookData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      content: { chapters: [] }, // Initialize with empty structure
      chapters: parseInt(formData.get('chapters') as string) || 1,
      duration: formData.get('duration') as string,
      category: formData.get('category') as string,
      imageUrl: formData.get('imageUrl') as string,
      isPublished: formData.get('isPublished') === 'on',
    };

    createEbookMutation.mutate(ebookData);
  };

  const handleCreateTutorial = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const tutorialData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      platform: formData.get('platform') as string,
      content: { steps: [] }, // Initialize with empty structure
      steps: [],
      videoUrl: formData.get('videoUrl') as string,
      imageUrl: formData.get('imageUrl') as string,
      isPublished: formData.get('isPublished') === 'on',
    };

    createTutorialMutation.mutate(tutorialData);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Acceso no autorizado</p>
            <Link href="/">
              <Button className="w-full mt-4">Volver al inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Panel de Administración</h1>
            <p className="text-muted-foreground">Bienvenido, {user.email}</p>
          </div>
          <Button variant="destructive" onClick={logout} data-testid="button-admin-logout">
            Cerrar Sesión
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-chart-1" />
                <h3 className="font-semibold text-chart-1">Usuarios Activos</h3>
              </div>
              <p className="text-3xl font-bold mt-2" data-testid="stat-active-users">
                {statsLoading ? "..." : stats?.activeUsers?.toLocaleString() || "0"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <BookCheck className="w-5 h-5 text-chart-2" />
                <h3 className="font-semibold text-chart-2">eBooks Completados</h3>
              </div>
              <p className="text-3xl font-bold mt-2" data-testid="stat-completed-ebooks">
                {statsLoading ? "..." : stats?.completedEbooks?.toLocaleString() || "0"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-chart-3" />
                <h3 className="font-semibold text-chart-3">Referidos BingX</h3>
              </div>
              <p className="text-3xl font-bold mt-2" data-testid="stat-referrals">
                {statsLoading ? "..." : stats?.referrals?.toLocaleString() || "0"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-chart-4" />
                <h3 className="font-semibold text-chart-4">Tiempo Real</h3>
              </div>
              <p className="text-3xl font-bold mt-2 text-chart-1 pulse-animation">●</p>
              <p className="text-xs text-muted-foreground">Conectado</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Management Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Gestión de Contenido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Dialog open={isCreateEbookOpen} onOpenChange={setIsCreateEbookOpen}>
                <DialogTrigger asChild>
                  <Button className="p-6 h-auto flex flex-col gap-2" data-testid="button-create-ebook">
                    <BookOpen className="w-8 h-8" />
                    <span>Crear eBook</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo eBook</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateEbook} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Título</Label>
                        <Input id="title" name="title" required data-testid="input-ebook-title" />
                      </div>
                      <div>
                        <Label htmlFor="category">Categoría</Label>
                        <Select name="category" required>
                          <SelectTrigger data-testid="select-ebook-category">
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basics">Básico</SelectItem>
                            <SelectItem value="intermediate">Intermedio</SelectItem>
                            <SelectItem value="advanced">Avanzado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea id="description" name="description" required data-testid="textarea-ebook-description" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="chapters">Capítulos</Label>
                        <Input id="chapters" name="chapters" type="number" defaultValue="1" min="1" required />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duración</Label>
                        <Input id="duration" name="duration" placeholder="ej: 4h" required />
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Switch id="isPublished" name="isPublished" />
                        <Label htmlFor="isPublished">Publicado</Label>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="imageUrl">URL de Imagen</Label>
                      <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://..." />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsCreateEbookOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={createEbookMutation.isPending} data-testid="button-save-ebook">
                        {createEbookMutation.isPending ? "Creando..." : "Crear eBook"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isCreateTutorialOpen} onOpenChange={setIsCreateTutorialOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="p-6 h-auto flex flex-col gap-2" data-testid="button-create-tutorial">
                    <Video className="w-8 h-8" />
                    <span>Crear Tutorial</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Tutorial</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateTutorial} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Título</Label>
                        <Input id="title" name="title" required data-testid="input-tutorial-title" />
                      </div>
                      <div>
                        <Label htmlFor="platform">Plataforma</Label>
                        <Select name="platform" required>
                          <SelectTrigger data-testid="select-tutorial-platform">
                            <SelectValue placeholder="Seleccionar plataforma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="binance">Binance</SelectItem>
                            <SelectItem value="bingx">BingX</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea id="description" name="description" required data-testid="textarea-tutorial-description" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="videoUrl">URL del Video</Label>
                        <Input id="videoUrl" name="videoUrl" type="url" placeholder="https://..." />
                      </div>
                      <div>
                        <Label htmlFor="imageUrl">URL de Imagen</Label>
                        <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://..." />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="isPublished" name="isPublished" />
                      <Label htmlFor="isPublished">Publicado</Label>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsCreateTutorialOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={createTutorialMutation.isPending} data-testid="button-save-tutorial">
                        {createTutorialMutation.isPending ? "Creando..." : "Crear Tutorial"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="p-6 h-auto flex flex-col gap-2" data-testid="button-update-strategies">
                <TrendingUp className="w-8 h-8" />
                <span>Actualizar Estrategias IA</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* eBooks Management */}
          <Card>
            <CardHeader>
              <CardTitle>eBooks ({ebooks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {ebooks.map((ebook: any) => (
                  <div key={ebook.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{ebook.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {ebook.chapters} capítulos • {ebook.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${ebook.isPublished ? 'bg-chart-1 text-white' : 'bg-muted-foreground text-white'}`}>
                        {ebook.isPublished ? 'Publicado' : 'Borrador'}
                      </span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteEbookMutation.mutate(ebook.id)}
                        disabled={deleteEbookMutation.isPending}
                        data-testid={`button-delete-ebook-${ebook.id}`}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
                {ebooks.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No hay eBooks creados</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tutorials Management */}
          <Card>
            <CardHeader>
              <CardTitle>Tutoriales ({tutorials.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {tutorials.map((tutorial: any) => (
                  <div key={tutorial.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{tutorial.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {tutorial.platform} • {tutorial.isPublished ? 'Publicado' : 'Borrador'}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteTutorialMutation.mutate(tutorial.id)}
                      disabled={deleteTutorialMutation.isPending}
                      data-testid={`button-delete-tutorial-${tutorial.id}`}
                    >
                      Eliminar
                    </Button>
                  </div>
                ))}
                {tutorials.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No hay tutoriales creados</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Status */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Estado del Sistema en Tiempo Real</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span>Binance WebSocket</span>
                <span className="text-chart-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-chart-1 rounded-full pulse-animation"></span>
                  Conectado
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span>OpenRouter API</span>
                <span className="text-chart-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-chart-1 rounded-full pulse-animation"></span>
                  Activo
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span>Base de Datos</span>
                <span className="text-chart-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-chart-1 rounded-full pulse-animation"></span>
                  Sincronizada
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
