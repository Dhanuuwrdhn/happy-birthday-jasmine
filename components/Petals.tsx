/**
 * Falling petals. Positions, sizes and timings are handwritten rather than
 * random — random values clump on one side and look messy. A few are large and
 * soft-focused so they read as closer to the viewer than the rest.
 */
const PETALS = [
  { left: '4%', delay: '0s', duration: '15s', scale: 0.8, near: false },
  { left: '11%', delay: '6s', duration: '21s', scale: 1.4, near: true },
  { left: '18%', delay: '1s', duration: '19s', scale: 1, near: false },
  { left: '25%', delay: '9s', duration: '17s', scale: 0.65, near: false },
  { left: '31%', delay: '3s', duration: '16s', scale: 0.7, near: false },
  { left: '38%', delay: '12s', duration: '23s', scale: 1.5, near: true },
  { left: '44%', delay: '2s', duration: '21s', scale: 0.9, near: false },
  { left: '51%', delay: '7.5s', duration: '18s', scale: 0.6, near: false },
  { left: '57%', delay: '5s', duration: '17s', scale: 1.1, near: false },
  { left: '64%', delay: '10.5s', duration: '22s', scale: 1.35, near: true },
  { left: '69%', delay: '2.5s', duration: '20s', scale: 0.75, near: false },
  { left: '76%', delay: '8s', duration: '16s', scale: 0.95, near: false },
  { left: '81%', delay: '6s', duration: '18s', scale: 0.95, near: false },
  { left: '87%', delay: '13s', duration: '24s', scale: 1.45, near: true },
  { left: '93%', delay: '4.5s', duration: '22s', scale: 0.85, near: false },
  { left: '97%', delay: '11s', duration: '19s', scale: 0.7, near: false },
]

export default function Petals() {
  return (
    <>
      {PETALS.map((p, i) => (
        <span
          key={i}
          className={`petal ${p.near ? 'petal--near' : ''}`}
          aria-hidden
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            scale: String(p.scale),
          }}
        />
      ))}
    </>
  )
}
