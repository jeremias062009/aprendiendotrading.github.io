import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TradingChart from "@/components/TradingChart";
import MarketDataCard from "@/components/MarketDataCard";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { useWebSocket } from "@/hooks/useWebSocket";
import { BarChart3, TrendingUp, TrendingDown, Activity, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";

export default function RealTimeData() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [timeframe, setTimeframe] = useState('1m');
  const { connectionStatus } = useWebSocket('/ws');
  const { 
    marketData, 
    topGainers, 
    topLosers, 
    highVolume, 
    liveTrades 
  } = useRealTimeData();

  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'DOGEUSDT', 'DOTUSDT'];
  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'];

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-chart-1';
      case 'connecting':
        return 'text-chart-3';
      default:
        return 'text-chart-2';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Conectado';
      case 'connecting':
        return 'Conectando...';
      default:
        return 'Desconectado';
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16" data-testid="realtime-header">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <BarChart3 className="w-12 h-12 inline-block mr-4 text-primary" />
            Datos en Tiempo Real
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Análisis de mercado actualizado cada segundo desde Binance WebSocket
          </p>
          
          {/* Connection Status */}
          <div className="flex items-center justify-center gap-2">
            {connectionStatus === 'connected' ? (
              <Wifi className="w-5 h-5 text-chart-1" />
            ) : (
              <WifiOff className="w-5 h-5 text-chart-2" />
            )}
            <span className={`text-sm font-semibold ${getConnectionStatusColor()}`}>
              {getConnectionStatusText()}
            </span>
            {connectionStatus === 'connected' && (
              <span className="w-2 h-2 bg-chart-1 rounded-full pulse-animation ml-1"></span>
            )}
          </div>
        </div>

        {/* Market Overview Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Mercados Principales</h2>
          <MarketDataCard />
        </div>

        {/* Trading Chart Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary" />
                Gráfico en Tiempo Real - {selectedSymbol}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-chart-1 rounded-full pulse-animation"></span>
                <span className="text-sm text-muted-foreground">Live</span>
              </div>
            </div>
            
            {/* Symbol and Timeframe Selectors */}
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="flex gap-1">
                {symbols.map((symbol) => (
                  <Button
                    key={symbol}
                    variant={selectedSymbol === symbol ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSymbol(symbol)}
                    data-testid={`button-symbol-${symbol.toLowerCase()}`}
                  >
                    {symbol.replace('USDT', '')}
                  </Button>
                ))}
              </div>
              <div className="flex gap-1">
                {timeframes.map((tf) => (
                  <Button
                    key={tf}
                    variant={timeframe === tf ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setTimeframe(tf)}
                    data-testid={`button-timeframe-${tf}`}
                  >
                    {tf}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TradingChart symbol={selectedSymbol} timeframe={timeframe} />
          </CardContent>
        </Card>

        {/* Market Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-chart-1">
                <TrendingUp className="w-5 h-5" />
                Top Gainers 24h
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3" data-testid="top-gainers-list">
                {topGainers.length > 0 ? (
                  topGainers.slice(0, 5).map((coin: any, index: number) => (
                    <div key={coin.symbol} className="flex justify-between items-center">
                      <span className="font-medium">{coin.symbol.replace('USDT', '')}</span>
                      <div className="text-right">
                        <div className="text-chart-1 font-semibold">
                          +{coin.changePercent.toFixed(2)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${coin.price.toFixed(coin.symbol === 'ADAUSDT' ? 4 : 2)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Cargando datos...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-chart-2">
                <TrendingDown className="w-5 h-5" />
                Top Losers 24h
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3" data-testid="top-losers-list">
                {topLosers.length > 0 ? (
                  topLosers.slice(0, 5).map((coin: any, index: number) => (
                    <div key={coin.symbol} className="flex justify-between items-center">
                      <span className="font-medium">{coin.symbol.replace('USDT', '')}</span>
                      <div className="text-right">
                        <div className="text-chart-2 font-semibold">
                          {coin.changePercent.toFixed(2)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${coin.price.toFixed(coin.symbol === 'ADAUSDT' ? 4 : 2)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Cargando datos...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Alto Volumen 24h
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3" data-testid="high-volume-list">
                {highVolume.length > 0 ? (
                  highVolume.slice(0, 5).map((coin: any, index: number) => (
                    <div key={coin.symbol} className="flex justify-between items-center">
                      <span className="font-medium">{coin.symbol.replace('USDT', '')}</span>
                      <div className="text-right">
                        <div className="text-muted-foreground font-semibold">
                          ${(coin.volume / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${coin.price.toFixed(coin.symbol === 'ADAUSDT' ? 4 : 2)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Cargando datos...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Trades Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" />
              Feed de Operaciones en Vivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto" data-testid="live-trades-feed">
              {liveTrades.length > 0 ? (
                liveTrades.slice(0, 20).map((trade: any, index: number) => (
                  <div 
                    key={`${trade.symbol}-${trade.timestamp}-${index}`} 
                    className="flex justify-between items-center text-sm p-2 bg-muted rounded animate-fade-in"
                  >
                    <span className="font-medium">{trade.symbol}</span>
                    <span className={`font-semibold ${trade.isBuyerMaker ? 'text-chart-2' : 'text-chart-1'}`}>
                      {trade.isBuyerMaker ? 'VENTA' : 'COMPRA'} {parseFloat(trade.quantity).toFixed(4)}
                    </span>
                    <span className="font-medium">
                      ${parseFloat(trade.price).toFixed(trade.symbol === 'ADAUSDT' ? 4 : 2)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(trade.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Esperando datos de operaciones en vivo...
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Technical Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Información Técnica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Fuente de Datos</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Binance WebSocket API (wss://stream.binance.com:9443/ws/)</li>
                  <li>• Actualización en tiempo real cada segundo</li>
                  <li>• Datos verificados y autenticados</li>
                  <li>• Latencia promedio: &lt;100ms</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tipos de Datos</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Precios y cambios porcentuales 24h</li>
                  <li>• Volúmenes de trading en tiempo real</li>
                  <li>• Máximos y mínimos del día</li>
                  <li>• Feed de transacciones individuales</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
