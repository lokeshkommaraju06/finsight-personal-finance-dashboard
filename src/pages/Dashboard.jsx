import Card from '../components/ui/Card.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import ExpenseCategoryChart from '../components/dashboard/ExpenseCategoryChart.jsx'
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart.jsx'
import RecentTransactionsCard from '../components/dashboard/RecentTransactionsCard.jsx'
import { useTransactions } from '../context/TransactionsContext.jsx'
import { useBudgets } from '../context/BudgetsContext.jsx'
import { formatCurrency } from '../utils/format.js'
import { getRecentTransactions } from '../utils/calculateStats.js'

export default function Dashboard() {
  const { transactions, stats, categoryBreakdown, quickStats } = useTransactions()
  const { budgetTotals } = useBudgets()

  const incomeCount = transactions.filter((t) => t.type === 'Income').length
  const expenseCount = transactions.filter((t) => t.type === 'Expense').length
  const recentTransactions = getRecentTransactions(transactions, 5)

  // Built from live context state (calculateDashboardStats), so these
  // update the moment a transaction is added, edited, or deleted.
  const summaryStats = [
    {
      label: 'Total Income',
      value: formatCurrency(stats.income),
      change: `${incomeCount} income entries`,
      tone: 'emerald',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(stats.expenses),
      change: `${expenseCount} expense entries`,
      tone: 'rust',
    },
    {
      label: 'Current Balance',
      value: formatCurrency(stats.balance),
      change: stats.balance >= 0 ? 'Positive' : 'Negative',
      tone: stats.balance >= 0 ? 'emerald' : 'rust',
    },
    {
      label: 'Total Transactions',
      value: String(stats.totalTransactions),
      change: 'All time',
      tone: 'neutral',
    },
  ]

  // Quick Statistics — highest expense, highest income, and average
  // transaction amount, all derived from calculateQuickStats(). Reuses
  // the same StatCard component as the summary row above.
  const quickStatCards = [
    {
      label: 'Highest Expense',
      value: formatCurrency(quickStats.highestExpense),
      change: 'Largest single expense',
      tone: 'rust',
    },
    {
      label: 'Highest Income',
      value: formatCurrency(quickStats.highestIncome),
      change: 'Largest single income',
      tone: 'emerald',
    },
    {
      label: 'Average Transaction',
      value: formatCurrency(quickStats.averageAmount),
      change: 'Across all transactions',
      tone: 'neutral',
    },
  ]

  // Total Budget / Total Remaining Budget — from BudgetsContext, so these
  // update automatically whenever a budget or transaction changes.
  const budgetStatCards = [
    {
      label: 'Total Budget',
      value: formatCurrency(budgetTotals.totalBudget),
      change: 'Across all categories',
      tone: 'neutral',
    },
    {
      label: 'Total Remaining Budget',
      value: formatCurrency(budgetTotals.totalRemaining),
      change: budgetTotals.totalRemaining >= 0 ? 'On track' : 'Over budget',
      tone: budgetTotals.totalRemaining >= 0 ? 'emerald' : 'rust',
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

      {/* Quick Statistics */}
      <div className="quick-stats-grid">
        {quickStatCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Budget totals */}
      <div className="budget-stats-grid">
        {budgetStatCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Charts: Expense by Category (doughnut) + Income vs Expense (bar) */}
      <div className="charts-grid">
        <Card>
          <div className="category-card-header">
            <h2 className="category-card-title">Expense by category</h2>
            <span className="category-card-period">This month</span>
          </div>
          <ExpenseCategoryChart categoryBreakdown={categoryBreakdown} />
        </Card>

        <Card>
          <div className="category-card-header">
            <h2 className="category-card-title">Income vs expense</h2>
            <span className="category-card-period">This month</span>
          </div>
          <IncomeExpenseChart stats={stats} />
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <RecentTransactionsCard transactions={recentTransactions} />
      </Card>
    </div>
  )
}
