import type { Ingredient, MixMethod, Spell, SecretCombo, Order, Review } from '../types/potion';

export const INGREDIENTS: Ingredient[] = [
  {
    id: 'moongrass', name: '달빛풀', icon: '🌿', rarity: 'common',
    tags: ['치유', '안정'], power: 3, stability: 4, duration: 2, chaos: 0,
    price: 40, stock: 12,
    description: '보름달 아래 자라는 풀. 상처를 천천히 아물게 한다.',
  },
  {
    id: 'redshroom', name: '붉은 버섯', icon: '🍄', rarity: 'uncommon',
    tags: ['활력', '불안정'], power: 5, stability: -2, duration: 1, chaos: 2,
    price: 80, stock: 6, hasSecret: true,
    description: '강렬한 에너지를 방출하지만 불안정하다. 과용 금지.',
  },
  {
    id: 'silvermoss', name: '은빛 이끼', icon: '🪨', rarity: 'common',
    tags: ['지속', '안정'], power: 1, stability: 3, duration: 5, chaos: -1,
    price: 35, stock: 15,
    description: '오래된 바위에서 자라는 이끼. 효과를 오래 유지시킨다.',
  },
  {
    id: 'darkbloom', name: '검은 꽃', icon: '🖤', rarity: 'rare',
    tags: ['사랑', '집착', '혼란'], power: 4, stability: -1, duration: 3, chaos: 4,
    price: 150, stock: 4, hasSecret: true,
    description: '금지된 감정을 불러일으키는 꽃. 취급 주의.',
  },
  {
    id: 'starshell', name: '별가루 조개', icon: '🐚', rarity: 'uncommon',
    tags: ['집중', '마음'], power: 3, stability: 2, duration: 2, chaos: 1,
    price: 90, stock: 8, hasSecret: true,
    description: '별빛을 담은 조개. 정신을 맑게 한다.',
  },
  {
    id: 'dreamroot', name: '꿈의 뿌리', icon: '🫚', rarity: 'rare',
    tags: ['수면', '환상'], power: 4, stability: 1, duration: 4, chaos: 2,
    price: 130, stock: 5, hasSecret: true,
    description: '꿈과 현실의 경계를 흐릿하게 만드는 뿌리.',
  },
  {
    id: 'ironbark', name: '철피나무', icon: '🪵', rarity: 'common',
    tags: ['방어', '안정', '지속'], power: 2, stability: 5, duration: 3, chaos: -2,
    price: 45, stock: 10,
    description: '철처럼 단단한 나무. 포션을 안정시킨다.',
  },
  {
    id: 'venomcap', name: '독침 버섯', icon: '☠️', rarity: 'legendary',
    tags: ['독성', '혼란', '활력'], power: 6, stability: -3, duration: 2, chaos: 5,
    price: 280, stock: 2, hasSecret: true,
    description: '극도로 위험. 다루는 자의 각오가 필요하다.',
  },
  {
    id: 'goldpetal', name: '황금 꽃잎', icon: '🌼', rarity: 'uncommon',
    tags: ['치유', '정화', '마음'], power: 3, stability: 3, duration: 3, chaos: -1,
    price: 110, stock: 7, hasSecret: true,
    description: '순수한 빛을 담은 꽃잎. 정화 효과가 있다.',
  },
  {
    id: 'moonstone', name: '월광석', icon: '💎', rarity: 'legendary',
    tags: ['마음', '환상', '안정'], power: 2, stability: 4, duration: 6, chaos: 1,
    price: 320, stock: 1, hasSecret: true,
    description: '달의 정수가 응결된 보석. 극도로 희귀하다.',
  },
  {
    id: 'bloodrose', name: '붉은 장미', icon: '🌹', rarity: 'uncommon',
    tags: ['사랑', '활력'], power: 3, stability: 1, duration: 2, chaos: 2,
    price: 75, stock: 9,
    description: '열정적인 감정을 자극하는 장미.',
  },
  {
    id: 'ashleaf', name: '재의 잎', icon: '🍂', rarity: 'rare',
    tags: ['저주', '혼란', '집착'], power: 5, stability: -4, duration: 3, chaos: 6,
    price: 200, stock: 3, hasSecret: true,
    description: '타버린 숲에서만 자라는 잎. 어둠의 기운을 품는다.',
  },
];

