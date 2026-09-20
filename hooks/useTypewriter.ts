'use client'

import { useEffect, useState } from 'react'

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Reveals text as if it were being typed.
 * `skip()` shows all of it at once — that's what the "skip" button calls.
 * If the device asks for reduced motion, the text appears in full right away.
 */
export function useTypewriter(text: string, msPerChar = 28) {
  const [count, setCount] = useState(() => (prefersReducedMotion() ? text.length : 0))

  useEffect(() => {
    const id = setInterval(() => {
      setCount((n) => {
        if (n >= text.length) {
          clearInterval(id)
          return n
        }
        return n + 1
      })
    }, msPerChar)
    return () => clearInterval(id)
  }, [text, msPerChar])

  return {
    shown: text.slice(0, count),
    done: count >= text.length,
    skip: () => setCount(text.length),
  }
}
