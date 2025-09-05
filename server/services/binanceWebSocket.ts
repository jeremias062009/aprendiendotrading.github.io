import WebSocket from "ws";
import { storage } from "../storage";

interface BinanceTickerData {
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

interface BinanceStreamData {
  stream: string;
  data: BinanceTickerData;
}

class BinanceWebSocketService {
  private ws: WebSocket | null = null;
  private subscribers: ((data: any) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;

  initialize() {
    this.connect();
  }

  private connect() {
    try {
      // Subscribe to multiple symbol ticker streams
      const symbols = ['btcusdt', 'ethusdt', 'bnbusdt', 'adausdt', 'dogeusdt', 'dotusdt', 'avaxusdt', 'solusdt', 'lunausdt'];
      const streams = symbols.map(symbol => `${symbol}@ticker`).join('/');
      
      this.ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

      this.ws.on('open', () => {
        console.log('Connected to Binance WebSocket');
        this.reconnectAttempts = 0;
      });

      this.ws.on('message', async (data: Buffer) => {
        try {
          const message: BinanceStreamData = JSON.parse(data.toString());
          await this.handleMarketData(message);
        } catch (error) {
          console.error('Error parsing Binance message:', error);
        }
      });

      this.ws.on('close', () => {
        console.log('Binance WebSocket disconnected');
        this.reconnect();
      });

      this.ws.on('error', (error) => {
        console.error('Binance WebSocket error:', error);
        this.reconnect();
      });

      // Ping interval to keep connection alive
      setInterval(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.ping();
        }
      }, 20000);

    } catch (error) {
      console.error('Error connecting to Binance WebSocket:', error);
      this.reconnect();
    }
  }

  private reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval * this.reconnectAttempts);
  }

  private async handleMarketData(message: BinanceStreamData) {
    try {
      const { data } = message;
      
      const marketData = {
        symbol: data.s,
        price: data.c,
        changePercent: data.P,
        volume: data.v,
        high24h: data.h,
        low24h: data.l,
      };

      // Store in database
      await storage.upsertMarketData(marketData);

      // Notify subscribers
      this.notifySubscribers({
        type: 'ticker',
        symbol: data.s,
        price: parseFloat(data.c),
        changePercent: parseFloat(data.P),
        volume: parseFloat(data.v),
        high24h: parseFloat(data.h),
        low24h: parseFloat(data.l),
        timestamp: Date.now(),
      });

    } catch (error) {
      console.error('Error handling market data:', error);
    }
  }

  subscribe(callback: (data: any) => void): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  private notifySubscribers(data: any) {
    this.subscribers.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in subscriber callback:', error);
      }
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const binanceWebSocketService = new BinanceWebSocketService();
