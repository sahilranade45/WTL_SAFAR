// TripCard.jsx - shows ONE trip. The parent (Dashboard) gives it data through "props".

// props: trip = the trip object to show, onRemove = a function to call when "Remove" is clicked
function TripCard({ trip, onRemove }) {
  return (
    <article className="card">
      <div className="card-image">
        <img src={trip.image} alt={trip.destination} />
        {/* The tag shows the trip status, e.g. Upcoming */}
        <span className="card-tag">{trip.status}</span>
      </div>

      <div className="card-body">
        <h3>{trip.destination}</h3>
        <p>{trip.duration} · {trip.date}</p>
        <p>{trip.description}</p>
        <p className="budget">Budget: {trip.budget}</p>

        {/* onClick runs onRemove with this trip's id */}
        <button className="remove-btn" onClick={() => onRemove(trip.id)}>
          Remove trip
        </button>
      </div>
    </article>
  )
}

export default TripCard
