import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../lib/db'
import TopBar from '../components/TopBar'
import EmptyState from '../components/EmptyState'
import { formatFechaLarga, formatHora, formatMoneda } from '../lib/format'
import type { Dentista, Paciente, Turno } from '../types'

export default function HistorialAtenciones() {
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  const atenciones = db.getAtenciones()
  const pacientesPorId = useMemo<Record<string, Paciente>>(
    () => Object.fromEntries(db.getPacientes().map((p) => [p.id, p])),
    []
  )
  const dentistasPorId = useMemo<Record<string, Dentista>>(
    () => Object.fromEntries(db.getDentistas().map((d) => [d.id, d])),
    []
  )
  const turnosPorId = useMemo<Record<string, Turno>>(
    () => Object.fromEntries(db.getTurnos().map((t) => [t.id, t])),
    []
  )

  const atencionesOrdenadas = useMemo(
    () => [...atenciones].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()),
    [atenciones]
  )

  const atencionesFiltradas = atencionesOrdenadas.filter((a) => {
    const paciente = pacientesPorId[a.pacienteId]

    if (busqueda.trim() && !paciente?.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())) {
      return false
    }

    const fechaAtencion = new Date(a.fecha).toISOString().slice(0, 10)
    if (fechaDesde && fechaAtencion < fechaDesde) return false
    if (fechaHasta && fechaAtencion > fechaHasta) return false

    return true
  })

  function limpiarFiltros() {
    setBusqueda('')
    setFechaDesde('')
    setFechaHasta('')
  }

  return (
    <div>
      <TopBar title="Historial" subtitle={`${atenciones.length} atenciones registradas`} />

      <div className="flex flex-col gap-2 px-5 pb-2 pt-4">
        <input
          type="text"
          placeholder="Buscar por paciente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-[15px] text-ink"
        />
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-ink-soft">Desde</span>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="flex-1 rounded-sm border border-border bg-surface px-3 py-2.5 text-[14px] text-ink"
          />
          <span className="text-[13px] text-ink-soft">hasta</span>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="flex-1 rounded-sm border border-border bg-surface px-3 py-2.5 text-[14px] text-ink"
          />
        </div>
      </div>

      {(busqueda || fechaDesde || fechaHasta) && (
        <div className="px-5 pb-2">
          <button onClick={limpiarFiltros} className="border-none bg-transparent text-[13px] font-semibold text-primary-dark">
            Limpiar filtros
          </button>
        </div>
      )}

      <div className="px-5 pb-8 pt-2.5">
        {atencionesFiltradas.length === 0 && (
          <EmptyState title="No hay atenciones para mostrar" hint="Probá con otro nombre o rango de fechas." />
        )}

        <div className="flex flex-col gap-3">
          {atencionesFiltradas.map((a) => {
            const paciente = pacientesPorId[a.pacienteId]
            const dentista = dentistasPorId[a.dentistaId]
            const turno = turnosPorId[a.turnoId]

            return (
              <div key={a.id} className="rounded-md border border-border bg-surface px-4 py-3.5">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[13.5px] font-bold text-ink">{formatFechaLarga(a.fecha)} · {formatHora(a.fecha)}</span>
                  <span className="text-[13.5px] font-bold text-primary-dark">{formatMoneda(a.monto)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => paciente && navigate(`/pacientes/${paciente.id}`)}
                  disabled={!paciente}
                  className="mb-2 flex w-fit items-center gap-1 border-none bg-transparent p-0 text-[15px] font-bold text-primary-dark underline decoration-primary-soft underline-offset-2 disabled:text-ink disabled:no-underline"
                >
                  {paciente?.nombre || 'Paciente'}
                  {paciente && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                {turno && (
                  <p className="m-0 mb-1.5 text-[12.5px] text-muted">
                    Motivo de consulta: <span className="text-ink-soft">{turno.motivo}</span>
                  </p>
                )}

                {a.notasClinicas && (
                  <p className="m-0 mb-2 text-[13.5px] leading-snug text-ink-soft">
                    <span className="font-semibold text-ink">Se realizó:</span> {a.notasClinicas}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: dentista?.color }} />
                    <span className="text-xs text-muted">{dentista?.nombre}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="rounded-full bg-primary-soft px-2.5 py-[3px] text-[11px] font-semibold capitalize text-primary-dark">
                      {a.metodoPago}
                    </span>
                    {a.tieneObraSocial && (
                      <span className="rounded-full bg-primary-soft px-2.5 py-[3px] text-[11px] font-semibold capitalize text-primary-dark">
                        Con obra social
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}