export const MIX_METHODS: MixMethod[] = [
  {
    id: 'stir', name: '젓기', icon: '🥄',
    desc: '안정성 증가', detail: '가장 안전한 방법. 효과는 기본값을 유지한다.',
    powerMul: 1, stabilityAdd: 2, durationMul: 1, chaosMul: 0.7,
  },
  {
    id: 'shake', name: '흔들기', icon: '💥',
    desc: '효과↑ 불안정↑', detail: '효과가 강해지지만 예측 불가능성이 올라간다.',
    powerMul: 1.5, stabilityAdd: -2, durationMul: 0.9, chaosMul: 1.4,
  },
  {
    id: 'simmer', name: '천천히 끓이기', icon: '🕯️',
    desc: '지속시간 증가', detail: '오래 걸리지만 효과가 훨씬 오래 지속된다.',
    powerMul: 0.9, stabilityAdd: 1, durationMul: 1.8, chaosMul: 0.9,
  },
  {
    id: 'boil', name: '강하게 끓이기', icon: '🔥',
    desc: '강도↑ 부작용↑', detail: '최대 효과를 이끌어내지만 부작용 위험이 크다.',
    powerMul: 1.8, stabilityAdd: -3, durationMul: 1.1, chaosMul: 1.7,
  },
];

export const SPELLS: Spell[] = [
  {
    id: 'stabilize', name: '안정화', icon: '🛡️',
    desc: '부작용 감소', detail: '왜곡도와 부작용을 크게 줄인다.',
    powerAdd: 0, stabilityAdd: 3, durationAdd: 0, chaosAdd: -3,
  },
  {
    id: 'amplify', name: '증폭', icon: '⚡',
    desc: '효과 강화', detail: '효과를 크게 강화하지만 약간의 불안정을 초래한다.',
    powerAdd: 3, stabilityAdd: -1, durationAdd: 0, chaosAdd: 1,
  },
  {
    id: 'mutate', name: '변이', icon: '🌀',
    desc: '예측 불가', detail: '예상치 못한 결과를 만든다. 위험하지만 경이롭다.',
    powerAdd: 0, stabilityAdd: 0, durationAdd: 0, chaosAdd: 5, special: true,
  },
  {
    id: 'sustain', name: '지속', icon: '⏳',
    desc: '지속시간 증가', detail: '효과가 오래 지속되도록 시간을 고정한다.',
    powerAdd: 0, stabilityAdd: 1, durationAdd: 3, chaosAdd: -1,
  },
  {
    id: 'purify', name: '정화', icon: '✨',
    desc: '독성 제거', detail: '독성 태그를 정화하고 부작용을 무효화한다.',
    powerAdd: -1, stabilityAdd: 4, durationAdd: 0, chaosAdd: -4,
  },
  {
    id: 'seal', name: '봉인', icon: '🔒',
    desc: '히든 효과 봉인', detail: '포션의 숨은 효과를 봉인한다. 안전해지지만 특별함을 잃는다.',
    powerAdd: -2, stabilityAdd: 5, durationAdd: -1, chaosAdd: -5,
  },
];

