/**
 * Companion Planting Database for Multicropping (Beta Feature)
 * Provides recommendations for crop combinations based on beneficial relationships
 */

import { db } from "../db";
import { companionPlants, crops } from "@shared/schema";
import { eq, or } from "drizzle-orm";

export interface CompanionRecommendation {
  crop: string;
  companionCrop: string;
  relationship: 'companion' | 'avoid';
  benefit: string;
  description: string;
}

// Seed data for common companion planting relationships
const companionPlantingData: CompanionRecommendation[] = [
  // Tomatoes
  { crop: "Tomato", companionCrop: "Basil", relationship: "companion", benefit: "Pest control & flavor", description: "Basil repels aphids and improves tomato flavor" },
  { crop: "Tomato", companionCrop: "Carrot", relationship: "companion", benefit: "Space optimization", description: "Carrots grow underground while tomatoes grow above" },
  { crop: "Tomato", companionCrop: "Marigold", relationship: "companion", benefit: "Pest control", description: "Marigolds repel nematodes and other pests" },
  { crop: "Tomato", companionCrop: "Potato", relationship: "avoid", benefit: "Disease prevention", description: "Both susceptible to same blight diseases" },
  
  // Carrots
  { crop: "Carrot", companionCrop: "Onion", relationship: "companion", benefit: "Pest control", description: "Onions deter carrot flies" },
  { crop: "Carrot", companionCrop: "Lettuce", relationship: "companion", benefit: "Space optimization", description: "Lettuce provides shade for carrots" },
  { crop: "Carrot", companionCrop: "Dill", relationship: "avoid", benefit: "Growth inhibition", description: "Dill can stunt carrot growth" },
  
  // Beans
  { crop: "Bean", companionCrop: "Corn", relationship: "companion", benefit: "Nitrogen fixation", description: "Beans fix nitrogen, corn provides support" },
  { crop: "Bean", companionCrop: "Squash", relationship: "companion", benefit: "Three Sisters", description: "Traditional companion planting trio" },
  { crop: "Bean", companionCrop: "Onion", relationship: "avoid", benefit: "Growth inhibition", description: "Onions inhibit bean growth" },
  
  // Lettuce
  { crop: "Lettuce", companionCrop: "Radish", relationship: "companion", benefit: "Pest control", description: "Radishes repel aphids from lettuce" },
  { crop: "Lettuce", companionCrop: "Chive", relationship: "companion", benefit: "Pest control", description: "Chives deter aphids" },
  
  // Cucumber
  { crop: "Cucumber", companionCrop: "Radish", relationship: "companion", benefit: "Pest control", description: "Radishes repel cucumber beetles" },
  { crop: "Cucumber", companionCrop: "Bean", relationship: "companion", benefit: "Nitrogen fixation", description: "Beans enrich soil for cucumbers" },
  { crop: "Cucumber", companionCrop: "Potato", relationship: "avoid", benefit: "Disease prevention", description: "Can spread blight" },
  
  // Corn
  { crop: "Corn", companionCrop: "Bean", relationship: "companion", benefit: "Mutual support", description: "Beans climb corn stalks, fix nitrogen" },
  { crop: "Corn", companionCrop: "Squash", relationship: "companion", benefit: "Weed suppression", description: "Squash shades soil, prevents weeds" },
  { crop: "Corn", companionCrop: "Tomato", relationship: "avoid", benefit: "Pest sharing", description: "Attract similar pests" },
  
  // Peppers
  { crop: "Pepper", companionCrop: "Basil", relationship: "companion", benefit: "Pest control", description: "Basil repels aphids and mosquitoes" },
  { crop: "Pepper", companionCrop: "Onion", relationship: "companion", benefit: "Pest control", description: "Onions deter many common pests" },
  
  // Cabbage
  { crop: "Cabbage", companionCrop: "Onion", relationship: "companion", benefit: "Pest control", description: "Onions repel cabbage worms" },
  { crop: "Cabbage", companionCrop: "Tomato", relationship: "avoid", benefit: "Growth inhibition", description: "Tomatoes stunt cabbage growth" },
  
  // Spinach
  { crop: "Spinach", companionCrop: "Strawberry", relationship: "companion", benefit: "Mutual benefit", description: "Spinach provides shade, strawberries ground cover" },
  { crop: "Spinach", companionCrop: "Radish", relationship: "companion", benefit: "Pest control", description: "Radishes deter leaf miners" },
];

export async function seedCompanionPlants() {
  console.log("[companion-plants] Checking if companion planting data is seeded...");
  
  const existing = await db.select().from(companionPlants).limit(1);
  if (existing.length > 0) {
    console.log("[companion-plants] Data already seeded");
    return;
  }
  
  console.log("[companion-plants] Seeding companion planting recommendations...");
  
  // Get all crops for ID mapping
  const allCrops = await db.select().from(crops);
  const cropMap = new Map(allCrops.map(c => [c.name, c.id]));
  
  let seeded = 0;
  for (const data of companionPlantingData) {
    const cropId = cropMap.get(data.crop);
    const companionCropId = cropMap.get(data.companionCrop);
    
    if (cropId && companionCropId) {
      await db.insert(companionPlants).values({
        cropId,
        companionCropId,
        relationship: data.relationship,
        benefit: data.benefit,
        description: data.description,
      });
      seeded++;
    }
  }
  
  console.log(`[companion-plants] Seeded ${seeded} companion planting relationships`);
}

export async function getCompanionRecommendations(cropId: string) {
  const companions = await db
    .select()
    .from(companionPlants)
    .where(
      or(
        eq(companionPlants.cropId, cropId),
        eq(companionPlants.companionCropId, cropId)
      )
    );
  
  return companions;
}

export async function getGoodCompanions(cropId: string) {
  const companions = await db
    .select()
    .from(companionPlants)
    .where(
      eq(companionPlants.cropId, cropId)
    );
  
  return companions.filter(c => c.relationship === 'companion');
}

export async function getAvoidCompanions(cropId: string) {
  const companions = await db
    .select()
    .from(companionPlants)
    .where(
      eq(companionPlants.cropId, cropId)
    );
  
  return companions.filter(c => c.relationship === 'avoid');
}
