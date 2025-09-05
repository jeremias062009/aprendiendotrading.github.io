import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, TrendingDown, Activity, AlertCircle } from "lucide-react";

export default function AIAnalysisPanel() {
  const { data: strategies = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/ai-strategies"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const recentStrategies = strategies.slice(0, 5);

  const getSignalColor = (signal: string) => {
    switch (signal.toUpperCase()) {
      case 'BUY':
        return 'text-chart-1';
      case 'SELL':
        return 'text-chart-2';
      default:
        return 'text-muted-foreground';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal.toUpperCase()) {
      case 'BUY':
        return '🚀';
      case 'SELL':
        return '⚠️';
      default:
        return '📊';
    }
  };

  const getConfidenceLevel = (confidence: string | number) => {
    const conf = typeof confidence === 'string' ? parseFloat(confidence) : confidence;
    if (conf >= 80) return 'Alta';
    if (conf >= 60) return 'Media';
    return 'Baja';
  };

  const getConfidenceColor = (confidence: string | number) => {
    const conf = typeof confidence === 'string' ? parseFloat(confidence) : confidence;
    if (conf >= 80) return 'text-chart-1';
    if (conf >= 60) return 'text-chart-3';
    return 'text-chart-2';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary animate-pulse" />
            Análisis IA en Tiempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-16 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="ai-analysis-panel">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-chart-1 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Análisis IA en Tiempo Real</h3>
              <p className="text-sm text-muted-foreground">Powered by OpenRouter API</p>
            </div>
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-chart-1 rounded-full pulse-animation"></span>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {recentStrategies.length > 0 ? (
          <div className="space-y-4" data-testid="ai-signals-list">
            {recentStrategies.map((strategy: any) => (
              <div 
                key={strategy.id} 
                className="bg-muted rounded-lg p-4 transition-all hover:bg-muted/80"
                data-testid={`ai-signal-${strategy.id}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getSignalIcon(strategy.signal)}</span>
                    <h4 className={`font-semibold ${getSignalColor(strategy.signal)}`}>
                      Señal {strategy.signal.toUpperCase()} - {strategy.symbol}
                    </h4>
                  </div>
                  <Badge variant="outline" className={getConfidenceColor(strategy.confidence)}>
                    {getConfidenceLevel(strategy.confidence)}: {parseFloat(strategy.confidence).toFixed(0)}%
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {strategy.description}
                </p>
                
                {strategy.analysis && typeof strategy.analysis === 'object' && (
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {strategy.analysis.technicalIndicators && (
                      <>
                        <div className="flex justify-between">
                          <span>RSI:</span>
                          <span className="font-semibold">
                            {strategy.analysis.technicalIndicators.rsi || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>MACD:</span>
                          <span className="font-semibold">
                            {strategy.analysis.technicalIndicators.macd || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tendencia:</span>
                          <span className="font-semibold">
                            {strategy.analysis.technicalIndicators.trend || 'N/A'}
                          </span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <span>Tiempo:</span>
                      <span className="text-muted-foreground">
                        {new Date(strategy.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="font-semibold mb-2">No hay análisis disponibles</h4>
            <p className="text-sm text-muted-foreground">
              La IA está procesando los datos del mercado. Los análisis aparecerán aquí en tiempo real.
            </p>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Última actualización: {new Date().toLocaleTimeString()}</span>
            <span>Análisis automático cada 5 min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
