import type { Ingredient, MixMethod, Spell, Order, PotionResult, Review } from '../types/potion';
import { SECRET_COMBOS } from './gameData';

export function computePotion(
  ingredients: Ingredient[],
  mix: MixMethod | null,
  spell: Spell | null
): PotionResult {
  let power = 0, stability = 0, duration = 0, chaos = 0;
  const allTags = ingredients.flatMap(i => i.tags);

  ingredients.forEach(i => {
    power += i.power;
    stability += i.stability;
    duration += i.duration;
    chaos += i.chaos;
  });

  if (mix) {
    power = Math.round(power * mix.powerMul);
    stability += mix.stabilityAdd;
    duration = Math.round(duration * mix.durationMul);
    chaos = Math.round(chaos * mix.chaosMul);
  }

  if (spell) {
    power += spell.powerAdd;
    stability += spell.stabilityAdd;
    duration += spell.durationAdd;
    chaos += spell.chaosAdd;
  }

  // Secret combo detection
  const ids = ingredients.map(i => i.id);
  let secretFound = null;
  for (const combo of SECRET_COMBOS) {
    if (combo.ids.every((id: string) => ids.includes(id))) {
      secretFound = combo;
      if (combo.powerBonus) power += combo.powerBonus;
      if (combo.stabilityBonus) stability += combo.stabilityBonus;
      if (combo.durationBonus) duration += combo.durationBonus;
      if (combo.chaosBonus) chaos += combo.chaosBonus;
      break;
    }
  }

  power = Math.max(0, Math.min(20, power));
  stability = Math.max(0, Math.min(20, stability));
  duration = Math.max(0, Math.min(20, duration));
  chaos = Math.max(0, Math.min(20, chaos));

  const { name, emoji, flavorText } = namePotionResult(allTags, { power, stability, duration, chaos }, secretFound);

  return { power, stability, duration, chaos, secretFound, dominantTags: allTags, name, emoji, flavorText };
}

function namePotionResult(
  tags: string[],
  stats: { power: number; stability: number; duration: number; chaos: number },
  secret: typeof SECRET_COMBOS[0] | null
): { name: string; emoji: string; flavorText: string } {
  if (secret) {
    const emojis: Record<string, string> = {
      '집착의 꿈': '🌑', '폭주의 독': '☠️', '성스러운 치유': '✨',
      '각성의 꿈': '🌟', '저주의 심연': '⚫', '대지의 수호': '🌳',
      '망각의 저주': '🖤', '달의 정수': '💎',
    };
    return { name: `${secret.name} 포션`, emoji: emojis[secret.name] ?? '🌀', flavorText: secret.flavorText };
  }

  if (stats.chaos > 14) return { name: '혼돈의 포션', emoji: '🌀', flavorText: '무슨 일이 일어날지 아무도 예측할 수 없습니다.' };
  if (tags.includes('저주')) return { name: '저주 포션', emoji: '🖤', flavorText: '어둠의 기운이 포션을 감싸고 있습니다.' };
  if (tags.includes('수면') && tags.includes('집착')) return { name: '집착몽 포션', emoji: '💜', flavorText: '꿈 속에서도 그 사람이 따라옵니다.' };
  if (tags.includes('수면')) return { name: '수면 포션', emoji: '💜', flavorText: '깊고 고요한 잠으로 데려다드립니다.' };
  if (tags.includes('집중') && tags.includes('마음')) return { name: '집중 포션', emoji: '⚡', flavorText: '생각이 날카롭게 정렬됩니다.' };
  if (tags.includes('치유') && stats.stability > 12) return { name: '순수 치유 포션', emoji: '💚', flavorText: '빛처럼 맑고 순수한 치유의 기운입니다.' };
  if (tags.includes('치유')) return { name: '치유 포션', emoji: '💚', flavorText: '상처가 천천히 아뭅니다.' };
  if (tags.includes('사랑') && tags.includes('집착')) return { name: '집착 포션', emoji: '❤️‍🔥', flavorText: '경계가 사랑인지 집착인지 흐려집니다.' };
  if (tags.includes('사랑')) return { name: '사랑 포션', emoji: '❤️', flavorText: '마음이 따뜻해집니다... 어쩌면.' };
  if (tags.includes('활력') && tags.includes('독성')) return { name: '독성 활력 포션', emoji: '🔥', flavorText: '불태우듯 강렬합니다. 위험합니다.' };
  if (tags.includes('활력')) return { name: '활력 포션', emoji: '🔥', flavorText: '온몸에 에너지가 넘칩니다.' };
  if (tags.includes('정화')) return { name: '정화 포션', emoji: '🌟', flavorText: '부정적인 것들이 씻겨나갑니다.' };
  return { name: '혼합 포션', emoji: '🧪', flavorText: '여러 효과가 복합적으로 나타납니다.' };
}

