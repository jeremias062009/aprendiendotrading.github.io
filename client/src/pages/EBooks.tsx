import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EBookCard from "@/components/EBookCard";
import { BookOpen, Clock, Layers } from "lucide-react";

export default function EBooks() {
  const { data: ebooks = [], isLoading } = useQuery({
    queryKey: ["/api/ebooks"],
  });

  const publishedEbooks = ebooks.filter((ebook: any) => ebook.isPublished);

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-12 bg-muted rounded mb-4 animate-pulse"></div>
            <div className="h-6 bg-muted rounded max-w-2xl mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-lg mb-4"></div>
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-16 bg-muted rounded mb-4"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16" data-testid="ebooks-header">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <BookOpen className="w-12 h-12 inline-block mr-4 text-primary" />
            eBooks Interactivos
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Aprende trading desde cero con nuestros libros digitales completos. 
            Desde conceptos básicos hasta estrategias avanzadas.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Badge variant="default" className="px-4 py-2 cursor-pointer">
            Todos ({publishedEbooks.length})
          </Badge>
          <Badge variant="outline" className="px-4 py-2 cursor-pointer">
            Básico
          </Badge>
          <Badge variant="outline" className="px-4 py-2 cursor-pointer">
            Intermedio
          </Badge>
          <Badge variant="outline" className="px-4 py-2 cursor-pointer">
            Avanzado
          </Badge>
        </div>

        {/* eBooks Grid */}
        {publishedEbooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16" data-testid="ebooks-grid">
            {publishedEbooks.map((ebook: any) => (
              <EBookCard key={ebook.id} ebook={ebook} />
            ))}
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto text-center py-12">
            <CardContent>
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hay eBooks disponibles</h3>
              <p className="text-muted-foreground mb-6">
                Los administradores están trabajando en crear contenido educativo de calidad.
              </p>
              <Button variant="outline">Volver al inicio</Button>
            </CardContent>
          </Card>
        )}

        {/* Learning Path */}
        <section className="bg-card border border-border rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Ruta de Aprendizaje Recomendada</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-chart-1 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Fundamentos</h3>
              <p className="text-muted-foreground">
                Comienza con los conceptos básicos del trading y análisis técnico.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-chart-3 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Técnicas Avanzadas</h3>
              <p className="text-muted-foreground">
                Profundiza en velas japonesas, indicadores y patrones de mercado.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-chart-2 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Estrategias</h3>
              <p className="text-muted-foreground">
                Desarrolla estrategias personalizadas y gestión de riesgo profesional.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-8">¿Por qué nuestros eBooks?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Aprende a tu Ritmo</h3>
                <p className="text-muted-foreground">
                  Contenido disponible 24/7 para que estudies cuando tengas tiempo.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Layers className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Contenido Estructurado</h3>
                <p className="text-muted-foreground">
                  Información organizada de manera lógica para maximizar el aprendizaje.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Ejemplos Reales</h3>
                <p className="text-muted-foreground">
                  Casos prácticos con datos reales del mercado para mejor comprensión.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
