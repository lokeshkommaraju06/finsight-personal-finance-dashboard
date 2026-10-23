import { useMemo, useState } from 'react'
import {
  Download,
  Printer,
  Calendar,
  FileSpreadsheet,
} from 'lucide-react'

import Card from '../components/ui/Card.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import ExpenseCategoryChart from '../components/dashboard/ExpenseCategoryChart.jsx'
import MonthlyTrendsChart from '../components/reports/MonthlyTrendsChart.jsx'
import BudgetVsActualChart from '../components/reports/BudgetVsActualChart.jsx'
import CategoryBreakdownTable from '../components/reports/CategoryBreakdownTable.jsx'
import TopExpensesList from '../components/reports/TopExpensesList.jsx'
import FinancialInsightsCard from '../components/reports/FinancialInsightsCard.jsx'
import { useTransactions } from '../context/TransactionsContext.jsx'
import { useBudgets } from '../context/BudgetsContext.jsx'
import { formatCurrency } from '../utils/format.js'
import {
  filterTransactionsByPeriod,
  calculateReportMetrics,
  calculateMonthlyTrends,
  calculateCategoryReport,
  calculateBudgetVsActual,
  exportTransactionsCSV,
  exportReportSummaryCSV,
} from '../utils/calculateReports.js'

const PERIOD_OPTIONS = [
  { id: 'all', label: 'All Time' },
  { id: 'this-month', label: 'This Month' },
  { id: 'last-month', label: 'Last Month' },
  { id: 'last-3-months', label: 'Last 3 Months' },
  { id: 'this-year', label: 'This Year' },
  { id: 'custom', label: 'Custom Range' },
]

