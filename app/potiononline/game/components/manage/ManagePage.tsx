'use client';
import { useGame } from '../../lib/gameStore';
import { INGREDIENTS, SECRET_COMBOS } from '../../lib/gameData';
import { getLevelProgress } from '../../systems/progressionSystem';

export default function ManagePage() {
  const { state, dispatch } = useGame();
  const progress = getLevelProgress(state.game.shopXp);

  return (
    <div className="manage-page">
      <section className="level-card">
        <div className="eyebrow">SHOP GROWTH</div>
        <div className="level-row">
          <div>
            <div className="level">Shop Lv.{progress.level}</div>
            <div className="sub">엔딩 없이 계속 성장하는 포션샵</div>
          </div>
          <div className="xp">{state.game.shopXp} XP</div>
        </div>
        <div className="track"><div className="fill" style={{ width: `${progress.ratio * 100}%` }} /></div>
        <div className="next">다음 성장: {progress.nextLabel}</div>
      </section>

      <section className="mini-grid">
        <div className="mini"><b>{state.game.consultationCredits}</b><span>상담 가능</span></div>
        <div className="mini"><b>{state.game.unlockedRecipes.length}</b><span>비밀 레시피</span></div>
        <div className="mini"><b>{state.game.totalShipped}</b><span>누적 배송</span></div>
      </section>

      <div className="section-title">재료 창고 · 도매 구매</div>
      <div className="inventory-list">
        {INGREDIENTS.map(i => {
          const stock = state.game.inventory[i.id] ?? 0;
          const canBuy = state.game.gold >= i.price;
          return (
            <div className="inventory-row" key={i.id}>
              <div className="icon">{i.icon}</div>
              <div className="body">
                <div className="name">{i.name}</div>
                <div className="desc">재고 {stock} · {i.rarity}</div>
              </div>
              <button disabled={!canBuy} onClick={() => dispatch({ type: 'BUY_INGREDIENT', ingredientId: i.id })}>+1 · {i.price}G</button>
            </div>
          );
        })}
      </div>

      <div className="section-title">레시피 도감</div>
      <div className="recipe-grid">
        {SECRET_COMBOS.map(recipe => {
          const unlocked = state.game.unlockedRecipes.includes(recipe.name);
          return (
            <div className={`recipe ${unlocked ? 'open' : ''}`} key={recipe.name}>
              <div className="recipe-name">{unlocked ? recipe.name : '???'}</div>
              <div className="recipe-text">{unlocked ? recipe.flavorText : '재료를 직접 조합해 발견하세요.'}</div>
            </div>
          );
        })}
      </div>
      <div style={{ height: 90 }} />

      <style jsx>{`
        .manage-page { min-height:100vh; background:#f5f2ec; padding:16px; color:#1a1208; }
        .level-card { background:#1a1208; color:#d4a017; border-radius:16px; padding:18px; margin-bottom:12px; }
        .eyebrow { font-size:9px; letter-spacing:2px; opacity:.65; margin-bottom:8px; }
        .level-row { display:flex; justify-content:space-between; gap:12px; align-items:flex-start; }
        .level { font-size:22px; font-weight:800; }
        .sub { font-size:11px; color:#8d7a52; margin-top:3px; }
        .xp { font-size:12px; font-weight:700; white-space:nowrap; }
        .track { height:7px; background:#342712; border-radius:10px; overflow:hidden; margin-top:14px; }
        .fill { height:100%; background:#d4a017; transition:width .3s ease; }
        .next { font-size:10px; color:#9e8754; margin-top:7px; }
        .mini-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:18px; }
        .mini { background:#fff; border:1px solid #ebe4d7; border-radius:12px; padding:12px 8px; text-align:center; display:flex; flex-direction:column; gap:2px; }
        .mini b { font-size:18px; }
        .mini span { font-size:10px; color:#8e8371; }
        .section-title { font-size:12px; font-weight:800; margin:16px 2px 9px; }
        .inventory-list { display:flex; flex-direction:column; gap:7px; }
        .inventory-row { display:flex; align-items:center; gap:10px; background:#fff; border:1px solid #ebe4d7; border-radius:12px; padding:10px; }
        .icon { font-size:26px; width:34px; text-align:center; }
        .body { flex:1; min-width:0; }
        .name { font-size:13px; font-weight:700; }
        .desc { font-size:10px; color:#9a8d78; margin-top:2px; }
        button { border:0; background:#1a1208; color:#d4a017; font-size:10px; font-weight:700; border-radius:9px; padding:9px 10px; }
        button:disabled { opacity:.3; }
        .recipe-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .recipe { min-height:82px; padding:11px; border-radius:12px; border:1px dashed #cfc6b8; background:#eee9e0; }
        .recipe.open { border-style:solid; background:#fff; border-color:#e0d3af; }
        .recipe-name { font-size:12px; font-weight:800; margin-bottom:5px; }
        .recipe-text { font-size:10px; line-height:1.45; color:#8a7d69; }
      `}</style>
    </div>
  );
}
