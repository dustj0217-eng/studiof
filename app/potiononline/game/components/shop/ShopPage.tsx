'use client';
import { useGame } from '../../lib/gameStore';
import OrderCard from '../shop/OrderCard';
import OrderModal from '../shop/OrderModal';

export default function ShopPage() {
  const { state } = useGame();
  const { orders, game } = state;

  return (
    <div className="shop-page">
      {/* Hero banner */}
      <div className="hero-banner">
        <div className="hero-bg-pattern" />
        <div className="hero-content">
          <div className="hero-eyebrow">✦ 마야의 포션 쇼핑몰 ✦</div>
          <div className="hero-title">Maya's<br />Potion Shop</div>
          <div className="hero-sub">비밀 보장 · 당일 배송 · 환불 불가</div>
        </div>
        <div className="hero-stats">
          <div className="hs-item">
            <span className="hs-val">★ {game.reputation.toFixed(1)}</span>
            <span className="hs-label">평점</span>
          </div>
          <div className="hs-div" />
          <div className="hs-item">
            <span className="hs-val">{game.totalShipped}+</span>
            <span className="hs-label">배송 완료</span>
          </div>
          <div className="hs-div" />
          <div className="hs-item">
            <span className="hs-val">Day {game.day}</span>
            <span className="hs-label">영업일</span>
          </div>
        </div>
      </div>

      {/* Active order notice */}
      {state.activeOrder && (
        <div className="active-notice">
          <span>🔨</span>
          <span>제작 중: <strong>{state.activeOrder.name}</strong>님의 주문</span>
        </div>
      )}

      {/* Category chips */}
      <div className="chip-row">
        {['전체', '치유', '집중', '수면', '활력', '사랑', '긴급'].map(c => (
          <button key={c} className={`chip ${c === '전체' ? 'active' : ''}`}>{c}</button>
        ))}
      </div>

      {/* Sort bar */}
      <div className="sort-bar">
        <span className="sort-count">주문 {orders.length}건</span>
        <div className="sort-options">
          <span className="sort-opt active">최신순</span>
          <span className="sort-opt">금액순</span>
          <span className="sort-opt">긴급순</span>
        </div>
      </div>

      {/* Orders */}
      <div className="orders-list">
        {orders.map(o => <OrderCard key={o.id} order={o} />)}
      </div>

      {/* World effects teaser */}
      <div className="world-section">
        <div className="world-title">🌍 세계 변화 현황</div>
        <div className="world-items">
          <div className="world-item">
            <div className="wi-bar" style={{ width: '35%', background: '#6090d8' }} />
            <span className="wi-label">수면 포션 영향</span>
            <span className="wi-val">35%</span>
          </div>
          <div className="world-item">
            <div className="wi-bar" style={{ width: '20%', background: '#d878a0' }} />
            <span className="wi-label">사랑 포션 영향</span>
            <span className="wi-val">20%</span>
          </div>
          <div className="world-item">
            <div className="wi-bar" style={{ width: '10%', background: '#c85050' }} />
            <span className="wi-label">집착 포션 영향</span>
            <span className="wi-val">10%</span>
          </div>
        </div>
      </div>

      <div style={{ height: 80 }} />
      <OrderModal />

      <style jsx>{`
        .shop-page { background: #f5f2ec; min-height: 100vh; }

        .hero-banner {
          background: #1a1208; padding: 20px 16px 16px;
          position: relative; overflow: hidden;
          margin-bottom: 0;
        }
        .hero-bg-pattern {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle at 80% 20%, rgba(212,160,23,0.08) 0%, transparent 60%),
                            radial-gradient(circle at 20% 80%, rgba(139,134,11,0.06) 0%, transparent 50%);
        }
        .hero-content { position: relative; margin-bottom: 14px; }
        .hero-eyebrow {
          font-size: 10px; letter-spacing: 3px; color: #6a5a3a;
          text-transform: uppercase; margin-bottom: 6px;
          font-family: 'Noto Sans KR', sans-serif; font-weight: 500;
        }
        .hero-title {
          font-family: 'Cinzel Decorative', serif;
          color: #d4a017; font-size: 26px;
          line-height: 1.15; margin-bottom: 6px;
          letter-spacing: 1px;
        }
        .hero-sub {
          font-size: 11px; color: #7a6a50;
          font-family: 'Crimson Pro', serif; font-style: italic;
          letter-spacing: 0.5px;
        }
        .hero-stats {
          display: flex; align-items: center; gap: 0;
          background: #0d0a04; border-radius: 10px; padding: 10px 0;
          position: relative;
        }
        .hs-item { flex: 1; text-align: center; }
        .hs-val { display: block; font-size: 15px; font-weight: 700; color: #d4a017; font-family: 'Noto Sans KR', sans-serif; }
        .hs-label { font-size: 10px; color: #5a4a2a; font-family: 'Noto Sans KR', sans-serif; }
        .hs-div { width: 1px; height: 24px; background: #2e2010; }

        .active-notice {
          background: #f0f8e8; border-bottom: 1px solid #d4e8b8;
          padding: 10px 16px; display: flex; align-items: center; gap: 8px;
          font-size: 12px; color: #3a6a1a;
          font-family: 'Noto Sans KR', sans-serif;
        }
        .active-notice strong { font-weight: 700; }

        .chip-row {
          display: flex; gap: 7px; padding: 14px 16px 0;
          overflow-x: auto; scrollbar-width: none;
        }
        .chip-row::-webkit-scrollbar { display: none; }
        .chip {
          flex-shrink: 0; padding: 6px 14px;
          border-radius: 20px; border: 1px solid #e0d8c8;
          background: #fff; color: #7a6a50;
          font-size: 12px; font-weight: 500;
          font-family: 'Noto Sans KR', sans-serif;
          cursor: pointer; transition: all 0.15s;
          white-space: nowrap;
        }
        .chip.active { background: #1a1208; color: #d4a017; border-color: #1a1208; }

        .sort-bar {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 16px 8px;
        }
        .sort-count { font-size: 12px; color: #b0a898; font-family: 'Noto Sans KR', sans-serif; }
        .sort-options { display: flex; gap: 10px; }
        .sort-opt { font-size: 12px; color: #b0a898; cursor: pointer; font-family: 'Noto Sans KR', sans-serif; }
        .sort-opt.active { color: #1a1208; font-weight: 600; }

        .orders-list { padding: 4px 16px 0; }

        .world-section {
          margin: 4px 16px; background: #fff;
          border-radius: 14px; padding: 14px;
          border: 1px solid #f0ede8;
        }
        .world-title { font-size: 12px; font-weight: 600; color: #3a2d1a; margin-bottom: 12px; font-family: 'Noto Sans KR', sans-serif; }
        .world-items { display: flex; flex-direction: column; gap: 8px; }
        .world-item { display: flex; align-items: center; gap: 8px; }
        .wi-bar { height: 5px; border-radius: 3px; min-width: 4px; flex-shrink: 0; }
        .wi-label { flex: 1; font-size: 11px; color: #7a6a50; font-family: 'Noto Sans KR', sans-serif; }
        .wi-val { font-size: 11px; color: #b0a898; font-family: 'Noto Sans KR', sans-serif; font-weight: 600; }
      `}</style>
    </div>
  );
}