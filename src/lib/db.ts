
import type {
    Atencion,
    Dentista,
    NuevaAtencionInput,
    NuevoPacienteInput,
    NuevoTurnoInput,
    Paciente,
    Turno,
} from '../types'

const KEY = 'consultorio_db_v1'

interface DB {
    dentistas: Dentista[]
    pacientes: Paciente[]
    turnos: Turno[]
    atenciones: Atencion[]
}

function uid(prefix: string) {
    return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
}

function seed(): DB {
    const dentistas: Dentista[] = [
        { id: 'den_1', nombre: 'Dra. Carla Núñez', color: '#3F6B52' },
        { id: 'den_2', nombre: 'Dr. Martín Reyes', color: '#8A5A44' },
    ]

    const pacientes: Paciente[] = [
        {
            id: 'pac_1',
            nombre: 'Lucía Fernández',
            documento: '32.456.789',
            telefono: '11 4444-1234',
            obraSocial: 'OSDE',
            notas: 'Alérgica a la penicilina',
        },
        {
            id: 'pac_2',
            nombre: 'Javier Ortiz',
            documento: '28.901.234',
            telefono: '11 5555-9876',
            obraSocial: '',
            notas: '',
        },
        {
            id: 'pac_3',
            nombre: 'Rocío Paz',
            documento: '40.123.456',
            telefono: '11 3333-2222',
            obraSocial: 'Swiss Medical',
            notas: '',
        },
    ]

    const hoy = new Date()
    const iso = (d: Date, h: number, m: number) => {
        const x = new Date(d)
        x.setHours(h, m, 0, 0)
        return x.toISOString()
    }

    const manana = new Date(hoy)
    manana.setDate(manana.getDate() + 1)
    const ayer = new Date(hoy)
    ayer.setDate(ayer.getDate() - 1)
    const pasadoManana = new Date(hoy)
    pasadoManana.setDate(pasadoManana.getDate() + 2)

    const turnos: Turno[] = [
        {
            id: 'tur_1',
            pacienteId: 'pac_1',
            dentistaId: 'den_1',
            fechaHora: iso(hoy, 10, 0),
            motivo: 'Tratamiento de conducto - sesión 2',
            estado: 'pendiente',
        },
        {
            id: 'tur_2',
            pacienteId: 'pac_2',
            dentistaId: 'den_2',
            fechaHora: iso(hoy, 11, 30),
            motivo: 'Control de limpieza',
            estado: 'pendiente',
        },
        {
            id: 'tur_3',
            pacienteId: 'pac_3',
            dentistaId: 'den_1',
            fechaHora: iso(hoy, 16, 0),
            motivo: 'Dolor en muela',
            estado: 'pendiente',
        },
        {
            id: 'tur_4',
            pacienteId: 'pac_2',
            dentistaId: 'den_1',
            fechaHora: iso(hoy, 9, 0),
            motivo: 'Extracción muela del juicio',
            estado: 'atendido',
        },
        {
            id: 'tur_5',
            pacienteId: 'pac_1',
            dentistaId: 'den_2',
            fechaHora: iso(ayer, 15, 0),
            motivo: 'Blanqueamiento dental',
            estado: 'atendido',
        },
        {
            id: 'tur_6',
            pacienteId: 'pac_3',
            dentistaId: 'den_2',
            fechaHora: iso(ayer, 17, 30),
            motivo: 'Control post operatorio',
            estado: 'cancelado',
        },
        {
            id: 'tur_7',
            pacienteId: 'pac_1',
            dentistaId: 'den_1',
            fechaHora: iso(manana, 10, 30),
            motivo: 'Tratamiento de conducto - sesión 3',
            estado: 'pendiente',
        },
        {
            id: 'tur_8',
            pacienteId: 'pac_3',
            dentistaId: 'den_2',
            fechaHora: iso(manana, 14, 0),
            motivo: 'Colocación de brackets',
            estado: 'pendiente',
        },
        {
            id: 'tur_9',
            pacienteId: 'pac_2',
            dentistaId: 'den_1',
            fechaHora: iso(pasadoManana, 11, 0),
            motivo: 'Control de limpieza',
            estado: 'pendiente',
        },
    ]

    const haceUnMes = new Date(hoy)
    haceUnMes.setDate(haceUnMes.getDate() - 30)
    const haceDosMeses = new Date(hoy)
    haceDosMeses.setDate(haceDosMeses.getDate() - 60)

    const atenciones: Atencion[] = [
        {
            id: 'ate_1',
            pacienteId: 'pac_2',
            turnoId: 'tur_4',
            dentistaId: 'den_1',
            fecha: iso(hoy, 9, 40),
            notasClinicas: 'Extracción de muela del juicio inferior derecha. Sin complicaciones. Sutura reabsorbible.',
            receta: 'Ibuprofeno 600mg cada 8hs por 3 días. Amoxicilina 500mg cada 8hs por 7 días.',
            monto: 45000,
            metodoPago: 'transferencia',
            tieneObraSocial: false,
        },
        {
            id: 'ate_2',
            pacienteId: 'pac_1',
            turnoId: 'tur_5',
            dentistaId: 'den_2',
            fecha: iso(ayer, 15, 30),
            notasClinicas: 'Blanqueamiento dental en consultorio, una sesión. Paciente conforme con el resultado.',
            receta: '',
            monto: 28000,
            metodoPago: 'efectivo',
            tieneObraSocial: true,
        },
        {
            id: 'ate_3',
            pacienteId: 'pac_1',
            turnoId: 'tur_prev_1',
            dentistaId: 'den_1',
            fecha: iso(haceUnMes, 11, 0),
            notasClinicas: 'Tratamiento de conducto - sesión 1. Se realizó apertura cameral y limpieza inicial. Continúa sesión 2.',
            receta: 'Ibuprofeno 400mg cada 8hs si hay dolor.',
            monto: 32000,
            metodoPago: 'transferencia',
            tieneObraSocial: true,
        },
        {
            id: 'ate_4',
            pacienteId: 'pac_3',
            turnoId: 'tur_prev_2',
            dentistaId: 'den_1',
            fecha: iso(haceDosMeses, 16, 15),
            notasClinicas: 'Consulta por dolor. Diagnóstico: caries profunda en pieza 26. Se indica tratamiento de conducto.',
            receta: 'Ibuprofeno 600mg cada 8hs por 3 días.',
            monto: 15000,
            metodoPago: 'efectivo',
            tieneObraSocial: true,
        },
        {
            id: 'ate_5',
            pacienteId: 'pac_2',
            turnoId: 'tur_prev_3',
            dentistaId: 'den_2',
            fecha: iso(haceDosMeses, 10, 0),
            notasClinicas: 'Control de rutina y limpieza. Buena higiene bucal en general.',
            receta: '',
            monto: 12000,
            metodoPago: 'transferencia',
            tieneObraSocial: false,
        },
    ]
    return { dentistas, pacientes, turnos, atenciones }
}

