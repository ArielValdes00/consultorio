import { NavLink } from 'react-router-dom'
import { navItems } from './NavIcons'

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-20 flex flex-shrink-0 items-center justify-around border-t border-border bg-surface pb-[max(8px,env(safe-area-inset-bottom))] pt-2">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex min-w-16 flex-col items-center gap-[3px] px-2.5 py-1 ${isActive ? 'text-primary-dark' : 'text-muted'}`
          }
        >
          {({ isActive }) => (
            <>
              <Icon active={isActive} />
              <span className={`text-[11px] ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
