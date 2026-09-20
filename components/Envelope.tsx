/** A sealed envelope — the "not yet" symbol on the countdown screen. */
export default function Envelope() {
  return (
    <svg className="envelope" viewBox="0 0 120 84" fill="none" aria-hidden>
      <rect x="1.5" y="1.5" width="117" height="81" rx="5" fill="#fffaf5" stroke="currentColor" strokeOpacity="0.55" />
      <path d="M3 7 L60 47 L117 7" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.6" fill="none" />
      <path d="M3 77 L45 41 M117 77 L75 41" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.6" />
      <circle cx="60" cy="46" r="12.5" fill="#c39a5f" />
      <circle cx="60" cy="46" r="12.5" fill="none" stroke="#a87f45" strokeOpacity="0.6" />
      <path
        d="M60 52c-3.8-3-6.6-5.2-6.6-8a3.2 3.2 0 0 1 6.6-1.4 3.2 3.2 0 0 1 6.6 1.4c0 2.8-2.8 5-6.6 8Z"
        fill="#fff6e8"
      />
    </svg>
  )
}
