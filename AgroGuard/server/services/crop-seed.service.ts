import { type InsertCrop } from "@shared/schema";
import { storage } from "../storage";
import { expandedCropData } from "./expanded-crops";

export const cropSeedData: InsertCrop[] = expandedCropData;

// Legacy small dataset (kept for reference, not used)
export const originalCropSeedData: InsertCrop[] = [
  { name: "Wheat", scientificName: "Triticum aestivum", category: "Grains", growingPeriod: 120, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 3, temperatureMax: 32, soilType: "Loamy", description: "Winter or spring wheat for bread and flour production" },
  { name: "Rice", scientificName: "Oryza sativa", category: "Grains", growingPeriod: 120, waterRequirement: "High", sunRequirement: "Full Sun", temperatureMin: 20, temperatureMax: 35, soilType: "Clay", description: "Staple grain crop requiring flooded fields" },
  { name: "Corn (Maize)", scientificName: "Zea mays", category: "Grains", growingPeriod: 90, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 15, temperatureMax: 35, soilType: "Loamy", description: "Versatile grain for food, feed, and fuel" },
  { name: "Soybeans", scientificName: "Glycine max", category: "Legumes", growingPeriod: 100, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 15, temperatureMax: 30, soilType: "Loamy", description: "Protein-rich legume for oil and food products" },
  { name: "Barley", scientificName: "Hordeum vulgare", category: "Grains", growingPeriod: 90, waterRequirement: "Low", sunRequirement: "Full Sun", temperatureMin: 5, temperatureMax: 30, soilType: "Loamy", description: "Hardy grain for animal feed and malting" },
  
  { name: "Tomatoes", scientificName: "Solanum lycopersicum", category: "Vegetables", growingPeriod: 75, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 15, temperatureMax: 30, soilType: "Sandy Loam", description: "Popular fruit vegetable for fresh eating and processing" },
  { name: "Potatoes", scientificName: "Solanum tuberosum", category: "Vegetables", growingPeriod: 90, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 10, temperatureMax: 25, soilType: "Sandy Loam", description: "Starchy tuber vegetable" },
  { name: "Carrots", scientificName: "Daucus carota", category: "Vegetables", growingPeriod: 70, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 7, temperatureMax: 24, soilType: "Sandy", description: "Root vegetable rich in beta-carotene" },
  { name: "Onions", scientificName: "Allium cepa", category: "Vegetables", growingPeriod: 120, waterRequirement: "Low", sunRequirement: "Full Sun", temperatureMin: 7, temperatureMax: 28, soilType: "Loamy", description: "Bulb vegetable used as seasoning" },
  { name: "Lettuce", scientificName: "Lactuca sativa", category: "Vegetables", growingPeriod: 45, waterRequirement: "Medium", sunRequirement: "Partial Sun", temperatureMin: 7, temperatureMax: 24, soilType: "Loamy", description: "Leafy green salad vegetable" },
  
  { name: "Apples", scientificName: "Malus domestica", category: "Fruits", growingPeriod: 180, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: -25, temperatureMax: 30, soilType: "Loamy", description: "Popular temperate fruit tree" },
  { name: "Bananas", scientificName: "Musa acuminata", category: "Fruits", growingPeriod: 270, waterRequirement: "High", sunRequirement: "Full Sun", temperatureMin: 15, temperatureMax: 35, soilType: "Loamy", description: "Tropical fruit requiring warm humid climate" },
  { name: "Oranges", scientificName: "Citrus sinensis", category: "Fruits", growingPeriod: 300, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 10, temperatureMax: 35, soilType: "Sandy Loam", description: "Citrus fruit tree" },
  { name: "Grapes", scientificName: "Vitis vinifera", category: "Fruits", growingPeriod: 150, waterRequirement: "Low", sunRequirement: "Full Sun", temperatureMin: -15, temperatureMax: 35, soilType: "Loamy", description: "Vine fruit for fresh eating and wine production" },
  { name: "Strawberries", scientificName: "Fragaria ananassa", category: "Fruits", growingPeriod: 90, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 0, temperatureMax: 30, soilType: "Sandy Loam", description: "Small berry fruit crop" },
  
  { name: "Coffee", scientificName: "Coffea arabica", category: "Cash Crops", growingPeriod: 365, waterRequirement: "High", sunRequirement: "Partial Sun", temperatureMin: 15, temperatureMax: 28, soilType: "Volcanic", description: "Tropical shrub producing coffee beans" },
  { name: "Cotton", scientificName: "Gossypium hirsutum", category: "Cash Crops", growingPeriod: 150, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 15, temperatureMax: 35, soilType: "Loamy", description: "Fiber crop for textile production" },
  { name: "Sugarcane", scientificName: "Saccharum officinarum", category: "Cash Crops", growingPeriod: 360, waterRequirement: "High", sunRequirement: "Full Sun", temperatureMin: 20, temperatureMax: 35, soilType: "Loamy", description: "Tropical grass for sugar production" },
  { name: "Tea", scientificName: "Camellia sinensis", category: "Cash Crops", growingPeriod: 365, waterRequirement: "High", sunRequirement: "Partial Sun", temperatureMin: 10, temperatureMax: 30, soilType: "Acidic", description: "Perennial shrub for tea production" },
  { name: "Tobacco", scientificName: "Nicotiana tabacum", category: "Cash Crops", growingPeriod: 60, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 15, temperatureMax: 30, soilType: "Sandy Loam", description: "Commercial crop for tobacco products" },
  
  { name: "Alfalfa", scientificName: "Medicago sativa", category: "Forage", growingPeriod: 60, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 5, temperatureMax: 35, soilType: "Loamy", description: "Perennial legume for livestock feed" },
  { name: "Sorghum", scientificName: "Sorghum bicolor", category: "Grains", growingPeriod: 100, waterRequirement: "Low", sunRequirement: "Full Sun", temperatureMin: 15, temperatureMax: 40, soilType: "Clay Loam", description: "Drought-tolerant grain and forage crop" },
  { name: "Millet", scientificName: "Pennisetum glaucum", category: "Grains", growingPeriod: 75, waterRequirement: "Low", sunRequirement: "Full Sun", temperatureMin: 20, temperatureMax: 35, soilType: "Sandy", description: "Drought-resistant small grain" },
  { name: "Oats", scientificName: "Avena sativa", category: "Grains", growingPeriod: 90, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 5, temperatureMax: 25, soilType: "Loamy", description: "Cool-season cereal grain" },
  { name: "Rye", scientificName: "Secale cereale", category: "Grains", growingPeriod: 150, waterRequirement: "Low", sunRequirement: "Full Sun", temperatureMin: -25, temperatureMax: 25, soilType: "Sandy", description: "Hardy winter grain crop" },
  
  { name: "Cabbage", scientificName: "Brassica oleracea var. capitata", category: "Vegetables", growingPeriod: 90, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 5, temperatureMax: 25, soilType: "Loamy", description: "Cool-season leafy vegetable" },
  { name: "Broccoli", scientificName: "Brassica oleracea var. italica", category: "Vegetables", growingPeriod: 70, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 7, temperatureMax: 24, soilType: "Loamy", description: "Nutrient-rich flowering vegetable" },
  { name: "Cauliflower", scientificName: "Brassica oleracea var. botrytis", category: "Vegetables", growingPeriod: 75, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 7, temperatureMax: 24, soilType: "Loamy", description: "Cool-season vegetable with white head" },
  { name: "Spinach", scientificName: "Spinacia oleracea", category: "Vegetables", growingPeriod: 45, waterRequirement: "Medium", sunRequirement: "Partial Sun", temperatureMin: 5, temperatureMax: 24, soilType: "Loamy", description: "Leafy green vegetable high in iron" },
  { name: "Cucumbers", scientificName: "Cucumis sativus", category: "Vegetables", growingPeriod: 55, waterRequirement: "High", sunRequirement: "Full Sun", temperatureMin: 15, temperatureMax: 32, soilType: "Sandy Loam", description: "Warm-season vine vegetable" },
  
  { name: "Bell Peppers", scientificName: "Capsicum annuum", category: "Vegetables", growingPeriod: 75, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 15, temperatureMax: 30, soilType: "Loamy", description: "Sweet pepper vegetable" },
  { name: "Eggplant", scientificName: "Solanum melongena", category: "Vegetables", growingPeriod: 80, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 18, temperatureMax: 35, soilType: "Loamy", description: "Warm-season fruit vegetable" },
  { name: "Peas", scientificName: "Pisum sativum", category: "Legumes", growingPeriod: 60, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 5, temperatureMax: 24, soilType: "Loamy", description: "Cool-season legume" },
  { name: "Green Beans", scientificName: "Phaseolus vulgaris", category: "Legumes", growingPeriod: 55, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 15, temperatureMax: 30, soilType: "Loamy", description: "Warm-season legume vegetable" },
  { name: "Pumpkins", scientificName: "Cucurbita pepo", category: "Vegetables", growingPeriod: 100, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 15, temperatureMax: 30, soilType: "Loamy", description: "Large vine fruit" },
  
  { name: "Watermelon", scientificName: "Citrullus lanatus", category: "Fruits", growingPeriod: 85, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 18, temperatureMax: 35, soilType: "Sandy", description: "Large sweet melon fruit" },
  { name: "Mangoes", scientificName: "Mangifera indica", category: "Fruits", growingPeriod: 365, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 15, temperatureMax: 40, soilType: "Loamy", description: "Tropical fruit tree" },
  { name: "Peaches", scientificName: "Prunus persica", category: "Fruits", growingPeriod: 150, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: -15, temperatureMax: 35, soilType: "Sandy Loam", description: "Stone fruit tree" },
  { name: "Pears", scientificName: "Pyrus communis", category: "Fruits", growingPeriod: 180, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: -25, temperatureMax: 30, soilType: "Loamy", description: "Temperate fruit tree" },
  { name: "Cherries", scientificName: "Prunus avium", category: "Fruits", growingPeriod: 120, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: -25, temperatureMax: 30, soilType: "Loamy", description: "Stone fruit tree" },
  
  { name: "Sunflower", scientificName: "Helianthus annuus", category: "Oilseeds", growingPeriod: 90, waterRequirement: "Low", sunRequirement: "Full Sun", temperatureMin: 8, temperatureMax: 34, soilType: "Loamy", description: "Oilseed crop" },
  { name: "Canola (Rapeseed)", scientificName: "Brassica napus", category: "Oilseeds", growingPeriod: 120, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 0, temperatureMax: 25, soilType: "Loamy", description: "Oilseed crop for cooking oil" },
  { name: "Peanuts", scientificName: "Arachis hypogaea", category: "Legumes", growingPeriod: 120, waterRequirement: "Medium", sunRequirement: "Full Sun", temperatureMin: 20, temperatureMax: 30, soilType: "Sandy", description: "Legume producing underground nuts" },
  { name: "Sesame", scientificName: "Sesamum indicum", category: "Oilseeds", growingPeriod: 90, waterRequirement: "Low", sunRequirement: "Full Sun", temperatureMin: 20, temperatureMax: 35, soilType: "Loamy", description: "Ancient oilseed crop" },
  { name: "Lentils", scientificName: "Lens culinaris", category: "Legumes", growingPeriod: 110, waterRequirement: "Low", sunRequirement: "Full Sun", temperatureMin: 5, temperatureMax: 25, soilType: "Loamy", description: "Protein-rich pulse crop" },
];

export class CropSeedService {
  async seedCrops(): Promise<void> {
    try {
      const existingCrops = await storage.getAllCrops();
      
      // Only seed if we have less than 100 crops (allowing for partial seeding)
      if (existingCrops.length >= 100) {
        console.log(`Crops already seeded (${existingCrops.length} crops found)`);
        return;
      }
      
      console.log(`Seeding crops database (${cropSeedData.length} crops)...`);
      
      let seeded = 0;
      for (const crop of cropSeedData) {
        try {
          // Check if crop already exists by name to avoid duplicates
          const exists = existingCrops.find(c => c.name === crop.name);
          if (!exists) {
            await storage.createCrop(crop);
            seeded++;
          }
        } catch (error) {
          // Skip if crop already exists
          console.error(`Error seeding crop ${crop.name}:`, error);
        }
      }
      
      console.log(`Successfully seeded ${seeded} new crops (${existingCrops.length + seeded} total)`);
    } catch (error) {
      console.error("Error seeding crops:", error);
    }
  }
}

export const cropSeedService = new CropSeedService();
