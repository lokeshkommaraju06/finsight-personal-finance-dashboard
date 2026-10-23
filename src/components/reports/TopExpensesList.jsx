import { formatCurrency, formatDate } from '../../utils/format.js'
import Badge from '../ui/Badge.jsx'

export default function TopExpensesList({ transactions, limit = 5 }) {
  const topExpenses = [...transactions]
    .filter((t) => t.type === 'Expense')
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .slice(0, limit)

  if (topExpenses.length === 0) {
    return (
      <div className="table-empty">
        <p>No expense transactions to display.</p>
      </div>
    )
  }

  return (
    <ul className="recent-transactions-list">
      {topExpenses.map((t, idx) => (
        <li key={t.id} className="recent-transactions-item">
          <div className="report-rank-badge nums">#{idx + 1}</div>
          <div className="recent-transactions-item-main" style={{ flex: 1, paddingLeft: '0.5rem' }}>
            <p className="recent-transactions-item-title">{t.title}</p>
            <p className="recent-transactions-item-meta">
              {formatDate(t.date)} · <Badge tone="rust">{t.category}</Badge>
            </p>
          </div>
          <span className="nums recent-activity-amount amount-negative">
            -{formatCurrency(t.amount)}
          </span>
        </li>
      ))}
    </ul>
  )
}
