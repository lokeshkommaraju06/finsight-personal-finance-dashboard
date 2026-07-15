// Reusable calculation helpers — kept out of components/context so the
// same math isn't duplicated anywhere else and is easy to test on its own.

// Total income, total expenses, current balance, and transaction count.
// Everything is derived from the transactions array — nothing hardcoded.
export function calculateDashboardStats(transactions) {
  const income = transactions
    .filter((t) => t.type === 'Income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const expenses = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  return {
    income,
    expenses,
    balance: income - expenses,
    totalTransactions: transactions.length,
  }
}

// Expense totals grouped by category, with each category's share (%) of
// total spending. Used for the "Spending by category" breakdown.
export function calculateCategoryBreakdown(transactions) {
  const totals = {}

  transactions
    .filter((t) => t.type === 'Expense')
    .forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + Number(t.amount)
    })

  const totalExpenses = Object.values(totals).reduce((sum, n) => sum + n, 0) || 1

  return Object.entries(totals)
    .map(([label, amount]) => ({
      label,
      amount,
      share: Math.round((amount / totalExpenses) * 100),
    }))
    .sort((a, b) => b.amount - a.amount)
}

// Highest expense, highest income, and average transaction amount —
// powers the "Quick Statistics" cards on the Dashboard. Everything is
// derived from the transactions array, so it stays in sync automatically.
export function calculateQuickStats(transactions) {
  const expenseAmounts = transactions
    .filter((t) => t.type === 'Expense')
    .map((t) => Number(t.amount))

  const incomeAmounts = transactions
    .filter((t) => t.type === 'Income')
    .map((t) => Number(t.amount))

  const allAmounts = transactions.map((t) => Number(t.amount))

  return {
    highestExpense: expenseAmounts.length ? Math.max(...expenseAmounts) : 0,
    highestIncome: incomeAmounts.length ? Math.max(...incomeAmounts) : 0,
    averageAmount: allAmounts.length
      ? allAmounts.reduce((sum, n) => sum + n, 0) / allAmounts.length
      : 0,
  }
}

// The latest N transactions, newest first by date — used by the "Recent
// Transactions" card. Sorts by date rather than relying on array order,
// so it stays correct even after a transaction is edited.
export function getRecentTransactions(transactions, limit = 5) {
  return [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit)
}
