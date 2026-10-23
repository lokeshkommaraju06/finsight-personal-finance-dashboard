import { formatCurrency } from '../../utils/format.js'
import Badge from '../ui/Badge.jsx'

export default function CategoryBreakdownTable({ categoryBreakdown }) {
  if (!categoryBreakdown || categoryBreakdown.length === 0) {
    return (
      <div className="table-empty">
        <p>No expense transactions recorded in this period.</p>
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Transactions</th>
            <th className="amount-col">Total Spent</th>
            <th>Share</th>
            <th className="amount-col">Avg / Transaction</th>
            <th>Budget Status</th>
          </tr>
        </thead>
        <tbody>
          {categoryBreakdown.map((item) => (
            <tr key={item.category}>
              <td style={{ fontWeight: 500 }}>{item.category}</td>
              <td className="nums">{item.count} entries</td>
              <td className="nums amount-col amount-negative">
                {formatCurrency(item.amount)}
              </td>
              <td>
                <div className="report-share-cell">
                  <span className="nums">{item.share}%</span>
                  <div className="report-share-bar-track">
                    <div
                      className="report-share-bar-fill"
                      style={{ width: `${Math.min(item.share, 100)}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="nums amount-col">
                {formatCurrency(item.average)}
              </td>
              <td>
                {item.budgetAmount === null ? (
                  <span className="report-budget-none">No budget</span>
                ) : item.isOverBudget ? (
                  <Badge tone="rust">
                    Over by {formatCurrency(Math.abs(item.remaining))}
                  </Badge>
                ) : (
                  <Badge tone="emerald">
                    {formatCurrency(item.remaining)} left
                  </Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
