import { useMemo, useState } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { db } from '../lib/db'
import { useSession } from '../context/SessionContext'
import TopBar from '../components/TopBar'
import EmptyState from '../components/EmptyState'
import { formatMoneda, formatFechaCorta } from '../lib/format'
import type { Atencion } from '../types'

const COLORES_METODO: Record<string, string> = {
  efectivo: '#3F6B52',
  transferencia: '#8A5A44',
  otro: '#B7A16C',
}

type Vista = 'semana' | 'mes' | 'año'

function inicioSemana(d: Date) {
  const x = new Date(d)
  const dia = x.getDay()
  const diff = (dia === 0 ? -6 : 1) - dia // arranca lunes
  x.setDate(x.getDate() + diff)
  x.setHours(0, 0, 0, 0)
  return x
}

function inicioMes(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function inicioAnio(d: Date) {
  return new Date(d.getFullYear(), 0, 1)
}

function inicioDePeriodo(d: Date, vista: Vista) {
  if (vista === 'semana') return inicioSemana(d)
  if (vista === 'mes') return inicioMes(d)
  return inicioAnio(d)
}

function finDePeriodo(inicio: Date, vista: Vista) {
  const x = new Date(inicio)
  if (vista === 'semana') x.setDate(x.getDate() + 7)
  else if (vista === 'mes') x.setMonth(x.getMonth() + 1)
  else x.setFullYear(x.getFullYear() + 1)
  return x
}

function desplazarPeriodo(inicio: Date, vista: Vista, direccion: 1 | -1) {
  const x = new Date(inicio)
  if (vista === 'semana') x.setDate(x.getDate() + direccion * 7)
  else if (vista === 'mes') x.setMonth(x.getMonth() + direccion)
  else x.setFullYear(x.getFullYear() + direccion)
  return x
}

function nombrePeriodo(inicio: Date, vista: Vista) {
  if (vista === 'semana') {
    const fin = new Date(inicio)
    fin.setDate(fin.getDate() + 6)
    const mismodMes = inicio.getMonth() === fin.getMonth()
    const desde = inicio.toLocaleDateString('es-AR', { day: 'numeric', month: mismodMes ? undefined : 'short' })
    const hasta = fin.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
    return `${desde} - ${hasta}`
  }
  if (vista === 'mes') return inicio.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
  return `${inicio.getFullYear()}`
}

function etiquetaCorta(fecha: Date, vista: Vista) {
  if (vista === 'semana') return fecha.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' }).replace('.', '')
  if (vista === 'mes') return fecha.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '')
  return `${fecha.getFullYear()}`
}

