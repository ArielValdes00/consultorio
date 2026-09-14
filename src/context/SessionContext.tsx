import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { db } from '../lib/db'
import type { Dentista } from '../types'

interface SessionContextValue {
  dentistaId: string | null
  dentista: Dentista | null
  iniciarSesion: (id: string) => void
  cerrarSesion: () => void
}

const SessionContext = createContext<SessionContextValue | null>(null)
const STORAGE_KEY = 'consultorio_sesion_dentista_id'

export function SessionProvider({ children }: { children: ReactNode }) {
  const [dentistaId, setDentistaId] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY))

  useEffect(() => {
    if (dentistaId) localStorage.setItem(STORAGE_KEY, dentistaId)
    else localStorage.removeItem(STORAGE_KEY)
  }, [dentistaId])

  const dentista = dentistaId ? db.getDentista(dentistaId) : null

  return (
    <SessionContext.Provider value={{ dentistaId, dentista, iniciarSesion: setDentistaId, cerrarSesion: () => setDentistaId(null) }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession debe usarse dentro de un SessionProvider')
  return ctx
}
