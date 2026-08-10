'use client';
import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import type { Order, Review, GameState, Ingredient, MixMethod, Spell, PotionResult } from '../types/potion';
import { INITIAL_ORDERS, INITIAL_REVIEWS, INGREDIENTS, MIX_METHODS, SPELLS } from './gameData';
import { createInitialInventory, purchaseIngredient, consumeIngredients, canAffordIngredient } from '../systems/inventorySystem';
import { generateNextOrder } from '../systems/orderSystem';
import { getShopLevel, xpForShipment } from '../systems/progressionSystem';
import { unlockRecipeFromResult } from '../systems/recipeSystem';

interface CraftState {
  selectedIngredientIds: string[];
  selectedMixId: string | null;
  selectedSpellId: string | null;
  currentResult: PotionResult | null;
}

interface AppState {
  game: GameState;
  orders: Order[];
  reviews: Review[];
  craft: CraftState;
  activeOrder: Order | null;
  tab: 'orders' | 'craft' | 'manage' | 'reviews';
  orderModalId: number | null;
  showResultModal: boolean;
  consultationNotes: Record<number, string[]>;
  hydrated: boolean;
}

type Action =
  | { type: 'HYDRATE_STATE'; saved: Partial<AppState> | null }
  | { type: 'SET_TAB'; tab: AppState['tab'] }
  | { type: 'OPEN_ORDER_MODAL'; id: number }
  | { type: 'CLOSE_ORDER_MODAL' }
  | { type: 'ACCEPT_ORDER'; order: Order }
  | { type: 'DECLINE_ORDER'; orderId: number }
  | { type: 'ASK_ORDER_QUESTION'; orderId: number; answer: string }
  | { type: 'TOGGLE_INGREDIENT'; id: string }
  | { type: 'SELECT_MIX'; id: string }
  | { type: 'SELECT_SPELL'; id: string }
  | { type: 'SET_RESULT'; result: PotionResult }
  | { type: 'SHOW_RESULT_MODAL'; show: boolean }
  | { type: 'SHIP_POTION'; review: Review; gold: number; score: number }
  | { type: 'BUY_INGREDIENT'; ingredientId: string; quantity?: number }
  | { type: 'RESET_CRAFT' };

const initialInventory = createInitialInventory(INGREDIENTS);

const initialState: AppState = {
  game: {
    gold: 1240,
    reputation: 4.2,
    totalShipped: 7,
    activeOrderId: null,
    unlockedRecipes: [],
    worldEffects: {},
    shopXp: 36,
    shopLevel: 1,
    inventory: initialInventory,
    consultationCredits: 3,
    nextOrderSerial: 1000,
    completedOrderIds: [],
  },
  orders: INITIAL_ORDERS.slice(0, 7),
  reviews: INITIAL_REVIEWS,
  craft: { selectedIngredientIds: [], selectedMixId: null, selectedSpellId: null, currentResult: null },
  activeOrder: null,
  tab: 'orders',
  orderModalId: null,
  showResultModal: false,
  consultationNotes: {},
  hydrated: false,
};

