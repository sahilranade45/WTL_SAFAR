// App.jsx - the main component. It draws the navbar, the dashboard and the footer.
import Dashboard from './components/Dashboard'

// The SAFAR website is served by the FastAPI backend on port 8000.
const SITE_URL = 'http://localhost:8000'

// App is a React component: a function that returns JSX (HTML-like code).
function App() {
  return (
    <div>
      {/* Top navigation bar. These links go back to the main SAFAR website. */}
      <header className="navbar">
        <a href={SITE_URL} className="logo">SAFAR<span>.</span></a>
        <nav>
          <a href={SITE_URL}>Home</a>
          <a href={SITE_URL + '/explore.html'}>Explore</a>
          <a href={SITE_URL + '/planner.html'}>Plan a Trip</a>
        </nav>
      </header>

      <main>
        <Dashboard />
      </main>

      <footer>
        <p>© 2026 SAFAR · React dashboard (sample data)</p>
      </footer>
    </div>
  )
}

export default App
