"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const MENU_ITEMS = [
  { label: "소개",   href: "/about" },
  { label: "캐릭터", href: "/characters" },
  { label: "스토리", href: "/story" },
  { label: "SNS",    href: "/follow" },
];

const REVIEWS = [
  { stars: "★★★★★", user: "달빛_마녀덕후", item: "수면 포션 / 라벤더향", text: "진짜 잠을 잘 잘 수 있게 됐어요... 꿈에서 공중정원을 봤는데 묘하게 현실같았습니다", date: "3일 전" },
  { stars: "★★★★☆", user: "고양이집사ver2",  item: "집중력 업 포션 / 민트",  text: "시험기간에 주문했는데 배송이 좀 늦었어요. 그래도 효과는 확실합니다. 재구매의사 있음", date: "1주 전" },
  { stars: "★★★★★", user: "익명의구매자",   item: "기억 지우개 포션 / 소량", text: "...효과 있었습니다. 별점 5개.", date: "2주 전" },
  { stars: "★☆☆☆☆", user: "화난고객_ㅎㅎ",   item: "행운 포션 / 골드라벨",   text: "이거 마시고 오히려 더 안 풀리는 것 같은데요? 환불 요청드립니다", date: "3주 전" },
  { stars: "★★★★★", user: "마법학교2학년",   item: "수면 포션 / 라벤더향",  text: "기숙사 룸메가 코를 너무 심하게 골아서 샀는데 룸메한테 몰래 먹였더니 효과 만점이었습니다", date: "1달 전" },
];

const PRODUCTS = [
  { name: "수면 포션",   sub: "라벤더향 · 30ml",   price: "₩ ??,???", sym: "Z" },
  { name: "집중력 업",   sub: "민트향 · 15ml",     price: "₩ ??,???", sym: "↑" },
  { name: "기억 지우개", sub: "소량 · 주의 필요",   price: "₩ ??,???", sym: "∅" },
  { name: "행운 포션",   sub: "골드라벨 · 한정",   price: "₩ ??,???", sym: "★" },
];

type Phase = "loading" | "glitch" | "shop" | "done";

const LOADING_MSGS = [
  "상점 연결 중...",
  "마법진 초기화 중...",
  "재고 확인 중...",
  "포션 품질 검사 중...",
  "문 열기 준비 완료!",
];

