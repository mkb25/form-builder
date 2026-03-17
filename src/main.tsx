import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppContent from './App.tsx'
import { BuilderProvider } from './context/BuilderContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BuilderProvider>
      <AppContent />
    </BuilderProvider>
  </StrictMode>,
)
