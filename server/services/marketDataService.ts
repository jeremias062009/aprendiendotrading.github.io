import { storage } from '../storage';

interface BinanceTickerResponse {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
  highPrice: string;
  lowPrice: string;
}

class MarketDataService {
  private updateInterval: NodeJS.Timeout | null = null;
  private readonly symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'DOGEUSDT', 'DOTUSDT'];

  async initialize() {
    console.log('Initializing Market Data Service...');
    
    // Initial data fetch
    await this.updateMarketData();
    
    // Set up periodic updates every 30 seconds
    this.updateInterval = setInterval(() => {
      this.updateMarketData();
    }, 30000);
  }

  private async updateMarketData() {
    try {
      console.log('Fetching market data from Binance API...');
      
      // Fetch data for all symbols
      const promises = this.symbols.map(symbol => this.fetchSymbolData(symbol));
      await Promise.all(promises);
      
      console.log('Market data updated successfully');
    } catch (error) {
      console.error('Error updating market data:', error);
    }
  }

  private async fetchSymbolData(symbol: string) {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
      
      if (!response.ok) {
        console.warn(`Failed to fetch ${symbol}:`, response.status);
        return;
      }

      const data: BinanceTickerResponse = await response.json();
      
      // Store in database
      await storage.upsertMarketData({
        symbol: data.symbol,
        price: data.lastPrice,
        changePercent: data.priceChangePercent,
        volume: data.volume,
        high24h: data.highPrice,
        low24h: data.lowPrice,
      });

    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
    }
  }

  async getMarketData() {
    return await storage.getMarketData();
  }

  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

export const marketDataService = new MarketDataService();