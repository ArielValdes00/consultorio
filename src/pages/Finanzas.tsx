import { useMemo } from 'react'
import { db } from '../lib/db'
import { useSession } from '../context/SessionContext'
import TopBar from '../components/TopBar'
import EmptyState from '../components/EmptyState'
import { formatMoneda, formatFechaCorta } from '../lib/format'
import type { Atencion } from '../types'

export default function Finanzas() {
  const { dentistaId, dentista } = useSession()

  const atenciones = useMemo(() => {
    const ahora = new Date()
    return db
      .getAtenciones()
      .filter((a) => a.dentistaId === dentistaId)
      .filter((a) => {
        const f = new Date(a.fecha)
        return f.getMonth() === ahora.getMonth() && f.getFullYear() === ahora.getFullYear()
      })
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  }, [dentistaId])

  const total = atenciones.reduce((acc, a) => acc + (a.monto || 0), 0)
  const porMetodo = agrupar(atenciones, (a) => a.metodoPago)
  const conObraSocial = atenciones.filter((a) => a.tieneObraSocial).length

  return (
    <div>
      <TopBar title="Finanzas" subtitle={dentista?.nombre} />

      <div className="px-5 pb-2 pt-[18px]">
        <div className="flex flex-col gap-1 rounded-lg bg-primary-dark px-5 py-[22px]">
          <span className="text-[13px] font-semibold text-white/75">Cobrado este mes</span>
          <span className="font-serif text-[34px] font-semibold text-white">{formatMoneda(total)}</span>
          <span className="text-[12.5px] text-white/65">{atenciones.length} atenciones registradas</span>
        </div>
      </div>

      <div className="px-5 py-2.5">
        <h2 className="m-0 mb-3 mt-1 font-serif text-[17px] font-semibold text-ink">Por método de pago</h2>
        <div className="flex flex-col gap-2">
          {Object.entries(porMetodo).length === 0 && <EmptyState title="Todavía no hay cobros este mes" />}
          {Object.entries(porMetodo).map(([metodo, monto]) => (
            <div key={metodo} className="flex items-center gap-2.5">
              <span className="w-[84px] flex-shrink-0 text-[12.5px] capitalize text-ink-soft">{metodo}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-sunken">
                <div className="h-full rounded-full bg-accent" style={{ width: `${total ? (monto / total) * 100 : 0}%` }} />
              </div>
              <span className="w-[78px] flex-shrink-0 text-right text-[12.5px] font-bold text-ink">{formatMoneda(monto)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2.5 px-5 pb-2 pt-[18px]">
        <MiniStat label="Con obra social" valor={conObraSocial} />
        <MiniStat label="Particulares" valor={atenciones.length - conObraSocial} />
      </div>

      <div className="px-5 pb-8 pt-[18px]">
        <h2 className="m-0 mb-3 mt-1 font-serif text-[17px] font-semibold text-ink">Últimos cobros</h2>
        <div className="flex flex-col gap-2">
          {atenciones.slice(0, 8).map((a) => {
            const paciente = db.getPaciente(a.pacienteId)
            return (
              <div key={a.id} className="flex items-center justify-between rounded-sm border border-border bg-surface px-3.5 py-2.5">
                <div>
                  <p className="m-0 text-sm font-bold text-ink">{paciente?.nombre || 'Paciente'}</p>
                  <p className="m-0 mt-0.5 text-xs capitalize text-muted">
                    {formatFechaCorta(a.fecha)} · {a.metodoPago}
                  </p>
                </div>
                <span className="text-sm font-bold text-primary-dark">{formatMoneda(a.monto)}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function agrupar(atenciones: Atencion[], keyFn: (a: Atencion) => string): Record<string, number> {
  const out: Record<string, number> = {}
  for (const a of atenciones) {
    const k = keyFn(a)
    out[k] = (out[k] || 0) + (a.monto || 0)
  }
  return out
}

function MiniStat({ label, valor }: { label: string; valor: number }) {
  return (
    <div className="flex flex-1 flex-col gap-0.5 rounded-md border border-border bg-surface px-4 py-3.5">
      <span className="font-serif text-[22px] font-semibold text-ink">{valor}</span>
      <span className="text-xs text-muted">{label}</span>
    </div>
  )
}
