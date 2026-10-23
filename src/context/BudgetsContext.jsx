import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useTransactions } from './TransactionsContext.jsx'
import { getStoredBudgets, setStoredBudgets } from '../utils/storage.js'
import { calculateBudgetSummary, calculateBudgetTotals } from '../utils/calculateBudget.js'
import { sampleBudgets } from '../data/budgetCategories.js'

const BudgetsContext = createContext(null)

export function BudgetsProvider({ children }) {
  // Needs the live transaction list to know how much has been spent per
  // category, so this provider must sit inside <TransactionsProvider>.
  const { transactions } = useTransactions()

  // Lazy initializer: start from whatever's already in localStorage, or
  // sample budgets on a first-ever visit so budgets and reports work right away.
  const [budgets, setBudgets] = useState(() => {
    const stored = getStoredBudgets()
    return stored ?? sampleBudgets
  })

  // Persist to localStorage any time the budget list changes.
  useEffect(() => {
    setStoredBudgets(budgets)
  }, [budgets])

  function addBudget(budget) {
    const newBudget = {
      ...budget,
      id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    }
    setBudgets((prev) => [...prev, newBudget])
  }

  function updateBudget(id, updatedFields) {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b))
    )
  }

  function deleteBudget(id) {
    setBudgets((prev) => prev.filter((b) => b.id !== id))
  }

  function resetBudgets() {
    setBudgets(sampleBudgets)
  }

  function clearBudgets() {
    setBudgets([])
  }

  function importBudgets(newBudgets) {
    if (Array.isArray(newBudgets)) {
      setBudgets(newBudgets)
    }
  }

  // Recomputes automatically whenever budgets or transactions change —
  // this is how budget cards and the Dashboard totals stay in sync.
  const budgetSummary = useMemo(
    () => calculateBudgetSummary(budgets, transactions),
    [budgets, transactions]
  )

  const budgetTotals = useMemo(
    () => calculateBudgetTotals(budgetSummary),
    [budgetSummary]
  )

  const value = {
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    resetBudgets,
    clearBudgets,
    importBudgets,
    budgetSummary,
    budgetTotals,
  }


  return (
    <BudgetsContext.Provider value={value}>{children}</BudgetsContext.Provider>
  )
}

// Small hook so components can just call useBudgets() instead of
// importing useContext + BudgetsContext everywhere.
export function useBudgets() {
  const context = useContext(BudgetsContext)
  if (!context) {
    throw new Error('useBudgets must be used inside a <BudgetsProvider>')
  }
  return context
}
