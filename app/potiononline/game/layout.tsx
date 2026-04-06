import type { Metadata } from 'next';
import { Cinzel_Decorative, Crimson_Pro, Noto_Sans_KR } from 'next/font/google';
import './potion.css';

/*
  이 layout.tsx는 app/games/potion/ 에만 적용되는 게임 전용 레이아웃입니다.
  메인 사이트의 app/layout.tsx와 완전히 분리되어 있으며,
  폰트·CSS·테마가 이 라우트 세그먼트 안에서만 활성화됩니다.
*/

const cinzel = Cinzel_Decorative({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-cinzel',
  display: 'swap',
});

const crimson = Crimson_Pro({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-crimson',
  display: 'swap',
});

const notoKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Potion Online — 마야의 포션 쇼핑몰',
  description: '포션을 제작하고 고객의 욕망을 해석하는 연금술 경영 시뮬레이션',
};

export default function PotionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /*
      레이아웃 격리를 위해 root html/body를 다시 렌더링하지 않고
      div 래퍼로 게임 전용 폰트 변수와 스타일만 스코핑합니다.
      메인 사이트 nav/footer는 이 div 안에 포함되지 않습니다.
    */
    <div
      className={`potion-root ${cinzel.variable} ${crimson.variable} ${notoKR.variable}`}
    >
      {children}
    </div>
  );
}