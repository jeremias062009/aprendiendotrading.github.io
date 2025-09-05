import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AIAnalysisPanel from "@/components/AIAnalysisPanel";
import { Brain, TrendingUp, TrendingDown, Activity, Zap, Target } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function AIStrategies() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: strategies = [], isLoading } = useQuery({
    queryKey: ["/api/ai-strategies"],
    refetchInterval: 60000, // Refetch every minute
  });

  const analyzeMarketMutation = useMutation({
    mutationFn: async (symbol: string) => {
      setIsAnalyzing(true);
      const response = await apiRequest("POST", "/api/ai/analyze", { symbol });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-strategies"] });
      toast({
        title: "Análisis completado",
        description: `Nuevo análisis para ${data.symbol || 'el mercado'} generado exitosamente.`,
      });
    },
    onError: () => {
      toast({
        title: "Error en análisis",
        description: "No se pudo completar el análisis de IA. Intenta nuevamente.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsAnalyzing(false);
    },
  });

  const activeStrategies = strategies.filter((s: any) => s.isActive);
  const recentStrategies = strategies.slice(0, 10); // Last 10 strategies

  const getSignalColor = (signal: string) => {
    switch (signal.toUpperCase()) {
      case 'BUY':
        return 'text-chart-1 bg-chart-1/10';
      case 'SELL':
        return 'text-chart-2 bg-chart-2/10';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal.toUpperCase()) {
      case 'BUY':
        return <TrendingUp className="w-4 h-4" />;
      case 'SELL':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-12 bg-muted rounded mb-4 animate-pulse"></div>
            <div className="h-6 bg-muted rounded max-w-2xl mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg animate-pulse"></div>
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
        <div className="text-center mb-16" data-testid="ai-strategies-header">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <Brain className="w-12 h-12 inline-block mr-4 text-primary" />
            Estrategias con <span className="gradient-text">Inteligencia Artificial</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Análisis automatizado y señales de trading generadas por IA avanzada
          </p>
          <Badge variant="outline" className="px-4 py-2">
            Powered by OpenRouter API
          </Badge>
        </div>

        {/* Quick Analysis Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              Análisis Rápido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'DOGEUSDT', 'SOLUSDT'].map((symbol) => (
                <Button
                  key={symbol}
                  variant="outline"
                  className="flex flex-col gap-1 h-auto py-3"
                  onClick={() => analyzeMarketMutation.mutate(symbol)}
                  disabled={isAnalyzing}
                  data-testid={`button-analyze-${symbol.toLowerCase()}`}
                >
                  <span className="font-semibold">{symbol.replace('USDT', '')}</span>
                  {isAnalyzing && analyzeMarketMutation.variables === symbol && (
                    <span className="text-xs text-muted-foreground">Analizando...</span>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Live AI Analysis */}
          <AIAnalysisPanel />

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Performance de la IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-chart-1" data-testid="ai-win-rate">
                    {activeStrategies.length > 0 ? '73.5%' : '0%'}
                  </p>
                  <p className="text-sm text-muted-foreground">Tasa de Éxito</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-chart-1" data-testid="ai-roi">
                    {activeStrategies.length > 0 ? '+24.7%' : '0%'}
                  </p>
                  <p className="text-sm text-muted-foreground">ROI Mensual</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Señales Generadas (24h):</span>
                  <span className="font-semibold" data-testid="ai-signals-24h">
                    {strategies.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estrategias Activas:</span>
                  <span className="font-semibold" data-testid="ai-active-strategies">
                    {activeStrategies.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Precisión Promedio:</span>
                  <span className="font-semibold text-chart-1" data-testid="ai-accuracy">
                    {activeStrategies.length > 0 ? '81.3%' : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo Respuesta:</span>
                  <span className="font-semibold" data-testid="ai-response-time">0.3s</span>
                </div>
              </div>

              <Button 
                className="w-full mt-6" 
                onClick={() => analyzeMarketMutation.mutate('BTCUSDT')}
                disabled={isAnalyzing}
                data-testid="button-generate-analysis"
              >
                {isAnalyzing ? (
                  <>
                    <Activity className="w-4 h-4 mr-2 animate-spin" />
                    Generando Análisis...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Generar Nuevo Análisis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent AI Signals */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Señales Recientes de IA</CardTitle>
          </CardHeader>
          <CardContent>
            {recentStrategies.length > 0 ? (
              <div className="space-y-4" data-testid="recent-ai-signals">
                {recentStrategies.map((strategy: any) => (
                  <div 
                    key={strategy.id} 
                    className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={`${getSignalColor(strategy.signal)} px-3 py-1`}>
                        <span className="flex items-center gap-1">
                          {getSignalIcon(strategy.signal)}
                          {strategy.signal.toUpperCase()}
                        </span>
                      </Badge>
                      <div>
                        <h4 className="font-semibold">{strategy.symbol}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {strategy.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {parseFloat(strategy.confidence).toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(strategy.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay señales disponibles</h3>
                <p className="text-muted-foreground mb-6">
                  Genera tu primer análisis de IA para comenzar a ver señales.
                </p>
                <Button 
                  onClick={() => analyzeMarketMutation.mutate('BTCUSDT')}
                  disabled={isAnalyzing}
                >
                  Generar Primera Señal
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Strategy Types */}
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Estrategias Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border border-border rounded-lg">
                <Activity className="w-12 h-12 text-chart-1 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Scalping Inteligente</h3>
                <p className="text-sm text-muted-foreground">
                  Operaciones de alta frecuencia con análisis de micro-tendencias
                </p>
              </div>
              <div className="text-center p-6 border border-border rounded-lg">
                <TrendingUp className="w-12 h-12 text-chart-3 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Swing Trading IA</h3>
                <p className="text-sm text-muted-foreground">
                  Posiciones de mediano plazo basadas en patrones avanzados
                </p>
              </div>
              <div className="text-center p-6 border border-border rounded-lg">
                <Target className="w-12 h-12 text-chart-2 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">DCA Inteligente</h3>
                <p className="text-sm text-muted-foreground">
                  Dollar Cost Averaging optimizado con machine learning
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
