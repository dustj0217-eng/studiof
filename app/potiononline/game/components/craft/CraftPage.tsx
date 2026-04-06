'use client';
import { useEffect } from 'react';
import { useGame, getIngredientById, getMixById, getSpellById } from '../../lib/gameStore';
import { INGREDIENTS, MIX_METHODS, SPELLS, SECRET_COMBOS } from '../../lib/gameData';
import { computePotion } from '../../lib/gameEngine';
import ResultModal from './ResultModal';

const RARITY_COLORS = {
  common: '#6b7280',
  uncommon: '#2563eb',
  rare: '#7c3aed',
  legendary: '#b8860b',
};

const MTAG_STYLES: Record<string, string> = {
  치유: '#1a3a10|#7ac857',
  활력: '#3a1800|#e88a30',
  사랑: '#3a1020|#d878a0',
  집중: '#0a1a3a|#7090e8',
  마음: '#2a1a3a|#b078d8',
  수면: '#1a1a3a|#8888d8',
  독성: '#2a0a0a|#c85050',
  집착: '#2a0a0a|#c85050',
  혼란: '#2a0a0a|#c85050',
  안정: '#0a2a1a|#50a878',
  불안정: '#3a2a00|#d8a830',
  지속: '#0a2a1a|#50a878',
  환상: '#1a0a3a|#a050e8',
  저주: '#2a0a1a|#c050a0',
  정화: '#0a2a2a|#50c8c8',
  방어: '#0a1a2a|#5090c8',
};

export default function CraftPage() {
  const { state, dispatch } = useGame();
  const { selectedIngredientIds, selectedMixId, selectedSpellId, currentResult } = state.craft;

  const selectedIngredients = selectedIngredientIds.map(id => getIngredientById(id)).filter(Boolean) as any[];
  const selectedMix = getMixById(selectedMixId ?? '');
  const selectedSpell = getSpellById(selectedSpellId ?? '');

  // Auto-compute on any selection change
  useEffect(() => {
    if (selectedIngredients.length > 0) {
      const result = computePotion(selectedIngredients, selectedMix ?? null, selectedSpell ?? null);
      dispatch({ type: 'SET_RESULT', result });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIngredientIds, selectedMixId, selectedSpellId]);

  const canBrew = selectedIngredients.length > 0 && selectedMixId && selectedSpellId;

  // Find partial secret combos for hints
  const comboHint = (() => {
    if (!selectedIngredientIds.length) return null;
    const found = SECRET_COMBOS.find(c => c.ids.every(id => selectedIngredientIds.includes(id)));
    if (found) return { text: found.hint, discovered: true };
    const partial = SECRET_COMBOS.find(c =>
      c.ids.some(id => selectedIngredientIds.includes(id)) &&
      !c.ids.every(id => selectedIngredientIds.includes(id))
    );
    if (partial) return { text: '🔮 뭔가 반응하고 있습니다... 다른 재료를 추가해보세요', discovered: false };
    return null;
  })();

  const handleBrew = () => {
    if (!canBrew || !currentResult) return;
    dispatch({ type: 'SHOW_RESULT_MODAL', show: true });
  };

  // Cauldron liquid color based on selected ingredients
  const liquidColor = (() => {
    if (selectedIngredientIds.includes('venomcap') || selectedIngredientIds.includes('ashleaf')) return '#3a0a3a';
    if (selectedIngredientIds.includes('darkbloom')) return '#2a0a3a';
    if (selectedIngredientIds.includes('dreamroot')) return '#0a0a4a';
    if (selectedIngredientIds.includes('redshroom')) return '#4a1a0a';
    if (selectedIngredientIds.includes('goldpetal') || selectedIngredientIds.includes('moonstone')) return '#2a2a0a';
    if (selectedIngredientIds.length) return '#0a2a1a';
    return '#0a1a0a';
  })();

  return (
    <div className="craft-page">
      {/* Active order banner */}
      {state.activeOrder && (
        <div className="active-order-banner">
          <div className="aob-label">현재 제작 중인 주문</div>
          <div className="aob-text">
            <span className="aob-avatar">{state.activeOrder.avatarEmoji}</span>
            <span className="aob-name">{state.activeOrder.name}</span>
            <span className="aob-request">— "{state.activeOrder.request.slice(0, 30)}..."</span>
          </div>
        </div>
      )}

      {/* Cauldron */}
      <div className="cauldron-section">
        <svg viewBox="0 0 160 130" className="cauldron-svg">
          {/* Legs */}
          <rect x="52" y="105" width="8" height="18" rx="3" fill="#1a2a1a" />
          <rect x="100" y="105" width="8" height="18" rx="3" fill="#1a2a1a" />
          {/* Shadow */}
          <ellipse cx="80" cy="122" rx="50" ry="8" fill="#0a100a" opacity="0.4" />
          {/* Body */}
          <path d="M30 55 Q25 105 80 112 Q135 105 130 55 Z" fill="#0d1a0d" />
          {/* Rim */}
          <ellipse cx="80" cy="55" rx="50" ry="14" fill="#162016" stroke="#2a4a2a" strokeWidth="2" />
          {/* Liquid */}
          <ellipse cx="80" cy="60" rx="38" ry="9" fill={liquidColor} style={{ transition: 'fill 0.8s ease' }} />
          {/* Bubbles */}
          {selectedIngredients.length > 0 && (<>
            <circle className="bubble-anim" cx="68" cy="60" r="4" fill={liquidColor} style={{ filter: 'brightness(1.5)' }} />
            <circle className="bubble-anim delay1" cx="85" cy="58" r="3" fill={liquidColor} style={{ filter: 'brightness(1.5)' }} />
            <circle className="bubble-anim delay2" cx="94" cy="62" r="3.5" fill={liquidColor} style={{ filter: 'brightness(1.5)' }} />
          </>)}
          {/* Handle */}
          <rect x="15" y="52" width="18" height="7" rx="3" fill="#1e3a1e" />
          <rect x="127" y="52" width="18" height="7" rx="3" fill="#1e3a1e" />
          {/* Shine */}
          <ellipse cx="65" cy="58" rx="14" ry="4" fill="rgba(255,255,255,0.04)" />
        </svg>
        <div className="cauldron-title">연금술 공방</div>
        {state.activeOrder && (
          <div className="cauldron-subtitle">목표: {state.activeOrder.reqTags.join(' · ')}</div>
        )}
      </div>

      {/* Stat bars */}
      {currentResult && (
        <div className="stat-preview">
          {[
            { key: 'power', label: '효과', val: currentResult.power, color: '#d4a017' },
            { key: 'stability', label: '안정', val: currentResult.stability, color: '#2d7a4a' },
            { key: 'duration', label: '지속', val: currentResult.duration, color: '#2a5aaa' },
            { key: 'chaos', label: '왜곡', val: currentResult.chaos, color: '#8b2a8b' },
          ].map(s => (
            <div key={s.key} className="stat-row">
              <span className="stat-label">{s.label}</span>
              <div className="stat-track">
                <div className="stat-fill" style={{ width: `${(s.val / 20) * 100}%`, background: s.color }} />
              </div>
              <span className="stat-val">{s.val}</span>
            </div>
          ))}
          {comboHint && (
            <div className={`combo-hint ${comboHint.discovered ? 'discovered' : ''}`}>
              {comboHint.text}
            </div>
          )}
        </div>
      )}

      {/* Ingredients */}
      <div className="section-head">
        <span className="sh-line" /><span>재 료</span><span className="sh-line" />
      </div>
      <div className="ingredient-grid">
        {INGREDIENTS.map(ingr => {
          const sel = selectedIngredientIds.includes(ingr.id);
          return (
            <button
              key={ingr.id}
              className={`ingr-btn ${sel ? 'selected' : ''}`}
              onClick={() => dispatch({ type: 'TOGGLE_INGREDIENT', id: ingr.id })}
            >
              {ingr.hasSecret && <div className="secret-dot" />}
              <span className="ingr-icon">{ingr.icon}</span>
              <div className="ingr-name">{ingr.name}</div>
              <div className="ingr-rarity" style={{ color: RARITY_COLORS[ingr.rarity] }}>
                {ingr.rarity === 'legendary' ? '전설' : ingr.rarity === 'rare' ? '희귀' : ingr.rarity === 'uncommon' ? '비범' : '일반'}
              </div>
              <div className="ingr-tags">
                {ingr.tags.slice(0, 2).map(t => {
                  const [bg, fg] = (MTAG_STYLES[t] ?? '#1a1a1a|#aaaaaa').split('|');
                  return <span key={t} className="mtag" style={{ background: bg, color: fg }}>{t}</span>;
                })}
              </div>
              <div className="ingr-price">{ingr.price}G</div>
            </button>
          );
        })}
      </div>

      {/* Mix methods */}
      <div className="section-head">
        <span className="sh-line" /><span>혼합 방식</span><span className="sh-line" />
      </div>
      <div className="mix-grid">
        {MIX_METHODS.map(m => (
          <button
            key={m.id}
            className={`mix-btn ${selectedMixId === m.id ? 'selected' : ''}`}
            onClick={() => dispatch({ type: 'SELECT_MIX', id: m.id })}
          >
            <span className="mix-icon">{m.icon}</span>
            <div className="mix-name">{m.name}</div>
            <div className="mix-desc">{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Spells */}
      <div className="section-head">
        <span className="sh-line" /><span>마법 주문</span><span className="sh-line" />
      </div>
      <div className="spell-grid">
        {SPELLS.map(s => (
          <button
            key={s.id}
            className={`spell-btn ${selectedSpellId === s.id ? 'selected' : ''}`}
            onClick={() => dispatch({ type: 'SELECT_SPELL', id: s.id })}
          >
            <span className="spell-icon">{s.icon}</span>
            <div className="spell-name">{s.name}</div>
            <div className="spell-desc">{s.desc}</div>
            {s.special && <div className="spell-special-badge">특수</div>}
          </button>
        ))}
      </div>

      {/* Brew button */}
      <button className="brew-btn" disabled={!canBrew} onClick={handleBrew}>
        {canBrew ? '⚗ 포션 제조하기' : '재료·방식·주문을 선택하세요'}
      </button>

      <div style={{ height: 80 }} />
      <ResultModal />

      <style jsx>{`
        .craft-page { background: #fff5e1; min-height: 100vh; padding: 0 16px; }
        .active-order-banner {
          background: #a2c28d; border-bottom: 1px solid #2a3a1a;
          padding: 10px 16px; margin: 0 -16px;
        }
        .aob-label { font-size: 9px; letter-spacing: 2px; color: #000000; text-transform: uppercase; font-family: 'Noto Sans KR', sans-serif; margin-bottom: 3px; font-weight: 600; }
        .aob-text { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #000000; font-family: 'Noto Sans KR', sans-serif; }
        .aob-avatar { font-size: 14px; }
        .aob-name { font-weight: 600; }
        .aob-request { color: #000000; font-family: 'Crimson Pro', serif; font-style: italic; }

        .cauldron-section { text-align: center; padding: 20px 0 8px; }
        .cauldron-svg { width: 140px; height: 120px; }
        .cauldron-title { font-family: 'Cinzel Decorative', serif; color: #d4a017; font-size: 13px; letter-spacing: 3px; margin-top: 4px; }
        .cauldron-subtitle { font-size: 11px; color: #5a8a50; margin-top: 3px; font-family: 'Noto Sans KR', sans-serif; }

        @keyframes bubbleUp {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          50% { opacity: 0.9; }
          100% { opacity: 0; transform: translateY(-20px) scale(1.2); }
        }
        :global(.bubble-anim) { animation: bubbleUp 1.8s infinite ease-in-out; }
        :global(.delay1) { animation-delay: 0.6s; }
        :global(.delay2) { animation-delay: 1.2s; }

        .stat-preview {
          background: #e8d2a7; border: 1px solid #2a2a10;
          border-radius: 12px; padding: 12px 14px;
          margin-bottom: 4px;
        }
        .stat-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
        .stat-label { font-size: 10px; color: #000000; width: 28px; text-align: right; font-family: 'Noto Sans KR', sans-serif; letter-spacing: 0.5px; }
        .stat-track { flex: 1; height: 5px; background: #fff1c0; border-radius: 3px; overflow: hidden; }
        .stat-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
        .stat-val { font-size: 10px; color: #000000; width: 20px; text-align: right; font-family: 'Noto Sans KR', sans-serif; }
        .combo-hint {
          margin-top: 8px; padding: 8px 10px;
          background: #ffffff; border: 1px solid #3a1a4a;
          border-radius: 8px; font-size: 11px; color: #000000;
          text-align: center; font-family: 'Crimson Pro', serif; font-style: italic;
          line-height: 1.5;
        }
        .combo-hint.discovered {
          background: #2a0a1a; border-color: #d4a017; color: #d4a017;
          animation: glow 2s infinite;
        }
        @keyframes glow {
          0%,100% { box-shadow: 0 0 0 0 rgba(212,160,23,0.2); }
          50% { box-shadow: 0 0 10px 3px rgba(212,160,23,0.15); }
        }

        .section-head {
          display: flex; align-items: center; gap: 10px;
          font-size: 11px; letter-spacing: 3px; color: #5a5a3a;
          text-transform: uppercase; text-align: center;
          margin: 18px 0 12px;
          font-family: 'Noto Sans KR', sans-serif; font-weight: 500;
        }
        .sh-line { flex: 1; height: 1px; background: #2a2a14; }

        .ingredient-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .ingr-btn {
          background: #ffeec2; border: 1px solid #d6af71;
          border-radius: 12px; padding: 10px 6px;
          cursor: pointer; text-align: center;
          transition: all 0.15s; position: relative;
          font-family: 'Noto Sans KR', sans-serif;
        }
        .ingr-btn:active { transform: scale(0.95); }
        .ingr-btn.selected { border-color: #d4a017; background: #ebd2a4; box-shadow: 0 0 0 1px #d4a01750; }
        .secret-dot {
          position: absolute; top: 6px; right: 7px;
          width: 6px; height: 6px; border-radius: 50%;
          background: #7b3fa0;
        }
        .ingr-icon { font-size: 24px; display: block; margin-bottom: 4px; }
        .ingr-name { font-size: 10px; color: #c8b880; margin-bottom: 2px; line-height: 1.3; }
        .ingr-rarity { font-size: 9px; margin-bottom: 4px; font-weight: 600; letter-spacing: 0.3px; }
        .ingr-tags { display: flex; flex-wrap: wrap; gap: 2px; justify-content: center; margin-bottom: 4px; }
        .mtag { font-size: 8px; padding: 1px 4px; border-radius: 6px; }
        .ingr-price { font-size: 9px; color: #6a5a3a; }

        .mix-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
        .mix-btn {
          background: #ffeec2; border: 1px solid #1a2a1e;
          border-radius: 12px; padding: 12px 8px;
          cursor: pointer; text-align: center;
          transition: all 0.15s;
          font-family: 'Noto Sans KR', sans-serif;
        }
        .mix-btn.selected { border-color: #1a8a5a; background: #0a2a1a; box-shadow: 0 0 0 1px #1a8a5a50; }
        .mix-icon { font-size: 22px; display: block; margin-bottom: 5px; }
        .mix-name { font-size: 12px; color: #c8b880; font-weight: 600; margin-bottom: 3px; }
        .mix-desc { font-size: 10px; color: #5a6a58; line-height: 1.4; }

        .spell-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
        .spell-btn {
          background: #ffeec2; border: 1px solid #2a1a30;
          border-radius: 12px; padding: 12px 8px;
          cursor: pointer; text-align: center;
          transition: all 0.15s; position: relative;
          font-family: 'Noto Sans KR', sans-serif;
        }
        .spell-btn.selected { border-color: #7b3fa0; background: #1e0a2a; box-shadow: 0 0 0 1px #7b3fa050; }
        .spell-icon { font-size: 22px; display: block; margin-bottom: 5px; }
        .spell-name { font-size: 12px; color: #c8b880; font-weight: 600; margin-bottom: 3px; }
        .spell-desc { font-size: 10px; color: #6a5a70; line-height: 1.4; }
        .spell-special-badge {
          position: absolute; top: 6px; right: 6px;
          font-size: 8px; background: #3a0a4a; color: #c080e0;
          padding: 1px 5px; border-radius: 6px; font-weight: 600;
        }

        .brew-btn {
          width: 100%; padding: 16px; margin-top: 16px;
          background: #1a1208; color: #d4a017;
          border: 1px solid #3a2a10; border-radius: 12px;
          font-size: 14px; font-weight: 700; letter-spacing: 1px;
          font-family: 'Noto Sans KR', sans-serif;
          cursor: pointer; transition: all 0.15s;
        }
        .brew-btn:not(:disabled) { background: linear-gradient(135deg, #2a1a08 0%, #3a2a10 50%, #2a1a08 100%); }
        .brew-btn:not(:disabled):active { opacity: 0.85; transform: scale(0.99); }
        .brew-btn:disabled { opacity: 0.35; cursor: not-allowed; color: #6a5a3a; }
      `}</style>
    </div>
  );
}