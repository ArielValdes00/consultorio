import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { SessionProvider } from './context/SessionContext'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('No se encontró el elemento #root')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <App />
      </SessionProvider>
    </BrowserRouter>
  </React.StrictMode>
)
