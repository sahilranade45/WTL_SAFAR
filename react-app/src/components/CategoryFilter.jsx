import React from 'react'

function CategoryFilter({ activeFilter, onSelectFilter, counts }) {
  const filterOptions = [
    { id: 'All', label: 'All Trips', count: counts.total },
    { id: 'Upcoming', label: 'Upcoming', count: counts.upcoming },
    { id: 'Completed', label: 'Completed', count: counts.completed },
    { id: 'Planning', label: 'In Planning', count: counts.planning }
  ]

  return (
    <div className="filters" role="tablist" aria-label="Trip status filters">
      {filterOptions.map((option) => {
        const isActive = activeFilter === option.id
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`filter ${isActive ? 'active' : ''}`}
            onClick={() => onSelectFilter(option.id)}
          >
            <span>{option.label}</span>
            <span className="filter-count">({option.count})</span>
          </button>
        )
      })}
    </div>
  )
}

export default CategoryFilter
