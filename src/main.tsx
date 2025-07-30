import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.tsx';
import { ThemeProvider } from './components/theme-provider.tsx'; // Import the new provider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <App />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
)