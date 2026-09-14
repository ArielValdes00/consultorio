import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../lib/db'
import { useIsDesktop } from '../hooks/useIsDesktop'
import TopBar from '../components/TopBar'
import StatusPill from '../components/StatusPill'
import EmptyState from '../components/EmptyState'
import { formatHora, esMismoDia } from '../lib/format'
import type { Dentista, EstadoTurno, Paciente } from '../types'

function inicioDeDia(fecha: Date | string) {
    const d = new Date(fecha)
    d.setHours(0, 0, 0, 0)
    return d
}

function rangoDeDias(desde: Date, n: number) {
    const inicio = inicioDeDia(desde)
    return Array.from({ length: n }, (_, i) => {
        const d = new Date(inicio)
        d.setDate(d.getDate() + i)
        return d
    })
}

const BORDE_ESTADO: Record<EstadoTurno, string> = {
    pendiente: 'border-l-status-pendiente',
    atendido: 'border-l-status-atendido',
    cancelado: 'border-l-status-cancelado',
}

export default function Agenda() {
    const navigate = useNavigate()
    const isDesktop = useIsDesktop()
    const buscadorFechaRef = useRef<HTMLInputElement>(null)

    const diasVisibles = isDesktop ? 14 : 5

    const [anchor, setAnchor] = useState<Date>(() => inicioDeDia(new Date()))
    const [diaSeleccionado, setDiaSeleccionado] = useState<string>(() => inicioDeDia(new Date()).toISOString())

    const dias = useMemo(() => rangoDeDias(anchor, diasVisibles), [anchor, diasVisibles])

    function irAPagina(direccion: 1 | -1) {
        setAnchor((prev) => {
            const d = new Date(prev)
            d.setDate(d.getDate() + direccion * diasVisibles)
            return d
        })
    }

    function seleccionarDia(d: Date) {
        setDiaSeleccionado(d.toISOString())
    }

    function abrirBuscadorFecha() {
        const input = buscadorFechaRef.current
        if (!input) return
        if (typeof input.showPicker === 'function') input.showPicker()
        else input.click()
    }

    function irAFechaElegida(e: React.ChangeEvent<HTMLInputElement>) {
        const valor = e.target.value // "YYYY-MM-DD"
        if (!valor) return
        const [anio, mes, dia] = valor.split('-').map(Number)
        const fecha = new Date(anio, mes - 1, dia)
        setAnchor(inicioDeDia(fecha))
        setDiaSeleccionado(inicioDeDia(fecha).toISOString())
    }

    const turnos = db.getTurnos().filter((t) => esMismoDia(t.fechaHora, diaSeleccionado))
    const pacientesPorId = useMemo<Record<string, Paciente>>(
        () => Object.fromEntries(db.getPacientes().map((p) => [p.id, p])),
        [turnos]
    )
    const dentistasPorId = useMemo<Record<string, Dentista>>(
        () => Object.fromEntries(db.getDentistas().map((d) => [d.id, d])),
        []
    )

    return (
        <div>
            <TopBar
                title="Agenda"
                subtitle={`${turnos.length} turno${turnos.length === 1 ? '' : 's'} este día`}
                action={
                    <button
                        className="flex h-[38px] w-[38px] items-center justify-center rounded-full border-none bg-primary text-[22px] leading-none text-white"
                        onClick={() => navigate('/turnos/nuevo')}
                        aria-label="Nuevo turno"
                    >
                        +
                    </button>
                }
            />

            <div className="flex items-center gap-1.5 border-b border-border bg-surface px-3 py-2.5">
                <button
                    className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full border-none bg-surface-sunken text-ink-soft"
                    onClick={() => irAPagina(-1)}
                    aria-label="Días anteriores"
                >
                    <IconChevron direccion="izquierda" />
                </button>

                <div className={`flex min-w-0 flex-1 ${isDesktop ? 'gap-2.5' : 'gap-1.5'}`}>
                    {dias.map((d) => {
                        const activo = esMismoDia(d, diaSeleccionado)
                        return (
                            <button
                                key={d.toISOString()}
                                onClick={() => seleccionarDia(d)}
                                className={`flex flex-1 flex-col items-center gap-0.5 rounded-sm border-none ${isDesktop ? 'px-1.5 pb-4 pt-3.5' : 'px-0.5 pb-2 pt-1.5'
                                    } ${activo ? 'bg-primary text-white' : 'bg-transparent text-ink-soft'}`}
                            >
                                <span className={`lowercase ${isDesktop ? 'text-[12.5px]' : 'text-[10.5px]'}`}>
                                    {d.toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', '')}
                                </span>
                                <span className={`font-serif font-semibold ${isDesktop ? 'text-xl' : 'text-[15px]'}`}>{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>

                <button
                    className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full border-none bg-surface-sunken text-ink-soft"
                    onClick={() => irAPagina(1)}
                    aria-label="Días siguientes"
                >
                    <IconChevron direccion="derecha" />
                </button>

                <button
                    className="ml-0.5 flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full border-none bg-primary-soft text-primary-dark"
                    onClick={abrirBuscadorFecha}
                    aria-label="Buscar una fecha"
                >
                    <IconCalendario />
                </button>
                <input
                    ref={buscadorFechaRef}
                    type="date"
                    onChange={irAFechaElegida}
                    className="pointer-events-none absolute h-px w-px opacity-0"
                    tabIndex={-1}
                />
            </div>

            <div className="px-5 pb-5 pt-1">
                {turnos.length === 0 && <EmptyState title="No hay turnos este día" hint="Tocá el + para agendar uno nuevo." />}

                <div className="card-list">
                    {turnos.map((t) => {
                        const paciente = pacientesPorId[t.pacienteId]
                        const dentista = dentistasPorId[t.dentistaId]
                        return (
                            <div
                                key={t.id}
                                className={`rounded-md border border-l-4 border-border bg-surface px-4 py-3.5 ${BORDE_ESTADO[t.estado]}`}
                                onClick={() => t.estado === 'pendiente' && navigate(`/turnos/${t.id}/atender`)}
                                role={t.estado === 'pendiente' ? 'button' : undefined}
                            >
                                <div className="mb-1.5 flex items-center justify-between">
                                    <span className="font-serif text-[17px] font-semibold">{formatHora(t.fechaHora)}</span>
                                    <StatusPill estado={t.estado} />
                                </div>
                                <p className="m-0 mb-0.5 text-[15px] font-bold text-ink">{paciente?.nombre || 'Paciente'}</p>
                                <p className="m-0 mb-2.5 text-[13.5px] text-ink-soft">{t.motivo}</p>
                                <div className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full" style={{ background: dentista?.color }} />
                                    <span className="text-xs text-muted">{dentista?.nombre}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
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

function IconCalendario() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3.5" y="5" width="17" height="15" rx="3" stroke="currentColor" strokeWidth="1.7" />
            <path d="M8 3v4M16 3v4M3.5 10h17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
    )
}
