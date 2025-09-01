import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './Contexts/UserContext.tsx'
import { ThemeProvider } from './Contexts/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <UserProvider>
      <App/>
      </UserProvider>
    </ThemeProvider>
  </StrictMode>,
)