function read(): DB {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
        const initial = seed()
        localStorage.setItem(KEY, JSON.stringify(initial))
        return initial
    }
    try {
        return JSON.parse(raw) as DB
    } catch {
        const initial = seed()
        localStorage.setItem(KEY, JSON.stringify(initial))
        return initial
    }
}

function write(data: DB) {
    localStorage.setItem(KEY, JSON.stringify(data))
}

export const db = {
    reset() {
        write(seed())
    },

    // Dentistas
    getDentistas(): Dentista[] {
        return read().dentistas
    },
    getDentista(id: string): Dentista | null {
        return read().dentistas.find((d) => d.id === id) || null
    },

    // Pacientes
    getPacientes(): Paciente[] {
        return read().pacientes.sort((a, b) => a.nombre.localeCompare(b.nombre))
    },
    getPaciente(id: string): Paciente | null {
        return read().pacientes.find((p) => p.id === id) || null
    },
    crearPaciente(datos: NuevoPacienteInput): Paciente {
        const data = read()
        const paciente: Paciente = { id: uid('pac'), ...datos }
        data.pacientes.push(paciente)
        write(data)
        return paciente
    },
    actualizarPaciente(id: string, cambios: Partial<Paciente>): Paciente | null {
        const data = read()
        const idx = data.pacientes.findIndex((p) => p.id === id)
        if (idx === -1) return null
        data.pacientes[idx] = { ...data.pacientes[idx], ...cambios }
        write(data)
        return data.pacientes[idx]
    },

    // Turnos
    getTurnos(): Turno[] {
        return read().turnos.sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime())
    },
    getTurno(id: string): Turno | null {
        return read().turnos.find((t) => t.id === id) || null
    },
    crearTurno(datos: NuevoTurnoInput): Turno {
        const data = read()
        const turno: Turno = { id: uid('tur'), estado: 'pendiente', ...datos }
        data.turnos.push(turno)
        write(data)
        return turno
    },
    actualizarTurno(id: string, cambios: Partial<Turno>): Turno | null {
        const data = read()
        const idx = data.turnos.findIndex((t) => t.id === id)
        if (idx === -1) return null
        data.turnos[idx] = { ...data.turnos[idx], ...cambios }
        write(data)
        return data.turnos[idx]
    },

    getAtencionesPorPaciente(pacienteId: string): Atencion[] {
        return read()
            .atenciones.filter((a) => a.pacienteId === pacienteId)
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    },
    getAtenciones(): Atencion[] {
        return read().atenciones
    },
    crearAtencion(datos: NuevaAtencionInput): Atencion {
        const data = read()
        const atencion: Atencion = {
            id: uid('ate'),
            fecha: new Date().toISOString(),
            notasClinicas: '',
            receta: '',
            monto: 0,
            metodoPago: 'efectivo',
            tieneObraSocial: false,
            ...datos,
        }
        data.atenciones.push(atencion)
        write(data)
        return atencion
    },
}
