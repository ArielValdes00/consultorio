interface IconProps {
    active?: boolean
}

export function IconAgenda({ active }: IconProps) {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3.5" y="5" width="17" height="15" rx="3" stroke="currentColor" strokeWidth={active ? 2 : 1.6} />
            <path d="M8 3v4M16 3v4M3.5 10h17" stroke="currentColor" strokeWidth={active ? 2 : 1.6} strokeLinecap="round" />
        </svg>
    )
}

export function IconPacientes({ active }: IconProps) {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8.5" r="3.3" stroke="currentColor" strokeWidth={active ? 2 : 1.6} />
            <path d="M4.5 20c1.2-4 4-5.8 7.5-5.8s6.3 1.8 7.5 5.8" stroke="currentColor" strokeWidth={active ? 2 : 1.6} strokeLinecap="round" />
        </svg>
    )
}

export function IconFinanzas({ active }: IconProps) {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 19V10M10 19V5M16 19v-7M20 19H4" stroke="currentColor" strokeWidth={active ? 2 : 1.6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export function IconPerfil({ active }: IconProps) {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8.3" stroke="currentColor" strokeWidth={active ? 2 : 1.6} />
            <circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth={active ? 2 : 1.6} />
            <path d="M6.5 18.2c1.2-2.4 3.2-3.6 5.5-3.6s4.3 1.2 5.5 3.6" stroke="currentColor" strokeWidth={active ? 2 : 1.6} strokeLinecap="round" />
        </svg>
    )
}

export function IconHistorial({ active }: IconProps) {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 5v5h5" stroke="currentColor" strokeWidth={active ? 2 : 1.6} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.5 10a8 8 0 1 1 1.9 8.3" stroke="currentColor" strokeWidth={active ? 2 : 1.6} strokeLinecap="round" />
            <path d="M12 8v4.5l3 2" stroke="currentColor" strokeWidth={active ? 2 : 1.6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export interface NavItem {
    to: string
    label: string
    icon: (props: IconProps) => React.JSX.Element
}

export const navItems: NavItem[] = [
    { to: '/', label: 'Agenda', icon: IconAgenda },
    { to: '/historial', label: 'Historial', icon: IconHistorial },
    { to: '/pacientes', label: 'Pacientes', icon: IconPacientes },
    { to: '/finanzas', label: 'Finanzas', icon: IconFinanzas },
    { to: '/perfil', label: 'Perfil', icon: IconPerfil },
]
