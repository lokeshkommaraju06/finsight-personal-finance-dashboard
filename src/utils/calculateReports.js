import { mapToBudgetCategory } from '../data/budgetCategories.js'

// Filters transactions according to a selected period identifier or custom range
export function filterTransactionsByPeriod(transactions, period, customStart = '', customEnd = '') {
  if (!transactions || transactions.length === 0) return []
  if (period === 'all') return [...transactions]

  // Find reference date (most recent transaction date, or today if future)
  const timestamps = transactions.map((t) => new Date(t.date).getTime()).filter((t) => !isNaN(t))
  const latestDate = timestamps.length ? new Date(Math.max(...timestamps)) : new Date()

  if (period === 'custom') {
    return transactions.filter((t) => {
      const d = t.date
      if (customStart && d < customStart) return false
      if (customEnd && d > customEnd) return false
      return true
    })
  }

  if (period === 'this-month') {
    const year = latestDate.getFullYear()
    const month = latestDate.getMonth()
    return transactions.filter((t) => {
      const d = new Date(t.date)
      return d.getFullYear() === year && d.getMonth() === month
    })
  }

  if (period === 'last-month') {
    const d = new Date(latestDate.getFullYear(), latestDate.getMonth() - 1, 1)
    const targetYear = d.getFullYear()
    const targetMonth = d.getMonth()
    return transactions.filter((t) => {
      const itemDate = new Date(t.date)
      return itemDate.getFullYear() === targetYear && itemDate.getMonth() === targetMonth
    })
  }

  if (period === 'last-3-months') {
    const cutoff = new Date(latestDate)
    cutoff.setMonth(cutoff.getMonth() - 3)
    return transactions.filter((t) => new Date(t.date) >= cutoff && new Date(t.date) <= latestDate)
  }

  if (period === 'last-6-months') {
    const cutoff = new Date(latestDate)
    cutoff.setMonth(cutoff.getMonth() - 6)
    return transactions.filter((t) => new Date(t.date) >= cutoff && new Date(t.date) <= latestDate)
  }

  if (period === 'this-year') {
    const year = latestDate.getFullYear()
    return transactions.filter((t) => new Date(t.date).getFullYear() === year)
  }

  return transactions
}

// Calculate comprehensive overview metrics for the filtered transactions
export function calculateReportMetrics(filteredTransactions) {

  let totalIncome = 0
  let totalExpenses = 0
  let incomeCount = 0
  let expenseCount = 0
  let highestIncome = 0
  let highestExpense = 0

  for (const t of filteredTransactions) {
    const amt = Number(t.amount) || 0
    if (t.type === 'Income') {
      totalIncome += amt
      incomeCount += 1
      if (amt > highestIncome) highestIncome = amt
    } else if (t.type === 'Expense') {
      totalExpenses += amt
      expenseCount += 1
      if (amt > highestExpense) highestExpense = amt
    }
  }

  const netSavings = totalIncome - totalExpenses
  const savingsRate =
    totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0
  const avgExpense =
    expenseCount > 0 ? Math.round((totalExpenses / expenseCount) * 100) / 100 : 0
  const totalCount = filteredTransactions.length

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    incomeCount,
    expenseCount,
    totalCount,
    highestIncome,
    highestExpense,
    avgExpense,
  }
}

// Calculates monthly trends for bar / line chart
export function calculateMonthlyTrends(transactions) {
  if (!transactions.length) {
    return { labels: [], income: [], expenses: [], net: [] }
  }

  const monthlyMap = {}

  for (const t of transactions) {
    const d = new Date(t.date)
    if (isNaN(d.getTime())) continue
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const key = `${year}-${month}`

    if (!monthlyMap[key]) {
      const monthName = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      monthlyMap[key] = { label: monthName, income: 0, expenses: 0 }
    }

    const amt = Number(t.amount) || 0
    if (t.type === 'Income') {
      monthlyMap[key].income += amt
    } else if (t.type === 'Expense') {
      monthlyMap[key].expenses += amt
    }
  }

  const sortedKeys = Object.keys(monthlyMap).sort()
  const labels = sortedKeys.map((k) => monthlyMap[k].label)
  const income = sortedKeys.map((k) => monthlyMap[k].income)
  const expenses = sortedKeys.map((k) => monthlyMap[k].expenses)
  const net = sortedKeys.map((k) => monthlyMap[k].income - monthlyMap[k].expenses)

  return { labels, income, expenses, net }
}

