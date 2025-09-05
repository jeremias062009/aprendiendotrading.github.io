import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertEbookSchema, insertTutorialSchema, insertAIStrategySchema } from "@shared/schema";
import { binanceWebSocketService } from "./services/binanceWebSocket";
import { openRouterService } from "./services/openRouterAPI";
import { marketDataService } from "./services/marketDataService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Validate admin credentials
      const validEmails = ['jeremias062009@gmail.com', 'eli.as.23@hotmail.com'];
      const validPassword = '0609';
      
      if (!validEmails.includes(email) || password !== validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check if admin user exists in database
      let admin = await storage.getAdminUserByEmail(email);
      if (!admin) {
        // Create admin user if doesn't exist
        admin = await storage.createAdminUser({ email, password });
      }

      res.json({ message: "Login successful", admin: { id: admin.id, email: admin.email } });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // eBook routes
  app.get("/api/ebooks", async (req, res) => {
    try {
      const ebooks = await storage.getAllEbooks();
      res.json(ebooks);
    } catch (error) {
      console.error("Error fetching ebooks:", error);
      res.status(500).json({ message: "Failed to fetch ebooks" });
    }
  });

  app.get("/api/ebooks/:id", async (req, res) => {
    try {
      const ebook = await storage.getEbookById(req.params.id);
      if (!ebook) {
        return res.status(404).json({ message: "eBook not found" });
      }
      res.json(ebook);
    } catch (error) {
      console.error("Error fetching ebook:", error);
      res.status(500).json({ message: "Failed to fetch ebook" });
    }
  });

  app.post("/api/admin/ebooks", async (req, res) => {
    try {
      const validatedData = insertEbookSchema.parse(req.body);
      const ebook = await storage.createEbook(validatedData);
      res.json(ebook);
    } catch (error) {
      console.error("Error creating ebook:", error);
      res.status(500).json({ message: "Failed to create ebook" });
    }
  });

  app.put("/api/admin/ebooks/:id", async (req, res) => {
    try {
      const validatedData = insertEbookSchema.partial().parse(req.body);
      const ebook = await storage.updateEbook(req.params.id, validatedData);
      res.json(ebook);
    } catch (error) {
      console.error("Error updating ebook:", error);
      res.status(500).json({ message: "Failed to update ebook" });
    }
  });

  app.delete("/api/admin/ebooks/:id", async (req, res) => {
    try {
      await storage.deleteEbook(req.params.id);
      res.json({ message: "eBook deleted successfully" });
    } catch (error) {
      console.error("Error deleting ebook:", error);
      res.status(500).json({ message: "Failed to delete ebook" });
    }
  });

  // Tutorial routes
  app.get("/api/tutorials", async (req, res) => {
    try {
      const { platform } = req.query;
      const tutorials = platform 
        ? await storage.getTutorialsByPlatform(platform as string)
        : await storage.getAllTutorials();
      res.json(tutorials);
    } catch (error) {
      console.error("Error fetching tutorials:", error);
      res.status(500).json({ message: "Failed to fetch tutorials" });
    }
  });

  app.post("/api/admin/tutorials", async (req, res) => {
    try {
      const validatedData = insertTutorialSchema.parse(req.body);
      const tutorial = await storage.createTutorial(validatedData);
      res.json(tutorial);
    } catch (error) {
      console.error("Error creating tutorial:", error);
      res.status(500).json({ message: "Failed to create tutorial" });
    }
  });

  app.put("/api/admin/tutorials/:id", async (req, res) => {
    try {
      const validatedData = insertTutorialSchema.partial().parse(req.body);
      const tutorial = await storage.updateTutorial(req.params.id, validatedData);
      res.json(tutorial);
    } catch (error) {
      console.error("Error updating tutorial:", error);
      res.status(500).json({ message: "Failed to update tutorial" });
    }
  });

  app.delete("/api/admin/tutorials/:id", async (req, res) => {
    try {
      await storage.deleteTutorial(req.params.id);
      res.json({ message: "Tutorial deleted successfully" });
    } catch (error) {
      console.error("Error deleting tutorial:", error);
      res.status(500).json({ message: "Failed to delete tutorial" });
    }
  });

  // AI Strategy routes
  app.get("/api/ai-strategies", async (req, res) => {
    try {
      const strategies = await storage.getActiveAIStrategies();
      res.json(strategies);
    } catch (error) {
      console.error("Error fetching AI strategies:", error);
      res.status(500).json({ message: "Failed to fetch AI strategies" });
    }
  });

  app.post("/api/admin/ai-strategies", async (req, res) => {
    try {
      const validatedData = insertAIStrategySchema.parse(req.body);
      const strategy = await storage.createAIStrategy(validatedData);
      res.json(strategy);
    } catch (error) {
      console.error("Error creating AI strategy:", error);
      res.status(500).json({ message: "Failed to create AI strategy" });
    }
  });

  // Market data routes
  app.get("/api/market-data", async (req, res) => {
    try {
      const marketData = await storage.getMarketData();
      res.json(marketData);
    } catch (error) {
      console.error("Error fetching market data:", error);
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  // AI Analysis route
  app.post("/api/ai/analyze", async (req, res) => {
    try {
      const { symbol, timeframe = "1h" } = req.body;
      const analysis = await openRouterService.analyzeMarket(symbol, timeframe);
      res.json(analysis);
    } catch (error) {
      console.error("Error in AI analysis:", error);
      res.status(500).json({ message: "Failed to perform AI analysis" });
    }
  });

  // Admin stats route
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const [ebooks, tutorials, strategies, marketData] = await Promise.all([
        storage.getAllEbooks(),
        storage.getAllTutorials(),
        storage.getAllAIStrategies(),
        storage.getMarketData(),
      ]);

      const stats = {
        activeUsers: 1234, // Mock for now
        completedEbooks: ebooks.filter(e => e.isPublished).length * 45, // Estimated
        referrals: 89, // Mock for now
        totalEbooks: ebooks.length,
        totalTutorials: tutorials.length,
        activeStrategies: strategies.filter(s => s.isActive).length,
        lastMarketUpdate: marketData[0]?.lastUpdate || new Date(),
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');

    // Send initial market data
    storage.getMarketData().then(data => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'market_data', data }));
      }
    });

    // Subscribe to Binance WebSocket updates
    const unsubscribe = binanceWebSocketService.subscribe((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'market_update', data }));
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      unsubscribe();
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Initialize services
  binanceWebSocketService.initialize();
  marketDataService.initialize();
  
  // Start AI analysis loop
  setInterval(async () => {
    try {
      const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
      for (const symbol of symbols) {
        const analysis = await openRouterService.analyzeMarket(symbol, '1h');
        await storage.createAIStrategy({
          name: `Auto Analysis ${symbol}`,
          description: analysis.summary,
          symbol,
          signal: analysis.signal,
          confidence: analysis.confidence.toString(),
          analysis: analysis,
          isActive: true,
        });
      }
    } catch (error) {
      console.error('Error in AI analysis loop:', error);
    }
  }, 300000); // Every 5 minutes

  return httpServer;
}
