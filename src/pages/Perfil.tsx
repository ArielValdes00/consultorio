import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import TopBar from '../components/TopBar'

export default function Perfil() {
  const { dentista, cerrarSesion } = useSession()
  const navigate = useNavigate()

  function cambiarCuenta() {
    cerrarSesion()
    navigate('/login', { replace: true })
  }

  return (
    <div>
      <TopBar title="Perfil" />
      <div className="p-5">
        <div className="mb-4 flex items-center gap-3.5 rounded-md border border-border bg-surface px-4 py-[18px]">
          <span
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full font-bold text-white"
            style={{ background: dentista?.color }}
          >
            {dentista?.nombre
              .replace(/^(Dra?\.)\s*/, '')
              .split(' ')
              .slice(0, 2)
              .map((p) => p[0])
              .join('')
              .toUpperCase()}
          </span>
          <div>
            <p className="m-0 text-base font-bold text-ink">{dentista?.nombre}</p>
            <p className="m-0 mt-0.5 text-[12.5px] text-muted">Cuenta individual</p>
          </div>
        </div>

        <button
          onClick={cambiarCuenta}
          className="w-full rounded-sm border border-border bg-surface px-3 py-[13px] text-[14.5px] font-bold text-ink"
        >
          Cambiar de cuenta
        </button>

        <p className="mt-4 text-[13px] leading-relaxed text-muted">
          Cada dentista tiene su propia cuenta. La agenda y los pacientes se comparten entre ambos, pero las
          finanzas de cada uno son privadas.
        </p>
      </div>
    </div>
  )
}
