'use client';
import { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Order, Review, GameState, Ingredient, MixMethod, Spell, PotionResult } from '../types/potion';
import { INITIAL_ORDERS, INITIAL_REVIEWS, INGREDIENTS, MIX_METHODS, SPELLS } from './gameData';

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
  tab: 'orders' | 'craft' | 'reviews';
  orderModalId: number | null;
  showResultModal: boolean;
}

type Action =
  | { type: 'SET_TAB'; tab: AppState['tab'] }
  | { type: 'OPEN_ORDER_MODAL'; id: number }
  | { type: 'CLOSE_ORDER_MODAL' }
  | { type: 'ACCEPT_ORDER'; order: Order }
  | { type: 'TOGGLE_INGREDIENT'; id: string }
  | { type: 'SELECT_MIX'; id: string }
  | { type: 'SELECT_SPELL'; id: string }
  | { type: 'SET_RESULT'; result: PotionResult }
  | { type: 'SHOW_RESULT_MODAL'; show: boolean }
  | { type: 'SHIP_POTION'; review: Review; gold: number; score: number }
  | { type: 'RESET_CRAFT' };

const initialState: AppState = {
  game: { gold: 1240, reputation: 4.2, totalShipped: 7, activeOrderId: null, unlockedRecipes: [], worldEffects: {}, day: 3 },
  orders: INITIAL_ORDERS,
  reviews: INITIAL_REVIEWS,
  craft: { selectedIngredientIds: [], selectedMixId: null, selectedSpellId: null, currentResult: null },
  activeOrder: null,
  tab: 'orders',
  orderModalId: null,
  showResultModal: false,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, tab: action.tab };
    case 'OPEN_ORDER_MODAL':
      return { ...state, orderModalId: action.id };
    case 'CLOSE_ORDER_MODAL':
      return { ...state, orderModalId: null };
    case 'ACCEPT_ORDER':
      return { ...state, activeOrder: action.order, orderModalId: null, tab: 'craft' };
    case 'TOGGLE_INGREDIENT': {
      const ids = state.craft.selectedIngredientIds;
      const idx = ids.indexOf(action.id);
      let next: string[];
      if (idx >= 0) {
        next = ids.filter(i => i !== action.id);
      } else if (ids.length >= 3) {
        next = [...ids.slice(1), action.id];
      } else {
        next = [...ids, action.id];
      }
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
    case 'SHIP_POTION': {
      const newReviews = [action.review, ...state.reviews];
      const avg = parseFloat((newReviews.reduce((a, r) => a + r.stars, 0) / newReviews.length).toFixed(1));
      return {
        ...state,
        reviews: newReviews,
        game: {
          ...state.game,
          gold: state.game.gold + action.gold,
          totalShipped: state.game.totalShipped + 1,
          reputation: avg,
        },
        showResultModal: false,
        activeOrder: null,
        tab: 'reviews',
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

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useGame() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}

export function getIngredientById(id: string): Ingredient | undefined {
  return INGREDIENTS.find(i => i.id === id);
}
export function getMixById(id: string): MixMethod | undefined {
  return MIX_METHODS.find(m => m.id === id);
}
export function getSpellById(id: string): Spell | undefined {
  return SPELLS.find(s => s.id === id);
}