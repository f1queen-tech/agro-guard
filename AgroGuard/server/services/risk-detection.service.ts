import type { RiskDetection, RiskType, Severity, WeatherResponse } from "@shared/schema";
import { storage } from "../storage";

export class RiskDetectionService {
  async detectRisks(weather: WeatherResponse): Promise<RiskDetection[]> {
    const risks: RiskDetection[] = [];
    
    const droughtRisk = this.detectDrought(weather);
    if (droughtRisk) risks.push(droughtRisk);
    
    const floodRisk = this.detectFlood(weather);
    if (floodRisk) risks.push(floodRisk);
    
    const pestRisk = this.detectPest(weather);
    if (pestRisk) risks.push(pestRisk);
    
    return risks;
  }

  private detectDrought(weather: WeatherResponse): RiskDetection | null {
    const { forecast, location, rainfall } = weather;
    
    const dryDays = forecast.filter(day => day.rainfall < 5).length;
    const totalRainfall = forecast.reduce((sum, day) => sum + day.rainfall, 0);
    
    let severity: Severity | null = null;
    let description = "";
    
    if (dryDays >= 6 && totalRainfall < 10) {
      severity = "severe";
      description = `Critical drought conditions: ${dryDays} dry days forecast with only ${totalRainfall.toFixed(1)}mm total rainfall expected`;
    } else if (dryDays >= 5 || totalRainfall < 15) {
      severity = "high";
      description = `High drought risk: ${dryDays} dry days forecast with minimal rainfall (${totalRainfall.toFixed(1)}mm)`;
    } else if (dryDays >= 4 || totalRainfall < 25) {
      severity = "medium";
      description = `Moderate drought risk: ${dryDays} dry days with low rainfall (${totalRainfall.toFixed(1)}mm)`;
    } else if (dryDays >= 3) {
      severity = "low";
      description = `Low drought risk: ${dryDays} dry days expected`;
    }
    
    if (!severity) return null;
    
    return {
      type: "drought",
      severity,
      location,
      description,
      affectedFarmers: 0,
    };
  }

  private detectFlood(weather: WeatherResponse): RiskDetection | null {
    const { forecast, location } = weather;
    
    const heavyRainDays = forecast.filter(day => day.rainfall > 30);
    const maxDailyRain = Math.max(...forecast.map(day => day.rainfall));
    const totalRainfall = forecast.reduce((sum, day) => sum + day.rainfall, 0);
    
    let severity: Severity | null = null;
    let description = "";
    
    if (maxDailyRain > 100 || heavyRainDays.length >= 3) {
      severity = "severe";
      description = `Severe flood warning: Heavy rainfall expected (max ${maxDailyRain.toFixed(1)}mm/day)`;
    } else if (maxDailyRain > 70 || (heavyRainDays.length >= 2 && totalRainfall > 150)) {
      severity = "high";
      description = `High flood risk: Significant rainfall forecast (${totalRainfall.toFixed(1)}mm total)`;
    } else if (maxDailyRain > 50 || totalRainfall > 120) {
      severity = "medium";
      description = `Moderate flood risk: Heavy rain periods expected (${maxDailyRain.toFixed(1)}mm peak)`;
    } else if (maxDailyRain > 35) {
      severity = "low";
      description = `Low flood risk: Some heavy rain expected`;
    }
    
    if (!severity) return null;
    
    return {
      type: "flood",
      severity,
      location,
      description,
      affectedFarmers: 0,
    };
  }

  private detectPest(weather: WeatherResponse): RiskDetection | null {
    const { temperature, humidity, forecast, location } = weather;
    
    const avgTemp = (temperature + forecast.reduce((sum, d) => sum + (d.tempMax + d.tempMin) / 2, 0)) / (forecast.length + 1);
    const avgHumidity = (humidity + forecast.reduce((sum, d) => sum + d.humidity, 0)) / (forecast.length + 1);
    
    const optimalTempDays = forecast.filter(day => 
      (day.tempMax + day.tempMin) / 2 >= 25 && (day.tempMax + day.tempMin) / 2 <= 32
    ).length;
    
    const highHumidityDays = forecast.filter(day => day.humidity > 70).length;
    
    let severity: Severity | null = null;
    let description = "";
    
    if (avgTemp >= 27 && avgTemp <= 31 && avgHumidity > 75 && optimalTempDays >= 5) {
      severity = "high";
      description = `High pest risk: Optimal conditions for pest activity (${avgTemp.toFixed(1)}°C, ${avgHumidity.toFixed(0)}% humidity)`;
    } else if (avgTemp >= 25 && avgTemp <= 32 && avgHumidity > 70 && optimalTempDays >= 3) {
      severity = "medium";
      description = `Moderate pest risk: Favorable conditions for pest development (${avgTemp.toFixed(1)}°C, ${avgHumidity.toFixed(0)}% humidity)`;
    } else if ((avgTemp >= 25 && avgTemp <= 32) && (avgHumidity > 65 || highHumidityDays >= 2)) {
      severity = "low";
      description = `Low pest risk: Some favorable conditions present`;
    }
    
    if (!severity) return null;
    
    return {
      type: "pest",
      severity,
      location,
      description,
      affectedFarmers: 0,
    };
  }

  async getRisksWithFarmerCount(weather: WeatherResponse): Promise<RiskDetection[]> {
    const risks = await this.detectRisks(weather);
    const farmers = await storage.getAllFarmers();
    
    return risks.map(risk => ({
      ...risk,
      affectedFarmers: farmers.filter(f => 
        this.isNearLocation(f.latitude, f.longitude, weather.latitude, weather.longitude)
      ).length,
    }));
  }

  private isNearLocation(lat1: number, lon1: number, lat2: number, lon2: number): boolean {
    const distance = Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2));
    return distance < 1;
  }
}

export const riskDetectionService = new RiskDetectionService();
