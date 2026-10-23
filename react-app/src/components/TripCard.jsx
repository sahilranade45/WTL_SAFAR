import React from 'react'

function TripCard({ trip, onRemoveTrip }) {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'status-upcoming'
      case 'Completed':
        return 'status-completed'
      case 'Planning':
        return 'status-planning'
      default:
        return 'status-default'
    }
  }

  return (
    <article className="destination-card trip-card" aria-label={`Trip to ${trip.destination}`}>
      <div className="card-image">
        <img
          src={trip.image}
          alt={trip.destination}
          loading="lazy"
        />
        <span className={`status-tag ${getStatusClass(trip.status)}`}>
          ● {trip.status}
        </span>
        <span className="card-tag">{trip.category}</span>
      </div>

      <div className="card-body">
        <p className="card-location">{trip.state}</p>
        <h3 className="card-title">{trip.destination}</h3>

        <div className="trip-meta-row">
          <span className="trip-duration">⏱️ {trip.duration}</span>
          <span className="trip-dates">📅 {trip.date}</span>
        </div>

        <p className="card-description">{trip.description}</p>

        <div className="trip-specs">
          <div className="spec-item">
            <span className="spec-label">Est. Budget</span>
            <span className="spec-value">{trip.budget}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Travelers</span>
            <span className="spec-value">{trip.travelers}</span>
          </div>
        </div>

        <div className="card-footer">
          <span className="card-footer-info">
            Trip ID: <strong>{trip.id}</strong>
          </span>

          <button
            type="button"
            className="remove-btn"
            onClick={() => onRemoveTrip(trip.id)}
            title={`Remove ${trip.destination} from dashboard`}
          >
            Remove Trip
          </button>
        </div>
      </div>
    </article>
  )
}

export default TripCard
