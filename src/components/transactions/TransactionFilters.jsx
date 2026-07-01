import { Search } from 'lucide-react'

const TYPE_OPTIONS = ['All', 'Income', 'Expense']

export default function TransactionFilters({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
}) {
  return (
    <div className="transaction-filters">
      <label className="transaction-search">
        <Search size={16} className="transaction-search-icon" />
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="transaction-search-input"
        />
      </label>

      <select
        value={typeFilter}
        onChange={(e) => onTypeFilterChange(e.target.value)}
        className="transaction-type-select"
        aria-label="Filter by type"
      >
        {TYPE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
