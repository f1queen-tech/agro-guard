import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { weatherService } from "./services/weather.service";
import { riskDetectionService } from "./services/risk-detection.service";
import { smsService } from "./services/sms.service";
import { insertFarmerSchema, insertAlertSchema, insertFieldSchema, type DashboardStats, type Language, type RiskType, type RiskDetection } from "@shared/schema";
import { z } from "zod";
import { openai, SYSTEM_PROMPT } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/farmers", async (req, res) => {
    try {
      const farmers = await storage.getAllFarmers();
      res.json(farmers);
    } catch (error) {
      console.error("Error fetching farmers:", error);
      res.status(500).json({ error: "Failed to fetch farmers" });
    }
  });

  app.post("/api/farmers", async (req, res) => {
    try {
      const validatedData = insertFarmerSchema.parse(req.body);
      const farmer = await storage.createFarmer(validatedData);
      res.status(201).json(farmer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid farmer data", details: error.errors });
      } else {
        console.error("Error creating farmer:", error);
        res.status(500).json({ error: "Failed to create farmer" });
      }
    }
  });

  app.put("/api/farmers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertFarmerSchema.partial().parse(req.body);
      const farmer = await storage.updateFarmer(id, validatedData);
      
      if (!farmer) {
        return res.status(404).json({ error: "Farmer not found" });
      }
      
      res.json(farmer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid farmer data", details: error.errors });
      } else {
        console.error("Error updating farmer:", error);
        res.status(500).json({ error: "Failed to update farmer" });
      }
    }
  });

  app.delete("/api/farmers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteFarmer(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Farmer not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting farmer:", error);
      res.status(500).json({ error: "Failed to delete farmer" });
    }
  });

  app.get("/api/weather/:location", async (req, res) => {
    try {
      const { location } = req.params;
      const weather = await weatherService.getWeatherByCity(location);
      
      await storage.createWeatherData({
        location: weather.location,
        latitude: weather.latitude,
        longitude: weather.longitude,
        temperature: weather.temperature,
        humidity: weather.humidity,
        rainfall: weather.rainfall,
        conditions: weather.conditions,
      });
      
      res.json(weather);
    } catch (error) {
      console.error("Error fetching weather:", error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  app.get("/api/weather/coordinates/:lat/:lon", async (req, res) => {
    try {
      const lat = parseFloat(req.params.lat);
      const lon = parseFloat(req.params.lon);
      const location = req.query.location as string || "Unknown Location";
      
      const weather = await weatherService.getCurrentWeather(lat, lon, location);
      
      await storage.createWeatherData({
        location: weather.location,
        latitude: weather.latitude,
        longitude: weather.longitude,
        temperature: weather.temperature,
        humidity: weather.humidity,
        rainfall: weather.rainfall,
        conditions: weather.conditions,
      });
      
      res.json(weather);
    } catch (error) {
      console.error("Error fetching weather:", error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  app.get("/api/risks/:location", async (req, res) => {
    try {
      const { location } = req.params;
      const weather = await weatherService.getWeatherByCity(location);
      const risks = await riskDetectionService.getRisksWithFarmerCount(weather);
      
      res.json(risks);
    } catch (error) {
      console.error("Error detecting risks:", error);
      res.status(500).json({ error: "Failed to detect risks" });
    }
  });

  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAllAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts/send", async (req, res) => {
    try {
      const { farmerIds, riskType, description, severity } = req.body;
      
      if (!farmerIds || !Array.isArray(farmerIds) || farmerIds.length === 0) {
        return res.status(400).json({ error: "Farmer IDs are required" });
      }
      
      if (!riskType || !description) {
        return res.status(400).json({ error: "Risk type and description are required" });
      }
      
      const sentAlerts = [];
      const errors = [];
      
      for (const farmerId of farmerIds) {
        try {
          const farmer = await storage.getFarmer(farmerId);
          if (!farmer) {
            errors.push({ farmerId, error: "Farmer not found" });
            continue;
          }
          
          const message = smsService.generateAlertMessage(
            riskType as RiskType,
            description,
            farmer.language as Language
          );
          
          await smsService.sendAlert(
            farmer.phone,
            riskType as RiskType,
            description,
            farmer.language as Language
          );
          
          const alert = await storage.createAlert({
            farmerId: farmer.id,
            alertType: riskType,
            severity: severity || "medium",
            message,
            language: farmer.language,
            status: "sent",
          });
          
          sentAlerts.push(alert);
        } catch (error) {
          console.error(`Error sending alert to farmer ${farmerId}:`, error);
          errors.push({ farmerId, error: "Failed to send alert" });
        }
      }
      
      res.status(201).json({
        sent: sentAlerts.length,
        failed: errors.length,
        alerts: sentAlerts,
        errors,
      });
    } catch (error) {
      console.error("Error sending alerts:", error);
      res.status(500).json({ error: "Failed to send alerts" });
    }
  });

  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const farmers = await storage.getAllFarmers();
      const alerts = await storage.getAllAlerts();
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const alertsToday = alerts.filter(alert => 
        alert.sentAt >= today
      ).length;
      
      let currentRisks: RiskDetection[] = [];
      if (farmers.length > 0) {
        const firstFarmer = farmers[0];
        const weather = await weatherService.getCurrentWeather(
          firstFarmer.latitude,
          firstFarmer.longitude,
          firstFarmer.location
        );
        currentRisks = await riskDetectionService.getRisksWithFarmerCount(weather);
      }
      
      const stats: DashboardStats = {
        totalFarmers: farmers.length,
        alertsSentToday: alertsToday,
        activeWarnings: currentRisks.filter(r => r.severity === "high" || r.severity === "severe").length,
        currentRisks,
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  app.get("/api/crops", async (req, res) => {
    try {
      const query = req.query.search as string;
      const crops = query 
        ? await storage.searchCrops(query)
        : await storage.getAllCrops();
      res.json(crops);
    } catch (error) {
      console.error("Error fetching crops:", error);
      res.status(500).json({ error: "Failed to fetch crops" });
    }
  });

  app.get("/api/crops/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const crop = await storage.getCrop(id);
      
      if (!crop) {
        return res.status(404).json({ error: "Crop not found" });
      }
      
      res.json(crop);
    } catch (error) {
      console.error("Error fetching crop:", error);
      res.status(500).json({ error: "Failed to fetch crop" });
    }
  });

  app.get("/api/fields", async (req, res) => {
    try {
      const { farmerId } = req.query;
      
      if (farmerId) {
        const fields = await storage.getFieldsByFarmer(farmerId as string);
        return res.json(fields);
      }
      
      res.status(400).json({ error: "farmerId query parameter required" });
    } catch (error) {
      console.error("Error fetching fields:", error);
      res.status(500).json({ error: "Failed to fetch fields" });
    }
  });

  app.get("/api/fields/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const field = await storage.getField(id);
      
      if (!field) {
        return res.status(404).json({ error: "Field not found" });
      }
      
      res.json(field);
    } catch (error) {
      console.error("Error fetching field:", error);
      res.status(500).json({ error: "Failed to fetch field" });
    }
  });

  app.post("/api/fields", async (req, res) => {
    try {
      const validatedData = insertFieldSchema.parse(req.body);
      const field = await storage.createField(validatedData);
      res.status(201).json(field);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid field data", details: error.errors });
      } else {
        console.error("Error creating field:", error);
        res.status(500).json({ error: "Failed to create field" });
      }
    }
  });

  app.put("/api/fields/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertFieldSchema.partial().parse(req.body);
      const field = await storage.updateField(id, validatedData);
      
      if (!field) {
        return res.status(404).json({ error: "Field not found" });
      }
      
      res.json(field);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid field data", details: error.errors });
      } else {
        console.error("Error updating field:", error);
        res.status(500).json({ error: "Failed to update field" });
      }
    }
  });

  app.delete("/api/fields/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteField(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Field not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting field:", error);
      res.status(500).json({ error: "Failed to delete field" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const completion = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages
        ],
        max_completion_tokens: 8192,
      });

      const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
      
      res.json({ message: reply });
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      res.status(500).json({ error: "Failed to get chat response" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
