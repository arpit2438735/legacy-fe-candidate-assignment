import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DynamicWrapper } from './contexts/DynamicContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DynamicWrapper>
      <App />
    </DynamicWrapper>
  </StrictMode>,
)
