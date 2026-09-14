import { useParams } from 'react-router-dom'
import { db } from '../lib/db'
import TopBar from '../components/TopBar'
import EmptyState from '../components/EmptyState'
import { formatFechaLarga, formatMoneda } from '../lib/format'
import type { Dentista } from '../types'

export default function PacienteDetalle() {
  const { id } = useParams<{ id: string }>()
  const paciente = id ? db.getPaciente(id) : null

  if (!paciente) {
    return (
      <div>
        <TopBar title="Paciente" onBack={true} />
        <p className="p-5 text-muted">No se encontró el paciente.</p>
      </div>
    )
  }

  const atenciones = db.getAtencionesPorPaciente(paciente.id)
  const dentistasPorId: Record<string, Dentista> = Object.fromEntries(db.getDentistas().map((d) => [d.id, d]))

  return (
    <div>
      <TopBar title={paciente.nombre} subtitle={paciente.obraSocial || 'Sin obra social'} onBack={true} />

      <div className="px-5 pb-2 pt-4">
        <div className="flex flex-col gap-1.5">
          {paciente.documento && <p className="m-0 text-sm text-ink-soft">🪪 DNI {paciente.documento}</p>}
          {paciente.telefono && <p className="m-0 text-sm text-ink-soft">📞 {paciente.telefono}</p>}
          {paciente.notas && <p className="m-0 text-sm text-status-cancelado">⚠ {paciente.notas}</p>}
        </div>
      </div>

      <div className="px-5 pb-8 pt-2.5">
        <h2 className="m-0 mb-3 mt-1 font-serif text-lg font-semibold text-ink">Historial clínico</h2>
        {atenciones.length === 0 && <EmptyState title="Todavía no hay atenciones registradas" />}

        <div className="flex flex-col gap-3">
          {atenciones.map((a) => (
            <div key={a.id} className="rounded-md border border-border bg-surface px-4 py-3.5">
              <div className="mb-1 flex justify-between">
                <span className="text-[13.5px] font-bold text-ink">{formatFechaLarga(a.fecha)}</span>
                <span className="text-[13.5px] font-bold text-primary-dark">{formatMoneda(a.monto)}</span>
              </div>
              <p className="m-0 mb-2 text-[12.5px] text-muted">Atendió: {dentistasPorId[a.dentistaId]?.nombre}</p>
              {a.notasClinicas && <p className="m-0 mb-2 text-sm leading-snug text-ink-soft">{a.notasClinicas}</p>}
              {a.receta && (
                <p className="m-0 mb-2 text-[13.5px] leading-tight text-ink-soft">
                  <strong>Receta:</strong> {a.receta}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full bg-primary-soft px-2.5 py-[3px] text-[11.5px] font-semibold capitalize text-primary-dark">
                  {a.metodoPago}
                </span>
                {a.tieneObraSocial && (
                  <span className="rounded-full bg-primary-soft px-2.5 py-[3px] text-[11.5px] font-semibold capitalize text-primary-dark">
                    Con obra social
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
