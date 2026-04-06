export type EffectTag =
  | '치유' | '활력' | '사랑' | '집중' | '마음' | '수면' | '환상'
  | '독성' | '집착' | '혼란' | '방어' | '정화' | '저주';

export type PropertyTag =
  | '안정' | '불안정' | '지속' | '폭발성';

export type CustomerType =
  | '일반' | '급한 고객' | '위험 선호' | '음흉한 의뢰인' | '약초사' | '걱정 많은 고객';

export interface Ingredient {
  id: string;
  name: string;
  icon: string;
  tags: (EffectTag | PropertyTag)[];
  power: number;
  stability: number;
  duration: number;
  chaos: number;
  price: number;
  stock: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  description: string;
  hasSecret?: boolean;
}

export interface MixMethod {
  id: string;
  name: string;
  icon: string;
  desc: string;
  detail: string;
  powerMul: number;
  stabilityAdd: number;
  durationMul: number;
  chaosMul: number;
}

export interface Spell {
  id: string;
  name: string;
  icon: string;
  desc: string;
  detail: string;
  powerAdd: number;
  stabilityAdd: number;
  durationAdd: number;
  chaosAdd: number;
  special?: boolean;
}

export interface SecretCombo {
  ids: string[];
  name: string;
  hint: string;
  unlock: string;
  flavorText: string;
  powerBonus?: number;
  stabilityBonus?: number;
  durationBonus?: number;
  chaosBonus?: number;
  special?: string;
}

export interface Order {
  id: number;
  name: string;
  type: CustomerType;
  avatarEmoji: string;
  request: string;
  hidden: string;
  reqTags: EffectTag[];
  hiddenTags: (EffectTag | PropertyTag)[];
  price: number;
  urgency: number;
  prefTags: (EffectTag | PropertyTag)[];
  allowChaos: number;
  urgent?: boolean;
  warning?: boolean;
  premium?: boolean;
  timeLimit?: number;
  backstory?: string;
}

export interface PotionResult {
  power: number;
  stability: number;
  duration: number;
  chaos: number;
  secretFound: SecretCombo | null;
  dominantTags: (EffectTag | PropertyTag)[];
  name: string;
  emoji: string;
  flavorText: string;
  score?: number;
}

export interface Review {
  id: string;
  orderId?: number;
  name: string;
  stars: number;
  special: boolean;
  low: boolean;
  potion: string;
  text: string;
  effect: string;
  effectType: 'good' | 'bad' | 'weird' | 'special';
  date: string;
  verified: boolean;
}

export interface GameState {
  gold: number;
  reputation: number;
  totalShipped: number;
  activeOrderId: number | null;
  unlockedRecipes: string[];
  worldEffects: Record<string, number>;
  day: number;
}