export default function PotionOnlinePage() {
  const [phase, setPhase]       = useState<Phase>("loading");
  const [loadStep, setLoadStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [tick, setTick]         = useState(0);

  // 로딩 메시지
  useEffect(() => {
    if (phase !== "loading") return;
    const iv = setInterval(() => setLoadStep(p => Math.min(p + 1, LOADING_MSGS.length - 1)), 420);
    return () => clearInterval(iv);
  }, [phase]);

  // 인트로 타이밍
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("glitch"), 2400);
    const t2 = setTimeout(() => setPhase("shop"),   2900);
    const t3 = setTimeout(() => setPhase("done"),   3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // 리뷰 자동 넘김
  useEffect(() => {
    if (phase !== "done") return;
    const iv = setInterval(() => setReviewIdx(p => (p + 1) % REVIEWS.length), 3500);
    return () => clearInterval(iv);
  }, [phase]);

  // 깜빡이 커서용 tick
  useEffect(() => {
    const iv = setInterval(() => setTick(p => p + 1), 600);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const showMain = phase === "shop" || phase === "done";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --black:   #0A0A0A;
          --white:   #F5F0EB;
          --pink:    #FF2D78;
          --pink-lo: rgba(255,45,120,0.12);
          --pink-md: rgba(255,45,120,0.35);
          --cyan:    #00FFD1;
          --cyan-lo: rgba(0,255,209,0.08);
          --yellow:  #FFE14D;
          --gray:    #1A1A1A;
          --gray2:   #2A2A2A;
          --muted:   #666;
          --border:  rgba(255,45,120,0.25);
        }

        .root {
          width: 100%; max-width: 420px; height: 100dvh;
          margin: 0 auto; position: relative; overflow: hidden;
          background: var(--black);
          font-family: 'Space Grotesk', sans-serif;
          color: var(--white);
        }

        /* ─── SCANLINE overlay ─── */
        .root::before {
          content: '';
          position: fixed; inset: 0; z-index: 999; pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,0,0,0.08) 3px,
            rgba(0,0,0,0.08) 4px
          );
        }

        /* ─── INTRO ─── */
        .intro {
          position: absolute; inset: 0; z-index: 80;
          background: var(--black);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 32px;
          transition: opacity 0.4s ease;
        }
        .intro.hidden { opacity: 0; pointer-events: none; }

        .intro-logo {
          text-align: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 32px;
          color: var(--white);
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .intro-logo .accent { color: var(--pink); }
        .intro-logo .sub {
          display: block; margin-top: 8px;
          font-family: 'Space Mono', monospace;
          font-size: 10px; font-weight: 400;
          color: var(--cyan); letter-spacing: 0.3em;
          text-transform: uppercase;
        }

        .progress-wrap { width: 200px; }
        .progress-track {
          width: 100%; height: 1px;
          background: var(--gray2); position: relative;
        }
        .progress-fill {
          height: 100%; background: var(--pink);
          transition: width 0.35s ease;
          box-shadow: 0 0 8px var(--pink);
        }
        .progress-label {
          display: flex; justify-content: space-between;
          margin-top: 6px;
          font-family: 'Space Mono', monospace;
          font-size: 9px; color: var(--muted); letter-spacing: 0.1em;
        }

        .loading-msg {
          font-family: 'Space Mono', monospace;
          font-size: 11px; color: var(--cyan); letter-spacing: 0.08em;
          min-height: 18px;
        }

        @keyframes glitch {
          0%   { transform: translate(0) skewX(0); filter: none; }
          15%  { transform: translate(-4px, 2px) skewX(-3deg); filter: hue-rotate(90deg) brightness(2); }
          30%  { transform: translate(4px, -2px) skewX(3deg); filter: hue-rotate(200deg) brightness(1.5); }
          50%  { transform: translate(-2px, 1px) skewX(0); filter: invert(0.2); }
          70%  { transform: translate(3px, -1px) skewX(-1deg); filter: hue-rotate(300deg); }
          100% { transform: translate(0) skewX(0); filter: none; }
        }
        .glitch { animation: glitch 0.5s steps(3) forwards; }

        /* ─── MAIN ─── */
        .main {
          position: absolute; inset: 0; z-index: 1;
          display: flex; flex-direction: column;
          opacity: 0; transition: opacity 0.6s ease 0.1s;
          overflow-y: auto; scrollbar-width: none;
        }
        .main::-webkit-scrollbar { display: none; }
        .main.visible { opacity: 1; }

        /* ─── NAV ─── */
        .nav {
          background: var(--black);
          border-bottom: 1px solid var(--border);
          padding: 14px 18px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 20; flex-shrink: 0;
        }
        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 15px;
          color: var(--white); letter-spacing: -0.02em;
        }
        .nav-logo em { color: var(--pink); font-style: normal; }
        .nav-right { display: flex; align-items: center; gap: 12px; }
        .nav-tag {
          font-family: 'Space Mono', monospace;
          font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase;
          border: 1px solid var(--pink); color: var(--pink);
          padding: 3px 8px; border-radius: 2px;
        }
        .hamburger {
          display: flex; flex-direction: column; gap: 5px;
          cursor: pointer; background: none; border: none; padding: 4px;
          -webkit-tap-highlight-color: transparent;
        }
        .hamburger span {
          display: block; width: 22px; height: 1px;
          background: var(--white); border-radius: 0;
          transition: background 0.2s;
        }
        .hamburger:active span { background: var(--pink); }

        /* ─── HERO ─── */
        .hero {
          padding: 40px 20px 36px;
          position: relative; overflow: hidden; flex-shrink: 0;
          border-bottom: 1px solid var(--border);
        }

        /* grid bg pattern */
        .hero::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,45,120,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,45,120,0.06) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Space Mono', monospace;
          font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--cyan); margin-bottom: 20px; position: relative; z-index: 1;
        }
        .hero-eyebrow::before {
          content: '▶';
          font-size: 7px; color: var(--pink);
        }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 42px; line-height: 0.95;
          color: var(--white); letter-spacing: -0.03em;
          position: relative; z-index: 1; margin-bottom: 24px;
        }
        .hero-title .line-pink { color: var(--pink); display: block; }
        .hero-title .line-outline {
          display: block;
          -webkit-text-stroke: 1px rgba(255,255,255,0.3);
          color: transparent;
        }

        .hero-desc {
          font-size: 13px; color: rgba(245,240,235,0.55);
          line-height: 1.8; margin-bottom: 20px;
          position: relative; z-index: 1;
        }

        /* 개발중 상태 칩 */
        .status-chip {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid var(--border);
          border-radius: 2px; padding: 8px 14px;
          position: relative; z-index: 1;
          font-family: 'Space Mono', monospace;
          font-size: 10px; color: rgba(245,240,235,0.6);
          letter-spacing: 0.08em;
        }
        .status-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--cyan);
          animation: blink 1.2s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
        .cursor-blink { opacity: 1; }
        .cursor-blink.off { opacity: 0; }

        /* ─── SECTION ─── */
        .section { padding: 28px 20px; flex-shrink: 0; }
        .section + .section { border-top: 1px solid rgba(255,45,120,0.12); }

        .sec-label {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Space Mono', monospace;
          font-size: 8px; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--pink); margin-bottom: 18px;
        }
        .sec-label::after {
          content: ''; flex: 1; height: 1px;
          background: var(--border);
        }

        /* ─── SHOP GRID ─── */
        .product-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
        }
        .product-card {
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 4px; padding: 16px 14px 14px;
          position: relative; overflow: hidden;
          cursor: default;
          transition: border-color 0.2s;
        }
        .product-card:active { border-color: var(--pink); }
        .product-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--pink), transparent);
          opacity: 0; transition: opacity 0.2s;
        }
        .product-card:active::before { opacity: 1; }

        .product-name {
          font-size: 12px; font-weight: 600;
          color: var(--white); margin-bottom: 3px;
          letter-spacing: -0.01em;
        }
        .product-sub {
          font-family: 'Space Mono', monospace;
          font-size: 9px; color: var(--muted);
          letter-spacing: 0.05em; margin-bottom: 10px;
        }
        .product-price {
          font-family: 'Space Mono', monospace;
          font-size: 10px; color: var(--pink); letter-spacing: 0.08em;
        }
        .product-soon {
          position: absolute; top: 10px; right: 10px;
          font-family: 'Space Mono', monospace;
          font-size: 7px; letter-spacing: 0.15em;
          color: var(--cyan); border: 1px solid rgba(0,255,209,0.3);
          padding: 2px 6px; border-radius: 1px;
        }

        /* ─── REVIEW ─── */
        .review-box {
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 4px; padding: 20px;
          position: relative; overflow: hidden; min-height: 160px;
        }
        .review-box::before {
          content: '"';
          position: absolute; top: -10px; right: 14px;
          font-family: 'Syne', sans-serif; font-size: 80px; font-weight: 800;
          color: var(--pink-lo); line-height: 1; pointer-events: none;
          user-select: none;
        }
        .review-slot {
          position: absolute; inset: 20px;
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .review-slot.active { opacity: 1; transform: none; }
        .review-slot.hidden { opacity: 0; transform: translateY(6px); pointer-events: none; }

        .review-stars { font-size: 11px; color: var(--pink); margin-bottom: 6px; letter-spacing: 2px; }
        .review-item-name {
          font-family: 'Space Mono', monospace;
          font-size: 8px; color: var(--cyan); letter-spacing: 0.15em;
          text-transform: uppercase; margin-bottom: 10px;
        }
        .review-text {
          font-size: 12px; color: rgba(245,240,235,0.75);
          line-height: 1.75; margin-bottom: 12px;
        }
        .review-meta {
          display: flex; justify-content: space-between; align-items: center;
        }
        .review-user {
          font-family: 'Space Mono', monospace;
          font-size: 9px; color: var(--muted);
        }
        .review-date {
          font-family: 'Space Mono', monospace;
          font-size: 8px; color: rgba(102,102,102,0.5);
        }
        .review-dots {
          display: flex; gap: 6px; justify-content: center; margin-top: 12px;
        }
        .rdot {
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--gray2); border: 1px solid var(--border);
          cursor: pointer; transition: background 0.2s, border-color 0.2s;
          padding: 0;
        }
        .rdot.on { background: var(--pink); border-color: var(--pink); }

        /* ─── STORY BLOCK ─── */
        .story-block {
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 4px; padding: 24px 20px;
          position: relative; overflow: hidden;
        }
        .story-block::after {
          content: '⚗';
          position: absolute; right: -8px; bottom: -12px;
          font-size: 90px; opacity: 0.04;
          user-select: none; pointer-events: none;
        }
        .story-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 8px; letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--pink); margin-bottom: 12px;
        }
        .story-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 22px; line-height: 1.1;
          color: var(--white); letter-spacing: -0.02em; margin-bottom: 12px;
        }
        .story-desc {
          font-size: 12px; color: rgba(245,240,235,0.45); line-height: 1.85;
        }

        /* ending teaser */
        .endings-row {
          display: flex; gap: 8px; margin-top: 18px; flex-wrap: wrap;
        }
        .ending-pill {
          font-family: 'Space Mono', monospace;
          font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 5px 10px;
          border-radius: 2px; border: 1px solid;
        }
        .ending-pill.good   { border-color: rgba(0,255,209,0.3); color: var(--cyan); }
        .ending-pill.bad    { border-color: rgba(255,45,120,0.3); color: var(--pink); }
        .ending-pill.secret { border-color: rgba(255,225,77,0.3); color: var(--yellow); }
        .ending-pill.hidden-end {
          border-color: rgba(255,255,255,0.08); color: rgba(255,255,255,0.15);
          cursor: default;
          user-select: none;
        }

        /* ─── CHARACTER TEASER ─── */
        .char-teaser {
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 4px; padding: 20px;
          display: flex; gap: 16px; align-items: flex-start;
        }
        .char-avatar {
          width: 56px; height: 56px; flex-shrink: 0;
          border: 1px solid var(--border); border-radius: 4px;
          background: var(--black);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800;
          color: var(--pink);
          position: relative; overflow: hidden;
        }
        .char-avatar::after {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            -45deg,
            transparent 0px, transparent 3px,
            rgba(255,45,120,0.05) 3px, rgba(255,45,120,0.05) 4px
          );
        }
        .char-info { flex: 1; min-width: 0; }
        .char-name {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 18px; color: var(--white); letter-spacing: -0.02em;
          margin-bottom: 3px;
        }
        .char-role {
          font-family: 'Space Mono', monospace;
          font-size: 8px; color: var(--pink); letter-spacing: 0.15em;
          text-transform: uppercase; margin-bottom: 10px;
        }
        .char-desc {
          font-size: 12px; color: rgba(245,240,235,0.5); line-height: 1.75;
        }

        /* ─── STUDIO ─── */
        .studio-box {
          background: transparent;
          border: 1px solid rgba(255,45,120,0.15);
          border-radius: 4px; padding: 18px 20px;
        }
        .studio-text {
          font-size: 12px; color: rgba(245,240,235,0.4); line-height: 1.85;
        }
        .studio-text strong { color: rgba(245,240,235,0.75); font-weight: 600; }
        .studio-link {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 14px;
          font-family: 'Space Mono', monospace;
          font-size: 9px; color: var(--pink); letter-spacing: 0.1em;
          text-decoration: none;
        }

        /* ─── FOOTER ─── */
        .footer {
          background: var(--gray); border-top: 1px solid var(--border);
          padding: 28px 20px; text-align: center; flex-shrink: 0;
        }
        .footer-logo {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 20px; color: var(--white);
          letter-spacing: -0.02em; margin-bottom: 4px;
        }
        .footer-logo em { color: var(--pink); font-style: normal; }
        .footer-sub {
          font-family: 'Space Mono', monospace;
          font-size: 8px; color: var(--muted); letter-spacing: 0.2em;
          text-transform: uppercase; margin-bottom: 20px;
        }
        .footer-links {
          display: flex; justify-content: center; gap: 24px;
          flex-wrap: wrap; margin-bottom: 20px;
        }
        .footer-link {
          font-family: 'Space Mono', monospace;
          font-size: 9px; color: rgba(245,240,235,0.25);
          text-decoration: none; letter-spacing: 0.12em;
          -webkit-tap-highlight-color: transparent;
          transition: color 0.15s;
        }
        .footer-link:active { color: var(--pink); }
        .footer-copy {
          font-family: 'Space Mono', monospace;
          font-size: 8px; color: rgba(245,240,235,0.12); letter-spacing: 0.1em;
        }

        /* ─── SIDE MENU ─── */
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .menu-overlay {
          position: fixed; inset: 0; z-index: 89;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(3px);
        }
        .menu {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: 72%; max-width: 280px; z-index: 90;
          background: var(--gray);
          border-left: 1px solid var(--border);
          display: flex; flex-direction: column;
          padding: 56px 24px 28px;
          animation: slideIn 0.28s cubic-bezier(.22,1,.36,1);
        }
        .menu-close {
          position: absolute; top: 16px; right: 18px;
          font-family: 'Space Mono', monospace;
          font-size: 12px; color: var(--muted); cursor: pointer;
          background: none; border: none; letter-spacing: 0.05em;
          -webkit-tap-highlight-color: transparent;
        }
        .menu-logo {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 14px; color: var(--white);
          margin-bottom: 28px; padding-bottom: 14px;
          border-bottom: 1px solid var(--border);
          letter-spacing: -0.02em;
        }
        .menu-logo em { color: var(--pink); font-style: normal; }
        .menu-item {
          padding: 15px 0;
          border-bottom: 1px solid rgba(255,45,120,0.08);
          font-size: 14px; font-weight: 500; color: var(--white);
          text-decoration: none; display: block; letter-spacing: -0.01em;
          -webkit-tap-highlight-color: transparent;
        }
        .menu-item:active { color: var(--pink); }
        .menu-footer {
          margin-top: auto;
          font-family: 'Space Mono', monospace;
          font-size: 8px; color: var(--muted);
          letter-spacing: 0.15em; text-transform: uppercase;
        }

        /* ─── ANIM ─── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fu { opacity: 0; animation: fadeUp 0.5s ease forwards; }
      `}</style>

      <div className="root">

        {/* ══ INTRO ══ */}
        <div className={`intro${phase === "glitch" ? " glitch" : ""}${showMain ? " hidden" : ""}`}>
          <div className="intro-logo">
            Potion<span className="accent">.</span>Online
            <span className="sub">by Studio Forge</span>
          </div>

          <div className="progress-wrap">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${((loadStep + 1) / LOADING_MSGS.length) * 100}%` }}
              />
            </div>
            <div className="progress-label">
              <span>{LOADING_MSGS[loadStep]}</span>
              <span>{Math.round(((loadStep + 1) / LOADING_MSGS.length) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* ══ MAIN ══ */}
        <div className={`main${showMain ? " visible" : ""}`}>
          {/* 네비 */}
          <nav className="nav">
            <div className="nav-logo">Potion<em>.</em>Online</div>
            <div className="nav-right">
              <span className="nav-tag">Dev</span>
              <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="메뉴">
                <span /><span /><span />
              </button>
            </div>
          </nav>

          {/* ── HERO ── */}
          <div className="hero fu" style={{ animationDelay: "0.05s" }}>
            <div className="hero-eyebrow">Indie Game · IP Landing</div>

            <h1 className="hero-title">
              <span className="line-pink">마녀의</span>
              포션<br />공방
              <span className="line-outline">온라인.</span>
            </h1>

            <p className="hero-desc">
              포션을 만들고, 포장하고, 배송하세요.<br />
              리뷰는 달콤할 수도, 쓴맛일 수도.<br />
              가끔은 보낸 게 큰일을 만들지도 모릅니다.
            </p>

            <div className="status-chip">
              <div className="status-dot" />
              Studio Forge 개발 중
              <span className={`cursor-blink${tick % 2 === 0 ? "" : " off"}`}>_</span>
            </div>
          </div>

          {/* ── 상품 ── */}
          <div className="section fu" style={{ animationDelay: "0.15s" }}>
            <div className="sec-label">Shop Preview</div>
            <div className="product-grid">
              {PRODUCTS.map((p, i) => (
                <div key={i} className="product-card">
                  <div className="product-name">{p.name}</div>
                  <div className="product-sub">{p.sub}</div>
                  <div className="product-price">{p.price}</div>
                  <div className="product-soon">SOON</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 캐릭터 ── */}
          <div className="section fu" style={{ animationDelay: "0.2s" }}>
            <div className="sec-label">Character</div>
            <div className="char-teaser">
              <div className="char-avatar">?</div>
              <div className="char-info">
                <div className="char-name">???</div>
                <div className="char-role">견습 마녀 · 공방 운영자</div>
                <p className="char-desc">
                  작은 공방을 물려받은 견습 마녀. 마법 실력은 영 미덥지 않지만,
                  포션 레시피만큼은 자신 있다. 오늘도 주문 알림이 울린다.
                </p>
              </div>
            </div>
          </div>

          {/* ── 리뷰 ── */}
          <div className="section fu" style={{ animationDelay: "0.25s" }}>
            <div className="sec-label">Customer Reviews</div>
            <div className="review-box">
              {REVIEWS.map((r, i) => (
                <div key={i} className={`review-slot${i === reviewIdx ? " active" : " hidden"}`}>
                  <div className="review-stars">{r.stars}</div>
                  <div className="review-item-name">{r.item}</div>
                  <p className="review-text">"{r.text}"</p>
                  <div className="review-meta">
                    <span className="review-user">@{r.user}</span>
                    <span className="review-date">{r.date}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="review-dots">
              {REVIEWS.map((_, i) => (
                <button key={i} className={`rdot${i === reviewIdx ? " on" : ""}`} onClick={() => setReviewIdx(i)} />
              ))}
            </div>
          </div>

          {/* ── 스토리 ── */}
          <div className="section fu" style={{ animationDelay: "0.3s" }}>
            <div className="sec-label">Story</div>
            <div className="story-block">
              <div className="story-eyebrow">▶ Multiple Endings</div>
              <h3 className="story-title">포션 하나에도<br />이야기가 있다</h3>
              <p className="story-desc">
                단골 손님의 리뷰 뒤 숨겨진 사연, 악성 리뷰어의 정체,
                공방을 물려준 스승의 비밀. 포션을 팔다 보면 어느새
                이야기 속 깊이 들어와 있을지도.
              </p>
              <div className="endings-row">
                <span className="ending-pill good">해피 엔딩</span>
                <span className="ending-pill bad">파산 엔딩</span>
                <span className="ending-pill secret">???</span>
                <span className="ending-pill hidden-end">█████</span>
              </div>
            </div>
          </div>

          {/* ── 스튜디오 ── */}
          <div className="section fu" style={{ animationDelay: "0.35s" }}>
            <div className="sec-label">Studio</div>
            <div className="studio-box">
              <p className="studio-text">
                <strong>Studio Forge</strong>의 두 번째 IP.<br/>
                현재 기획 개발 중이며, 자세한 소식은 SNS에서 먼저 공개됩니다.
              </p>
              <Link href="https://studiof-ten.vercel.app" className="studio-link">
                → Studio Forge 메인 사이트
              </Link>
            </div>
          </div>

          {/* 푸터 */}
          <footer className="footer">
            <div className="footer-logo">Potion<em>.</em>Online</div>
            <div className="footer-sub">by Studio Forge · 개발 중</div>
            <div className="footer-links">
              {MENU_ITEMS.map(item => (
                <Link key={item.href} href={item.href} className="footer-link">{item.label}</Link>
              ))}
            </div>
            <div className="footer-copy">© 2025 Studio Forge. All rights reserved.</div>
          </footer>

        </div>

        {/* ══ 사이드 메뉴 ══ */}
        {menuOpen && (
          <>
            <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
            <div className="menu">
              <button className="menu-close" onClick={() => setMenuOpen(false)}>[닫기]</button>
              <div className="menu-logo">Potion<em>.</em>Online</div>
              {MENU_ITEMS.map(item => (
                <Link key={item.href} href={item.href} className="menu-item" onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <div className="menu-footer">Studio Forge · 2025</div>
            </div>
          </>
        )}

      </div>
    </>
  );
}