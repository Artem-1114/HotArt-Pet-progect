import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom' // Змінив BrowserRouter на HashRouter
import App from './App.jsx'
import './index.css'
import './i18n/i18n'
import { AuthProvider } from './components/AuthContext'
import { WishlistProvider } from './components/WishlistContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter> {/* Використовуємо HashRouter замість BrowserRouter */}
      <AuthProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
)