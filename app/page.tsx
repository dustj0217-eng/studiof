"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// ─── 이미지 placeholder ────────────────────────────────────────────────────
function ImageSlot({
  label,
  className = "",
  aspect = "aspect-video",
}: {
  label: string;
  className?: string;
  aspect?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-zinc-900 border border-zinc-800 ${aspect} ${className}`}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,77,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div
          className="w-8 h-8 opacity-40"
          style={{ background: "#FF4D00", clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}
        />
        <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase text-center px-4">
          {label}
        </span>
      </div>
    </div>
  );
}

// ─── Marquee ───────────────────────────────────────────────────────────────
function Marquee({
  color = "#FF4D00",
  textColor = "#0a0a0a",
  reverse = false,
  items,
}: {
  color?: string;
  textColor?: string;
  reverse?: boolean;
  items: string[];
}) {
  const repeated = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden py-3 flex-shrink-0" style={{ background: color }}>
      <div
        className="whitespace-nowrap inline-block"
        style={{
          animation: `marquee ${reverse ? "30s" : "24s"} linear infinite ${reverse ? "reverse" : "normal"}`,
        }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: textColor, padding: "0 1.5rem" }}
          >
            {i % 2 === 1 ? "◆" : item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── 게임 데이터 ───────────────────────────────────────────────────────────
const GAMES = [
  {
    num: "01",
    status: "Active IP",
    statusActive: true,
    title: "MONSTER\nMANSION",
    titleShort: "MONSTER MANSION",
    genre: "건물 경영 / 모험",
    desc: "개성 넘치는 몬스터들이 살아가는 맨션의 건물주가 되어보세요.",
    href: "https://monstermansion.vercel.app/",
    dim: false,
    accentColor: "#FF4D00",
    image: "/몬스터맨션.jpg",
  },
  {
    num: "02",
    status: "In Development",
    statusActive: false,
    title: "POTION\nONLINE",
    titleShort: "POTION ONLINE",
    genre: "공방 경영 / 이커머스 시뮬레이션",
    desc: "요즘 MZ마녀 사이에서는 온라인 쇼핑몰이 유행?! 의뢰의 뜻을 파악하고, 포션을 만들어 팔아보세요.",
    href: "#",
    dim: true,
    accentColor: "#C084FC",
    image: "/포션온라인.jpg",
  },
  {
    num: "03",
    status: "In Development",
    statusActive: false,
    title: "LABYRINTH\nCRETA",
    titleShort: "LABYRINTH: CRETA",
    genre: "던전 탐험 / TRPG",
    desc: "용광로에서 세계가 만들어지는중...",
    href: "#",
    dim: true,
    accentColor: "#60A5FA",
    image: "/라비린스.jpg",
  },
];

// ─── useFadeIn ─────────────────────────────────────────────────────────────
function useFadeIn() {
  useEffect(() => {
    const els = document.querySelectorAll(".forge-fade");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("forge-visible");
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function Home() {
  useFadeIn();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+KR:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap');

        :root {
          --forge-black: #0a0a0a;
          --forge-orange: #FF4D00;
          --forge-yellow: #FFD600;
          --forge-surface: #111111;
          --forge-border: rgba(255,255,255,0.07);
          --max-w: 1280px;
        }

        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          background: var(--forge-black);
          color: #f5f2ee;
          font-family: 'Noto Sans KR', sans-serif;
          overflow-x: hidden;
          margin: 0;
        }

        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-mono-forge { font-family: 'Space Mono', monospace; }

        /* ── 컨테이너 ── */
        .forge-container {
          width: 100%;
          max-width: var(--max-w);
          margin: 0 auto;
          padding: 0 clamp(1.25rem, 5vw, 3rem);
        }

        /* ── Marquee ── */
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }

        /* ── FadeIn ── */
        .forge-fade {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .forge-fade.forge-visible { opacity: 1; transform: translateY(0); }

        /* ── Nav ── */
        .nav-link { color: #777; transition: color 0.2s; text-decoration: none; }
        .nav-link:hover { color: var(--forge-orange); }

        .hamburger-btn {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          z-index: 60;
        }
        .hamburger-btn span {
          display: block;
          width: 24px;
          height: 2px;
          background: #f5f2ee;
          transition: all 0.3s;
          transform-origin: center;
        }
        .hamburger-btn.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger-btn.open span:nth-child(2) { opacity: 0; }
        .hamburger-btn.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .mobile-menu {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 40;
          background: rgba(10,10,10,0.97);
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2.5rem;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu a {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 3rem;
          letter-spacing: 0.15em;
          color: #f5f2ee;
          text-decoration: none;
          transition: color 0.2s;
        }
        .mobile-menu a:hover { color: var(--forge-orange); }

        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .hamburger-btn { display: flex; }
        }

        /* ── Hero ── */
        .hero-grid-bg {
          background-image:
            linear-gradient(rgba(255,77,0,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,77,0,0.07) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse at 60% 50%, black 30%, transparent 70%);
        }

        /* ── CTA btn ── */
        .cta-btn {
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
          transition: background 0.2s, transform 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
        }
        .cta-btn:hover { background: var(--forge-yellow) !important; transform: translateY(-2px); }

        /* ── 게임 섹션: 데스크톱 3열 ── */
        .games-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid var(--forge-border);
          border-left: 1px solid var(--forge-border);
        }
        .game-card-wrap {
          border-right: 1px solid var(--forge-border);
          border-bottom: 1px solid var(--forge-border);
        }

        /* 게임 카드 */
        .game-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 2rem;
          text-decoration: none;
          color: #f5f2ee;
          transition: background 0.3s;
          position: relative;
        }
        .game-card:hover { background: #161616; }
        .game-card .card-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 5rem;
          line-height: 1;
          -webkit-text-stroke: 1px rgba(255,255,255,0.07);
          color: transparent;
          position: absolute;
          top: 1rem;
          right: 1.25rem;
          pointer-events: none;
          transition: -webkit-text-stroke-color 0.3s;
        }
        .game-card:hover .card-num { -webkit-text-stroke-color: rgba(255,77,0,0.18); }
        .game-card .card-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.8rem, 2.5vw, 2.4rem);
          line-height: 1.05;
          letter-spacing: 0.05em;
          transition: color 0.2s;
          margin: 0.5rem 0 0.75rem;
          white-space: pre-line;
        }
        .game-card:hover .card-title { color: var(--forge-orange); }
        .game-card .card-cta {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.2s, transform 0.2s;
          margin-top: 0.75rem;
        }
        .game-card:hover .card-cta { opacity: 1; transform: translateY(0); }

        /* ── 게임 섹션: 모바일 세로 스택 ── */
        @media (max-width: 900px) {
          .games-grid {
            grid-template-columns: 1fr;
            border-left: none;
          }
          .game-card-wrap {
            border-right: none;
          }
          .game-card {
            padding: 1.5rem;
          }
          .game-card .card-num { font-size: 3.5rem; top: 0.75rem; right: 1rem; }
          .game-card .card-title { font-size: 2.2rem; }
          /* 모바일: 이미지가 먼저 오도록 */
          .game-card { flex-direction: column; }
          .game-img-wrap { order: -1; }
        }

        /* ── About stats ── */
        .stat-item { padding-left: 1.25rem; border-left: 2px solid var(--forge-orange); }

        /* ── SNS ── */
        .sns-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border: 1px solid var(--forge-border);
          text-decoration: none;
          color: #f5f2ee;
          transition: border-color 0.2s, background 0.2s;
          position: relative;
          overflow: hidden;
        }
        .sns-item::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 0; background: var(--forge-orange);
          transition: width 0.25s; z-index: 0;
        }
        .sns-item:hover::before { width: 3px; }
        .sns-item:hover { border-color: rgba(255,77,0,0.35); }
        .sns-item > * { position: relative; z-index: 1; }

        /* ── News ── */
        .news-item { transition: background 0.2s; cursor: pointer; }
        .news-item:hover { background: rgba(255,255,255,0.02); }
        .news-item:hover .news-title { color: var(--forge-orange); }
        .news-title { transition: color 0.2s; }

        /* ── Footer ── */
        .footer-link {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover { color: var(--forge-orange); }

        /* ── Email ── */
        .email-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--forge-orange);
          text-decoration: none;
          font-family: 'Space Mono', monospace;
          font-size: 0.85rem;
          transition: gap 0.2s;
          word-break: break-all;
        }
        .email-link:hover { gap: 1rem; }

        /* ── 반응형 유틸 ── */
        @media (max-width: 640px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════════
          모바일 메뉴
      ══════════════════════════════════════════ */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {[["#about", "About"], ["#games", "Games"], ["#news", "News"], ["#contact", "Contact"]].map(([href, label]) => (
          <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          NAV
      ══════════════════════════════════════════ */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          background: "rgba(10,10,10,0.88)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          height: "64px", display: "flex", alignItems: "center",
        }}
      >
        <div className="forge-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#hero" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "#f5f2ee" }}>
            <span className="font-display" style={{ fontSize: "1.25rem", letterSpacing: "0.15em" }}>STUDIO FORGE</span>
            <span style={{ width: 18, height: 18, background: "#FF4D00", clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)", flexShrink: 0 }} />
          </a>

          {/* 데스크톱 메뉴 */}
          <ul className="nav-desktop" style={{ display: "flex", gap: "2.5rem", listStyle: "none", margin: 0, padding: 0 }}>
            {[["#about", "About"], ["#games", "Games"], ["#news", "News"], ["#contact", "Contact"]].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="nav-link font-mono-forge" style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>{label}</a>
              </li>
            ))}
          </ul>

          {/* 햄버거 */}
          <button
            className={`hamburger-btn ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="메뉴 열기"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section
        id="hero"
        style={{
          position: "relative",
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          paddingBottom: "clamp(4rem, 8vw, 6rem)",
          overflow: "hidden",
          background: "var(--forge-black)",
        }}
      >
        <div className="absolute inset-0 hero-grid-bg" />

        {/* 대형 F 워터마크 */}
        <span
          className="font-display hide-mobile"
          style={{
            position: "absolute", top: "50%", right: "clamp(1.5rem, 5vw, 3rem)",
            transform: "translateY(-50%)",
            fontSize: "clamp(160px, 25vw, 340px)",
            WebkitTextStroke: "1px rgba(255,77,0,0.12)",
            color: "transparent",
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          F
        </span>

        <div className="forge-container" style={{ position: "relative", zIndex: 10 }}>
          <p className="font-mono-forge" style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#FF4D00", display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <span style={{ display: "block", width: 36, height: 1, background: "#FF4D00" }} />
            Studio Forge — Indie Game Studio
          </p>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(4rem, 13vw, 10rem)",
              lineHeight: 0.95,
              letterSpacing: "0.03em",
              color: "#f5f2ee",
              marginBottom: "2rem",
            }}
          >
            WE<br />FORGE<br />
            <span style={{ color: "#FF4D00" }}>WORLDS</span>
          </h1>
          <p style={{ fontSize: "0.85rem", lineHeight: 1.9, color: "#777", maxWidth: "22rem", marginBottom: "2.5rem" }}>
            단순한 게임이 아닌, 하나의 세계를 창조합니다.
            스튜디오 포지가 만드는 몬스터들의 세계로 여러분을 초대합니다.
          </p>
          <a
            href="#games"
            className="cta-btn font-mono-forge"
            style={{ background: "#FF4D00", color: "#0a0a0a", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, padding: "1rem 1.75rem" }}
          >
            Our Games →
          </a>
        </div>

        {/* 스크롤 인디케이터 */}
        <div
          className="font-mono-forge hide-mobile"
          style={{
            position: "absolute", bottom: "2rem", right: "clamp(1.5rem, 5vw, 3rem)", zIndex: 10,
            fontSize: "0.6rem", letterSpacing: "0.2em", color: "#555",
            writingMode: "vertical-rl",
            display: "flex", alignItems: "center", gap: "0.75rem",
          }}
        >
          SCROLL
          <span style={{ display: "block", width: 1, height: 48, background: "linear-gradient(to bottom, #555, transparent)" }} />
        </div>
      </section>

      {/* ── 마퀴 1 ── */}
      <Marquee color="#FF4D00" items={["STUDIO FORGE", "WE FORGE WORLDS", "INDIE GAME STUDIO", "MONSTER & BEYOND"]} />

      {/* ══════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════ */}
      <section id="about" style={{ background: "#111111", padding: "clamp(4rem, 8vw, 7rem) 0", position: "relative", overflow: "hidden" }}>
        {/* 워터마크 */}
        <span
          className="font-display hide-mobile"
          style={{
            position: "absolute", bottom: "-1rem", right: "-1rem",
            fontSize: "180px", WebkitTextStroke: "1px rgba(255,255,255,0.04)",
            color: "transparent", lineHeight: 1, pointerEvents: "none", userSelect: "none",
          }}
        >
          FORGE
        </span>

        <div className="forge-container forge-fade">
          <p className="font-mono-forge" style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#FF4D00", display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <span style={{ display: "block", width: 28, height: 1, background: "#FF4D00" }} />
            About Us
          </p>
          <h2 className="font-display" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", lineHeight: 0.95, letterSpacing: "0.03em", color: "#f5f2ee", marginBottom: "3.5rem" }}>
            STUDIO<br />FORGE
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: "clamp(2rem, 5vw, 5rem)", position: "relative", zIndex: 1 }}>
            {/* 텍스트 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.95, color: "#999" }}>
                STUDIO FORGE는{" "}
                <strong style={{ color: "#f5f2ee" }}>학창 시절의 노트 한 권, 반 친구끼리의 대화</strong>
                에서 시작되었습니다.
              </p>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.95, color: "#999" }}>
                재미있는 게임을 만들겠다는 열의로 모인 후,{" "}
                <strong style={{ color: "#f5f2ee" }}>매력적인 세계관과 캐릭터들</strong>을 위해 매일
                고민하고 있습니다. 단순한 게임이 아닌 하나의 세계를 창조하는 것이 STUDIO FORGE의 목표입니다.
              </p>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.95, color: "#999" }}>
                앞으로 여러분께{" "}
                <strong style={{ color: "#f5f2ee" }}>다양한 몬스터들과 함께 찾아뵙기 위해</strong>{" "}
                준비 중에 있습니다.
              </p>
            </div>

            {/* 스탯 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", justifyContent: "center" }}>
              {/* ── 스튜디오 심볼 슬롯 ── */}
              {/* 실제 로고로 교체 시: <Image src="/images/logo-symbol.png" alt="Studio Forge" width={120} height={120} /> */}
              <ImageSlot label="Studio Symbol / Logo" aspect="aspect-square" className="max-w-[180px]" />

              {[
                ["01", "Active IP"],
                ["∞", "Worlds to Forge"],
                ["24/7", "Hours Crafting"],
              ].map(([num, label]) => (
                <div key={label} className="stat-item">
                  <div className="font-display" style={{ fontSize: "2.75rem", color: "#FF4D00", lineHeight: 1 }}>{num}</div>
                  <div className="font-mono-forge" style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#666", marginTop: "0.25rem" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          GAMES
      ══════════════════════════════════════════ */}
      <section id="games" style={{ background: "#0a0a0a", padding: "clamp(4rem, 8vw, 7rem) 0" }}>
        <div className="forge-container">
          <p className="font-mono-forge" style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#FF4D00", display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <span style={{ display: "block", width: 28, height: 1, background: "#FF4D00" }} />
            Our Games & IP
          </p>
          <h2 className="font-display" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", lineHeight: 0.95, letterSpacing: "0.03em", color: "#f5f2ee", marginBottom: "2.5rem" }}>
            GAMES
          </h2>
        </div>

        {/* 카드 그리드 */}
        <div className="forge-container">
          <div className="games-grid">
            {GAMES.map((game) => {
              const Inner = (
                <div className="game-card" style={{ opacity: game.dim ? 0.45 : 1, cursor: game.dim ? "default" : "pointer" }}>
                  <span className="card-num">{game.num}</span>

                  {/* ── 게임 키아트 이미지 슬롯 ── */}
                  {/* 교체 시: <Image src={`/images/${game.slug}.jpg`} alt={game.titleShort} fill className="object-cover" /> */}
                  <div
                    className="game-img-wrap"
                    style={{ marginBottom: "1.25rem", position: "relative", width: "100%", aspectRatio: "16/9" }}
                  >
                    <Image
                      src={game.image || "/fallback.jpg"}
                      alt={game.titleShort}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* 배지 */}
                  <p className="font-mono-forge" style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: game.accentColor, display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                    <span style={{ width: 6, height: 6, background: game.accentColor, clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)", display: "inline-block" }} />
                    {game.status}
                    {game.statusActive && (
                      <span style={{ marginLeft: "0.4rem", width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px #22c55e" }} />
                    )}
                  </p>

                  {/* 제목 */}
                  <h3 className="card-title" style={{ color: game.dim ? "#f5f2ee" : undefined }}>
                    {game.title}
                  </h3>

                  {/* 장르 */}
                  <p className="font-mono-forge" style={{ fontSize: "0.6rem", letterSpacing: "0.12em", color: "#555", textTransform: "uppercase", marginBottom: "0.6rem" }}>
                    {game.genre}
                  </p>

                  {/* 설명 */}
                  <p style={{ fontSize: "0.8rem", lineHeight: 1.75, color: "#777", flexGrow: 1 }}>
                    {game.desc}
                  </p>

                  {!game.dim && (
                    <p className="card-cta" style={{ color: game.accentColor }}>Visit Site →</p>
                  )}
                </div>
              );

              return (
                <div key={game.num} className="game-card-wrap">
                  {game.href !== "#" ? (
                    <a href={game.href} target="_blank" rel="noopener noreferrer" style={{ display: "block", height: "100%", textDecoration: "none" }}>
                      {Inner}
                    </a>
                  ) : (
                    <div style={{ height: "100%" }}>{Inner}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 마퀴 2 ── */}
      <Marquee color="#FFD600" textColor="#0a0a0a" reverse items={["NEW WORLDS", "CREATIVE STUDIO", "MONSTER & BEYOND", "INDIE SPIRIT"]} />

      {/* ══════════════════════════════════════════
          NEWS
      ══════════════════════════════════════════ */}
      <section id="news" style={{ background: "#111111", padding: "clamp(4rem, 8vw, 7rem) 0" }} className="forge-fade">
        <div className="forge-container">
          <p className="font-mono-forge" style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#FF4D00", display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <span style={{ display: "block", width: 28, height: 1, background: "#FF4D00" }} />
            Latest
          </p>
          <h2 className="font-display" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", lineHeight: 0.95, letterSpacing: "0.03em", color: "#f5f2ee", marginBottom: "3rem" }}>
            NEWS
          </h2>

          <div style={{ maxWidth: 720, display: "flex", flexDirection: "column" }}>
            {[
              {
                date: "2024.12",
                tag: "공지",
                title: "스튜디오 포지 공식 사이트 오픈",
                desc: "스튜디오 포지의 공식 웹사이트가 문을 열었습니다. 앞으로 다양한 소식을 이곳에서 전해드릴 예정입니다.",
                dim: false,
              },
              {
                date: "2024.11",
                tag: "IP",
                title: "Monster Mansion 세계관 공개",
                desc: "스튜디오 포지의 첫 번째 IP, Monster Mansion의 세계관 페이지가 공개되었습니다.",
                dim: false,
              },
              {
                date: "Coming",
                tag: "업데이트",
                title: "새로운 소식을 준비 중입니다",
                desc: "용광로 속에서 새로운 이야기가 만들어지고 있습니다. 기대해 주세요.",
                dim: true,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="news-item"
                style={{
                  display: "flex",
                  gap: "clamp(1rem, 4vw, 2.5rem)",
                  padding: "1.75rem 0",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  opacity: item.dim ? 0.4 : 1,
                }}
              >
                <span className="font-mono-forge" style={{ fontSize: "0.65rem", letterSpacing: "0.1em", color: "#666", minWidth: 68, paddingTop: 2, flexShrink: 0 }}>
                  {item.date}
                </span>
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      display: "inline-block",
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      background: "rgba(255,77,0,0.12)",
                      color: "#FF4D00",
                      padding: "0.2rem 0.6rem",
                      marginBottom: "0.6rem",
                    }}
                  >
                    {item.tag}
                  </span>
                  <p className="news-title" style={{ fontSize: "0.95rem", fontWeight: 500, color: "#f5f2ee", marginBottom: "0.4rem" }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: "0.8rem", lineHeight: 1.75, color: "#666" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════ */}
      <section id="contact" style={{ background: "#0a0a0a", padding: "clamp(4rem, 8vw, 7rem) 0" }} className="forge-fade">
        <div className="forge-container">
          <p className="font-mono-forge" style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#FF4D00", display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <span style={{ display: "block", width: 28, height: 1, background: "#FF4D00" }} />
            Connect
          </p>
          <h2 className="font-display" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", lineHeight: 0.95, letterSpacing: "0.03em", color: "#f5f2ee", marginBottom: "3.5rem" }}>
            FOLLOW<br />US
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "clamp(2rem, 5vw, 5rem)" }}>
            {/* SNS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { icon: "𝕏", platform: "X (Twitter)", handle: "@studioforge_kr", href: "#" },
                { icon: "▶", platform: "YouTube", handle: "Studio Forge", href: "#" },
                { icon: "◉", platform: "Instagram", handle: "@studioforge_kr", href: "#" },
                { icon: "⬡", platform: "Discord", handle: "Studio Forge Community", href: "#" },
              ].map((sns) => (
                <a key={sns.platform} href={sns.href} className="sns-item">
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, background: "rgba(255,255,255,0.05)", fontFamily: "'Space Mono', monospace", fontSize: "0.85rem", flexShrink: 0 }}>
                    {sns.icon}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <span className="font-mono-forge" style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em" }}>{sns.platform}</span>
                    <span className="font-mono-forge" style={{ fontSize: "0.6rem", color: "#555", marginTop: 2 }}>{sns.handle}</span>
                  </span>
                  <span style={{ color: "#444", fontSize: "0.85rem" }}>→</span>
                </a>
              ))}
            </div>

            {/* 이메일 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <h3 className="font-display" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "#f5f2ee", marginBottom: "1rem", letterSpacing: "0.05em" }}>
                  GET IN<br />TOUCH
                </h3>
                <p style={{ fontSize: "0.85rem", lineHeight: 1.85, color: "#777", marginBottom: "1.5rem" }}>
                  협업, 미디어, 기타 문의 사항이 있으시면<br />
                  언제든지 연락주세요.
                </p>
                <a href="mailto:hello@studioforge.kr" className="email-link">
                  → hello@studioforge.kr
                </a>
              </div>

              {/* 게임 수 요약 카드 */}
              <div style={{ border: "1px solid rgba(255,77,0,0.2)", padding: "1.5rem", marginTop: "0.5rem" }}>
                <p className="font-mono-forge" style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#FF4D00", marginBottom: "1rem" }}>
                  Currently Forging
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {GAMES.map((g) => (
                    <div key={g.num} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ width: 6, height: 6, borderRadius: g.statusActive ? "50%" : "0%", background: g.statusActive ? "#22c55e" : g.accentColor, flexShrink: 0 }} />
                      <span className="font-mono-forge" style={{ fontSize: "0.65rem", color: "#888", letterSpacing: "0.05em" }}>{g.titleShort}</span>
                      <span className="font-mono-forge" style={{ fontSize: "0.55rem", color: "#444", marginLeft: "auto", letterSpacing: "0.1em", textTransform: "uppercase" }}>{g.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer style={{ background: "#060606", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {/* 상단: 로고 + 링크 */}
        <div className="forge-container" style={{ padding: "3rem clamp(1.25rem, 5vw, 3rem) 2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "2.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {/* 로고 블록 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="font-display" style={{ fontSize: "1.3rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.6)" }}>STUDIO FORGE</span>
                <span style={{ width: 14, height: 14, background: "rgba(255,77,0,0.5)", clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)", flexShrink: 0 }} />
              </div>
              <p className="font-mono-forge" style={{ fontSize: "0.6rem", lineHeight: 1.8, color: "rgba(255,255,255,0.25)", maxWidth: 220 }}>
                단순한 게임이 아닌,<br />하나의 세계를 창조합니다.
              </p>
            </div>

            {/* 네비게이션 */}
            <div>
              <p className="font-mono-forge" style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "1rem" }}>Navigation</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {[["#about", "About"], ["#games", "Games"], ["#news", "News"], ["#contact", "Contact"]].map(([href, label]) => (
                  <a key={href} href={href} className="footer-link">{label}</a>
                ))}
              </div>
            </div>

            {/* 게임 */}
            <div>
              <p className="font-mono-forge" style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "1rem" }}>Games</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {GAMES.map((g) => (
                  <a key={g.num} href={g.href !== "#" ? g.href : undefined} className="footer-link" style={{ cursor: g.href === "#" ? "default" : "pointer", opacity: g.dim ? 0.4 : 1 }}>
                    {g.titleShort}
                  </a>
                ))}
              </div>
            </div>

            {/* 연락처 */}
            <div>
              <p className="font-mono-forge" style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "1rem" }}>Contact</p>
              <a href="mailto:hello@studioforge.kr" className="footer-link" style={{ display: "block", marginBottom: "0.5rem" }}>hello@studioforge.kr</a>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                {["𝕏", "▶", "◉", "⬡"].map((icon, i) => (
                  <a key={i} href="#" className="font-mono-forge" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#FF4D00")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* 하단: 카피라이트 */}
          <div style={{ paddingTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
            <p className="font-mono-forge" style={{ fontSize: "0.6rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.15)" }}>
              © 2024 STUDIO FORGE. ALL RIGHTS RESERVED.
            </p>
            <p className="font-mono-forge" style={{ fontSize: "0.6rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.1)" }}>
              FORGED WITH ▲
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}