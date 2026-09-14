import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { useSession } from './context/SessionContext'
import { useIsDesktop } from './hooks/useIsDesktop'
import BottomNav from './components/BottomNav'
import Sidebar from './components/Sidebar'

import Login from './pages/Login'
import Agenda from './pages/Agenda'
import NuevoTurno from './pages/NuevoTurno'
import AtenderTurno from './pages/AtenderTurno'
import Pacientes from './pages/Pacientes'
import NuevoPaciente from './pages/NuevoPaciente'
import PacienteDetalle from './pages/PacienteDetalle'
import Finanzas from './pages/Finanzas'
import Perfil from './pages/Perfil'
import HistorialAtenciones from './pages/HistorialAtenciones'

function Shell() {
    const isDesktop = useIsDesktop()

    return (
        <div className={`flex min-h-dvh w-full ${isDesktop ? 'flex-row' : 'flex-col'}`}>
            {isDesktop && <Sidebar />}
            <div className="min-w-0 flex-1 overflow-y-auto">
                <Outlet />
            </div>
            {!isDesktop && <BottomNav />}
        </div>
    )
}

function RutaPrivada() {
    const { dentistaId } = useSession()
    if (!dentistaId) return <Navigate to="/login" replace />
    return <Shell />
}

export default function App() {
    const isDesktop = useIsDesktop()

    return (
        <div
            className={`flex min-h-dvh w-full flex-col bg-bg ${isDesktop ? 'max-w-none shadow-[0_0_0_1px_var(--color-border)]' : 'max-w-shell shadow-none'
                }`}
        >
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<RutaPrivada />}>
                    <Route path="/" element={<Agenda />} />
                    <Route path="/turnos/nuevo" element={<NuevoTurno />} />
                    <Route path="/turnos/:id/atender" element={<AtenderTurno />} />
                    <Route path="/pacientes" element={<Pacientes />} />
                    <Route path="/pacientes/nuevo" element={<NuevoPaciente />} />
                    <Route path="/pacientes/:id" element={<PacienteDetalle />} />
                    <Route path="/historial" element={<HistorialAtenciones />} />
                    <Route path="/finanzas" element={<Finanzas />} />
                    <Route path="/perfil" element={<Perfil />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    )
}
