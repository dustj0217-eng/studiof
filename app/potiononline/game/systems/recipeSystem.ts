import type { PotionResult } from '../types/potion';

export function unlockRecipeFromResult(unlockedRecipes: string[], result: PotionResult) {
  if (!result.secretFound) return unlockedRecipes;
  const recipe = result.secretFound.name;
  return unlockedRecipes.includes(recipe) ? unlockedRecipes : [...unlockedRecipes, recipe];
}
