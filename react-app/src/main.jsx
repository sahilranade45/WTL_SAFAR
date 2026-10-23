// main.jsx - the starting point of the React app.
// It finds <div id="root"> in index.html and draws the <App /> component inside it.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
