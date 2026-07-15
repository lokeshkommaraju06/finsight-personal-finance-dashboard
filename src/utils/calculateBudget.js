// Reusable calculation helpers for the Budget Management module — kept
// out of components/context so the math isn't duplicated anywhere and is
// easy to reason about on its own (same pattern as calculateStats.js).

import { mapToBudgetCategory } from '../data/budgetCategories.js'

// Status thresholds, expressed as "percent of budget spent":
//   0–60%   -> green
//   60–90%  -> yellow
//   90%+    -> red (includes over 100%, i.e. exceeded)
export function getBudgetStatus(percentSpent) {
  if (percentSpent >= 90) return 'red'
  if (percentSpent >= 60) return 'yellow'
  return 'green'
}

// Total spent so far, for a single budget category, from real expense
// transactions — using TRANSACTION_TO_BUDGET_CATEGORY to bridge the two
// category lists.
export function calculateSpentForCategory(transactions, budgetCategory) {
  return transactions
    .filter((t) => t.type === 'Expense' && mapToBudgetCategory(t.category) === budgetCategory)
    .reduce((sum, t) => sum + Number(t.amount), 0)
}

// Builds the full, display-ready summary for every budget: amount spent,
// remaining, percent used, status color, and whether/by how much it's
// been exceeded. This is the single source both BudgetCard and the
// Dashboard's totals are built from.
export function calculateBudgetSummary(budgets, transactions) {
  return budgets.map((budget) => {
    const spent = calculateSpentForCategory(transactions, budget.category)
    const remaining = budget.amount - spent
    const percentSpent = budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0
    const exceeded = spent > budget.amount

    return {
      ...budget,
      spent,
      remaining,
      percentSpent,
      status: getBudgetStatus(percentSpent),
      exceeded,
      exceededBy: exceeded ? spent - budget.amount : 0,
    }
  })
}

// Total budgeted and total remaining across every category — used by the
// Dashboard's "Total Budget" / "Total Remaining Budget" cards. Remaining
// is clamped at 0 per category so an over-spent category doesn't pull
// down the overall remaining total below what's left elsewhere.
export function calculateBudgetTotals(budgetSummary) {
  const totalBudget = budgetSummary.reduce((sum, b) => sum + b.amount, 0)
  const totalRemaining = budgetSummary.reduce(
    (sum, b) => sum + Math.max(b.remaining, 0),
    0
  )

  return { totalBudget, totalRemaining }
}