export default function Finanzas() {
  const { dentistaId, dentista } = useSession()
  const [vista, setVista] = useState<Vista>('mes')
  const [periodo, setPeriodo] = useState<Date>(() => inicioDePeriodo(new Date(), 'mes'))

  const todasLasAtenciones = useMemo(
    () => db.getAtenciones().filter((a) => a.dentistaId === dentistaId),
    [dentistaId]
  )

  function cambiarVista(nuevaVista: Vista) {
    setVista(nuevaVista)
    setPeriodo(inicioDePeriodo(new Date(), nuevaVista))
  }

  function irAPeriodo(direccion: 1 | -1) {
    setPeriodo((prev) => desplazarPeriodo(prev, vista, direccion))
  }

  const finPeriodo = finDePeriodo(periodo, vista)
  const esPeriodoActual = periodo.getTime() === inicioDePeriodo(new Date(), vista).getTime()

  const atenciones = useMemo(() => {
    return todasLasAtenciones
      .filter((a) => {
        const f = new Date(a.fecha)
        return f >= periodo && f < finPeriodo
      })
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  }, [todasLasAtenciones, periodo, finPeriodo])

  const total = atenciones.reduce((acc, a) => acc + (a.monto || 0), 0)
  const porMetodo = agrupar(atenciones, (a) => a.metodoPago)
  const conObraSocial = atenciones.filter((a) => a.tieneObraSocial).length

  // Tendencia: últimos 6 períodos según la vista elegida (semana/mes/año)
  const tendencia = useMemo(() => {
    const periodos = Array.from({ length: 6 }, (_, i) => {
      let p = periodo
      for (let n = 0; n < 5 - i; n++) p = desplazarPeriodo(p, vista, -1)
      return p
    })
    return periodos.map((p) => {
      const fin = finDePeriodo(p, vista)
      const totalPeriodo = todasLasAtenciones
        .filter((a) => {
          const f = new Date(a.fecha)
          return f >= p && f < fin
        })
        .reduce((acc, a) => acc + (a.monto || 0), 0)
      return {
        etiqueta: etiquetaCorta(p, vista),
        total: totalPeriodo,
        esActual: p.getTime() === periodo.getTime(),
      }
    })
  }, [todasLasAtenciones, periodo, vista])

  // Detalle dentro del período: por día (semana/mes) o por mes (año)
  const detalle = useMemo(() => {
    if (vista === 'año') {
      return Array.from({ length: 12 }, (_, mes) => {
        const totalMes = atenciones
          .filter((a) => new Date(a.fecha).getMonth() === mes)
          .reduce((acc, a) => acc + (a.monto || 0), 0)
        const nombre = new Date(periodo.getFullYear(), mes, 1).toLocaleDateString('es-AR', { month: 'short' }).replace('.', '')
        return { etiqueta: nombre, total: totalMes }
      })
    }
    const dias = Math.round((finPeriodo.getTime() - periodo.getTime()) / (1000 * 60 * 60 * 24))
    return Array.from({ length: dias }, (_, i) => {
      const d = new Date(periodo)
      d.setDate(d.getDate() + i)
      const totalDia = atenciones
        .filter((a) => {
          const f = new Date(a.fecha)
          return f.getDate() === d.getDate() && f.getMonth() === d.getMonth() && f.getFullYear() === d.getFullYear()
        })
        .reduce((acc, a) => acc + (a.monto || 0), 0)
      const etiqueta = vista === 'semana' ? d.toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', '') : `${d.getDate()}`
      return { etiqueta, total: totalDia }
    })
  }, [atenciones, periodo, finPeriodo, vista])

  const datosPie = Object.entries(porMetodo).map(([metodo, monto]) => ({ name: metodo, value: monto }))

  const tituloDetalle = vista === 'año' ? 'Mes a mes' : vista === 'mes' ? 'Día a día' : 'Por día de la semana'
  const tituloTendencia = vista === 'semana' ? 'Últimas 6 semanas' : vista === 'mes' ? 'Últimos 6 meses' : 'Últimos 6 años'

  return (
    <div>
      <TopBar title="Finanzas" subtitle={dentista?.nombre} />

      <div className="flex gap-2 px-5 pb-2 pt-[18px]">
        {(['semana', 'mes', 'año'] as Vista[]).map((v) => (
          <button
            key={v}
            onClick={() => cambiarVista(v)}
            className={`flex-1 rounded-sm border-none py-2 text-[13px] font-semibold capitalize ${
              vista === v ? 'bg-primary text-white' : 'bg-surface-sunken text-ink-soft'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between px-5 pb-1 pt-2">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full border-none bg-surface-sunken text-ink-soft"
          onClick={() => irAPeriodo(-1)}
          aria-label="Período anterior"
        >
          <IconChevron direccion="izquierda" />
        </button>
        <span className="text-[14px] font-semibold capitalize text-ink">{nombrePeriodo(periodo, vista)}</span>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full border-none bg-surface-sunken text-ink-soft disabled:opacity-30"
          onClick={() => irAPeriodo(1)}
          disabled={esPeriodoActual}
          aria-label="Período siguiente"
        >
          <IconChevron direccion="derecha" />
        </button>
      </div>

      <div className="px-5 pb-2 pt-2.5">
        <div className="flex flex-col gap-1 rounded-lg bg-primary-dark px-5 py-[22px]">
          <span className="text-[13px] font-semibold text-white/75">Cobrado en el período</span>
          <span className="font-serif text-[34px] font-semibold text-white">{formatMoneda(total)}</span>
          <span className="text-[12.5px] text-white/65">{atenciones.length} atenciones registradas</span>
        </div>
      </div>

      <div className="px-5 py-2.5">
        <h2 className="m-0 mb-3 mt-1 font-serif text-[17px] font-semibold text-ink">{tituloTendencia}</h2>
        <div className="h-[160px] w-full rounded-md border border-border bg-surface p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tendencia} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <XAxis dataKey="etiqueta" tick={{ fontSize: 11, fill: '#8B8378' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => formatMoneda(Number(value))} labelFormatter={() => ''} />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {tendencia.map((d, i) => (
                  <Cell key={i} fill={d.esActual ? '#3F6B52' : '#CFE0D5'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="px-5 py-2.5">
        <h2 className="m-0 mb-3 mt-1 font-serif text-[17px] font-semibold text-ink">{tituloDetalle}</h2>
        {atenciones.length === 0 ? (
          <EmptyState title="Todavía no hay cobros en este período" />
        ) : (
          <div className="h-[140px] w-full rounded-md border border-border bg-surface p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={detalle} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <XAxis
                  dataKey="etiqueta"
                  tick={{ fontSize: 10, fill: '#8B8378' }}
                  axisLine={false}
                  tickLine={false}
                  interval={vista === 'mes' ? 4 : 0}
                />
                <Tooltip formatter={(value) => formatMoneda(Number(value))} />
                <Line type="monotone" dataKey="total" stroke="#3F6B52" strokeWidth={2} dot={vista !== 'mes'} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="px-5 py-2.5">
        <h2 className="m-0 mb-3 mt-1 font-serif text-[17px] font-semibold text-ink">Por método de pago</h2>
        {datosPie.length === 0 ? (
          <EmptyState title="Todavía no hay cobros en este período" />
        ) : (
          <div className="flex items-center gap-4">
            <div className="h-[120px] w-[120px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={datosPie} dataKey="value" nameKey="name" innerRadius={30} outerRadius={55} paddingAngle={2}>
                    {datosPie.map((d, i) => (
                      <Cell key={i} fill={COLORES_METODO[d.name] || '#B7A16C'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatMoneda(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              {datosPie.map((d) => (
                <div key={d.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: COLORES_METODO[d.name] || '#B7A16C' }} />
                    <span className="text-[12.5px] capitalize text-ink-soft">{d.name}</span>
                  </div>
                  <span className="text-[12.5px] font-bold text-ink">{formatMoneda(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2.5 px-5 pb-2 pt-[18px]">
        <MiniStat label="Con obra social" valor={conObraSocial} />
        <MiniStat label="Particulares" valor={atenciones.length - conObraSocial} />
      </div>

      <div className="px-5 pb-8 pt-[18px]">
        <h2 className="m-0 mb-3 mt-1 font-serif text-[17px] font-semibold text-ink">Cobros del período</h2>
        <div className="flex flex-col gap-2">
          {atenciones.length === 0 && <EmptyState title="Todavía no hay cobros en este período" />}
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

function IconChevron({ direccion }: { direccion: 'izquierda' | 'derecha' }) {
  const path = direccion === 'izquierda' ? 'M14.5 5.5l-6 6.5 6 6.5' : 'M9.5 5.5l6 6.5-6 6.5'
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d={path} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}