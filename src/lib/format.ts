export function formatHora(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

export function formatFechaCorta(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
}

export function formatFechaLarga(iso: string): string {
  const d = new Date(iso)
  const texto = d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export function formatMoneda(valor: number | null | undefined): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(
    valor || 0
  )
}

export function esMismoDia(isoA: string | Date, isoB: string | Date): boolean {
  const a = new Date(isoA)
  const b = new Date(isoB)
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
