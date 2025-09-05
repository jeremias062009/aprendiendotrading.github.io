import {
  adminUsers,
  ebooks,
  tutorials,
  aiStrategies,
  marketData,
  type AdminUser,
  type InsertAdminUser,
  type EBook,
  type InsertEBook,
  type Tutorial,
  type InsertTutorial,
  type AIStrategy,
  type InsertAIStrategy,
  type MarketData,
  type InsertMarketData,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Admin operations
  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  
  // eBook operations
  getAllEbooks(): Promise<EBook[]>;
  getEbookById(id: string): Promise<EBook | undefined>;
  createEbook(ebook: InsertEBook): Promise<EBook>;
  updateEbook(id: string, ebook: Partial<InsertEBook>): Promise<EBook>;
  deleteEbook(id: string): Promise<void>;
  
  // Tutorial operations
  getAllTutorials(): Promise<Tutorial[]>;
  getTutorialById(id: string): Promise<Tutorial | undefined>;
  getTutorialsByPlatform(platform: string): Promise<Tutorial[]>;
  createTutorial(tutorial: InsertTutorial): Promise<Tutorial>;
  updateTutorial(id: string, tutorial: Partial<InsertTutorial>): Promise<Tutorial>;
  deleteTutorial(id: string): Promise<void>;
  
  // AI Strategy operations
  getAllAIStrategies(): Promise<AIStrategy[]>;
  getActiveAIStrategies(): Promise<AIStrategy[]>;
  createAIStrategy(strategy: InsertAIStrategy): Promise<AIStrategy>;
  updateAIStrategy(id: string, strategy: Partial<InsertAIStrategy>): Promise<AIStrategy>;
  deleteAIStrategy(id: string): Promise<void>;
  
  // Market data operations
  getMarketData(): Promise<MarketData[]>;
  getMarketDataBySymbol(symbol: string): Promise<MarketData | undefined>;
  upsertMarketData(data: InsertMarketData): Promise<MarketData>;
  bulkUpsertMarketData(data: InsertMarketData[]): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Admin operations
  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return user || undefined;
  }

  async createAdminUser(userData: InsertAdminUser): Promise<AdminUser> {
    const [user] = await db.insert(adminUsers).values(userData).returning();
    return user;
  }

  // eBook operations
  async getAllEbooks(): Promise<EBook[]> {
    return await db.select().from(ebooks).orderBy(desc(ebooks.createdAt));
  }

  async getEbookById(id: string): Promise<EBook | undefined> {
    const [ebook] = await db.select().from(ebooks).where(eq(ebooks.id, id));
    return ebook || undefined;
  }

  async createEbook(ebookData: InsertEBook): Promise<EBook> {
    const [ebook] = await db.insert(ebooks).values(ebookData).returning();
    return ebook;
  }

  async updateEbook(id: string, ebookData: Partial<InsertEBook>): Promise<EBook> {
    const [ebook] = await db
      .update(ebooks)
      .set({ ...ebookData, updatedAt: new Date() })
      .where(eq(ebooks.id, id))
      .returning();
    return ebook;
  }

  async deleteEbook(id: string): Promise<void> {
    await db.delete(ebooks).where(eq(ebooks.id, id));
  }

  // Tutorial operations
  async getAllTutorials(): Promise<Tutorial[]> {
    return await db.select().from(tutorials).orderBy(desc(tutorials.createdAt));
  }

  async getTutorialById(id: string): Promise<Tutorial | undefined> {
    const [tutorial] = await db.select().from(tutorials).where(eq(tutorials.id, id));
    return tutorial || undefined;
  }

  async getTutorialsByPlatform(platform: string): Promise<Tutorial[]> {
    return await db
      .select()
      .from(tutorials)
      .where(and(eq(tutorials.platform, platform), eq(tutorials.isPublished, true)))
      .orderBy(desc(tutorials.createdAt));
  }

  async createTutorial(tutorialData: InsertTutorial): Promise<Tutorial> {
    const [tutorial] = await db.insert(tutorials).values(tutorialData).returning();
    return tutorial;
  }

  async updateTutorial(id: string, tutorialData: Partial<InsertTutorial>): Promise<Tutorial> {
    const [tutorial] = await db
      .update(tutorials)
      .set({ ...tutorialData, updatedAt: new Date() })
      .where(eq(tutorials.id, id))
      .returning();
    return tutorial;
  }

  async deleteTutorial(id: string): Promise<void> {
    await db.delete(tutorials).where(eq(tutorials.id, id));
  }

  // AI Strategy operations
  async getAllAIStrategies(): Promise<AIStrategy[]> {
    return await db.select().from(aiStrategies).orderBy(desc(aiStrategies.createdAt));
  }

  async getActiveAIStrategies(): Promise<AIStrategy[]> {
    return await db
      .select()
      .from(aiStrategies)
      .where(eq(aiStrategies.isActive, true))
      .orderBy(desc(aiStrategies.createdAt));
  }

  async createAIStrategy(strategyData: InsertAIStrategy): Promise<AIStrategy> {
    const [strategy] = await db.insert(aiStrategies).values(strategyData).returning();
    return strategy;
  }

  async updateAIStrategy(id: string, strategyData: Partial<InsertAIStrategy>): Promise<AIStrategy> {
    const [strategy] = await db
      .update(aiStrategies)
      .set({ ...strategyData, updatedAt: new Date() })
      .where(eq(aiStrategies.id, id))
      .returning();
    return strategy;
  }

  async deleteAIStrategy(id: string): Promise<void> {
    await db.delete(aiStrategies).where(eq(aiStrategies.id, id));
  }

  // Market data operations
  async getMarketData(): Promise<MarketData[]> {
    return await db.select().from(marketData).orderBy(desc(marketData.lastUpdate));
  }

  async getMarketDataBySymbol(symbol: string): Promise<MarketData | undefined> {
    const [data] = await db.select().from(marketData).where(eq(marketData.symbol, symbol));
    return data || undefined;
  }

  async upsertMarketData(data: InsertMarketData): Promise<MarketData> {
    const [result] = await db
      .insert(marketData)
      .values({ ...data, lastUpdate: new Date() })
      .onConflictDoUpdate({
        target: marketData.symbol,
        set: {
          price: data.price,
          changePercent: data.changePercent,
          volume: data.volume,
          high24h: data.high24h,
          low24h: data.low24h,
          lastUpdate: new Date(),
        },
      })
      .returning();
    return result;
  }

  async bulkUpsertMarketData(dataArray: InsertMarketData[]): Promise<void> {
    for (const data of dataArray) {
      await this.upsertMarketData(data);
    }
  }
}

export const storage = new DatabaseStorage();
