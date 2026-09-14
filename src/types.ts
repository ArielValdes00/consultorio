export interface Dentista {
  id: string
  nombre: string
  color: string
}

export interface Paciente {
  id: string
  nombre: string
  documento: string
  telefono: string
  obraSocial: string
  notas: string
}

export type NuevoPacienteInput = Omit<Paciente, 'id'>

export type EstadoTurno = 'pendiente' | 'atendido' | 'cancelado'

export interface Turno {
  id: string
  pacienteId: string
  dentistaId: string
  fechaHora: string
  motivo: string
  estado: EstadoTurno
}

export type NuevoTurnoInput = Omit<Turno, 'id' | 'estado'> & { estado?: EstadoTurno }

export type MetodoPago = 'efectivo' | 'transferencia' | 'otro'

export interface Atencion {
  id: string
  pacienteId: string
  turnoId: string
  dentistaId: string
  fecha: string
  notasClinicas: string
  receta: string
  monto: number
  metodoPago: MetodoPago
  tieneObraSocial: boolean
}

export type NuevaAtencionInput = Omit<Atencion, 'id' | 'fecha' | 'notasClinicas' | 'receta' | 'monto' | 'metodoPago' | 'tieneObraSocial'> &
  Partial<Pick<Atencion, 'fecha' | 'notasClinicas' | 'receta' | 'monto' | 'metodoPago' | 'tieneObraSocial'>>

export const OBRAS_SOCIALES = ['Sin obra social', 'OSDE', 'Swiss Medical', 'Galeno', 'IOMA', 'PAMI', 'Medicus', 'Otra'] as const

export const MOTIVOS_CONSULTA = [
  'Control o limpieza',
  'Dolor o urgencia',
  'Consulta general',
  'Tratamiento de conducto',
  'Extracción',
  'Ortodoncia (brackets)',
  'Blanqueamiento',
  'Colocación de empaste',
  'Control post operatorio',
  'Otro',
] as const