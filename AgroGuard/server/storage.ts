import { 
  type Farmer, 
  type InsertFarmer, 
  type Alert, 
  type InsertAlert,
  type WeatherData,
  type InsertWeatherData,
  type Crop,
  type InsertCrop,
  type Field,
  type InsertField,
  farmers,
  alerts,
  weatherData,
  crops,
  fields
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, or } from "drizzle-orm";

export interface IStorage {
  getFarmer(id: string): Promise<Farmer | undefined>;
  getAllFarmers(): Promise<Farmer[]>;
  createFarmer(farmer: InsertFarmer): Promise<Farmer>;
  updateFarmer(id: string, farmer: Partial<InsertFarmer>): Promise<Farmer | undefined>;
  deleteFarmer(id: string): Promise<boolean>;
  
  getAlert(id: string): Promise<Alert | undefined>;
  getAllAlerts(): Promise<Alert[]>;
  getAlertsByFarmer(farmerId: string): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  
  getWeatherData(location: string): Promise<WeatherData | undefined>;
  createWeatherData(data: InsertWeatherData): Promise<WeatherData>;
  getRecentWeatherData(limit: number): Promise<WeatherData[]>;
  
  getCrop(id: string): Promise<Crop | undefined>;
  getAllCrops(): Promise<Crop[]>;
  searchCrops(query: string): Promise<Crop[]>;
  createCrop(crop: InsertCrop): Promise<Crop>;
  
  getField(id: string): Promise<Field | undefined>;
  getFieldsByFarmer(farmerId: string): Promise<Field[]>;
  createField(field: InsertField): Promise<Field>;
  updateField(id: string, field: Partial<InsertField>): Promise<Field | undefined>;
  deleteField(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getFarmer(id: string): Promise<Farmer | undefined> {
    const [farmer] = await db.select().from(farmers).where(eq(farmers.id, id));
    return farmer || undefined;
  }

  async getAllFarmers(): Promise<Farmer[]> {
    return await db.select().from(farmers).orderBy(desc(farmers.createdAt));
  }

  async createFarmer(insertFarmer: InsertFarmer): Promise<Farmer> {
    const [farmer] = await db
      .insert(farmers)
      .values(insertFarmer)
      .returning();
    return farmer;
  }

  async updateFarmer(id: string, updates: Partial<InsertFarmer>): Promise<Farmer | undefined> {
    const [farmer] = await db
      .update(farmers)
      .set(updates)
      .where(eq(farmers.id, id))
      .returning();
    return farmer || undefined;
  }

  async deleteFarmer(id: string): Promise<boolean> {
    const result = await db.delete(farmers).where(eq(farmers.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getAlert(id: string): Promise<Alert | undefined> {
    const [alert] = await db.select().from(alerts).where(eq(alerts.id, id));
    return alert || undefined;
  }

  async getAllAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(desc(alerts.sentAt));
  }

  async getAlertsByFarmer(farmerId: string): Promise<Alert[]> {
    return await db
      .select()
      .from(alerts)
      .where(eq(alerts.farmerId, farmerId))
      .orderBy(desc(alerts.sentAt));
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const [alert] = await db
      .insert(alerts)
      .values(insertAlert)
      .returning();
    return alert;
  }

  async getWeatherData(location: string): Promise<WeatherData | undefined> {
    const [data] = await db
      .select()
      .from(weatherData)
      .where(eq(weatherData.location, location))
      .orderBy(desc(weatherData.timestamp))
      .limit(1);
    return data || undefined;
  }

  async createWeatherData(insertData: InsertWeatherData): Promise<WeatherData> {
    const [data] = await db
      .insert(weatherData)
      .values(insertData)
      .returning();
    return data;
  }

  async getRecentWeatherData(limit: number): Promise<WeatherData[]> {
    return await db
      .select()
      .from(weatherData)
      .orderBy(desc(weatherData.timestamp))
      .limit(limit);
  }

  async getCrop(id: string): Promise<Crop | undefined> {
    const [crop] = await db.select().from(crops).where(eq(crops.id, id));
    return crop || undefined;
  }

  async getAllCrops(): Promise<Crop[]> {
    return await db.select().from(crops);
  }

  async searchCrops(query: string): Promise<Crop[]> {
    const searchTerm = `%${query}%`;
    return await db
      .select()
      .from(crops)
      .where(
        or(
          like(crops.name, searchTerm),
          like(crops.category, searchTerm),
          like(crops.scientificName, searchTerm)
        )
      )
      .limit(50);
  }

  async createCrop(insertCrop: InsertCrop): Promise<Crop> {
    const [crop] = await db
      .insert(crops)
      .values(insertCrop)
      .returning();
    return crop;
  }

  async getField(id: string): Promise<Field | undefined> {
    const [field] = await db.select().from(fields).where(eq(fields.id, id));
    return field || undefined;
  }

  async getFieldsByFarmer(farmerId: string): Promise<Field[]> {
    return await db
      .select()
      .from(fields)
      .where(eq(fields.farmerId, farmerId))
      .orderBy(desc(fields.createdAt));
  }

  async createField(insertField: InsertField): Promise<Field> {
    const [field] = await db
      .insert(fields)
      .values(insertField)
      .returning();
    return field;
  }

  async updateField(id: string, updates: Partial<InsertField>): Promise<Field | undefined> {
    const [field] = await db
      .update(fields)
      .set(updates)
      .where(eq(fields.id, id))
      .returning();
    return field || undefined;
  }

  async deleteField(id: string): Promise<boolean> {
    const result = await db.delete(fields).where(eq(fields.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
