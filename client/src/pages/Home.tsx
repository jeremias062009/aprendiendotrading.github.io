import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MarketDataCard from "@/components/MarketDataCard";
import { Link } from "wouter";
import { TrendingUp, BookOpen, Video, Brain, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" data-testid="hero-section">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Aprende Trading <span className="gradient-text">Profesional</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in">
            Domina los mercados financieros con nuestros eBooks interactivos, tutoriales paso a paso y análisis en tiempo real. 
            Desde conceptos básicos hasta estrategias avanzadas con IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in">
            <Button 
              size="lg" 
              className="trading-glow px-8 py-4 text-lg font-semibold"
              data-testid="button-start-free"
            >
              Comenzar Ahora - Gratis
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-4 text-lg font-semibold bg-chart-1 text-white border-chart-1 hover:bg-chart-1/90"
              asChild
              data-testid="link-bingx-register"
            >
              <a href="https://bingx.com/referral-program/THPORK" target="_blank" rel="noopener noreferrer">
                Regístrate en BingX
              </a>
            </Button>
          </div>

          {/* Real-time Market Data Preview */}
          <Card className="max-w-4xl mx-auto animate-slide-in">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                <BarChart3 className="w-6 h-6 text-primary" />
                Datos del Mercado en Tiempo Real
              </h2>
              <MarketDataCard />
              <div className="mt-4 text-sm text-muted-foreground flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-chart-1 rounded-full pulse-animation"></span>
                Actualización en tiempo real vía Binance WebSocket
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">¿Por qué Aprendiendo Trading?</h2>
            <p className="text-xl text-muted-foreground">La plataforma más completa para tu educación financiera</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">eBooks Interactivos</h3>
                <p className="text-muted-foreground">
                  Aprende con libros digitales completos sobre velas japonesas, indicadores técnicos y más.
                </p>
                <Link href="/ebooks">
                  <Button variant="ghost" className="mt-4" data-testid="button-explore-ebooks">
                    Explorar eBooks
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <Video className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Tutoriales de Plataformas</h3>
                <p className="text-muted-foreground">
                  Guías paso a paso para dominar Binance, BingX y otras plataformas de trading.
                </p>
                <Link href="/tutorials">
                  <Button variant="ghost" className="mt-4" data-testid="button-view-tutorials">
                    Ver Tutoriales
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Datos en Tiempo Real</h3>
                <p className="text-muted-foreground">
                  Analiza el mercado con datos actualizados cada segundo desde Binance WebSocket.
                </p>
                <Link href="/real-time">
                  <Button variant="ghost" className="mt-4" data-testid="button-see-realtime">
                    Ver en Tiempo Real
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Estrategias con IA</h3>
                <p className="text-muted-foreground">
                  Análisis automatizado y señales de trading generadas por inteligencia artificial.
                </p>
                <Link href="/ai-strategies">
                  <Button variant="ghost" className="mt-4" data-testid="button-discover-ai">
                    Descubrir IA
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-chart-1">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Comienza tu Viaje en el Trading Hoy
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Únete a miles de traders que ya están aprendiendo con nuestros recursos gratuitos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary px-8 py-4 font-semibold hover:bg-gray-100"
              data-testid="button-access-free"
            >
              Acceder Gratis Ahora
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white px-8 py-4 font-semibold hover:bg-white hover:text-primary"
              asChild
              data-testid="button-create-bingx"
            >
              <a href="https://bingx.com/referral-program/THPORK" target="_blank" rel="noopener noreferrer">
                Crear Cuenta BingX
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 gradient-text">Aprendiendo Trading</h3>
              <p className="text-muted-foreground">
                La plataforma más completa para aprender trading desde cero hasta nivel profesional.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/ebooks" className="hover:text-foreground">eBooks Gratuitos</Link></li>
                <li><Link href="/tutorials" className="hover:text-foreground">Tutoriales</Link></li>
                <li><Link href="/real-time" className="hover:text-foreground">Datos Tiempo Real</Link></li>
                <li><Link href="/ai-strategies" className="hover:text-foreground">Estrategias IA</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Plataformas</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/tutorials?platform=binance" className="hover:text-foreground">Tutorial Binance</Link></li>
                <li><Link href="/tutorials?platform=bingx" className="hover:text-foreground">Tutorial BingX</Link></li>
                <li><a href="https://bingx.com/referral-program/THPORK" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Registro BingX</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>jeremias062009@gmail.com</li>
                <li>eli.as.23@hotmail.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Aprendiendo Trading. Todos los derechos reservados.</p>
            <p className="mt-2 text-sm">Datos de mercado proporcionados por Binance API • Análisis IA por OpenRouter</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
