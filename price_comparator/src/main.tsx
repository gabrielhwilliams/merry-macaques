import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ShoppingProvider } from './context/ShoppingContext'

const storedTheme = localStorage.getItem('themeMode')
document.documentElement.setAttribute('data-theme', storedTheme === 'dark' ? 'dark' : 'light')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ShoppingProvider>
      <App />
    </ShoppingProvider>
  </StrictMode>,
)
