/**
 * Falling petals. Positions and timings are handwritten rather than random —
 * random values tend to clump on one side and end up looking messy.
 */
const PETALS = [
  { left: '6%', delay: '0s', duration: '15s', scale: 0.8 },
  { left: '18%', delay: '1s', duration: '19s', scale: 1 },
  { left: '31%', delay: '3s', duration: '16s', scale: 0.7 },
  { left: '44%', delay: '2s', duration: '21s', scale: 0.9 },
  { left: '57%', delay: '5s', duration: '17s', scale: 1.1 },
  { left: '69%', delay: '2.5s', duration: '20s', scale: 0.75 },
  { left: '81%', delay: '6s', duration: '18s', scale: 0.95 },
  { left: '93%', delay: '4.5s', duration: '22s', scale: 0.85 },
]

export default function Petals() {
  return (
    <>
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal"
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
