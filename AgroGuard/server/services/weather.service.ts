import type { WeatherResponse, ForecastDay } from "@shared/schema";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export class WeatherService {
  async getCurrentWeather(lat: number, lon: number, location: string): Promise<WeatherResponse> {
    if (!OPENWEATHER_API_KEY) {
      return this.getMockWeatherData(lat, lon, location);
    }

    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      const forecastUrl = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();
      
      const forecast = this.parseForecast(forecastData);
      
      return {
        location,
        latitude: lat,
        longitude: lon,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        rainfall: data.rain?.['1h'] || data.rain?.['3h'] || 0,
        conditions: data.weather[0]?.main || "Clear",
        forecast,
      };
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw new Error("Failed to fetch weather data");
    }
  }

  private parseForecast(data: any): ForecastDay[] {
    const dailyForecasts = new Map<string, any[]>();
    
    data.list.forEach((item: any) => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyForecasts.has(date)) {
        dailyForecasts.set(date, []);
      }
      dailyForecasts.get(date)!.push(item);
    });
    
    const forecast: ForecastDay[] = [];
    let count = 0;
    
    for (const [date, items] of dailyForecasts) {
      if (count >= 7) break;
      
      const temps = items.map(i => i.main.temp);
      const humidity = items.reduce((sum, i) => sum + i.main.humidity, 0) / items.length;
      const rainfall = items.reduce((sum, i) => sum + (i.rain?.['3h'] || 0), 0);
      
      const midDayItem = items[Math.floor(items.length / 2)];
      
      forecast.push({
        date,
        tempMax: Math.max(...temps),
        tempMin: Math.min(...temps),
        humidity: Math.round(humidity),
        rainfall,
        conditions: midDayItem.weather[0]?.main || "Clear",
        icon: midDayItem.weather[0]?.icon || "01d",
      });
      
      count++;
    }
    
    return forecast;
  }

  private getMockWeatherData(lat: number, lon: number, location: string): WeatherResponse {
    const baseTemp = 28;
    const baseHumidity = 65;
    const today = new Date();
    
    const forecast: ForecastDay[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      const tempVariation = Math.sin(i * 0.5) * 4;
      const rainfallChance = Math.random();
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        tempMax: baseTemp + tempVariation + 3,
        tempMin: baseTemp + tempVariation - 2,
        humidity: baseHumidity + Math.floor(Math.random() * 20 - 10),
        rainfall: rainfallChance > 0.7 ? Math.random() * 15 : 0,
        conditions: rainfallChance > 0.7 ? "Rain" : rainfallChance > 0.4 ? "Clouds" : "Clear",
        icon: rainfallChance > 0.7 ? "10d" : rainfallChance > 0.4 ? "03d" : "01d",
      });
    }
    
    return {
      location,
      latitude: lat,
      longitude: lon,
      temperature: baseTemp,
      humidity: baseHumidity,
      rainfall: 0,
      conditions: "Clear",
      forecast,
    };
  }

  async getWeatherByCity(city: string): Promise<WeatherResponse> {
    if (!OPENWEATHER_API_KEY) {
      return this.getMockWeatherData(9.9281, -84.0907, city);
    }

    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHER_API_KEY}`;
    
    try {
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();
      
      if (!geoData || geoData.length === 0) {
        throw new Error("Location not found");
      }
      
      const { lat, lon, name } = geoData[0];
      return this.getCurrentWeather(lat, lon, name);
    } catch (error) {
      console.error("Error fetching weather by city:", error);
      throw new Error("Failed to fetch weather data");
    }
  }
}

export const weatherService = new WeatherService();
