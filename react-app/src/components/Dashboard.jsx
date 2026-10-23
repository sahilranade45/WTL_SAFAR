// Dashboard.jsx - lists the trips, with filter buttons, counts, remove and reset.
import { useState, useEffect } from 'react'
import TripCard from './TripCard'
import { INITIAL_TRIPS } from '../data/sampleTrips'

// The filter buttons. "All" shows every trip; the others match a trip's status.
const FILTERS = ['All', 'Upcoming', 'Completed', 'Planning']

function Dashboard() {
  // STATE: React remembers these values and redraws the page when they change.
  const [trips, setTrips] = useState(INITIAL_TRIPS)      // the list of trips
  const [activeFilter, setActiveFilter] = useState('All') // which filter is selected

  // EFFECT: runs after the page is drawn, and again whenever "trips" changes.
  // Here it puts the number of trips in the browser tab title.
  useEffect(() => {
    document.title = `SAFAR Dashboard (${trips.length} trips)`
  }, [trips])

  // Keep only the trips that match the selected filter.
  const visibleTrips =
    activeFilter === 'All'
      ? trips
      : trips.filter((trip) => trip.status === activeFilter)

  // How many trips have a given status (used for the number in each button).
  function countFor(filter) {
    if (filter === 'All') return trips.length
    return trips.filter((trip) => trip.status === filter).length
  }

  // Remove one trip: keep every trip EXCEPT the one with this id.
  function handleRemoveTrip(tripId) {
    setTrips(trips.filter((trip) => trip.id !== tripId))
  }

  // Put the four sample trips back.
  function handleRestoreTrips() {
    setTrips(INITIAL_TRIPS)
    setActiveFilter('All')
  }

  return (
    <div className="dashboard">
      <h1>My Travel Dashboard</h1>

      {/* Clear label: this data is not real */}
      <p className="sample-note">
        Sample data: these trips are examples for the React practical,
        not trips from the planner.
      </p>

      {/* One button per filter. The "active" class highlights the selected one. */}
      <div className="filters">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            className={filter === activeFilter ? 'filter active' : 'filter'}
            onClick={() => setActiveFilter(filter)}
          >
            {filter} ({countFor(filter)})
          </button>
        ))}
      </div>

      {/* CONDITIONAL RENDERING: show the cards, or a message when there are none */}
      {visibleTrips.length > 0 ? (
        <div className="card-grid">
          {visibleTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onRemove={handleRemoveTrip} />
          ))}
        </div>
      ) : (
        <div className="empty-message">
          <p>No trips to show.</p>
          <button className="filter" onClick={handleRestoreTrips}>
            Restore sample trips
          </button>
        </div>
      )}
    </div>
  )
}

export default Dashboard