// Detailed category breakdown for report table & doughnut chart
export function calculateCategoryReport(transactions, budgets = []) {
  const categoryTotals = {}
  const categoryCounts = {}

  transactions
    .filter((t) => t.type === 'Expense')
    .forEach((t) => {
      const cat = t.category || 'Other'
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(t.amount)
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
    })

  const totalExpense = Object.values(categoryTotals).reduce((a, b) => a + b, 0) || 1

  return Object.entries(categoryTotals)
    .map(([category, amount]) => {
      const count = categoryCounts[category] || 1
      const share = Math.round((amount / totalExpense) * 100)
      const avg = Math.round((amount / count) * 100) / 100

      // Match budget
      const budgetCategory = mapToBudgetCategory(category)
      const budget = budgets.find((b) => b.category === budgetCategory)
      const budgetAmount = budget ? budget.amount : null
      const remaining = budgetAmount !== null ? budgetAmount - amount : null
      const isOverBudget = remaining !== null && remaining < 0

      return {
        category,
        amount,
        count,
        share,
        average: avg,
        budgetAmount,
        remaining,
        isOverBudget,
      }
    })
    .sort((a, b) => b.amount - a.amount)
}

// Budget vs Actual for comparison chart
export function calculateBudgetVsActual(transactions, budgets = []) {
  if (!budgets.length) return []

  return budgets.map((b) => {
    const spent = transactions
      .filter((t) => t.type === 'Expense' && mapToBudgetCategory(t.category) === b.category)
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const remaining = b.amount - spent
    const percentSpent = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0
    const exceeded = spent > b.amount

    return {
      category: b.category,
      budget: b.amount,
      spent,
      remaining,
      percentSpent,
      exceeded,
      exceededBy: exceeded ? spent - b.amount : 0,
    }
  })
}

// Download helper utility for CSV or JSON files
function downloadBlob(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Export transactions as CSV file
export function exportTransactionsCSV(transactions, filename = 'finsight-transactions.csv') {
  if (!transactions || !transactions.length) return
  const headers = ['ID', 'Date', 'Title', 'Category', 'Type', 'Amount']
  const rows = transactions.map((t) => [
    t.id,
    t.date,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    `"${(t.category || '').replace(/"/g, '""')}"`,
    t.type,
    Number(t.amount).toFixed(2),
  ])

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;')
}

// Export budgets as CSV file
export function exportBudgetsCSV(budgets, filename = 'finsight-budgets.csv') {
  if (!budgets || !budgets.length) return
  const headers = ['ID', 'Category', 'Monthly Limit']
  const rows = budgets.map((b) => [
    b.id,
    `"${(b.category || '').replace(/"/g, '""')}"`,
    Number(b.amount).toFixed(2),
  ])

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;')
}

// Export summary report as CSV
export function exportReportSummaryCSV(metrics, categoryBreakdown, periodLabel = 'report') {
  const summaryRows = [
    ['FINSIGHT FINANCIAL REPORT', ''],
    ['Generated Date', new Date().toLocaleDateString()],
    ['Period', periodLabel],
    ['', ''],
    ['SUMMARY METRICS', ''],
    ['Total Income', Number(metrics.totalIncome).toFixed(2)],
    ['Total Expenses', Number(metrics.totalExpenses).toFixed(2)],
    ['Net Savings', Number(metrics.netSavings).toFixed(2)],
    ['Savings Rate (%)', `${metrics.savingsRate}%`],
    ['Total Transactions', metrics.totalCount],
    ['Income Entries', metrics.incomeCount],
    ['Expense Entries', metrics.expenseCount],
    ['Average Expense', Number(metrics.avgExpense).toFixed(2)],
    ['', ''],
    ['EXPENSES BY CATEGORY', '', '', ''],
    ['Category', 'Amount', 'Share (%)', 'Transaction Count', 'Avg Amount'],
    ...categoryBreakdown.map((c) => [
      `"${c.category}"`,
      Number(c.amount).toFixed(2),
      `${c.share}%`,
      c.count,
      Number(c.average).toFixed(2),
    ]),
  ]

  const csvContent = summaryRows.map((r) => r.join(',')).join('\r\n')
  downloadBlob(csvContent, `finsight-${periodLabel.toLowerCase().replace(/\s+/g, '-')}-report.csv`, 'text/csv;charset=utf-8;')
}

// Export complete application backup as JSON
export function exportFullBackupJSON(transactions, budgets, settings) {
  const backup = {
    appName: 'FinSight Dashboard',
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    transactions,
    budgets,
    settings,
  }
  const jsonContent = JSON.stringify(backup, null, 2)
  const dateStr = new Date().toISOString().split('T')[0]
  downloadBlob(jsonContent, `finsight-backup-${dateStr}.json`, 'application/json')
}
