export interface MarketData {
  symbol: string;
  price: string;
  changePercent: string;
  volume: string;
  high24h: string;
  low24h: string;
  lastUpdate?: string;
}

export interface LiveMarketData {
  symbol: string;
  price: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

export interface TradingSignal {
  type: 'BUY' | 'SELL' | 'HOLD';
  symbol: string;
  confidence: number;
  price: number;
  timestamp: number;
  reasoning?: string;
}

export interface AIAnalysis {
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  summary: string;
  technicalIndicators: {
    rsi: number;
    macd: string;
    trend: string;
  };
  priceTargets: {
    support: number;
    resistance: number;
  };
  timestamp: number;
}

export interface LiveTrade {
  symbol: string;
  price: string;
  quantity: string;
  isBuyerMaker: boolean;
  timestamp: number;
}

export interface CandlestickData {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
}

export interface WebSocketMessage {
  type: 'market_update' | 'market_data' | 'trade' | 'error';
  data: any;
  timestamp?: number;
}

export interface BinanceTickerData {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  c: string; // Close price
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  P: string; // Price change percent
}

export interface BinanceTradeData {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  t: number; // Trade ID
  p: string; // Price
  q: string; // Quantity
  b: number; // Buyer order ID
  a: number; // Seller order ID
  T: number; // Trade time
  m: boolean; // Is the buyer the market maker?
}

export interface ChartDataPoint {
  time: number;
  price: number;
  volume?: number;
}

export interface TechnicalIndicator {
  name: string;
  value: number | string;
  signal: 'bullish' | 'bearish' | 'neutral';
  description?: string;
}

export interface PortfolioMetrics {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  winRate: number;
  totalTrades: number;
}

// Platform-specific types
export interface BinancePlatformInfo {
  features: string[];
  supportedAssets: string[];
  tradingPairs: number;
  securityFeatures: string[];
}

export interface BingXPlatformInfo {
  features: string[];
  copyTradingEnabled: boolean;
  socialTradingEnabled: boolean;
  leverageOptions: number[];
}

// Educational content types
export interface TradingConcept {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  examples: string[];
  relatedConcepts: string[];
}

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  timeframe: string;
  requiredIndicators: string[];
  rules: {
    entry: string[];
    exit: string[];
    stopLoss: string[];
  };
}
