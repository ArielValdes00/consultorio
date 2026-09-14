import { useNavigate } from 'react-router-dom'
import { db } from '../lib/db'
import { useSession } from '../context/SessionContext'
import type { Dentista } from '../types'

export default function Login() {
  const { iniciarSesion } = useSession()
  const navigate = useNavigate()
  const dentistas = db.getDentistas()

  function elegir(id: string) {
    iniciarSesion(id)
    navigate('/', { replace: true })
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-shell flex-col justify-center bg-bg px-6 py-8">
      <div className="mb-8">
        <p className="m-0 mb-2 text-[13px] font-bold text-primary-dark">Consultorio</p>
        <h1 className="m-0 mb-2.5 font-serif text-[28px] leading-[1.25] text-ink">¿Quién va a usar la agenda?</h1>
        <p className="m-0 text-sm leading-relaxed text-muted">
          Cada uno ve sus propios turnos, pacientes y finanzas por separado.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {dentistas.map((d) => (
          <button
            key={d.id}
            onClick={() => elegir(d.id)}
            className="flex items-center gap-3.5 rounded-md border border-border bg-surface px-4 py-4 text-left"
          >
            <span
              className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ background: d.color }}
            >
              {iniciales(d.nombre)}
            </span>
            <span className="text-[15.5px] font-semibold text-ink">{d.nombre}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="ml-auto text-muted">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}

function iniciales(nombre: Dentista['nombre']) {
  return nombre
    .replace(/^(Dra?\.)\s*/, '')
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}
