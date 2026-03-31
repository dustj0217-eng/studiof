"use client";

import { useEffect, useRef } from "react";

// ─── 이미지 placeholder 컴포넌트 ───────────────────────────────────────────
// 실제 이미지로 교체할 때: <ImageSlot>을 <Image src="..." /> 로 바꾸면 됩니다
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
      {/* 격자 패턴 */}
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
          style={{
            background: "#FF4D00",
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          }}
        />
        <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}

// ─── Marquee ───────────────────────────────────────────────────────────────
function Marquee({
  color = "#FF4D00",
  reverse = false,
  items,
}: {
  color?: string;
  reverse?: boolean;
  items: string[];
}) {
  const repeated = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden py-3" style={{ background: color }}>
      <div
        className="whitespace-nowrap inline-block"
        style={{
          animation: `marquee ${reverse ? "28s" : "22s"} linear infinite ${
            reverse ? "reverse" : "normal"
          }`,
        }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="font-mono text-xs tracking-widest uppercase" style={{ color: "#0a0a0a", padding: "0 1.5rem" }}>
            {i % 2 === 1 ? "◆" : item}
          </span>
        ))}
      </div>
    </div>
  );
}

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
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function Home() {
  useFadeIn();

  return (
    <>
      {/* ── 글로벌 스타일 (Tailwind 확장 불필요한 것들만) ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+KR:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap');

        :root {
          --forge-black: #0a0a0a;
          --forge-orange: #FF4D00;
          --forge-yellow: #FFD600;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--forge-black);
          color: #f5f2ee;
          font-family: 'Noto Sans KR', sans-serif;
          overflow-x: hidden;
        }

        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-mono-forge { font-family: 'Space Mono', monospace; }

        /* Marquee */
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }

        /* FadeIn */
        .forge-fade {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .forge-fade.forge-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .forge-fade-delay-1 { transition-delay: 0.1s; }
        .forge-fade-delay-2 { transition-delay: 0.2s; }
        .forge-fade-delay-3 { transition-delay: 0.3s; }

        /* Nav link hover */
        .nav-link { color: #888; transition: color 0.2s; }
        .nav-link:hover { color: var(--forge-orange); }

        /* Game card */
        .game-card { transition: background 0.3s; }
        .game-card:hover { background: #1a1a1a; }
        .game-card .card-num {
          -webkit-text-stroke: 1px rgba(255,255,255,0.07);
          color: transparent;
          transition: -webkit-text-stroke-color 0.3s;
        }
        .game-card:hover .card-num {
          -webkit-text-stroke-color: rgba(255,77,0,0.22);
        }
        .game-card .card-title { transition: color 0.2s; }
        .game-card:hover .card-title { color: var(--forge-orange); }
        .game-card .card-cta {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.2s, transform 0.2s;
        }
        .game-card:hover .card-cta { opacity: 1; transform: translateY(0); }

        /* SNS item */
        .sns-item { transition: border-color 0.2s, color 0.2s; position: relative; overflow: hidden; }
        .sns-item::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 0; background: var(--forge-orange);
          transition: width 0.3s; z-index: 0;
        }
        .sns-item:hover::before { width: 3px; }
        .sns-item:hover { border-color: rgba(255,77,0,0.4); color: var(--forge-orange); }

        /* CTA clip */
        .cta-btn {
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
          transition: background 0.2s, transform 0.2s;
        }
        .cta-btn:hover { background: var(--forge-yellow) !important; transform: translateY(-2px); }

        /* Hero grid bg */
        .hero-grid-bg {
          background-image:
            linear-gradient(rgba(255,77,0,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,77,0,0.07) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse at 60% 50%, black 30%, transparent 70%);
        }

        /* News item */
        .news-item { transition: all 0.2s; }
        .news-item:hover .news-title { color: var(--forge-orange); }

        /* Email link */
        .email-link { transition: gap 0.2s; display: flex; align-items: center; gap: 8px; }
        .email-link:hover { gap: 16px; }

        /* Scroll indicator */
        .scroll-line::after {
          content: '';
          display: block; width: 1px; height: 60px;
          background: linear-gradient(to bottom, #888, transparent);
        }
      `}</style>

      {/* ════════════════════════════════════════════
          NAV
      ════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 h-16"
        style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <a href="#hero" className="flex items-center gap-2 no-underline" style={{ color: "#f5f2ee" }}>
          <span className="font-display text-xl tracking-widest">STUDIO FORGE</span>
          <span className="w-5 h-5 flex-shrink-0" style={{ background: "#FF4D00", clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
        </a>
        <ul className="flex gap-10 list-none font-mono-forge text-xs tracking-widest uppercase">
          {[["#about", "About"], ["#games", "Games"], ["#news", "News"], ["#contact", "Contact"]].map(([href, label]) => (
            <li key={href}>
              <a href={href} className="nav-link no-underline">{label}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-end px-12 pb-24 overflow-hidden"
        style={{ background: "var(--forge-black)" }}>
        {/* 격자 배경 */}
        <div className="absolute inset-0 hero-grid-bg" />

        {/* 배경 대형 F 글자 */}
        <span className="font-display absolute top-1/2 right-12 -translate-y-1/2 pointer-events-none select-none leading-none"
          style={{ fontSize: "clamp(200px, 30vw, 380px)", WebkitTextStroke: "1px rgba(255,77,0,0.13)", color: "transparent" }}>
          F
        </span>

        {/* ── Hero 이미지 슬롯 (배경 키아트 또는 팀 사진) ── */}
        {/* 사용법: 이 div를 제거하고 next/image의 <Image fill ... />로 교체 */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <ImageSlot label="Hero Key Art / Background Image" className="w-full h-full" aspect="" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <p className="font-mono-forge text-xs tracking-widest mb-6 flex items-center gap-3"
            style={{ color: "#FF4D00" }}>
            <span className="block w-10 h-px" style={{ background: "#FF4D00" }} />
            Studio Forge — Indie Game Studio
          </p>
          <h1 className="font-display leading-none tracking-wide mb-8"
            style={{ fontSize: "clamp(72px, 12vw, 140px)", color: "#f5f2ee" }}>
            WE<br />FORGE<br />
            <span style={{ color: "#FF4D00" }}>WORLDS</span>
          </h1>
          <p className="text-sm leading-8 mb-10 max-w-sm" style={{ color: "#888" }}>
            단순한 게임이 아닌, 하나의 세계를 창조합니다.
            스튜디오 포지가 만드는 몬스터들의 세계로 여러분을 초대합니다.
          </p>
          <a href="#games" className="cta-btn inline-flex items-center gap-3 font-mono-forge text-xs tracking-widest uppercase font-bold px-7 py-4 no-underline"
            style={{ background: "#FF4D00", color: "#0a0a0a" }}>
            Our Games →
          </a>
        </div>

        {/* 스크롤 인디케이터 */}
        <div className="absolute bottom-8 right-12 z-10 font-mono-forge text-xs tracking-widest flex items-center gap-3 scroll-line"
          style={{ color: "#888", writingMode: "vertical-rl" }}>
          SCROLL
        </div>
      </section>

      {/* ── 마퀴 1 ── */}
      <Marquee
        color="#FF4D00"
        items={["STUDIO FORGE", "WE FORGE WORLDS", "INDIE GAME STUDIO", "MONSTER & BEYOND"]}
      />

      {/* ════════════════════════════════════════════
          ABOUT
      ════════════════════════════════════════════ */}
      <section id="about" className="relative px-12 py-28 overflow-hidden forge-fade"
        style={{ background: "#111111" }}>
        {/* 배경 워터마크 */}
        <span className="font-display absolute -bottom-8 -right-4 pointer-events-none select-none leading-none"
          style={{ fontSize: "200px", WebkitTextStroke: "1px rgba(255,255,255,0.04)", color: "transparent" }}>
          FORGE
        </span>

        <p className="font-mono-forge text-xs tracking-widest mb-5 flex items-center gap-3" style={{ color: "#FF4D00" }}>
          <span className="block w-7 h-px" style={{ background: "#FF4D00" }} />
          About Us
        </p>
        <h2 className="font-display leading-none tracking-wide mb-16" style={{ fontSize: "clamp(48px, 7vw, 88px)", color: "#f5f2ee" }}>
          STUDIO<br />FORGE
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl relative z-10">
          {/* 텍스트 */}
          <div className="flex flex-col gap-6">
            <p className="text-sm leading-8" style={{ color: "#aaa" }}>
              STUDIO FORGE는{" "}
              <strong style={{ color: "#f5f2ee" }}>학창 시절의 노트 한 권, 반 친구끼리의 대화</strong>
              에서 시작되었습니다.
            </p>
            <p className="text-sm leading-8" style={{ color: "#aaa" }}>
              재미있는 게임을 만들겠다는 열의로 모인 후,{" "}
              <strong style={{ color: "#f5f2ee" }}>매력적인 세계관과 캐릭터들</strong>을 위해 매일
              고민하고 있습니다. 단순한 게임이 아닌 하나의 세계를 창조하는 것이 STUDIO FORGE의
              목표입니다.
            </p>
            <p className="text-sm leading-8" style={{ color: "#aaa" }}>
              앞으로 여러분께{" "}
              <strong style={{ color: "#f5f2ee" }}>다양한 몬스터들과 함께 찾아뵙기 위해</strong>{" "}
              준비 중에 있습니다.
            </p>

            {/* ── 팀/사무실 이미지 슬롯 ── */}
            {/* 사용법: <ImageSlot>을 <Image src="/images/team.jpg" alt="팀 사진" fill className="object-cover" />로 교체 */}
            <ImageSlot label="Team / Office Photo" aspect="aspect-video" className="mt-4" />
          </div>

          {/* 스탯 + 로고/심볼 이미지 슬롯 */}
          <div className="flex flex-col justify-between gap-10">
            {/* ── 회사 로고 or 심볼 이미지 슬롯 ── */}
            <ImageSlot label="Studio Symbol / Logo Art" aspect="aspect-square" className="max-w-xs" />

            <div className="flex flex-col gap-6">
              {[
                ["01", "Active IP"],
                ["∞", "Worlds to Forge"],
                ["24/7", "Hours Crafting"],
              ].map(([num, label]) => (
                <div key={label} className="pl-5" style={{ borderLeft: "2px solid #FF4D00" }}>
                  <div className="font-display leading-none mb-1" style={{ fontSize: "44px", color: "#FF4D00" }}>{num}</div>
                  <div className="font-mono-forge text-xs tracking-widest uppercase" style={{ color: "#888" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          GAMES
      ════════════════════════════════════════════ */}
      <section id="games" className="px-12 py-28" style={{ background: "#0a0a0a" }}>
        <p className="font-mono-forge text-xs tracking-widest mb-5 flex items-center gap-3" style={{ color: "#FF4D00" }}>
          <span className="block w-7 h-px" style={{ background: "#FF4D00" }} />
          Our Games & IP
        </p>
        <h2 className="font-display leading-none tracking-wide mb-12" style={{ fontSize: "clamp(48px, 7vw, 88px)", color: "#f5f2ee" }}>
          GAMES
        </h2>

        {/* 게임 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-y"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)", borderLeft: "1px solid rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.08)" }}>

          {/* ── 게임 카드 1: Monster Mantion ── */}
          <a href="https://monstermansion.vercel.app/" target="_blank" rel="noopener noreferrer"
            className="game-card relative flex flex-col justify-between p-10 min-h-80 no-underline"
            style={{ color: "#f5f2ee", borderColor: "rgba(255,255,255,0.08)" }}>
            <span className="card-num font-display absolute top-6 right-8 leading-none select-none"
              style={{ fontSize: "80px" }}>01</span>

            {/* ── 게임 키아트 썸네일 슬롯 ── */}
            <ImageSlot label="Monster Mantion — Key Art" aspect="aspect-video" className="mb-6" />

            <div>
              <p className="font-mono-forge text-xs tracking-widest mb-2 flex items-center gap-2" style={{ color: "#FF4D00" }}>
                <span className="w-2 h-2 inline-block" style={{ background: "#FF4D00", clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
                Active IP
              </p>
              <h3 className="card-title font-display tracking-wide mb-3" style={{ fontSize: "36px" }}>
                MONSTER MANTION
              </h3>
              <p className="text-xs leading-7" style={{ color: "#888" }}>
                스튜디오 포지의 첫 번째 세계관.<br />
                개성 넘치는 몬스터들의 이야기가 펼쳐집니다.
              </p>
              <p className="card-cta font-mono-forge text-xs tracking-widest mt-4" style={{ color: "#FF4D00" }}>
                Visit Site →
              </p>
            </div>
          </a>

          {/* ── 게임 카드 2: Coming Soon ── */}
          <div className="game-card relative flex flex-col justify-end p-10 min-h-80 opacity-40 cursor-default"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <span className="card-num font-display absolute top-6 right-8 leading-none select-none"
              style={{ fontSize: "80px" }}>02</span>
            <ImageSlot label="Next Game — Coming Soon" aspect="aspect-video" className="mb-6 opacity-50" />
            <p className="font-mono-forge text-xs tracking-widest mb-2" style={{ color: "#FF4D00" }}>Coming Soon</p>
            <h3 className="font-display tracking-wide mb-3" style={{ fontSize: "36px" }}>???</h3>
            <p className="text-xs leading-7" style={{ color: "#888" }}>
              새로운 세계가 용광로 속에서 만들어지고 있습니다.
            </p>
          </div>

          {/* ── 게임 카드 3: Coming Soon ── */}
          <div className="game-card relative flex flex-col justify-end p-10 min-h-80 opacity-40 cursor-default"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <span className="card-num font-display absolute top-6 right-8 leading-none select-none"
              style={{ fontSize: "80px" }}>03</span>
            <ImageSlot label="Future Game — Coming Soon" aspect="aspect-video" className="mb-6 opacity-50" />
            <p className="font-mono-forge text-xs tracking-widest mb-2" style={{ color: "#FF4D00" }}>Coming Soon</p>
            <h3 className="font-display tracking-wide mb-3" style={{ fontSize: "36px" }}>???</h3>
            <p className="text-xs leading-7" style={{ color: "#888" }}>
              또 다른 이야기가 시작될 준비를 하고 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── 마퀴 2 ── */}
      <Marquee
        color="#FFD600"
        reverse
        items={["NEW WORLDS", "CREATIVE STUDIO", "MONSTER & BEYOND", "INDIE SPIRIT"]}
      />

      {/* ════════════════════════════════════════════
          NEWS
      ════════════════════════════════════════════ */}
      <section id="news" className="px-12 py-28 forge-fade" style={{ background: "#111111" }}>
        <p className="font-mono-forge text-xs tracking-widest mb-5 flex items-center gap-3" style={{ color: "#FF4D00" }}>
          <span className="block w-7 h-px" style={{ background: "#FF4D00" }} />
          Latest
        </p>
        <h2 className="font-display leading-none tracking-wide mb-12" style={{ fontSize: "clamp(48px, 7vw, 88px)", color: "#f5f2ee" }}>
          NEWS
        </h2>

        <div className="max-w-3xl flex flex-col">
          {[
            {
              date: "2024.12",
              tag: "공지",
              title: "스튜디오 포지 공식 사이트 오픈",
              desc: "스튜디오 포지의 공식 웹사이트가 문을 열었습니다. 앞으로 다양한 소식을 이곳에서 전해드릴 예정입니다.",
              hasImage: true,
            },
            {
              date: "2024.11",
              tag: "IP",
              title: "Monster Mantion 세계관 공개",
              desc: "스튜디오 포지의 첫 번째 IP, Monster Mantion의 세계관 페이지가 공개되었습니다.",
              hasImage: false,
            },
            {
              date: "Coming",
              tag: "업데이트",
              title: "새로운 소식을 준비 중입니다",
              desc: "용광로 속에서 새로운 이야기가 만들어지고 있습니다. 기대해 주세요.",
              hasImage: false,
              dim: true,
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`news-item flex gap-8 py-8 ${item.dim ? "opacity-40 cursor-default" : "cursor-pointer"}`}
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span className="font-mono-forge text-xs tracking-wide mt-1 min-w-[76px]" style={{ color: "#888" }}>
                {item.date}
              </span>
              <div className="flex-1">
                {item.hasImage && (
                  // ── 뉴스 썸네일 이미지 슬롯 ──
                  // 사용법: <Image src="/images/news-1.jpg" alt="..." width={480} height={270} className="object-cover" />
                  <ImageSlot label="News Thumbnail" aspect="aspect-video" className="mb-4 max-w-sm" />
                )}
                <span
                  className="inline-block font-mono-forge text-xs tracking-widest px-2 py-1 mb-3"
                  style={{ background: "rgba(255,77,0,0.15)", color: "#FF4D00" }}
                >
                  {item.tag}
                </span>
                <p className="news-title text-base font-medium mb-2" style={{ color: "#f5f2ee" }}>
                  {item.title}
                </p>
                <p className="text-xs leading-7" style={{ color: "#888" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CONTACT / SNS
      ════════════════════════════════════════════ */}
      <section id="contact" className="px-12 py-28 forge-fade" style={{ background: "#0a0a0a" }}>
        <p className="font-mono-forge text-xs tracking-widest mb-5 flex items-center gap-3" style={{ color: "#FF4D00" }}>
          <span className="block w-7 h-px" style={{ background: "#FF4D00" }} />
          Connect
        </p>
        <h2 className="font-display leading-none tracking-wide mb-16" style={{ fontSize: "clamp(48px, 7vw, 88px)", color: "#f5f2ee" }}>
          FOLLOW<br />US
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 max-w-5xl">
          {/* SNS 링크 */}
          <div className="flex flex-col gap-3">
            {[
              { icon: "𝕏", platform: "X (Twitter)", handle: "@studioforge", href: "#" },
              { icon: "▶", platform: "YouTube", handle: "Studio Forge", href: "#" },
              { icon: "◉", platform: "Instagram", handle: "@studioforge", href: "#" },
              { icon: "⬡", platform: "Discord", handle: "Studio Forge Community", href: "#" },
            ].map((sns) => (
              <a
                key={sns.platform}
                href={sns.href}
                className="sns-item flex items-center gap-4 px-5 py-4 no-underline"
                style={{ border: "1px solid rgba(255,255,255,0.07)", color: "#f5f2ee" }}
              >
                <span className="relative z-10 flex items-center justify-center w-9 h-9 font-mono-forge text-sm flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.06)" }}>
                  {sns.icon}
                </span>
                <span className="relative z-10 flex flex-col flex-1">
                  <span className="font-mono-forge text-xs font-bold tracking-wide">{sns.platform}</span>
                  <span className="font-mono-forge text-xs mt-0.5" style={{ color: "#666" }}>{sns.handle}</span>
                </span>
                <span className="relative z-10 text-sm" style={{ color: "#666" }}>→</span>
              </a>
            ))}
          </div>

          {/* 이메일 + 이미지 */}
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="font-display tracking-wide mb-4" style={{ fontSize: "36px", color: "#f5f2ee" }}>
                GET IN<br />TOUCH
              </h3>
              <p className="text-sm leading-8 mb-6" style={{ color: "#888" }}>
                협업, 미디어, 기타 문의 사항이 있으시면<br />
                언제든지 연락주세요.
              </p>
              <a href="mailto:hello@studioforge.kr" className="email-link font-mono-forge text-sm no-underline"
                style={{ color: "#FF4D00" }}>
                → hello@studioforge.kr
              </a>
            </div>

            {/* ── 컨택 섹션 이미지 슬롯 (스튜디오 사진 등) ── */}
            {/* 사용법: <Image src="/images/studio.jpg" alt="스튜디오" width={520} height={300} className="object-cover" /> */}
            <ImageSlot label="Studio / Contact Image" aspect="aspect-video" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════ */}
      <footer
        className="flex items-center justify-between px-12 py-7"
        style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-2">
          <span className="font-display text-lg tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
            STUDIO FORGE
          </span>
          <span className="w-4 h-4" style={{ background: "rgba(255,77,0,0.35)", clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
        </div>
        <ul className="flex gap-8 list-none">
          {[["#about", "About"], ["#games", "Games"], ["#news", "News"], ["#contact", "Contact"]].map(([href, label]) => (
            <li key={href}>
              <a href={href} className="font-mono-forge text-xs tracking-widest no-underline transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.25)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FF4D00")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <p className="font-mono-forge text-xs tracking-wide" style={{ color: "rgba(255,255,255,0.18)" }}>
          © 2024 STUDIO FORGE. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </>
  );
}