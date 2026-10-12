import { useId, type ReactNode } from 'react'
import type { ArtTone, ArtVariant } from '@/content/types'

/**
 * Art-directed architectural compositions.
 *
 * These stand in for photography until authentic Projects World images are
 * supplied. They are drawn as line-and-tone illustrations on purpose: they
 * read as intentional art direction and can never be mistaken for a
 * photograph of client work.
 */

interface Palette {
  bg0: string
  bg1: string
  line: string
  fill: string
  fill2: string
  glow: string
  grain: number
}

const palettes: Record<ArtTone, Palette> = {
  ivory: { bg0: '#F3EEE6', bg1: '#E2D9CB', line: '#2A2825', fill: '#D9CFBF', fill2: '#CBBFAC', glow: '#FFFDF8', grain: 0.07 },
  stone: { bg0: '#DCD4C7', bg1: '#B9AF9F', line: '#2A2825', fill: '#C9BFAF', fill2: '#A99E8C', glow: '#F6F0E6', grain: 0.08 },
  charcoal: { bg0: '#33302C', bg1: '#161514', line: '#CDB592', fill: '#2B2825', fill2: '#3D3934', glow: '#E8D3AE', grain: 0.1 },
  bronze: { bg0: '#B89C74', bg1: '#6E5537', line: '#FBF6EE', fill: '#A38862', fill2: '#8D7350', glow: '#F7E8CF', grain: 0.09 },
}

type Scene = (p: Palette, id: string) => ReactNode

const FLOOR = 860

/** Shared room shell: wall, skirting and receding floor. */
function Room({ p, id, horizon = FLOOR }: { p: Palette; id: string; horizon?: number }) {
  return (
    <>
      <rect width="1200" height={horizon} fill={`url(#${id}-wall)`} />
      <rect y={horizon} width="1200" height={1200 - horizon} fill={`url(#${id}-floor)`} />
      <line x1="0" x2="1200" y1={horizon} y2={horizon} stroke={p.line} strokeOpacity="0.45" />
      <line x1="0" x2="1200" y1={horizon - 14} y2={horizon - 14} stroke={p.line} strokeOpacity="0.18" />
    </>
  )
}

