'use client';
import { useGame } from '../lib/gameStore';

export default function TopHeader() {
  const { state } = useGame();
  const { gold, reputation, totalShipped } = state.game;

  return (
    <header className="header">
      <div className="header-brand">
        <span className="brand-mark">✦</span>
        <span className="brand-name">POTION ONLINE</span>
        <span className="brand-mark">✦</span>
      </div>
      <div className="header-stats">
        <div className="hstat">
          <span className="hstat-icon">🪙</span>
          <span className="hstat-val">{gold.toLocaleString()}</span>
        </div>
        <div className="hstat-divider" />
        <div className="hstat">
          <span className="hstat-icon">⭐</span>
          <span className="hstat-val">{reputation.toFixed(1)}</span>
        </div>
        <div className="hstat-divider" />
        <div className="hstat">
          <span className="hstat-icon">📦</span>
          <span className="hstat-val">{totalShipped}</span>
        </div>
      </div>

      <style jsx>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 40;
          background: #1a1208;
          padding: 10px 16px 0;
        }
        .header-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid #2e2010;
          font-family: 'Cinzel Decorative', serif;
          color: #d4a017;
          font-size: 13px;
          letter-spacing: 3px;
        }
        .brand-mark { font-size: 10px; opacity: 0.7; }
        .header-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 8px 0;
        }
        .hstat {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .hstat-icon { font-size: 13px; }
        .hstat-val {
          font-size: 13px;
          font-weight: 500;
          color: #e0c888;
          font-family: 'Noto Sans KR', sans-serif;
        }
        .hstat-divider {
          width: 1px;
          height: 14px;
          background: #3a2d1a;
        }
      `}</style>
    </header>
  );
}