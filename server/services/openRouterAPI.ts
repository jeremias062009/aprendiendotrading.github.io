interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface MarketAnalysis {
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

class OpenRouterService {
  private readonly apiKey = process.env.OPENROUTER_API_KEY || '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';
  private readonly baseUrl = 'https://openrouter.ai/api/v1';

  async analyzeMarket(symbol: string, timeframe: string = '1h'): Promise<MarketAnalysis> {
    try {
      // Get current market data for the symbol
      const marketData = await this.getCurrentMarketData(symbol);
      
      const prompt = `
        Analyze the current market conditions for ${symbol}:
        
        Current Price: $${marketData.price}
        24h Change: ${marketData.changePercent}%
        24h High: $${marketData.high24h}
        24h Low: $${marketData.low24h}
        Volume: ${marketData.volume}
        
        Please provide a comprehensive trading analysis including:
        1. Signal (BUY/SELL/HOLD)
        2. Confidence level (0-100)
        3. Technical analysis summary
        4. Key support and resistance levels
        5. RSI estimation
        6. MACD trend analysis
        
        Format your response as JSON with the following structure:
        {
          "signal": "BUY|SELL|HOLD",
          "confidence": 0-100,
          "summary": "Brief analysis summary",
          "technicalIndicators": {
            "rsi": 0-100,
            "macd": "bullish|bearish|neutral",
            "trend": "uptrend|downtrend|sideways"
          },
          "priceTargets": {
            "support": price_level,
            "resistance": price_level
          }
        }
      `;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://aprendiendo-trading.com',
          'X-Title': 'Aprendiendo Trading - AI Analysis',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'system',
              content: 'You are a professional cryptocurrency trading analyst with expertise in technical analysis. Provide accurate, data-driven trading insights.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data: OpenRouterResponse = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from OpenRouter API');
      }

      // Parse the JSON response
      const analysis = JSON.parse(content);
      
      return {
        ...analysis,
        timestamp: Date.now(),
      };

    } catch (error) {
      console.error('Error in OpenRouter analysis:', error);
      
      // Return a fallback analysis
      return {
        signal: 'HOLD',
        confidence: 50,
        summary: 'Unable to perform AI analysis at this time. Please try again later.',
        technicalIndicators: {
          rsi: 50,
          macd: 'neutral',
          trend: 'sideways',
        },
        priceTargets: {
          support: 0,
          resistance: 0,
        },
        timestamp: Date.now(),
      };
    }
  }

  private async getCurrentMarketData(symbol: string) {
    try {
      // Try to get from our database first
      const { storage } = await import('../storage');
      const data = await storage.getMarketDataBySymbol(symbol);
      
      if (data) {
        return {
          price: parseFloat(data.price),
          changePercent: parseFloat(data.changePercent),
          high24h: parseFloat(data.high24h),
          low24h: parseFloat(data.low24h),
          volume: parseFloat(data.volume),
        };
      }

      // Fallback to Binance API if not in database
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
      const binanceData = await response.json();

      return {
        price: parseFloat(binanceData.lastPrice),
        changePercent: parseFloat(binanceData.priceChangePercent),
        high24h: parseFloat(binanceData.highPrice),
        low24h: parseFloat(binanceData.lowPrice),
        volume: parseFloat(binanceData.volume),
      };

    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  }

  async generateTradingStrategy(symbols: string[], riskLevel: 'low' | 'medium' | 'high' = 'medium'): Promise<any> {
    try {
      const prompt = `
        Generate a comprehensive trading strategy for the following cryptocurrency symbols: ${symbols.join(', ')}.
        
        Risk Level: ${riskLevel}
        
        Please provide:
        1. Overall market outlook
        2. Individual analysis for each symbol
        3. Portfolio allocation recommendations
        4. Risk management guidelines
        5. Entry and exit strategies
        6. Time horizon recommendations
        
        Consider current market conditions, volatility, and correlation between assets.
      `;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://aprendiendo-trading.com',
          'X-Title': 'Aprendiendo Trading - Strategy Generation',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'system',
              content: 'You are a professional portfolio manager and trading strategist specializing in cryptocurrency markets.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.4,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();
      return {
        strategy: data.choices[0]?.message?.content,
        timestamp: Date.now(),
        symbols,
        riskLevel,
      };

    } catch (error) {
      console.error('Error generating trading strategy:', error);
      throw error;
    }
  }
}

export const openRouterService = new OpenRouterService();
