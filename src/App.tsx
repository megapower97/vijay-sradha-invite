import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ScratchCard } from './components/ScratchCard';

export function App() {
  const [stage, setStage] = useState<'dusk' | 'lit' | 'opened'>('dusk');

  const [litLamps, setLitLamps] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [wishesSent, setWishesSent] = useState(false);

  // Custom Music State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const customAudioRef = useRef<HTMLAudioElement | null>(null);

  const TOTAL_STREETLIGHTS = 16;

  // Initialize Custom Audio
  useEffect(() => {
    const audio = new Audio('/wedding-music.mp3');
    audio.loop = true;
    audio.volume = 0.7;
    customAudioRef.current = audio;

    return () => {
      audio.pause();
    };
  }, []);

  // Countdown to Dec 3, 2026 7:00 PM IST
  useEffect(() => {
    const targetDate = new Date('2026-12-03T19:00:00+05:30').getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Turn on the 16 bridge street lights sequentially
  useEffect(() => {
    if (stage !== 'lit') {
      setLitLamps(0);
      return;
    }
    const timer = window.setInterval(() => {
      setLitLamps((prev) => (prev < TOTAL_STREETLIGHTS ? prev + 1 : prev));
    }, 90);
    return () => clearInterval(timer);
  }, [stage]);

  const playCustomMusic = () => {
    if (customAudioRef.current) {
      customAudioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch((e) => console.log('Audio requires user interaction or file is missing:', e));
    }
  };

  const toggleMusic = () => {
    if (isPlayingMusic) {
      if (customAudioRef.current) {
        customAudioRef.current.pause();
      }
      setIsPlayingMusic(false);
    } else {
      playCustomMusic();
    }
  };

  // Manual 2-Step Click: 1st tap turns on lights, 2nd tap opens the card
  const handleBridgeClick = () => {
    if (stage === 'dusk') {
      setStage('lit');
      playCustomMusic();

      setTimeout(() => {
        confetti({
          particleCount: 55,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#FFE082', '#FFD54F', '#FFF8E1', '#D4AF37'],
        });
      }, 1400);
    } else if (stage === 'lit') {
      setStage('opened');
    }
  };

  const triggerShower = () => {
    setWishesSent(true);
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#D4AF37', '#C5A059', '#F3E5AB', '#FFFDF7'],
    });
  };

  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(
      `✨ *Vijay & Shradha - Wedding Invitation* ✨\n\n` +
        `Welcome to Rajamahendravaram! We invite you to celebrate the union of Vijay and Shradha.\n\n` +
        `📅 *Date:* Thursday, December 3, 2026\n` +
        `🍽️ *Dinner & Reception:* 7:00 PM onwards\n` +
        `🕉️ *Muhurtham:* 4:42 AM (Early hours of Friday, Dec 4)\n` +
        `📍 *Venue:* J.K. Gardens, J.N. Road, Rajahmundry.\n\n` +
        `Tap below to light up the Godavari Bridge & open our wedding invite:\n${window.location.href}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const addToGoogleCalendar = () => {
    const title = encodeURIComponent('Vijay & Shradha Wedding Celebration');
    const details = encodeURIComponent(
      'Wedding of Chi. Vijay Sri Venkata Krishna Roy & Chi. La. Sow. Shradha. Dinner & Reception from 7:00 PM onwards; Muhurtham at 4:42 AM (Early hours of Friday, Dec 4).'
    );
    const location = encodeURIComponent('J.K. Gardens, J.N. Road, Rajahmundry, Andhra Pradesh');
    const dates = '20261203T133000Z/20261204T003000Z';
    window.open(
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`,
      '_blank'
    );
  };

  const allLampsLit = litLamps >= TOTAL_STREETLIGHTS;

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden font-sans-clean bg-[#F9F6F0] text-[#2C2520]">
      {/* =====================================================================
          INTERACTIVE GODAVARI BRIDGE STREET LIGHTS INTRO (MANUAL CLICK TO OPEN)
      ===================================================================== */}
      {stage !== 'opened' && (
        <div
          onClick={handleBridgeClick}
          className={`fixed inset-0 z-50 flex flex-col justify-between cursor-pointer overflow-hidden select-none transition-all duration-[1500ms] ${
            stage === 'dusk'
              ? 'bg-gradient-to-b from-[#1E293B] via-[#334155] to-[#1E293B]'
              : 'bg-gradient-to-b from-[#28354A] via-[#5E4B3E] to-[#232B38]'
          }`}
        >
          {/* Soft Blended Photo Backdrop */}
          <img
            src="/images/godavari-road-rail-night.jpg"
            alt="Godavari Bridge"
            className={`absolute inset-0 w-full h-full object-cover object-center mix-blend-soft-light transition-all duration-[1500ms] ${
              stage === 'dusk' ? 'opacity-20 brightness-75' : 'opacity-40 brightness-110'
            }`}
          />

          {/* Twinkling Evening Stars & Glowing Crescent Moon */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-[#FFFDF7] animate-pulse"
                style={{
                  top: `${5 + ((i * 11) % 32)}%`,
                  left: `${5 + ((i * 17) % 90)}%`,
                  width: `${1.5 + (i % 2)}px`,
                  height: `${1.5 + (i % 2)}px`,
                  opacity: stage === 'dusk' ? 0.35 : 0.75,
                  animationDuration: `${2.2 + (i % 3)}s`,
                }}
              />
            ))}

            {/* Warm Crescent Moon */}
            <div
              className={`absolute top-6 right-6 sm:top-12 sm:right-16 w-10 h-10 sm:w-16 sm:h-16 rounded-full transition-all duration-1000 ${
                stage === 'dusk'
                  ? 'bg-[#E2E8F0]/20 shadow-[0_0_25px_rgba(226,232,240,0.2)]'
                  : 'bg-[#FFF8E1]/85 shadow-[0_0_55px_rgba(255,224,130,0.8)] scale-105'
              }`}
            />
          </div>

          {/* Warm Sunset/Golden Horizon Glow when Streetlights Turn On */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
              stage === 'lit' ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background:
                'radial-gradient(circle at 50% 48%, rgba(255, 224, 130, 0.42) 0%, rgba(255, 183, 77, 0.18) 48%, transparent 80%)',
            }}
          />

          {/* Floating Golden Sky Lanterns */}
          {stage === 'lit' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
              {[12, 28, 46, 66, 84].map((leftPct, idx) => (
                <div
                  key={idx}
                  className="animate-lantern absolute bottom-[40%] flex flex-col items-center"
                  style={{
                    left: `${leftPct}%`,
                    animationDelay: `${idx * 0.45}s`,
                  }}
                >
                  <div className="w-3 h-4 sm:w-3.5 sm:h-5 rounded-t-full rounded-b-sm bg-gradient-to-b from-[#FFE082] to-[#FF8F00] shadow-[0_0_16px_4px_rgba(255,200,60,0.85)]" />
                  <div className="w-1 h-1 rounded-full bg-white -mt-1" />
                </div>
              ))}
            </div>
          )}

          {/* TOP TITLE AREA: Responsive Typography for Mobile & Desktop */}
          <div className="relative z-20 pt-12 sm:pt-16 px-4 sm:px-6 text-center">
            {stage === 'dusk' ? (
              <div className="animate-fade-up max-w-lg mx-auto">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[#FDE68A] text-[10px] sm:text-xs uppercase tracking-[0.2em] shadow-sm">
                  💡 Tap to Switch On the Bridge Lights
                </span>
                <h2 className="font-serif-wedding text-3xl sm:text-5xl text-white font-normal mt-4 tracking-wide leading-tight">
                  Welcome to Rajamahendravaram
                </h2>
                <p className="text-xs sm:text-sm text-white/75 mt-2 font-light px-2">
                  Touch anywhere on the Godavari Bridge to illuminate the evening sky
                </p>
              </div>
            ) : (
              <div className="animate-fade-up max-w-2xl mx-auto">
                <p className="text-[11px] sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.32em] text-[#FFE082] font-medium leading-relaxed">
                  We invite you to celebrate the union of
                </p>
                <h1 className="font-script text-5xl sm:text-7xl md:text-8xl text-[#FFFDF9] mt-2 leading-tight drop-shadow-[0_4px_24px_rgba(255,200,80,0.85)]">
                  Vijay{' '}
                  <span className="font-serif-wedding italic text-2xl sm:text-5xl text-[#FFE082] mx-1">
                    and
                  </span>{' '}
                  Shradha
                </h1>

                {/* Mobile & Desktop Prominent Open Button */}
                <div className="mt-6 sm:mt-8">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setStage('opened');
                    }}
                    className="animate-bounce px-6 py-2.5 sm:px-8 sm:py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#FFFDF9] text-[11px] sm:text-sm uppercase tracking-[0.18em] font-semibold shadow-[0_0_25px_rgba(255,213,79,0.75)] hover:brightness-110 active:scale-95 transition"
                  >
                    ✨ Open Wedding Invitation →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ===============================================================
              PROPORTIONAL BRIDGE ILLUSTRATION
          =============================================================== */}
          <div className="relative z-20 w-full flex flex-col justify-end flex-1 mt-2">
            <div className="relative w-full h-[52dvh] sm:h-[370px] max-h-[420px]">
              <svg
                viewBox="0 0 1200 380"
                className="w-full h-full block"
                preserveAspectRatio="xMidYMax slice"
              >
                <defs>
                  <linearGradient id="lampBeam" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFF59D" stopOpacity="0.85" />
                    <stop offset="55%" stopColor="#FFD54F" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#FFB300" stopOpacity="0" />
                  </linearGradient>

                  <radialGradient id="bulbHalo" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                    <stop offset="35%" stopColor="#FFE082" stopOpacity="0.95" />
                    <stop offset="70%" stopColor="#FFB300" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#FF8F00" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="roadGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFE082" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#FFD54F" stopOpacity="0" />
                  </radialGradient>

                  <linearGradient id="riverWater" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1E293B" stopOpacity="0.88" />
                    <stop offset="100%" stopColor="#0F172A" stopOpacity="1" />
                  </linearGradient>
                </defs>

                {/* Distant Rajamahendravaram Riverbank Silhouette */}
                <path
                  d="M 0 215 Q 180 198 350 212 T 720 205 T 1050 210 L 1200 215 L 1200 235 L 0 235 Z"
                  fill="#1E293B"
                  opacity="0.55"
                />

                {/* 4 ICONIC BOWSTRING TRUSS ARCHES */}
                {[30, 320, 610, 900].map((startX, archIdx) => {
                  const spanWidth = 270;
                  const isArchLit = litLamps > archIdx * 3;

                  return (
                    <g key={archIdx}>
                      <path
                        d={`M ${startX} 214 Q ${startX + spanWidth / 2} 62 ${startX + spanWidth} 214`}
                        fill="none"
                        stroke={isArchLit ? '#E6C687' : '#64748B'}
                        strokeWidth="5.5"
                        className="transition-colors duration-700"
                      />
                      <path
                        d={`M ${startX + 10} 214 Q ${startX + spanWidth / 2} 84 ${startX + spanWidth - 10} 214`}
                        fill="none"
                        stroke={isArchLit ? '#D4AF37' : '#475569'}
                        strokeWidth="2.5"
                        className="transition-colors duration-700"
                      />

                      {[0.14, 0.26, 0.38, 0.5, 0.62, 0.74, 0.86].map((t, cIdx) => {
                        const x = startX + spanWidth * t;
                        const archY = 214 - 4 * 142 * t * (1 - t);
                        return (
                          <g key={cIdx}>
                            <line
                              x1={x}
                              y1={archY}
                              x2={x}
                              y2={214}
                              stroke={isArchLit ? '#C5A059' : '#475569'}
                              strokeWidth="1.4"
                              opacity="0.75"
                            />
                            {cIdx < 6 && (
                              <line
                                x1={x}
                                y1={archY}
                                x2={startX + spanWidth * (t + 0.12)}
                                y2={214}
                                stroke={isArchLit ? '#C5A059' : '#475569'}
                                strokeWidth="0.9"
                                opacity="0.4"
                              />
                            )}
                          </g>
                        );
                      })}

                      {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((t, bIdx) => {
                        const x = startX + spanWidth * t;
                        const archY = 214 - 4 * 152 * t * (1 - t);
                        return (
                          <g key={bIdx}>
                            {isArchLit && (
                              <circle cx={x} cy={archY} r="7" fill="url(#bulbHalo)" />
                            )}
                            <circle
                              cx={x}
                              cy={archY}
                              r={isArchLit ? 2.8 : 1.5}
                              fill={isArchLit ? '#FFFDF7' : '#475569'}
                              className="transition-all duration-500"
                            />
                          </g>
                        );
                      })}
                    </g>
                  );
                })}

                {/* 16 REALISTIC DOUBLE-ARM STREET LIGHT POLES */}
                {[...Array(TOTAL_STREETLIGHTS)].map((_, i) => {
                  const poleX = 42 + i * 74;
                  const isLampOn = i < litLamps;

                  return (
                    <g key={i}>
                      <line
                        x1={poleX}
                        y1={214}
                        x2={poleX}
                        y2={146}
                        stroke={isLampOn ? '#E2E8F0' : '#475569'}
                        strokeWidth="2.4"
                        className="transition-colors duration-300"
                      />
                      <path
                        d={`M ${poleX} 150 Q ${poleX - 4} 140 ${poleX - 12} 140`}
                        fill="none"
                        stroke={isLampOn ? '#E2E8F0' : '#475569'}
                        strokeWidth="1.8"
                      />
                      <path
                        d={`M ${poleX} 150 Q ${poleX + 4} 140 ${poleX + 12} 140`}
                        fill="none"
                        stroke={isLampOn ? '#E2E8F0' : '#475569'}
                        strokeWidth="1.8"
                      />

                      <ellipse
                        cx={poleX - 13}
                        cy={140}
                        rx="4"
                        ry="2"
                        fill={isLampOn ? '#FFFDE7' : '#334155'}
                      />
                      <ellipse
                        cx={poleX + 13}
                        cy={140}
                        rx="4"
                        ry="2"
                        fill={isLampOn ? '#FFFDE7' : '#334155'}
                      />

                      {isLampOn && (
                        <g className="transition-opacity duration-500">
                          <polygon
                            points={`${poleX - 13},141 ${poleX + 13},141 ${poleX + 48},214 ${poleX - 48},214`}
                            fill="url(#lampBeam)"
                          />
                          <circle cx={poleX - 13} cy={141} r="16" fill="url(#bulbHalo)" />
                          <circle cx={poleX - 13} cy={140} r="3.2" fill="#FFFFFF" />

                          <circle cx={poleX + 13} cy={141} r="16" fill="url(#bulbHalo)" />
                          <circle cx={poleX + 13} cy={140} r="3.2" fill="#FFFFFF" />

                          <ellipse
                            cx={poleX}
                            cy={214}
                            rx="36"
                            ry="4"
                            fill="url(#roadGlow)"
                          />
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Upper Roadway Deck */}
                <rect
                  x="0"
                  y="212"
                  width="1200"
                  height="6"
                  fill={litLamps > 0 ? '#CBD5E1' : '#334155'}
                  className="transition-colors duration-700"
                />
                <line
                  x1="0"
                  y1="212"
                  x2={litLamps * 76}
                  y2="212"
                  stroke="#FFE082"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />

                {/* Lower Railway Truss Deck */}
                <rect x="0" y="218" width="1200" height="18" fill="#1E293B" opacity="0.7" />
                <rect x="0" y="234" width="1200" height="5" fill="#334155" />

                {[...Array(48)].map((_, gIdx) => (
                  <path
                    key={gIdx}
                    d={`M ${gIdx * 25} 218 L ${gIdx * 25 + 12.5} 234 L ${gIdx * 25 + 25} 218`}
                    fill="none"
                    stroke={allLampsLit ? '#94A3B8' : '#475569'}
                    strokeWidth="1.2"
                    opacity="0.65"
                  />
                ))}

                {/* ANIMATED GLOWING PASSENGER TRAIN */}
                {stage === 'lit' && (
                  <g className="animate-train">
                    {[0, 62, 124, 186, 248].map((coachOffset, cIdx) => (
                      <g key={cIdx} transform={`translate(${coachOffset}, 221)`}>
                        <rect
                          x="0"
                          y="0"
                          width="56"
                          height="11"
                          rx="2"
                          fill="#334155"
                          stroke="#94A3B8"
                          strokeWidth="0.8"
                        />
                        {[6, 16, 26, 36, 46].map((wx, wIdx) => (
                          <rect
                            key={wIdx}
                            x={wx}
                            y="3"
                            width="6"
                            height="4.5"
                            rx="0.8"
                            fill="#FFE082"
                          />
                        ))}
                      </g>
                    ))}
                    <polygon
                      points="306,226 365,218 365,234"
                      fill="#FFF59D"
                      opacity="0.55"
                    />
                  </g>
                )}

                {/* Concrete Bridge Piers */}
                {[30, 300, 320, 590, 610, 880, 900, 1170].map((px, pIdx) => (
                  <g key={pIdx}>
                    <rect
                      x={px - 10}
                      y="238"
                      width="20"
                      height="52"
                      fill={allLampsLit ? '#475569' : '#334155'}
                      rx="2"
                    />
                    <rect x={px - 14} y="282" width="28" height="10" fill="#1E293B" rx="2" />
                  </g>
                ))}

                {/* GODAVARI RIVER WATER & SHIMMERING REFLECTIONS */}
                <rect x="0" y="290" width="1200" height="90" fill="url(#riverWater)" />

                {[...Array(TOTAL_STREETLIGHTS)].map((_, i) => {
                  const refX = 42 + i * 74;
                  const isLampOn = i < litLamps;
                  if (!isLampOn) return null;

                  return (
                    <g key={i} className="animate-water-ripple">
                      <ellipse cx={refX} cy="300" rx="24" ry="3" fill="#FFE082" opacity="0.7" />
                      <ellipse cx={refX} cy="312" rx="19" ry="2.5" fill="#FFD54F" opacity="0.5" />
                      <ellipse cx={refX} cy="325" rx="14" ry="2" fill="#FFB300" opacity="0.35" />
                      <ellipse cx={refX} cy="338" rx="8" ry="1.5" fill="#FF8F00" opacity="0.2" />
                    </g>
                  );
                })}

                {/* River Boat & Floating Golden Diyas */}
                {stage === 'lit' && (
                  <>
                    <g className="animate-boat" transform="translate(480, 315)">
                      <path d="M 0 0 L 46 0 L 38 8 L 8 8 Z" fill="#0F172A" />
                      <path d="M 18 0 L 23 -16 L 34 -2 Z" fill="#1E293B" />
                      <circle cx="38" cy="-2" r="2.5" fill="#FFE082" />
                      <circle cx="38" cy="-2" r="8" fill="url(#bulbHalo)" />
                    </g>

                    {[280, 420, 560, 650, 740, 880].map((dx, dIdx) => (
                      <g
                        key={dIdx}
                        className="animate-boat"
                        transform={`translate(${dx}, ${328 + (dIdx % 3) * 12})`}
                      >
                        <path d="M -5 0 L 5 0 L 3 3 L -3 3 Z" fill="#78350F" />
                        <circle cx="0" cy="-1.5" r="2" fill="#FFF8E1" />
                        <circle cx="0" cy="-1.5" r="7" fill="url(#bulbHalo)" />
                      </g>
                    ))}
                  </>
                )}
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MAIN INVITATION PAGE
      ===================================================================== */}

      {/* Soft Floating Gold Petals */}
      <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className="animate-petal absolute block rounded-full"
            style={{
              left: `${(i * 10) % 100}%`,
              width: `${8 + (i % 3) * 3}px`,
              height: `${10 + (i % 3) * 3}px`,
              background: i % 2 === 0 ? '#D4AF37' : '#E6CBA8',
              borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
              animationDuration: `${13 + (i % 5) * 2}s`,
              animationDelay: `${(i % 4) * 1.5}s`,
            }}
          />
        ))}
      </div>

      {/* SLEEK UNIFIED SINGLE-ROW BOTTOM NAVIGATION DOCK (GALLERY REMOVED) */}
      <div className="fixed bottom-3 sm:bottom-5 inset-x-0 z-40 flex justify-center px-3 pointer-events-none">
        <div className="pointer-events-auto relative inline-flex items-center gap-1 sm:gap-2 bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-full shadow-[0_10px_30px_rgba(44,37,32,0.18)] border border-[#C5A059]/45 max-w-full">
          {/* Invite Page Tab */}
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-3 sm:px-5 py-1.5 rounded-full text-[11px] sm:text-xs font-medium tracking-wider uppercase transition whitespace-nowrap bg-[#9E7B3B] text-white shadow-sm"
          >
            💌 Invite
          </button>

          <span className="h-4 w-[1px] bg-[#C5A059]/30 mx-1" />

          {/* Replay Bridge Button */}
          <button
            onClick={() => setStage('dusk')}
            className="px-2.5 sm:px-4 py-1.5 rounded-full text-[#7A5C29] hover:bg-[#FAF3E3] text-[11px] sm:text-xs font-medium transition whitespace-nowrap"
            title="Replay Godavari Bridge Lights"
          >
            🌉 Bridge
          </button>

          {/* Mute / Unmute Toggle */}
          <button
            onClick={toggleMusic}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF3E3] text-[#7A5C29] flex items-center justify-center text-xs sm:text-sm hover:scale-105 transition shrink-0"
            title="Mute / Unmute Custom Music"
          >
            {isPlayingMusic ? '🔊' : '🔇'}
          </button>
        </div>
      </div>

      {/* HERO SECTION: LIGHT MODERN CARD WITH UPDATED MATTER */}
      <section className="relative pt-6 pb-8 sm:py-16 px-3.5 sm:px-4 flex justify-center items-center">
        <div className="natural-paper-card max-w-xl w-full rounded-[6px] px-5 py-10 sm:px-16 sm:py-20 text-center relative">
          <div className="absolute inset-2.5 sm:inset-4 border border-[#C5A059]/30 pointer-events-none" />

          {/* Sacred Golden Trishul & Damaru Emblem */}
          <div className="flex justify-center mb-5 sm:mb-8">
            <svg
              className="w-9 h-12 sm:w-10 sm:h-14 text-[#A68446]"
              viewBox="0 0 64 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="32" y1="10" x2="32" y2="72" />
              <path d="M27 18 L32 8 L37 18" />
              <path d="M32 34 C16 34, 14 20, 18 12 C20 18, 22 25, 32 28" />
              <path d="M32 34 C48 34, 50 20, 46 12 C44 18, 42 25, 32 28" />
              <polygon points="22,43 32,48 22,53" />
              <polygon points="42,43 32,48 42,53" />
              <path d="M45 36 A6 6 0 1 0 53 44 A5 5 0 1 1 45 36 Z" />
            </svg>
          </div>

          <p className="text-xs sm:text-base uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#3A302A] font-medium leading-relaxed px-2">
            ✦ YOU ARE INVITED ✦
          </p>

          {/* Vijay AND Shradha */}
          <div className="my-7 sm:my-10">
            <h1 className="font-serif-wedding text-5xl sm:text-7xl text-[#9E7B3B] font-normal tracking-wide">
              Vijay
            </h1>

            <div className="flex items-center justify-center gap-3 sm:gap-4 my-2.5 sm:my-3.5">
              <span className="h-[1px] w-10 sm:w-16 bg-[#9E7B3B]/40" />
              <span className="font-serif-wedding text-base sm:text-xl tracking-[0.2em] uppercase text-[#2C2520]">
                AND
              </span>
              <span className="h-[1px] w-10 sm:w-16 bg-[#9E7B3B]/40" />
            </div>

            <h1 className="font-serif-wedding text-5xl sm:text-7xl text-[#9E7B3B] font-normal tracking-wide">
              Shradha
            </h1>
          </div>


          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#2C2520] font-medium mt-2 sm:mt-4">
            ARE TYING THE KNOT
          </p>

          <p className="font-serif-wedding text-xl sm:text-[28px] text-[#9E7B3B] font-semibold tracking-wider mt-3 sm:mt-4">
            THURSDAY, DECEMBER 3, 2026
          </p>

          {/* Dinner & Reception */}
          <div className="mt-6 sm:mt-8">
            <p className="font-serif-wedding text-base sm:text-xl text-[#2C2520] font-semibold tracking-[0.14em] uppercase">
              DINNER &amp; RECEPTION
            </p>
            <p className="font-serif-wedding text-base sm:text-lg text-[#5C4D42] mt-0.5">
              7:00 PM onwards
            </p>
          </div>

          {/* Muhurtham */}
          <div className="mt-5 sm:mt-6">
            <p className="font-serif-wedding text-base sm:text-xl text-[#2C2520] font-semibold tracking-[0.14em] uppercase">
              MUHURTHAM
            </p>
            <p className="font-serif-wedding text-base sm:text-lg text-[#5C4D42] mt-0.5">
              4:42 AM (Early hours of Friday, Dec 4)
            </p>
          </div>

          {/* Venue Details on Card */}
          <div className="mt-7 sm:mt-9 pt-6 sm:pt-7 border-t border-[#C5A059]/30">
            <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#5C4D42] font-medium">
              VENUE
            </p>
            <h2 className="font-serif-wedding text-xl sm:text-2xl font-semibold text-[#9E7B3B] mt-1.5 tracking-wider">
              J.K. GARDENS, J.N. ROAD
            </h2>
            <p className="font-serif-wedding text-lg sm:text-xl uppercase tracking-[0.16em] text-[#9E7B3B] mt-0.5 font-semibold">
              RAJAHMUNDRY.
            </p>
          </div>
        </div>
      </section>

      {/* PARENTS & FAMILY BLESSINGS */}
      <section className="py-4 sm:py-6 px-3.5 sm:px-4 max-w-xl mx-auto text-center">
        <div className="natural-paper-card rounded-[6px] p-6 sm:p-10">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#8B6F4E]">
            With the Blessings of
          </p>
          <p className="font-serif-wedding italic text-base sm:text-lg text-[#2C2520] mt-1">
            Sri Mathala Venkata Ramana (Late) &amp; Smt. Lakshmi
          </p>

          <div className="h-[1px] w-14 bg-[#C5A059]/35 mx-auto my-4 sm:my-5" />

          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#6E5A4F]">
            Hosted By
          </p>
          <h3 className="font-serif-wedding text-xl sm:text-3xl font-semibold text-[#9E7B3B] mt-1">
            Sri Mathala Ramesh &amp; Smt. Madhavi Sreelatha
          </h3>

          <div className="mt-5 space-y-2.5 text-xs sm:text-sm text-[#4A3B32] leading-relaxed">
            <p>
              <span className="font-semibold text-[#2C2520]">Groom:</span> Chi. Vijay Sri Venkata
              Krishna Roy
            </p>
            <p>
              <span className="font-semibold text-[#2C2520]">Bride:</span> Chi. La. Sow. Shradha{' '}
              <br />
              <span className="text-[11px] sm:text-xs text-[#6E5A4F]">
                (Only daughter of Sri Manish Paigwar (Late) &amp; Smt. Mamta Paigwar of Hyderabad)
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE SCRATCH CARD & COUNTDOWN */}
      <section className="py-8 sm:py-10 px-3.5 sm:px-4 max-w-4xl mx-auto text-center">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#8B6F4E]">
          Interactive Reveal
        </span>
        <h2 className="font-serif-wedding text-2xl sm:text-4xl font-semibold text-[#2C2520] mt-1 mb-5">
          Scratch to Unlock the Muhurtham Time
        </h2>

        <ScratchCard />

        {/* Live Countdown */}
        <div className="mt-8 grid grid-cols-4 gap-2 sm:gap-5 max-w-md mx-auto">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Mins', value: timeLeft.minutes },
            { label: 'Secs', value: timeLeft.seconds },
          ].map((item) => (
            <div key={item.label} className="natural-paper-card rounded-lg py-3 px-1.5 sm:p-4">
              <div className="font-serif-wedding text-2xl sm:text-4xl font-bold text-[#9E7B3B]">
                {String(item.value).padStart(2, '0')}
              </div>
              <div className="text-[9px] sm:text-xs uppercase tracking-widest text-[#6E5A4F] mt-0.5">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VENUE & GOOGLE MAPS DIRECTIONS */}
      <section className="py-6 sm:py-8 px-3.5 sm:px-4 max-w-xl mx-auto">
        <div className="natural-paper-card rounded-[6px] p-6 sm:p-9 text-center">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-[#8B6F4E]">
            Wedding Venue &amp; Directions
          </p>
          <h3 className="font-serif-wedding text-2xl sm:text-3xl font-semibold text-[#2C2520] mt-1">
            J.K. Gardens
          </h3>
          <p className="text-xs sm:text-sm uppercase tracking-wider text-[#4A3B32] mt-1">
            J.N. Road, Rajahmundry, Andhra Pradesh
          </p>
          <p className="text-xs text-[#9E7B3B] font-semibold mt-3 leading-relaxed">
            Dinner &amp; Reception: Dec 3, 7:00 PM onwards <br className="sm:hidden" />
            <span className="hidden sm:inline"> • </span>
            Muhurtham: 4:42 AM (Early hours of Friday, Dec 4)
          </p>

          <div className="mt-5 flex flex-col sm:flex-row justify-center gap-2.5 sm:gap-3">
            <a
              href="https://www.google.com/maps/search/?api=1&query=J.K.+Gardens+J.N.+Road+Rajahmundry"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-full bg-[#9E7B3B] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#86662E] transition shadow-sm"
            >
              📍 Open in Google Maps
            </a>
            <button
              onClick={addToGoogleCalendar}
              className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-full border border-[#C5A059] text-[#2C2520] text-xs uppercase tracking-widest font-medium hover:bg-[#C5A059]/10 transition"
            >
              📅 Save to Calendar
            </button>
          </div>
        </div>
      </section>

      {/* COMPLIMENTS & FRIENDS SHARE SECTION */}
      <section className="pt-6 pb-28 px-4 max-w-xl mx-auto text-center">
        <p className="font-serif-wedding italic text-xl text-[#6E5A4F]">
          With Best Compliments From
        </p>
        <p className="text-[11px] sm:text-xs text-[#4A3B32] mt-2 leading-relaxed">
          Smt &amp; Sri. Dr. Kamireddy Venkata Ramana • Smt &amp; Sri. Mathala Sreemannarayana •
          Dr. Mathala Surya Prakasha Rao, Mathala Brothers • Smt &amp; Sri. Mathala Ramakrishna •
          Smt &amp; Sri. Mathala Hemanth • Sri Gedela Demudu (Late), Smt. Vijayalakshmi • Smt &amp;
          Sri. Randhi S.V.S. Sridhar • Smt &amp; Sri. Akkina Venkata Srinivasa Rao • Rajamahendri
          Charitable Trust &amp; Near &amp; Dear
        </p>

        <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3 px-4 sm:px-0">
          <button
            onClick={triggerShower}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#9E7B3B] to-[#C5A059] text-white font-medium text-xs uppercase tracking-widest shadow-sm hover:brightness-105 active:scale-95 transition-all"
          >
            {wishesSent ? '✨ Blessings Sent!' : '✨ Shower Blessings'}
          </button>

          <button
            onClick={shareOnWhatsApp}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white border border-[#C5A059] text-[#7A5C29] font-medium text-xs uppercase tracking-widest shadow-sm hover:bg-[#FAF6EE] active:scale-95 transition-all"
          >
            📲 Share Invite with Friends
          </button>
        </div>

        <p className="mt-9 font-serif-wedding text-2xl text-[#9E7B3B] tracking-widest uppercase">
          Vijay &amp; Shradha
        </p>
      </section>
    </div>
  );
}

export default App;