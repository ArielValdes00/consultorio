import { useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../lib/db'
import TopBar from '../components/TopBar'
import { OBRAS_SOCIALES } from '../types'

export default function NuevoPaciente() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [documento, setDocumento] = useState('')
  const [telefono, setTelefono] = useState('')
  const [obraSocialSel, setObraSocialSel] = useState('Sin obra social')
  const [obraSocialOtra, setObraSocialOtra] = useState('')
  const [notas, setNotas] = useState('')

  function obraSocialFinal() {
    if (obraSocialSel === 'Sin obra social') return ''
    if (obraSocialSel === 'Otra') return obraSocialOtra.trim()
    return obraSocialSel
  }

  function guardar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!nombre.trim() || !documento.trim()) return
    const paciente = db.crearPaciente({
      nombre: nombre.trim(),
      documento: documento.trim(),
      telefono: telefono.trim(),
      obraSocial: obraSocialFinal(),
      notas: notas.trim(),
    })
    navigate(`/pacientes/${paciente.id}`, { replace: true })
  }

  return (
    <div>
      <TopBar title="Nuevo paciente" onBack={true} />
      <form onSubmit={guardar} className="flex flex-col gap-[18px] px-5 pb-8 pt-[18px] desktop:max-w-shell">
        <Campo label="Nombre completo">
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClass} autoFocus />
        </Campo>
        <Campo label="Número de documento">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Ej: 32.456.789"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            className={inputClass}
          />
        </Campo>
        <Campo label="Teléfono">
          <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} className={inputClass} />
        </Campo>
        <Campo label="Obra social">
          <select value={obraSocialSel} onChange={(e) => setObraSocialSel(e.target.value)} className={inputClass}>
            {OBRAS_SOCIALES.map((os) => (
              <option key={os} value={os}>
                {os}
              </option>
            ))}
          </select>
        </Campo>
        {obraSocialSel === 'Otra' && (
          <Campo label="¿Cuál?">
            <input
              type="text"
              placeholder="Nombre de la obra social"
              value={obraSocialOtra}
              onChange={(e) => setObraSocialOtra(e.target.value)}
              className={inputClass}
            />
          </Campo>
        )}
        <Campo label="Notas importantes (alergias, etc.)">
          <textarea rows={3} value={notas} onChange={(e) => setNotas(e.target.value)} className={`${inputClass} resize-y`} />
        </Campo>
        <button type="submit" className="mt-2 rounded-sm border-none bg-primary px-3.5 py-3.5 text-[15.5px] font-bold text-white">
          Guardar paciente
        </button>
      </form>
    </div>
  )
}

function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-ink-soft">{label}</span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-sm border border-border bg-surface px-3.5 py-3 font-[inherit] text-[15px] text-ink'