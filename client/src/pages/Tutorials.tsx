import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TutorialCard from "@/components/TutorialCard";
import { Video, ExternalLink, Users, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Tutorials() {
  const { data: tutorials = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/tutorials"],
  });

  const publishedTutorials = tutorials.filter((tutorial: any) => tutorial.isPublished);
  const binanceTutorials = publishedTutorials.filter((tutorial: any) => tutorial.platform === 'binance');
  const bingxTutorials = publishedTutorials.filter((tutorial: any) => tutorial.platform === 'bingx');

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-12 bg-muted rounded mb-4 animate-pulse"></div>
            <div className="h-6 bg-muted rounded max-w-2xl mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-muted rounded-lg mb-4"></div>
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-16 bg-muted rounded"></div>
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
        <div className="text-center mb-16" data-testid="tutorials-header">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <Video className="w-12 h-12 inline-block mr-4 text-primary" />
            Tutoriales de Plataformas
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Aprende a usar las mejores plataformas de trading paso a paso. 
            Desde registro hasta estrategias avanzadas.
          </p>
        </div>

        {/* Platform Selection */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Badge variant="default" className="px-4 py-2 cursor-pointer">
            Todas las Plataformas ({publishedTutorials.length})
          </Badge>
          <Badge variant="outline" className="px-4 py-2 cursor-pointer">
            Binance ({binanceTutorials.length})
          </Badge>
          <Badge variant="outline" className="px-4 py-2 cursor-pointer">
            BingX ({bingxTutorials.length})
          </Badge>
        </div>

        {/* Main Tutorials Grid */}
        {publishedTutorials.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16" data-testid="tutorials-grid">
            {/* Binance Section */}
            <Card className="overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center relative">
                <img 
                  src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                  alt="Binance trading platform interface"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <span className="text-black font-bold text-2xl">B</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-black font-bold text-xl">B</span>
                  </div>
                  <h3 className="text-2xl font-bold">Tutorial Completo de Binance</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Guía completa para dominar Binance: registro, verificación, depósitos, trading spot, 
                  futuros, staking y todas las funciones avanzadas.
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center">
                    <Shield className="w-4 h-4 text-chart-1 mr-2" />
                    Registro y verificación KYC
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-4 h-4 text-chart-1 mr-2" />
                    Depósitos y retiros seguros
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-4 h-4 text-chart-1 mr-2" />
                    Trading spot y futuros
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-4 h-4 text-chart-1 mr-2" />
                    Análisis técnico integrado
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-4 h-4 text-chart-1 mr-2" />
                    API y trading automatizado
                  </li>
                </ul>
                <Button 
                  className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-semibold"
                  data-testid="button-binance-tutorial"
                >
                  Ver Tutorial de Binance
                </Button>
              </CardContent>
            </Card>

            {/* BingX Section */}
            <Card className="overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center relative">
                <img 
                  src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                  alt="BingX trading platform interface"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">X</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-xl">X</span>
                  </div>
                  <h3 className="text-2xl font-bold">Tutorial Completo de BingX</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Domina BingX desde cero: copy trading, trading social, futuros de criptomonedas 
                  y todas las herramientas de análisis avanzado.
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center">
                    <Users className="w-4 h-4 text-chart-1 mr-2" />
                    Copy Trading y Social Trading
                  </li>
                  <li className="flex items-center">
                    <Users className="w-4 h-4 text-chart-1 mr-2" />
                    Futuros de criptomonedas
                  </li>
                  <li className="flex items-center">
                    <Users className="w-4 h-4 text-chart-1 mr-2" />
                    Herramientas de análisis
                  </li>
                  <li className="flex items-center">
                    <Users className="w-4 h-4 text-chart-1 mr-2" />
                    Gestión de riesgo avanzada
                  </li>
                  <li className="flex items-center">
                    <Users className="w-4 h-4 text-chart-1 mr-2" />
                    Programa de referidos
                  </li>
                </ul>
                <div className="flex space-x-3">
                  <Button 
                    className="flex-1 bg-blue-500 text-white hover:bg-blue-400"
                    data-testid="button-bingx-tutorial"
                  >
                    Ver Tutorial
                  </Button>
                  <Button 
                    className="flex-1 bg-chart-1 text-white hover:bg-chart-1/90"
                    asChild
                    data-testid="button-bingx-register"
                  >
                    <a 
                      href="https://bingx.com/referral-program/THPORK" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      Registrarse
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto text-center py-12">
            <CardContent>
              <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hay tutoriales disponibles</h3>
              <p className="text-muted-foreground mb-6">
                Los administradores están trabajando en crear tutoriales detallados.
              </p>
              <Button variant="outline" asChild>
                <Link href="/">Volver al inicio</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Individual Tutorial Cards */}
        {publishedTutorials.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Tutoriales Detallados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedTutorials.map((tutorial: any) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
          </section>
        )}

        {/* BingX Referral CTA */}
        <section className="bg-gradient-to-r from-blue-500 to-chart-1 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">¿Listo para empezar en BingX?</h2>
          <p className="text-xl mb-6 opacity-90">
            Regístrate con nuestro enlace de referido y obtén beneficios exclusivos
          </p>
          <Button 
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8"
            asChild
            data-testid="button-bingx-cta"
          >
            <a 
              href="https://bingx.com/referral-program/THPORK" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Crear Cuenta en BingX
              <ExternalLink className="w-5 h-5" />
            </a>
          </Button>
        </section>
      </div>
    </div>
  );
}
