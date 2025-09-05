import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Activity, AlertCircle } from "lucide-react";

interface TradingChartProps {
  symbol: string;
  timeframe: string;
}

export default function TradingChart({ symbol, timeframe }: TradingChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [priceData, setPriceData] = useState<number[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const { lastMessage, connectionStatus } = useWebSocket('/ws');

  useEffect(() => {
    if (lastMessage?.type === 'market_update' && lastMessage.data.symbol === symbol) {
      const newPrice = lastMessage.data.price;
      setCurrentPrice(newPrice);
      setPriceChange(lastMessage.data.changePercent);
      
      setPriceData(prev => {
        const updated = [...prev, newPrice];
        // Keep only last 50 data points for performance
        return updated.slice(-50);
      });
    }
  }, [lastMessage, symbol]);

  useEffect(() => {
    drawChart();
  }, [priceData, symbol]);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || priceData.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;
    const padding = 20;

    // Calculate min/max for scaling
    const minPrice = Math.min(...priceData);
    const maxPrice = Math.max(...priceData);
    const priceRange = maxPrice - minPrice || 1;

    // Draw background grid
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 0.5;
    
    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i * (height - 2 * padding)) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= 5; i++) {
      const x = padding + (i * (width - 2 * padding)) / 5;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Draw price line
    ctx.strokeStyle = priceChange >= 0 ? '#10b981' : '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();

    priceData.forEach((price, index) => {
      const x = padding + (index * (width - 2 * padding)) / (priceData.length - 1);
      const y = height - padding - ((price - minPrice) / priceRange) * (height - 2 * padding);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw gradient fill
    if (priceData.length > 1) {
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = priceChange >= 0 ? '#10b981' : '#ef4444';
      ctx.lineTo(width - padding, height - padding);
      ctx.lineTo(padding, height - padding);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Draw current price indicator
    if (priceData.length > 0) {
      const lastPrice = priceData[priceData.length - 1];
      const x = width - padding;
      const y = height - padding - ((lastPrice - minPrice) / priceRange) * (height - 2 * padding);
      
      ctx.fillStyle = priceChange >= 0 ? '#10b981' : '#ef4444';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw price labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '12px Inter';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 4; i++) {
      const price = maxPrice - (i * priceRange) / 4;
      const y = padding + (i * (height - 2 * padding)) / 4;
      ctx.fillText(price.toFixed(symbol === 'ADAUSDT' ? 4 : 2), width - padding - 10, y + 4);
    }
  };

  const formatPrice = (price: number) => {
    return price.toFixed(symbol === 'ADAUSDT' ? 4 : 2);
  };

  if (connectionStatus !== 'connected') {
    return (
      <Card className="h-96 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sin conexión</h3>
          <p className="text-muted-foreground">
            Esperando conexión con Binance WebSocket...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4" data-testid={`trading-chart-${symbol.toLowerCase()}`}>
      {/* Price Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold">{symbol}</h3>
          {currentPrice > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-mono" data-testid={`current-price-${symbol.toLowerCase()}`}>
                ${formatPrice(currentPrice)}
              </span>
              <span className={`flex items-center gap-1 text-sm font-semibold ${
                priceChange >= 0 ? 'text-chart-1' : 'text-chart-2'
              }`}>
                <Activity className="w-4 h-4" />
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Timeframe: {timeframe}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative h-96 bg-card border border-border rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />
        
        {priceData.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">Esperando datos de {symbol}...</p>
            </div>
          </div>
        )}
      </div>

      {/* Chart Info */}
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Datos en tiempo real de Binance</span>
        <span>Puntos de datos: {priceData.length}</span>
      </div>
    </div>
  );
}
