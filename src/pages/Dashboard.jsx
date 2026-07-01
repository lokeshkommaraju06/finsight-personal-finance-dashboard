import { Inbox } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import { useTransactions } from '../context/TransactionsContext.jsx'
import { formatCurrency } from '../utils/format.js'

export default function Dashboard() {
  const { transactions, stats, categoryBreakdown } = useTransactions()

  const incomeCount = transactions.filter((t) => t.type === 'Income').length
  const expenseCount = transactions.filter((t) => t.type === 'Expense').length
  const recentTransactions = transactions.slice(0, 4)

  // Built from live context state, so these update the moment a
  // transaction is added on the Transactions page.
  const summaryStats = [
    {
      label: 'Total Balance',
      value: formatCurrency(stats.totalBalance),
      change: `${transactions.length} transactions logged`,
      tone: 'neutral',
    },
    {
      label: 'Income',
      value: formatCurrency(stats.income),
      change: `${incomeCount} income entries`,
      tone: 'emerald',
    },
    {
      label: 'Expenses',
      value: formatCurrency(stats.expenses),
      change: `${expenseCount} expense entries`,
      tone: 'rust',
    },
    {
      label: 'Savings',
      value: formatCurrency(stats.savings),
      change: stats.savings >= 0 ? 'On track' : 'Overspending',
      tone: stats.savings >= 0 ? 'emerald' : 'rust',
    },
  ]

  return (
    <div className="dashboard">
      {/* Stat cards */}
      <div className="stat-grid">
        {summaryStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Spending by category */}
        <Card className="dashboard-grid-span2">
          <div className="category-card-header">
            <h2 className="category-card-title">Spending by category</h2>
            <span className="category-card-period">This month</span>
          </div>

          {categoryBreakdown.length === 0 ? (
            <p className="category-empty">No expenses recorded yet.</p>
          ) : (
            <div className="category-list">
              {categoryBreakdown.map((cat) => (
                <div key={cat.label}>
                  <div className="category-row-header">
                    <span className="category-row-label">{cat.label}</span>
                    <span className="nums category-row-amount">
                      {formatCurrency(cat.amount)}
                    </span>
                  </div>
                  <div className="category-bar-track">
                    <div
                      className="category-bar-fill"
                      style={{ width: `${cat.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent activity — now backed by real transaction state */}
        <Card className={recentTransactions.length ? 'recent-activity' : 'empty-state'}>
          {recentTransactions.length === 0 ? (
            <>
              <div className="empty-state-icon">
                <Inbox size={20} strokeWidth={1.75} />
              </div>
              <h3 className="empty-state-title">No recent activity yet</h3>
              <p className="empty-state-body">
                Transaction history will show up here once accounts are connected.
              </p>
            </>
          ) : (
            <>
              <h3 className="recent-activity-title">Recent activity</h3>
              <ul className="recent-activity-list">
                {recentTransactions.map((t) => (
                  <li key={t.id} className="recent-activity-item">
                    <div>
                      <p className="recent-activity-item-title">{t.title}</p>
                      <p className="recent-activity-item-meta">{t.category}</p>
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
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
