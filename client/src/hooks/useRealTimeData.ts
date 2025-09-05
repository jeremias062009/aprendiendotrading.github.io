import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { useQuery } from '@tanstack/react-query';

interface MarketDataPoint {
  symbol: string;
  price: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

interface LiveTrade {
  symbol: string;
  price: string;
  quantity: string;
  isBuyerMaker: boolean;
  timestamp: number;
}

export function useRealTimeData() {
  const [marketData, setMarketData] = useState<Record<string, MarketDataPoint>>({});
  const [liveTrades, setLiveTrades] = useState<LiveTrade[]>([]);
  const { lastMessage } = useWebSocket('/ws');

  // Fetch initial market data
  const { data: initialData } = useQuery({
    queryKey: ["/api/market-data"],
  });

  useEffect(() => {
    if (initialData) {
      const dataMap: Record<string, MarketDataPoint> = {};
      initialData.forEach((item: any) => {
        dataMap[item.symbol] = {
          symbol: item.symbol,
          price: parseFloat(item.price),
          changePercent: parseFloat(item.changePercent),
          volume: parseFloat(item.volume),
          high24h: parseFloat(item.high24h),
          low24h: parseFloat(item.low24h),
          timestamp: Date.now(),
        };
      });
      setMarketData(dataMap);
    }
  }, [initialData]);

  useEffect(() => {
    if (lastMessage?.type === 'market_update') {
      const data = lastMessage.data;
      setMarketData(prev => ({
        ...prev,
        [data.symbol]: {
          symbol: data.symbol,
          price: data.price,
          changePercent: data.changePercent,
          volume: data.volume,
          high24h: data.high24h,
          low24h: data.low24h,
          timestamp: data.timestamp,
        }
      }));

      // Add to live trades if it's a trade update
      if (data.type === 'trade') {
        setLiveTrades(prev => {
          const newTrade: LiveTrade = {
            symbol: data.symbol,
            price: data.price.toString(),
            quantity: data.quantity?.toString() || '0',
            isBuyerMaker: data.isBuyerMaker || false,
            timestamp: data.timestamp,
          };
          return [newTrade, ...prev.slice(0, 49)]; // Keep last 50 trades
        });
      }
    }
  }, [lastMessage]);

  const marketDataArray = Object.values(marketData);
  
  const topGainers = marketDataArray
    .filter(item => item.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent);
    
  const topLosers = marketDataArray
    .filter(item => item.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent);
    
  const highVolume = marketDataArray
    .sort((a, b) => b.volume - a.volume);

  return {
    marketData: marketDataArray,
    topGainers,
    topLosers,
    highVolume,
    liveTrades,
  };
}
