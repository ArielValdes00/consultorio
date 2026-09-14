import { useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../lib/db'
import TopBar from '../components/TopBar'
import { formatFechaLarga, formatHora } from '../lib/format'
import { OBRAS_SOCIALES, type MetodoPago } from '../types'

export default function AtenderTurno() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const turno = id ? db.getTurno(id) : null
    const paciente = turno ? db.getPaciente(turno.pacienteId) : null
    const dentistas = db.getDentistas()

    const obraSocialInicialEsConocida = paciente
        ? (OBRAS_SOCIALES as readonly string[]).includes(paciente.obraSocial)
        : true
    const obraSocialInicial = !paciente?.obraSocial
        ? 'Sin obra social'
        : obraSocialInicialEsConocida
            ? paciente.obraSocial
            : 'Otra'

    const [documento, setDocumento] = useState(paciente?.documento || '')
    const [telefono, setTelefono] = useState(paciente?.telefono || '')
    const [obraSocialSel, setObraSocialSel] = useState(obraSocialInicial)
    const [obraSocialOtra, setObraSocialOtra] = useState(
        !obraSocialInicialEsConocida ? paciente?.obraSocial || '' : ''
    )
    const [notasPaciente, setNotasPaciente] = useState(paciente?.notas || '')

    const [dentistaSel, setDentistaSel] = useState(turno?.dentistaId || '')
    const [notasClinicas, setNotasClinicas] = useState('')
    const [receta, setReceta] = useState('')
    const [monto, setMonto] = useState('')
    const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo')

    if (!turno || !paciente) {
        return (
            <div>
                <TopBar title="Turno" onBack={true} />
                <p className="p-5 text-muted">No se encontró el turno.</p>
            </div>
        )
    }

    function obraSocialFinal() {
        if (obraSocialSel === 'Sin obra social') return ''
        if (obraSocialSel === 'Otra') return obraSocialOtra.trim()
        return obraSocialSel
    }

    function completar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!turno || !paciente) return
        if (!dentistaSel) return

        const obraSocial = obraSocialFinal()

        db.actualizarPaciente(paciente.id, {
            documento: documento.trim(),
            telefono: telefono.trim(),
            obraSocial,
            notas: notasPaciente.trim(),
        })

        if (dentistaSel !== turno.dentistaId) {
            db.actualizarTurno(turno.id, { dentistaId: dentistaSel })
        }

        db.crearAtencion({
            pacienteId: paciente.id,
            turnoId: turno.id,
            dentistaId: dentistaSel,
            notasClinicas: notasClinicas.trim(),
            receta: receta.trim(),
            monto: Number(monto) || 0,
            metodoPago,
            tieneObraSocial: Boolean(obraSocial),
        })
        db.actualizarTurno(turno.id, { estado: 'atendido' })
        navigate('/')
    }

    function cancelarTurno() {
        if (!turno) return
        db.actualizarTurno(turno.id, { estado: 'cancelado' })
        navigate('/')
    }

    return (
        <div>
            <TopBar title={paciente.nombre} subtitle={`${formatFechaLarga(turno.fechaHora)} · ${formatHora(turno.fechaHora)}`} onBack={true} />

            <div className="px-5 pb-1.5 pt-4">
                <p className="m-0 text-sm text-ink-soft">Motivo: {turno.motivo}</p>
            </div>

            <form onSubmit={completar} className="flex flex-col gap-[18px] px-5 pb-8 pt-2.5 desktop:max-w-shell">
                {!turno.dentistaId && (
                    <div className="rounded-md border border-primary bg-primary-soft p-4">
                        <Campo label="¿Quién lo atendió?">
                            <select value={dentistaSel} onChange={(e) => setDentistaSel(e.target.value)} className={inputClass}>
                                <option value="">Seleccioná un dentista</option>
                                {dentistas.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.nombre}
                                    </option>
                                ))}
                            </select>
                        </Campo>
                    </div>
                )}

                <div className="rounded-md border border-border bg-surface-sunken p-4">
                    <p className="m-0 mb-3.5 text-[13px] font-bold uppercase tracking-wide text-ink-soft">Datos del paciente</p>

                    <div className="flex flex-col gap-[14px]">
                        <div className="flex gap-3">
                            <Campo label="DNI" className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Ej: 32.456.789"
                                    value={documento}
                                    onChange={(e) => setDocumento(e.target.value)}
                                    className={inputClass}
                                />
                            </Campo>
                            <Campo label="Teléfono" className="flex-1">
                                <input
                                    type="tel"
                                    placeholder="Ej: 11 4444-1234"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    className={inputClass}
                                />
                            </Campo>
                        </div>

                        <Campo label="Obra social">
                            <select value={obraSocialSel} onChange={(e) => setObraSocialSel(e.target.value)} className={inputClass}>
                                {OBRAS_SOCIALES.map((os) => (
                                    <option key={os} value={os}>
                                        {os}
                                    </option>
                                ))}
                            </select>
                        </Campo>

                        {obraSocialSel === 'Otra' && (
                            <Campo label="¿Cuál?">
                                <input
                                    type="text"
                                    placeholder="Nombre de la obra social"
                                    value={obraSocialOtra}
                                    onChange={(e) => setObraSocialOtra(e.target.value)}
                                    className={inputClass}
                                />
                            </Campo>
                        )}

                        <Campo label="Observaciones (alergias, antecedentes, etc.)">
                            <textarea
                                rows={2}
                                placeholder="Ej: Alérgico a la penicilina"
                                value={notasPaciente}
                                onChange={(e) => setNotasPaciente(e.target.value)}
                                className={`${inputClass} resize-y`}
                            />
                        </Campo>
                    </div>
                </div>

                {notasPaciente.trim() && (
                    <p className="m-0 -mt-2.5 rounded-sm bg-status-cancelado-soft px-3 py-2 text-[13px] text-status-cancelado">
                        ⚠ {notasPaciente.trim()}
                    </p>
                )}

                <Campo label="Notas clínicas de esta sesión">
                    <textarea
                        rows={4}
                        placeholder="Qué se hizo, cómo evolucionó, próximos pasos..."
                        value={notasClinicas}
                        onChange={(e) => setNotasClinicas(e.target.value)}
                        className={`${inputClass} resize-y`}
                    />
                </Campo>

                <Campo label="Receta (opcional)">
                    <textarea
                        rows={2}
                        placeholder="Ej: Ibuprofeno 600mg cada 8hs por 3 días"
                        value={receta}
                        onChange={(e) => setReceta(e.target.value)}
                        className={`${inputClass} resize-y`}
                    />
                </Campo>

                <div className="flex gap-3">
                    <Campo label="Cobro" className="flex-1">
                        <input
                            type="number"
                            inputMode="numeric"
                            placeholder="0"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            className={inputClass}
                        />
                    </Campo>
                    <Campo label="Método" className="flex-1">
                        <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value as MetodoPago)} className={inputClass}>
                            <option value="efectivo">Efectivo</option>
                            <option value="transferencia">Transferencia</option>
                            <option value="otro">Otro</option>
                        </select>
                    </Campo>
                </div>

                <button
                    type="submit"
                    className="mt-1 rounded-sm border-none bg-primary px-3.5 py-3.5 text-[15.5px] font-bold text-white disabled:opacity-50"
                    disabled={!dentistaSel}
                >
                    Marcar como atendido
                </button>
                <button
                    type="button"
                    onClick={cancelarTurno}
                    className="rounded-sm border border-status-cancelado bg-transparent px-3 py-3 text-sm font-bold text-status-cancelado"
                >
                    Cancelar este turno
                </button>
            </form>
        </div>
    )
}

interface CampoProps {
    label: string
    children: ReactNode
    className?: string
}

function Campo({ label, children, className = '' }: CampoProps) {
    return (
        <label className={`flex flex-col gap-1.5 ${className}`}>
            <span className="text-[13px] font-semibold text-ink-soft">{label}</span>
            {children}
        </label>
    )
}

const inputClass =
    'w-full rounded-sm border border-border bg-surface px-3.5 py-3 font-[inherit] text-[15px] text-ink'