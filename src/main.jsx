import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AuthContextProvider from "./Contexts/AuthContext";
import GetProfileContextProvider from "./Contexts/getProfileContext";

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <GetProfileContextProvider>
    <App />
      </GetProfileContextProvider>
    </AuthContextProvider>
  </StrictMode>,
)
