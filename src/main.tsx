import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import AppProviders from './app/Providers'

import './styles/index.css'
import "./styles/App.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders />      
  </StrictMode>
)
