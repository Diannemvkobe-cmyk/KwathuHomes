/*
Purpose
- Bootstraps the React application and wraps it in global providers.
- Ensures errors are caught and theming/auth are available app-wide.

How It Works
- Renders App inside ErrorBoundary, ThemeProvider, and AuthProvider.
- Imports index.css for Tailwind and global styles.

Where It Fits
- Entry point referenced from index.html.
*/
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "./index.css"
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

import ErrorBoundary from './components/ui/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
