import React, { useState } from 'react'
import StatsOverview from './StatsOverview'
import CategoryFilter from './CategoryFilter'
import TripList from './TripList'
import { INITIAL_TRIPS } from '../data/sampleTrips'

function Dashboard() {
  // State for all trips
  const [trips, setTrips] = useState(INITIAL_TRIPS)
  // State for the active status filter
  const [activeFilter, setActiveFilter] = useState('All')

  // Calculate statistics directly from the trips state (Derived State)
  const stats = {
    total: trips.length,
    upcoming: trips.filter((t) => t.status === 'Upcoming').length,
    completed: trips.filter((t) => t.status === 'Completed').length,
    planning: trips.filter((t) => t.status === 'Planning').length
  }

  // Filter trips based on activeFilter category
  const filteredTrips =
    activeFilter === 'All'
      ? trips
      : trips.filter((t) => t.status === activeFilter)

  // Event handler to remove a trip by id
  const handleRemoveTrip = (tripId) => {
    setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId))
  }

  // Event handler to restore initial sample data
  const handleRestoreTrips = () => {
    setTrips(INITIAL_TRIPS)
    setActiveFilter('All')
  }

  return (
    <div className="dashboard-content">
      {/* ================= PAGE HERO / HEADING ================= */}
      <section className="dashboard-header">
        <p className="eyebrow">YOUR TRAVEL HEADQUARTERS</p>
        <h1 className="dashboard-title">
          My Travel <span>Dashboard.</span>
        </h1>
        <p className="dashboard-intro">
          Review your personal travel plans, monitor upcoming and completed itineraries,
          and organize your adventures across India in one central workspace.
        </p>

        {/* Demo banner matching SAFAR planner-banner */}
        <div className="planner-banner demo-banner">
          <div>
            <p className="eyebrow">WEB TECHNOLOGIES PRACTICAL</p>
            <h2>Interactive React State</h2>
            <p>
              Live demonstration of component props, <code>useState</code> hooks, dynamic filtering,
              and array immutability.
            </p>
          </div>
          <button
            type="button"
            className="banner-button"
            onClick={handleRestoreTrips}
            title="Reset trip list to initial sample data"
          >
            ↺ Reset Sample Data
          </button>
        </div>
      </section>

      {/* ================= TRAVEL STATISTICS ================= */}
      <section className="stats-section">
        <StatsOverview
          stats={stats}
          onSelectFilter={setActiveFilter}
          activeFilter={activeFilter}
        />
      </section>

      {/* ================= TRIPS & FILTER SECTION ================= */}
      <section className="trips-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SAVED ITINERARIES</p>
            <h2>Your <span>Adventures.</span></h2>
            <p>Filter your trips by status or manage active travel plans.</p>
          </div>
          <span className="result-count">
            Showing {filteredTrips.length} of {trips.length} trip{trips.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Filter Pills matching SAFAR .filters & .filter */}
        <CategoryFilter
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          counts={stats}
        />

        {/* Trips Grid or Empty State */}
        <TripList
          trips={filteredTrips}
          onRemoveTrip={handleRemoveTrip}
          activeFilter={activeFilter}
          onResetFilter={() => setActiveFilter('All')}
          onRestoreTrips={handleRestoreTrips}
          totalTripsRemaining={trips.length}
        />
      </section>
    </div>
  )
}

export default Dashboard
