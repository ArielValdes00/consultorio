import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../lib/db'
import TopBar from '../components/TopBar'
import EmptyState from '../components/EmptyState'

export default function Pacientes() {
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')
  const pacientes = db.getPacientes()

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return pacientes
    return pacientes.filter(
      (p) => p.nombre.toLowerCase().includes(q) || (p.documento || '').toLowerCase().includes(q)
    )
  }, [busqueda, pacientes])

  return (
    <div>
      <TopBar
        title="Pacientes"
        subtitle={`${pacientes.length} en total`}
        action={
          <button
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full border-none bg-primary text-[22px] leading-none text-white"
            onClick={() => navigate('/pacientes/nuevo')}
            aria-label="Nuevo paciente"
          >
            +
          </button>
        }
      />

      <div className="px-5 pb-2 pt-3.5">
        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-sm border border-border bg-surface px-3.5 py-[11px] text-[14.5px]"
        />
      </div>

      <div className="card-list px-5 pb-5 pt-1.5">
        {filtrados.length === 0 && <EmptyState title="No hay pacientes" hint="Agregá el primero con el botón +." />}
        {filtrados.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate(`/pacientes/${p.id}`)}
            className="flex w-full items-center gap-3 rounded-md border border-border bg-surface px-3.5 py-[13px]"
          >
            <span className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full bg-primary-soft font-bold text-primary-dark">
              {p.nombre.charAt(0).toUpperCase()}
            </span>
            <span className="flex-1 text-left">
              <span className="block text-[15px] font-bold text-ink">{p.nombre}</span>
              <span className="mt-px block text-[12.5px] text-muted">
                {p.documento ? `DNI ${p.documento}` : 'Sin DNI cargado'} · {p.obraSocial || 'Sin obra social'}
              </span>
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 text-muted">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
