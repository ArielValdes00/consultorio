import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface TopBarProps {
  title: string
  subtitle?: string
  onBack?: true | (() => void)
  action?: ReactNode
}

export default function TopBar({ title, subtitle, onBack, action }: TopBarProps) {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-surface px-5 pb-3.5 pt-[18px]">
      <div className="flex items-center gap-2.5">
        {onBack !== undefined && (
          <button
            aria-label="Volver"
            onClick={onBack === true ? () => navigate(-1) : onBack}
            className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full border-none bg-surface-sunken text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <div>
          <h1 className="m-0 font-serif text-[22px] font-semibold text-ink">{title}</h1>
          {subtitle && <p className="m-0 mt-0.5 text-[13px] text-muted">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </header>
  )
}
