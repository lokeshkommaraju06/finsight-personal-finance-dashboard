import { Pencil, Trash2, TriangleAlert } from 'lucide-react'
import { formatCurrency } from '../../utils/format.js'

// One card per budgeted category. All the numbers (spent, remaining,
// percent, status, exceeded) come pre-calculated from calculateBudgetSummary
// via the `budget` prop, so this component only handles display.
export default function BudgetCard({ budget, onEdit, onDelete }) {
  const { category, amount, spent, remaining, percentSpent, status, exceeded, exceededBy } =
    budget

  const barWidth = Math.min(percentSpent, 100)

  return (
    <div className="card budget-card">
      <div className="budget-card-header">
        <h3 className="budget-card-category">{category}</h3>
        <div className="table-actions">
          <button
            className="table-action-btn"
            onClick={() => onEdit(budget)}
            aria-label={`Edit ${category} budget`}
          >
            <Pencil size={15} strokeWidth={1.75} />
          </button>
          <button
            className="table-action-btn table-action-btn--danger"
            onClick={() => onDelete(budget)}
            aria-label={`Delete ${category} budget`}
          >
            <Trash2 size={15} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="budget-card-figures">
        <div>
          <p className="budget-card-figure-label">Budget</p>
          <p className="nums budget-card-figure-value">{formatCurrency(amount)}</p>
        </div>
        <div>
          <p className="budget-card-figure-label">Spent</p>
          <p className="nums budget-card-figure-value">{formatCurrency(spent)}</p>
        </div>
        <div>
          <p className="budget-card-figure-label">Remaining</p>
          <p
            className={`nums budget-card-figure-value ${
              remaining < 0 ? 'amount-negative' : ''
            }`}
          >
            {formatCurrency(remaining)}
          </p>
        </div>
      </div>

      <div className="budget-bar-track">
        <div
          className={`budget-bar-fill budget-bar-fill--${status}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
      <p className="budget-card-percent">{percentSpent}% used</p>

      {exceeded && (
        <p className="budget-exceeded">
          <TriangleAlert size={14} strokeWidth={2} />
          Budget Exceeded by {formatCurrency(exceededBy)}
        </p>
      )}
    </div>
  )
}
