import type { Order } from '../types/potion';

const PRICE_VARIANCE = [0.88, 0.94, 1, 1.08, 1.16, 1.24];
const REPEAT_PREFIX = ['다시 부탁드려요. ', '이번에도 가능할까요? ', '급하게 하나 더 필요해서요. ', '지난번처럼 부탁드려요. ', '추천받고 왔어요. '];

export function generateNextOrder(templates: Order[], serial: number, previousTemplateId?: number): Order {
  const candidates = templates.filter(o => o.id !== previousTemplateId);
  const template = candidates[Math.floor(Math.random() * candidates.length)] ?? templates[0];
  const variance = PRICE_VARIANCE[Math.floor(Math.random() * PRICE_VARIANCE.length)];
  const repeat = Math.random() < 0.38;
  return {
    ...template,
    id: serial,
    name: repeat && template.name !== '익명' ? template.name : template.name,
    request: repeat ? `${REPEAT_PREFIX[Math.floor(Math.random() * REPEAT_PREFIX.length)]}${template.request}` : template.request,
    price: Math.max(80, Math.round((template.price * variance) / 10) * 10),
    urgency: Math.max(10, Math.min(100, template.urgency + Math.floor(Math.random() * 21) - 10)),
  };
}

export function refillOrderBoard(current: Order[], templates: Order[], nextSerial: number, targetCount = 7) {
  const result = [...current];
  let serial = nextSerial;
  while (result.length < targetCount) {
    result.push(generateNextOrder(templates, serial++));
  }
  return { orders: result, nextSerial: serial };
}
