import { useCallback, useEffect, useRef } from 'react'

export function useLongPress(callback: () => void, delayMs = 2000) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const start = useCallback(() => {
    timerRef.current = setTimeout(callback, delayMs)
  }, [callback, delayMs])

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Clear any pending timer if the owning component unmounts mid-press.
  useEffect(() => {
    return clear
  }, [clear])

  return {
    onPointerDown: start,
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
  }
}
