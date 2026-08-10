export const SHOP_LEVELS = [
  { level: 1, xp: 0, label: '동네 포션샵', unlock: '기본 주문 · 기본 재료' },
  { level: 2, xp: 60, label: '입소문 난 가게', unlock: '상담 슬롯 +1' },
  { level: 3, xp: 150, label: '인기 포션샵', unlock: '희귀 주문 등장 확률 증가' },
  { level: 4, xp: 280, label: '몬시티 유명점', unlock: '희귀 재료 상시 구매' },
  { level: 5, xp: 460, label: '포션 전문점', unlock: '특수 주문 풀 확장' },
  { level: 6, xp: 700, label: '도시 대표 포션샵', unlock: '이후 무한 명성 레벨' },
] as const;

export function getShopLevel(xp: number) {
  let current: (typeof SHOP_LEVELS)[number] = SHOP_LEVELS[0];
  for (const entry of SHOP_LEVELS) {
    if (xp >= entry.xp) current = entry;
  }
  if (xp < SHOP_LEVELS[SHOP_LEVELS.length - 1].xp) return current.level;
  return SHOP_LEVELS[SHOP_LEVELS.length - 1].level + Math.floor((xp - SHOP_LEVELS[SHOP_LEVELS.length - 1].xp) / 350);
}

export function getLevelProgress(xp: number) {
  const level = getShopLevel(xp);
  if (level > SHOP_LEVELS[SHOP_LEVELS.length - 1].level) {
    const base = SHOP_LEVELS[SHOP_LEVELS.length - 1].xp + (level - SHOP_LEVELS[SHOP_LEVELS.length - 1].level) * 350;
    return { level, current: xp - (base - 350), needed: 350, ratio: Math.min(1, (xp - (base - 350)) / 350), nextLabel: '명성 레벨 상승' };
  }
  const currentEntry = SHOP_LEVELS.find(v => v.level === level) ?? SHOP_LEVELS[0];
  const nextEntry = SHOP_LEVELS.find(v => v.level === level + 1);
  if (!nextEntry) return { level, current: xp - currentEntry.xp, needed: 350, ratio: 0, nextLabel: '명성 레벨 상승' };
  const current = xp - currentEntry.xp;
  const needed = nextEntry.xp - currentEntry.xp;
  return { level, current, needed, ratio: Math.max(0, Math.min(1, current / needed)), nextLabel: nextEntry.unlock };
}

export function xpForShipment(score: number, secretFound: boolean) {
  return 8 + Math.max(0, score - 2) * 4 + (secretFound ? 8 : 0);
}
