interface EmptyStateProps {
  title: string
  hint?: string
}

export default function EmptyState({ title, hint }: EmptyStateProps) {
  return (
    <div className="px-6 py-12 text-center">
      <p className="m-0 mb-1.5 font-serif text-[17px] text-ink-soft">{title}</p>
      {hint && <p className="m-0 text-[13px] text-muted">{hint}</p>}
    </div>
  )
}
