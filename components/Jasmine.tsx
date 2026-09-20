/**
 * A jasmine sprig — her namesake, used as the recurring ornament of the site:
 * large above a heading, small in place of a divider.
 */
function Flower({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="0"
          cy={-r * 0.95}
          rx={r * 0.46}
          ry={r * 0.9}
          transform={`rotate(${deg})`}
          fill="#fffdfa"
          fillOpacity="0.95"
          stroke="currentColor"
          strokeOpacity="0.75"
          strokeWidth="0.9"
        />
      ))}
      <circle cx="0" cy="0" r={r * 0.28} fill="var(--gold)" />
    </g>
  )
}

export function JasmineSprig({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`sprig ${className}`}
      width="160"
      height="62"
      viewBox="0 0 160 62"
      fill="none"
      aria-hidden
    >
      {/* stem */}
      <path
        d="M8 46 C 44 36, 60 30, 80 26 C 100 30, 116 36, 152 46"
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="1.1"
        fill="none"
      />
      {/* leaves */}
      <path d="M40 40 C 32 30, 22 30, 18 34 C 24 42, 34 43, 40 40Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.9" />
      <path d="M120 40 C 128 30, 138 30, 142 34 C 136 42, 126 43, 120 40Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.9" />
      <Flower x={80} y={18} r={11} />
      <Flower x={52} y={30} r={8} />
      <Flower x={108} y={30} r={8} />
    </svg>
  )
}

export function JasmineMark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`mark ${className}`}
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden
    >
      <Flower x={14} y={14} r={9} />
    </svg>
  )
}