function replaceOrder(orders: Order[], removedId: number, serial: number) {
  const remaining = orders.filter(o => o.id !== removedId);
  const next = generateNextOrder(INITIAL_ORDERS, serial, removedId);
  return { orders: [...remaining, next], nextSerial: serial + 1 };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE_STATE': {
      if (!action.saved) return { ...state, hydrated: true };
      const savedGame = action.saved.game ?? state.game;
      return {
        ...state,
        ...action.saved,
        game: { ...state.game, ...savedGame },
        craft: action.saved.craft ?? state.craft,
        hydrated: true,
        showResultModal: false,
        orderModalId: null,
      };
    }
    case 'SET_TAB':
      return { ...state, tab: action.tab };
    case 'OPEN_ORDER_MODAL':
      return { ...state, orderModalId: action.id };
    case 'CLOSE_ORDER_MODAL':
      return { ...state, orderModalId: null };
    case 'ACCEPT_ORDER':
      return {
        ...state,
        activeOrder: action.order,
        game: { ...state.game, activeOrderId: action.order.id },
        orderModalId: null,
        tab: 'craft',
      };
    case 'DECLINE_ORDER': {
      const replaced = replaceOrder(state.orders, action.orderId, state.game.nextOrderSerial);
      return {
        ...state,
        orders: replaced.orders,
        orderModalId: null,
        game: { ...state.game, nextOrderSerial: replaced.nextSerial },
      };
    }
    case 'ASK_ORDER_QUESTION': {
      if (state.game.consultationCredits <= 0) return state;
      const current = state.consultationNotes[action.orderId] ?? [];
      if (current.includes(action.answer)) return state;
      return {
        ...state,
        consultationNotes: { ...state.consultationNotes, [action.orderId]: [...current, action.answer] },
        game: { ...state.game, consultationCredits: state.game.consultationCredits - 1 },
      };
    }
    case 'TOGGLE_INGREDIENT': {
      if ((state.game.inventory[action.id] ?? 0) <= 0) return state;
      const ids = state.craft.selectedIngredientIds;
      const idx = ids.indexOf(action.id);
      let next: string[];
      if (idx >= 0) next = ids.filter(i => i !== action.id);
      else if (ids.length >= 3) next = [...ids.slice(1), action.id];
      else next = [...ids, action.id];
      return { ...state, craft: { ...state.craft, selectedIngredientIds: next, currentResult: null } };
    }
    case 'SELECT_MIX':
      return { ...state, craft: { ...state.craft, selectedMixId: action.id, currentResult: null } };
    case 'SELECT_SPELL':
      return { ...state, craft: { ...state.craft, selectedSpellId: action.id, currentResult: null } };
    case 'SET_RESULT':
      return { ...state, craft: { ...state.craft, currentResult: action.result } };
    case 'SHOW_RESULT_MODAL':
      return { ...state, showResultModal: action.show };
    case 'BUY_INGREDIENT': {
      const ingredient = INGREDIENTS.find(i => i.id === action.ingredientId);
      if (!ingredient) return state;
      const quantity = Math.max(1, action.quantity ?? 1);
      if (!canAffordIngredient(state.game.gold, ingredient, quantity)) return state;
      return {
        ...state,
        game: {
          ...state.game,
          gold: state.game.gold - ingredient.price * quantity,
          inventory: purchaseIngredient(state.game.inventory, ingredient.id, quantity),
        },
      };
    }
    case 'SHIP_POTION': {
      const activeOrderId = state.activeOrder?.id;
      const result = state.craft.currentResult;
      if (!activeOrderId || !result) return state;
      const newReviews = [action.review, ...state.reviews];
      const avg = parseFloat((newReviews.reduce((a, r) => a + r.stars, 0) / newReviews.length).toFixed(1));
      const xpGain = xpForShipment(action.score, Boolean(result.secretFound));
      const nextXp = state.game.shopXp + xpGain;
      const replaced = replaceOrder(state.orders, activeOrderId, state.game.nextOrderSerial);
      const nextInventory = consumeIngredients(state.game.inventory, state.craft.selectedIngredientIds);
      const unlockedRecipes = unlockRecipeFromResult(state.game.unlockedRecipes, result);
      return {
        ...state,
        orders: replaced.orders,
        reviews: newReviews,
        game: {
          ...state.game,
          gold: state.game.gold + action.gold,
          totalShipped: state.game.totalShipped + 1,
          reputation: avg,
          shopXp: nextXp,
          shopLevel: getShopLevel(nextXp),
          inventory: nextInventory,
          consultationCredits: Math.min(4, state.game.consultationCredits + 1),
          nextOrderSerial: replaced.nextSerial,
          activeOrderId: null,
          completedOrderIds: [...state.game.completedOrderIds, activeOrderId],
          unlockedRecipes,
        },
        showResultModal: false,
        activeOrder: null,
        tab: 'orders',
        craft: { selectedIngredientIds: [], selectedMixId: null, selectedSpellId: null, currentResult: null },
      };
    }
    case 'RESET_CRAFT':
      return { ...state, craft: { selectedIngredientIds: [], selectedMixId: null, selectedSpellId: null, currentResult: null } };
    default:
      return state;
  }
}

const Ctx = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

const SAVE_KEY = 'moncity:potion-online:v2';

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SAVE_KEY);
      dispatch({ type: 'HYDRATE_STATE', saved: raw ? JSON.parse(raw) : null });
    } catch {
      dispatch({ type: 'HYDRATE_STATE', saved: null });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const timer = window.setTimeout(() => {
      const snapshot = { ...state, showResultModal: false, orderModalId: null };
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [state]);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useGame() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}

export function getIngredientById(id: string): Ingredient | undefined { return INGREDIENTS.find(i => i.id === id); }
export function getMixById(id: string): MixMethod | undefined { return MIX_METHODS.find(m => m.id === id); }
export function getSpellById(id: string): Spell | undefined { return SPELLS.find(s => s.id === id); }
