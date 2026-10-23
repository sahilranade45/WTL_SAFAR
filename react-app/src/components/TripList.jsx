import React from 'react'
import TripCard from './TripCard'
import EmptyState from './EmptyState'

function TripList({
  trips,
  onRemoveTrip,
  activeFilter,
  onResetFilter,
  onRestoreTrips,
  totalTripsRemaining
}) {
  if (trips.length === 0) {
    return (
      <EmptyState
        activeFilter={activeFilter}
        onResetFilter={onResetFilter}
        onRestoreTrips={onRestoreTrips}
        totalTripsRemaining={totalTripsRemaining}
      />
    )
  }

  return (
    <div className="destination-grid" role="region" aria-label="Trip list">
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          onRemoveTrip={onRemoveTrip}
        />
      ))}
    </div>
  )
}

export default TripList