export const SECRET_COMBOS: SecretCombo[] = [
  {
    ids: ['darkbloom', 'dreamroot'],
    name: '집착의 꿈', hint: '💜 검은 꽃과 꿈의 뿌리가 공명합니다... 꿈 속에서도 잊을 수 없게 됩니다',
    unlock: '집착 수면 포션 레시피 해금',
    flavorText: '꿈 속에서조차 그 사람의 얼굴이 사라지지 않습니다.',
    chaosBonus: 3,
  },
  {
    ids: ['redshroom', 'venomcap'],
    name: '폭주의 독', hint: '🔴 위험한 조합입니다. 강렬한 반응이 감지됩니다!',
    unlock: '베르세르크 포션 레시피 해금',
    flavorText: '몸이 타오르는 것처럼 에너지가 폭발합니다.',
    powerBonus: 5, chaosBonus: 3,
  },
  {
    ids: ['moongrass', 'goldpetal'],
    name: '성스러운 치유', hint: '✨ 달빛과 황금이 공명합니다. 순수한 빛이 느껴집니다!',
    unlock: '대치유 포션 레시피 해금',
    flavorText: '상처뿐 아니라 마음의 흉터까지 아뭅니다.',
    stabilityBonus: 4, powerBonus: 2,
  },
  {
    ids: ['dreamroot', 'starshell'],
    name: '각성의 꿈', hint: '🌟 수면과 집중의 역설... 자면서도 모든 게 선명해집니다',
    unlock: '루시드 드림 포션 레시피 해금',
    flavorText: '잠들어 있지만 완전히 깨어있습니다.',
    durationBonus: 3, special: 'lucid',
  },
  {
    ids: ['darkbloom', 'venomcap'],
    name: '저주의 심연', hint: '⚫ 이 조합은 금지되어 있습니다. 되돌릴 수 없습니다...',
    unlock: '심층 저주 포션 레시피 해금',
    flavorText: '어둠이 포션 전체를 집어삼킵니다.',
    chaosBonus: 6,
  },
  {
    ids: ['moongrass', 'silvermoss', 'ironbark'],
    name: '대지의 수호', hint: '🌱 세 가지 자연 재료가 완벽하게 공명합니다. 강력한 균형!',
    unlock: '불사 포션 레시피 해금',
    flavorText: '대지의 힘이 몸 전체를 감쌉니다.',
    stabilityBonus: 6, durationBonus: 4,
  },
  {
    ids: ['ashleaf', 'darkbloom', 'dreamroot'],
    name: '망각의 저주', hint: '🖤 재의 잎, 검은 꽃, 꿈의 뿌리... 기억을 지우는 금지된 조합',
    unlock: '망각 포션 레시피 해금 (극비)',
    flavorText: '특정 기억을 선택적으로 지울 수 있습니다. 윤리적 판단은 사용자의 몫.',
    chaosBonus: 4, powerBonus: 3,
  },
  {
    ids: ['moonstone', 'goldpetal', 'silvermoss'],
    name: '달의 정수', hint: '💎 월광석이 반응합니다. 전설적인 조합이 완성됩니다!',
    unlock: '달빛 정수 포션 레시피 해금 (전설)',
    flavorText: '달의 힘 전체가 하나의 포션에 담겼습니다.',
    stabilityBonus: 5, durationBonus: 6, powerBonus: 3,
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 1, name: '정아', type: '걱정 많은 고객', avatarEmoji: '🌙',
    request: '요즘 통 잠을 못 자요... 밤마다 이상한 꿈을 꾸고요. 그냥 꿈 없이 푹 자고 싶어요.',
    hidden: '단순 수면이 아닌 꿈 없는 깊은 수면을 원한다. 불안 해소가 핵심. 안정성이 중요.',
    reqTags: ['수면'], hiddenTags: ['안정', '환상'], price: 320, urgency: 60,
    prefTags: ['수면', '안정'], allowChaos: 1,
    backstory: '2주 전부터 불면증이 시작됐다고 함. 최근 직장 스트레스가 심한 듯.',
  },
  {
    id: 2, name: '준호', type: '급한 고객', avatarEmoji: '⚡',
    request: '내일 중요한 발표가 있는데 집중력 포션 급히 부탁드립니다!! 오늘 밤 안에 필요해요',
    hidden: '단기 고강도 집중. 부작용 감수 가능. 6시간 이상 지속 필요. 빠른 발동 중요.',
    reqTags: ['집중'], hiddenTags: ['활력', '마음'], price: 280, urgency: 95,
    prefTags: ['집중', '활력', '마음'], allowChaos: 3, urgent: true,
    backstory: '대기업 PT. 실패하면 프로젝트 날린다고 함. 여러 번 주문한 단골.',
  },
  {
    id: 3, name: '익명', type: '음흉한 의뢰인', avatarEmoji: '🖤',
    request: '특정인이... 저를 조금 더 신경 써줬으면 해요. 어떻게든 방법이 있을까요?',
    hidden: '사랑 포션 + 집착 성분을 원하는 것으로 보임. 도덕적 판단이 필요한 주문. 상대방 동의 없음.',
    reqTags: ['사랑'], hiddenTags: ['집착'], price: 600, urgency: 40,
    prefTags: ['사랑', '집착'], allowChaos: 5, warning: true,
    backstory: '신원 미상. 결제는 선불로 완료. 주문 내용 구체적으로 묻자 거절.',
  },
  {
    id: 4, name: '할머니 H', type: '일반', avatarEmoji: '🌸',
    request: '무릎이 많이 아픈데요... 오래 걸어다닐 수 있게 해주는 게 있을까요?',
    hidden: '지속적인 치유 효과. 천천히 효과가 나타나도 괜찮음. 안전성 최우선.',
    reqTags: ['치유'], hiddenTags: ['지속', '안정'], price: 180, urgency: 30,
    prefTags: ['치유', '안정', '지속'], allowChaos: 0,
    backstory: '단골 고객. 매달 한 번씩 방문. 항상 감사 인사를 잊지 않으심.',
  },
  {
    id: 5, name: 'V', type: '위험 선호', avatarEmoji: '🔥',
    request: '가장 강한 걸로 주세요. 부작용? 상관없어요. 살아있다는 느낌이 필요해요.',
    hidden: '극도의 자극을 원함. 부작용 완전 허용. 강도가 전부. 안전은 신경 안 씀.',
    reqTags: ['활력'], hiddenTags: ['독성'], price: 850, urgency: 50,
    prefTags: ['활력', '독성', '혼란'], allowChaos: 10, premium: true,
    backstory: '매우 특이한 단골. 부작용이 클수록 더 좋아함. 고수익 고객.',
  },
  {
    id: 6, name: '수진', type: '급한 고객', avatarEmoji: '💼',
    request: '시험 전날인데 기억력이랑 집중력을 동시에 올릴 수 있나요? 내일 아침까지요',
    hidden: '기억력 강화 + 집중. 12시간 이상 지속 필요. 수면 방해 없어야 함.',
    reqTags: ['집중', '마음'], hiddenTags: ['지속'], price: 350, urgency: 85,
    prefTags: ['집중', '마음', '지속'], allowChaos: 2, urgent: true,
    backstory: '수능 수험생으로 보임. 첫 주문. 예산이 빠듯한 것 같음.',
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1', name: '정아', stars: 5, special: false, low: false, verified: true,
    potion: '수면 포션 (안정화)',
    text: '눈을 감으니 그냥... 아침이었어요. 꿈도 없고, 완전한 어둠. 이게 진짜 잠이었구나 싶었어요. 2주만에 처음으로 개운하게 일어났네요.',
    effect: '깊은 수면 8시간 · 꿈 없음 확인', effectType: 'good',
    date: '2일 전',
  },
  {
    id: 'r2', name: '준호', stars: 4, special: false, low: false, verified: true,
    potion: '집중 포션 (증폭)',
    text: '발표 완전 성공! 근데 효과 끝나고 3시간 동안 손이 좀 떨렸어요. 부장님이 왜 그러냐고 물어볼 뻔했는데... 그래도 발표가 더 중요하니까 감사합니다.',
    effect: '집중력 +220% · 손 떨림 부작용 3h', effectType: 'weird',
    date: '5일 전',
  },
  {
    id: 'r3', name: 'V', stars: 5, special: true, low: false, verified: true,
    potion: '폭주의 독 (변이 조합)',
    text: '진짜 살아있다는 느낌... 벽을 맨손으로 부수고 싶었어요. 의사선생님이 혈압 왜 그러냐고 했는데 제가 원하는 게 이거예요. 다음엔 더 강하게요.',
    effect: '★ 위험 고객 최고 만족 · 심박수 +180%', effectType: 'special',
    date: '1주 전',
  },
  {
    id: 'r4', name: '단골 K', stars: 3, special: false, low: false, verified: true,
    potion: '치유 포션 (천천히 끓이기)',
    text: '다음날 일어났더니 발목이 나아있었어요. 근데 왜 장미 향이 하루 종일 나죠? 회사에서 뭐 뿌렸냐고 세 번이나 물어봤어요.',
    effect: '치유 완료 · 장미 향 잔류 72h', effectType: 'weird',
    date: '2주 전',
  },
  {
    id: 'r5', name: '조용한 J', stars: 2, special: false, low: true, verified: true,
    potion: '수면 포션 (흔들기)',
    text: '잤는데... 그 사람 꿈을 꿨어요. 세 번이나. 이거 원래 이런 거예요? 오히려 더 피곤한 것 같은데요.',
    effect: '수면 완료 · 특정 인물 집착 꿈 부작용', effectType: 'bad',
    date: '3주 전',
  },
  {
    id: 'r6', name: '약초사 H', stars: 5, special: false, low: false, verified: true,
    potion: '성스러운 치유 포션 (달빛+황금)',
    text: '오래된 상처가 지워졌어요. 흉터가 사라진 게 아니라 아팠던 기억까지요. 30년 된 수술 흉터가... 이건 그냥 포션이 아니에요. 이런 마법사가 아직 있다니.',
    effect: '완전 치유 + 기억 정화 히든 효과 발동', effectType: 'special',
    date: '1달 전',
  },
  {
    id: 'r7', name: '????????????', stars: 1, special: false, low: true, verified: false,
    potion: '알 수 없음',
    text: '그 포션 먹고 제가 잠시 다른 사람이 됐던 것 같아요. 환불해주세요. 제발요.',
    effect: '정체불명 변이 효과 · 신원 확인 불가', effectType: 'bad',
    date: '2달 전',
  },
  {
    id: 'r8', name: '수진', stars: 5, special: false, low: false, verified: true,
    potion: '각성의 꿈 포션 (히든 조합)',
    text: '시험 보는 내내 머릿속이 엄청 선명했어요. 잠도 잘 잔 것 같고... 어떻게 이게 가능한 거죠? 수능 끝나고 또 올게요.',
    effect: '집중 + 수면 동시 발동 · 루시드 드림 히든 효과', effectType: 'special',
    date: '3주 전',
  },
];