export default function Reports() {
  const { transactions } = useTransactions()
  const { budgets } = useBudgets()

  const [period, setPeriod] = useState('all')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  // Filtered transactions for the chosen period
  const filteredTransactions = useMemo(
    () => filterTransactionsByPeriod(transactions, period, customStart, customEnd),
    [transactions, period, customStart, customEnd]
  )

  // Derived metrics
  const metrics = useMemo(
    () => calculateReportMetrics(filteredTransactions, budgets),
    [filteredTransactions, budgets]
  )

  // Monthly trends for bar chart
  const trendsData = useMemo(
    () => calculateMonthlyTrends(filteredTransactions),
    [filteredTransactions]
  )

  // Category breakdown
  const categoryBreakdown = useMemo(
    () => calculateCategoryReport(filteredTransactions, budgets),
    [filteredTransactions, budgets]
  )

  // Category doughnut chart data
  const doughnutData = useMemo(
    () => categoryBreakdown.map((c) => ({ label: c.category, amount: c.amount })),
    [categoryBreakdown]
  )

  // Budget vs Actual
  const budgetVsActual = useMemo(
    () => calculateBudgetVsActual(filteredTransactions, budgets),
    [filteredTransactions, budgets]
  )

  // Active period label for display & export
  const activePeriodLabel = useMemo(() => {
    if (period === 'custom') {
      return customStart && customEnd
        ? `${customStart} to ${customEnd}`
        : 'Custom Range'
    }
    const found = PERIOD_OPTIONS.find((p) => p.id === period)
    return found ? found.label : 'Selected Period'
  }, [period, customStart, customEnd])

  // Overview stats cards
  const overviewStats = [
    {
      label: 'Total Period Income',
      value: formatCurrency(metrics.totalIncome),
      change: `${metrics.incomeCount} credits`,
      tone: 'emerald',
    },
    {
      label: 'Total Period Expenses',
      value: formatCurrency(metrics.totalExpenses),
      change: `${metrics.expenseCount} debits`,
      tone: 'rust',
    },
    {
      label: 'Net Savings / Cashflow',
      value: formatCurrency(metrics.netSavings),
      change: metrics.netSavings >= 0 ? 'Surplus' : 'Deficit',
      tone: metrics.netSavings >= 0 ? 'emerald' : 'rust',
    },
    {
      label: 'Savings Rate',
      value: `${metrics.savingsRate}%`,
      change: 'Of total income',
      tone: metrics.savingsRate >= 20 ? 'emerald' : 'neutral',
    },
    {
      label: 'Average Expense',
      value: formatCurrency(metrics.avgExpense),
      change: 'Per transaction',
      tone: 'neutral',
    },
  ]

  function handleExportSummaryCSV() {
    exportReportSummaryCSV(metrics, categoryBreakdown, activePeriodLabel)
  }

  function handleExportTransactionsCSV() {
    exportTransactionsCSV(filteredTransactions, `finsight-transactions-${period}.csv`)
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div className="reports-page">
      {/* Period Filter & Actions Toolbar */}
      <Card className="reports-toolbar">
        <div className="reports-toolbar-left">
          <span className="reports-toolbar-title">
            <Calendar size={18} strokeWidth={2} />
            Period Filter:
          </span>
          <div className="reports-period-pills">
            {PERIOD_OPTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`reports-period-pill ${
                  period === item.id ? 'reports-period-pill--active' : ''
                }`}
                onClick={() => setPeriod(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="reports-toolbar-actions">
          <button
            type="button"
            className="btn-secondary btn-small"
            onClick={handleExportSummaryCSV}
            title="Export Report Summary as CSV"
          >
            <Download size={15} strokeWidth={2} />
            Report CSV
          </button>
          <button
            type="button"
            className="btn-secondary btn-small"
            onClick={handleExportTransactionsCSV}
            title="Export filtered transactions as CSV"
          >
            <FileSpreadsheet size={15} strokeWidth={2} />
            Transactions CSV
          </button>
          <button
            type="button"
            className="btn-secondary btn-small"
            onClick={handlePrint}
            title="Print or save as PDF"
          >
            <Printer size={15} strokeWidth={2} />
            Print
          </button>
        </div>
      </Card>

      {/* Custom Date Pickers (if Custom is chosen) */}
      {period === 'custom' && (
        <Card className="reports-custom-dates-bar">
          <div className="form-field-inline">
            <label className="form-label" htmlFor="custom-start">From:</label>
            <input
              id="custom-start"
              type="date"
              className="form-input"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
            />
          </div>
          <div className="form-field-inline">
            <label className="form-label" htmlFor="custom-end">To:</label>
            <input
              id="custom-end"
              type="date"
              className="form-input"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
            />
          </div>
          <span className="reports-custom-note">
            Showing {filteredTransactions.length} transactions in selected range
          </span>
        </Card>
      )}

      {/* Summary KPI Cards */}
      <div className="reports-kpi-grid">
        {overviewStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Charts Grid: Monthly Trends + Category Doughnut */}
      <div className="charts-grid">
        <Card>
          <div className="category-card-header">
            <h2 className="category-card-title">Income & Expense Cash Flow Trend</h2>
            <span className="category-card-period">{activePeriodLabel}</span>
          </div>
          <MonthlyTrendsChart trendsData={trendsData} />
        </Card>

        <Card>
          <div className="category-card-header">
            <h2 className="category-card-title">Expense Breakdown by Category</h2>
            <span className="category-card-period">{activePeriodLabel}</span>
          </div>
          <ExpenseCategoryChart categoryBreakdown={doughnutData} />
        </Card>
      </div>

      {/* Budget vs Actual Comparison & Top Expenses */}
      <div className="charts-grid">
        <Card>
          <div className="category-card-header">
            <h2 className="category-card-title">Budget vs. Actual Spending</h2>
            <span className="category-card-period">{activePeriodLabel}</span>
          </div>
          <BudgetVsActualChart budgetVsActual={budgetVsActual} />
        </Card>

        <Card>
          <div className="category-card-header">
            <h2 className="category-card-title">Top Expense Items</h2>
            <span className="category-card-period">Ranked Highest</span>
          </div>
          <TopExpensesList transactions={filteredTransactions} limit={5} />
        </Card>
      </div>

      {/* Category Breakdown Detailed Table */}
      <Card>
        <div className="category-card-header" style={{ marginBottom: '1rem' }}>
          <h2 className="category-card-title">Spending Category Distribution</h2>
          <span className="category-card-period">
            {categoryBreakdown.length} Categories · {metrics.expenseCount} Transactions
          </span>
        </div>
        <CategoryBreakdownTable categoryBreakdown={categoryBreakdown} />
      </Card>

      {/* Financial Health & Insights */}
      <Card>
        <div className="category-card-header" style={{ marginBottom: '1rem' }}>
          <h2 className="category-card-title">Financial Health Insights & Analysis</h2>
          <span className="category-card-period">Automated Takeaways</span>
        </div>
        <FinancialInsightsCard
          metrics={metrics}
          categoryBreakdown={categoryBreakdown}
          budgetVsActual={budgetVsActual}
        />
      </Card>
    </div>
  )
}
