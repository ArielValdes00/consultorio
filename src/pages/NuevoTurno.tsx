import { useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../lib/db'
import { useSession } from '../context/SessionContext'
import TopBar from '../components/TopBar'
import { MOTIVOS_CONSULTA } from '../types'

export default function NuevoTurno() {
    const navigate = useNavigate()
    const { dentistaId } = useSession()
    const pacientes = db.getPacientes()
    const dentistas = db.getDentistas()

    const hoy = new Date()
    const [esPacienteNuevo, setEsPacienteNuevo] = useState(pacientes.length === 0)
    const [pacienteId, setPacienteId] = useState(pacientes[0]?.id || '')
    const [nombreNuevoPaciente, setNombreNuevoPaciente] = useState('')
    const [fecha, setFecha] = useState(hoy.toISOString().slice(0, 10))
    const [hora, setHora] = useState('09:00')
    const [motivoSel, setMotivoSel] = useState<string>(MOTIVOS_CONSULTA[0])
    const [motivoOtro, setMotivoOtro] = useState('')
    const [dentistaAsignado, setDentistaAsignado] = useState(dentistaId ?? '')

    function motivoFinal() {
        if (motivoSel === 'Otro') return motivoOtro.trim()
        return motivoSel
    }

    function guardar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        let pacienteIdFinal = pacienteId
        if (esPacienteNuevo) {
            const nombre = nombreNuevoPaciente.trim()
            if (!nombre) return
            const nuevoPaciente = db.crearPaciente({
                nombre,
                documento: '',
                telefono: '',
                obraSocial: '',
                notas: '',
            })
            pacienteIdFinal = nuevoPaciente.id
        }

        const motivo = motivoFinal()
        if (!pacienteIdFinal || !motivo) return
        const fechaHora = new Date(`${fecha}T${hora}:00`).toISOString()
        db.crearTurno({ pacienteId: pacienteIdFinal, dentistaId: dentistaAsignado, fechaHora, motivo })
        navigate('/')
    }

    return (
        <div>
            <TopBar title="Nuevo turno" onBack={true} />
            <form
                onSubmit={guardar}
                className="flex flex-col gap-[18px] px-5 pb-8 pt-[18px] desktop:max-w-shell"
            >
                {pacientes.length > 0 && (
                    <div className="flex gap-2 rounded-sm bg-surface-sunken p-1">
                        <button
                            type="button"
                            onClick={() => setEsPacienteNuevo(false)}
                            className={`flex-1 rounded-sm border-none py-2 text-[13.5px] font-semibold ${!esPacienteNuevo ? 'bg-primary text-white' : 'bg-transparent text-ink-soft'
                                }`}
                        >
                            Paciente existente
                        </button>
                        <button
                            type="button"
                            onClick={() => setEsPacienteNuevo(true)}
                            className={`flex-1 rounded-sm border-none py-2 text-[13.5px] font-semibold ${esPacienteNuevo ? 'bg-primary text-white' : 'bg-transparent text-ink-soft'
                                }`}
                        >
                            Paciente nuevo
                        </button>
                    </div>
                )}

                {esPacienteNuevo ? (
                    <Campo label="Nombre del paciente">
                        <input
                            type="text"
                            placeholder="Nombre y apellido"
                            value={nombreNuevoPaciente}
                            onChange={(e) => setNombreNuevoPaciente(e.target.value)}
                            className={inputClass}
                            autoFocus
                        />
                        <span className="text-xs text-muted">
                            El resto de los datos se completan cuando el paciente venga a la consulta.
                        </span>
                    </Campo>
                ) : pacientes.length === 0 ? (
                    <p className="text-sm text-muted">Primero cargá un paciente desde la sección Pacientes.</p>
                ) : (
                    <Campo label="Paciente">
                        <select value={pacienteId} onChange={(e) => setPacienteId(e.target.value)} className={inputClass}>
                            {pacientes.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre}
                                </option>
                            ))}
                        </select>
                    </Campo>
                )}

                <div className="flex gap-3">
                    <Campo label="Fecha" className="flex-1">
                        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputClass} />
                    </Campo>
                    <Campo label="Hora" className="flex-1">
                        <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className={inputClass} />
                    </Campo>
                </div>

                <Campo label="Motivo de la consulta">
                    <select value={motivoSel} onChange={(e) => setMotivoSel(e.target.value)} className={inputClass}>
                        {MOTIVOS_CONSULTA.map((m) => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>
                </Campo>

                {motivoSel === 'Otro' && (
                    <Campo label="¿Cuál es el motivo?">
                        <input
                            type="text"
                            placeholder="Describí el motivo de la consulta"
                            value={motivoOtro}
                            onChange={(e) => setMotivoOtro(e.target.value)}
                            className={inputClass}
                        />
                    </Campo>
                )}

                <Campo label="Atiende">
                    <select value={dentistaAsignado} onChange={(e) => setDentistaAsignado(e.target.value)} className={inputClass}>
                        <option value="">Sin asignar</option>
                        {dentistas.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.nombre}
                            </option>
                        ))}
                    </select>
                </Campo>

                <button
                    type="submit"
                    className={submitClass}
                    disabled={
                        (esPacienteNuevo ? !nombreNuevoPaciente.trim() : pacientes.length === 0) ||
                        (motivoSel === 'Otro' && !motivoOtro.trim())
                    }
                >
                    Guardar turno
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
    'w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-[15px] text-ink'

const submitClass =
    'mt-2 rounded-sm border-none bg-primary px-3.5 py-3.5 text-[15.5px] font-bold text-white disabled:opacity-50'