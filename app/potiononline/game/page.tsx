'use client';

import { GameProvider, useGame } from './lib/gameStore';
import TopHeader from './components/TopHeader';
import BottomNav from './components/BottomNav';
import HomePage from './components/shop/HomePage';
import ShopPage from './components/shop/ShopPage';
import CraftPage from './components/craft/CraftPage';
import ReviewsPage from './components/craft/ReviewsPage';
import ManagePage from './components/manage/ManagePage';
import MyPage from './components/manage/MyPage';

function GameUI() {
  const { state } = useGame();
  return (
    <div className="potion-scroll">
      <TopHeader />
      <main>
        <div style={{ display: state.tab === 'home' ? 'block' : 'none' }}><HomePage /></div>
        <div style={{ display: state.tab === 'orders' ? 'block' : 'none' }}><ShopPage /></div>
        <div style={{ display: state.tab === 'craft' ? 'block' : 'none' }}><CraftPage /></div>
        <div style={{ display: state.tab === 'products' ? 'block' : 'none' }}><ManagePage /></div>
        <div style={{ display: state.tab === 'customers' ? 'block' : 'none' }}><ReviewsPage /></div>
        <div style={{ display: state.tab === 'my' ? 'block' : 'none' }}><MyPage /></div>
      </main>
      {state.tab !== 'craft' && <BottomNav />}
    </div>
  );
}

export default function PotionPage() {
  return <GameProvider><GameUI /></GameProvider>;
}
