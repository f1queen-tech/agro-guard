import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const farmers = pgTable("farmers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  location: text("location").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  language: text("language").notNull().default("en"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  farmerId: varchar("farmer_id").notNull(),
  alertType: text("alert_type").notNull(),
  severity: text("severity").notNull(),
  message: text("message").notNull(),
  language: text("language").notNull(),
  status: text("status").notNull().default("sent"),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});

export const weatherData = pgTable("weather_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  location: text("location").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  temperature: real("temperature").notNull(),
  humidity: integer("humidity").notNull(),
  rainfall: real("rainfall").notNull(),
  conditions: text("conditions").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const crops = pgTable("crops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  scientificName: text("scientific_name"),
  category: text("category").notNull(),
  growingPeriod: integer("growing_period"),
  waterRequirement: text("water_requirement"),
  sunRequirement: text("sun_requirement"),
  temperatureMin: real("temperature_min"),
  temperatureMax: real("temperature_max"),
  soilType: text("soil_type"),
  description: text("description"),
});

export const fields = pgTable("fields", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  farmerId: varchar("farmer_id").notNull(),
  name: text("name").notNull(),
  cropId: varchar("crop_id"), // Primary crop (for backwards compatibility)
  area: real("area").notNull(),
  coordinates: text("coordinates").notNull(),
  centerLatitude: real("center_latitude").notNull(),
  centerLongitude: real("center_longitude").notNull(),
  soilType: text("soil_type"),
  irrigationType: text("irrigation_type"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Beta Feature: Multiple crops per field for advanced users (5+ fields)
export const fieldCrops = pgTable("field_crops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fieldId: varchar("field_id").notNull(),
  cropId: varchar("crop_id").notNull(),
  plantedDate: timestamp("planted_date"),
  harvestDate: timestamp("harvest_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Companion planting recommendations for multicropping
export const companionPlants = pgTable("companion_plants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cropId: varchar("crop_id").notNull(), // Main crop
  companionCropId: varchar("companion_crop_id").notNull(), // Good companion
  relationship: text("relationship").notNull(), // 'companion' or 'avoid'
  benefit: text("benefit"), // e.g., "pest control", "nutrient sharing"
  description: text("description"),
});

export const insertFarmerSchema = createInsertSchema(farmers).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  sentAt: true,
});

export const insertWeatherDataSchema = createInsertSchema(weatherData).omit({
  id: true,
  timestamp: true,
});

export const insertCropSchema = createInsertSchema(crops).omit({
  id: true,
});

export const insertFieldSchema = createInsertSchema(fields).omit({
  id: true,
  createdAt: true,
});

export const insertFieldCropSchema = createInsertSchema(fieldCrops).omit({
  id: true,
  createdAt: true,
});

export const insertCompanionPlantSchema = createInsertSchema(companionPlants).omit({
  id: true,
});

export type InsertFarmer = z.infer<typeof insertFarmerSchema>;
export type Farmer = typeof farmers.$inferSelect;

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

export type InsertWeatherData = z.infer<typeof insertWeatherDataSchema>;
export type WeatherData = typeof weatherData.$inferSelect;

export type InsertCrop = z.infer<typeof insertCropSchema>;
export type Crop = typeof crops.$inferSelect;

export type InsertField = z.infer<typeof insertFieldSchema>;
export type Field = typeof fields.$inferSelect;

export type InsertFieldCrop = z.infer<typeof insertFieldCropSchema>;
export type FieldCrop = typeof fieldCrops.$inferSelect;

export type InsertCompanionPlant = z.infer<typeof insertCompanionPlantSchema>;
export type CompanionPlant = typeof companionPlants.$inferSelect;

export type RiskType = "drought" | "flood" | "pest";
export type Severity = "low" | "medium" | "high" | "severe";
export type Language = "en" | "es" | "hi";

export interface RiskDetection {
  type: RiskType;
  severity: Severity;
  location: string;
  description: string;
  affectedFarmers: number;
}

export interface WeatherResponse {
  location: string;
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  conditions: string;
  forecast: ForecastDay[];
}

export interface ForecastDay {
  date: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  rainfall: number;
  conditions: string;
  icon: string;
}

export interface DashboardStats {
  totalFarmers: number;
  alertsSentToday: number;
  activeWarnings: number;
  currentRisks: RiskDetection[];
}
