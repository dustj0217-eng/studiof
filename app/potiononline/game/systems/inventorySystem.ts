import type { Ingredient } from '../types/potion';

export function createInitialInventory(ingredients: Ingredient[]) {
  return Object.fromEntries(ingredients.map(i => [i.id, i.stock]));
}

export function canAffordIngredient(gold: number, ingredient: Ingredient, quantity = 1) {
  return gold >= ingredient.price * quantity;
}

export function purchaseIngredient(inventory: Record<string, number>, ingredientId: string, quantity = 1) {
  return { ...inventory, [ingredientId]: (inventory[ingredientId] ?? 0) + quantity };
}

export function consumeIngredients(inventory: Record<string, number>, ingredientIds: string[]) {
  const next = { ...inventory };
  for (const id of ingredientIds) next[id] = Math.max(0, (next[id] ?? 0) - 1);
  return next;
}

export function hasIngredients(inventory: Record<string, number>, ingredientIds: string[]) {
  const counts: Record<string, number> = {};
  for (const id of ingredientIds) counts[id] = (counts[id] ?? 0) + 1;
  return Object.entries(counts).every(([id, count]) => (inventory[id] ?? 0) >= count);
}
