import { NavLink } from 'react-router-dom'
import { navItems } from './NavIcons'
import { useSession } from '../context/SessionContext'

export default function Sidebar() {
  const { dentista } = useSession()

  return (
    <aside className="sticky top-0 flex min-h-dvh w-[232px] flex-shrink-0 flex-col border-r border-border bg-surface px-4 py-[22px]">
      <div className="mb-7 px-2.5">
        <span className="font-serif text-xl font-semibold text-ink">Consultorio</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-sm px-3 py-2.5 text-[14.5px] ${
                isActive ? 'bg-primary-soft text-primary-dark' : 'bg-transparent text-ink-soft'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon active={isActive} />
                <span className={isActive ? 'font-bold' : 'font-medium'}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {dentista && (
        <div className="mt-3 flex items-center gap-2.5 border-t border-border p-2.5">
          <span
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: dentista.color }}
          >
            {dentista.nombre
              .replace(/^(Dra?\.)\s*/, '')
              .split(' ')
              .slice(0, 2)
              .map((p) => p[0])
              .join('')
              .toUpperCase()}
          </span>
          <span className="text-[13px] font-semibold text-ink">{dentista.nombre}</span>
        </div>
      )}
    </aside>
  )
}