export function scorePotion(order: Order, result: PotionResult): number {
  let score = 1;
  const tags = result.dominantTags;

  let matchCount = 0;
  order.prefTags.forEach(t => { if (tags.includes(t)) matchCount++; });
  score += Math.min(matchCount * 1.2, 3);

  if (result.chaos <= order.allowChaos) score += 0.5;
  else if (result.chaos > order.allowChaos + 4) score -= 1.5;

  if (result.stability > 12 && order.type === '걱정 많은 고객') score += 0.5;
  if (order.type === '위험 선호' && result.chaos > 6) score += 1;
  if (order.premium && result.power > 14) score += 0.5;

  return Math.round(Math.min(5, Math.max(1, score)));
}

const REVIEW_TEXTS: Record<number, string[]> = {
  5: [
    '완벽했어요. 정말 원하던 바로 그거였어요. 다음에도 꼭 이 분한테 주문할게요.',
    '이런 포션은 처음이에요. 효과도 딱 맞고 부작용도 없었어요. 적극 추천합니다.',
    '기대 이상이었습니다. 감사해요. 주변에도 소개해드릴게요.',
    '마야님 최고예요. 제 상황을 이렇게 정확히 파악해주실 줄은 몰랐어요.',
  ],
  4: [
    '효과는 분명히 있었는데 약간 이상한 느낌도 있었어요. 전체적으로 만족해요.',
    '대체로 좋았어요! 부작용은 조금 있었지만 주 효과가 훨씬 강력했어요.',
    '좋았어요. 다만 지속시간이 조금 더 길었으면 했어요. 그래도 추천합니다.',
    '원하는 효과 대부분은 나타났어요. 다음엔 더 완벽해지길 기대해요.',
  ],
  3: [
    '포션 효과는 있었어요. 근데 제가 원하던 것과는 약간 달랐어요.',
    '그냥 그랬어요. 특별히 나쁘지도 않았지만 특별히 좋지도 않았네요.',
    '기대했던 것보다 효과가 약했어요. 가격 대비 아쉽네요.',
  ],
  2: [
    '부작용이 생각보다 심했어요. 원하던 효과보다 부작용이 더 두드러졌어요.',
    '효과가 제대로 나타나지 않았어요. 하루를 낭비한 것 같아서 아쉽네요.',
    '좀 이상한 기분이 들었어요. 제가 원하는 게 아니었어요.',
  ],
  1: [
    '전혀 달라진 게 없었어요. 낭비만 했네요. 환불 요청합니다.',
    '최악이었어요. 이런 부작용이 생길 줄 몰랐어요. 신고할 수도 있어요.',
    '다시는 주문 안 합니다. 설명과 전혀 다른 포션이었어요.',
  ],
};

const SPECIAL_REVIEW_TEXTS: Record<string, string> = {
  '집착의 꿈 포션': '잤는데... 꿈에서 그 사람이 계속 나왔어요. 다섯 번이나. 이게 원하던 건지 모르겠지만 무섭기도 하고 좋기도 하고... 복잡해요.',
  '폭주의 독 포션': '살아있다는 느낌이 최고조였어요. 심장이 터질 것 같았는데 그게 좋았어요. 의사선생님한테는 비밀이에요. 다음엔 더 강하게 부탁해요.',
  '성스러운 치유 포션': '20년 된 흉터가 사라졌어요. 흉터만이 아니라 그때의 기억까지... 이건 마법이에요. 진짜 마법.',
  '각성의 꿈 포션': '자면서 공부한 것 같아요. 시험지를 보는데 모든 게 선명했어요. 이런 포션이 있었다니. 수능 전날 쓰길 잘했어요.',
  '저주의 심연 포션': '... 후기를 어떻게 써야 할지 모르겠어요. 그냥 조심하세요.',
  '달의 정수 포션': '이런 포션을 마실 수 있게 되다니 영광이에요. 한 달이 지난 지금도 효과가 남아있어요.',
};

export function generateReview(order: Order, result: PotionResult, score: number): Review {
  const specialText = SPECIAL_REVIEW_TEXTS[result.name];
  const texts = REVIEW_TEXTS[score] ?? REVIEW_TEXTS[3];
  const text = specialText ?? texts[Math.floor(Math.random() * texts.length)];

  const effectType: Review['effectType'] =
    score >= 5 && result.secretFound ? 'special'
    : score >= 4 ? 'good'
    : score >= 3 ? 'weird'
    : 'bad';

  return {
    id: `r_${Date.now()}`,
    orderId: order.id,
    name: order.name + '님',
    stars: score,
    special: score === 5 && (order.warning === true || order.type === '위험 선호'),
    low: score <= 2,
    potion: result.name,
    text,
    effect: `효과 ${result.power} · 안정 ${result.stability} · 지속 ${result.duration} · 왜곡 ${result.chaos}`,
    effectType,
    date: '방금 전',
    verified: true,
  };
}