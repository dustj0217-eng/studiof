'use client';
import { useGame } from '../../lib/gameStore';
import { scorePotion, generateReview } from '../../lib/gameEngine';

export default function ResultModal() {
  const { state, dispatch } = useGame();
  const { showResultModal, craft, activeOrder } = state;
  const result = craft.currentResult;
  if (!result) return null;

  const handleShip = () => {
    const order = activeOrder ?? state.orders[0];
    const score = order ? scorePotion(order, result) : 3;
    const review = generateReview(order ?? state.orders[0], result, score);
    const goldEarned = order ? order.price + (score >= 4 ? Math.round(order.price * 0.1) : 0) : 200;
    dispatch({ type: 'SHIP_POTION', review, gold: goldEarned, score });
  };

  return (
    <>
      <div className={`overlay ${showResultModal ? 'open' : ''}`} onClick={() => dispatch({ type: 'SHOW_RESULT_MODAL', show: false })} />
      <div className={`sheet ${showResultModal ? 'open' : ''}`}>
        <div className="handle" />
        <div className="content">

          <div className="potion-showcase">
            <div className="potion-aura" />
            <div className="potion-emoji">{result.emoji}</div>
          </div>
          <div className="potion-name">{result.name}</div>
          <div className="potion-flavor">{result.flavorText}</div>

          {/* Stats grid */}
          <div className="stats-grid">
            {[
              { label: '효과 강도', val: result.power, color: '#d4a017', max: 20 },
              { label: '안정성', val: result.stability, color: '#2d7a4a', max: 20 },
              { label: '지속 시간', val: result.duration, color: '#2a5aaa', max: 20 },
              { label: '왜곡도', val: result.chaos, color: '#8b2a8b', max: 20 },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="sc-val" style={{ color: s.color }}>{s.val}</div>
                <div className="sc-bar">
                  <div className="sc-fill" style={{ width: `${(s.val / s.max) * 100}%`, background: s.color }} />
                </div>
                <div className="sc-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="tag-row">
            {[...new Set(result.dominantTags)].slice(0, 5).map(t => (
              <span key={t} className="rtag">{t}</span>
            ))}
          </div>

          {/* Secret unlock */}
          {result.secretFound && (
            <div className="secret-unlock">
              <div className="su-label">✦ 비밀 조합 발견!</div>
              <div className="su-name">{result.secretFound.name}</div>
              <div className="su-text">{result.secretFound.unlock}</div>
            </div>
          )}

          {/* Warning for high chaos */}
          {result.chaos >= 12 && (
            <div className="chaos-warn">
              ⚠️ 왜곡도가 높습니다. 예상치 못한 부작용이 발생할 수 있습니다.
            </div>
          )}

          <button className="ship-btn" onClick={handleShip}>
            📦 포션 배송하기
          </button>
          <button className="cancel-btn" onClick={() => dispatch({ type: 'SHOW_RESULT_MODAL', show: false })}>
            다시 만들기
          </button>
        </div>
      </div>

      <style jsx>{`
        .overlay {
          display: none; position: fixed; inset: 0;
          background: rgba(10, 8, 4, 0.75); z-index: 70;
        }
        .overlay.open { display: block; }
        .sheet {
          position: fixed; bottom: 0; left: 50%;
          transform: translateX(-50%) translateY(100%);
          width: 100%; max-width: 430px;
          background: #fff; border-radius: 20px 20px 0 0;
          max-height: 90vh;
          transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
          z-index: 80;
          padding-bottom: env(safe-area-inset-bottom);
        }
        .sheet.open { transform: translateX(-50%) translateY(0); }
        .handle { width: 36px; height: 4px; background: #e8e0d0; border-radius: 2px; margin: 12px auto 0; }
        .content { padding: 16px 20px 24px; overflow-y: auto; max-height: calc(90vh - 30px); }

        .potion-showcase {
          position: relative; width: 100px; height: 100px;
          margin: 8px auto 0; display: flex; align-items: center; justify-content: center;
        }
        .potion-aura {
          position: absolute; inset: 0; border-radius: 50%;
          background: radial-gradient(circle, rgba(212,160,23,0.15) 0%, transparent 70%);
          animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .potion-emoji {
          font-size: 60px; position: relative;
          animation: float 3s infinite ease-in-out;
        }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .potion-name {
          font-family: 'Cinzel Decorative', serif;
          font-size: 16px; color: #1a1208;
          text-align: center; margin: 10px 0 4px;
        }
        .potion-flavor {
          font-family: 'Crimson Pro', serif;
          font-size: 14px; font-style: italic;
          color: #7a6a50; text-align: center;
          margin-bottom: 18px; line-height: 1.5;
        }

        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
        .stat-card { background: #faf8f4; border-radius: 10px; padding: 12px 10px; text-align: center; border: 1px solid #f0ede8; }
        .sc-val { font-size: 24px; font-weight: 700; font-family: 'Noto Sans KR', sans-serif; margin-bottom: 4px; }
        .sc-bar { height: 3px; background: #e8e0d0; border-radius: 2px; overflow: hidden; margin-bottom: 5px; }
        .sc-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }
        .sc-label { font-size: 10px; color: #b0a898; font-family: 'Noto Sans KR', sans-serif; letter-spacing: 0.5px; }

        .tag-row { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 14px; justify-content: center; }
        .rtag { font-size: 11px; padding: 4px 10px; border-radius: 20px; background: #f5f0e8; color: #5a4a2a; border: 1px solid #e0d4b8; font-family: 'Noto Sans KR', sans-serif; font-weight: 500; }

        .secret-unlock {
          background: #1a1208; border-radius: 12px; padding: 14px;
          margin-bottom: 12px; border: 1px solid #d4a01750;
          animation: goldGlow 2s infinite;
        }
        @keyframes goldGlow {
          0%,100% { border-color: #d4a01740; }
          50% { border-color: #d4a017; }
        }
        .su-label { font-size: 9px; letter-spacing: 2px; color: #d4a017; text-transform: uppercase; font-family: 'Noto Sans KR', sans-serif; font-weight: 600; margin-bottom: 4px; }
        .su-name { font-family: 'Cinzel Decorative', serif; color: #d4a017; font-size: 13px; margin-bottom: 4px; }
        .su-text { font-size: 12px; color: #c8a850; font-family: 'Crimson Pro', serif; font-style: italic; }

        .chaos-warn {
          background: #fff5f0; border: 1px solid #fcd0b0;
          border-radius: 10px; padding: 10px 12px;
          font-size: 12px; color: #8b3a1a;
          margin-bottom: 12px; line-height: 1.5;
          font-family: 'Noto Sans KR', sans-serif;
        }

        .ship-btn {
          width: 100%; padding: 15px;
          background: #1a2a10; color: #8aba60;
          border: none; border-radius: 12px;
          font-size: 14px; font-weight: 700;
          font-family: 'Noto Sans KR', sans-serif;
          letter-spacing: 0.5px; cursor: pointer;
          margin-bottom: 8px;
          transition: opacity 0.15s;
        }
        .ship-btn:active { opacity: 0.85; }
        .cancel-btn {
          width: 100%; padding: 13px;
          background: transparent; color: #b0a898;
          border: 1px solid #e8e0d0; border-radius: 12px;
          font-size: 13px; font-family: 'Noto Sans KR', sans-serif;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}