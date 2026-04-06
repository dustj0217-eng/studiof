'use client';
import type { Order } from '../../types/potion';
import { useGame } from "../../lib/gameStore";

interface Props { order: Order; }

const TAG_STYLES: Record<string, string> = {
  치유: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  활력: 'bg-orange-50 text-orange-800 border-orange-200',
  사랑: 'bg-rose-50 text-rose-800 border-rose-200',
  집중: 'bg-blue-50 text-blue-800 border-blue-200',
  마음: 'bg-violet-50 text-violet-800 border-violet-200',
  수면: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  독성: 'bg-red-50 text-red-800 border-red-200',
  집착: 'bg-red-50 text-red-800 border-red-200',
  혼란: 'bg-red-50 text-red-800 border-red-200',
  안정: 'bg-teal-50 text-teal-800 border-teal-200',
  지속: 'bg-teal-50 text-teal-800 border-teal-200',
};

const RARITY_COLOR: Record<Order['type'], string> = {
  '일반': '#6b7280',
  '급한 고객': '#c8470a',
  '위험 선호': '#8b1a1a',
  '음흉한 의뢰인': '#4a1a6b',
  '약초사': '#2d5a27',
  '걱정 많은 고객': '#1a3a6b',
};

export default function OrderCard({ order }: Props) {
  const { dispatch } = useGame();

  return (
    <div className="order-card" onClick={() => dispatch({ type: 'OPEN_ORDER_MODAL', id: order.id })}>
      <div className="card-inner">
        {/* top row */}
        <div className="card-top">
          <div className="customer-row">
            <div className="avatar">{order.avatarEmoji}</div>
            <div>
              <div className="customer-name">{order.name}</div>
              <div className="customer-type" style={{ color: RARITY_COLOR[order.type] }}>
                {order.type}
              </div>
            </div>
          </div>
          <div className="price-col">
            <div className="price">{order.price.toLocaleString()}<span>G</span></div>
            {order.urgent && <div className="badge urgent">긴급</div>}
            {order.warning && <div className="badge warning">⚠ 주의</div>}
            {order.premium && <div className="badge premium">프리미엄</div>}
          </div>
        </div>

        {/* request bubble */}
        <div className="request-bubble">
          <span className="quote-mark">"</span>
          {order.request.length > 60 ? order.request.slice(0, 60) + '...' : order.request}
          <span className="quote-mark">"</span>
        </div>

        {/* tags */}
        <div className="tags-row">
          {order.reqTags.map(t => (
            <span key={t} className={`tag ${TAG_STYLES[t] ?? 'bg-gray-50 text-gray-700 border-gray-200'}`}>{t}</span>
          ))}
          <span className="hidden-tag">+숨은의도</span>
        </div>

        {/* urgency bar */}
        <div className="urgency-track">
          <div
            className="urgency-fill"
            style={{
              width: `${order.urgency}%`,
              background: order.urgency > 80 ? '#c8470a' : order.urgency > 50 ? '#d4a017' : '#2d5a27',
            }}
          />
        </div>
        <div className="urgency-label">긴급도 {order.urgency}%</div>
      </div>

      <style jsx>{`
        .order-card {
          background: #fff;
          border: 1px solid #f0ede8;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.12s, box-shadow 0.12s;
          margin-bottom: 10px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .order-card:active { transform: scale(0.985); }
        .card-inner { padding: 14px 14px 10px; }
        .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
        .customer-row { display: flex; align-items: center; gap: 10px; }
        .avatar { width: 38px; height: 38px; border-radius: 50%; background: #f5f0e8; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 1px solid #e8e0d0; flex-shrink: 0; }
        .customer-name { font-size: 14px; font-weight: 600; color: #1a1208; margin-bottom: 2px; font-family: 'Noto Sans KR', sans-serif; }
        .customer-type { font-size: 11px; font-weight: 500; font-family: 'Noto Sans KR', sans-serif; }
        .price-col { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
        .price { font-size: 17px; font-weight: 700; color: #b8860b; font-family: 'Noto Sans KR', sans-serif; }
        .price span { font-size: 11px; font-weight: 400; margin-left: 1px; }
        .badge { font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 10px; letter-spacing: 0.3px; }
        .badge.urgent { background: #fff0e8; color: #c8470a; border: 1px solid #fcd5b8; }
        .badge.warning { background: #fff0f0; color: #8b1a1a; border: 1px solid #fcc; }
        .badge.premium { background: #fffbe8; color: #8b6500; border: 1px solid #fce888; }
        .request-bubble {
          background: #faf8f4;
          border-left: 3px solid #d4a017;
          border-radius: 0 8px 8px 0;
          padding: 8px 10px;
          font-size: 13px;
          color: #3a2d1a;
          line-height: 1.5;
          margin-bottom: 10px;
          font-family: 'Crimson Pro', serif;
          font-style: italic;
        }
        .quote-mark { color: #d4a017; font-size: 15px; }
        .tags-row { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px; }
        .tag { font-size: 10px; font-weight: 500; padding: 2px 8px; border-radius: 20px; border: 1px solid; font-family: 'Noto Sans KR', sans-serif; }
        .hidden-tag { font-size: 10px; font-weight: 500; padding: 2px 8px; border-radius: 20px; background: #1a1208; color: #d4a017; font-family: 'Noto Sans KR', sans-serif; }
        .urgency-track { height: 3px; background: #f0ede8; border-radius: 2px; overflow: hidden; margin-bottom: 4px; }
        .urgency-fill { height: 100%; border-radius: 2px; transition: width 0.3s; }
        .urgency-label { font-size: 9px; color: #b0a898; text-align: right; font-family: 'Noto Sans KR', sans-serif; }
      `}</style>
    </div>
  );
}