// app/potiononline/game/page.tsx

'use client';

/*
  경로: /games/potion
  메인 사이트 레이아웃과 완전히 분리된 게임 전용 페이지입니다.
  app/games/potion/layout.tsx 의 PotionLayout 안에서 렌더링됩니다.
*/

import { GameProvider, useGame } from './lib/gameStore';
import TopHeader from './components/TopHeader';
import BottomNav from './components/BottomNav';
import ShopPage from './components/shop/ShopPage';
import CraftPage from './components/craft/CraftPage';
import ReviewsPage from './components/craft/ReviewsPage';

function GameUI() {
  const { state } = useGame();

  return (
    <div className="potion-scroll">
      <TopHeader />

      <main>
        {/* display:none으로 탭 전환 — unmount 없이 state 유지 */}
        <div style={{ display: state.tab === 'orders' ? 'block' : 'none' }}>
          <ShopPage />
        </div>
        <div style={{ display: state.tab === 'craft' ? 'block' : 'none' }}>
          <CraftPage />
        </div>
        <div style={{ display: state.tab === 'reviews' ? 'block' : 'none' }}>
          <ReviewsPage />
        </div>
      </main>

      {/* 하단 네비게이션 — safe area 포함 */}
      <BottomNav />
    </div>
  );
}

export default function PotionPage() {
  return (
    <GameProvider>
      <GameUI />
    </GameProvider>
  );
}