const scenes: Record<ArtVariant, Scene> = {
  lounge: (p, id) => (
    <>
      <Room p={p} id={id} />
      {/* Arched window and the light it throws */}
      <path d="M250 860 V430 A160 160 0 0 1 570 430 V860 Z" fill={p.glow} fillOpacity="0.55" />
      <path d="M250 860 L570 860 L860 1200 L360 1200 Z" fill={p.glow} fillOpacity="0.22" />
      <g stroke={p.line} strokeOpacity="0.7" fill="none">
        <path d="M250 860 V430 A160 160 0 0 1 570 430 V860" />
        <path d="M270 860 V432 A140 140 0 0 1 550 432 V860" strokeOpacity="0.35" />
        <line x1="410" x2="410" y1="272" y2="860" strokeOpacity="0.4" />
        <line x1="270" x2="550" y1="560" y2="560" strokeOpacity="0.35" />
        <line x1="270" x2="550" y1="710" y2="710" strokeOpacity="0.35" />
      </g>
      {/* Armchair */}
      <g stroke={p.line} strokeOpacity="0.85">
        <rect x="668" y="590" width="210" height="130" rx="46" fill={p.fill2} />
        <rect x="640" y="676" width="266" height="124" rx="30" fill={p.fill} />
        <path d="M676 724 H870" strokeOpacity="0.35" fill="none" />
        <path d="M670 800 L656 860 M876 800 L890 860" fill="none" />
      </g>
      {/* Side table and floor lamp */}
      <g stroke={p.line} strokeOpacity="0.8" fill="none">
        <ellipse cx="990" cy="760" rx="60" ry="12" fill={p.fill2} />
        <path d="M990 772 V860 M960 860 H1020" />
        <path d="M1080 860 V430 M1050 860 H1110" />
        <path d="M1030 430 L1130 430 L1112 360 L1048 360 Z" fill={p.glow} fillOpacity="0.8" />
      </g>
      <ellipse cx="1080" cy="430" rx="140" ry="40" fill={p.glow} fillOpacity="0.12" />
      {/* Rug */}
      <path d="M560 930 L1010 930 L1120 1060 L470 1060 Z" fill={p.fill} fillOpacity="0.5" stroke={p.line} strokeOpacity="0.25" />
    </>
  ),

  sofa: (p, id) => (
    <>
      <Room p={p} id={id} />
      {/* Wall panelling */}
      <g stroke={p.line} strokeOpacity="0.18" fill="none">
        {[80, 330, 580, 830].map((x) => (
          <rect key={x} x={x} y="180" width="220" height="560" />
        ))}
      </g>
      {/* Artwork */}
      <rect x="440" y="290" width="320" height="220" fill={p.fill2} stroke={p.line} strokeOpacity="0.6" />
      <path d="M470 470 C540 380 600 440 650 360 S730 330 730 330" stroke={p.line} strokeOpacity="0.45" fill="none" />
      {/* Sofa */}
      <g stroke={p.line} strokeOpacity="0.85">
        <rect x="300" y="608" width="600" height="110" rx="34" fill={p.fill2} />
        <rect x="270" y="690" width="660" height="112" rx="26" fill={p.fill} />
        <path d="M500 700 V790 M700 700 V790" strokeOpacity="0.3" fill="none" />
        <rect x="330" y="630" width="90" height="70" rx="20" fill={p.fill} strokeOpacity="0.5" />
        <rect x="780" y="630" width="90" height="70" rx="20" fill={p.fill} strokeOpacity="0.5" />
        <path d="M300 802 L292 860 M900 802 L908 860" fill="none" />
      </g>
      {/* Side table and arc lamp */}
      <g stroke={p.line} strokeOpacity="0.8" fill="none">
        <rect x="140" y="740" width="90" height="120" rx="6" fill={p.fill2} />
        <path d="M1060 860 C1060 520 980 400 820 420" />
        <path d="M770 430 A50 34 0 0 1 870 430 Z" fill={p.glow} fillOpacity="0.85" />
        <ellipse cx="1060" cy="860" rx="44" ry="8" fill={p.fill2} />
      </g>
      <ellipse cx="820" cy="560" rx="120" ry="160" fill={p.glow} fillOpacity="0.08" />
      <path d="M200 920 L1000 920 L1100 1080 L100 1080 Z" fill={p.fill} fillOpacity="0.45" stroke={p.line} strokeOpacity="0.2" />
    </>
  ),

  office: (p, id) => (
    <>
      <Room p={p} id={id} horizon={780} />
      {/* Curtain wall */}
      <rect x="120" y="150" width="960" height="560" fill={p.glow} fillOpacity="0.28" />
      <g stroke={p.line} strokeOpacity="0.35">
        {[120, 312, 504, 696, 888, 1080].map((x) => (
          <line key={x} x1={x} x2={x} y1="150" y2="710" />
        ))}
        <line x1="120" x2="1080" y1="150" y2="150" />
        <line x1="120" x2="1080" y1="420" y2="420" strokeOpacity="0.2" />
        <line x1="120" x2="1080" y1="710" y2="710" />
      </g>
      {/* Pendants */}
      <g stroke={p.line} strokeOpacity="0.7">
        {[440, 600, 760].map((x) => (
          <g key={x}>
            <line x1={x} x2={x} y1="0" y2="330" />
            <ellipse cx={x} cy="338" rx="46" ry="9" fill={p.glow} fillOpacity="0.9" />
          </g>
        ))}
      </g>
      {/* Boardroom table in perspective, with chairs */}
      <g stroke={p.line} strokeOpacity="0.85">
        {[0, 1, 2, 3].map((i) => {
          const y = 760 + i * 70
          const s = 1 + i * 0.22
          const lx = 470 - i * 70
          const rx = 730 + i * 70
          return (
            <g key={i}>
              <rect x={lx - 70 * s} y={y - 40 * s} width={56 * s} height={70 * s} rx={12 * s} fill={p.fill2} />
              <rect x={rx + 14 * s} y={y - 40 * s} width={56 * s} height={70 * s} rx={12 * s} fill={p.fill2} />
            </g>
          )
        })}
        <path d="M470 740 L730 740 L960 1050 L240 1050 Z" fill={p.fill} />
        <path d="M240 1050 L960 1050 L960 1072 L240 1072 Z" fill={p.fill2} />
      </g>
      <path d="M520 760 L680 760 L820 1030 L380 1030 Z" fill={p.glow} fillOpacity="0.12" />
    </>
  ),

  hotel: (p, id) => (
    <>
      <Room p={p} id={id} />
      {/* Headboard with channel tufting */}
      <g stroke={p.line} strokeOpacity="0.85">
        <rect x="370" y="440" width="460" height="300" rx="18" fill={p.fill2} />
        {[430, 490, 550, 610, 670, 730, 790].map((x) => (
          <line key={x} x1={x} x2={x} y1="458" y2="722" strokeOpacity="0.3" />
        ))}
        {/* Bed */}
        <rect x="330" y="690" width="540" height="140" rx="14" fill={p.fill} />
        <rect x="400" y="650" width="170" height="64" rx="22" fill={p.glow} fillOpacity="0.8" />
        <rect x="630" y="650" width="170" height="64" rx="22" fill={p.glow} fillOpacity="0.8" />
        <rect x="330" y="760" width="540" height="40" fill={p.fill2} strokeOpacity="0.5" />
        <path d="M344 830 V860 M856 830 V860" fill="none" />
      </g>
      {/* Nightstands, lamps and sconces */}
      <g stroke={p.line} strokeOpacity="0.8">
        <rect x="190" y="740" width="120" height="120" rx="6" fill={p.fill2} />
        <rect x="890" y="740" width="120" height="120" rx="6" fill={p.fill2} />
        <path d="M250 740 V680 M950 740 V680" fill="none" />
        <path d="M215 680 H285 L270 630 H230 Z M915 680 H985 L970 630 H930 Z" fill={p.glow} fillOpacity="0.85" />
        <path d="M250 520 V470 M950 520 V470" fill="none" />
        <rect x="232" y="440" width="36" height="34" rx="4" fill={p.glow} fillOpacity="0.85" />
        <rect x="932" y="440" width="36" height="34" rx="4" fill={p.glow} fillOpacity="0.85" />
      </g>
      <ellipse cx="250" cy="560" rx="80" ry="160" fill={p.glow} fillOpacity="0.1" />
      <ellipse cx="950" cy="560" rx="80" ry="160" fill={p.glow} fillOpacity="0.1" />
      <path d="M260 900 L940 900 L1040 1070 L160 1070 Z" fill={p.fill} fillOpacity="0.45" stroke={p.line} strokeOpacity="0.2" />
    </>
  ),

  plan: (p, id) => (
    <>
      <rect width="1200" height="1200" fill={`url(#${id}-wall)`} />
      {/* Drafting grid */}
      <g stroke={p.line} strokeOpacity="0.07">
        {Array.from({ length: 24 }, (_, i) => (
          <line key={`v${i}`} x1={i * 50} x2={i * 50} y1="0" y2="1200" />
        ))}
        {Array.from({ length: 24 }, (_, i) => (
          <line key={`h${i}`} x1="0" x2="1200" y1={i * 50} y2={i * 50} />
        ))}
      </g>
      {/* Walls */}
      <g stroke={p.line} strokeOpacity="0.85" fill="none" strokeWidth="2.5">
        <path d="M200 200 H1000 V1000 H620 M520 1000 H200 V200" />
        <path d="M640 200 V560 H1000" />
        <path d="M200 640 H420" />
      </g>
      <g stroke={p.line} strokeOpacity="0.55" fill="none">
        <path d="M520 1000 A100 100 0 0 1 620 900" />
        <line x1="620" x2="620" y1="900" y2="1000" />
        <path d="M420 640 A90 90 0 0 0 510 730" strokeOpacity="0.4" />
      </g>
      {/* Furniture */}
      <g stroke={p.line} strokeOpacity="0.7">
        <rect x="250" y="250" width="320" height="90" rx="10" fill={p.fill} />
        <rect x="320" y="400" width="180" height="120" rx="6" fill={p.fill2} />
        <rect x="250" y="400" width="44" height="120" rx="8" fill={p.fill} />
        <rect x="526" y="400" width="44" height="120" rx="8" fill={p.fill} />
        <circle cx="820" cy="380" r="90" fill={p.fill} />
        {[0, 60, 120, 180, 240, 300].map((a) => {
          const r = (a * Math.PI) / 180
          return <circle key={a} cx={820 + Math.cos(r) * 125} cy={380 + Math.sin(r) * 125} r="24" fill={p.fill2} />
        })}
        <rect x="700" y="680" width="240" height="250" rx="8" fill={p.fill} />
        <rect x="720" y="690" width="90" height="40" rx="10" fill={p.glow} fillOpacity="0.8" />
        <rect x="830" y="690" width="90" height="40" rx="10" fill={p.glow} fillOpacity="0.8" />
        <rect x="260" y="720" width="200" height="200" rx="6" fill={p.fill2} fillOpacity="0.7" />
      </g>
      {/* Dimension lines */}
      <g stroke={p.line} strokeOpacity="0.5" fill="none">
        <path d="M200 140 H1000 M200 128 V152 M1000 128 V152 M640 128 V152" />
        <path d="M1060 200 V1000 M1048 200 H1072 M1048 1000 H1072 M1048 560 H1072" />
      </g>
      <g fill={p.line} fillOpacity="0.55" fontFamily="ui-monospace, monospace" fontSize="20">
        <text x="400" y="128">4 400</text>
        <text x="800" y="128">3 600</text>
        <text x="1080" y="390">3 600</text>
        <text x="1080" y="790">4 400</text>
      </g>
    </>
  ),

  materials: (p, id) => (
    <>
      <rect width="1200" height="1200" fill={`url(#${id}-wall)`} />
      <ellipse cx="420" cy="300" rx="520" ry="380" fill={p.glow} fillOpacity="0.28" />
      {/* Timber swatch */}
      <g transform="rotate(-8 420 520)">
        <rect x="180" y="300" width="480" height="420" fill={p.fill2} stroke={p.line} strokeOpacity="0.5" />
        <g stroke={p.line} strokeOpacity="0.22" fill="none">
          {Array.from({ length: 14 }, (_, i) => (
            <path key={i} d={`M180 ${320 + i * 28} C320 ${300 + i * 28} 480 ${350 + i * 28} 660 ${318 + i * 28}`} />
          ))}
        </g>
      </g>
      {/* Marble swatch */}
      <g transform="rotate(6 800 640)">
        <rect x="580" y="420" width="440" height="440" fill={p.glow} fillOpacity="0.9" stroke={p.line} strokeOpacity="0.5" />
        <g stroke={p.line} strokeOpacity="0.28" fill="none">
          <path d="M590 520 C700 560 760 500 860 610 S980 700 1010 690" />
          <path d="M610 760 C700 700 820 780 900 720 S1000 640 1010 650" />
          <path d="M720 430 C740 520 700 600 780 700" strokeOpacity="0.16" />
        </g>
      </g>
      {/* Fabric swatch with weave */}
      <g transform="rotate(-3 470 870)">
        <rect x="300" y="720" width="380" height="300" fill={p.fill} stroke={p.line} strokeOpacity="0.5" />
        <g stroke={p.line} strokeOpacity="0.1">
          {Array.from({ length: 30 }, (_, i) => (
            <line key={i} x1={300 + i * 13} x2={300 + i * 13} y1="720" y2="1020" />
          ))}
          {Array.from({ length: 23 }, (_, i) => (
            <line key={`h${i}`} x1="300" x2="680" y1={720 + i * 13} y2={720 + i * 13} />
          ))}
        </g>
      </g>
      {/* Brushed metal bar */}
      <rect x="760" y="900" width="300" height="56" fill={`url(#${id}-metal)`} stroke={p.line} strokeOpacity="0.5" transform="rotate(-12 910 928)" />
    </>
  ),

  chair: (p, id) => (
    <>
      <rect width="1200" height="1200" fill={`url(#${id}-wall)`} />
      {/* Studio sweep and pool of light */}
      <ellipse cx="600" cy="520" rx="420" ry="460" fill={p.glow} fillOpacity="0.22" />
      <ellipse cx="600" cy="930" rx="380" ry="54" fill={p.line} fillOpacity="0.12" />
      <g stroke={p.line} strokeOpacity="0.85">
        {/* Wingback armchair */}
        <path d="M420 420 C420 330 500 300 600 300 C700 300 780 330 780 420 L780 700 L420 700 Z" fill={p.fill2} />
        <path d="M380 560 C380 520 420 500 450 520 L450 820 L380 820 Z" fill={p.fill} />
        <path d="M820 560 C820 520 780 500 750 520 L750 820 L820 820 Z" fill={p.fill} />
        <rect x="440" y="660" width="320" height="110" rx="24" fill={p.fill} />
        <rect x="380" y="770" width="440" height="60" rx="10" fill={p.fill2} />
        <path d="M400 830 L390 920 M800 830 L810 920 M460 830 L466 900 M740 830 L734 900" fill="none" />
        {/* Button tufting */}
        {[
          [520, 400],
          [600, 380],
          [680, 400],
          [560, 480],
          [640, 480],
          [520, 560],
          [600, 560],
          [680, 560],
        ].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r="4" fill={p.line} fillOpacity="0.4" stroke="none" />
        ))}
      </g>
    </>
  ),

  colonnade: (p, id) => {
    const vx = 600
    const vy = 560
    const depths = [0, 0.38, 0.6, 0.74, 0.83]
    return (
      <>
        <rect width="1200" height="1200" fill={`url(#${id}-wall)`} />
        <path d={`M0 1200 L${vx} ${vy} L1200 1200 Z`} fill={p.fill} fillOpacity="0.6" />
        <path d={`M0 0 L${vx} ${vy} L1200 0 Z`} fill={p.fill2} fillOpacity="0.35" />
        {/* Distant opening */}
        <rect x={vx - 60} y={vy - 110} width="120" height="180" fill={p.glow} fillOpacity="0.9" />
        <g stroke={p.line} strokeOpacity="0.4" fill="none">
          <line x1="0" y1="1200" x2={vx} y2={vy} />
          <line x1="1200" y1="1200" x2={vx} y2={vy} />
          <line x1="0" y1="0" x2={vx} y2={vy} />
          <line x1="1200" y1="0" x2={vx} y2={vy} />
        </g>
        {depths.map((d, i) => {
          const s = 1 - d
          const lx = vx - 520 * s
          const rx = vx + 520 * s
          const top = vy - 560 * s
          const bottom = vy + 560 * s
          const w = 80 * s
          return (
            <g key={i} stroke={p.line} strokeOpacity={0.85 - i * 0.12}>
              <rect x={lx - w / 2} y={top} width={w} height={bottom - top} fill={p.fill2} />
              <rect x={rx - w / 2} y={top} width={w} height={bottom - top} fill={p.fill2} />
              <path
                d={`M${lx + w / 2} ${top + 120 * s} A${(rx - lx) / 2 - w / 2} ${150 * s} 0 0 1 ${rx - w / 2} ${top + 120 * s}`}
                fill="none"
              />
            </g>
          )
        })}
        {/* Light falling between columns */}
        <path d={`M${vx - 300} 1200 L${vx - 110} ${vy + 230} L${vx - 40} ${vy + 230} L${vx - 110} 1200 Z`} fill={p.glow} fillOpacity="0.2" />
        <path d={`M${vx + 110} 1200 L${vx + 40} ${vy + 230} L${vx + 110} ${vy + 230} L${vx + 300} 1200 Z`} fill={p.glow} fillOpacity="0.2" />
      </>
    )
  },

  dining: (p, id) => (
    <>
      <Room p={p} id={id} />
      {/* Arched niches */}
      <g stroke={p.line} strokeOpacity="0.3" fill={p.fill2} fillOpacity="0.35">
        {[120, 880].map((x) => (
          <path key={x} d={`M${x} 820 V420 A100 100 0 0 1 ${x + 200} 420 V820 Z`} />
        ))}
      </g>
      {/* Chandelier */}
      <g stroke={p.line} strokeOpacity="0.8" fill="none">
        <line x1="600" x2="600" y1="0" y2="220" />
        <ellipse cx="600" cy="300" rx="190" ry="30" />
        <ellipse cx="600" cy="360" rx="120" ry="20" />
        <path d="M600 220 V400" />
        {[-180, -120, -60, 0, 60, 120, 180].map((dx) => (
          <g key={dx}>
            <line x1={600 + dx} x2={600 + dx} y1={300 - 26} y2="300" />
            <ellipse cx={600 + dx} cy={300 - 34} rx="6" ry="10" fill={p.glow} fillOpacity="0.95" />
          </g>
        ))}
      </g>
      <ellipse cx="600" cy="300" rx="320" ry="120" fill={p.glow} fillOpacity="0.14" />
      {/* Chairs behind the table */}
      <g stroke={p.line} strokeOpacity="0.8">
        {[380, 520, 680, 820].map((x) => (
          <path key={x} d={`M${x - 46} 700 V560 C${x - 46} 520 ${x + 46} 520 ${x + 46} 560 V700 Z`} fill={p.fill2} />
        ))}
      </g>
      {/* Table */}
      <g stroke={p.line} strokeOpacity="0.85">
        <ellipse cx="600" cy="700" rx="360" ry="54" fill={p.fill} />
        <path d="M560 754 L540 860 M640 754 L660 860 M520 860 H680" fill="none" />
        <ellipse cx="600" cy="690" rx="70" ry="10" fill={p.glow} fillOpacity="0.6" />
      </g>
      {/* Front chairs */}
      <g stroke={p.line} strokeOpacity="0.85">
        {[260, 940].map((x) => (
          <g key={x}>
            <path d={`M${x - 60} 880 V700 C${x - 60} 640 ${x + 60} 640 ${x + 60} 700 V880`} fill={p.fill2} />
            <rect x={x - 76} y="820" width="152" height="40" rx="8" fill={p.fill} />
            <path d={`M${x - 64} 860 L${x - 70} 960 M${x + 64} 860 L${x + 70} 960`} fill="none" />
          </g>
        ))}
      </g>
    </>
  ),
}

interface ArtProps {
  variant: ArtVariant
  tone?: ArtTone
  className?: string
  /** Accessible description. Omit for purely decorative use. */
  label?: string
  /** Film grain. Costly to paint, so reserved for the hero. */
  grain?: boolean
}

export function Art({ variant, tone = 'ivory', className, label, grain }: ArtProps) {
  const id = `art${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const p = palettes[tone]
  return (
    <svg
      viewBox="0 0 1200 1200"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={p.bg0} />
          <stop offset="1" stopColor={p.bg1} />
        </linearGradient>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.bg1} />
          <stop offset="1" stopColor={p.fill2} />
        </linearGradient>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={p.fill2} />
          <stop offset="0.5" stopColor={p.glow} />
          <stop offset="1" stopColor={p.fill2} />
        </linearGradient>
        <radialGradient id={`${id}-vignette`} cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </radialGradient>
        {grain && (
          <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        )}
      </defs>
      <g strokeWidth="1.4" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round">
        {scenes[variant](p, id)}
      </g>
      <rect width="1200" height="1200" fill={`url(#${id}-vignette)`} />
      {grain && <rect width="1200" height="1200" filter={`url(#${id}-grain)`} opacity={p.grain} />}
    </svg>
  )
}
