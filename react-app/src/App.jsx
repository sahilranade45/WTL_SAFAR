import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState(() => {
    return window.location.hash === '#overview' ? 'welcome' : 'dashboard'
  })
  const [clickCount, setClickCount] = useState(0)

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#overview') {
        setCurrentView('welcome')
      } else {
        setCurrentView('dashboard')
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleViewChange = (view) => {
    setCurrentView(view)
    window.location.hash = view === 'welcome' ? '#overview' : '#dashboard'
  }

  return (
    <div className="safar-app">
      {/* ================= SAFAR NAVBAR ================= */}
      <Navbar currentView={currentView} onViewChange={handleViewChange} />

      {/* ================= MAIN CONTENT ================= */}
      <main className="main-container">
        {currentView === 'dashboard' ? (
          <Dashboard />
        ) : (
          /* ================= OVERVIEW VIEW ================= */
          <div className="overview-view">
            <section className="overview-hero">
              <p className="eyebrow">SAFAR FRONTEND ARCHITECTURE</p>
              <h1>
                Welcome to <span>SAFAR React.</span>
              </h1>
              <p className="hero-description">
                A modern React application built with Vite and seamlessly integrated into the
                existing SAFAR travel planning platform.
              </p>

              <div className="overview-cta-group">
                <button
                  type="button"
                  className="nav-button"
                  onClick={() => handleViewChange('dashboard')}
                >
                  Open Travel Dashboard ↗
                </button>

                <button
                  type="button"
                  className="filter active"
                  onClick={() => setClickCount((prev) => prev + 1)}
                >
                  ✨ React State Test ({clickCount})
                </button>
              </div>
            </section>

            <section className="planner-banner" style={{ margin: '30px 0' }}>
              <div>
                <p className="eyebrow">DEVELOPMENT COMMANDS</p>
                <h2>Running Locally</h2>
                <p>Run <code>npm run dev</code> inside <code>react-app/</code>. Opens at <code>http://localhost:5173/</code>.</p>
              </div>
              <a href="../index.html" className="banner-button">Visit Classic Site ↗</a>
            </section>
          </div>
        )}
      </main>

      {/* ================= SAFAR FOOTER ================= */}
      <footer className="footer">
        <a href="../index.html" className="logo">
          SAFAR<span>.</span>
        </a>
        <p>Less scrolling. More exploring.</p>
        <p>© 2026 SAFAR · Travel Dashboard Practical Demo.</p>
      </footer>
    </div>
  )
}

export default App
