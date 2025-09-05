export interface BinanceSymbol {
  symbol: string;
  status: string;
  baseAsset: string;
  quoteAsset: string;
}

export interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  volume: string;
  high: string;
  low: string;
}

class BinanceAPI {
  private readonly baseUrl = 'https://api.binance.com/api/v3';

  async getExchangeInfo(): Promise<{ symbols: BinanceSymbol[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/exchangeInfo`);
      if (!response.ok) {
        throw new Error(`Binance API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching exchange info:', error);
      throw error;
    }
  }

  async getTicker24hr(symbol?: string): Promise<BinanceTicker | BinanceTicker[]> {
    try {
      const url = symbol 
        ? `${this.baseUrl}/ticker/24hr?symbol=${symbol}`
        : `${this.baseUrl}/ticker/24hr`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Binance API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ticker data:', error);
      throw error;
    }
  }

  async getKlines(
    symbol: string, 
    interval: string = '1m', 
    limit: number = 100
  ): Promise<number[][]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error(`Binance API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching klines data:', error);
      throw error;
    }
  }

  async getCurrentPrice(symbol: string): Promise<{ symbol: string; price: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/ticker/price?symbol=${symbol}`);
      if (!response.ok) {
        throw new Error(`Binance API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching current price:', error);
      throw error;
    }
  }

  // WebSocket URLs for real-time data
  getTickerStreamUrl(symbol: string): string {
    return `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`;
  }

  getTradeStreamUrl(symbol: string): string {
    return `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`;
  }

  getMultiStreamUrl(streams: string[]): string {
    return `wss://stream.binance.com:9443/stream?streams=${streams.join('/')}`;
  }

  // Helper method to format symbol names
  formatSymbol(base: string, quote: string = 'USDT'): string {
    return `${base.toUpperCase()}${quote.toUpperCase()}`;
  }

  // Helper method to parse price with appropriate decimal places
  formatPrice(price: string | number, symbol: string): string {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Special formatting for different assets
    if (symbol.includes('ADA') || symbol.includes('DOGE')) {
      return numPrice.toFixed(4);
    }
    if (symbol.includes('BTC') || symbol.includes('ETH')) {
      return numPrice.toFixed(2);
    }
    
    return numPrice.toFixed(2);
  }
}

export const binanceAPI = new BinanceAPI();
