import type { EstadoTurno } from '../types'

const LABELS: Record<EstadoTurno, string> = {
  pendiente: 'Pendiente',
  atendido: 'Atendido',
  cancelado: 'Cancelado',
}

// Clases estáticas por estado (Tailwind necesita nombres de clase completos,
// no se pueden armar por interpolación de string).
const ESTILOS: Record<EstadoTurno, string> = {
  pendiente: 'text-status-pendiente bg-status-pendiente-soft',
  atendido: 'text-status-atendido bg-status-atendido-soft',
  cancelado: 'text-status-cancelado bg-status-cancelado-soft',
}

interface StatusPillProps {
  estado: EstadoTurno
}

export default function StatusPill({ estado }: StatusPillProps) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-[3px] text-xs font-bold ${ESTILOS[estado]}`}>
      {LABELS[estado] || estado}
    </span>
  )
}
