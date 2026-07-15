import { Inbox } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency, formatDate } from '../../utils/format.js'

// Shows the latest `transactions` (already limited to 5 by the caller via
// getRecentTransactions) with a "View All" button that hands off to the
// full Transactions page.
export default function RecentTransactionsCard({ transactions }) {
  const navigate = useNavigate()

  return (
    <div className="recent-transactions">
      <div className="recent-transactions-header">
        <h3 className="recent-transactions-title">Recent transactions</h3>
        <button
          type="button"
          className="btn-secondary btn-small"
          onClick={() => navigate('/transactions')}
        >
          View All
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Inbox size={20} strokeWidth={1.75} />
          </div>
          <h3 className="empty-state-title">No recent activity yet</h3>
          <p className="empty-state-body">
            Transaction history will show up here once you add your first transaction.
          </p>
        </div>
      ) : (
        <ul className="recent-transactions-list">
          {transactions.map((t) => (
            <li key={t.id} className="recent-transactions-item">
              <div className="recent-transactions-item-main">
                <p className="recent-transactions-item-title">{t.title}</p>
                <p className="recent-transactions-item-meta">
                  {t.category} · {formatDate(t.date)}
                </p>
              </div>
              <span
                className={`nums recent-activity-amount ${
                  t.type === 'Income' ? 'amount-positive' : 'amount-negative'
                }`}
              >
                {t.type === 'Income' ? '+' : '-'}
                {formatCurrency(t.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
