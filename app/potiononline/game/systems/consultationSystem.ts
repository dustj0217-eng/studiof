import type { Order } from '../types/potion';

export interface ConsultationOption {
  id: string;
  question: string;
  answer: string;
}

export function getConsultationOptions(order: Order): ConsultationOption[] {
  const durationAnswer = order.hiddenTags.includes('지속')
    ? '짧게 끝나는 것보다는 오래 가는 게 중요해요.'
    : order.urgent
      ? '오래 가는 것보다 지금 당장 효과가 오는 게 중요해요.'
      : '몇 시간 정도면 충분해요. 너무 오래 남는 건 부담스러워요.';

  const safetyAnswer = order.allowChaos <= 1
    ? '부작용은 정말 싫어요. 효과가 조금 약해도 안전했으면 좋겠어요.'
    : order.allowChaos >= 7
      ? '부작용은 감수할게요. 강한 효과가 더 중요합니다.'
      : '조금 어지러운 정도는 괜찮지만 심한 건 곤란해요.';

  const purposeAnswer = order.hidden || '제가 말한 용도 그대로예요. 특별히 숨기는 건 없습니다.';

  return [
    { id: 'duration', question: '효과가 얼마나 오래가야 하나요?', answer: durationAnswer },
    { id: 'safety', question: '부작용은 어느 정도까지 괜찮나요?', answer: safetyAnswer },
    { id: 'purpose', question: '조금 더 자세한 사용 목적을 알려주세요.', answer: purposeAnswer },
  ];
}
