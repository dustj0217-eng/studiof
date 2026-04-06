'use client';
import { useGame } from '../../lib/gameStore';

const EFFECT_STYLES = {
  good: { bg: '#f0faf0', color: '#2d6a1a', border: '#c8e8c0' },
  bad: { bg: '#fdf0f0', color: '#6a2a1a', border: '#e8c0c0' },
  weird: { bg: '#f8f0ff', color: '#5a2a7a', border: '#d8c0f0' },
  special: { bg: '#1a1208', color: '#d4a017', border: '#3a2a10' },
};

function StarDisplay({ stars, special, low }: { stars: number; special: boolean; low: boolean }) {
  const color = special ? '#7b3fa0' : low ? '#c8470a' : '#d4a017';
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < stars ? color : '#e8e0d0', fontSize: 14 }}>
          {i < stars ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const { state } = useGame();
  const { reviews, game } = state;
  const avg = game.reputation;

  const fiveStar = reviews.filter(r => r.stars === 5).length;
  const fourStar = reviews.filter(r => r.stars === 4).length;
  const threeStar = reviews.filter(r => r.stars === 3).length;
  const twoStar = reviews.filter(r => r.stars === 2).length;
  const oneStar = reviews.filter(r => r.stars === 1).length;

  return (
    <div className="reviews-page">
      {/* Reputation card */}
      <div className="rep-card">
        <div className="rep-left">
          <div className="rep-score">{avg.toFixed(1)}</div>
          <div className="rep-stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ color: i < Math.round(avg) ? '#d4a017' : '#e8e0d0', fontSize: 18 }}>★</span>
            ))}
          </div>
          <div className="rep-count">리뷰 {reviews.length}개</div>
        </div>
        <div className="rep-right">
          {[
            { label: '5점', count: fiveStar, color: '#d4a017' },
            { label: '4점', count: fourStar, color: '#8aba60' },
            { label: '3점', count: threeStar, color: '#6090d8' },
            { label: '2점', count: twoStar, color: '#c8a040' },
            { label: '1점', count: oneStar, color: '#c8470a' },
          ].map(b => (
            <div key={b.label} className="bar-row">
              <span className="bar-label">{b.label}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{
                  width: reviews.length ? `${(b.count / reviews.length) * 100}%` : '0%',
                  background: b.color,
                }} />
              </div>
              <span className="bar-count">{b.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shop info strip */}
      <div className="shop-strip">
        <div className="strip-item">
          <span className="strip-val">{game.totalShipped}</span>
          <span className="strip-label">총 배송</span>
        </div>
        <div className="strip-div" />
        <div className="strip-item">
          <span className="strip-val">{game.unlockedRecipes.length + 3}</span>
          <span className="strip-label">레시피</span>
        </div>
        <div className="strip-div" />
        <div className="strip-item">
          <span className="strip-val">Day {game.day}</span>
          <span className="strip-label">영업일</span>
        </div>
      </div>

      <div className="section-head">고객 리뷰</div>

      {reviews.map(r => {
        const eff = EFFECT_STYLES[r.effectType];
        return (
          <div key={r.id} className="review-card">
            <div className="rv-top">
              <div className="rv-left">
                <StarDisplay stars={r.stars} special={r.special} low={r.low} />
                <div className="rv-name">{r.name}</div>
              </div>
              <div className="rv-right">
                {r.verified && <span className="verified-badge">구매 확인</span>}
                <div className="rv-date">{r.date}</div>
              </div>
            </div>
            <div className="rv-potion">⚗ {r.potion}</div>
            <div className="rv-text">"{r.text}"</div>
            <div className="rv-effect" style={{ background: eff.bg, color: eff.color, border: `1px solid ${eff.border}` }}>
              {r.effect}
            </div>
            {r.special && (
              <div className="special-badge">✦ 특별 후기 — 위험 고객 최고 만족</div>
            )}
          </div>
        );
      })}

      <div style={{ height: 80 }} />

      <style jsx>{`
        .reviews-page { background: #faf8f4; min-height: 100vh; padding: 16px; }

        .rep-card {
          background: #fff; border-radius: 16px; padding: 18px;
          display: flex; gap: 16px; margin-bottom: 10px;
          border: 1px solid #f0ede8;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .rep-left { text-align: center; width: 90px; flex-shrink: 0; }
        .rep-score { font-size: 40px; font-weight: 700; color: #1a1208; font-family: 'Noto Sans KR', sans-serif; line-height: 1; margin-bottom: 4px; }
        .rep-stars { display: flex; justify-content: center; gap: 1px; margin-bottom: 4px; }
        .rep-count { font-size: 11px; color: #b0a898; font-family: 'Noto Sans KR', sans-serif; }
        .rep-right { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 5px; }
        .bar-row { display: flex; align-items: center; gap: 6px; }
        .bar-label { font-size: 10px; color: #b0a898; width: 22px; font-family: 'Noto Sans KR', sans-serif; }
        .bar-track { flex: 1; height: 5px; background: #f0ede8; border-radius: 3px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 3px; transition: width 0.5s; }
        .bar-count { font-size: 10px; color: #b0a898; width: 14px; text-align: right; font-family: 'Noto Sans KR', sans-serif; }

        .shop-strip {
          background: #1a1208; border-radius: 12px; padding: 14px;
          display: flex; align-items: center; justify-content: space-around;
          margin-bottom: 16px;
        }
        .strip-item { text-align: center; }
        .strip-val { display: block; font-size: 18px; font-weight: 700; color: #d4a017; font-family: 'Noto Sans KR', sans-serif; }
        .strip-label { font-size: 10px; color: #7a6a50; font-family: 'Noto Sans KR', sans-serif; letter-spacing: 0.5px; }
        .strip-div { width: 1px; height: 28px; background: #2e2010; }

        .section-head {
          font-size: 11px; font-weight: 600; letter-spacing: 2px;
          color: #b0a898; text-transform: uppercase;
          margin: 0 0 12px;
          font-family: 'Noto Sans KR', sans-serif;
        }

        .review-card {
          background: #fff; border: 1px solid #f0ede8;
          border-radius: 14px; padding: 14px;
          margin-bottom: 10px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }
        .rv-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
        .rv-left { display: flex; flex-direction: column; gap: 3px; }
        .rv-name { font-size: 13px; font-weight: 600; color: #1a1208; font-family: 'Noto Sans KR', sans-serif; }
        .rv-right { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 3px; }
        .verified-badge { font-size: 9px; background: #f0f8ff; color: #2a5aaa; border: 1px solid #c0d8f0; padding: 2px 6px; border-radius: 6px; font-family: 'Noto Sans KR', sans-serif; font-weight: 600; }
        .rv-date { font-size: 10px; color: #c0b8a8; font-family: 'Noto Sans KR', sans-serif; }
        .rv-potion { font-size: 10px; color: #2d5a27; letter-spacing: 0.5px; margin-bottom: 8px; font-family: 'Noto Sans KR', sans-serif; font-weight: 500; }
        .rv-text {
          font-family: 'Crimson Pro', serif;
          font-size: 15px; font-style: italic;
          color: #3a2d1a; line-height: 1.65; margin-bottom: 10px;
        }
        .rv-effect {
          font-size: 10px; padding: 5px 10px;
          border-radius: 8px; display: inline-block;
          font-family: 'Noto Sans KR', sans-serif;
          font-weight: 500; line-height: 1.4;
        }
        .special-badge {
          margin-top: 8px; font-size: 10px;
          color: #7b3fa0; font-family: 'Noto Sans KR', sans-serif;
          font-weight: 600; letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
}