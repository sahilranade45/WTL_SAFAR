import React from 'react'

function Navbar({ currentView, onViewChange }) {
  return (
    <header className="navbar">
      <a href="../index.html" className="logo">
        SAFAR<span>.</span>
      </a>

      <nav aria-label="Main Navigation">
        <a href="../index.html">Home</a>
        <a href="../explore.html">Explore</a>
        <a href="../planner.html">Plan a Trip</a>

        {/* React Application Views */}
        <button
          type="button"
          className={`nav-link-btn ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => onViewChange('dashboard')}
        >
          My Dashboard
        </button>

        <button
          type="button"
          className={`nav-link-btn ${currentView === 'welcome' ? 'active' : ''}`}
          onClick={() => onViewChange('welcome')}
        >
          Overview
        </button>
      </nav>

      <a href="../planner.html" className="nav-button">
        Start Planning ↗
      </a>
    </header>
  )
}

export default Navbar
