import React from 'react'

function EmptyState({ activeFilter, onResetFilter, onRestoreTrips, totalTripsRemaining }) {
  const isCompletelyEmpty = totalTripsRemaining === 0

  return (
    <div className="empty-state">
      <div className="empty-icon">{isCompletelyEmpty ? '🎒' : '🔍'}</div>
      <h3>
        {isCompletelyEmpty
          ? 'No trips left in your dashboard'
          : `No trips found in "${activeFilter}"`}
      </h3>
      <p>
        {isCompletelyEmpty
          ? 'You have removed all travel plans. You can restore the sample itineraries at any time.'
          : `There are currently no travel plans matching the "${activeFilter}" filter.`}
      </p>

      <div className="empty-state-buttons">
        {!isCompletelyEmpty && (
          <button
            type="button"
            className="filter-reset-btn"
            onClick={onResetFilter}
          >
            Show All Trips
          </button>
        )}

        <button
          type="button"
          className="restore-trips-btn"
          onClick={onRestoreTrips}
        >
          ↺ Restore Sample Trips
        </button>
      </div>
    </div>
  )
}

export default EmptyState
