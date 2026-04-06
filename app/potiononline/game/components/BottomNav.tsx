'use client';
import { useGame } from '../lib/gameStore';

export default function BottomNav() {
  const { state, dispatch } = useGame();
  const newOrderCount = state.orders.length;

  const tabs = [
    { id: 'orders' as const, label: '주문함', icon: '📬', badge: newOrderCount },
    { id: 'craft' as const, label: '제작소', icon: '⚗️', badge: 0 },
    { id: 'reviews' as const, label: '리뷰', icon: '📜', badge: 0 },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-tab ${state.tab === tab.id ? 'active' : ''}`}
          onClick={() => dispatch({ type: 'SET_TAB', tab: tab.id })}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
          {tab.badge > 0 && <span className="tab-badge">{tab.badge}</span>}
        </button>
      ))}

      <style jsx>{`
        .bottom-nav {
          position: sticky;
          bottom: 0;
          width: 100%;
          background: #fff;
          border-top: 1px solid #f0ede8;
          display: flex;
          z-index: 50;
          padding-bottom: env(safe-area-inset-bottom);
        }
        .nav-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 10px 4px 12px;
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
          transition: color 0.15s;
          color: #b0a898;
          font-family: 'Noto Sans KR', sans-serif;
        }
        .nav-tab.active { color: #1a1208; }
        .tab-icon { font-size: 20px; line-height: 1; }
        .tab-label { font-size: 10px; font-weight: 500; letter-spacing: 0.3px; }
        .tab-badge {
          position: absolute;
          top: 6px; right: calc(50% - 18px);
          background: #c8470a;
          color: #fff;
          font-size: 9px;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: 10px;
          min-width: 16px;
          text-align: center;
        }
      `}</style>
    </nav>
  );
}