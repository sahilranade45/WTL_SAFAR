import React from 'react'

function StatsOverview({ stats, onSelectFilter, activeFilter }) {
  const statItems = [
    {
      id: 'All',
      label: 'Total Trips',
      value: stats.total,
      icon: '🌍',
      badge: 'All Journeys'
    },
    {
      id: 'Upcoming',
      label: 'Upcoming Trips',
      value: stats.upcoming,
      icon: '✈️',
      badge: 'Scheduled'
    },
    {
      id: 'Completed',
      label: 'Completed Trips',
      value: stats.completed,
      icon: '🏆',
      badge: 'Finished'
    },
    {
      id: 'Planning',
      label: 'In Planning',
      value: stats.planning,
      icon: '🧭',
      badge: 'Drafts'
    }
  ]

  return (
    <div className="stats-grid" aria-label="Travel Statistics">
      {statItems.map((item) => {
        const isSelected = activeFilter === item.id
        return (
          <div
            key={item.id}
            className={`stat-card ${isSelected ? 'active-stat' : ''}`}
            onClick={() => onSelectFilter(item.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectFilter(item.id)
              }
            }}
            title={`Filter trips by ${item.label}`}
          >
            <div className="stat-card-header">
              <span className="stat-icon-wrap">{item.icon}</span>
              <span className="stat-badge">{item.badge}</span>
            </div>

            <div className="stat-value">{item.value}</div>
            <div className="stat-label">{item.label}</div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsOverview
