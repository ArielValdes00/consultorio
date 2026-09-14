import { useEffect, useState } from 'react'

const QUERY = '(min-width: 860px)'

export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(QUERY).matches : false
  )

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return isDesktop
}
