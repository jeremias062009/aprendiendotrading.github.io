import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketData {
  symbol: string;
  price: string;
  changePercent: string;
  volume: string;
  high24h: string;
  low24h: string;
}

export default function MarketDataCard() {
  const [liveData, setLiveData] = useState<Record<string, any>>({});
  
  const { data: marketData = [], isLoading } = useQuery<MarketData[]>({
    queryKey: ["/api/market-data"],
    refetchInterval: 30000, // Fallback: refetch every 30 seconds
  });

  const { lastMessage } = useWebSocket('/ws');

  useEffect(() => {
    if (lastMessage?.type === 'market_update') {
      setLiveData(prev => ({
        ...prev,
        [lastMessage.data.symbol]: lastMessage.data
      }));
    } else if (lastMessage?.type === 'market_data') {
      // Initial data load
      const dataMap: Record<string, any> = {};
      lastMessage.data.forEach((item: MarketData) => {
        dataMap[item.symbol] = {
          symbol: item.symbol,
          price: parseFloat(item.price),
          changePercent: parseFloat(item.changePercent),
          volume: parseFloat(item.volume),
          high24h: parseFloat(item.high24h),
          low24h: parseFloat(item.low24h),
        };
      });
      setLiveData(dataMap);
    }
  }, [lastMessage]);

  const displaySymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT'];

  const getDisplayData = (symbol: string) => {
    const live = liveData[symbol];
    if (live) return live;
    
    const stored = marketData?.find((item: MarketData) => item.symbol === symbol);
    if (stored) {
      return {
        symbol: stored.symbol,
        price: parseFloat(stored.price),
        changePercent: parseFloat(stored.changePercent),
        volume: parseFloat(stored.volume),
        high24h: parseFloat(stored.high24h),
        low24h: parseFloat(stored.low24h),
      };
    }
    
    return null;
  };

  const formatPrice = (price: number, symbol: string) => {
    if (symbol === 'ADAUSDT') {
      return `$${price.toFixed(4)}`;
    }
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (isLoading && Object.keys(liveData).length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displaySymbols.map((symbol) => (
          <Card key={symbol} className="animate-pulse">
            <CardContent className="p-4 text-center">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-6 bg-muted rounded mb-1"></div>
              <div className="h-4 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="market-data-grid">
      {displaySymbols.map((symbol) => {
        const data = getDisplayData(symbol);
        const displaySymbol = symbol.replace('USDT', '');
        
        if (!data) {
          return (
            <Card key={symbol} className="bg-muted/50">
              <CardContent className="p-4 text-center">
                <div className="text-sm text-muted-foreground">{displaySymbol}/USDT</div>
                <div className="text-lg font-bold text-muted-foreground">No data</div>
                <div className="text-sm text-muted-foreground">--</div>
              </CardContent>
            </Card>
          );
        }

        const isPositive = data.changePercent >= 0;
        const changeColor = isPositive ? 'text-chart-1' : 'text-chart-2';
        
        return (
          <Card 
            key={symbol} 
            className="bg-muted hover:bg-muted/80 transition-colors"
            data-testid={`market-card-${symbol.toLowerCase()}`}
          >
            <CardContent className="p-4 text-center">
              <div className="text-sm text-muted-foreground">{displaySymbol}/USDT</div>
              <div className="text-lg md:text-xl font-bold" data-testid={`price-${symbol.toLowerCase()}`}>
                {formatPrice(data.price, symbol)}
              </div>
              <div className={`text-sm flex items-center justify-center gap-1 ${changeColor}`}>
                {isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
