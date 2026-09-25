import type { CategoryId } from '../data/types'

interface Props {
  category: CategoryId
  color?: string
  size?: number | string
  seed?: number
}

const INK = '#0a0a0a'

/**
 * Hand-built vector "renders" so the demo has a coherent product look without stock photos.
 * The backend will send real images; <ProductMedia> falls back to this.
 */
export function ProductArt({ category, color = '#f5f5f3', size = '100%', seed = 0 }: Props) {
  const dark = isDark(color)
  const detail = dark ? '#2e2e2e' : '#151515'
  const gid = `sheen-${category}-${seed}-${color.slice(1)}`
  const body = { fill: color, stroke: INK, strokeWidth: 1.6 }
  const sheen = { fill: `url(#${gid})`, pointerEvents: 'none' as const }

  const shapes: Record<CategoryId, React.ReactNode> = {
    audio: (
      <g>
        <path d="M52 118 C52 48 148 48 148 118" fill="none" stroke={INK} strokeWidth="13" strokeLinecap="round" />
        <path d="M52 118 C52 48 148 48 148 118" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" />
        {[36, 128].map((x) => (
          <g key={x}>
            <rect x={x} y="100" width="36" height="62" rx="16" {...body} />
            <rect x={x} y="100" width="36" height="62" rx="16" {...sheen} />
            <rect x={x + 8} y="112" width="20" height="38" rx="9" fill="none" stroke={detail} strokeWidth="1" strokeDasharray="2 3" />
          </g>
        ))}
        <circle cx="154" cy="112" r="3.2" fill="#ff2b2b" stroke={INK} strokeWidth="1" />
      </g>
    ),
    phone: (
      <g>
        <rect x="62" y="24" width="76" height="152" rx="16" {...body} />
        <rect x="62" y="24" width="76" height="152" rx="16" {...sheen} />
        <circle cx="84" cy="50" r="9" fill={detail} stroke={INK} />
        <circle cx="84" cy="74" r="9" fill={detail} stroke={INK} />
        <circle cx="84" cy="50" r="3" fill="#555" />
        <circle cx="84" cy="74" r="3" fill="#555" />
        <path d="M108 44 q12 18 0 36 M100 110 h24 M100 118 h14 M100 150 a14 14 0 0 1 24 -8" fill="none" stroke={detail} strokeWidth="2" strokeLinecap="round" />
        <circle cx="122" cy="40" r="3" fill="#ff2b2b" stroke={INK} strokeWidth="1" />
      </g>
    ),
    camera: (
      <g>
        <rect x="68" y="152" width="64" height="14" rx="7" {...body} />
        <rect x="93" y="118" width="14" height="36" rx="3" {...body} />
        <circle cx="100" cy="84" r="46" {...body} />
        <circle cx="100" cy="84" r="46" {...sheen} />
        <circle cx="100" cy="84" r="24" fill="#111" stroke={INK} strokeWidth="1.6" />
        <circle cx="100" cy="84" r="13" fill="#2a2d33" />
        <circle cx="100" cy="84" r="6" fill="#0c0f19" />
        <circle cx="93" cy="77" r="3.5" fill="#fff" opacity=".7" />
        <circle cx="134" cy="58" r="3.4" fill="#ff2b2b" stroke={INK} strokeWidth="1" />
      </g>
    ),
    wearable: (
      <g>
        <rect x="78" y="18" width="44" height="164" rx="12" {...body} opacity=".9" />
        <rect x="60" y="58" width="80" height="84" rx="24" {...body} />
        <rect x="60" y="58" width="80" height="84" rx="24" {...sheen} />
        <rect x="68" y="66" width="64" height="68" rx="17" fill="#0b0b0b" />
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 7 }).map((__, c) =>
            (r + c + seed) % 3 === 0 ? <circle key={`${r}${c}`} cx={80 + c * 6.6} cy={86 + r * 7} r="1.6" fill="#f2f2f2" /> : null,
          ),
        )}
        <circle cx="120" cy="80" r="2.4" fill="#ff2b2b" />
        <rect x="139" y="88" width="7" height="22" rx="3" {...body} />
      </g>
    ),
    computing: (
      <g>
        <rect x="38" y="42" width="124" height="86" rx="8" {...body} />
        <rect x="46" y="50" width="108" height="70" rx="3" fill="#0f0f0f" />
        <path d="M46 50 L110 50 L60 120 L46 120Z" fill="#fff" opacity=".06" />
        <path d="M24 130 H176 L184 146 Q184 150 178 150 H22 Q16 150 16 146 Z" {...body} />
        <rect x="88" y="132" width="24" height="4" rx="2" fill={detail} />
        <circle cx="100" cy="46" r="1.6" fill="#ff2b2b" />
      </g>
    ),
    gaming: (
      <g>
        <path d="M58 72 H142 C170 72 184 118 176 140 C170 156 150 156 138 138 L128 124 H72 L62 138 C50 156 30 156 24 140 C16 118 30 72 58 72Z" {...body} />
        <path d="M58 72 H142 C170 72 184 118 176 140 C170 156 150 156 138 138 L128 124 H72 L62 138 C50 156 30 156 24 140 C16 118 30 72 58 72Z" {...sheen} />
        <path d="M52 96 v20 M42 106 h20" stroke={detail} strokeWidth="6" strokeLinecap="round" />
        <circle cx="146" cy="94" r="5" fill="#ffd400" stroke={INK} />
        <circle cx="158" cy="106" r="5" fill="#ff2b2b" stroke={INK} />
        <circle cx="134" cy="106" r="5" fill="#1f4bff" stroke={INK} />
        <circle cx="146" cy="118" r="5" fill="#16c35a" stroke={INK} />
        <circle cx="82" cy="118" r="9" fill={detail} stroke={INK} />
        <circle cx="118" cy="118" r="9" fill={detail} stroke={INK} />
      </g>
    ),
    home: (
      <g>
        <rect x="60" y="30" width="80" height="140" rx="40" {...body} />
        <rect x="60" y="30" width="80" height="140" rx="40" {...sheen} />
        {Array.from({ length: 9 }).map((_, r) =>
          Array.from({ length: 5 }).map((__, c) => <circle key={`${r}${c}`} cx={80 + c * 10} cy={70 + r * 9} r="2" fill={detail} opacity={0.75} />),
        )}
        <ellipse cx="100" cy="44" rx="18" ry="4" fill="none" stroke={detail} />
        <circle cx="100" cy="158" r="2.6" fill="#ff2b2b" stroke={INK} strokeWidth=".8" />
      </g>
    ),
    power: (
      <g>
        <rect x="84" y="30" width="7" height="26" rx="2" fill="#bdbdbd" stroke={INK} />
        <rect x="109" y="30" width="7" height="26" rx="2" fill="#bdbdbd" stroke={INK} />
        <rect x="60" y="54" width="80" height="104" rx="18" {...body} />
        <rect x="60" y="54" width="80" height="104" rx="18" {...sheen} />
        {[88, 104, 120].map((y, i) => (
          <rect key={y} x="84" y={y} width="32" height="9" rx="4.5" fill={detail} stroke={INK} strokeWidth={i === 2 ? 1 : 0} />
        ))}
        <text x="100" y="80" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill={dark ? '#eee' : '#111'}>
          GaN
        </text>
        <circle cx="128" cy="68" r="2.6" fill="#16c35a" stroke={INK} strokeWidth=".8" />
      </g>
    ),
  }

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={category}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={dark ? 0.22 : 0.7} />
          <stop offset=".45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity={dark ? 0.2 : 0.08} />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="182" rx="58" ry="6" fill="#000" opacity=".08" />
      {shapes[category]}
    </svg>
  )
}

export function isDark(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return 0.299 * r + 0.587 * g + 0.114 * b < 110
}
